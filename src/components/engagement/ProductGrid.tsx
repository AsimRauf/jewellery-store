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
    // Use the product's slug or fallback to ID
    const identifier = product.slug || product._id;
    
    // Base URL with slug/ID
    let url = `/engagement/detail/${identifier}`;
    
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
        // add the prioritized variant (14K if available, else 18K, else first available)
        if (expandedProducts.filter(ep => ep.product._id === product._id).length === 0 && activeMetalFilters.length === 0) {
          let defaultMetal = product.metalOptions.find(option => option.karat === "14K");
          if (!defaultMetal) {
            defaultMetal = product.metalOptions.find(option => option.karat === "18K");
          }
          if (!defaultMetal) {
            defaultMetal = product.metalOptions[0];
          }
          
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
        // If no metalColorImages, prioritize 14K, then 18K, then first available
        let defaultMetal = product.metalOptions.find(option => option.karat === "14K");
        if (!defaultMetal) {
          defaultMetal = product.metalOptions.find(option => option.karat === "18K");
        }
        if (!defaultMetal) {
          defaultMetal = product.metalOptions[0];
        }
        
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
              
              {/* Add to Cart button removed as per user request */}
            </div>
            
            <div className="p-2 sm:p-4">
              <Link href={getProductUrl(item.product, item.metalOption)}>
                <h3 className="font-cinzel text-sm sm:text-lg mb-1 sm:mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors capitalize">
                  {item.product.title}
                </h3>
              </Link>
              
              <div className="space-y-1">
                <p className="text-amber-600 font-semibold text-base sm:text-xl">
                  ${formatPrice(item.metalOption.price)}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {(() => {
                    const has14K = item.product.metalOptions.some(opt => opt.color === item.metalOption.color && opt.karat === "14K");
                    const has18K = item.product.metalOptions.some(opt => opt.color === item.metalOption.color && opt.karat === "18K");
                    if (has14K && has18K) {
                      return "14K/18K";
                    } else if (has14K) {
                      return "14K";
                    } else if (has18K) {
                      return "18K";
                    } else {
                      return item.metalOption.karat;
                    }
                  })()} {item.metalOption.color}
                </p>
              </div>
              
              {/* Metal Options as Gradient Circles */}
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
                {(() => {
                  // Group metal options by color and prioritize 14K over 18K
                  const uniqueMetalColors: { karat: string; color: string; price: number }[] = [];
                  const seenColors = new Set();
                  for (const metal of item.product.metalOptions) {
                    if (!seenColors.has(metal.color)) {
                      seenColors.add(metal.color);
                      uniqueMetalColors.push(metal);
                    } else if (metal.karat === "14K") {
                      // If 14K, replace any existing option for this color
                      const index = uniqueMetalColors.findIndex(m => m.color === metal.color);
                      if (index !== -1) {
                        uniqueMetalColors[index] = metal;
                      }
                    }
                  }
                  
                  return uniqueMetalColors.slice(0, 4).map((metal) => (
                    <Link 
                      key={`${metal.karat}-${metal.color}`}
                      href={getProductUrl(item.product, {karat: metal.karat, color: metal.color})}
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform transform ${
                        metal.color === item.metalOption.color
                          ? 'scale-110 border-amber-600'
                          : 'hover:scale-105 border-gray-200'
                      }`}
                      style={{
                        background: 
                          metal.color.includes('Yellow Gold') ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                          metal.color.includes('White Gold') ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' :
                          metal.color.includes('Rose Gold') ? 'linear-gradient(135deg, #F7CDCD, #E8A090)' :
                          metal.color.includes('Platinum') ? 'linear-gradient(135deg, #E5E4E2, #CECECE)' :
                          metal.color.includes('Palladium') ? 'linear-gradient(135deg, #D3D3D3, #B0B0B0)' :
                          metal.color.includes('Two Tone') ? 'linear-gradient(135deg, #FFD700, #C0C0C0)' :
                          'gray'
                      }}
                      title={`${metal.karat} ${metal.color}`}
                    />
                  ));
                })()}
                {item.product.metalOptions.length > 4 && (
                  <Link 
                    href={getProductUrl(item.product, item.metalOption)}
                    className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium transition-transform transform hover:scale-105"
                    title={`+${item.product.metalOptions.length - 4} more options`}
                  >
                    +{item.product.metalOptions.length - 4}
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
