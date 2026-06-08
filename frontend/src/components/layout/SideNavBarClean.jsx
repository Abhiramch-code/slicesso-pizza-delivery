import { Receipt, Package, BarChart3, Bell, Settings, HelpCircle, PlayCircle } from 'lucide-react';

const SideNavBarClean = ({ activeTab = 'Orders' }) => {
  const mainTabs = [
    { label: 'Orders', icon: Receipt },
    { label: 'Inventory', icon: Package },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Notifications', icon: Bell, badge: true },
  ];

  const footerTabs = [
    { label: 'Settings', icon: Settings },
    { label: 'Support', icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-40">
      <div className="p-6">
        <div className="text-xl font-bold text-gray-900 mb-1">Admin Panel</div>
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Kitchen Dashboard</div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {mainTabs.map((tab) => (
          <a
            key={tab.label}
            href={`/admin/${tab.label.toLowerCase()}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.label
                ? 'bg-red-50 text-red-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.label ? 'text-red-600' : 'text-gray-400'}`} />
            {tab.label}
            {tab.badge && <span className="ml-auto w-2 h-2 bg-red-600 rounded-full" />}
          </a>
        ))}
      </nav>

      <div className="px-4 mb-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20">
          <PlayCircle className="w-5 h-5" />
          Go Live
        </button>
      </div>

      <div className="px-4 py-6 border-t border-gray-200 space-y-1">
        {footerTabs.map((tab) => (
          <a
            key={tab.label}
            href={`/admin/${tab.label.toLowerCase()}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <tab.icon className="w-5 h-5 text-gray-400" />
            {tab.label}
          </a>
        ))}
      </div>
    </aside>
  );
};

export default SideNavBarClean;
