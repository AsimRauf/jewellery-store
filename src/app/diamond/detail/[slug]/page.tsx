'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import CustomizationSteps from '@/components/customize/CustomizationSteps';
import { CartItem } from '@/types/cart';

interface DiamondDetail {
  _id: string;
  slug?: string;
  sku: string;
  productNumber: string;
  type: string;
  carat: number;
  shape: string;
  color: string;
  fancyColor?: string;
  clarity: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  measurements: string;
  treatment?: string;
  certificateLab?: string;
  crownAngle?: number;
  crownHeight?: number;
  pavilionAngle?: number;
  pavilionDepth?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  totalPieces?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function DiamondDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Add customization flow parameters
  const startWith = searchParams?.get('start');
  const isCustomizationStart = startWith === 'diamond';
  const settingId = searchParams?.get('settingId');
  const selectedMetal = searchParams?.get('metal');
  const selectedSize = searchParams?.get('size');
  const isSettingSelected = Boolean(settingId && selectedMetal && selectedSize);
  
  // Extract diamond ID from slug
  const slug = params?.slug as string;
  
  // State variables
  const [diamond, setDiamond] = useState<DiamondDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Fetch diamond data
  useEffect(() => {
    const fetchDiamond = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Use the slug directly - API will handle slug/ID lookup
        const response = await fetch(`/api/products/diamond/detail/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch diamond details');
        }
        
        const data = await response.json();
        setDiamond(data.diamond);
      } catch (err) {
        console.error('Error fetching diamond:', err);
        setError('Failed to load diamond details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiamond();
  }, [slug]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!diamond) return;
    
    setAddingToCart(true);
    
    try {
      // Check if this is part of a customization flow
      const isCustomized = Boolean(settingId && diamond._id);
      
      const cartItem: CartItem = {
        _id: diamond._id,
        title: `${diamond.shape} ${diamond.carat}ct ${diamond.color} ${diamond.clarity} Diamond`,
        price: diamond.salePrice || diamond.price,
        quantity: quantity,
        image: diamond.images?.[0]?.url || '',
        productType: 'diamond' as const,
        customization: isCustomized ? {
          isCustomized: true,
          customizationType: 'setting-diamond',
          diamondId: diamond._id,
          settingId: settingId || undefined,
          metalType: selectedMetal || undefined,
          size: selectedSize ? parseInt(selectedSize) : undefined,
          customizationDetails: {
            stone: {
              type: 'diamond',
              carat: diamond.carat,
              color: diamond.color,
              clarity: diamond.clarity,
              cut: diamond.cut
            }
          }
        } : undefined
      };
      
      addItem(cartItem);
      toast.success('Diamond added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleGoToComplete = () => {
    if (!diamond) return;
    
    // Build URL with all necessary parameters
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('diamondId', diamond._id);
    params.set('complete', 'true');
    
    // Redirect to completion page
    router.push(`/customize/complete?${params.toString()}`);
  };

  // Handle select setting
  const handleSelectSetting = () => {
    if (!diamond) return;

    if (isCustomizationStart) {
      // If this is the start of diamond-first flow, go to settings with end=setting
      const params = new URLSearchParams({
        diamondId: diamond._id,
        start: 'diamond',
        end: 'setting'
      });
      router.push(`/settings/all?${params.toString()}`);
    } else if (isSettingSelected) {
      // If setting is already selected, go to completion
      handleGoToComplete();
    } else {
      // Normal flow - browse settings
      router.push(`/settings/all?diamond=${diamond._id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !diamond) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error || 'Diamond not found'} />
      </div>
    );
  }
  
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Replace existing customization UI with new component */}
      {(isCustomizationStart || isSettingSelected) && (
        <CustomizationSteps
          currentStep={isSettingSelected ? 3 : 2}
          startWith="diamond"
          diamondComplete={true}
          settingComplete={isSettingSelected}
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
            <Link href="/diamond/all" className="text-gray-500 hover:text-amber-500">Diamonds</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-amber-600 font-medium">
            {diamond.shape} {diamond.carat}ct Diamond
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {diamond.images && diamond.images.length > 0 ? (
              <Image
                src={diamond.images[activeImageIndex].url}
                alt={`${diamond.shape} ${diamond.carat}ct Diamond`}
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
          {diamond.images && diamond.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {diamond.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${diamond.shape} Diamond Thumbnail ${index + 1}`}
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
            {diamond.shape} {diamond.carat}ct {diamond.color} {diamond.clarity} Diamond
          </h1>
          
          <p className="text-gray-600 mb-4">
            {diamond.certificateLab} Certified {diamond.type === 'lab' ? 'Lab-Grown' : 'Natural'} Diamond
          </p>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">
                ${(diamond.salePrice || diamond.price).toLocaleString()}
              </span>
              {diamond.salePrice && diamond.salePrice < diamond.price ? (
                <>
                  <span className="ml-3 text-gray-500 line-through">
                    ${diamond.price.toLocaleString()}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                    Sale
                  </span>
                </>
              ) : null}
            </div>
          </div>
          
          {/* SKU */}
          <p className="text-sm text-gray-500 mb-6">SKU: {diamond.sku}</p>
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !diamond.isAvailable || (diamond.totalPieces !== undefined && diamond.totalPieces <= 0)}
              className="w-full py-3 px-6 rounded-full font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:bg-gray-400"
            >
              {addingToCart ? 'Adding...' : (diamond.totalPieces !== undefined && diamond.totalPieces <= 0 ? 'Out of Stock' : 'Add to Cart')}
            </button>

            {isSettingSelected ? (
              <button
                onClick={handleGoToComplete}
                className="w-full py-3 px-6 rounded-full font-medium text-white bg-[#8B0000] hover:bg-[#6B0000] transition-colors"
              >
                Complete Your Ring
              </button>
            ) : (
              <button
                onClick={handleSelectSetting}
                className="w-full py-3 px-6 rounded-full font-medium text-white bg-[#8B0000] hover:bg-[#6B0000] transition-colors"
              >
                {isCustomizationStart ? 'Select a Setting' : 'Start with this Diamond'}
              </button>
            )}
          </div>
          
          {/* Diamond Specifications */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Diamond Specifications</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shape</h3>
                  <p className="mt-1">{diamond.shape}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Carat Weight</h3>
                  <p className="mt-1">{diamond.carat}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Color</h3>
                  <p className="mt-1">{diamond.color}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Clarity</h3>
                  <p className="mt-1">{diamond.clarity}</p>
                </div>
                
                {diamond.cut && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cut</h3>
                    <p className="mt-1">{diamond.cut}</p>
                  </div>
                )}
                
                {diamond.polish && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Polish</h3>
                    <p className="mt-1">{diamond.polish}</p>
                  </div>
                )}
                
                {diamond.symmetry && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Symmetry</h3>
                    <p className="mt-1">{diamond.symmetry}</p>
                  </div>
                )}
                
                {diamond.fluorescence && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fluorescence</h3>
                    <p className="mt-1">{diamond.fluorescence}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Measurements</h3>
                  <p className="mt-1">{diamond.measurements}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Certificate</h3>
                  <p className="mt-1">{diamond.certificateLab || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{diamond.type === 'lab' ? 'Lab-Grown' : 'Natural'}</p>
                </div>
                
                {diamond.fancyColor && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fancy Color</h3>
                    <p className="mt-1">{diamond.fancyColor}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Advanced Specifications */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Advanced Specifications</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {diamond.crownAngle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Crown Angle</h3>
                    <p className="mt-1">{diamond.crownAngle}°</p>
                  </div>
                )}
                
                {diamond.crownHeight && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Crown Height</h3>
                    <p className="mt-1">{diamond.crownHeight}%</p>
                  </div>
                )}
                
                {diamond.pavilionAngle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pavilion Angle</h3>
                    <p className="mt-1">{diamond.pavilionAngle}°</p>
                  </div>
                )}
                
                {diamond.pavilionDepth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pavilion Depth</h3>
                    <p className="mt-1">{diamond.pavilionDepth}%</p>
                  </div>
                )}
                
                {diamond.treatment && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Treatment</h3>
                    <p className="mt-1">{diamond.treatment}</p>
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

