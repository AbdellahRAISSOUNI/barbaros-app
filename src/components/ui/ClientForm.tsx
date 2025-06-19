'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Client {
  _id?: string;
  clientId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountActive: boolean;
  password?: string; // Only for new clients
}

interface ClientFormProps {
  client?: Client;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  className?: string;
}

export function ClientForm({
  client,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
  className = '',
}: ClientFormProps) {
  const [formData, setFormData] = useState<Client>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    accountActive: true,
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with client data if provided
  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        password: '', // Don't include password when editing
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = Boolean(client?._id);

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditMode ? 'Edit Client' : 'Add New Client'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isEditMode ? 'Update client information' : 'Create a new client account'}
        </p>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                  className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                  className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
          
          {/* Phone Field */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
          
          {/* Password Field - Only for new clients */}
          {!isEditMode && (
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEditMode}
                  placeholder="Enter password"
                  className="pl-10 pr-10 w-full rounded-lg border border-gray-300 py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>
          )}
          
          {/* Account Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="accountActive"
                  name="accountActive"
                  checked={formData.accountActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="accountActive"
                  className={`flex items-center cursor-pointer transition-all duration-200 ${
                    formData.accountActive ? 'text-green-700' : 'text-gray-500'
                  }`}
                >
                  <span
                    className={`inline-block w-10 h-6 rounded-full transition-all duration-200 ${
                      formData.accountActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                        formData.accountActive ? 'translate-x-5' : 'translate-x-1'
                      } mt-1`}
                    />
                  </span>
                  <span className="ml-3 text-sm font-medium">
                    {formData.accountActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
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
          
          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center transition-all duration-200"
            >
              <FaTimes className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Client' : 'Create Client'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}