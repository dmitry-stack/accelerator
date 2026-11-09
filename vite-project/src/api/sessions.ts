import type { CreateSessionInput, Session } from '../types/session'

let sessions: Session[] = [
  {
    id: 'session-1',
    title: 'Product discovery fundamentals',
    status: 'UPCOMING',
    startsAt: '2030-04-12T09:00:00.000Z',
  },
  {
    id: 'session-2',
    title: 'Research synthesis workshop',
    status: 'COMPLETED',
    startsAt: '2024-06-20T13:30:00.000Z',
  },
]

export async function listSessions(): Promise<Session[]> {
  return sessions.map((session) => ({ ...session }))
}

export async function createSession(input: CreateSessionInput): Promise<Session> {
  const created: Session = {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    startsAt: input.startsAt,
    status: 'UPCOMING',
  }
  sessions = [created, ...sessions]
  return { ...created }
}
