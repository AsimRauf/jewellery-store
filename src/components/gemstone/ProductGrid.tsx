import { Gemstone } from '@/types/gemstone';
import Image from 'next/image';
import React from 'react';

interface ProductGridProps {
  products: Gemstone[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
  onProductClick: (product: Gemstone) => void;
  onAddToCart: (product: Gemstone) => void;
  isCustomization?: boolean;
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
  isCustomization = false,
}) => {
  // Helper function to get the image URL for a product
  const getImageUrl = (product: Gemstone): string => {
    // Use the first image from the product's media
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-gemstone.jpg'; // Make sure this file exists in your public directory
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
        <h3 className="text-xl font-medium mb-4">No gemstones found</h3>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any gemstones matching your criteria. Try adjusting your filters.
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
                  alt={`${product.type} ${product.carat}ct ${product.color} ${product.clarity} gemstone`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.source === 'lab' && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Lab Grown
                  </div>
                )}
                {product.salePrice && product.salePrice < product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
                {/* Show customization indicator */}
                {isCustomization && (
                  <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                    Complete Ring
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">
                  {product.type} {product.carat}ct {product.color} {product.clarity}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {product.certificateLab && product.certificateLab !== 'None' ? `${product.certificateLab} Certified` : 'Natural Gemstone'}
                </p>
                <div className="flex items-center">
                  {product.salePrice && product.salePrice < product.price ? (
                    <>
                      <span className="text-red-600 font-medium">${formatPrice(product.salePrice)}</span>
                      <span className="ml-2 text-gray-500 line-through text-sm">${formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-medium">${formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Loading more indicator */}
      {loadingMore && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-600">Loading more gemstones...</p>
        </div>
      )}
      
      {/* Load more button - alternative to infinite scroll */}
      {!loadingMore && hasMore && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-50"
          >
            Load More Gemstones
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
