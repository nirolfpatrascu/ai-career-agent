'use client';

import { useState, useCallback } from 'react';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { UpworkProfile } from '@/lib/types';

interface UpworkImportProps {
  onProfileImported: (profile: UpworkProfile) => void;
  importedProfile: UpworkProfile | null;
}

export default function UpworkImport({ onProfileImported, importedProfile }: UpworkImportProps) {
  const { t } = useTranslation();
  const [profileText, setProfileText] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<UpworkProfile | null>(importedProfile);

  const handleImport = useCallback(async () => {
    const text = profileText.trim();
    if (text.length < 100) {
      setError(t('upwork.import.minChars') || 'Please paste at least 100 characters of profile text.');
      return;
    }

    setParsing(true);
    setError('');
    try {
      const res = await fetch('/api/parse-upwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to parse profile');
      }
      const data = await res.json();
      setPreview(data.profile);
      onProfileImported(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setParsing(false);
    }
  }, [profileText, onProfileImported, t]);

  const handleRetry = useCallback(() => {
    setPreview(null);
    setError('');
  }, []);

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#14A800]/20 bg-[#14A800]/[0.04] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-[#14A800]" />
            <span className="text-sm font-semibold text-[#14A800]">
              {t('upwork.import.preview')}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-text-primary">{preview.name}</p>
            <p className="text-sm text-text-secondary">{preview.title}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
              {preview.hourlyRate != null && (
                <span>${preview.hourlyRate}/hr</span>
              )}
              {preview.totalJobs != null && (
                <span>
                  {preview.totalJobs} {t('upwork.import.jobsLabel') || 'jobs'}
                </span>
              )}
              {preview.totalEarnings != null && (
                <span>
                  ${preview.totalEarnings >= 1000
                    ? `${Math.round(preview.totalEarnings / 1000)}K+`
                    : preview.totalEarnings}{' '}
                  {t('upwork.import.earnings')}
                </span>
              )}
              {preview.jobSuccessScore != null && (
                <span>{preview.jobSuccessScore}% {t('upwork.import.jss')}</span>
              )}
            </div>
            {preview.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {preview.skills.slice(0, 10).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-xs rounded-md bg-[#14A800]/[0.08] text-[#14A800] font-medium"
                  >
                    {s}
                  </span>
                ))}
                {preview.skills.length > 10 && (
                  <span className="px-2 py-0.5 text-xs rounded-md bg-black/[0.04] text-text-tertiary">
                    +{preview.skills.length - 10}
                  </span>
                )}
              </div>
            )}
            {preview.workHistory.length > 0 && (
              <p className="text-xs text-text-tertiary mt-1">
                {t('upwork.import.jobs', { count: String(preview.workHistory.length) }) ||
                  `${preview.workHistory.length} jobs extracted`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => onProfileImported(preview)}
              className="btn-primary text-sm !py-2 !px-4 !rounded-xl"
            >
              {t('upwork.import.confirm')}
            </button>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all"
            >
              <RefreshCw size={14} />
              {t('upwork.import.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-text-primary font-display mb-1">
          {t('upwork.import.title')}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {t('upwork.import.instructions')}
        </p>
      </div>

      {/* Text paste area */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {t('upwork.import.pasteLabel')}
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-[#14A800]/20 focus:border-[#14A800]/40 outline-none transition-all min-h-[160px] resize-y"
          value={profileText}
          onChange={(e) => {
            setProfileText(e.target.value);
            setError('');
          }}
          placeholder={t('upwork.import.pastePlaceholder')}
          maxLength={50000}
        />
        <p className="text-xs text-text-tertiary mt-1">
          {profileText.length > 0 ? `${profileText.length.toLocaleString()} characters` : ''}
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black/[0.06]" />
        <span className="text-xs text-text-tertiary font-medium">{t('upwork.import.or')}</span>
        <div className="flex-1 h-px bg-black/[0.06]" />
      </div>

      {/* URL input */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {t('upwork.import.urlLabel')}
        </label>
        <input
          type="url"
          className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-[#14A800]/20 focus:border-[#14A800]/40 outline-none transition-all"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder={t('upwork.import.urlPlaceholder')}
        />
        <p className="text-xs text-text-tertiary mt-1">
          {t('upwork.import.urlHint') || 'We\'ll try to extract public profile data. Some profiles may require manual paste.'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={parsing || profileText.trim().length < 100}
        className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        style={{
          backgroundColor: profileText.trim().length >= 100 && !parsing ? '#14A800' : undefined,
          borderColor: profileText.trim().length >= 100 && !parsing ? '#14A800' : undefined,
        }}
      >
        {parsing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t('upwork.import.parsing')}
          </>
        ) : (
          t('upwork.import.parseButton')
        )}
      </button>
    </div>
  );
}
