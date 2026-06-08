import { useState, useEffect } from 'react';
import api from '../../services/api';
import { connectSocket, disconnectSocket, onOrderUpdate, offOrderUpdate } from '../../services/socket';
import { useSelector } from 'react-redux';

const getStatusIndex = (status) => {
  const statuses = ['ORDER_RECEIVED', 'IN_KITCHEN', 'SENT_TO_DELIVERY', 'DELIVERED'];
  return statuses.indexOf(status);
};

const Orders = () => {
  const [orderList, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders);
        const active = data.orders.filter(o => o.status !== 'DELIVERED');
        if (active.length > 0) {
          setActiveOrder(active[0]);
        }
      } catch {
        console.error('Error fetching orders');
      }
    };

    fetchOrders();

    connectSocket(user?.id);

    onOrderUpdate((updatedOrder) => {
      setOrders((prev) => 
        prev.map(o => o._id === updatedOrder._id ? updatedOrder : o)
      );
      setActiveOrder((prev) => 
        prev?._id === updatedOrder._id ? updatedOrder : prev
      );
    });

    return () => {
      offOrderUpdate();
      disconnectSocket();
    };
  }, [user?.id]);

  const handleSelectOrder = (order) => {
    setActiveOrder(order);
  };

  if (orderList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🍽️</span>
        <h2 className="text-2xl font-bold text-on-surface-variant">No orders yet</h2>
      </div>
    );
  }

  const currentStatusIdx = activeOrder ? getStatusIndex(activeOrder.status) : 0;
  const pastOrders = orderList.filter(o => o.status === 'DELIVERED');
  const activeOrders = orderList.filter(o => o.status !== 'DELIVERED');

  return (
    <div className="max-w-container-max mx-auto w-full space-y-8">
      {/* Order Selector Tabs */}
      <div className="flex gap-4 mb-6">
        <h2 className="text-3xl font-bold text-on-surface">My Orders</h2>
      </div>

      {/* Active Order Tracking */}
      {activeOrder && (
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-1 font-bold">Estimated Arrival</p>
              <h1 className="text-4xl font-black text-on-surface leading-none">
                {activeOrder.estimatedDelivery ? new Date(activeOrder.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Calculating...'}
              </h1>
            </div>
            <span className="bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full uppercase font-bold">
              {activeOrder.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Visual Timeline */}
          <div className="space-y-6 relative mb-8">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-surface-variant z-0">
              <div 
                className="w-full bg-primary transition-all duration-1000" 
                style={{ height: `${(currentStatusIdx / 3) * 100}%` }}
              ></div>
            </div>

            {[
              { label: 'Order Received', icon: '📝' },
              { label: 'In Kitchen', icon: '👨‍🍳' },
              { label: 'Out for Delivery', icon: '🛵' },
              { label: 'Delivered', icon: '🏠' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${idx <= currentStatusIdx ? 'bg-primary text-white shadow-md' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {step.icon}
                </div>
                <div>
                  <p className={`font-semibold ${idx <= currentStatusIdx ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/30 pt-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm">Order #{activeOrder._id.substring(activeOrder._id.length - 8).toUpperCase()}</p>
              <p className="font-bold text-lg text-primary">₹{activeOrder.totalAmount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Orders List */}
      {activeOrders.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Active Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map(order => (
              <div 
                key={order._id} 
                className={`bg-white/60 backdrop-blur-md p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 ${activeOrder?._id === order._id ? 'border-primary/50' : 'border-outline-variant/30'}`}
                onClick={() => handleSelectOrder(order)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    <p className="text-xs text-on-surface-variant">{order.items.length}x Pizza • ₹{order.totalAmount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Past Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOrders.map(order => (
              <div key={order._id} className="bg-white/40 backdrop-blur-md p-4 rounded-xl border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    <p className="text-xs text-on-surface-variant">{order.items.length}x Pizza • ₹{order.totalAmount}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;