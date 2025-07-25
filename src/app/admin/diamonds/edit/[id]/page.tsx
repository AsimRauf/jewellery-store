'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft, HiTrash } from 'react-icons/hi';
import ImageUpload from '@/components/admin/ImageUpload';
import { DiamondEnums } from '@/constants/diamondEnums';
import type { 
  DiamondType, 
  DiamondShape, 
  DiamondColor, 
  DiamondClarity, 
  DiamondCut, 
  DiamondPolish, 
  DiamondSymmetry, 
  DiamondFluorescence, 
  CertificateLab, 
  DiamondFancyColor 
} from '@/constants/diamondEnums';

interface Diamond {
  _id: string;
  sku: string;
  slug: string;
  productNumber: string;
  type: DiamondType;
  carat: number;
  shape: DiamondShape;
  color: DiamondColor | string;
  fancyColor?: DiamondFancyColor | string;
  clarity: DiamondClarity;
  cut?: DiamondCut;
  polish?: DiamondPolish;
  symmetry?: DiamondSymmetry;
  fluorescence?: DiamondFluorescence;
  measurements: string;
  treatment?: string;
  certificateLab?: CertificateLab;
  crownAngle?: number;
  crownHeight?: number;
  pavilionAngle?: number;
  pavilionDepth?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditDiamondPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [diamond, setDiamond] = useState<Diamond | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    productNumber: '',
    type: 'natural' as DiamondType,
    carat: 0,
    shape: 'round' as DiamondShape,
    color: 'D' as DiamondColor,
    fancyColor: '',
    clarity: 'FL' as DiamondClarity,
    cut: 'Excellent' as DiamondCut,
    polish: 'Excellent' as DiamondPolish,
    symmetry: 'Excellent' as DiamondSymmetry,
    fluorescence: 'None' as DiamondFluorescence,
    measurements: '',
    treatment: '',
    certificateLab: 'GIA' as CertificateLab,
    crownAngle: 0,
    crownHeight: 0,
    pavilionAngle: 0,
    pavilionDepth: 0,
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    images: [] as Array<{ url: string; publicId: string }>,
    isAvailable: true
  });

  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchDiamond();
  }, [user, router]);

  const fetchDiamond = async () => {
    try {
      const response = await fetch(`/api/admin/diamonds/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Failed to fetch diamond');
      
      const data = await response.json();
      setDiamond(data);
      setFormData({
        sku: data.sku || '',
        productNumber: data.productNumber || '',
        type: data.type || 'natural',
        carat: data.carat || 0,
        shape: data.shape || 'round',
        color: data.color || 'D',
        fancyColor: data.fancyColor || '',
        clarity: data.clarity || 'FL',
        cut: data.cut || 'Excellent',
        polish: data.polish || 'Excellent',
        symmetry: data.symmetry || 'Excellent',
        fluorescence: data.fluorescence || 'None',
        measurements: data.measurements || '',
        treatment: data.treatment || '',
        certificateLab: data.certificateLab || 'GIA',
        crownAngle: data.crownAngle || 0,
        crownHeight: data.crownHeight || 0,
        pavilionAngle: data.pavilionAngle || 0,
        pavilionDepth: data.pavilionDepth || 0,
        price: data.price || 0,
        salePrice: data.salePrice || 0,
        discountPercentage: data.discountPercentage || 0,
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
      });
    } catch (error) {
      console.error('Error fetching diamond:', error);
      toast.error('Failed to fetch diamond');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }));
  };

  // Helper function to convert File to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadImage = async (file: File, category: string, index?: number) => {
    try {
      const base64 = await convertToBase64(file);
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file: base64, 
          category,
          index
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const removeImage = (index: number) => {
    const imageToDelete = formData.images[index];
    if (imageToDelete) {
      setImagesToDelete(prev => [...prev, imageToDelete.publicId]);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Check if we have image changes (uploads or deletions)
      const hasImageChanges = temporaryImages.length > 0 || imagesToDelete.length > 0;

      if (hasImageChanges) {
        // Use FormData for image updates
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

        const response = await fetch(`/api/admin/diamonds/${resolvedParams.id}`, {
          method: 'PUT',
          body: submitData,
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update diamond');
        }
      } else {
        // Use JSON for simple updates without images
        const response = await fetch(`/api/admin/diamonds/${resolvedParams.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update diamond');
      }
      
      toast.success('Diamond updated successfully');
      router.push('/admin/diamonds/list');
    } catch (error) {
      console.error('Error updating diamond:', error);
      toast.error('Failed to update diamond');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this diamond? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/diamonds/${resolvedParams.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete diamond');
      
      toast.success('Diamond deleted successfully');
      router.push('/admin/diamonds/list');
    } catch (error) {
      console.error('Error deleting diamond:', error);
      toast.error('Failed to delete diamond');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading diamond...</p>
        </div>
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Diamond not found</p>
          <Link href="/admin/diamonds/list" className="text-blue-600 hover:underline">
            Back to diamonds list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/diamonds/list"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                Back to Diamonds
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Diamond</h1>
                <p className="text-gray-600">{diamond.sku}</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <HiTrash className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Number</label>
                <input
                  type="text"
                  name="productNumber"
                  value={formData.productNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                <select
                  name="shape"
                  value={formData.shape}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.SHAPES.map(shape => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Diamond Properties */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Diamond Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carat</label>
                <input
                  type="number"
                  name="carat"
                  value={formData.carat}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fancy Color</label>
                <select
                  name="fancyColor"
                  value={formData.fancyColor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {DiamondEnums.FANCY_COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clarity</label>
                <select
                  name="clarity"
                  value={formData.clarity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.CLARITIES.map(clarity => (
                    <option key={clarity} value={clarity}>{clarity}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cut</label>
                <select
                  name="cut"
                  value={formData.cut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.CUTS.map(cut => (
                    <option key={cut} value={cut}>{cut}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Polish</label>
                <select
                  name="polish"
                  value={formData.polish}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.POLISH.map(polish => (
                    <option key={polish} value={polish}>{polish}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symmetry</label>
                <select
                  name="symmetry"
                  value={formData.symmetry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.SYMMETRY.map(symmetry => (
                    <option key={symmetry} value={symmetry}>{symmetry}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fluorescence</label>
                <select
                  name="fluorescence"
                  value={formData.fluorescence}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.FLUORESCENCE.map(fluorescence => (
                    <option key={fluorescence} value={fluorescence}>{fluorescence}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Lab</label>
                <select
                  name="certificateLab"
                  value={formData.certificateLab}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DiamondEnums.CERTIFICATE_LABS.map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Measurements</label>
                <input
                  type="text"
                  name="measurements"
                  value={formData.measurements}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 6.5 x 6.3 x 4.0 mm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                <input
                  type="text"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crown Angle</label>
                <input
                  type="number"
                  name="crownAngle"
                  value={formData.crownAngle}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crown Height (%)</label>
                <input
                  type="number"
                  name="crownHeight"
                  value={formData.crownHeight}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pavilion Angle</label>
                <input
                  type="number"
                  name="pavilionAngle"
                  value={formData.pavilionAngle}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pavilion Depth (%)</label>
                <input
                  type="number"
                  name="pavilionDepth"
                  value={formData.pavilionDepth}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price ($)</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            
            {/* Current Images */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Diamond image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Upload */}
            <ImageUpload
              temporaryImages={temporaryImages}
              onImagesSelect={setTemporaryImages}
              temporaryVideo={null}
              onVideoSelect={() => {}}
              maxImages={10}
              label="Add New Images"
            />
            

          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Available for purchase
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/diamonds/list"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
