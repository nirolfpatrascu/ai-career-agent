import type { GoldenExample } from './types';
import { allPersonas } from '../fixtures/personas';

function getPersona(id: string) {
  const p = allPersonas.find(p => p.id === id);
  if (!p) throw new Error(`Persona ${id} not found`);
  return p;
}

// ============================================================================
// 5 Golden Examples with tightened expected ranges derived from mock outputs.
// These serve as regression anchors — if the pipeline changes, golden tests
// catch drift in scoring, skills, and salary.
// ============================================================================

export const goldenExamples: GoldenExample[] = [
  // GOLD-01: A01 — Junior Frontend → Mid Frontend (USD)
  {
    id: 'GOLD-01',
    persona: getPersona('A01'),
    expected: {
      fitScore: { min: 6, max: 8 },
      strengthCount: { min: 1, max: 4 },
      gapCount: { min: 1, max: 3 },
      mustHaveGapSkills: ['testing', 'architecture'],
      mustHaveStrengthKeywords: ['react', 'javascript'],
      salaryCurrency: 'USD',
      salaryTargetMidRange: { min: 55000, max: 80000 },
    },
  },

  // GOLD-02: A02 — Mid Backend → Senior Backend (GBP)
  {
    id: 'GOLD-02',
    persona: getPersona('A02'),
    expected: {
      fitScore: { min: 6, max: 8 },
      strengthCount: { min: 1, max: 4 },
      gapCount: { min: 1, max: 3 },
      mustHaveGapSkills: ['system design', 'mentoring'],
      mustHaveStrengthKeywords: ['python', 'node.js'],
      salaryCurrency: 'GBP',
      salaryTargetMidRange: { min: 60000, max: 85000 },
    },
  },

  // GOLD-03: B01 — Senior Backend → Engineering Manager (USD)
  {
    id: 'GOLD-03',
    persona: getPersona('B01'),
    expected: {
      fitScore: { min: 4, max: 6 },
      strengthCount: { min: 2, max: 5 },
      gapCount: { min: 2, max: 4 },
      mustHaveGapSkills: ['people management', 'hiring'],
      mustHaveStrengthKeywords: ['python', 'java'],
      salaryCurrency: 'USD',
      salaryTargetMidRange: { min: 100000, max: 140000 },
    },
  },

  // GOLD-04: C01 — QA Engineer → DevOps Engineer (EUR, remote override)
  {
    id: 'GOLD-04',
    persona: getPersona('C01'),
    expected: {
      fitScore: { min: 4, max: 6 },
      strengthCount: { min: 2, max: 5 },
      gapCount: { min: 2, max: 4 },
      mustHaveGapSkills: ['cloud platforms', 'infrastructure as code'],
      mustHaveStrengthKeywords: ['testing', 'ci/cd'],
      salaryCurrency: 'EUR',
      salaryTargetMidRange: { min: 70000, max: 100000 },
    },
  },

  // GOLD-05: D01 — Teacher → Junior Full-Stack (EUR, career change)
  {
    id: 'GOLD-05',
    persona: getPersona('D01'),
    expected: {
      fitScore: { min: 2, max: 4 },
      strengthCount: { min: 2, max: 5 },
      gapCount: { min: 3, max: 5 },
      mustHaveGapSkills: ['professional coding', 'frameworks', 'databases'],
      mustHaveStrengthKeywords: ['communication', 'teaching'],
      salaryCurrency: 'EUR',
      salaryTargetMidRange: { min: 90000, max: 130000 },
    },
  },
];
