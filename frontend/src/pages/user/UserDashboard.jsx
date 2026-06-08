import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        const active = data.orders.filter(o => o.status !== 'DELIVERED');
        setActiveOrders(active);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 w-full">
      {/* Personalized Welcome Section */}
      <div className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden flex items-end p-8 group">
        <img 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src="/images/welcome.jpg"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent"></div>
        <div className="relative z-10 text-white space-y-2">
          <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tight">Welcome back, {user?.name.split(' ')[0]}.</h2>
          <p className="text-sm md:text-base opacity-90 max-w-lg">Your oven is hot and your favorite toppings are ready. Ready for your next feast?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Orders (Bento Style) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-on-surface">Active Orders</h3>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Status</span>
          </div>

          {activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <div key={order._id} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-outline-variant/30 space-y-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/orders')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">Custom Pizza ({order.items.length} items)</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Order #{order._id.substring(order._id.length - 8).toUpperCase()} • ₹{order.totalAmount}</p>
                  </div>
                  <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span>🔥</span>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="space-y-4">
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full relative transition-all duration-1000" 
                      style={{ 
                        width: order.status === 'ORDER_RECEIVED' ? '25%' : 
                               order.status === 'IN_KITCHEN' ? '50%' : 
                               order.status === 'SENT_TO_DELIVERY' ? '75%' : '100%' 
                      }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase text-on-surface-variant font-bold">
                    <span className={order.status === 'ORDER_RECEIVED' ? 'text-primary' : ''}>Prepared</span>
                    <span className={order.status === 'IN_KITCHEN' ? 'text-primary' : ''}>Baking</span>
                    <span className={order.status === 'SENT_TO_DELIVERY' ? 'text-primary' : ''}>Out for Delivery</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface-container p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
              <span className="text-4xl opacity-50">🍽️</span>
              <p className="text-on-surface-variant font-medium">No active orders right now.</p>
              <button 
                onClick={() => navigate('/pizza-builder')}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Start a New Order
              </button>
            </div>
          )}
        </div>

        {/* Reward Points Tracker */}
        <div className="bg-primary-container p-8 rounded-3xl text-on-primary-container relative overflow-hidden flex flex-col justify-between gap-6 h-full min-h-[300px]">
          <div className="absolute -right-10 -top-10 opacity-10 text-9xl">
            ⭐
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Loyalty Status</p>
            <h3 className="text-4xl font-black leading-none tracking-tight">2,450 Points</h3>
            <p className="text-sm opacity-90 pt-2">Only 550 points until your next free Large Pizza!</p>
          </div>
          <button className="w-full bg-white text-primary px-8 py-4 rounded-xl font-bold active:scale-95 transition-all relative z-10 shadow-lg hover:bg-gray-50">
            Redeem Rewards
          </button>
        </div>
      </div>

      {/* Promotion Bento Piece */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-outline-variant/30">
        <div className="md:col-span-1 bg-white/60 p-6 rounded-3xl flex flex-col justify-between border border-primary/20 shadow-sm">
          <span className="text-4xl mb-4">🔥</span>
          <div>
            <h4 className="text-xl font-bold">Hot Deals</h4>
            <p className="text-on-surface-variant text-sm mt-1">20% off all XL pizzas today.</p>
          </div>
        </div>
        <div className="md:col-span-3 h-[200px] rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => navigate('/pizza-builder')}>
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="/images/delivery-promo.jpg" 
            alt="Delivery" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop'; }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20"></div>
          <div className="absolute inset-0 flex items-center px-12">
            <div className="text-white">
              <h4 className="text-3xl font-black tracking-tight">Priority Delivery</h4>
              <p className="text-lg opacity-90 mt-1">Subscribers get first-in-oven priority.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
