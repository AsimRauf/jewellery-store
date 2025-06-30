'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiTrash, HiPlus } from 'react-icons/hi';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  MensJewelryType, 
  MensJewelryMetal, 
  MensJewelryStyle, 
  MensJewelryFinish,
  CertificateLab 
} from '@/models/MensJewelry';

interface MensJewelry {
  _id: string;
  sku: string;
  slug: string;
  productNumber: string;
  name: string;
  type: string;
  metal: string;
  style: string;
  finish: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
    color?: string;
    clarity?: string;
  }>;
  size?: string;
  length?: number;
  width?: number;
  thickness?: number;
  weight?: number;
  engraving?: {
    available: boolean;
    maxCharacters?: number;
    fonts?: string[];
  };
  certificateLab?: string;
  certificateNumber?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EditMensJewelryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mensJewelry, setMensJewelry] = useState<MensJewelry | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    productNumber: '',
    name: '',
    type: Object.values(MensJewelryType)[0],
    metal: Object.values(MensJewelryMetal)[0],
    style: Object.values(MensJewelryStyle)[0],
    finish: Object.values(MensJewelryFinish)[0],
    gemstones: [] as Array<{
      type: string;
      carat?: number;
      color?: string;
      clarity?: string;
    }>,
    size: '',
    length: 0,
    width: 0,
    thickness: 0,
    weight: 0,
    engraving: {
      available: false,
      maxCharacters: 20,
      fonts: ['Arial', 'Times New Roman', 'Script']
    },
    certificateLab: CertificateLab.NONE,
    certificateNumber: '',
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    images: [] as Array<{ url: string; publicId: string }>,
    isAvailable: true,
    description: '',
    features: [] as string[]
  });

  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const fetchMensJewelry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/mens-jewelry/${resolvedParams.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch men\'s jewelry');
      }

      const data = await response.json();
      setMensJewelry(data);
      
      // Populate form with existing data
      setFormData({
        sku: data.sku || '',
        productNumber: data.productNumber || '',
        name: data.name || '',
        type: data.type || Object.values(MensJewelryType)[0],
        metal: data.metal || Object.values(MensJewelryMetal)[0],
        style: data.style || Object.values(MensJewelryStyle)[0],
        finish: data.finish || Object.values(MensJewelryFinish)[0],
        gemstones: data.gemstones || [],
        size: data.size || '',
        length: data.length || 0,
        width: data.width || 0,
        thickness: data.thickness || 0,
        weight: data.weight || 0,
        engraving: data.engraving || {
          available: false,
          maxCharacters: 20,
          fonts: ['Arial', 'Times New Roman', 'Script']
        },
        certificateLab: data.certificateLab || CertificateLab.NONE,
        certificateNumber: data.certificateNumber || '',
        price: data.price || 0,
        salePrice: data.salePrice || 0,
        discountPercentage: data.discountPercentage || 0,
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        description: data.description || '',
        features: data.features || []
      });
    } catch (error) {
      console.error('Error fetching men\'s jewelry:', error);
      toast.error('Failed to fetch men\'s jewelry data');
      router.push('/admin/mens-jewelry/list');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchMensJewelry();
  }, [user, router, fetchMensJewelry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name.startsWith('engraving.')) {
        const engravingField = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          engraving: {
            ...prev.engraving,
            [engravingField]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (type === 'number') {
      if (name.startsWith('engraving.')) {
        const engravingField = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          engraving: {
            ...prev.engraving,
            [engravingField]: value === '' ? 0 : parseFloat(value)
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value === '' ? 0 : parseFloat(value)
        }));
      }
    } else {
      if (name.startsWith('engraving.')) {
        const engravingField = name.split('.')[1];
        const finalValue = engravingField === 'fonts' ? 
          value.split(',').map(f => f.trim()).filter(f => f) : value;
        setFormData(prev => ({
          ...prev,
          engraving: {
            ...prev.engraving,
            [engravingField]: finalValue
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
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

  // Gemstone management
  const addGemstone = () => {
    setFormData(prev => ({
      ...prev,
      gemstones: [...prev.gemstones, { type: '', carat: 0, color: '', clarity: '' }]
    }));
  };

  const removeGemstone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gemstones: prev.gemstones.filter((_, i) => i !== index)
    }));
  };

  const updateGemstone = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      gemstones: prev.gemstones.map((gemstone, i) => 
        i === index ? { ...gemstone, [field]: value } : gemstone
      )
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
        } else if (key === 'gemstones') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'engraving') {
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

      const response = await fetch(`/api/admin/mens-jewelry/${resolvedParams.id}`, {
        method: 'PUT',
        body: submitData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update men\'s jewelry');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Men\'s jewelry updated successfully!');
        router.push('/admin/mens-jewelry/list');
      } else {
        throw new Error(result.error || 'Failed to update men\'s jewelry');
      }
    } catch (error) {
      console.error('Error updating men\'s jewelry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update men\'s jewelry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this men\'s jewelry item? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/mens-jewelry/${resolvedParams.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete men\'s jewelry');
      }

      toast.success('Men\'s jewelry deleted successfully!');
      router.push('/admin/mens-jewelry/list');
    } catch (error) {
      console.error('Error deleting men\'s jewelry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete men\'s jewelry');
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

  if (!mensJewelry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Men's Jewelry Not Found</h1>
          <Link href="/admin/mens-jewelry/list" className="text-indigo-600 hover:text-indigo-800">
            Back to Men's Jewelry List
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
                href="/admin/mens-jewelry/list"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Men's Jewelry</h1>
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
                  {Object.entries(MensJewelryType).map(([key, value]) => (
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
                  {Object.entries(MensJewelryMetal).map(([key, value]) => (
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
                  {Object.entries(MensJewelryStyle).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finish *
                </label>
                <select
                  name="finish"
                  value={formData.finish}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Object.entries(MensJewelryFinish).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions & Specifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Dimensions & Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.type === MensJewelryType.RING && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 10, 10.5"
                  />
                </div>
              )}

              {(formData.type === MensJewelryType.NECKLACE || formData.type === MensJewelryType.CHAIN) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (inches)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (mm)
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness (mm)
                </label>
                <input
                  type="number"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Engraving Options */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Engraving Options</h2>
            
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="engraving.available"
                  checked={formData.engraving.available}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Engraving available
                </label>
              </div>
              
              {formData.engraving.available && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Characters
                    </label>
                    <input
                      type="number"
                      name="engraving.maxCharacters"
                      value={formData.engraving.maxCharacters}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Fonts
                    </label>
                    <input
                      type="text"
                      name="engraving.fonts"
                      value={Array.isArray(formData.engraving.fonts) ? formData.engraving.fonts.join(', ') : ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Arial, Times New Roman, Script"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gemstones */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Gemstones</h2>
              <button
                type="button"
                onClick={addGemstone}
                className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <HiPlus className="w-4 h-4 mr-2" />
                Add Gemstone
              </button>
            </div>
            
            {formData.gemstones.map((gemstone, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Gemstone {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeGemstone(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <input
                      type="text"
                      value={gemstone.type}
                      onChange={(e) => updateGemstone(index, 'type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Diamond, Ruby, Sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carat</label>
                    <input
                      type="number"
                      step="0.01"
                      value={gemstone.carat || ''}
                      onChange={(e) => updateGemstone(index, 'carat', parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={gemstone.color || ''}
                      onChange={(e) => updateGemstone(index, 'color', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Colorless, Yellow, Blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
                    <input
                      type="text"
                      value={gemstone.clarity || ''}
                      onChange={(e) => updateGemstone(index, 'clarity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., FL, VVS1, VS1"
                    />
                  </div>
                </div>
              </div>
            ))}
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
                placeholder="Enter product description..."
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
                placeholder="Enter features separated by commas (e.g., Hypoallergenic, Waterproof, Scratch-resistant)"
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
                        alt={`Product image ${index + 1}`}
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

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/mens-jewelry/list"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Men\'s Jewelry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
