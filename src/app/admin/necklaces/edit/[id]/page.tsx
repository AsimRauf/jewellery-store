'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiTrash } from 'react-icons/hi';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  NecklaceType,
  NecklaceLength,
  NecklaceMetal,
  NecklaceStyle,
} from '@/models/Necklace';
import { CertificateLab } from '@/constants/sharedEnums';

interface Necklace {
  _id: string;
  sku: string;
  slug: string;
  productNumber: string;
  name: string;
  type: string;
  length: string;
  metal: string;
  style: string;
  chainWidth?: number;
  claspType?: string;
  certificateLab?: string;
  certificateNumber?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
  features?: string[];
  totalPieces?: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditNecklacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [necklace, setNecklace] = useState<Necklace | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    productNumber: '',
    name: '',
    type: Object.values(NecklaceType)[0],
    length: Object.values(NecklaceLength)[0],
    metal: Object.values(NecklaceMetal)[0],
    style: Object.values(NecklaceStyle)[0],
    chainWidth: 0,
    claspType: '',
    certificateLab: CertificateLab.NONE,
    certificateNumber: '',
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    images: [] as Array<{ url: string; publicId: string }>,
    isAvailable: true,
    description: '',
    features: [] as string[],
    totalPieces: 0
  });

  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const fetchNecklace = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/necklaces/${resolvedParams.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch necklace');
      }

      const data = await response.json();
      setNecklace(data);
      
      // Populate form with existing data
      setFormData({
        sku: data.sku || '',
        productNumber: data.productNumber || '',
        name: data.name || '',
        type: data.type || Object.values(NecklaceType)[0],
        length: data.length || Object.values(NecklaceLength)[0],
        metal: data.metal || Object.values(NecklaceMetal)[0],
        style: data.style || Object.values(NecklaceStyle)[0],
        chainWidth: data.chainWidth || 0,
        claspType: data.claspType || '',
        certificateLab: data.certificateLab || CertificateLab.NONE,
        certificateNumber: data.certificateNumber || '',
        price: data.price || 0,
        salePrice: data.salePrice || 0,
        discountPercentage: data.discountPercentage || 0,
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        description: data.description || '',
        features: data.features || [],
        totalPieces: data.totalPieces || 0
      });
    } catch (error) {
      console.error('Error fetching necklace:', error);
      toast.error('Failed to fetch necklace data');
      router.push('/admin/necklaces/list');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchNecklace();
  }, [user, router, fetchNecklace]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (files: File[]) => {
    setTemporaryImages(prev => [...prev, ...files]);
  };

  const handleImageDelete = (publicId: string) => {
    setImagesToDelete(prev => [...prev, publicId]);
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.publicId !== publicId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sku || !formData.productNumber || !formData.name || !formData.type || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      // Prepare form data for submission
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'features') {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });

      // Add new images
      temporaryImages.forEach((file) => {
        submitData.append('newImages', file);
      });

      // Add images to delete
      if (imagesToDelete.length > 0) {
        submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      const response = await fetch(`/api/admin/necklaces/${resolvedParams.id}`, {
        method: 'PUT',
        body: submitData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update necklace');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Necklace updated successfully!');
        router.push('/admin/necklaces/list');
      } else {
        throw new Error(result.error || 'Failed to update necklace');
      }
    } catch (error) {
      console.error('Error updating necklace:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update necklace');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this necklace? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/necklaces/${resolvedParams.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete necklace');
      }

      toast.success('Necklace deleted successfully!');
      router.push('/admin/necklaces/list');
    } catch (error) {
      console.error('Error deleting necklace:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete necklace');
    } finally {
      setDeleting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!necklace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Necklace Not Found</h1>
          <Link href="/admin/necklaces/list" className="text-indigo-600 hover:text-indigo-800">
            Back to Necklaces List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link
                href="/admin/necklaces/list"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Necklace</h1>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <HiTrash className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Number *
                </label>
                <input
                  type="text"
                  name="productNumber"
                  value={formData.productNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(NecklaceType).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length *
                </label>
                <select
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(NecklaceLength).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metal *
                </label>
                <select
                  name="metal"
                  value={formData.metal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(NecklaceMetal).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style *
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(NecklaceStyle).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chain Width (mm)
                </label>
                <input
                  type="number"
                  name="chainWidth"
                  value={formData.chainWidth}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clasp Type
                </label>
                <input
                  type="text"
                  name="claspType"
                  value={formData.claspType}
                  onChange={handleInputChange}
                  placeholder="e.g., Lobster Claw, Spring Ring"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Certification */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Certification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Lab
                </label>
                <select
                  name="certificateLab"
                  value={formData.certificateLab}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(CertificateLab).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Number
                </label>
                <input
                  type="text"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Description</h2>
            
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter necklace description..."
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Features</h2>
            
            <div>
              <textarea
                name="features"
                value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter features separated by commas (e.g., Hypoallergenic, Tarnish-resistant, Adjustable)"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Images</h2>
            
            <ImageUpload
              onImagesSelect={handleImageUpload}
              onVideoSelect={() => {}}
              temporaryImages={temporaryImages}
              temporaryVideo={null}
              maxImages={10}
            />

            {/* Existing Images */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image.url}
                        alt={`Necklace image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.publicId)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Availability</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Available for purchase
              </label>
            </div>
          </div>

          {/* Stock */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Stock</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pieces
              </label>
              <input
                type="number"
                name="totalPieces"
                value={formData.totalPieces}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/necklaces/list"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Necklace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
