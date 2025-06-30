interface MobileFiltersProps {
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
    priceRanges: [number, number][];
  };
  toggleType: (type: string) => void;
  toggleBackType: (backType: string) => void;
  toggleMetal: (metal: string) => void;
  toggleStyle: (style: string) => void;
  toggleLength: (length: string) => void;
  toggleWidth: (width: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  availableFilters,
  toggleType,
  toggleBackType,
  toggleMetal,
  toggleStyle,
  toggleLength,
  toggleWidth,
  setPriceRange,
  clearAllFilters,
  applyFilters,
  closeFilters
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
            {/* Earring Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Earring Type</h3>
              <div className="grid grid-cols-2 gap-3">
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

            {/* Metal Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Metal</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.metals.map((metal) => (
                  <button
                    key={metal}
                    onClick={() => toggleMetal(metal)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.metals.includes(metal)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.styles.includes(style)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Back Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Back Type</h3>
              <div className="space-y-2">
                {availableFilters.backTypes.map((backType) => (
                  <div key={backType} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-backType-${backType}`}
                      checked={filters.backTypes.includes(backType)}
                      onChange={() => toggleBackType(backType)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`mobile-backType-${backType}`} className="ml-2 text-sm text-gray-700">
                      {backType}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Length Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Length</h3>
              <div className="space-y-2">
                {availableFilters.lengths.map((length) => (
                  <div key={length} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-length-${length}`}
                      checked={filters.lengths.includes(length)}
                      onChange={() => toggleLength(length)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`mobile-length-${length}`} className="ml-2 text-sm text-gray-700">
                      {length}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Width Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Width</h3>
              <div className="space-y-2">
                {availableFilters.widths.map((width) => (
                  <div key={width} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-width-${width}`}
                      checked={filters.widths.includes(width)}
                      onChange={() => toggleWidth(width)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`mobile-width-${width}`} className="ml-2 text-sm text-gray-700">
                      {width}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {availableFilters.priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(filters.priceRange && 
                      filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1] 
                        ? null 
                        : range
                    )}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filters.priceRange && 
                      filters.priceRange[0] === range[0] && 
                      filters.priceRange[1] === range[1]
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    ${range[0].toLocaleString()} - ${range[1].toLocaleString()}
                  </button>
                ))}
              </div>
              
              {/* Custom price range */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Range</h4>
                <div className="flex items-center gap-2">
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
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                  <span className="text-gray-400">-</span>
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
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-amber-500 hover:text-amber-600 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <button
              onClick={applyFilters}
              className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
