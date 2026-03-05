import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { getStripe, PRICE_IDS, isStripeConfigured } from '@/lib/stripe';
import type { PricePlan } from '@/lib/stripe';

/**
 * POST /api/stripe/checkout — Create a Stripe Checkout session.
 * Body: { plan: 'weekly' | 'monthly' }
 * Returns: { url: string } — redirect URL to Stripe Checkout
 */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Payment processing is not configured' },
      { status: 503 }
    );
  }

  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const plan = body.plan as PricePlan;

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "weekly" or "monthly".' },
        { status: 400 }
      );
    }

    // Get user email for Stripe
    const { data: { user } } = await client.auth.getUser();
    const email = user?.email;

    // Check if user already has a Stripe customer ID
    const { data: quota } = await client
      .from('user_quotas')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = quota?.stripe_customer_id;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: email || undefined,
        metadata: { userId },
      });
      customerId = customer.id;

      // Save customer ID
      await client
        .from('user_quotas')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${origin}/dashboard?tab=profile&payment=success`,
      cancel_url: `${origin}/pricing?payment=canceled`,
      metadata: { userId, plan },
      subscription_data: {
        metadata: { userId, plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe/checkout]', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
