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

interface FilterBarProps {
  filters: FilterState;
  availableFilters: AvailableFilters;
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleStyle: (style: string) => void;
  toggleType: (type: string) => void;
  toggleSubcategory: (subcategory: string) => void;
  toggleFinishType: (finishType: string) => void;
  toggleMetalColor: (color: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  availableFilters,
  activeFilterSection,
  toggleFilterSection,
  toggleStyle,
  toggleType,
  toggleSubcategory,
  toggleFinishType,
  toggleMetalColor,
  setPriceRange,
  clearAllFilters,
  applyFilters
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
    <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => toggleFilterSection('subcategory')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'subcategory' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2`}
          >
            <span>Ring Category {filters.subcategories.length > 0 && `(${filters.subcategories.length})`}</span>
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'subcategory' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => toggleFilterSection('style')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'style' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2`}
          >
            <span>Shop by Style {filters.styles.length > 0 && `(${filters.styles.length})`}</span>
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
            } transition-colors flex items-center gap-2`}
          >
            <span>Ring Type {filters.types.length > 0 && `(${filters.types.length})`}</span>
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
            onClick={() => toggleFilterSection('price')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'price' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2`}
          >
            <span>Price Range {filters.priceRange && '(1)'}</span>
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'price' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        
          <button 
            onClick={() => toggleFilterSection('finish')}
            className={`px-4 py-2 rounded-full border ${
              activeFilterSection === 'finish' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
            } transition-colors flex items-center gap-2`}
          >
            <span>Finish Type {filters.finishTypes.length > 0 && `(${filters.finishTypes.length})`}</span>
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'finish' ? 'rotate-180' : ''}`} 
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
            } transition-colors flex items-center gap-2`}
          >
            <span>Metal Color {filters.metalColors.length > 0 && `(${filters.metalColors.length})`}</span>
            <svg 
              className={`h-4 w-4 transition-transform ${activeFilterSection === 'metal' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      
        {/* Subcategory Filter Section */}
        {activeFilterSection === 'subcategory' && availableFilters.subcategories.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              {availableFilters.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => toggleSubcategory(subcategory)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.subcategories.includes(subcategory) 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        )}
      
        {activeFilterSection === 'style' && availableFilters.styles.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6">
              {availableFilters.styles.map((style) => (
                <div 
                  key={style} 
                  onClick={() => toggleStyle(style)}
                  className={`cursor-pointer flex flex-col items-center transition-all ${
                    filters.styles.includes(style) 
                      ? 'scale-110 text-amber-500' 
                      : 'text-gray-700 hover:text-amber-400'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 border-2 ${
                    filters.styles.includes(style) ? 'border-amber-500' : 'border-gray-200'
                  }`}>
                    <Image 
                      src={STYLE_IMAGES[style] || '/icons/styles/classic.svg'} 
                      alt={style} 
                      width={50} 
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-center">{style}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      
        {activeFilterSection === 'type' && availableFilters.types.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              {availableFilters.types.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.types.includes(type) 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      
        {activeFilterSection === 'price' && availableFilters.priceRanges.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setPriceRange([0, 1000])}
                className={`px-4 py-2 rounded-full border ${
                  filters.priceRange && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors`}
              >
                Under $1,000
              </button>
              <button
                onClick={() => setPriceRange([1000, 2500])}
                className={`px-4 py-2 rounded-full border ${
                  filters.priceRange && filters.priceRange[0] === 1000 && filters.priceRange[1] === 2500
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors`}
              >
                $1,000 - $2,500
              </button>
              <button
                onClick={() => setPriceRange([2500, 5000])}
                className={`px-4 py-2 rounded-full border ${
                  filters.priceRange && filters.priceRange[0] === 2500 && filters.priceRange[1] === 5000
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors`}
              >
                $2,500 - $5,000
              </button>
              <button
                onClick={() => setPriceRange([5000, 10000])}
                className={`px-4 py-2 rounded-full border ${
                  filters.priceRange && filters.priceRange[0] === 5000 && filters.priceRange[1] === 10000
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors`}
              >
                $5,000 - $10,000
              </button>
              <button
                onClick={() => setPriceRange([10000, 1000000])}
                className={`px-4 py-2 rounded-full border ${
                  filters.priceRange && filters.priceRange[0] === 10000 && filters.priceRange[1] === 1000000
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors`}
              >
                $10,000+
              </button>
            </div>
          </div>
        )}
      
        {activeFilterSection === 'finish' && availableFilters.finishTypes.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              {availableFilters.finishTypes.map((finishType) => (
                <button
                  key={finishType}
                  onClick={() => toggleFinishType(finishType)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.finishTypes.includes(finishType) 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  {finishType}
                </button>
              ))}
            </div>
          </div>
        )}
      
        {activeFilterSection === 'metal' && availableFilters.metalColors.length > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              {availableFilters.metalColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleMetalColor(color)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.metalColors.includes(color) 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
      
        {activeFilterCount > 0 && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-gray-700 font-medium">Active Filters:</span>
            
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
            
              {filters.types.map(type => (
                <span 
                  key={`type-${type}`}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                >
                  {type}
                  <button 
                    onClick={() => toggleType(type)}
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
            
              {filters.metalColors.map(color => (
                <span 
                  key={`color-${color}`}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                >
                  {color}
                  <button 
                    onClick={() => toggleMetalColor(color)}
                    className="ml-1 text-amber-800 hover:text-amber-900"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            
              {filters.finishTypes.map(finishType => (
                <span 
                  key={`finish-${finishType}`}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                >
                  {finishType}
                  <button 
                    onClick={() => toggleFinishType(finishType)}
                    className="ml-1 text-amber-800 hover:text-amber-900"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            
              {filters.priceRange && (
                <span 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                >
                  ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  <button 
                    onClick={() => setPriceRange(null)}
                    className="ml-1 text-amber-800 hover:text-amber-900"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            
              <button 
                onClick={clearAllFilters}
                className="px-3 py-1 text-gray-600 text-sm hover:text-amber-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          
            <div className="flex justify-center">
              <button 
                onClick={applyFilters}
                className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
