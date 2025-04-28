interface SortingOptionsProps {
  onSortChange: (sortOption: string) => void;
  currentSort: string;
}

export default function SortingOptions({ onSortChange, currentSort }: SortingOptionsProps) {
  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
      <select 
        id="sort" 
        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
      </select>
    </div>
  );
}