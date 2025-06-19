'use client';

import { useState } from 'react';
import { FaSearch, FaSpinner, FaUser, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';

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
  const [searchType, setSearchType] = useState<'name' | 'email' | 'phone' | 'clientId'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{id: string, name: string, email: string}>>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    if (searchTerm.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the general search API that searches across multiple fields
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(searchTerm.trim())}&page=1&limit=10`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No clients found matching your search');
          if (onError) onError('No clients found');
          return;
        }
        throw new Error('Failed to search for clients');
      }
      
      const data = await response.json();
      
      if (data.clients && data.clients.length > 0) {
        // If only one client found, select it automatically
        if (data.clients.length === 1) {
          const client = data.clients[0];
          onClientFound(client._id); // Use MongoDB _id for consistency
          
          // Add to recent searches
          if (!recentSearches.some(search => search.id === client._id)) {
            setRecentSearches(prev => [
              { 
                id: client._id, 
                name: `${client.firstName} ${client.lastName}`, 
                email: client.email 
              },
              ...prev.slice(0, 4)
            ]);
          }
        } else {
          // Multiple clients found - show them for selection
          setError(`Found ${data.clients.length} clients. Please be more specific or select from results below.`);
        }
      } else {
        setError('No clients found matching your search');
        if (onError) onError('No clients found');
      }
    } catch (err) {
      console.error('Error searching for clients:', err);
      setError('Failed to search for clients. Please try again.');
      if (onError) onError('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchClick = (clientId: string) => {
    onClientFound(clientId);
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'name': return 'Enter first name, last name, or both';
      case 'email': return 'Enter email address';
      case 'phone': return 'Enter phone number';
      case 'clientId': return 'Enter client ID';
      default: return 'Enter search term';
    }
  };

  const getSearchIcon = () => {
    switch (searchType) {
      case 'name': return FaUser;
      case 'email': return FaEnvelope;
      case 'phone': return FaPhone;
      case 'clientId': return FaSearch;
      default: return FaSearch;
    }
  };

  const SearchIcon = getSearchIcon();

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaSearch className="h-5 w-5 mr-2" />
            Manual Client Search
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Search By</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'name', label: 'Name', icon: FaUser },
                  { value: 'email', label: 'Email', icon: FaEnvelope },
                  { value: 'phone', label: 'Phone', icon: FaPhone },
                  { value: 'clientId', label: 'Client ID', icon: FaSearch },
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="relative">
                    <input
                      type="radio"
                      name="search-type"
                      value={value}
                      checked={searchType === value}
                      onChange={(e) => setSearchType(e.target.value as any)}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      searchType === value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Search Input */}
            <div>
              <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-2">
                Search Term
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search-term"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">Search Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}
            
            {/* Search Button */}
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim() || searchTerm.trim().length < 2}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                isLoading || !searchTerm.trim() || searchTerm.trim().length < 2
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 shadow-sm'
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch className="h-4 w-4 mr-2" />
                  Search Clients
                </>
              )}
            </button>
          </form>
          
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <FaClock className="h-4 w-4 mr-2" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleRecentSearchClick(client.id)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <FaUser className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                      <FaSearch className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Type at least 2 characters to start searching</p>
              <p>• You can search by partial names (e.g., "John" or "Smith")</p>
              <p>• Email searches work with partial addresses</p>
              <p>• Phone searches work with any part of the number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}