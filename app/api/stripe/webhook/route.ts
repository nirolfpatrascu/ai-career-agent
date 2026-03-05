import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { upgradeToPro, downgradeToFree, updateSubscriptionStatus } from '@/lib/quota';
import type Stripe from 'stripe';

// Use service-role client for webhook (no user JWT available)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getServiceClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * POST /api/stripe/webhook — Handle Stripe webhook events.
 * MUST verify webhook signature to prevent spoofing.
 */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const client = getServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) {
          console.warn('[stripe/webhook] Missing userId or subscriptionId in session');
          break;
        }

        // Fetch subscription for period end (v20+: period on items)
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const firstItem = subscription.items?.data?.[0];
        const periodEnd = firstItem
          ? new Date(firstItem.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await upgradeToPro(
          client,
          userId,
          session.customer as string,
          subscriptionId,
          periodEnd
        );

        console.log('[stripe/webhook] User upgraded to Pro:', userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        const subItem = subscription.items?.data?.[0];
        const periodEnd = subItem
          ? new Date(subItem.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const status = subscription.status;

        if (status === 'active' || status === 'trialing') {
          await updateSubscriptionStatus(client, userId, status, periodEnd);
        } else if (status === 'past_due') {
          await updateSubscriptionStatus(client, userId, 'past_due', periodEnd);
        } else if (status === 'canceled' || status === 'unpaid') {
          await downgradeToFree(client, userId);
        }

        console.log('[stripe/webhook] Subscription updated:', userId, status);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await downgradeToFree(client, userId);
        console.log('[stripe/webhook] User downgraded to Free:', userId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe v20+, subscription is under parent
        const parent = invoice.parent as { subscription?: string | { id: string } } | null;
        const subscriptionRef = parent?.subscription;
        const subscriptionId = typeof subscriptionRef === 'string'
          ? subscriptionRef
          : subscriptionRef?.id;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await updateSubscriptionStatus(client, userId, 'past_due');
        console.log('[stripe/webhook] Payment failed for user:', userId);
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (error) {
    console.error('[stripe/webhook] Error handling event:', event.type, error);
    // Return 200 anyway to prevent Stripe retries on our bugs
  }

  return NextResponse.json({ received: true });
}
