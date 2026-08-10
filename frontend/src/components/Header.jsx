import { useState } from 'react'
import { ArrowLeft, MoreVertical, LogOut } from 'lucide-react'

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-left">
        <img src="/crest.png" alt="Caritas University crest" className="crest" />
        <div className="header-text">
          <span className="header-title">Caritas Assistant</span>
          <span className="header-sub">
            <span className="status-dot" />
            {user?.matric ? `Matric: ${user.matric}` : 'Online — Amorji-Nike'}
          </span>
        </div>
      </div>

      <div className="header-menu-wrap">
        <button className="icon-btn" aria-label="More options" onClick={() => setMenuOpen((v) => !v)}>
          <MoreVertical size={20} strokeWidth={2.25} />
        </button>
        {menuOpen && (
          <div className="menu">
            <button
              className="menu-item"
              onClick={() => {
                setMenuOpen(false)
                onLogout?.()
              }}
            >
              <LogOut size={15} strokeWidth={2.1} /> Log out
            </button>
          </div>
        )}
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 12px;
          background: var(--red);
          border-bottom: 1px solid var(--red-700);
          flex-shrink: 0;
          position: relative;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .icon-btn {
          border: none;
          background: transparent;
          color: #fff;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r-sm);
          cursor: pointer;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.14);
        }
        .crest {
          width: 34px;
          height: 34px;
          object-fit: contain;
          background: #fff;
          border-radius: var(--r-sm);
          padding: 2px;
          flex-shrink: 0;
        }
        .header-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .header-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          color: #fff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-sub {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.88);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: #7CD98C;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .header-menu-wrap {
          position: relative;
        }
        .menu {
          position: absolute;
          top: 40px;
          right: 0;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
          box-shadow: 0 4px 16px rgba(33,29,25,0.14);
          min-width: 140px;
          overflow: hidden;
          z-index: 20;
        }
        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: none;
          border: none;
          color: var(--ink);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
        }
        .menu-item:hover {
          background: var(--red-100);
          color: var(--red-700);
        }
      `}</style>
    </header>
  )
}
