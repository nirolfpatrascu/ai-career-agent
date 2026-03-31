// ============================================================================
// GapZero — Type Definitions
// All interfaces match the PRD data schemas and SAMPLE_ANALYSIS.json structure
// ============================================================================

import type { GitHubAnalysis } from '@/lib/prompts/github-analysis';
import type { CoverLetter } from '@/lib/prompts/cover-letter';

// Re-export for consumers
export type { GitHubAnalysis, CoverLetter };

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
  githubUrl?: string;         // GitHub profile URL for repo/language analysis
  additionalContext?: string; // User-provided context about career gaps, freelance work, etc.
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
  profile?: ExtractedProfile;
  githubAnalysis?: GitHubAnalysis;
  coverLetter?: CoverLetter;
  interviewPrep?: InterviewPrep;
}

export interface AnalysisMetadata {
  analyzedAt: string;
  cvFileName: string;
  targetRole: string;
  country: string;
  /** Original job posting text (for CV re-scoring) */
  jobPosting?: string;
  /** GitHub profile URL for repo analysis */
  githubUrl?: string;
  /** Warning message if PDF text extraction quality was suboptimal */
  pdfQualityWarning?: string;
  /** Tracks which data came from Claude vs fallback */
  dataSources?: Record<string, 'claude' | 'fallback'>;
  /** Whether a real CV was uploaded (false = LinkedIn PDF only) */
  hasRealCV?: boolean;
  /** Pipeline coherence warnings (e.g., fitScore vs matchScore divergence) */
  warnings?: string[];
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
  resourceUrl?: string;
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

export interface MissingSkill {
  skill: string;
  /**
   * "important": core requirement, must-have
   * "not_a_deal_breaker": preferred, learnable on the job
   * "quick_win": learnable in 1 week (tool/platform/syntax gap, not structural)
   * "unimportant": tangential mention, easily substituted
   */
  importance: 'important' | 'not_a_deal_breaker' | 'quick_win' | 'unimportant';
}

export interface JobMatch {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: MissingSkill[];
  cvSuggestions: CVSuggestion[];
  overallAdvice: string;
  /** 1-2 bullets: what this candidate brings that most applicants won't */
  competitiveAdvantage?: string[];
}

export interface CVSuggestion {
  section: string;
  current: string;
  suggested: string;
  reasoning: string;
}

// --- Interview Prep Types ---

export interface InterviewPrep {
  difficultyRating: 'easy' | 'moderate' | 'competitive' | 'highly_competitive';
  difficultyRationale: string;
  focusAreas: string[];
  estimatedPrepHours: number;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  situationalQuestions: SituationalQuestion[];
  cultureQuestions: CultureQuestion[];
  technicalReview: TechnicalReviewItem[];
  softSkills: SoftSkillPrep[];
  questionsToAsk: QuestionToAsk[];
  mentalReadinessTip: string;
  testGorillaTests: string[];
}

export interface TechnicalQuestion {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  likelihood: 'very_likely' | 'possible';
  testing: string;
  approach: string;
  yourEdge?: string;
}

export interface BehavioralQuestion {
  question: string;
  competency: string;
  starHints: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface SituationalQuestion {
  question: string;
  framework: string;
}

export interface CultureQuestion {
  question: string;
  suggestedAngle: string;
}

export interface TechnicalReviewItem {
  topic: string;
  cluster: string;
  whyItMatters: string;
  whatToReview: string;
  estimatedTime: '30min' | '1-2h' | 'half-day';
  searchTerm: string;
}

export interface SoftSkillPrep {
  skill: string;
  inContext: string;
  howToSignal: string[];
  redFlag: string;
}

export interface QuestionToAsk {
  question: string;
  category: 'role' | 'team' | 'company' | 'growth' | 'strategic';
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

// --- Career Profile Types (persistent user data) ---

export interface CareerProfile {
  userId: string;
  currentRole: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  country: string | null;
  workPreference: 'remote' | 'hybrid' | 'onsite' | 'flexible' | null;
  githubUrl: string | null;
  cvStoragePath: string | null;
  linkedinStoragePath: string | null;
  cvFilename: string | null;
  linkedinFilename: string | null;
  extractedProfile: ExtractedProfile | null;
  additionalContext: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareerProfileInput {
  currentRole?: string;
  targetRole?: string;
  yearsExperience?: number;
  country?: string;
  workPreference?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  githubUrl?: string;
  cvFilename?: string;
  linkedinFilename?: string;
  extractedProfile?: ExtractedProfile;
  additionalContext?: string;
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
  autoFixDescriptions: string[];  // human-readable descriptions of each auto-fix applied
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

export type JobSource = 'manual' | 'upwork' | 'linkedin';

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
  source: JobSource;
  metadata?: Record<string, unknown>;
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
  source?: JobSource;
  metadata?: Record<string, unknown>;
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

// --- Quota & Subscription Types ---

export type QuotaType = 'analysis' | 'cv_generation' | 'cover_letter' | 'coach_request';

export type PlanType = 'free' | 'pro';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface QuotaCheck {
  allowed: boolean;
  used: number;
  limit: number;
  plan: PlanType;
  isInitialAnalysis?: boolean;
  resetAt: string; // next Monday 00:00 UTC ISO string
}

export interface UserQuotaStatus {
  plan: PlanType;
  weekStart: string;
  resetAt: string;
  analysis: { used: number; limit: number };
  cvGeneration: { used: number; limit: number };
  coverLetter: { used: number; limit: number };
  coachRequest: { used: number; limit: number };
  hasUsedInitialAnalysis: boolean;
  subscription: {
    status: SubscriptionStatus | null;
    periodEnd: string | null;
  } | null;
}

export interface UserQuotaRow {
  user_id: string;
  plan: PlanType;
  week_start: string;
  analyses_used: number;
  cv_generations_used: number;
  cover_letters_used: number;
  coach_requests_used: number;
  analyses_limit: number;
  cv_limit: number;
  cover_letter_limit: number;
  coach_limit: number;
  has_used_initial_analysis: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus | null;
  subscription_period_end: string | null;
}

// --- Output Tag Types ---

export type OutputTagType = 'accurate' | 'inaccurate' | 'irrelevant' | 'missing_context' | 'too_generic';

export interface OutputTag {
  id: string;
  userId: string;
  analysisId: string;
  section: string;
  elementIndex: number | null;
  elementKey: string | null;
  taggedText: string | null;
  tag: OutputTagType;
  comment: string | null;
  createdAt: string;
}

export interface OutputTagInput {
  analysisId: string;
  section: string;
  elementIndex?: number;
  elementKey?: string;
  taggedText?: string;
  tag: OutputTagType;
  comment?: string;
}

// --- Upwork Types ---

export interface UpworkProfile {
  name: string;
  title: string;
  overview: string;
  hourlyRate?: number;
  currency?: string;
  totalEarnings?: number;
  totalJobs?: number;
  totalHours?: number;
  jobSuccessScore?: number;
  profileUrl?: string;
  location?: string;
  memberSince?: string;
  skills: string[];
  categories: string[];
  employmentHistory: UpworkEmployment[];
  education: UpworkEducation[];
  certifications: string[];
  portfolio: UpworkPortfolioItem[];
  workHistory: UpworkJobHistory[];
  languages: Array<{ language: string; proficiency: string }>;
  availability?: string;
  responseTime?: string;
}

export interface UpworkEmployment {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface UpworkEducation {
  degree: string;
  institution: string;
  year?: string;
}

export interface UpworkPortfolioItem {
  title: string;
  description: string;
  url?: string;
}

export interface UpworkJobHistory {
  title: string;
  client?: string;
  dateRange: string;
  earnings?: number;
  hours?: number;
  feedback?: string;
  rating?: number;
  skills: string[];
  description: string;
}

export interface UpworkJobPosting {
  title: string;
  description: string;
  clientInfo: {
    country?: string;
    paymentVerified?: boolean;
    totalSpent?: string;
    hireRate?: string;
    totalJobs?: number;
    avgHourlyRate?: string;
    companySize?: string;
    memberSince?: string;
    rating?: number;
  };
  budget: {
    type: 'hourly' | 'fixed';
    min?: number;
    max?: number;
    currency?: string;
  };
  skills: string[];
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  projectLength?: string;
  weeklyHours?: string;
  screeningQuestions: UpworkScreeningQuestion[];
  proposals?: number;
  connects?: number;
  postedDate?: string;
  category?: string;
  subcategory?: string;
}

export interface UpworkScreeningQuestion {
  question: string;
  type: 'text' | 'yesno' | 'choice' | 'attachment';
  required: boolean;
  order: number;
  options?: string[];
  maxLength?: number;
}

export interface UpworkCoverLetter {
  openingHook: string;
  screeningAnswers: UpworkScreeningAnswer[];
  body: string;
  closingCta: string;
  suggestedRate: {
    amount: number;
    type: 'hourly' | 'fixed';
    currency: string;
    reasoning: string;
  };
  profileOptimization: string[];
}

export interface UpworkScreeningAnswer {
  question: string;
  answer: string;
  order: number;
  strategy: string;
}

export interface UpworkProfileAnalysis {
  overallScore: number;
  profileStrengths: Array<{
    area: string;
    description: string;
    impact: string;
  }>;
  profileWeaknesses: Array<{
    area: string;
    description: string;
    fix: string;
    priority: 'critical' | 'high' | 'medium';
  }>;
  titleOptimization: {
    current: string;
    suggested: string;
    reasoning: string;
  };
  overviewRewrite: {
    current: string;
    suggested: string;
    reasoning: string;
  };
  rateAdvice: {
    currentRate?: number;
    suggestedRange: { min: number; max: number };
    reasoning: string;
    positioningStrategy: string;
  };
  skillsAdvice: {
    keep: string[];
    add: string[];
    remove: string[];
    reorder: string[];
  };
  nichingStrategy: string;
  proposalTips: string[];
  competitivePosition: string;
}