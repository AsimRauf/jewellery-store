import Image from 'next/image';
import { FilterState, AvailableFilters } from '@/types/engagement';

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
  toggleGemstoneType: (gemstoneType: string) => void;
  toggleStoneType: (stoneType: string) => void;
  setCaratRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

export default function MobileFilters({
  filters,
  availableFilters,
  toggleStyle,
  toggleMetalColor,
  setPriceRange,
  toggleType,
  toggleGemstoneType,
  toggleStoneType,
  setCaratRange,
  clearAllFilters,
  applyFilters,
  closeFilters
}: MobileFiltersProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeFilters} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={closeFilters}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                      src={STYLE_IMAGES[style]} 
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

            {/* Carat Range Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Carat Weight</h3>
              <div className="space-y-2">
                {[
                  [0, 0.5, 'Under 0.5 ct'],
                  [0.5, 1, '0.5 - 1 ct'],
                  [1, 2, '1 - 2 ct'],
                  [2, 3, '2 - 3 ct'],
                  [3, 100, '3+ ct']
                ].map(([min, max, label]) => (
                  <button
                    key={label as string}
                    onClick={() => setCaratRange([Number(min), Number(max)])}
                    className={`w-full text-left px-4 py-3 rounded-lg ${
                      filters.caratRange?.[0] === Number(min) && filters.caratRange?.[1] === Number(max)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stone Type Filter Section */}
            {availableFilters.stoneTypes.length > 0 && (
              <div className="border-b pb-6">
                <h3 className="font-medium mb-4">Stone Type</h3>
                <div className="flex flex-wrap gap-3">
                  {availableFilters.stoneTypes.map((stoneType) => (
                    <button
                      key={stoneType}
                      onClick={() => toggleStoneType(stoneType)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        filters.stoneTypes.includes(stoneType)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {stoneType}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gemstone Type Filter Section */}
            {availableFilters.gemstoneTypes.length > 0 && (
              <div className="border-b pb-6">
                <h3 className="font-medium mb-4">Gemstone Type</h3>
                <div className="flex flex-wrap gap-3">
                  {availableFilters.gemstoneTypes.map((gemstoneType) => (
                    <button
                      key={gemstoneType}
                      onClick={() => toggleGemstoneType(gemstoneType)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        filters.gemstoneTypes.includes(gemstoneType)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {gemstoneType}
                    </button>
                  ))}
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
