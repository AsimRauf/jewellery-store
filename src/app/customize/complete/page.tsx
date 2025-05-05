'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import CustomizationSteps from '@/components/customize/CustomizationSteps';

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
  price: number;
  images?: Array<{
    url: string;
  }>;
}

export default function CompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [setting, setSetting] = useState<Setting | null>(null);
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const settingId = searchParams?.get('settingId');
  const diamondId = searchParams?.get('diamondId');
  const selectedMetal = searchParams?.get('metal');
  const selectedSize = searchParams?.get('size');
  const startWith = searchParams?.get('start') || 'setting';

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

      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load ring details');
      } finally {
        setLoading(false);
      }
    };

    if (settingId && diamondId) {
      fetchDetails();
    }
  }, [settingId, diamondId]);

  const calculateTotalPrice = () => {
    if (!setting || !diamond) return 0;

    const metalOption = setting.metalOptions.find(m => m.color === selectedMetal);
    if (!metalOption) return 0;

    const sizeOption = setting.sizes.find(s => s.size === Number(selectedSize));
    const sizePrice = sizeOption?.additionalPrice || 0;

    return metalOption.price + diamond.price + sizePrice;
  };

  const handleAddToCart = () => {
    if (!setting || !diamond || !selectedMetal || !selectedSize) {
      toast.error('Unable to add to cart. Please try again.');
      return;
    }

    const metalOption = setting.metalOptions.find(m => m.color === selectedMetal);
    if (!metalOption) {
      toast.error('Selected metal option not found');
      return;
    }

    const cartItem = {
      _id: `${setting._id}-${diamond._id}`,
      title: `Custom ${setting.title} with ${diamond.shape} Diamond`,
      price: calculateTotalPrice(),
      quantity: 1,
      image: setting.metalColorImages[selectedMetal]?.[0]?.url || '',
      metalOption: {
        karat: metalOption.karat,
        color: metalOption.color
      },
      size: parseInt(selectedSize),
      diamond: {
        _id: diamond._id,
        shape: diamond.shape,
        carat: diamond.carat,
        color: diamond.color,
        clarity: diamond.clarity
      },
      productType: 'setting' as const,
      customization: {
        isCustomized: true,
        customizationType: 'setting-diamond' as const,
        diamondId: diamond._id,
        settingId: setting._id,
        metalType: metalOption.color,
        size: parseInt(selectedSize),
        customizationDetails: {
          stone: {
            type: 'diamond',
            carat: diamond.carat,
            color: diamond.color,
            clarity: diamond.clarity
          },
          setting: {
            style: setting.title,
            metalType: metalOption.color,
            settingType: 'custom'
          }
        }
      }
    };

    addItem(cartItem);
    toast.success('Custom ring added to cart!');
    router.push('/cart');
  };

  const handleChangeSetting = () => {
    const params = new URLSearchParams({
      diamondId: diamond?._id || '',
      start: 'diamond',
      end: 'setting'
    });
    router.push(`/settings/all?${params.toString()}`);
  };

  const handleChangeDiamond = () => {
    const params = new URLSearchParams({
      settingId: setting?._id || '',
      metal: selectedMetal || '',
      size: selectedSize || '',
      start: 'setting',
      end: 'diamond'
    });
    router.push(`/diamond/all?${params.toString()}`);
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

  if (error || !setting || !diamond) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <CustomizationSteps
        currentStep={3}
        startWith={startWith as 'setting' | 'diamond'}
        settingComplete={true}
        diamondComplete={true}
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

        {/* Right Column: Diamond */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative aspect-square">
              <Image
                src={diamond.images?.[0]?.url || '/placeholder-diamond.jpg'}
                alt={`${diamond.shape} ${diamond.carat}ct Diamond`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {diamond.shape} Diamond
                  </h2>
                  <p className="text-gray-600">
                    {diamond.carat}ct {diamond.color} {diamond.clarity}
                  </p>
                </div>
                <button
                  onClick={handleChangeDiamond}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Change Diamond
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
            Add to Cart
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
