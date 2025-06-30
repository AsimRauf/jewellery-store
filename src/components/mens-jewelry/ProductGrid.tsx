import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { MensJewelry } from '@/types/mens-jewelry';

interface ProductGridProps {
  products: MensJewelry[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearAllFilters: () => void;
  onLoadMore: () => void;
  onProductClick: (product: MensJewelry) => void;
  onAddToCart: (product: MensJewelry) => void;
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
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // Initialize loading states for products
  useEffect(() => {
    const newLoadingStates: { [key: string]: boolean } = {};
    products.forEach(product => {
      if (product.images && product.images.length > 0) {
        newLoadingStates[product._id] = true;
      }
    });
    setImageLoadingStates(newLoadingStates);
  }, [products]);

  const handleImageLoad = (productId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
    setImageLoadingStates(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: MensJewelry) => {
    e.stopPropagation(); // Prevent triggering product click
    onAddToCart(product);
    toast.success(`${product.title} added to cart`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  // No products found
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search criteria to find what you're looking for.
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const currentPrice = product.salePrice || product.price;
          const hasDiscount = product.salePrice && product.price > product.salePrice;
          const discountPercentage = hasDiscount ? getDiscountPercentage(product.price, product.salePrice!) : 0;

          return (
            <div
              key={product._id}
              onClick={() => onProductClick(product)}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 && !imageErrors[product._id] ? (
                  <>
                    {imageLoadingStates[product._id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    )}
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        imageLoadingStates[product._id] ? 'opacity-0' : 'opacity-100'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      onLoad={() => handleImageLoad(product._id)}
                      onError={() => handleImageError(product._id)}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Stock Status */}
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}

                {/* Engraving Available Badge */}
                {product.engravingAvailable && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Engravable
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                {/* Product Details */}
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{product.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metal:</span>
                    <span className="font-medium">{product.metal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Style:</span>
                    <span className="font-medium">{product.style}</span>
                  </div>
                  {product.finish && (
                    <div className="flex justify-between">
                      <span>Finish:</span>
                      <span className="font-medium">{product.finish}</span>
                    </div>
                  )}
                </div>

                {/* Sizing Info */}
                {(product.size || product.length || product.width) && (
                  <div className="text-sm text-gray-600">
                    {product.size && <span>Size: {product.size}</span>}
                    {product.length && <span>Length: {product.length}</span>}
                    {product.width && <span>Width: {product.width}</span>}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(currentPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.isAvailable}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    product.isAvailable
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Loading...</span>
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
