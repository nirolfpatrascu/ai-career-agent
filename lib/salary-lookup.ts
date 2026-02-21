// ============================================================================
// Salary Lookup — Fuzzy matching for role + country → curated salary data
// Falls back to null when no match found (caller uses Claude estimate)
// ============================================================================

import { SALARY_DATA, REMOTE_EU_RATES, type SalaryBand } from './knowledge/salary-data';

// Role title normalization map — common abbreviations/variants → canonical name
const ROLE_ALIASES: Record<string, string> = {
  // Software Engineering
  'swe': 'Software Engineer',
  'software dev': 'Software Engineer',
  'software developer': 'Software Engineer',
  'programmer': 'Software Engineer',
  'full stack': 'Full Stack Developer',
  'full-stack': 'Full Stack Developer',
  'full stack dev': 'Full Stack Developer',
  'full-stack developer': 'Full Stack Developer',
  'fullstack': 'Full Stack Developer',
  'fullstack developer': 'Full Stack Developer',
  'frontend': 'Frontend Developer',
  'front end': 'Frontend Developer',
  'front-end': 'Frontend Developer',
  'frontend dev': 'Frontend Developer',
  'frontend engineer': 'Frontend Developer',
  'front end developer': 'Frontend Developer',
  'front-end developer': 'Frontend Developer',
  'react developer': 'Frontend Developer',
  'ui developer': 'Frontend Developer',
  'backend': 'Backend Developer',
  'back end': 'Backend Developer',
  'back-end': 'Backend Developer',
  'backend dev': 'Backend Developer',
  'backend engineer': 'Backend Developer',
  'back end developer': 'Backend Developer',
  'back-end developer': 'Backend Developer',
  'api developer': 'Backend Developer',
  'mobile dev': 'Mobile Developer',
  'mobile engineer': 'Mobile Developer',
  'ios developer': 'Mobile Developer',
  'android developer': 'Mobile Developer',
  'react native developer': 'Mobile Developer',
  'flutter developer': 'Mobile Developer',
  'game dev': 'Game Developer',
  'game programmer': 'Game Developer',
  'unity developer': 'Game Developer',
  'unreal developer': 'Game Developer',

  // AI/ML
  'ml engineer': 'AI/ML Engineer',
  'ml eng': 'AI/ML Engineer',
  'ai engineer': 'AI/ML Engineer',
  'ai/ml': 'AI/ML Engineer',
  'machine learning': 'Machine Learning Engineer',
  'ml': 'Machine Learning Engineer',
  'nlp': 'NLP Engineer',
  'nlp engineer': 'NLP Engineer',
  'natural language processing': 'NLP Engineer',
  'computer vision': 'Computer Vision Engineer',
  'cv engineer': 'Computer Vision Engineer',
  'deep learning engineer': 'AI/ML Engineer',

  // Data
  'data eng': 'Data Engineer',
  'data engineering': 'Data Engineer',
  'data science': 'Data Scientist',
  'data analyst': 'Data Analyst',
  'bi analyst': 'Data Analyst',
  'business intelligence': 'Data Analyst',
  'chief data officer': 'Chief Data Officer',
  'cdo': 'Chief Data Officer',

  // DevOps/Cloud/Infra
  'devops': 'DevOps Engineer',
  'dev ops': 'DevOps Engineer',
  'devops eng': 'DevOps Engineer',
  'devops/cloud': 'DevOps/Cloud Engineer',
  'cloud engineer': 'DevOps/Cloud Engineer',
  'cloud eng': 'DevOps/Cloud Engineer',
  'cloud architect': 'Cloud Architect',
  'cloud solutions architect': 'Cloud Architect',
  'aws architect': 'Cloud Architect',
  'azure architect': 'Cloud Architect',
  'gcp architect': 'Cloud Architect',
  'sre': 'SRE',
  'site reliability': 'Site Reliability Engineer',
  'site reliability engineer': 'Site Reliability Engineer',
  'platform eng': 'Platform Engineer',
  'platform engineer': 'Platform Engineer',
  'infra engineer': 'Platform Engineer',
  'infrastructure engineer': 'Platform Engineer',
  'release eng': 'Release Engineer',
  'release engineer': 'Release Engineer',
  'build engineer': 'Release Engineer',
  'dba': 'Database Administrator',
  'database admin': 'Database Administrator',
  'db admin': 'Database Administrator',
  'network eng': 'Network Engineer',
  'network admin': 'Network Engineer',
  'sysadmin': 'Systems Administrator',
  'sys admin': 'Systems Administrator',
  'system admin': 'Systems Administrator',
  'system administrator': 'Systems Administrator',
  'systems admin': 'Systems Administrator',

  // Security
  'security eng': 'Security Engineer',
  'security engineer': 'Security Engineer',
  'infosec': 'Security Engineer',
  'information security': 'Security Engineer',
  'cybersecurity': 'Cybersecurity Analyst',
  'cyber security': 'Cybersecurity Analyst',
  'security analyst': 'Cybersecurity Analyst',
  'pentest': 'Penetration Tester',
  'pen tester': 'Penetration Tester',
  'pentester': 'Penetration Tester',
  'ethical hacker': 'Penetration Tester',

  // Management/Leadership
  'engineering manager': 'Engineering Manager',
  'eng manager': 'Engineering Manager',
  'em': 'Engineering Manager',
  'tech lead': 'Technical Lead',
  'team lead': 'Technical Lead',
  'lead engineer': 'Technical Lead',
  'lead developer': 'Technical Lead',
  'vp eng': 'VP Engineering',
  'vp of engineering': 'VP Engineering',
  'vice president engineering': 'VP Engineering',
  'cto': 'CTO',
  'chief technology officer': 'CTO',
  'chief technical officer': 'CTO',
  'pm': 'Product Manager',
  'product owner': 'Product Manager',
  'po': 'Product Manager',
  'it pm': 'IT Project Manager',
  'it project manager': 'IT Project Manager',
  'project manager': 'IT Project Manager',
  'scrum master': 'Scrum Master',
  'agile coach': 'Scrum Master',

  // Architecture
  'solutions architect': 'Solutions Architect',
  'sa': 'Solutions Architect',
  'solution architect': 'Solutions Architect',

  // Design
  'ux': 'UX Designer',
  'ux/ui': 'UX Designer',
  'ui/ux': 'UX Designer',
  'ux designer': 'UX Designer',
  'ui designer': 'UX Designer',
  'product designer': 'UX Designer',

  // QA
  'qa': 'QA Engineer',
  'qa engineer': 'QA Engineer',
  'test engineer': 'QA Engineer',
  'tester': 'QA Engineer',
  'sdet': 'QA Engineer',
  'quality assurance': 'QA Engineer',
  'automation tester': 'QA Engineer',

  // Business/Pre-Sales
  'ba': 'Business Analyst',
  'business analyst': 'Business Analyst',
  'technical writer': 'Technical Writer',
  'tech writer': 'Technical Writer',
  'documentation engineer': 'Technical Writer',
  'tam': 'Technical Account Manager',
  'technical account manager': 'Technical Account Manager',
  'solutions consultant': 'Solutions Consultant',
  'solution consultant': 'Solutions Consultant',
  'pre-sales': 'Pre-Sales Engineer',
  'presales': 'Pre-Sales Engineer',
  'pre-sales engineer': 'Pre-Sales Engineer',
  'sales engineer': 'Pre-Sales Engineer',

  // Emerging Tech
  'blockchain': 'Blockchain Developer',
  'blockchain dev': 'Blockchain Developer',
  'web3 developer': 'Blockchain Developer',
  'smart contract developer': 'Blockchain Developer',
  'embedded': 'Embedded Systems Engineer',
  'embedded engineer': 'Embedded Systems Engineer',
  'firmware engineer': 'Embedded Systems Engineer',
  'iot': 'IoT Engineer',
  'iot engineer': 'IoT Engineer',
  'robotics': 'Robotics Engineer',
  'robotics engineer': 'Robotics Engineer',
  'ar/vr': 'AR/VR Developer',
  'ar developer': 'AR/VR Developer',
  'vr developer': 'AR/VR Developer',
  'xr developer': 'AR/VR Developer',

  // RPA/Automation
  'rpa': 'RPA Developer',
  'rpa developer': 'RPA Developer',
  'rpa engineer': 'RPA Developer',
  'uipath developer': 'RPA Developer',
  'automation consultant': 'Automation Consultant',
  'automation engineer': 'Automation Consultant',
  'technical enablement': 'Technical Enablement',
};

// Country name normalization
const COUNTRY_ALIASES: Record<string, string> = {
  'uk': 'United Kingdom',
  'u.k.': 'United Kingdom',
  'england': 'United Kingdom',
  'britain': 'United Kingdom',
  'great britain': 'United Kingdom',
  'us': 'United States',
  'u.s.': 'United States',
  'usa': 'United States',
  'u.s.a.': 'United States',
  'america': 'United States',
  'czech republic': 'Czechia',
  'czech': 'Czechia',
  'holland': 'Netherlands',
  'the netherlands': 'Netherlands',
  'brasil': 'Brazil',
  'deutschland': 'Germany',
  'schweiz': 'Switzerland',
  'österreich': 'Austria',
  'españa': 'Spain',
  'italia': 'Italy',
  'france': 'France',
  'sverige': 'Sweden',
  'danmark': 'Denmark',
  'irland': 'Ireland',
  'éire': 'Ireland',
  'polska': 'Poland',
  'česko': 'Czechia',
  'portugal': 'Portugal',
  'kanada': 'Canada',
  'indien': 'India',
  'brasilien': 'Brazil',
  'rumänien': 'Romania',
  'românia': 'Romania',
  'ro': 'Romania',
  'de': 'Germany',
  'fr': 'France',
  'es': 'Spain',
  'it': 'Italy',
  'pl': 'Poland',
  'cz': 'Czechia',
  'ch': 'Switzerland',
  'at': 'Austria',
  'se': 'Sweden',
  'dk': 'Denmark',
  'ie': 'Ireland',
  'pt': 'Portugal',
  'ca': 'Canada',
  'in': 'India',
  'br': 'Brazil',
  'nl': 'Netherlands',
};

/**
 * Normalize a role title to its canonical form
 */
function normalizeRole(input: string): string {
  const lower = input.trim().toLowerCase();

  // Direct alias lookup
  if (ROLE_ALIASES[lower]) return ROLE_ALIASES[lower];

  // Try without common suffixes
  const withoutSuffix = lower
    .replace(/\s+(engineer|developer|dev|eng)\s*$/i, '')
    .trim();
  if (ROLE_ALIASES[withoutSuffix]) return ROLE_ALIASES[withoutSuffix];

  // Capitalize first letter of each word and return as-is (might match directly)
  return input.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Normalize a country name to its canonical form
 */
function normalizeCountry(input: string): string {
  const lower = input.trim().toLowerCase();
  if (COUNTRY_ALIASES[lower]) return COUNTRY_ALIASES[lower];
  // Capitalize first letter of each word
  return input.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Find a role in a roles array using fuzzy matching
 */
function findRole(roles: SalaryBand[], normalizedRole: string): SalaryBand | null {
  // Exact match
  const exact = roles.find((r) => r.role === normalizedRole);
  if (exact) return exact;

  // Case-insensitive match
  const caseInsensitive = roles.find(
    (r) => r.role.toLowerCase() === normalizedRole.toLowerCase()
  );
  if (caseInsensitive) return caseInsensitive;

  // Partial match — role contains the search term or vice versa
  const partial = roles.find(
    (r) =>
      r.role.toLowerCase().includes(normalizedRole.toLowerCase()) ||
      normalizedRole.toLowerCase().includes(r.role.toLowerCase())
  );
  if (partial) return partial;

  return null;
}

/**
 * Look up salary data for a role in a specific country.
 * Returns null if no curated data is available (caller falls back to Claude estimate).
 */
export function lookupSalary(roleTitle: string, country: string): SalaryBand | null {
  const normalizedRole = normalizeRole(roleTitle);
  const normalizedCountry = normalizeCountry(country);

  // Look up country data
  const countryData = SALARY_DATA[normalizedCountry];
  if (!countryData) return null;

  return findRole(countryData.roles, normalizedRole);
}

/**
 * Look up remote market salary for a role.
 * Returns Remote EU rates by default.
 */
export function lookupRemoteSalary(roleTitle: string): SalaryBand | null {
  const normalizedRole = normalizeRole(roleTitle);
  return findRole(REMOTE_EU_RATES, normalizedRole);
}
