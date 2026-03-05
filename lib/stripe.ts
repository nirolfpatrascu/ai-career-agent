// ============================================================================
// GapZero — Stripe Client Singleton
// Server-side only. Never import from client components.
// ============================================================================

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[stripe] STRIPE_SECRET_KEY not set — payment features disabled');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

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
