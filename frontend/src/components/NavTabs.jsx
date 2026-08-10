import { MessageSquare, BookOpen, Building2, Calculator } from 'lucide-react'

const TABS = [
  { id: 'chat', label: 'Assistant', icon: MessageSquare },
  { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'tools', label: 'Quick Tools', icon: Calculator },
]

export default function NavTabs({ activeTab, onTabChange }) {
  return (
    <nav className="nav-tabs-container" aria-label="Portal section navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{tab.label}</span>
          </button>
        )
      })}

      <style>{`
        .nav-tabs-container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: var(--paper);
          border-bottom: 1px solid var(--line);
          padding: 4px 8px;
          flex-shrink: 0;
        }
        .nav-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border: none;
          background: transparent;
          color: var(--ink-soft);
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--r-sm);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .nav-tab-btn:hover {
          background: var(--surface);
          color: var(--ink);
        }
        .nav-tab-btn.active {
          background: var(--red-100);
          color: var(--red-700);
          font-weight: 600;
        }
        @media (max-width: 480px) {
          .nav-tab-btn span {
            font-size: 11px;
          }
        }
      `}</style>
    </nav>
  )
}
