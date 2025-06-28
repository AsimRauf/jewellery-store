// utils/stripe.ts
import Stripe from 'stripe';

// Validate secret key presence
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

// Initialize Stripe client with latest config
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
