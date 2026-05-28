import { formatDateTime } from '../utils/formatters'

import { DateFilter } from './DateFilter'

export function Topbar({
  filters,
  lastUpdatedAt,
  loading,
  onApplyFilters,
  onClearFilters,
  onRefresh,
}) {
  const formattedLastUpdate = formatDateTime(lastUpdatedAt)

  return (
    <header className="topbar">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="topbar-meta">
          {lastUpdatedAt
            ? `Atualizado em ${formattedLastUpdate}`
            : 'Carregando dados...'}
        </p>
      </div>

      <div className="topbar-actions">
        <DateFilter
          key={`${filters.startDate}-${filters.endDate}`}
          filters={filters}
          onApply={onApplyFilters}
          onClear={onClearFilters}
          disabled={loading}
        />
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
    </header>
  )
}
