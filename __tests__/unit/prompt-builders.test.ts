import { describe, it, expect } from 'vitest';
import { buildSkillExtractionPrompt } from '@/lib/prompts/skill-extraction';
import { buildGapAnalysisPrompt } from '@/lib/prompts/gap-analysis';
import { buildCareerPlanPrompt } from '@/lib/prompts/career-plan';
import { buildJobMatchPrompt } from '@/lib/prompts/job-matcher';
import { buildCVRewritePrompt } from '@/lib/prompts/cv-rewriter';
import { buildATSKeywordExtractionPrompt, buildATSMatchingPrompt } from '@/lib/prompts/ats-scoring';
import { buildCoverLetterPrompt } from '@/lib/prompts/cover-letter';
import { buildGitHubAnalysisPrompt } from '@/lib/prompts/github-analysis';
import { buildKnowledgeContext } from '@/lib/knowledge/index';
import type { CareerQuestionnaire, ExtractedProfile, Gap, RoleRecommendation, AnalysisResult } from '@/lib/types';

// ============================================================================
// Test fixtures
// ============================================================================

const sampleQuestionnaire: CareerQuestionnaire = {
  currentRole: 'Mid Frontend Developer',
  targetRole: 'Senior Frontend Developer',
  yearsExperience: 4,
  country: 'Germany',
  workPreference: 'hybrid',
};

const sampleCVText = `
John Developer
Mid Frontend Developer | 4 Years Experience

SUMMARY
Experienced frontend developer with strong React and TypeScript skills. Built multiple production applications.

EXPERIENCE
Frontend Developer at TechCorp (2020-2024)
- Built and maintained React applications serving 100K+ users
- Implemented TypeScript migration reducing bugs by 40%
- Led code review process for team of 5 developers

Junior Developer at StartupInc (2019-2020)
- Developed features using React and JavaScript
- Wrote unit tests with Jest

EDUCATION
B.Sc. Computer Science, TU Berlin, 2019

SKILLS
JavaScript, TypeScript, React, Next.js, HTML, CSS, Git, REST APIs, Jest, Docker
`;

const sampleProfile: ExtractedProfile = {
  name: 'John Developer',
  currentRole: 'Mid Frontend Developer',
  totalYearsExperience: 4,
  skills: [
    { category: 'Programming Languages', skills: ['JavaScript', 'TypeScript'], proficiencyLevel: 'advanced' },
    { category: 'Frameworks', skills: ['React', 'Next.js'], proficiencyLevel: 'advanced' },
    { category: 'DevOps', skills: ['Docker', 'Git'], proficiencyLevel: 'intermediate' },
  ],
  certifications: [],
  education: [{ degree: 'B.Sc.', institution: 'TU Berlin', year: '2019', field: 'Computer Science' }],
  experience: [
    {
      title: 'Frontend Developer',
      company: 'TechCorp',
      duration: '2020-2024 (4 years)',
      highlights: ['Built React apps for 100K+ users', 'Led TypeScript migration'],
      technologies: ['React', 'TypeScript', 'Jest'],
    },
  ],
  languages: [{ language: 'English', level: 'Professional' }],
  summary: 'Experienced frontend developer with 4 years of React and TypeScript experience.',
};

const sampleGaps: Gap[] = [
  {
    skill: 'System Design',
    severity: 'moderate',
    currentLevel: 'Basic',
    requiredLevel: 'Advanced',
    impact: 'Needed for senior-level interviews.',
    closingPlan: 'Study system design patterns.',
    timeToClose: '2 months',
    resources: ['Udemy: System Design', 'DDIA book'],
  },
];

const sampleRoleRecommendations: RoleRecommendation[] = [
  {
    title: 'Senior Frontend Developer',
    fitScore: 7,
    salaryRange: { low: 65000, mid: 80000, high: 100000, currency: 'EUR' },
    reasoning: 'Strong React skills.',
    exampleCompanies: ['Google', 'Spotify'],
    timeToReady: '1-3 months',
  },
];

// ============================================================================
// buildSkillExtractionPrompt
// ============================================================================

describe('buildSkillExtractionPrompt', () => {
  it('returns system and userMessage strings', () => {
    const result = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('userMessage');
    expect(typeof result.system).toBe('string');
    expect(typeof result.userMessage).toBe('string');
  });

  it('system prompt contains extraction instructions', () => {
    const { system } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(system.toLowerCase()).toContain('extract');
    expect(system.toLowerCase()).toContain('skill');
  });

  it('userMessage includes the CV text', () => {
    const { userMessage } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(userMessage).toContain('John Developer');
    expect(userMessage).toContain('TechCorp');
  });

  it('userMessage includes questionnaire context', () => {
    const { userMessage } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(userMessage).toContain('Senior Frontend Developer');
  });

  it('system prompt includes anti-hallucination rules', () => {
    const { system } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    const lower = system.toLowerCase();
    expect(lower).toContain('anti-hallucination');
  });

  it('system prompt includes proficiency level definitions', () => {
    const { system } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(system).toContain('expert');
    expect(system).toContain('advanced');
    expect(system).toContain('intermediate');
    expect(system).toContain('beginner');
  });

  it('system prompt extracts only EXPLICITLY stated skills (no implicit inference)', () => {
    const { system } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(system).toContain('EXPLICITLY stated');
    expect(system).not.toContain('implicit (if they describe');
  });
});

// ============================================================================
// buildGapAnalysisPrompt
// ============================================================================

describe('buildGapAnalysisPrompt', () => {
  it('returns system and userMessage', () => {
    const result = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('userMessage');
  });

  it('system prompt references fit score calibration', () => {
    const { system } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(system).toContain('score');
  });

  it('userMessage includes profile data', () => {
    const { userMessage } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(userMessage).toContain('John Developer');
  });

  it('userMessage includes target role', () => {
    const { userMessage } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(userMessage).toContain('Senior Frontend Developer');
  });

  it('accepts optional knowledge context', () => {
    const knowledge = 'Salary data: Senior Frontend in Germany earns EUR 70-100K';
    const result = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire, knowledge);
    expect(result.userMessage).toContain(knowledge);
  });
});

// ============================================================================
// buildCareerPlanPrompt
// ============================================================================

describe('buildCareerPlanPrompt', () => {
  it('returns system and userMessage', () => {
    const result = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('userMessage');
  });

  it('system prompt mentions salary rules', () => {
    const { system } = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    const lower = system.toLowerCase();
    expect(lower).toContain('salary');
    expect(lower).toContain('gross annual');
  });

  it('userMessage includes gaps', () => {
    const { userMessage } = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    expect(userMessage).toContain('System Design');
  });

  it('userMessage includes country for salary context', () => {
    const { userMessage } = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    expect(userMessage).toContain('Germany');
  });
});

// ============================================================================
// buildJobMatchPrompt
// ============================================================================

describe('buildJobMatchPrompt', () => {
  const jobPosting = 'Senior Frontend Developer at ACME Corp. Required: React, TypeScript, 5+ years.';

  it('returns system and userMessage', () => {
    const result = buildJobMatchPrompt(sampleProfile, sampleCVText, jobPosting);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('userMessage');
  });

  it('userMessage includes the job posting', () => {
    const { userMessage } = buildJobMatchPrompt(sampleProfile, sampleCVText, jobPosting);
    expect(userMessage).toContain('ACME Corp');
  });

  it('userMessage includes the CV text', () => {
    const { userMessage } = buildJobMatchPrompt(sampleProfile, sampleCVText, jobPosting);
    expect(userMessage).toContain('TechCorp');
  });
});

// ============================================================================
// buildCVRewritePrompt
// ============================================================================

describe('buildCVRewritePrompt', () => {
  it('returns system and userMessage', () => {
    const result = buildCVRewritePrompt(sampleCVText, 'Senior Frontend Developer', sampleGaps);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('userMessage');
  });

  it('system prompt includes anti-fabrication rules', () => {
    const { system } = buildCVRewritePrompt(sampleCVText, 'Senior Frontend Developer', sampleGaps);
    const lower = system.toLowerCase();
    expect(lower).toContain('never fabricate');
  });

  it('userMessage includes the target role', () => {
    const { userMessage } = buildCVRewritePrompt(sampleCVText, 'Senior Frontend Developer', sampleGaps);
    expect(userMessage).toContain('Senior Frontend Developer');
  });

  it('userMessage includes gap information', () => {
    const { userMessage } = buildCVRewritePrompt(sampleCVText, 'Senior Frontend Developer', sampleGaps);
    expect(userMessage).toContain('System Design');
  });
});

// ============================================================================
// buildKnowledgeContext
// ============================================================================

describe('buildKnowledgeContext', () => {
  it('returns context object with expected keys', () => {
    const ctx = buildKnowledgeContext(sampleQuestionnaire);
    expect(ctx).toHaveProperty('forGapAnalysis');
    expect(ctx).toHaveProperty('forCareerPlan');
    expect(ctx).toHaveProperty('forCVRewrite');
    expect(typeof ctx.forGapAnalysis).toBe('string');
    expect(typeof ctx.forCareerPlan).toBe('string');
  });

  it('includes salary context', () => {
    const ctx = buildKnowledgeContext(sampleQuestionnaire);
    expect(ctx).toHaveProperty('salary');
  });

  it('works with different countries', () => {
    const usQ = { ...sampleQuestionnaire, country: 'United States' };
    const ctx = buildKnowledgeContext(usQ);
    expect(ctx).toHaveProperty('forGapAnalysis');
  });

  it('works with remote work preference', () => {
    const remoteQ = { ...sampleQuestionnaire, workPreference: 'remote' as const };
    const ctx = buildKnowledgeContext(remoteQ);
    expect(ctx).toHaveProperty('forCareerPlan');
  });
});

// ============================================================================
// PROMPT INJECTION DEFENSE — present in all 8 prompt builders
// ============================================================================

describe('Prompt Injection Defense', () => {
  const INJECTION_MARKER = 'PROMPT INJECTION DEFENSE';

  it('skill-extraction prompt contains injection defense', () => {
    const { system } = buildSkillExtractionPrompt(sampleCVText, sampleQuestionnaire);
    expect(system).toContain(INJECTION_MARKER);
  });

  it('gap-analysis prompt contains injection defense', () => {
    const { system } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(system).toContain(INJECTION_MARKER);
  });

  it('career-plan prompt contains injection defense', () => {
    const { system } = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    expect(system).toContain(INJECTION_MARKER);
  });

  it('job-matcher prompt contains injection defense', () => {
    const { system } = buildJobMatchPrompt(sampleProfile, sampleCVText, 'Job posting text here');
    expect(system).toContain(INJECTION_MARKER);
  });

  it('cv-rewriter prompt contains injection defense', () => {
    const { system } = buildCVRewritePrompt(sampleCVText, 'Senior Frontend Developer', sampleGaps);
    expect(system).toContain(INJECTION_MARKER);
  });

  it('ats-keyword-extraction prompt contains injection defense', () => {
    const prompt = buildATSKeywordExtractionPrompt('Job posting text here');
    expect(prompt).toContain(INJECTION_MARKER);
  });

  it('ats-matching prompt contains injection defense', () => {
    const prompt = buildATSMatchingPrompt(sampleCVText, [{ keyword: 'React', category: 'required', importance: 'high', variants: [] }]);
    expect(prompt).toContain(INJECTION_MARKER);
  });

  it('cover-letter prompt contains injection defense', () => {
    const minimalAnalysis: AnalysisResult = {
      metadata: { analyzedAt: '', cvFileName: '', targetRole: 'Dev', country: 'US' },
      fitScore: { score: 7, label: 'Moderate Fit', summary: 'Good fit with some gaps in system design.' },
      strengths: [{ title: 'React', description: 'Strong React.', relevance: 'Core skill.', tier: 'strong' }],
      gaps: [{ skill: 'Docker', severity: 'moderate', currentLevel: 'Basic', requiredLevel: 'Advanced', impact: 'Impact', closingPlan: 'Plan', timeToClose: '1 month', resources: ['Resource'] }],
      roleRecommendations: [{ title: 'Dev', fitScore: 7, salaryRange: { low: 50000, mid: 70000, high: 90000, currency: 'USD' }, reasoning: 'Good fit.', exampleCompanies: ['Co'], timeToReady: 'Ready now' }],
      actionPlan: { thirtyDays: [{ action: 'A', priority: 'high', timeEstimate: '1w', resource: 'R', expectedImpact: 'I' }], ninetyDays: [{ action: 'B', priority: 'medium', timeEstimate: '1m', resource: 'R', expectedImpact: 'I' }], twelveMonths: [{ action: 'C', priority: 'medium', timeEstimate: '3m', resource: 'R', expectedImpact: 'I' }] },
      salaryAnalysis: { currentRoleMarket: { low: 50000, mid: 65000, high: 80000, currency: 'USD', region: 'US' }, targetRoleMarket: { low: 70000, mid: 85000, high: 100000, currency: 'USD', region: 'US' }, growthPotential: '20%', bestMonetaryMove: 'Target senior roles.', negotiationTips: ['Tip 1'] },
    };
    const { system } = buildCoverLetterPrompt({ analysis: minimalAnalysis, jobPosting: 'Job posting text' });
    expect(system).toContain(INJECTION_MARKER);
  });

  it('gap-analysis prompt contains negative example', () => {
    const { system } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(system).toContain('NEGATIVE EXAMPLE');
    expect(system).toContain('WHY THIS IS BAD');
  });

  it('job-matcher prompt contains negative example', () => {
    const { system } = buildJobMatchPrompt(sampleProfile, sampleCVText, 'Job posting text');
    expect(system).toContain('NEGATIVE EXAMPLE');
    expect(system).toContain('WHY THIS IS BAD');
  });

  it('gap-analysis prompt contains demographic blinding', () => {
    const { system } = buildGapAnalysisPrompt(sampleProfile, sampleQuestionnaire);
    expect(system).toContain('DEMOGRAPHIC BLINDING');
  });

  it('career-plan prompt contains demographic blinding', () => {
    const { system } = buildCareerPlanPrompt(sampleProfile, sampleQuestionnaire, sampleGaps, sampleRoleRecommendations);
    expect(system).toContain('DEMOGRAPHIC BLINDING');
  });

  it('github-analysis prompt contains injection defense', () => {
    const { system } = buildGitHubAnalysisPrompt({
      user: { login: 'test', name: 'Test', bio: null, public_repos: 5, followers: 10, created_at: '2020-01-01', location: null },
      repos: [{ name: 'repo', description: 'desc', language: 'TypeScript', stargazers_count: 5, forks_count: 1, updated_at: '2024-01-01', topics: [], license: null }],
      targetRole: 'Senior Dev',
    });
    expect(system).toContain(INJECTION_MARKER);
  });
});
