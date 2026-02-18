// ============================================================================
// Knowledge Base: Index & Context Builder
// Selects and assembles relevant knowledge for each analysis
// ============================================================================

import { getSalaryContext } from './salary-data';
import { findTransitionPatterns } from './transition-patterns';
import { getCVContext } from './cv-practices';
import { getLinkedInContext } from './linkedin-playbook';
import { getNegotiationContext } from './negotiation';
import { getSkillsDemandContext } from './skills-demand';
import type { CareerQuestionnaire } from '../types';

export interface KnowledgeContext {
  /** Salary benchmarks for country + remote market if applicable */
  salary: string;
  /** Matching career transition patterns */
  transitions: string;
  /** Skills demand and certification ROI for target role */
  skillsDemand: string;
  /** Full combined context for gap analysis prompt */
  forGapAnalysis: string;
  /** Full combined context for career plan prompt */
  forCareerPlan: string;
  /** CV-specific context for job matching / CV rewrite prompts */
  forCVRewrite: string;
}

/**
 * Build knowledge context from questionnaire.
 * Keeps each section under a token budget to avoid bloating prompts.
 */
export function buildKnowledgeContext(q: CareerQuestionnaire): KnowledgeContext {
  const salary = getSalaryContext(q.country, q.workPreference);
  const transitions = findTransitionPatterns(q.currentRole, q.targetRole);
  const skillsDemand = getSkillsDemandContext(q.targetRole);
  const negotiation = getNegotiationContext(q.country, q.workPreference, q.currentRole, q.targetRole);
  const cvContext = getCVContext(q.targetRole);
  const linkedIn = getLinkedInContext(q.currentRole, q.targetRole);

  // Gap analysis needs: salary context, transition patterns, skills demand
  const forGapAnalysis = [
    salary,
    transitions,
    skillsDemand,
  ].filter(Boolean).join('\n\n');

  // Career plan needs: salary, transitions, negotiation, skills demand
  const forCareerPlan = [
    salary,
    transitions,
    negotiation,
    skillsDemand,
  ].filter(Boolean).join('\n\n');

  // CV rewrite needs: CV practices, LinkedIn playbook
  const forCVRewrite = [
    cvContext,
    linkedIn,
  ].filter(Boolean).join('\n\n');

  return {
    salary,
    transitions,
    skillsDemand,
    forGapAnalysis,
    forCareerPlan,
    forCVRewrite,
  };
}

// Re-export individual modules for direct use
export { getSalaryContext } from './salary-data';
export { findTransitionPatterns } from './transition-patterns';
export { getCVContext } from './cv-practices';
export { getLinkedInContext } from './linkedin-playbook';
export { getNegotiationContext } from './negotiation';
export { getSkillsDemandContext } from './skills-demand';
