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

interface Bracelet {
  _id: string;
  sku: string;
  productNumber: string;
  name: string;
  type: string;
  closure: string;
  metal: string;
  style: string;
  length: number;
  width?: number;
  adjustable?: boolean;
  minLength?: number;
  maxLength?: number;
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

export default function BraceletsList() {
  const { user } = useUser();
  
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
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
  const [closureFilter, setClosureFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');

  const fetchBracelets = useCallback(async (page = 1) => {
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
      if (closureFilter) queryParams.append('closure', closureFilter);
      if (styleFilter) queryParams.append('style', styleFilter);

      const response = await fetch(`/api/admin/bracelets?${queryParams}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bracelets');
      }

      const result = await response.json();
      setBracelets(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching bracelets:', error);
      toast.error('Failed to fetch bracelets');
    } finally {
      setIsLoading(false);
    }
  }, [search, sortBy, sortOrder, typeFilter, metalFilter, closureFilter, styleFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bracelet?')) return;

    try {
      const response = await fetch(`/api/admin/bracelets/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete bracelet');
      }

      toast.success('Bracelet deleted successfully');
      fetchBracelets(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting bracelet:', error);
      toast.error('Failed to delete bracelet');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/bracelets/${id}`, {
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
        throw new Error('Failed to update bracelet');
      }

      toast.success('Bracelet status updated');
      fetchBracelets(pagination.currentPage);
    } catch (error) {
      console.error('Error updating bracelet:', error);
      toast.error('Failed to update bracelet status');
    }
  };

  const handleSearch = () => {
    fetchBracelets(1);
  };

  const handlePageChange = (page: number) => {
    fetchBracelets(page);
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setMetalFilter('');
    setClosureFilter('');
    setStyleFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    fetchBracelets(1);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBracelets();
    }
  }, [user, sortBy, sortOrder, fetchBracelets]);

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
            <h1 className="text-3xl font-bold text-gray-900">Bracelets Management</h1>
            <Link
              href="/admin/bracelets"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Add New Bracelet
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
                  <option value="Tennis">Tennis</option>
                  <option value="Chain">Chain</option>
                  <option value="Bangle">Bangle</option>
                  <option value="Charm">Charm</option>
                  <option value="Cuff">Cuff</option>
                  <option value="Link">Link</option>
                  <option value="Beaded">Beaded</option>
                  <option value="Wrap">Wrap</option>
                  <option value="Tennis Diamond">Tennis Diamond</option>
                  <option value="Pearl">Pearl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closure</label>
                <select
                  value={closureFilter}
                  onChange={(e) => setClosureFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Closures</option>
                  <option value="Lobster Clasp">Lobster Clasp</option>
                  <option value="Spring Ring">Spring Ring</option>
                  <option value="Toggle">Toggle</option>
                  <option value="Magnetic">Magnetic</option>
                  <option value="Hook & Eye">Hook & Eye</option>
                  <option value="Box Clasp">Box Clasp</option>
                  <option value="Slide">Slide</option>
                  <option value="None">None</option>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Bracelets</h3>
              <p className="text-3xl font-bold text-indigo-600">{pagination.totalCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {bracelets.filter(b => b.isAvailable).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unavailable</h3>
              <p className="text-3xl font-bold text-red-600">
                {bracelets.filter(b => !b.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        {/* Bracelets Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bracelets...</p>
            </div>
          ) : bracelets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No bracelets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bracelet
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
                  {bracelets.map((bracelet) => (
                    <tr key={bracelet._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            {bracelet.images && bracelet.images.length > 0 ? (
                              <Image
                                src={bracelet.images[0].url}
                                alt={bracelet.name}
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
                              {bracelet.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {bracelet.sku}
                            </div>
                            <div className="text-sm text-gray-500">
                              PN: {bracelet.productNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div><strong>Type:</strong> {bracelet.type}</div>
                          <div><strong>Closure:</strong> {bracelet.closure}</div>
                          <div><strong>Metal:</strong> {bracelet.metal}</div>
                          <div><strong>Style:</strong> {bracelet.style}</div>
                          <div><strong>Length:</strong> {bracelet.length}&quot;</div>
                          {bracelet.width && <div><strong>Width:</strong> {bracelet.width}mm</div>}
                          {bracelet.adjustable && (
                            <div className="text-xs text-green-600">
                              Adjustable: {bracelet.minLength}&quot; - {bracelet.maxLength}&quot;
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-semibold">${bracelet.price.toLocaleString()}</div>
                          {bracelet.salePrice && (
                            <div className="text-sm text-green-600">
                              Sale: ${bracelet.salePrice.toLocaleString()}
                            </div>
                          )}
                          {bracelet.discountPercentage && (
                            <div className="text-xs text-red-600">
                              {bracelet.discountPercentage}% off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(bracelet._id, bracelet.isAvailable)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bracelet.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {bracelet.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/bracelet/detail/${bracelet.sku}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View"
                          >
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/bracelets/edit/${bracelet._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(bracelet._id)}
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
