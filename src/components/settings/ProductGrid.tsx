import { Setting } from '@/types/settings';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

interface ProductGridProps {
  products: Setting[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
  activeMetalFilters?: string[]; // Add this to match engagement component
}

export default function ProductGrid({
  products,
  loading,
  loadingMore,
  hasMore,
  error,
  clearAllFilters,
  onLoadMore,
  activeMetalFilters = []
}: ProductGridProps) {
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

  // Function to get the image for a product and specific metal color
  const getImageForMetal = (product: Setting, metalColor: string): string => {
    if (product.metalColorImages[metalColor]?.length > 0) {
      return product.metalColorImages[metalColor][0].url;
    }
    
    // If no image for this metal color, try to get any image from media
    if (product.media?.images?.length > 0) {
      return product.media.images[0].url;
    }
    
    // Fallback to placeholder
    return '/images/placeholder-ring.jpg';
  };

  // Function to get the price for a specific metal option
  const getPriceForMetal = (product: Setting, metalColor: string): number => {
    const metalOption = product.metalOptions.find(m => m.color === metalColor);
    return metalOption ? metalOption.price : product.basePrice;
  };

  // Function to get the price display
  const getPriceDisplay = (product: Setting, metalColor: string): JSX.Element => {
    const price = getPriceForMetal(product, metalColor);
    
    if (product.onSale && product.originalPrice) {
      const discountPercentage = Math.round(((product.originalPrice - price) / product.originalPrice) * 100);
      
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-amber-600 font-medium">${price.toLocaleString()}</span>
            <span className="ml-2 text-gray-400 line-through text-sm">${product.originalPrice.toLocaleString()}</span>
          </div>
          <span className="text-green-600 text-sm">Save {discountPercentage}%</span>
        </div>
      );
    }
    
    return <span className="text-amber-600 font-medium">${price.toLocaleString()}</span>;
  };

  // Function to generate SEO-friendly URL with metal option
  const getProductUrl = (product: Setting, metalColor: string): string => {
    return `/products/rings/settings/${product._id}?metal=${encodeURIComponent(metalColor)}`;
  };

  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.flatMap((product) => 
          // For each product, create a card for each metal color
          product.metalOptions
            // Filter by active metal filters if any
            .filter(option => activeMetalFilters.length === 0 || activeMetalFilters.includes(option.color))
            .map((metalOption) => (
              <Link 
                href={getProductUrl(product, metalOption.color)} 
                key={`${product._id}-${metalOption.color}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={getImageForMetal(product, metalOption.color)}
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
                    <h3 className="font-medium text-gray-800 mb-1 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{metalOption.color}</p>
                    <div className="flex justify-between items-center">
                      {getPriceDisplay(product, metalOption.color)}
                      <div className="text-xs text-gray-500">
                        {product.compatibleStoneShapes.length > 0 && (
                          <span>{product.compatibleStoneShapes.length} stone shapes</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div 
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{
                          background: 
                            metalOption.color.includes('Yellow Gold') ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                            metalOption.color.includes('White Gold') ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' :
                            metalOption.color.includes('Rose Gold') ? 'linear-gradient(135deg, #F7CDCD, #E8A090)' :
                            metalOption.color.includes('Platinum') ? 'linear-gradient(135deg, #E5E4E2, #CECECE)' :
                            metalOption.color.includes('Two Tone') ? 'linear-gradient(135deg, #FFD700, #C0C0C0)' :
                            'gray'
                        }}
                        title={metalOption.color}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
        )}
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
