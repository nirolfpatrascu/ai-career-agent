'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function Hero() {
  const { t } = useTranslation();
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Parse rotating words from translations (stored as JSON array)
  const rotatingWords: string[] = (() => {
    try {
      const val = t('hero.rotatingWords');
      return typeof val === 'string' ? JSON.parse(val) : ['career strategy'];
    } catch {
      return ['career strategy'];
    }
  })();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          {t('hero.badge')}
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
          {t('hero.headline1')}
          <br />
          <span className="text-text-secondary">{t('hero.headline2')}</span>
          <br />
          <span
            className={`text-primary inline-block transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {rotatingWords[wordIndex]}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
          {t('hero.subtitle')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/analyze"
            className="group btn-primary text-lg px-8 py-4 flex items-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            {t('hero.analyzeFree')}
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/analyze?demo=true"
            className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {t('common.tryDemo')}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
          {[
            { value: '~90s', label: t('hero.stats.analysisTime') },
            { value: '10+', label: t('hero.stats.dataPoints') },
            { value: '3', label: t('hero.stats.aiSteps') },
            { value: t('common.free'), label: t('hero.stats.toUse') },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-text-primary">
                {stat.value}
              </span>
              <span className="text-sm text-text-secondary mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
