'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  status: string;
  pricing: {
    total: number;
  };
  estimatedDelivery?: string;
  createdAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('orderNumber');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]); // fetchOrder is stable, no need to include

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?orderNumber=${orderNumber}`);
      const data = await response.json();
      
      if (data.orders && data.orders.length > 0) {
        setOrder(data.orders[0]);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Link href="/" className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8 text-center border-b border-gray-200">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Order Number:</dt>
                    <dd className="font-medium">{order.orderNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Order Date:</dt>
                    <dd className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Status:</dt>
                    <dd className="font-medium capitalize">{order.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Total:</dt>
                    <dd className="font-medium">${order.pricing.total.toFixed(2)}</dd>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Estimated Delivery:</dt>
                      <dd className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">What&apos;s Next?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You&apos;ll receive an email confirmation shortly
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    We&apos;ll notify you when your order ships
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Track your order status anytime
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/" 
              className="flex-1 bg-amber-500 text-white text-center py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              href={`/orders?email=${order.customerEmail}`}
              className="flex-1 bg-white text-amber-500 border border-amber-500 text-center py-2 px-4 rounded-md hover:bg-amber-50 transition-colors"
            >
              View Order Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}