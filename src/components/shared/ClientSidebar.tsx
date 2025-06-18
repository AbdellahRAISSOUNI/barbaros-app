'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  FaCalendarAlt, 
  FaHistory, 
  FaCog, 
  FaSignOutAlt, 
  FaQrcode, 
  FaHome, 
  FaGift,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export function ClientSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const NavItems = () => (
    <>
      <div className="px-4 py-2">
        <p className="text-xs uppercase tracking-wider text-gray-500">Dashboard</p>
        <div className="mt-3 space-y-1">
          <Link 
            href="/client" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/client') && pathname === '/client' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHome className="mr-3 text-lg" />
            Home
          </Link>
        </div>
      </div>
      
      <div className="px-4 py-2 mt-4">
        <p className="text-xs uppercase tracking-wider text-gray-500">Loyalty</p>
        <div className="mt-3 space-y-1">
          <Link 
            href="/client/history" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/client/history') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHistory className="mr-3 text-lg" />
            Visit History
          </Link>
          <Link 
            href="/client/rewards" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/client/rewards') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaGift className="mr-3 text-lg" />
            My Rewards
          </Link>
          <Link 
            href="/client/qrcode" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/client/qrcode') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaQrcode className="mr-3 text-lg" />
            My QR Code
          </Link>
        </div>
      </div>
      
      <div className="px-4 py-2 mt-4">
        <p className="text-xs uppercase tracking-wider text-gray-500">Account</p>
        <div className="mt-3 space-y-1">
          <Link 
            href="/client/profile" 
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/client/profile') 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCog className="mr-3 text-lg" />
            Profile
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
      
      {/* Mobile sidebar overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Barbaros</h1>
          <p className="text-sm text-gray-500">Client Dashboard</p>
        </div>
        
        <nav className="mt-6 pb-24 lg:pb-0">
          <NavItems />
        </nav>
      </aside>
    </>
  );
} 