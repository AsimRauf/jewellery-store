import { useState } from 'react';

interface MobileFiltersProps {
  filters: {
    types: string[];
    metals: string[];
    styles: string[];
    finishes: string[];
    sizes: string[];
    lengths: string[];
    widths: string[];
    thicknesses: string[];
    weights: string[];
    engravingAvailable: boolean;
    priceRange: [number, number] | null;
  };
  availableFilters: {
    types: string[];
    metals: string[];
    styles: string[];
    finishes: string[];
    sizes: string[];
    lengths: string[];
    widths: string[];
    thicknesses: string[];
    weights: string[];
    priceRanges: Array<[number, number]>;
  };
  toggleType: (type: string) => void;
  toggleMetal: (metal: string) => void;
  toggleStyle: (style: string) => void;
  toggleFinish: (finish: string) => void;
  toggleSize: (size: string) => void;
  toggleLength: (length: string) => void;
  toggleWidth: (width: string) => void;
  toggleThickness: (thickness: string) => void;
  toggleWeight: (weight: string) => void;
  toggleEngraving: () => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  availableFilters,
  toggleType,
  toggleMetal,
  toggleStyle,
  toggleFinish,
  toggleSize,
  toggleLength,
  toggleWidth,
  toggleThickness,
  toggleWeight,
  toggleEngraving,
  setPriceRange,
  clearAllFilters,
  applyFilters,
  closeFilters
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Count total active filters
  const activeFilterCount = 
    filters.types.length + 
    filters.metals.length + 
    filters.styles.length + 
    filters.finishes.length + 
    filters.sizes.length + 
    filters.lengths.length + 
    filters.widths.length + 
    filters.thicknesses.length + 
    filters.weights.length +
    (filters.engravingAvailable ? 1 : 0) +
    (filters.priceRange ? 1 : 0);

  const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const FilterSection = ({ 
    title, 
    sectionKey, 
    items, 
    selectedItems, 
    onToggle 
  }: {
    title: string;
    sectionKey: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
  }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        className="w-full flex items-center justify-between py-4 px-4 text-left"
      >
        <span className="font-medium text-gray-900">
          {title}
          {selectedItems.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {selectedItems.length}
            </span>
          )}
        </span>
        <div className={`transform transition-transform ${activeSection === sectionKey ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>
      
      {activeSection === sectionKey && (
        <div className="px-4 pb-4 max-h-60 overflow-y-auto">
          <div className="space-y-3">
            {items.map(item => (
              <label key={item} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => onToggle(item)}
                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const PriceRangeSection = () => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setActiveSection(activeSection === 'price' ? null : 'price')}
        className="w-full flex items-center justify-between py-4 px-4 text-left"
      >
        <span className="font-medium text-gray-900">
          Price Range
          {filters.priceRange && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              1
            </span>
          )}
        </span>
        <div className={`transform transition-transform ${activeSection === 'price' ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>
      
      {activeSection === 'price' && (
        <div className="px-4 pb-4 max-h-60 overflow-y-auto">
          <div className="space-y-3">
            {availableFilters.priceRanges.map(([min, max], index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange?.[0] === min && filters.priceRange?.[1] === max}
                  onChange={() => setPriceRange([min, max])}
                  className="mr-3 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  ${min.toLocaleString()} - ${max.toLocaleString()}
                </span>
              </label>
            ))}
            {filters.priceRange && (
              <button
                onClick={() => setPriceRange(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear price filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const EngravingSection = () => (
    <div className="border-b border-gray-200">
      <div className="py-4 px-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.engravingAvailable}
            onChange={toggleEngraving}
            className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-gray-900">Engraving Available</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeFilters} />
      
      {/* Filter Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-medium text-gray-900">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h2>
          <button
            onClick={closeFilters}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto">
          <FilterSection
            title="Type"
            sectionKey="types"
            items={availableFilters.types}
            selectedItems={filters.types}
            onToggle={toggleType}
          />
          
          <FilterSection
            title="Metal"
            sectionKey="metals"
            items={availableFilters.metals}
            selectedItems={filters.metals}
            onToggle={toggleMetal}
          />
          
          <FilterSection
            title="Style"
            sectionKey="styles"
            items={availableFilters.styles}
            selectedItems={filters.styles}
            onToggle={toggleStyle}
          />
          
          <FilterSection
            title="Finish"
            sectionKey="finishes"
            items={availableFilters.finishes}
            selectedItems={filters.finishes}
            onToggle={toggleFinish}
          />
          
          <FilterSection
            title="Size"
            sectionKey="sizes"
            items={availableFilters.sizes}
            selectedItems={filters.sizes}
            onToggle={toggleSize}
          />
          
          <FilterSection
            title="Length"
            sectionKey="lengths"
            items={availableFilters.lengths}
            selectedItems={filters.lengths}
            onToggle={toggleLength}
          />
          
          <FilterSection
            title="Width"
            sectionKey="widths"
            items={availableFilters.widths}
            selectedItems={filters.widths}
            onToggle={toggleWidth}
          />
          
          <FilterSection
            title="Thickness"
            sectionKey="thicknesses"
            items={availableFilters.thicknesses}
            selectedItems={filters.thicknesses}
            onToggle={toggleThickness}
          />
          
          <FilterSection
            title="Weight"
            sectionKey="weights"
            items={availableFilters.weights}
            selectedItems={filters.weights}
            onToggle={toggleWeight}
          />
          
          <EngravingSection />
          
          <PriceRangeSection />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-white space-y-3">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear All Filters
            </button>
          )}
          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
