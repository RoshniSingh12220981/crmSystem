import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBasket,
  TargetIcon,
  Megaphone,
  History,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isMobile: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, setMobileOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBasket size={20} /> },
    { name: 'Segments', path: '/segments', icon: <TargetIcon size={20} /> },
    { name: 'Campaigns', path: '/campaigns', icon: <Megaphone size={20} /> },
    { name: 'Campaign History', path: '/campaign-history', icon: <History size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <aside className="bg-white border-r border-gray-200 h-full flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center space-x-2">
        <div className="p-2 bg-white rounded-lg shadow-md">
          <Megaphone size={24} className="text-primary-600" />
        </div>
        <h1 className="text-xl font-bold text-white">CRM System</h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              location.pathname === item.path
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
            )}
            onClick={handleLinkClick}
          >
            <span className={cn(
              'mr-3 transition-transform duration-200',
              location.pathname === item.path ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
            )}>
              {item.icon}
            </span>
            {item.name}
            <ChevronRight
              size={16}
              className={cn(
                'ml-auto opacity-0 -translate-x-2 transition-all duration-200',
                location.pathname === item.path ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'
              )}
            />
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <span className="mr-3 text-gray-500 group-hover:text-red-600">
              <LogOut size={20} />
            </span>
            Logout
          </button>
        </div>
      </nav>

      {/* User Profile Section */}
   
      
    </aside>
  );
};

export default Sidebar;