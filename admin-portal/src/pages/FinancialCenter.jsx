import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';
export default function FinancialCenter() {
  const [activeSubTab, setActiveSubTab] = useState('deposits');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [settings, setSettings] = useState({
    usdtAddress: 'TY3N9dSk8sHDKsi8s9DKks82kdJS9k1nsD',
    qrCodeUrl: ''
  });
  
  const [session, setSession] = useState({ role: 'Owner', name: 'System Owner', email: 'owner@wallmark.com' });
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Actions states
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(''); // 'view_slip', 'reject_deposit', 'reject_withdrawal'
  const [rejectRemark, setRejectRemark] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editQrCode, setEditQrCode] = useState('');
  const [imageZoom, setImageZoom] = useState(1);

  const fetchFinancialData = async () => {
    try {
      // Session
      const savedSession = localStorage.getItem('cb_admin_session');
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }

      // Deposits
      const { data: depsData, error: depsError } = await supabase
        .from('cb_deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (!depsError && depsData) {
        const mappedDeps = depsData.map(d => ({
          id: d.id,
          userId: d.user_id,
          username: d.username,
          amount: parseFloat(d.amount || 0),
          currency: d.currency,
          screenshotName: d.screenshot_name,
          screenshotUrl: d.screenshot_url,
          status: d.status,
          createdAt: new Date(d.created_at).toLocaleString(),
          referred_by_staff_id: d.referred_by_staff_id || 'None',
          member_of_admin_id: d.member_of_admin_id || 'None'
        }));
        setDeposits(mappedDeps);
      }

      // Withdrawals
      const { data: wthsData, error: wthsError } = await supabase
        .from('cb_withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!wthsError && wthsData) {
        const mappedWths = wthsData.map(w => ({
          id: w.id,
          userId: w.user_id,
          username: w.username,
          amount: parseFloat(w.amount || 0),
          method: w.method,
          account_info: w.account_info,
          status: w.status,
          createdAt: new Date(w.created_at).toLocaleString(),
          referred_by_staff_id: w.referred_by_staff_id || 'None',
          member_of_admin_id: w.member_of_admin_id || 'None',
          remark: w.remark || ''
        }));
        setWithdrawals(mappedWths);
      }

      // Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('cb_deposit_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!settingsError && settingsData) {
        const currentSettings = {
          usdtAddress: settingsData.usdt_address,
          qrCodeUrl: settingsData.qr_code_url || ''
        };
        setSettings(currentSettings);
        setEditAddress(currentSettings.usdtAddress);
        setEditQrCode(currentSettings.qrCodeUrl);
      }
    } catch (err) {
      console.error("Error loading financial data:", err);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    const interval = setInterval(fetchFinancialData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter listings based on role hierarchy
  const getFilteredDeposits = () => {
    return deposits.filter(d => {
      // 1. Role Filter
      if (session.role === 'Admin') {
        if (d.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (d.referred_by_staff_id !== session.accountId) return false;
      }
      
      // 2. Search query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = d.username.toLowerCase().includes(q) || 
                             d.id.toLowerCase().includes(q) ||
                             d.referred_by_staff_id.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All') {
        if (d.status !== statusFilter) return false;
      }

      return true;
    });
  };

  const getFilteredWithdrawals = () => {
    return withdrawals.filter(w => {
      // 1. Role Filter
      if (session.role === 'Admin') {
        if (w.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (w.referred_by_staff_id !== session.accountId) return false;
      }
      
      // 2. Search query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = w.username.toLowerCase().includes(q) || 
                             w.id.toLowerCase().includes(q) ||
                             w.referred_by_staff_id.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All') {
        if (w.status !== statusFilter) return false;
      }

      return true;
    });
  };

  /* ─── Actions ─── */
  const handleApproveDeposit = async (dep) => {
    if (window.confirm(`Are you sure you want to APPROVE deposit of $${dep.amount.toFixed(2)} for ${dep.username}?`)) {
      try {
        // 1. Get user to update balance
        const { data: userData, error: userError } = await supabase
          .from('cb_users')
          .select('id, balance')
          .eq('username', dep.username)
          .single();

        if (userError || !userData) {
          toast.error("Error fetching user for balance update: " + (userError?.message || "User not found"));
          return;
        }

        const newBalance = parseFloat((parseFloat(userData.balance || 0) + dep.amount).toFixed(2));

        // 2. Update user balance
        const { error: updateBalanceError } = await supabase
          .from('cb_users')
          .update({ balance: newBalance })
          .eq('id', userData.id);

        if (updateBalanceError) {
          toast.error("Error updating user balance: " + updateBalanceError.message);
          return;
        }

        // 3. Update deposit status
        const { error: updateDepError } = await supabase
          .from('cb_deposits')
          .update({ status: 'Approved' })
          .eq('id', dep.id);

        if (updateDepError) {
          toast.error("Error updating deposit status: " + updateDepError.message);
          return;
        }

        // Also sync local storage if it's currently active user (for development same-machine test convenience)
        const activeUser = localStorage.getItem('cb_username');
        if (activeUser && activeUser.toLowerCase() === dep.username.toLowerCase()) {
          localStorage.setItem('cb_balance', newBalance.toString());
        }

        toast.success('Deposit approved! User balance updated.');
        fetchFinancialData();
      } catch (err) {
        toast.error("Operation failed: " + err.message);
      }
    }
  };

  const handleOpenRejectDeposit = (dep) => {
    setSelectedItem(dep);
    setActionType('reject_deposit');
    setRejectRemark('');
  };

  const handleConfirmRejectDeposit = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('cb_deposits')
        .update({ status: 'Rejected' })
        .eq('id', selectedItem.id);

      if (error) {
        toast.error("Error rejecting deposit: " + error.message);
        return;
      }

      setSelectedItem(null);
      setActionType('');
      toast('Deposit request rejected.');
      fetchFinancialData();
    } catch (err) {
      toast.error("Failed to reject deposit: " + err.message);
    }
  };

  const handleApproveWithdrawal = async (wth) => {
    if (window.confirm(`Are you sure you want to APPROVE withdrawal of $${wth.amount.toFixed(2)} for ${wth.username}?`)) {
      try {
        // 1. Get user to update withdrawals counter
        const { data: userData, error: userError } = await supabase
          .from('cb_users')
          .select('id, withdrawals')
          .eq('username', wth.username)
          .single();

        if (userError || !userData) {
          toast.error("Error fetching user: " + (userError?.message || "User not found"));
          return;
        }

        const newWithdrawals = parseFloat((parseFloat(userData.withdrawals || 0) + wth.amount).toFixed(2));

        // 2. Update user withdrawals
        const { error: updateUserError } = await supabase
          .from('cb_users')
          .update({ withdrawals: newWithdrawals })
          .eq('id', userData.id);

        if (updateUserError) {
          toast.error("Error updating user withdrawals: " + updateUserError.message);
          return;
        }

        // 3. Update withdrawal status
        const { error: updateWthError } = await supabase
          .from('cb_withdrawals')
          .update({ status: 'Approved' })
          .eq('id', wth.id);

        if (updateWthError) {
          toast.error("Error updating withdrawal status: " + updateWthError.message);
          return;
        }

        toast.success('Withdrawal approved!');
        fetchFinancialData();
      } catch (err) {
        toast.error("Operation failed: " + err.message);
      }
    }
  };

  const handleOpenRejectWithdrawal = (wth) => {
    setSelectedItem(wth);
    setActionType('reject_withdrawal');
    setRejectRemark('');
  };

  const handleConfirmRejectWithdrawal = async () => {
    if (!selectedItem) return;

    try {
      // 1. Update status to Rejected
      const { error: updateWthError } = await supabase
        .from('cb_withdrawals')
        .update({ status: 'Rejected' })
        .eq('id', selectedItem.id);

      if (updateWthError) {
        toast.error("Error rejecting withdrawal: " + updateWthError.message);
        return;
      }

      // 2. Refund balance back to user
      const { data: userData, error: userError } = await supabase
        .from('cb_users')
        .select('id, balance')
        .eq('username', selectedItem.username)
        .single();

      if (!userError && userData) {
        const newBalance = parseFloat((parseFloat(userData.balance || 0) + selectedItem.amount).toFixed(2));
        await supabase
          .from('cb_users')
          .update({ balance: newBalance })
          .eq('id', userData.id);

        const activeUser = localStorage.getItem('cb_username');
        if (activeUser && activeUser.toLowerCase() === selectedItem.username.toLowerCase()) {
          localStorage.setItem('cb_balance', newBalance.toString());
        }
      }

      setSelectedItem(null);
      setActionType('');
      toast('Withdrawal request rejected. Funds refunded to user.');
      fetchFinancialData();
    } catch (err) {
      toast.error("Failed to reject withdrawal: " + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!editAddress) {
      toast('Please provide a valid USDT Address.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cb_deposit_settings')
        .update({ usdt_address: editAddress, qr_code_url: editQrCode })
        .eq('id', 1);

      if (error) {
        toast.error("Error saving settings: " + error.message);
        return;
      }

      setSettings({ usdtAddress: editAddress, qrCodeUrl: editQrCode });
      toast.success('Payment node settings saved successfully!');
      fetchFinancialData();
    } catch (err) {
      toast.error("Failed to save settings: " + err.message);
    }
  };

  const handleViewSlip = (dep) => {
    setSelectedItem(dep);
    setActionType('view_slip');
    setImageZoom(1);
  };

  const filteredDeps = getFilteredDeposits();
  const filteredWths = getFilteredWithdrawals();

  return (
    <div className="admin-page-container scale-up">
      <div className="financial-center-header">
        <div className="subtabs-navigation">
          <button 
            className={`subtab-btn ${activeSubTab === 'deposits' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('deposits'); setStatusFilter('All'); setSearchQuery(''); }}
          >
            📥 Deposit Requests ({filteredDeps.filter(d => d.status === 'Pending').length})
          </button>
          <button 
            className={`subtab-btn ${activeSubTab === 'withdrawals' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('withdrawals'); setStatusFilter('All'); setSearchQuery(''); }}
          >
            📤 Payout Requests ({filteredWths.filter(w => w.status === 'Pending').length})
          </button>
          <button 
            className={`subtab-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('settings'); }}
          >
            ⚙️ Payment settings
          </button>
        </div>
      </div>

      {activeSubTab !== 'settings' && (
        <div className="filter-controls-row">
          <div className="search-box-wrapper">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search username or request ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filter-wrapper">
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-admin-light)', marginRight: 6 }}>STATUS:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}

      {activeSubTab === 'deposits' && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Client User</th>
                <th>Staff Node</th>
                <th>Deposit Amount</th>
                <th>Network</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeps.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-admin-light)' }}>
                    No deposit requests match current filters.
                  </td>
                </tr>
              ) : (
                filteredDeps.map(dep => (
                  <tr key={dep.id}>
                    <td><b>{dep.id}</b></td>
                    <td>{dep.username}</td>
                    <td><span className="badge badge-node">{dep.referred_by_staff_id}</span></td>
                    <td style={{ color: 'var(--color-green)', fontWeight: 700 }}>$ {dep.amount.toFixed(2)}</td>
                    <td><span className="badge badge-currency">{dep.currency}</span></td>
                    <td>
                      <span className={`badge ${
                        dep.status === 'Approved' ? 'badge-success' : 
                        dep.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td>{dep.createdAt}</td>
                    <td>
                      <div className="action-buttons-cell">
                        <button className="action-btn btn-view" onClick={() => handleViewSlip(dep)}>🔍 Slip</button>
                        {dep.status === 'Pending' && (
                          <>
                            <button className="action-btn btn-approve" onClick={() => handleApproveDeposit(dep)}>✅ Approve</button>
                            <button className="action-btn btn-reject" onClick={() => handleOpenRejectDeposit(dep)}>❌ Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'withdrawals' && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Client User</th>
                <th>Staff Node</th>
                <th>Payout Amount</th>
                <th>Method</th>
                <th>Receiving Details</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWths.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-admin-light)' }}>
                    No payout requests match current filters.
                  </td>
                </tr>
              ) : (
                filteredWths.map(wth => (
                  <tr key={wth.id}>
                    <td><b>{wth.id}</b></td>
                    <td>{wth.username}</td>
                    <td><span className="badge badge-node">{wth.referred_by_staff_id}</span></td>
                    <td style={{ color: 'var(--color-orange)', fontWeight: 700 }}>$ {wth.amount.toFixed(2)}</td>
                    <td>{wth.method}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, maxWidth: 180, wordBreak: 'break-all' }}>
                      {wth.account_info}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className={`badge ${
                          wth.status === 'Approved' ? 'badge-success' : 
                          wth.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {wth.status}
                        </span>
                        {wth.remark && (
                          <span style={{ fontSize: 9, color: 'var(--text-admin-muted)' }}>
                            * {wth.remark}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{wth.createdAt}</td>
                    <td>
                      <div className="action-buttons-cell">
                        {wth.status === 'Pending' && (
                          <>
                            <button className="action-btn btn-approve" onClick={() => handleApproveWithdrawal(wth)}>✅ Approve</button>
                            <button className="action-btn btn-reject" onClick={() => handleOpenRejectWithdrawal(wth)}>❌ Reject</button>
                          </>
                        )}
                        {wth.status !== 'Pending' && <span style={{ color: 'var(--text-admin-light)', fontSize: 11 }}>Locked</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="admin-card" style={{ maxWidth: 600 }}>
          <h3 className="section-title" style={{ marginBottom: 16 }}>Payment Node Gateway Settings</h3>
          <form onSubmit={handleSaveSettings} className="settings-form-layout">
            <div className="form-group-sla">
              <label>USDT Wallet Receive Address (TRC20)</label>
              <input 
                type="text" 
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                disabled={session.role === 'Staff'}
                required
                className="input-sla-field"
                placeholder="e.g. TY3N9dSk8sHDKsi8s..."
              />
            </div>
            
            <div className="form-group-sla">
              <label>QR Code Image URL (Optional)</label>
              <input 
                type="text" 
                value={editQrCode}
                onChange={(e) => setEditQrCode(e.target.value)}
                disabled={session.role === 'Staff'}
                className="input-sla-field"
                placeholder="e.g. https://domain.com/receipt-qr.png"
              />
            </div>

            {session.role !== 'Staff' ? (
              <button type="submit" className="sla-submit-btn" style={{ marginTop: 12 }}>
                💾 Save Payment Configuration
              </button>
            ) : (
              <div style={{ color: 'var(--text-admin-light)', fontSize: 12, marginTop: 12 }}>
                * Staff nodes are not authorized to modify payment settings.
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal overlays */}
      {actionType === 'view_slip' && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>Receipt Image - {selectedItem.id}</h3>
              <button className="modal-close-btn" onClick={() => { setSelectedItem(null); setActionType(''); }}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ fontSize: 12, color: 'var(--text-admin-light)', marginBottom: 8 }}>
                Uploaded File: <b>{selectedItem.screenshotName}</b>
              </p>
              <div style={{ width: '100%', overflow: 'auto', maxHeight: '500px' }}>
                <img 
                  src={selectedItem.screenshotUrl} 
                  alt="Receipt Slip" 
                  style={{ 
                    maxWidth: '100%', 
                    objectFit: 'contain', 
                    borderRadius: 6, 
                    border: '1px solid var(--border-color)', 
                    display: 'block', 
                    margin: '0 auto',
                    transform: `scale(${imageZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-admin)' }}>Zoom:</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.1" 
                  value={imageZoom} 
                  onChange={(e) => setImageZoom(parseFloat(e.target.value))} 
                  style={{ width: '200px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-admin-light)', width: '30px' }}>{imageZoom}x</span>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="action-btn btn-view" onClick={() => { setSelectedItem(null); setActionType(''); }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {(actionType === 'reject_deposit' || actionType === 'reject_withdrawal') && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>Reject Request - {selectedItem.id}</h3>
              <button className="modal-close-btn" onClick={() => { setSelectedItem(null); setActionType(''); }}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '12px 0' }}>
              <p style={{ fontSize: 13, marginBottom: 8 }}>
                Provide reason for rejecting the request of <b>$ {selectedItem.amount.toFixed(2)}</b> for <b>{selectedItem.username}</b>:
              </p>
              <textarea 
                className="input-sla-field"
                style={{ height: '80px', width: '100%', padding: 10 }}
                placeholder="e.g. Invalid transaction receipt, wrong network address"
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
              />
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button 
                className="action-btn" 
                style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-admin-muted)' }}
                onClick={() => { setSelectedItem(null); setActionType(''); }}
              >
                Cancel
              </button>
              <button 
                className="action-btn btn-reject"
                onClick={actionType === 'reject_deposit' ? handleConfirmRejectDeposit : handleConfirmRejectWithdrawal}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .financial-center-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .subtabs-navigation {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--border-color);
          width: 100%;
          padding-bottom: 6px;
        }

        .subtab-btn {
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-admin-light);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .subtab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .filter-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
        }

        .search-box-wrapper {
          position: relative;
          flex: 1;
          max-width: 360px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 10px;
          color: var(--text-admin-light);
        }

        .search-input {
          height: 36px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-admin-card);
          padding-left: 36px;
          padding-right: 12px;
          font-size: 13px;
          color: var(--text-admin-main);
          outline: none;
        }

        .search-input:focus {
          border-color: var(--color-primary);
        }

        .status-filter-wrapper {
          display: flex;
          align-items: center;
        }

        .status-select-filter {
          height: 36px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-admin-card);
          padding: 0 10px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-admin-muted);
          cursor: pointer;
        }

        .status-select-filter:focus {
          border-color: var(--color-primary);
        }

        .badge-currency {
          background-color: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .badge-node {
          background-color: var(--bg-surface-hover);
          color: var(--text-admin-muted);
          font-weight: 600;
        }

        .action-buttons-cell {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          height: 28px;
          padding: 0 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .btn-approve {
          background-color: #ecfdf5;
          color: #10b981;
        }

        .btn-reject {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .settings-form-layout {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group-sla {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group-sla label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-admin-light);
          text-transform: uppercase;
        }

        .input-sla-field {
          height: 38px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          padding: 0 12px;
          font-size: 13px;
          color: var(--text-admin-main);
          background-color: #f8fafc;
          outline: none;
        }

        .input-sla-field:focus {
          background-color: white;
          border-color: var(--color-primary);
        }

        .sla-submit-btn {
          height: 40px;
          border-radius: 6px;
          background-color: var(--color-primary);
          color: white;
          font-weight: 600;
          font-size: 13px;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(37,99,235,0.2);
        }

        .sla-submit-btn:hover {
          background-color: var(--color-primary-hover);
        }

        /* Modal Overlay styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15,23,42,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content-card {
          background-color: var(--bg-admin-card);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-shadow: var(--shadow-admin-lg);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-admin-main);
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 16px;
          color: var(--text-admin-light);
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
}
