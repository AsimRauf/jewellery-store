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
  const { user } = useUser();
  const router = useRouter();
  
  const [ring, setRing] = useState<WeddingRing | null>(null);
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
      const response = await fetch(`/api/admin/rings/wedding/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ring');
      }

      const result = await response.json();
      console.log('Fetched ring data:', result.data);
      console.log('Metal options:', result.data.metalOptions);
      console.log('Metal color images:', result.data.metalColorImages);
      
      // Validate and clean up data inconsistencies
      if (result.data.metalColorImages && result.data.metalOptions) {
        const metalColors = result.data.metalOptions.map((m: MetalOption) => m.color);
        const imageColors = Object.keys(result.data.metalColorImages);
        
        // Log inconsistencies
        const orphanedImageColors = imageColors.filter((color: string) => !metalColors.includes(color));
        const missingImageColors = metalColors.filter((color: string) => !imageColors.includes(color));
        
        if (orphanedImageColors.length > 0) {
          console.warn('Found orphaned metal color images for:', orphanedImageColors);
        }
        if (missingImageColors.length > 0) {
          console.warn('Missing metal color images for:', missingImageColors);
        }
      }
      
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
    if (user && id) {
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

  // Helper function to convert File to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle image deletion
  const handleDeleteExistingImage = (publicId: string, index: number) => {
    if (!ring) return;
    
    // Add to deletion list
    setImagesToDelete(prev => [...prev, publicId]);
    
    // Remove from ring images
    setRing(prev => {
      if (!prev) return null;
      const updatedImages = prev.media.images.filter((_, i) => i !== index);
      return {
        ...prev,
        media: {
          ...prev.media,
          images: updatedImages
        }
      };
    });
  };

  // Handle video deletion
  const handleDeleteExistingVideo = () => {
    if (!ring?.media?.video?.publicId) return;
    
    setVideoToDelete(ring.media.video.publicId);
    setRing(prev => {
      if (!prev) return null;
      return {
        ...prev,
        media: {
          ...prev.media,
          video: { url: '', publicId: '' }
        }
      };
    });
  };

  // Handle metal color image deletion
  const handleDeleteMetalColorImage = (color: string, publicId: string, index: number) => {
    if (!ring) return;
    
    // Add to deletion list
    setMetalColorImagesToDelete(prev => [...prev, publicId]);
    
    // Remove from ring metalColorImages
    setRing(prev => {
      if (!prev) return null;
      const updatedMetalColorImages = { ...prev.metalColorImages };
      if (updatedMetalColorImages[color]) {
        updatedMetalColorImages[color] = updatedMetalColorImages[color].filter((_, i) => i !== index);
        if (updatedMetalColorImages[color].length === 0) {
          delete updatedMetalColorImages[color];
        }
      }
      return {
        ...prev,
        metalColorImages: updatedMetalColorImages
      };
    });
  };

  // Handle metal color image selection
  const handleMetalColorImagesSelect = (color: string, files: File[]) => {
    setMetalColorTemporaryImages(prev => ({
      ...prev,
      [color]: files
    }));
  };

  // Handle metal color image removal from temporary
  const handleMetalColorImageRemove = (color: string, index: number) => {
    setMetalColorTemporaryImages(prev => {
      const newImages = { ...prev };
      if (newImages[color]) {
        newImages[color] = newImages[color].filter((_, i) => i !== index);
        if (newImages[color].length === 0) {
          delete newImages[color];
        }
      }
      return newImages;
    });
  };

  // Handle metal option changes
  const handleMetalOptionChange = (index: number, field: keyof MetalOption, value: string | number | boolean) => {
    if (!ring) return;
    
    setRing(prev => {
      if (!prev) return null;
      const updatedOptions = [...prev.metalOptions];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      return { ...prev, metalOptions: updatedOptions };
    });
  };

  // Add new metal option
  const handleAddMetalOption = () => {
    if (!ring) return;
    
    const newOption: MetalOption = {
      karat: '',
      color: '',
      price: ring.basePrice,
      description: '',
      finish_type: '',
      width_mm: 0,
      total_carat_weight: 0,
      isDefault: false // Never automatically set as default
    };
    
    setRing(prev => {
      if (!prev) return null;
      const updatedOptions = [...prev.metalOptions, newOption];
      
      // If this is the first option being added, make it default
      if (prev.metalOptions.length === 0) {
        newOption.isDefault = true;
      }
      
      return { ...prev, metalOptions: updatedOptions };
    });
  };

  // Remove metal option
  const handleRemoveMetalOption = (index: number) => {
    if (!ring || ring.metalOptions.length <= 1) {
      toast.error('At least one metal option must be available');
      return;
    }
    
    setRing(prev => {
      if (!prev) return null;
      const updatedOptions = prev.metalOptions.filter((_, i) => i !== index);
      // If removed option was default, make first option default
      if (prev.metalOptions[index].isDefault && updatedOptions.length > 0) {
        updatedOptions[0].isDefault = true;
      }
      return { ...prev, metalOptions: updatedOptions };
    });
  };

  // Handle size changes
  const handleSizeChange = (sizeValue: number, field: 'isAvailable' | 'additionalPrice', value: boolean | number) => {
    if (!ring) return;
    
    setRing(prev => {
      if (!prev) return null;
      const updatedSizes = [...prev.sizes];
      const existingIndex = updatedSizes.findIndex(s => s.size === sizeValue);
      
      if (existingIndex >= 0) {
        if (field === 'isAvailable' && !value) {
          // Remove size if unchecked
          updatedSizes.splice(existingIndex, 1);
        } else {
          // Update existing size
          updatedSizes[existingIndex] = { ...updatedSizes[existingIndex], [field]: value };
        }
      } else if (field === 'isAvailable' && value) {
        // Add new size
        updatedSizes.push({ size: sizeValue, isAvailable: true, additionalPrice: 0 });
      }
      
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ring) return;

    // Validate that there's exactly one default metal option
    const defaultOptions = ring.metalOptions.filter(option => option.isDefault);
    if (defaultOptions.length === 0) {
      toast.error('Please select a default metal option');
      return;
    }
    if (defaultOptions.length > 1) {
      toast.error('Only one metal option can be set as default');
      return;
    }

    setIsSubmitting(true);

    try {
      // Delete images from Cloudinary
      if (imagesToDelete.length > 0) {
        toast.loading('Deleting old images...', { id: 'deleteImages' });
        for (const publicId of imagesToDelete) {
          await fetch('/api/upload/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ publicId, resourceType: 'image' })
          });
        }
        toast.success('Old images deleted', { id: 'deleteImages' });
      }

      // Delete metal color images from Cloudinary
      if (metalColorImagesToDelete.length > 0) {
        toast.loading('Deleting old metal color images...', { id: 'deleteMetalColorImages' });
        for (const publicId of metalColorImagesToDelete) {
          await fetch('/api/upload/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ publicId, resourceType: 'image' })
          });
        }
        toast.success('Old metal color images deleted', { id: 'deleteMetalColorImages' });
      }

      // Delete video from Cloudinary
      if (videoToDelete) {
        toast.loading('Deleting old video...', { id: 'deleteVideo' });
        await fetch('/api/upload/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ publicId: videoToDelete, resourceType: 'video' })
        });
        toast.success('Old video deleted', { id: 'deleteVideo' });
      }

      // Upload new images
      let newUploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading new images...', { id: 'uploadImages' });
        newUploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                file: base64,
                category: 'wedding'
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to upload image');
            }
            
            return response.json();
          })
        );
        toast.success('New images uploaded', { id: 'uploadImages' });
      }

      // Upload new metal color images
      const newMetalColorImages: Record<string, Array<{ url: string; publicId: string }>> = {};
      if (Object.keys(metalColorTemporaryImages).length > 0) {
        toast.loading('Uploading new metal color images...', { id: 'uploadMetalColorImages' });
        
        for (const [color, files] of Object.entries(metalColorTemporaryImages)) {
          if (files.length > 0) {
            const colorImages = await Promise.all(
              files.map(async (file) => {
                const base64 = await convertToBase64(file);
                const response = await fetch('/api/upload/image', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ 
                    file: base64,
                    category: `wedding/metal-colors/${color.toLowerCase()}`
                  })
                });
                
                if (!response.ok) {
                  throw new Error('Failed to upload metal color image');
                }
                
                return response.json();
              })
            );
            
            newMetalColorImages[color] = colorImages;
          }
        }
        toast.success('New metal color images uploaded', { id: 'uploadMetalColorImages' });
      }

      // Upload new video
      let newVideoData = ring.media.video;
      if (temporaryVideo) {
        toast.loading('Uploading new video...', { id: 'uploadVideo' });
        const base64 = await convertToBase64(temporaryVideo);
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            file: base64,
            category: 'wedding'
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload video');
        }
        
        newVideoData = await response.json();
        toast.success('New video uploaded', { id: 'uploadVideo' });
      }



      // Prepare final data
      const finalData = {
        ...ring,
        media: {
          images: [...ring.media.images, ...newUploadedImages],
          video: newVideoData
        },
        metalColorImages: (() => {
          const mergedImages = { ...ring.metalColorImages };
          
          // Merge new images with existing ones for each color
          Object.entries(newMetalColorImages).forEach(([color, newImages]) => {
            if (mergedImages[color]) {
              // Append new images to existing ones
              mergedImages[color] = [...mergedImages[color], ...newImages];
            } else {
              // Add new color with its images
              mergedImages[color] = newImages;
            }
          });
          
          return mergedImages;
        })()
      };

      // Update ring
      toast.loading('Updating ring...', { id: 'updateRing' });
      const response = await fetch(`/api/admin/rings/wedding/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update ring');
      }

      toast.success('Ring updated successfully', { id: 'updateRing' });
      router.push('/admin/rings/wedding/list');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
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

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
          
          {/* Existing Images */}
          {ring.media?.images?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Current Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ring.media.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                      {image.url ? (
                        <Image
                          src={image.url}
                          alt={`Ring image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() => {
                            console.error('Failed to load image:', image.url);
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <p className="text-gray-500 text-sm">No image</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image.publicId, index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Images</h3>
            <ImageUpload
              onImagesSelect={setTemporaryImages}
              onVideoSelect={() => {}} // Not used here since we handle video separately
              temporaryImages={temporaryImages}
              temporaryVideo={null}
              maxImages={10}
            />
          </div>
        </div>

        {/* Video */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Video</h2>
          
          {/* Current Video */}
          {ring.media?.video?.url && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Current Video</h3>
              <div className="relative">
                <video controls className="w-full max-w-md rounded-lg">
                  <source src={ring.media.video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  onClick={handleDeleteExistingVideo}
                  className="mt-2 inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <HiTrash className="w-4 h-4 mr-2" />
                  Remove Video
                </button>
              </div>
            </div>
          )}

          {/* Upload New Video */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {ring.media?.video?.url ? 'Replace Video' : 'Add Video'}
            </h3>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setTemporaryVideo(file || null);
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {temporaryVideo && (
              <p className="mt-2 text-sm text-green-600">New video selected: {temporaryVideo.name}</p>
            )}
          </div>
        </div>

        {/* Metal Color Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metal Color Images</h2>
          
          {/* Current Metal Color Images */}
          {ring.metalColorImages && typeof ring.metalColorImages === 'object' && Object.keys(ring.metalColorImages).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Current Metal Color Images</h3>
              {Object.entries(ring.metalColorImages).map(([color, images]) => (
                <div key={color} className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">{color}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.isArray(images) && images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                          {image.url ? (
                            <Image
                              src={image.url}
                              alt={`${color} image ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={() => {
                                console.error('Failed to load metal color image:', image.url);
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <p className="text-gray-500 text-sm">No image</p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteMetalColorImage(color, image.publicId, index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Metal Color Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Metal Color Images</h3>
            <div className="space-y-4">
              {ring.metalOptions.map((metalOption, index) => {
                const color = metalOption.color;
                const existingImages = ring.metalColorImages?.[color] || [];
                const tempImages = metalColorTemporaryImages[color] || [];
                
                return (
                  <div key={`color-${color}-${index}`} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">{color} Images</h4>
                    <MetalOptionImageUpload
                      metalIndex={index}
                      colorKey={color}
                      images={existingImages}
                      temporaryImages={tempImages}
                      onImagesSelect={(_, files) => handleMetalColorImagesSelect(color, files)}
                      onImageRemove={(_, imageIndex) => handleMetalColorImageRemove(color, imageIndex)}
                      maxImages={5}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metal Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metal Options</h2>
          
          {ring.metalOptions.map((option, index) => (
            <div key={index} className={`mb-6 p-4 border rounded-lg ${option.isDefault ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Metal Option {index + 1}
                  {option.isDefault && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">Default</span>}
                </h3>
                {ring.metalOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMetalOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karat *</label>
                  <select
                    value={option.karat}
                    onChange={(e) => handleMetalOptionChange(index, 'karat', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select Karat</option>
                    {RingEnums.METAL_KARATS.map(karat => (
                      <option key={karat} value={karat}>{karat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                  <select
                    value={option.color}
                    onChange={(e) => handleMetalOptionChange(index, 'color', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select Color</option>
                    {RingEnums.METAL_COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => handleMetalOptionChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Finish Type</label>
                  <select
                    value={option.finish_type}
                    onChange={(e) => handleMetalOptionChange(index, 'finish_type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Finish</option>
                    {RingEnums.FINISH_TYPES.map(finish => (
                      <option key={finish} value={finish}>{finish}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
                  <input
                    type="number"
                    value={option.width_mm}
                    onChange={(e) => handleMetalOptionChange(index, 'width_mm', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Carat Weight</label>
                  <input
                    type="number"
                    value={option.total_carat_weight}
                    onChange={(e) => handleMetalOptionChange(index, 'total_carat_weight', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={option.description}
                    onChange={(e) => handleMetalOptionChange(index, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="defaultMetalOption"
                    checked={option.isDefault}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Make this option default and unset others
                        setRing(prev => {
                          if (!prev) return null;
                          const updatedOptions = prev.metalOptions.map((opt, i) => ({
                            ...opt,
                            isDefault: i === index
                          }));
                          return { ...prev, metalOptions: updatedOptions };
                        });
                      }
                    }}
                    className="rounded-full border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Set as default</label>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddMetalOption}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Add Metal Option
          </button>
        </div>

        {/* Available Sizes */}
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
                          onChange={(e) => handleSizeChange(size, 'isAvailable', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={sizeData?.additionalPrice || ''}
                          onChange={(e) => handleSizeChange(size, 'additionalPrice', parseFloat(e.target.value) || 0)}
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

        {/* Side Stone Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Side Stone Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Type</label>
              <select
                value={ring.side_stone.type}
                onChange={(e) => handleFieldChange('side_stone.type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Stone Type</option>
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
                onChange={(e) => handleFieldChange('side_stone.number_of_stones', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Carat</label>
              <input
                type="number"
                value={ring.side_stone.total_carat}
                onChange={(e) => handleFieldChange('side_stone.total_carat', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Shape</label>
              <select
                value={ring.side_stone.shape}
                onChange={(e) => handleFieldChange('side_stone.shape', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Stone Shape</option>
                {RingEnums.STONE_SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Color</label>
              <select
                value={ring.side_stone.color}
                onChange={(e) => handleFieldChange('side_stone.color', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Stone Color</option>
                {RingEnums.STONE_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stone Clarity</label>
              <select
                value={ring.side_stone.clarity}
                onChange={(e) => handleFieldChange('side_stone.clarity', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Stone Clarity</option>
                {RingEnums.STONE_CLARITIES.map(clarity => (
                  <option key={clarity} value={clarity}>{clarity}</option>
                ))}
              </select>
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
