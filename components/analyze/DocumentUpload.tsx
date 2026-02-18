'use client';

import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { formatFileSize } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface DocumentUploadProps {
  linkedInFile: File | null;
  cvFile: File | null;
  onLinkedInSelect: (file: File | null) => void;
  onCVSelect: (file: File | null) => void;
  detecting: boolean;
  autoDetected: string;
  onDismissDetection: () => void;
}

function FileCard({
  file,
  label,
  onRemove,
  accent = 'primary',
}: {
  file: File;
  label: string;
  onRemove: () => void;
  accent?: 'primary' | 'linkedin';
}) {
  const colors = accent === 'linkedin'
    ? { bg: 'bg-[#0A66C2]/10', icon: '#0A66C2', text: 'text-[#0A66C2]' }
    : { bg: 'bg-primary/10', icon: '#3B82F6', text: 'text-primary' };

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-text-secondary">{formatFileSize(file.size)} · {label}</p>
      </div>
      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <button onClick={onRemove} className="text-text-secondary hover:text-danger transition-colors p-1" aria-label="Remove file">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function DropZone({
  onFile,
  label,
  sublabel,
  dropLabel,
  errorOnlyPdf,
  errorMaxSize,
  icon,
  compact = false,
}: {
  onFile: (file: File) => void;
  label: string;
  sublabel: string;
  dropLabel: string;
  errorOnlyPdf: string;
  errorMaxSize: string;
  icon: React.ReactNode;
  compact?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') { setError(errorOnlyPdf); return; }
    if (f.size > 5 * 1024 * 1024) { setError(errorMaxSize); return; }
    setError('');
    onFile(f);
  }, [onFile, errorOnlyPdf, errorMaxSize]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault(); e.stopPropagation(); setIsDragging(false);
          const f = e.dataTransfer.files[0]; if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl ${compact ? 'p-5' : 'p-8'} text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-card-border hover:border-primary/50 hover:bg-card/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-card text-text-secondary'}`}>
            {icon}
          </div>
          <div>
            <p className="text-text-primary font-medium text-sm">{isDragging ? dropLabel : label}</p>
            <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function DocumentUpload({
  linkedInFile,
  cvFile,
  onLinkedInSelect,
  onCVSelect,
  detecting,
  autoDetected,
  onDismissDetection,
}: DocumentUploadProps) {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = useState(false);
  const hasAnyFile = linkedInFile || cvFile;

  return (
    <div className="space-y-5">
      {/* LinkedIn PDF Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#0A66C2]/10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <label className="text-sm font-medium text-text-primary">{t('docUpload.linkedInTitle')}</label>
          <span className="text-xs text-text-secondary">({t('docUpload.linkedInRecommended')})</span>
        </div>

        {linkedInFile ? (
          <FileCard file={linkedInFile} label={t('docUpload.linkedInLabel')} onRemove={() => onLinkedInSelect(null)} accent="linkedin" />
        ) : (
          <DropZone
            onFile={onLinkedInSelect}
            label={t('docUpload.uploadLinkedIn')}
            sublabel={t('docUpload.linkedInSublabel')}
            dropLabel={t('docUpload.dropHere')}
            errorOnlyPdf={t('upload.onlyPdf')}
            errorMaxSize={t('upload.maxSize')}
            compact
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            }
          />
        )}

        {/* Auto-detection status */}
        {detecting && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-lg">
            <svg className="animate-spin w-3.5 h-3.5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs text-primary">{t('docUpload.detecting')}</span>
          </div>
        )}

        {autoDetected && !detecting && (
          <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-success/5 border border-success/20 rounded-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-success font-medium">{t('docUpload.detected')}</p>
              <p className="text-xs text-text-secondary mt-0.5 truncate">{autoDetected}</p>
            </div>
            <button onClick={onDismissDetection} className="text-text-secondary hover:text-text-primary flex-shrink-0 p-0.5" aria-label="Dismiss">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        {/* How to export guide */}
        {!linkedInFile && (
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="mt-2 w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-card-border/50 hover:border-card-border transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-xs text-text-secondary">{t('docUpload.guideQuestion')}</span>
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`text-text-secondary ml-auto transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {showGuide && !linkedInFile && (
          <div className="mt-2 bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-4 pt-4 pb-3 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#0A66C2] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p className="text-sm text-text-secondary">
                  {t('docUpload.guideStep1a')}{' '}
                  <a href="https://www.linkedin.com/in/me" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:underline font-medium">{t('docUpload.guideStep1Link')}</a>{' '}
                  {t('docUpload.guideStep1b')} <strong className="text-text-primary">{t('docUpload.guideStep1bold')}</strong>
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-card-border">
                <Image src="/linkedin-step1.png" alt="Step 1" width={1060} height={600} className="w-full h-auto" priority={false} />
              </div>
              <div className="flex items-start gap-3 pt-2">
                <span className="w-5 h-5 rounded-full bg-[#0A66C2] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p className="text-sm text-text-secondary">
                  {t('docUpload.guideStep2a')} <strong className="text-text-primary">{t('docUpload.guideStep2bold')}</strong>{t('docUpload.guideStep2b')}
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-card-border">
                <Image src="/linkedin-step2.png" alt="Step 2" width={1060} height={790} className="w-full h-auto" priority={false} />
              </div>
            </div>
            <div className="px-4 py-3 bg-card-border/20 border-t border-card-border">
              <p className="text-xs text-text-secondary">💡 {t('docUpload.guideTip')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-card-border" />
        <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('docUpload.divider')}</span>
        <div className="flex-1 h-px bg-card-border" />
      </div>

      {/* CV Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-primary/10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <label className="text-sm font-medium text-text-primary">{t('docUpload.cvTitle')}</label>
          <span className="text-xs text-text-secondary">({linkedInFile ? t('docUpload.cvOptional') : t('docUpload.cvRequired')})</span>
        </div>

        {cvFile ? (
          <FileCard file={cvFile} label={t('docUpload.cvLabel')} onRemove={() => onCVSelect(null)} accent="primary" />
        ) : (
          <DropZone
            onFile={onCVSelect}
            label={t('docUpload.uploadCV')}
            sublabel={t('docUpload.cvSublabel')}
            dropLabel={t('docUpload.dropHere')}
            errorOnlyPdf={t('upload.onlyPdf')}
            errorMaxSize={t('upload.maxSize')}
            compact
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            }
          />
        )}
      </div>

      {/* Validation hint */}
      {!hasAnyFile && (
        <p className="text-xs text-text-secondary text-center pt-1">{t('docUpload.uploadHint')}</p>
      )}
    </div>
  );
}
