import { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EngagementRing } from '@/types/engagement';

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
          >
            <Link href={`/products/rings/engagement/${product._id}`}>
              <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={getFirstImageUrl(product)}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    priority={index < 4} // Only prioritize loading for the first few images
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
                    {product.metalOptions.slice(0, 3).map((metal) => (
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