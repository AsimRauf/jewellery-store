'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface SizeSelectorProps {
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  selectedSize: number | null;
  onChange: (size: number) => void;
}

export default function SizeSelector({ sizes, selectedSize, onChange }: SizeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Sort sizes numerically
  const sortedSizes = [...sizes].sort((a, b) => a.size - b.size);
  
  // Check if any size has additional price
  const hasSizesWithAdditionalPrice = sortedSizes.some(size => size.additionalPrice > 0);
  
  // Get the selected size details
  const selectedSizeDetails = selectedSize !== null 
    ? sortedSizes.find(s => s.size === selectedSize) 
    : null;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <div 
        className="flex items-center justify-between p-4 bg-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="font-medium text-gray-800">Ring Size</h3>
          {selectedSize !== null && (
            <div className="ml-3 flex items-center">
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                {selectedSize.toFixed(2)}
              </span>
              {selectedSizeDetails?.additionalPrice ? (
                <span className="ml-2 text-sm text-amber-600">
                  +${selectedSizeDetails.additionalPrice}
                </span>
              ) : null}
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
              Select your ring size from the dropdown below. 
              {hasSizesWithAdditionalPrice && 
                " Some sizes may have an additional cost, indicated by a '+' amount."}
            </p>
          </div>
          
          {/* Size Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-full p-3 bg-white border border-gray-300 rounded-md flex justify-between items-center hover:border-amber-500 transition-colors"
            >
              <span className="text-gray-700">
                {selectedSize !== null 
                  ? `Size ${selectedSize.toFixed(2)}${selectedSizeDetails?.additionalPrice ? ` (+$${selectedSizeDetails.additionalPrice})` : ''}`
                  : 'Select a size'}
              </span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div 
                className=" mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
                style={{
                  width: dropdownRef.current ? dropdownRef.current.offsetWidth : 'auto',
                  left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
                  top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0
                }}
              >
                {sortedSizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sizeOption.isAvailable) {
                        onChange(sizeOption.size);
                        setIsDropdownOpen(false);
                      }
                    }}
                    disabled={!sizeOption.isAvailable}
                    className={`
                      w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors
                      ${selectedSize === sizeOption.size ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}
                      ${!sizeOption.isAvailable ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span>{sizeOption.size.toFixed(2)}</span>
                      {sizeOption.additionalPrice > 0 && (
                        <span className="text-amber-600">
                          +${sizeOption.additionalPrice}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Ring Size Guide Link */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsGuideModalOpen(true);
              }}
              className="text-amber-600 hover:text-amber-700 underline flex items-center text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Ring Size Guide
            </button>
          </div>
        </div>
      )}
      
      {/* Ring Size Guide Modal */}
      {isGuideModalOpen && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsGuideModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-cinzel">Ring Size Guide</h2>
              <button 
                onClick={() => setIsGuideModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">How to Measure Your Ring Size</h3>
                <p className="text-gray-600 mb-4">
                  Follow these methods to find your perfect ring size:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center text-amber-800 font-bold mr-3 flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium">Use an existing ring</h4>
                      <p className="text-sm text-gray-600">
                        Measure the inside diameter of a ring that fits you well and compare it to the chart below.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center text-amber-800 font-bold mr-3 flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium">Measure your finger</h4>
                      <p className="text-sm text-gray-600">
                        Wrap a piece of string or paper around your finger, mark where it overlaps, and measure the length.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="border border-amber-200 px-4 py-2 text-amber-800">US Size</th>
                      <th className="border border-amber-200 px-4 py-2 text-amber-800">Diameter (mm)</th>
                      <th className="border border-amber-200 px-4 py-2 text-amber-800">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 3, diameter: 14.1, circumference: 44.2 },
                      { size: 4, diameter: 14.9, circumference: 46.8 },
                      { size: 5, diameter: 15.7, circumference: 49.3 },
                      { size: 6, diameter: 16.5, circumference: 51.8 },
                      { size: 7, diameter: 17.3, circumference: 54.4 },
                      { size: 8, diameter: 18.2, circumference: 57.0 },
                      { size: 9, diameter: 18.9, circumference: 59.5 },
                      { size: 10, diameter: 19.8, circumference: 62.1 },
                      { size: 11, diameter: 20.6, circumference: 64.6 },
                      { size: 12, diameter: 21.4, circumference: 67.2 },
                      { size: 13, diameter: 22.2, circumference: 69.7 }
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-center">{row.size}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{row.diameter}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{row.circumference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setIsGuideModalOpen(false)}
                className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
