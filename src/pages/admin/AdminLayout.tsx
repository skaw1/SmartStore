
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Icons } from '../../components/icons';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import ToastContainer from '../../components/ToastContainer';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-gray-900 text-white";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </NavLink>
  );
};


const AdminLayout: React.FC = () => {
  const { settings } = useData();
  const { adminLogout, lastUserPath } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
    // Close sidebar on navigation on mobile
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(p => p.length > 0 && p !== 'admin');
    const baseTitle = `${settings.shopName} - Admin`;
    if (pathParts.length === 0 || pathParts[0] === 'dashboard') {
        document.title = `Dashboard | ${baseTitle}`;
    } else {
        const pageName = pathParts[pathParts.length - 1];
        const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        document.title = `${formattedPageName} | ${baseTitle}`;
    }
  }, [location.pathname, settings.shopName]);

  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-background-dark font-sans overflow-hidden">
        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && (
            <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
            ></div>
        )}

      <aside 
            className={`w-64 bg-primary-dark text-white flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-40
                        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <Link to="/home" className="flex items-center gap-2 text-white">
            <Icons.Store className="h-6 w-6" />
            <span className="font-bold text-lg">{settings.shopName}</span>
          </Link>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 -mr-2 text-gray-300 hover:text-white">
              <Icons.X className="h-6 w-6"/>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/admin/dashboard" icon={<Icons.LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
          <NavItem to="/admin/inventory" icon={<Icons.Package className="h-5 w-5" />} label="Inventory" />
          <NavItem to="/admin/orders" icon={<Icons.ListOrdered className="h-5 w-5" />} label="Orders" />
          <NavItem to="/admin/settings" icon={<Icons.Settings className="h-5 w-5" />} label="Settings" />
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <button
             onClick={handleLogout}
             className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-red-800/50 hover:text-white"
          >
             <Icons.LogOut className="h-5 w-5" />
             <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

       <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 bg-white dark:bg-primary-dark border-b dark:border-gray-800 flex items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-8 flex-shrink-0">
                {/* Hamburger Menu Button */}
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="lg:hidden p-1 text-gray-700 dark:text-gray-300"
                    aria-label="Open sidebar"
                >
                    <Icons.Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link to={lastUserPath}>
                            <Icons.Store className="mr-2 h-4 w-4"/>
                            View Store
                        </Link>
                    </Button>
                    <ThemeToggleButton />
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
        <ToastContainer />
    </div>
  );
};

export default AdminLayout;
