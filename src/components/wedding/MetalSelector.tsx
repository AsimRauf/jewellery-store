'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MetalOption {
  _id?: string;
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

import { BaseMetalOption } from '@/types/shared';

interface MetalSelectorProps {
  options: BaseMetalOption[];
  selectedMetal: BaseMetalOption | null;
  onChange: (metal: BaseMetalOption) => void;
}

// Metal color to icon mapping
const METAL_ICONS: Record<string, string> = {
  'Yellow Gold': '/icons/metals/yellow.webp',
  'White Gold': '/icons/metals/white.webp',
  'Rose Gold': '/icons/metals/rose.webp',
  'Two Tone Gold': '/icons/metals/two-tone.webp',
  'Platinum': '/icons/metals/platinum.webp'
};

export default function MetalSelector({ options, selectedMetal, onChange }: MetalSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Group metals by color for better organization
  const groupedByColor: { [color: string]: MetalOption[] } = {};
  
  options.forEach(metal => {
    if (!groupedByColor[metal.color]) {
      groupedByColor[metal.color] = [];
    }
    groupedByColor[metal.color].push(metal);
  });
  
  // Get icon for the selected metal
  const getMetalIcon = (color: string): string => {
    return METAL_ICONS[color] || '/icons/metals/yellow.webp'; // Default to yellow gold if no match
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <div 
        className="flex items-center justify-between p-4 bg-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="font-medium text-gray-800">Metal Options</h3>
          {selectedMetal && (
            <div className="ml-3 flex items-center">
              {/* Add metal icon */}
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-amber-200">
                <Image 
                  src={getMetalIcon(selectedMetal.color)}
                  alt={selectedMetal.color}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                {selectedMetal.karat} {selectedMetal.color}
              </span>
              <span className="ml-2 text-sm text-amber-600">
                ${selectedMetal.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Accordion Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {/* Instructions */}
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
            <p className="text-sm text-amber-700">
              Select your preferred metal type. Different metals may have different prices.
            </p>
          </div>
          
          {/* Metal Options */}
          <div className="space-y-4">
            {Object.entries(groupedByColor).map(([color, metals]) => (
              <div key={color}>
                <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize flex items-center">
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-gray-200">
                    <Image 
                      src={getMetalIcon(color)}
                      alt={color}
                      width={20}
                      height={20}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {color}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {metals.map((metal) => (
                    <button
                      key={metal._id || `${metal.karat}-${metal.color}`}
                      onClick={() => onChange(metal)}
                      className={`
                        relative p-3 rounded-md text-left transition-all
                        ${selectedMetal && selectedMetal.karat === metal.karat && selectedMetal.color === metal.color
                          ? 'bg-amber-100 border border-amber-300 shadow-sm' 
                          : 'bg-white border border-gray-300 hover:border-amber-300 hover:bg-amber-50'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metal.karat}</span>
                        <span className="text-amber-600">${metal.price.toLocaleString()}</span>
                      </div>
                      
                      {metal.finish_type && (
                        <p className="text-xs text-gray-500 mt-1">{metal.finish_type} finish</p>
                      )}
                      
                      {selectedMetal && selectedMetal.karat === metal.karat && selectedMetal.color === metal.color && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}