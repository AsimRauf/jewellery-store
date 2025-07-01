import React, { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchProduct } from '@/app/search/page';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface SearchResultsProps {
  products: SearchProduct[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  searchQuery: string;
  totalCount: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  loading,
  loadingMore,
  hasMore,
  error,
  onLoadMore,
  searchQuery,
  totalCount
}) => {
  const { addItem } = useCart();
  const observer = useRef<IntersectionObserver | null>(null);

  // Create a ref for the last product element for infinite scroll
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, onLoadMore]);

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const getProductUrl = (product: SearchProduct): string => {
    let url = '';
    const metalQuery = product.metalOption
      ? `?metal=${product.metalOption.karat}-${product.metalOption.color.replace(/ /g, '+')}`
      : '';

    if (product.slug) {
      switch (product.productType) {
        case 'setting':
          url = `/products/rings/settings/${product.slug}${metalQuery}`;
          break;
        case 'wedding':
          url = `/wedding/detail/${product.slug}${metalQuery}`;
          break;
        case 'engagement':
          url = `/engagement/detail/${product.slug}${metalQuery}`;
          break;
        case 'diamond':
          url = `/diamond/detail/${product.slug}`;
          break;
        case 'gemstone':
          url = `/gemstone/detail/${product.slug}`;
          break;
        case 'bracelet':
          url = `/fine-jewellery/bracelets/detail/${product.slug}`;
          break;
        case 'earring':
          url = `/fine-jewellery/earrings/detail/${product.slug}`;
          break;
        case 'necklace':
          url = `/fine-jewellery/necklaces/detail/${product.slug}`;
          break;
        case 'mens-jewelry':
          url = `/fine-jewellery/mens/detail/${product.slug}`;
          break;
        default:
          url = `/products/${product._id}`;
          break;
      }
    } else {
      url = `/products/${product._id}`;
    }
    return url;
  };

  const handleAddToCart = (product: SearchProduct) => {
    // Map product type to cart compatible type
    const getCartProductType = (productType: string) => {
      const validTypes = ['setting', 'wedding', 'engagement', 'diamond', 'gemstone', 'bracelet', 'earring', 'necklace', 'mens-jewelry'];
      return validTypes.includes(productType) ? productType as any : 'setting';
    };

    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image || '/placeholder-image.jpg',
      metalOption: product.metalOption,
      productType: getCartProductType(product.productType)
    });

    toast.success(`Added ${product.title} to cart!`, {
      position: 'bottom-right',
      duration: 3000
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <p className="text-gray-600">Please try again or refine your search.</p>
      </div>
    );
  }

  if (products.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-cinzel text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{searchQuery}". 
            Try adjusting your search or filters.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Suggestions:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your spelling</li>
              <li>• Try more general terms</li>
              <li>• Remove some filters</li>
              <li>• Browse our categories instead</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product._id}
            ref={index === products.length - 1 ? lastProductRef : null}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative">
              <Link href={getProductUrl(product)}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      priority={index < 8}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>

              {/* Quick Add to Cart */}
              <button
                onClick={() => handleAddToCart(product)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                aria-label="Add to cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>

              {/* Sale Badge */}
              {product.salePrice && product.salePrice < product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Sale
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {product.category}
              </div>
            </div>

            <div className="p-4">
              <Link href={getProductUrl(product)}>
                <h3 className="font-cinzel text-lg mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
                  {product.title}
                </h3>
              </Link>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-red-600 font-semibold text-xl">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-600 font-semibold text-xl">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="text-sm text-gray-600 space-y-1">
                  {product.metalOption && (
                    <p>{product.metalOption.karat} {product.metalOption.color}</p>
                  )}
                  {product.metal && (
                    <p>{product.metal}</p>
                  )}
                  {product.carat && product.shape && (
                    <p>{product.carat}ct {product.shape}</p>
                  )}
                  {product.color && product.clarity && product.productType === 'diamond' && (
                    <p>{product.color} {product.clarity}</p>
                  )}
                  {product.type && (product.productType === 'gemstone' || product.productType === 'bracelet') && (
                    <p>{product.type}</p>
                  )}
                </div>

                {/* Style tags */}
                {product.style && product.style.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.style.slice(0, 2).map((style) => (
                      <span
                        key={style}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                    {product.style.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{product.style.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button / Loading Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}

      {/* Load More manually if needed */}
      {hasMore && !loadingMore && products.length >= 20 && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
