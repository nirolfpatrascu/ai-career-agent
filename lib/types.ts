// ============================================================================
// GapZero — Type Definitions
// All interfaces match the PRD data schemas and SAMPLE_ANALYSIS.json structure
// ============================================================================

// --- Input Types ---

export interface CareerQuestionnaire {
  currentRole: string;
  targetRole: string;
  targetRole2?: string;       // Optional alternative target role
  targetRole3?: string;       // Optional alternative target role
  yearsExperience: number;
  country: string;
  workPreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  currentSalary?: number;
  targetSalary?: number;
  jobPosting?: string;        // Legacy single posting (backward compat)
  jobPostingUrl?: string;     // URL of a job posting (fetched server-side)
  jobPostings?: JobPostingInput[];  // Multiple postings for richer context
  language?: string;          // 'en' | 'ro' | 'de' — for localized AI responses
  linkedInProfile?: string;   // Raw LinkedIn profile text for supplementary data
}

export interface JobPostingInput {
  text: string;               // Full job posting text
  url?: string;               // Source URL if fetched
  title?: string;             // Extracted job title
}

// --- Output Types ---

export interface AnalysisResult {
  metadata: AnalysisMetadata;
  fitScore: FitScore;
  strengths: Strength[];
  gaps: Gap[];
  roleRecommendations: RoleRecommendation[];
  actionPlan: ActionPlan;
  salaryAnalysis: SalaryAnalysis;
  jobMatch?: JobMatch;
}

export interface AnalysisMetadata {
  analyzedAt: string;
  cvFileName: string;
  targetRole: string;
  country: string;
}

export interface FitScore {
  score: number;
  label: 'Strong Fit' | 'Moderate Fit' | 'Stretch' | 'Significant Gap';
  summary: string;
}

export interface Strength {
  title: string;
  description: string;
  relevance: string;
  tier: 'differentiator' | 'strong' | 'supporting';
}

export interface Gap {
  skill: string;
  severity: 'critical' | 'moderate' | 'minor';
  currentLevel: string;
  requiredLevel: string;
  impact: string;
  closingPlan: string;
  timeToClose: string;
  resources: string[];
}

export interface RoleRecommendation {
  title: string;
  fitScore: number;
  salaryRange: SalaryRange;
  reasoning: string;
  exampleCompanies: string[];
  timeToReady: string;
}

export interface SalaryRange {
  low: number;
  mid: number;
  high: number;
  currency: string;
}

export interface ActionPlan {
  thirtyDays: ActionItem[];
  ninetyDays: ActionItem[];
  twelveMonths: ActionItem[];
}

export interface ActionItem {
  action: string;
  priority: 'critical' | 'high' | 'medium';
  timeEstimate: string;
  resource: string;
  expectedImpact: string;
}

export interface SalaryAnalysis {
  currentRoleMarket: MarketSalary;
  targetRoleMarket: MarketSalary;
  growthPotential: string;
  bestMonetaryMove: string;
  negotiationTips: string[];
}

export interface MarketSalary {
  low: number;
  mid: number;
  high: number;
  currency: string;
  region: string;
}

export interface JobMatch {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  cvSuggestions: CVSuggestion[];
  overallAdvice: string;
}

export interface CVSuggestion {
  section: string;
  current: string;
  suggested: string;
  reasoning: string;
}

// --- Intermediate Types (used between Claude calls) ---

export interface ExtractedProfile {
  name: string;
  currentRole: string;
  totalYearsExperience: number;
  skills: SkillCategory[];
  certifications: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  languages: LanguageItem[];
  summary: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiencyLevel: 'expert' | 'advanced' | 'intermediate' | 'beginner';
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  field: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  highlights: string[];
  technologies: string[];
}

export interface LanguageItem {
  language: string;
  level: string;
}

// --- API Request/Response Types ---

export interface AnalyzeRequest {
  cv: File;
  questionnaire: CareerQuestionnaire;
}

export interface MatchJobRequest {
  cvText: string;
  skills: string[];
  jobPosting: string;
}

export interface RewriteCVRequest {
  cvText: string;
  targetRole: string;
  gaps: Gap[];
  jobPosting?: string;
}

export interface RewriteCVResponse {
  suggestions: CVSuggestion[];
  rewrittenSummary: string;
}

// --- Error Types ---

export interface APIError {
  error: string;
  message: string;
  status: number;
}

// --- Utility Types ---

export type SeverityColor = {
  critical: string;
  moderate: string;
  minor: string;
};

export type TierColor = {
  differentiator: string;
  strong: string;
  supporting: string;
};

// --- CV Generator types ---

export interface GeneratedCV {
  professionalSummary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experienceBullets: {
    role: string;
    company: string;
    bullets: string[];
  }[];
  certifications: string[];
  projectHighlights: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  coverLetterDraft: string;
}