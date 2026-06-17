import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  ContactRound,
  Gauge,
  Megaphone,
  Package,
  Settings,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge, selectable: true },
  { id: 'reports', label: 'Reports', icon: BarChart3, selectable: true },
  { id: 'contacts', label: 'Contatos', icon: ContactRound },
  { id: 'deals', label: 'Negócios', icon: BriefcaseBusiness },
  { id: 'activities', label: 'Atividades', icon: CalendarClock },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'campaigns', label: 'Campanhas', icon: Megaphone },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

export function Sidebar({ activeTab, isOpen, onOpenAbout, onSelectTab }) {
  return (
    <aside
      className={`sidebar ${isOpen ? '' : 'sidebar-hidden'}`.trim()}
      aria-label="Navegação principal"
    >
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark" aria-hidden="true" />
        <span>SmartCRM</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
          <button
            type="button"
            key={item.id}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => (item.selectable ? onSelectTab(item.id) : undefined)}
            aria-current={activeTab === item.id ? 'page' : undefined}
            aria-disabled={item.selectable ? undefined : 'true'}
          >
            <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
            {item.label}
          </button>
          )
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-avatar" aria-hidden="true">AD</span>
          <span>
            <strong>Ana Duarte</strong>
            <small>Administrador</small>
          </span>
        </div>
        <button type="button" className="read-more-btn" onClick={onOpenAbout}>
          Sobre o projeto
        </button>
      </div>
    </aside>
  )
}
