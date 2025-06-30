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
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Filter Sections Tabs */}
      <div className="flex flex-wrap justify-center gap-2 p-4 border-b border-gray-200">
        <button 
          onClick={() => toggleFilterSection('subcategory')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'subcategory' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.subcategories.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Category {filters.subcategories.length > 0 && `(${filters.subcategories.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('style')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            activeFilterSection === 'style' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.styles.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          {filters.styles.length > 0 && <Image src={STYLE_IMAGES[filters.styles[0]]} alt="Style" width={20} height={20} />}
          <span>Style {filters.styles.length > 0 && `(${filters.styles.length})`}</span>
        </button>
        
        <button 
          onClick={() => toggleFilterSection('type')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'type' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.types.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Type {filters.types.length > 0 && `(${filters.types.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('price')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'price' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.priceRange ? 'ring-2 ring-amber-300' : ''}`}
        >
          Price {filters.priceRange && '(1)'}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('finish')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'finish' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.finishTypes.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Finish {filters.finishTypes.length > 0 && `(${filters.finishTypes.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('metal')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            activeFilterSection === 'metal' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.metalColors.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
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
          <span>Metal {filters.metalColors.length > 0 && `(${filters.metalColors.length})`}</span>
        </button>
      </div>
      
      {/* Filter Content */}
      {activeFilterSection && (
        <div className="p-5 bg-gray-50 rounded-b-lg">
          {activeFilterSection === 'subcategory' && availableFilters.subcategories.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Ring Category</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => toggleSubcategory(subcategory)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.subcategories.includes(subcategory)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'style' && availableFilters.styles.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Ring Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.styles.includes(style)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'type' && availableFilters.types.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Ring Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.types.includes(type)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'price' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
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
                        const max = filters.priceRange ? filters.priceRange[1] : 100000;
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
          
          {activeFilterSection === 'finish' && availableFilters.finishTypes.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Finish Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.finishTypes.map((finishType) => (
                  <button
                    key={finishType}
                    onClick={() => toggleFinishType(finishType)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.finishTypes.includes(finishType)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {finishType}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'metal' && availableFilters.metalColors.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Metal Color</h3>
              <div className="grid grid-cols-3 gap-3">
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
  );
}

export default FilterBar;
