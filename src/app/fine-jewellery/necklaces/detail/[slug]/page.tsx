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
import { getNecklaceTitle } from '@/utils/product-helper';
import { NecklaceProduct } from '@/types/product';

interface NecklaceDetail {
  _id: string;
  slug: string;
  sku: string;
  productNumber: string;
  name: string;
  type: string;
  length: string;
  metal: string;
  style: string;
  chainWidth?: number;
  claspType?: string;
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
  totalPieces?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function NecklaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Extract necklace ID from slug
  const slug = params?.slug as string;
  
  // State variables
  const [necklace, setNecklace] = useState<NecklaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Fetch necklace data
  useEffect(() => {
    const fetchNecklace = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Use the slug directly - API will handle slug/ID lookup
        const response = await fetch(`/api/products/necklace/detail/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch necklace details');
        }
        
        const data = await response.json();
        setNecklace(data.necklace);
      } catch (err) {
        console.error('Error fetching necklace:', err);
        setError('Failed to load necklace details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNecklace();
  }, [slug]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!necklace) return;
    
    setAddingToCart(true);
    
    try {
      const necklaceProduct: NecklaceProduct = {
        ...necklace,
        productType: 'necklace',
        title: necklace.name, // Pass name to title for the helper
        imageUrl: necklace.images?.[0]?.url || '',
      };

      const cartItem: CartItem = {
        _id: necklace._id,
        title: getNecklaceTitle(necklaceProduct),
        price: necklace.salePrice || necklace.price,
        quantity: quantity,
        image: necklace.images?.[0]?.url || '',
        productType: 'necklace' as const,
        customization: {
          isCustomized: false,
          customizationDetails: {
            metal: necklace.metal,
            style: necklace.style,
            type: necklace.type,
            length: necklace.length
          }
        }
      };
      
      addItem(cartItem);
      toast.success('Necklace added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !necklace) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error || 'Necklace not found'} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-amber-500">Home</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/fine-jewellery" className="text-gray-500 hover:text-amber-500">Fine Jewellery</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/fine-jewellery/necklaces/all" className="text-gray-500 hover:text-amber-500">Necklaces</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-amber-600 font-medium">
            {necklace.name}
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {necklace.images && necklace.images.length > 0 ? (
              <Image
                src={necklace.images[activeImageIndex].url}
                alt={necklace.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {necklace.images && necklace.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {necklace.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${necklace.name} Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Column: Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {necklace.name}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {necklace.metal} {necklace.type} Necklace
          </p>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              {necklace.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    ${necklace.salePrice.toLocaleString()}
                  </span>
                  <span className="ml-3 text-gray-500 line-through">
                    ${necklace.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-amber-600">
                  ${necklace.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* SKU */}
          <p className="text-sm text-gray-500 mb-6">SKU: {necklace.sku}</p>
          
          {/* Stock Status */}
          <div className="mb-6">
            {necklace.isAvailable ? (
              <span className="text-green-600 font-medium">
                ✓ In Stock
                {necklace.stockQuantity && necklace.stockQuantity <= 5 && (
                  <span className="text-orange-600 ml-2">
                    (Only {necklace.stockQuantity} left)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={necklace.stockQuantity || 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
              />
              <button
                onClick={() => setQuantity(Math.min((necklace.stockQuantity || 99), quantity + 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !necklace.isAvailable || (necklace.totalPieces !== undefined && necklace.totalPieces <= 0)}
              className="w-full py-3 px-6 rounded-full font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : (necklace.totalPieces !== undefined && necklace.totalPieces <= 0 ? 'Out of Stock' : 'Add to Cart')}
            </button>

            <button
              onClick={() => router.push('/fine-jewellery/necklaces/all')}
              className="w-full py-3 px-6 rounded-full font-medium text-amber-600 border border-amber-600 hover:bg-amber-50 transition-colors"
            >
              Browse More Necklaces
            </button>
          </div>
          
          {/* Product Description */}
          {necklace.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{necklace.description}</p>
            </div>
          )}
          
          {/* Necklace Specifications */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Necklace Specifications</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{necklace.type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Metal</h3>
                  <p className="mt-1">{necklace.metal}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Style</h3>
                  <p className="mt-1">{necklace.style}</p>
                </div>
                
                {necklace.length && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Length</h3>
                    <p className="mt-1">{necklace.length}</p>
                  </div>
                )}
                
                {necklace.chainWidth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Chain Width</h3>
                    <p className="mt-1">{necklace.chainWidth}</p>
                  </div>
                )}
                
                {necklace.claspType && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Clasp Type</h3>
                    <p className="mt-1">{necklace.claspType}</p>
                  </div>
                )}
                
                {necklace.weight && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                    <p className="mt-1">{necklace.weight}g</p>
                  </div>
                )}
                
                {necklace.dimensions && (
                  <>
                    {necklace.dimensions.length && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Length</h3>
                        <p className="mt-1">{necklace.dimensions.length}</p>
                      </div>
                    )}
                    {necklace.dimensions.width && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Width</h3>
                        <p className="mt-1">{necklace.dimensions.width}</p>
                      </div>
                    )}
                    {necklace.dimensions.thickness && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Thickness</h3>
                        <p className="mt-1">{necklace.dimensions.thickness}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Gemstones */}
          {necklace.gemstones && necklace.gemstones.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Gemstones</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {necklace.gemstones.map((gemstone, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{gemstone.type}</span>
                        {gemstone.color && <span className="text-gray-600 ml-2">({gemstone.color})</span>}
                      </div>
                      <div className="text-right">
                        {gemstone.size && <div className="text-sm text-gray-500">{gemstone.size}</div>}
                        {gemstone.quantity && <div className="text-sm text-gray-500">Qty: {gemstone.quantity}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Features */}
          {necklace.features && necklace.features.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Features</h2>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  {necklace.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Care Instructions */}
          {necklace.careInstructions && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Care Instructions</h2>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 leading-relaxed">{necklace.careInstructions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
