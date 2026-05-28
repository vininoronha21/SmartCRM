import { formatDateTime } from '../utils/formatters'

import { DateFilter } from './DateFilter'
import { ThemeToggle } from './ThemeToggle'

export function Topbar({
  title = 'Dashboard',
  filters,
  lastUpdatedAt,
  loading,
  theme,
  sidebarOpen,
  onApplyFilters,
  onClearFilters,
  onRefresh,
  onToggleSidebar,
  onToggleTheme,
}) {
  const formattedLastUpdate = formatDateTime(lastUpdatedAt)

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
          title={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        >
          ☰
        </button>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="topbar-meta">
            {lastUpdatedAt
              ? `Atualizado em ${formattedLastUpdate}`
              : 'Carregando dados...'}
          </p>
        </div>
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
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
