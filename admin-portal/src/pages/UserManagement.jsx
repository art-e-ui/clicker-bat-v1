import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnline, setFilterOnline] = useState('All');

  // Edit modal
  const [editUser, setEditUser] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [saving, setSaving] = useState(false);

  // View details modal
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('cb_users')
        .select('*')
        .order('reg_time', { ascending: false });

      if (!error && data) {
        const session = JSON.parse(localStorage.getItem('cb_admin_session') || '{}');
        let mapped = data.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          phone: u.phone,
          password_plain: u.password_plain || '',
          nickname: u.nickname || '',
          level: u.level || 1,
          online: u.online || 'Offline',
          balance: parseFloat(u.balance || 0),
          frozen: parseFloat(u.frozen || 0),
          earnings: parseFloat(u.earnings || 0),
          commissions: parseFloat(u.commissions || 0),
          withdrawals: parseFloat(u.withdrawals || 0),
          topup: parseFloat(u.topup || 0),
          usdt_address: u.usdt_address || '',
          bank_name: u.bank_name || '',
          bank_account: u.bank_account || '',
          bank_holder: u.bank_holder || '',
          withdraw: u.withdraw || 'Enable',
          inviteCode: u.invite_code || '',
          inviter: u.inviter || '',
          referred_by_staff_id: u.referred_by_staff_id || '',
          member_of_admin_id: u.member_of_admin_id || '',
          ip: u.ip || '',
          regTime: new Date(u.reg_time).toLocaleDateString(),
        }));

        // Role-based filter
        if (session.role === 'Admin') {
          mapped = mapped.filter(u => u.member_of_admin_id === session.accountId);
        } else if (session.role === 'Staff') {
          mapped = mapped.filter(u => u.referred_by_staff_id === session.accountId);
        }

        setUsers(mapped);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...users];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    if (filterOnline !== 'All') {
      result = result.filter(u => u.online === filterOnline);
    }
    setFilteredUsers(result);
  }, [users, searchQuery, filterOnline]);

  const openEdit = (user) => {
    setEditUser(user);
    setEditFields({
      username: user.username,
      email: user.email,
      phone: user.phone,
      password_plain: user.password_plain,
      balance: user.balance.toString(),
      frozen: user.frozen.toString(),
      usdt_address: user.usdt_address,
      bank_name: user.bank_name,
      bank_account: user.bank_account,
      bank_holder: user.bank_holder,
      withdraw: user.withdraw,
      level: user.level.toString(),
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const updates = {
        username: editFields.username.trim(),
        email: editFields.email.trim(),
        phone: editFields.phone.trim(),
        password_plain: editFields.password_plain.trim(),
        balance: parseFloat(editFields.balance) || 0,
        frozen: parseFloat(editFields.frozen) || 0,
        usdt_address: editFields.usdt_address.trim(),
        bank_name: editFields.bank_name.trim(),
        bank_account: editFields.bank_account.trim(),
        bank_holder: editFields.bank_holder.trim(),
        withdraw: editFields.withdraw,
        level: parseInt(editFields.level) || 1,
      };

      const { error } = await supabase
        .from('cb_users')
        .update(updates)
        .eq('id', editUser.id);

      if (error) {
        toast.error('Error saving: ' + error.message);
        return;
      }
      toast.success(`User ${editUser.username} updated successfully!`);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`⚠️ Are you sure you want to permanently delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      // Delete related records first
      await supabase.from('cb_orders').delete().eq('username', user.username);
      await supabase.from('cb_assigned_tasks').delete().eq('username', user.username);
      await supabase.from('cb_deposits').delete().eq('username', user.username);
      await supabase.from('cb_withdrawals').delete().eq('username', user.username);

      // Delete user
      const { error } = await supabase.from('cb_users').delete().eq('id', user.id);
      if (error) {
        toast.error('Error deleting user: ' + error.message);
        return;
      }
      toast.success(`User ${user.username} and all related data deleted.`);
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleToggleWithdraw = async (user) => {
    const newVal = user.withdraw === 'Enable' ? 'Disable' : 'Enable';
    await supabase.from('cb_users').update({ withdraw: newVal }).eq('id', user.id);
    toast(`Withdrawal ${newVal}d for ${user.username}.`);
    fetchUsers();
  };

  return (
    <div className="admin-page-container scale-up">
      {/* Header & search */}
      <div className="admin-card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            User Management
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-admin-light)', marginLeft: 10 }}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by name, email, phone, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ height: 36, padding: '0 12px', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: 13, width: 260, background: 'var(--bg-admin)', color: 'var(--text-admin)' }}
              id="search-users-input"
            />
            <select
              value={filterOnline}
              onChange={e => setFilterOnline(e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: 13, background: 'var(--bg-admin)', color: 'var(--text-admin)' }}
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive-wrapper" style={{ marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>Account</th>
              <th style={{ width: 160 }}>Contact Info</th>
              <th style={{ width: 160 }}>Balances</th>
              <th style={{ width: 180 }}>Withdrawal Address</th>
              <th style={{ width: 120 }}>Stats</th>
              <th style={{ width: 80 }}>Withdraw</th>
              <th style={{ width: 180, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-admin-light)' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} id={`row-user-${u.id}`}>
                  <td>
                    <div className="info-block">
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{u.username}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-admin-light)' }}>{u.id.substring(0, 12)}…</div>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: u.online === 'Online' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: u.online === 'Online' ? '#10b981' : '#64748b', fontWeight: 600 }}>
                          ● {u.online}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-admin-light)', marginTop: 3 }}>Reg: {u.regTime}</div>
                    </div>
                  </td>
                  <td>
                    <div className="info-block">
                      <div className="info-row"><span className="info-label">Email:</span><span className="info-value" style={{ fontSize: 10, wordBreak: 'break-all' }}>{u.email}</span></div>
                      <div className="info-row"><span className="info-label">Phone:</span><span className="info-value">{u.phone}</span></div>
                      <div className="info-row"><span className="info-label">IP:</span><span className="info-value">{u.ip}</span></div>
                      <div className="info-row"><span className="info-label">Inviter:</span><span className="info-value">{u.inviter || '—'}</span></div>
                    </div>
                  </td>
                  <td>
                    <div className="info-block">
                      <div className="info-row">
                        <span className="info-label">Balance:</span>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>$ {u.balance.toFixed(2)}</span>
                      </div>
                      <div className="info-row"><span className="info-label">Frozen:</span><span className="info-value">$ {u.frozen.toFixed(2)}</span></div>
                      <div className="info-row"><span className="info-label">Deposited:</span><span className="info-value">$ {u.topup.toFixed(2)}</span></div>
                    </div>
                  </td>
                  <td>
                    <div className="info-block">
                      {u.usdt_address ? (
                        <div style={{ fontSize: 10, color: 'var(--text-admin)', wordBreak: 'break-all', marginBottom: 4 }}>
                          <b>USDT:</b> {u.usdt_address.substring(0, 16)}…
                        </div>
                      ) : (
                        <div style={{ fontSize: 10, color: 'var(--text-admin-light)' }}>No USDT address</div>
                      )}
                      {u.bank_name && (
                        <div style={{ fontSize: 10, color: 'var(--text-admin)', marginTop: 4 }}>
                          <b>Bank:</b> {u.bank_name}<br />
                          <b>A/C:</b> {u.bank_account}<br />
                          <b>Holder:</b> {u.bank_holder}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="info-block">
                      <div className="info-row"><span className="info-label">Earnings:</span><span className="info-value">$ {u.earnings.toFixed(2)}</span></div>
                      <div className="info-row"><span className="info-label">Withdrew:</span><span className="info-value">$ {u.withdrawals.toFixed(2)}</span></div>
                      <div className="info-row"><span className="info-label">Level:</span><span className="info-value">VIP {u.level}</span></div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleWithdraw(u)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: u.withdraw === 'Enable' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: u.withdraw === 'Enable' ? '#10b981' : '#ef4444',
                      }}
                      id={`btn-toggle-withdraw-${u.id}`}
                    >
                      {u.withdraw === 'Enable' ? '✓ Enabled' : '✕ Disabled'}
                    </button>
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        className="btn-row-action btn-blue"
                        onClick={() => setViewUser(u)}
                        id={`btn-view-${u.id}`}
                      >
                        View
                      </button>
                      <button
                        className="btn-row-action btn-green"
                        onClick={() => openEdit(u)}
                        id={`btn-edit-${u.id}`}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-row-action btn-reject"
                        onClick={() => handleDeleteUser(u)}
                        id={`btn-delete-${u.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>✏️ Edit User — {editUser.username}</h3>
              <button className="modal-close-btn" onClick={() => setEditUser(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 20px' }}>

              <p style={{ fontSize: 11, color: '#ef4444', background: 'rgba(239,68,68,0.06)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>
                ⚠️ Changes here affect the user's account in real-time. Be careful.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group-sla">
                  <label>Username</label>
                  <input type="text" value={editFields.username} onChange={e => setEditFields(f => ({ ...f, username: e.target.value }))} className="input-sla-field" id="edit-username" />
                </div>
                <div className="form-group-sla">
                  <label>Email</label>
                  <input type="email" value={editFields.email} onChange={e => setEditFields(f => ({ ...f, email: e.target.value }))} className="input-sla-field" id="edit-email" />
                </div>
                <div className="form-group-sla">
                  <label>Phone</label>
                  <input type="text" value={editFields.phone} onChange={e => setEditFields(f => ({ ...f, phone: e.target.value }))} className="input-sla-field" id="edit-phone" />
                </div>
                <div className="form-group-sla">
                  <label>Password (plain)</label>
                  <input type="text" value={editFields.password_plain} onChange={e => setEditFields(f => ({ ...f, password_plain: e.target.value }))} className="input-sla-field" id="edit-password" />
                </div>
                <div className="form-group-sla">
                  <label>Balance ($)</label>
                  <input type="number" step="0.01" value={editFields.balance} onChange={e => setEditFields(f => ({ ...f, balance: e.target.value }))} className="input-sla-field" id="edit-balance" />
                </div>
                <div className="form-group-sla">
                  <label>Frozen ($)</label>
                  <input type="number" step="0.01" value={editFields.frozen} onChange={e => setEditFields(f => ({ ...f, frozen: e.target.value }))} className="input-sla-field" id="edit-frozen" />
                </div>
                <div className="form-group-sla">
                  <label>VIP Level</label>
                  <select value={editFields.level} onChange={e => setEditFields(f => ({ ...f, level: e.target.value }))} className="input-sla-field" id="edit-level">
                    <option value="1">VIP 1</option>
                    <option value="2">VIP 2</option>
                    <option value="3">VIP 3</option>
                    <option value="4">VIP 4</option>
                    <option value="5">VIP 5</option>
                  </select>
                </div>
                <div className="form-group-sla">
                  <label>Withdrawal</label>
                  <select value={editFields.withdraw} onChange={e => setEditFields(f => ({ ...f, withdraw: e.target.value }))} className="input-sla-field" id="edit-withdraw">
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-admin-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Withdrawal Address Info</p>
                <div className="form-group-sla">
                  <label>USDT Address</label>
                  <input type="text" value={editFields.usdt_address} onChange={e => setEditFields(f => ({ ...f, usdt_address: e.target.value }))} className="input-sla-field" placeholder="TRC20 / ERC20 address" id="edit-usdt-address" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                  <div className="form-group-sla">
                    <label>Bank Name</label>
                    <input type="text" value={editFields.bank_name} onChange={e => setEditFields(f => ({ ...f, bank_name: e.target.value }))} className="input-sla-field" id="edit-bank-name" />
                  </div>
                  <div className="form-group-sla">
                    <label>Account Number</label>
                    <input type="text" value={editFields.bank_account} onChange={e => setEditFields(f => ({ ...f, bank_account: e.target.value }))} className="input-sla-field" id="edit-bank-account" />
                  </div>
                  <div className="form-group-sla">
                    <label>Account Holder</label>
                    <input type="text" value={editFields.bank_holder} onChange={e => setEditFields(f => ({ ...f, bank_holder: e.target.value }))} className="input-sla-field" id="edit-bank-holder" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
              <button className="action-btn btn-reject" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setEditUser(null)}>Cancel</button>
              <button className="action-btn btn-approve" style={{ fontSize: 13, padding: '8px 20px' }} onClick={handleSaveEdit} disabled={saving} id="btn-save-edit">
                {saving ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewUser && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>👤 User Details — {viewUser.username}</h3>
              <button className="modal-close-btn" onClick={() => setViewUser(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['User ID', viewUser.id],
                ['Username', viewUser.username],
                ['Email', viewUser.email],
                ['Phone', viewUser.phone],
                ['Password', viewUser.password_plain || '(hidden)'],
                ['VIP Level', `VIP ${viewUser.level}`],
                ['Balance', `$${viewUser.balance.toFixed(2)}`],
                ['Frozen', `$${viewUser.frozen.toFixed(2)}`],
                ['Total Deposited', `$${viewUser.topup.toFixed(2)}`],
                ['Total Earnings', `$${viewUser.earnings.toFixed(2)}`],
                ['Total Withdrew', `$${viewUser.withdrawals.toFixed(2)}`],
                ['Invite Code', viewUser.inviteCode],
                ['Inviter', viewUser.inviter || '—'],
                ['Staff Node', viewUser.referred_by_staff_id || '—'],
                ['Admin Node', viewUser.member_of_admin_id || '—'],
                ['Register IP', viewUser.ip],
                ['Reg Date', viewUser.regTime],
                ['USDT Address', viewUser.usdt_address || '—'],
                ['Bank Name', viewUser.bank_name || '—'],
                ['Bank Account', viewUser.bank_account || '—'],
                ['Account Holder', viewUser.bank_holder || '—'],
                ['Withdrawal', viewUser.withdraw],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
                  <span style={{ minWidth: 130, color: 'var(--text-admin-muted)', fontWeight: 600, fontSize: 11 }}>{label}</span>
                  <span style={{ flex: 1, wordBreak: 'break-all', color: 'var(--text-admin)' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="action-btn btn-blue" onClick={() => { setViewUser(null); openEdit(viewUser); }}>✏️ Edit</button>
              <button className="action-btn btn-reject" onClick={() => { setViewUser(null); handleDeleteUser(viewUser); }}>🗑 Delete</button>
              <button className="action-btn btn-gray" onClick={() => setViewUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeOverlayIn 0.2s ease-out;
        }

        @keyframes fadeOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          width: 90%;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          animation: slideModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideModalIn {
          from { transform: scale(0.96) translateY(8px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: #0d172a;
          margin: 0;
        }

        .modal-close-btn {
          background: #f1f5f9;
          border: none;
          font-size: 12px;
          color: #64748b;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
          margin-top: 8px;
        }

        .form-group-sla {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group-sla label {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-sla-field {
          height: 38px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          padding: 0 12px;
          font-size: 13px;
          color: #0f172a;
          background-color: #f8fafc;
          outline: none;
          transition: all 0.15s ease;
        }

        .input-sla-field:focus {
          background-color: #ffffff;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(53, 28, 150, 0.12);
        }

        select.input-sla-field {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 32px;
        }

        .action-btn {
          height: 38px;
          padding: 0 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .action-btn.btn-approve {
          background-color: #10b981;
          color: #ffffff !important;
        }
        .action-btn.btn-approve:hover {
          background-color: #059669;
          transform: translateY(-0.5px);
        }

        .action-btn.btn-reject {
          background-color: #ef4444;
          color: #ffffff !important;
        }
        .action-btn.btn-reject:hover {
          background-color: #dc2626;
          transform: translateY(-0.5px);
        }

        .action-btn.btn-blue {
          background-color: var(--color-primary);
          color: #ffffff !important;
        }
        .action-btn.btn-blue:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-0.5px);
        }

        .action-btn.btn-gray {
          background-color: #f1f5f9;
          color: #475569 !important;
        }
        .action-btn.btn-gray:hover {
          background-color: #e2e8f0;
          color: #0f172a !important;
        }
      `}</style>
    </div>
  );
}
