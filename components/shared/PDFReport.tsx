'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from '@/lib/i18n';
import type { AnalysisResult } from '@/lib/types';
import type { PDFLabels } from './PDFReportDocument';

const PDFDownloadButton = dynamic(
  () => import('./PDFReportDocument').then((mod) => mod.PDFDownloadButton),
  { ssr: false, loading: () => <ButtonPlaceholder /> }
);

function ButtonPlaceholder() {
  return (
    <button disabled className="btn-secondary text-sm opacity-50 cursor-wait flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Loading PDF...
    </button>
  );
}

interface PDFReportProps {
  result: AnalysisResult;
}

export default function PDFReport({ result }: PDFReportProps) {
  const { t, locale } = useTranslation();

  const dateLocaleMap: Record<string, string> = {
    en: 'en-US',
    ro: 'ro-RO',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    it: 'it-IT',
  };

  const labels: PDFLabels = {
    brandLine: t('pdf.brandLine'),
    generatedOn: t('pdf.generatedOn'),
    fitScoreLabel: t('pdf.fitScoreLabel'),
    strengths: t('pdf.strengths'),
    gaps: t('pdf.gaps'),
    roles: t('pdf.roles'),
    salaryAnalysis: t('pdf.salaryAnalysis'),
    salarySubtitle: t('pdf.salarySubtitle'),
    actionPlan30: t('pdf.actionPlan30'),
    actionPlan90: t('pdf.actionPlan90'),
    actionPlan12m: t('pdf.actionPlan12m'),
    negotiationTips: t('pdf.negotiationTips'),
    current: t('pdf.current'),
    required: t('pdf.required'),
    growthPotential: t('pdf.growthPotential'),
    currentRoleMarket: t('pdf.currentRoleMarket'),
    targetRoleMarket: t('pdf.targetRoleMarket'),
    companies: t('pdf.companies'),
    dateLocale: dateLocaleMap[locale] || 'en-US',
  };

  return (
    <PDFDownloadButton
      result={result}
      buttonLabel={t('common.downloadReport')}
      labels={labels}
    />
  );
}
