import { forwardRef } from 'react'
import { Card } from '@/components/ui/card'

export interface PurposeCardData {
  id: string
  title: string
  description: string
  image: string
  category: string
}

interface PurposeCardProps {
  card: PurposeCardData
  style?: React.CSSProperties
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const PurposeCard = forwardRef<HTMLDivElement, PurposeCardProps>(
  ({ card, style, className = '', onSwipeLeft, onSwipeRight }, ref) => {
    return (
      <Card
        ref={ref}
        style={style}
        className={`absolute w-80 h-[500px] cursor-grab active:cursor-grabbing select-none overflow-hidden ${className}`}
        data-testid={`card-purpose-${card.id}`}
      >
        <div className="relative h-full">
          {/* Card Image */}
          <div className="h-60 overflow-hidden">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
              data-testid={`img-card-${card.id}`}
              draggable={false}
            />
          </div>
          
          {/* Card Content */}
          <div className="p-6 h-60 flex flex-col justify-between">
            <div>
              <h2 
                className="text-2xl font-bold text-foreground mb-3"
                data-testid={`text-title-${card.id}`}
              >
                {card.title}
              </h2>
              <p 
                className="text-muted-foreground text-base leading-relaxed"
                data-testid={`text-description-${card.id}`}
              >
                {card.description}
              </p>
            </div>
            
            {/* Category Badge */}
            <div className="flex justify-start">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground"
                data-testid={`badge-category-${card.id}`}
              >
                {card.category}
              </span>
            </div>
          </div>
          
          {/* Swipe Indicators (hidden by default, shown with animation) */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-200" id="swipe-left-indicator">
            <div className="bg-red-500 text-white p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-200" id="swipe-right-indicator">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    )
  }
)

PurposeCard.displayName = 'PurposeCard'

export default PurposeCard