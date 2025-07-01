'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import CustomizationSteps from '@/components/customize/CustomizationSteps';
import { CartItem } from '@/types/cart';

interface GemstoneDetail {
  _id: string;
  slug?: string;
  sku: string;
  productNumber: string;
  type: string;
  source: string;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  cut?: string;
  origin?: string;
  treatment?: string;
  measurements: string;
  certificateLab?: string;
  certificateNumber?: string;
  refractive_index?: number;
  hardness: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function GemstoneDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Add customization flow parameters
  const startWith = searchParams?.get('start');
  const isCustomizationStart = startWith === 'gemstone';
  const settingId = searchParams?.get('settingId');
  const selectedMetal = searchParams?.get('metal');
  const selectedSize = searchParams?.get('size');
  const isSettingSelected = Boolean(settingId && selectedMetal && selectedSize);
  
  // Extract gemstone ID from slug
  const slug = params?.slug as string;
  
  // State variables
  const [gemstone, setGemstone] = useState<GemstoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Fetch gemstone data
  useEffect(() => {
    const fetchGemstone = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Use the slug directly as identifier (API handles slug or ID lookup)
        const identifier = slug;
        
        const response = await fetch(`/api/products/gemstone/detail/${identifier}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gemstone details');
        }
        
        const data = await response.json();
        setGemstone(data.gemstone);
      } catch (err) {
        console.error('Error fetching gemstone:', err);
        setError('Failed to load gemstone details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGemstone();
  }, [slug]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!gemstone) return;
    
    setAddingToCart(true);
    
    try {
      
      const cartItem: CartItem = {
        _id: gemstone._id,
        title: `${gemstone.type} ${gemstone.carat}ct ${gemstone.color} ${gemstone.clarity} Gemstone`,
        price: gemstone.salePrice || gemstone.price,
        quantity: quantity,
        image: gemstone.images?.[0]?.url || '',
        productType: 'gemstone',
        customization: (settingId && gemstone._id) ? {
          isCustomized: true,
          customizationType: 'setting-gemstone',
          gemstoneId: gemstone._id,
          settingId: searchParams?.get('settingId') || undefined,
          metalType: searchParams?.get('metal') || undefined,
          size: searchParams?.get('size') ? parseInt(searchParams.get('size')!) : undefined,
          customizationDetails: {
            stone: {
              type: 'gemstone',
              carat: gemstone.carat,
              color: gemstone.color,
              clarity: gemstone.clarity,
              cut: gemstone.cut,
              image: gemstone.images?.[0]?.url || '',
            }
          }
        } : undefined
      };
      
      addItem(cartItem);
      toast.success('Gemstone added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleGoToComplete = () => {
    if (!gemstone) return;
    
    // Build URL with all necessary parameters
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('gemstoneId', gemstone._id);
    params.set('complete', 'true');
    
    // Redirect to completion page
    router.push(`/customize/complete?${params.toString()}`);
  };

  // Handle select setting
  const handleSelectSetting = () => {
    if (!gemstone) return;

    if (isCustomizationStart) {
      // If this is the start of gemstone-first flow, go to settings with end=setting
      const params = new URLSearchParams({
        gemstoneId: gemstone._id,
        start: 'gemstone',
        end: 'setting'
      });
      router.push(`/settings/all?${params.toString()}`);
    } else if (isSettingSelected) {
      // If setting is already selected, go to completion
      handleGoToComplete();
    } else {
      // Normal flow - browse settings
      router.push(`/settings/all?gemstone=${gemstone._id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !gemstone) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error || 'Gemstone not found'} />
      </div>
    );
  }
  

  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Customization Steps */}
      {(isCustomizationStart || isSettingSelected) && (
        <CustomizationSteps
          currentStep={isSettingSelected ? 3 : 2}
          startWith="gemstone"
          gemstoneComplete={true}
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
            <Link href="/gemstone/all" className="text-gray-500 hover:text-amber-500">Gemstones</Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-amber-600 font-medium">
            {gemstone.type} {gemstone.carat}ct Gemstone
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {gemstone.images && gemstone.images.length > 0 ? (
              <Image
                src={gemstone.images[activeImageIndex].url}
                alt={`${gemstone.type} ${gemstone.carat}ct Gemstone`}
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
          {gemstone.images && gemstone.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {gemstone.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${gemstone.type} Gemstone Thumbnail ${index + 1}`}
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
            {gemstone.type} {gemstone.carat}ct {gemstone.color} {gemstone.clarity} Gemstone
          </h1>
          
          <p className="text-gray-600 mb-4">
            {gemstone.certificateLab && gemstone.certificateLab !== 'None' ? `${gemstone.certificateLab} Certified` : ''} {gemstone.source === 'lab' ? 'Lab-Grown' : 'Natural'} Gemstone
          </p>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">
                ${(gemstone.salePrice || gemstone.price).toLocaleString()}
              </span>
              {gemstone.salePrice && gemstone.salePrice < gemstone.price ? (
                <>
                  <span className="ml-3 text-gray-500 line-through">
                    ${gemstone.price.toLocaleString()}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                    Sale
                  </span>
                </>
              ) : null}
            </div>
          </div>
          
          {/* SKU */}
          <p className="text-sm text-gray-500 mb-6">SKU: {gemstone.sku}</p>
          
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
              disabled={addingToCart || !gemstone.isAvailable}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || !gemstone.isAvailable
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600'} 
                transition-colors`}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
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
                {isCustomizationStart ? 'Select a Setting' : 'Start with this Gemstone'}
              </button>
            )}
          </div>
          
          {/* Gemstone Specifications */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Gemstone Specifications</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{gemstone.type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shape</h3>
                  <p className="mt-1">{gemstone.shape}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Carat Weight</h3>
                  <p className="mt-1">{gemstone.carat}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Color</h3>
                  <p className="mt-1">{gemstone.color}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Clarity</h3>
                  <p className="mt-1">{gemstone.clarity}</p>
                </div>
                
                {gemstone.cut && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cut</h3>
                    <p className="mt-1">{gemstone.cut}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Source</h3>
                  <p className="mt-1">{gemstone.source === 'lab' ? 'Lab-Grown' : 'Natural'}</p>
                </div>
                
                {gemstone.origin && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Origin</h3>
                    <p className="mt-1">{gemstone.origin}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Measurements</h3>
                  <p className="mt-1">{gemstone.measurements}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hardness</h3>
                  <p className="mt-1">{gemstone.hardness}</p>
                </div>
                
                {gemstone.treatment && gemstone.treatment !== 'None' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Treatment</h3>
                    <p className="mt-1">{gemstone.treatment}</p>
                  </div>
                )}
                
                {gemstone.certificateLab && gemstone.certificateLab !== 'None' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Certificate</h3>
                    <p className="mt-1">{gemstone.certificateLab}</p>
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
                {gemstone.refractive_index && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Refractive Index</h3>
                    <p className="mt-1">{gemstone.refractive_index}</p>
                  </div>
                )}
                
                {gemstone.certificateNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Certificate Number</h3>
                    <p className="mt-1">{gemstone.certificateNumber}</p>
                  </div>
                )}
              </div>
              
              {gemstone.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-700">{gemstone.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
