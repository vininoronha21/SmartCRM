const navItems = [
  { id: 'dashboard', label: 'Dashboard', active: true },
  { id: 'analytics', label: 'Analytics', active: false },
  { id: 'reports', label: 'Reports', active: false },
]

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <div className="sidebar-logo">SmartCRM</div>
      <nav>
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
            disabled={!item.active}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
