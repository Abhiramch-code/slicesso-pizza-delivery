import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🍕</span>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/menu')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + tax;

  return (
    <div className="max-w-container-max mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-on-surface">Your Order</h1>
        <p className="text-on-surface-variant mt-2">Review your selections before firing the oven.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shopping List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item, index) => {
            const isMenuItem = item.isMenuItem;
            const displayName = isMenuItem ? item.name : 'Custom Pizza';
            
            return (
              <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all hover:translate-x-1 duration-200 border border-black/5 shadow-sm">
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">{displayName}</h3>
                      {!isMenuItem && (
                        <>
                          <p className="text-sm text-on-surface-variant mt-1 flex flex-wrap gap-2">
                            <span className="bg-surface-variant px-2 py-0.5 rounded">{item.base}</span>
                            <span className="bg-surface-variant px-2 py-0.5 rounded">{item.sauce}</span>
                            <span className="bg-surface-variant px-2 py-0.5 rounded">{item.cheese}</span>
                          </p>
                          <p className="text-sm text-on-surface-variant mt-1">
                            {item.veggies?.concat(item.meat || []).join(', ')}
                          </p>
                        </>
                      )}
                      {isMenuItem && item.category && (
                        <p className="text-sm text-on-surface-variant mt-1 capitalize">
                          {item.category}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-lg text-on-surface">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-1 bg-surface-container rounded-full p-1 border border-outline-variant/30">
                      <button 
                        onClick={() => item.quantity > 1 && dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-primary transition-all active:scale-90"
                      >
                        <span className="text-lg font-bold">-</span>
                      </button>
                      <span className="px-3 text-sm font-semibold w-8 text-center">{item.quantity || 1}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ index, quantity: (item.quantity || 1) + 1 }))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-primary transition-all active:scale-90"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(index))}
                      className="text-on-surface-variant hover:text-error flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sticky top-24 border border-white/40 shadow-xl overflow-hidden relative">
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
                  <span className="font-bold text-lg text-on-surface">Total</span>
                  <span className="font-black text-3xl text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-4 rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={() => navigate('/menu')}
                className="w-full bg-surface-variant/50 text-on-surface-variant py-4 rounded-xl text-sm font-bold hover:bg-surface-variant transition-all border border-outline-variant/50"
              >
                Browse Menu
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant flex items-center gap-4 text-on-surface-variant">
              <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center shrink-0">
                <span>⏱️</span>
              </div>
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

export default Cart;