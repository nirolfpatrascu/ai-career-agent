// lib/schemas/index.ts
// Zod runtime validation schemas for LLM output types.
// Used in callClaude() to catch malformed JSON before it reaches the UI.
// On validation failure, callClaude() retries once with the Zod error appended.

import { z } from 'zod';

// ─── Primitive helpers ────────────────────────────────────────────────────────

const salaryRange = z.object({
  low: z.number(),
  mid: z.number(),
  high: z.number(),
  currency: z.string(),
});

const marketSalary = salaryRange.extend({
  region: z.string(),
  source: z.string().optional(),
});

// ─── FitScore ─────────────────────────────────────────────────────────────────

export const FitScoreSchema = z.object({
  score: z.number().min(0).max(10),
  label: z.enum(['Strong Fit', 'Moderate Fit', 'Stretch', 'Significant Gap']),
  summary: z.string().min(1),
});

// ─── Gap Analysis ─────────────────────────────────────────────────────────────

export const GapSchema = z.object({
  skill: z.string(),
  severity: z.enum(['critical', 'moderate', 'minor']),
  currentLevel: z.string(),
  requiredLevel: z.string(),
  impact: z.string(),
  closingPlan: z.string(),
  timeToClose: z.string(),
  resources: z.array(z.string()),
});

export const StrengthSchema = z.object({
  title: z.string(),
  description: z.string(),
  relevance: z.string(),
  tier: z.enum(['differentiator', 'strong', 'supporting']),
});

// ─── Action Plan ──────────────────────────────────────────────────────────────

const actionItem = z.object({
  action: z.string(),
  priority: z.enum(['critical', 'high', 'medium']),
  timeEstimate: z.string(),
  resource: z.string(),
  resourceUrl: z.string().optional(),
  expectedImpact: z.string(),
});

export const ActionPlanSchema = z.object({
  thirtyDays: z.array(actionItem),
  ninetyDays: z.array(actionItem),
  twelveMonths: z.array(actionItem),
});

// ─── Salary Analysis ──────────────────────────────────────────────────────────

export const SalaryAnalysisSchema = z.object({
  currentRoleMarket: marketSalary,
  targetRoleMarket: marketSalary,
  growthPotential: z.string(),
  bestMonetaryMove: z.string(),
  negotiationTips: z.array(z.string()),
  dataSource: z.string().optional(),
});

// ─── Role Recommendations ─────────────────────────────────────────────────────

export const RoleRecommendationSchema = z.object({
  title: z.string(),
  fitScore: z.number().min(0).max(10),
  salaryRange: salaryRange,
  reasoning: z.string(),
  exampleCompanies: z.array(z.string()),
  timeToReady: z.string(),
});

// ─── Job Match ────────────────────────────────────────────────────────────────

export const JobMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.object({
    skill: z.string(),
    importance: z.enum(['important', 'not_a_deal_breaker', 'quick_win', 'unimportant']),
  })),
  cvSuggestions: z.array(z.object({
    section: z.string(),
    current: z.string(),
    suggested: z.string(),
    reasoning: z.string(),
  })),
  overallAdvice: z.string(),
  competitiveAdvantage: z.array(z.string()).optional(),
});

// ─── ATS Score ────────────────────────────────────────────────────────────────

const atsKeyword = z.object({
  keyword: z.string(),
  category: z.string(),
  importance: z.string(),
  cvSection: z.string().optional(),
});

const atsSemanticKeyword = atsKeyword.extend({
  matchedAs: z.string(),
});

export const ATSScoreSchema = z.object({
  score: z.number().min(0).max(100),
  keywords: z.object({
    matched: z.array(atsKeyword),
    missing: z.array(atsKeyword),
    semanticMatch: z.array(atsSemanticKeyword),
  }),
  formatIssues: z.array(z.object({
    type: z.string(),
    description: z.string(),
    severity: z.enum(['critical', 'moderate', 'minor']),
    fix: z.string(),
  })),
  recommendations: z.array(z.object({
    section: z.string(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    action: z.string(),
    example: z.string().optional(),
  })),
  summary: z.string(),
});

// ─── Extracted Profile ────────────────────────────────────────────────────────

export const ExtractedProfileSchema = z.object({
  name: z.string().optional(),
  currentRole: z.string().optional(),
  yearsExperience: z.number().optional(),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })).optional(),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string().optional(),
    field: z.string().optional(),
  })).optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.object({
    name: z.string(),
    level: z.string(),
  })).optional(),
});
