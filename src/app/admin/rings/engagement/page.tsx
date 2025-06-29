'use client';

import { useState, useEffect, JSX } from 'react';
import { RingEnums } from '@/constants/ringEnums';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import MetalOptionImageUpload from '@/components/admin/MetalOptionImageUpload';

// Define type for condition function
type ConditionFunction = (formData: FormDataType) => boolean;

interface FormSection {
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[] | { size: number; label: string; }[];
    multiple?: boolean;
    min?: number;
    max?: number;
    step?: number;
    condition?: ConditionFunction;
  }[];
}

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

interface MainStone {
  type: string;
  gemstone_type: string;
  number_of_stones: number;
  carat_weight: number;
  shape: string;
  color: string;
  clarity: string;
  hardness: number;
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
  images: Array<{ url: string; publicId: string; }>;
  video: {
    url: string;
    publicId: string;
  };
}

// Define FormDataType interface to handle nested properties
type FormDataValue = string | number | boolean | string[] | MetalOption[] | Array<{
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}> | MainStone | SideStone | Media | Record<string, Array<{ url: string; publicId: string }>>;

interface FormDataType {
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  metalColorImages: Record<string, Array<{ url: string; publicId: string }>>;
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  main_stone: MainStone;
  side_stone: SideStone;
  media: Media;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  [key: string]: FormDataValue;
}

const formSections: FormSection[] = [
  {
    title: "Basic Information",
    fields: [
      { name: "title", label: "Ring Title", type: "text", required: true },
      { name: "SKU", label: "SKU", type: "text", required: true },
      { name: "basePrice", label: "Base Price", type: "number", required: true, min: 0, step: 0.01 },
      { name: "style", label: "Styles", type: "select", multiple: true, options: RingEnums.STYLES },
      { name: "type", label: "Types", type: "select", multiple: true, options: RingEnums.TYPES }
    ]
  },
  {
    title: "Size Availability",
    fields: [
      {
        name: "sizes",
        label: "Available Sizes",
        type: "sizeMatrix", // Custom type for size management
        required: true,
        options: RingEnums.SIZES.map(s => ({
          size: s.size,
          label: `Size ${s.size.toFixed(2)} (${s.circumference}mm)`
        }))
      }
    ]
  },
  {
    title: "Metal Options",
    fields: [
      {
        name: "metalOptions",
        label: "Metal Options",
        type: "metalOptionsMatrix", // Custom type for metal options management
        required: true
      }
    ]
  },
  {
    title: "Main Stone Details",
    fields: [
      { name: "main_stone.type", label: "Stone Type", type: "select", required: true, options: RingEnums.MAIN_STONE_TYPES },
      {
        name: "main_stone.gemstone_type",
        label: "Gemstone Type",
        type: "select",
        options: RingEnums.GEMSTONE_TYPES,
        condition: (formData) => formData.main_stone?.type === 'Gemstone'
      },
      { name: "main_stone.number_of_stones", label: "Number of Stones", type: "number", min: 0 },
      { name: "main_stone.carat_weight", label: "Carat Weight", type: "number", min: 0, step: 0.01 },
      { name: "main_stone.shape", label: "Stone Shape", type: "select", options: RingEnums.STONE_SHAPES },
      { name: "main_stone.color", label: "Stone Color", type: "select", options: RingEnums.STONE_COLORS },
      { name: "main_stone.clarity", label: "Stone Clarity", type: "select", options: RingEnums.STONE_CLARITIES }
    ]
  },
  {
    title: "Side Stone Details",
    fields: [
      { name: "side_stone.type", label: "Stone Type", type: "select", options: RingEnums.SIDE_STONE_TYPES },
      { name: "side_stone.number_of_stones", label: "Number of Stones", type: "number", min: 0 },
      { name: "side_stone.total_carat", label: "Total Carat", type: "number", min: 0, step: 0.01 },
      { name: "side_stone.shape", label: "Stone Shape", type: "select", options: RingEnums.STONE_SHAPES },
      { name: "side_stone.color", label: "Stone Color", type: "select", options: RingEnums.STONE_COLORS },
      { name: "side_stone.clarity", label: "Stone Clarity", type: "select", options: RingEnums.STONE_CLARITIES }
    ]
  },
  {
    title: "Additional Information",
    fields: [
      { name: "description", label: "Product Description", type: "textarea", required: true },
      { name: "media.video", label: "Video URL", type: "text" }
    ]
  }
];

function SizeMatrix({ sizes, onChange }: {
  sizes: Array<{ size: number; isAvailable: boolean; additionalPrice: number }>;
  onChange: (sizes: Array<{ size: number; isAvailable: boolean; additionalPrice: number }>) => void;
}) {
  const [defaultAdditionalPrice, setDefaultAdditionalPrice] = useState(0);

  // Function to handle "Select All" with default price
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Create array with all sizes and default price
      const allSizes = RingEnums.SIZES.map(({ size }) => ({
        size,
        isAvailable: true,
        additionalPrice: defaultAdditionalPrice
      }));
      onChange(allSizes);
    } else {
      // Clear all selections
      onChange([]);
    }
  };

  // Function to update default price and apply to all selected sizes
  const handleDefaultPriceChange = (newPrice: number) => {
    setDefaultAdditionalPrice(newPrice);
    // Update all selected sizes with new default price
    const updatedSizes = sizes.map(size => ({
      ...size,
      additionalPrice: newPrice
    }));
    onChange(updatedSizes);
  };

  const areAllSelected = sizes.length === RingEnums.SIZES.length;

  return (
    <div className="space-y-4">
      {/* Default Price and Select All Controls */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Default Additional Price ($):</label>
          <input
            type="number"
            value={defaultAdditionalPrice}
            onChange={(e) => handleDefaultPriceChange(parseFloat(e.target.value) || 0)}
            min={0}
            step={0.01}
            className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 
                     focus:border-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={areAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-gray-700">Select All Sizes</label>
        </div>
      </div>

      {/* Size Matrix Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Additional Price ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {RingEnums.SIZES.map(({ size, circumference }) => {
              const sizeData = sizes.find(s => s.size === size) || { size, isAvailable: false, additionalPrice: defaultAdditionalPrice };

              return (
                <tr key={size} className={sizeData.isAvailable ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">
                    {size.toFixed(2)} ({circumference}mm)
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={sizeData.isAvailable}
                      onChange={(e) => {
                        const newSizes = sizes.filter(s => s.size !== size);
                        if (e.target.checked) {
                          newSizes.push({ size, isAvailable: true, additionalPrice: defaultAdditionalPrice });
                        }
                        onChange(newSizes);
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={sizeData.additionalPrice || ''}
                      onChange={(e) => {
                        const newSizes = [...sizes.filter(s => s.size !== size)];
                        if (sizeData.isAvailable) {
                          newSizes.push({
                            size,
                            isAvailable: true,
                            additionalPrice: parseFloat(e.target.value) || 0
                          });
                        }
                        onChange(newSizes);
                      }}
                      disabled={!sizeData.isAvailable}
                      min={0}
                      step={0.01}
                      className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 
                               focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetalOptionsMatrix({ 
  metalOptions, 
  onChange, 
  basePrice,
  metalColorImages = {},
  onMetalColorImagesChange
}: {
  metalOptions: MetalOption[];
  onChange: (metalOptions: MetalOption[]) => void;
  basePrice: number;
  metalColorImages?: Record<string, Array<{ url: string; publicId: string }>>;
  onMetalColorImagesChange?: (images: Record<string, File[]> | Record<string, Array<{ url: string; publicId: string }>>) => void;
}) {
  const [newMetalOption, setNewMetalOption] = useState<MetalOption>({
    karat: '',
    color: '',
    price: basePrice,
    description: '',
    finish_type: '',
    width_mm: 0,
    total_carat_weight: 0,
    isDefault: false
  });
  
  // State for temporary color images
  const [temporaryColorImages, setTemporaryColorImages] = useState<Record<string, File[]>>({});

  // Update new metal option price when base price changes
  useEffect(() => {
    setNewMetalOption(prev => ({
      ...prev,
      price: basePrice
    }));
  }, [basePrice]);

  // Get unique colors from metal options
  const uniqueColors = Array.from(new Set(metalOptions.map(option => option.color)))
    .filter(color => color); // Filter out empty strings

  const addMetalOption = () => {
    // Validate required fields
    if (!newMetalOption.karat || !newMetalOption.color) {
      toast.error('Karat and Color are required for metal options');
      return;
    }

    // Check if this combination already exists
    const exists = metalOptions.some(
      option => option.karat === newMetalOption.karat && option.color === newMetalOption.color
    );

    if (exists) {
      toast.error('This metal option already exists');
      return;
    }

    // If this is the first option, make it default
    const isFirst = metalOptions.length === 0;
    const newOption = {
      ...newMetalOption,
      isDefault: isFirst ? true : newMetalOption.isDefault
    };

    // Add the new option
    const updatedOptions = [...metalOptions, newOption];
    onChange(updatedOptions);

    // Reset the form for the next entry
    setNewMetalOption({
      karat: '',
      color: '',
      price: basePrice,
      description: '',
      finish_type: '',
      width_mm: 0,
      total_carat_weight: 0,
      isDefault: false
    });
  };

  const removeMetalOption = (index: number) => {
    const wasDefault = metalOptions[index].isDefault;
    const updatedOptions = metalOptions.filter((_, i) => i !== index);

    // If we removed the default option and there are other options, make the first one default
    if (wasDefault && updatedOptions.length > 0) {
      updatedOptions[0].isDefault = true;
    }

    onChange(updatedOptions);
  };

  const setAsDefault = (index: number) => {
    const updatedOptions = metalOptions.map((option, i) => ({
      ...option,
      isDefault: i === index
    }));

    onChange(updatedOptions);
  };

  const updateMetalOption = (index: number, field: keyof MetalOption, value: string | number | boolean) => {
    const updatedOptions = metalOptions.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });

    onChange(updatedOptions);
  };

  // Handle metal color image selection
  const handleMetalColorImageSelect = (color: string, files: File[]) => {
    const newTemporaryImages = {
      ...temporaryColorImages,
      [color]: files
    };
    
    setTemporaryColorImages(newTemporaryImages);
    
    if (onMetalColorImagesChange) {
      onMetalColorImagesChange(newTemporaryImages);
    }
  };

  // Handle removing saved color images
  const handleRemoveSavedColorImage = (color: string, imageIndex: number) => {
    if (onMetalColorImagesChange && metalColorImages[color]) {
      const updatedImages = { ...metalColorImages };
      updatedImages[color] = updatedImages[color].filter((_, idx) => idx !== imageIndex);
      onMetalColorImagesChange(updatedImages);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Metal Options */}
      {metalOptions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Default</th>
                <th className="px-4 py-2">Karat</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Price ($)</th>
                <th className="px-4 py-2">Finish Type</th>
                <th className="px-4 py-2">Width (mm)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metalOptions.map((option, index) => (
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
                      min={0}
                      step={0.01}
                      className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={option.finish_type}
                      onChange={(e) => updateMetalOption(index, 'finish_type', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select Finish</option>
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
                      min={0}
                      step={0.1}
                      className="w-24 p-1 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeMetalOption(index)}
                      className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                      disabled={metalOptions.length === 1} // Prevent removing the last option
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Metal Color Images Section */}
          {uniqueColors.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Metal Color Images</h3>
              <p className="text-sm text-gray-600">
                Upload images for each metal color. These will be shared across all karat options of the same color.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueColors.map(color => (
                  <div key={`color-${color}`} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">{color}</h4>
                    <MetalOptionImageUpload
                      metalIndex={0} // Not used for color-based uploads
                      colorKey={color}
                      images={metalColorImages[color] || []}
                      temporaryImages={temporaryColorImages[color] || []}
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
      )}

      {/* Add New Metal Option */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Add New Metal Option</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Karat *</label>
            <select
              value={newMetalOption.karat}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, karat: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Karat</option>
              {RingEnums.METAL_KARATS.map(karat => (
                <option key={karat} value={karat}>{karat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Color *</label>
            <select
              value={newMetalOption.color}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, color: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Color</option>
              {RingEnums.METAL_COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price ($) *</label>
            <input
              type="number"
              value={newMetalOption.price}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, price: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.01}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Finish Type</label>
            <select
              value={newMetalOption.finish_type}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, finish_type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Finish</option>
              {RingEnums.FINISH_TYPES.map(finish => (
                <option key={finish} value={finish}>{finish}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Width (mm)</label>
            <input
              type="number"
              value={newMetalOption.width_mm}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, width_mm: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.1}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Total Carat Weight</label>
            <input
              type="number"
              value={newMetalOption.total_carat_weight}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, total_carat_weight: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.01}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <input
              type="text"
              value={newMetalOption.description}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newMetalOption.isDefault}
              onChange={(e) => setNewMetalOption({ ...newMetalOption, isDefault: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
              disabled={metalOptions.length === 0} // First option is always default
            />
            <label className="text-sm font-medium text-gray-700">Set as default option</label>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addMetalOption}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Metal Option
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddEngagementRing() {
  const router = useRouter();

  // Initialize form state
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    category: 'Engagement',
    style: [],
    type: [],
    SKU: '',
    basePrice: 0,
    metalOptions: [],
    metalColorImages: {},
    sizes: [],
    main_stone: {
      type: '',
      gemstone_type: '',
      number_of_stones: 0,
      carat_weight: 0,
      shape: '',
      color: '',
      clarity: '',
      hardness: 0
    },
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
    isFeatured: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);
  const [temporaryColorImages, setTemporaryColorImages] = useState<Record<string, File[]>>({});

  const uploadImage = async (file: File, category: string) => {
    try {
      const base64 = await convertToBase64(file);
      let response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ file: base64, category })
      });
      
      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        console.log('Token expired, refreshing...');
        
        // Manually refresh token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          console.log('Token refreshed, retrying upload');
          
          // Retry with fresh token
          response = await fetch('/api/upload/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ file: base64, category })
          });
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return response.json();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    setIsSubmitting(true);

    try {
      // First validate all required fields
      if (!formData.title || !formData.SKU || formData.sizes.length === 0) {
        console.log("Validation failed:", { title: formData.title, SKU: formData.SKU, sizes: formData.sizes.length });
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate metal options
      if (formData.metalOptions.length === 0) {
        console.log("No metal options provided");
        toast.error('At least one metal option is required');
        setIsSubmitting(false);
        return;
      }

      console.log("Validation passed, proceeding with submission");

      // Upload main product images if any
      let uploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading product images...', { id: 'uploadProgress' });

        uploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            return await uploadImage(file, 'engagement');
          })
        );

        toast.success('Product images uploaded successfully', { id: 'uploadProgress' });
      }

      // Upload video if exists
      let videoData = { url: '', publicId: '' };
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
        videoData = { url: result.url, publicId: result.publicId };
        toast.success('Video uploaded successfully', { id: 'videoProgress' });
      }

      // Upload metal color images
      const uploadedColorImages: Record<string, Array<{ url: string; publicId: string }>> = { ...formData.metalColorImages };
      
      if (Object.keys(temporaryColorImages).length > 0) {
        toast.loading('Uploading metal color images...', { id: 'metalImagesProgress' });
        
        for (const [color, files] of Object.entries(temporaryColorImages)) {
          if (files.length > 0) {
            const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
            const uploadedMetalImages = await Promise.all(
              files.map(async (file) => {
                return await uploadImage(file, `engagement/metal-colors/${colorSlug}`);
              })
            );
            
            // Combine existing saved images with newly uploaded ones
            const existingImages = uploadedColorImages[color] || [];
            uploadedColorImages[color] = [...existingImages, ...uploadedMetalImages];
          }
        }
        
        toast.success('Metal color images uploaded successfully', { id: 'metalImagesProgress' });
      }

      // Prepare final data
      const finalData = {
        ...formData,
        metalColorImages: uploadedColorImages,
        media: {
          images: uploadedImages,
          video: videoData
        }
      };

      // After uploading metal color images
      console.log("Uploaded color images:", uploadedColorImages);

      // Before API call
      console.log("Final data metalColorImages:", finalData.metalColorImages);

      // Save ring data
      toast.loading('Saving ring details...', { id: 'saveProgress' });
      const response = await fetch('/api/admin/rings/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("API error response:", error);
        throw new Error(error.error || 'Failed to create ring');
      }

      const responseData = await response.json();
      console.log("API success response:", responseData);

      toast.success('Ring created successfully', { id: 'saveProgress' });
      router.push('/admin/rings/engagement/list');

    } catch (error) {
      console.error("Submission error:", error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);

      // Handle authentication errors
      if (message.includes('Authentication') || message.includes('Admin')) {
        router.push('/login');
      }
    } finally {
      setIsSubmitting(false);
      console.log("Form submission completed");
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

  // Handle metal color images change


  const handleMetalColorImagesChange = (images: Record<string, File[]> | Record<string, Array<{ url: string; publicId: string }>>) => {
    if (Object.values(images).some(arr => arr.length > 0 && 'name' in arr[0])) {
      // It's a File[] record
      setTemporaryColorImages(images as Record<string, File[]>);
    } else {
      // It's already processed images
      setFormData(prev => ({
        ...prev,
        metalColorImages: images as Record<string, Array<{ url: string; publicId: string }>>
      }));
    }
  };

  // Type definitions for event handlers
  interface NestedObject {
    [key: string]: FormDataValue | NestedObject;
  }

  // Update the handleFieldChange function
  const handleFieldChange = (name: string, value: unknown) => {
    const fields = name.split('.');

    if (fields.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: value as FormDataValue
      }));
    } else {
      setFormData(prev => {
        const result = { ...prev } as NestedObject;
        let current = result;

        // Traverse the object until the second-to-last field
        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i]] as NestedObject;
        }

        // Set the value on the last field
        current[fields[fields.length - 1]] = value as FormDataValue;
        return result as FormDataType;
      });
    }
  };

  // Update the getFieldValue function
  const getFieldValue = (field: string): FormDataValue | undefined => {
    const fields = field.split('.');
    if (fields.length === 1) {
      return formData[field as keyof FormDataType];
    }

    let current: NestedObject = formData as unknown as NestedObject;
    for (const key of fields) {
      if (current === undefined || current === null) return undefined;
      current = current[key] as NestedObject;
    }

    return current as unknown as FormDataValue;
  };

  // Type the field parameter
  interface FieldConfig {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: Array<string | { size: number; label: string }>;
    multiple?: boolean;
    min?: number;
    max?: number;
    step?: number;
    condition?: ConditionFunction;
  }

  interface SelectOption {
    size?: number;
    label: string;
    value?: string;
  }

  // Update the select rendering logic with better type handling
  const renderSelect = (field: FieldConfig, value: FormDataValue | undefined): JSX.Element => {
    const stringValue = field.multiple
      ? (Array.isArray(value) ? value.map(v => v?.toString() || '') : [])
      : (value?.toString() || '');

    return (
      <div className="relative">
        <select
          value={stringValue}
          onChange={(e) => handleFieldChange(
            field.name,
            field.multiple
              ? Array.from(e.target.selectedOptions, option => option.value)
              : e.target.value
          )}
          multiple={field.multiple}
          required={field.required}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
            focus:border-transparent transition-all duration-300 hover:border-purple-300
            disabled:bg-gray-50 disabled:text-gray-500
            ${field.multiple ? 'min-h-[120px] custom-multiselect' : 'appearance-none bg-white'}`}
          size={field.multiple ? Math.min(7, field.options?.length || 4) : 1}
        >
          {!field.multiple && <option value="">Select {field.label}</option>}
          {field.options?.map((option: SelectOption | string) => (
            typeof option === 'string' ? (
              <option
                key={option}
                value={option}
                className="py-2 px-3 hover:bg-purple-50"
              >
                {option}
              </option>
            ) : (
              <option
                key={option.size || option.label}
                value={option.size?.toString() || option.value || ''}
                className="py-2 px-3 hover:bg-purple-50"
              >
                {option.label}
              </option>
            )
          ))}
        </select>
      </div>
    );
  };

  // Update renderField function with proper type handling
  const renderField = (field: FieldConfig) => {
    if (field.condition && !field.condition(formData)) {
      return null;
    }

    const value = getFieldValue(field.name);

    if (field.type === 'sizeMatrix') {
      return (
        <SizeMatrix
          sizes={(Array.isArray(value) ? value : []) as Array<{ size: number; isAvailable: boolean; additionalPrice: number }>}
          onChange={(newValue) => handleFieldChange(field.name, newValue)}
        />
      );
    }

    if (field.type === 'metalOptionsMatrix') {
      return (
        <MetalOptionsMatrix
          metalOptions={formData.metalOptions}
          onChange={(newValue) => handleFieldChange('metalOptions', newValue)}
          basePrice={formData.basePrice}
          metalColorImages={formData.metalColorImages}
          onMetalColorImagesChange={handleMetalColorImagesChange}
        />
      );
    }

    if (field.type === 'select') {
      return renderSelect(field, value);
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value?.toString() || ''}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          required={field.required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
          focus:border-transparent transition-all duration-300 hover:border-purple-300 min-h-[120px]"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      );
    }

    return (
      <input
        type={field.type}
        value={value?.toString() || ''}
        onChange={(e) => handleFieldChange(
          field.name,
          field.type === 'number' ? parseFloat(e.target.value) : e.target.value
        )}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
        focus:border-transparent transition-all duration-300 hover:border-purple-300"
        placeholder={`Enter ${field.label.toLowerCase()}...`}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Add New Engagement Ring</h1>
        <p className="mt-2 text-purple-100">Create a stunning new addition to your engagement collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {formSections.map((section) => (
          <section
            key={section.title}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              {section.title}
            </h2>
            <div className={`grid grid-cols-1 ${section.title === "Metal Options" ? "" : "md:grid-cols-2"} gap-6`}>
              {section.fields.map((field) => (
                <div key={field.name} className={`group ${field.type === 'sizeMatrix' || field.type === 'metalOptionsMatrix' ? 'col-span-full' : ''}`}>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Product Images
          </h2>
          <ImageUpload
            onImagesSelect={setTemporaryImages}
            onVideoSelect={setTemporaryVideo}
            temporaryImages={temporaryImages}
            temporaryVideo={temporaryVideo}
            maxImages={10}
          />
        </section>

        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-6 rounded-lg shadow-lg sticky bottom-0">
          <button
            type="button"
            onClick={() => handleFieldChange('isActive', !formData.isActive)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
              ${formData.isActive
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
          >
            <span className="mr-2">
              {formData.isActive ? '✓' : '×'}
            </span>
            {formData.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange('isFeatured', !formData.isFeatured)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
              ${formData.isFeatured
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
          >
            <span className="mr-2">
              {formData.isFeatured ? '★' : '☆'}
            </span>
            {formData.isFeatured ? 'Featured' : 'Not Featured'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 
            disabled:bg-purple-300 transition-all duration-300 flex items-center justify-center min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <span className="mr-2">💍</span>
                Save Ring
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

