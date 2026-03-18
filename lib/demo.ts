import type { AnalysisResult } from './types';
import sampleDataEn from './sample-data.json';

export function getSampleAnalysis(): AnalysisResult {
  return sampleDataEn as AnalysisResult;
}

// Keep backward compat for any existing imports
export const SAMPLE_ANALYSIS: AnalysisResult = sampleDataEn as AnalysisResult;
