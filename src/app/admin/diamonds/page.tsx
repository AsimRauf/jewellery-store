'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

// Define enums for diamond properties
const DiamondEnums = {
  TYPES: ['natural', 'lab'],
  SHAPES: ['round', 'princess', 'cushion', 'emerald', 'oval', 'radiant', 'pear', 'heart', 'marquise', 'asscher'],
  COLORS: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
  FANCY_COLORS: ['White', 'Yellow', 'Blue', 'Pink', 'Green', 'Orange', 'Purple', 'Brown', 'Black', 'Gray'],
  CLARITIES: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
  CUTS: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  POLISHES: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  SYMMETRIES: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  FLUORESCENCES: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong', 'STG'],
  CERTIFICATE_LABS: ['GIA', 'IGI', 'AGS', 'HRD', 'GCAL']
};

// Define form data type
interface FormDataType {
  sku: string;
  productNumber: string;
  type: string;
  carat: number;
  shape: string;
  color: string;
  fancyColor: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  measurements: string;
  treatment: string;
  certificateLab: string;
  crownAngle: number;
  crownHeight: number;
  pavilionAngle: number;
  pavilionDepth: number;
  price: number;
  salePrice: number;
  discountPercentage: number;
  isAvailable: boolean;
  images?: Array<{ url: string; publicId: string }>;
  totalPieces?: number;
  // Add 'unknown' to the index signature types
  [key: string]: string | number | boolean | Array<{ url: string; publicId: string }> | undefined | unknown;
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
      { name: "type", label: "Diamond Type", type: "select", required: true, options: DiamondEnums.TYPES },
      { name: "carat", label: "Carat Weight", type: "number", required: true, min: 0.01, step: 0.01 },
      { name: "price", label: "Price ($)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0, step: 0.01 },
    ]
  },
  {
    title: "Diamond Characteristics",
    fields: [
      { name: "shape", label: "Shape", type: "select", required: true, options: DiamondEnums.SHAPES },
      { name: "color", label: "Color Grade", type: "select", required: true, options: DiamondEnums.COLORS },
      { name: "fancyColor", label: "Fancy Color", type: "select", options: DiamondEnums.FANCY_COLORS, 
        condition: (formData) => formData.type === 'natural' },
      { name: "clarity", label: "Clarity", type: "select", required: true, options: DiamondEnums.CLARITIES },
      { name: "measurements", label: "Measurements (mm)", type: "text", required: true },
      { name: "treatment", label: "Treatment", type: "text", 
        condition: (formData) => formData.type === 'natural' },
    ]
  },
  {
    title: "Cut Details",
    fields: [
      { name: "cut", label: "Cut Grade", type: "select", options: DiamondEnums.CUTS },
      { name: "polish", label: "Polish", type: "select", options: DiamondEnums.POLISHES },
      { name: "symmetry", label: "Symmetry", type: "select", options: DiamondEnums.SYMMETRIES },
      { name: "fluorescence", label: "Fluorescence", type: "select", options: DiamondEnums.FLUORESCENCES },
    ]
  },
  {
    title: "Advanced Measurements",
    fields: [
      { name: "crownAngle", label: "Crown Angle", type: "number", step: 0.1 },
      { name: "crownHeight", label: "Crown Height", type: "number", step: 0.1 },
      { name: "pavilionAngle", label: "Pavilion Angle", type: "number", step: 0.1 },
      { name: "pavilionDepth", label: "Pavilion Depth", type: "number", step: 0.1 },
    ]
  },
  {
    title: "Certification",
    fields: [
      { name: "certificateLab", label: "Certificate Lab", type: "select", options: DiamondEnums.CERTIFICATE_LABS },
      { name: "totalPieces", label: "Total Pieces", type: "number", min: 0 }
    ]
  }
];

export default function AddDiamond() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    sku: '',
    productNumber: '',
    type: 'lab',
    carat: 0,
    shape: '',
    color: '',
    fancyColor: '',
    clarity: '',
    cut: '',
    polish: '',
    symmetry: '',
    fluorescence: '',
    measurements: '',
    treatment: '',
    certificateLab: '',
    crownAngle: 0,
    crownHeight: 0,
    pavilionAngle: 0,
    pavilionDepth: 0,
    price: 0,
    salePrice: 0,
    discountPercentage: 0,
    isAvailable: true,
    totalPieces: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<File[]>([]);
  const [temporaryVideo, setTemporaryVideo] = useState<File | null>(null);

  // Handle field change
  const handleFieldChange = (name: string, value: unknown) => {
    const fields = name.split('.');
    
    if (fields.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => {
        const result = { ...prev };
        let current: Record<string, unknown> = result as Record<string, unknown>;
        
        // Traverse the object until the second-to-last field
        for (let i = 0; i < fields.length - 1; i++) {
          if (typeof current[fields[i]] !== 'object' || current[fields[i]] === null) {
            current[fields[i]] = {};
          }
          current = current[fields[i]] as Record<string, unknown>;
        }
        
        // Set the value on the last field
        current[fields[fields.length - 1]] = value;
        return result;
      });
    }

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
        toast.loading('Uploading diamond images...', { id: 'uploadProgress' });
        
        uploadedImages = await Promise.all(
          temporaryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                file: base64,
                category: `diamonds/${formData.type}`
              })
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to upload image');
            }
            
            return response.json();
          })
        );

        toast.success('Diamond images uploaded successfully', { id: 'uploadProgress' });
      }

      // Prepare final data
      const finalData = {
        ...formData,
        images: uploadedImages
      };

      // Save diamond data
      toast.loading('Saving diamond details...', { id: 'saveProgress' });
      const response = await fetch('/api/admin/diamonds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create diamond');
      }

      toast.success('Diamond created successfully', { id: 'saveProgress' });
      router.push('/admin/diamonds/list');

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

  // Get field value
  const getFieldValue = (field: string) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      return formData[field];
    }
    
    let current: unknown = formData;
    for (const key of fields) {
      if (current === undefined || current === null) return undefined;
      if (typeof current !== 'object') return undefined;
      
      // Use type assertion after we've checked it's an object
      current = (current as Record<string, unknown>)[key];
    }
    
    return current;
  };

  // Render field
  const renderField = (field: FormSection['fields'][0]) => {
    if (field.condition && !field.condition(formData)) {
      return null;
    }

    const value = getFieldValue(field.name);

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

  // Continuing from where we left off...

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Add New Diamond</h1>
        <p className="mt-2 opacity-80">Create a new diamond in the inventory system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Diamond Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Diamond Images</h2>
          <p className="text-gray-600 mb-4">Upload high-quality images of the diamond from different angles</p>
          
          <ImageUpload
            onImagesSelect={setTemporaryImages}
            onVideoSelect={setTemporaryVideo || (() => {})}
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
            {isSubmitting ? 'Creating Diamond...' : 'Create Diamond'}
          </button>
        </div>
      </form>
    </div>
  );
}
