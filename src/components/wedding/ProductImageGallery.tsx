'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: Array<{
    url: string;
    publicId: string;
  }>;
  video?: {
    url: string;
    publicId: string;
  };
  activeIndex: number;
  onImageChange: (index: number) => void;
}

export default function ProductImageGallery({ 
  images, 
  video, 
  activeIndex, 
  onImageChange 
}: ProductImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };
  
  const handleMouseLeave = () => {
    setIsZoomed(false);
  };
  
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={handleMouseLeave}
      >
        {images.length > 0 ? (
          <Image 
            src={images[activeIndex]?.url || '/placeholder-image.jpg'} 
            alt="Product image"
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed 
                ? { 
                    transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` 
                  } 
                : undefined
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.publicId}
              onClick={() => onImageChange(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                index === activeIndex ? 'ring-2 ring-amber-500' : 'ring-1 ring-gray-200'
              }`}
            >
              <Image 
                src={image.url} 
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          
          {/* Video Thumbnail */}
          {video && video.url && (
            <button
              onClick={() => {
                // Handle video playback
              }}
              className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ring-1 ring-gray-200"
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}