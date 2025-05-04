import { Diamond } from '@/types/diamond';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductGridProps {
  products: Diamond[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading, 
  loadingMore,
  hasMore,
  error, 
  clearAllFilters, 
  onLoadMore
}) => {
  // Helper function to get the image URL for a product
  const getImageUrl = (product: Diamond): string => {
    // Use the first image from the product's media
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-diamond.jpg'; // Make sure this file exists in your public directory
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

  // Function to generate SEO-friendly URL
  const getProductUrl = (product: Diamond): string => {
    return `/diamond/detail/${product._id}`;
  };

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
        <h3 className="text-xl font-medium mb-4">No diamonds found</h3>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any diamonds matching your criteria. Try adjusting your filters.
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
              className="group"
            >
              <Link href={getProductUrl(product)}>
                <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                  <Image
                    src={getImageUrl(product)}
                    alt={`${product.shape} ${product.carat}ct ${product.color} ${product.clarity} diamond`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.type === 'lab' && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Lab Grown
                    </div>
                  )}
                  {product.salePrice && product.salePrice < product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">
                    {product.shape} {product.carat}ct {product.color} {product.clarity}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {product.certificateLab} Certified
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
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* Loading more indicator */}
      {loadingMore && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-600">Loading more diamonds...</p>
        </div>
      )}
      
      {/* Load more button - alternative to infinite scroll */}
      {!loadingMore && hasMore && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-50"
          >
            Load More Diamonds
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;