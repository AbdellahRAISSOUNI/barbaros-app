'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  FaUsers, 
  FaQrcode, 
  FaChartLine, 
  FaCog, 
  FaCut,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };
  
  const NavItems = () => (
    <>
      <div className="px-4 py-2">
        <p className="text-xs uppercase tracking-wider text-gray-500">Management</p>
        <div className="mt-3 space-y-1">
          <Link 
            href="/admin" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin') && !pathname?.includes('/admin/') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaChartLine className="mr-3 text-lg" />
            Dashboard
          </Link>
          <Link 
            href="/admin/clients" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/clients') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUsers className="mr-3 text-lg" />
            Clients
          </Link>
          <Link 
            href="/admin/services" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/services') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCut className="mr-3 text-lg" />
            Services
          </Link>
          <Link 
            href="/admin/scanner" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/scanner') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaQrcode className="mr-3 text-lg" />
            Scanner
          </Link>
          <Link 
            href="/admin/reports" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/reports') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaChartLine className="mr-3 text-lg" />
            Reports
          </Link>
        </div>
      </div>
      <div className="px-4 py-2 mt-8">
        <p className="text-xs uppercase tracking-wider text-gray-500">Settings</p>
        <div className="mt-3 space-y-1">
          <Link 
            href="/admin/settings" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/settings') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCog className="mr-3 text-lg" />
            Settings
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      
      {/* Mobile sidebar */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      />
      
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Barbaros</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <nav className="mt-6 pb-24 lg:pb-0">
          <NavItems />
        </nav>
      </aside>
    </>
  );
} 