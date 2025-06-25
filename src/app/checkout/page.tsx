/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
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

// US States constant
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

// Shipping options constant
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 5.99
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 15.99
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 29.99
  }
];

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
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingItems, setIsValidatingItems] = useState(true);
  const [itemsWithMissingSize, setItemsWithMissingSize] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{[productId: string]: SizeOption[]}>({});
  const [isLoadingSizes, setIsLoadingSizes] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(subtotal);
  
  // Form states - Initialize with user data if available (only basic fields)
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

  // Update shipping info when user data changes (only basic fields)
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);
  
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
  }, [items, updateItem]);

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
  }, [items, availableSizes]);
  
  // Handle size selection for items
  const handleSizeChange = (itemId: string, cartItemId: string, size: number) => {
    // Find the item in the cart
    const item = items.find(i => i.cartItemId === cartItemId || i._id === itemId);
    if (!item) return;
    
    // Update the item with the new size
    updateItem(cartItemId || itemId, { size });
    
    // Remove this item from the missing sizes list
    setItemsWithMissingSize(prev => prev.filter(id => id !== cartItemId && id !== itemId));
    
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
  
  // Validate shipping form - only check when needed
  const validateShippingForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      return false;
    }
    
    return true;
  };
  
  // Validate payment form - only check when needed
  const validatePaymentForm = () => {
    const requiredFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
    for (const field of requiredFields) {
      if (!paymentInfo[field as keyof PaymentInfo]) {
        return false;
      }
    }
    
    // Basic card number validation (16 digits)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      return false;
    }
    
    // Basic expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(paymentInfo.expiryDate)) {
      return false;
    }
    
    // Basic CVV validation (3 digits)
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(paymentInfo.cvv)) {
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
  
  // Calculate estimated delivery date
  const calculateEstimatedDelivery = (method: string) => {
    const now = new Date();
    let days = 7; // default standard shipping
    
    switch (method) {
      case 'express':
        days = 3;
        break;
      case 'overnight':
        days = 1;
        break;
      default:
        days = 7;
    }
    
    const deliveryDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    return deliveryDate.toISOString();
  };
  
  // Get card type from card number
  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  };
  
  // Create order function - Authentication is optional
  const createOrder = async () => {
    const orderData = {
      userId: user?.id || null, // Optional - can be null for guest orders
      customerEmail: shippingInfo.email,
      items: items.map(item => ({
        productId: item._id,
        productType: item.productType || 'jewelry',
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        metalOption: item.metalOption,
        customization: item.customization
      })),
      shippingAddress: shippingInfo,
      paymentInfo: {
        cardHolder: paymentInfo.cardHolder,
        cardLastFour: paymentInfo.cardNumber.slice(-4),
        cardType: getCardType(paymentInfo.cardNumber),
        paymentMethod: 'card' as const,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      },
      pricing: {
        subtotal: calculatedTotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingMethod: shippingMethod as 'standard' | 'express' | 'overnight'
      },
      estimatedDelivery: calculateEstimatedDelivery(shippingMethod),
      notes: user 
        ? `Order placed by registered user: ${user.firstName} ${user.lastName}` 
        : `Guest order placed via website checkout`,
      orderType: user ? 'registered' : 'guest'
    };

    // Simple fetch without authentication requirement
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    return await response.json();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Validate shipping form and show specific errors
      if (!validateShippingForm()) {
        if (!shippingInfo.firstName) toast.error('First name is required');
        else if (!shippingInfo.lastName) toast.error('Last name is required');
        else if (!shippingInfo.email) toast.error('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) toast.error('Please enter a valid email address');
        else if (!shippingInfo.phone) toast.error('Phone number is required');
        else if (!shippingInfo.address) toast.error('Address is required');
        else if (!shippingInfo.city) toast.error('City is required');
        else if (!shippingInfo.state) toast.error('State is required');
        else if (!shippingInfo.zipCode) toast.error('ZIP code is required');
        return;
      }
      
      if (itemsWithMissingSize.length > 0) {
        toast.error('Please select ring sizes for all items');
        return;
      }
      
      setCurrentStep(2);
      return;
    }
    
    // Validate payment form and show specific errors
    if (!validatePaymentForm()) {
      if (!paymentInfo.cardHolder) toast.error('Cardholder name is required');
      else if (!paymentInfo.cardNumber) toast.error('Card number is required');
      else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) toast.error('Please enter a valid 16-digit card number');
      else if (!paymentInfo.expiryDate) toast.error('Expiry date is required');
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) toast.error('Please enter expiry date in MM/YY format');
      else if (!paymentInfo.cvv) toast.error('CVV is required');
      else if (!/^\d{3}$/.test(paymentInfo.cvv)) toast.error('Please enter a valid 3-digit CVV');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const order = await createOrder();
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if cart is empty
  if (items.length === 0 && !isValidatingItems) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <Link href="/" className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600">
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  // Loading state
  if (isValidatingItems) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <span className="ml-4">Validating cart items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel mb-8 text-center">Checkout</h1>
      
      {/* User Status Banner */}
      <div className="mb-6">
        {user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800">
                Signed in as <strong>{user.firstName} {user.lastName}</strong> ({user.email})
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800">
                  Checking out as guest
                </span>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Sign In
                </Link>
                <span className="text-blue-400">|</span>
                <Link 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Create Account
                </Link>
              </div>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              Sign in to save your information for faster checkout and order tracking.
            </p>
          </div>
        )}
      </div>

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
                          .sort((a, b) => a.size - b.size)
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

                      {/* Stone Image for Custom Rings (Diamond or Gemstone) */}
                      {item.customization?.isCustomized && 
                       item.customization.customizationDetails?.stone?.image && (
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={item.customization.customizationDetails.stone.image}
                            alt={`${item.customization.customizationDetails.stone.carat}ct ${item.customization.customizationDetails.stone.type === 'diamond' ? 'Diamond' : item.customization.customizationDetails.stone.type}`}
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
                          <p>{item.customization.customizationDetails?.stone?.type === 'diamond' ? 'Diamond' : 'Gemstone'}: ${item.customization.componentPrices.stone?.toFixed(2)}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ${((item.price + (sizeOption?.additionalPrice || 0)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {renderCustomizationDetails(item)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Totals */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Form */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-cinzel mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      >
                        <option value="">Select State</option>
                        {US_STATES.map(state => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Method */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-cinzel mb-4">Shipping Method</h2>
                  
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map(option => (
                      <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={shippingMethod === option.id}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{option.name}</span>
                              <p className="text-sm text-gray-500">{option.description}</p>
                            </div>
                            <span className="font-medium">${option.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={itemsWithMissingSize.length > 0}
                  className={`w-full py-3 px-6 rounded-md font-medium ${
                    itemsWithMissingSize.length > 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-cinzel mb-4">Payment Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardHolder"
                        value={paymentInfo.cardHolder}
                        onChange={handlePaymentChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Review */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-cinzel mb-4">Review Your Order</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                        {shippingInfo.country}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.email}<br />
                        {shippingInfo.phone}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <p className="text-sm text-gray-600">
                        {SHIPPING_OPTIONS.find(opt => opt.id === shippingMethod)?.name} - 
                        ${SHIPPING_OPTIONS.find(opt => opt.id === shippingMethod)?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back to Shipping
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-6 rounded-md font-medium text-white ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
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
