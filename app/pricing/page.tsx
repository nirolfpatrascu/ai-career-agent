'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';

const FREE_FEATURES = [
  '1 career analysis per week',
  'First analysis is always free',
  '1 CV generation per week',
  '1 cover letter per week',
  'Analysis history (last 5)',
  'PDF report download',
  'Output quality tagging',
];

const PRO_FEATURES = [
  '10 career analyses per week',
  'First analysis is always free',
  '10 CV generations per week',
  '10 cover letters per week',
  '10 AI Career Coach sessions',
  'Unlimited analysis history',
  'PDF report download',
  'Output quality tagging',
  'Priority support',
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const handleCheckout = async (plan: 'weekly' | 'monthly') => {
    if (!session) {
      window.location.href = '/analyze';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-display mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Start free with your first career analysis. Upgrade when you need more power for your job search.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${billing === 'weekly' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Weekly
          </span>
          <button
            onClick={() => setBilling(b => b === 'weekly' ? 'monthly' : 'weekly')}
            className="relative w-14 h-7 rounded-full bg-surface-secondary transition-colors"
            aria-label="Toggle billing period"
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-primary transition-transform ${
                billing === 'monthly' ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Monthly
            <span className="ml-1 text-xs text-success font-normal">Save 25%</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="rounded-2xl border border-black/[0.08] bg-surface-primary p-8 flex flex-col">
            <h2 className="text-xl font-bold text-text-primary mb-1">Free</h2>
            <p className="text-text-secondary text-sm mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">$0</span>
              <span className="text-text-secondary text-sm ml-1">forever</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/analyze"
              className="block w-full text-center py-3 px-4 rounded-xl border border-black/[0.12] text-text-primary font-medium hover:bg-surface-secondary transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Pro tier */}
          <div className="rounded-2xl border-2 border-primary bg-surface-primary p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-1">Pro</h2>
            <p className="text-text-secondary text-sm mb-6">For active job seekers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">
                {billing === 'weekly' ? '$9.99' : '$29.99'}
              </span>
              <span className="text-text-secondary text-sm ml-1">
                /{billing === 'weekly' ? 'week' : 'month'}
              </span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(billing)}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text-primary mb-1">What counts as my "initial analysis"?</h3>
              <p className="text-text-secondary text-sm">
                Your very first career analysis is always free and doesn&apos;t count toward your weekly limit.
                Use it to explore the platform and optimize your LinkedIn profile and CV.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">When do my weekly limits reset?</h3>
              <p className="text-text-secondary text-sm">
                All usage counters reset every Monday at midnight UTC. Unused quota does not carry over.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">Can I cancel anytime?</h3>
              <p className="text-text-secondary text-sm">
                Yes. Cancel your subscription at any time from the billing portal. You&apos;ll keep Pro access
                until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">Is my data safe?</h3>
              <p className="text-text-secondary text-sm">
                Yes. Your CV and personal data are stored securely with row-level security.
                We never share your data with third parties. You can delete your data at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
