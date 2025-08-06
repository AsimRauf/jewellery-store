'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { WeddingRing } from '@/types/wedding';
import { toast } from 'react-hot-toast';
import ProductImageGallery from '@/components/wedding/ProductImageGallery';
import SizeSelector from '@/components/wedding/SizeSelector';
import MetalSelector from '@/components/wedding/MetalSelector';
import ProductFeatures from '@/components/wedding/ProductFeatures';
import RelatedProducts from '@/components/shared/RelatedProducts';
import ProductDescription from '@/components/wedding/ProductDescription';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { CartItem } from '@/types/cart';
import { BaseMetalOption } from '@/types/shared';

// Define types for sizes (metal options are now imported)
type MetalOption = BaseMetalOption;

interface SizeOption {
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

export default function WeddingRingDetailPage() {
  const params = useParams() as { slug: string } | null;
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  
  // Use the full slug as identifier
  const slug = params?.slug || '';
  
  // State variables
  const [product, setProduct] = useState<WeddingRing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Add states for inquiry form
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/wedding/detail/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        console.log('Wedding ring detail data:', data.product);
        console.log('Metal options:', data.product.metalOptions);
        console.log('Metal color images:', data.product.metalColorImages);
        
        // Validate data consistency
        if (data.product.metalColorImages && data.product.metalOptions) {
          const metalColors = data.product.metalOptions.map((m: MetalOption) => m.color);
          const imageColors = Object.keys(data.product.metalColorImages);
          
          console.log('Available metal colors:', metalColors);
          console.log('Available image colors:', imageColors);
          
          const orphanedImageColors = imageColors.filter((color: string) => !metalColors.includes(color));
          if (orphanedImageColors.length > 0) {
            console.warn('⚠️ Found images for metal colors that don\'t have metal options:', orphanedImageColors);
            console.warn('This might indicate data inconsistency - some metal options may have been lost during editing');
          }
        }
        
        setProduct(data.product);
        
        // Set default metal option
        const defaultMetal = data.product.metalOptions?.find((m: MetalOption) => m.isDefault) || 
                            data.product.metalOptions?.[0];
        console.log('Selected default metal:', defaultMetal);
        if (defaultMetal) {
          setSelectedMetal(defaultMetal);
        }
        
        // Check if there's a metal option in the URL
        const metalParam = searchParams?.get('metal');
        if (metalParam) {
          const [karat, ...colorParts] = metalParam.split('-');
          const color = colorParts.join(' ');
          
          const matchingMetal = data.product.metalOptions?.find(
            (m: MetalOption) => m.karat === karat && m.color === color
          );
          
          if (matchingMetal) {
            setSelectedMetal(matchingMetal);
          }
        }
        
        // Set default size
        if (data.product.sizes && data.product.sizes.length > 0) {
          const defaultSize = data.product.sizes?.find((s: SizeOption) => s.isAvailable);
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
    
    if (slug) {
      fetchProduct();
    }
  }, [slug, searchParams]);
  
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
      const sizeOption = product.sizes?.find(s => s.size === selectedSize);
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
    } else if (product.media?.images?.length > 0) {
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
  
  // Handle inquiry form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle inquiry form submission
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
            size: selectedSize,
            price: calculateTotalPrice()
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
  
  // Get images for the selected metal color
  const getImagesForSelectedMetal = () => {
    if (!product || !selectedMetal) return [];
    
    // If we have metal color images for the selected color, use those
    if (product.metalColorImages && product.metalColorImages[selectedMetal.color]?.length > 0) {
      return product.metalColorImages[selectedMetal.color];
    }
    
    // Otherwise, use the general product images
    return product.media?.images || [];
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
    <div className="container mx-auto px-4 py-8 relative">
      {/* Sticky Breadcrumbs */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 mb-6">
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
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative">
        {/* Left Column: Product Images and Description - Made Sticky */}
        <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent pb-8">
          <div className="space-y-8">
            {/* Product Images */}
            <ProductImageGallery
              images={getImagesForSelectedMetal()}
              video={product.media.video}
              activeIndex={activeImageIndex}
              onImageChange={setActiveImageIndex}
            />
  
            {/* Product Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-amber-50 border-b border-amber-100">
                <h2 className="text-xl font-cinzel text-amber-800">Product Description</h2>
              </div>
              <div className="p-6">
                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>
  
        {/* Right Column: Product Details */}
        <div className="relative">
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
              disabled={addingToCart || !selectedSize || !selectedMetal || (product.totalPieces !== undefined && product.totalPieces <= 0)}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || !selectedSize || !selectedMetal || (product.totalPieces !== undefined && product.totalPieces <= 0)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600'} 
                transition-colors`}
            >
              {addingToCart ? 'Adding...' : (product.totalPieces !== undefined && product.totalPieces <= 0 ? 'Out of Stock' : 'Add to Cart')}
            </button>
  
            {/* Request Information Button */}
            <button
              onClick={() => setShowInquiryForm(true)}
              disabled={addingToCart || !selectedSize || !selectedMetal}
              className={`w-full py-3 px-6 rounded-full font-medium text-white 
                ${addingToCart || !selectedSize || !selectedMetal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8B0000] hover:bg-[#6B0000]'} 
                transition-colors flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Information
            </button>
          </div>
  
          {/* Product Features */}
          <ProductFeatures product={product} selectedMetal={selectedMetal} />
        </div>
      </div>
  
      {/* Related Products */}
      <RelatedProducts
        currentProductId={product._id}
        productType="wedding"
        subcategory={product.subcategory}
        style={product.style[0]}
      />
  
      {/* Rest of the code (Inquiry Form Modal) remains unchanged */}
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
                  Size {selectedSize} - 
                  ${calculateTotalPrice().toLocaleString()}
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