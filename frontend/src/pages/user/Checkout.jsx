import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { clearCart } from '../../store/slices/cartSlice';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Create Razorpay order (or mock order)
      const { data: orderData } = await api.post('/orders/create-razorpay-order', { items });

      if (orderData.mockMode) {
        // Mock payment flow - auto-verify
        await api.post('/orders/verify-payment', {
          razorpay_order_id: orderData.razorpayOrder.id,
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_signature: 'mock_signature',
          items: orderData.items,
          deliveryAddress,
          mockMode: true,
        });

        dispatch(clearCart());
        navigate('/orders');
        return;
      }

      // Real Razorpay flow
      const options = {
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: 'Slices',
        description: 'Pizza Order',
        order_id: orderData.razorpayOrder.id,
        handler: async function (response) {
          try {
            await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: orderData.items,
              deliveryAddress,
            });

            dispatch(clearCart());
            navigate('/orders');
          } catch {
            setError('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#b90027',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
      setLoading(false);
    }
  };

  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🍕</span>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/pizza-builder')} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90">
          Build a Pizza
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto w-full space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-on-surface">Checkout</h1>
        <p className="text-on-surface-variant mt-2">Finalize your order and payment.</p>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-outline-variant/30 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Delivery Address</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Street Address</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="123 Pizza Lane"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">City</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">State</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="MH"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">ZIP</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    value={deliveryAddress.zip}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-outline-variant/30 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Order Items</h3>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-outline-variant/20 last:border-0">
                  <div>
                    <p className="font-bold">{item.base} + {item.sauce} + {item.cheese}</p>
                    <p className="text-sm text-on-surface-variant">{[...item.veggies || [], ...item.meat || []].join(', ') || 'No toppings'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{item.price * (item.quantity || 1)}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {item.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sticky top-24 border border-white/40 shadow-xl">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-on-surface">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Delivery Fee</span>
                <div className="flex items-center gap-1">
                  <span className="line-through text-xs opacity-50">₹50</span>
                  <span className="font-bold text-secondary">FREE</span>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-black text-3xl text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-4 rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order & Pay'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-surface-variant/50 text-on-surface-variant py-4 rounded-xl text-sm font-bold hover:bg-surface-variant transition-all mt-3 border border-outline-variant/50"
            >
              Back to Cart
            </button>

            <div className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-3 text-on-surface-variant">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="text-xs font-bold">Estimated Delivery</p>
                <p className="text-sm">45 Minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;