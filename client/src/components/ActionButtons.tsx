import { Button } from '@/components/ui/button'
import { X, Heart } from 'lucide-react'

interface ActionButtonsProps {
  onLeftAction: () => void
  onRightAction: () => void
  disabled?: boolean
}

export default function ActionButtons({ onLeftAction, onRightAction, disabled = false }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-8 mt-8">
      {/* Left Action Button - Not for me */}
      <Button
        size="icon"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
        onClick={onLeftAction}
        disabled={disabled}
        data-testid="button-swipe-left"
      >
        <X className="w-8 h-8" />
      </Button>
      
      {/* Right Action Button - Resonates */}
      <Button
        size="icon"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200 disabled:opacity-50"
        onClick={onRightAction}
        disabled={disabled}
        data-testid="button-swipe-right"
      >
        <Heart className="w-8 h-8" />
      </Button>
    </div>
  )
}