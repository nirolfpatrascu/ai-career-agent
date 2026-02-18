import type { AnalysisResult } from './types';
import type { Locale } from '@/lib/i18n';
import sampleDataEn from './sample-data.json';
import sampleDataRo from './sample-data-ro.json';
import sampleDataDe from './sample-data-de.json';

const SAMPLE_DATA: Record<Locale, AnalysisResult> = {
  en: sampleDataEn as AnalysisResult,
  ro: sampleDataRo as AnalysisResult,
  de: sampleDataDe as AnalysisResult,
};

export function getSampleAnalysis(locale: Locale = 'en'): AnalysisResult {
  return SAMPLE_DATA[locale] || SAMPLE_DATA.en;
}

// Keep backward compat for any existing imports
export const SAMPLE_ANALYSIS: AnalysisResult = sampleDataEn as AnalysisResult;