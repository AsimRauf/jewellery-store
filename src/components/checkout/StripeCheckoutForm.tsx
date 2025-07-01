'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import type { PaymentIntent as StripePaymentIntent } from '@stripe/stripe-js';



interface OrderData {
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    productType?: string;
  }>;
}

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntent: StripePaymentIntent) => void;
  onError: (error: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  orderData: OrderData;
}

export default function StripeCheckoutForm({
  clientSecret,
  onSuccess,
  onError,
  isSubmitting,
  setIsSubmitting,
  orderData
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
    // Clear any previous messages when the component initializes
    setMessage(null);
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred');
          onError(error.message || 'Payment failed');
        } else {
          setMessage('An unexpected error occurred.');
          onError('An unexpected error occurred');
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('An unexpected error occurred.');
      onError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment & Billing Information</h3>
          <p className="text-sm text-gray-600 mb-4">
            Stripe will securely collect your payment and billing information.
          </p>
          <PaymentElement id="payment-element" options={paymentElementOptions} />
        </div>

        <button
          disabled={isSubmitting || !stripe || !elements}
          id="submit"
          className={`w-full py-3 px-6 rounded-md font-medium text-white ${
            isSubmitting || !stripe || !elements
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          <span id="button-text">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Complete Order - $${orderData.total.toFixed(2)}`
            )}
          </span>
        </button>

        {message && (
          <div className={`text-sm text-center ${message.includes('succeeded') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured by Stripe
          </div>
          <p>Your payment information is encrypted and processed securely.</p>
        </div>
      </div>
    </form>
  );
}