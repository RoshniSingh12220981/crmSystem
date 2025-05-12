import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? 'block' : 'hidden'
          }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-all duration-300 ease-in-out">
          <Sidebar isMobile={true} setMobileOpen={setMobileOpen} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar isMobile={false} setMobileOpen={setMobileOpen} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;