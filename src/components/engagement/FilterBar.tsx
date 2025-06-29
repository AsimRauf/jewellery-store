import { FilterState, AvailableFilters } from '@/types/engagement';

interface FilterBarProps {
  filters: FilterState;
  availableFilters: AvailableFilters;
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleStyle: (style: string) => void;
  toggleType: (type: string) => void;
  toggleGemstoneType: (gemstoneType: string) => void;
  toggleStoneType: (stoneType: string) => void;
  toggleMetalColor: (color: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  setCaratRange: (range: [number, number] | null) => void;
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
  toggleGemstoneType,
  toggleStoneType,
  toggleMetalColor,
  setPriceRange,
  setCaratRange,
  clearAllFilters,
  applyFilters
}: FilterBarProps) {
  // Count total active filters
  const activeFilterCount = 
    filters.styles.length + 
    filters.types.length + 
    filters.metalColors.length + 
    filters.gemstoneTypes.length + 
    filters.stoneTypes.length + 
    (filters.caratRange ? 1 : 0) + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Filter Sections Tabs */}
      <div className="flex flex-wrap justify-center gap-2 p-4 border-b border-gray-200">
        <button 
          onClick={() => toggleFilterSection('style')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'style' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.styles.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Style {filters.styles.length > 0 && `(${filters.styles.length})`}
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
          onClick={() => toggleFilterSection('carat')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'carat' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.caratRange ? 'ring-2 ring-amber-300' : ''}`}
        >
          Carat {filters.caratRange && '(1)'}
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
        
        {availableFilters.stoneTypes.length > 0 && (
          <button 
            onClick={() => toggleFilterSection('stoneType')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilterSection === 'stoneType' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${filters.stoneTypes.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            Stone Type {filters.stoneTypes.length > 0 && `(${filters.stoneTypes.length})`}
          </button>
        )}
        
        {availableFilters.gemstoneTypes.length > 0 && (
          <button 
            onClick={() => toggleFilterSection('gemstoneType')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilterSection === 'gemstoneType' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${filters.gemstoneTypes.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
          >
            Gemstone {filters.gemstoneTypes.length > 0 && `(${filters.gemstoneTypes.length})`}
          </button>
        )}
        
        <button 
          onClick={() => toggleFilterSection('metal')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'metal' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.metalColors.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Metal {filters.metalColors.length > 0 && `(${filters.metalColors.length})`}
        </button>
      </div>
      
      {/* Filter Content */}
      {activeFilterSection && (
        <div className="p-5 bg-gray-50 rounded-b-lg">
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
          
          {activeFilterSection === 'carat' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Carat Weight</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {availableFilters.caratRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setCaratRange(filters.caratRange && 
                      filters.caratRange[0] === range[0] && filters.caratRange[1] === range[1] 
                        ? null 
                        : range
                    )}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.caratRange && 
                      filters.caratRange[0] === range[0] && 
                      filters.caratRange[1] === range[1]
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {range[0]} - {range[1]} ct
                  </button>
                ))}
              </div>
              
              {/* Custom carat range input */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Carat Range</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Carat</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      min="0.1" 
                      step="0.1"
                      value={filters.caratRange ? filters.caratRange[0] : ''}
                      onChange={(e) => {
                        const min = parseFloat(e.target.value);
                        const max = filters.caratRange ? filters.caratRange[1] : 10;
                        if (!isNaN(min)) {
                          setCaratRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Carat</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      min="0.1" 
                      step="0.1"
                      value={filters.caratRange ? filters.caratRange[1] : ''}
                      onChange={(e) => {
                        const max = parseFloat(e.target.value);
                        const min = filters.caratRange ? filters.caratRange[0] : 0.1;
                        if (!isNaN(max)) {
                          setCaratRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => setCaratRange(null)}
                    className="px-3 py-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
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
          
          {activeFilterSection === 'stoneType' && availableFilters.stoneTypes.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Stone Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.stoneTypes.map((stoneType) => (
                  <button
                    key={stoneType}
                    onClick={() => toggleStoneType(stoneType)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.stoneTypes.includes(stoneType)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {stoneType}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'gemstoneType' && availableFilters.gemstoneTypes.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Gemstone Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.gemstoneTypes.map((gemstoneType) => (
                  <button
                    key={gemstoneType}
                    onClick={() => toggleGemstoneType(gemstoneType)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.gemstoneTypes.includes(gemstoneType)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {gemstoneType}
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
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.metalColors.includes(color)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
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

