import { useState, useEffect } from 'react';
import api from '../../services/api';
import { connectSocket, disconnectSocket, onOrderUpdate, onOrderStatusUpdate, offOrderUpdate, offOrderStatusUpdate } from '../../services/socket';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    dailySales: 0,
    totalOrders: 0,
    activeOrders: 0
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
        
        // Calculate basic stats
        const today = new Date().setHours(0,0,0,0);
        let daily = 0;
        let total = 0;
        let active = 0;
        
        data.orders.forEach(order => {
          if (new Date(order.createdAt).setHours(0,0,0,0) === today) {
            daily += order.totalAmount;
            total++;
          }
          if (order.status !== 'DELIVERED') active++;
        });
        
        setStats({ dailySales: daily, totalOrders: total, activeOrders: active });
      } catch (error) {
        console.error('Error fetching admin orders', error);
      }
    };

    fetchOrders();

    connectSocket();
    onOrderStatusUpdate(({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    });
    onOrderUpdate((updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => {
      offOrderStatusUpdate();
      offOrderUpdate();
      disconnectSocket();
    };
  }, []);

  const updateStatus = async (orderId, currentStatus) => {
    const statuses = ['ORDER_RECEIVED', 'IN_KITCHEN', 'SENT_TO_DELIVERY', 'DELIVERED'];
    const nextStatusIdx = statuses.indexOf(currentStatus) + 1;
    if (nextStatusIdx >= statuses.length) return;
    
    const nextStatus = statuses[nextStatusIdx];
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      
      setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      
      if (nextStatus === 'DELIVERED') {
        setStats(prev => ({ ...prev, activeOrders: prev.activeOrders - 1 }));
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'ORDER_RECEIVED': return 'bg-tertiary-fixed text-on-tertiary-fixed';
      case 'IN_KITCHEN': return 'bg-secondary-fixed text-on-secondary-fixed';
      case 'SENT_TO_DELIVERY': return 'bg-primary/20 text-primary';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">Kitchen Overview</h2>
        <p className="text-on-surface-variant">Live metrics for today</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-2xl p-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg">💵</span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-sm font-bold">Daily Sales</p>
            <h3 className="text-3xl font-black text-on-surface">₹{stats.dailySales}</h3>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-2xl p-2 bg-primary-fixed text-on-primary-fixed rounded-lg">🍕</span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-sm font-bold">Total Orders Today</p>
            <h3 className="text-3xl font-black text-on-surface">{stats.totalOrders}</h3>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-2xl p-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg">⏱️</span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-sm font-bold">Active Orders</p>
            <h3 className="text-3xl font-black text-on-surface">{stats.activeOrders}</h3>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-2xl p-2 bg-error-container text-on-error-container rounded-lg">⚠️</span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-sm font-bold">Stock Alerts</p>
            <h3 className="text-3xl font-black text-primary">Check Inventory</h3>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Orders Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl border border-black/5 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white/40">
              <h4 className="text-xl font-bold">Live Orders</h4>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> 
                {stats.activeOrders} Active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-black/5">
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {orders.filter(o => o.status !== 'DELIVERED').map(order => (
                    <tr key={order._id} className="hover:bg-black/5 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold">{order.items.length}x {order.items[0]?.isMenuItem ? order.items[0]?.name : 'Custom Pizza'}</p>
                          <p className="text-xs text-on-surface-variant">{order.items[0]?.isMenuItem ? (order.items[0]?.category || '') : `${order.items[0]?.base || ''}, ${order.items[0]?.sauce || ''}`}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => updateStatus(order._id, order.status)}
                          className="text-primary hover:underline text-sm font-bold"
                        >
                          {order.status === 'ORDER_RECEIVED' ? 'Accept' : 
                           order.status === 'IN_KITCHEN' ? 'Dispatch' : 
                           order.status === 'SENT_TO_DELIVERY' ? 'Mark Delivered' : ''}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-black/5 shadow-sm">
            <h4 className="text-xl font-bold mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-surface-container-low hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">
                <span className="text-2xl mb-2">➕</span>
                <span className="text-xs font-bold">New Order</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-surface-container-low hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">
                <span className="text-2xl mb-2">🖨️</span>
                <span className="text-xs font-bold">Menu Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
