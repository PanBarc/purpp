import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { History, Calendar, Heart } from 'lucide-react'
import { apiRequest } from '@/lib/queryClient'

interface HistorySession {
  id: string
  createdAt: string
  completedAt: string | null
  results?: Record<string, number>
}

interface SessionResults {
  [category: string]: number
}

export default function SessionHistory() {
  const [selectedSession, setSelectedSession] = useState<HistorySession | null>(null)
  
  // Get session identifier from localStorage
  const getSessionIdentifier = () => {
    return localStorage.getItem('purpose-session-id') || crypto.randomUUID()
  }

  // Fetch user sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['/api/sessions', 'history'],
    queryFn: async () => {
      const sessionIdentifier = getSessionIdentifier()
      const response = await apiRequest('POST', '/api/sessions/history', { 
        sessionData: { userSession: sessionIdentifier } 
      })
      const sessions: HistorySession[] = await response.json()
      
      // Fetch results for each completed session
      const sessionsWithResults = await Promise.all(
        sessions.map(async (session) => {
          if (session.completedAt) {
            try {
              const resultsResponse = await apiRequest('GET', `/api/sessions/${session.id}/results`)
              const results = await resultsResponse.json()
              return { ...session, results }
            } catch {
              return session
            }
          }
          return session
        })
      )
      
      return sessionsWithResults
    },
    staleTime: 1000 * 60 // 1 minute
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const completedSessions = sessions.filter(s => s.completedAt)

  if (completedSessions.length === 0) {
    return null // Don't show history button if no completed sessions
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 gap-2"
          data-testid="button-session-history"
        >
          <History className="w-4 h-4" />
          History ({completedSessions.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg" data-testid="modal-session-history">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Your Purpose Journey
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading your history...
            </div>
          ) : completedSessions.length > 0 ? (
            completedSessions.map((session) => (
              <Card 
                key={session.id} 
                className="p-4 hover-elevate cursor-pointer"
                onClick={() => setSelectedSession(session)}
                data-testid={`card-session-${session.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(session.createdAt)}
                    </span>
                  </div>
                  {session.results && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">
                        {Object.values(session.results as SessionResults).reduce((sum, count) => sum + count, 0)} selections
                      </span>
                    </div>
                  )}
                </div>
                
                {session.results && Object.keys(session.results).length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Top purposes:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(session.results as SessionResults)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([category, count]) => (
                          <span 
                            key={category}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {category} ({count})
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Complete a session to see your history here!
            </div>
          )}
        </div>

        {selectedSession && (
          <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Session Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Date: </span>
                  <span>{formatDate(selectedSession.createdAt)}</span>
                </div>
                {selectedSession.results && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Results:</div>
                    <div className="space-y-2">
                      {Object.entries(selectedSession.results as SessionResults)
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span>{category}</span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              {count}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}