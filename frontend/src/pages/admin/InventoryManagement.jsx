import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, restockItem, createInventoryItem, deleteInventoryItem } from '../../store/slices/inventorySlice';
import api from '../../services/api';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { items, stats, isLoading } = useSelector((state) => state.inventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'base', quantity: 0, unit: 'pcs', threshold: 10, unitCost: 0 });
  const [forecast, setForecast] = useState([]);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const loadForecast = async () => {
    try {
      const { data } = await api.get('/inventory/forecast');
      setForecast(data.forecast);
      setShowForecast(true);
    } catch (error) {
      console.error('Error loading forecast', error);
    }
  };

  const handleRestock = async (id) => {
    dispatch(restockItem({ id, quantity: 50, note: 'Admin restock' }));
  };

  const handleAddItem = () => {
    dispatch(createInventoryItem(newItem));
    setShowAddModal(false);
    setNewItem({ name: '', category: 'base', quantity: 0, unit: 'pcs', threshold: 10, unitCost: 0 });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteInventoryItem(id));
    }
  };

  const lowStockCount = items.filter(i => i.quantity <= i.threshold && i.quantity > 0).length;
  const outOfStockCount = items.filter(i => i.quantity === 0).length;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Inventory Control</h1>
          <p className="text-on-surface-variant">Manage your kitchen supplies and stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadForecast} className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-xl font-bold flex items-center gap-2 hover:bg-secondary-container/90">
            <span>📊</span> Forecast
          </button>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20">
            <span>➕</span> Add New Item
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-3xl border border-transparent bg-white shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Total SKU Items</p>
            <span className="text-xl">📦</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{stats.total}</span>
          </div>
        </div>
        <div className="p-6 rounded-3xl border border-orange-500 bg-orange-50 text-orange-600 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Low Stock</p>
            <span className="text-xl">⚠️</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{lowStockCount}</span>
          </div>
        </div>
        <div className="p-6 rounded-3xl border border-red-600 bg-red-50 text-red-600 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Out of Stock</p>
            <span className="text-xl">🚨</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <h2 className="text-xl font-bold">Ingredient List</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 bg-surface">
                <th className="px-8 py-5">Item</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Stock Level</th>
                <th className="px-8 py-5">Threshold</th>
                <th className="px-8 py-5">Unit Cost</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {items.map((item) => {
                const isCritical = item.quantity === 0;
                const isLow = item.quantity <= item.threshold && !isCritical;
                
                return (
                  <tr key={item._id} className="hover:bg-black/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-xl">
                          {item.category === 'base' ? '🥖' : item.category === 'sauce' ? '🥫' : item.category === 'cheese' ? '🧀' : item.category === 'veggie' ? '🥬' : '🥩'}
                        </div>
                        <span className="font-bold text-on-surface">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant capitalize">{item.category}</td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <span className={`text-sm font-bold ${isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-on-surface'}`}>
                          {item.quantity} {item.unit}
                        </span>
                        <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isCritical ? 'bg-red-600' : isLow ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((item.quantity / (item.threshold * 3)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">{item.threshold} {item.unit}</td>
                    <td className="px-8 py-6 text-sm font-medium text-on-surface">₹{item.unitCost}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        isCritical ? 'bg-red-100 text-red-600' : 
                        isLow ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {isCritical ? 'Out of Stock' : isLow ? 'Low Stock' : 'Sufficient'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleRestock(item._id, item.quantity)} className="text-primary font-bold text-sm hover:underline">
                          {(isCritical || isLow) ? 'Restock' : 'Edit'}
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 font-bold text-sm hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Forecast */}
      {showForecast && forecast.length > 0 && (
        <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
            <h2 className="text-xl font-bold">Inventory Forecast</h2>
            <button onClick={() => setShowForecast(false)} className="text-on-surface-variant hover:text-on-surface text-sm font-bold">Close</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 bg-surface">
                  <th className="px-8 py-5">Item</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Current Stock</th>
                  <th className="px-8 py-5">Avg Daily Usage</th>
                  <th className="px-8 py-5">Days Remaining</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {forecast.map((item) => (
                  <tr key={item.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-8 py-6 font-bold text-on-surface">{item.name}</td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant capitalize">{item.category}</td>
                    <td className="px-8 py-6 text-sm font-medium">{item.currentStock} {item.unit}</td>
                    <td className="px-8 py-6 text-sm">{item.avgDailyUsage} {item.unit}/day</td>
                    <td className="px-8 py-6">
                      <span className={`font-bold ${
                        item.status === 'critical' ? 'text-red-600' :
                        item.status === 'low' ? 'text-orange-600' :
                        item.status === 'no_data' ? 'text-gray-400' :
                        'text-green-600'
                      }`}>
                        {item.daysRemaining !== null ? `${item.daysRemaining} days` : 'No data'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'critical' ? 'bg-red-100 text-red-600' :
                        item.status === 'low' ? 'bg-orange-100 text-orange-600' :
                        item.status === 'no_data' ? 'bg-gray-100 text-gray-500' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.status === 'no_data' ? 'No Data' : item.status === 'critical' ? 'Critical' : item.status === 'low' ? 'Low' : 'Sufficient'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6">Add New Inventory Item</h3>
            <div className="space-y-4">
              <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))} />
              <select className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" value={newItem.category} onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}>
                <option value="base">Base</option>
                <option value="sauce">Sauce</option>
                <option value="cheese">Cheese</option>
                <option value="veggie">Veggie</option>
                <option value="meat">Meat</option>
              </select>
              <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))} />
              <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" placeholder="Unit (pcs, kg, L)" value={newItem.unit} onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))} />
              <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" type="number" placeholder="Threshold" value={newItem.threshold} onChange={(e) => setNewItem(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))} />
              <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm" type="number" placeholder="Unit Cost (₹)" value={newItem.unitCost} onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleAddItem} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90">Add Item</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-surface-variant text-on-surface-variant py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="text-center py-8 text-on-surface-variant">Loading inventory...</div>}
    </div>
  );
};

export default InventoryManagement;