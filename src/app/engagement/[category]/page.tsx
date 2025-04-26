'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RingEnums } from '@/constants/ringEnums';

interface MetalOption {
  karat: string;
  color: string;
  price: number;
  isDefault: boolean;
}

interface MediaImage {
  url: string;
  publicId: string;
}

interface EngagementRing {
  _id: string;
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  main_stone?: {
    type: string;
    gemstone_type?: string;
    carat_weight: number;
  };
  media: {
    images: MediaImage[];
    video: {
      url: string;
      publicId: string;
    };
  };
  description: string;
}

// Define filter state interface
interface FilterState {
  styles: string[];
  types: string[];
  metalColors: string[];
  priceRange: [number, number] | null;
  caratRange: [number, number] | null;
  gemstoneTypes: string[];
  stoneTypes: string[];
}

// Style images mapping
const STYLE_IMAGES: Record<string, string> = {
  'Vintage': '/icons/styles/vintage.svg',
  'Nature Inspired': '/icons/styles/nature-inspired.svg',
  'Floral': '/icons/styles/floral.svg',
  'Classic': '/icons/styles/classic.svg',
  'Celtic': '/icons/styles/celtic.svg',
  'Branch': '/icons/styles/branch.svg'
};

export default function EngagementCategoryPage() {
  const [products, setProducts] = useState<EngagementRing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    priceRanges: [],
    caratRanges: [],
    gemstoneTypes: [],
    stoneTypes: []
  });
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    styles: [],
    types: [],
    metalColors: [],
    priceRange: null,
    caratRange: null,
    gemstoneTypes: [],
    stoneTypes: []
  });
  
  const params = useParams() as { category: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = params.category as string | undefined; // Make sure category is defined

  // Function to toggle filter sections
  const toggleFilterSection = (section: string) => {
    if (activeFilterSection === section) {
      setActiveFilterSection(null);
    } else {
      setActiveFilterSection(section);
    }
  };

  // Function to toggle style selection
  const toggleStyle = (style: string) => {
    setFilters(prev => {
      if (prev.styles.includes(style)) {
        return { ...prev, styles: prev.styles.filter(s => s !== style) };
      } else {
        return { ...prev, styles: [...prev.styles, style] };
      }
    });
  };

  // Function to toggle type selection
  const toggleType = (type: string) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  // Function to toggle gemstone type selection
  const toggleGemstoneType = (gemstoneType: string) => {
    setFilters(prev => {
      if (prev.gemstoneTypes.includes(gemstoneType)) {
        return { ...prev, gemstoneTypes: prev.gemstoneTypes.filter(g => g !== gemstoneType) };
      } else {
 return { ...prev, gemstoneTypes: [...prev.gemstoneTypes, gemstoneType] };
      }
    });
  };

  // Function to toggle stone type selection
  const toggleStoneType = (stoneType: string) => {
    setFilters(prev => {
      if (prev.stoneTypes.includes(stoneType)) {
        return { ...prev, stoneTypes: prev.stoneTypes.filter(s => s !== stoneType) };
      } else {
        return { ...prev, stoneTypes: [...prev.stoneTypes, stoneType] };
      }
    });
  };

  // Function to set price range
  const setPriceRange = (range: [number, number] | null) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  // Function to set carat range
  const setCaratRange = (range: [number, number] | null) => {
    setFilters(prev => ({ ...prev, caratRange: range }));
  };

  // Function to clear all filters
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

  // Function to apply filters
  const applyFilters = () => {
    if (!searchParams) return; // Check if searchParams is defined
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
    if (!searchParams) return; // Ensure searchParams is defined
    const stylesParam = searchParams.get('styles');
    const typesParam = searchParams.get('types');
    const metalColorsParam = searchParams.get('metalColors');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minCaratParam = searchParams.get('minCarat');
    const maxCaratParam = searchParams.get('maxCarat');
    const gemstoneTypesParam = searchParams.get('gemstoneTypes');
    const stoneTypesParam = searchParams.get('stoneTypes');
    
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
    }
  }, [category]);

  // Memoize filters to maintain consistent reference
  const [queryParams, setQueryParams] = useState(new URLSearchParams());

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

    setQueryParams(newParams);
  }, [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/engagement/${category || 'all'}?${queryParams.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        
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
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, queryParams]); // Stable dependency array

  const get14KGoldPrice = (product: EngagementRing): number => {
    const gold14K = product.metalOptions.find(
      option => option.karat === '14K' && option.color === 'Yellow Gold'
    ) || product.metalOptions.find(
      option => option.karat === '14K'
    );
    
    return gold14K ? gold14K.price : product.basePrice;
  };

  const getFirstImageUrl = (product: EngagementRing): string => {
    if (product.media?.images?.length > 0 && product.media.images[0].url) {
      return product.media.images[0].url;
    }
    return '/placeholder-ring.jpg';
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel text-center mb-8">{getCategoryTitle()}</h1>
      
      <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => toggleFilterSection('style')}
              className={`px-4 py-2 rounded-full border ${
                activeFilterSection === 'style' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
              } transition-colors flex items-center gap-2`}
            >
              <span>Shop by Style</span>
              <svg 
                className={`h-4 w-4 transition-transform ${activeFilterSection === 'style' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => toggleFilterSection('type')}
              className={`px-4 py-2 rounded-full border ${
                activeFilterSection === 'type' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
              } transition-colors flex items-center gap-2`}
            >
              <span>Ring Type</span>
              <svg 
                className={`h-4 w-4 transition-transform ${activeFilterSection === 'type' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => toggleFilterSection('price')}
              className={`px-4 py-2 rounded-full border ${
                activeFilterSection === 'price' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
              } transition-colors flex items-center gap-2`}
            >
              <span>Price Range</span>
              <svg 
                className={`h-4 w-4 transition-transform ${activeFilterSection === 'price' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => toggleFilterSection('carat')}
              className={`px-4 py-2 rounded-full border ${
                activeFilterSection === 'carat' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
              } transition-colors flex items-center gap-2`}
            >
              <span>Carat Weight</span>
              <svg 
                className={`h-4 w-4 transition-transform ${activeFilterSection === 'carat' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l- 7 7-7-7" />
              </svg>
            </button>
            
            {availableFilters.stoneTypes.length > 0 && (
              <button 
                onClick={() => toggleFilterSection('stoneType')}
                className={`px-4 py-2 rounded-full border ${
                  activeFilterSection === 'stoneType' 
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors flex items-center gap-2`}
              >
                <span>Stone Type</span>
                <svg 
                  className={`h-4 w-4 transition-transform ${activeFilterSection === 'stoneType' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {availableFilters.gemstoneTypes.length > 0 && (
              <button 
                onClick={() => toggleFilterSection('gemstoneType')}
                className={`px-4 py-2 rounded-full border ${
                  activeFilterSection === 'gemstoneType' 
                    ? 'bg-amber-500 text-white border-amber-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                } transition-colors flex items-center gap-2`}
              >
                <span>Gemstone Type</span>
                <svg 
                  className={`h-4 w-4 transition-transform ${activeFilterSection === 'gemstoneType' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            <button 
              onClick={() => toggleFilterSection('metal')}
              className={`px-4 py-2 rounded-full border ${
                activeFilterSection === 'metal' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
              } transition-colors flex items-center gap-2`}
            >
              <span>Metal Color</span>
              <svg 
                className={`h-4 w-4 transition-transform ${activeFilterSection === 'metal' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {activeFilterSection === 'style' && availableFilters.styles.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6">
                {availableFilters.styles.map((style) => (
                  <div 
                    key={style} 
                    onClick={() => toggleStyle(style)}
                    className={`cursor-pointer flex flex-col items-center transition-all ${
                      filters.styles.includes(style) 
                        ? 'scale-110 text-amber-500' 
                        : 'text-gray-700 hover:text-amber-400'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 border-2 ${
                      filters.styles.includes(style) ? 'border-amber-500' : 'border-gray-200'
                    }`}>
                      <Image 
                        src={STYLE_IMAGES[style] || '/icons/styles/classic.svg'} 
                        alt={style} 
                        width={50} 
                        height={50}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm text-center">{style}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'type' && availableFilters.types.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                {availableFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 rounded-full border ${
                      filters.types.includes(type) 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                    } transition-colors`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'price' && availableFilters.priceRanges.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.priceRange && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  Under $1,000
                </button>
                <button
                  onClick={() => setPriceRange([1000, 2500])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.priceRange && filters.priceRange[0] === 1000 && filters.priceRange[1] === 2500
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  $1,000 - $2,500
                </button>
                <button
                  onClick={() => setPriceRange([2500, 5000])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.priceRange && filters.priceRange[0] === 2500 && filters.priceRange[1] === 5000
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  $2,500 - $5,000
                </button>
                <button
                  onClick={() => setPriceRange([5000, 10000])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.priceRange && filters.priceRange[0] === 5000 && filters.priceRange[1] === 10000
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  $5,000 - $10,000
                </button>
                <button
                  onClick={() => setPriceRange([10000, 1000000])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.priceRange && filters.priceRange[0] === 10000 && filters.priceRange[1] === 1000000
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  $10,000+
                </button>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'carat' && availableFilters.caratRanges.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setCaratRange([0, 0.5])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.caratRange && filters.caratRange[0] === 0 && filters.caratRange[1] === 0.5
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  Under 0.5 ct
                </button>
                <button
                  onClick={() => setCaratRange([0.5, 1])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.caratRange && filters.caratRange[0] === 0.5 && filters.caratRange[1] === 1
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  0.5 - 1 ct
                </button>
                <button
                  onClick={() => setCaratRange([1, 2])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.caratRange && filters.caratRange[0] === 1 && filters.caratRange[1] === 2
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  1 - 2 ct
                </button>
                <button
                  onClick={() => setCaratRange([2, 3])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.caratRange && filters.caratRange[0] === 2 && filters.caratRange[1] === 3
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  2 - 3 ct
                </button>
                <button
                  onClick={() => setCaratRange([3, 100])}
                  className={`px-4 py-2 rounded-full border ${
                    filters.caratRange && filters.caratRange[0] === 3 && filters.caratRange[1] === 100
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                  } transition-colors`}
                >
                  3+ ct
                </button>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'stoneType' && availableFilters.stoneTypes.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                {availableFilters.stoneTypes.map((stoneType) => (
                  <button
                    key={stoneType}
                    onClick={() => toggleStoneType(stoneType)}
                    className={`px-4 py-2 rounded-full border ${
                      filters.stoneTypes.includes(stoneType) 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                    } transition-colors`}
                  >
                    {stoneType}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'gemstoneType' && availableFilters.gemstoneTypes.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                {availableFilters.gemstoneTypes.map((gemstoneType) => (
                  <button
                    key={gemstoneType}
                    onClick={() => toggleGemstoneType(gemstoneType)}
                    className={`px-4 py-2 rounded-full border ${
                      filters.gemstoneTypes.includes(gemstoneType) 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                    } transition-colors`}
                  >
                    {gemstoneType}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'metal' && availableFilters.metalColors.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                {availableFilters.metalColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleMetalColor(color)}
                    className={`px-4 py-2 rounded-full border ${
                      filters.metalColors.includes(color) 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                    } transition-colors`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {(filters.styles.length > 0 || 
            filters.types.length > 0 || 
            filters.priceRange || 
            filters.caratRange || 
            filters.gemstoneTypes.length > 0 || 
            filters.stoneTypes.length > 0) && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-gray-700 font-medium">Active Filters:</span>
                
                {filters.styles.map(style => (
                  <span 
                    key={`style-${style}`}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {style}
                    <button 
                      onClick={() => toggleStyle(style)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                
                {filters.types.map(type => (
                  <span 
                    key={`type-${type}`}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {type}
                    <button 
                      onClick={() => toggleType(type)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
                    </button>
                  </span>
                ))}
                
                {filters.priceRange && (
                  <span 
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {`$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`}
                    <button 
                      onClick={() => setPriceRange(null)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                
                {filters.caratRange && (
                  <span 
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {`${filters.caratRange[0]} - ${filters.caratRange[1]} ct`}
                    <button 
                      onClick={() => setCaratRange(null)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                
                {filters.gemstoneTypes.map(gemstoneType => (
                  <span 
                    key={`gemstone-${gemstoneType}`}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {gemstoneType}
                    <button 
                      onClick={() => toggleGemstoneType(gemstoneType)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                
                {filters.stoneTypes.map(stoneType => (
                  <span 
                    key={`stone-${stoneType}`}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {stoneType}
                    <button 
                      onClick={() => toggleStoneType(stoneType)}
                      className="ml-1 text-amber-800 hover:text-amber-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                
                <button 
                  onClick={clearAllFilters}
                  className="px-3 py-1 text-gray-600 text-sm hover:text-amber-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={applyFilters}
                  className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {loading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
        </p>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
          <select 
            id="sort" 
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus :ring-amber-500 focus:border-amber-500"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl"></div>
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No products match your selected filters.</p>
          <button 
            onClick={clearAllFilters}
            className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {filteredProducts.map((product) => (
          <Link href={`/products/rings/engagement/${product._id}`} key={product._id}>
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={getFirstImageUrl(product)}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors">
                    Quick View
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-cinzel text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-amber-500 transition-colors">
                  {product.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-amber-600 font-semibold text-lg sm:text-xl">
                    {formatPrice(get14KGoldPrice(product))}
                  </p>
                  <p className="text-gray-500 text-sm">Starting at 14K Gold</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.metalOptions.slice(0, 3).map((metal, index) => (
                    <span 
                      key={`${metal.karat}-${metal.color}`}
                      className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600"
                    >
                      {metal.karat} {metal.color}
                    </span>
                  ))}
                  {product.metalOptions.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                      +{product.metalOptions.length - 3} more
                    </span>
                  )}
                </div>
                {product.main_stone && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="inline-block">
                      {product.main_stone.carat_weight}ct {product.main_stone.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}