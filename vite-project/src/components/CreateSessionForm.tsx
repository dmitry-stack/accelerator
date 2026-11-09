import { useState, type FormEvent } from 'react'
import type { CreateSessionInput } from '../types/session'

interface CreateSessionFormProps {
  onSubmit: (input: CreateSessionInput) => Promise<void>
}

function CreateSessionForm({ onSubmit }: CreateSessionFormProps) {
  const [title, setTitle] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedTitle = title.trim()
    if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
      setError('Enter a title between 3 and 80 characters.')
      return
    }

    const localStart = new Date(startsAt)
    if (!startsAt || Number.isNaN(localStart.getTime()) || localStart.getTime() <= Date.now()) {
      setError('Choose a date and time in the future.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({ title: trimmedTitle, startsAt: localStart.toISOString() })
      setTitle('')
      setStartsAt('')
    } catch {
      setError('Could not create the session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit} noValidate aria-label="Create a training session">
      <div className="form-heading">
        <div>
          <p className="eyebrow">New session</p>
          <h2>Create a training session</h2>
        </div>
      </div>
      <label htmlFor="session-title">Session title</label>
      <input
        id="session-title"
        name="title"
        type="text"
        autoComplete="off"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-describedby={error ? 'create-session-error' : undefined}
      />
      <label htmlFor="session-start">Date and time</label>
      <input
        id="session-start"
        name="startsAt"
        type="datetime-local"
        value={startsAt}
        onChange={(event) => setStartsAt(event.target.value)}
        aria-describedby={error ? 'create-session-error' : undefined}
      />
      {error ? <p id="create-session-error" className="form-error" role="alert">{error}</p> : null}
      <button className="button button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create session'}
      </button>
    </form>
  )
}

export default CreateSessionForm
