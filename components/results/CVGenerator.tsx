'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult, GeneratedCV } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface CVGeneratorProps {
  analysis: AnalysisResult;
}

// Copy button with visual feedback
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback: do nothing */ }
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        copied
          ? 'bg-success/10 text-success border border-success/20'
          : 'bg-black/[0.03] text-text-tertiary hover:text-text-primary border border-black/[0.08] hover:border-primary/20'
      }`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {t('cv.copied')}
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {label || t('cv.copy')}
        </>
      )}
    </button>
  );
}

// Section card wrapper
function Section({ title, icon, children, copyText }: { title: string; icon: React.ReactNode; children: React.ReactNode; copyText?: string }) {
  return (
    <div className="bg-white rounded-xl border border-black/[0.08] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-black/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{icon}</span>
          <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
        </div>
        {copyText && <CopyBtn text={copyText} />}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function CVGenerator({ analysis }: CVGeneratorProps) {
  const { t, locale } = useTranslation();
  const [cv, setCV] = useState<GeneratedCV | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, language: locale }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed');
      }
      const data = await res.json();
      setCV(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [analysis, locale]);

  const copyAll = useCallback(() => {
    if (!cv) return;
    const lines: string[] = [];
    lines.push('PROFESSIONAL SUMMARY', cv.professionalSummary, '');
    lines.push('SKILLS');
    cv.skills.forEach(s => lines.push(`${s.category}: ${s.items.join(', ')}`));
    lines.push('');
    lines.push('EXPERIENCE');
    cv.experienceBullets.forEach(exp => {
      lines.push(`${exp.role} — ${exp.company}`);
      exp.bullets.forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
    if (cv.certifications.length) {
      lines.push('CERTIFICATIONS');
      cv.certifications.forEach(c => lines.push(`• ${c}`));
      lines.push('');
    }
    if (cv.projectHighlights.length) {
      lines.push('KEY PROJECTS');
      cv.projectHighlights.forEach(p => {
        lines.push(`${p.name}: ${p.description}`);
        lines.push(`Technologies: ${p.technologies.join(', ')}`);
        lines.push('');
      });
    }
    navigator.clipboard.writeText(lines.join('\n'));
  }, [cv]);

  // ── Empty state: generate button ──
  if (!cv && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary font-display mb-2">{t('cv.title')}</h2>
        <p className="text-text-secondary text-sm text-center max-w-md mb-8 leading-relaxed">
          {t('cv.description')}
        </p>
        {error && (
          <div className="bg-danger/[0.06] border border-danger/15 rounded-xl px-4 py-3 text-sm text-danger mb-6 max-w-md">
            {error}
          </div>
        )}
        <button
          onClick={generate}
          className="btn-primary text-base px-8 py-3.5 flex items-center gap-2.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          {t('cv.generate')}
        </button>
        <p className="text-text-tertiary text-xs mt-4">{t('cv.generateHint')}</p>
      </div>
    );
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center mb-6 animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="2" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{t('cv.generating')}</h3>
        <p className="text-text-secondary text-sm">{t('cv.generatingHint')}</p>
      </div>
    );
  }

  // ── Results ──
  if (!cv) return null;

  const allSkillsText = cv.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join('\n');
  const allBulletsText = cv.experienceBullets.map(e =>
    `${e.role} — ${e.company}\n${e.bullets.map(b => `• ${b}`).join('\n')}`
  ).join('\n\n');

  return (
    <div className="space-y-5">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('cv.title')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyAll} className="btn-secondary text-xs flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {t('cv.copyAll')}
          </button>
          <button onClick={generate} className="btn-secondary text-xs flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            {t('cv.regenerate')}
          </button>
        </div>
      </div>

      {/* Professional Summary */}
      <Section
        title={t('cv.sections.summary')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
        copyText={cv.professionalSummary}
      >
        <p className="text-text-primary text-sm leading-relaxed">{cv.professionalSummary}</p>
      </Section>

      {/* Skills */}
      <Section
        title={t('cv.sections.skills')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        copyText={allSkillsText}
      >
        <div className="space-y-3">
          {cv.skills.map((group, i) => (
            <div key={i}>
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{group.category}</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {group.items.map((skill, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg bg-primary/[0.06] border border-primary/10 text-xs font-medium text-text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience Bullets */}
      <Section
        title={t('cv.sections.experience')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
        copyText={allBulletsText}
      >
        <div className="space-y-6">
          {cv.experienceBullets.map((exp, i) => (
            <div key={i}>
              <div className="flex items-baseline gap-2 mb-2">
                <h4 className="font-semibold text-text-primary text-sm">{exp.role}</h4>
                <span className="text-text-tertiary text-xs">— {exp.company}</span>
              </div>
              <ul className="space-y-1.5">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                    <span className="text-primary mt-1.5 flex-shrink-0">
                      <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      {cv.certifications.length > 0 && (
        <Section
          title={t('cv.sections.certifications')}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>}
          copyText={cv.certifications.join('\n')}
        >
          <div className="flex flex-wrap gap-2">
            {cv.certifications.map((cert, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-success/[0.06] border border-success/15 text-xs font-medium text-success">
                {cert}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Project Highlights */}
      {cv.projectHighlights.length > 0 && (
        <Section
          title={t('cv.sections.projects')}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
          copyText={cv.projectHighlights.map(p => `${p.name}: ${p.description}\nTech: ${p.technologies.join(', ')}`).join('\n\n')}
        >
          <div className="space-y-4">
            {cv.projectHighlights.map((project, i) => (
              <div key={i} className="p-3 rounded-lg bg-black/[0.02] border border-black/[0.06]">
                <h4 className="font-semibold text-text-primary text-sm mb-1">{project.name}</h4>
                <p className="text-text-secondary text-xs leading-relaxed mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, j) => (
                    <span key={j} className="px-2 py-0.5 rounded bg-black/[0.04] text-[11px] text-text-tertiary font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Cover Letter */}
      {cv.coverLetterDraft && (
        <Section
          title={t('cv.sections.coverLetter')}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
          copyText={cv.coverLetterDraft}
        >
          <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {cv.coverLetterDraft}
          </div>
        </Section>
      )}
    </div>
  );
}