import { NavLink } from 'react-router-dom';

const SideNavBarFixed = () => {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface-container border-r border-outline-variant w-60">
      <div className="p-6">
        <h1 className="text-xl font-bold text-on-surface">Admin Panel</h1>
        <p className="text-on-surface-variant text-sm">Kitchen Dashboard</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink 
          to="/admin/dashboard" 
          end
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container translate-x-1' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <span className="text-xl">🧾</span>
          <span className="text-sm">Orders</span>
        </NavLink>
        
        <NavLink 
          to="/admin/inventory" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container translate-x-1' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <span className="text-xl">📦</span>
          <span className="text-sm">Inventory</span>
        </NavLink>
        
        <NavLink 
          to="/admin/analytics" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container translate-x-1' : 'text-on-surface-variant hover:bg-surface-variant'}`}
        >
          <span className="text-xl">📈</span>
          <span className="text-sm">Analytics</span>
        </NavLink>
      </nav>
      
      <div className="px-4 py-6 border-t border-outline-variant space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full text-left">
          <span className="text-xl">⚙️</span>
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold active:scale-95 duration-100 hover:opacity-90">
          Go Live
        </button>
      </div>
    </aside>
  );
};

export default SideNavBarFixed;
