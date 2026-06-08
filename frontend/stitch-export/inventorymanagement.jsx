import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  Timer, 
  DollarSign, 
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SideNavBar from '../components/layout/SideNavBar';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('Inventory');

  const stats = [
    { label: 'Total SKU Items', value: '142', trend: '+4 this week', color: 'bg-gray-50' },
    { label: 'Low Stock Alerts', value: '12', icon: AlertTriangle, color: 'border-red-600 bg-red-50 text-red-600', alert: true },
    { label: 'Pending Orders', value: '08', icon: Timer, color: 'border-orange-500 bg-orange-50 text-orange-600' },
    { label: 'Inventory Value', value: '$14.2k', icon: DollarSign, color: 'bg-gray-50' },
  ];

  const ingredients = [
    { id: '#PZP-001', name: 'Mozzarella Cheese (Premium)', stock: '12.5 kg', supplier: 'Milano Dairy Corp', status: 'Critical', img: '{{DATA:IMAGE:IMAGE_5}}' },
    { id: '#PZP-042', name: 'Cherry Tomatoes', stock: '45.0 kg', supplier: 'Green Harvest Farms', status: 'Low Stock', img: '{{DATA:IMAGE:IMAGE_6}}' },
    { id: '#PZP-108', name: 'Pizza Flour (Type 00)', stock: '420.0 kg', supplier: 'EuroMill Imports', status: 'Sufficient', img: '{{DATA:IMAGE:IMAGE_7}}' },
    { id: '#PZP-012', name: 'Black Olives', stock: '88.5 kg', supplier: 'Green Harvest Farms', status: 'Sufficient', img: '{{DATA:IMAGE:IMAGE_8}}' },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">
      <SideNavBar activeTab={activeTab} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Control</h1>
            <p className="text-gray-500">Manage your kitchen supplies and stock levels.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 bg-white rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-600/20">
              <Plus className="w-5 h-5" /> Add New Item
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className={`p-6 rounded-3xl border border-transparent ${stat.color} transition-all hover:scale-[1.02]`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">{stat.label}</p>
                {stat.icon && <stat.icon className="w-6 h-6" />}
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold">{stat.value}</span>
                {stat.trend && <span className="text-xs font-bold mb-1 opacity-60">{stat.trend}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold">Ingredient List</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
              <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Item ID</th>
                <th className="px-8 py-5">Ingredient Name</th>
                <th className="px-8 py-5">Stock Level</th>
                <th className="px-8 py-5">Supplier</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ingredients.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-mono text-xs text-gray-500">{item.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={item.img} className="w-12 h-12 rounded-xl object-cover border border-gray-100" alt={item.name} />
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <span className={`text-sm font-bold ${item.status === 'Critical' ? 'text-red-600' : 'text-gray-900'}`}>{item.stock}</span>
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.status === 'Critical' ? 'bg-red-600' : item.status === 'Low Stock' ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: item.status === 'Critical' ? '15%' : item.status === 'Low Stock' ? '40%' : '85%' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500">{item.supplier}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      item.status === 'Critical' ? 'bg-red-100 text-red-600' : 
                      item.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-red-600 font-bold text-sm hover:underline">
                      {item.status === 'Critical' ? 'Restock' : item.status === 'Low Stock' ? 'Order Now' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default InventoryManagement;