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

interface Setting {
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
  side_stone: {
    type: string;
    number_of_stones: number;
    total_carat: number;
    shape: string;
    color: string;
    clarity: string;
  };
  canAcceptStone: boolean;
  compatibleStoneShapes: string[];
  settingHeight?: number;
  bandWidth?: number;
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

export default function EditSetting({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const router = useRouter();
  
  const [setting, setSetting] = useState<Setting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [metalColorTemporaryImages, setMetalColorTemporaryImages] = useState<Record<string, File[]>>({});
  const [metalColorImagesToDelete, setMetalColorImagesToDelete] = useState<string[]>([]);

  const fetchSetting = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rings/settings/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch setting');
      }

      const result = await response.json();
      console.log('Fetched setting data:', result.data);
      setSetting(result.data);
    } catch (error) {
      toast.error('Failed to fetch setting details');
      console.error('Fetch error:', error);
      router.push('/admin/rings/settings/list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchSetting();
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
    if (!setting) return;

    setIsSubmitting(true);

    try {
      // Upload new product images
      let newUploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading new images...', { id: 'uploadProgress' });
        
        newUploadedImages = await Promise.all(
          temporaryImages.map(async (file, index) => {
            return await uploadImage(file, 'settings', index);
          })
        );
        
        toast.success('Images uploaded successfully', { id: 'uploadProgress' });
      }

      // Upload new video if exists
      let newVideoData = setting.media.video;
      if (temporaryVideo) {
        toast.loading('Uploading video...', { id: 'videoProgress' });
        const base64 = await convertToBase64(temporaryVideo);
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            file: base64,
            category: 'settings'
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
      const updatedMetalColorImages = { ...(setting.metalColorImages || {}) };
      
      if (Object.keys(metalColorTemporaryImages).length > 0) {
        toast.loading('Uploading metal color images...', { id: 'metalImagesProgress' });
        
        for (const [color, files] of Object.entries(metalColorTemporaryImages)) {
          if (files.length > 0) {
            const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
            const uploadedMetalImages = await Promise.all(
              files.map(async (file, index) => {
                return await uploadImage(file, `settings/metal-colors/${colorSlug}`, index, color);
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
      const filteredImages = setting.media.images.filter(
        img => !imagesToDelete.includes(img.publicId)
      );

      // Combine existing images with new uploads
      const finalImages = [...filteredImages, ...newUploadedImages];

      // Handle video deletion
      const finalVideo = videoToDelete === setting.media.video.publicId 
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
        ...setting,
        metalColorImages: updatedMetalColorImages,
        media: {
          images: finalImages,
          video: finalVideo
        }
      };

      // Update the setting
      toast.loading('Updating setting...', { id: 'updateProgress' });
      const response = await fetch(`/api/admin/rings/settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update setting');
      }

      toast.success('Setting updated successfully', { id: 'updateProgress' });
      router.push('/admin/rings/settings/list');

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

  // Handle setting field updates
  const updateSettingField = (field: string, value: unknown) => {
    if (!setting) return;
    
    const fieldParts = field.split('.');
    if (fieldParts.length === 1) {
      setSetting({ ...setting, [field]: value });
    } else if (fieldParts.length === 2) {
      const currentValue = setting[fieldParts[0] as keyof Setting];
      setSetting({
        ...setting,
        [fieldParts[0]]: {
          ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {}),
          [fieldParts[1]]: value
        }
      });
    }
  };

  // Metal options management
  const addMetalOption = () => {
    if (!setting) return;
    
    const newOption: MetalOption = {
      karat: '14K',
      color: 'Yellow Gold',
      price: setting.basePrice,
      description: '',
      finish_type: '',
      width_mm: 0,
      total_carat_weight: 0,
      isDefault: setting.metalOptions.length === 0
    };

    setSetting({
      ...setting,
      metalOptions: [...setting.metalOptions, newOption]
    });
  };

  const removeMetalOption = (index: number) => {
    if (!setting) return;
    
    const wasDefault = setting.metalOptions[index].isDefault;
    const updatedOptions = setting.metalOptions.filter((_, i) => i !== index);

    // If we removed the default option and there are other options, make the first one default
    if (wasDefault && updatedOptions.length > 0) {
      updatedOptions[0].isDefault = true;
    }

    setSetting({
      ...setting,
      metalOptions: updatedOptions
    });
  };

  const updateMetalOption = (index: number, field: keyof MetalOption, value: unknown) => {
    if (!setting) return;
    
    const updatedOptions = setting.metalOptions.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });

    setSetting({
      ...setting,
      metalOptions: updatedOptions
    });
  };

  const setAsDefault = (index: number) => {
    if (!setting) return;
    
    const updatedOptions = setting.metalOptions.map((option, i) => ({
      ...option,
      isDefault: i === index
    }));

    setSetting({
      ...setting,
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
    if (!setting?.metalColorImages?.[color]) return;
    
    const imageToDelete = setting.metalColorImages[color][imageIndex];
    setMetalColorImagesToDelete(prev => [...prev, imageToDelete.publicId]);
    
    const updatedImages = { ...setting.metalColorImages };
    updatedImages[color] = updatedImages[color].filter((_, idx) => idx !== imageIndex);
    
    setSetting({
      ...setting,
      metalColorImages: updatedImages
    });
  };

  // Size management
  const toggleSize = (size: number, isAvailable: boolean) => {
    if (!setting) return;
    
    let updatedSizes;
    if (isAvailable) {
      // Add size
      updatedSizes = [...setting.sizes, { size, isAvailable: true, additionalPrice: 0 }];
    } else {
      // Remove size
      updatedSizes = setting.sizes.filter(s => s.size !== size);
    }
    
    setSetting({
      ...setting,
      sizes: updatedSizes
    });
  };

  const updateSizePrice = (size: number, price: number) => {
    if (!setting) return;
    
    const updatedSizes = setting.sizes.map(s => 
      s.size === size ? { ...s, additionalPrice: price } : s
    );
    
    setSetting({
      ...setting,
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

  if (!setting) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting Not Found</h1>
          <Link href="/admin/rings/settings/list" className="text-purple-600 hover:text-purple-700">
            ← Back to Settings
          </Link>
        </div>
      </div>
    );
  }

  // Get unique colors from metal options
  const uniqueColors = Array.from(new Set(setting.metalOptions.map(option => option.color)))
    .filter(color => color);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            href="/admin/rings/settings/list"
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Ring Setting</h1>
            <p className="mt-2 text-gray-600">Update setting details and specifications</p>
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
                value={setting.title}
                onChange={(e) => updateSettingField('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input
                type="text"
                value={setting.SKU}
                onChange={(e) => updateSettingField('SKU', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($) *</label>
              <input
                type="number"
                value={setting.basePrice}
                onChange={(e) => updateSettingField('basePrice', parseFloat(e.target.value) || 0)}
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
                value={setting.category}
                onChange={(e) => updateSettingField('category', e.target.value)}
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
                      checked={setting.style.includes(style)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSettingField('style', [...setting.style, style]);
                        } else {
                          updateSettingField('style', setting.style.filter(s => s !== style));
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
                      checked={setting.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSettingField('type', [...setting.type, type]);
                        } else {
                          updateSettingField('type', setting.type.filter(t => t !== type));
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

        {/* Setting Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Setting Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={setting.canAcceptStone}
                  onChange={(e) => updateSettingField('canAcceptStone', e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-3"
                />
                <span className="text-sm font-medium text-gray-700">This setting can accept a stone</span>
              </label>
            </div>

            {setting.canAcceptStone && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Compatible Stone Shapes</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {RingEnums.STONE_SHAPES.map(shape => (
                    <label key={shape} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.compatibleStoneShapes.includes(shape)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateSettingField('compatibleStoneShapes', [...setting.compatibleStoneShapes, shape]);
                          } else {
                            updateSettingField('compatibleStoneShapes', setting.compatibleStoneShapes.filter(s => s !== shape));
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm">{shape}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setting Height (mm)</label>
              <input
                type="number"
                value={setting.settingHeight || ''}
                onChange={(e) => updateSettingField('settingHeight', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Band Width (mm)</label>
              <input
                type="number"
                value={setting.bandWidth || ''}
                onChange={(e) => updateSettingField('bandWidth', parseFloat(e.target.value) || undefined)}
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
                value={setting.side_stone.type}
                onChange={(e) => updateSettingField('side_stone.type', e.target.value)}
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
                value={setting.side_stone.number_of_stones}
                onChange={(e) => updateSettingField('side_stone.number_of_stones', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Carat</label>
              <input
                type="number"
                value={setting.side_stone.total_carat}
                onChange={(e) => updateSettingField('side_stone.total_carat', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
              <select
                value={setting.side_stone.shape}
                onChange={(e) => updateSettingField('side_stone.shape', e.target.value)}
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
                value={setting.side_stone.color}
                onChange={(e) => updateSettingField('side_stone.color', e.target.value)}
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
                value={setting.side_stone.clarity}
                onChange={(e) => updateSettingField('side_stone.clarity', e.target.value)}
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
                  const sizeData = setting.sizes.find(s => s.size === size);
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

          {setting.metalOptions.length > 0 && (
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
                  {setting.metalOptions.map((option, index) => (
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
                          disabled={setting.metalOptions.length === 1}
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
                      images={setting.metalColorImages?.[color] || []}
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
            {setting.media.images.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {setting.media.images.map((image, index) => (
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
                          setSetting({
                            ...setting,
                            media: {
                              ...setting.media,
                              images: setting.media.images.filter(img => img.publicId !== image.publicId)
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
            {setting.media.video.url && !videoToDelete && (
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Current video: {setting.media.video.url}</span>
                  <button
                    type="button"
                    onClick={() => setVideoToDelete(setting.media.video.publicId)}
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
            value={setting.description}
            onChange={(e) => updateSettingField('description', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Detailed description of the ring setting..."
          />
        </div>

        {/* Status Flags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={setting.isActive}
                onChange={(e) => updateSettingField('isActive', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={setting.isFeatured}
                onChange={(e) => updateSettingField('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={setting.isNew || false}
                onChange={(e) => updateSettingField('isNew', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">New</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={setting.onSale || false}
                onChange={(e) => updateSettingField('onSale', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">On Sale</span>
            </label>
          </div>

          {setting.onSale && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
              <input
                type="number"
                value={setting.originalPrice || ''}
                onChange={(e) => updateSettingField('originalPrice', parseFloat(e.target.value) || undefined)}
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
             value={setting.totalPieces || 0}
             onChange={(e) => updateSettingField('totalPieces', parseInt(e.target.value) || 0)}
             min="0"
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
           />
         </div>
       </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/rings/settings/list"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Setting'}
          </button>
        </div>
      </form>
    </div>
  );
}
