import type { Session } from '../types/session'

interface SessionListProps {
  sessions: Session[]
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return <p className="empty-state">No sessions match this filter.</p>
  }

  return (
    <ul className="session-list" aria-label="Training sessions">
      {sessions.map((session) => (
        <li className="session-card" key={session.id}>
          <div>
            <h3>{session.title}</h3>
            <p>{dateTimeFormatter.format(new Date(session.startsAt))}</p>
          </div>
          <span className={`status-badge status-${session.status.toLowerCase()}`}>
            {session.status}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default SessionList
