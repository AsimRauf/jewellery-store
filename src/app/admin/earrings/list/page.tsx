'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HiPencil, 
  HiTrash, 
  HiPlus, 
  HiSearch,
  HiEye,
  HiAdjustments
} from 'react-icons/hi';

interface Earring {
  _id: string;
  sku: string;
  productNumber: string;
  name: string;
  type: string;
  backType: string;
  metal: string;
  style: string;
  length?: number;
  width?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{
    url: string;
    publicId: string;
  }>;
  isAvailable: boolean;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function EarringsList() {
  const { user } = useUser();
  
  const [earrings, setEarrings] = useState<Earring[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState('');
  const [metalFilter, setMetalFilter] = useState('');
  const [backTypeFilter, setBackTypeFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');

  const fetchEarrings = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      if (typeFilter) queryParams.append('type', typeFilter);
      if (metalFilter) queryParams.append('metal', metalFilter);
      if (backTypeFilter) queryParams.append('backType', backTypeFilter);
      if (styleFilter) queryParams.append('style', styleFilter);

      const response = await fetch(`/api/admin/earrings?${queryParams}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch earrings');
      }

      const result = await response.json();
      setEarrings(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching earrings:', error);
      toast.error('Failed to fetch earrings');
    } finally {
      setIsLoading(false);
    }
  }, [search, sortBy, sortOrder, typeFilter, metalFilter, backTypeFilter, styleFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this earring?')) return;

    try {
      const response = await fetch(`/api/admin/earrings/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete earring');
      }

      toast.success('Earring deleted successfully');
      fetchEarrings(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting earring:', error);
      toast.error('Failed to delete earring');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/earrings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          isAvailable: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update earring');
      }

      toast.success('Earring status updated');
      fetchEarrings(pagination.currentPage);
    } catch (error) {
      console.error('Error updating earring:', error);
      toast.error('Failed to update earring status');
    }
  };

  const handleSearch = () => {
    fetchEarrings(1);
  };

  const handlePageChange = (page: number) => {
    fetchEarrings(page);
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setMetalFilter('');
    setBackTypeFilter('');
    setStyleFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    fetchEarrings(1);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEarrings();
    }
  }, [user, sortBy, sortOrder, fetchEarrings]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Earrings Management</h1>
            <Link
              href="/admin/earrings"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Add New Earring
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by SKU, name, type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="Stud">Stud</option>
                  <option value="Drop">Drop</option>
                  <option value="Dangle">Dangle</option>
                  <option value="Hoop">Hoop</option>
                  <option value="Huggie">Huggie</option>
                  <option value="Chandelier">Chandelier</option>
                  <option value="Cluster">Cluster</option>
                  <option value="Climber">Climber</option>
                  <option value="Threader">Threader</option>
                  <option value="Jacket">Jacket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Back Type</label>
                <select
                  value={backTypeFilter}
                  onChange={(e) => setBackTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Back Types</option>
                  <option value="Push Back">Push Back</option>
                  <option value="Screw Back">Screw Back</option>
                  <option value="Lever Back">Lever Back</option>
                  <option value="French Wire">French Wire</option>
                  <option value="Clip On">Clip On</option>
                  <option value="Magnetic">Magnetic</option>
                  <option value="Threader">Threader</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
                <select
                  value={metalFilter}
                  onChange={(e) => setMetalFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Metals</option>
                  <option value="14K Gold">14K Gold</option>
                  <option value="18K Gold">18K Gold</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Yellow Gold">Yellow Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Sterling Silver">Sterling Silver</option>
                  <option value="Titanium">Titanium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Styles</option>
                  <option value="Classic">Classic</option>
                  <option value="Modern">Modern</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Bohemian">Bohemian</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Statement">Statement</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Edgy">Edgy</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <HiSearch className="w-4 h-4 mr-2" />
                Search
              </button>
              
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <HiAdjustments className="w-4 h-4 mr-2" />
                Clear Filters
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earrings</h3>
              <p className="text-3xl font-bold text-indigo-600">{pagination.totalCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {earrings.filter(e => e.isAvailable).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unavailable</h3>
              <p className="text-3xl font-bold text-red-600">
                {earrings.filter(e => !e.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        {/* Earrings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading earrings...</p>
            </div>
          ) : earrings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No earrings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earring
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earrings.map((earring) => (
                    <tr key={earring._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            {earring.images && earring.images.length > 0 ? (
                              <Image
                                src={earring.images[0].url}
                                alt={earring.name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {earring.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {earring.sku}
                            </div>
                            <div className="text-sm text-gray-500">
                              PN: {earring.productNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div><strong>Type:</strong> {earring.type}</div>
                          <div><strong>Back:</strong> {earring.backType}</div>
                          <div><strong>Metal:</strong> {earring.metal}</div>
                          <div><strong>Style:</strong> {earring.style}</div>
                          {earring.length && <div><strong>Length:</strong> {earring.length}mm</div>}
                          {earring.width && <div><strong>Width:</strong> {earring.width}mm</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-semibold">${earring.price.toLocaleString()}</div>
                          {earring.salePrice && (
                            <div className="text-sm text-green-600">
                              Sale: ${earring.salePrice.toLocaleString()}
                            </div>
                          )}
                          {earring.discountPercentage && (
                            <div className="text-xs text-red-600">
                              {earring.discountPercentage}% off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(earring._id, earring.isAvailable)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            earring.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {earring.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/earring/detail/${earring.sku}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View"
                          >
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/earrings/edit/${earring._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(earring._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * 10 + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * 10, pagination.totalCount)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalCount}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
