'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  MensJewelryType, 
  MensJewelryMetal, 
  MensJewelryStyle, 
  MensJewelryFinish, 
  CertificateLab 
} from '@/models/MensJewelry';

// Define form data type
interface FormDataType {
  sku: string;
  productNumber: string;
  name: string;
  type: string;
  metal: string;
  style: string;
  finish: string;
  size?: string;
  length?: number;
  width?: number;
  thickness?: number;
  weight?: number;
  engraving: {
    available: boolean;
    maxCharacters?: number;
    fonts?: string[];
  };
  gemstones: Array<{
    type: string;
    carat?: number;
    color?: string;
    clarity?: string;
  }>;
  certificateLab?: string;
  certificateNumber?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  isAvailable: boolean;
  description?: string;
  features: string[];
  images?: Array<{ url: string; publicId: string }>;
  [key: string]: any;
}

// Define form sections
interface FormSection {
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    dependsOn?: string;
    dependsOnValue?: any;
  }[];
}

const formSections: FormSection[] = [
  {
    title: "Basic Information",
    fields: [
      { name: "sku", label: "SKU", type: "text", required: true },
      { name: "productNumber", label: "Product Number", type: "text", required: true },
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "type", label: "Type", type: "select", required: true, options: Object.values(MensJewelryType) },
      { name: "metal", label: "Metal", type: "select", required: true, options: Object.values(MensJewelryMetal) },
      { name: "style", label: "Style", type: "select", required: true, options: Object.values(MensJewelryStyle) },
      { name: "finish", label: "Finish", type: "select", required: true, options: Object.values(MensJewelryFinish) },
      { name: "price", label: "Price ($)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0, step: 0.01 },
    ]
  },
  {
    title: "Dimensions & Specifications",
    fields: [
      { name: "size", label: "Size", type: "text", dependsOn: "type", dependsOnValue: MensJewelryType.RING },
      { name: "length", label: "Length (inches)", type: "number", min: 0.1, step: 0.1, dependsOn: "type", dependsOnValue: MensJewelryType.NECKLACE },
      { name: "width", label: "Width (mm)", type: "number", min: 0.1, step: 0.1 },
      { name: "thickness", label: "Thickness (mm)", type: "number", min: 0.1, step: 0.1 },
      { name: "weight", label: "Weight (grams)", type: "number", min: 0.1, step: 0.1 },
    ]
  },
  {
    title: "Engraving Options",
    fields: [
      { name: "engravingAvailable", label: "Engraving Available", type: "checkbox" },
      { name: "engravingMaxCharacters", label: "Max Characters", type: "number", min: 1, max: 100, dependsOn: "engravingAvailable", dependsOnValue: true },
      { name: "engravingFonts", label: "Available Fonts", type: "textarea", placeholder: "e.g., Arial, Times New Roman, Script", dependsOn: "engravingAvailable", dependsOnValue: true },
    ]
  },
  {
    title: "Certification",
    fields: [
      { name: "certificateLab", label: "Certificate Lab", type: "select", options: Object.values(CertificateLab) },
      { name: "certificateNumber", label: "Certificate Number", type: "text" },
    ]
  },
  {
    title: "Description & Features",
    fields: [
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "Features (comma-separated)", type: "textarea", placeholder: "e.g., Hypoallergenic, Waterproof, Scratch-resistant" },
    ]
  }
];

export default function AddMensJewelry() {
  const router = useRouter();
  const { user } = useUser();
  
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    sku: '',
    productNumber: '',
    name: '',
    type: Object.values(MensJewelryType)[0],
    metal: Object.values(MensJewelryMetal)[0],
    style: Object.values(MensJewelryStyle)[0],
    finish: Object.values(MensJewelryFinish)[0],
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
    gemstones: [],
    certificateLab: CertificateLab.NONE,
    certificateNumber: '',
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    isAvailable: true,
    description: '',
    features: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [gemstoneFields, setGemstoneFields] = useState<Array<{ type: string; carat?: number; color?: string; clarity?: string }>>([]);

  // Handle field change
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle engraving fields
      if (name === 'engravingAvailable') {
        newData.engraving = {
          ...prev.engraving,
          available: value
        };
      } else if (name === 'engravingMaxCharacters') {
        newData.engraving = {
          ...prev.engraving,
          maxCharacters: value
        };
      } else if (name === 'engravingFonts') {
        newData.engraving = {
          ...prev.engraving,
          fonts: value ? value.split(',').map((f: string) => f.trim()) : []
        };
      } else {
        newData[name] = value;
      }
      
      return newData;
    });

    // Auto-calculate discount percentage when price and sale price are set
    if ((name === 'price' || name === 'salePrice') && formData.price > 0 && formData.salePrice && formData.salePrice > 0) {
      const discountPercentage = Math.round(((formData.price - formData.salePrice) / formData.price) * 100);
      setFormData(prev => ({
        ...prev,
        discountPercentage
      }));
    }
  };

  // Add gemstone field
  const addGemstone = () => {
    setGemstoneFields(prev => [...prev, { type: '', carat: 0, color: '', clarity: '' }]);
  };

  // Remove gemstone field
  const removeGemstone = (index: number) => {
    setGemstoneFields(prev => prev.filter((_, i) => i !== index));
  };

  // Update gemstone
  const updateGemstone = (index: number, field: string, value: any) => {
    setGemstoneFields(prev => prev.map((gemstone, i) => 
      i === index ? { ...gemstone, [field]: value } : gemstone
    ));
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check authentication
    if (!user || user.role !== 'admin') {
      toast.error('You must be logged in as an admin to create men\'s jewelry');
      router.push('/login');
      return;
    }

    try {
      // Upload images
      let uploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading images...', { id: 'uploadProgress' });
        
        uploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                file: base64,
                category: `mens-jewelry/${formData.metal}`
              })
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to upload image');
            }
            
            return response.json();
          })
        );

        toast.success('Images uploaded successfully', { id: 'uploadProgress' });
      }

      // Prepare final data
      const finalData = {
        ...formData,
        images: uploadedImages,
        gemstones: gemstoneFields.filter(g => g.type),
        features: Array.isArray(formData.features) ? formData.features :
        formData.features && typeof formData.features === 'string' ?
        (formData.features as string).split(',').map(f => f.trim()).filter(f => f) : []
      };

      // Save data
      toast.loading('Saving product details...', { id: 'saveProgress' });
      const response = await fetch('/api/admin/mens-jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create men\'s jewelry');
      }

      toast.success('Men\'s jewelry created successfully', { id: 'saveProgress' });
      router.push('/admin/mens-jewelry/list');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
      
      // Handle authentication errors
      if (message.includes('Authentication') || message.includes('Admin')) {
        router.push('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check authentication
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

  // Check if field should be shown based on dependencies
  const shouldShowField = (field: FormSection['fields'][0]) => {
    if (!field.dependsOn) return true;
    
    if (field.dependsOn === 'type') {
      return formData.type === field.dependsOnValue;
    } else if (field.dependsOn === 'engravingAvailable') {
      return formData.engraving.available === field.dependsOnValue;
    }
    
    return formData[field.dependsOn] === field.dependsOnValue;
  };

  // Render field
  const renderField = (field: FormSection['fields'][0]) => {
    let value = formData[field.name];
    
    // Handle engraving fields
    if (field.name === 'engravingAvailable') {
      value = formData.engraving.available;
    } else if (field.name === 'engravingMaxCharacters') {
      value = formData.engraving.maxCharacters;
    } else if (field.name === 'engravingFonts') {
      value = formData.engraving.fonts?.join(', ') || '';
    }

    if (field.type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">{field.label}</span>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="relative">
          <select
            value={value?.toString() || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
              focus:border-transparent transition-all duration-300 hover:border-purple-300
              appearance-none bg-white"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option 
                key={option} 
                value={option}
                className="py-2 px-3 hover:bg-purple-50"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value?.toString() || ''}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
          focus:border-transparent transition-all duration-300 hover:border-purple-300 min-h-[120px]"
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
        placeholder={field.placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 
        focus:border-transparent transition-all duration-300 hover:border-purple-300"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Add New Men's Jewelry</h1>
        <p className="mt-2 opacity-80">Create a new men's jewelry item in the inventory system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <p className="text-gray-600 mb-4">Upload high-quality images from different angles</p>
          
          <ImageUpload
            onImagesSelect={setTemporaryImages}
            onVideoSelect={() => {}}
            temporaryImages={temporaryImages}
            temporaryVideo={null}
            maxImages={8}
            previewUrls={[]}
          />
        </div>

        {/* Form Sections */}
        {formSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.filter(shouldShowField).map((field, fieldIndex) => (
                <div key={fieldIndex} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''} ${field.type === 'checkbox' ? 'md:col-span-2' : ''}`}>
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Gemstones Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gemstones</h2>
            <button
              type="button"
              onClick={addGemstone}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Gemstone
            </button>
          </div>
          
          {gemstoneFields.map((gemstone, index) => (
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={gemstone.color || ''}
                    onChange={(e) => updateGemstone(index, 'color', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Colorless, Yellow, Blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
                  <input
                    type="text"
                    value={gemstone.clarity || ''}
                    onChange={(e) => updateGemstone(index, 'clarity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., FL, VVS1, VS1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Availability Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Availability</h2>
          
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.isAvailable}
                onChange={(e) => handleFieldChange('isAvailable', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {formData.isAvailable ? 'Available for purchase' : 'Not available'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg 
              shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 
              focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating Product...' : 'Create Men\'s Jewelry'}
          </button>
        </div>
      </form>
    </div>
  );
}
