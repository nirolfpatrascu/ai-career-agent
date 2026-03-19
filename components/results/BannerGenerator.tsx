'use client';

import { useState } from 'react';

interface BannerTemplate {
  id: string;
  label: string;
  thumbnail: string;
}

interface BannerGeneratorProps {
  name: string;
  role: string;
  skills: string[];
}

const TEMPLATES: BannerTemplate[] = [
  { id: 'dark',        label: 'Dark',       thumbnail: '/banners/thumb-dark.png' },
  { id: 'minimalist',  label: 'Minimalist', thumbnail: '/banners/thumb-minimalist.png' },
  { id: 'colorful',    label: 'Colorful',   thumbnail: '/banners/thumb-colorful.png' },
  { id: 'bold',        label: 'Bold',       thumbnail: '/banners/thumb-bold.png' },
  { id: 'lightblue',   label: 'Light Blue', thumbnail: '/banners/thumb-lightblue.png' },
];

type GenState = 'idle' | 'loading' | 'done' | 'error';

export default function BannerGenerator({ name, role, skills }: BannerGeneratorProps) {
  const [selected, setSelected] = useState<BannerTemplate>(TEMPLATES[0]);
  const [state, setState] = useState<GenState>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const topSkills = skills.slice(0, 5);

  async function handleGenerate() {
    setState('loading');
    setPreviewUrl(null);
    setError(null);

    try {
      const res = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selected.id, name, role, skills: topSkills }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? 'Generation failed');
      }

      // Response is a PNG binary — create an object URL for preview + download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  function handleDownload() {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `linkedin-banner-${selected.id}.png`;
    a.click();
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setState('idle');
    setError(null);
  }

  return (
    <div className="space-y-5">
      {/* Name + role + skills preview */}
      <div className="rounded-xl border border-black/[0.06] bg-surface-secondary/40 px-4 py-3 space-y-1.5">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Will appear on your banner</p>
        {name && <p className="text-sm font-bold text-text-primary">{name}</p>}
        <p className="text-sm text-text-secondary">{role}</p>
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
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2.5">Choose a style</p>
        <div className="grid grid-cols-5 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => { setSelected(tpl); reset(); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selected.id === tpl.id
                  ? 'border-primary shadow-sm'
                  : 'border-black/[0.08] hover:border-primary/40'
              }`}
              title={tpl.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tpl.thumbnail}
                alt={tpl.label}
                className="w-full h-auto object-cover block"
              />
              <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-semibold bg-black/40 text-white py-0.5">
                {tpl.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {state === 'idle' && (
        <button onClick={handleGenerate} className="w-full btn-primary flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
          </svg>
          Generate Banner
        </button>
      )}

      {state === 'loading' && (
        <div className="w-full flex flex-col items-center gap-3 py-5">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-secondary">Generating your banner…</p>
        </div>
      )}

      {state === 'done' && previewUrl && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-black/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Your LinkedIn banner" className="w-full block" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex-1 btn-primary flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PNG
            </button>
            <button onClick={reset} className="btn-secondary px-4">
              Try another
            </button>
          </div>
          <p className="text-[11px] text-text-tertiary text-center">
            Upload on LinkedIn: Profile → Edit → Background photo → Upload photo
          </p>
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
            <button onClick={() => setState('idle')} className="text-xs text-primary font-medium mt-2 hover:underline">Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}
