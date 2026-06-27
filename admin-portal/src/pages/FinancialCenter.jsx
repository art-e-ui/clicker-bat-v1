import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Search, DollarSign, Briefcase, Check, Info, AlertCircle, X, Eye } from 'lucide-react';
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
    <div className="w-full space-y-6">
      
      {/* Header and Subtabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50 text-xl tracking-tight flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-500" />
              Financial Center
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage deposits, approve payouts, and configure payment gateways.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            <button 
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSubTab === 'deposits' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              onClick={() => { setActiveSubTab('deposits'); setStatusFilter('All'); setSearchQuery(''); }}
            >
              Deposits ({filteredDeps.filter(d => d.status === 'Pending').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSubTab === 'withdrawals' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              onClick={() => { setActiveSubTab('withdrawals'); setStatusFilter('All'); setSearchQuery(''); }}
            >
              Payouts ({filteredWths.filter(w => w.status === 'Pending').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSubTab === 'settings' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              onClick={() => { setActiveSubTab('settings'); }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {activeSubTab !== 'settings' && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search username or request ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:block">Status:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none appearance-none w-full md:w-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px'
              }}
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
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap">Request ID</th>
                  <th className="px-6 py-4">Client User</th>
                  <th className="px-6 py-4">Staff Node</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Network</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDeps.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No deposit requests match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredDeps.map(dep => (
                    <tr key={dep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500">{dep.id.substring(0,8)}...</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-50">{dep.username}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs font-semibold">{dep.referred_by_staff_id}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ${dep.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800 text-[10px] font-bold tracking-wider">{dep.currency}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          dep.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                          dep.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 
                          'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{dep.createdAt}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => handleViewSlip(dep)}
                          >
                            <Eye className="w-3.5 h-3.5" /> Slip
                          </button>
                          {dep.status === 'Pending' && (
                            <>
                              <button 
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                                onClick={() => handleApproveDeposit(dep)}
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button 
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                                onClick={() => handleOpenRejectDeposit(dep)}
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
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
        </div>
      )}

      {activeSubTab === 'withdrawals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap">Request ID</th>
                  <th className="px-6 py-4">Client User</th>
                  <th className="px-6 py-4">Staff Node</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Method & Details</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWths.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No payout requests match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredWths.map(wth => (
                    <tr key={wth.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500">{wth.id.substring(0,8)}...</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-50">{wth.username}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs font-semibold">{wth.referred_by_staff_id}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                        ${wth.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{wth.method}</div>
                        <div className="font-mono text-[10px] text-slate-500 break-all max-w-[200px]">{wth.account_info}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            wth.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                            wth.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 
                            'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}>
                            {wth.status}
                          </span>
                          {wth.remark && (
                            <span className="text-[9px] text-slate-400 max-w-[120px] text-center leading-tight">
                              * {wth.remark}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{wth.createdAt}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <div className="flex justify-end gap-2">
                          {wth.status === 'Pending' ? (
                            <>
                              <button 
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                                onClick={() => handleApproveWithdrawal(wth)}
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button 
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                                onClick={() => handleOpenRejectWithdrawal(wth)}
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              Locked
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm max-w-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg">Payment Node Gateway Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure system-wide payment receiving details</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">USDT Wallet Receive Address (TRC20)</label>
              <input 
                type="text" 
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                disabled={session.role === 'Staff'}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all disabled:opacity-60"
                placeholder="e.g. TY3N9dSk8sHDKsi8s..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">QR Code Image URL (Optional)</label>
              <input 
                type="text" 
                value={editQrCode}
                onChange={(e) => setEditQrCode(e.target.value)}
                disabled={session.role === 'Staff'}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all disabled:opacity-60"
                placeholder="e.g. https://domain.com/receipt-qr.png"
              />
            </div>

            {session.role !== 'Staff' ? (
              <button 
                type="submit" 
                className="w-full sm:w-auto mt-4 px-6 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                Save Payment Configuration
              </button>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <p>Staff nodes are not authorized to modify payment gateway settings. Please contact the main administrator.</p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal overlays */}
      {actionType === 'view_slip' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" />
                Receipt Image
                <span className="text-sm font-mono text-slate-400 ml-2">#{selectedItem.id.substring(0,8)}</span>
              </h3>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                onClick={() => { setSelectedItem(null); setActionType(''); }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                Uploaded File: <b className="font-mono ml-1">{selectedItem.screenshotName}</b>
              </p>
              
              <div className="w-full overflow-auto max-h-[500px] flex items-center justify-center bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
                <img 
                  src={selectedItem.screenshotUrl} 
                  alt="Receipt Slip" 
                  style={{ 
                    transform: `scale(${imageZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease'
                  }}
                  className="max-w-full rounded-xl object-contain shadow-sm"
                />
              </div>
              
              <div className="mt-6 flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.1" 
                  value={imageZoom} 
                  onChange={(e) => setImageZoom(parseFloat(e.target.value))} 
                  className="w-48 accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-500 w-8">{imageZoom}x</span>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
              <button 
                className="px-5 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
                onClick={() => { setSelectedItem(null); setActionType(''); }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {(actionType === 'reject_deposit' || actionType === 'reject_withdrawal') && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Reject Request
              </h3>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                onClick={() => { setSelectedItem(null); setActionType(''); }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                Provide a reason for rejecting the request of <b className="text-rose-600 dark:text-rose-400 font-mono">${selectedItem.amount.toFixed(2)}</b> for user <b className="font-semibold">{selectedItem.username}</b>:
              </p>
              <textarea 
                className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                placeholder="e.g. Invalid transaction receipt, incorrect network..."
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
              />
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button 
                className="px-5 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
                onClick={() => { setSelectedItem(null); setActionType(''); }}
              >
                Cancel
              </button>
              <button 
                className="px-5 h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-[0.98]"
                onClick={actionType === 'reject_deposit' ? handleConfirmRejectDeposit : handleConfirmRejectWithdrawal}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
