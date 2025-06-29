'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/gemstone/FilterBar';
import MobileFilters from '@/components/gemstone/MobileFilters';
import SortingOptions from '@/components/gemstone/SortingOptions';
import ProductGrid from '@/components/gemstone/ProductGrid';
import CustomizationSteps from '@/components/customize/CustomizationSteps';
import { Gemstone } from '@/types/gemstone';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';

// Define available filter options
const availableFilters = {
  types: ['Ruby', 'Emerald', 'Sapphire', 'Amethyst', 'Aquamarine', 'Topaz', 'Opal', 'Garnet', 'Peridot', 'Tanzanite', 'Tourmaline', 'Citrine', 'Morganite'],
  shapes: ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Radiant', 'Pear', 'Heart', 'Marquise', 'Asscher', 'Trillion', 'Baguette', 'Cabochon'],
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 'Black', 'White', 'Colorless', 'Multi'],
  clarities: ['FL', 'IF', 'VVS', 'VS', 'SI', 'I', 'Opaque', 'Translucent', 'Transparent'],
  cuts: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  caratRanges: [[0.5, 1.0], [1.0, 2.0], [2.0, 3.0], [3.0, 5.0], [5.0, 10.0], [10.0, 20.0]] as [number, number][],
  priceRanges: [[100, 500], [500, 1000], [1000, 2500], [2500, 5000], [5000, 10000], [10000, 25000], [25000, 50000]] as [number, number][],
  sources: ['natural', 'lab'],
  origins: ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America', 'Burma', 'Colombia', 'Brazil', 'Sri Lanka', 'Thailand', 'India', 'Madagascar', 'Zambia', 'Tanzania', 'Russia', 'Afghanistan', 'Mozambique'],
  treatments: ['None', 'Heat', 'Irradiation', 'Fracture Filling', 'Dyeing', 'Oiling', 'Waxing', 'Bleaching', 'Impregnation']
};

export default function GemstoneCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  // Add customization flow parameters
  const settingId = searchParams?.get('settingId');
  const startWith = searchParams?.get('start');
  const selectedMetal = searchParams?.get('metal');
  const selectedSize = searchParams?.get('size');
  
  // Customization flow checks
  const isCustomizationFlow = Boolean(settingId);
  const isCustomizationStart = startWith === 'gemstone';
  const isSettingSelected = Boolean(settingId && selectedMetal && selectedSize);

  // Ensure category is a string, defaulting to 'all' if undefined
  const category = params?.category ? String(params.category) : 'all';
  
  // State for filters
  const [filters, setFilters] = useState({
    types: [] as string[],
    shapes: [] as string[],
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    caratRange: null as [number, number] | null,
    priceRange: null as [number, number] | null,
    sources: [] as string[],
    origins: [] as string[],
    treatments: [] as string[]
  });
  
  // State for active filter section
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('price-asc');
  
  // State for products
  const [products, setProducts] = useState<Gemstone[]>([]);
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
      const shapes = searchParams.get('shapes')?.split(',') || [];
      const colors = searchParams.get('colors')?.split(',') || [];
      const clarities = searchParams.get('clarities')?.split(',') || [];
      const cuts = searchParams.get('cuts')?.split(',') || [];
      const sources = searchParams.get('sources')?.split(',') || [];
      const origins = searchParams.get('origins')?.split(',') || [];
      const treatments = searchParams.get('treatments')?.split(',') || [];
      const minCarat = searchParams.get('minCarat');
      const maxCarat = searchParams.get('maxCarat');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sort = searchParams.get('sort') || 'price-asc';
      
      // Set filters based on URL parameters
      setFilters({
        types: types.filter(t => availableFilters.types.includes(t)),
        shapes: shapes.filter(s => availableFilters.shapes.includes(s)),
        colors: colors.filter(c => availableFilters.colors.includes(c)),
        clarities: clarities.filter(c => availableFilters.clarities.includes(c)),
        cuts: cuts.filter(c => availableFilters.cuts.includes(c)),
        sources: sources.filter(s => availableFilters.sources.includes(s)),
        origins: origins.filter(o => availableFilters.origins.includes(o)),
        treatments: treatments.filter(t => availableFilters.treatments.includes(t)),
        caratRange: minCarat && maxCarat ? [parseFloat(minCarat), parseFloat(maxCarat)] : null,
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
        setPage(1);
        
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '12');
        
        // Add filters to query params
        if (filters.types.length > 0) {
          queryParams.append('types', filters.types.join(','));
        }
        
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
        
        if (filters.sources.length > 0) {
          queryParams.append('sources', filters.sources.join(','));
        }
        
        if (filters.origins.length > 0) {
          queryParams.append('origins', filters.origins.join(','));
        }
        
        if (filters.treatments.length > 0) {
          queryParams.append('treatments', filters.treatments.join(','));
        }
        
        if (filters.caratRange) {
          queryParams.append('minCarat', filters.caratRange[0].toString());
          queryParams.append('maxCarat', filters.caratRange[1].toString());
        }
        
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0].toString());
          queryParams.append('maxPrice', filters.priceRange[1].toString());
        }
        
        // Add sort option
        queryParams.append('sort', sortOption);
        
        // Fetch products
        const response = await fetch(`/api/products/gemstone/${category}?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.pagination.total);
        setHasMore(data.pagination.hasMore);
        
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
      
      if (filters.sources.length > 0) {
        queryParams.append('sources', filters.sources.join(','));
      }
      
      if (filters.origins.length > 0) {
        queryParams.append('origins', filters.origins.join(','));
      }
      
      if (filters.treatments.length > 0) {
        queryParams.append('treatments', filters.treatments.join(','));
      }
      
      if (filters.caratRange) {
        queryParams.append('minCarat', filters.caratRange[0].toString());
        queryParams.append('maxCarat', filters.caratRange[1].toString());
      }
      
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }
      
      // Add sort option
      queryParams.append('sort', sortOption);
      
      // Fetch more products
      const response = await fetch(`/api/products/gemstone/${category}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch more products');
      }
      
      const data = await response.json();
      setProducts((prev: Gemstone[]) => [...prev, ...data.products]);
      setPage(nextPage);
      setHasMore(data.pagination.hasMore);
      
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
    
    if (filters.sources.length > 0) {
      queryParams.append('sources', filters.sources.join(','));
    }
    
    if (filters.origins.length > 0) {
      queryParams.append('origins', filters.origins.join(','));
    }
    
    if (filters.treatments.length > 0) {
      queryParams.append('treatments', filters.treatments.join(','));
    }
    
    if (filters.caratRange) {
      queryParams.append('minCarat', filters.caratRange[0].toString());
      queryParams.append('maxCarat', filters.caratRange[1].toString());
    }
    
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange[0].toString());
      queryParams.append('maxPrice', filters.priceRange[1].toString());
    }
    
    // Add sort option
    queryParams.append('sort', sortOption);
    
    // Preserve customization parameters
    if (startWith) {
      queryParams.append('start', startWith);
    }
    
    const settingId = searchParams?.get('settingId');
    const metal = searchParams?.get('metal');
    const size = searchParams?.get('size');
    
    if (settingId) queryParams.append('settingId', settingId);
    if (metal) queryParams.append('metal', metal);
    if (size) queryParams.append('size', size);
    
    // Update URL
    const url = `/gemstone/${category}?${queryParams.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, sortOption, router, category, startWith, searchParams]);
  
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
  
  const toggleSource = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };
  
  const toggleOrigin = (origin: string) => {
    setFilters(prev => ({
      ...prev,
      origins: prev.origins.includes(origin)
        ? prev.origins.filter(o => o !== origin)
        : [...prev.origins, origin]
    }));
  };
  
  const toggleTreatment = (treatment: string) => {
    setFilters(prev => ({
      ...prev,
      treatments: prev.treatments.includes(treatment)
        ? prev.treatments.filter(t => t !== treatment)
        : [...prev.treatments, treatment]
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
      types: [],
      shapes: [],
      colors: [],
      clarities: [],
      cuts: [],
      sources: [],
      origins: [],
      treatments: [],
      caratRange: null,
      priceRange: null
    });
  };
  
  const applyFilters = () => {
    updateUrlWithFilters();
    setShowMobileFilters(false);
  };
  
  // Get category display name
  const getCategoryDisplayName = () => {
    if (!category || category === 'all') return 'All Gemstones';
    
    if (category === 'natural') return 'Natural Gemstones';
    if (category === 'lab') return 'Lab Grown Gemstones';
    
    if (category.startsWith('type-')) {
      const type = category
        .replace('type-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${type} Gemstones`;
    }
    
    if (category.startsWith('shape-')) {
      const shape = category
        .replace('shape-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${shape} Gemstones`;
    }
    
    if (category.startsWith('color-')) {
      const color = category
        .replace('color-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${color} Gemstones`;
    }
    
    // Handle direct gemstone type names
    const type = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `${type} Gemstones`;
  };

  // Handle gemstone click - should match diamond flow exactly
  const handleGemstoneClick = (gemstone: Gemstone) => {
    const productSlug = gemstone.slug || gemstone._id;
    
    if (isSettingSelected) {
      // Even with setting selected, go to gemstone detail with parameters
      const params = new URLSearchParams(searchParams?.toString() || '');
      router.push(`/gemstone/detail/${productSlug}?${params.toString()}`);
    } else if (isCustomizationStart) {
      // Gemstone-first flow - go to gemstone detail
      router.push(`/gemstone/detail/${productSlug}?start=gemstone`);
    } else {
      // Normal flow - just view gemstone details
      router.push(`/gemstone/detail/${productSlug}`);
    }
  };

  const handleAddToCart = (gemstone: Gemstone) => {
    const cartItem: CartItem = {
      _id: gemstone._id,
      title: `${gemstone.type} ${gemstone.carat}ct ${gemstone.color} ${gemstone.clarity} Gemstone`,
      price: gemstone.salePrice || gemstone.price,
      quantity: 1,
      image: gemstone.images?.[0]?.url || '',
      productType: 'gemstone',
      customization: {
        isCustomized: true,
        customizationType: 'setting-gemstone',
        gemstoneId: gemstone._id,
        customizationDetails: {
          stone: {
            type: 'gemstone',
            carat: gemstone.carat,
            color: gemstone.color,
            clarity: gemstone.clarity,
            cut: gemstone.cut,
            image: gemstone.images?.[0]?.url || ''
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
        <CustomizationSteps
          currentStep={isSettingSelected ? 3 : 2}
          startWith="gemstone"
          gemstoneComplete={true}
          settingComplete={isSettingSelected}
        />
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getCategoryDisplayName()}</h1>
        <p className="text-gray-600 mt-2">
          {totalProducts} {totalProducts === 1 ? 'gemstone' : 'gemstones'} available
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
      <div className="hidden lg:block">
        <FilterBar
          filters={filters}
          availableFilters={availableFilters}
          activeFilterSection={activeFilterSection}
          toggleFilterSection={toggleFilterSection}
          toggleType={toggleType}
          toggleShape={toggleShape}
          toggleColor={toggleColor}
          toggleClarity={toggleClarity}
          toggleCut={toggleCut}
          toggleSource={toggleSource}
          toggleOrigin={toggleOrigin}
          toggleTreatment={toggleTreatment}
          setCaratRange={setCaratRange}
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
          toggleType={toggleType}
          toggleShape={toggleShape}
          toggleColor={toggleColor}
          toggleClarity={toggleClarity}
          toggleCut={toggleCut}
          toggleSource={toggleSource}
          toggleOrigin={toggleOrigin}
          toggleTreatment={toggleTreatment}
          setCaratRange={setCaratRange}
          setPriceRange={setPriceRange}
          clearAllFilters={clearAllFilters}
          applyFilters={applyFilters}
          closeFilters={() => setShowMobileFilters(false)}
        />
      )}
      
      {/* Product Grid */}
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
          onProductClick={handleGemstoneClick}
          onAddToCart={handleAddToCart}
          isCustomization={isCustomizationFlow}
        />
      </div>
    </div>
  );
}
