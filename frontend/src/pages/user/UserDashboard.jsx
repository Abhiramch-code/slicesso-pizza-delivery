import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { addToCart } from '../../store/slices/cartSlice';
import { useDispatch } from 'react-redux';

const getLoyaltyTier = (points) => {
  if (points >= 1000) return { name: 'Gold', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: '👑' };
  if (points >= 500) return { name: 'Silver', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: '🥈' };
  return { name: 'Bronze', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🥉' };
};

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, favoritesRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/favorites'),
        ]);
        const orders = ordersRes.data.orders;
        const active = orders.filter(o => o.status !== 'DELIVERED');
        setActiveOrders(active);
        setAllOrders(orders);
        setFavorites(favoritesRes.data.favorites);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  // Calculate analytics from real order data
  const analytics = (() => {
    const totalOrders = allOrders.length;
    const totalSpent = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastOrderDate = allOrders.length > 0 ? allOrders[0].createdAt : null;

    // Find favorite pizza config
    const configCount = {};
    allOrders.forEach(order => {
      order.items.forEach(item => {
        const key = `${item.base}|${item.sauce}|${item.cheese}`;
        configCount[key] = (configCount[key] || 0) + 1;
      });
    });
    let favoritePizza = 'No orders yet';
    let maxCount = 0;
    Object.entries(configCount).forEach(([key, count]) => {
      if (count > maxCount) {
        maxCount = count;
        const [base, sauce] = key.split('|');
        favoritePizza = `${base} + ${sauce}`;
      }
    });

    return { totalOrders, totalSpent, favoritePizza, lastOrderDate };
  })();

  const loyaltyPoints = user?.loyaltyPoints || 0;
  const tier = getLoyaltyTier(loyaltyPoints);
  const pointsToNextTier = loyaltyPoints >= 1000 ? 0 : loyaltyPoints >= 500 ? 1000 - loyaltyPoints : 500 - loyaltyPoints;

  const handleReorder = (fav) => {
    dispatch(addToCart({
      base: fav.base,
      sauce: fav.sauce,
      cheese: fav.cheese,
      veggies: fav.veggies || [],
      meat: fav.meat || [],
      quantity: 1,
      price: fav.price,
    }));
    navigate('/cart');
  };

  const handleDeleteFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error('Error deleting favorite', error);
    }
  };

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

      {/* Order Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-3xl font-black text-on-surface">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Spent</p>
          <p className="text-3xl font-black text-primary">₹{analytics.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Favorite Pizza</p>
          <p className="text-sm font-bold text-on-surface mt-1">{analytics.favoritePizza}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Last Order</p>
          <p className="text-sm font-bold text-on-surface mt-1">
            {analytics.lastOrderDate ? new Date(analytics.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No orders yet'}
          </p>
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

        {/* Loyalty Points Tracker */}
        <div className={`bg-primary-container p-8 rounded-3xl text-on-primary-container relative overflow-hidden flex flex-col justify-between gap-6 h-full min-h-[300px] ${tier.bg} ${tier.color}`}>
          <div className="absolute -right-10 -top-10 opacity-10 text-9xl">
            {tier.icon}
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Loyalty Status</p>
            <h3 className="text-4xl font-black leading-none tracking-tight">{loyaltyPoints.toLocaleString()} Points</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${tier.bg} ${tier.color} ${tier.border} border`}>
                {tier.icon} {tier.name} Tier
              </span>
            </div>
            {pointsToNextTier > 0 && (
              <p className="text-sm opacity-90 pt-2">{pointsToNextTier} points until {loyaltyPoints >= 500 ? 'Gold' : 'Silver'} tier!</p>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-xs opacity-70 mb-1">₹100 spent = 10 points</p>
            <p className="text-xs opacity-70">Points update automatically after each order</p>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-on-surface">Your Favorites</h3>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{favorites.length} Saved</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(fav => (
              <div key={fav._id} className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-on-surface">{fav.name}</h4>
                  <button onClick={() => handleDeleteFavorite(fav._id)} className="text-on-surface-variant hover:text-red-500 text-sm">✕</button>
                </div>
                <div className="space-y-1 text-sm text-on-surface-variant mb-4">
                  <p>{fav.base} • {fav.sauce} • {fav.cheese}</p>
                  {(fav.veggies?.length > 0 || fav.meat?.length > 0) && (
                    <p>{[...(fav.veggies || []), ...(fav.meat || [])].join(', ')}</p>
                  )}
                  <p className="font-bold text-primary">₹{fav.price}</p>
                </div>
                <button
                  onClick={() => handleReorder(fav)}
                  className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Order Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Pizzas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-on-surface">Popular Pizzas</h3>
          <button 
            onClick={() => navigate('/menu')}
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View Full Menu →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Margherita', price: 350, desc: 'Classic Italian with fresh basil', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop' },
            { name: 'Farmhouse', price: 420, desc: 'Loaded with fresh veggies', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop' },
            { name: 'Pepperoni Feast', price: 480, desc: 'Spicy pepperoni overload', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop' },
            { name: 'Chicken Dominator', price: 520, desc: 'Double chicken with BBQ sauce', img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&auto=format&fit=crop' },
          ].map((pizza, idx) => (
            <div 
              key={idx} 
              className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => navigate('/menu')}
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={pizza.img} 
                  alt={pizza.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'; }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-on-surface">{pizza.name}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{pizza.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">₹{pizza.price}</span>
                  <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
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
        <div className="md:col-span-3 h-[200px] rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => navigate('/menu')}>
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="/images/delivery-promo.jpg" 
            alt="Delivery" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop'; }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20"></div>
          <div className="absolute inset-0 flex items-center px-12">
            <div className="text-white">
              <h4 className="text-3xl font-black tracking-tight">Explore Our Menu</h4>
              <p className="text-lg opacity-90 mt-1">Pizzas, Sides, Drinks & Desserts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
