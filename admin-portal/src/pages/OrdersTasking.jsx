import React, { useState, useEffect } from 'react';
import { PRODUCT_CATALOG } from '../data/products';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';
export default function OrdersTasking() {
  const [users, setUsers] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [session, setSession] = useState({ role: 'Owner', name: 'System Owner', email: 'owner@wallmark.com' });
  const [searchQuery, setSearchQuery] = useState('');

  // Form assignment states
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState('1000');
  const [orderCount, setOrderCount] = useState('5');
  const [profitPercent, setProfitPercent] = useState('5');
  const [showModal, setShowModal] = useState(false);
  const [newAssignOrders, setNewAssignOrders] = useState([]);

  // Edit Worksheet Orders states
  const [showEditOrdersModal, setShowEditOrdersModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingOrders, setEditingOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchUsersAndTasks = async () => {
    try {
      // Session
      const savedSession = localStorage.getItem('cb_admin_session');
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }

      // Users
      const { data: usersData, error: usersError } = await supabase
        .from('cb_users')
        .select('*')
        .order('reg_time', { ascending: false });

      if (!usersError && usersData) {
        const mappedUsers = usersData.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          phone: u.phone,
          nickname: u.nickname,
          level: u.level,
          rate: u.rate,
          acceptance: u.acceptance,
          online: u.online,
          balance: parseFloat(u.balance || 0),
          frozen: parseFloat(u.frozen || 0),
          topup: parseFloat(u.topup || 0),
          spentToday: parseFloat(u.spent_today || 0),
          spentCurrent: parseFloat(u.spent_current || 0),
          remaining: u.remaining,
          withdraw: u.withdraw,
          tpRecharge: parseFloat(u.tp_recharge || 0),
          beRecharge: parseFloat(u.be_recharge || 0),
          earnings: parseFloat(u.earnings || 0),
          commissions: parseFloat(u.commissions || 0),
          withdrawals: parseFloat(u.withdrawals || 0),
          inviteCode: u.invite_code,
          subs: u.subs,
          inviter: u.inviter,
          referred_by_staff_id: u.referred_by_staff_id,
          member_of_admin_id: u.member_of_admin_id,
          referral_id: u.referral_id,
          l1Agent: u.l1_agent,
          l2Agent: u.l2_agent,
          ip: u.ip,
          regTime: new Date(u.reg_time).toLocaleDateString()
        }));
        setUsers(mappedUsers);
      }

      // Assigned Tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('cb_assigned_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!tasksError && tasksData) {
        const mappedTasks = tasksData.map(t => ({
          id: t.id,
          userId: t.user_id,
          username: t.username,
          totalAmount: parseFloat(t.total_amount || 0),
          orderCount: t.order_count,
          profitPercent: parseFloat(t.profit_percent || 0),
          status: t.status,
          createdAt: new Date(t.created_at).toLocaleString(),
          assignedBy: t.assigned_by,
          orders: typeof t.orders === 'string' ? JSON.parse(t.orders) : t.orders,
          referred_by_staff_id: t.referred_by_staff_id || 'None',
          member_of_admin_id: t.member_of_admin_id || 'None'
        }));
        setAssignedTasks(mappedTasks);
      }
    } catch (err) {
      console.error("Error loading users and tasks:", err);
    }
  };

  const loadProducts = async () => {
    try {
      let activeProducts = PRODUCT_CATALOG;
      const { data: dbProducts } = await supabase.from('cb_products').select('*');
      if (dbProducts && dbProducts.length > 0) {
        activeProducts = dbProducts.map(p => ({
          title: p.title,
          image: p.image_url || p.image,
          price: parseFloat(p.price || 0),
          profit: parseFloat(p.profit || 0)
        }));
      }
      setProducts(activeProducts);
    } catch (err) {
      console.error("Error loading products catalog:", err);
    }
  };

  useEffect(() => {
    fetchUsersAndTasks();
    loadProducts();
    const interval = setInterval(fetchUsersAndTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hierarchy filter based on role permissions
  const getFilteredUsers = () => {
    return users.filter(u => {
      // Role Node checking
      if (session.role === 'Admin') {
        if (u.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (u.referred_by_staff_id !== session.accountId) return false;
      }

      // Search checking
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.username.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      }

      return true;
    });
  };

  const getFilteredTasks = () => {
    return assignedTasks.filter(t => {
      // Role Node checking
      if (session.role === 'Admin') {
        if (t.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (t.referred_by_staff_id !== session.accountId) return false;
      }
      return true;
    });
  };

  const handleOpenAssignModal = (user) => {
    // Check if user has an active task already
    const activeTask = assignedTasks.find(t => 
      t.username.toLowerCase() === user.username.toLowerCase() && 
      (t.status === 'Pending' || t.status === 'In Progress')
    );

    if (activeTask) {
      toast.error(`User ${user.username} already has an active task in progress (${activeTask.status}). Please complete or cancel it before assigning a new one.`);
      return;
    }

    setSelectedUser(user);
    // Initialize with 1 empty manual order
    setNewAssignOrders([
      { title: '', image: '', price: '100', profit: '10', status: 'Pending' }
    ]);
    setShowModal(true);
  };

  const handleOrderCountChange = (valStr) => {
    let count = parseInt(valStr || '0');
    if (isNaN(count)) count = 0;
    if (count < 1) count = 1;
    if (count > 40) count = 40;

    setNewAssignOrders((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ title: '', image: '', price: '100', profit: '10', status: 'Pending' });
        }
      } else if (count < next.length) {
        return next.slice(0, count);
      }
      return next;
    });
  };

  const handleAddOrder = () => {
    setNewAssignOrders((prev) => [
      ...prev,
      { title: '', image: '', price: '100', profit: '10', status: 'Pending' }
    ]);
  };

  const handleRemoveOrder = (idx) => {
    setNewAssignOrders((prev) => {
      if (prev.length <= 1) {
        toast.error("A task must have at least one order.");
        return prev;
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (newAssignOrders.length === 0) {
      toast.error("Please add at least one order to the task.");
      return;
    }

    // Validate all manual orders
    for (let idx = 0; idx < newAssignOrders.length; idx++) {
      const o = newAssignOrders[idx];
      if (!o.title) {
        toast.error(`Order #${idx + 1} has no product selected/configured.`);
        return;
      }
      const priceVal = parseFloat(o.price);
      const profitVal = parseFloat(o.profit);
      if (isNaN(priceVal) || priceVal <= 0) {
        toast.error(`Order #${idx + 1} must have a valid positive price.`);
        return;
      }
      if (isNaN(profitVal) || profitVal < 0) {
        toast.error(`Order #${idx + 1} must have a valid positive commission.`);
        return;
      }
    }

    // Compute totals
    const totalAmountSum = newAssignOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
    const totalProfitSum = newAssignOrders.reduce((sum, o) => sum + parseFloat(o.profit || 0), 0);
    const orderCountVal = newAssignOrders.length;
    const computedProfitPercent = totalAmountSum > 0 ? parseFloat(((totalProfitSum / totalAmountSum) * 100).toFixed(2)) : 0;

    // Generate unique order IDs
    const ordersWithIds = newAssignOrders.map((o, idx) => ({
      id: Date.now() + idx,
      title: o.title,
      image: o.image || null,
      price: parseFloat(o.price),
      profit: parseFloat(o.profit),
      status: 'Pending'
    }));

    const newTask = {
      id: 'TSK-' + Math.floor(10000 + Math.random() * 90000),
      user_id: selectedUser.id,
      username: selectedUser.username,
      total_amount: totalAmountSum,
      order_count: orderCountVal,
      profit_percent: computedProfitPercent,
      status: 'Pending',
      created_at: new Date().toISOString(),
      assigned_by: session.name,
      orders: ordersWithIds,
      referred_by_staff_id: selectedUser.referred_by_staff_id || null,
      member_of_admin_id: selectedUser.member_of_admin_id || null
    };

    try {
      const { error } = await supabase
        .from('cb_assigned_tasks')
        .insert([newTask]);

      if (error) {
        toast.error("Error assigning task: " + error.message);
        return;
      }

      // Pre-populate cb_orders so the user sees them immediately in the Pending tab
      const dbOrders = ordersWithIds.map((o, idx) => ({
        id: o.id,
        username: selectedUser.username,
        timestamp: new Date().toISOString(),
        status: 'Pending',
        title: o.title,
        image: o.image || null,
        price: parseFloat(o.price),
        profit: parseFloat(o.profit),
        type: 'product',
        assigned_task_id: newTask.id,
        assigned_order_index: idx
      }));

      const { error: insertOrdersError } = await supabase
        .from('cb_orders')
        .insert(dbOrders);

      if (insertOrdersError) {
        toast.error("Error creating individual orders: " + insertOrdersError.message);
        return;
      }

      setShowModal(false);
      setSelectedUser(null);
      toast.success(`Successfully assigned task ${newTask.id} with ${orderCountVal} manual orders to user ${newTask.username}!`);
      fetchUsersAndTasks();
    } catch (err) {
      toast.error("Failed to assign task: " + err.message);
    }
  };

  const handleCancelTask = async (taskId) => {
    if (window.confirm("Are you sure you want to cancel and delete this assigned task? All pending orders will be removed.")) {
      try {
        // Step 1: Delete all linked orders from cb_orders
        const { error: ordersDeleteError } = await supabase
          .from('cb_orders')
          .delete()
          .eq('assigned_task_id', taskId);

        if (ordersDeleteError) {
          toast.error("Error removing linked orders: " + ordersDeleteError.message);
          return;
        }

        // Step 2: Delete the task itself from cb_assigned_tasks
        const { error: taskDeleteError } = await supabase
          .from('cb_assigned_tasks')
          .delete()
          .eq('id', taskId);

        if (taskDeleteError) {
          toast.error("Error deleting task: " + taskDeleteError.message);
          return;
        }

        toast.success("Task and all linked orders cancelled and deleted successfully.");
        fetchUsersAndTasks();
      } catch (err) {
        toast.error("Failed to delete task: " + err.message);
      }
    }
  };

  const handleOpenEditOrdersModal = (task) => {
    setEditingTask(task);
    setEditingOrders(task.orders.map(o => ({ ...o })));
    setShowEditOrdersModal(true);
  };

  const handleSaveEditedOrders = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    for (let idx = 0; idx < editingOrders.length; idx++) {
      const o = editingOrders[idx];
      const pPrice = parseFloat(o.price);
      const pProfit = parseFloat(o.profit);
      if (isNaN(pPrice) || pPrice <= 0 || isNaN(pProfit) || pProfit < 0) {
        toast.error(`Order #${idx + 1} has invalid price or profit.`);
        return;
      }
    }

    try {
      // 1. Update cb_assigned_tasks JSON field
      const { error: taskErr } = await supabase
        .from('cb_assigned_tasks')
        .update({ orders: editingOrders })
        .eq('id', editingTask.id);

      if (taskErr) {
        toast.error("Error updating worksheet orders in task: " + taskErr.message);
        return;
      }

      // 2. Update individual order records in cb_orders table
      for (let idx = 0; idx < editingOrders.length; idx++) {
        const o = editingOrders[idx];
        await supabase
          .from('cb_orders')
          .update({
            title: o.title,
            price: parseFloat(o.price),
            profit: parseFloat(o.profit),
            status: o.status
          })
          .eq('assigned_task_id', editingTask.id)
          .eq('assigned_order_index', idx);
      }

      toast.success("Successfully updated worksheet orders!");
      setShowEditOrdersModal(false);
      setEditingTask(null);
      setEditingOrders([]);
      fetchUsersAndTasks();
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    }
  };

  const getActiveTaskDisplay = (username) => {
    const task = assignedTasks.find(t => 
      t.username.toLowerCase() === username.toLowerCase() && 
      (t.status === 'Pending' || t.status === 'In Progress')
    );
    if (!task) return <span style={{ color: 'var(--text-admin-light)' }}>None</span>;
    const completed = task.orders.filter(o => o.status === 'Success').length;
    return (
      <span className={`badge ${task.status === 'In Progress' ? 'badge-warning' : 'badge-deposit-pending'}`} style={{ display: 'inline-flex', flexDirection: 'column', padding: '4px 8px' }}>
        <b>{task.status}</b>
        <span style={{ fontSize: 9 }}>({completed}/{task.orderCount} orders)</span>
      </span>
    );
  };

  // Preview computations
  const avgAmt = selectedUser ? (parseFloat(totalAmount) / parseInt(orderCount || '1')).toFixed(2) : '0.00';
  const profPerOrd = selectedUser ? (parseFloat(avgAmt) * (parseFloat(profitPercent || '0') / 100)).toFixed(2) : '0.00';
  const totalProf = selectedUser ? (parseFloat(profPerOrd) * parseInt(orderCount || '1')).toFixed(2) : '0.00';

  const filteredUsers = getFilteredUsers();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="admin-page-container scale-up">
      <div className="admin-card">
        <h3 className="section-title" style={{ marginBottom: 12 }}>User Accounts Allocation</h3>
        <p style={{ fontSize: 13, color: 'var(--text-admin-light)', marginBottom: 16 }}>
          Assign custom retail matching worksheets to users to configure matching progress, order amounts, and commission yields.
        </p>

        <div className="filter-controls-row" style={{ padding: 0, marginBottom: 16 }}>
          <div className="search-box-wrapper" style={{ flex: 1, maxWidth: 360 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon" style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-admin-light)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search user by ID or username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ height: 36, width: '100%', borderRadius: 6, border: '1px solid var(--border-color)', paddingLeft: 36, outline: 'none' }}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Staff Node</th>
              <th>Active Balance</th>
              <th>Active Task Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-admin-light)' }}>
                  No client accounts found matching filter node.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td><b>{u.id}</b></td>
                  <td>{u.username}</td>
                  <td><span className="badge badge-node">{u.referred_by_staff_id}</span></td>
                  <td style={{ fontWeight: 700 }}>$ {parseFloat(u.balance).toFixed(2)}</td>
                  <td>{getActiveTaskDisplay(u.username)}</td>
                  <td>
                    <button 
                      className="action-btn btn-approve"
                      onClick={() => handleOpenAssignModal(u)}
                      style={{ padding: '4px 12px', borderRadius: 4 }}
                    >
                      ➕ Assign Task
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <h3 className="section-title" style={{ marginBottom: 16 }}>Worksheet Task Tracker</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Client User</th>
              <th>Total Sum</th>
              <th>Orders Count</th>
              <th>Profit Margin</th>
              <th>Assigned By</th>
              <th>Task Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-admin-light)' }}>
                  No assigned tasks active in this node.
                </td>
              </tr>
            ) : (
              filteredTasks.map(t => {
                const completedCount = t.orders.filter(o => o.status === 'Success').length;
                return (
                  <tr key={t.id}>
                    <td><b>{t.id}</b></td>
                    <td>{t.username}</td>
                    <td style={{ fontWeight: 700 }}>$ {t.totalAmount.toFixed(2)}</td>
                    <td>{t.orderCount} orders</td>
                    <td style={{ color: 'var(--color-green)', fontWeight: 600 }}>{t.profitPercent}%</td>
                    <td>{t.assignedBy}</td>
                    <td>
                      <span className={`badge ${
                        t.status === 'Completed' ? 'badge-success' : 
                        t.status === 'In Progress' ? 'badge-warning' : 'badge-deposit-pending'
                      }`}>
                        {t.status} ({completedCount}/{t.orderCount})
                      </span>
                    </td>
                    <td>{t.createdAt}</td>
                    <td>
                      <div className="action-buttons-cell">
                        {t.status !== 'Completed' ? (
                          <>
                            <button className="action-btn btn-view" onClick={() => handleOpenEditOrdersModal(t)} style={{ whiteSpace: 'nowrap' }}>
                              📝 Edit Orders
                            </button>
                            <button className="action-btn btn-reject" onClick={() => handleCancelTask(t.id)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text-admin-light)' }}>Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Task Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 650, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-admin-main)' }}>
                  Assign Manual Worksheet to {selectedUser.username}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-admin-light)' }}>
                  Configure each matched order manually. Both the product title, price, and commission can be customized.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => { setShowModal(false); setSelectedUser(null); }}>✕</button>
            </div>

            <form onSubmit={handleConfirmAssignment} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Control Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end', backgroundColor: 'var(--bg-surface-hover)', padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                  <div className="form-group-sla" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700 }}>Number of Orders in Task</label>
                    <input 
                      type="number"
                      value={newAssignOrders.length}
                      onChange={(e) => handleOrderCountChange(e.target.value)}
                      required
                      className="input-sla-field"
                      min="1"
                      max="40"
                      style={{ height: 36 }}
                    />
                    <span style={{ fontSize: 9, color: 'var(--text-admin-light)', marginTop: 4, display: 'block' }}>
                      * Adjust the number of orders dynamically.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="action-btn btn-view" 
                    onClick={handleAddOrder}
                    style={{ height: 36, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                  >
                    ➕ Add Order Row
                  </button>
                </div>

                {/* Orders List Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {newAssignOrders.map((order, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 8, 
                        padding: 12, 
                        backgroundColor: 'var(--bg-admin-card)',
                        position: 'relative'
                      }}
                    >
                      {/* Order Row Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-admin-muted)', textTransform: 'uppercase' }}>
                          Order #{idx + 1}
                        </span>
                        {newAssignOrders.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveOrder(idx)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#ef4444', 
                              fontSize: 11, 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2 
                            }}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      {/* Dropdown for products to select */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                            Select Product Catalog
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const prod = products[parseInt(e.target.value)];
                                const updated = [...newAssignOrders];
                                updated[idx] = {
                                  ...updated[idx],
                                  title: prod.title,
                                  image: prod.image,
                                  price: String(prod.price),
                                  profit: String(prod.profit || (prod.price * 0.1).toFixed(2))
                                };
                                setNewAssignOrders(updated);
                              }
                            }}
                            style={{ 
                              fontSize: 11, 
                              padding: '6px', 
                              borderRadius: 4, 
                              border: '1px solid var(--border-color)', 
                              backgroundColor: 'var(--bg-surface-hover)',
                              color: 'var(--text-admin-main)',
                              outline: 'none',
                              width: '100%'
                            }}
                            defaultValue=""
                          >
                            <option value="">-- Choose a product to auto-fill title, image, price & profit --</option>
                            {products.map((p, pIdx) => (
                              <option key={pIdx} value={pIdx}>
                                {p.title.length > 60 ? p.title.substring(0, 60) + '...' : p.title} (${p.price})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Custom fields & Image Preview */}
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          {order.image && (
                            <img 
                              src={order.image} 
                              alt="Product" 
                              referrerPolicy="no-referrer"
                              style={{ 
                                width: 44, 
                                height: 44, 
                                objectFit: 'contain', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: 4, 
                                backgroundColor: 'var(--bg-surface-hover)', 
                                padding: 2,
                                marginTop: 18
                              }} 
                            />
                          )}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                              Product Title / Name
                            </label>
                            <input 
                              type="text"
                              value={order.title}
                              onChange={(e) => {
                                const updated = [...newAssignOrders];
                                updated[idx].title = e.target.value;
                                setNewAssignOrders(updated);
                              }}
                              required
                              placeholder="e.g. barkTHINS Snacking Chocolate"
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12 
                              }}
                            />
                          </div>
                        </div>

                        {/* Price and Profit */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                              Price ($)
                            </label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.price}
                              onChange={(e) => {
                                const updated = [...newAssignOrders];
                                updated[idx].price = e.target.value;
                                setNewAssignOrders(updated);
                              }}
                              required
                              placeholder="0.00"
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12 
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                              Commission / Profit ($)
                            </label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.profit}
                              onChange={(e) => {
                                const updated = [...newAssignOrders];
                                updated[idx].profit = e.target.value;
                                setNewAssignOrders(updated);
                              }}
                              required
                              placeholder="0.00"
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Computation Summary block */}
                <div style={{ backgroundColor: 'var(--color-success-bg)', padding: 12, borderRadius: 6, border: '1px solid var(--color-success)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', margin: 0 }}>
                    Manual Worksheet Summary
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-admin-main)' }}>
                    <span>Total Orders:</span>
                    <b>{newAssignOrders.length}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-admin-main)' }}>
                    <span>Computed Total Price ($):</span>
                    <b>${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0).toFixed(2)}</b>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-success)', margin: '4px 0', opacity: 0.3 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>
                    <span>Total User Profit / Commission:</span>
                    <span>${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.profit || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="action-btn"
                  style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-admin-muted)' }}
                  onClick={() => { setShowModal(false); setSelectedUser(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="sla-submit-btn">
                  ✅ Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Worksheet Orders Modal */}
      {showEditOrdersModal && editingTask && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 650, width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-admin-main)' }}>
                  Edit Worksheet Orders (Task: {editingTask.id})
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-admin-light)' }}>
                  Assigned to: <b>{editingTask.username}</b> | Total sum: <b>${editingTask.totalAmount.toFixed(2)}</b>
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}>✕</button>
            </div>

            <form onSubmit={handleSaveEditedOrders} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', padding: 10, borderRadius: 6, fontSize: 11, color: 'var(--text-admin-main)', lineHeight: 1.4 }}>
                  💡 <b>Pro-Tip:</b> You can customize each individual order in the worksheet sequence. Editing prices and profits here will directly update both the task worksheet and the user's pending order screen. To prevent discrepancy, edit <b>Pending</b> orders only.
                </div>

                {editingOrders.map((order, idx) => {
                  const isCompleted = order.status === 'Success';
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 8, 
                        padding: 12, 
                        backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                        opacity: isCompleted ? 0.8 : 1,
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-admin-muted)', textTransform: 'uppercase' }}>
                          Order #{idx + 1} <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', marginLeft: 6 }}>({isCompleted ? '✓ Submitted' : '⌛ Pending'})</span>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-admin-light)' }}>Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newOrders = [...editingOrders];
                              newOrders[idx].status = e.target.value;
                              setEditingOrders(newOrders);
                            }}
                            style={{ 
                              fontSize: 12, 
                              padding: '2px 6px', 
                              borderRadius: 4, 
                              border: '1px solid var(--border-color)',
                              outline: 'none',
                              backgroundColor: isCompleted ? 'var(--border-color)' : 'var(--bg-admin-card)',
                              color: 'var(--text-admin-main)'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Quick fill dropdown from Catalog */}
                        {!isCompleted && products.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Quick Fill from Product Catalog</label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const prod = products[parseInt(e.target.value)];
                                  const newOrders = [...editingOrders];
                                  newOrders[idx].title = prod.title;
                                  newOrders[idx].image = prod.image;
                                  newOrders[idx].price = prod.price;
                                  // Re-calculate profit based on task's profit yield percent
                                  const pYield = parseFloat(editingTask.profitPercent || '5');
                                  newOrders[idx].profit = parseFloat((prod.price * (pYield / 100)).toFixed(2));
                                  setEditingOrders(newOrders);
                                }
                              }}
                              style={{ 
                                fontSize: 11, 
                                padding: '6px', 
                                borderRadius: 4, 
                                border: '1px solid #cbd5e1', 
                                backgroundColor: '#f8fafc',
                                outline: 'none'
                              }}
                              defaultValue=""
                            >
                              <option value="">-- Choose a product to auto-fill title, image, price & profit --</option>
                              {products.map((p, pIdx) => (
                                <option key={pIdx} value={pIdx}>
                                  {p.title.length > 50 ? p.title.substring(0, 50) + '...' : p.title} (${p.price})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Product Title</label>
                          <input 
                            type="text"
                            value={order.title}
                            onChange={(e) => {
                              const newOrders = [...editingOrders];
                              newOrders[idx].title = e.target.value;
                              setEditingOrders(newOrders);
                            }}
                            required
                            disabled={isCompleted}
                            style={{ 
                              width: '100%', 
                              height: 34, 
                              borderRadius: 4, 
                              border: '1px solid var(--border-color)', 
                              padding: '0 8px', 
                              fontSize: 12,
                              backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                              color: 'var(--text-admin-main)'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Price ($)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.price}
                              onChange={(e) => {
                                const newOrders = [...editingOrders];
                                newOrders[idx].price = e.target.value;
                                // Automatically recalculate profit using the task's profit commission yield percentage
                                const pYield = parseFloat(editingTask.profitPercent || '5');
                                const val = parseFloat(e.target.value || '0');
                                newOrders[idx].profit = parseFloat((val * (pYield / 100)).toFixed(2));
                                setEditingOrders(newOrders);
                              }}
                              required
                              disabled={isCompleted}
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12,
                                backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                                color: 'var(--text-admin-main)'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Profit ($)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.profit}
                              onChange={(e) => {
                                const newOrders = [...editingOrders];
                                newOrders[idx].profit = e.target.value;
                                setEditingOrders(newOrders);
                              }}
                              required
                              disabled={isCompleted}
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12,
                                backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                                color: 'var(--text-admin-main)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="action-btn"
                  style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-admin-muted)' }}
                  onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="sla-submit-btn">
                  💾 Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .badge-node {
          background-color: var(--bg-surface-hover);
          color: var(--text-admin-muted);
          font-weight: 600;
        }

        .filter-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .badge-deposit-pending {
          background-color: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
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
          background-color: var(--bg-surface);
          outline: none;
        }

        .input-sla-field:focus {
          background-color: var(--bg-admin-card);
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
          padding: 0 16px;
        }

        .sla-submit-btn:hover {
          background-color: var(--color-primary-hover);
        }

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
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
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
