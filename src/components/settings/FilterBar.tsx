import Image from 'next/image';
import { FilterState, AvailableFilters } from '@/types/settings';

// Style images mapping
const STYLE_IMAGES: Record<string, string> = {
  'Vintage': '/icons/styles/vintage.svg',
  'Nature Inspired': '/icons/styles/nature-inspired.svg',
  'Floral': '/icons/styles/floral.svg',
  'Classic': '/icons/styles/classic.svg',
  'Celtic': '/icons/styles/celtic.svg',
  'Branch': '/icons/styles/branch.svg'
};

const METAL_ICONS: Record<string, string> = {
  'Yellow Gold': '/icons/metals/yellow-gold.svg',
  'White Gold': '/icons/metals/white-gold.svg',
  'Rose Gold': '/icons/metals/rose-gold.svg',
  'Platinum': '/icons/metals/platinum.svg',
  'Two Tone': '/icons/metals/two-tone.svg'
};

interface FilterBarProps {
  filters: FilterState;
  availableFilters: AvailableFilters;
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleStyle: (style: string) => void;
  toggleType: (type: string) => void;
  toggleStoneShape: (shape: string) => void;
  toggleMetalColor: (color: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
}

export default function FilterBar({
  filters,
  availableFilters,
  activeFilterSection,
  toggleFilterSection,
  toggleStyle,
  toggleType,
  toggleStoneShape,
  toggleMetalColor,
  setPriceRange,
  clearAllFilters,
  applyFilters
}: FilterBarProps) {
  // Count total active filters
  const activeFilterCount = 
    filters.styles.length + 
    filters.types.length + 
    filters.metalColors.length + 
    filters.stoneShapes.length + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => toggleFilterSection('style')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'style' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2 ${filters.styles.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            {filters.styles.length > 0 && <Image src={STYLE_IMAGES[filters.styles[0]]} alt="Style" width={20} height={20} />}
            <span>Shop by Style</span>
            {filters.styles.length > 0 && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{filters.styles.length}</span>}
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'style' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        
          <button 
            onClick={() => toggleFilterSection('type')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'type' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2 ${filters.types.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            <span>Ring Type</span>
            {filters.types.length > 0 && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{filters.types.length}</span>}
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'type' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button 
            onClick={() => toggleFilterSection('metal')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'metal' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2 ${filters.metalColors.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            {filters.metalColors.length > 0 && (
              <span 
                className="w-5 h-5 rounded-full"
                style={{
                  background: 
                    filters.metalColors[0].includes('Yellow Gold') ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                    filters.metalColors[0].includes('White Gold') ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' :
                    filters.metalColors[0].includes('Rose Gold') ? 'linear-gradient(135deg, #F7CDCD, #E8A090)' :
                    filters.metalColors[0].includes('Platinum') ? 'linear-gradient(135deg, #E5E4E2, #CECECE)' :
                    filters.metalColors[0].includes('Two Tone') ? 'linear-gradient(135deg, #FFD700, #C0C0C0)' :
                    'gray'
                }}
              ></span>
            )}
            <span>Metal</span>
            {filters.metalColors.length > 0 && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{filters.metalColors.length}</span>}
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'metal' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button 
            onClick={() => toggleFilterSection('stone')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'stone' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2 ${filters.stoneShapes.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            <span>Stone Shape</span>
            {filters.stoneShapes.length > 0 && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{filters.stoneShapes.length}</span>}
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'stone' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button 
            onClick={() => toggleFilterSection('price')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'price' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2 ${filters.priceRange ? 'ring-2 ring-amber-300' : ''}`}
          >
            <span>Price</span>
            {filters.priceRange && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">1</span>}
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'price' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        {activeFilterSection && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {activeFilterSection === 'style' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Select Ring Style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
                  {availableFilters.styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                        filters.styles.includes(style)
                          ? 'bg-amber-500 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      <div className="w-12 h-12 mb-2 flex items-center justify-center">
                        {STYLE_IMAGES[style] ? (
                          <Image
                            src={STYLE_IMAGES[style]}
                            alt={style}
                            width={40}
                            height={40}
                            className={filters.styles.includes(style) ? 'brightness-0 invert' : ''}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {style.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-center">{style}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterSection === 'type' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Select Ring Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            )}

            {activeFilterSection === 'metal' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Select Metal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                        className="w-6 h-6 rounded-full mr-2"
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
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterSection === 'stone' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Compatible Stone Shapes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
                  {availableFilters.stoneShapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => toggleStoneShape(shape)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                        filters.stoneShapes.includes(shape)
                          ? 'bg-amber-500 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      <div className="w-12 h-12 mb-2 flex items-center justify-center">
                        {/* Simple shape icons - you can replace with actual SVG icons */}
                        {shape === 'Round' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto"></div>}
                        {shape === 'Princess' && <div className="w-8 h-8 rotate-45 border-2 border-current mx-auto"></div>}
                        {shape === 'Cushion' && <div className="w-8 h-8 rounded-lg border-2 border-current mx-auto"></div>}
                        {shape === 'Emerald' && <div className="w-8 h-8 rounded-sm border-2 border-current mx-auto"></div>}
                        {shape === 'Oval' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto" style={{width: '24px', height: '32px'}}></div>}
                        {shape === 'Radiant' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)'}}></div>}
                        {shape === 'Pear' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'ellipse(50% 50% at 50% 50%)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}></div>}
                        {shape === 'Heart' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")'}}></div>}
                        {shape === 'Marquise' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{borderRadius: '50% / 50%'}}></div>}
                        {shape === 'Asscher' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'}}></div>}
                      </div>
                      <span className="text-sm text-center">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterSection === 'price' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Price Range</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {availableFilters.priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => setPriceRange(filters.priceRange && 
                        filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1] 
                          ? null 
                          : range
                      )}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
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
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Price Range</h4>
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={() => setPriceRange(null)}
                      className="px-3 py-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Actions */}
        {activeFilterCount > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <button
              onClick={clearAllFilters}
              className="text-amber-500 hover:text-amber-600 font-medium text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Filters ({activeFilterCount})
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm font-medium text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
