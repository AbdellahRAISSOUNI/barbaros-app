'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCut, FaGift } from 'react-icons/fa';

interface Visit {
  id: string;
  date: string;
  services: string[];
}

interface ClientInfo {
  _id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  visitCount: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  qrCodeUrl: string;
  lastVisit?: Date;
  accountActive: boolean;
}

interface ClientInfoCardProps {
  clientId: string;
  onClose?: () => void;
  className?: string;
}

export function ClientInfoCard({
  clientId,
  onClose,
  className = '',
}: ClientInfoCardProps) {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch client information
        const response = await fetch(`/api/clients/${clientId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch client information');
        }
        
        const data = await response.json();
        setClientInfo(data);
        
        // For now, we'll use empty recent visits
        // In a real implementation, you would fetch recent visits from an API
        setRecentVisits([]);
      } catch (err) {
        console.error('Error fetching client info:', err);
        setError('Failed to load client information');
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClientInfo();
    }
  }, [clientId]);

  // Calculate loyalty progress percentage
  // Assuming 10 visits required for a reward
  const visitsRequired = 10;
  const progressPercentage = clientInfo 
    ? Math.min(Math.round((clientInfo.visitCount / visitsRequired) * 100), 100)
    : 0;

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !clientInfo) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error || 'Client information not found'}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-medium text-gray-800">Client Information</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        )}
      </div>
      
      {/* Client Basic Info */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="p-2 rounded-full bg-gray-100 mr-3">
            <FaUser className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium">{clientInfo.firstName} {clientInfo.lastName}</p>
            <p className="text-sm text-gray-500">Client ID: {clientInfo.clientId}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            <span className="text-sm">{clientInfo.email}</span>
          </div>
          
          {clientInfo.phoneNumber && (
            <div className="flex items-center">
              <FaPhone className="text-gray-500 mr-2" />
              <span className="text-sm">{clientInfo.phoneNumber}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Loyalty Progress */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Loyalty Progress</h3>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>{clientInfo.visitCount} visits</span>
            <span>{visitsRequired} visits for reward</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {clientInfo.visitCount >= visitsRequired ? (
          <div className="bg-green-100 text-green-800 p-2 rounded-md text-sm text-center">
            Client has earned a free service!
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {visitsRequired - clientInfo.visitCount} more visits until free service
          </p>
        )}
      </div>
      
      {/* Recent Visits */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Visits</h3>
        {recentVisits.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentVisits.map((visit) => (
              <li key={visit.id} className="py-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100 mr-3">
                    <FaCut className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(visit.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {visit.services.join(', ')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 py-2">No recent visits</p>
        )}
      </div>
      
      {/* Rewards */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rewards</h3>
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-yellow-100 mr-3">
            <FaGift className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {clientInfo.rewardsEarned - clientInfo.rewardsRedeemed} available rewards
            </p>
            {(clientInfo.rewardsEarned - clientInfo.rewardsRedeemed) > 0 && (
              <p className="text-xs text-gray-500">
                Client can redeem rewards
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="px-4 py-2 bg-black text-white rounded-md flex-1">
          Record Visit
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex-1">
          Edit Client
        </button>
      </div>
    </div>
  );
}