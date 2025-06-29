'use client';

import { useState, useEffect } from 'react';
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

interface Gemstone {
  _id: string;
  sku: string;
  productNumber: string;
  type: string;
  source: string;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  cut?: string;
  origin?: string;
  treatment?: string;
  measurements: string;
  certificateLab?: string;
  certificateNumber?: string;
  hardness: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{
    url: string;
    publicId: string;
  }>;
  isAvailable: boolean;
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

export default function GemstonesList() {
  const { user } = useUser();
  
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
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
  const [sourceFilter, setSourceFilter] = useState('');
  const [shapeFilter, setShapeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  const fetchGemstones = async (page = 1) => {
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
      if (sourceFilter) queryParams.append('source', sourceFilter);
      if (shapeFilter) queryParams.append('shape', shapeFilter);
      if (colorFilter) queryParams.append('color', colorFilter);

      const response = await fetch(`/api/admin/gemstones?${queryParams}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gemstones');
      }

      const result = await response.json();
      setGemstones(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching gemstones:', error);
      toast.error('Failed to fetch gemstones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gemstone?')) return;

    try {
      const response = await fetch(`/api/admin/gemstones/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete gemstone');
      }

      toast.success('Gemstone deleted successfully');
      fetchGemstones(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting gemstone:', error);
      toast.error('Failed to delete gemstone');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gemstones/${id}`, {
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
        throw new Error('Failed to update gemstone');
      }

      toast.success('Gemstone status updated');
      fetchGemstones(pagination.currentPage);
    } catch (error) {
      console.error('Error updating gemstone:', error);
      toast.error('Failed to update gemstone status');
    }
  };

  const handleSearch = () => {
    fetchGemstones(1);
  };

  const handlePageChange = (page: number) => {
    fetchGemstones(page);
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setSourceFilter('');
    setShapeFilter('');
    setColorFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    fetchGemstones(1);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchGemstones();
    }
  }, [user, sortBy, sortOrder]);

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
            <h1 className="text-3xl font-bold text-gray-900">Gemstones Management</h1>
            <Link
              href="/admin/gemstones"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Add New Gemstone
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
                  placeholder="Search by SKU, type, color..."
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
                  <option value="Ruby">Ruby</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="Amethyst">Amethyst</option>
                  <option value="Aquamarine">Aquamarine</option>
                  <option value="Topaz">Topaz</option>
                  <option value="Opal">Opal</option>
                  <option value="Garnet">Garnet</option>
                  <option value="Peridot">Peridot</option>
                  <option value="Tanzanite">Tanzanite</option>
                  <option value="Tourmaline">Tourmaline</option>
                  <option value="Citrine">Citrine</option>
                  <option value="Morganite">Morganite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Sources</option>
                  <option value="natural">Natural</option>
                  <option value="lab">Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                <select
                  value={shapeFilter}
                  onChange={(e) => setShapeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Shapes</option>
                  <option value="Round">Round</option>
                  <option value="Princess">Princess</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Oval">Oval</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Pear">Pear</option>
                  <option value="Heart">Heart</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Cabochon">Cabochon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Colors</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Purple">Purple</option>
                  <option value="Pink">Pink</option>
                  <option value="Orange">Orange</option>
                  <option value="Brown">Brown</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Colorless">Colorless</option>
                  <option value="Multi">Multi</option>
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
                  <option value="carat">Carat</option>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Gemstones</h3>
              <p className="text-3xl font-bold text-indigo-600">{pagination.totalCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {gemstones.filter(g => g.isAvailable).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unavailable</h3>
              <p className="text-3xl font-bold text-red-600">
                {gemstones.filter(g => !g.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        {/* Gemstones Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading gemstones...</p>
            </div>
          ) : gemstones.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No gemstones found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gemstone
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
                  {gemstones.map((gemstone) => (
                    <tr key={gemstone._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            {gemstone.images && gemstone.images.length > 0 ? (
                              <Image
                                src={gemstone.images[0].url}
                                alt={`${gemstone.type} ${gemstone.carat}ct`}
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
                              {gemstone.type} - {gemstone.carat}ct
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {gemstone.sku}
                            </div>
                            <div className="text-sm text-gray-500">
                              PN: {gemstone.productNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div><strong>Shape:</strong> {gemstone.shape}</div>
                          <div><strong>Color:</strong> {gemstone.color}</div>
                          <div><strong>Clarity:</strong> {gemstone.clarity}</div>
                          <div><strong>Source:</strong> {gemstone.source}</div>
                          {gemstone.origin && <div><strong>Origin:</strong> {gemstone.origin}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-semibold">${gemstone.price.toLocaleString()}</div>
                          {gemstone.salePrice && (
                            <div className="text-sm text-green-600">
                              Sale: ${gemstone.salePrice.toLocaleString()}
                            </div>
                          )}
                          {gemstone.discountPercentage && (
                            <div className="text-xs text-red-600">
                              {gemstone.discountPercentage}% off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(gemstone._id, gemstone.isAvailable)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            gemstone.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {gemstone.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/gemstone/detail/${gemstone.sku}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View"
                          >
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/gemstones/edit/${gemstone._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(gemstone._id)}
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
