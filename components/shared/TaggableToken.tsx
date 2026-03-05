'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import type { OutputTagType, OutputTag } from '@/lib/types';

const TAG_META: { value: OutputTagType; labelKey: string; color: string; icon: string }[] = [
  { value: 'accurate', labelKey: 'tags.accurate', color: 'bg-success/10 text-success border-success/20', icon: '\u2713' },
  { value: 'inaccurate', labelKey: 'tags.inaccurate', color: 'bg-danger/10 text-danger border-danger/20', icon: '\u2717' },
  { value: 'irrelevant', labelKey: 'tags.irrelevant', color: 'bg-amber-400/10 text-amber-500 border-amber-400/20', icon: '\u2212' },
  { value: 'missing_context', labelKey: 'tags.missingContext', color: 'bg-blue-400/10 text-blue-500 border-blue-400/20', icon: '?' },
  { value: 'too_generic', labelKey: 'tags.tooGeneric', color: 'bg-purple-400/10 text-purple-500 border-purple-400/20', icon: '\u2026' },
];

interface TaggableTokenProps {
  children: React.ReactNode;
  analysisId: string | undefined;
  section: string;
  elementKey?: string;
  elementIndex?: number;
  existingTags?: OutputTag[];
  onTagCreated?: (tag: OutputTag) => void;
  onTagDeleted?: (tagId: string) => void;
  /** Inline or block display mode */
  inline?: boolean;
}

export default function TaggableToken({
  children,
  analysisId,
  section,
  elementKey,
  elementIndex,
  existingTags = [],
  onTagCreated,
  onTagDeleted,
  inline = false,
}: TaggableTokenProps) {
  const { session } = useAuth();
  const { t } = useTranslation();
  const [showPopover, setShowPopover] = useState(false);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!showPopover) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
        setComment('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPopover]);

  const handleTag = useCallback(async (tagType: OutputTagType) => {
    if (!session?.access_token || !analysisId) return;
    setSaving(true);

    try {
      // Get plain text from children for taggedText
      const text = containerRef.current?.textContent?.slice(0, 1000) || '';

      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          analysisId,
          section,
          elementKey: elementKey || undefined,
          elementIndex: elementIndex ?? undefined,
          taggedText: text || undefined,
          tag: tagType,
          comment: comment.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onTagCreated?.(data.tag);
        setShowPopover(false);
        setComment('');
      }
    } catch {
      // Non-critical
    } finally {
      setSaving(false);
    }
  }, [session?.access_token, analysisId, section, elementKey, elementIndex, comment, onTagCreated]);

  const handleDelete = useCallback(async (tagId: string) => {
    if (!session?.access_token) return;
    setDeleting(tagId);

    try {
      const res = await fetch(`/api/tags?id=${tagId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        onTagDeleted?.(tagId);
      }
    } catch {
      // Non-critical
    } finally {
      setDeleting(null);
    }
  }, [session?.access_token, onTagDeleted]);

  // Don't render tag UI if no analysisId or not logged in
  if (!analysisId || !session) {
    return <>{children}</>;
  }

  const Tag = inline ? 'span' : 'div';
  const myTags = existingTags.filter(
    t => t.section === section
      && t.elementKey === (elementKey || null)
      && (elementIndex == null || t.elementIndex === elementIndex)
  );

  return (
    <Tag ref={containerRef} className={`group/tag relative ${inline ? 'inline' : ''}`}>
      {children}

      {/* Existing tags badges */}
      {myTags.length > 0 && (
        <span className={`${inline ? 'inline-flex ml-1.5' : 'flex mt-1'} flex-wrap gap-1`}>
          {myTags.map(tag => {
            const opt = TAG_META.find(o => o.value === tag.tag);
            return (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${opt?.color || 'bg-black/[0.04] text-text-tertiary border-black/[0.06]'}`}
                title={tag.comment || undefined}
              >
                {opt?.icon} {opt ? t(opt.labelKey) : tag.tag}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(tag.id); }}
                  disabled={deleting === tag.id}
                  className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            );
          })}
        </span>
      )}

      {/* Tag trigger button — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowPopover(!showPopover); }}
        className={`${inline ? 'inline-flex ml-1' : 'absolute -right-1 -top-1'} items-center justify-center w-5 h-5 rounded-md bg-black/[0.04] hover:bg-primary/10 text-text-tertiary hover:text-primary transition-all opacity-0 group-hover/tag:opacity-100 focus:opacity-100`}
        title={t('tags.tagThis')}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      </button>

      {/* Popover */}
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-full left-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-lg p-3 min-w-[220px]"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
            {t('tags.rateOutput')}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {TAG_META.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleTag(opt.value)}
                disabled={saving}
                className={`text-[11px] font-medium px-2 py-1 rounded-md border transition-colors hover:opacity-80 disabled:opacity-50 ${opt.color}`}
              >
                {opt.icon} {t(opt.labelKey)}
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('tags.commentPlaceholder')}
            className="w-full h-14 text-xs bg-black/[0.02] border border-black/[0.06] rounded-lg px-2.5 py-2 resize-none placeholder:text-text-tertiary/60 focus:outline-none focus:border-primary/30"
            maxLength={500}
          />
        </div>
      )}
    </Tag>
  );
}
