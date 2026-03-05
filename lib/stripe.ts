// ============================================================================
// GapZero — Stripe Client Singleton
// Server-side only. Never import from client components.
// ============================================================================

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/** Lazy-initialized Stripe client (avoids build-time errors when key is missing) */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    });
  }
  return _stripe;
}

/** Price ID mapping */
export const PRICE_IDS = {
  weekly: process.env.STRIPE_PRICE_WEEKLY || '',
  monthly: process.env.STRIPE_PRICE_MONTHLY || '',
} as const;

export type PricePlan = keyof typeof PRICE_IDS;

/** Validate that Stripe is configured */
export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}
