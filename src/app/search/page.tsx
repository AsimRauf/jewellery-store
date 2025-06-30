'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchResults from '../../components/search/SearchResults';
import SearchFiltersComponent from '../../components/search/SearchFilters';
import SearchSortOptions from '../../components/search/SearchSortOptions';

export interface SearchProduct {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  productType: string;
  description?: string;
  isAvailable: boolean;
  metalOption?: {
    karat: string;
    color: string;
    price: number;
  };
  // For diamonds and gemstones
  carat?: number;
  shape?: string;
  color?: string;
  clarity?: string;
  type?: string;
  // For rings
  style?: string[];
  // For jewelry
  metal?: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
  }>;
}

export interface SearchFilters {
  category: string[];
  priceRange: {
    min: number;
    max: number;
  };
  metal: string[];
  style: string[];
  shape: string[];
  gemstoneType: string[];
  availability: boolean;
}

export interface SearchResponse {
  products: SearchProduct[];
  totalCount: number;
  hasMore: boolean;
  filters: {
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
}

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: { min: 0, max: 50000 },
    metal: [],
    style: [],
    shape: [],
    gemstoneType: [],
    availability: true
  });
  
  // Available filter options
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    metals: [] as string[],
    styles: [] as string[],
    shapes: [] as string[],
    gemstoneTypes: [] as string[],
    priceRange: { min: 0, max: 50000 }
  });

  // Get initial search query from URL
  useEffect(() => {
    const query = searchParams?.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Debounced search function
  const performSearch = useCallback(async (
    query: string,
    currentFilters: SearchFilters,
    currentSortBy: string,
    currentPage: number = 1,
    append: boolean = false
  ) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        q: query,
        page: currentPage.toString(),
        limit: '20',
        sortBy: currentSortBy,
        category: currentFilters.category.join(','),
        metal: currentFilters.metal.join(','),
        style: currentFilters.style.join(','),
        shape: currentFilters.shape.join(','),
        gemstoneType: currentFilters.gemstoneType.join(','),
        minPrice: currentFilters.priceRange.min.toString(),
        maxPrice: currentFilters.priceRange.max.toString(),
        availability: currentFilters.availability.toString()
      });

      const response = await fetch(`/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      
      if (append) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
      setAvailableFilters(data.filters);
      
      // Update URL with search params
      if (query) {
        const url = new URL(window.location.href);
        url.searchParams.set('q', query);
        window.history.replaceState({}, '', url.toString());
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setPage(1);
        performSearch(searchQuery, filters, sortBy, 1, false);
      } else {
        setProducts([]);
        setTotalCount(0);
        setHasMore(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, sortBy, performSearch]);

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle sort changes
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await performSearch(searchQuery, filters, sortBy, nextPage, true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      category: [],
      priceRange: { min: 0, max: 50000 },
      metal: [],
      style: [],
      shape: [],
      gemstoneType: [],
      availability: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewelry, diamonds, gemstones..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {searchQuery && (
            <div className="text-center mt-4">
              <p className="text-gray-600">
                {totalCount > 0 ? (
                  <>Showing {products.length} of {totalCount} results for "<span className="font-medium">{searchQuery}</span>"</>
                ) : (
                  <>No results found for "<span className="font-medium">{searchQuery}</span>"</>
                )}
              </p>
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <SearchFiltersComponent
                filters={filters}
                availableFilters={availableFilters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Sort Options */}
              <div className="mb-6">
                <SearchSortOptions
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  totalCount={totalCount}
                />
              </div>

              {/* Search Results */}
              <SearchResults
                products={products}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                error={error}
                onLoadMore={handleLoadMore}
                searchQuery={searchQuery}
                totalCount={totalCount}
              />
            </div>
          </div>
        )}

        {/* Show popular products or categories when no search query */}
        {!searchQuery && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-cinzel text-gray-900 mb-2">Search Our Collection</h2>
              <p className="text-gray-600 mb-8">Find the perfect piece from our extensive jewelry collection</p>
              
              {/* Popular search suggestions */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Engagement Rings',
                    'Diamond Rings',
                    'Wedding Bands',
                    'Sapphire',
                    'Emerald',
                    'Ruby',
                    'Gold Necklaces',
                    'Pearl Earrings'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageComponent />
    </Suspense>
  );
}
