'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaQrcode, FaEdit, FaTrash, FaEye, FaSearch, FaUsers, FaPhone, FaEnvelope, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { ClientSearch } from '@/components/ui/ClientSearch';
import { Pagination } from '@/components/ui/Pagination';
import { ClientForm } from '@/components/ui/ClientForm';
import { QRCodeModal } from '@/components/ui/QRCodeModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

interface Client {
  _id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  visitCount: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  qrCodeUrl: string;
  accountActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  clients: Client[];
  totalClients: number;
  totalPages: number;
  currentPage: number;
}

export default function ClientsPage() {
  // State for clients data and pagination
  const [clients, setClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // State for client form modal
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // State for QR code modal
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeClient, setQRCodeClient] = useState<Client | null>(null);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch clients on component mount and when pagination or search changes
  useEffect(() => {
    fetchClients();
  }, [currentPage, searchQuery]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = searchQuery
        ? `/api/clients/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${pageSize}`
        : `/api/clients?page=${currentPage}&limit=${pageSize}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const data: PaginatedResponse = await response.json();
      
      setClients(data.clients);
      setTotalClients(data.totalClients);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setFormError(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormError(null);
    setShowClientForm(true);
  };

  const handleViewQRCode = (client: Client) => {
    setQRCodeClient(client);
    setShowQRModal(true);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleClientSubmit = async (clientData: any) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const isEditing = Boolean(selectedClient?._id);
      const url = isEditing 
        ? `/api/clients/${selectedClient?._id}` 
        : '/api/clients';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save client');
      }
      
      // Close the form and refresh the client list
      setShowClientForm(false);
      fetchClients();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/clients/${clientToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      // Close the modal and refresh the client list
      setShowDeleteModal(false);
      setClientToDelete(null);
      fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const ClientCard = ({ client }: { client: Client }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {client.firstName} {client.lastName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">ID: {client.clientId}</p>
        </div>
        <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
          client.accountActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {client.accountActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaEnvelope className="h-4 w-4 mr-3 text-gray-400" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaPhone className="h-4 w-4 mr-3 text-gray-400" />
          <span>{client.phoneNumber}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaUsers className="h-4 w-4 mr-3 text-gray-400" />
          <span>{client.visitCount} visits</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewQRCode(client)}
          className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          title="View QR Code"
        >
          <FaQrcode className="h-4 w-4 mr-2" />
          QR Code
        </button>
        <button
          onClick={() => handleEditClient(client)}
          className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          title="Edit Client"
        >
          <FaEdit className="h-4 w-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(client)}
          className="flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          title="Delete Client"
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
              <p className="text-gray-600">Manage your barbershop clients and their information</p>
            </div>
            <button
              onClick={handleAddClient}
              className="mt-4 sm:mt-0 flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 shadow-sm"
            >
              <FaPlus className="h-4 w-4 mr-2" />
              Add New Client
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUsers className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Clients</p>
                  <p className="text-xl font-semibold text-gray-900">{totalClients}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUsers className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Active Clients</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {clients.filter(c => c.accountActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaQrcode className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">QR Codes</p>
                  <p className="text-xl font-semibold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <ClientSearch onSearch={handleSearch} />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Visits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center space-x-2">
                          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading clients...</span>
                        </div>
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No clients found' : 'No clients yet'}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {searchQuery 
                              ? 'Try adjusting your search criteria.' 
                              : 'Get started by adding your first client.'
                            }
                          </p>
                          {!searchQuery && (
                            <button
                              onClick={handleAddClient}
                              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                            >
                              <FaPlus className="h-4 w-4 mr-2" />
                              Add First Client
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{client.clientId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {client.visitCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                            client.accountActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {client.accountActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewQRCode(client)}
                              className="text-gray-600 hover:text-black focus:outline-none transition-colors"
                              title="View QR Code"
                            >
                              <FaQrcode className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditClient(client)}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                              title="Edit Client"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(client)}
                              className="text-red-600 hover:text-red-800 focus:outline-none transition-colors"
                              title="Delete Client"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading clients...</span>
                </div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search criteria.' 
                    : 'Get started by adding your first client.'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleAddClient}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add First Client
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map((client) => (
                  <ClientCard key={client._id} client={client} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
      
      {/* Client Form Modal */}
      {showClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ClientForm
              client={selectedClient || undefined}
              onSubmit={handleClientSubmit}
              onCancel={() => setShowClientForm(false)}
              isSubmitting={isSubmitting}
              error={formError}
            />
          </div>
        </div>
      )}
      
      {/* QR Code Modal */}
      {showQRModal && qrCodeClient && (
        <QRCodeModal
          clientId={qrCodeClient._id}
          clientName={`${qrCodeClient.firstName} ${qrCodeClient.lastName}`}
          qrCodeUrl={qrCodeClient.qrCodeUrl}
          onClose={() => setShowQRModal(false)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && clientToDelete && (
        <DeleteConfirmationModal
          title="Delete Client"
          message={`Are you sure you want to delete ${clientToDelete.firstName} ${clientToDelete.lastName}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}