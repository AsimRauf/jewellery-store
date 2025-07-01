'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { CartItem } from '@/types/cart';
import { getEarringTitle } from '@/utils/product-helper';
import { EarringProduct } from '@/types/product';

 interface EarringDetail {
   _id: string;
   slug: string;
   sku: string;
   productNumber: string;
   name: string;
   type: string;
   backType?: string;
  metal: string;
  style: string;
  length?: string;
  width?: string;
  gemstones?: Array<{
    type: string;
    size?: string;
    color?: string;
    quantity?: number;
  }>;
  dimensions?: {
    length?: string;
    width?: string;
    thickness?: string;
  };
  weight?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  description?: string;
  features?: string[];
  careInstructions?: string;
  isAvailable: boolean;
  stockQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function EarringDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Ensure slug is a string
  const slug = params?.slug ? String(params.slug) : '';
  
  const [earring, setEarring] = useState<EarringDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch earring details
  useEffect(() => {
    const fetchEarring = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/earring/detail/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Earring not found');
          }
          throw new Error('Failed to load earring details');
        }
        
        const data = await response.json();
        setEarring(data.earring);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEarring();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!earring) return;
    
    try {
      setAddingToCart(true);
      
      const { length, width, ...rest } = earring;
      const earringProduct: EarringProduct = {
        ...rest,
        length: parseFloat(length || '0'),
        width: parseFloat(width || '0'),
        productType: 'earring',
        title: earring.name, // Pass name to title for the helper
        imageUrl: earring.images?.[0]?.url || '',
        backType: earring.backType || '',
      };

      const cartItem: CartItem = {
        _id: earring._id,
        title: getEarringTitle(earringProduct),
        price: earring.salePrice || earring.price,
        quantity: quantity,
        image: earring.images?.[0]?.url || '',
        productType: 'earring',
        customization: {
          isCustomized: false,
          customizationDetails: {
            metal: earring.metal,
            style: earring.style,
            type: earring.type,
            backType: earring.backType
          }
        }
      };

      addItem(cartItem);
      toast.success(`${earring.name} added to cart!`);
      
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const getImageUrl = (earring: EarringDetail, index: number = 0): string => {
    if (earring.images && earring.images.length > index) {
      return earring.images[index].url;
    }
    return '/placeholder-earring.jpg';
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  // Not found state
  if (!earring) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Earring Not Found</h1>
          <p className="text-gray-600 mb-6">The earring you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/fine-jewellery/earrings/all"
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Browse All Earrings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-amber-500">Home</Link>
        <span>/</span>
        <Link href="/fine-jewellery" className="hover:text-amber-500">Fine Jewellery</Link>
        <span>/</span>
        <Link href="/fine-jewellery/earrings/all" className="hover:text-amber-500">Earrings</Link>
        <span>/</span>
        <span className="text-gray-900">{earring.name}</span>
      </nav>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={getImageUrl(earring, selectedImageIndex)}
              alt={earring.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {earring.images && earring.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {earring.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-amber-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${earring.name} - Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {earring.type}
              </span>
              {earring.backType && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {earring.backType}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{earring.name}</h1>
            <div className="flex items-center gap-4">
              {earring.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(earring.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(earring.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(earring.price)}
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Metal</h3>
                <p className="text-gray-600">{earring.metal}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Style</h3>
                <p className="text-gray-600">{earring.style}</p>
              </div>
              {earring.length && (
                <div>
                  <h3 className="font-medium text-gray-900">Length</h3>
                  <p className="text-gray-600">{earring.length}</p>
                </div>
              )}
              {earring.width && (
                <div>
                  <h3 className="font-medium text-gray-900">Width</h3>
                  <p className="text-gray-600">{earring.width}</p>
                </div>
              )}
              {earring.weight && (
                <div>
                  <h3 className="font-medium text-gray-900">Weight</h3>
                  <p className="text-gray-600">{earring.weight}g</p>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">SKU</h3>
                <p className="text-gray-600">{earring.sku}</p>
              </div>
            </div>

            {/* Gemstones */}
            {earring.gemstones && earring.gemstones.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Gemstones</h3>
                <div className="space-y-2">
                  {earring.gemstones.map((gemstone, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{gemstone.type}</span>
                      {gemstone.color && <span className="text-gray-600">• {gemstone.color}</span>}
                      {gemstone.size && <span className="text-gray-600">• {gemstone.size}</span>}
                      {gemstone.quantity && gemstone.quantity > 1 && (
                        <span className="text-gray-600">• Qty: {gemstone.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {earring.isAvailable ? (
              earring.stockQuantity && earring.stockQuantity <= 5 ? (
                <p className="text-orange-600 font-medium">Only {earring.stockQuantity} left in stock</p>
              ) : (
                <p className="text-green-600 font-medium">✓ In Stock</p>
              )
            ) : (
              <p className="text-red-600 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          {earring.isAvailable && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={earring.stockQuantity ? quantity >= earring.stockQuantity : false}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Description */}
          {earring.description && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{earring.description}</p>
            </div>
          )}

          {/* Features */}
          {earring.features && earring.features.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {earring.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Care Instructions */}
          {earring.careInstructions && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Care Instructions</h3>
              <p className="text-gray-600 leading-relaxed">{earring.careInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Back to Category Button */}
      <div className="mt-12 text-center">
        <Link
          href="/fine-jewellery/earrings/all"
          className="inline-flex items-center px-6 py-2 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Earrings
        </Link>
      </div>
    </div>
  );
}
