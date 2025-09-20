import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, RotateCcw, Heart } from 'lucide-react'

interface ResultsModalProps {
  isOpen: boolean
  results: [string, number][]
  totalSwipes: number
  onClose: () => void
  onPlayAgain: () => void
}

export default function ResultsModal({ 
  isOpen, 
  results, 
  totalSwipes, 
  onClose, 
  onPlayAgain 
}: ResultsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-results">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-primary" />
            Your Purpose Discovered
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Based on your {totalSwipes} selections, here are your top resonating purposes:
            </p>
          </div>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map(([category, count], index) => (
                <Card key={category} className="p-4" data-testid={`result-card-${index}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">#{index + 1}</span>
                        <span className="text-lg font-medium" data-testid={`text-category-${index}`}>
                          {category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-muted-foreground" data-testid={`text-count-${index}`}>
                          {count} {count === 1 ? 'selection' : 'selections'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Visual indicator */}
                    <div className="flex gap-1">
                      {Array.from({ length: count }, (_, i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-primary rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                You didn't select any purposes that resonated with you. Try exploring again!
              </p>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-close-results"
            >
              Close
            </Button>
            <Button
              onClick={onPlayAgain}
              className="flex-1 gap-2"
              data-testid="button-play-again"
            >
              <RotateCcw className="w-4 h-4" />
              Explore Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}