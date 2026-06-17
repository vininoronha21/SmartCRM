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

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

export function Topbar({
  title = 'Dashboard',
  filters,
  lastUpdatedAt,
  loading,
  theme,
  sidebarOpen,
  onApplyFilters,
  onClearFilters,
  onLogout,
  onRefresh,
  onToggleSidebar,
  onToggleTheme,
  username = 'Ana Duarte',
}) {
  const formattedLastUpdate = formatDateTime(lastUpdatedAt)
  const initials = getInitials(username)

  return (
    <header className="topbar" data-animate="dashboard-header">
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
        <button
          type="button"
          className="topbar-avatar"
          onClick={onLogout}
          aria-label="Sair do SmartCRM"
          title="Sair"
        >
          {initials}
        </button>
      </div>
    </header>
  )
}
