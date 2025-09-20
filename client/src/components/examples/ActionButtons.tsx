import ActionButtons from '../ActionButtons'

export default function ActionButtonsExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ActionButtons
        onLeftAction={() => console.log('Left action triggered')}
        onRightAction={() => console.log('Right action triggered')}
      />
    </div>
  )
}