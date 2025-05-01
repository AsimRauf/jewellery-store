import Image from 'next/image';
import { FilterState, AvailableFilters } from '@/types/wedding';

// Style images mapping
const STYLE_IMAGES: Record<string, string> = {
  'Vintage': '/icons/styles/vintage.svg',
  'Nature Inspired': '/icons/styles/nature-inspired.svg',
  'Floral': '/icons/styles/floral.svg',
  'Classic': '/icons/styles/classic.svg',
  'Celtic': '/icons/styles/celtic.svg',
  'Branch': '/icons/styles/branch.svg'
};

interface MobileFiltersProps {
  filters: FilterState;
  availableFilters: AvailableFilters;
  toggleStyle: (style: string) => void;
  toggleMetalColor: (color: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  toggleType: (type: string) => void;
  toggleSubcategory: (subcategory: string) => void;
  toggleFinishType: (finishType: string) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  availableFilters,
  toggleStyle,
  toggleMetalColor,
  setPriceRange,
  toggleType,
  toggleSubcategory,
  toggleFinishType,
  clearAllFilters,
  applyFilters,
  closeFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.styles.length + 
    filters.types.length + 
    filters.subcategories.length + 
    filters.metalColors.length + 
    filters.finishTypes.length + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeFilters} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h2>
            <button onClick={closeFilters}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Subcategory Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Ring Category</h3>
              <div className="flex flex-wrap gap-3">
                {availableFilters.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => toggleSubcategory(subcategory)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.subcategories.includes(subcategory)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Style</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableFilters.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      filters.styles.includes(style) 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <Image 
                      src={STYLE_IMAGES[style] || '/icons/styles/classic.svg'} 
                      alt={style} 
                      width={40} 
                      height={40}
                    />
                    <span className="mt-2 text-sm">{style}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Color Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Metal Color</h3>
              <div className="flex flex-wrap gap-3">
                {availableFilters.metalColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleMetalColor(color)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.metalColors.includes(color)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="space-y-2">
                {[
                  [0, 1000, 'Under $1,000'],
                  [1000, 2500, '$1,000 - $2,500'],
                  [2500, 5000, '$2,500 - $5,000'],
                  [5000, 10000, '$5,000 - $10,000'],
                  [10000, 1000000, '$10,000+']
                ].map(([min, max, label]) => (
                  <button
                    key={label as string}
                    onClick={() => setPriceRange([Number(min), Number(max)])}
                    className={`w-full text-left px-4 py-3 rounded-lg ${
                      filters.priceRange?.[0] === Number(min) && filters.priceRange?.[1] === Number(max)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Ring Type</h3>
              <div className="flex flex-wrap gap-3">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.types.includes(type)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Finish Type</h3>
              <div className="flex flex-wrap gap-3">
                {availableFilters.finishTypes.map((finishType) => (
                  <button
                    key={finishType}
                    onClick={() => toggleFinishType(finishType)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.finishTypes.includes(finishType)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {finishType}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="border-b pb-6">
                <h3 className="font-medium mb-4">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {filters.styles.map(style => (
                    <span 
                      key={`style-${style}`}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {style}
                      <button 
                        onClick={() => toggleStyle(style)}
                        className="ml-1 text-amber-800 hover:text-amber-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  
                  {filters.subcategories.map(subcategory => (
                    <span 
                      key={`subcategory-${subcategory}`}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {subcategory}
                      <button 
                        onClick={() => toggleSubcategory(subcategory)}
                        className="ml-1 text-amber-800 hover:text-amber-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}

                  {/* Add similar blocks for other filter types */}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-gray-300 rounded-lg"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  closeFilters();
                }}
                className="flex-1 py-3 bg-amber-500 text-white rounded-lg"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileFilters;