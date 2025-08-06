'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiTrash, HiPlus } from 'react-icons/hi';
import { RingEnums } from '@/constants/ringEnums';
import ImageUpload from '@/components/admin/ImageUpload';
import MetalOptionImageUpload from '@/components/admin/MetalOptionImageUpload';

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

interface EngagementRing {
  _id: string;
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  metalColorImages?: Record<string, Array<{ url: string; publicId: string; }>>;
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  main_stone: {
    type: string;
    gemstone_type?: string;
    number_of_stones: number;
    carat_weight: number;
    shape: string;
    color: string;
    clarity: string;
    hardness: number;
  };
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
  totalPieces?: number;
}

export default function EditEngagementRing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const router = useRouter();
  
  const [ring, setRing] = useState<EngagementRing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [metalColorTemporaryImages, setMetalColorTemporaryImages] = useState<Record<string, File[]>>({});
  const [metalColorImagesToDelete, setMetalColorImagesToDelete] = useState<string[]>([]);

  const fetchRing = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rings/engagement/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ring');
      }

      const result = await response.json();
      console.log('Fetched ring data:', result.data);
      setRing(result.data);
    } catch (error) {
      toast.error('Failed to fetch ring details');
      console.error('Fetch error:', error);
      router.push('/admin/rings/engagement/list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchRing();
    }
  }, [user, id]);

  const uploadImage = async (file: File, category: string, index?: number, colorKey?: string) => {
    try {
      const base64 = await convertToBase64(file);
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          file: base64, 
          category,
          index,
          colorKey
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ring) return;

    setIsSubmitting(true);

    try {
      // Upload new product images
      let newUploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading new images...', { id: 'uploadProgress' });
        
        newUploadedImages = await Promise.all(
          temporaryImages.map(async (file, index) => {
            return await uploadImage(file, 'engagement', index);
          })
        );
        
        toast.success('Images uploaded successfully', { id: 'uploadProgress' });
      }

      // Upload new video if exists
      let newVideoData = ring.media.video;
      if (temporaryVideo) {
        toast.loading('Uploading video...', { id: 'videoProgress' });
        const base64 = await convertToBase64(temporaryVideo);
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            file: base64,
            category: 'engagement'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to upload video');
        }
        const result = await response.json();
        newVideoData = { url: result.url, publicId: result.publicId };
        toast.success('Video uploaded successfully', { id: 'videoProgress' });
      }

      // Upload new metal color images
      const updatedMetalColorImages = { ...(ring.metalColorImages || {}) };
      
      if (Object.keys(metalColorTemporaryImages).length > 0) {
        toast.loading('Uploading metal color images...', { id: 'metalImagesProgress' });
        
        for (const [color, files] of Object.entries(metalColorTemporaryImages)) {
          if (files.length > 0) {
            const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
            const uploadedMetalImages = await Promise.all(
              files.map(async (file, index) => {
                return await uploadImage(file, `engagement/metal-colors/${colorSlug}`, index, color);
              })
            );
            
            // Combine existing saved images with newly uploaded ones
            const existingImages = updatedMetalColorImages[color] || [];
            updatedMetalColorImages[color] = [...existingImages, ...uploadedMetalImages];
          }
        }
        
        toast.success('Metal color images uploaded successfully', { id: 'metalImagesProgress' });
      }

      // Filter out images marked for deletion
      const filteredImages = ring.media.images.filter(
        img => !imagesToDelete.includes(img.publicId)
      );

      // Combine existing images with new uploads
      const finalImages = [...filteredImages, ...newUploadedImages];

      // Handle video deletion
      const finalVideo = videoToDelete === ring.media.video.publicId 
        ? { url: '', publicId: '' }
        : newVideoData;

      // Delete marked images from cloudinary
      if (imagesToDelete.length > 0 || videoToDelete || metalColorImagesToDelete.length > 0) {
        toast.loading('Deleting old media...', { id: 'deleteProgress' });
        
        const deletePromises = [];
        
        // Delete main images
        imagesToDelete.forEach(publicId => {
          deletePromises.push(
            fetch('/api/upload/delete', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ publicId, resourceType: 'image' })
            })
          );
        });
        
        // Delete video
        if (videoToDelete) {
          deletePromises.push(
            fetch('/api/upload/delete', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ publicId: videoToDelete, resourceType: 'video' })
            })
          );
        }
        
        // Delete metal color images
        metalColorImagesToDelete.forEach(publicId => {
          deletePromises.push(
            fetch('/api/upload/delete', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ publicId, resourceType: 'image' })
            })
          );
        });
        
        await Promise.all(deletePromises);
        toast.success('Old media deleted successfully', { id: 'deleteProgress' });
      }

      // Prepare the update data
      const updateData = {
        ...ring,
        metalColorImages: updatedMetalColorImages,
        media: {
          images: finalImages,
          video: finalVideo
        }
      };

      // Update the ring
      toast.loading('Updating ring...', { id: 'updateProgress' });
      const response = await fetch(`/api/admin/rings/engagement/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update ring');
      }

      toast.success('Ring updated successfully', { id: 'updateProgress' });
      router.push('/admin/rings/engagement/list');

    } catch (error) {
      console.error('Update error:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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

  // Handle ring field updates
  const updateRingField = (field: string, value: unknown) => {
    if (!ring) return;
    
    const fieldParts = field.split('.');
    if (fieldParts.length === 1) {
      setRing({ ...ring, [field]: value });
    } else if (fieldParts.length === 2) {
      const currentValue = ring[fieldParts[0] as keyof EngagementRing];
      setRing({
        ...ring,
        [fieldParts[0]]: {
          ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {}),
          [fieldParts[1]]: value
        }
      });
    }
  };

  // Metal options management
  const addMetalOption = () => {
    if (!ring) return;
    
    const newOption: MetalOption = {
      karat: '14K',
      color: 'Yellow Gold',
      price: ring.basePrice,
      description: '',
      finish_type: '',
      width_mm: 0,
      total_carat_weight: 0,
      isDefault: ring.metalOptions.length === 0
    };

    setRing({
      ...ring,
      metalOptions: [...ring.metalOptions, newOption]
    });
  };

  const removeMetalOption = (index: number) => {
    if (!ring) return;
    
    const wasDefault = ring.metalOptions[index].isDefault;
    const updatedOptions = ring.metalOptions.filter((_, i) => i !== index);

    // If we removed the default option and there are other options, make the first one default
    if (wasDefault && updatedOptions.length > 0) {
      updatedOptions[0].isDefault = true;
    }

    setRing({
      ...ring,
      metalOptions: updatedOptions
    });
  };

  const updateMetalOption = (index: number, field: keyof MetalOption, value: unknown) => {
    if (!ring) return;
    
    const updatedOptions = ring.metalOptions.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });

    setRing({
      ...ring,
      metalOptions: updatedOptions
    });
  };

  const setAsDefault = (index: number) => {
    if (!ring) return;
    
    const updatedOptions = ring.metalOptions.map((option, i) => ({
      ...option,
      isDefault: i === index
    }));

    setRing({
      ...ring,
      metalOptions: updatedOptions
    });
  };

  // Handle metal color images
  const handleMetalColorImageSelect = (color: string, files: File[]) => {
    setMetalColorTemporaryImages(prev => ({
      ...prev,
      [color]: files
    }));
  };

  const handleRemoveSavedColorImage = (color: string, imageIndex: number) => {
    if (!ring?.metalColorImages?.[color]) return;
    
    const imageToDelete = ring.metalColorImages[color][imageIndex];
    setMetalColorImagesToDelete(prev => [...prev, imageToDelete.publicId]);
    
    const updatedImages = { ...ring.metalColorImages };
    updatedImages[color] = updatedImages[color].filter((_, idx) => idx !== imageIndex);
    
    setRing({
      ...ring,
      metalColorImages: updatedImages
    });
  };

  // Size management
  const toggleSize = (size: number, isAvailable: boolean) => {
    if (!ring) return;
    
    let updatedSizes;
    if (isAvailable) {
      // Add size
      updatedSizes = [...ring.sizes, { size, isAvailable: true, additionalPrice: 0 }];
    } else {
      // Remove size
      updatedSizes = ring.sizes.filter(s => s.size !== size);
    }
    
    setRing({
      ...ring,
      sizes: updatedSizes
    });
  };

  const updateSizePrice = (size: number, price: number) => {
    if (!ring) return;
    
    const updatedSizes = ring.sizes.map(s => 
      s.size === size ? { ...s, additionalPrice: price } : s
    );
    
    setRing({
      ...ring,
      sizes: updatedSizes
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!ring) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ring Not Found</h1>
          <Link href="/admin/rings/engagement/list" className="text-purple-600 hover:text-purple-700">
            ← Back to Engagement Rings
          </Link>
        </div>
      </div>
    );
  }

  // Get unique colors from metal options
  const uniqueColors = Array.from(new Set(ring.metalOptions.map(option => option.color)))
    .filter(color => color);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            href="/admin/rings/engagement/list"
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Engagement Ring</h1>
            <p className="mt-2 text-gray-600">Update ring details and specifications</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={ring.title}
                onChange={(e) => updateRingField('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input
                type="text"
                value={ring.SKU}
                onChange={(e) => updateRingField('SKU', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($) *</label>
              <input
                type="number"
                value={ring.basePrice}
                onChange={(e) => updateRingField('basePrice', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={ring.category}
                onChange={(e) => updateRingField('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled
              />
            </div>
          </div>

          {/* Style and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Styles</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {RingEnums.STYLES.map(style => (
                  <label key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ring.style.includes(style)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateRingField('style', [...ring.style, style]);
                        } else {
                          updateRingField('style', ring.style.filter(s => s !== style));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Types</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {RingEnums.TYPES.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ring.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateRingField('type', [...ring.type, type]);
                        } else {
                          updateRingField('type', ring.type.filter(t => t !== type));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Stone Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Main Stone Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Type</label>
              <select
                value={ring.main_stone.type}
                onChange={(e) => updateRingField('main_stone.type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {RingEnums.MAIN_STONE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {ring.main_stone.type === 'Gemstone' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gemstone Type</label>
                <select
                  value={ring.main_stone.gemstone_type || ''}
                  onChange={(e) => updateRingField('main_stone.gemstone_type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Gemstone</option>
                  {RingEnums.GEMSTONE_TYPES.map(gem => (
                    <option key={gem} value={gem}>{gem}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stones</label>
              <input
                type="number"
                value={ring.main_stone.number_of_stones}
                onChange={(e) => updateRingField('main_stone.number_of_stones', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carat Weight</label>
              <input
                type="number"
                value={ring.main_stone.carat_weight}
                onChange={(e) => updateRingField('main_stone.carat_weight', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
              <select
                value={ring.main_stone.shape}
                onChange={(e) => updateRingField('main_stone.shape', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Shape</option>
                {RingEnums.STONE_SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                value={ring.main_stone.color}
                onChange={(e) => updateRingField('main_stone.color', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Color</option>
                {RingEnums.STONE_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clarity</label>
              <select
                value={ring.main_stone.clarity}
                onChange={(e) => updateRingField('main_stone.clarity', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Clarity</option>
                {RingEnums.STONE_CLARITIES.map(clarity => (
                  <option key={clarity} value={clarity}>{clarity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hardness</label>
              <input
                type="number"
                value={ring.main_stone.hardness}
                onChange={(e) => updateRingField('main_stone.hardness', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Side Stone Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Side Stone Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Type</label>
              <select
                value={ring.side_stone.type}
                onChange={(e) => updateRingField('side_stone.type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {RingEnums.SIDE_STONE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stones</label>
              <input
                type="number"
                value={ring.side_stone.number_of_stones}
                onChange={(e) => updateRingField('side_stone.number_of_stones', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Carat</label>
              <input
                type="number"
                value={ring.side_stone.total_carat}
                onChange={(e) => updateRingField('side_stone.total_carat', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
              <select
                value={ring.side_stone.shape}
                onChange={(e) => updateRingField('side_stone.shape', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Shape</option>
                {RingEnums.STONE_SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                value={ring.side_stone.color}
                onChange={(e) => updateRingField('side_stone.color', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Color</option>
                {RingEnums.STONE_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clarity</label>
              <select
                value={ring.side_stone.clarity}
                onChange={(e) => updateRingField('side_stone.clarity', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Clarity</option>
                {RingEnums.STONE_CLARITIES.map(clarity => (
                  <option key={clarity} value={clarity}>{clarity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Size Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Sizes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Additional Price ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {RingEnums.SIZES.map(({ size, circumference }) => {
                  const sizeData = ring.sizes.find(s => s.size === size);
                  const isAvailable = !!sizeData;

                  return (
                    <tr key={size} className={isAvailable ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm">
                        {size.toFixed(2)} ({circumference}mm)
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          onChange={(e) => toggleSize(size, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={sizeData?.additionalPrice || 0}
                          onChange={(e) => updateSizePrice(size, parseFloat(e.target.value) || 0)}
                          disabled={!isAvailable}
                          min="0"
                          step="0.01"
                          className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metal Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Metal Options</h2>
            <button
              type="button"
              onClick={addMetalOption}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <HiPlus className="w-4 h-4 mr-1" />
              Add Metal Option
            </button>
          </div>

          {ring.metalOptions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Karat</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price ($)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Finish</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Width (mm)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ring.metalOptions.map((option, index) => (
                    <tr key={index} className={option.isDefault ? 'bg-purple-50' : 'bg-white'}>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="radio"
                          checked={option.isDefault}
                          onChange={() => setAsDefault(index)}
                          className="rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={option.karat}
                          onChange={(e) => updateMetalOption(index, 'karat', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        >
                          {RingEnums.METAL_KARATS.map(karat => (
                            <option key={karat} value={karat}>{karat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={option.color}
                          onChange={(e) => updateMetalOption(index, 'color', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        >
                          {RingEnums.METAL_COLORS.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) => updateMetalOption(index, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={option.finish_type}
                          onChange={(e) => updateMetalOption(index, 'finish_type', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select</option>
                          {RingEnums.FINISH_TYPES.map(finish => (
                            <option key={finish} value={finish}>{finish}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={option.width_mm}
                          onChange={(e) => updateMetalOption(index, 'width_mm', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                          className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeMetalOption(index)}
                          className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                          disabled={ring.metalOptions.length === 1}
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Metal Color Images */}
          {uniqueColors.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Metal Color Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueColors.map(color => (
                  <div key={color} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">{color}</h4>
                    <MetalOptionImageUpload
                      metalIndex={0}
                      colorKey={color}
                      images={ring.metalColorImages?.[color] || []}
                      temporaryImages={metalColorTemporaryImages[color] || []}
                      onImagesSelect={(_, files) => handleMetalColorImageSelect(color, files)}
                      onImageRemove={(_, imageIndex) => handleRemoveSavedColorImage(color, imageIndex)}
                      maxImages={5}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>
          
          {/* Product Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Product Images</h3>
            
            {/* Existing Images */}
            {ring.media.images.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ring.media.images.map((image, index) => (
                    <div key={image.publicId} className="relative group">
                      <Image
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagesToDelete(prev => [...prev, image.publicId]);
                          setRing({
                            ...ring,
                            media: {
                              ...ring.media,
                              images: ring.media.images.filter(img => img.publicId !== image.publicId)
                            }
                          });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Video */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Product Video</h3>
            
            {/* Current Video */}
            {ring.media.video.url && !videoToDelete && (
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Current video: {ring.media.video.url}</span>
                  <button
                    type="button"
                    onClick={() => setVideoToDelete(ring.media.video.publicId)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* New Video Upload */}
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setTemporaryVideo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <textarea
            value={ring.description}
            onChange={(e) => updateRingField('description', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Detailed description of the engagement ring..."
          />
        </div>

        {/* Status Flags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ring.isActive}
                onChange={(e) => updateRingField('isActive', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ring.isFeatured}
                onChange={(e) => updateRingField('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ring.isNew || false}
                onChange={(e) => updateRingField('isNew', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">New</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ring.onSale || false}
                onChange={(e) => updateRingField('onSale', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">On Sale</span>
            </label>
          </div>

          {ring.onSale && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
              <input
                type="number"
                value={ring.originalPrice || ''}
                onChange={(e) => updateRingField('originalPrice', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.01"
                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Stock */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
         <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock</h2>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Total Pieces
           </label>
           <input
             type="number"
             value={ring.totalPieces || 0}
             onChange={(e) => updateRingField('totalPieces', parseInt(e.target.value) || 0)}
             min="0"
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
           />
         </div>
       </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/rings/engagement/list"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Ring'}
          </button>
        </div>
      </form>
    </div>
  );
}
