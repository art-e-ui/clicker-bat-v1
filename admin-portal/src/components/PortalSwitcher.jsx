import React from 'react';

export default function PortalSwitcher({ currentPortal }) {
  const isUser = currentPortal === 'user';
  
  const handleSwitch = (portal) => {
    if (portal === 'user') {
      window.location.href = '/';
    } else {
      window.location.href = '/admin.html';
    }
  };

  const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Return null so the Portal Controller does not render or show up in the production environment
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="portal-switcher-dock">
      <div className="switcher-glass-card">
        <div className="switcher-header">
          <span className="pulse-dot" style={{ backgroundColor: isConfigured ? '#10b981' : '#f59e0b', boxShadow: isConfigured ? '0 0 10px #10b981' : '0 0 10px #f59e0b' }}></span>
          <span className="switcher-title">Portal Controller</span>
          <span className="sync-status" style={{ marginLeft: 'auto', fontSize: '9.5px', fontWeight: '800', color: isConfigured ? '#10b981' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isConfigured ? '⚡ DB Live' : '🔌 Local Mode'}
          </span>
        </div>
        <div className="switcher-buttons">
          <button 
            type="button"
            className={`switch-btn ${isUser ? 'active-user' : ''}`}
            onClick={() => handleSwitch('user')}
          >
            <span className="btn-icon">📱</span>
            <span className="btn-text">User App</span>
          </button>
          
          <button 
            type="button"
            className={`switch-btn ${!isUser ? 'active-admin' : ''}`}
            onClick={() => handleSwitch('admin')}
          >
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">Admin Panel</span>
          </button>
        </div>
      </div>

      <style>{`
        .portal-switcher-dock {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999999;
          font-family: system-ui, -apple-system, sans-serif;
          pointer-events: auto;
        }

        .switcher-glass-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px 14px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 240px;
        }

        .switcher-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 4px;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: switcherPulse 1.8s infinite;
        }

        .switcher-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .switcher-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .switch-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 8px 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: rgba(255, 255, 255, 0.8);
        }

        .switch-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .switch-btn:active {
          transform: scale(0.95);
        }

        .switch-btn.active-user {
          background: #0071ce;
          border-color: #0088f0;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 113, 206, 0.35);
          font-weight: 600;
        }

        .switch-btn.active-admin {
          background: #5C32E6;
          border-color: #7b52ff;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(92, 50, 230, 0.35);
          font-weight: 600;
        }

        .btn-icon {
          font-size: 16px;
        }

        .btn-text {
          font-size: 10px;
        }

        @keyframes switcherPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
