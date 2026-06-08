import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideNavBarFixed from './SideNavBarFixed';
import { logout } from '../../store/slices/authSlice';
import { LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      <SideNavBarFixed />
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen relative">
        <header className="sticky top-0 z-30 h-16 bg-white/60 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-8">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-black text-primary italic">Slices Admin</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-on-surface-variant">{user?.name}</span>
            <button onClick={handleLogout} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;