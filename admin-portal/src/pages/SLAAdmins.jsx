import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';

import toast from 'react-hot-toast';
// Isolated client to prevent overwriting current session when creating users
const adminAuthClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);

export default function SLAAdmins() {
  const [admins, setAdmins] = useState([]);
  const [staff, setStaff] = useState([]);
  const [session, setSession] = useState(null);

  // Form states for creating staff
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffDept, setStaffDept] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchAdminsAndStaff = async () => {
    try {
      // Session
      const savedSession = localStorage.getItem('cb_admin_session');
      const parsedSession = savedSession ? JSON.parse(savedSession) : { role: 'Owner', name: 'System Owner', email: 'owner@wallmark.com' };
      setSession(parsedSession);

      // Admins
      const { data: adminsData, error: adminsError } = await supabase
        .from('cb_admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (!adminsError && adminsData) {
        const mappedAdmins = adminsData.map(a => ({
          id: a.id,
          accountId: a.account_id,
          name: a.name,
          email: a.email,
          phone: a.phone || 'Unassigned',
          status: a.status,
          createdAt: new Date(a.created_at).toLocaleDateString()
        }));
        setAdmins(mappedAdmins);
      }

      // Staff
      const { data: staffData, error: staffError } = await supabase
        .from('cb_staff')
        .select('*')
        .order('created_at', { ascending: true });

      if (!staffError && staffData) {
        const mappedStaff = staffData.map(s => ({
          id: s.id,
          staffId: s.staff_id,
          name: s.name,
          email: s.email,
          phone: s.phone || 'Unassigned',
          status: s.status,
          createdByAdminId: s.created_by_admin_id,
          department: s.department || 'Operations',
          referralCode: s.referral_code,
          createdAt: new Date(s.created_at).toLocaleDateString()
        }));
        setStaff(mappedStaff);
      }
    } catch (err) {
      console.error("Error fetching admins and staff:", err);
    }
  };

  useEffect(() => {
    fetchAdminsAndStaff();
    const interval = setInterval(fetchAdminsAndStaff, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter admins based on role
  const displayAdmins = admins.filter(a => {
    if (a.accountId === 'OWNER') return false; // Hide owner
    if (!session || session.role === 'Owner') return true;
    if (session.role === 'Admin') return a.accountId === session.accountId;
    return false;
  });

  const handleOpenCreateStaff = (admin) => {
    setSelectedAdminId(admin.accountId);
    setShowModal(true);
  };

  const generateReferralCode = (staffId, name) => {
    // Get 3 random upper letters from staff name or fallback
    const letters = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    let randomLetters = "";
    if (letters.length >= 3) {
      randomLetters = letters.substring(0, 3);
    } else {
      randomLetters = "ASD"; // Default fallback like WKAD01SI1ASD
    }
    // Format: WK + StaffId + randomLetters (no hyphens)
    return `WK${staffId}${randomLetters}`;
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!staffName || !staffEmail || !staffPassword) {
      setFormError("Please fill in name, email, and password.");
      return;
    }

    // Filter staff belonging to this specific admin node to calculate next ID
    const staffUnderAdmin = staff.filter(s => s.createdByAdminId === selectedAdminId);
    const nextNum = staffUnderAdmin.length + 1;
    const staffId = `${selectedAdminId}SI${nextNum}`;
    const referralCode = generateReferralCode(staffId, staffName);

    try {
      // 1. Direct fetch to avoid corrupting the Supabase JS client session
      const authResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: staffEmail, password: staffPassword })
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        setFormError("Error creating staff auth: " + (authData.msg || authData.message || 'Unknown error'));
        return;
      }

      const newUserId = authData.id || authData.user?.id;
      if (!newUserId) {
        setFormError("Failed to retrieve user ID from authentication system.");
        return;
      }

      // 2. Insert into cb_staff
      const { error: staffError } = await supabase
        .from('cb_staff')
        .insert([{
          id: newUserId,
          staff_id: staffId,
          created_by_admin_id: selectedAdminId,
          name: staffName,
          email: staffEmail,
          phone: staffPhone || 'Unassigned',
          department: staffDept || 'Operations',
          status: 'Active',
          referral_code: referralCode
        }]);

      if (staffError) {
        setFormError("Error creating staff record: " + staffError.message);
        return;
      }

      // 3. Insert into user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: newUserId,
          role: 'staff'
        }]);

      if (roleError) {
        console.error("Role assignment warning:", roleError.message);
      }

      // Track Audit Log
      const auditLog = {
        id: Date.now().toString(),
        admin_email: session?.email || 'admin@wallmark.com',
        action: 'CREATE_STAFF',
        target: staffId,
        details: { name: staffName, referralCode },
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('cb_audit_logs')
        .insert([auditLog]);

      // Success
      setFormSuccess(`Staff Member ${staffId} (${staffName}) created successfully!`);
      setStaffName('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffDept('');
      setStaffPassword('');
      fetchAdminsAndStaff();

      // Auto-close modal
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
      }, 2000);

    } catch (err) {
      setFormError("Failed to create staff account: " + err.message);
    }
  };

  const toggleAdminStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const { error } = await supabase
        .from('cb_admins')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        toast.error("Error updating status: " + error.message);
        return;
      }

      toast(`Admin node status changed to ${newStatus}.`);
      fetchAdminsAndStaff();
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="admin-page-container scale-up">
      <div className="flex-row-title-bar">
        <div>
          <h2 className="admin-page-title">Administrator Nodes</h2>
          <p className="admin-page-subtitle">Manage system administrator nodes and operational staff hierarchies</p>
        </div>
      </div>

      <div className="display-admins-grid">
        {displayAdmins.map(admin => {
          const myStaffCount = staff.filter(s => s.createdByAdminId === admin.accountId).length;

          return (
            <div className="admin-node-card card" key={admin.id}>
              <div className="node-card-header">
                <div className="node-identity">
                  <span className="node-id-label">{admin.accountId}</span>
                  <h3 className="node-name">{admin.name}</h3>
                </div>
                <span className={`status-pill ${admin.status.toLowerCase()}`}>{admin.status}</span>
              </div>

              <div className="node-card-body">
                <div className="node-detail-row">
                  <span className="lbl">Email:</span>
                  <span className="val">{admin.email}</span>
                </div>
                <div className="node-detail-row">
                  <span className="lbl">Phone:</span>
                  <span className="val">{admin.phone}</span>
                </div>
                <div className="node-detail-row">
                  <span className="lbl">Staff Members:</span>
                  <span className="val highlight-count">{myStaffCount} active staff</span>
                </div>
                <div className="node-detail-row">
                  <span className="lbl">Node Created:</span>
                  <span className="val">{admin.createdAt}</span>
                </div>
              </div>

              <div className="node-card-actions">
                {session && session.role === 'Owner' && (
                  <button 
                    className={`btn-node-opt ${admin.status === 'Active' ? 'btn-red-outline' : 'btn-green-outline'}`}
                    onClick={() => toggleAdminStatus(admin.id, admin.status)}
                  >
                    {admin.status === 'Active' ? 'Suspend Node' : 'Activate Node'}
                  </button>
                )}
                <button 
                  className="btn-node-opt btn-blue-filled"
                  onClick={() => handleOpenCreateStaff(admin)}
                  disabled={admin.status !== 'Active'}
                >
                  + Add Staff Account
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Staff Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-admin">
            <div className="modal-header-admin">
              <h3>Create Staff Account under {selectedAdminId}</h3>
              <button onClick={() => { setShowModal(false); setFormError(''); setFormSuccess(''); }} style={{ fontSize: 18, color: '#94a3b8' }}>&times;</button>
            </div>
            <form onSubmit={handleCreateStaff}>
              <div className="modal-body-admin">
                {formError && <div className="inline-alert-error">{formError}</div>}
                {formSuccess && <div className="inline-alert-success">{formSuccess}</div>}
                <div className="form-group-admin">
                  <label>Staff Member Name</label>
                  <input type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} required placeholder="e.g. David Staff" />
                </div>
                <div className="form-group-admin">
                  <label>Email Address</label>
                  <input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required placeholder="david@wallmark.com" />
                </div>
                <div className="form-group-admin">
                  <label>Phone Number (Optional)</label>
                  <input type="text" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} placeholder="+1 999 888 777" />
                </div>
                <div className="form-group-admin">
                  <label>Department / Segment</label>
                  <input type="text" value={staffDept} onChange={(e) => setStaffDept(e.target.value)} placeholder="e.g. Customer Support" />
                </div>
                <div className="form-group-admin">
                  <label>Password</label>
                  <input type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required placeholder="••••••••" />
                </div>
              </div>
              <div className="modal-footer-admin">
                <button type="button" className="btn-modal-cancel" onClick={() => { setShowModal(false); setFormError(''); setFormSuccess(''); }}>Cancel</button>
                <button type="submit" className="btn-modal-submit">Create Staff Account</button>
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
          margin-bottom: 20px;
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
        .display-admins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .admin-node-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: var(--border-luxury);
        }
        .node-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: var(--border-glass);
          padding-bottom: 12px;
        }
        .node-identity {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .node-id-label {
          background-color: #fef3c7;
          color: #d97706;
          padding: 2px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 700;
          font-size: 11px;
          align-self: flex-start;
        }
        .node-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-admin-main);
        }
        .node-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
        }
        .node-detail-row {
          display: flex;
          justify-content: space-between;
        }
        .node-detail-row .lbl {
          color: var(--text-admin-light);
        }
        .node-detail-row .val {
          font-weight: 550;
          color: var(--text-admin-main);
        }
        .node-detail-row .highlight-count {
          color: #2563eb;
          font-weight: 600;
        }
        .node-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 12px;
          border-top: var(--border-glass);
        }
        .btn-node-opt {
          flex: 1;
          height: 34px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-red-outline {
          border: 1px solid #fca5a5;
          color: #b91c1c;
          background: none;
        }
        .btn-red-outline:hover {
          background-color: #fef2f2;
        }
        .btn-green-outline {
          border: 1px solid #86efac;
          color: #15803d;
          background: none;
        }
        .btn-green-outline:hover {
          background-color: #f0fdf4;
        }
        .btn-blue-filled {
          background-color: var(--color-primary);
          color: white;
        }
        .btn-blue-filled:disabled {
          background-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
}
