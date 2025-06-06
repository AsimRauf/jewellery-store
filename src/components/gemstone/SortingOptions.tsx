import React from 'react';

interface SortingOptionsProps {
  onSortChange: (option: string) => void;
  currentSort: string;
}

const SortingOptions: React.FC<SortingOptionsProps> = ({ onSortChange, currentSort }) => {
  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'carat-asc', label: 'Carat: Low to High' },
    { value: 'carat-desc', label: 'Carat: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingOptions;