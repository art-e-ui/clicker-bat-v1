import React, { useState, useEffect } from 'react';
import { PRODUCT_CATALOG } from '../data/products';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { 
  ClipboardList, 
  ListOrdered, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Database,
  Eye,
  Info,
  Layers3,
  Sparkles,
  Award,
  Search,
  Filter
} from 'lucide-react';

export default function OrdersInProgress() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [products, setProducts] = useState(PRODUCT_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState({});

  // Edit Worksheet Orders Modal state
  const [showEditOrdersModal, setShowEditOrdersModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingOrders, setEditingOrders] = useState([]);

  const fetchTasks = async () => {
    try {
      const savedSession = localStorage.getItem('cb_admin_session');
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }

      // Fetch Assigned Tasks
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
      console.error("Error loading tasks:", err);
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
    fetchTasks();
    loadProducts();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredTasks = () => {
    return assignedTasks.filter(t => {
      // Role Node checking
      if (session.role === 'Admin') {
        if (t.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (t.referred_by_staff_id !== session.accountId) return false;
      }

      // Search checking
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.username.toLowerCase().includes(q) || 
          t.id.toLowerCase().includes(q) ||
          t.assignedBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
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
        fetchTasks();
      } catch (err) {
        toast.error("Failed to delete task: " + err.message);
      }
    }
  };

  const handlePurgeTaskData = async () => {
    const isConfirmed = window.confirm(
      "⚠️ WARNING: This operation is IRREVERSIBLE!\n\n" +
      "This will permanently delete all records of assigned tasks and associated orders (completed, pending, in-progress) from the database.\n\n" +
      "Are you absolutely sure you want to proceed?"
    );
    if (!isConfirmed) return;

    try {
      // Delete all from cb_orders
      const { error: ordersErr } = await supabase
        .from('cb_orders')
        .delete()
        .neq('id', 0);

      if (ordersErr) {
        throw ordersErr;
      }

      // Delete all from cb_assigned_tasks
      const { error: tasksErr } = await supabase
        .from('cb_assigned_tasks')
        .delete()
        .neq('id', '0');

      if (tasksErr) {
        throw tasksErr;
      }

      toast.success("Successfully purged all assigned tasks and associated orders from the database!");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to purge database records: " + err.message);
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
      fetchTasks();
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="w-full space-y-6">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50 text-xl tracking-tight">Orders In Progress</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Monitor real-time worksheet sequences and manage active allocations.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search by User or Task ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Task Tracker Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-base">Worksheet Task Tracker</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap">Task ID</th>
                <th className="px-6 py-4">Client User</th>
                <th className="px-6 py-4">Total Sum</th>
                <th className="px-6 py-4">Orders Count</th>
                <th className="px-6 py-4">Profit Margin</th>
                <th className="px-6 py-4">Assigned By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No active or pending worksheets matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(t => {
                  const completedCount = t.orders.filter(o => o.status === 'Success').length;
                  const isCompleted = t.status === 'Completed';
                  const isInProgress = t.status === 'In Progress';
                  
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded-md">{t.id.substring(0,8)}...</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-50">{t.username}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-700 dark:text-slate-300">${t.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{t.orderCount} items</td>
                      <td className="px-6 py-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">{t.profitPercent}%</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{t.assignedBy}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 
                          isInProgress ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 
                          'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20'
                        }`}>
                          {isCompleted ? <Check className="w-3 h-3" /> : (isInProgress ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> : null)}
                          {t.status} ({completedCount}/{t.orderCount})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{t.createdAt}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        {t.status !== 'Completed' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEditOrdersModal(t)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleCancelTask(t.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Maintenance Section */}
      <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 dark:text-rose-400 text-base mb-1">
              Database Maintenance & System Control Center
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-300/80 mb-5 leading-relaxed max-w-3xl">
              Admin tool for clearing existing records. You can purge all order tasking data and wipe ongoing or pending orders to reset the system. This action is irreversible.
            </p>
            <button 
              type="button"
              onClick={handlePurgeTaskData}
              className="px-5 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              Wipe All Orders & Assigned Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Edit Worksheet Orders Modal */}
      {showEditOrdersModal && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Database className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    Modify Worksheet Item Sequence
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Editing Task: <span className="font-mono text-indigo-500 font-semibold">{editingTask.id}</span> • Assigned Client: <b>{editingTask.username}</b>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedOrders} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Information advice banner */}
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs leading-relaxed">
                  <Info className="w-4.5 h-4.5 flex-shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    💡 <b>Sequence Editing Guideline:</b> You can customize each individual order in the worksheet sequence. Editing prices and profits here will directly update both the task worksheet and the user's pending order screen. To prevent discrepancy, edit <b>Pending</b> orders only.
                  </span>
                </div>

                {/* Rows block */}
                <div className="space-y-3.5">
                  {editingOrders.map((order, idx) => {
                    const isCompleted = order.status === 'Success';
                    return (
                      <div 
                        key={idx} 
                        className={`border rounded-2xl p-4 space-y-3 relative transition-all ${
                          isCompleted 
                            ? 'bg-slate-50/60 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800 opacity-75' 
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
                            Worksheet Order Row #{idx + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const newOrders = [...editingOrders];
                                newOrders[idx].status = e.target.value;
                                setEditingOrders(newOrders);
                              }}
                              className={`px-2 py-1 rounded text-xs font-bold outline-none border ${
                                isCompleted 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                              }`}
                            >
                              <option value="Pending">⌛ Pending</option>
                              <option value="Success">✓ Success</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Quick fill dropdown from Catalog */}
                          {!isCompleted && products.length > 0 && (
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Quick Fill from Product Catalog</label>
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
                                className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs outline-none"
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

                          {/* Text input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Product Title</label>
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
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:bg-slate-100 disabled:text-slate-400"
                            />
                          </div>

                          {/* Numerical fields */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Price ($)</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 font-mono text-xs">$</span>
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
                                  className="w-full pl-6 pr-2 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:bg-slate-100"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Profit ($)</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-emerald-500 font-mono text-xs">$</span>
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
                                  className="w-full pl-6 pr-2 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:bg-slate-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                <button 
                  type="button" 
                  className="px-5 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                  onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" />
                  Save Sequence Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
