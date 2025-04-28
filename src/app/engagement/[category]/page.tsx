'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RingEnums } from '@/constants/ringEnums';
import ProductGrid from '@/components/engagement/ProductGrid';
import FilterBar from '@/components/engagement/FilterBar';
import MobileFilters from '@/components/engagement/MobileFilters';
import SortingOptions from '@/components/engagement/SortingOptions';
import { FilterState, EngagementRing } from '@/types/engagement';

export default function EngagementCategoryPage() {
  const [products, setProducts] = useState<EngagementRing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    styles: string[];
    types: string[];
    metalColors: string[];
    priceRanges: [number, number][];
    caratRanges: [number, number][];
    gemstoneTypes: string[];
    stoneTypes: string[];
  }>({
    styles: [],
    types: [],
    metalColors: [],
    priceRanges: [[0, 50000]],
    caratRanges: [[0, 5]],
    gemstoneTypes: [],
    stoneTypes: []
  });
  const [filters, setFilters] = useState<FilterState>({
    styles: [],
    types: [],
    metalColors: [],
    priceRange: null,
    caratRange: null,
    gemstoneTypes: [],
    stoneTypes: []
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

  const toggleGemstoneType = (gemstoneType: string) => {
    setFilters(prev => {
      if (prev.gemstoneTypes.includes(gemstoneType)) {
        return { ...prev, gemstoneTypes: prev.gemstoneTypes.filter(g => g !== gemstoneType) };
      } else {
        return { ...prev, gemstoneTypes: [...prev.gemstoneTypes, gemstoneType] };
      }
    });
  };

  const toggleStoneType = (stoneType: string) => {
    setFilters(prev => {
      if (prev.stoneTypes.includes(stoneType)) {
        return { ...prev, stoneTypes: prev.stoneTypes.filter(s => s !== stoneType) };
      } else {
        return { ...prev, stoneTypes: [...prev.stoneTypes, stoneType] };
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

  const setCaratRange = (range: [number, number] | null) => {
    setFilters(prev => ({ ...prev, caratRange: range }));
  };

  const clearAllFilters = () => {
    setFilters({
      styles: [],
      types: [],
      metalColors: [],
      priceRange: null,
      caratRange: null,
      gemstoneTypes: [],
      stoneTypes: []
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
    
    // Add carat range to query
    if (filters.caratRange) {
      queryParams.set('minCarat', filters.caratRange[0].toString());
      queryParams.set('maxCarat', filters.caratRange[1].toString());
    } else {
      queryParams.delete('minCarat');
      queryParams.delete('maxCarat');
    }
    
    // Add gemstone types to query
    if (filters.gemstoneTypes.length > 0) {
      queryParams.set('gemstoneTypes', filters.gemstoneTypes.join(','));
    } else {
      queryParams.delete('gemstoneTypes');
    }

    if (filters.metalColors.length > 0) {
      queryParams.set('metalColors', filters.metalColors.join(','));
    } else {
      queryParams.delete('metalColors');
    }
    
    // Add stone types to query
    if (filters.stoneTypes.length > 0) {
      queryParams.set('stoneTypes', filters.stoneTypes.join(','));
    } else {
      queryParams.delete('stoneTypes');
    }
    
    // Add sort option to query
    queryParams.set('sort', sortOption);
    
    // Reset pagination when applying new filters
    setPage(1);
    
    // Update URL with new query params
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(newUrl);
  };

  // Function to filter products based on selected filters
  const filterProducts = (products: EngagementRing[]): EngagementRing[] => {
    return products.filter(product => {
      // Filter by styles
      if (filters.styles.length > 0 && !filters.styles.some(style => product.style.includes(style))) {
        return false;
      }
      
      // Filter by types
      if (filters.types.length > 0 && !filters.types.some(type => product.type.includes(type))) {
        return false;
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const productPrice = get14KGoldPrice(product);
        if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
          return false;
        }
      }
      
      // Filter by carat range
      if (filters.caratRange && product.main_stone) {
        const caratWeight = product.main_stone.carat_weight;
        if (caratWeight < filters.caratRange[0] || caratWeight > filters.caratRange[1]) {
          return false;
        }
      }
      
      // Filter by gemstone types
      if (filters.gemstoneTypes.length > 0 && product.main_stone) {
        if (product.main_stone.type !== 'Gemstone' || 
            !filters.gemstoneTypes.includes(product.main_stone.gemstone_type || '')) {
          return false;
        }
      }
      
      // Filter by stone types
      if (filters.stoneTypes.length > 0 && product.main_stone) {
        if (!filters.stoneTypes.includes(product.main_stone.type)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParams) return;
    const stylesParam = searchParams.get('styles');
    const typesParam = searchParams.get('types');
    const metalColorsParam = searchParams.get('metalColors');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minCaratParam = searchParams.get('minCarat');
    const maxCaratParam = searchParams.get('maxCarat');
    const gemstoneTypesParam = searchParams.get('gemstoneTypes');
    const stoneTypesParam = searchParams.get('stoneTypes');
    const sortParam = searchParams.get('sort');
    
    const newFilters: FilterState = {
      styles: stylesParam ? stylesParam.split(',') : [],
      types: typesParam ? typesParam.split(',') : [],
      metalColors: metalColorsParam ? metalColorsParam.split(',') : [],
      priceRange: (minPriceParam && maxPriceParam) 
        ? [parseInt(minPriceParam), parseInt(maxPriceParam)] 
        : null,
      caratRange: (minCaratParam && maxCaratParam) 
        ? [parseFloat(minCaratParam), parseFloat(maxCaratParam)] 
        : null,
      gemstoneTypes: gemstoneTypesParam ? gemstoneTypesParam.split(',') : [],
      stoneTypes: stoneTypesParam ? stoneTypesParam.split(',') : []
    };
    
    setFilters(newFilters);
    
    if (sortParam) {
      setSortOption(sortParam);
    }
    
    // Reset pagination when URL params change
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    if (category) {
      if (category.startsWith('metal-')) {
        // Special case for Two Tone Gold
        if (category === 'metal-two-tone-gold') {
          setFilters(prev => ({
            ...prev,
            metalColors: ['Two Tone Gold']
          }));
        } else {
          const metalColor = category
            .replace('metal-', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
          const fullColor = metalColor.includes('Gold') ? metalColor : `${metalColor} Gold`;
        
          setFilters(prev => ({
            ...prev,
            metalColors: [fullColor]
          }));
        }
        setActiveFilterSection('metal');
      } else if (category.startsWith('style-')) {
        const style = category
          .replace('style-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        setFilters(prev => ({
          ...prev,
          styles: [style]
        }));
        setActiveFilterSection('style');
      }
      
      // Reset pagination when category changes
      setPage(1);
    }
  }, [category]);

  // Update query params when filters change
  useEffect(() => {
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
    if (filters.priceRange) {
      newParams.set('minPrice', filters.priceRange[0].toString());
      newParams.set('maxPrice', filters.priceRange[1].toString());
    }
    if (filters.caratRange) {
      newParams.set('minCarat', filters.caratRange[0].toString());
      newParams.set('maxCarat', filters.caratRange[1].toString());
    }
    if (filters.gemstoneTypes.length > 0) {
      newParams.set('gemstoneTypes', filters.gemstoneTypes.join(','));
    }
    if (filters.metalColors.length > 0) {
      newParams.set('metalColors', filters.metalColors.join(','));
    }
    if (filters.stoneTypes.length > 0) {
      newParams.set('stoneTypes', filters.stoneTypes.join(','));
    }
    
    // Add sort option to query params
    newParams.set('sort', sortOption);

    setQueryParams(newParams);
  }, [filters, sortOption]);

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
        paginatedQueryParams.set('sort', sortOption);
        
        const response = await fetch(`/api/products/engagement/${category || 'all'}?${paginatedQueryParams.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        
        // If first page, replace products, otherwise append
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts(prev => [...prev, ...data.products]);
        }
        
        // Update pagination info
        setTotalProducts(data.pagination.total);
        setHasMore(data.pagination.hasMore);
        
        setAvailableFilters({
          styles: RingEnums.STYLES,
          types: RingEnums.TYPES,
          metalColors: RingEnums.METAL_COLORS,
          priceRanges: [[0, 50000]],
          caratRanges: [[0, 5]],
          gemstoneTypes: RingEnums.GEMSTONE_TYPES,
          stoneTypes: RingEnums.MAIN_STONE_TYPES
        });
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error loading products');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [category, queryParams, page, sortOption]);

  const get14KGoldPrice = (product: EngagementRing): number => {
    const gold14K = product.metalOptions.find(
      option => option.karat === '14K' && option.color === 'Yellow Gold'
    ) || product.metalOptions.find(
      option => option.karat === '14K'
    );
    
    return gold14K ? gold14K.price : product.basePrice;
  };

  const getCategoryTitle = (): string => {
    if (!category) return 'All Engagement Rings';
    
    if (category.startsWith('metal-')) {
      const metalName = category.replace('metal-', '').split('-').map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return `${metalName} Gold Engagement Rings`;
    }
    
    if (category.startsWith('style-')) {
      const styleName = category.replace('style-', '').split('-').map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return `${styleName} Style Engagement Rings`;
    }
    
    // For main types
    const typeName = category.charAt(0).toUpperCase() + category.slice(1);
    return `${typeName} Engagement Rings`;
  };

  const filteredProducts = filterProducts(products);

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
          toggleGemstoneType={toggleGemstoneType}
          toggleStoneType={toggleStoneType}
          setCaratRange={setCaratRange}
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
          toggleGemstoneType={toggleGemstoneType}
          toggleStoneType={toggleStoneType}
          toggleMetalColor={toggleMetalColor}
          setPriceRange={setPriceRange}
          setCaratRange={setCaratRange}
          clearAllFilters={clearAllFilters}
          applyFilters={applyFilters}
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {loading && !loadingMore ? 'Loading products...' : 
            `Showing ${filteredProducts.length} of ${totalProducts} products`}
        </p>
        
        <SortingOptions 
          onSortChange={handleSortChange}
          currentSort={sortOption}
        />
      </div>
      
      <ProductGrid 
        products={filteredProducts}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        error={error}
        clearAllFilters={clearAllFilters}
        get14KGoldPrice={get14KGoldPrice}
        onLoadMore={loadMoreProducts}
      />
    </div>
  );
}
