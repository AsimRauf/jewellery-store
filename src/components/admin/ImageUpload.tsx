'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaUploadProps {
  onImagesSelect: (files: File[]) => void;
  onVideoSelect: (file: File | null) => void;
  temporaryImages: File[];
  temporaryVideo: File | null;
  maxImages?: number;
  previewUrls?: string[];
}

export default function MediaUpload({ 
  onImagesSelect,
  onVideoSelect,
  temporaryImages = [],
  temporaryVideo = null,
  maxImages = 10,
}: MediaUploadProps) {
  const [error, setError] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (temporaryImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError('Some images exceed 10MB limit');
      return;
    }

    onImagesSelect([...temporaryImages, ...files]);
    setError('');
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('Video must be less than 50MB');
      return;
    }

    onVideoSelect(file);
    setError('');
  };

  const removeImage = (index: number) => {
    const newImages = [...temporaryImages];
    newImages.splice(index, 1);
    onImagesSelect(newImages);
  };

  const removeVideo = () => {
    onVideoSelect(null);
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
          <span className="text-sm text-gray-500">
            {temporaryImages.length}/{maxImages} images selected
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <label className={`
            flex flex-col items-center justify-center w-32 h-32 
            border-2 border-dashed border-gray-300 rounded-lg 
            cursor-pointer hover:border-purple-400 transition-colors
            ${temporaryImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
          `}>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={temporaryImages.length >= maxImages}
            />
            <div className="text-center p-4">
              <div className="text-gray-500">+ Add Images</div>
            </div>
          </label>
          
          {temporaryImages.map((file, index) => (
            <div key={index} className="relative group">
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <Image 
                  src={URL.createObjectURL(file)} 
                  alt={`Preview ${index + 1}`} 
                  width={200} 
                  height={200} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-opacity"
                type="button"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Video</h3>
        <div className="flex items-center space-x-4">
          <label className={`
            flex flex-col items-center justify-center w-48 h-32 
            border-2 border-dashed border-gray-300 rounded-lg 
            cursor-pointer hover:border-purple-400 transition-colors
            ${temporaryVideo ? 'opacity-50 cursor-not-allowed' : ''}
          `}>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoSelect}
              disabled={!!temporaryVideo}
            />
            <div className="text-center p-4">
              <div className="text-gray-500">+ Add Video</div>
            </div>
          </label>
          
          {temporaryVideo && (
            <div className="relative group">
              <video
                src={URL.createObjectURL(temporaryVideo)}
                className="w-48 h-32 rounded-lg object-cover"
                controls
              />
              <button
                onClick={removeVideo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-opacity"
                type="button"
                aria-label="Remove video"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}