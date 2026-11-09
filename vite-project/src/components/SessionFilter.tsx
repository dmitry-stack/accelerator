import type { SessionStatus } from '../types/session'

export type SessionFilterValue = 'ALL' | SessionStatus

interface SessionFilterProps {
  value: SessionFilterValue
  onChange: (value: SessionFilterValue) => void
}

function SessionFilter({ value, onChange }: SessionFilterProps) {
  return (
    <div className="session-filter">
      <label htmlFor="session-status-filter">Filter by status</label>
      <select
        id="session-status-filter"
        name="statusFilter"
        value={value}
        onChange={(event) => onChange(event.target.value as SessionFilterValue)}
      >
        <option value="ALL">All</option>
        <option value="UPCOMING">UPCOMING</option>
      </select>
    </div>
  )
}

export default SessionFilter
