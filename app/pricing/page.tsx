'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';

const FREE_FEATURE_KEYS = [
  'pricing.features.freeAnalyses',
  'pricing.features.initialFree',
  'pricing.features.freeCv',
  'pricing.features.freeCoverLetter',
  'pricing.features.freeHistory',
  'pricing.features.pdfDownload',
  'pricing.features.outputTagging',
];

const PRO_FEATURE_KEYS = [
  'pricing.features.proAnalyses',
  'pricing.features.initialFree',
  'pricing.features.proCv',
  'pricing.features.proCoverLetter',
  'pricing.features.proCoach',
  'pricing.features.unlimitedHistory',
  'pricing.features.pdfDownload',
  'pricing.features.outputTagging',
  'pricing.features.prioritySupport',
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const { t } = useTranslation();

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
            {t('pricing.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${billing === 'weekly' ? 'text-text-primary' : 'text-text-secondary'}`}>
            {t('pricing.weekly')}
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
            {t('pricing.monthly')}
            <span className="ml-1 text-xs text-success font-normal">{t('pricing.save25')}</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="rounded-2xl border border-black/[0.08] bg-surface-primary p-8 flex flex-col">
            <h2 className="text-xl font-bold text-text-primary mb-1">{t('pricing.free.name')}</h2>
            <p className="text-text-secondary text-sm mb-6">{t('pricing.free.description')}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">{t('pricing.free.price')}</span>
              <span className="text-text-secondary text-sm ml-1">{t('pricing.free.period')}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURE_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>
            <a
              href="/analyze"
              className="block w-full text-center py-3 px-4 rounded-xl border border-black/[0.12] text-text-primary font-medium hover:bg-surface-secondary transition-colors"
            >
              {t('pricing.free.cta')}
            </a>
          </div>

          {/* Pro tier */}
          <div className="rounded-2xl border-2 border-primary bg-surface-primary p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {t('pricing.pro.badge')}
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-1">{t('pricing.pro.name')}</h2>
            <p className="text-text-secondary text-sm mb-6">{t('pricing.pro.description')}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">
                {billing === 'weekly' ? t('pricing.pro.priceWeekly') : t('pricing.pro.priceMonthly')}
              </span>
              <span className="text-text-secondary text-sm ml-1">
                /{billing === 'weekly' ? t('pricing.pro.periodWeekly') : t('pricing.pro.periodMonthly')}
              </span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURE_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(billing)}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? t('pricing.pro.loading') : t('pricing.pro.cta')}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            {t('pricing.faq.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{t('pricing.faq.initialQ')}</h3>
              <p className="text-text-secondary text-sm">{t('pricing.faq.initialA')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{t('pricing.faq.resetQ')}</h3>
              <p className="text-text-secondary text-sm">{t('pricing.faq.resetA')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{t('pricing.faq.cancelQ')}</h3>
              <p className="text-text-secondary text-sm">{t('pricing.faq.cancelA')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{t('pricing.faq.dataQ')}</h3>
              <p className="text-text-secondary text-sm">{t('pricing.faq.dataA')}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
