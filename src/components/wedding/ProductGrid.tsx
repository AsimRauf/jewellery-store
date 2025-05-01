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
    // Create slug from product title
    const slug = product.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Base URL with slug and ID
    let url = `/products/rings/wedding/${slug}-${product._id}`;
    
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
        
        // If no variants were added and no metal filters are active, add the default variant
        if (!addedAnyVariant && activeMetalFilters.length === 0) {
          const defaultMetal = product.metalOptions.find(option => option.isDefault) || product.metalOptions[0];
          
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
        // If no metal color images, just add the default variant
        const defaultMetal = product.metalOptions.find(option => option.isDefault) || product.metalOptions[0];
        
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
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
            
            <div className="p-4">
              <Link href={getProductUrl(item.product, item.metalOption)}>
                <h3 className="font-cinzel text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
                  {item.product.title}
                </h3>
              </Link>
              
              <div className="space-y-1">
                <p className="text-amber-600 font-semibold text-lg sm:text-xl">
                  ${formatPrice(item.metalOption.price)}
                </p>
                <p className="text-gray-500 text-sm">{item.metalOption.karat} {item.metalOption.color}</p>
              </div>
              
              {/* Metal Options */}
              <div className="mt-3 flex flex-wrap gap-1">
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
