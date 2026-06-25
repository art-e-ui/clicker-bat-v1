import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Briefcase, TrendingUp, Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import UserManagement from './pages/UserManagement';
import SLAOwnership from './pages/SLAOwnership';
import SLAAdmins from './pages/SLAAdmins';
import SLAStaff from './pages/SLAStaff';
import FinancialCenter from './pages/FinancialCenter';
import OrdersTasking from './pages/OrdersTasking';
import Settings from './pages/Settings';
import SupportChat from './pages/SupportChat';
import Login from './pages/Login';
import { supabase } from './supabase';
import { Toaster } from 'react-hot-toast';
import PortalSwitcher from './components/PortalSwitcher';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    payoutRequests: 0,
    totalDeposits: 0,
    newUsers: 0,
    matchedTasks: 0,
    onlineUsers: 0
  });

  // Load session to guard tabs
  const loadSession = () => {
    const saved = localStorage.getItem('cb_admin_session');
    if (saved) {
      setSession(JSON.parse(saved));
    } else {
      setSession(null);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // 1. Total Approved Payout Requests sum
      const { data: withdrawals, error: wthError } = await supabase
        .from('cb_withdrawals')
        .select('amount')
        .eq('status', 'Approved');
      
      let payoutSum = 0;
      if (!wthError && withdrawals) {
        payoutSum = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);
      }

      // 2. Total Approved Deposits sum
      const { data: deposits, error: depError } = await supabase
        .from('cb_deposits')
        .select('amount')
        .eq('status', 'Approved');

      let depositSum = 0;
      if (!depError && deposits) {
        depositSum = deposits.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      }

      // 3. New registration nodes (total users in the database)
      const { count: usersCount, error: usersError } = await supabase
        .from('cb_users')
        .select('*', { count: 'exact', head: true });

      // 4. Matched tasks submissions (total completed orders in cb_orders)
      const { count: ordersCount, error: ordersError } = await supabase
        .from('cb_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Success');

      // 5. Total active online users count
      const { count: onlineCount, error: onlineError } = await supabase
        .from('cb_users')
        .select('*', { count: 'exact', head: true })
        .eq('online', 'Online');

      setStats({
        payoutRequests: payoutSum,
        totalDeposits: depositSum,
        newUsers: usersCount || 0,
        matchedTasks: ordersCount || 0,
        onlineUsers: onlineCount || 0
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  useEffect(() => {
    loadSession();
    fetchDashboardStats();
    // Poll for switcher changes and stats updates
    const interval = setInterval(() => {
      loadSession();
      fetchDashboardStats();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Set default tab safely if switching roles redirects to an unauthorized tab
  useEffect(() => {
    if (session) {
      if (session.role === 'Staff' && ['ownership', 'sla-admins', 'operations', 'financial-center', 'settings'].includes(activeTab)) {
        setActiveTab('dashboard');
      } else if (session.role === 'Admin' && ['ownership'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [session, activeTab]);

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'ownership': return 'SLA System Ownership';
      case 'sla-admins': return 'SLA Administrator Nodes';
      case 'sla-staff': return 'SLA Staff Members';
      case 'user-management': return 'User Management';
      case 'orders-tasking': return 'Orders Tasking & Allocations';
      case 'operations': return 'Operations Settings';
      case 'financial-center': return 'Financial Center';
      case 'support-chat': return 'Support & Chat Inbox';
      case 'settings': return 'System Settings';
      case 'my-profile': return 'My Profile';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'user-management':
        return <UserManagement />;

      case 'orders-tasking':
        return <OrdersTasking />;
        
      case 'ownership':
        return <SLAOwnership />;
        
      case 'sla-admins':
        return <SLAAdmins />;
        
      case 'sla-staff':
        return <SLAStaff />;

      case 'financial-center':
        return <FinancialCenter />;
        
      case 'dashboard':
        return (
          <div className="admin-page-container scale-up">
            <div className="dashboard-stats-grid">
              
              {/* Card 1: Violet */}
              <div className="stat-box-card" style={{ backgroundColor: 'var(--bg-violet)', color: '#fff' }}>
                <div className="stat-header">
                  <div className="stat-icon-jobie" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <DollarSign size={24} />
                  </div>
                  <span className="stat-label">Total Payouts</span>
                </div>
                <div className="stat-val">$ {stats.payoutRequests.toFixed(2)}</div>
              </div>

              {/* Card 2: Light Blue */}
              <div className="stat-box-card" style={{ backgroundColor: 'var(--bg-lightblue)', color: '#fff' }}>
                <div className="stat-header">
                  <div className="stat-icon-jobie" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUp size={24} />
                  </div>
                  <span className="stat-label">Total Deposits</span>
                </div>
                <div className="stat-val">$ {stats.totalDeposits.toFixed(2)}</div>
              </div>

              {/* Card 3: Green */}
              <div className="stat-box-card" style={{ backgroundColor: 'var(--bg-green)', color: '#fff' }}>
                <div className="stat-header">
                  <div className="stat-icon-jobie" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <Users size={24} />
                  </div>
                  <span className="stat-label">Client Nodes</span>
                </div>
                <div className="stat-val">{stats.newUsers.toLocaleString()}</div>
              </div>

              {/* Card 4: Light Green */}
              <div className="stat-box-card" style={{ backgroundColor: 'var(--bg-lightgreen)', color: '#fff' }}>
                <div className="stat-header">
                  <div className="stat-icon-jobie" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <Briefcase size={24} />
                  </div>
                  <span className="stat-label">Matched Tasks</span>
                </div>
                <div className="stat-val">{stats.matchedTasks.toLocaleString()}</div>
              </div>

              {/* Card 5: Active Orange */}
              <div className="stat-box-card" style={{ backgroundColor: '#f0932b', color: '#fff' }}>
                <div className="stat-header">
                  <div className="stat-icon-jobie" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <Activity size={24} />
                  </div>
                  <span className="stat-label">Online Users</span>
                </div>
                <div className="stat-val">{stats.onlineUsers.toLocaleString()}</div>
              </div>

            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 className="section-title">Platform Earning Velocity</h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Linear Growth Rate 1.25x</span>
              </div>
              <div className="chart-placeholder">
                <TrendingUp size={48} color="var(--border-color-focus)" strokeWidth={1} style={{ marginBottom: 12 }} />
                <span>[Matching Activity Metrics Projection]</span>
              </div>
            </div>
            
            <style>{`
              .dashboard-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 24px;
                margin-bottom: 24px;
              }
              .stat-box-card {
                border-radius: var(--radius-md);
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 140px;
                box-shadow: var(--shadow-sm);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .stat-box-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-md);
              }
              .stat-header {
                display: flex;
                flex-direction: column;
                gap: 12px;
              }
              .stat-icon-jobie {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
              }
              .stat-label {
                font-size: 15px;
                font-weight: 500;
                opacity: 0.9;
              }
              .stat-val {
                font-size: 32px;
                font-weight: 700;
                margin-top: 16px;
                align-self: flex-end;
              }
              .chart-placeholder {
                height: 240px;
                background-color: var(--bg-app);
                border: 1px dashed var(--border-color-focus);
                border-radius: var(--radius-md);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                font-size: 14px;
                font-weight: 500;
                font-size: 13px;
              }
            `}</style>
          </div>
        );

      case 'support-chat':
        return <SupportChat />;

      case 'settings':
        return <Settings />;

      default:
        return (
          <div className="admin-page-container scale-up">
            <div className="admin-card">
              <h3 className="section-title" style={{ marginBottom: 12 }}>{getActiveTabLabel()}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-admin-light)' }}>
                This portal subsection configures administrative bindings. Values set here link directly into backend state modules.
              </p>
            </div>
          </div>
        );
    }
  };

  if (!session) {
    return <Login onLoginSuccess={(s) => setSession(s)} />;
  }

  return (
    <div className="admin-shell">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Persistent left sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content pane */}
      <div className="admin-main">
        <Navbar activeLabel={getActiveTabLabel()} />
        {renderContent()}
      </div>
      <PortalSwitcher currentPortal="admin" />
    </div>
  );
}
