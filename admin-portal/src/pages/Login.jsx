import React, { useState } from 'react';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';
export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please enter both email address and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        toast.error("Authentication failed: " + authError.message);
        setLoading(false);
        return;
      }

      const userEmail = authData.user?.email;

      // 2. Fetch details from cb_admins
      const { data: adminRows, error: adminErr } = await supabase
        .from('cb_admins')
        .select('*')
        .eq('email', userEmail);

      if (adminErr) {
        toast.error("Database error: " + adminErr.message);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (adminRows && adminRows.length > 0) {
        const admin = adminRows[0];
        if (admin.status !== 'Active') {
          toast.error("Your administrator account is suspended. Please contact the system owner.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        const isOwner = admin.account_id === 'OWNER' || userEmail === 'owner@wallmark.com';
        const session = {
          role: isOwner ? 'Owner' : 'Admin',
          accountId: admin.account_id,
          name: admin.name,
          email: admin.email
        };

        localStorage.setItem('cb_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
        return;
      }

      // 3. Fetch details from cb_staff
      const { data: staffRows, error: staffErr } = await supabase
        .from('cb_staff')
        .select('*')
        .eq('email', userEmail);

      if (staffErr) {
        toast.error("Database error: " + staffErr.message);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (staffRows && staffRows.length > 0) {
        const staff = staffRows[0];
        if (staff.status !== 'Active') {
          toast.error("Your staff account is suspended. Please contact your administrator node.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        const session = {
          role: 'Staff',
          accountId: staff.staff_id,
          name: staff.name,
          email: staff.email
        };

        localStorage.setItem('cb_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
        return;
      }

      // 4. Fallback: Not an admin/staff account
      toast.error("Access Denied: You do not have administrative privileges.");
      await supabase.auth.signOut();
      setLoading(false);

    } catch (err) {
      toast.error("Login error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-layout scale-up">
      <div className="login-backdrop-decor"></div>
      <div className="admin-login-card card">
        <div className="demo-disclaimer-banner" style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#78350f',
          padding: '12px',
          borderRadius: '12px',
          fontSize: '11.5px',
          lineHeight: '1.5',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <strong>⚠️ DEVELOPMENT & SIMULATION NOTICE:</strong> This admin area is a private educational simulation. It has <strong>no</strong> affiliation with Walmart Inc., Walmark, or any real corporation. All actions are simulated and exist purely for software verification.
        </div>

        <div className="brand-logo-section">
          <div className="logo-badge-walmart large">
            <span className="logo-text-walmart">Walmart</span>
            <span className="logo-spark-walmart">
              <svg viewBox="0 0 100 100" width="24" height="24">
                <g transform="translate(50,50)" stroke="#FFC220" strokeWidth="15" strokeLinecap="round">
                  <line x1="0" y1="-10" x2="0" y2="-38" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(60)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(120)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(180)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(240)" />
                  <line x1="0" y1="-10" x2="0" y2="-38" transform="rotate(300)" />
                </g>
              </svg>
            </span>
          </div>
          <span className="portal-badge" style={{ marginTop: '8px' }}>SECURE PLATFORM OPERATIONS</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group-admin">
            <label>OPERATOR EMAIL</label>
            <input 
              type="email" 
              placeholder="operator@walmart.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-admin">
            <label>ACCESS SECURITY PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Authenticating Operator...' : 'Authenticate & Enter'}
          </button>
        </form>

        <div className="footer-notice">
          Enforced Row-Level Security (RLS) active. Unauthorized access is monitored and logged in audit trails.
        </div>
      </div>

      <style>{`
        .admin-login-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, rgba(0, 113, 206, 0.08) 0%, #f1f5f9 100%);
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .login-backdrop-decor {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 194, 32, 0.08) 0%, rgba(0,0,0,0) 70%);
          top: -200px;
          left: -200px;
          z-index: 0;
          pointer-events: none;
        }
        .admin-login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid rgba(0, 113, 206, 0.15);
          box-shadow: 0 10px 30px rgba(0, 113, 206, 0.05);
          border-radius: 8px;
          padding: 40px 32px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .brand-logo-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .brand-logo-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #0071ce;
          letter-spacing: -0.5px;
        }
        .portal-badge {
          font-size: 10px;
          font-weight: 800;
          color: #FFC220;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group-admin {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group-admin label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.5px;
        }
        .form-group-admin input {
          height: 44px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 0 14px;
          font-size: 14px;
          color: #0f172a;
          transition: all 0.2s;
        }
        .form-group-admin input:focus {
          border-color: #0071ce;
          background: #ffffff;
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 113, 206, 0.15);
        }
        .btn-login-submit {
          height: 48px;
          background: linear-gradient(135deg, #0088f0 0%, #0071ce 100%);
          border: none;
          border-radius: 6px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(0, 113, 206, 0.2);
        }
        .btn-login-submit:hover:not(:disabled) {
          background: #005fa7;
          box-shadow: 0 4px 15px rgba(0, 113, 206, 0.3);
        }
        .btn-login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .footer-notice {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
