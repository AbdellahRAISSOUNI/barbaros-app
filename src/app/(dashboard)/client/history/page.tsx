'use client';

export default function VisitHistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Visit History</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">No visits yet</h2>
          <p className="text-gray-500">Your visit history will appear here after your first visit.</p>
        </div>
      </div>
    </div>
  );
} 