import React from 'react';

interface SearchSortOptionsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  totalCount: number;
}

const SearchSortOptions: React.FC<SearchSortOptionsProps> = ({
  sortBy,
  onSortChange,
  totalCount
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {totalCount.toLocaleString()} {totalCount === 1 ? 'result' : 'results'}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[180px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchSortOptions;
