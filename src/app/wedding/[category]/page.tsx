'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RingEnums } from '@/constants/ringEnums';
import ProductGrid from '@/components/wedding/ProductGrid';
import FilterBar from '@/components/wedding/FilterBar';
import MobileFilters from '@/components/wedding/MobileFilters';
import SortingOptions from '@/components/wedding/SortingOptions';
import { FilterState, WeddingRing } from '@/types/wedding';

export default function WeddingCategoryPage() {
  const [products, setProducts] = useState<WeddingRing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    styles: string[];
    types: string[];
    subcategories: string[];
    metalColors: string[];
    priceRanges: [number, number][];
    finishTypes: string[];
  }>({
    styles: [],
    types: [],
    subcategories: [],
    metalColors: [],
    priceRanges: [[0, 50000]],
    finishTypes: []
  });
  const [filters, setFilters] = useState<FilterState>({
    styles: [],
    types: [],
    subcategories: [],
    metalColors: [],
    priceRange: null,
    finishTypes: []
  });
  
  // Pagination and infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('price-asc');
  const PRODUCTS_PER_PAGE = 12;
  
  const params = useParams() as { category: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = params.category as string | undefined;
  const [queryParams, setQueryParams] = useState(new URLSearchParams());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Function to toggle filter sections
  const toggleFilterSection = (section: string) => {
    if (activeFilterSection === section) {
      setActiveFilterSection(null);
    } else {
      setActiveFilterSection(section);
    }
  };

  // Filter toggle functions
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

  const toggleSubcategory = (subcategory: string) => {
    setFilters(prev => {
      if (prev.subcategories.includes(subcategory)) {
        return { ...prev, subcategories: prev.subcategories.filter(s => s !== subcategory) };
      } else {
        return { ...prev, subcategories: [...prev.subcategories, subcategory] };
      }
    });
  };

  const toggleFinishType = (finishType: string) => {
    setFilters(prev => {
      if (prev.finishTypes.includes(finishType)) {
        return { ...prev, finishTypes: prev.finishTypes.filter(f => f !== finishType) };
      } else {
        return { ...prev, finishTypes: [...prev.finishTypes, finishType] };
      }
    });
  };

  const toggleMetalColor = (color: string) => {
    setFilters(prev => {
      if (prev.metalColors.includes(color)) {
        return { ...prev, metalColors: prev.metalColors.filter(c => c !== color) };
      } else {
        return { ...prev, metalColors: [...prev.metalColors, color] };
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
      subcategories: [],
      metalColors: [],
      priceRange: null,
      finishTypes: []
    });
    // Reset pagination when filters are cleared
    setPage(1);
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

  // Function to apply filters
  const applyFilters = () => {
    // Create a new URLSearchParams object
    const newParams = new URLSearchParams();
    
    // Add styles to query
    if (filters.styles.length > 0) {
      newParams.set('styles', filters.styles.join(','));
    }
    
    // Add types to query
    if (filters.types.length > 0) {
      newParams.set('types', filters.types.join(','));
    }
    
    // Add subcategories to query
    if (filters.subcategories.length > 0) {
      newParams.set('subcategories', filters.subcategories.join(','));
    }
    
    // Add price range to query
    if (filters.priceRange) {
      newParams.set('minPrice', filters.priceRange[0].toString());
      newParams.set('maxPrice', filters.priceRange[1].toString());
    }
    
    // Add finish types to query
    if (filters.finishTypes.length > 0) {
      newParams.set('finishTypes', filters.finishTypes.join(','));
    }

    if (filters.metalColors.length > 0) {
      newParams.set('metalColors', filters.metalColors.join(','));
    }
    
    // Add sort option to query
    newParams.set('sort', sortOption);
    
    // Reset pagination when applying new filters
    setPage(1);
    
    // Update URL with new query params
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    router.push(newUrl);
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParams) return;
    
    const stylesParam = searchParams.get('styles');
    const typesParam = searchParams.get('types');
    const subcategoriesParam = searchParams.get('subcategories');
    const metalColorsParam = searchParams.get('metalColors');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const finishTypesParam = searchParams.get('finishTypes');
    const sortParam = searchParams.get('sort');
    
    const newFilters: FilterState = {
      styles: stylesParam ? stylesParam.split(',') : [],
      types: typesParam ? typesParam.split(',') : [],
      subcategories: subcategoriesParam ? subcategoriesParam.split(',') : [],
      metalColors: metalColorsParam ? metalColorsParam.split(',') : [],
      priceRange: (minPriceParam && maxPriceParam) 
        ? [parseInt(minPriceParam), parseInt(maxPriceParam)] 
        : null,
      finishTypes: finishTypesParam ? finishTypesParam.split(',') : []
    };
    
    setFilters(newFilters);
    
    if (sortParam) {
        setSortOption(sortParam);
      }
      
      // Reset pagination when URL params change
      setPage(1);
    }, [searchParams]);
  
    // Set initial filters based on category from URL
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
            subcategories: [],
            metalColors: [],
            priceRange: null,
            finishTypes: []
          };
  
          // Set initial filters based on category
          if (category === 'womens' || category === 'women-s-wedding-rings') {
            newFilters.subcategories = ["Women's Wedding Rings"];
          } else if (category === 'mens' || category === 'men-s-wedding-rings') {
            newFilters.subcategories = ["Men's Wedding Rings"];
          } else if (category === 'matching-sets') {
            newFilters.subcategories = ["His & Her Matching Sets"];
          } else if (category.startsWith('metal-')) {
            const metalColor = category
              .replace('metal-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            const fullColor = metalColor.includes('Gold') ? metalColor : `${metalColor} Gold`;
            
            newFilters.metalColors = [fullColor];
          } else if (category.startsWith('style-')) {
            const style = category
              .replace('style-', '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            newFilters.styles = [style];
          }
          
          setFilters(newFilters);
        }
        
        setInitialLoadComplete(true);
      }
    }, [category, searchParams, initialLoadComplete, filters]);
  
    // Update query params when filters change
    useEffect(() => {
      if (!initialLoadComplete) return;
      
      const newParams = new URLSearchParams();
      
      if (filters.styles.length) {
        newParams.set('styles', filters.styles.join(','));
      }
      if (filters.metalColors.length) {
        newParams.set('metalColors', filters.metalColors.join(','));
      }
      if (filters.types.length) {
        newParams.set('types', filters.types.join(','));
      }
      if (filters.subcategories.length) {
        newParams.set('subcategories', filters.subcategories.join(','));
      }
      if (filters.priceRange) {
        newParams.set('minPrice', filters.priceRange[0].toString());
        newParams.set('maxPrice', filters.priceRange[1].toString());
      }
      if (filters.finishTypes.length > 0) {
        newParams.set('finishTypes', filters.finishTypes.join(','));
      }
      
      // Add sort option to query params
      newParams.set('sort', sortOption);
  
      setQueryParams(newParams);
    }, [filters, sortOption, initialLoadComplete]);
  
    // Fetch products with pagination
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
          paginatedQueryParams.set('limit', PRODUCTS_PER_PAGE.toString());
          
          console.log(`Fetching products for category: ${category || 'all'}, page: ${page}, params:`, 
            Object.fromEntries(paginatedQueryParams.entries()));
          
          const response = await fetch(`/api/products/wedding/${category || 'all'}?${paginatedQueryParams.toString()}`);
          
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
          
          setAvailableFilters({
            styles: RingEnums.STYLES,
            types: RingEnums.TYPES,
            subcategories: RingEnums.SUBCATEGORIES,
            metalColors: RingEnums.METAL_COLORS,
            priceRanges: [[0, 50000]],
            finishTypes: RingEnums.FINISH_TYPES
          });
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
    }, [category, queryParams, page, initialLoadComplete]);
  
    const get14KGoldPrice = (product: WeddingRing): number => {
      const gold14K = product.metalOptions.find(
        option => option.karat === '14K' && option.color === 'Yellow Gold'
      ) || product.metalOptions.find(
        option => option.karat === '14K'
      ) || product.metalOptions.find(
        option => option.isDefault
      );
  
      return gold14K ? gold14K.price : product.basePrice;
    };
  
    const getCategoryTitle = (): string => {
      if (!category || category === 'all') return 'All Wedding Rings';
      
      // If multiple subcategories are selected, show a combined title
      if (filters.subcategories.length > 1) {
        return `${filters.subcategories.join(' & ')} Wedding Rings`;
      }
      
      // If a single subcategory is selected, show its title
      if (filters.subcategories.length === 1) {
        return `${filters.subcategories[0]} Wedding Rings`;
      }
      
      // If multiple metal colors are selected, show a combined title
      if (filters.metalColors.length > 1) {
        return `${filters.metalColors.join(' & ')} Wedding Rings`;
      }
      
      // If a single metal color is selected, show its title
      if (filters.metalColors.length === 1) {
        return `${filters.metalColors[0]} Wedding Rings`;
      }
      
      // If multiple styles are selected, show a combined title
      if (filters.styles.length > 1) {
        return `${filters.styles.join(' & ')} Style Wedding Rings`;
      }
      
      // If a single style is selected, show its title
      if (filters.styles.length === 1) {
        return `${filters.styles[0]} Style Wedding Rings`;
      }
      
      // Handle URL-based categories
      if (category === 'women-s-wedding-rings' || category === 'womens') {
        return "Women's Wedding Rings";
      }
      
      if (category === 'men-s-wedding-rings' || category === 'mens') {
        return "Men's Wedding Rings";
      }
      
      if (category === 'matching-sets') {
        return "His & Her Matching Sets";
      }
      
      if (category.startsWith('metal-')) {
        const metalName = category.replace('metal-', '').split('-').map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        return `${metalName} Gold Wedding Rings`;
      }
      
      if (category.startsWith('style-')) {
        const styleName = category.replace('style-', '').split('-').map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        return `${styleName} Style Wedding Rings`;
      }
      
      // For specific categories
      switch(category) {
        case 'eternity':
          return "Eternity Bands";
        case 'anniversary':
          return "Anniversary Bands";
        default:
          // For main types
          const typeName = category.charAt(0).toUpperCase() + category.slice(1);
          return `${typeName} Wedding Rings`;
      }
    };
  
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-cinzel text-center mb-4 sm:mb-8">{getCategoryTitle()}</h1>
        
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setActiveFilterSection(activeFilterSection ? null : 'mobile-filters')}
            className="w-full py-3 px-4 bg-white shadow rounded-lg flex items-center justify-between"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </span>
            <span className="text-sm text-gray-500">
              {Object.values(filters).flat().filter(Boolean).length} Selected
            </span>
          </button>
        </div>
  
        {/* Mobile Filters */}
        {activeFilterSection === 'mobile-filters' && (
          <MobileFilters 
            filters={filters}
            availableFilters={availableFilters}
            toggleStyle={toggleStyle}
            toggleMetalColor={toggleMetalColor}
            setPriceRange={setPriceRange}
            toggleType={toggleType}
            toggleSubcategory={toggleSubcategory}
            toggleFinishType={toggleFinishType}
            clearAllFilters={clearAllFilters}
            applyFilters={applyFilters}
            closeFilters={() => setActiveFilterSection(null)}
          />
        )}
  
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FilterBar 
            filters={filters}
            availableFilters={availableFilters}
            activeFilterSection={activeFilterSection}
            toggleFilterSection={toggleFilterSection}
            toggleStyle={toggleStyle}
            toggleType={toggleType}
            toggleSubcategory={toggleSubcategory}
            toggleFinishType={toggleFinishType}
            toggleMetalColor={toggleMetalColor}
            setPriceRange={setPriceRange}
            clearAllFilters={clearAllFilters}
            applyFilters={applyFilters}
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading && !loadingMore ? 'Loading products...' : 
              `Showing ${products.length} of ${totalProducts} products`}
          </p>
          
          <SortingOptions 
            onSortChange={handleSortChange}
            currentSort={sortOption}
          />
        </div>
        
        <ProductGrid 
          products={products}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          error={error}
          clearAllFilters={clearAllFilters}
          get14KGoldPrice={get14KGoldPrice}
          onLoadMore={loadMoreProducts}
          activeMetalFilters={filters.metalColors}
        />
      </div>
    );
  }
  
