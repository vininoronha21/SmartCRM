import {
  Bell,
  Download,
  Menu,
  RefreshCcw,
  SlidersHorizontal,
} from 'lucide-react'

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
          <Menu size={17} aria-hidden="true" />
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
          className="topbar-icon-btn refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          aria-label={loading ? 'Atualizando dados' : 'Atualizar dados'}
          title={loading ? 'Atualizando dados' : 'Atualizar dados'}
        >
          <RefreshCcw size={15} aria-hidden="true" className={loading ? 'spin' : ''} />
          <span>{loading ? 'Atualizando' : 'Atualizar'}</span>
        </button>
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => document.querySelector('.filter-input')?.focus()}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          <span>Filtros</span>
        </button>
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => window.print()}
        >
          <Download size={15} aria-hidden="true" />
          <span>Exportar</span>
        </button>
        <button
          type="button"
          className="notification-btn"
          aria-label="Abrir notificações"
          title="Notificações"
        >
          <Bell size={18} aria-hidden="true" />
          <span className="notification-dot" aria-hidden="true" />
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <div className="topbar-avatar" aria-label="Usuário Ana Duarte">AD</div>
      </div>
    </header>
  )
}
