'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import CustomizationSteps from '@/components/customize/CustomizationSteps';
import { CartItem } from '@/types/cart';

interface Setting {
  _id: string;
  title: string;
  metalOptions: Array<{
    karat: string;
    color: string;
    price: number;
  }>;
  metalColorImages: {
    [key: string]: Array<{
      url: string;
    }>;
  };
  sizes: Array<{
    size: number;
    additionalPrice: number;
  }>;
}

interface Diamond {
  _id: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  price: number;
  images?: Array<{
    url: string;
  }>;
}

interface Gemstone {
  _id: string;
  type: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  price: number;
  images?: Array<{
    url: string;
  }>;
}

// Create a component that uses useSearchParams
function CompletePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [setting, setSetting] = useState<Setting | null>(null);
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [gemstone, setGemstone] = useState<Gemstone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const settingId = searchParams?.get('settingId');
  const diamondId = searchParams?.get('diamondId');
  const gemstoneId = searchParams?.get('gemstoneId');
  const selectedMetal = searchParams?.get('metal');
  const selectedSize = searchParams?.get('size');
  const startWith = searchParams?.get('start') || 'setting';

  // Determine what type of stone we're working with
  const stoneType = diamondId ? 'diamond' : gemstoneId ? 'gemstone' : null;
  const stone = diamond || gemstone;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch setting details
        if (settingId) {
          const settingResponse = await fetch(`/api/products/settings/detail/${settingId}`);
          if (!settingResponse.ok) throw new Error('Failed to fetch setting details');
          const settingData = await settingResponse.json();
          setSetting(settingData.product);
        }

        // Fetch diamond details
        if (diamondId) {
          const diamondResponse = await fetch(`/api/products/diamond/detail/${diamondId}`);
          if (!diamondResponse.ok) throw new Error('Failed to fetch diamond details');
          const diamondData = await diamondResponse.json();
          setDiamond(diamondData.diamond);
        }

        // Fetch gemstone details
        if (gemstoneId) {
          const gemstoneResponse = await fetch(`/api/products/gemstone/detail/${gemstoneId}`);
          if (!gemstoneResponse.ok) throw new Error('Failed to fetch gemstone details');
          const gemstoneData = await gemstoneResponse.json();
          setGemstone(gemstoneData.gemstone);
        }

      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load ring details');
      } finally {
        setLoading(false);
      }
    };

    if (settingId && (diamondId || gemstoneId)) {
      fetchDetails();
    }
  }, [settingId, diamondId, gemstoneId]);

  const calculateTotalPrice = () => {
    if (!setting || !stone) return 0;

    const metalOption = setting.metalOptions.find(m => m.color === selectedMetal);
    if (!metalOption) return 0;

    const sizeOption = setting.sizes.find(s => s.size === Number(selectedSize));
    const sizePrice = sizeOption?.additionalPrice || 0;

    return metalOption.price + stone.price + sizePrice;
  };

  const handleAddToCart = () => {
    if (!setting || !stone || !selectedMetal || !selectedSize || !stoneType) {
      toast.error('Unable to add to cart. Please try again.');
      return;
    }

    const metalOption = setting.metalOptions.find(m => m.color === selectedMetal);
    if (!metalOption) {
      toast.error('Selected metal option not found');
      return;
    }

    const stoneDescription = stoneType === 'diamond' 
      ? `${stone.shape} Diamond`
      : `${(stone as Gemstone).type} Gemstone`;

    const cartItem: CartItem = {
      _id: `${setting._id}-${stone._id}`,
      title: `Custom ${setting.title} with ${stoneDescription}`,
      price: calculateTotalPrice(),
      quantity: 1,
      image: setting.metalColorImages[selectedMetal]?.[0]?.url || '',
      metalOption: {
        karat: metalOption.karat,
        color: metalOption.color
      },
      size: parseInt(selectedSize),
      [stoneType]: {
        _id: stone._id,
        ...(stoneType === 'diamond' ? {
          shape: stone.shape,
          carat: stone.carat,
          color: stone.color,
          clarity: stone.clarity
        } : {
          type: (stone as Gemstone).type,
          shape: stone.shape,
          carat: stone.carat,
          color: stone.color,
          clarity: stone.clarity
        })
      },
      productType: 'setting' as const,
      customization: {
        isCustomized: true,
        customizationType: stoneType === 'diamond' ? 'setting-diamond' as const : 'setting-gemstone' as const,
        ...(stoneType === 'diamond' ? { diamondId: stone._id } : { gemstoneId: stone._id }),
        settingId: setting._id,
        metalType: metalOption.color,
        size: parseInt(selectedSize),
        customizationDetails: {
          stone: {
            type: stoneType,
            carat: stone.carat,
            color: stone.color,
            clarity: stone.clarity,
            ...(stoneType === 'gemstone' && { gemstoneType: (stone as Gemstone).type }),
            image: stone.images?.[0]?.url || ''
          },
          setting: {
            style: setting.title,
            metalType: `${metalOption.karat} ${metalOption.color}`,
            settingType: 'custom'
          }
        }
      }
    };

    addItem(cartItem);
    toast.success('Custom ring added to cart!');
    router.push('/checkout');
  };

  const handleChangeSetting = () => {
    const params = new URLSearchParams();
    if (diamondId) {
      params.set('diamondId', diamondId);
      params.set('start', 'diamond');
    } else if (gemstoneId) {
      params.set('gemstoneId', gemstoneId);
      params.set('start', 'gemstone');
    }
    params.set('end', 'setting');
    router.push(`/settings/all?${params.toString()}`);
  };

  const handleChangeStone = () => {
    const params = new URLSearchParams({
      settingId: setting?._id || '',
      metal: selectedMetal || '',
      size: selectedSize || '',
      start: 'setting'
    });

    if (stoneType === 'diamond') {
      params.set('end', 'diamond');
      router.push(`/diamond/all?${params.toString()}`);
    } else if (stoneType === 'gemstone') {
      params.set('end', 'gemstone');
      router.push(`/gemstone/all?${params.toString()}`);
    }
  };

  const getStoneDisplayInfo = () => {
    if (!stone) return { title: '', description: '' };

    if (stoneType === 'diamond') {
      return {
        title: `${stone.shape} Diamond`,
        description: `${stone.carat}ct ${stone.color} ${stone.clarity}`
      };
    } else {
      const gem = stone as Gemstone;
      return {
        title: `${gem.type} Gemstone`,
        description: `${gem.carat}ct ${gem.color} ${gem.clarity}`
      };
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (error || !setting || !stone) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Unable to load ring details'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stoneDisplayInfo = getStoneDisplayInfo();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <CustomizationSteps
        currentStep={3}
        startWith={startWith as 'setting' | 'diamond' | 'gemstone'}
        settingComplete={true}
        diamondComplete={stoneType === 'diamond'}
        gemstoneComplete={stoneType === 'gemstone'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Setting */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative aspect-square">
              <Image
                src={setting.metalColorImages[selectedMetal!]?.[0]?.url || ''}
                alt={setting.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{setting.title}</h2>
                  <p className="text-gray-600">{selectedMetal} - Size {selectedSize}</p>
                </div>
                <button
                  onClick={handleChangeSetting}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Change Setting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stone (Diamond or Gemstone) */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative aspect-square">
              <Image
                src={stone.images?.[0]?.url || '/placeholder-stone.jpg'}
                alt={stoneDisplayInfo.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {stoneDisplayInfo.title}
                  </h2>
                  <p className="text-gray-600">
                    {stoneDisplayInfo.description}
                  </p>
                </div>
                <button
                  onClick={handleChangeStone}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Change {stoneType === 'diamond' ? 'Diamond' : 'Gemstone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Price and Action */}
      <div className="mt-8 flex flex-col items-center">
        <div className="text-3xl font-bold text-amber-600 mb-4">
          ${calculateTotalPrice().toLocaleString()}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={handleAddToCart}
            className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 font-medium"
          >
            Add to Cart & Checkout
          </button>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
        </div>
      </div>
    }>
      <CompletePageContent />
    </Suspense>
  );
}
