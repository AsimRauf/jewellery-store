'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft, HiTrash } from 'react-icons/hi';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  GemstoneType, 
  GemstoneSource, 
  GemstoneShape, 
  GemstoneColor, 
  GemstoneClarity, 
  GemstoneCut, 
  GemstoneOrigin, 
  GemstoneTreatment, 
  CertificateLab 
} from '@/models/Gemstone';

interface Gemstone {
  _id: string;
  sku: string;
  slug: string;
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
  refractive_index?: number;
  hardness: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditGemstonePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [gemstone, setGemstone] = useState<Gemstone | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    productNumber: '',
    type: Object.values(GemstoneType)[0],
    source: GemstoneSource.NATURAL,
    carat: 0,
    shape: Object.values(GemstoneShape)[0],
    color: Object.values(GemstoneColor)[0],
    clarity: Object.values(GemstoneClarity)[0],
    cut: Object.values(GemstoneCut)[0],
    origin: '',
    treatment: GemstoneTreatment.NONE,
    measurements: '',
    certificateLab: CertificateLab.NONE,
    certificateNumber: '',
    refractive_index: 0,
    hardness: 0,
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    images: [] as Array<{ url: string; publicId: string }>,
    isAvailable: true,
    description: ''
  });

  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchGemstone();
  }, [user, router]);

  const fetchGemstone = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/gemstones/${resolvedParams.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch gemstone');
      }

      const data = await response.json();
      setGemstone(data);
      
      // Populate form with existing data
      setFormData({
        sku: data.sku || '',
        productNumber: data.productNumber || '',
        type: data.type || Object.values(GemstoneType)[0],
        source: data.source || GemstoneSource.NATURAL,
        carat: data.carat || 0,
        shape: data.shape || Object.values(GemstoneShape)[0],
        color: data.color || Object.values(GemstoneColor)[0],
        clarity: data.clarity || Object.values(GemstoneClarity)[0],
        cut: data.cut || Object.values(GemstoneCut)[0],
        origin: data.origin || '',
        treatment: data.treatment || GemstoneTreatment.NONE,
        measurements: data.measurements || '',
        certificateLab: data.certificateLab || CertificateLab.NONE,
        certificateNumber: data.certificateNumber || '',
        refractive_index: data.refractive_index || 0,
        hardness: data.hardness || 0,
        price: data.price || 0,
        salePrice: data.salePrice || 0,
        discountPercentage: data.discountPercentage || 0,
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        description: data.description || ''
      });
    } catch (error) {
      console.error('Error fetching gemstone:', error);
      toast.error('Failed to fetch gemstone data');
      router.push('/admin/gemstones/list');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!formData.sku || !formData.productNumber || !formData.type || !formData.carat || !formData.price) {
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

      const response = await fetch(`/api/admin/gemstones/${resolvedParams.id}`, {
        method: 'PUT',
        body: submitData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gemstone');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Gemstone updated successfully!');
        router.push('/admin/gemstones/list');
      } else {
        throw new Error(result.error || 'Failed to update gemstone');
      }
    } catch (error) {
      console.error('Error updating gemstone:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update gemstone');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gemstone? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/gemstones/${resolvedParams.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete gemstone');
      }

      toast.success('Gemstone deleted successfully!');
      router.push('/admin/gemstones/list');
    } catch (error) {
      console.error('Error deleting gemstone:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete gemstone');
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

  if (!gemstone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gemstone Not Found</h1>
          <Link href="/admin/gemstones/list" className="text-indigo-600 hover:text-indigo-800">
            Back to Gemstones List
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
                href="/admin/gemstones/list"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Gemstone</h1>
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
                  {Object.entries(GemstoneType).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(GemstoneSource).map(([key, value]) => (
                    <option key={key} value={value}>{value === 'natural' ? 'Natural' : 'Lab'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carat *
                </label>
                <input
                  type="number"
                  name="carat"
                  value={formData.carat}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shape *
                </label>
                <select
                  name="shape"
                  value={formData.shape}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(GemstoneShape).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(GemstoneColor).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clarity *
                </label>
                <select
                  name="clarity"
                  value={formData.clarity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(GemstoneClarity).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cut
                </label>
                <select
                  name="cut"
                  value={formData.cut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Cut</option>
                  {Object.entries(GemstoneCut).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <select
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Origin</option>
                  {Object.entries(GemstoneOrigin).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment
                </label>
                <select
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(GemstoneTreatment).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurements *
                </label>
                <input
                  type="text"
                  name="measurements"
                  value={formData.measurements}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5 x 4.5 x 3.2 mm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hardness *
                </label>
                <input
                  type="number"
                  name="hardness"
                  value={formData.hardness}
                  onChange={handleInputChange}
                  step="0.1"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refractive Index
                </label>
                <input
                  type="number"
                  name="refractive_index"
                  value={formData.refractive_index}
                  onChange={handleInputChange}
                  step="0.001"
                  min="1"
                  max="3"
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
                placeholder="Enter gemstone description..."
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Images</h2>
            
            <ImageUpload
              onUpload={handleImageUpload}
              existingImages={formData.images}
              onDeleteExisting={handleImageDelete}
              temporaryImages={temporaryImages}
              onDeleteTemporary={(index) => {
                setTemporaryImages(prev => prev.filter((_, i) => i !== index));
              }}
            />
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

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/gemstones/list"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Gemstone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
