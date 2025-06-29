'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import { RingEnums } from '@/constants/ringEnums';

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
}

export default function EditWeddingRing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [ring, setRing] = useState<WeddingRing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFieldChange = (field: string, value: unknown) => {
    if (!ring) return;

    const fields = field.split('.');
    
    if (fields.length === 1) {
      setRing(prev => prev ? { ...prev, [field]: value } : null);
    } else {
      setRing(prev => {
        if (!prev) return null;
        const updated = { ...prev };
        let current: Record<string, unknown> = updated;
        
        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i]] as Record<string, unknown>;
        }
        
        current[fields[fields.length - 1]] = value;
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ring) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/rings/wedding/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(ring)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update ring');
      }

      toast.success('Ring updated successfully');
      router.push('/admin/rings/wedding/list');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/rings/wedding/list"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Wedding Ring</h1>
        <p className="mt-2 text-gray-600">Update the details of this wedding ring</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ring Title *
              </label>
              <input
                type="text"
                value={ring.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={ring.SKU}
                onChange={(e) => handleFieldChange('SKU', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <select
                value={ring.subcategory}
                onChange={(e) => handleFieldChange('subcategory', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Subcategory</option>
                {RingEnums.SUBCATEGORIES.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                value={ring.basePrice}
                onChange={(e) => handleFieldChange('basePrice', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        {/* Styles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RingEnums.STYLES.map(style => (
              <div key={style} className="flex items-center">
                <input
                  type="checkbox"
                  id={`style-${style}`}
                  checked={ring.style.includes(style)}
                  onChange={(e) => {
                    const newStyles = e.target.checked
                      ? [...ring.style, style]
                      : ring.style.filter(s => s !== style);
                    handleFieldChange('style', newStyles);
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                />
                <label htmlFor={`style-${style}`} className="text-sm text-gray-700">
                  {style}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RingEnums.TYPES.map(type => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={ring.type.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...ring.type, type]
                      : ring.type.filter(t => t !== type);
                    handleFieldChange('type', newTypes);
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                />
                <label htmlFor={`type-${type}`} className="text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <textarea
            value={ring.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter ring description..."
          />
        </div>

        {/* Status Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Settings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={ring.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={ring.isFeatured}
                onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNew"
                checked={ring.isNew || false}
                onChange={(e) => handleFieldChange('isNew', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <label htmlFor="isNew" className="text-sm font-medium text-gray-700">
                New
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onSale"
                checked={ring.onSale || false}
                onChange={(e) => handleFieldChange('onSale', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <label htmlFor="onSale" className="text-sm font-medium text-gray-700">
                On Sale
              </label>
            </div>
          </div>
          
          {ring.onSale && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                value={ring.originalPrice || ''}
                onChange={(e) => handleFieldChange('originalPrice', parseFloat(e.target.value) || undefined)}
                className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.01"
                placeholder="Enter original price"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/rings/wedding/list"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Ring'}
          </button>
        </div>
      </form>
    </div>
  );
}
