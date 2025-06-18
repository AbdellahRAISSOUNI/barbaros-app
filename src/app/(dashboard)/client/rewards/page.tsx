'use client';

import { useState } from 'react';

export default function RewardsPage() {
  // Mock loyalty data - will be replaced with real data from API
  const [loyaltyData, setLoyaltyData] = useState({
    visitsCount: 2,
    visitsRequired: 6,
    rewards: 0,
  });
  
  // Calculate loyalty progress percentage
  const progressPercentage = Math.min(
    Math.round((loyaltyData.visitsCount / loyaltyData.visitsRequired) * 100),
    100
  );
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Rewards</h1>
      
      {/* Loyalty Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Loyalty Card</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{loyaltyData.visitsCount} visits</span>
            <span className="font-medium">{loyaltyData.visitsRequired} visits for reward</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-black h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Stamp visualization */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {Array.from({ length: loyaltyData.visitsRequired }).map((_, index) => (
            <div 
              key={index} 
              className={`aspect-square rounded-full border-2 flex items-center justify-center ${
                index < loyaltyData.visitsCount 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {index < loyaltyData.visitsCount && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          {loyaltyData.visitsCount >= loyaltyData.visitsRequired ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-md">
              <p className="font-medium">Congratulations! You've earned a free haircut!</p>
              <p className="text-sm mt-1">Show this screen to your barber to redeem.</p>
            </div>
          ) : (
            <div className="text-gray-600">
              {loyaltyData.visitsRequired - loyaltyData.visitsCount} more visits until your free haircut
            </div>
          )}
        </div>
      </div>
      
      {/* Available Rewards */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Available Rewards</h2>
        
        {loyaltyData.rewards > 0 ? (
          <div className="space-y-4">
            {/* This would be a list of rewards */}
            <div className="p-4 border rounded-md">
              <div className="font-medium">Free Haircut</div>
              <div className="text-sm text-gray-500">Expires: Never</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any rewards yet</p>
            <p className="text-sm mt-1">Visit us to earn loyalty points!</p>
          </div>
        )}
      </div>
    </div>
  );
} 