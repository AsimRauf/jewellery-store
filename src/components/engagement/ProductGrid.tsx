import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EngagementRing } from '@/types/engagement';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductGridProps {
  products: EngagementRing[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  get14KGoldPrice: (product: EngagementRing) => number;
  onLoadMore: () => void;
  activeMetalFilters: string[];
}

export default function ProductGrid({ 
  products, 
  loading, 
  loadingMore,
  hasMore,
  error, 
  clearAllFilters, 
  onLoadMore,
  activeMetalFilters
}: ProductGridProps) {
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  
  // Function to get the image URL based on metal color with better fallback handling
  const getImageUrl = (product: EngagementRing, metalColor: string): string => {
    try {
      // Check if product has metalColorImages for this color
      if (product.metalColorImages && 
          product.metalColorImages[metalColor] && 
          product.metalColorImages[metalColor].length > 0) {
        return product.metalColorImages[metalColor][0].url;
      }
      
      // Fallback to regular media images
      if (product.media?.images?.length > 0 && product.media.images[0].url) {
        return product.media.images[0].url;
      }
    } catch (error) {
      console.error('Error getting image URL:', error);
    }
    
    // Final fallback to placeholder
    return '/placeholder-ring.jpg';
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}`;
  };

  // Create a ref for the observer
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Create a ref for the last product element
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    // Disconnect the previous observer if it exists
    if (observer.current) observer.current.disconnect();
    
    // Create a new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    // Observe the last product element
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, onLoadMore]);

  // Function to generate SEO-friendly URL with metal option
  const getProductUrl = (product: EngagementRing, metalOption?: {karat: string, color: string}): string => {
    // Create slug from product title
    const slug = product.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Base URL with slug and ID
    let url = `/products/rings/engagement/${slug}-${product._id}`;
    
    // Add metal option as query parameter if provided
    if (metalOption) {
      url += `?metal=${encodeURIComponent(metalOption.karat)}-${encodeURIComponent(metalOption.color)}`;
    }
    
    return url;
  };

  // Function to handle adding to cart
  const handleAddToCart = (productId: string, metalOption: {karat: string, color: string}) => {
    console.log('=== ADD TO CART CLICKED ===');
    console.log('Product ID:', productId);
    
    // Prevent multiple clicks
    if (addingProductId) {
      console.log('Already adding a product, ignoring this click');
      return;
    }
    
    setAddingProductId(productId);
    
    const product = products.find(p => p._id === productId);
    if (!product) {
      console.log('Product not found');
      setAddingProductId(null);
      return;
    }
    
    console.log('Found product:', product.title);
    
    // Find the selected metal option
    const selectedMetal = product.metalOptions.find(option => 
      option.karat === metalOption.karat && option.color === metalOption.color
    );
    
    if (!selectedMetal) {
      console.log('Metal option not found');
      setAddingProductId(null);
      return;
    }
    
    // Add a unique timestamp to the operation
    const operationId = Date.now();
    console.log('Operation ID:', operationId);
    
    // Add the product to cart
    addItem({
      _id: product._id,
      title: product.title,
      price: selectedMetal.price,
      quantity: 1,
      image: getImageUrl(product, metalOption.color),
      metalOption: {
        karat: metalOption.karat,
        color: metalOption.color
      },
      productType: 'engagement'
    });
    
    // Show a toast notification
    toast.success(`Added ${product.title} (${metalOption.karat} ${metalOption.color}) to cart!`, {
      position: 'bottom-right',
      duration: 3000
    });
    
    // Reset after a short delay
    setTimeout(() => {
      setAddingProductId(null);
    }, 500);
  };

  // Function to expand products with their metal color variants
  const expandProductsWithMetalColors = (
    products: EngagementRing[], 
    activeMetalFilters: string[]
  ): Array<{
    product: EngagementRing;
    metalOption: {karat: string, color: string, price: number};
    imageUrl: string;
  }> => {
    const expandedProducts: Array<{
      product: EngagementRing;
      metalOption: {karat: string, color: string, price: number};
      imageUrl: string;
    }> = [];
    
    products.forEach(product => {
      // Check if product has metalColorImages
      if (product.metalColorImages && Object.keys(product.metalColorImages).length > 0) {
        // For each metal color that has images, create a variant
        Object.keys(product.metalColorImages).forEach(color => {
          // If there are active metal filters, only include matching colors
          if (activeMetalFilters.length > 0 && !activeMetalFilters.includes(color)) {
            return; // Skip this color if it doesn't match the active filters
          }
          
          // Find the matching metal option
          const metalOption = product.metalOptions.find(option => option.color === color);
          
          if (metalOption) {
            expandedProducts.push({
              product,
              metalOption: {
                karat: metalOption.karat,
                color: metalOption.color,
                price: metalOption.price
              },
              imageUrl: getImageUrl(product, color)
            });
          }
        });
        
        // If no variants were added (because of filters) and there are no active metal filters,
        // add the default variant
        if (expandedProducts.filter(ep => ep.product._id === product._id).length === 0 && activeMetalFilters.length === 0) {
          const defaultMetal = product.metalOptions.find(option => option.isDefault) || product.metalOptions[0];
          
          expandedProducts.push({
            product,
            metalOption: {
              karat: defaultMetal.karat,
              color: defaultMetal.color,
              price: defaultMetal.price
            },
            imageUrl: getImageUrl(product, defaultMetal.color)
          });
        }
      } else {
        // If no metalColorImages, just use the default metal option
        const defaultMetal = product.metalOptions.find(option => option.isDefault) || product.metalOptions[0];
        
        // Only add if there are no metal filters or if the default metal matches the filters
        if (activeMetalFilters.length === 0 || activeMetalFilters.includes(defaultMetal.color)) {
          expandedProducts.push({
            product,
            metalOption: {
              karat: defaultMetal.karat,
              color: defaultMetal.color,
              price: defaultMetal.price
            },
            imageUrl: getImageUrl(product, defaultMetal.color)
          });
        }
      }
    });
    
    return expandedProducts;
  };

  // Expand products with their metal color variants
  const expandedProducts = expandProductsWithMetalColors(products, activeMetalFilters);

  if (loading && products.length === 0) {
    return (
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
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (expandedProducts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg mb-4">No products match your selected filters.</p>
        <button 
          onClick={clearAllFilters}
          className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {expandedProducts.map((item, index) => (
          <div 
            key={`${item.product._id}-${item.metalOption.color}`}
            ref={index === expandedProducts.length - 1 ? lastProductRef : null}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <Link href={getProductUrl(item.product, item.metalOption)}>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.product.title} - ${item.metalOption.karat} ${item.metalOption.color}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transform hover:scale-110 transition-transform duration-500"
                    priority={index < 4}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
                    onError={(e) => {
                      // If image fails to load, replace with placeholder
                      (e.target as HTMLImageElement).src = '/placeholder-ring.jpg';
                    }}
                  />
                </div>
              </Link>
              
              {/* ADD TO CART BUTTON */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(item.product._id, item.metalOption);
                }}
                disabled={addingProductId === item.product._id}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-md"
                aria-label="Add to cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <div className="p-2 sm:p-4">
              <Link href={getProductUrl(item.product, item.metalOption)}>
                <h3 className="font-cinzel text-sm sm:text-lg mb-1 sm:mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
                  {item.product.title}
                </h3>
              </Link>
              
              <div className="space-y-1">
                <p className="text-amber-600 font-semibold text-base sm:text-xl">
                  ${formatPrice(item.metalOption.price)}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">{item.metalOption.karat} {item.metalOption.color}</p>
              </div>
              
              {/* Metal Options */}
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                {item.product.metalOptions.slice(0, 3).map((metal) => (
                  <Link 
                    key={`${metal.karat}-${metal.color}`}
                    href={getProductUrl(item.product, {karat: metal.karat, color: metal.color})}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      metal.color === item.metalOption.color
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    {metal.karat} {metal.color}
                  </Link>
                ))}
                {item.product.metalOptions.length > 3 && (
                  <Link 
                    href={getProductUrl(item.product, item.metalOption)}
                    className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    +{item.product.metalOptions.length - 3} more
                  </Link>
                )}
              </div>
              
              {item.product.main_stone && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="inline-block">
                    {item.product.main_stone.carat_weight}ct {item.product.main_stone.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {loadingMore && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}
    </div>
  );
}
