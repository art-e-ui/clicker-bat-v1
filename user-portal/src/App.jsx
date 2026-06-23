import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Orders from './pages/Orders';
import ShopOrder from './pages/ShopOrder';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Security from './pages/Security';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import TransactionLogs from './pages/TransactionLogs';
import Login from './pages/Login';
import Register from './pages/Register';
import { supabase } from './supabase';
import { Toaster } from 'react-hot-toast';
import PortalSwitcher from '../../src/components/PortalSwitcher';
import { LoadingProvider } from './components/GlobalLoader';


// Route guards
function ProtectedRoute({ children }) {
  const session = localStorage.getItem('cb_user_session');
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const session = localStorage.getItem('cb_user_session');
  if (session) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default function App() {
  // Theme state: 'orange' or 'red'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cb_theme') || 'orange';
  });

  // Balance state
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('cb_balance');
    return saved ? parseFloat(saved) : 0;
  });

  // Username
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('cb_username') || '';
  });

  // Orders list
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'red' ? 'theme-red' : '';
    localStorage.setItem('cb_theme', theme);
  }, [theme]);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('cb_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('cb_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('cb_orders', JSON.stringify(orders));
  }, [orders]);

  // Triggered when theme updates
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const updateBalance = (amount) => {
    setBalance(prev => {
      const nextBalance = parseFloat((prev + amount).toFixed(2));
      supabase
        .from('cb_users')
        .update({ balance: nextBalance })
        .eq('username', username)
        .then(({ error }) => {
          if (error) console.error("Supabase balance sync error:", error.message);
        });
      return nextBalance;
    });
  };

  const addPendingDeposit = () => {};
  const addPendingWithdraw = () => {};

  // Periodically sync user profile and orders from Supabase database
  useEffect(() => {
    if (!username) return;

    const syncWithDatabase = async () => {
      try {
        // 1. Fetch user balance
        const { data: users, error: userError } = await supabase
          .from('cb_users')
          .select('balance')
          .eq('username', username);

        if (!userError && users && users[0]) {
          const fetchedBalance = parseFloat(users[0].balance);
          if (fetchedBalance !== balance) {
            setBalance(fetchedBalance);
          }
        }

        // 2. Fetch matched orders list
        const { data: ordersData, error: ordersError } = await supabase
          .from('cb_orders')
          .select('*')
          .eq('username', username)
          .order('id', { ascending: false });

        if (!ordersError && ordersData) {
          const formatted = ordersData.map(o => ({
            id: o.id,
            timestamp: new Date(o.timestamp).toLocaleString(),
            status: o.status,
            title: o.title,
            image: o.image,
            price: o.price.toString(),
            profit: o.profit.toString(),
            type: o.type,
            assignedTaskId: o.assigned_task_id,
            assignedOrderIndex: o.assigned_order_index
          }));
          setOrders(formatted);
        }
      } catch (err) {
        console.error("Database sync error:", err);
      }
    };

    syncWithDatabase();
    const interval = setInterval(syncWithDatabase, 3000);
    return () => clearInterval(interval);
  }, [username, balance]);

  return (
    <LoadingProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="portal-layout">
                  {/* Show brand Header only on Home path */}
                  <ConditionalHeader theme={theme} onThemeChange={handleThemeChange} />
                  
                  <div className="main-content-area">
                    <Routes>
                      <Route path="" element={<Navigate to="/home" replace />} />
                      <Route 
                        path="home" 
                        element={<Home currentTheme={theme} balance={balance} username={username} />} 
                      />
                      <Route 
                        path="orders" 
                        element={
                          <Orders 
                            balance={balance}
                            orders={orders} 
                            setOrders={setOrders} 
                            updateBalance={updateBalance} 
                          />
                        } 
                      />
                      <Route 
                        path="match" 
                        element={
                          <ShopOrder 
                            balance={balance} 
                            updateBalance={updateBalance} 
                            orders={orders} 
                            setOrders={setOrders} 
                          />
                        } 
                      />
                      <Route path="support" element={<Support />} />
                      <Route 
                        path="profile" 
                        element={
                          <Profile 
                            balance={balance} 
                            username={username}
                            setUsername={setUsername}
                            setBalance={setBalance}
                            setOrders={setOrders}
                          />
                        } 
                      />
                      <Route 
                        path="security" 
                        element={<Security />} 
                      />
                      <Route 
                        path="deposit" 
                        element={<Deposit addPendingDeposit={addPendingDeposit} />} 
                      />
                      <Route 
                        path="withdraw" 
                        element={
                          <Withdraw 
                            balance={balance} 
                            updateBalance={updateBalance} 
                            addPendingWithdraw={addPendingWithdraw} 
                          />
                        } 
                      />
                      <Route path="deposit-history" element={<TransactionLogs username={username} />} />
                      <Route path="payout-history" element={<TransactionLogs username={username} />} />
                      <Route path="transaction-logs" element={<TransactionLogs username={username} />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                  </div>

                  {/* Show Bottom Nav bar on main navigation routes */}
                  <ConditionalBottomNav />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <PortalSwitcher currentPortal="user" />
      </Router>
    </LoadingProvider>
  );
}

// Subcomponents to handle conditional headers and footers based on route
function ConditionalHeader({ theme, onThemeChange }) {
  const showHeader = window.location.hash.includes('/home');
  if (!showHeader) return null;
  return <Header currentTheme={theme} onThemeChange={onThemeChange} />;
}

function ConditionalBottomNav() {
  const path = window.location.hash;
  const hideNav = path.includes('/deposit') || path.includes('/withdraw');
  if (hideNav) return null;
  return <BottomNav />;
}
