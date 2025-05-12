import React, { useState } from 'react';
import { Menu, Bell, Search, Plus, ChevronDown, Settings, HelpCircle, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onSidebarToggle, sidebarOpen = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user } = useAuth();

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New Campaign Created',
      message: 'Your campaign "Summer Sale 2024" has been created successfully.',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Order Status Update',
      message: 'Order #12345 has been shipped and is on its way.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'New Customer Segment',
      message: 'A new customer segment "High Value Customers" has been created.',
      time: '3 hours ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          className="hidden lg:flex p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={onSidebarToggle}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {/* Search Bar */}
        <div className="hidden md:block w-[500px]">
          <Input
            placeholder="Search customers, campaigns, orders..."
            leftIcon={<Search size={18} className="text-gray-400" />}
            className="w-full bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-20">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-primary-50' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-primary-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-gray-100">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Campaign Button */}
        <div className="hidden md:block">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center space-x-2 px-4"
          >
            <Plus size={16} />
            <span>New Campaign</span>
          </Button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.email || 'user@example.com'}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-20">
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                <Settings size={16} className="text-gray-500" />
                <span>Settings</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                <HelpCircle size={16} className="text-gray-500" />
                <span>Help & Support</span>
              </button>
              <div className="border-t border-gray-100 my-1.5"></div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;