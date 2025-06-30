// utils/stripe.ts
import Stripe from 'stripe';

// Validate secret key presence
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set or is empty');
}

// Initialize Stripe client with the trimmed key and a valid API version
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
});

// Utility: Convert dollars to cents (for Stripe)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility: Convert cents from Stripe to dollars
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
