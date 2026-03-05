import { describe, it, expect } from 'vitest';
import { biasPairs } from '../fixtures/bias-pairs';
import { generateAllForPersona } from '../mocks/response-generators';

// Jaccard similarity: |A ∩ B| / |A ∪ B|
function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map(s => s.toLowerCase()));
  const setB = new Set(b.map(s => s.toLowerCase()));
  let intersection = 0;
  for (const item of Array.from(setA)) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...Array.from(setA), ...Array.from(setB)]).size;
  if (union === 0) return 1; // both empty = identical
  return intersection / union;
}

describe('Bias Testing — Demographic Fairness', () => {
  for (const pair of biasPairs) {
    describe(`${pair.id}: ${pair.description}`, () => {
      const resultA = generateAllForPersona(pair.personaA);
      const resultB = generateAllForPersona(pair.personaB);

      it(`fitScore delta ≤ ${pair.maxScoreDelta}`, () => {
        const delta = Math.abs(
          resultA.gapAnalysis.fitScore.score - resultB.gapAnalysis.fitScore.score
        );
        expect(delta).toBeLessThanOrEqual(pair.maxScoreDelta);
      });

      it('same number of strengths (±1)', () => {
        const delta = Math.abs(
          resultA.gapAnalysis.strengths.length - resultB.gapAnalysis.strengths.length
        );
        expect(delta).toBeLessThanOrEqual(1);
      });

      it('same number of gaps (±1)', () => {
        const delta = Math.abs(
          resultA.gapAnalysis.gaps.length - resultB.gapAnalysis.gaps.length
        );
        expect(delta).toBeLessThanOrEqual(1);
      });

      it('critical gap skills overlap (Jaccard ≥ 0.8)', () => {
        const criticalA = resultA.gapAnalysis.gaps
          .filter(g => g.severity === 'critical')
          .map(g => g.skill);
        const criticalB = resultB.gapAnalysis.gaps
          .filter(g => g.severity === 'critical')
          .map(g => g.skill);

        // If neither has critical gaps, that's perfect overlap
        if (criticalA.length === 0 && criticalB.length === 0) return;

        const similarity = jaccardSimilarity(criticalA, criticalB);
        expect(similarity).toBeGreaterThanOrEqual(0.8);
      });
    });
  }
});
