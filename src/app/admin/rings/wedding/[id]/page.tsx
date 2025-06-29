'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiPencil, HiTrash } from 'react-icons/hi';

interface MetalOption {
  karat: string;
  color: string;
  price: number;
  description: string;
  finish_type: string;
  width_mm: number;
  total_carat_weight: number;
  isDefault: boolean;
}

interface WeddingRing {
  _id: string;
  title: string;
  category: string;
  subcategory: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  side_stone: {
    type: string;
    number_of_stones: number;
    total_carat: number;
    shape: string;
    color: string;
    clarity: string;
  };
  media: {
    images: Array<{ url: string; publicId: string; }>;
    video: { url: string; publicId: string; };
  };
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export default function WeddingRingDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [ring, setRing] = useState<WeddingRing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and admin status
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error('Admin access required');
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  const fetchRing = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rings/wedding/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ring');
      }

      const result = await response.json();
      setRing(result.data);
    } catch (error) {
      toast.error('Failed to fetch ring details');
      console.error('Fetch error:', error);
      router.push('/admin/rings/wedding/list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && id) {
      fetchRing();
    }
  }, [user, id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ring?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rings/wedding/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete ring');
      }

      toast.success('Ring deleted successfully');
      router.push('/admin/rings/wedding/list');
    } catch (error) {
      toast.error('Failed to delete ring');
      console.error('Delete error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle loading state
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!ring) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Ring not found</h1>
          <Link
            href="/admin/rings/wedding/list"
            className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/admin/rings/wedding/list"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/admin/rings/wedding/edit/${id}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <HiPencil className="w-5 h-5 mr-2" />
              Edit Ring
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <HiTrash className="w-5 h-5 mr-2" />
              Delete Ring
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{ring.title}</h1>
        <p className="mt-2 text-gray-600">SKU: {ring.SKU}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images and Media */}
        <div className="space-y-6">
          {/* Main Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            {ring.media?.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {ring.media.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={`${ring.title} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No images available</p>
            )}
          </div>

          {/* Video */}
          {ring.media?.video?.url && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Video</h2>
              <video controls className="w-full rounded-lg">
                <source src={ring.media.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900">{ring.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subcategory</p>
                <p className="text-gray-900">{ring.subcategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Base Price</p>
                <p className="text-gray-900">{formatPrice(ring.basePrice)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Metal Options</p>
                <p className="text-gray-900">{ring.metalOptions?.length || 0} options</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                ring.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {ring.isActive ? 'Active' : 'Inactive'}
              </span>
              {ring.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Featured
                </span>
              )}
              {ring.isNew && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              )}
              {ring.onSale && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  On Sale
                </span>
              )}
            </div>
            {ring.onSale && ring.originalPrice && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-500">Original Price</p>
                <p className="text-gray-900">{formatPrice(ring.originalPrice)}</p>
              </div>
            )}
          </div>

          {/* Styles and Types */}
          {(ring.style?.length > 0 || ring.type?.length > 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Styles & Types</h2>
              {ring.style?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Styles</p>
                  <div className="flex flex-wrap gap-2">
                    {ring.style.map(style => (
                      <span key={style} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {ring.type?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Types</p>
                  <div className="flex flex-wrap gap-2">
                    {ring.type.map(type => (
                      <span key={type} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metal Options */}
          {ring.metalOptions?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Metal Options</h2>
              <div className="space-y-4">
                {ring.metalOptions.map((option, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${option.isDefault ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {option.karat} {option.color}
                          {option.isDefault && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">Default</span>}
                        </p>
                        <p className="text-sm text-gray-600">{formatPrice(option.price)}</p>
                      </div>
                    </div>
                    {(option.finish_type || option.width_mm || option.description) && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {option.finish_type && <p>Finish: {option.finish_type}</p>}
                        {option.width_mm && <p>Width: {option.width_mm}mm</p>}
                        {option.total_carat_weight > 0 && <p>Total Carat Weight: {option.total_carat_weight}</p>}
                        {option.description && <p>Description: {option.description}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Sizes */}
          {ring.sizes?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Sizes</h2>
              <div className="grid grid-cols-4 gap-2">
                {ring.sizes.map((size, index) => (
                  <div key={index} className="text-center p-2 border rounded">
                    <p className="text-sm font-medium">{size.size}</p>
                    {size.additionalPrice > 0 && (
                      <p className="text-xs text-gray-500">+{formatPrice(size.additionalPrice)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side Stone Details */}
          {ring.side_stone && (ring.side_stone.type || ring.side_stone.number_of_stones > 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Side Stone Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {ring.side_stone.type && (
                  <div>
                    <p className="font-medium text-gray-500">Type</p>
                    <p className="text-gray-900">{ring.side_stone.type}</p>
                  </div>
                )}
                {ring.side_stone.number_of_stones > 0 && (
                  <div>
                    <p className="font-medium text-gray-500">Number of Stones</p>
                    <p className="text-gray-900">{ring.side_stone.number_of_stones}</p>
                  </div>
                )}
                {ring.side_stone.total_carat > 0 && (
                  <div>
                    <p className="font-medium text-gray-500">Total Carat</p>
                    <p className="text-gray-900">{ring.side_stone.total_carat}</p>
                  </div>
                )}
                {ring.side_stone.shape && (
                  <div>
                    <p className="font-medium text-gray-500">Shape</p>
                    <p className="text-gray-900">{ring.side_stone.shape}</p>
                  </div>
                )}
                {ring.side_stone.color && (
                  <div>
                    <p className="font-medium text-gray-500">Color</p>
                    <p className="text-gray-900">{ring.side_stone.color}</p>
                  </div>
                )}
                {ring.side_stone.clarity && (
                  <div>
                    <p className="font-medium text-gray-500">Clarity</p>
                    <p className="text-gray-900">{ring.side_stone.clarity}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {ring.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{ring.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-gray-500">Created</p>
                <p className="text-gray-900">{formatDate(ring.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Last Updated</p>
                <p className="text-gray-900">{formatDate(ring.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
