interface FilterBarProps {
  filters: {
    types: string[];
    backTypes: string[];
    metals: string[];
    styles: string[];
    lengths: string[];
    widths: string[];
    priceRange: [number, number] | null;
  };
  availableFilters: {
    types: string[];
    backTypes: string[];
    metals: string[];
    styles: string[];
    lengths: string[];
    widths: string[];
    priceRanges: Array<[number, number]>;
  };
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleType: (type: string) => void;
  toggleBackType: (backType: string) => void;
  toggleMetal: (metal: string) => void;
  toggleStyle: (style: string) => void;
  toggleLength: (length: string) => void;
  toggleWidth: (width: string) => void;
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
  toggleBackType,
  toggleMetal,
  toggleStyle,
  toggleLength,
  toggleWidth,
  setPriceRange,
  clearAllFilters,
  applyFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.types.length + 
    filters.backTypes.length + 
    filters.metals.length + 
    filters.styles.length + 
    filters.lengths.length + 
    filters.widths.length + 
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
          onClick={() => toggleFilterSection('advanced')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'advanced' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${(filters.backTypes.length + filters.lengths.length + filters.widths.length) > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Advanced {(filters.backTypes.length + filters.lengths.length + filters.widths.length) > 0 && 
            `(${filters.backTypes.length + filters.lengths.length + filters.widths.length})`}
        </button>
      </div>
      
      {/* Filter Content */}
      {activeFilterSection && (
        <div className="p-5 bg-gray-50 rounded-b-lg">
          {activeFilterSection === 'type' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Earring Type</h3>
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
                      {type === 'Stud' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto flex items-center justify-center">•</div>}
                      {type === 'Drop' && <div className="w-6 h-8 border-2 border-current mx-auto rounded-b-full"></div>}
                      {type === 'Dangle' && (
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-2 border border-current rounded-t-full"></div>
                          <div className="w-2 h-4 border border-current"></div>
                        </div>
                      )}
                      {type === 'Hoop' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto"></div>}
                      {type === 'Huggie' && <div className="w-6 h-6 rounded-full border-2 border-current mx-auto"></div>}
                      {type === 'Chandelier' && (
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-2 border border-current rounded"></div>
                          <div className="flex space-x-1 mt-1">
                            <div className="w-1 h-3 border border-current"></div>
                            <div className="w-1 h-4 border border-current"></div>
                            <div className="w-1 h-3 border border-current"></div>
                          </div>
                        </div>
                      )}
                      {type === 'Cluster' && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                          <div className="w-2 h-2 border border-current rounded-full"></div>
                        </div>
                      )}
                      {type === 'Climber' && <div className="w-2 h-8 border-2 border-current mx-auto transform rotate-12"></div>}
                      {type === 'Threader' && <div className="w-8 h-1 border-2 border-current mx-auto rounded"></div>}
                      {type === 'Jacket' && <div className="w-8 h-6 border-2 border-current mx-auto rounded-lg flex items-center justify-center">J</div>}
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
          
          {activeFilterSection === 'advanced' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Back Type</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.backTypes.map((backType) => (
                    <div key={backType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`backType-${backType}`}
                        checked={filters.backTypes.includes(backType)}
                        onChange={() => toggleBackType(backType)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`backType-${backType}`} className="ml-2 text-sm text-gray-700">
                        {backType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Length</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.lengths.map((length) => (
                    <div key={length} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`length-${length}`}
                        checked={filters.lengths.includes(length)}
                        onChange={() => toggleLength(length)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`length-${length}`} className="ml-2 text-sm text-gray-700">
                        {length}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Width</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.widths.map((width) => (
                    <div key={width} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`width-${width}`}
                        checked={filters.widths.includes(width)}
                        onChange={() => toggleWidth(width)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`width-${width}`} className="ml-2 text-sm text-gray-700">
                        {width}
                      </label>
                    </div>
                  ))}
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
  );
};

export default FilterBar;
