'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { WeddingRing } from '@/types/wedding';
import { toast } from 'react-hot-toast';
import ProductImageGallery from '@/components/wedding/ProductImageGallery';
import SizeSelector from '@/components/wedding/SizeSelector';
import MetalSelector from '@/components/wedding/MetalSelector';
import ProductFeatures from '@/components/wedding/ProductFeatures';
import RelatedProducts from '@/components/wedding/RelatedProducts';
import ProductDescription from '@/components/wedding/ProductDescription';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { CartItem } from '@/types/cart';

// Define types for metal options and sizes
interface MetalOption {
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

interface SizeOption {
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

export default function WeddingRingDetailPage() {
  const params = useParams() as { slug: string } | null;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Extract product ID from slug with null check
  const slug = params?.slug || '';
  const productId = slug.split('-').pop() || '';
  
  // State variables
  const [product, setProduct] = useState<WeddingRing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/wedding/detail/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data.product);
        
        // Set default metal option
        const defaultMetal = data.product.metalOptions.find((m: MetalOption) => m.isDefault) || 
                            data.product.metalOptions[0];
        setSelectedMetal(defaultMetal);
        
        // Check if there's a metal option in the URL
        const metalParam = searchParams?.get('metal');
        if (metalParam) {
          const [karat, ...colorParts] = metalParam.split('-');
          const color = colorParts.join(' ');
          
          const matchingMetal = data.product.metalOptions.find(
            (m: MetalOption) => m.karat === karat && m.color === color
          );
          
          if (matchingMetal) {
            setSelectedMetal(matchingMetal);
          }
        }
        
        // Set default size
        if (data.product.sizes && data.product.sizes.length > 0) {
          const defaultSize = data.product.sizes.find((s: SizeOption) => s.isAvailable);
          if (defaultSize) {
            setSelectedSize(defaultSize.size);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId, searchParams]);
  
  // Handle metal selection
  const handleMetalChange = (metal: MetalOption) => {
    setSelectedMetal(metal);
    
    // Update active image based on selected metal color
    if (product?.metalColorImages && product.metalColorImages[metal.color]) {
      setActiveImageIndex(0); // Reset to first image of the new color
    }
  };
  
  // Handle size selection
  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
  };
  
  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!product || !selectedMetal) return 0;
    
    let price = selectedMetal.price;
    
    // Add size additional price if applicable
    if (selectedSize) {
      const sizeOption = product.sizes.find(s => s.size === selectedSize);
      if (sizeOption) {
        price += sizeOption.additionalPrice;
      }
    }
    
    return price * quantity;
  };
  
  // Create cart item
  const createCartItem = (): CartItem | null => {
    if (!product || !selectedMetal || !selectedSize) {
      return null;
    }
    
    // Get the image URL for the selected metal color
    let imageUrl = '';
    if (product.metalColorImages && product.metalColorImages[selectedMetal.color]?.length > 0) {
      imageUrl = product.metalColorImages[selectedMetal.color][0].url;
    } else if (product.media.images.length > 0) {
      imageUrl = product.media.images[0].url;
    }
    
    // Create cart item
    return {
      _id: product._id,
      title: product.title,
      price: calculateTotalPrice(),
      quantity: quantity,
      image: imageUrl,
      metalOption: {
        karat: selectedMetal.karat,
        color: selectedMetal.color
      },
      size: selectedSize,
      productType: 'wedding'
    };
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedMetal || !selectedSize) {
      toast.error('Please select a size and metal option');
      return;
    }
    
    setAddingToCart(true);
    
    try {
      const cartItem = createCartItem();
      if (cartItem) {
        addItem(cartItem);
        toast.success('Added to cart!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (!product || !selectedMetal || !selectedSize) {
      toast.error('Please select a size and metal option');
      return;
    }
    
    setBuyingNow(true);
    
    try {
      const cartItem = createCartItem();
      if (cartItem) {
        // Add to cart first
        addItem(cartItem);
        
        // Then redirect to checkout
        router.push('/checkout');
      }
    } catch (err) {
      console.error('Error processing buy now:', err);
      toast.error('Failed to process. Please try again.');
    } finally {
      setBuyingNow(false);
    }
  };
  
  // Get images for the selected metal color
  const getImagesForSelectedMetal = () => {
    if (!product || !selectedMetal) return [];
    
    // If we have metal color images for the selected color, use those
    if (product.metalColorImages && product.metalColorImages[selectedMetal.color]?.length > 0) {
      return product.metalColorImages[selectedMetal.color];
    }
    
    // Otherwise, use the general product images
    return product.media.images;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error || 'Product not found'} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-amber-500">Home</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/wedding" className="text-gray-500 hover:text-amber-500">Wedding Rings</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link 
              href={`/wedding/${product.subcategory.toLowerCase().replace(/['&\s]+/g, '-')}`} 
              className="text-gray-500 hover:text-amber-500"
            >
              {product.subcategory}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-amber-600 font-medium truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <ProductImageGallery 
            images={getImagesForSelectedMetal()} 
            video={product.media.video}
            activeIndex={activeImageIndex}
            onImageChange={setActiveImageIndex}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-cinzel mb-2">{product.title}</h1>
          
          <div className="mb-4">
            <p className="text-2xl text-amber-600 font-semibold">
              ${calculateTotalPrice().toLocaleString()}
            </p>
            {product.onSale && product.originalPrice && (
              <p className="text-gray-500 line-through">
                ${product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          
          {/* SKU */}
          <p className="text-gray-500 text-sm mb-6">SKU: {product.SKU}</p>
          
          {/* Metal Options */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Metal Options</h2>
            <MetalSelector 
              options={product.metalOptions} 
              selectedMetal={selectedMetal} 
              onChange={handleMetalChange} 
            />
          </div>
          
          {/* Size Options */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Ring Size</h2>
            <SizeSelector 
              sizes={product.sizes} 
              selectedSize={selectedSize} 
              onChange={handleSizeChange} 
            />
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
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
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart || buyingNow || !selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || buyingNow || !selectedSize || !selectedMetal 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600'} 
                transition-colors`}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            {/* Buy Now Button */}
            <button 
              onClick={handleBuyNow}
              disabled={addingToCart || buyingNow || !selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || buyingNow || !selectedSize || !selectedMetal 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'} 
                transition-colors`}
            >
              {buyingNow ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
          
          {/* Product Features */}
          <ProductFeatures product={product} selectedMetal={selectedMetal} />
        </div>
      </div>
      
      {/* Product Description */}
      <ProductDescription description={product.description} />
      
      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product._id} 
        subcategory={product.subcategory}
        style={product.style[0]}
      />
    </div>
  );
}