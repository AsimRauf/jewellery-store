'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { CartItem } from '@/types/cart';
import CustomizationSteps from '@/components/customize/CustomizationSteps';
import MetalSelector from '@/components/wedding/MetalSelector';
import SizeSelector from '@/components/wedding/SizeSelector';

// Define types for metal options and sizes
interface MetalOption {
  _id?: string;
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

interface Size {
  _id: string;
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

interface SideStone {
  type: string;
  number_of_stones: number;
  total_carat: number;
  shape: string;
  color: string;
  clarity: string;
}

interface MediaImage {
  url: string;
  publicId: string;
  _id: string;
}

interface SettingDetail {
  _id: string;
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  metalColorImages: {
    [color: string]: Array<{
      url: string;
      publicId: string;
      _id?: string;
    }>;
  };
  sizes: Size[];
  side_stone?: SideStone;
  media: {
    images: MediaImage[];
    video?: {
      url: string;
      publicId: string;
    };
  };
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  canAcceptStone: boolean;
  compatibleStoneShapes: string[];
  settingHeight?: number;
  bandWidth?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function SettingDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart(); // Add this line to get addItem from cart context
  
  // Add this to track customization flow
  const isCustomizationEnd = searchParams?.get('end') === 'setting';
  const startWith = searchParams?.get('start');
  const isDiamondFirst = startWith === 'diamond';
  const diamondId = searchParams?.get('diamondId');
  const hasDiamondSelected = Boolean(diamondId);

  // Add gemstone flow parameters
  const isGemstoneFirst = startWith === 'gemstone';
  const gemstoneId = searchParams?.get('gemstoneId');
  const hasGemstoneSelected = Boolean(gemstoneId);

  // Extract product ID from slug
  const slug = params?.slug || '';
  const productId = typeof slug === 'string' ? slug : '';

  // State variables
  const [product, setProduct] = useState<SettingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Use the slug directly as identifier (API handles slug or ID lookup)
        const slugStr = Array.isArray(slug) ? slug[0] : slug;
        
        if (!slugStr) {
          throw new Error('Invalid product identifier');
        }
        
        const response = await fetch(`/api/products/settings/detail/${slugStr}`);

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
          const defaultSize = data.product.sizes.find((s: Size) => s.isAvailable);
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
  }, [slug, productId, searchParams]);

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

    // Check if this is part of a customization flow
    const isCustomized = Boolean(diamondId || startWith === 'setting' || isCustomizationEnd);

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
      productType: 'setting',
      customization: isCustomized ? {
        isCustomized: true,
        customizationType: 'setting-diamond',
        settingId: product._id,
        diamondId: diamondId || undefined,
        metalType: `${selectedMetal.karat} ${selectedMetal.color}`,
        size: selectedSize,
        customizationDetails: {
          setting: {
            style: product.style ? product.style[0] : 'Classic',
            metalType: `${selectedMetal.karat} ${selectedMetal.color}`,
            settingType: product.type ? product.type[0] : 'Solitaire'
          }
        }
      } : undefined
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

  // Modify handleSelectDiamond for completion flow
  const handleSelectDiamond = () => {
    if (!product || !selectedMetal || !selectedSize) {
      toast.error('Please select a size and metal option');
      return;
    }

    if (isDiamondFirst && hasDiamondSelected) {
      // If we're in diamond-first flow and have a diamond, go to completion
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('settingId', product._id);
      params.set('metal', selectedMetal.color);
      params.set('size', selectedSize.toString());
      params.set('complete', 'true');
      router.push(`/customize/complete?${params.toString()}`);
    } else {
      // Normal flow or starting customization - go to diamond selection
      const params = new URLSearchParams({
        settingId: product._id,
        metal: selectedMetal.color,
        size: selectedSize.toString(),
        start: 'setting',
        end: 'diamond'
      });
      router.push(`/diamond/all?${params.toString()}`);
    }
  };

  const handleSelectGemstone = () => {
  if (!product || !selectedMetal || !selectedSize) {
    toast.error('Please select a size and metal option');
    return;
  }

  if (isGemstoneFirst && hasGemstoneSelected) {
    // If we're in gemstone-first flow and have a gemstone, go to completion
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('settingId', product._id);
    params.set('metal', selectedMetal.color);
    params.set('size', selectedSize.toString());
    params.set('complete', 'true');
    router.push(`/customize/complete?${params.toString()}`);
  } else {
    // Normal flow or starting customization - go to gemstone selection
    const params = new URLSearchParams({
      settingId: product._id,
      metal: selectedMetal.color,
      size: selectedSize.toString(),
      start: 'setting',
      end: 'gemstone'
    });
    router.push(`/gemstone/all?${params.toString()}`);
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
      {/* Show CustomizationSteps for both end of flow and start of flow */}
      {(isCustomizationEnd || startWith === 'setting') && (
        <CustomizationSteps
          currentStep={2}
          startWith={(startWith === 'setting' || startWith === 'diamond' || startWith === 'gemstone') ? startWith : 'setting'}
          settingComplete={Boolean(selectedSize && selectedMetal)}
          diamondComplete={hasDiamondSelected}
          gemstoneComplete={hasGemstoneSelected}
        />
      )}

      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-amber-500">Home</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/settings/all" className="text-gray-500 hover:text-amber-500">Settings</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-amber-600 font-medium truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {getImagesForSelectedMetal().length > 0 ? (
              <Image
                src={getImagesForSelectedMetal()[activeImageIndex].url}
                alt={product.title}
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
          {getImagesForSelectedMetal().length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {getImagesForSelectedMetal().map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.title} Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Video if available */}
          {product.media.video && product.media.video.url && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Product Video</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <video
                  src={product.media.video.url}
                  controls
                  className="w-full h-full"
                  poster={getImagesForSelectedMetal()[0]?.url}
                />
                {/* Continuing from where we left off */}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column: Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
          {/* SKU */}
          <p className="text-sm text-gray-500 mb-4">SKU: {product.SKU}</p>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">
                ${calculateTotalPrice().toLocaleString()}
              </span>
              
              {product.onSale && product.originalPrice && (
                <>
                  <span className="ml-3 text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                    Sale
                  </span>
                </>
              )}
            </div>
          </div>
          
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
          <div className="mb-6 relative z-20">
            <h2 className="text-lg font-semibold mb-2">Ring Size</h2>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onChange={handleSizeChange}
            />
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Quantity</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || !selectedSize || !selectedMetal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600'} 
                transition-colors`}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={handleSelectDiamond}
              disabled={!selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${!selectedSize || !selectedMetal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8B0000] hover:bg-[#6B0000]'} 
                transition-colors`}
            >
              {isDiamondFirst && hasDiamondSelected ? 'Complete With Diamond' : 'Select a Diamond'}
            </button>

            <button
              onClick={handleSelectGemstone}
              disabled={!selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${!selectedSize || !selectedMetal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8B0000] hover:bg-[#6B0000]'} 
                transition-colors`}
            >
              {isGemstoneFirst && hasGemstoneSelected ? 'Complete With Gemstone' : 'Select a Gemstone'}
            </button>
          </div>
          
          {/* Product Description */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3">Description</h2>
            <div className="prose prose-amber max-w-none">
              <p>{product.description}</p>
            </div>
          </div>
          
          {/* Product Specifications */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Product Specifications</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {product.style && product.style.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Style</h3>
                    <p className="mt-1">{product.style.join(', ')}</p>
                  </div>
                )}
                
                {product.type && product.type.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1">{product.type.join(', ')}</p>
                  </div>
                )}
                
                {product.settingHeight && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Setting Height</h3>
                    <p className="mt-1">{product.settingHeight} mm</p>
                  </div>
                )}
                
                {product.bandWidth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Band Width</h3>
                    <p className="mt-1">{product.bandWidth} mm</p>
                  </div>
                )}
                
                {product.compatibleStoneShapes && product.compatibleStoneShapes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Compatible Stone Shapes</h3>
                    <p className="mt-1">{product.compatibleStoneShapes.join(', ')}</p>
                  </div>
                )}
                
                {product.side_stone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Side Stones</h3>
                    <p className="mt-1">
                      {product.side_stone.number_of_stones} {product.side_stone.type} stones, 
                      {product.side_stone.total_carat} total carats, 
                      {product.side_stone.shape} shape
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
