'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaQrcode, FaHistory, FaGift, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  
  // Mock loyalty data - will be replaced with real data from API
  const [loyaltyData, setLoyaltyData] = useState({
    visitsCount: 2,
    visitsRequired: 6,
    rewards: 0,
  });
  
  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await axios.get('/api/db-status');
        setDbStatus(response.data.connected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking database status:', error);
        setDbStatus('disconnected');
      }
    };
    
    checkDbStatus();
    
    // In the future, we'll fetch real loyalty data here
    // For now, we're using mock data
  }, []);
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">Please log in to access this page.</p>
        <Link href="/login" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded">
          Go to Login
        </Link>
      </div>
    );
  }
  
  // Calculate loyalty progress percentage
  const progressPercentage = Math.min(
    Math.round((loyaltyData.visitsCount / loyaltyData.visitsRequired) * 100),
    100
  );
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, {session.user.name}</h1>
      <p className="text-gray-600 mb-6">Here's your loyalty status</p>
      
      {/* Loyalty Progress Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Loyalty Progress</h2>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>{loyaltyData.visitsCount} visits</span>
            <span>{loyaltyData.visitsRequired} visits for reward</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-black h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          {loyaltyData.visitsCount >= loyaltyData.visitsRequired ? (
            <div className="text-green-600 font-medium">
              You've earned a free haircut! Show this to your barber.
            </div>
          ) : (
            <div className="text-gray-600">
              {loyaltyData.visitsRequired - loyaltyData.visitsCount} more visits until your free haircut
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link href="/client/qrcode" className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="bg-black rounded-full p-3 mb-3">
            <FaQrcode className="text-white text-xl" />
          </div>
          <span className="text-sm font-medium">My QR Code</span>
        </Link>
        
        <Link href="/client/history" className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="bg-black rounded-full p-3 mb-3">
            <FaHistory className="text-white text-xl" />
          </div>
          <span className="text-sm font-medium">Visit History</span>
        </Link>
        
        <Link href="/client/rewards" className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="bg-black rounded-full p-3 mb-3">
            <FaGift className="text-white text-xl" />
          </div>
          <span className="text-sm font-medium">My Rewards</span>
        </Link>
        
        <Link href="/client/profile" className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="bg-black rounded-full p-3 mb-3">
            <FaUser className="text-white text-xl" />
          </div>
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </div>
      
      {/* Recent Visits (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Visits</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Your visit history will appear here</p>
        </div>
      </div>
      
      {/* Database Status - Small footer info */}
      <div className="text-xs text-right text-gray-500 mt-4">
        Database: 
        <span className={`ml-1 ${
          dbStatus === 'connected' ? 'text-green-600' : 
          dbStatus === 'disconnected' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {dbStatus === 'connected' ? 'Connected' : 
           dbStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
        </span>
      </div>
    </div>
  );
} 