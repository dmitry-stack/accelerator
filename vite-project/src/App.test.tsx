import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { Session } from './types/session'

const { createSession, listSessions } = vi.hoisted(() => ({
  createSession: vi.fn(),
  listSessions: vi.fn(),
}))

vi.mock('./api/sessions', () => ({ createSession, listSessions }))

describe('Training sessions workspace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates an upcoming session, shows it in the list, and resets the form', async () => {
    const existing: Session = {
      id: 'existing-session',
      title: 'Existing training',
      status: 'UPCOMING',
      startsAt: '2030-04-12T09:00:00.000Z',
    }
    listSessions.mockResolvedValue([existing])

    const created: Session = {
      id: 'created-session',
      title: 'Facilitation basics',
      status: 'UPCOMING',
      startsAt: '2031-06-15T10:30:00.000Z',
    }
    createSession.mockResolvedValue(created)

    render(<App />)
    expect(await screen.findByText('Existing training')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))
    const form = within(screen.getByRole('form', { name: 'Create a training session' }))
    fireEvent.change(form.getByLabelText('Session title'), {
      target: { value: '  Facilitation basics  ' },
    })

    const future = new Date()
    future.setDate(future.getDate() + 7)
    future.setHours(10, 30, 0, 0)
    const localDateTime = [
      future.getFullYear(),
      String(future.getMonth() + 1).padStart(2, '0'),
      String(future.getDate()).padStart(2, '0'),
    ].join('-') + `T${String(future.getHours()).padStart(2, '0')}:${String(future.getMinutes()).padStart(2, '0')}`
    fireEvent.change(form.getByLabelText('Date and time'), { target: { value: localDateTime } })
    fireEvent.click(form.getByRole('button', { name: 'Create session' }))

    await waitFor(() => expect(createSession).toHaveBeenCalledWith({
      title: 'Facilitation basics',
      startsAt: expect.any(String),
    }))
    expect(await screen.findByText('Facilitation basics')).toBeInTheDocument()
    expect(form.getByLabelText('Session title')).toHaveValue('')
    expect(form.getByLabelText('Date and time')).toHaveValue('')
  })
})
