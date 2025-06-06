interface MobileFiltersProps {
  filters: {
    types: string[];
    shapes: string[];
    colors: string[];
    clarities: string[];
    cuts: string[];
    caratRange: [number, number] | null;
    priceRange: [number, number] | null;
    sources: string[];
    origins: string[];
    treatments: string[];
  };
  availableFilters: {
    types: string[];
    shapes: string[];
    colors: string[];
    clarities: string[];
    cuts: string[];
    caratRanges: [number, number][];
    priceRanges: [number, number][];
    sources: string[];
    origins: string[];
    treatments: string[];
  };
  toggleType: (type: string) => void;
  toggleShape: (shape: string) => void;
  toggleColor: (color: string) => void;
  toggleClarity: (clarity: string) => void;
  toggleCut: (cut: string) => void;
  toggleSource: (source: string) => void;
  toggleOrigin: (origin: string) => void;
  toggleTreatment: (treatment: string) => void;
  setCaratRange: (range: [number, number] | null) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  availableFilters,
  toggleType,
  toggleShape,
  toggleColor,
  toggleClarity,
  toggleCut,
  toggleSource,
  toggleOrigin,
  toggleTreatment,
  setCaratRange,
  setPriceRange,
  clearAllFilters,
  applyFilters,
  closeFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.types.length + 
    filters.shapes.length + 
    filters.colors.length + 
    filters.clarities.length + 
    filters.cuts.length + 
    filters.sources.length + 
    filters.origins.length + 
    filters.treatments.length + 
    (filters.caratRange ? 1 : 0) + 
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
            {/* Gemstone Type Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Gemstone Type</h3>
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

            {/* Source Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Gemstone Source</h3>
              <div className="space-y-2">
                {availableFilters.sources.map((source) => (
                  <div key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-source-${source}`}
                      checked={filters.sources.includes(source)}
                      onChange={() => toggleSource(source)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`mobile-source-${source}`} className="ml-2 text-sm text-gray-700">
                      {source === 'natural' ? 'Natural Gemstone' : 'Lab Grown Gemstone'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Shape Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Shape</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={`px-3 py-2 rounded-full text-sm ${
                      filters.shapes.includes(shape)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Range Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Carat Range</h3>
              <div className="space-y-2">
                {availableFilters.caratRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setCaratRange(range)}
                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filters.caratRange && 
                      filters.caratRange[0] === range[0] && 
                      filters.caratRange[1] === range[1]
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {range[0]} - {range[1]} carats
                  </button>
                ))}
                {filters.caratRange && (
                  <button
                    onClick={() => setCaratRange(null)}
                    className="text-sm text-amber-600 hover:text-amber-800 mt-2"
                  >
                    Clear carat filter
                  </button>
                )}
              </div>
            </div>

            {/* Color Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Color</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-2 rounded-full text-sm ${
                      filters.colors.includes(color)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Clarity</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.clarities.map((clarity) => (
                  <button
                    key={clarity}
                    onClick={() => toggleClarity(clarity)}
                    className={`px-3 py-2 rounded-full text-sm ${
                      filters.clarities.includes(clarity)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {clarity}
                  </button>
                ))}
              </div>
            </div>

            {/* Cut Filter Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Cut</h3>
              <div className="space-y-2">
                {availableFilters.cuts.map((cut) => (
                  <div key={cut} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-cut-${cut}`}
                      checked={filters.cuts.includes(cut)}
                      onChange={() => toggleCut(cut)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`mobile-cut-${cut}`} className="ml-2 text-sm text-gray-700">
                      {cut}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter Section */}
            <div className="border-b pb-6">
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

            {/* Advanced Filters Section */}
            <div className="border-b pb-6">
              <h3 className="font-medium mb-4">Advanced Filters</h3>
              
              {/* Origin */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Origin</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableFilters.origins.map((origin) => (
                    <div key={origin} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mobile-origin-${origin}`}
                        checked={filters.origins.includes(origin)}
                        onChange={() => toggleOrigin(origin)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`mobile-origin-${origin}`} className="ml-2 text-sm text-gray-700">
                        {origin}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Treatment */}
              <div>
                <h4 className="text-sm font-medium mb-2">Treatment</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableFilters.treatments.map((treatment) => (
                    <div key={treatment} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mobile-treatment-${treatment}`}
                        checked={filters.treatments.includes(treatment)}
                        onChange={() => toggleTreatment(treatment)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`mobile-treatment-${treatment}`} className="ml-2 text-sm text-gray-700">
                        {treatment}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 space-y-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            )}
            <button
              onClick={() => {
                applyFilters();
                closeFilters();
              }}
              className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
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