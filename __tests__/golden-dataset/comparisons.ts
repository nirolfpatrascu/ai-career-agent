import type { GoldenExample, GoldenComparisonResult, GoldenCheckResult } from './types';
import type { PersonaPipelineResult } from '../mocks/response-generators';

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map(s => s.toLowerCase()));
  const setB = new Set(b.map(s => s.toLowerCase()));
  let intersection = 0;
  for (const item of Array.from(setA)) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...Array.from(setA), ...Array.from(setB)]).size;
  if (union === 0) return 1;
  return intersection / union;
}

export function compareToGolden(
  golden: GoldenExample,
  result: PersonaPipelineResult,
): GoldenComparisonResult {
  const checks: GoldenCheckResult[] = [];
  const { expected } = golden;
  const ga = result.gapAnalysis;
  const cp = result.careerPlan;

  // fitScore range check
  checks.push({
    field: 'fitScore',
    passed: ga.fitScore.score >= expected.fitScore.min && ga.fitScore.score <= expected.fitScore.max,
    actual: ga.fitScore.score,
    expected: `${expected.fitScore.min}-${expected.fitScore.max}`,
  });

  // Strength count
  checks.push({
    field: 'strengthCount',
    passed: ga.strengths.length >= expected.strengthCount.min && ga.strengths.length <= expected.strengthCount.max,
    actual: ga.strengths.length,
    expected: `${expected.strengthCount.min}-${expected.strengthCount.max}`,
  });

  // Gap count
  checks.push({
    field: 'gapCount',
    passed: ga.gaps.length >= expected.gapCount.min && ga.gaps.length <= expected.gapCount.max,
    actual: ga.gaps.length,
    expected: `${expected.gapCount.min}-${expected.gapCount.max}`,
  });

  // Must-have gap skills (each one present in actual gaps)
  const actualGapSkills = ga.gaps.map(g => g.skill.toLowerCase());
  for (const skill of expected.mustHaveGapSkills) {
    const found = actualGapSkills.some(s => s.includes(skill.toLowerCase()));
    checks.push({
      field: `gapSkill:${skill}`,
      passed: found,
      actual: found ? 'found' : 'missing',
      expected: `present in gaps`,
    });
  }

  // Must-have strength keywords
  const strengthText = ga.strengths.map(s => `${s.title} ${s.description}`.toLowerCase()).join(' ');
  for (const kw of expected.mustHaveStrengthKeywords) {
    const found = strengthText.includes(kw.toLowerCase());
    checks.push({
      field: `strengthKeyword:${kw}`,
      passed: found,
      actual: found ? 'found' : 'missing',
      expected: `present in strengths`,
    });
  }

  // Salary currency
  checks.push({
    field: 'salaryCurrency',
    passed: cp.salaryAnalysis.targetRoleMarket.currency === expected.salaryCurrency,
    actual: cp.salaryAnalysis.targetRoleMarket.currency,
    expected: expected.salaryCurrency,
  });

  // Salary target mid range
  const targetMid = cp.salaryAnalysis.targetRoleMarket.mid;
  checks.push({
    field: 'salaryTargetMid',
    passed: targetMid >= expected.salaryTargetMidRange.min && targetMid <= expected.salaryTargetMidRange.max,
    actual: targetMid,
    expected: `${expected.salaryTargetMidRange.min}-${expected.salaryTargetMidRange.max}`,
  });

  // Compute aggregate metrics
  const fitScoreMAE = Math.abs(
    ga.fitScore.score - (expected.fitScore.min + expected.fitScore.max) / 2
  );

  const gapSkillJaccard = jaccardSimilarity(
    actualGapSkills,
    expected.mustHaveGapSkills,
  );

  const salaryMidExpected = (expected.salaryTargetMidRange.min + expected.salaryTargetMidRange.max) / 2;
  const salaryMAE = salaryMidExpected > 0
    ? Math.abs(targetMid - salaryMidExpected) / salaryMidExpected
    : 0;

  return {
    id: golden.id,
    passed: checks.every(c => c.passed),
    checks,
    fitScoreMAE,
    gapSkillJaccard,
    salaryMAE,
  };
}
