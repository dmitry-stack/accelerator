import { useEffect, useState } from 'react'
import { createSession, listSessions } from './api/sessions'
import CreateSessionForm from './components/CreateSessionForm'
import SessionFilter, { type SessionFilterValue } from './components/SessionFilter'
import SessionList from './components/SessionList'
import type { CreateSessionInput, Session } from './types/session'
import './App.css'

function App() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filter, setFilter] = useState<SessionFilterValue>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true
    listSessions()
      .then((result) => {
        if (isCurrentRequest) setSessions(result)
      })
      .catch(() => {
        if (isCurrentRequest) {
          setLoadError('Sessions could not be loaded. Check your connection and try again.')
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false)
      })
    return () => {
      isCurrentRequest = false
    }
  }, [reloadCount])

  async function handleCreate(input: CreateSessionInput) {
    const created = await createSession(input)
    setSessions((current) => [created, ...current.filter((session) => session.id !== created.id)])
    setFilter('UPCOMING')
  }

  const visibleSessions =
    filter === 'ALL' ? sessions : sessions.filter((session) => session.status === filter)

  return (
    <main className="workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">TRAINING MANAGEMENT</p>
          <h1>Training sessions</h1>
          <p className="intro">Plan upcoming sessions and keep track of your training.</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => setIsFormOpen((open) => !open)}
          aria-expanded={isFormOpen}
          aria-controls="create-session-panel"
        >
          {isFormOpen ? 'Close form' : 'Create session'}
        </button>
      </header>

      {isFormOpen ? (
        <section id="create-session-panel" className="create-panel" aria-label="Create a session">
          <CreateSessionForm onSubmit={handleCreate} />
        </section>
      ) : null}

      <section className="sessions-panel" aria-labelledby="sessions-heading">
        <div className="sessions-toolbar">
          <div>
            <p className="eyebrow">YOUR SCHEDULE</p>
            <h2 id="sessions-heading">Sessions</h2>
          </div>
          <SessionFilter value={filter} onChange={setFilter} />
        </div>

        {isLoading ? (
          <p className="request-state" role="status">Loading sessions…</p>
        ) : loadError ? (
          <div className="request-error" role="alert">
            <p>{loadError}</p>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setLoadError('')
                setIsLoading(true)
                setReloadCount((count) => count + 1)
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <SessionList sessions={visibleSessions} />
        )}
      </section>
    </main>
  )
}

export default App
