import { FilterState, AvailableFilters } from '@/types/settings';
import Image from 'next/image';

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
  toggleType: (type: string) => void;
  toggleStoneShape: (shape: string) => void;
  toggleMetalColor: (color: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

export default function MobileFilters({
  filters,
  availableFilters,
  toggleStyle,
  toggleType,
  toggleStoneShape,
  toggleMetalColor,
  setPriceRange,
  clearAllFilters,
  applyFilters,
  closeFilters
}: MobileFiltersProps) {
  // Count total active filters
  const activeFilterCount = 
    filters.styles.length + 
    filters.types.length + 
    filters.metalColors.length + 
    filters.stoneShapes.length + 
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
            {/* Ring Style Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Ring Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      filters.styles.includes(style)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    <div className="w-8 h-8 mr-2 flex items-center justify-center">
                      {STYLE_IMAGES[style] ? (
                        <Image
                          src={STYLE_IMAGES[style]}
                          alt={style}
                          width={24}
                          height={24}
                          className={filters.styles.includes(style) ? 'brightness-0 invert' : ''}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          {style.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm">{style}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Ring Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`p-3 rounded-lg transition-all ${
                      filters.types.includes(type)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Color Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Metal</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.metalColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleMetalColor(color)}
                    className={`p-3 rounded-lg transition-all flex items-center ${
                      filters.metalColors.includes(color)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full mr-2"
                      style={{
                        background: 
                          color.includes('Yellow Gold') ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                          color.includes('White Gold') ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' :
                          color.includes('Rose Gold') ? 'linear-gradient(135deg, #F7CDCD, #E8A090)' :
                          color.includes('Platinum') ? 'linear-gradient(135deg, #E5E4E2, #CECECE)' :
                          color.includes('Two Tone') ? 'linear-gradient(135deg, #FFD700, #C0C0C0)' :
                          'gray'
                      }}
                    ></span>
                    <span className="text-sm">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stone Shape Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Compatible Stone Shapes</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.stoneShapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleStoneShape(shape)}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      filters.stoneShapes.includes(shape)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    <div className="w-8 h-8 mr-2 flex items-center justify-center">
                      {/* Simple shape icons - you can replace with actual SVG icons */}
                      {shape === 'Round' && <div className="w-6 h-6 rounded-full border-2 border-current"></div>}
                      {shape === 'Princess' && <div className="w-6 h-6 rotate-45 border-2 border-current"></div>}
                      {shape === 'Cushion' && <div className="w-6 h-6 rounded-lg border-2 border-current"></div>}
                      {shape === 'Emerald' && <div className="w-6 h-6 rounded-sm border-2 border-current"></div>}
                      {shape === 'Oval' && <div className="w-6 h-6 rounded-full border-2 border-current" style={{width: '18px', height: '24px'}}></div>}
                      {shape === 'Radiant' && <div className="w-6 h-6 border-2 border-current" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)'}}></div>}
                      {shape === 'Pear' && <div className="w-6 h-6 border-2 border-current" style={{clipPath: 'ellipse(50% 50% at 50% 50%)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}></div>}
                      {shape === 'Heart' && <div className="w-6 h-6 border-2 border-current" style={{clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")'}}></div>}
                      {shape === 'Marquise' && <div className="w-6 h-6 border-2 border-current" style={{borderRadius: '50% / 50%'}}></div>}
                      {shape === 'Asscher' && <div className="w-6 h-6 border-2 border-current" style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'}}></div>}
                    </div>
                    <span className="text-sm">{shape}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter Section */}
            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {availableFilters.priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(filters.priceRange && 
                      filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1] 
                        ? null 
                        : range
                    )}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.priceRange && 
                      filters.priceRange[0] === range[0] && 
                      filters.priceRange[1] === range[1]
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    ${range[0].toLocaleString()} - ${range[1].toLocaleString()}
                  </button>
                ))}
              </div>
              
              {/* Custom price range input */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Price Range</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      min="0" 
                      step="100"
                      value={filters.priceRange ? filters.priceRange[0] : ''}
                      onChange={(e) => {
                        const min = parseInt(e.target.value);
                        const max = filters.priceRange ? filters.priceRange[1] : 10000;
                        if (!isNaN(min)) {
                          setPriceRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      min="0" 
                      step="100"
                      value={filters.priceRange ? filters.priceRange[1] : ''}
                      onChange={(e) => {
                        const max = parseInt(e.target.value);
                        const min = filters.priceRange ? filters.priceRange[0] : 0;
                        if (!isNaN(max)) {
                          setPriceRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-amber-500 border border-amber-500 rounded-md hover:bg-amber-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                applyFilters();
                closeFilters();
              }}
              className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
