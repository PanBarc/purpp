import { useState } from 'react'
import ResultsModal from '../ResultsModal'
import { Button } from '@/components/ui/button'

export default function ResultsModalExample() {
  const [isOpen, setIsOpen] = useState(false)
  
  const mockResults: [string, number][] = [
    ['Relationships', 3],
    ['Development', 2],
    ['Experience', 1]
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4">
        <Button onClick={() => setIsOpen(true)}>
          Show Results Modal
        </Button>
        
        <ResultsModal
          isOpen={isOpen}
          results={mockResults}
          totalSwipes={6}
          onClose={() => setIsOpen(false)}
          onPlayAgain={() => {
            console.log('Play again triggered')
            setIsOpen(false)
          }}
        />
      </div>
    </div>
  )
}