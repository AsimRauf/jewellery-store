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
import { getMensJewelryTitle } from '@/utils/product-helper';
import { MensJewelryProduct } from '@/types/product';

 interface MensJewelryDetail {
   _id: string;
   slug: string;
   sku: string;
   productNumber: string;
   name: string;
   type: string;
   metal: string;
  style: string;
  finish: string;
  size?: string;
  length?: string;
  width?: string;
  thickness?: string;
  weight?: number;
  engravingAvailable: boolean;
  engravingDetails?: {
    maxCharacters?: number;
    fonts?: string[];
    placement?: string[];
  };
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
    diameter?: string;
  };
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

export default function MensJewelryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<MensJewelryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');
  const [engravingText, setEngravingText] = useState('');
  const [selectedEngravingFont, setSelectedEngravingFont] = useState('');
  const [selectedEngravingPlacement, setSelectedEngravingPlacement] = useState('');
  const [showEngraving, setShowEngraving] = useState(false);

  const slug = params?.slug ? String(params.slug) : '';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/mens-jewelry/detail/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Set default selections
        if (data.size) setSelectedSize(data.size);
        if (data.length) setSelectedLength(data.length);
        if (data.engravingDetails?.fonts?.[0]) setSelectedEngravingFont(data.engravingDetails.fonts[0]);
        if (data.engravingDetails?.placement?.[0]) setSelectedEngravingPlacement(data.engravingDetails.placement[0]);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validation for required selections
    if (product.type === 'Ring' && !selectedSize) {
      toast.error('Please select a ring size');
      return;
    }
    
    if ((product.type === 'Necklace' || product.type === 'Chain') && !selectedLength) {
      toast.error('Please select a length');
      return;
    }

    const { size, length, width, thickness, ...rest } = product;
    const mensProduct: MensJewelryProduct = {
      ...rest,
      size: size || '',
      length: parseFloat(length || '0'),
      width: parseFloat(width || '0'),
      thickness: parseFloat(thickness || '0'),
      productType: 'mens-jewelry',
      title: product.name, // Pass name to title for the helper
      imageUrl: product.images?.[0]?.url || '',
    };

    const cartItem: CartItem = {
      _id: product._id,
      title: getMensJewelryTitle(mensProduct),
      price: product.salePrice || product.price,
      quantity,
      image: product.images?.[0]?.url || '',
      productType: 'mens-jewelry',
      customization: {
        isCustomized: showEngraving && engravingText.length > 0,
        customizationDetails: {
          metal: product.metal,
          style: product.style,
          type: product.type,
          finish: product.finish,
          size: selectedSize || product.size,
          length: selectedLength || product.length,
          ...(showEngraving && engravingText && {
            engraving: {
              text: engravingText,
              font: selectedEngravingFont,
              placement: selectedEngravingPlacement
            }
          })
        }
      }
    };

    addItem(cartItem);
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link 
            href="/fine-jewellery/mens/all"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse All Men's Jewelry
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.price > product.salePrice;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/fine-jewellery/mens/all" className="hover:text-gray-900">Men's Jewelry</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex].url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>

          {/* Price */}
          <div className="flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  ${product.salePrice.toLocaleString()}
                </span>
                <span className="ml-3 text-gray-500 line-through">
                  ${product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span> {product.type}
            </div>
            <div>
              <span className="font-medium">Metal:</span> {product.metal}
            </div>
            <div>
              <span className="font-medium">Style:</span> {product.style}
            </div>
            <div>
              <span className="font-medium">Finish:</span> {product.finish}
            </div>
            {product.weight && (
              <div>
                <span className="font-medium">Weight:</span> {product.weight}g
              </div>
            )}
            {product.dimensions && (
              <>
                {product.dimensions.length && (
                  <div>
                    <span className="font-medium">Length:</span> {product.dimensions.length}
                  </div>
                )}
                {product.dimensions.width && (
                  <div>
                    <span className="font-medium">Width:</span> {product.dimensions.width}
                  </div>
                )}
                {product.dimensions.thickness && (
                  <div>
                    <span className="font-medium">Thickness:</span> {product.dimensions.thickness}
                  </div>
                )}
                {product.dimensions.diameter && (
                  <div>
                    <span className="font-medium">Diameter:</span> {product.dimensions.diameter}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Size Selection for Rings */}
          {product.type === 'Ring' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ring Size *
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Size</option>
                {['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
                <option value="Custom">Custom Size</option>
              </select>
            </div>
          )}

          {/* Length Selection for Chains/Necklaces */}
          {(product.type === 'Necklace' || product.type === 'Chain') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length *
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Length</option>
                {['18"', '20"', '22"', '24"', '26"', '28"', '30"'].map(length => (
                  <option key={length} value={length}>{length}</option>
                ))}
                <option value="Custom">Custom Length</option>
              </select>
            </div>
          )}

          {/* Engraving Options */}
          {product.engravingAvailable && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="engraving"
                  checked={showEngraving}
                  onChange={(e) => setShowEngraving(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="engraving" className="text-sm font-medium text-gray-700">
                  Add Engraving (+$25)
                </label>
              </div>

              {showEngraving && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engraving Text (Max {product.engravingDetails?.maxCharacters || 20} characters)
                    </label>
                    <input
                      type="text"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value.slice(0, product.engravingDetails?.maxCharacters || 20))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your text"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {engravingText.length}/{product.engravingDetails?.maxCharacters || 20} characters
                    </p>
                  </div>

                  {product.engravingDetails?.fonts && product.engravingDetails.fonts.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                      <select
                        value={selectedEngravingFont}
                        onChange={(e) => setSelectedEngravingFont(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {product.engravingDetails.fonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {product.engravingDetails?.placement && product.engravingDetails.placement.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placement</label>
                      <select
                        value={selectedEngravingPlacement}
                        onChange={(e) => setSelectedEngravingPlacement(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {product.engravingDetails.placement.map(placement => (
                          <option key={placement} value={placement}>{placement}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || (product.totalPieces !== undefined && product.totalPieces <= 0)}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              product.isAvailable && (product.totalPieces === undefined || product.totalPieces > 0)
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {product.isAvailable && (product.totalPieces === undefined || product.totalPieces > 0) ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Stock Status */}
          {product.stockQuantity !== undefined && (
            <div className="text-sm text-gray-600">
              {product.stockQuantity > 0 ? (
                <span className="text-green-600">
                  {product.stockQuantity} in stock
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gemstones */}
          {product.gemstones && product.gemstones.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gemstones</h3>
              <div className="space-y-2">
                {product.gemstones.map((gemstone, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{gemstone.type}</span>
                    {gemstone.size && <span> - {gemstone.size}</span>}
                    {gemstone.color && <span> - {gemstone.color}</span>}
                    {gemstone.quantity && <span> (Qty: {gemstone.quantity})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {product.careInstructions && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Care Instructions</h3>
              <p className="text-gray-600 leading-relaxed">{product.careInstructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
