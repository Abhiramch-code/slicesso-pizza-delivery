import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const TopNavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 h-16 bg-white/60 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-black text-red-600 italic tracking-tighter">Slices</Link>
        <div className="hidden md:flex gap-6">
          {isAuthenticated && user?.role === 'user' && (
            <>
              <Link to="/pizza-builder" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Menu</Link>
              <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Track Order</Link>
            </>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Admin Panel</Link>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/pizza-builder" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Menu</Link>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Track Order</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{items.length}</span>
              )}
            </Link>
            <Link to="/profile" className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600 transition-colors" title="Logout">
              <LogOut className="w-6 h-6" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNavBar;