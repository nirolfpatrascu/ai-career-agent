'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BannerTemplate {
  id: string;
  label: string;
  /** Thumbnail shown in the picker — a small preview image in /public/banners/ */
  thumbnail: string;
  /** Dominant text color so the UI can hint at the style */
  style: 'dark' | 'light';
}

interface BannerGeneratorProps {
  role: string;
  skills: string[];
}

// ─── Template registry ────────────────────────────────────────────────────────
// Replace each id with your real Canva brand template ID from Step 2.
// Add a 400×100px thumbnail PNG for each to /public/banners/thumb-N.png.

const TEMPLATES: BannerTemplate[] = [
  { id: process.env.NEXT_PUBLIC_CANVA_TEMPLATE_1 ?? '', label: 'Midnight', thumbnail: '/banners/thumb-1.png', style: 'dark' },
  { id: process.env.NEXT_PUBLIC_CANVA_TEMPLATE_2 ?? '', label: 'Slate', thumbnail: '/banners/thumb-2.png', style: 'dark' },
  { id: process.env.NEXT_PUBLIC_CANVA_TEMPLATE_3 ?? '', label: 'Ocean', thumbnail: '/banners/thumb-3.png', style: 'dark' },
  { id: process.env.NEXT_PUBLIC_CANVA_TEMPLATE_4 ?? '', label: 'Sand', thumbnail: '/banners/thumb-4.png', style: 'light' },
  { id: process.env.NEXT_PUBLIC_CANVA_TEMPLATE_5 ?? '', label: 'Forest', thumbnail: '/banners/thumb-5.png', style: 'dark' },
];

type GenState = 'idle' | 'loading' | 'done' | 'error';

// ─── Component ────────────────────────────────────────────────────────────────

export default function BannerGenerator({ role, skills }: BannerGeneratorProps) {
  const [selected, setSelected] = useState<BannerTemplate>(TEMPLATES[0]);
  const [state, setState] = useState<GenState>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Top 5 skills — flat list from all skill categories
  const topSkills = skills.slice(0, 5);

  async function handleGenerate() {
    if (!selected.id) {
      setError('Template ID not configured. Add NEXT_PUBLIC_CANVA_TEMPLATE_N env vars.');
      setState('error');
      return;
    }

    setState('loading');
    setDownloadUrl(null);
    setError(null);

    try {
      const res = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selected.id,
          role,
          skills: topSkills,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'Generation failed');
      }

      setDownloadUrl(json.url);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  function handleDownload() {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `linkedin-banner-${role.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.target = '_blank';
    a.click();
  }

  return (
    <div className="space-y-5">
      {/* Role + skills preview */}
      <div className="rounded-xl border border-black/[0.06] bg-surface-secondary/40 px-4 py-3 space-y-1.5">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Will be written on your banner</p>
        <p className="text-sm font-semibold text-text-primary">{role}</p>
        <div className="flex flex-wrap gap-1.5">
          {topSkills.map((s, i) => (
            <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/[0.08] text-primary border border-primary/15 font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Template picker */}
      <div>
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2.5">Choose a template</p>
        <div className="grid grid-cols-5 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id || tpl.label}
              onClick={() => { setSelected(tpl); setState('idle'); setDownloadUrl(null); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-[4/1] ${
                selected.label === tpl.label
                  ? 'border-primary shadow-sm'
                  : 'border-black/[0.08] hover:border-primary/40'
              }`}
              title={tpl.label}
            >
              {/* Thumbnail image — falls back to a colored placeholder */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tpl.thumbnail}
                alt={tpl.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback: show a solid color block if thumbnail missing
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Label overlay */}
              <span className={`absolute bottom-0.5 left-1 text-[9px] font-semibold ${tpl.style === 'dark' ? 'text-white/80' : 'text-black/60'}`}>
                {tpl.label}
              </span>
              {selected.label === tpl.label && (
                <div className="absolute inset-0 border-2 border-primary rounded-[5px] pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action area */}
      {state === 'idle' && (
        <button
          onClick={handleGenerate}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Generate Banner
        </button>
      )}

      {state === 'loading' && (
        <div className="w-full flex flex-col items-center gap-3 py-4">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-secondary">Generating your banner in Canva…</p>
          <p className="text-xs text-text-tertiary">This takes 10–30 seconds</p>
        </div>
      )}

      {state === 'done' && downloadUrl && (
        <div className="space-y-3">
          {/* Preview */}
          <div className="rounded-xl overflow-hidden border border-black/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={downloadUrl} alt="Your LinkedIn banner" className="w-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PNG
            </button>
            <button
              onClick={() => { setState('idle'); setDownloadUrl(null); }}
              className="btn-secondary px-4"
            >
              Try another
            </button>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-xl border border-danger/20 bg-danger/[0.04] px-4 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-danger">Generation failed</p>
            <p className="text-xs text-text-secondary mt-0.5">{error}</p>
            <button onClick={() => setState('idle')} className="text-xs text-primary font-medium mt-2 hover:underline">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Upload hint */}
      {state === 'done' && (
        <p className="text-[11px] text-text-tertiary text-center">
          Upload on LinkedIn: Profile → Edit → Background photo → Upload photo
        </p>
      )}
    </div>
  );
}
