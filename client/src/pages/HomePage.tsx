import CardDeck from '@/components/CardDeck'
import SessionHistory from '@/components/SessionHistory'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Session History Button */}
      <SessionHistory />
      
      {/* Header */}
      <header className="text-center py-8 px-6">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="text-app-title">
          Purpose
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto" data-testid="text-app-subtitle">
          Discover what resonates with your values and goals
        </p>
      </header>

      {/* Card Deck */}
      <main>
        <CardDeck />
      </main>
    </div>
  )
}