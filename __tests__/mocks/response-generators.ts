/**
 * Deterministic response generators for mocked Claude calls.
 * Given a SyntheticPersona, these generate realistic ExtractedProfile,
 * GapAnalysisResult, CareerPlanResult, and JobMatch objects.
 */

import type {
  ExtractedProfile,
  SkillCategory,
  EducationItem,
  ExperienceItem,
  Gap,
  Strength,
  FitScore,
  RoleRecommendation,
  ActionPlan,
  ActionItem,
  SalaryAnalysis,
  JobMatch,
  CVSuggestion,
} from '@/lib/types';
import type { GapAnalysisResult } from '@/lib/prompts/gap-analysis';
import type { CareerPlanResult } from '@/lib/prompts/career-plan';
import type { SyntheticPersona } from '../fixtures/personas/types';
import { COUNTRY_CURRENCY } from '@/lib/utils';

// ============================================================================
// Helper: determine currency from persona
// ============================================================================

function getCurrency(persona: SyntheticPersona): string {
  const { workPreference, country } = persona.questionnaire;
  if (workPreference === 'remote' || workPreference === 'flexible') {
    return 'EUR';
  }
  return COUNTRY_CURRENCY[country]?.code || 'EUR';
}

// ============================================================================
// Helper: extract skill keywords from CV text
// ============================================================================

function extractSkillsFromCV(cvText: string): string[] {
  const techKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C\\+\\+', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue', 'Next\\.js', 'Node\\.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL',
    'Git', 'Linux', 'REST', 'GraphQL', 'gRPC', 'Microservices',
    'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy',
    'Figma', 'Sketch', 'Adobe XD',
    'Selenium', 'Cypress', 'Jest', 'Pytest', 'JUnit',
    'Agile', 'Scrum', 'Jira', 'Confluence',
    'HTML', 'CSS', 'SASS', 'Tailwind',
    'React Native', 'Flutter', 'SwiftUI', 'UIKit', 'Jetpack Compose',
    'Spark', 'Airflow', 'Kafka', 'Hadoop',
    'Prometheus', 'Grafana', 'Datadog', 'ELK',
    'Unity', 'Unreal', 'C', 'RTOS',
    'Excel', 'Power BI', 'Tableau',
    'WordPress', 'Shopify',
  ];

  const found: string[] = [];
  for (const kw of techKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(cvText)) {
      // Normalize to the canonical form
      found.push(kw.replace(/\\\+/g, '+').replace(/\\\./, '.'));
    }
  }
  return Array.from(new Set(found));
}

// ============================================================================
// Helper: categorize skills
// ============================================================================

function categorizeSkills(skills: string[]): SkillCategory[] {
  const categories: Record<string, { skills: string[]; level: SkillCategory['proficiencyLevel'] }> = {};

  const langKeywords = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'C', 'SQL'];
  const frameworkKeywords = ['React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'React Native', 'Flutter', 'SwiftUI', 'UIKit', 'Jetpack Compose'];
  const cloudKeywords = ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'Linux', 'Prometheus', 'Grafana', 'Datadog', 'ELK'];
  const dataKeywords = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Spark', 'Airflow', 'Kafka', 'Hadoop', 'Pandas', 'NumPy'];
  const mlKeywords = ['PyTorch', 'TensorFlow', 'Scikit-learn'];
  const testKeywords = ['Selenium', 'Cypress', 'Jest', 'Pytest', 'JUnit'];

  for (const skill of skills) {
    let cat = 'Other Tools';
    if (langKeywords.includes(skill)) cat = 'Programming Languages';
    else if (frameworkKeywords.includes(skill)) cat = 'Frameworks & Libraries';
    else if (cloudKeywords.includes(skill)) cat = 'Cloud & DevOps';
    else if (dataKeywords.includes(skill)) cat = 'Databases & Data';
    else if (mlKeywords.includes(skill)) cat = 'AI & Machine Learning';
    else if (testKeywords.includes(skill)) cat = 'Testing';

    if (!categories[cat]) {
      categories[cat] = { skills: [], level: 'intermediate' };
    }
    categories[cat].skills.push(skill);
  }

  return Object.entries(categories).map(([category, { skills: s }]) => ({
    category,
    skills: s,
    proficiencyLevel: s.length >= 3 ? 'advanced' : 'intermediate',
  }));
}

// ============================================================================
// Helper: parse name from CV text
// ============================================================================

function extractName(cvText: string): string {
  // Try first non-empty line that looks like a name (2-4 capitalized words)
  const lines = cvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines.slice(0, 5)) {
    if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) && line.length < 50) {
      return line.split(/\s*[|\-–—]/).shift()?.trim() || line;
    }
  }
  return 'Candidate';
}

// ============================================================================
// Helper: derive fitScore label
// ============================================================================

function deriveFitLabel(score: number): FitScore['label'] {
  if (score >= 8) return 'Strong Fit';
  if (score >= 6) return 'Moderate Fit';
  if (score >= 4) return 'Stretch';
  return 'Significant Gap';
}

// ============================================================================
// Helper: generate salary ranges
// ============================================================================

function generateSalaryRange(currency: string, level: 'junior' | 'mid' | 'senior' | 'lead'): { low: number; mid: number; high: number } {
  // Base in EUR, then adjust by currency
  const multipliers: Record<string, number> = {
    EUR: 1, USD: 1.1, GBP: 0.85, CHF: 1.15, RON: 4.9, PLN: 4.3,
    SEK: 11, DKK: 7.5, NOK: 11, CZK: 25, HUF: 390,
    CAD: 1.5, AUD: 1.65, INR: 90, SGD: 1.45, JPY: 160, BRL: 5.5,
  };
  const m = multipliers[currency] || 1;

  const bases: Record<string, { low: number; mid: number; high: number }> = {
    junior: { low: 30000, mid: 40000, high: 50000 },
    mid: { low: 45000, mid: 60000, high: 75000 },
    senior: { low: 65000, mid: 85000, high: 110000 },
    lead: { low: 85000, mid: 110000, high: 145000 },
  };

  const base = bases[level];
  return {
    low: Math.round(base.low * m),
    mid: Math.round(base.mid * m),
    high: Math.round(base.high * m),
  };
}

function inferLevel(yearsExp: number): 'junior' | 'mid' | 'senior' | 'lead' {
  if (yearsExp <= 2) return 'junior';
  if (yearsExp <= 5) return 'mid';
  if (yearsExp <= 9) return 'senior';
  return 'lead';
}

// ============================================================================
// Generate ExtractedProfile
// ============================================================================

export function generateExtractedProfile(persona: SyntheticPersona): ExtractedProfile {
  const cvSkills = extractSkillsFromCV(persona.cvText);
  const skillCategories = categorizeSkills(cvSkills);
  const name = extractName(persona.cvText);

  return {
    name,
    currentRole: persona.questionnaire.currentRole,
    totalYearsExperience: persona.questionnaire.yearsExperience,
    skills: skillCategories,
    certifications: [],
    education: [
      {
        degree: "Bachelor's Degree",
        institution: 'University',
        year: String(2024 - persona.questionnaire.yearsExperience - 4),
        field: 'Computer Science',
      },
    ],
    experience: [
      {
        title: persona.questionnaire.currentRole,
        company: 'Current Company',
        duration: `${Math.max(1, persona.questionnaire.yearsExperience - 2)} years`,
        highlights: [
          `Worked as ${persona.questionnaire.currentRole} contributing to team projects`,
          `Used ${cvSkills.slice(0, 3).join(', ')} in daily work`,
        ],
        technologies: cvSkills.slice(0, 6),
      },
    ],
    languages: [{ language: 'English', level: 'Professional' }],
    summary: `${name} is a ${persona.questionnaire.currentRole} with ${persona.questionnaire.yearsExperience} years of experience, skilled in ${cvSkills.slice(0, 4).join(', ')}.`,
  };
}

// ============================================================================
// Generate GapAnalysisResult
// ============================================================================

export function generateGapAnalysis(persona: SyntheticPersona, profile: ExtractedProfile): GapAnalysisResult {
  const { expectedTraits } = persona;
  const score = Math.round((expectedTraits.minFitScore + expectedTraits.maxFitScore) / 2);
  const currency = getCurrency(persona);

  // Build strengths from mustHaveStrengthKeywords
  const allSkills = profile.skills.flatMap(c => c.skills);
  const strengths: Strength[] = expectedTraits.mustHaveStrengthKeywords.slice(0, 4).map((kw, i) => {
    const matchedSkill = allSkills.find(s => s.toLowerCase().includes(kw.toLowerCase())) || kw;
    const tiers: Strength['tier'][] = ['differentiator', 'strong', 'supporting'];
    return {
      title: `${matchedSkill} Expertise`,
      description: `Demonstrated proficiency in ${matchedSkill} through ${persona.questionnaire.yearsExperience} years of professional experience. This skill directly applies to the target role of ${persona.questionnaire.targetRole}.`,
      relevance: `${matchedSkill} is a core requirement for the ${persona.questionnaire.targetRole} role and represents a strong foundation to build upon.`,
      tier: tiers[Math.min(i, 2)],
    };
  });

  // Build gaps from mustHaveGapKeywords
  const gaps: Gap[] = expectedTraits.mustHaveGapKeywords.map((kw, i) => {
    const severity = expectedTraits.expectedGapSeverities[i] || 'moderate';
    return {
      skill: kw.charAt(0).toUpperCase() + kw.slice(1),
      severity,
      currentLevel: severity === 'critical' ? 'No experience' : 'Basic awareness',
      requiredLevel: severity === 'critical' ? 'Production-level proficiency' : 'Working knowledge',
      impact: `Without ${kw}, the candidate will face challenges in the ${persona.questionnaire.targetRole} role. This skill is ${severity === 'critical' ? 'essential' : 'important'} for day-to-day responsibilities.`,
      closingPlan: `Start with foundational ${kw} training, then build practical projects. Focus on hands-on practice with real-world scenarios relevant to ${persona.questionnaire.targetRole}.`,
      timeToClose: severity === 'critical' ? '2-3 months' : severity === 'moderate' ? '1-2 months' : '2-4 weeks',
      resources: [
        `Udemy: Complete ${kw} Masterclass`,
        `Coursera: ${kw} Specialization`,
      ],
    };
  });

  // Role recommendations
  const level = inferLevel(persona.questionnaire.yearsExperience);
  const targetLevel = level === 'junior' ? 'mid' : level === 'mid' ? 'senior' : 'lead';
  const salaryRange = generateSalaryRange(currency, targetLevel);

  const roleRecommendations: RoleRecommendation[] = [
    {
      title: persona.questionnaire.targetRole,
      fitScore: score,
      salaryRange: { ...salaryRange, currency },
      reasoning: `Based on ${persona.questionnaire.yearsExperience} years of experience and existing skills, this is a natural next step in career progression.`,
      exampleCompanies: ['Google', 'Microsoft', 'Amazon'],
      timeToReady: score >= 7 ? 'Ready now' : score >= 5 ? '1-3 months' : '6-12 months',
    },
  ];

  if (persona.questionnaire.targetRole2) {
    roleRecommendations.push({
      title: persona.questionnaire.targetRole2,
      fitScore: Math.max(1, score - 1),
      salaryRange: { ...salaryRange, currency },
      reasoning: `Alternative role that leverages similar skills with a slightly different focus.`,
      exampleCompanies: ['Meta', 'Spotify', 'Stripe'],
      timeToReady: '3-6 months',
    });
  }

  // Add a suggested role
  roleRecommendations.push({
    title: `Senior ${persona.questionnaire.currentRole}`,
    fitScore: Math.min(10, score + 1),
    salaryRange: { ...generateSalaryRange(currency, level === 'junior' ? 'mid' : 'senior'), currency },
    reasoning: `A more direct progression path that builds on current strengths without requiring as many new skills.`,
    exampleCompanies: ['Shopify', 'GitLab', 'Atlassian'],
    timeToReady: 'Ready now',
  });

  return {
    fitScore: {
      score,
      label: deriveFitLabel(score),
      summary: `With ${persona.questionnaire.yearsExperience} years of experience as a ${persona.questionnaire.currentRole}, the candidate shows a ${deriveFitLabel(score).toLowerCase()} for the ${persona.questionnaire.targetRole} role. Key strengths include ${expectedTraits.mustHaveStrengthKeywords.slice(0, 2).join(' and ')} expertise, while gaps exist in ${expectedTraits.mustHaveGapKeywords.slice(0, 2).join(' and ')}.`,
    },
    strengths,
    gaps,
    roleRecommendations,
  };
}

// ============================================================================
// Generate CareerPlanResult
// ============================================================================

export function generateCareerPlan(
  persona: SyntheticPersona,
  gaps: Gap[],
  roleRecommendations: RoleRecommendation[]
): CareerPlanResult {
  const currency = getCurrency(persona);
  const level = inferLevel(persona.questionnaire.yearsExperience);
  const currentSalary = generateSalaryRange(currency, level);
  const targetLevel = level === 'junior' ? 'mid' : level === 'mid' ? 'senior' : 'lead';
  const targetSalary = generateSalaryRange(currency, targetLevel);
  const region = `${persona.questionnaire.country} (gross annual)`;

  // Build action plan from gaps
  const criticalGaps = gaps.filter(g => g.severity === 'critical');
  const moderateGaps = gaps.filter(g => g.severity === 'moderate');
  const minorGaps = gaps.filter(g => g.severity === 'minor');

  const thirtyDays: ActionItem[] = criticalGaps.slice(0, 3).map(g => ({
    action: `Begin ${g.skill} training with a structured course to address this critical gap`,
    priority: 'critical' as const,
    timeEstimate: '2-3 weeks at 1-2 hrs/day',
    resource: g.resources[0] || `Online course on ${g.skill}`,
    expectedImpact: `Builds foundational ${g.skill} knowledge needed for ${persona.questionnaire.targetRole} role`,
  }));

  if (thirtyDays.length === 0) {
    thirtyDays.push({
      action: `Update CV to highlight ${persona.questionnaire.targetRole} relevant experience`,
      priority: 'high',
      timeEstimate: '1-2 days',
      resource: 'GapZero CV Rewriter',
      expectedImpact: 'Improved CV match rate for target role positions',
    });
  }

  const ninetyDays: ActionItem[] = moderateGaps.slice(0, 3).map(g => ({
    action: `Build practical ${g.skill} skills through a hands-on project`,
    priority: 'high' as const,
    timeEstimate: '4-6 weeks at 1 hr/day',
    resource: g.resources[0] || `GitHub: ${g.skill} project tutorials`,
    expectedImpact: `Demonstrates ${g.skill} capability to potential employers`,
  }));

  if (ninetyDays.length === 0) {
    ninetyDays.push({
      action: `Complete a portfolio project showcasing ${persona.questionnaire.targetRole} skills`,
      priority: 'high',
      timeEstimate: '3-4 weeks',
      resource: 'GitHub',
      expectedImpact: 'Tangible proof of skills for interviews',
    });
  }

  const twelveMonths: ActionItem[] = [
    {
      action: `Pursue a recognized certification relevant to ${persona.questionnaire.targetRole}`,
      priority: 'medium',
      timeEstimate: '2-3 months preparation',
      resource: roleRecommendations[0]?.title?.includes('Cloud') ? 'AWS Certification' : 'Coursera Professional Certificate',
      expectedImpact: 'Validates expertise and opens doors to higher-tier positions',
    },
  ];

  if (minorGaps.length > 0) {
    twelveMonths.push({
      action: `Address remaining minor gap in ${minorGaps[0].skill} through continuous learning`,
      priority: 'medium',
      timeEstimate: 'Ongoing, 2-3 hrs/week',
      resource: `Community: ${minorGaps[0].skill} meetups and conferences`,
      expectedImpact: 'Rounds out skill profile for senior-level expectations',
    });
  }

  return {
    actionPlan: { thirtyDays, ninetyDays, twelveMonths },
    salaryAnalysis: {
      currentRoleMarket: {
        ...currentSalary,
        currency,
        region,
        source: 'estimate',
      },
      targetRoleMarket: {
        ...targetSalary,
        currency,
        region,
        source: 'estimate',
      },
      growthPotential: `${Math.round(((targetSalary.mid - currentSalary.mid) / currentSalary.mid) * 100)}% increase over 12-18 months`,
      bestMonetaryMove: `Focus on closing the critical skill gaps first, then target ${persona.questionnaire.targetRole} positions at companies like ${roleRecommendations[0]?.exampleCompanies?.[0] || 'top tech firms'}. With the right preparation, a ${Math.round(((targetSalary.mid - currentSalary.mid) / currentSalary.mid) * 100)}% salary increase is achievable.`,
      negotiationTips: [
        'Research market rates for your target role in your specific region before negotiations',
        'Highlight your unique combination of skills when discussing compensation',
        'Consider total compensation including equity, bonuses, and benefits',
      ],
      dataSource: 'estimate',
    },
  };
}

// ============================================================================
// Generate JobMatch (optional, only if job posting is present)
// ============================================================================

export function generateJobMatch(persona: SyntheticPersona, profile: ExtractedProfile): JobMatch | undefined {
  if (!persona.questionnaire.jobPosting) return undefined;

  const allSkills = profile.skills.flatMap(c => c.skills);
  const matchingSkills = allSkills.slice(0, Math.ceil(allSkills.length * 0.6));
  const importanceLevels: Array<'important' | 'not_a_deal_breaker' | 'unimportant'> = ['important', 'not_a_deal_breaker', 'unimportant'];
  const missingSkills = persona.expectedTraits.mustHaveGapKeywords.slice(0, 3).map((skill, i) => ({
    skill,
    importance: importanceLevels[i % importanceLevels.length],
  }));

  const matchScore = Math.round(
    (matchingSkills.length / (matchingSkills.length + missingSkills.length)) * 100
  );

  return {
    matchScore: Math.max(20, Math.min(95, matchScore)),
    matchingSkills: matchingSkills.map(s => s),
    missingSkills,
    cvSuggestions: [
      {
        section: 'Professional Summary',
        current: `${persona.questionnaire.currentRole} with ${persona.questionnaire.yearsExperience} years of experience`,
        suggested: `Results-driven ${persona.questionnaire.currentRole} with ${persona.questionnaire.yearsExperience} years of experience, seeking to leverage ${matchingSkills.slice(0, 2).join(' and ')} expertise in a ${persona.questionnaire.targetRole} role`,
        reasoning: 'Tailoring the summary to the target role improves ATS match rate',
      },
    ],
    overallAdvice: `The candidate has a reasonable foundation with ${matchingSkills.length} matching skills. Key gaps in ${missingSkills.map(s => s.skill).join(', ')} should be addressed. The CV should be reframed to emphasize transferable experience for the target role.`,
  };
}

// ============================================================================
// Master: generate all responses for a persona
// ============================================================================

export interface PersonaPipelineResult {
  profile: ExtractedProfile;
  gapAnalysis: GapAnalysisResult;
  careerPlan: CareerPlanResult;
  jobMatch?: JobMatch;
}

export function generateAllForPersona(persona: SyntheticPersona): PersonaPipelineResult {
  const profile = generateExtractedProfile(persona);
  const gapAnalysis = generateGapAnalysis(persona, profile);
  const careerPlan = generateCareerPlan(persona, gapAnalysis.gaps, gapAnalysis.roleRecommendations);
  const jobMatch = generateJobMatch(persona, profile);

  return { profile, gapAnalysis, careerPlan, jobMatch };
}
