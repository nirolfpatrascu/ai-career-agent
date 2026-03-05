import { describe, it, expect } from 'vitest';
import { goldenExamples } from './golden-examples';
import { compareToGolden } from './comparisons';
import { generateAllForPersona } from '../mocks/response-generators';

describe('Golden Dataset — Regression Anchors', () => {
  for (const golden of goldenExamples) {
    describe(`${golden.id}: ${golden.persona.id} — ${golden.persona.description}`, () => {
      const result = generateAllForPersona(golden.persona);
      const comparison = compareToGolden(golden, result);

      it('all individual checks pass', () => {
        for (const check of comparison.checks) {
          expect(check.passed, `${check.field}: got ${check.actual}, expected ${check.expected}`).toBe(true);
        }
      });

      it('fitScore MAE < 2', () => {
        expect(comparison.fitScoreMAE).toBeLessThan(2);
      });

      it('gap skill Jaccard similarity ≥ 0.5', () => {
        expect(comparison.gapSkillJaccard).toBeGreaterThanOrEqual(0.5);
      });

      it('salary MAE < 30%', () => {
        expect(comparison.salaryMAE).toBeLessThan(0.3);
      });
    });
  }
});
