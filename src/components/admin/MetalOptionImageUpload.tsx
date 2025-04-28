'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MetalOptionImageUploadProps {
  metalIndex: number;
  colorKey?: string; // Added for color-based uploads
  images: Array<{ url: string; publicId: string }>;
  temporaryImages: File[];
  onImagesSelect: (metalIndex: number, files: File[]) => void;
  onImageRemove: (metalIndex: number, imageIndex: number) => void;
  maxImages?: number;
}

export default function MetalOptionImageUpload({
  metalIndex,
  colorKey,
  images = [],
  temporaryImages = [],
  onImagesSelect,
  onImageRemove,
  maxImages = 5,
}: MetalOptionImageUploadProps) {
  const [error, setError] = useState('');

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (temporaryImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed per metal option`);
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError('Some images exceed 10MB limit');
      return;
    }

    onImagesSelect(metalIndex, [...temporaryImages, ...files]);
    setError('');
  };

  const removeTemporaryImage = (index: number) => {
    const newImages = [...temporaryImages];
    newImages.splice(index, 1);
    onImagesSelect(metalIndex, newImages);
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">
          {colorKey ? `${colorKey} Images` : 'Metal Option Images'}
        </h4>
        <span className="text-xs text-gray-500">
          {(images.length + temporaryImages.length)}/{maxImages} images
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Existing saved images */}
        {images.map((image, idx) => (
          <div key={`saved-${idx}`} className="relative group">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <Image 
                src={image.url} 
                alt={`${colorKey || `Metal option ${metalIndex + 1}`} image ${idx + 1}`} 
                width={64} 
                height={64} 
                className="w-full h-full object-cover" 
              />
            </div>
            <button
              onClick={() => onImageRemove(metalIndex, idx)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-opacity text-xs"
              type="button"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        
        {/* Temporary images (newly selected) */}
        {temporaryImages.map((file, idx) => (
          <div key={`temp-${idx}`} className="relative group">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <Image 
                src={URL.createObjectURL(file)} 
                alt={`${colorKey || `Metal option ${metalIndex + 1}`} preview ${idx + 1}`} 
                width={64} 
                height={64} 
                className="w-full h-full object-cover" 
              />
            </div>
            <button
              onClick={() => removeTemporaryImage(idx)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-opacity text-xs"
              type="button"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        
        {/* Add image button */}
        {(images.length + temporaryImages.length) < maxImages && (
          <label className="flex items-center justify-center w-16 h-16 
                          border border-dashed border-gray-300 rounded-md 
                          cursor-pointer hover:border-purple-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <div className="text-center">
              <div className="text-gray-500 text-xs">+</div>
            </div>
          </label>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-xs">{error}</div>
      )}
    </div>
  );
}