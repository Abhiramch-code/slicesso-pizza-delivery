import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [salesData, setSalesData] = useState({ netSales: 0, activeOrders: 0, avgDelivery: 24, growth: 84 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, orderRes] = await Promise.all([
          api.get('/inventory/analytics'),
          api.get('/orders')
        ]);

        setAnalytics(invRes.data.analytics);

        let active = 0;
        let sales = 0;
        orderRes.data.orders.forEach(order => {
          if (order.status !== 'DELIVERED') active++;
          else sales += order.totalAmount;
        });

        setSalesData(prev => ({ ...prev, activeOrders: active, netSales: sales }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-on-surface-variant">Loading Analytics...</div>;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Analytics Deep Dive</h2>
          <p className="text-on-surface-variant">Monitoring real-time kitchen efficiency and market trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-high p-1 rounded-lg">
            <button className="px-4 py-1.5 rounded-md bg-white shadow-sm text-sm font-semibold">Today</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-variant">Weekly</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-variant">Monthly</button>
          </div>
          <button className="p-2.5 bg-surface-container-highest rounded-lg text-on-surface hover:bg-outline-variant transition-colors">
            ⬇️
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl relative overflow-hidden group shadow-sm border border-black/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Net Sales</p>
              <h3 className="text-3xl font-black mt-1">₹{salesData.netSales}</h3>
            </div>
            <div className="p-2 bg-primary-container text-on-primary-container rounded-lg text-xl">💵</div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-green-600 font-medium">
            <span className="text-sm">↗️</span>
            <span className="text-xs">+12.5% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Active Orders</p>
              <h3 className="text-3xl font-black mt-1">{salesData.activeOrders}</h3>
            </div>
            <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg text-xl">🍕</div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-primary font-medium">
            <span className="text-sm">⚠️</span>
            <span className="text-xs">Peak demand starting</span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Avg Delivery</p>
              <h3 className="text-3xl font-black mt-1">{salesData.avgDelivery}m</h3>
            </div>
            <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-lg text-xl">⏱️</div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-green-600 font-medium">
            <span className="text-sm">↘️</span>
            <span className="text-xs">-3m faster than avg</span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Growth</p>
              <h3 className="text-3xl font-black mt-1">{salesData.growth}%</h3>
            </div>
            <div className="p-2 bg-surface-container-highest text-on-surface rounded-lg text-xl">📈</div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant font-medium">
            <span className="text-sm">⭐</span>
            <span className="text-xs">4.8k New users</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-8 border border-black/5 shadow-sm">
          <h4 className="text-xl font-bold mb-6">Inventory Value Breakdown</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
              <span className="font-bold text-on-surface-variant">Total Value</span>
              <span className="text-2xl font-black text-primary">₹{analytics?.totalInventoryValue || 0}</span>
            </div>
            {analytics?.categoryBreakdown && Object.keys(analytics.categoryBreakdown).map(cat => (
              <div key={cat} className="flex justify-between items-center group">
                <span className="text-sm font-semibold capitalize text-on-surface">{cat} ({analytics.categoryBreakdown[cat].count} items)</span>
                <span className="text-sm font-bold bg-surface-container-high px-3 py-1 rounded-md">₹{analytics.categoryBreakdown[cat].totalValue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl p-8 border border-black/5 shadow-sm">
          <h4 className="text-xl font-bold mb-6">Critical Stock Alerts</h4>
          <div className="space-y-4">
            {!analytics?.lowStockItems || analytics.lowStockItems.length === 0 ? (
              <p className="text-green-600 font-bold">All inventory items are sufficiently stocked.</p>
            ) : (
              analytics.lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                  <div>
                    <p className="font-bold text-red-900">{item.name}</p>
                    <p className="text-xs text-red-700 capitalize">{item.category} • Threshold: {item.threshold}</p>
                  </div>
                  <span className="text-xl font-black text-red-600">{item.quantity} Left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
