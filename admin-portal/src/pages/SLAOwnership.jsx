import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';

// Isolated client to prevent overwriting current session when creating users
const adminAuthClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);

export default function SLAOwnership() {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Load admins from Supabase
  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('cb_admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const mapped = data.map(a => ({
          id: a.id,
          accountId: a.account_id,
          name: a.name,
          email: a.email,
          phone: a.phone || 'Unassigned',
          status: a.status,
          createdAt: new Date(a.created_at).toLocaleDateString()
        }));
        setAdmins(mapped);
      }
    } catch (err) {
      console.error("Error loading admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    const interval = setInterval(fetchAdmins, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name || !email || !password) {
      setFormError("Please fill in name, email, and password.");
      return;
    }

    // Auto generate sequential AD##
    const nextNum = admins.length + 1;
    const accountId = `AD${String(nextNum).padStart(2, '0')}`;

    try {
      // 1. Create auth user with direct fetch to avoid corrupting the Supabase JS client session
      const authResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        setFormError("Error creating admin auth: " + (authData.msg || authData.message || 'Unknown error'));
        return;
      }

      const newUserId = authData.id || authData.user?.id;
      if (!newUserId) {
        setFormError("Failed to retrieve user ID from authentication system.");
        return;
      }

      // 2. Insert into cb_admins
      const { error: adminError } = await supabase
        .from('cb_admins')
        .insert([{
          id: newUserId,
          account_id: accountId,
          name: name,
          email: email,
          phone: phone || 'Unassigned',
          status: 'Active'
        }]);

      if (adminError) {
        setFormError("Error creating admin record: " + adminError.message);
        return;
      }

      // 3. Insert into user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: newUserId,
          role: 'admin'
        }]);

      if (roleError) {
        console.error("Role assignment warning:", roleError.message);
      }

      // Track audit logs
      const auditLog = {
        id: Date.now().toString(),
        admin_email: 'owner@wallmark.com',
        action: 'CREATE_ADMIN',
        target: accountId,
        details: { name, email },
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('cb_audit_logs')
        .insert([auditLog]);

      // Success
      setFormSuccess(`Administrator ${accountId} (${name}) created successfully!`);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      fetchAdmins();
      
      // Auto-close modal after success
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
      }, 2000);

    } catch (err) {
      setFormError("Failed to create admin node: " + err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const { error } = await supabase
        .from('cb_admins')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error("Error toggling status: " + error.message);
        return;
      }

      fetchAdmins();
    } catch (err) {
      console.error("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="admin-page-container scale-up">
      <div className="flex-row-title-bar">
        <div>
          <h2 className="admin-page-title">Ownership Governance</h2>
          <p className="admin-page-subtitle">Owner account governance & system-level access controls</p>
        </div>
        <button className="btn-create-item" onClick={() => setShowModal(true)}>
          + Create Administrator
        </button>
      </div>

      {/* Info Card */}
      <div className="admin-card info-banner-luxury">
        <div className="info-icon-wrapper" style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '2px 6px', borderRadius: '4px', height: 'fit-content' }}>OWNER</div>
        <div>
          <h4>Owner Authority (Role: Owner)</h4>
          <p>
            The Owner Account holds full system authority and operates as a ghost account.
            It is database-provisioned, hidden from lists, and cannot be modified or deleted. 
            Owner accounts supervise all Administrator (AD##) nodes.
          </p>
        </div>
      </div>

      {/* Admins list table */}
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.filter(a => a.accountId !== 'OWNER').map(a => (
              <tr key={a.id}>
                <td><span className="id-badge-sla">{a.accountId}</span></td>
                <td><strong>{a.name}</strong></td>
                <td>{a.email}</td>
                <td>{a.phone}</td>
                <td>{a.createdAt}</td>
                <td>
                  <span className={`status-pill ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className={`btn-action-small ${a.status === 'Active' ? 'btn-red' : 'btn-green'}`}
                    onClick={() => toggleStatus(a.id, a.status)}
                  >
                    {a.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-admin">
            <div className="modal-header-admin">
              <h3>Create Administrator Account</h3>
              <button onClick={() => { setShowModal(false); setFormError(''); setFormSuccess(''); }} style={{ fontSize: 18, color: '#94a3b8' }}>&times;</button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="modal-body-admin">
                {formError && <div className="inline-alert-error">{formError}</div>}
                {formSuccess && <div className="inline-alert-success">{formSuccess}</div>}
                <div className="form-group-admin">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe" />
                </div>
                <div className="form-group-admin">
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@wallmark.com" />
                </div>
                <div className="form-group-admin">
                  <label>Phone Number (Optional)</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
                </div>
                <div className="form-group-admin">
                  <label>Account Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
              </div>
              <div className="modal-footer-admin">
                <button type="button" className="btn-modal-cancel" onClick={() => { setShowModal(false); setFormError(''); setFormSuccess(''); }}>Cancel</button>
                <button type="submit" className="btn-modal-submit">Generate Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .flex-row-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .admin-page-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-admin-main);
        }
        .admin-page-subtitle {
          font-size: 13px;
          color: var(--text-admin-light);
        }
        .btn-create-item {
          background-color: var(--color-primary);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }
        .info-banner-luxury {
          display: flex;
          gap: 16px;
          background: #fffdf5;
          border: 1px solid rgba(179,143,46,0.18);
          border-left: 4px solid #b38f2e;
          padding: 16px;
          border-radius: 6px;
        }
        .info-icon-wrapper {
          font-size: 24px;
        }
        .info-banner-luxury h4 {
          font-size: 14px;
          font-weight: 600;
          color: #b38f2e;
          margin-bottom: 4px;
        }
        .info-banner-luxury p {
          font-size: 12px;
          color: var(--text-admin-muted);
          line-height: 1.5;
        }
        .id-badge-sla {
          background-color: #eff6ff;
          color: #2563eb;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 700;
          font-size: 12px;
        }
        .status-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .status-pill.active {
          background-color: #d1fae5;
          color: #065f46;
        }
        .status-pill.suspended {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .btn-action-small {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          color: white;
        }
        .btn-red {
          background-color: #ef4444;
        }
        .btn-green {
          background-color: #10b981;
        }
      `}</style>
    </div>
  );
}
