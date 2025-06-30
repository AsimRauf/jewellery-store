interface MobileFiltersProps {
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
    priceRanges: [number, number][];
  };
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
  closeFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  availableFilters,
  toggleType,
  toggleClosure,
  toggleMetal,
  toggleStyle,
  toggleLength,
  toggleWidth,
  toggleAdjustableOption,
  setPriceRange,
  clearAllFilters,
  applyFilters,
  closeFilters
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
            {/* Bracelet Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Bracelet Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-2 rounded-full text-sm ${
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
                    className={`px-3 py-2 rounded-full text-sm ${
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
                    className={`px-3 py-2 rounded-full text-sm ${
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

            {/* Size Filters Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Size</h3>
              
              {/* Length */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Length</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableFilters.lengths.map((length) => (
                    <button
                      key={length}
                      onClick={() => toggleLength(length)}
                      className={`px-3 py-2 rounded-full text-sm ${
                        filters.lengths.includes(length)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Width */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Width</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableFilters.widths.map((width) => (
                    <button
                      key={width}
                      onClick={() => toggleWidth(width)}
                      className={`px-3 py-2 rounded-full text-sm ${
                        filters.widths.includes(width)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {width}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjustable Options */}
              <div>
                <h4 className="text-sm font-medium mb-2">Adjustability</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableFilters.adjustableOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleAdjustableOption(option)}
                      className={`px-3 py-2 rounded-full text-sm ${
                        filters.adjustableOptions.includes(option)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Closure Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Closure Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFilters.closures.map((closure) => (
                  <button
                    key={closure}
                    onClick={() => toggleClosure(closure)}
                    className={`px-3 py-2 rounded-full text-sm ${
                      filters.closures.includes(closure)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {closure}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter Section */}
            <div className="pb-6">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="space-y-2">
                {availableFilters.priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(range)}
                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm ${
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
                {filters.priceRange && (
                  <button
                    onClick={() => setPriceRange(null)}
                    className="text-sm text-amber-600 hover:text-amber-800 mt-2"
                  >
                    Clear price filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Clear All Filters ({activeFilterCount})
              </button>
            )}
            <button
              onClick={applyFilters}
              className="w-full py-3 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
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
