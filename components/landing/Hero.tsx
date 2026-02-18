'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function Hero() {
  const { t } = useTranslation();
  const words = t('hero.rotatingWords') as unknown as string[];
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % (Array.isArray(words) ? words.length : 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [words]);

  const rotatingWord = Array.isArray(words) ? words[wordIndex] : '';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="hero-gradient" />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Radial fade from center */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 40%, transparent 0%, #FFFBF5 100%)',
      }} />

      <div className={`relative z-10 max-w-container mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 bg-black/[0.04] border border-black/[0.08] rounded-full px-5 py-2 mb-10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-primary to-accent-orange" />
          </span>
          <span className="text-xs font-medium text-text-secondary tracking-wide">
            {t('hero.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-extrabold tracking-tight leading-[1.05] mb-7">
          <span className="block text-text-primary">{t('hero.headline1')}</span>
          <span className="block text-text-secondary mt-1">{t('hero.headline2')}</span>
          <span className="block mt-2 min-h-[1.15em]">
            <span key={wordIndex} className="text-gradient inline-block animate-word-in">
              {rotatingWord}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-12">
          {t('hero.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/analyze"
            className="group btn-primary text-base sm:text-lg px-8 py-4 flex items-center gap-3 rounded-2xl"
          >
            {t('hero.analyzeFree')}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/analyze?demo=true"
            className="btn-secondary text-base px-8 py-4 flex items-center gap-2.5 rounded-2xl"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {t('common.tryDemo')}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="inline-flex items-center gap-0 bg-black/[0.04] border border-black/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
          {[
            { value: '~90s', label: t('hero.stats.analysisTime') },
            { value: '10+', label: t('hero.stats.dataPoints') },
            { value: '3', label: t('hero.stats.aiSteps') },
            { value: t('common.free'), label: t('hero.stats.toUse') },
          ].map((stat, i, arr) => (
            <div key={i} className={`text-center px-6 sm:px-8 py-4 ${i < arr.length - 1 ? 'border-r border-black/[0.08]' : ''}`}>
              <div className="text-lg sm:text-xl font-bold text-text-primary font-display">{stat.value}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}