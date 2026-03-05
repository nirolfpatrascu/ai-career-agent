import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';

/**
 * POST /api/stripe/portal — Create a Stripe Customer Portal session.
 * Returns: { url: string } — redirect URL to Stripe billing portal
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
    // Get Stripe customer ID
    const { data: quota } = await client
      .from('user_quotas')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!quota?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: quota.stripe_customer_id,
      return_url: `${origin}/dashboard?tab=profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe/portal]', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
