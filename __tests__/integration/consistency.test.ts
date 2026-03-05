import { describe, it, expect } from 'vitest';
import { allPersonas } from '../fixtures/personas';
import { generateAllForPersona, type PersonaPipelineResult } from '../mocks/response-generators';

// Standard deviation helper
function stddev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
}

// Coefficient of variation: stddev / mean (as fraction, not percentage)
function coeffOfVariation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  return stddev(values) / Math.abs(mean);
}

// Pick 5 representative personas: A01, A15, B01, C01, D01
const REPRESENTATIVE_IDS = ['A01', 'A15', 'B01', 'C01', 'D01'];

describe('Consistency & Reproducibility', () => {
  const RUNS = 3;

  for (const personaId of REPRESENTATIVE_IDS) {
    const persona = allPersonas.find(p => p.id === personaId);
    if (!persona) continue;

    describe(`Persona ${personaId}: ${persona.description}`, () => {
      // Run each persona N times
      const results: PersonaPipelineResult[] = [];
      for (let i = 0; i < RUNS; i++) {
        results.push(generateAllForPersona(persona));
      }

      it('fitScore standard deviation < 0.5', () => {
        const scores = results.map(r => r.gapAnalysis.fitScore.score);
        expect(stddev(scores)).toBeLessThan(0.5);
      });

      it('gap count range ≤ 1', () => {
        const counts = results.map(r => r.gapAnalysis.gaps.length);
        const range = Math.max(...counts) - Math.min(...counts);
        expect(range).toBeLessThanOrEqual(1);
      });

      it('strength count range ≤ 1', () => {
        const counts = results.map(r => r.gapAnalysis.strengths.length);
        const range = Math.max(...counts) - Math.min(...counts);
        expect(range).toBeLessThanOrEqual(1);
      });

      it('same critical gaps across runs', () => {
        const criticalSets = results.map(r =>
          r.gapAnalysis.gaps
            .filter(g => g.severity === 'critical')
            .map(g => g.skill.toLowerCase())
            .sort()
            .join(',')
        );
        // All runs should produce the same critical gaps
        const unique = new Set(criticalSets);
        expect(unique.size).toBeLessThanOrEqual(1);
      });

      it('salary mid variance < 5%', () => {
        const targetMids = results.map(r => r.careerPlan.salaryAnalysis.targetRoleMarket.mid);
        expect(coeffOfVariation(targetMids)).toBeLessThan(0.05);

        const currentMids = results.map(r => r.careerPlan.salaryAnalysis.currentRoleMarket.mid);
        expect(coeffOfVariation(currentMids)).toBeLessThan(0.05);
      });
    });
  }
});
