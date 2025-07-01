'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/earring/FilterBar';
import MobileFilters from '@/components/earring/MobileFilters';
import SortingOptions from '@/components/earring/SortingOptions';
import ProductGrid from '@/components/earring/ProductGrid';
import { Earring } from '@/types/earring';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';
import { getEarringTitle } from '@/utils/product-helper';
import { EarringProduct } from '@/types/product';
 
 // Define available filter options
const availableFilters = {
  types: ['Stud', 'Drop', 'Dangle', 'Hoop', 'Huggie', 'Chandelier', 'Cluster', 'Climber', 'Threader', 'Jacket'],
  backTypes: ['Push Back', 'Screw Back', 'Lever Back', 'French Wire', 'Clip On', 'Magnetic', 'Threader'],
  metals: ['14K Gold', '18K Gold', 'White Gold', 'Rose Gold', 'Yellow Gold', 'Platinum', 'Sterling Silver', 'Titanium'],
  styles: ['Classic', 'Modern', 'Vintage', 'Bohemian', 'Minimalist', 'Statement', 'Romantic', 'Edgy'],
  lengths: ['Short', 'Medium', 'Long', 'Extra Long'],
  widths: ['Thin', 'Medium', 'Wide', 'Extra Wide'],
  priceRanges: [[50, 200], [200, 500], [500, 1000], [1000, 2500], [2500, 5000], [5000, 10000], [10000, 25000]] as [number, number][]
};

export default function EarringCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  // Ensure category is a string, defaulting to 'all' if undefined
  const category = params?.category ? String(params.category) : 'all';
  
  // State for filters
  const [filters, setFilters] = useState({
    types: [] as string[],
    backTypes: [] as string[],
    metals: [] as string[],
    styles: [] as string[],
    lengths: [] as string[],
    widths: [] as string[],
    priceRange: null as [number, number] | null
  });
  
  // State for active filter section
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('price-asc');
  
  // State for products
  const [products, setProducts] = useState<Earring[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Initialize filters from URL on component mount
  useEffect(() => {
    const initFiltersFromUrl = () => {
      if (!searchParams) return;
      
      const types = searchParams.get('types')?.split(',') || [];
      const backTypes = searchParams.get('backTypes')?.split(',') || [];
      const metals = searchParams.get('metals')?.split(',') || [];
      const styles = searchParams.get('styles')?.split(',') || [];
      const lengths = searchParams.get('lengths')?.split(',') || [];
      const widths = searchParams.get('widths')?.split(',') || [];
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sort = searchParams.get('sort') || 'price-asc';
      
      // Set filters based on URL parameters
      setFilters({
        types: types.filter(t => availableFilters.types.includes(t)),
        backTypes: backTypes.filter(b => availableFilters.backTypes.includes(b)),
        metals: metals.filter(m => availableFilters.metals.includes(m)),
        styles: styles.filter(s => availableFilters.styles.includes(s)),
        lengths: lengths.filter(l => availableFilters.lengths.includes(l)),
        widths: widths.filter(w => availableFilters.widths.includes(w)),
        priceRange: minPrice && maxPrice ? [parseInt(minPrice), parseInt(maxPrice)] : null
      });
      
      // Set sort option
      setSortOption(sort);
    };    
    initFiltersFromUrl();
  }, [searchParams]);
  
  // Fetch products when filters or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1); // Reset to page 1 when filters change
        
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '12');
        
        // Add filters to query params
        if (filters.types.length > 0) {
          queryParams.append('types', filters.types.join(','));
        }
        
        if (filters.backTypes.length > 0) {
          queryParams.append('backTypes', filters.backTypes.join(','));
        }
        
        if (filters.metals.length > 0) {
          queryParams.append('metals', filters.metals.join(','));
        }
        
        if (filters.styles.length > 0) {
          queryParams.append('styles', filters.styles.join(','));
        }
        
        if (filters.lengths.length > 0) {
          queryParams.append('lengths', filters.lengths.join(','));
        }
        
        if (filters.widths.length > 0) {
          queryParams.append('widths', filters.widths.join(','));
        }
        
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0].toString());
          queryParams.append('maxPrice', filters.priceRange[1].toString());
        }
        
        // Add sort option
        queryParams.append('sort', sortOption);
        
        // Fetch products
        const response = await fetch(`/api/products/earring/${category}?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.total);
        setHasMore(data.page < data.totalPages);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortOption, category]);
  
  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', nextPage.toString());
      queryParams.append('limit', '12');
      
      // Add filters to query params
      if (filters.types.length > 0) {
        queryParams.append('types', filters.types.join(','));
      }
      
      if (filters.backTypes.length > 0) {
        queryParams.append('backTypes', filters.backTypes.join(','));
      }
      
      if (filters.metals.length > 0) {
        queryParams.append('metals', filters.metals.join(','));
      }
      
      if (filters.styles.length > 0) {
        queryParams.append('styles', filters.styles.join(','));
      }
      
      if (filters.lengths.length > 0) {
        queryParams.append('lengths', filters.lengths.join(','));
      }
      
      if (filters.widths.length > 0) {
        queryParams.append('widths', filters.widths.join(','));
      }
      
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }
      
      // Add sort option
      queryParams.append('sort', sortOption);
      
      // Fetch more products
      const response = await fetch(`/api/products/earring/${category}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch more products');
      }
      
      const data = await response.json();
      setProducts((prev: Earring[]) => [...prev, ...data.products]);
      setPage(nextPage);
      setHasMore(data.page < data.totalPages);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingMore(false);
    }
  }, [filters, sortOption, page, loadingMore, hasMore, category]);
  
  // Update URL with filters
  const updateUrlWithFilters = useCallback(() => {
    const queryParams = new URLSearchParams();
    
    if (filters.types.length > 0) {
      queryParams.append('types', filters.types.join(','));
    }
    
    if (filters.backTypes.length > 0) {
      queryParams.append('backTypes', filters.backTypes.join(','));
    }
    
    if (filters.metals.length > 0) {
      queryParams.append('metals', filters.metals.join(','));
    }
    
    if (filters.styles.length > 0) {
      queryParams.append('styles', filters.styles.join(','));
    }
    
    if (filters.lengths.length > 0) {
      queryParams.append('lengths', filters.lengths.join(','));
    }
    
    if (filters.widths.length > 0) {
      queryParams.append('widths', filters.widths.join(','));
    }
    
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange[0].toString());
      queryParams.append('maxPrice', filters.priceRange[1].toString());
    }
    
    // Add sort option
    queryParams.append('sort', sortOption);
    
    // Update URL
    const url = `/fine-jewellery/earrings/${category}?${queryParams.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, sortOption, router, category]);
  
  // Filter toggle functions
  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };
  
  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };
  
  const toggleBackType = (backType: string) => {
    setFilters(prev => ({
      ...prev,
      backTypes: prev.backTypes.includes(backType)
        ? prev.backTypes.filter(b => b !== backType)
        : [...prev.backTypes, backType]
    }));
  };
  
  const toggleMetal = (metal: string) => {
    setFilters(prev => ({
      ...prev,
      metals: prev.metals.includes(metal)
        ? prev.metals.filter(m => m !== metal)
        : [...prev.metals, metal]
    }));
  };
  
  const toggleStyle = (style: string) => {
    setFilters(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };
  
  const toggleLength = (length: string) => {
    setFilters(prev => ({
      ...prev,
      lengths: prev.lengths.includes(length)
        ? prev.lengths.filter(l => l !== length)
        : [...prev.lengths, length]
    }));
  };
  
  const toggleWidth = (width: string) => {
    setFilters(prev => ({
      ...prev,
      widths: prev.widths.includes(width)
        ? prev.widths.filter(w => w !== width)
        : [...prev.widths, width]
    }));
  };
  
  const setPriceRange = (range: [number, number] | null) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      types: [],
      backTypes: [],
      metals: [],
      styles: [],
      lengths: [],
      widths: [],
      priceRange: null
    });
  };
  
  const applyFilters = () => {
    updateUrlWithFilters();
    setShowMobileFilters(false);
  };
  
  // Get category display name
  const getCategoryDisplayName = () => {
    if (!category || category === 'all') return 'All Earrings';
    
    // Handle specific earring types
    if (availableFilters.types.some(type => 
      category.toLowerCase() === type.toLowerCase()
    )) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Earrings`;
    }
    
    // Handle metal categories
    if (category.startsWith('metal-')) {
      const metal = category
        .replace('metal-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${metal} Earrings`;
    }
    
    // Handle style categories
    if (category.startsWith('style-')) {
      const style = category
        .replace('style-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${style} Earrings`;
    }
    
    return 'Earrings';
  };

  const handleEarringClick = (earring: Earring) => {
    const productSlug = earring.slug || earring._id;
    router.push(`/fine-jewellery/earrings/detail/${productSlug}`);
  };

  const handleAddToCart = (earring: Earring) => {
    const { length, width, ...rest } = earring;
    const earringProduct: EarringProduct = {
      ...rest,
      productType: 'earring',
      title: earring.name, // Pass name to title for the helper
      imageUrl: earring.images?.[0]?.url || '',
      length: parseFloat(length || '0'),
      width: parseFloat(width || '0'),
      backType: earring.backType || '',
    };

    const cartItem: CartItem = {
      _id: earring._id,
      title: getEarringTitle(earringProduct),
      price: earring.salePrice || earring.price,
      quantity: 1,
      image: earring.images?.[0]?.url || '',
      productType: 'earring',
      customization: {
        isCustomized: false,
        customizationDetails: {
          metal: earring.metal,
          style: earring.style,
          type: earring.type
        }
      }
    };

    addItem(cartItem);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getCategoryDisplayName()}</h1>
        <p className="text-gray-600 mt-2">
          {totalProducts} {totalProducts === 1 ? 'earring' : 'earrings'} available
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
      
      {/* Desktop Filters - Now at the top */}
      <div className="hidden lg:block mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <FilterBar
            filters={filters}
            availableFilters={availableFilters}
            activeFilterSection={activeFilterSection}
            toggleFilterSection={toggleFilterSection}
            toggleType={toggleType}
            toggleBackType={toggleBackType}
            toggleMetal={toggleMetal}
            toggleStyle={toggleStyle}
            toggleLength={toggleLength}
            toggleWidth={toggleWidth}
            setPriceRange={setPriceRange}
            clearAllFilters={clearAllFilters}
            applyFilters={applyFilters}
          />
        </div>
      </div>
      
      {/* Mobile Filters */}
      {showMobileFilters && (
        <MobileFilters
          filters={filters}
          availableFilters={availableFilters}
          toggleType={toggleType}
          toggleBackType={toggleBackType}
          toggleMetal={toggleMetal}
          toggleStyle={toggleStyle}
          toggleLength={toggleLength}
          toggleWidth={toggleWidth}
          setPriceRange={setPriceRange}
          clearAllFilters={clearAllFilters}
          applyFilters={applyFilters}
          closeFilters={() => setShowMobileFilters(false)}
        />
      )}
      
      {/* Product Grid - Now takes full width */}
      <div>
        {/* Sorting Options */}
        <div className="flex justify-end mb-6">
          <SortingOptions
            onSortChange={(option) => {
              setSortOption(option);
              updateUrlWithFilters();
            }}
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
          onProductClick={handleEarringClick}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
