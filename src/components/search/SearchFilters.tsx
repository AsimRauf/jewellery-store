import React, { useState } from 'react';
import { SearchFilters } from '@/app/search/page';

interface SearchFiltersProps {
  filters: SearchFilters;
  availableFilters: {
    categories: string[];
    metals: string[];
    styles: string[];
    shapes: string[];
    gemstoneTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  onFilterChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  availableFilters,
  onFilterChange,
  onClearAll
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'category' | 'metal' | 'style' | 'shape' | 'gemstoneType', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const hasActiveFilters = () => {
    return (
      filters.category.length > 0 ||
      filters.metal.length > 0 ||
      filters.style.length > 0 ||
      filters.shape.length > 0 ||
      filters.gemstoneType.length > 0 ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max < 50000
    );
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const CheckboxFilter = ({ 
    items, 
    selectedItems, 
    onToggle, 
    maxVisible = 6 
  }: { 
    items: string[]; 
    selectedItems: string[]; 
    onToggle: (item: string) => void;
    maxVisible?: number;
  }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleItems = showAll ? items : items.slice(0, maxVisible);

    return (
      <div className="space-y-3">
        {visibleItems.map((item) => (
          <label key={item} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => onToggle(item)}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="ml-3 text-sm text-gray-700">
              {item}
            </span>
          </label>
        ))}
        {items.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {showAll ? 'Show Less' : `Show All (${items.length})`}
          </button>
        )}
      </div>
    );
  };

  const PriceRangeFilter = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) => updateFilter('priceRange', {
              ...filters.priceRange,
              min: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) => updateFilter('priceRange', {
              ...filters.priceRange,
              max: parseInt(e.target.value) || 50000
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="50000"
          />
        </div>
      </div>
      
      {/* Quick price ranges */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick Select:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Under $1K', min: 0, max: 1000 },
            { label: '$1K - $5K', min: 1000, max: 5000 },
            { label: '$5K - $10K', min: 5000, max: 10000 },
            { label: '$10K+', min: 10000, max: 50000 }
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => updateFilter('priceRange', { min: range.min, max: range.max })}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.priceRange.min === range.min && filters.priceRange.max === range.max
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear All Button */}
      {hasActiveFilters() && (
        <div className="pb-4 border-b border-gray-200">
          <button
            onClick={onClearAll}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Categories */}
      {availableFilters.categories.length > 0 && (
        <FilterSection title="Category">
          <CheckboxFilter
            items={availableFilters.categories}
            selectedItems={filters.category}
            onToggle={(item) => toggleArrayFilter('category', item)}
          />
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRangeFilter />
      </FilterSection>

      {/* Metals */}
      {availableFilters.metals.length > 0 && (
        <FilterSection title="Metal">
          <CheckboxFilter
            items={availableFilters.metals}
            selectedItems={filters.metal}
            onToggle={(item) => toggleArrayFilter('metal', item)}
          />
        </FilterSection>
      )}

      {/* Styles */}
      {availableFilters.styles.length > 0 && (
        <FilterSection title="Style">
          <CheckboxFilter
            items={availableFilters.styles}
            selectedItems={filters.style}
            onToggle={(item) => toggleArrayFilter('style', item)}
          />
        </FilterSection>
      )}

      {/* Shapes */}
      {availableFilters.shapes.length > 0 && (
        <FilterSection title="Shape">
          <CheckboxFilter
            items={availableFilters.shapes}
            selectedItems={filters.shape}
            onToggle={(item) => toggleArrayFilter('shape', item)}
          />
        </FilterSection>
      )}

      {/* Gemstone Types */}
      {availableFilters.gemstoneTypes.length > 0 && (
        <FilterSection title="Gemstone Type">
          <CheckboxFilter
            items={availableFilters.gemstoneTypes}
            selectedItems={filters.gemstoneType}
            onToggle={(item) => toggleArrayFilter('gemstoneType', item)}
          />
        </FilterSection>
      )}

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availability}
            onChange={(e) => updateFilter('availability', e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="ml-3 text-sm text-gray-700">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
              {filters.category.length + filters.metal.length + filters.style.length + filters.shape.length + filters.gemstoneType.length}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-cinzel text-gray-900">Filters</h2>
          {hasActiveFilters() && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
              {filters.category.length + filters.metal.length + filters.style.length + filters.shape.length + filters.gemstoneType.length} active
            </span>
          )}
        </div>
        <FiltersContent />
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-cinzel text-gray-900">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <FiltersContent />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFiltersComponent;
