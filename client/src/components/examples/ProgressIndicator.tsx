import ProgressIndicator from '../ProgressIndicator'

export default function ProgressIndicatorExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ProgressIndicator current={2} total={6} />
    </div>
  )
}