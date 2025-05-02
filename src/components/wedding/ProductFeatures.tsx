import React from 'react';

interface ProductFeaturesProps {
  product: {
    _id: string;
    title: string;
    subcategory?: string;
    style: string[];
    type: string[];
    side_stone?: {
      type: string;
      number_of_stones: number;
      total_carat: number;
      shape: string;
      color: string;
      clarity: string;
    };
  };
  selectedMetal: {
    karat: string;
    color: string;
    price: number;
    finish_type?: string | null;
    width_mm?: number;
  } | null;
}

export default function ProductFeatures({ product, selectedMetal }: ProductFeaturesProps) {
  // Group features into categories for better organization
  const metalFeatures = [
    {
      label: 'Metal',
      value: selectedMetal ? `${selectedMetal.karat} ${selectedMetal.color}` : null,
      icon: '/icons/features/metal.svg'
    },
    {
      label: 'Finish',
      value: selectedMetal?.finish_type ? String(selectedMetal.finish_type) : null,
      icon: '/icons/features/finish.svg'
    },
    {
      label: 'Width',
      value: selectedMetal?.width_mm ? `${selectedMetal.width_mm}mm` : null,
      icon: '/icons/features/width.svg'
    }
  ].filter(feature => feature.value !== null);

  const styleFeatures = [
    {
      label: 'Style',
      value: product.style && product.style.length > 0 ? product.style.join(', ') : null,
      icon: '/icons/features/style.svg'
    },
    {
      label: 'Type',
      value: product.type && product.type.length > 0 ? product.type.join(', ') : null,
      icon: '/icons/features/type.svg'
    }
  ].filter(feature => feature.value !== null);

  // Check if side_stone exists and has a type property
  const hasSideStones = product.side_stone && product.side_stone.type;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 bg-amber-50 border-b border-amber-100">
        <h2 className="text-lg font-semibold text-amber-800">Product Features</h2>
      </div>
      
      <div className="p-4">
        {/* Metal Features Section */}
        {metalFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Metal Details</h3>
            <div className="space-y-3">
              {metalFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-600 text-sm">{feature.label}:</span>
                    <span className="ml-2 font-medium">{feature.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Style Features Section */}
        {styleFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Design Details</h3>
            <div className="space-y-3">
              {styleFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-600 text-sm">{feature.label}:</span>
                    <span className="ml-2 font-medium">{feature.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Side Stones Section */}
        {hasSideStones && product.side_stone && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Side Stone Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Stone Type:</span>
                    <span className="ml-2 font-medium">{product.side_stone.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Number of Stones:</span>
                    <span className="ml-2 font-medium">{product.side_stone.number_of_stones}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Total Carat Weight:</span>
                    <span className="ml-2 font-medium">{product.side_stone.total_carat}ct</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Stone Shape:</span>
                    <span className="ml-2 font-medium">{product.side_stone.shape}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Stone Color:</span>
                    <span className="ml-2 font-medium">{product.side_stone.color}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Stone Clarity:</span>
                    <span className="ml-2 font-medium">{product.side_stone.clarity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* No features message */}
        {metalFeatures.length === 0 && styleFeatures.length === 0 && !hasSideStones && (
          <div className="text-center py-4 text-gray-500">
            No product features available for this item.
          </div>
        )}
      </div>
    </div>
  );
}