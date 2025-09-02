'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  BraceletType,
  BraceletClosure,
  BraceletMetal,
  BraceletStyle,
} from '@/models/Bracelet';
import { CertificateLab } from '@/constants/sharedEnums';

// Define form data type
interface FormDataType {
  sku: string;
  productNumber: string;
  name: string;
  type: string;
  closure: string;
  metal: string;
  style: string;
  length: number;
  width: number;
  adjustable: boolean;
  minLength: number;
  maxLength: number;
  certificateLab: string;
  certificateNumber: string;
  price: number;
  salePrice: number;
  discountPercentage: number;
  isAvailable: boolean;
  description: string;
  features: string[];
  images?: Array<{ url: string; publicId: string }>;
  totalPieces?: number;
  video?: { url: string; publicId: string };
  [key: string]: string | number | boolean | Array<string> | Array<{ url: string; publicId: string }> | { url: string; publicId: string } | undefined;
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
      { name: "name", label: "Bracelet Name", type: "text", required: true },
      { name: "type", label: "Bracelet Type", type: "select", required: true, options: Object.values(BraceletType) },
      { name: "closure", label: "Closure Type", type: "select", required: true, options: Object.values(BraceletClosure) },
      { name: "metal", label: "Metal", type: "select", required: true, options: Object.values(BraceletMetal) },
      { name: "style", label: "Style", type: "select", required: true, options: Object.values(BraceletStyle) },
      { name: "price", label: "Price ($)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0, step: 0.01 },
    ]
  },
  {
    title: "Bracelet Details",
    fields: [
      { name: "length", label: "Length (inches)", type: "number", required: true, min: 0.1, step: 0.1 },
      { name: "width", label: "Width (mm)", type: "number", min: 0.1, step: 0.1 },
      { name: "adjustable", label: "Adjustable", type: "checkbox" },
      { name: "minLength", label: "Minimum Length (inches)", type: "number", min: 0.1, step: 0.1, dependsOn: "adjustable", dependsOnValue: true },
      { name: "maxLength", label: "Maximum Length (inches)", type: "number", min: 0.1, step: 0.1, dependsOn: "adjustable", dependsOnValue: true },
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
      { name: "features", label: "Features (comma-separated)", type: "textarea", placeholder: "e.g., Hypoallergenic, Adjustable, Water-resistant" },
      { name: "totalPieces", label: "Total Pieces", type: "number", min: 0 }
    ]
  }
];

export default function AddBracelet() {
  const router = useRouter();
  const { user } = useUser();
  
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    sku: '',
    productNumber: '',
    name: '',
    type: Object.values(BraceletType)[0],
    closure: Object.values(BraceletClosure)[0],
    metal: Object.values(BraceletMetal)[0],
    style: Object.values(BraceletStyle)[0],
    length: 0,
    width: 0,
    adjustable: false,
    minLength: 0,
    maxLength: 0,
    certificateLab: CertificateLab.NONE,
    certificateNumber: '',
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    isAvailable: true,
    description: '',
    features: [],
    totalPieces: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);

  // Handle field change
  const handleFieldChange = (name: keyof FormDataType, value: FormDataType[keyof FormDataType]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate discount percentage when price and sale price are set
    if ((name === 'price' || name === 'salePrice') && formData.price > 0 && formData.salePrice > 0) {
      const discountPercentage = Math.round(((formData.price - formData.salePrice) / formData.price) * 100);
      setFormData(prev => ({
        ...prev,
        discountPercentage
      }));
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check authentication
    if (!user || user.role !== 'admin') {
      toast.error('You must be logged in as an admin to create bracelets');
      router.push('/login');
      return;
    }

    try {
      // Upload images
      let uploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading bracelet images...', { id: 'uploadProgress' });
        
        uploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                file: base64,
                category: `bracelets/${formData.metal}`
              })
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to upload image');
            }
            
            return response.json();
          })
        );

        toast.success('Bracelet images uploaded successfully', { id: 'uploadProgress' });
      }

      // Upload video
      let uploadedVideo: { url: string; publicId: string } | undefined;
      if (temporaryVideo) {
        toast.loading('Uploading bracelet video...', { id: 'uploadVideoProgress' });
        
        const base64 = await convertToBase64(temporaryVideo);
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            file: base64,
            category: `bracelets/${formData.metal}`
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload video');
        }

        uploadedVideo = await response.json();
        toast.success('Bracelet video uploaded successfully', { id: 'uploadVideoProgress' });
      }

      // Prepare final data
      const finalData = {
        ...formData,
        images: uploadedImages,
        video: uploadedVideo,
        features: Array.isArray(formData.features) ? formData.features :
                 formData.features && typeof formData.features === 'string' ?
                 (formData.features as string).split(',').map(f => f.trim()).filter(f => f) : []
      };

      // Save bracelet data
      toast.loading('Saving bracelet details...', { id: 'saveProgress' });
      const response = await fetch('/api/admin/bracelets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create bracelet');
      }

      toast.success('Bracelet created successfully', { id: 'saveProgress' });
      router.push('/admin/bracelets/list');

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
    return formData[field.dependsOn] === field.dependsOnValue;
  };

  // Render field
  const renderField = (field: FormSection['fields'][0]) => {
    const value = formData[field.name];

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
          onChange={(e) => handleFieldChange(field.name, 
            field.name === 'features' ? e.target.value : e.target.value
          )}
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
        <h1 className="text-3xl font-bold">Add New Bracelet</h1>
        <p className="mt-2 opacity-80">Create a new bracelet in the inventory system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bracelet Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Bracelet Images</h2>
          <p className="text-gray-600 mb-4">Upload high-quality images of the bracelet from different angles</p>
          
          <ImageUpload
            onImagesSelect={setTemporaryImages}
            onVideoSelect={setTemporaryVideo}
            temporaryImages={temporaryImages}
            temporaryVideo={temporaryVideo}
            maxImages={5}
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
            {isSubmitting ? 'Creating Bracelet...' : 'Create Bracelet'}
          </button>
        </div>
      </form>
    </div>
  );
}
