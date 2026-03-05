import type { SyntheticPersona } from '../fixtures/personas/types';

export interface GoldenExpected {
  fitScore: { min: number; max: number };
  strengthCount: { min: number; max: number };
  gapCount: { min: number; max: number };
  mustHaveGapSkills: string[];
  mustHaveStrengthKeywords: string[];
  salaryCurrency: string;
  salaryTargetMidRange: { min: number; max: number };
}

export interface GoldenExample {
  id: string;
  persona: SyntheticPersona;
  expected: GoldenExpected;
}

export interface GoldenCheckResult {
  field: string;
  passed: boolean;
  actual: string | number;
  expected: string;
}

export interface GoldenComparisonResult {
  id: string;
  passed: boolean;
  checks: GoldenCheckResult[];
  fitScoreMAE: number;
  gapSkillJaccard: number;
  salaryMAE: number;
}
