import { describe, it, expect } from 'vitest';
import { computeATSScore } from '@/lib/prompts/ats-scoring';
import { analyzeATSFormat } from '@/lib/ats-format-check';

describe('computeATSScore', () => {
  it('returns 100 when all keywords are exact matches', () => {
    const matches = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match', matchedAs: 'React', cvSection: 'Skills' },
      { keyword: 'TypeScript', category: 'required', importance: 'high', status: 'exact_match', matchedAs: 'TypeScript', cvSection: 'Skills' },
      { keyword: 'Node.js', category: 'preferred', importance: 'medium', status: 'exact_match', matchedAs: 'Node.js', cvSection: 'Skills' },
    ];
    const result = computeATSScore(matches);
    expect(result.keywordScore).toBe(100);
    expect(result.overallScore).toBe(100);
  });

  it('returns 0 when all keywords are missing', () => {
    const matches = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'missing' },
      { keyword: 'TypeScript', category: 'required', importance: 'high', status: 'missing' },
    ];
    const result = computeATSScore(matches);
    expect(result.keywordScore).toBe(0);
    expect(result.overallScore).toBe(0);
  });

  it('semantic matches count as 70% of weight', () => {
    const matches = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'semantic_match', matchedAs: 'React.js', cvSection: 'Skills' },
    ];
    const result = computeATSScore(matches);
    expect(result.keywordScore).toBe(70);
  });

  it('required keywords weigh more than preferred', () => {
    const requiredOnly = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match' },
      { keyword: 'Docker', category: 'required', importance: 'high', status: 'missing' },
    ];
    const preferredOnly = [
      { keyword: 'React', category: 'preferred', importance: 'high', status: 'exact_match' },
      { keyword: 'Docker', category: 'preferred', importance: 'high', status: 'missing' },
    ];

    const reqResult = computeATSScore(requiredOnly);
    const prefResult = computeATSScore(preferredOnly);
    // Both should be 50% since one matched and one didn't with same weights within category
    expect(reqResult.keywordScore).toBe(50);
    expect(prefResult.keywordScore).toBe(50);
  });

  it('correctly categorizes matched vs semantic vs missing', () => {
    const matches = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match', matchedAs: 'React', cvSection: 'Skills' },
      { keyword: 'AWS', category: 'required', importance: 'medium', status: 'semantic_match', matchedAs: 'Amazon Web Services', cvSection: 'Experience' },
      { keyword: 'Docker', category: 'preferred', importance: 'low', status: 'missing', cvSection: 'Skills' },
    ];
    const result = computeATSScore(matches);

    expect(result.keywords.matched).toHaveLength(1);
    expect(result.keywords.matched[0].keyword).toBe('React');

    expect(result.keywords.semanticMatch).toHaveLength(1);
    expect(result.keywords.semanticMatch[0].keyword).toBe('AWS');

    expect(result.keywords.missing).toHaveLength(1);
    expect(result.keywords.missing[0].keyword).toBe('Docker');
  });

  it('calculates required totals correctly', () => {
    const matches = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match' },
      { keyword: 'TypeScript', category: 'required', importance: 'high', status: 'missing' },
      { keyword: 'Docker', category: 'preferred', importance: 'medium', status: 'exact_match' },
    ];
    const result = computeATSScore(matches);
    expect(result.keywords.total.required).toBe(2);
    expect(result.keywords.total.matched).toBe(1);
    expect(result.keywords.total.missing).toBe(1);
  });

  it('handles empty matches array', () => {
    const result = computeATSScore([]);
    expect(result.keywordScore).toBe(0);
    expect(result.overallScore).toBe(0);
    expect(result.keywords.matched).toHaveLength(0);
    expect(result.keywords.semanticMatch).toHaveLength(0);
    expect(result.keywords.missing).toHaveLength(0);
  });

  it('weights importance levels correctly', () => {
    // high required = 10, low required = 4
    const highOnly = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match' },
    ];
    const lowOnly = [
      { keyword: 'Git', category: 'required', importance: 'low', status: 'exact_match' },
    ];

    const highResult = computeATSScore(highOnly);
    const lowResult = computeATSScore(lowOnly);
    // Both should be 100 since all available are matched
    expect(highResult.keywordScore).toBe(100);
    expect(lowResult.keywordScore).toBe(100);
  });

  it('produces scores between 0 and 100', () => {
    const mixes = [
      { keyword: 'React', category: 'required', importance: 'high', status: 'exact_match' },
      { keyword: 'TypeScript', category: 'required', importance: 'medium', status: 'semantic_match' },
      { keyword: 'Docker', category: 'preferred', importance: 'high', status: 'missing' },
      { keyword: 'K8s', category: 'nice-to-have', importance: 'low', status: 'exact_match' },
      { keyword: 'AWS', category: 'required', importance: 'high', status: 'missing' },
    ];
    const result = computeATSScore(mixes);
    expect(result.keywordScore).toBeGreaterThanOrEqual(0);
    expect(result.keywordScore).toBeLessThanOrEqual(100);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// ATS Format Check — Page count bug fix tests
// ============================================================================

describe('analyzeATSFormat — page count checks', () => {
  const baseCvText = 'A'.repeat(500) + '\nExperience\nSkills\nEducation\njohn@example.com\n+1234567890';

  it('flags 4-page CV as warning (tooLong), not critical', () => {
    const result = analyzeATSFormat(baseCvText, { numpages: 4 }, 100000);
    const tooLong = result.issues.find(i => i.issue === 'ats.format.tooLong');
    const wayTooLong = result.issues.find(i => i.issue === 'ats.format.wayTooLong');
    expect(tooLong).toBeDefined();
    expect(tooLong!.severity).toBe('warning');
    expect(wayTooLong).toBeUndefined();
  });

  it('flags 6-page CV as critical (wayTooLong)', () => {
    const result = analyzeATSFormat(baseCvText, { numpages: 6 }, 100000);
    const wayTooLong = result.issues.find(i => i.issue === 'ats.format.wayTooLong');
    expect(wayTooLong).toBeDefined();
    expect(wayTooLong!.severity).toBe('critical');
    // Should NOT also flag tooLong (they are mutually exclusive)
    const tooLong = result.issues.find(i => i.issue === 'ats.format.tooLong');
    expect(tooLong).toBeUndefined();
  });

  it('does not flag 2-page CV for page count', () => {
    const result = analyzeATSFormat(baseCvText, { numpages: 2 }, 100000);
    const pageIssues = result.issues.filter(i => i.issue === 'ats.format.tooLong' || i.issue === 'ats.format.wayTooLong');
    expect(pageIssues).toHaveLength(0);
  });
});
