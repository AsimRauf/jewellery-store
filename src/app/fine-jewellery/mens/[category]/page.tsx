'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/mens-jewelry/FilterBar';
import MobileFilters from '@/components/mens-jewelry/MobileFilters';
import SortingOptions from '@/components/mens-jewelry/SortingOptions';
import ProductGrid from '@/components/mens-jewelry/ProductGrid';
import { MensJewelry } from '@/types/mens-jewelry';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';
import { getMensJewelryTitle } from '@/utils/product-helper';
import { MensJewelryProduct } from '@/types/product';
 
 // Define available filter options
const availableFilters = {
  types: ['Ring', 'Necklace', 'Bracelet', 'Watch', 'Cufflinks', 'Tie Clip', 'Chain', 'Pendant', 'Signet Ring', 'Wedding Band'],
  metals: ['14K Gold', '18K Gold', 'White Gold', 'Rose Gold', 'Yellow Gold', 'Platinum', 'Sterling Silver', 'Titanium', 'Stainless Steel', 'Tungsten', 'Palladium'],
  styles: ['Classic', 'Modern', 'Vintage', 'Industrial', 'Minimalist', 'Bold', 'Executive', 'Casual'],
  finishes: ['Polished', 'Matte', 'Brushed', 'Hammered', 'Sandblasted', 'Antiqued'],
  sizes: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'Custom'],
  lengths: ['18"', '20"', '22"', '24"', '26"', '28"', '30"', 'Custom'],
  widths: ['2mm', '3mm', '4mm', '5mm', '6mm', '7mm', '8mm', '10mm', '12mm', '15mm'],
  thicknesses: ['1mm', '1.5mm', '2mm', '2.5mm', '3mm', '4mm', '5mm', '6mm'],
  weights: ['Under 5g', '5-10g', '10-20g', '20-30g', '30-50g', '50g+'],
  priceRanges: [[100, 300], [300, 600], [600, 1200], [1200, 2500], [2500, 5000], [5000, 10000], [10000, 25000]] as [number, number][]
};

export default function MensJewelryCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  // Ensure category is a string, defaulting to 'all' if undefined
  const category = params?.category ? String(params.category) : 'all';
  
  // State for filters
  const [filters, setFilters] = useState({
    types: [] as string[],
    metals: [] as string[],
    styles: [] as string[],
    finishes: [] as string[],
    sizes: [] as string[],
    lengths: [] as string[],
    widths: [] as string[],
    thicknesses: [] as string[],
    weights: [] as string[],
    engravingAvailable: false,
    priceRange: null as [number, number] | null
  });
  
  // State for active filter section
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for sorting
  const [sortOption, setSortOption] = useState('price-asc');
  
  // State for products
  const [products, setProducts] = useState<MensJewelry[]>([]);
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
      const metals = searchParams.get('metals')?.split(',') || [];
      const styles = searchParams.get('styles')?.split(',') || [];
      const finishes = searchParams.get('finishes')?.split(',') || [];
      const sizes = searchParams.get('sizes')?.split(',') || [];
      const lengths = searchParams.get('lengths')?.split(',') || [];
      const widths = searchParams.get('widths')?.split(',') || [];
      const thicknesses = searchParams.get('thicknesses')?.split(',') || [];
      const weights = searchParams.get('weights')?.split(',') || [];
      const engravingAvailable = searchParams.get('engraving') === 'true';
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sort = searchParams.get('sort') || 'price-asc';
      
      // Set filters based on URL parameters
      setFilters({
        types: types.filter(t => availableFilters.types.includes(t)),
        metals: metals.filter(m => availableFilters.metals.includes(m)),
        styles: styles.filter(s => availableFilters.styles.includes(s)),
        finishes: finishes.filter(f => availableFilters.finishes.includes(f)),
        sizes: sizes.filter(s => availableFilters.sizes.includes(s)),
        lengths: lengths.filter(l => availableFilters.lengths.includes(l)),
        widths: widths.filter(w => availableFilters.widths.includes(w)),
        thicknesses: thicknesses.filter(t => availableFilters.thicknesses.includes(t)),
        weights: weights.filter(w => availableFilters.weights.includes(w)),
        engravingAvailable,
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
        
        if (filters.metals.length > 0) {
          queryParams.append('metals', filters.metals.join(','));
        }
        
        if (filters.styles.length > 0) {
          queryParams.append('styles', filters.styles.join(','));
        }
        
        if (filters.finishes.length > 0) {
          queryParams.append('finishes', filters.finishes.join(','));
        }
        
        if (filters.sizes.length > 0) {
          queryParams.append('sizes', filters.sizes.join(','));
        }
        
        if (filters.lengths.length > 0) {
          queryParams.append('lengths', filters.lengths.join(','));
        }
        
        if (filters.widths.length > 0) {
          queryParams.append('widths', filters.widths.join(','));
        }
        
        if (filters.thicknesses.length > 0) {
          queryParams.append('thicknesses', filters.thicknesses.join(','));
        }
        
        if (filters.weights.length > 0) {
          queryParams.append('weights', filters.weights.join(','));
        }
        
        if (filters.engravingAvailable) {
          queryParams.append('engraving', 'true');
        }
        
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0].toString());
          queryParams.append('maxPrice', filters.priceRange[1].toString());
        }
        
        // Add sort option
        queryParams.append('sort', sortOption);
        
        // Fetch products
        const response = await fetch(`/api/products/mens-jewelry/${category}?${queryParams.toString()}`);
        
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
      
      if (filters.metals.length > 0) {
        queryParams.append('metals', filters.metals.join(','));
      }
      
      if (filters.styles.length > 0) {
        queryParams.append('styles', filters.styles.join(','));
      }
      
      if (filters.finishes.length > 0) {
        queryParams.append('finishes', filters.finishes.join(','));
      }
      
      if (filters.sizes.length > 0) {
        queryParams.append('sizes', filters.sizes.join(','));
      }
      
      if (filters.lengths.length > 0) {
        queryParams.append('lengths', filters.lengths.join(','));
      }
      
      if (filters.widths.length > 0) {
        queryParams.append('widths', filters.widths.join(','));
      }
      
      if (filters.thicknesses.length > 0) {
        queryParams.append('thicknesses', filters.thicknesses.join(','));
      }
      
      if (filters.weights.length > 0) {
        queryParams.append('weights', filters.weights.join(','));
      }
      
      if (filters.engravingAvailable) {
        queryParams.append('engraving', 'true');
      }
      
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }
      
      // Add sort option
      queryParams.append('sort', sortOption);
      
      // Fetch more products
      const response = await fetch(`/api/products/mens-jewelry/${category}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch more products');
      }
      
      const data = await response.json();
      setProducts((prev: MensJewelry[]) => [...prev, ...data.products]);
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
    
    if (filters.metals.length > 0) {
      queryParams.append('metals', filters.metals.join(','));
    }
    
    if (filters.styles.length > 0) {
      queryParams.append('styles', filters.styles.join(','));
    }
    
    if (filters.finishes.length > 0) {
      queryParams.append('finishes', filters.finishes.join(','));
    }
    
    if (filters.sizes.length > 0) {
      queryParams.append('sizes', filters.sizes.join(','));
    }
    
    if (filters.lengths.length > 0) {
      queryParams.append('lengths', filters.lengths.join(','));
    }
    
    if (filters.widths.length > 0) {
      queryParams.append('widths', filters.widths.join(','));
    }
    
    if (filters.thicknesses.length > 0) {
      queryParams.append('thicknesses', filters.thicknesses.join(','));
    }
    
    if (filters.weights.length > 0) {
      queryParams.append('weights', filters.weights.join(','));
    }
    
    if (filters.engravingAvailable) {
      queryParams.append('engraving', 'true');
    }
    
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange[0].toString());
      queryParams.append('maxPrice', filters.priceRange[1].toString());
    }
    
    // Add sort option
    queryParams.append('sort', sortOption);
    
    // Update URL
    const url = `/fine-jewellery/mens/${category}?${queryParams.toString()}`;
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
  
  const toggleFinish = (finish: string) => {
    setFilters(prev => ({
      ...prev,
      finishes: prev.finishes.includes(finish)
        ? prev.finishes.filter(f => f !== finish)
        : [...prev.finishes, finish]
    }));
  };
  
  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
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
  
  const toggleThickness = (thickness: string) => {
    setFilters(prev => ({
      ...prev,
      thicknesses: prev.thicknesses.includes(thickness)
        ? prev.thicknesses.filter(t => t !== thickness)
        : [...prev.thicknesses, thickness]
    }));
  };
  
  const toggleWeight = (weight: string) => {
    setFilters(prev => ({
      ...prev,
      weights: prev.weights.includes(weight)
        ? prev.weights.filter(w => w !== weight)
        : [...prev.weights, weight]
    }));
  };
  
  const toggleEngraving = () => {
    setFilters(prev => ({
      ...prev,
      engravingAvailable: !prev.engravingAvailable
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
      metals: [],
      styles: [],
      finishes: [],
      sizes: [],
      lengths: [],
      widths: [],
      thicknesses: [],
      weights: [],
      engravingAvailable: false,
      priceRange: null
    });
  };
  
  const applyFilters = () => {
    updateUrlWithFilters();
    setShowMobileFilters(false);
  };
  
  // Get category display name
  const getCategoryDisplayName = () => {
    if (!category || category === 'all') return 'All Men\'s Jewelry';
    
    // Handle specific jewelry types
    if (availableFilters.types.some(type => 
      category.toLowerCase() === type.toLowerCase() ||
      category.toLowerCase() === type.toLowerCase().replace(' ', '-')
    )) {
      const matchedType = availableFilters.types.find(type => 
        category.toLowerCase() === type.toLowerCase() ||
        category.toLowerCase() === type.toLowerCase().replace(' ', '-')
      );
      return `Men's ${matchedType}s`;
    }
    
    // Handle metal categories
    if (category.startsWith('metal-')) {
      const metal = category
        .replace('metal-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `Men's ${metal} Jewelry`;
    }
    
    // Handle style categories
    if (category.startsWith('style-')) {
      const style = category
        .replace('style-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `Men's ${style} Jewelry`;
    }
    
    return 'Men\'s Jewelry';
  };

  const handleProductClick = (product: MensJewelry) => {
    const productSlug = product.slug || product._id;
    router.push(`/fine-jewellery/mens/detail/${productSlug}`);
  };

  const handleAddToCart = (product: MensJewelry) => {
    const { size, length, width, thickness, ...rest } = product;
    const mensProduct: MensJewelryProduct = {
      ...rest,
      productType: 'mens-jewelry',
      title: product.name, // Pass name to title for the helper
      imageUrl: product.images?.[0]?.url || '',
      size: size || '',
      length: parseFloat(length || '0'),
      width: parseFloat(width || '0'),
      thickness: parseFloat(thickness || '0'),
    };

    const cartItem: CartItem = {
      _id: product._id,
      title: getMensJewelryTitle(mensProduct),
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.images?.[0]?.url || '',
      productType: 'mens-jewelry',
      customization: {
        isCustomized: false,
        customizationDetails: {
          metal: product.metal,
          style: product.style,
          type: product.type,
          finish: product.finish,
          size: product.size,
          length: product.length
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
          {totalProducts} {totalProducts === 1 ? 'item' : 'items'} available
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
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <FilterBar
            filters={filters}
            availableFilters={availableFilters}
            activeFilterSection={activeFilterSection}
            toggleFilterSection={toggleFilterSection}
            toggleType={toggleType}
            toggleMetal={toggleMetal}
            toggleStyle={toggleStyle}
            toggleFinish={toggleFinish}
            toggleSize={toggleSize}
            toggleLength={toggleLength}
            toggleWidth={toggleWidth}
            toggleThickness={toggleThickness}
            toggleWeight={toggleWeight}
            toggleEngraving={toggleEngraving}
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
          toggleMetal={toggleMetal}
          toggleStyle={toggleStyle}
          toggleFinish={toggleFinish}
          toggleSize={toggleSize}
          toggleLength={toggleLength}
          toggleWidth={toggleWidth}
          toggleThickness={toggleThickness}
          toggleWeight={toggleWeight}
          toggleEngraving={toggleEngraving}
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
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
