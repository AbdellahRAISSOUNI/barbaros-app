'use client';

import { useSession } from 'next-auth/react';

export default function ClientProfilePage() {
  const { data: session } = useSession();
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="bg-gray-100 p-2 rounded">{session?.user?.name || 'Loading...'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="bg-gray-100 p-2 rounded">{session?.user?.email || 'Loading...'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="bg-gray-100 p-2 rounded">Not set</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-500">Profile editing functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
} 