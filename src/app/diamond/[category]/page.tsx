'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/diamond/FilterBar';
import MobileFilters from '@/components/diamond/MobileFilters';
import SortingOptions from '@/components/diamond/SortingOptions';
import ProductGrid from '@/components/diamond/ProductGrid';
import { Diamond } from '@/types/diamond';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';

// Define available filter options
const availableFilters = {
  shapes: ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Radiant', 'Pear', 'Heart', 'Marquise', 'Asscher'],
  colors: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
  clarities: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
  cuts: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  caratRanges: [[0.3, 0.5], [0.5, 0.75], [0.75, 1.0], [1.0, 1.5], [1.5, 2.0], [2.0, 3.0], [3.0, 5.0], [5.0, 10.0]] as [number, number][],
  priceRanges: [[500, 1000], [1000, 2500], [2500, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000]] as [number, number][],
  types: ['natural', 'lab'],
  polish: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  symmetry: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  fluorescence: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
  fancyColors: ['Yellow', 'Pink', 'Blue', 'Green', 'Orange', 'Purple', 'Brown', 'Black', 'Red', 'Gray']
};

export default function DiamondCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  // Add tracking for both customization flows
  const startWith = searchParams?.get('start');
  const isCustomizationStart = startWith === 'diamond';
  const isSettingSelected = Boolean(
    searchParams?.get('settingId') && 
    searchParams?.get('metal') && 
    searchParams?.get('size')
  );

  // Ensure category is a string, defaulting to 'all' if undefined
  const category = params?.category ? String(params.category) : 'all';
  
  // State for filters
  const [filters, setFilters] = useState({
    shapes: [] as string[],
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    caratRange: null as [number, number] | null,
    priceRange: null as [number, number] | null,
    types: [] as string[],
    polish: [] as string[],
    symmetry: [] as string[],
    fluorescence: [] as string[],
    fancyColors: [] as string[]
  });
  
  // State for active filter section
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('price-asc');
  
  // State for products
  const [products, setProducts] = useState<Diamond[]>([]);
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
      
      const shapes = searchParams.get('shapes')?.split(',') || [];
      const colors = searchParams.get('colors')?.split(',') || [];
      const clarities = searchParams.get('clarities')?.split(',') || [];
      const cuts = searchParams.get('cuts')?.split(',') || [];
      const minCarat = searchParams.get('minCarat');
      const maxCarat = searchParams.get('maxCarat');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const types = searchParams.get('types')?.split(',') || [];
      const polish = searchParams.get('polish')?.split(',') || [];
      const symmetry = searchParams.get('symmetry')?.split(',') || [];
      const fluorescence = searchParams.get('fluorescence')?.split(',') || [];
      const fancyColors = searchParams.get('fancyColors')?.split(',') || [];
      const sort = searchParams.get('sort') || 'price-asc';
      
      // Set filters based on URL parameters
      setFilters({
        shapes: shapes.filter(s => availableFilters.shapes.includes(s)),
        colors: colors.filter(c => availableFilters.colors.includes(c)),
        clarities: clarities.filter(c => availableFilters.clarities.includes(c)),
        cuts: cuts.filter(c => availableFilters.cuts.includes(c)),
        caratRange: minCarat && maxCarat ? [parseFloat(minCarat), parseFloat(maxCarat)] : null,
        priceRange: minPrice && maxPrice ? [parseInt(minPrice), parseInt(maxPrice)] : null,
        types: types.filter(t => availableFilters.types.includes(t)),
        polish: polish.filter(p => availableFilters.polish.includes(p)),
        symmetry: symmetry.filter(s => availableFilters.symmetry.includes(s)),
        fluorescence: fluorescence.filter(f => availableFilters.fluorescence.includes(f)),
        fancyColors: fancyColors.filter(c => availableFilters.fancyColors.includes(c))
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
        if (filters.shapes.length > 0) {
          queryParams.append('shapes', filters.shapes.join(','));
        }
        
        if (filters.colors.length > 0) {
          queryParams.append('colors', filters.colors.join(','));
        }
        
        if (filters.clarities.length > 0) {
          queryParams.append('clarities', filters.clarities.join(','));
        }
        
        if (filters.cuts.length > 0) {
          queryParams.append('cuts', filters.cuts.join(','));
        }
        
        if (filters.caratRange) {
          queryParams.append('minCarat', filters.caratRange[0].toString());
          queryParams.append('maxCarat', filters.caratRange[1].toString());
        }
        
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0].toString());
          queryParams.append('maxPrice', filters.priceRange[1].toString());
        }
        
        if (filters.types.length > 0) {
          queryParams.append('types', filters.types.join(','));
        }
        
        if (filters.polish.length > 0) {
          queryParams.append('polish', filters.polish.join(','));
        }
        
        if (filters.symmetry.length > 0) {
          queryParams.append('symmetry', filters.symmetry.join(','));
        }
        
        if (filters.fluorescence.length > 0) {
          queryParams.append('fluorescence', filters.fluorescence.join(','));
        }
        
        // Add sort option
        queryParams.append('sort', sortOption);
        
        // Fetch products
        const response = await fetch(`/api/products/diamond/${category}?${queryParams.toString()}`);
        
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
      if (filters.shapes.length > 0) {
        queryParams.append('shapes', filters.shapes.join(','));
      }
      
      if (filters.colors.length > 0) {
        queryParams.append('colors', filters.colors.join(','));
      }
      
      if (filters.clarities.length > 0) {
        queryParams.append('clarities', filters.clarities.join(','));
      }
      
      if (filters.cuts.length > 0) {
        queryParams.append('cuts', filters.cuts.join(','));
      }
      
      if (filters.caratRange) {
        queryParams.append('minCarat', filters.caratRange[0].toString());
        queryParams.append('maxCarat', filters.caratRange[1].toString());
      }
      
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }
      
      if (filters.types.length > 0) {
        queryParams.append('types', filters.types.join(','));
      }
      
      if (filters.polish.length > 0) {
        queryParams.append('polish', filters.polish.join(','));
      }
      
      if (filters.symmetry.length > 0) {
        queryParams.append('symmetry', filters.symmetry.join(','));
      }
      
      if (filters.fluorescence.length > 0) {
        queryParams.append('fluorescence', filters.fluorescence.join(','));
      }
      
      // Add sort option
      queryParams.append('sort', sortOption);
      
      // Fetch more products
      const response = await fetch(`/api/products/diamond/${category}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch more products');
      }
      
      const data = await response.json();
      setProducts((prev: Diamond[]) => [...prev, ...data.products]);
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
    
    if (filters.shapes.length > 0) {
      queryParams.append('shapes', filters.shapes.join(','));
    }
    
    if (filters.colors.length > 0) {
      queryParams.append('colors', filters.colors.join(','));
    }
    
    if (filters.clarities.length > 0) {
      queryParams.append('clarities', filters.clarities.join(','));
    }
    
    if (filters.cuts.length > 0) {
      queryParams.append('cuts', filters.cuts.join(','));
    }
    
    if (filters.caratRange) {
      queryParams.append('minCarat', filters.caratRange[0].toString());
      queryParams.append('maxCarat', filters.caratRange[1].toString());
    }
    
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange[0].toString());
      queryParams.append('maxPrice', filters.priceRange[1].toString());
    }
    
    if (filters.types.length > 0) {
      queryParams.append('types', filters.types.join(','));
    }
    
    if (filters.polish.length > 0) {
      queryParams.append('polish', filters.polish.join(','));
    }
    
    if (filters.symmetry.length > 0) {
      queryParams.append('symmetry', filters.symmetry.join(','));
    }
    
    if (filters.fluorescence.length > 0) {
      queryParams.append('fluorescence', filters.fluorescence.join(','));
    }
    
    if (filters.fancyColors.length > 0) {
      queryParams.append('fancyColors', filters.fancyColors.join(','));
    }
    
    // Add sort option
    queryParams.append('sort', sortOption);
    
    // Update URL
    const url = `/diamond/${category}?${queryParams.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, sortOption, router, category]);
  
  // Filter toggle functions
  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };
  
  const toggleShape = (shape: string) => {
    setFilters(prev => ({
      ...prev,
      shapes: prev.shapes.includes(shape)
        ? prev.shapes.filter(s => s !== shape)
        : [...prev.shapes, shape]
    }));
  };
  
  const toggleColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };
  
  const toggleClarity = (clarity: string) => {
    setFilters(prev => ({
      ...prev,
      clarities: prev.clarities.includes(clarity)
        ? prev.clarities.filter(c => c !== clarity)
        : [...prev.clarities, clarity]
    }));
  };
  
  const toggleCut = (cut: string) => {
    setFilters(prev => ({
      ...prev,
      cuts: prev.cuts.includes(cut)
        ? prev.cuts.filter(c => c !== cut)
        : [...prev.cuts, cut]
    }));
  };
  
  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };
  
  const togglePolish = (polish: string) => {
    setFilters(prev => ({
      ...prev,
      polish: prev.polish.includes(polish)
        ? prev.polish.filter(p => p !== polish)
        : [...prev.polish, polish]
    }));
  };

  const toggleFancyColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      fancyColors: prev.fancyColors.includes(color)
        ? prev.fancyColors.filter(c => c !== color)
        : [...prev.fancyColors, color]
    }));
  };
  
  
  const toggleSymmetry = (symmetry: string) => {
    setFilters(prev => ({
      ...prev,
      symmetry: prev.symmetry.includes(symmetry)
        ? prev.symmetry.filter(s => s !== symmetry)
        : [...prev.symmetry, symmetry]
    }));
  };
  
  const toggleFluorescence = (fluorescence: string) => {
    setFilters(prev => ({
      ...prev,
      fluorescence: prev.fluorescence.includes(fluorescence)
        ? prev.fluorescence.filter(f => f !== fluorescence)
        : [...prev.fluorescence, fluorescence]
    }));
  };
  
  const setCaratRange = (range: [number, number] | null) => {
    setFilters(prev => ({
      ...prev,
      caratRange: range
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
      shapes: [],
      colors: [],
      clarities: [],
      cuts: [],
      caratRange: null,
      priceRange: null,
      types: [],
      polish: [],
      symmetry: [],
      fluorescence: [],
      fancyColors: []
    });
  };
  
  const applyFilters = () => {
    updateUrlWithFilters();
    setShowMobileFilters(false);
  };
  
  // Get category display name
  const getCategoryDisplayName = () => {
    if (!category || category === 'all') return 'All Diamonds';
    
    if (category === 'natural') return 'Natural Diamonds';
    if (category === 'lab') return 'Lab Grown Diamonds';
    
    if (category.startsWith('shape-')) {
      const shape = category
        .replace('shape-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${shape} Diamonds`;
    }
    
    if (category.startsWith('color-')) {
      const color = category.replace('color-', '').toUpperCase();
      return `Color ${color} Diamonds`;
    }
    
    if (category.startsWith('clarity-')) {
      const clarity = category.replace('clarity-', '').toUpperCase();
      return `${clarity} Clarity Diamonds`;
    }
    
    return 'Diamonds';
  };

  // This should be the diamond click handler (for reference)
  const handleDiamondClick = (diamond: Diamond) => {
    const productSlug = diamond.slug || diamond._id;
    
    if (isSettingSelected) {
      // Even with setting selected, go to diamond detail with parameters
      const params = new URLSearchParams(searchParams?.toString() || '');
      router.push(`/diamond/detail/${productSlug}?${params.toString()}`);
    } else if (isCustomizationStart) {
      // Diamond-first flow - go to diamond detail
      router.push(`/diamond/detail/${productSlug}?start=diamond`);
    } else {
      // Normal flow - just view diamond details
      router.push(`/diamond/detail/${productSlug}`);
    }
  };

  const handleAddToCart = (diamond: Diamond) => {
    const cartItem: CartItem = {
      _id: diamond._id,
      title: `${diamond.shape} ${diamond.carat}ct ${diamond.color} ${diamond.clarity} Diamond`,
      price: diamond.salePrice || diamond.price,
      quantity: 1,
      image: diamond.images[0]?.url || '',
      productType: 'diamond',
      customization: {
        isCustomized: true,
        customizationType: 'setting-diamond',
        diamondId: diamond._id,
        customizationDetails: {
          stone: {
            type: 'diamond',
            carat: diamond.carat,
            color: diamond.color,
            clarity: diamond.clarity,
            cut: diamond.cut,
            image: diamond.images?.[0]?.url || ''
          }
        }
      }
    };

    addItem(cartItem);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Customization Steps - Show when in customization flow */}
      {(isCustomizationStart || isSettingSelected) && (
        <div className="mb-8 bg-amber-50 p-6 rounded-lg">
          <div className="flex items-center justify-center">
            {isSettingSelected ? (
              <>
                <div className="flex items-center">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <span className="ml-2 font-medium text-amber-700">Setting Selected</span>
                </div>
                <div className="mx-4 border-t-2 border-amber-200 w-16"></div>
                <div className="flex items-center">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <span className="ml-2 font-medium text-amber-700">Select a Diamond</span>
                </div>
                <div className="mx-4 border-t-2 border-amber-200 w-16"></div>
                <div className="flex items-center opacity-50">
                  <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <span className="ml-2 text-gray-500">Complete Ring</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <span className="ml-2 font-medium text-amber-700">Select a Diamond</span>
                </div>
                <div className="mx-4 border-t-2 border-amber-200 w-16"></div>
                <div className="flex items-center opacity-50">
                  <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <span className="ml-2 text-gray-500">Select a Setting</span>
                </div>
                <div className="mx-4 border-t-2 border-amber-200 w-16"></div>
                <div className="flex items-center opacity-50">
                  <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <span className="ml-2 text-gray-500">Complete Ring</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getCategoryDisplayName()}</h1>
        <p className="text-gray-600 mt-2">
          {totalProducts} {totalProducts === 1 ? 'diamond' : 'diamonds'} available
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
            toggleShape={toggleShape}
            toggleColor={toggleColor}
            toggleFancyColor={toggleFancyColor}
            toggleClarity={toggleClarity}
            toggleCut={toggleCut}
            toggleType={toggleType}
            togglePolish={togglePolish}
            toggleSymmetry={toggleSymmetry}
            toggleFluorescence={toggleFluorescence}
            setCaratRange={setCaratRange}
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
          toggleShape={toggleShape}
          toggleColor={toggleColor}
          toggleFancyColor={toggleFancyColor}
          toggleClarity={toggleClarity}
          toggleCut={toggleCut}
          toggleType={toggleType}
          togglePolish={togglePolish}
          toggleSymmetry={toggleSymmetry}
          toggleFluorescence={toggleFluorescence}
          setCaratRange={setCaratRange}
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
          onProductClick={handleDiamondClick}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

