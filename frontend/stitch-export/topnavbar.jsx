import React from 'react';
import { ShoppingCart, User, Search, Menu as MenuIcon } from 'lucide-react';

const TopNavBar = ({ activeLink = 'Menu' }) => {
  const navLinks = ['Menu', 'Deals', 'Track Order', 'Locations'];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 h-16 bg-white/60 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-black text-red-600 italic tracking-tighter">
          PizzaSaaS
        </div>
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-medium transition-colors hover:text-red-600 ${
                activeLink === link ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1' : 'text-gray-600'
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 w-48 lg:w-64"
          />
        </div>
        <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>
        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
          <User className="w-6 h-6" />
        </button>
        <button className="md:hidden p-2 text-gray-600">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default TopNavBar;