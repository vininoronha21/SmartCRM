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
  {
    label: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Gauge, selectable: true },
      { id: 'reports', label: 'Reports', icon: BarChart3, selectable: true },
    ],
  },
  {
    label: 'Operação',
    items: [
      { id: 'contacts', label: 'Contatos', icon: ContactRound },
      { id: 'deals', label: 'Negócios', icon: BriefcaseBusiness },
      { id: 'activities', label: 'Atividades', icon: CalendarClock },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { id: 'products', label: 'Produtos', icon: Package },
      { id: 'campaigns', label: 'Campanhas', icon: Megaphone },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { id: 'settings', label: 'Configurações', icon: Settings },
    ],
  },
]

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

export function Sidebar({
  activeTab,
  isOpen,
  onOpenAbout,
  onSelectTab,
  username = 'Usuário',
}) {
  const initials = getInitials(username)

  return (
    <aside
      className={`sidebar ${isOpen ? '' : 'sidebar-hidden'}`.trim()}
      aria-label="Navegação principal"
      data-animate="sidebar"
    >
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark" aria-hidden="true" />
        <span>
          SmartCRM
          <small>Analytics CRM</small>
        </span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <section className="sidebar-nav-section" key={group.label}>
            <h2>{group.label}</h2>
            {group.items.map((item) => {
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
                  <span>{item.label}</span>
                </button>
              )
            })}
          </section>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-avatar" aria-hidden="true">{initials}</span>
          <span>
            <strong>{username}</strong>
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
