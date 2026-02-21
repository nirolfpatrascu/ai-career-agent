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
  atsScore?: ATSScoreResult;
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
  dataSource?: SalaryDataSource;
}

export interface MarketSalary {
  low: number;
  mid: number;
  high: number;
  currency: string;
  region: string;
  source?: SalaryDataSource;
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

// --- Salary Data Source Types ---

export type SalaryDataSource = 'government_bls' | 'government_ons' | 'government_eurostat' | 'survey_stackoverflow' | 'market' | 'estimate';

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

// --- ATS Scoring Types ---

export interface ATSScoreResult {
  overallScore: number; // 0-100
  keywordScore: number; // 0-100 (weighted: required keywords count more)
  formatScore: number; // 0-100
  keywords: ATSKeywordAnalysis;
  formatIssues: ATSFormatIssue[];
  recommendations: ATSRecommendation[];
  companyATS?: CompanyATSInfo;
}

export interface ATSKeywordAnalysis {
  matched: ATSKeyword[];
  semanticMatch: ATSKeyword[]; // e.g., "React" ≈ "React.js"
  missing: ATSKeyword[];
  total: {
    required: number;
    matched: number;
    missing: number;
  };
}

export interface ATSKeyword {
  keyword: string;
  category: 'required' | 'preferred' | 'nice-to-have';
  matchedAs?: string; // what it matched in CV (for semantic matches)
  cvSection?: string; // where found / where to add
  importance: 'high' | 'medium' | 'low';
}

export interface ATSFormatIssue {
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  fix: string;
}

export interface ATSRecommendation {
  action: string;
  section: string; // Which CV section to modify
  priority: 'critical' | 'high' | 'medium';
  keywords: string[]; // Which keywords this addresses
  example?: string; // Example of what to add/change
}

export interface CompanyATSInfo {
  company: string;
  atsSystem: string; // "Workday" | "Greenhouse" | "Lever" | "Taleo" | "iCIMS" | "SmartRecruiters" | "Unknown"
  tips: string[];
}

// --- ATS Score API Request/Response ---

export interface ATSScoreRequest {
  cvText: string;
  jobPosting: string;
  extractedSkills?: string[];
  companyName?: string;
  jobUrl?: string;
}

// --- Validation Types ---

export interface ValidationIssue {
  section: string;           // 'fitScore' | 'strengths' | 'gaps' | 'actionPlan' | 'salaryAnalysis' | 'roleRecommendations' | 'jobMatch'
  severity: 'error' | 'warning' | 'info';
  field: string;             // specific field path, e.g., 'fitScore.score', 'gaps[0].severity'
  message: string;           // human-readable issue description
  autoFixable: boolean;      // can the system fix this automatically?
  autoFixAction?: string;    // description of what auto-fix would do
}

export interface ValidationReport {
  isValid: boolean;          // true if no errors (warnings OK)
  issues: ValidationIssue[];
  autoFixed: number;         // count of issues auto-fixed
  sections: Record<string, { valid: boolean; issueCount: number }>;
}

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

// --- Job Tracker Types ---

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  roleTitle: string;
  jobUrl?: string;
  jobPostingText?: string;
  location?: string;
  workType: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: JobStatus;
  statusUpdatedAt: string;
  appliedAt?: string;
  followUpAt?: string;
  analysisId?: string;
  matchScore?: number;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationInput {
  company: string;
  roleTitle: string;
  jobUrl?: string;
  jobPostingText?: string;
  location?: string;
  workType?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status?: JobStatus;
  appliedAt?: string;
  followUpAt?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
}

export interface JobTrackerStats {
  total: number;
  byStatus: Record<JobStatus, number>;
  avgMatchScore: number | null;
  followUpsDue: number;
  appliedThisWeek: number;
  appliedThisMonth: number;
}

export interface KanbanColumn {
  id: JobStatus;
  label: string;
  color: string;
  icon: string;
}