'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { RingEnums } from '@/constants/ringEnums';

interface MetalOption {
  _id: string;
  karat: string;
  color: string;
  price: number;
  description?: string;
  finish_type?: string | null;
  width_mm?: number;
  total_carat_weight?: number;
  isDefault: boolean;
}

interface Size {
  _id: string;
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

interface MainStone {
  type: string;
  gemstone_type?: string;
  number_of_stones: number;
  carat_weight: number;
  shape: string;
  color: string;
  clarity: string;
  hardness: number;
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

interface EngagementRingDetail {
  _id: string;
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: MetalOption[];
  sizes: Size[];
  main_stone: MainStone;
  side_stone: SideStone;
  media: {
    images: MediaImage[];
    video: {
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
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<EngagementRingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Import the Swiper type
  // Then update your state definition
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSizeAccordion, setShowSizeAccordion] = useState(false);
  
  const { addItem } = useCart();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract product ID from the slug parameter
  // The slug format is: product-name-productId
  const slug = params?.slug as string;
  const productId = slug?.split('-').pop(); // Get the last part after the last dash
  
  // Get metal option from URL if present
  useEffect(() => {
    if (!product) return;
    
    const metalParam = searchParams?.get('metal');
    if (metalParam) {
      const [karat, ...colorParts] = metalParam.split('-');
      const color = colorParts.join(' ');
      
      const matchedMetal = product.metalOptions.find(
        m => m.karat === karat && m.color === color
      );
      
      if (matchedMetal) {
        setSelectedMetal(matchedMetal);
      }
    }
  }, [searchParams, product]);
  
  // Fetch product data
  useEffect(() => {
    if (!productId) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/engagement/detail/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        setProduct(data.product);
        
        // Set default metal option
        if (data.product) {
          const defaultMetal = data.product.metalOptions.find((m: MetalOption) => m.isDefault) || 
                              data.product.metalOptions[0];
          setSelectedMetal(defaultMetal);
          
          // Set default size
          const defaultSize = data.product.sizes.find((s: { size: number }) => s.size === 6) ||                              data.product.sizes[0];
          setSelectedSize(defaultSize);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };    
    fetchProduct();
  }, [productId]);
  
  // Calculate total price when metal or size changes
  useEffect(() => {
    if (!product || !selectedMetal || !selectedSize) return;
    
    const metalPrice = selectedMetal.price;
    const sizeAdditionalPrice = selectedSize.additionalPrice;
    
    setTotalPrice(metalPrice + sizeAdditionalPrice);
  }, [product, selectedMetal, selectedSize]);
  
  const handleMetalChange = (metalId: string) => {
    if (!product) return;
    
    const metal = product.metalOptions.find((m: MetalOption) => m._id === metalId);
    if (metal) {
      setSelectedMetal(metal);
    }
  };
  
  const handleSizeChange = (sizeId: string) => {
    if (!product) return;
    
    const size = product.sizes.find((s: Size) => s._id === sizeId);
    if (size) {
      setSelectedSize(size);
    }
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedMetal || !selectedSize) return;
    
    addItem({
      _id: product._id,
      title: product.title,
      price: totalPrice,
      quantity: 1,
      image: product.media.images[0]?.url || '/placeholder-ring.jpg',
      metalOption: {
        karat: selectedMetal.karat,
        color: selectedMetal.color
      },
      size: selectedSize.size
    });
    
    toast.success(`Added ${product.title} to cart!`, {
      position: 'bottom-right',
      duration: 3000
    });
  };
  
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !selectedMetal || !selectedSize) return;
    
    setSubmitting(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: {
            id: product._id,
            title: product.title,
            sku: product.SKU,
            metal: `${selectedMetal.karat} ${selectedMetal.color}`,
            size: selectedSize.size,
            price: totalPrice
          },
          customer: inquiryForm
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }
      
      // Reset form
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Hide form
      setShowInquiryForm(false);
      
      // Show success message
      toast.success('Your inquiry has been submitted. We will contact you soon!', {
        duration: 5000
      });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setFormError('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl text-red-600 mb-2">Error Loading Product</h2>
          <p className="text-gray-700">{error || 'Product not found'}</p>
          <Link href="/engagement/all" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex flex-wrap items-center">
          <li className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-amber-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/engagement/all" className="text-gray-500 hover:text-amber-600">Engagement Rings</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-800 font-medium truncate">{product.title}</li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            navigation
            pagination={{ clickable: true }}
            className="rounded-lg overflow-hidden aspect-square"
          >
            {/* Show video as first slide if available */}
            {product.media.video && product.media.video.url && (
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <video 
                    src={product.media.video.url} 
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            )}
            
            {/* Show all images */}
            {product.media.images.map((image) => (
              <SwiperSlide key={image._id}>
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Thumbnails */}
          <Swiper
            onSwiper={(swiper: SwiperType) => setThumbsSwiper(swiper)}
            modules={[Thumbs]}
            watchSlidesProgress
            slidesPerView={4}
            spaceBetween={10}
            className="thumbs-swiper"
          >
            {/* Video thumbnail if available */}
            {product.media.video && product.media.video.url && (
              <SwiperSlide className="cursor-pointer rounded-md overflow-hidden">
                <div className="relative aspect-square">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.5 5.5L13.5 10 6.5 14.5v-9z" />
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            )}
            
            {/* Image thumbnails */}
            {product.media.images.map((image) => (
              <SwiperSlide key={`thumb-${image._id}`} className="cursor-pointer rounded-md overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={`Thumbnail for ${product.title}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 10vw"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="font-cinzel text-2xl sm:text-3xl text-gray-800">{product.title}</h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-amber-600">${totalPrice.toLocaleString()}</span>
            {product.onSale && product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p>SKU: {product.SKU}</p>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>{product.description}</p>
          </div>
          
          {/* Metal Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Metal Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.metalOptions.map((metal) => (
                <button
                  key={metal._id}
                  type="button"
                  onClick={() => handleMetalChange(metal._id)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                    selectedMetal?._id === metal._id
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{metal.karat} {metal.color}</span>
                    <span className="font-medium">${metal.price.toLocaleString()}</span>
                  </div>
                  {metal.finish_type && (
                    <span className="block text-xs text-gray-500 mt-1">{metal.finish_type} finish</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Ring Size Accordion */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center cursor-pointer" 
                 onClick={() => setShowSizeAccordion(!showSizeAccordion)}>
              <h3 className="font-medium text-gray-800">Ring Size</h3>
              <svg 
                className={`w-5 h-5 transition-transform ${showSizeAccordion ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showSizeAccordion && (
              <div className="mt-3 bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">
                  <p>Select your ring size. Each size may have a different additional cost.</p>
                  <p className="mt-1">Currently selected: <span className="font-medium">Size {selectedSize?.size}</span> 
                    {selectedSize && <span> (+${selectedSize.additionalPrice.toFixed(2)})</span>}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {product.sizes
                    .filter(size => size.isAvailable)
                    .map((size) => (
                      <button
                        key={size._id}
                        type="button"
                        onClick={() => handleSizeChange(size._id)}
                        className={`relative px-3 py-2 border rounded-md text-sm transition-colors ${
                          selectedSize?._id === size._id
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-300 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{size.size}</span>
                          <span className="text-xs mt-1 text-gray-500">
                            +${size.additionalPrice.toFixed(2)}
                          </span>
                        </div>
                        {selectedSize?._id === size._id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                </div>
                
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Not sure about your ring size? <a href="/ring-size-guide" className="ml-1 text-amber-600 hover:underline">View our ring size guide</a>
                </div>
                
                {/* Size Chart */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Size Chart</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 text-left">Size</th>
                          <th className="px-2 py-1 text-left">Circumference (mm)</th>
                          <th className="px-2 py-1 text-left">Additional Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {product.sizes
                          .filter(size => size.isAvailable)
                          .map((size) => {
                            // Find the circumference from RingEnums.SIZES
                            const sizeInfo = RingEnums.SIZES.find(s => s.size === size.size);
                            return (
                              <tr 
                                key={size._id} 
                                className={`hover:bg-gray-50 ${selectedSize?._id === size._id ? 'bg-amber-50' : ''}`}
                                onClick={() => handleSizeChange(size._id)}
                              >
                                <td className="px-2 py-1 font-medium">{size.size}</td>
                                <td className="px-2 py-1">{sizeInfo?.circumference || '-'} mm</td>
                                <td className="px-2 py-1">${size.additionalPrice.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Stone Details */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-800">Stone Details</h3>
            
            {/* Main Stone */}
            {product.main_stone && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-2">Main Stone</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span> {product.main_stone.type}
                    {product.main_stone.gemstone_type && ` (${product.main_stone.gemstone_type})`}
                  </div>
                  <div>
                    <span className="text-gray-500">Shape:</span> {product.main_stone.shape}
                  </div>
                  <div>
                    <span className="text-gray-500">Carat Weight:</span> {product.main_stone.carat_weight}ct
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity:</span> {product.main_stone.number_of_stones}
                  </div>
                  {product.main_stone.color && (
                    <div>
                      <span className="text-gray-500">Color:</span> {product.main_stone.color}
                    </div>
                  )}
                  {product.main_stone.clarity && (
                    <div>
                      <span className="text-gray-500">Clarity:</span> {product.main_stone.clarity}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Side Stone */}
            {product.side_stone && product.side_stone.type && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-2">Side Stones</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span> {product.side_stone.type}
                  </div>
                  <div>
                    <span className="text-gray-500">Shape:</span> {product.side_stone.shape}
                  </div>
                  <div>
                    <span className="text-gray-500">Total Carat:</span> {product.side_stone.total_carat}ct
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity:</span> {product.side_stone.number_of_stones}
                  </div>
                  {product.side_stone.color && (
                    <div>
                      <span className="text-gray-500">Color:</span> {product.side_stone.color}
                    </div>
                  )}
                  {product.side_stone.clarity && (
                    <div>
                      <span className="text-gray-500">Clarity:</span> {product.side_stone.clarity}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Style & Type */}
          <div className="flex flex-wrap gap-2 text-sm">
            {product.style.map(style => (
              <span key={style} className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                {style}
              </span>
            ))}
            {product.type.map(type => (
              <span key={type} className="px-2 py-1 bg-amber-50 rounded-full text-amber-700">
                {type}
              </span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            
            <button
              onClick={() => setShowInquiryForm(true)}
              className="flex-1 px-6 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Information
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional Information Tabs */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cinzel text-lg mb-3">Shipping Information</h3>
            <p className="text-gray-600 text-sm">
              Free shipping on all orders over $500. Standard shipping takes 3-5 business days.
              Expedited shipping options are available at checkout.
            </p>
          </div>
          
          <div>
            <h3 className="font-cinzel text-lg mb-3">Returns & Exchanges</h3>
            <p className="text-gray-600 text-sm">
              We offer a 30-day return policy for all our jewelry. Items must be returned in their
              original condition with all packaging and documentation.
            </p>
          </div>
          
          <div>
            <h3 className="font-cinzel text-lg mb-3">Warranty</h3>
            <p className="text-gray-600 text-sm">
              All our engagement rings come with a lifetime warranty against manufacturing defects.
              We also offer complimentary cleaning and inspection services.
            </p>
          </div>
        </div>
      </div>
      
      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-cinzel text-xl">Request Information</h3>
                <button 
                  onClick={() => setShowInquiryForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-amber-50 rounded-md">
                <h4 className="font-medium text-amber-800 mb-1">Product Details</h4>
                <p className="text-sm text-gray-700">{product.title}</p>
                <p className="text-sm text-gray-700">
                  {selectedMetal ? `${selectedMetal.karat} ${selectedMetal.color}` : ''} - 
                  Size {selectedSize?.size} - 
                  ${totalPrice.toLocaleString()}
                </p>
              </div>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {formError}
                </div>
              )}
              
              <form onSubmit={handleInquirySubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={inquiryForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={inquiryForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={inquiryForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={inquiryForm.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Please let us know if you have any questions about this product..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors disabled:bg-amber-300"
                  >
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
