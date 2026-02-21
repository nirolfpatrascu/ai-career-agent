// ============================================================================
// Salary Lookup — Priority cascade across multiple data sources
//
// Priority:
// 1. BLS (US) → source: 'government_bls'
// 2. ONS (UK) → source: 'government_ons'
// 3. Stack Overflow Survey (tech roles, any country in dataset) → source: 'survey_stackoverflow'
// 4. Eurostat (EU countries, ISCO group + sector adjustment) → source: 'government_eurostat'
// 5. Curated salary-data.ts fallback → source: 'market'
// 6. null → caller falls back to Claude estimate → source: 'estimate'
// ============================================================================

import type { SalaryDataSource } from './types';
import { SALARY_DATA, REMOTE_EU_RATES, type SalaryBand } from './knowledge/salary-data';
import { getRoleSOC } from './knowledge/soc-mapping';
import { getRoleUKSOC } from './knowledge/uk-soc-mapping';
import { ROLE_TO_ISCO } from './knowledge/isco-mapping';
import blsData from './knowledge/bls-salary-data.json';
import onsData from './knowledge/uk-ons-salary-data.json';
import soData from './knowledge/stackoverflow-salary-data.json';

// Eurostat loaded via static import
import eurostatRaw from './knowledge/eurostat-salary-data.json';
const eurostatData: EurostatFile | null = eurostatRaw as unknown as EurostatFile;

// --- Type definitions for JSON data ---

interface BLSOccupation {
  socTitle: string;
  employment: number;
  annual: { p10: number; p25: number; median: number; mean: number; p75: number; p90: number };
}

interface BLSFile {
  occupations: Record<string, BLSOccupation>;
  currency: string;
}

interface ONSOccupation {
  socTitle: string;
  annual: { p10: number; p25: number; median: number; p75: number; p90: number };
}

interface ONSFile {
  occupations: Record<string, ONSOccupation>;
  currency: string;
}

interface SORole {
  globalMedian: number;
  byCountry: Record<string, { median: number; p25: number; p75: number }>;
}

interface SOFile {
  roles: Record<string, SORole>;
}

interface EurostatISCOGroup {
  title: string;
  meanAnnualGross: number;
  medianAnnualGross: number;
  p25: number;
  p75: number;
  sectorAdjustment_J: number;
  mappedRoles: string[];
}

interface EurostatCountry {
  note?: string;
  [iscoCode: string]: EurostatISCOGroup | string | undefined;
}

interface EurostatFile {
  countries: Record<string, EurostatCountry>;
}

// --- Export types ---

export interface SalaryLookupResult {
  low: number;      // p25
  mid: number;      // median
  high: number;     // p75
  currency: string;
  source: SalaryDataSource;
  sourceLabel: string;
  employment?: number;  // BLS only
}

// --- Role/Country normalization (kept from original) ---

const ROLE_ALIASES: Record<string, string> = {
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
  'data eng': 'Data Engineer',
  'data engineering': 'Data Engineer',
  'data science': 'Data Scientist',
  'data analyst': 'Data Analyst',
  'bi analyst': 'BI Analyst',
  'business intelligence': 'BI Analyst',
  'chief data officer': 'Chief Data Officer',
  'cdo': 'Chief Data Officer',
  'devops': 'DevOps Engineer',
  'dev ops': 'DevOps Engineer',
  'devops eng': 'DevOps Engineer',
  'devops/cloud': 'DevOps Engineer',
  'cloud engineer': 'Cloud Engineer',
  'cloud eng': 'Cloud Engineer',
  'cloud architect': 'Cloud Architect',
  'cloud solutions architect': 'Cloud Architect',
  'aws architect': 'Cloud Architect',
  'azure architect': 'Cloud Architect',
  'gcp architect': 'Cloud Architect',
  'sre': 'Site Reliability Engineer',
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
  'engineering manager': 'Engineering Manager',
  'eng manager': 'Engineering Manager',
  'em': 'Engineering Manager',
  'tech lead': 'Technical Lead',
  'team lead': 'Technical Lead',
  'lead engineer': 'Technical Lead',
  'lead developer': 'Technical Lead',
  'vp eng': 'VP of Engineering',
  'vp of engineering': 'VP of Engineering',
  'vice president engineering': 'VP of Engineering',
  'cto': 'CTO',
  'chief technology officer': 'CTO',
  'chief technical officer': 'CTO',
  'pm': 'Product Manager',
  'product owner': 'Product Manager',
  'po': 'Product Manager',
  'it pm': 'IT Project Manager',
  'it project manager': 'IT Project Manager',
  'project manager': 'Project Manager',
  'scrum master': 'Scrum Master',
  'agile coach': 'Scrum Master',
  'solutions architect': 'Solutions Architect',
  'sa': 'Solutions Architect',
  'solution architect': 'Solutions Architect',
  'ux': 'UX Designer',
  'ux/ui': 'UX Designer',
  'ui/ux': 'UX Designer',
  'ux designer': 'UX Designer',
  'ui designer': 'UX Designer',
  'product designer': 'UX Designer',
  'qa': 'QA Engineer',
  'qa engineer': 'QA Engineer',
  'test engineer': 'QA Engineer',
  'tester': 'QA Engineer',
  'sdet': 'QA Engineer',
  'quality assurance': 'QA Engineer',
  'automation tester': 'QA Engineer',
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
  'sales engineer': 'Sales Engineer',
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
  'rpa': 'RPA Developer',
  'rpa developer': 'RPA Developer',
  'rpa engineer': 'RPA Developer',
  'uipath developer': 'RPA Developer',
  'automation consultant': 'Automation Engineer',
  'automation engineer': 'Automation Engineer',
  'technical enablement': 'Technical Enablement Engineer',
};

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
  'be': 'Belgium',
  'fi': 'Finland',
  'lu': 'Luxembourg',
  'gr': 'Greece',
  'hu': 'Hungary',
  'hr': 'Croatia',
  'bg': 'Bulgaria',
};

// Eurostat country name normalization (some Eurostat keys differ)
const EUROSTAT_COUNTRY_MAP: Record<string, string> = {
  'United States': '',  // Not in Eurostat
  'United Kingdom': '', // Not in Eurostat (post-Brexit)
  'Germany': 'Germany',
  'France': 'France',
  'Netherlands': 'Netherlands',
  'Belgium': 'Belgium',
  'Austria': 'Austria',
  'Ireland': 'Ireland',
  'Luxembourg': 'Luxembourg',
  'Sweden': 'Sweden',
  'Denmark': 'Denmark',
  'Finland': 'Finland',
  'Spain': 'Spain',
  'Italy': 'Italy',
  'Portugal': 'Portugal',
  'Greece': 'Greece',
  'Romania': 'Romania',
  'Poland': 'Poland',
  'Czechia': 'Czechia',
  'Hungary': 'Hungary',
  'Croatia': 'Croatia',
  'Bulgaria': 'Bulgaria',
  'Switzerland': 'Switzerland',
};

function normalizeRole(input: string): string {
  const lower = input.trim().toLowerCase();
  if (ROLE_ALIASES[lower]) return ROLE_ALIASES[lower];
  const withoutSuffix = lower.replace(/\s+(engineer|developer|dev|eng)\s*$/i, '').trim();
  if (ROLE_ALIASES[withoutSuffix]) return ROLE_ALIASES[withoutSuffix];
  return input.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeCountry(input: string): string {
  const lower = input.trim().toLowerCase();
  if (COUNTRY_ALIASES[lower]) return COUNTRY_ALIASES[lower];
  return input.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Lookup functions for each source ---

function lookupBLS(roleTitle: string): SalaryLookupResult | null {
  const soc = getRoleSOC(roleTitle);
  if (!soc) return null;

  const occ = (blsData as unknown as BLSFile).occupations[soc];
  if (!occ) return null;

  return {
    low: occ.annual.p25,
    mid: occ.annual.median,
    high: occ.annual.p75,
    currency: 'USD',
    source: 'government_bls',
    sourceLabel: 'US Bureau of Labor Statistics OEWS (2024)',
    employment: occ.employment,
  };
}

function lookupONS(roleTitle: string): SalaryLookupResult | null {
  const ukSoc = getRoleUKSOC(roleTitle);
  if (!ukSoc) return null;

  const occ = (onsData as unknown as ONSFile).occupations[ukSoc];
  if (!occ) return null;

  return {
    low: occ.annual.p25,
    mid: occ.annual.median,
    high: occ.annual.p75,
    currency: 'GBP',
    source: 'government_ons',
    sourceLabel: 'UK ONS ASHE (2024)',
  };
}

function lookupStackOverflow(roleTitle: string, country: string): SalaryLookupResult | null {
  const soFile = soData as unknown as SOFile;

  // Try exact role name first
  let roleData = soFile.roles[roleTitle];

  // Try common aliases for SO role names
  if (!roleData) {
    const soAliases: Record<string, string> = {
      'AI Engineer': 'AI/ML Engineer',
      'Machine Learning Engineer': 'AI/ML Engineer',
      'Site Reliability Engineer': 'SRE / Platform Engineer',
      'Platform Engineer': 'SRE / Platform Engineer',
      'SRE': 'SRE / Platform Engineer',
      'Embedded Systems Engineer': 'Embedded Developer',
    };
    const alias = soAliases[roleTitle];
    if (alias) roleData = soFile.roles[alias];
  }

  // Try case-insensitive match
  if (!roleData) {
    const lowerRole = roleTitle.toLowerCase();
    for (const [key, data] of Object.entries(soFile.roles)) {
      if (key.toLowerCase() === lowerRole) {
        roleData = data;
        break;
      }
    }
  }

  if (!roleData) return null;

  const countryData = roleData.byCountry[country];
  if (!countryData) return null;

  return {
    low: countryData.p25,
    mid: countryData.median,
    high: countryData.p75,
    currency: 'EUR',
    source: 'survey_stackoverflow',
    sourceLabel: 'Stack Overflow Developer Survey (2024)',
  };
}

function lookupEurostat(roleTitle: string, country: string): SalaryLookupResult | null {
  if (!eurostatData) return null;

  const euroCountry = EUROSTAT_COUNTRY_MAP[country];
  if (!euroCountry) return null;

  const countryData = eurostatData.countries[euroCountry];
  if (!countryData) return null;

  // Find ISCO code for this role
  const iscoInfo = ROLE_TO_ISCO[roleTitle];
  if (!iscoInfo) return null;

  // Eurostat keys may be "25" or "ISCO_25" depending on the data file format
  const iscoGroup = (countryData[iscoInfo.isco] || countryData[`ISCO_${iscoInfo.isco}`]) as EurostatISCOGroup | undefined;
  if (!iscoGroup || typeof iscoGroup === 'string') return null;

  let median = iscoGroup.medianAnnualGross;
  let p25 = iscoGroup.p25;
  let p75 = iscoGroup.p75;

  // Apply sector adjustment for tech roles
  if (iscoInfo.isTech) {
    median = Math.round(median * iscoGroup.sectorAdjustment_J);
    p25 = Math.round(p25 * iscoGroup.sectorAdjustment_J);
    p75 = Math.round(p75 * iscoGroup.sectorAdjustment_J);
  }

  return {
    low: p25,
    mid: median,
    high: p75,
    currency: 'EUR',
    source: 'government_eurostat',
    sourceLabel: 'Eurostat Structure of Earnings Survey (2022)',
  };
}

function lookupCurated(roleTitle: string, country: string, experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead'): SalaryLookupResult | null {
  const countryData = SALARY_DATA[country];
  if (!countryData) return null;

  // Find role in curated data
  const roleLower = roleTitle.toLowerCase();
  const band = countryData.roles.find(
    (r) =>
      r.role === roleTitle ||
      r.role.toLowerCase() === roleLower ||
      r.role.toLowerCase().includes(roleLower) ||
      roleLower.includes(r.role.toLowerCase())
  );
  if (!band) return null;

  // Select the right experience level band
  const level = experienceLevel || 'mid';
  const levelData = band[level];

  return {
    low: levelData.low,
    mid: levelData.mid,
    high: levelData.high,
    currency: band.currency,
    source: 'market',
    sourceLabel: 'Curated market data (2024-2025)',
  };
}

// --- Main export ---

/**
 * Look up salary data for a role in a specific country.
 * Uses a priority cascade: BLS → ONS → StackOverflow → Eurostat → Curated → null.
 */
export function lookupSalary(
  roleTitle: string,
  country: string,
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead'
): SalaryLookupResult | null {
  const normalizedRole = normalizeRole(roleTitle);
  const normalizedCountry = normalizeCountry(country);

  // 1. BLS (US only)
  if (normalizedCountry === 'United States') {
    const bls = lookupBLS(normalizedRole);
    if (bls) return bls;
  }

  // 2. ONS (UK only)
  if (normalizedCountry === 'United Kingdom') {
    const ons = lookupONS(normalizedRole);
    if (ons) return ons;
  }

  // 3. Stack Overflow (any country in dataset)
  const so = lookupStackOverflow(normalizedRole, normalizedCountry);
  if (so) return so;

  // 4. Eurostat (EU countries + Switzerland)
  const eurostat = lookupEurostat(normalizedRole, normalizedCountry);
  if (eurostat) return eurostat;

  // 5. Curated fallback
  const curated = lookupCurated(normalizedRole, normalizedCountry, experienceLevel);
  if (curated) return curated;

  // 6. No data found
  return null;
}

/**
 * Look up remote market salary for a role.
 * Returns Remote EU rates from curated data.
 */
export function lookupRemoteSalary(roleTitle: string): SalaryLookupResult | null {
  const normalizedRole = normalizeRole(roleTitle);
  const roleLower = normalizedRole.toLowerCase();

  const band = REMOTE_EU_RATES.find(
    (r) =>
      r.role === normalizedRole ||
      r.role.toLowerCase() === roleLower ||
      r.role.toLowerCase().includes(roleLower) ||
      roleLower.includes(r.role.toLowerCase())
  );
  if (!band) return null;

  return {
    low: band.mid.low,
    mid: band.mid.mid,
    high: band.mid.high,
    currency: band.currency,
    source: 'market',
    sourceLabel: 'Curated remote EU market data (2024-2025)',
  };
}
