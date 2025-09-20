interface ProgressIndicatorProps {
  current: number
  total: number
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            index < current
              ? 'bg-primary scale-125'
              : index === current
              ? 'bg-primary/60 scale-110'
              : 'bg-muted scale-100'
          }`}
          data-testid={`progress-dot-${index}`}
        />
      ))}
      
      {/* Progress Text */}
      <span 
        className="text-sm text-muted-foreground ml-4"
        data-testid="text-progress"
      >
        {current + 1} of {total}
      </span>
    </div>
  )
}