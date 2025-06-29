'use client';

import { useState, useEffect, use } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';

interface OrderData {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productType: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
    size?: number;
    metalOption?: {
      karat: string;
      color: string;
    };
    customization?: {
      isCustomized: boolean;
      customizationType?: 'setting-diamond' | 'setting-gemstone' | 'preset';
      customizationDetails?: {
        stone?: {
          type: string;
          carat: number;
          color: string;
          clarity: string;
          gemstoneType?: string;
          image?: string;
        };
        setting?: {
          style: string;
          metalType: string;
          settingType: string;
        };
      };
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    paymentMethod: string;
    cardLastFour?: string;
    cardBrand?: string;
    stripePaymentIntentId?: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingMethod: string;
  };
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    paymentStatus: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  });
  const [orderId, setOrderId] = useState<string | null>(null);

  // Extract order ID from params
  useEffect(() => {
    setOrderId(id);
  }, [id]);

  // Check authentication and admin status
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error('Admin access required');
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Fetch order details
  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Order not found');
          router.replace('/admin/orders');
          return;
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data.data);
      
      // Initialize update form
      setUpdateForm({
        status: data.data.status,
        paymentStatus: data.data.paymentStatus,
        trackingNumber: data.data.trackingNumber || '',
        estimatedDelivery: data.data.estimatedDelivery ? 
          new Date(data.data.estimatedDelivery).toISOString().split('T')[0] : '',
        notes: data.data.notes || ''
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  // Handle order update
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updateForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const data = await response.json();
      setOrder(data.data);
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle loading state
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link href="/admin/orders" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'disputed': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCustomizationDetails = (item: OrderData['items'][0]) => {
    if (!item.customization?.isCustomized) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">
          {item.customization.customizationType === 'setting-diamond' && 'Custom Diamond Ring'}
          {item.customization.customizationType === 'setting-gemstone' && 'Custom Gemstone Ring'}
          {item.customization.customizationType === 'preset' && 'Pre-set Ring'}
        </span>

        {item.customization.customizationDetails && (
          <div className="space-y-1 text-xs text-gray-600">
            {item.customization.customizationDetails.stone && (
              <div>
                <span className="font-medium">Stone: </span>
                {item.customization.customizationDetails.stone.type}{' '}
                {item.customization.customizationDetails.stone.carat}ct
                {item.customization.customizationDetails.stone.color && 
                  `, ${item.customization.customizationDetails.stone.color}`}
                {item.customization.customizationDetails.stone.clarity && 
                  `, ${item.customization.customizationDetails.stone.clarity}`}
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
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/orders" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Orders
        </Link>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="mt-2 opacity-80">
            Placed on {new Date(order.createdAt).toLocaleDateString()} • 
            Last updated {new Date(order.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Stone Image for Custom Items */}
                  {item.customization?.isCustomized && item.customization.customizationDetails?.stone?.image && (
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.customization.customizationDetails.stone.image}
                        alt={`${item.customization.customizationDetails.stone.type} stone`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.metalOption && `${item.metalOption.karat} ${item.metalOption.color}`}
                      {item.size && ` • Size ${item.size}`}
                      {item.quantity > 1 && ` • Qty: ${item.quantity}`}
                    </p>
                    
                    {renderCustomizationDetails(item)}
                    
                    <p className="text-sm font-medium mt-2 text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Contact Details</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.customerEmail}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Method:</span> {order.paymentInfo.paymentMethod}</p>
              {order.paymentInfo.cardBrand && order.paymentInfo.cardLastFour && (
                <p><span className="font-medium">Card:</span> {order.paymentInfo.cardBrand} ending in {order.paymentInfo.cardLastFour}</p>
              )}
              {order.paymentInfo.stripePaymentIntentId && (
                <p><span className="font-medium">Payment ID:</span> {order.paymentInfo.stripePaymentIntentId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({order.pricing.shippingMethod}):</span>
                <span>${order.pricing.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.pricing.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>${order.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Order Status:</span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Tracking:</span>
                  <span className="ml-2 text-sm text-gray-600">{order.trackingNumber}</span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Est. Delivery:</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Update Order */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Update Order</h2>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={updateForm.paymentStatus}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="failed">Failed</option>
                  <option value="requires_action">Requires Action</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={updateForm.trackingNumber}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                <input
                  type="date"
                  value={updateForm.estimatedDelivery}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Add notes about this order..."
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update Order'}
              </button>
            </form>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
