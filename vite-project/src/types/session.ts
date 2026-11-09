export type SessionStatus = 'UPCOMING' | 'COMPLETED'

export interface Session {
  id: string
  title: string
  status: SessionStatus
  startsAt: string
}

export interface CreateSessionInput {
  title: string
  startsAt: string
}
