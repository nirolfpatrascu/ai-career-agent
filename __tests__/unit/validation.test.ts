import { describe, it, expect } from 'vitest';
import {
  validateAnalysisResult,
  validateFitScore,
  validateStrengths,
  validateGaps,
  validateActionPlan,
  validateRoleRecommendations,
  validateJobMatch,
  autoFixResult,
  validateTranslation,
} from '@/lib/validation';
import { GAP_ANALYSIS_FALLBACK } from '@/lib/prompts/gap-analysis';
import type {
  AnalysisResult,
  FitScore,
  Strength,
  Gap,
  ActionPlan,
  RoleRecommendation,
  JobMatch,
} from '@/lib/types';

// ============================================================================
// Helper: minimal valid AnalysisResult
// ============================================================================

function makeValidResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return {
    metadata: {
      analyzedAt: new Date().toISOString(),
      cvFileName: 'test.pdf',
      targetRole: 'Senior Developer',
      country: 'Germany',
    },
    fitScore: {
      score: 7,
      label: 'Moderate Fit',
      summary: 'The candidate has a solid background in software development with relevant skills for the target role. Some gaps exist in system design and cloud architecture that can be addressed.',
    },
    strengths: [
      {
        title: 'JavaScript Expertise',
        description: 'Strong proficiency in JavaScript with 5 years of experience in production environments.',
        relevance: 'JavaScript is a core requirement for the target role.',
        tier: 'strong',
      },
      {
        title: 'React Framework',
        description: 'Deep experience building complex React applications with modern patterns.',
        relevance: 'React is the primary frontend framework used by the team.',
        tier: 'differentiator',
      },
    ],
    gaps: [
      {
        skill: 'System Design',
        severity: 'moderate',
        currentLevel: 'Basic understanding',
        requiredLevel: 'Can design distributed systems',
        impact: 'Will struggle with architecture-level decisions in interviews.',
        closingPlan: 'Study system design fundamentals through structured courses.',
        timeToClose: '2-3 months',
        resources: ['Udemy: System Design Course', 'Book: Designing Data-Intensive Applications'],
      },
    ],
    roleRecommendations: [
      {
        title: 'Senior Developer',
        fitScore: 7,
        salaryRange: { low: 65000, mid: 80000, high: 100000, currency: 'EUR' },
        reasoning: 'Strong match based on experience and skills.',
        exampleCompanies: ['Google', 'Microsoft', 'Amazon'],
        timeToReady: '1-3 months',
      },
    ],
    actionPlan: {
      thirtyDays: [
        {
          action: 'Start system design course on Udemy',
          priority: 'critical',
          timeEstimate: '2 weeks at 1hr/day',
          resource: 'Udemy: System Design Course',
          expectedImpact: 'Addresses the primary knowledge gap for interviews',
        },
      ],
      ninetyDays: [
        {
          action: 'Build a portfolio project demonstrating full-stack architecture',
          priority: 'high',
          timeEstimate: '4 weeks at 1hr/day',
          resource: 'GitHub',
          expectedImpact: 'Tangible proof of system design skills',
        },
      ],
      twelveMonths: [
        {
          action: 'Pursue AWS Solutions Architect certification',
          priority: 'medium',
          timeEstimate: '3 months preparation',
          resource: 'AWS Training',
          expectedImpact: 'Industry-recognized credential that validates cloud skills',
        },
      ],
    },
    salaryAnalysis: {
      currentRoleMarket: { low: 50000, mid: 65000, high: 80000, currency: 'EUR', region: 'Germany (gross annual)' },
      targetRoleMarket: { low: 65000, mid: 80000, high: 100000, currency: 'EUR', region: 'Germany (gross annual)' },
      growthPotential: '20-30% increase over 12-18 months',
      bestMonetaryMove: 'Focus on closing system design gap, then target senior roles at top-tier companies.',
      negotiationTips: [
        'Research market rates before negotiating',
        'Highlight unique skill combinations',
        'Consider total compensation',
      ],
    },
    ...overrides,
  };
}

// ============================================================================
// FitScore validation
// ============================================================================

describe('validateFitScore', () => {
  it('accepts valid fitScore', () => {
    const issues = validateFitScore({ score: 7, label: 'Moderate Fit', summary: 'A solid fit for the role with some gaps to address in system design and cloud platforms.' });
    const errors = issues.filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags score outside 1-10 range', () => {
    const issues = validateFitScore({ score: 15, label: 'Strong Fit', summary: 'Great fit with extensive experience in all required areas and strong leadership potential.' });
    expect(issues.some(i => i.field === 'fitScore.score' && i.severity === 'error')).toBe(true);
  });

  it('flags score of 0', () => {
    const issues = validateFitScore({ score: 0, label: 'Significant Gap', summary: 'Not a good fit for this role due to missing critical skills and experience gaps.' });
    expect(issues.some(i => i.field === 'fitScore.score')).toBe(true);
  });

  it('flags invalid label', () => {
    const issues = validateFitScore({ score: 7, label: 'Perfect' as FitScore['label'], summary: 'A strong candidate with relevant background and skills for the target position.' });
    expect(issues.some(i => i.field === 'fitScore.label')).toBe(true);
  });

  it('flags empty summary', () => {
    const issues = validateFitScore({ score: 7, label: 'Moderate Fit', summary: '' });
    expect(issues.some(i => i.field === 'fitScore.summary')).toBe(true);
  });

  it('flags very short summary', () => {
    const issues = validateFitScore({ score: 7, label: 'Moderate Fit', summary: 'Good fit.' });
    expect(issues.some(i => i.field === 'fitScore.summary' && i.message.includes('short'))).toBe(true);
  });
});

// ============================================================================
// Strengths validation
// ============================================================================

describe('validateStrengths', () => {
  it('accepts valid strengths', () => {
    const strengths: Strength[] = [
      { title: 'React', description: 'Strong React skills.', relevance: 'Core framework.', tier: 'strong' },
    ];
    const errors = validateStrengths(strengths).filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags empty strengths array', () => {
    const issues = validateStrengths([]);
    expect(issues.some(i => i.severity === 'error')).toBe(true);
  });

  it('flags too many strengths', () => {
    const strengths = Array.from({ length: 10 }, (_, i) => ({
      title: `Strength ${i}`, description: 'Desc', relevance: 'Rel', tier: 'strong' as const,
    }));
    const issues = validateStrengths(strengths);
    expect(issues.some(i => i.message.includes('Too many'))).toBe(true);
  });

  it('flags invalid tier', () => {
    const strengths: Strength[] = [
      { title: 'React', description: 'Good.', relevance: 'Yes.', tier: 'amazing' as Strength['tier'] },
    ];
    const issues = validateStrengths(strengths);
    expect(issues.some(i => i.field?.includes('tier'))).toBe(true);
  });

  it('flags duplicate titles', () => {
    const strengths: Strength[] = [
      { title: 'React', description: 'Good.', relevance: 'Yes.', tier: 'strong' },
      { title: 'React', description: 'Also good.', relevance: 'Yes.', tier: 'supporting' },
    ];
    const issues = validateStrengths(strengths);
    expect(issues.some(i => i.message.includes('Duplicate'))).toBe(true);
  });
});

// ============================================================================
// Gaps validation
// ============================================================================

describe('validateGaps', () => {
  const validGap: Gap = {
    skill: 'Docker',
    severity: 'moderate',
    currentLevel: 'Basic',
    requiredLevel: 'Advanced',
    impact: 'Cannot deploy efficiently.',
    closingPlan: 'Take Docker course.',
    timeToClose: '1 month',
    resources: ['Udemy Docker Course', 'Docker documentation'],
  };

  it('accepts valid gaps', () => {
    const errors = validateGaps([validGap]).filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags empty gaps array', () => {
    expect(validateGaps([]).some(i => i.severity === 'error')).toBe(true);
  });

  it('flags invalid severity', () => {
    const gap = { ...validGap, severity: 'extreme' as Gap['severity'] };
    expect(validateGaps([gap]).some(i => i.field?.includes('severity'))).toBe(true);
  });

  it('flags empty resources', () => {
    const gap = { ...validGap, resources: [] };
    expect(validateGaps([gap]).some(i => i.field?.includes('resources'))).toBe(true);
  });

  it('flags too many resources', () => {
    const gap = { ...validGap, resources: ['a', 'b', 'c', 'd', 'e', 'f'] };
    const issues = validateGaps([gap]);
    expect(issues.some(i => i.field?.includes('resources') && i.message.includes('6 resources'))).toBe(true);
  });
});

// ============================================================================
// ActionPlan validation
// ============================================================================

describe('validateActionPlan', () => {
  const validItem = {
    action: 'Take a course',
    priority: 'high' as const,
    timeEstimate: '2 weeks',
    resource: 'Udemy',
    expectedImpact: 'Closes skill gap',
  };

  it('accepts valid action plan', () => {
    const plan: ActionPlan = {
      thirtyDays: [validItem],
      ninetyDays: [validItem],
      twelveMonths: [validItem],
    };
    const errors = validateActionPlan(plan).filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags empty section', () => {
    const plan: ActionPlan = {
      thirtyDays: [],
      ninetyDays: [validItem],
      twelveMonths: [validItem],
    };
    expect(validateActionPlan(plan).some(i => i.severity === 'error' && i.field?.includes('thirtyDays'))).toBe(true);
  });

  it('flags invalid priority', () => {
    const plan: ActionPlan = {
      thirtyDays: [{ ...validItem, priority: 'urgent' as 'critical' }],
      ninetyDays: [validItem],
      twelveMonths: [validItem],
    };
    expect(validateActionPlan(plan).some(i => i.field?.includes('priority'))).toBe(true);
  });
});

// ============================================================================
// RoleRecommendations validation
// ============================================================================

describe('validateRoleRecommendations', () => {
  it('accepts valid roles', () => {
    const roles: RoleRecommendation[] = [
      {
        title: 'Senior Dev', fitScore: 7,
        salaryRange: { low: 60000, mid: 80000, high: 100000, currency: 'EUR' },
        reasoning: 'Good fit.', exampleCompanies: ['Google'], timeToReady: '1-3 months',
      },
    ];
    const errors = validateRoleRecommendations(roles).filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags empty roles', () => {
    expect(validateRoleRecommendations([]).some(i => i.severity === 'error')).toBe(true);
  });

  it('flags unordered salary range', () => {
    const roles: RoleRecommendation[] = [
      {
        title: 'Dev', fitScore: 5,
        salaryRange: { low: 100000, mid: 80000, high: 60000, currency: 'EUR' },
        reasoning: 'OK.', exampleCompanies: ['Company'], timeToReady: 'Ready now',
      },
    ];
    expect(validateRoleRecommendations(roles).some(i => i.message.includes('not ordered'))).toBe(true);
  });
});

// ============================================================================
// JobMatch validation
// ============================================================================

describe('validateJobMatch', () => {
  it('accepts valid jobMatch', () => {
    const jm: JobMatch = {
      matchScore: 75,
      matchingSkills: ['React', 'TypeScript'],
      missingSkills: [{ skill: 'Docker', importance: 'important' }],
      cvSuggestions: [{ section: 'Summary', current: 'Old', suggested: 'New', reasoning: 'Better match' }],
      overallAdvice: 'Good candidate with minor gaps.',
    };
    const errors = validateJobMatch(jm).filter(i => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('flags overlapping skills', () => {
    const jm: JobMatch = {
      matchScore: 75,
      matchingSkills: ['React', 'Docker'],
      missingSkills: [{ skill: 'Docker', importance: 'important' }],
      cvSuggestions: [],
      overallAdvice: 'OK.',
    };
    expect(validateJobMatch(jm).some(i => i.severity === 'error' && i.message.includes('both'))).toBe(true);
  });

  it('flags score outside range', () => {
    const jm: JobMatch = {
      matchScore: 150,
      matchingSkills: ['React'],
      missingSkills: [],
      cvSuggestions: [],
      overallAdvice: 'OK.',
    };
    expect(validateJobMatch(jm).some(i => i.field === 'jobMatch.matchScore')).toBe(true);
  });
});

// ============================================================================
// Full validation + autofix
// ============================================================================

describe('validateAnalysisResult', () => {
  it('accepts a fully valid result', () => {
    const result = makeValidResult();
    const report = validateAnalysisResult(result);
    expect(report.issues.filter(i => i.severity === 'error')).toHaveLength(0);
  });

  it('reports cross-check: strength in gaps', () => {
    const result = makeValidResult({
      gaps: [
        {
          skill: 'JavaScript Expertise',
          severity: 'moderate',
          currentLevel: 'Basic',
          requiredLevel: 'Advanced',
          impact: 'Impact',
          closingPlan: 'Plan',
          timeToClose: '1 month',
          resources: ['Resource 1', 'Resource 2'],
        },
      ],
    });
    const report = validateAnalysisResult(result);
    expect(report.issues.some(i => i.message.includes('both strengths and gaps'))).toBe(true);
  });
});

describe('autoFixResult', () => {
  it('clamps fitScore to valid range', () => {
    const result = makeValidResult();
    result.fitScore.score = 15;
    const report = validateAnalysisResult(result);
    const { result: fixed } = autoFixResult(result, report.issues);
    expect(fixed.fitScore.score).toBeGreaterThanOrEqual(1);
    expect(fixed.fitScore.score).toBeLessThanOrEqual(10);
  });

  it('sorts unordered salary range', () => {
    const result = makeValidResult();
    result.salaryAnalysis.currentRoleMarket = { low: 100000, mid: 50000, high: 80000, currency: 'EUR', region: 'Germany' };
    const report = validateAnalysisResult(result);
    const { result: fixed } = autoFixResult(result, report.issues);
    expect(fixed.salaryAnalysis.currentRoleMarket.low).toBeLessThanOrEqual(fixed.salaryAnalysis.currentRoleMarket.mid);
    expect(fixed.salaryAnalysis.currentRoleMarket.mid).toBeLessThanOrEqual(fixed.salaryAnalysis.currentRoleMarket.high);
  });

  it('GAP_ANALYSIS_FALLBACK score is 1 (not misleading on failure)', () => {
    expect(GAP_ANALYSIS_FALLBACK.fitScore.score).toBe(1);
    expect(GAP_ANALYSIS_FALLBACK.fitScore.label).toBe('Significant Gap');
  });

  it('trims strengths to max 8', () => {
    const result = makeValidResult();
    result.strengths = Array.from({ length: 12 }, (_, i) => ({
      title: `Strength ${i}`, description: 'Desc', relevance: 'Rel', tier: 'strong' as const,
    }));
    const report = validateAnalysisResult(result);
    const { result: fixed } = autoFixResult(result, report.issues);
    expect(fixed.strengths.length).toBeLessThanOrEqual(8);
  });

  it('caps fitScore to 7 when score ≥ 9 with ≥ 2 critical gaps', () => {
    const result = makeValidResult();
    result.fitScore = { score: 9, label: 'Strong Fit', summary: 'Excellent fit with deep expertise in all required areas and strong leadership capabilities demonstrated.' };
    result.gaps = [
      { skill: 'Kubernetes', severity: 'critical', currentLevel: 'None', requiredLevel: 'Advanced', impact: 'Blocker', closingPlan: 'Learn K8s', timeToClose: '3 months', resources: ['Course'] },
      { skill: 'AWS', severity: 'critical', currentLevel: 'None', requiredLevel: 'Advanced', impact: 'Blocker', closingPlan: 'Learn AWS', timeToClose: '3 months', resources: ['Course'] },
    ];
    const report = validateAnalysisResult(result);
    const { result: fixed, descriptions } = autoFixResult(result, report.issues);
    expect(fixed.fitScore.score).toBeLessThanOrEqual(7);
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('caps fitScore to 6 when score ≥ 8 with ≥ 3 critical gaps', () => {
    const result = makeValidResult();
    result.fitScore = { score: 8, label: 'Strong Fit', summary: 'Strong candidate with most required skills and good potential for growth in the role.' };
    result.gaps = [
      { skill: 'K8s', severity: 'critical', currentLevel: 'None', requiredLevel: 'Adv', impact: 'Blocker', closingPlan: 'Plan', timeToClose: '3 months', resources: ['R'] },
      { skill: 'AWS', severity: 'critical', currentLevel: 'None', requiredLevel: 'Adv', impact: 'Blocker', closingPlan: 'Plan', timeToClose: '3 months', resources: ['R'] },
      { skill: 'Docker', severity: 'critical', currentLevel: 'None', requiredLevel: 'Adv', impact: 'Blocker', closingPlan: 'Plan', timeToClose: '3 months', resources: ['R'] },
    ];
    const report = validateAnalysisResult(result);
    const { result: fixed } = autoFixResult(result, report.issues);
    expect(fixed.fitScore.score).toBeLessThanOrEqual(6);
  });

  it('returns descriptions for applied fixes', () => {
    const result = makeValidResult();
    result.fitScore.score = 15;
    const report = validateAnalysisResult(result);
    const { descriptions } = autoFixResult(result, report.issues);
    expect(descriptions.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// validateTranslation
// ============================================================================

// ============================================================================
// Salary absurdity bounds
// ============================================================================

describe('validateAnalysisResult — salary absurdity bounds', () => {
  it('warns on unrealistically high salary (e.g., INR 99,999,999)', () => {
    const result = makeValidResult();
    result.salaryAnalysis.targetRoleMarket = { low: 50000000, mid: 99999999, high: 150000000, currency: 'INR', region: 'India' };
    const report = validateAnalysisResult(result);
    expect(report.issues.some(i => i.message.includes('unrealistically high'))).toBe(true);
  });

  it('warns on unrealistically low salary (e.g., USD 500)', () => {
    const result = makeValidResult();
    result.salaryAnalysis.currentRoleMarket = { low: 200, mid: 500, high: 800, currency: 'USD', region: 'US' };
    const report = validateAnalysisResult(result);
    expect(report.issues.some(i => i.message.includes('unrealistically low'))).toBe(true);
  });

  it('accepts valid INR salary (e.g., INR 1,500,000)', () => {
    const result = makeValidResult();
    result.salaryAnalysis.targetRoleMarket = { low: 1000000, mid: 1500000, high: 2000000, currency: 'INR', region: 'India' };
    const report = validateAnalysisResult(result);
    expect(report.issues.filter(i => i.message.includes('unrealistically')).length).toBe(0);
  });
});

// ============================================================================
// timeToClose validation
// ============================================================================

describe('validateGaps — timeToClose format', () => {
  const baseGap: Gap = {
    skill: 'Docker',
    severity: 'moderate',
    currentLevel: 'Basic',
    requiredLevel: 'Advanced',
    impact: 'Impact',
    closingPlan: 'Plan',
    timeToClose: '2-3 months at 1hr/day',
    resources: ['Resource 1', 'Resource 2'],
  };

  it('accepts valid timeToClose with time unit', () => {
    const issues = validateGaps([baseGap]);
    expect(issues.filter(i => i.field?.includes('timeToClose')).length).toBe(0);
  });

  it('flags vague timeToClose without time unit', () => {
    const gap = { ...baseGap, timeToClose: 'Some time needed' };
    const issues = validateGaps([gap]);
    expect(issues.some(i => i.field?.includes('timeToClose') && i.message.includes('vague'))).toBe(true);
  });

  it('flags timeToClose with "varies"', () => {
    const gap = { ...baseGap, timeToClose: 'Varies by person' };
    const issues = validateGaps([gap]);
    expect(issues.some(i => i.field?.includes('timeToClose') && i.message.includes('vague'))).toBe(true);
  });
});

// ============================================================================
// Data freshness — new roles in salary data
// ============================================================================

describe('Data freshness — salary data roles', () => {
  it('includes Prompt Engineer in salary data', async () => {
    const { SALARY_DATA } = await import('@/lib/knowledge/salary-data');
    const germany = SALARY_DATA['Germany'];
    expect(germany).toBeDefined();
    const promptEngineer = germany.roles.find(r => r.role === 'Prompt Engineer');
    expect(promptEngineer).toBeDefined();
    expect(promptEngineer!.mid.mid).toBeGreaterThan(0);
  });

  it('includes AI Safety Engineer in salary data', async () => {
    const { SALARY_DATA } = await import('@/lib/knowledge/salary-data');
    const germany = SALARY_DATA['Germany'];
    const aiSafety = germany.roles.find(r => r.role === 'AI Safety Engineer');
    expect(aiSafety).toBeDefined();
  });

  it('includes Developer Advocate in salary data', async () => {
    const { SALARY_DATA } = await import('@/lib/knowledge/salary-data');
    const germany = SALARY_DATA['Germany'];
    const devAdvocate = germany.roles.find(r => r.role === 'Developer Advocate');
    expect(devAdvocate).toBeDefined();
  });
});

describe('validateTranslation', () => {
  it('passes when translated result is identical', () => {
    const original = makeValidResult();
    const translated = JSON.parse(JSON.stringify(original));
    const { valid, mismatches } = validateTranslation(original, translated);
    expect(valid).toBe(true);
    expect(mismatches).toHaveLength(0);
  });

  it('fails when fitScore.score is altered', () => {
    const original = makeValidResult();
    const translated = JSON.parse(JSON.stringify(original));
    translated.fitScore.score = 9;
    const { valid, mismatches } = validateTranslation(original, translated);
    expect(valid).toBe(false);
    expect(mismatches.some((m: string) => m.includes('fitScore.score'))).toBe(true);
  });

  it('fails when array lengths change (strengths)', () => {
    const original = makeValidResult();
    const translated = JSON.parse(JSON.stringify(original));
    translated.strengths.push({ title: 'Extra', description: 'Extra', relevance: 'Extra', tier: 'supporting' });
    const { valid, mismatches } = validateTranslation(original, translated);
    expect(valid).toBe(false);
    expect(mismatches.some((m: string) => m.includes('strengths count'))).toBe(true);
  });

  it('fails when salary mid values are altered', () => {
    const original = makeValidResult();
    const translated = JSON.parse(JSON.stringify(original));
    translated.salaryAnalysis.targetRoleMarket.mid = 999999;
    const { valid, mismatches } = validateTranslation(original, translated);
    expect(valid).toBe(false);
    expect(mismatches.some((m: string) => m.includes('targetRoleMarket.mid'))).toBe(true);
  });
});
