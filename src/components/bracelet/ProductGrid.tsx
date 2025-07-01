import { Bracelet } from '@/types/bracelet';
import Image from 'next/image';
import React from 'react';

interface ProductGridProps {
  products: Bracelet[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
  onProductClick: (product: Bracelet) => void;
  onAddToCart: (product: Bracelet) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading, 
  loadingMore,
  hasMore,
  error, 
  clearAllFilters, 
  onLoadMore,
  onProductClick,
  onAddToCart
}) => {
  // Helper function to get the image URL for a product
  const getImageUrl = (product: Bracelet): string => {
    // Use the first image from the product's media
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-bracelet.jpg'; // Make sure this file exists in your public directory
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}`;
  };

  // Create a ref for the observer
  const observer = React.useRef<IntersectionObserver | null>(null);
  
  // Create a ref for the last product element
  const lastProductRef = React.useCallback((node: HTMLDivElement | null) => {
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

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Clear Filters & Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No bracelets found</h3>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any bracelets matching your criteria. Try adjusting your filters.
        </p>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          // Check if this is the last item
          const isLastItem = index === products.length - 1;
          
          return (
            <div 
              key={product._id} 
              ref={isLastItem ? lastProductRef : null}
              className="group cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                <Image
                  src={getImageUrl(product)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {product.type}
                </div>
                {/* Adjustable Badge */}
                {product.adjustable && (
                  <div className="absolute top-2 left-2 mt-7 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Adjustable
                  </div>
                )}
                {/* Sale Badge */}
                {product.salePrice && product.salePrice < product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="absolute bottom-2 right-2 bg-amber-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600"
                  title="Add to Cart"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M7 13h10m0 0v7a1 1 0 01-1 1H8a1 1 0 01-1-1v-7m10-7V5a1 1 0 00-1-1H8a1 1 0 00-1-1v1m10 0H8" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {product.metal} • {product.style}
                  {product.length && ` • ${product.length}`}
                </p>
                <div className="flex items-center">
                  {product.salePrice ? (
                    <>
                      <span className="text-red-600 font-medium">${formatPrice(product.salePrice)}</span>
                      <span className="ml-2 text-gray-500 line-through text-sm">${formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-medium">${formatPrice(product.price)}</span>
                  )}
                </div>
                {/* Stock status */}
                <div className="text-xs">
                  {product.isAvailable ? (
                    <span className="text-green-600">✓ In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More / Loading Indicator */}
      {loadingMore && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 text-gray-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more bracelets...
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
