/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { CartItem } from '@/types/cart';

// Form state interfaces
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

// Interface for ring size options
interface SizeOption {
  size: number;
  isAvailable: boolean;
  additionalPrice: number;
}

// Display customization details for each cart item
const renderCustomizationDetails = (item: CartItem) => {
  if (!item.customization?.isCustomized) return null;

  return (
    <div className="mt-2 text-sm">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {item.customization.customizationType === 'setting-diamond' && 'Custom Diamond Ring'}
        {item.customization.customizationType === 'setting-gemstone' && 'Custom Gemstone Ring'}
        {item.customization.customizationType === 'preset' && 'Pre-set Ring'}
      </span>

      {/* Display detailed customization info */}
      {item.customization.customizationDetails && (
        <div className="mt-2 space-y-1 text-xs text-gray-600">
          {item.customization.customizationDetails.stone && (
            <div>
              <span className="font-medium">Stone: </span>
              {item.customization.customizationDetails.stone.type}{' '}
              {item.customization.customizationDetails.stone.carat}ct
              {item.customization.customizationDetails.stone.color && `, ${item.customization.customizationDetails.stone.color}`}
              {item.customization.customizationDetails.stone.clarity && `, ${item.customization.customizationDetails.stone.clarity}`}
              {item.customization.customizationDetails.stone.cut && `, ${item.customization.customizationDetails.stone.cut}`}
            </div>
          )}
          {item.customization.customizationDetails.setting && (
            <div>
              <span className="font-medium">Setting: </span>
              {item.customization.customizationDetails.setting.style}{' '}
              {item.customization.customizationDetails.setting.settingType} in{' '}
              {item.customization.customizationDetails.setting.metalType}
            </div>
          )}
        </div>
      )}

      {item.customization.notes && (
        <p className="mt-1 italic text-gray-500">{item.customization.notes}</p>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, updateItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingItems, setIsValidatingItems] = useState(true);
  const [itemsWithMissingSize, setItemsWithMissingSize] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{[productId: string]: SizeOption[]}>({});
  const [isLoadingSizes, setIsLoadingSizes] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(subtotal);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Shipping method and costs
  const [shippingMethod, setShippingMethod] = useState('standard');
  const shippingCosts = {
    standard: 5.99,
    express: 15.99,
    overnight: 29.99
  };
  
  // Calculate totals
  const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];
  const tax = calculatedTotal * 0.08; // 8% tax rate
  const total = calculatedTotal + shipping + tax;
  
  // First useEffect to fetch and validate items
  useEffect(() => {
    const validateCartItems = async () => {
      setIsValidatingItems(true);
      
      // Check for ring items without sizes
      const ringsWithoutSize = items.filter(item => 
        ((item.productType === 'wedding' || item.productType === 'engagement') && !item.size) ||
        (!item.productType && !item.size && item.metalOption)
      );
      
      if (ringsWithoutSize.length > 0) {
        setItemsWithMissingSize(ringsWithoutSize.map(item => item.cartItemId || item._id));
        
        // Fetch available sizes for these items
        setIsLoadingSizes(true);
        
        const sizesData: {[productId: string]: SizeOption[]} = {};
        
        for (const item of ringsWithoutSize) {
          try {
            const endpoint = item.productType === 'engagement' 
              ? `/api/products/engagement/detail/${item._id}`
              : `/api/products/wedding/detail/${item._id}`;
              
            const response = await fetch(endpoint);
            if (response.ok) {
              const data = await response.json();
              sizesData[item._id] = data.product.sizes;
              
              if (!item.productType) {
                updateItem(item.cartItemId || item._id, { 
                  productType: 'wedding' 
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching sizes for product ${item._id}:`, error);
          }
        }
        
        setAvailableSizes(sizesData);
        setIsLoadingSizes(false);
      }
      
      setIsValidatingItems(false);
    };
    
    validateCartItems();
  }, [items, updateItem]); // Remove recalculateTotal from here

  // Separate useEffect for recalculating the total
  useEffect(() => {
    // Only recalculate if we have items and available sizes
    if (items.length > 0) {
      let newTotal = 0;
      
      for (const item of items) {
        let itemPrice = item.price;
        
        if ((item.productType === 'wedding' || item.productType === 'engagement') && 
            item.size && 
            availableSizes[item._id]) {
          
          const sizeOption = availableSizes[item._id]?.find(s => s.size === item.size);
          if (sizeOption) {
            itemPrice += sizeOption.additionalPrice;
          }
        }
        
        newTotal += itemPrice * item.quantity;
      }
      
      setCalculatedTotal(newTotal);
    } else {
      setCalculatedTotal(0);
    }
  }, [items, availableSizes]); // Only depend on items and availableSizes
  
  // Handle size selection for items
  const handleSizeChange = (itemId: string, cartItemId: string, size: number) => {
    // Find the item in the cart
    const item = items.find(i => i.cartItemId === cartItemId || i._id === itemId);
    if (!item) return;
    
    // Update the item with the new size
    updateItem(cartItemId || itemId, { size });
    
    // Remove this item from the missing sizes list
    setItemsWithMissingSize(prev => prev.filter(id => id !== cartItemId && id !== itemId));
    
    // Recalculate total
    
    toast.success('Ring size updated');
  };
  
  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate shipping form
  const validateShippingForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  // Validate payment form
  const validatePaymentForm = () => {
    const requiredFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
    for (const field of requiredFields) {
      if (!paymentInfo[field as keyof PaymentInfo]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic card number validation (16 digits)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    
    // Basic CVV validation (3-4 digits)
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(paymentInfo.cvv)) {
      toast.error('Please enter a valid CVV code');
      return false;
    }
    
    return true;
  };
  
  // Validate all items have required options
  const validateCartItems = () => {
    // Check if there are any rings without sizes
    if (itemsWithMissingSize.length > 0) {
      toast.error('Please select sizes for all ring items before proceeding');
      return false;
    }
    
    return true;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateCartItems()) {
        return;
      }
      
      if (validateShippingForm()) {
        setCurrentStep(2);
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCartItems()) {
      return;
    }
    
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      // For this example, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If cart is empty, show message and link to continue shopping
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-cinzel mb-6">Your Cart is Empty</h1>
        <p className="mb-8">You don't have any items in your cart yet.</p>
        <Link 
          href="/products" 
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-full transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  // If still validating items, show loading
  if (isValidatingItems) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-cinzel mb-6">Preparing Your Checkout</h1>
        <p className="mb-8">Validating your cart items...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel mb-8 text-center">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-2"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>
            2
          </div>
        </div>
      </div>
      
      {/* Missing Size Warning */}
      {itemsWithMissingSize.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="text-amber-800 font-semibold mb-2">Ring Size Required</h2>
          <p className="text-amber-700 mb-4">
            Please select a size for the following rings before proceeding with checkout:
          </p>
          
          <div className="space-y-4">
            {items.filter(item => itemsWithMissingSize.includes(item.cartItemId || item._id)).map(item => (
              <div key={item.cartItemId || item._id} className="flex items-center bg-white p-3 rounded-md">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-xs text-gray-500">
                    {item.metalOption && `${item.metalOption.karat} ${item.metalOption.color}`}
                  </p>
                  
                  {isLoadingSizes ? (
                    <p className="text-xs text-gray-500 mt-2">Loading available sizes...</p>
                  ) : (
                    <div className="mt-2">
                      <label className="text-xs text-gray-700 mb-1 block">Select Ring Size:</label>
                      <select 
                        className="w-full p-1 text-sm border border-gray-300 rounded-md"
                        onChange={(e) => handleSizeChange(item._id, item.cartItemId || item._id, Number(e.target.value))}
                        value={item.size || ''}
                      >
                        <option value="">Select Size</option>
                        {availableSizes[item._id]
                          ?.filter(s => s.isAvailable)
                          .sort((a, b) => a.size - b.size) // Sort sizes in ascending order
                          .map(size => (
                            <option key={size.size} value={size.size}>
                              {size.size} {size.additionalPrice > 0 ? `(+$${size.additionalPrice.toFixed(2)})` : ''}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary - Always visible */}
        <div className="lg:col-span-1 order-2 lg:order-2">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
            <h2 className="text-xl font-cinzel mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {items.map((item) => {
                const sizeOption = item.size && availableSizes[item._id] 
                  ? availableSizes[item._id].find(s => s.size === item.size)
                  : null;
                
                return (
                  <div key={item.cartItemId || item._id} className="flex py-3 border-b border-gray-200 last:border-0">
                    <div className="flex space-x-4">
                      {/* Primary Setting Image */}
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Diamond Image for Custom Rings */}
                      {item.customization?.isCustomized && 
                       item.customization.customizationType === 'setting-diamond' && 
                       item.customization.customizationDetails?.stone?.image && (
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={item.customization.customizationDetails.stone.image}
                            alt={`${item.customization.customizationDetails.stone.carat}ct ${item.customization.customizationDetails.stone.cut} Diamond`}
                            fill
                            sizes="64px"
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-xs text-gray-500">
                        {item.metalOption && `${item.metalOption.karat} ${item.metalOption.color}`}
                        {item.size && ` • Size ${item.size}`}
                        {sizeOption && sizeOption.additionalPrice > 0 && ` (+$${sizeOption.additionalPrice.toFixed(2)})`}
                        {item.quantity > 1 && ` • Qty: ${item.quantity}`}
                      </p>
                      
                      {/* Display individual prices for custom rings */}
                      {item.customization?.isCustomized && item.customization.componentPrices && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p>Setting: ${item.customization.componentPrices.setting?.toFixed(2)}</p>
                          <p>Diamond: ${item.customization.componentPrices.stone?.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {renderCustomizationDetails(item)}
                      
                      <p className="text-sm font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-cinzel mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Shipping Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block font-medium">Standard Shipping</span>
                        <span className="block text-sm text-gray-500">3-5 business days</span>
                      </div>
                      <span className="font-medium">${shippingCosts.standard.toFixed(2)}</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block font-medium">Express Shipping</span>
                        <span className="block text-sm text-gray-500">2-3 business days</span>
                      </div>
                      <span className="font-medium">${shippingCosts.express.toFixed(2)}</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="overnight"
                        checked={shippingMethod === 'overnight'}
                        onChange={() => setShippingMethod('overnight')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block font-medium">Overnight Shipping</span>
                        <span className="block text-sm text-gray-500">Next business day</span>
                      </div>
                      <span className="font-medium">${shippingCosts.overnight.toFixed(2)}</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-full transition-colors"
                    disabled={itemsWithMissingSize.length > 0}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-cinzel mb-4">Payment Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                    maxLength={19}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    value={paymentInfo.cardHolder}
                    onChange={handlePaymentChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Billing Address</h3>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      defaultChecked
                    />
                    <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                      Same as shipping address
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 px-6 rounded-full transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-full transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting || itemsWithMissingSize.length > 0}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Security and Guarantee Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Secure Checkout</h3>
          <p className="text-sm text-gray-600">
            Your payment information is encrypted and secure. We never store your full credit card details.
          </p>
        </div>
        
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.021 12.021 0 012 12h4a8.002 8.002 0 0014.618-2.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Money-Back Guarantee</h3>
          <p className="text-sm text-gray-600">
            If you're not completely satisfied with your purchase, return it within 30 days for a full refund.
          </p>
        </div>
        
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M9 9h6v6H9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
          <p className="text-sm text-gray-600">
            All transactions are processed securely through our PCI DSS compliant payment processor.
          </p>
        </div>
      </div>
    </div>
  );
}
