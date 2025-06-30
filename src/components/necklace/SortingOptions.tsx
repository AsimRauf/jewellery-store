import { useState, useEffect, useRef } from 'react';

interface SortingOptionsProps {
  onSortChange: (sortOption: string) => void;
  currentSort: string;
}

const SortingOptions: React.FC<SortingOptionsProps> = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get display text for current sort option
  const getSortDisplayText = (sortOption: string): string => {
    switch (sortOption) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'title-asc':
        return 'Name: A to Z';
      case 'title-desc':
        return 'Name: Z to A';
      case 'newest':
        return 'Newest First';
      case 'popular':
        return 'Most Popular';
      default:
        return 'Sort By';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-amber-500 transition-colors"
      >
        <span>{getSortDisplayText(currentSort)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onSortChange('price-asc');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'price-asc' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => {
                onSortChange('price-desc');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'price-desc' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Price: High to Low
            </button>
            <button
              onClick={() => {
                onSortChange('title-asc');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'title-asc' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Name: A to Z
            </button>
            <button
              onClick={() => {
                onSortChange('title-desc');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'title-desc' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Name: Z to A
            </button>
            <button
              onClick={() => {
                onSortChange('newest');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'newest' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => {
                onSortChange('popular');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === 'popular' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
              }`}
            >
              Most Popular
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingOptions;
