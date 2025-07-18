import { Setting } from '@/types/settings';
import Image from 'next/image';
import React, { useCallback } from 'react';

interface MetalOption {
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

interface ProductGridProps {
  products: Setting[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
  activeMetalFilters?: string[];
  onProductClick: (setting: Setting) => void;
}

export default function ProductGrid({
  products,
  loading,
  loadingMore,
  hasMore,
  error,
  clearAllFilters,
  onLoadMore,
  onProductClick
}: ProductGridProps) {
  // Create a ref for the observer
  const observer = React.useRef<IntersectionObserver | null>(null);
  
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

  // Get default metal option for a product, prioritizing 14K over 18K
  const getDefaultMetalOption = (product: Setting): MetalOption => {
    let defaultMetal = product.metalOptions.find(option => option.karat === "14K");
    if (!defaultMetal) {
      defaultMetal = product.metalOptions.find(option => option.karat === "18K");
    }
    if (!defaultMetal) {
      defaultMetal = product.metalOptions.find(m => m.isDefault) || product.metalOptions[0];
    }
    return defaultMetal;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
          <p className="font-medium">Error loading settings</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-amber-50 text-amber-700 p-6 rounded-lg max-w-md">
          <h3 className="font-medium text-lg mb-2">No settings found</h3>
          <p className="text-sm">We couldn&apos;t find any settings matching your criteria.</p>
        </div>
        <button 
          onClick={clearAllFilters}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
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
          const isLastItem = index === products.length - 1;
          const metalOption = getDefaultMetalOption(product);
          
          return (
            <div 
              key={product._id}
              ref={isLastItem ? lastProductRef : null}
              onClick={() => onProductClick(product)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={product.metalColorImages[metalOption.color]?.[0]?.url || product.media?.images?.[0]?.url || '/placeholder-ring.jpg'}
                    alt={`${product.title} - ${metalOption.color}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</div>
                  )}
                  {product.onSale && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-1 truncate capitalize">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {(() => {
                      const has14K = product.metalOptions.some(opt => opt.color === metalOption.color && opt.karat === "14K");
                      const has18K = product.metalOptions.some(opt => opt.color === metalOption.color && opt.karat === "18K");
                      if (has14K && has18K) {
                        return "14K/18K";
                      } else if (has14K) {
                        return "14K";
                      } else if (has18K) {
                        return "18K";
                      } else {
                        return metalOption.karat;
                      }
                    })()} {metalOption.color}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-600 font-medium">${metalOption.price.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">
                      {product.compatibleStoneShapes.length > 0 && (
                        <span>{product.compatibleStoneShapes.length} stone shapes</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(() => {
                      // Group metal options by color and prioritize 14K over 18K
                      const uniqueMetalColors: MetalOption[] = [];
                      const seenColors = new Set();
                      for (const metal of product.metalOptions) {
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
                        <div 
                          key={`${metal.karat}-${metal.color}`}
                          className={`w-5 h-5 rounded-full border-2 border-white shadow-sm transition-transform transform ${
                            metal.color === metalOption.color
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
                    {product.metalOptions.length > 4 && (
                      <div 
                        className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium transition-transform transform hover:scale-105"
                        title={`+${product.metalOptions.length - 4} more options`}
                      >
                        +{product.metalOptions.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors disabled:bg-amber-300"
          >
            {loadingMore ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading more...
              </div>
            ) : (
              'Load More Settings'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
