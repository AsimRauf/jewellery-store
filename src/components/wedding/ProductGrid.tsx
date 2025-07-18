import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WeddingRing } from '@/types/wedding';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductGridProps {
  products: WeddingRing[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  get14KGoldPrice: (product: WeddingRing) => number;
  onLoadMore: () => void;
  activeMetalFilters: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading, 
  loadingMore,
  hasMore,
  error, 
  clearAllFilters, 
  onLoadMore,
  activeMetalFilters
}) => {
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  
  // Helper function to get the image URL for a product and color
  const getImageUrl = (product: WeddingRing, color: string): string => {
    // If the product has metal color images for the specified color, use the first one
    if (color && product.metalColorImages && product.metalColorImages[color] && product.metalColorImages[color].length > 0) {
      return product.metalColorImages[color][0].url;
    }
    
    // Otherwise, use the first image from the product's media
    if (product.media && product.media.images && product.media.images.length > 0) {
      return product.media.images[0].url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-image.jpg'; // Make sure this file exists in your public directory
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
  const getProductUrl = (product: WeddingRing, metalOption?: {karat: string, color: string}): string => {
    // Use the product's slug or fallback to ID
    const identifier = product.slug || product._id;
    
    // Base URL with slug/ID
    let url = `/wedding/detail/${identifier}`;
    
    // Add metal option as query parameter if provided
    if (metalOption) {
      url += `?metal=${encodeURIComponent(metalOption.karat)}-${encodeURIComponent(metalOption.color)}`;
    }
    
    return url;
  };

  // Function to handle adding to cart
  const handleAddToCart = (productId: string, metalOption: {karat: string, color: string}) => {
    // Prevent multiple clicks
    if (addingProductId) {
      return;
    }
    
    setAddingProductId(productId);
    
    const product = products.find(p => p._id === productId);
    if (!product) {
      setAddingProductId(null);
      return;
    }
    
    // Find the selected metal option
    const selectedMetal = product.metalOptions.find(option => 
      option.karat === metalOption.karat && option.color === metalOption.color
    );
    
    if (!selectedMetal) {
      setAddingProductId(null);
      return;
    }
    
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
      productType: 'wedding'
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
    products: WeddingRing[], 
    activeMetalFilters: string[]
  ): Array<{
    product: WeddingRing;
    metalOption: {karat: string, color: string, price: number, finish_type?: string | null};
    imageUrl: string;
  }> => {
    const expandedProducts: Array<{
      product: WeddingRing;
      metalOption: {karat: string, color: string, price: number, finish_type?: string | null};
      imageUrl: string;
    }> = [];
    
    // Guard clause for undefined or null products
    if (!products || !Array.isArray(products)) {
      console.log('No products to expand');
      return [];
    }

    products.forEach(product => {
      // Ensure product and metalOptions exist
      if (!product || !product.metalOptions || !Array.isArray(product.metalOptions)) {
        console.log('Product or metalOptions missing:', product?.title);
        return;
      }

      // If we have metal color images, use them
      if (product.metalColorImages && Object.keys(product.metalColorImages).length > 0) {
        let addedAnyVariant = false;
        
        // For each metal color image, add a product variant if it matches the active filters
        Object.keys(product.metalColorImages).forEach(color => {
          
          // If activeMetalFilters is empty, show all colors
          // Otherwise, only show colors that match the active filters
          if (activeMetalFilters.length > 0 && !activeMetalFilters.includes(color)) {
            return;
          }
          
          const metalOption = product.metalOptions.find(option => option.color === color);
          
          if (metalOption) {
            expandedProducts.push({
              product,
              metalOption: {
                karat: metalOption.karat,
                color: metalOption.color,
                price: metalOption.price,
                finish_type: metalOption.finish_type
              },
              imageUrl: getImageUrl(product, color)
            });
            addedAnyVariant = true;
          } else {
          }
        });
        
        // If no variants were added (because of filters) and there are no active metal filters,
        // add the prioritized variant (14K if available, else 18K, else first available)
        if (!addedAnyVariant && activeMetalFilters.length === 0) {
          let defaultMetal = product.metalOptions.find(option => option.karat === "14K");
          if (!defaultMetal) {
            defaultMetal = product.metalOptions.find(option => option.karat === "18K");
          }
          if (!defaultMetal) {
            defaultMetal = product.metalOptions[0];
          }
          
          if (defaultMetal) {
            expandedProducts.push({
              product,
              metalOption: {
                karat: defaultMetal.karat,
                color: defaultMetal.color,
                price: defaultMetal.price,
                finish_type: defaultMetal.finish_type
              },
              imageUrl: getImageUrl(product, defaultMetal.color)
            });
          } else {
          }
        }
      } else {
        // If no metal color images, prioritize 14K, then 18K, then first available
        let defaultMetal = product.metalOptions.find(option => option.karat === "14K");
        if (!defaultMetal) {
          defaultMetal = product.metalOptions.find(option => option.karat === "18K");
        }
        if (!defaultMetal) {
          defaultMetal = product.metalOptions[0];
        }
        
        // Only add if there are no metal filters or if the default metal matches the filters
        if (defaultMetal && (activeMetalFilters.length === 0 || activeMetalFilters.includes(defaultMetal.color))) {
          expandedProducts.push({
            product,
            metalOption: {
              karat: defaultMetal.karat,
              color: defaultMetal.color,
              price: defaultMetal.price,
              finish_type: defaultMetal.finish_type
            },
            imageUrl: getImageUrl(product, defaultMetal.color)
          });
        } else {
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
                  const uniqueMetalColors: { karat: string; color: string; price: number, finish_type?: string | null }[] = [];
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
              
              {/* Display finish type if available */}
              {item.metalOption.finish_type && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="inline-block">
                    {item.metalOption.finish_type} Finish
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

export default ProductGrid;
