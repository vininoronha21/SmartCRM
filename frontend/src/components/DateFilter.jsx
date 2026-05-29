import { useState } from 'react'

export function DateFilter({
  filters,
  disabled = false,
  onApply,
  onClear,
}) {
  const [startDate, setStartDate] = useState(filters.startDate)
  const [endDate, setEndDate] = useState(filters.endDate)
  const [validationError, setValidationError] = useState('')
  const hasActiveFilter = Boolean(startDate || endDate)

  function handleApply() {
    if (startDate && endDate && startDate > endDate) {
      setValidationError('A data inicial não pode ser maior que a final.')
      return
    }

    setValidationError('')
    onApply({ startDate, endDate })
  }

  function handleClear() {
    setStartDate('')
    setEndDate('')
    setValidationError('')
    onClear()
  }

  return (
    <div className="filter-group">
      <div className="filter-bar">
        <input
          className="filter-input"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          aria-label="Data inicial"
          disabled={disabled}
        />
        <input
          className="filter-input"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          aria-label="Data final"
          disabled={disabled}
        />
        <button
          type="button"
          className="filter-btn"
          onClick={handleApply}
          disabled={disabled}
        >
          Aplicar
        </button>
        {hasActiveFilter ? (
          <button
            type="button"
            className="filter-btn-clear"
            onClick={handleClear}
            disabled={disabled}
          >
            ✕ Limpar filtros
          </button>
        ) : null}
      </div>
      {validationError ? (
        <p className="filter-error" role="alert">
          {validationError}
        </p>
      ) : null}
    </div>
  )
}
