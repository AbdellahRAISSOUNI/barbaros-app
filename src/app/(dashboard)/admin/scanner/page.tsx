'use client';

import { useState } from 'react';
import { QRCodeScanner } from '@/components/ui/QRCodeScanner';
import { ClientLookup } from '@/components/ui/ClientLookup';
import { ClientInfoCard } from '@/components/ui/ClientInfoCard';
import { FaQrcode, FaSearch } from 'react-icons/fa';

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'lookup'>('scan');
  const [clientId, setClientId] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleClientFound = (id: string) => {
    setClientId(id);
    setScanError(null);
  };

  const handleScanError = (error: string) => {
    setScanError(error);
  };

  const handleReset = () => {
    setClientId(null);
    setScanError(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Client Scanner</h1>

      {!clientId ? (
        <div>
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'scan'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('scan')}
            >
              <FaQrcode className="inline mr-2" />
              Scan QR Code
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'lookup'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('lookup')}
            >
              <FaSearch className="inline mr-2" />
              Manual Lookup
            </button>
          </div>

          {/* Scanner or Lookup Form */}
          {activeTab === 'scan' ? (
            <QRCodeScanner 
              onScanSuccess={handleClientFound} 
              onScanError={handleScanError}
              onManualEntry={() => setActiveTab('lookup')}
            />
          ) : (
            <ClientLookup 
              onClientFound={handleClientFound}
              onError={handleScanError}
            />
          )}

          {/* Error Display */}
          {scanError && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              {scanError}
            </div>
          )}
        </div>
      ) : (
        <ClientInfoCard 
          clientId={clientId} 
          onClose={handleReset}
        />
      )}
    </div>
  );
} 