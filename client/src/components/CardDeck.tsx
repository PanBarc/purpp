import { useState, useMemo, useEffect } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PurposeCard, { PurposeCardData } from './PurposeCard'
import ActionButtons from './ActionButtons'
import ProgressIndicator from './ProgressIndicator'
import ResultsModal from '@/components/ResultsModal'
import { apiRequest } from '@/lib/queryClient'

// Import purpose card images - fallback for offline mode
import familyImage from '@assets/generated_images/Family_purpose_card_image_6846aeb5.png'
import adventureImage from '@assets/generated_images/Adventure_purpose_card_image_97206d4a.png'
import wealthImage from '@assets/generated_images/Wealth_purpose_card_image_b1579e59.png'
import growthImage from '@assets/generated_images/Growth_purpose_card_image_308e20b7.png'
import serviceImage from '@assets/generated_images/Service_purpose_card_image_20abfd0a.png'
import creativityImage from '@assets/generated_images/Creativity_purpose_card_image_6e18aa6e.png'

const imageMap: Record<string, string> = {
  'family': familyImage,
  'adventure': adventureImage,
  'wealth': wealthImage,
  'growth': growthImage,
  'service': serviceImage,
  'creativity': creativityImage,
}

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export default function CardDeck() {
  const queryClient = useQueryClient()
  const [gone] = useState(() => new Set<number>())
  const [swipeResults, setSwipeResults] = useState<Record<string, number>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Get session identifier from localStorage or create new one
  const getSessionIdentifier = () => {
    let sessionId = localStorage.getItem('purpose-session-id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('purpose-session-id', sessionId)
    }
    return sessionId
  }

  // Fetch purpose cards from API
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['/api/cards'],
    select: (data: any[]) => data.map(card => ({
      ...card,
      image: imageMap[card.id] || card.image // Use local images as fallback
    })) as PurposeCardData[]
  })

  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }))

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('POST', '/api/sessions', { sessionData })
      return response.json()
    },
    onSuccess: (session) => {
      setCurrentSessionId(session.id)
    },
    onError: (error) => {
      console.error('Failed to create session:', error)
      // Fallback: continue without session tracking
    }
  })

  // Record swipe mutation
  const recordSwipeMutation = useMutation({
    mutationFn: async ({ sessionId, cardId, direction }: { sessionId: string, cardId: string, direction: 'left' | 'right' }) => {
      const response = await apiRequest('POST', '/api/swipes', { sessionId, cardId, direction })
      return response.json()
    },
    onError: (error) => {
      console.error('Failed to record swipe:', error)
      // Continue with local tracking as fallback
    }
  })

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('PATCH', `/api/sessions/${sessionId}/complete`)
      return response.json()
    },
    onSuccess: async () => {
      if (currentSessionId) {
        try {
          const response = await apiRequest('GET', `/api/sessions/${currentSessionId}/results`)
          const results = await response.json()
          setSwipeResults(results)
        } catch (error) {
          console.error('Failed to fetch results:', error)
          // Use local results as fallback
        }
        setShowResults(true)
      }
    },
    onError: (error) => {
      console.error('Failed to complete session:', error)
      // Still show results with local data
      setShowResults(true)
    }
  })

  // Initialize session on component mount
  useEffect(() => {
    if (!currentSessionId) {
      const sessionIdentifier = getSessionIdentifier()
      createSessionMutation.mutate({ userSession: sessionIdentifier })
    }
  }, [currentSessionId])

  // Update springs when cards data changes
  useEffect(() => {
    if (cards.length > 0) {
      api.start(i => ({
        ...to(i),
        from: from(i),
      }))
    }
  }, [cards, api])

  const bind = useDrag(
    ({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2
      const isGone = trigger && !active
      const dir = xDir < 0 ? -1 : 1
      const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0
      const rot = mx / 100 + (isGone ? dir * 10 * vx : 0)
      const scale = active ? 1.1 : 1

      api.start(i => {
        if (index !== i) return
        const isLeaving = isGone && i === index
        
        if (isLeaving) {
          gone.add(index)
          const card = cards[index]
          const isRightSwipe = dir === 1
          
          // Record swipe in database
          if (currentSessionId) {
            recordSwipeMutation.mutate({
              sessionId: currentSessionId,
              cardId: card.id,
              direction: isRightSwipe ? 'right' : 'left'
            })
          }
          
          // Track swipe results locally for immediate feedback
          if (isRightSwipe) {
            setSwipeResults(prev => ({
              ...prev,
              [card.category]: (prev[card.category] || 0) + 1
            }))
          }
          
          // Move to next card
          const nextIndex = currentIndex + 1
          if (nextIndex >= cards.length) {
            // Complete session and show results
            if (currentSessionId) {
              completeSessionMutation.mutate(currentSessionId)
            } else {
              setShowResults(true)
            }
          } else {
            setCurrentIndex(nextIndex)
          }
        }

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        }
      })

      if (!active && gone.size === cards.length) {
        setTimeout(() => {
          gone.clear()
          api.start(i => to(i))
        }, 600)
      }
    },
    {
      axis: 'x',
      bounds: { left: -300, right: 300, top: 0, bottom: 0 },
      rubberband: true,
    }
  )

  const handleButtonAction = (isRight: boolean) => {
    if (currentIndex >= cards.length) return
    
    const card = cards[currentIndex]
    const dir = isRight ? 1 : -1
    
    // Record swipe in database
    if (currentSessionId) {
      recordSwipeMutation.mutate({
        sessionId: currentSessionId,
        cardId: card.id,
        direction: isRight ? 'right' : 'left'
      })
    }
    
    if (isRight) {
      setSwipeResults(prev => ({
        ...prev,
        [card.category]: (prev[card.category] || 0) + 1
      }))
    }
    
    gone.add(currentIndex)
    
    api.start(i => {
      if (i !== currentIndex) return
      return {
        x: (200 + window.innerWidth) * dir,
        rot: dir * 10,
        scale: 1,
        delay: undefined,
        config: { friction: 50, tension: 200 },
      }
    })
    
    const nextIndex = currentIndex + 1
    if (nextIndex >= cards.length) {
      // Complete session and show results
      if (currentSessionId) {
        setTimeout(() => completeSessionMutation.mutate(currentSessionId), 300)
      } else {
        setTimeout(() => setShowResults(true), 300)
      }
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  const resetDeck = () => {
    gone.clear()
    setSwipeResults({})
    setCurrentIndex(0)
    setShowResults(false)
    setCurrentSessionId(null)
    // Create new session
    const sessionIdentifier = getSessionIdentifier()
    createSessionMutation.mutate({ userSession: sessionIdentifier })
    api.start(i => to(i))
  }

  const topResults = useMemo(() => {
    return Object.entries(swipeResults)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  }, [swipeResults])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading purpose cards...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8" data-testid="card-deck-container">
      {!showResults && (
        <>
          <ProgressIndicator current={currentIndex} total={cards.length} />
          
          <div className="relative flex items-center justify-center w-80 h-[500px] mb-8">
            {props.map(({ x, y, rot, scale }, i) => (
              cards[i] && (
                <animated.div
                  key={cards[i].id}
                  style={{
                    transform: x.to(x => `translate3d(${x}px,${y.get()}px,0)`),
                  }}
                  className="absolute will-change-transform"
                >
                  <animated.div
                    {...bind(i)}
                    style={{
                      transform: rot.to(r => trans(r, scale.get())),
                    }}
                  >
                    <PurposeCard card={cards[i]} />
                  </animated.div>
                </animated.div>
              )
            ))}
          </div>
          
          <ActionButtons
            onLeftAction={() => handleButtonAction(false)}
            onRightAction={() => handleButtonAction(true)}
            disabled={currentIndex >= cards.length || recordSwipeMutation.isPending}
          />
        </>
      )}

      <ResultsModal
        isOpen={showResults}
        results={topResults}
        totalSwipes={Object.values(swipeResults).reduce((sum, count) => sum + count, 0)}
        onClose={() => setShowResults(false)}
        onPlayAgain={resetDeck}
      />
    </div>
  )
}