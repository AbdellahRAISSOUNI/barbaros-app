'use client';

import { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface ClientLookupProps {
  onClientFound: (clientId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function ClientLookup({
  onClientFound,
  onError,
  className = '',
}: ClientLookupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{id: string, name: string, email: string}>>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call to search for clients
      // For now, we'll simulate a search with a timeout
      
      // Simulated API call
      const response = await fetch(`/api/clients/search?${searchType}=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search for client');
      }
      
      const data = await response.json();
      
      if (data.client) {
        // Client found
        onClientFound(data.client.id);
        
        // Add to recent searches if not already there
        if (!recentSearches.some(search => search.id === data.client.id)) {
          setRecentSearches(prev => [
            { 
              id: data.client.id, 
              name: data.client.name, 
              email: data.client.email 
            },
            ...prev.slice(0, 4) // Keep only the 5 most recent
          ]);
        }
      } else {
        setError('No client found with the provided information');
        if (onError) onError('No client found');
      }
    } catch (err) {
      console.error('Error searching for client:', err);
      setError('Failed to search for client');
      if (onError) onError('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchClick = (clientId: string) => {
    onClientFound(clientId);
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Manual Client Lookup</h2>
        
        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <label htmlFor="search-type" className="block text-sm font-medium text-gray-700 mb-1">
              Search By
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="search-type"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={() => setSearchType('email')}
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="search-type"
                  value="phone"
                  checked={searchType === 'phone'}
                  onChange={() => setSearchType('phone')}
                />
                <span className="ml-2">Phone</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">
              {searchType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={searchType === 'email' ? 'email' : 'tel'}
              id="search-term"
              className="w-full p-2 border rounded-md"
              placeholder={searchType === 'email' ? 'client@example.com' : '(123) 456-7890'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
              isLoading || !searchTerm.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Search
              </>
            )}
          </button>
        </form>
        
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
            <ul className="divide-y divide-gray-200">
              {recentSearches.map((client) => (
                <li key={client.id} className="py-2">
                  <button
                    onClick={() => handleRecentSearchClick(client.id)}
                    className="w-full text-left hover:bg-gray-50 p-2 rounded-md"
                  >
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 