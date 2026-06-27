import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  UserCog, 
  Briefcase, 
  LineChart, 
  DollarSign, 
  MessageSquare, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loadSession = () => {
      const saved = localStorage.getItem('cb_admin_session');
      if (saved) {
        setSession(JSON.parse(saved));
      } else {
        setSession(null);
      }
    };
    loadSession();
    // Poll for session updates from navbar switcher
    const interval = setInterval(loadSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const allMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['Owner', 'Admin', 'Staff'] },
    { id: 'ownership', label: 'Ownership', icon: ShieldCheck, roles: ['Owner'] },
    { id: 'sla-admins', label: 'Administrators', icon: UserCog, roles: ['Owner', 'Admin'] },
    { id: 'sla-staff', label: 'Staff Members', icon: Users, roles: ['Owner', 'Admin', 'Staff'] },
    { id: 'user-management', label: 'User Management', icon: Users, roles: ['Owner', 'Admin', 'Staff'] },
    { id: 'orders-tasking', label: 'Orders Tasking', icon: Briefcase, roles: ['Owner', 'Admin', 'Staff'] },
    { id: 'orders-in-progress', label: 'Orders In Progress', icon: LineChart, roles: ['Owner', 'Admin', 'Staff'] },
    { id: 'financial-center', label: 'Financial Center', icon: DollarSign, roles: ['Owner', 'Admin'] },
    { id: 'support-chat', label: 'Support & Chat', icon: MessageSquare, roles: ['Owner', 'Admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Owner', 'Admin'] }
  ];

  // Filter items based on active session role
  const activeRole = session?.role || 'Owner';
  const menuItems = allMenuItems.filter(item => item.roles.includes(activeRole));

  return (
    <div className="admin-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-mark">
          <span className="spark">❋</span>
        </div>
        <div className="brand-text">
          <span className="brand-name">Walmart</span>
          <span className="brand-sub">Admin Console</span>
        </div>
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-section-label">Menu</div>
        {menuItems.map(item => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`menu-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              id={`btn-sidebar-${item.id}`}
            >
              <IconComponent className="menu-icon" size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
