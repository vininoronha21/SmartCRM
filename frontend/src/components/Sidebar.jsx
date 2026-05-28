const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
]

export function Sidebar({ activeTab, isOpen, onSelectTab }) {
  return (
    <aside
      className={`sidebar ${isOpen ? '' : 'sidebar-hidden'}`.trim()}
      aria-label="Navegação principal"
    >
      <div className="sidebar-logo">SmartCRM</div>
      <nav>
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
