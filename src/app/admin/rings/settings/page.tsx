'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RingEnums } from '@/constants/ringEnums';
import MediaUpload from '@/components/admin/ImageUpload';
import MetalOptionImageUpload from '@/components/admin/MetalOptionImageUpload';
import { toast } from 'react-hot-toast';

// Define types for form data
interface MetalOption {
  karat: string;
  color: string;
  price: number;
  description?: string;
  finish_type?: string | null;
  width_mm?: number;
  total_carat_weight?: number;
  isDefault: boolean;
}

interface SideStone {
  type: string;
  number_of_stones: number;
  total_carat: number;
  shape: string;
  color: string;
  clarity: string;
}

interface Media {
  images: Array<{
    url: string;
    publicId: string;
  }>;
  video: {
    url: string;
    publicId: string;
  };
}

// Update FormDataValue to include undefined and null
type FormDataValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | MetalOption[] 
  | Size[] 
  | SideStone 
  | Media 
  | Record<string, unknown> 
  | undefined 
  | null;

interface FormDataType {
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  metalColorImages: Record<string, Array<{ url: string; publicId: string }>>;
  sizes: Size[]; // Explicitly typed as Size[]
  side_stone: SideStone;
  media: Media;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  canAcceptStone: boolean;
  compatibleStoneShapes: string[];
  settingHeight?: number | null;
  bandWidth?: number | null;
  [key: string]: FormDataValue;
}

interface Size {
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

export default function SettingsUploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);
  const [temporaryMetalColorImages, setTemporaryMetalColorImages] = useState<Record<string, File[]>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize form data
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    category: 'Engagement',
    style: [],
    type: [],
    SKU: '',
    basePrice: 0,
    metalOptions: [
      {
        karat: '14K',
        color: 'White Gold',
        price: 0,
        description: '',
        finish_type: null,
        isDefault: true
      }
    ],
    metalColorImages: {},
    sizes: RingEnums.SIZES.map(size => ({
      size: size.size,
      isAvailable: true,
      additionalPrice: 0
    })),
    side_stone: {
      type: '',
      number_of_stones: 0,
      total_carat: 0,
      shape: '',
      color: '',
      clarity: ''
    },
    media: {
      images: [],
      video: {
        url: '',
        publicId: ''
      }
    },
    description: '',
    isActive: true,
    isFeatured: false,
    canAcceptStone: true,
    compatibleStoneShapes: [],
    settingHeight: null,
    bandWidth: null
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'basePrice') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'settingHeight' || name === 'bandWidth') {
      // Handle optional numeric fields
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle multi-select changes (styles, types)
  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };

  // Handle metal option changes
  const handleMetalOptionChange = (index: number, field: string, value: string | number | boolean | null) => {
    setFormData(prev => {
      const updatedMetalOptions = [...prev.metalOptions];
      
      if (field === 'price') {
        updatedMetalOptions[index] = {
          ...updatedMetalOptions[index],
          [field]: parseFloat(value as string) || 0
        };
      } else if (field === 'isDefault' && value === true) {
        // If setting a new default, unset any existing defaults
        updatedMetalOptions.forEach((option, i) => {
          if (i !== index) {
            option.isDefault = false;
          }
        });
        updatedMetalOptions[index] = {
          ...updatedMetalOptions[index],
          [field]: value
        };
      } else if (field === 'width_mm' || field === 'total_carat_weight') {
        // Handle optional numeric fields
        const numValue = value === '' ? undefined : parseFloat(value as string);
        updatedMetalOptions[index] = {
          ...updatedMetalOptions[index],
          [field]: numValue
        };
      } else {
        updatedMetalOptions[index] = {
          ...updatedMetalOptions[index],
          [field]: value
        };
      }
      
      return { ...prev, metalOptions: updatedMetalOptions };
    });
  };

  // Add a new metal option
  const addMetalOption = () => {
    setFormData(prev => ({
      ...prev,
      metalOptions: [
        ...prev.metalOptions,
        {
          karat: '14K',
          color: 'White Gold',
          price: 0,
          description: '',
          finish_type: null,
          isDefault: false
        }
      ]
    }));
  };

  // Remove a metal option
  const removeMetalOption = (index: number) => {
    setFormData(prev => {
      const updatedMetalOptions = [...prev.metalOptions];
      updatedMetalOptions.splice(index, 1);
      
      // If we removed the default option and there are still options left,
      // make the first one the default
      if (updatedMetalOptions.length > 0 && !updatedMetalOptions.some(opt => opt.isDefault)) {
        updatedMetalOptions[0].isDefault = true;
      }
      
      return { ...prev, metalOptions: updatedMetalOptions };
    });
  };

  // Handle side stone changes
  const handleSideStoneChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      side_stone: {
        ...prev.side_stone,
        [field]: field === 'number_of_stones' || field === 'total_carat' 
          ? parseFloat(value as string) || 0 
          : value
      }
    }));
  };

  // Handle size changes
  const handleSizeChange = (size: number, field: 'isAvailable' | 'additionalPrice', value: boolean | number) => {
    setFormData(prev => {
      const updatedSizes = prev.sizes.map(s => {
        if (s.size === size) {
          return { ...s, [field]: value };
        }
        return s;
      });
      return { ...prev, sizes: updatedSizes };
    });
  };

  // Handle compatible stone shapes
  const handleStoneShapeChange = (shape: string) => {
    setFormData(prev => {
      const currentShapes = [...prev.compatibleStoneShapes];
      if (currentShapes.includes(shape)) {
        return { ...prev, compatibleStoneShapes: currentShapes.filter(s => s !== shape) };
      } else {
        return { ...prev, compatibleStoneShapes: [...currentShapes, shape] };
      }
    });
  };

  // Handle images for a specific metal color
  const handleMetalColorImagesSelect = (metalIndex: number, color: string, files: File[]) => {
    setTemporaryMetalColorImages(prev => ({
      ...prev,
      [color]: files
    }));
  };

  // Handle removing a metal color image
  const handleMetalColorImageRemove = (metalIndex: number, color: string, imageIndex: number) => {
    setTemporaryMetalColorImages(prev => {
      const updatedImages = [...(prev[color] || [])];
      updatedImages.splice(imageIndex, 1);
      return {
        ...prev,
        [color]: updatedImages
      };
    });
  };

  // Handle main product images
  const handleImagesSelect = (files: File[]) => {
    setTemporaryImages(files);
  };

  // Handle product video
  const handleVideoSelect = (file: File | null) => {
    setTemporaryVideo(file);
  };

  // Upload a single image to Cloudinary
  const uploadImage = async (file: File, category: string = 'settings'): Promise<{ url: string; publicId: string }> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64Data, category })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload image');
          }
          
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Upload video to Cloudinary
  const uploadVideo = async (file: File, category: string = 'settings'): Promise<{ url: string; publicId: string }> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          
          const response = await fetch('/api/upload/video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64Data, category })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload video');
          }
          
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.title || !formData.SKU || formData.basePrice <= 0) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.metalOptions.length === 0) {
        toast.error('At least one metal option is required');
        setIsSubmitting(false);
        return;
      }
      
      // Upload main product images
      const uploadedImages = [];
      let totalUploads = temporaryImages.length;
      let completedUploads = 0;
      
      for (const file of temporaryImages) {
        const uploadedImage = await uploadImage(file);
        uploadedImages.push(uploadedImage);
        completedUploads++;
        setUploadProgress(Math.round((completedUploads / totalUploads) * 100));
      }
      
      // Upload video if exists
      let uploadedVideo = { url: '', publicId: '' };
      if (temporaryVideo) {
        totalUploads++;
        uploadedVideo = await uploadVideo(temporaryVideo);
        completedUploads++;
        setUploadProgress(Math.round((completedUploads / totalUploads) * 100));
      }
      
      // Upload metal color images
      const uploadedMetalColorImages: Record<string, Array<{ url: string; publicId: string }>> = {};
      
      for (const [color, files] of Object.entries(temporaryMetalColorImages)) {
        uploadedMetalColorImages[color] = [];
        
        for (const file of files) {
          totalUploads++;
          const uploadedImage = await uploadImage(file);
          uploadedMetalColorImages[color].push(uploadedImage);
          completedUploads++;
          setUploadProgress(Math.round((completedUploads / totalUploads) * 100));
        }
      }
      
      // Prepare final data for submission
      const finalData = {
        ...formData,
        media: {
          images: uploadedImages,
          video: uploadedVideo
        },
        metalColorImages: uploadedMetalColorImages
      };
      
      // Submit data to API
      const response = await fetch('/api/admin/rings/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create setting');
      }
      
      toast.success('Setting created successfully!');
      router.push('/admin/rings/settings/list');
      
    } catch (error) {
      console.error('Error creating setting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create setting');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Navigation between form steps
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Ring Setting</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
      
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                  </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {RingEnums.CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Styles
                </label>
                <div className="flex flex-wrap gap-2">
                  {RingEnums.STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleMultiSelectChange('style', style)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.style.includes(style)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {RingEnums.TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleMultiSelectChange('type', type)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.type.includes(type)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Setting Height (mm)
                </label>
                <input
                  type="number"
                  name="settingHeight"
                  value={formData.settingHeight === null ? '' : formData.settingHeight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Band Width (mm)
                </label>
                <input
                  type="number"
                  name="bandWidth"
                  value={formData.bandWidth === null ? '' : formData.bandWidth}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                      Featured
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canAcceptStone"
                      name="canAcceptStone"
                      checked={formData.canAcceptStone}
                      onChange={(e) => setFormData(prev => ({ ...prev, canAcceptStone: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="canAcceptStone" className="ml-2 text-sm text-gray-700">
                      Can Accept Stone
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Next: Metal Options
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Metal Options */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Metal Options</h2>
            
            {formData.metalOptions.map((option, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Metal Option {index + 1}</h3>
                  {formData.metalOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMetalOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Karat
                    </label>
                    <select
                      value={option.karat}
                      onChange={(e) => handleMetalOptionChange(index, 'karat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {RingEnums.METAL_KARATS.map((karat) => (
                        <option key={karat} value={karat}>
                          {karat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      value={option.color}
                      onChange={(e) => handleMetalOptionChange(index, 'color', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {RingEnums.METAL_COLORS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={option.price}
                      onChange={(e) => handleMetalOptionChange(index, 'price', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finish Type
                    </label>
                    <select
                      value={option.finish_type || ''}
                      onChange={(e) => handleMetalOptionChange(index, 'finish_type', e.target.value || null)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">None</option>
                      {RingEnums.FINISH_TYPES.map((finish) => (
                        <option key={finish} value={finish}>
                          {finish}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (mm)
                    </label>
                    <input
                      type="number"
                      value={option.width_mm || ''}
                      onChange={(e) => handleMetalOptionChange(index, 'width_mm', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Carat Weight
                    </label>
                    <input
                      type="number"
                      value={option.total_carat_weight || ''}
                      onChange={(e) => handleMetalOptionChange(index, 'total_carat_weight', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={option.description || ''}
                      onChange={(e) => handleMetalOptionChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`isDefault-${index}`}
                      checked={option.isDefault}
                      onChange={(e) => handleMetalOptionChange(index, 'isDefault', e.target.checked)}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor={`isDefault-${index}`} className="ml-2 text-sm text-gray-700">
                      Default Option
                    </label>
                  </div>
                </div>
                
                {/* Metal Color Images */}
                <div className="mt-4">
                  <MetalOptionImageUpload
                    metalIndex={index}
                    colorKey={option.color}
                    images={(formData.metalColorImages[option.color] || [])}
                    temporaryImages={temporaryMetalColorImages[option.color] || []}
                    onImagesSelect={(metalIndex, files) => handleMetalColorImagesSelect(metalIndex, option.color, files)}
                    onImageRemove={(metalIndex, imageIndex) => handleMetalColorImageRemove(metalIndex, option.color, imageIndex)}
                    maxImages={5}
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addMetalOption}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mb-6"
            >
              + Add Metal Option
            </button>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous: Basic Information
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Next: Stone & Size Options
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Stone & Size Options */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stone & Size Options</h2>
            
            {/* Compatible Stone Shapes */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Compatible Stone Shapes</h3>
              <div className="flex flex-wrap gap-2">
                {RingEnums.STONE_SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => handleStoneShapeChange(shape)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.compatibleStoneShapes.includes(shape)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Side Stone Information */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Side Stone Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.side_stone.type}
                    onChange={(e) => handleSideStoneChange('type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">None</option>
                    {RingEnums.SIDE_STONE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Stones
                  </label>
                  <input
                    type="number"
                    value={formData.side_stone.number_of_stones}
                    onChange={(e) => handleSideStoneChange('number_of_stones', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Carat
                  </label>
                  <input
                    type="number"
                    value={formData.side_stone.total_carat}
                    onChange={(e) => handleSideStoneChange('total_carat', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shape
                  </label>
                  <select
                    value={formData.side_stone.shape}
                    onChange={(e) => handleSideStoneChange('shape', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Shape</option>
                    {RingEnums.STONE_SHAPES.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={formData.side_stone.color}
                    onChange={(e) => handleSideStoneChange('color', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Color</option>
                    {RingEnums.STONE_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clarity
                  </label>
                  <select
                    value={formData.side_stone.clarity}
                    onChange={(e) => handleSideStoneChange('clarity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Clarity</option>
                    {RingEnums.STONE_CLARITIES.map((clarity) => (
                      <option key={clarity} value={clarity}>
                        {clarity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Ring Sizes */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ring Sizes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.sizes.map((sizeOption) => (
                  <div key={sizeOption.size} className="border p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Size {sizeOption.size}</span>
                      <input
                        type="checkbox"
                        checked={sizeOption.isAvailable}
                        onChange={(e) => handleSizeChange(sizeOption.size, 'isAvailable', e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Additional Price
                      </label>
                      <input
                        type="number"
                        value={sizeOption.additionalPrice}
                        onChange={(e) => handleSizeChange(sizeOption.size, 'additionalPrice', parseFloat(e.target.value) || 0)}
                        className="w-full p-1 text-sm border border-gray-300 rounded-md"
                        min="0"
                        step="0.01"
                        disabled={!sizeOption.isAvailable}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous: Metal Options
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Next: Media
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Media */}
        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Media</h2>
            
            <MediaUpload
              onImagesSelect={handleImagesSelect}
              onVideoSelect={handleVideoSelect}
              temporaryImages={temporaryImages}
              temporaryVideo={temporaryVideo}
              maxImages={10}
            />
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous: Stone & Size Options
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isSubmitting ? 'Creating Setting...' : 'Create Setting'}
              </button>
            </div>
            
            {isSubmitting && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Uploading media: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
