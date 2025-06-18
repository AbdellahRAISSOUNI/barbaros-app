'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { parseQRCodeData } from '@/lib/utils/qrcode';
import { FaCamera, FaStop, FaSearch } from 'react-icons/fa';

interface QRCodeScannerProps {
  onScanSuccess: (clientId: string) => void;
  onScanError?: (error: string) => void;
  onManualEntry?: () => void;
  className?: string;
}

export function QRCodeScanner({
  onScanSuccess,
  onScanError,
  onManualEntry,
  className = '',
}: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  // Initialize scanner
  useEffect(() => {
    // Create scanner instance
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(
            devices.map((device) => ({
              id: device.id,
              label: device.label || `Camera ${device.id}`,
            }))
          );
          setSelectedCamera(devices[0].id); // Select first camera by default
        } else {
          setError('No cameras found');
        }
      })
      .catch((err) => {
        console.error('Error getting cameras:', err);
        setError('Failed to access camera. Please ensure camera permissions are granted.');
      });

    // Cleanup
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current || !selectedCamera) return;

    try {
      setError(null);
      setIsScanning(true);

      const qrCodeSuccessCallback = (decodedText: string) => {
        try {
          const parsedData = parseQRCodeData(decodedText);
          
          if (parsedData && parsedData.id && parsedData.type === 'barbaros-client') {
            onScanSuccess(parsedData.id);
            stopScanner();
          } else {
            setError('Invalid QR code format');
            if (onScanError) onScanError('Invalid QR code format');
          }
        } catch (err) {
          setError('Failed to process QR code');
          if (onScanError) onScanError('Failed to process QR code');
        }
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      };

      await scannerRef.current.start(
        selectedCamera,
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // This is an ongoing error, only log it
          console.error('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start scanner');
      setIsScanning(false);
      if (onScanError) onScanError('Failed to start scanner');
    }
  };

  const stopScanner = () => {
    if (
      scannerRef.current &&
      scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
        })
        .catch((err) => {
          console.error('Error stopping scanner:', err);
        });
    } else {
      setIsScanning(false);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isScanning) {
      stopScanner();
    }
    setSelectedCamera(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">QR Code Scanner</h2>

        {/* Camera selection */}
        <div className="mb-4">
          <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Camera
          </label>
          <select
            id="camera-select"
            className="w-full p-2 border rounded-md"
            value={selectedCamera || ''}
            onChange={handleCameraChange}
            disabled={isScanning}
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
            {cameras.length === 0 && (
              <option value="" disabled>
                No cameras available
              </option>
            )}
          </select>
        </div>

        {/* Scanner container */}
        <div 
          id={scannerContainerId} 
          className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"
        ></div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isScanning ? (
            <button
              onClick={startScanner}
              disabled={!selectedCamera}
              className={`flex items-center justify-center px-4 py-2 rounded-md ${
                !selectedCamera
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <FaCamera className="mr-2" />
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FaStop className="mr-2" />
              Stop Scanning
            </button>
          )}

          {onManualEntry && (
            <button
              onClick={onManualEntry}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              <FaSearch className="mr-2" />
              Manual Entry
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Point the camera at a client's QR code to scan.</p>
          <p>Make sure the QR code is well-lit and clearly visible.</p>
        </div>
      </div>
    </div>
  );
} 