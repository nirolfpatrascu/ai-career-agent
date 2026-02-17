'use client';

import dynamic from 'next/dynamic';
import type { AnalysisResult } from '@/lib/types';

// Dynamic import to avoid SSR issues with @react-pdf/renderer
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
  return <PDFDownloadButton result={result} />;
}
