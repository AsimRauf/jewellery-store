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
}

export default function ProductGrid({ 
  products, 
  loading, 
  loadingMore,
  hasMore,
  error, 
  clearAllFilters, 
  get14KGoldPrice,
  onLoadMore
}: ProductGridProps) {
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  
  const getFirstImageUrl = (product: EngagementRing): string => {
    if (product.media?.images?.length > 0 && product.media.images[0].url) {
      return product.media.images[0].url;
    }
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

  // Function to generate SEO-friendly URL
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

  // SIMPLIFIED ADD TO CART FUNCTION
  const handleAddToCart = (productId: string) => {
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
    
    // Get the default metal option
    const defaultMetal = product.metalOptions.find(option => 
      option.karat === '14K' && option.color === 'Yellow Gold'
    ) || product.metalOptions[0];
    
    // Add a unique timestamp to the operation
    const operationId = Date.now();
    console.log('Operation ID:', operationId);
    
    // Add the product to cart
    addItem({
      _id: product._id,
      title: product.title,
      price: get14KGoldPrice(product),
      quantity: 1,
      image: getFirstImageUrl(product),
      metalOption: {
        karat: defaultMetal.karat,
        color: defaultMetal.color
      }
    });
    
    // Show a toast notification
    toast.success(`Added ${product.title} to cart!`, {
      position: 'bottom-right',
      duration: 3000
    });
    
    // Reset after a short delay
    setTimeout(() => {
      setAddingProductId(null);
    }, 500);
  };

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

  if (products.length === 0) {
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
        {products.map((product, index) => (
          <div 
            key={product._id}
            ref={index === products.length - 1 ? lastProductRef : null}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <Link href={getProductUrl(product)}>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={getFirstImageUrl(product)}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transform hover:scale-110 transition-transform duration-500"
                    priority={index < 4}
                  />
                </div>
              </Link>
              
              {/* SINGLE ADD TO CART BUTTON - POSITIONED ABSOLUTELY */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product._id);
                }}
                disabled={addingProductId === product._id}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-md"
                aria-label="Add to cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <Link href={getProductUrl(product)}>
                <h3 className="font-cinzel text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
                  {product.title}
                </h3>
              </Link>
              
              <div className="space-y-1">
                <p className="text-amber-600 font-semibold text-lg sm:text-xl">
                  {formatPrice(product.basePrice)}
                </p>
                <p className="text-gray-500 text-sm">Starting price</p>
              </div>
              
              {/* Metal Options - Now Clickable */}
              <div className="mt-3 flex flex-wrap gap-1">
                {product.metalOptions.slice(0, 3).map((metal) => (
                  <Link 
                    key={`${metal.karat}-${metal.color}`}
                    href={getProductUrl(product, {karat: metal.karat, color: metal.color})}
                    className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    {metal.karat} {metal.color}
                  </Link>
                ))}
                {product.metalOptions.length > 3 && (
                  <Link 
                    href={getProductUrl(product)}
                    className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    +{product.metalOptions.length - 3} more
                  </Link>
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
