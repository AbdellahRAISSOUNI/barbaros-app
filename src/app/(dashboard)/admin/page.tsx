'use client';

import { useEffect, useState } from 'react';
import { 
  FaUsers, 
  FaQrcode, 
  FaCut, 
  FaChartLine,
  FaDatabase
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dbStatus, setDbStatus] = useState({ status: 'loading', message: 'Checking connection...', dbName: '' });
  
  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // Check database status
    const checkDbStatus = async () => {
      try {
        const response = await axios.get('/api/db-status');
        if (response.data.connected) {
          setDbStatus({
            status: 'connected',
            message: 'Connected',
            dbName: response.data.data?.databaseName || 'barbaros'
          });
        } else {
          setDbStatus({
            status: 'error',
            message: response.data.message || 'Connection failed',
            dbName: ''
          });
        }
      } catch (error) {
        setDbStatus({
          status: 'error',
          message: 'Failed to connect to database',
          dbName: ''
        });
      }
    };
    
    checkDbStatus();
  }, [status, router]);
  
  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Database Status */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">System Status</h2>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <FaDatabase className="text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-800 font-medium">
              Database Status: 
              <span className={
                dbStatus.status === 'connected' ? 'text-green-500 ml-1' : 
                dbStatus.status === 'loading' ? 'text-yellow-500 ml-1' : 'text-red-500 ml-1'
              }>{dbStatus.message}</span>
            </p>
            {dbStatus.dbName && (
              <p className="text-sm text-gray-500">Database: {dbStatus.dbName}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Access Cards */}
      <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/clients" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FaUsers className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-800">Clients</p>
              <p className="text-sm text-gray-500">Manage client data</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/services" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FaCut className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-800">Services</p>
              <p className="text-sm text-gray-500">Manage service offerings</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/scanner" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <FaQrcode className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-800">Scanner</p>
              <p className="text-sm text-gray-500">Scan client QR codes</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/reports" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <FaChartLine className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-800">Reports</p>
              <p className="text-sm text-gray-500">View analytics</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Stats Placeholders */}
      <h2 className="text-lg font-medium text-gray-800 mb-4">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total Clients</p>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Services Provided</p>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Rewards Redeemed</p>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">New Clients</p>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 