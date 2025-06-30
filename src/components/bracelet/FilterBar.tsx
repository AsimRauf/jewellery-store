interface FilterBarProps {
  filters: {
    types: string[];
    closures: string[];
    metals: string[];
    styles: string[];
    lengths: string[];
    widths: string[];
    adjustableOptions: string[];
    priceRange: [number, number] | null;
  };
  availableFilters: {
    types: string[];
    closures: string[];
    metals: string[];
    styles: string[];
    lengths: string[];
    widths: string[];
    adjustableOptions: string[];
    priceRanges: Array<[number, number]>;
  };
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleType: (type: string) => void;
  toggleClosure: (closure: string) => void;
  toggleMetal: (metal: string) => void;
  toggleStyle: (style: string) => void;
  toggleLength: (length: string) => void;
  toggleWidth: (width: string) => void;
  toggleAdjustableOption: (option: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  availableFilters,
  activeFilterSection,
  toggleFilterSection,
  toggleType,
  toggleClosure,
  toggleMetal,
  toggleStyle,
  toggleLength,
  toggleWidth,
  toggleAdjustableOption,
  setPriceRange,
  clearAllFilters,
  applyFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.types.length + 
    filters.closures.length + 
    filters.metals.length + 
    filters.styles.length + 
    filters.lengths.length + 
    filters.widths.length + 
    filters.adjustableOptions.length + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Filter Sections Tabs */}
      <div className="flex flex-wrap justify-center gap-2 p-4 border-b border-gray-200">
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
          onClick={() => toggleFilterSection('metal')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'metal' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.metals.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Metal {filters.metals.length > 0 && `(${filters.metals.length})`}
        </button>
        
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
          onClick={() => toggleFilterSection('size')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'size' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${(filters.lengths.length + filters.widths.length + filters.adjustableOptions.length) > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Size {(filters.lengths.length + filters.widths.length + filters.adjustableOptions.length) > 0 && 
            `(${filters.lengths.length + filters.widths.length + filters.adjustableOptions.length})`}
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
          onClick={() => toggleFilterSection('closure')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'closure' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.closures.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Closure {filters.closures.length > 0 && `(${filters.closures.length})`}
        </button>
      </div>
      
      {/* Filter Content */}
      {activeFilterSection && (
        <div className="p-5 bg-gray-50 rounded-b-lg">
          {activeFilterSection === 'type' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Bracelet Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium flex flex-col items-center justify-center transition-all ${
                      filters.types.includes(type)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    <div className="mb-2">
                      {/* Simple type icons */}
                      {type === 'Tennis' && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                        </div>
                      )}
                      {type === 'Chain' && <div className="w-8 h-3 border-2 border-current mx-auto flex items-center justify-center">⚘</div>}
                      {type === 'Bangle' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto"></div>}
                      {type === 'Charm' && <div className="w-8 h-8 border-2 border-current mx-auto rounded-lg flex items-center justify-center">♥</div>}
                      {type === 'Cuff' && <div className="w-8 h-6 rounded-t-full border-2 border-current mx-auto border-b-0"></div>}
                      {type === 'Link' && <div className="w-8 h-4 border-2 border-current mx-auto rounded-lg"></div>}
                      {type === 'Beaded' && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 border border-current rounded-full bg-current opacity-30"></div>
                          <div className="w-2 h-2 border border-current rounded-full bg-current opacity-30"></div>
                          <div className="w-2 h-2 border border-current rounded-full bg-current opacity-30"></div>
                        </div>
                      )}
                      {type === 'Wrap' && (
                        <div className="flex flex-col space-y-1">
                          <div className="w-6 h-1 border border-current rounded"></div>
                          <div className="w-8 h-1 border border-current rounded"></div>
                          <div className="w-6 h-1 border border-current rounded"></div>
                        </div>
                      )}
                      {type === 'Tennis Diamond' && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 border border-current transform rotate-45"></div>
                          <div className="w-2 h-2 border border-current transform rotate-45"></div>
                          <div className="w-2 h-2 border border-current transform rotate-45"></div>
                        </div>
                      )}
                      {type === 'Pearl' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto bg-current opacity-20"></div>}
                    </div>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'metal' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Metal Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.metals.map((metal) => (
                  <button
                    key={metal}
                    onClick={() => toggleMetal(metal)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.metals.includes(metal)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                    style={{
                      backgroundColor: filters.metals.includes(metal) ? '' : 
                        metal.includes('Gold') ? '#FEF9C3' :
                        metal.includes('Silver') ? '#F8FAFC' :
                        metal.includes('Platinum') ? '#F1F5F9' :
                        metal.includes('Titanium') ? '#F3F4F6' : '',
                      color: filters.metals.includes(metal) ? '' : '#4B5563'
                    }}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'style' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Style</h3>
              <div className="grid grid-cols-4 gap-3">
                {availableFilters.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.styles.includes(style)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'size' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Length</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableFilters.lengths.map((length) => (
                    <button
                      key={length}
                      onClick={() => toggleLength(length)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        filters.lengths.includes(length)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Width</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableFilters.widths.map((width) => (
                    <button
                      key={width}
                      onClick={() => toggleWidth(width)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        filters.widths.includes(width)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      {width}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Adjustability</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableFilters.adjustableOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleAdjustableOption(option)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        filters.adjustableOptions.includes(option)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
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
                      step="10"
                      value={filters.priceRange ? filters.priceRange[0] : ''}
                      onChange={(e) => {
                        const min = parseInt(e.target.value);
                        const max = filters.priceRange ? filters.priceRange[1] : 25000;
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
                      step="10"
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
          
          {activeFilterSection === 'closure' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Closure Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.closures.map((closure) => (
                  <button
                    key={closure}
                    onClick={() => toggleClosure(closure)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.closures.includes(closure)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {closure}
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
};

export default FilterBar;
