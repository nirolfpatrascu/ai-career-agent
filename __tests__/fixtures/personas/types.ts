import type { CareerQuestionnaire } from '@/lib/types';

export type PersonaCategory = 'normal' | 'tech-pivot' | 'better-paying' | 'career-change';

export interface ExpectedTraits {
  minFitScore: number;
  maxFitScore: number;
  expectedGapSeverities: ('critical' | 'moderate' | 'minor')[];
  mustHaveStrengthKeywords: string[];
  mustHaveGapKeywords: string[];
  expectedCurrency: string;
  shouldIncludeTargetRole: boolean;
}

export interface SyntheticPersona {
  id: string;
  category: PersonaCategory;
  description: string;
  cvText: string;
  questionnaire: CareerQuestionnaire;
  expectedTraits: ExpectedTraits;
}
