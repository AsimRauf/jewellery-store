'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/settings/FilterBar';
import MobileFilters from '@/components/settings/MobileFilters';
import SortingOptions from '@/components/settings/SortingOptions';
import ProductGrid from '@/components/settings/ProductGrid';
import { Setting } from '@/types/settings';
import { RingEnums } from '@/constants/ringEnums';

// Define available filter options
const availableFilters = {
  styles: RingEnums.STYLES,
  types: RingEnums.TYPES,
  metalColors: RingEnums.METAL_COLORS,
  priceRanges: [[500, 1000], [1000, 2500], [2500, 5000], [5000, 10000], [10000, 25000]] as [number, number][],
  stoneShapes: RingEnums.STONE_SHAPES
};

export default function SettingsCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Ensure category is a string, defaulting to 'all' if undefined
  const category = params?.category ? String(params.category) : 'all';
  
  // State for filters
  const [filters, setFilters] = useState({
    styles: [] as string[],
    types: [] as string[],
    metalColors: [] as string[],
    priceRange: null as [number, number] | null,
    stoneShapes: [] as string[]
  });
  
  // State for active filter section
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('price-asc');
  
  // State for products
  const [products, setProducts] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeMetalFilters, setActiveMetalFilters] = useState<string[]>([]);
  
  // Add a state to track if initial filters have been set
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [queryParams, setQueryParams] = useState(new URLSearchParams());

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParams) return;
    const stylesParam = searchParams.get('styles');
    const typesParam = searchParams.get('types');
    const metalColorsParam = searchParams.get('metalColors');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const stoneShapesParam = searchParams.get('stoneShapes');
    const sortParam = searchParams.get('sort');
    
    const newFilters = {
      styles: stylesParam ? stylesParam.split(',') : [],
      types: typesParam ? typesParam.split(',') : [],
      metalColors: metalColorsParam ? metalColorsParam.split(',') : [],
      priceRange: (minPriceParam && maxPriceParam) 
        ? [parseInt(minPriceParam), parseInt(maxPriceParam)] as [number, number]
        : null,
      stoneShapes: stoneShapesParam ? stoneShapesParam.split(',') : []
    };
    
    setFilters(newFilters);
    setActiveMetalFilters(newFilters.metalColors);
    
    if (sortParam) {
      setSortOption(sortParam);
    }
    
    // Reset pagination when URL params change
    setPage(1);
  }, [searchParams]);

  // Update the useEffect that sets initial filters based on category
  useEffect(() => {
    if (!initialLoadComplete && category) {
      console.log('Setting initial filters based on category:', category);
      
      // Only set category-based filters if no URL params exist
      const hasExistingFilters = Array.from(searchParams?.entries() || []).length > 0;
      
      if (!hasExistingFilters) {
        let newFilters = {...filters};
        
        // Reset filters when category changes from URL
        newFilters = {
          styles: [],
          types: [],
          metalColors: [],
          priceRange: null,
          stoneShapes: []
        };

        // Set initial filters based on category
        if (category.startsWith('metal-')) {
          // Special case for Two Tone Gold
          if (category === 'metal-two-tone-gold') {
            newFilters.metalColors = ['Two Tone Gold'];
            setActiveMetalFilters(['Two Tone Gold']);
          } else {
            const metalColor = category
              .replace('metal-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          
            const fullColor = metalColor.includes('Gold') ? metalColor : `${metalColor} Gold`;
          
            newFilters.metalColors = [fullColor];
            setActiveMetalFilters([fullColor]);
          }
        } else if (category.startsWith('style-')) {
          const style = category
            .replace('style-', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          newFilters.styles = [style];
        } else if (category.startsWith('type-')) {
          const type = category
            .replace('type-', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          newFilters.types = [type];
        } else if (category.startsWith('stone-shape-')) {
          const shape = category
            .replace('stone-shape-', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          newFilters.stoneShapes = [shape];
        }
        
        setFilters(newFilters);
      }
      
      setInitialLoadComplete(true);
    }
  }, [category, searchParams, initialLoadComplete, filters]);

  // Update query params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.styles.length) {
      newParams.set('styles', filters.styles.join(','));
    }
    if (filters.types.length) {
      newParams.set('types', filters.types.join(','));
    }
    if (filters.metalColors.length) {
      newParams.set('metalColors', filters.metalColors.join(','));
    }
    if (filters.priceRange) {
      newParams.set('minPrice', filters.priceRange[0].toString());
      newParams.set('maxPrice', filters.priceRange[1].toString());
    }
    if (filters.stoneShapes.length > 0) {
      newParams.set('stoneShapes', filters.stoneShapes.join(','));
    }
    
    // Add sort option to query params
    newParams.set('sort', sortOption);

    setQueryParams(newParams);
  }, [filters, sortOption]);

  // Update the fetchProducts function to use the updated filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If it's a new filter/sort, reset pagination
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        // Add page, limit and sort parameters to the query
        const paginatedQueryParams = new URLSearchParams(queryParams.toString());
        paginatedQueryParams.set('page', page.toString());
        paginatedQueryParams.set('limit', '12');
        paginatedQueryParams.set('sort', sortOption);
        
        console.log(`Fetching settings products for category: ${category || 'all'}, page: ${page}, params:`, 
          Object.fromEntries(paginatedQueryParams.entries()));
        
        const response = await fetch(`/api/products/settings/${category || 'all'}?${paginatedQueryParams.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        console.log(`Received ${data.products?.length || 0} products, total: ${data.pagination?.total || 0}`);
        
        // Add null checks for data.products and data.pagination
        if (!data.products) {
          console.error('No products array in API response:', data);
          throw new Error('Invalid API response: missing products array');
        }
        
        // If first page, replace products, otherwise append
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts(prev => [...prev, ...data.products]);
        }
        
        // Update pagination info with null checks
        setTotalProducts(data.pagination?.total || 0);
        setHasMore(data.pagination?.hasMore || false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error loading products');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    if (initialLoadComplete) {
      fetchProducts();
    }
  }, [category, queryParams, page, sortOption, initialLoadComplete]);

  // Function to apply filters
  const applyFilters = () => {
    if (!searchParams) return;
    const queryParams = new URLSearchParams(searchParams.toString());
    
    // Add styles to query
    if (filters.styles.length > 0) {
      queryParams.set('styles', filters.styles.join(','));
    } else {
      queryParams.delete('styles');
    }
    
    // Add types to query
    if (filters.types.length > 0) {
      queryParams.set('types', filters.types.join(','));
    } else {
      queryParams.delete('types');
    }
    
    // Add price range to query
    if (filters.priceRange) {
      queryParams.set('minPrice', filters.priceRange[0].toString());
      queryParams.set('maxPrice', filters.priceRange[1].toString());
    } else {
      queryParams.delete('minPrice');
      queryParams.delete('maxPrice');
    }
    
    // Add metal colors to query
    if (filters.metalColors.length > 0) {
      queryParams.set('metalColors', filters.metalColors.join(','));
    } else {
      queryParams.delete('metalColors');
    }
    
    // Add stone shapes to query
    if (filters.stoneShapes.length > 0) {
      queryParams.set('stoneShapes', filters.stoneShapes.join(','));
    } else {
      queryParams.delete('stoneShapes');
    }
    
    // Add sort option to query
    queryParams.set('sort', sortOption);
    
    // Reset pagination when applying new filters
    setPage(1);
    
    // Update URL with new query params
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(newUrl);
  };

  // Filter toggle functions
  const toggleFilterSection = (section: string) => {
    if (activeFilterSection === section) {
      setActiveFilterSection(null);
    } else {
      setActiveFilterSection(section);
    }
  };

  const toggleStyle = (style: string) => {
    setFilters(prev => {
      if (prev.styles.includes(style)) {
        return { ...prev, styles: prev.styles.filter(s => s !== style) };
      } else {
        return { ...prev, styles: [...prev.styles, style] };
      }
    });
  };

  const toggleType = (type: string) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  const toggleMetalColor = (color: string) => {
    setFilters(prev => {
      const newMetalColors = prev.metalColors.includes(color)
        ? prev.metalColors.filter(c => c !== color)
        : [...prev.metalColors, color];
      
      // Also update activeMetalFilters
      setActiveMetalFilters(newMetalColors);
      
      return { ...prev, metalColors: newMetalColors };
    });
  };

  const toggleStoneShape = (shape: string) => {
    setFilters(prev => {
      if (prev.stoneShapes.includes(shape)) {
        return { ...prev, stoneShapes: prev.stoneShapes.filter(s => s !== shape) };
      } else {
        return { ...prev, stoneShapes: [...prev.stoneShapes, shape] };
      }
    });
  };

  const setPriceRange = (range: [number, number] | null) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const clearAllFilters = () => {
    setFilters({
      styles: [],
      types: [],
      metalColors: [],
      priceRange: null,
      stoneShapes: []
    });
    setActiveMetalFilters([]);
    // Reset pagination when filters are cleared
    setPage(1);
    // Redirect to the all settings page when all filters are cleared
    if (category !== 'all') {
      router.push('/settings/all');
    } else {
      // If already on the all page, just update the URL to remove query params
      router.push('/settings/all');
    }
  };

  // Function to handle sort changes
  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    // Reset pagination when sort changes
    setPage(1);
  };

  // Function to load more products
  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Function to get category title
  const getCategoryTitle = (): string => {
    if (!category || category === 'all') return 'All Ring Settings';
    
    // If multiple styles are selected, show a combined title
    if (filters.styles.length > 1) {
      return `${filters.styles.join(' & ')} Style Ring Settings`;
    }
    
    // If a single style is selected, show its title
    if (filters.styles.length === 1) {
      return `${filters.styles[0]} Style Ring Settings`;
    }
    
    // If multiple metal colors are selected, show a combined title
    if (filters.metalColors.length > 1) {
      return `${filters.metalColors.join(' & ')} Ring Settings`;
    }
    
        // If a single metal color is selected, show its title
        if (filters.metalColors.length === 1) {
            return `${filters.metalColors[0]} Ring Settings`;
          }
          
          // If multiple types are selected, show a combined title
          if (filters.types.length > 1) {
            return `${filters.types.join(' & ')} Ring Settings`;
          }
          
          // If a single type is selected, show its title
          if (filters.types.length === 1) {
            return `${filters.types[0]} Ring Settings`;
          }
          
          // If multiple stone shapes are selected, show a combined title
          if (filters.stoneShapes.length > 1) {
            return `${filters.stoneShapes.join(' & ')} Diamond Ring Settings`;
          }
          
          // If a single stone shape is selected, show its title
          if (filters.stoneShapes.length === 1) {
            return `${filters.stoneShapes[0]} Diamond Ring Settings`;
          }
          
          // Handle URL category mapping
          if (category.startsWith('style-')) {
            const style = category
              .replace('style-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return `${style} Style Ring Settings`;
          }
          
          if (category.startsWith('metal-')) {
            // Special case for Two Tone Gold
            if (category === 'metal-two-tone-gold') {
              return 'Two Tone Gold Ring Settings';
            }
            
            const metalColor = category
              .replace('metal-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            const fullColor = metalColor.includes('Gold') ? metalColor : `${metalColor} Gold`;
            return `${fullColor} Ring Settings`;
          }
          
          if (category.startsWith('type-')) {
            const type = category
              .replace('type-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return `${type} Ring Settings`;
          }
          
          if (category.startsWith('stone-shape-')) {
            const shape = category
              .replace('stone-shape-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return `${shape} Diamond Ring Settings`;
          }
          
          return 'Ring Settings';
        };
        
        return (
          <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{getCategoryTitle()}</h1>
              <p className="text-gray-600 mt-2">
                {totalProducts} {totalProducts === 1 ? 'setting' : 'settings'} available
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full py-2 px-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter & Sort
              </button>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden lg:block mb-8">
              <FilterBar
                filters={filters}
                availableFilters={availableFilters}
                activeFilterSection={activeFilterSection}
                toggleFilterSection={toggleFilterSection}
                toggleStyle={toggleStyle}
                toggleType={toggleType}
                toggleStoneShape={toggleStoneShape}
                toggleMetalColor={toggleMetalColor}
                setPriceRange={setPriceRange}
                clearAllFilters={clearAllFilters}
                applyFilters={applyFilters}
              />
            </div>
            
            {/* Mobile Filters */}
            {showMobileFilters && (
              <MobileFilters
                filters={filters}
                availableFilters={availableFilters}
                toggleStyle={toggleStyle}
                toggleType={toggleType}
                toggleStoneShape={toggleStoneShape}
                toggleMetalColor={toggleMetalColor}
                setPriceRange={setPriceRange}
                clearAllFilters={clearAllFilters}
                applyFilters={applyFilters}
                closeFilters={() => setShowMobileFilters(false)}
              />
            )}
            
            {/* Sorting Options */}
            <div className="flex justify-end mb-6">
              <SortingOptions
                onSortChange={handleSortChange}
                currentSort={sortOption}
              />
            </div>
            
            {/* Products */}
            <ProductGrid
              products={products}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              error={error}
              clearAllFilters={clearAllFilters}
              onLoadMore={loadMoreProducts}
              activeMetalFilters={activeMetalFilters}
            />
          </div>
        );
      }
      