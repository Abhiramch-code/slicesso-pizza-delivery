import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    expiryDate: '',
    minOrderAmount: 0,
    maxUses: '',
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const load = async () => {
      try {
        const { data } = await api.get('/coupons');
        setCoupons(data.coupons);
      } catch (error) {
        console.error('Error fetching coupons', error);
      }
      setLoading(false);
    };
    load();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data.coupons);
    } catch (error) {
      console.error('Error fetching coupons', error);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newCoupon,
        maxUses: newCoupon.maxUses ? parseInt(newCoupon.maxUses) : null,
        minOrderAmount: parseInt(newCoupon.minOrderAmount) || 0,
        discountValue: parseFloat(newCoupon.discountValue),
      };
      await api.post('/coupons', payload);
      setShowCreateModal(false);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: 10, expiryDate: '', minOrderAmount: 0, maxUses: '' });
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon', error);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Coupon Management</h1>
          <p className="text-on-surface-variant">Create and manage discount coupons.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-6 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20">
          <span>➕</span> Create Coupon
        </button>
      </header>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <h2 className="text-xl font-bold">All Coupons ({coupons.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 bg-surface">
                <th className="px-8 py-5">Code</th>
                <th className="px-8 py-5">Discount</th>
                <th className="px-8 py-5">Min Order</th>
                <th className="px-8 py-5">Uses</th>
                <th className="px-8 py-5">Expires</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {coupons.map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) < new Date();
                return (
                  <tr key={coupon._id} className="hover:bg-black/5 transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-bold text-primary">{coupon.code}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">
                      ₹{coupon.minOrderAmount || 0}
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">
                      {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <span className={isExpired ? 'text-red-600' : 'text-on-surface'}>
                        {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        isExpired ? 'bg-gray-100 text-gray-600' :
                        coupon.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isExpired ? 'Expired' : coupon.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggle(coupon._id)} className="text-primary font-bold text-sm hover:underline">
                          {coupon.active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} className="text-red-600 font-bold text-sm hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {coupons.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="px-8 py-12 text-center text-on-surface-variant">
                    No coupons created yet. Click "Create Coupon" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <div className="text-center py-8 text-on-surface-variant">Loading coupons...</div>}

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6">Create New Coupon</h3>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                placeholder="Coupon Code (e.g., WELCOME10)"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              />
              <select
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value }))}
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
              </select>
              <input
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                type="number"
                placeholder={newCoupon.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                type="number"
                placeholder="Minimum Order Amount (₹)"
                value={newCoupon.minOrderAmount}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, minOrderAmount: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                type="number"
                placeholder="Max Uses (leave empty for unlimited)"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm"
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleCreate} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90">Create</button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-surface-variant text-on-surface-variant py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
