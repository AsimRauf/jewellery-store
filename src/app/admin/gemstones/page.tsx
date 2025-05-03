'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import ImageUpload from '@/components/admin/ImageUpload';
// Import from types instead of models to avoid server-side code in client component
import { 
  GemstoneType, 
  GemstoneSource, 
  GemstoneShape, 
  GemstoneColor, 
  GemstoneClarity, 
  GemstoneCut, 
  GemstoneOrigin, 
  GemstoneTreatment, 
  CertificateLab,

} from '@/types/gemstone';

// Define form data type
interface FormDataType {
  sku: string;
  productNumber: string;
  type: string;
  source: string;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  cut: string;
  origin: string;
  treatment: string;
  measurements: string;
  certificateLab: string;
  certificateNumber: string;
  refractive_index: number;
  hardness: number;
  price: number;
  salePrice: number;
  discountPercentage: number;
  isAvailable: boolean;
  description: string;
  images?: Array<{ url: string; publicId: string }>;
  [key: string]: string | number | boolean | Array<{ url: string; publicId: string }> | undefined;
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
    condition?: (formData: FormDataType) => boolean;
  }[];
}

const formSections: FormSection[] = [
  {
    title: "Basic Information",
    fields: [
      { name: "sku", label: "SKU", type: "text", required: true },
      { name: "productNumber", label: "Product Number", type: "text", required: true },
      { name: "type", label: "Gemstone Type", type: "select", required: true, options: Object.values(GemstoneType) },
      { name: "source", label: "Gemstone Source", type: "select", required: true, options: Object.values(GemstoneSource) },
      { name: "carat", label: "Carat Weight", type: "number", required: true, min: 0.01, step: 0.01 },
      { name: "price", label: "Price ($)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0, step: 0.01 },
    ]
  },
  {
    title: "Gemstone Characteristics",
    fields: [
      { name: "shape", label: "Shape", type: "select", required: true, options: Object.values(GemstoneShape) },
      { name: "color", label: "Color", type: "select", required: true, options: Object.values(GemstoneColor) },
      { name: "clarity", label: "Clarity", type: "select", required: true, options: Object.values(GemstoneClarity) },
      { name: "measurements", label: "Measurements (mm)", type: "text", required: true },
      { name: "hardness", label: "Hardness (Mohs scale)", type: "number", required: true, min: 1, max: 10, step: 0.1 },
      { name: "refractive_index", label: "Refractive Index", type: "number", min: 1, max: 3, step: 0.001 },
    ]
  },
  {
    title: "Quality & Origin",
    fields: [
      { name: "cut", label: "Cut Grade", type: "select", options: Object.values(GemstoneCut) },
      { name: "origin", label: "Origin", type: "select", options: Object.values(GemstoneOrigin) },
      { name: "treatment", label: "Treatment", type: "select", options: Object.values(GemstoneTreatment) },
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
    title: "Description",
    fields: [
      { name: "description", label: "Description", type: "textarea" },
    ]
  }
];

export default function AddGemstone() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    sku: '',
    productNumber: '',
    type: Object.values(GemstoneType)[0],
    source: GemstoneSource.NATURAL,
    carat: 0,
    shape: '',
    color: '',
    clarity: '',
    cut: '',
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
    isAvailable: true,
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  
  // Check authentication and admin status
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error('Admin access required');
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!user || user.role !== 'admin') {
    return null;
  }

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

    try {
      // Upload images
      let uploadedImages: Array<{ url: string; publicId: string }> = [];
      if (temporaryImages.length > 0) {
        toast.loading('Uploading gemstone images...', { id: 'uploadProgress' });
        
        uploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                file: base64,
                category: `gemstones/${formData.source}`
              })
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to upload image');
            }
            
            return response.json();
          })
        );

        toast.success('Gemstone images uploaded successfully', { id: 'uploadProgress' });
      }

      // Prepare final data
      const finalData = {
        ...formData,
        images: uploadedImages
      };

      // Save gemstone data
      toast.loading('Saving gemstone details...', { id: 'saveProgress' });
      const response = await fetch('/api/admin/gemstones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create gemstone');
      }

      toast.success('Gemstone created successfully', { id: 'saveProgress' });
      router.push('/admin/gemstones/list');

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

  // Render field
  const renderField = (field: FormSection['fields'][0]) => {
    if (field.condition && !field.condition(formData)) {
      return null;
    }

    const value = formData[field.name];

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
        <h1 className="text-3xl font-bold">Add New Gemstone</h1>
        <p className="mt-2 opacity-80">Create a new gemstone in the inventory system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Gemstone Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gemstone Images</h2>
          <p className="text-gray-600 mb-4">Upload high-quality images of the gemstone from different angles</p>
          
          <ImageUpload
            onImagesSelect={setTemporaryImages}
            onVideoSelect={() => {}} // Not needed for gemstones
            temporaryImages={temporaryImages}
            temporaryVideo={null}
            maxImages={5}
            previewUrls={[]}
          />
        </div>

        {/* Form Sections */}
        {formSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => (
                field.condition ? (
                  field.condition(formData) && (
                    <div key={fieldIndex} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  )
                ) : (
                  <div key={fieldIndex} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                )
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
            {isSubmitting ? 'Creating Gemstone...' : 'Create Gemstone'}
          </button>
        </div>
      </form>
    </div>
  );
}
