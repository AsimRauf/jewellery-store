'use client';

import { useState, useEffect } from 'react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Create object URLs for temporary images
  useEffect(() => {
    const urls = temporaryImages.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
    
    // Clean up object URLs when component unmounts or images change
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [temporaryImages]);

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

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop to reorder images
  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...temporaryImages];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at the new position
    newImages.splice(targetIndex, 0, draggedImage);
    
    // Update the images array with the new order
    onImagesSelect(metalIndex, newImages);
    setDraggedIndex(null);
  };

  // Move image up in order
  const moveImageUp = (index: number) => {
    if (index === 0) return; // Already at the top
    
    const newImages = [...temporaryImages];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    
    onImagesSelect(metalIndex, newImages);
  };

  // Move image down in order
  const moveImageDown = (index: number) => {
    if (index === temporaryImages.length - 1) return; // Already at the bottom
    
    const newImages = [...temporaryImages];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    
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
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-1 text-xs rounded-br">
                {idx + 1}
              </div>
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
          <div 
            key={`temp-${idx}`} 
            className={`relative group ${draggedIndex === idx ? 'opacity-50' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
          >
            <div className="w-16 h-16 rounded-md overflow-hidden border border-transparent hover:border-purple-400">
              {imageUrls[idx] && (
                <Image 
                  src={imageUrls[idx]} 
                  alt={`${colorKey || `Metal option ${metalIndex + 1}`} preview ${idx + 1}`} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-1 text-xs rounded-br">
                {images.length + idx + 1}
              </div>
            </div>
            <div className="absolute -top-1 -right-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveImageUp(idx)}
                className="bg-gray-800 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                type="button"
                aria-label="Move image up"
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                onClick={() => moveImageDown(idx)}
                className="bg-gray-800 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                type="button"
                aria-label="Move image down"
                disabled={idx === temporaryImages.length - 1}
              >
                ↓
              </button>
              <button
                onClick={() => removeTemporaryImage(idx)}
                className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                type="button"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
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
      
      {temporaryImages.length > 0 && (
        <div className="text-xs text-gray-500">
          Drag images to reorder or use the arrow buttons to move them up/down.
        </div>
      )}
    </div>
  );
}