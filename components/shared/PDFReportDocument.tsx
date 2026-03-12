'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from '@react-pdf/renderer';
import type { AnalysisResult, Gap, ActionItem, Strength, RoleRecommendation, MissingSkill, ATSKeyword, ATSFormatIssue, ATSRecommendation } from '@/lib/types';
import type { GitHubAnalysis } from '@/lib/prompts/github-analysis';
import type { CoverLetter } from '@/lib/prompts/cover-letter';

// Register Poppins font — local TTF files with FULL Latin Extended charset
// Poppins is a clean, modern Google Font that supports:
// Romanian: ș (U+0219), ț (U+021B), ă (U+0103), â (U+00E2), î (U+00EE)
// German: ä (U+00E4), ö (U+00F6), ü (U+00FC), ß (U+00DF)
// Plus € (U+20AC) and all Latin Extended characters
Font.register({
  family: 'Poppins',
  fonts: [
    { src: '/fonts/Poppins-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Poppins-Medium.ttf', fontWeight: 600 },
    { src: '/fonts/Poppins-Bold.ttf', fontWeight: 700 },
  ],
});

// Disable hyphenation to avoid font encoding issues
Font.registerHyphenationCallback((word) => [word]);

/**
 * Sanitize text for @react-pdf/renderer.
 * Poppins TTF supports most Latin Extended + € natively.
 * We only need to replace chars outside Poppins' glyph set (arrows, bullets, etc.)
 */
function clean(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019\u201A]/g, "'")   // smart single quotes
    .replace(/[\u201C\u201D\u201E]/g, '"')    // smart double quotes
    .replace(/[\u2013\u2014]/g, '-')          // en/em dashes
    .replace(/\u2026/g, '...')                // ellipsis
    .replace(/\u00A3/g, 'GBP ')               // pound sign (not in Poppins)
    .replace(/\u00A5/g, 'JPY ')               // yen sign (not in Poppins)
    .replace(/\u2192/g, '->')                  // right arrow
    .replace(/\u2190/g, '<-')                  // left arrow
    .replace(/\u2191/g, '^')                   // up arrow
    .replace(/\u2193/g, 'v')                   // down arrow
    .replace(/\u2022/g, '-')                   // bullet
    .replace(/\u00B7/g, '-')                   // middle dot
    // Preserve Latin Extended + Euro (all supported by Poppins TTF)
    // Only strip characters outside these safe ranges
    .replace(/[^\x00-\x7F\u00C0-\u024F\u1E00-\u1EFF\u20AC]/g, '');
}

const colors = {
  bg: '#FFFBF5',
  card: '#FFFFFF',
  border: '#E8DDD2',
  primary: '#E8890A',
  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',
  textPrimary: '#1C1410',
  textSecondary: '#6B5D52',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    padding: 40,
    fontFamily: 'Poppins',
    color: colors.textPrimary,
    fontSize: 10,
  },
  // Header
  header: {
    marginBottom: 30,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  logoAccent: {
    color: colors.primary,
  },
  headerMeta: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 4,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: `1px solid ${colors.border}`,
  },
  // Fit Score
  fitScoreContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    border: `1px solid ${colors.border}`,
  },
  fitScoreNumber: {
    fontSize: 36,
    fontWeight: 700,
    color: colors.primary,
  },
  fitScoreLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.textPrimary,
    marginTop: 4,
  },
  fitScoreSummary: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: 450,
  },
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    border: `1px solid ${colors.border}`,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  // Badges
  badge: {
    fontSize: 8,
    fontWeight: 600,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeCritical: {
    backgroundColor: '#EF444420',
    color: colors.danger,
  },
  badgeModerate: {
    backgroundColor: '#EAB30820',
    color: colors.warning,
  },
  badgeMinor: {
    backgroundColor: '#10B98120',
    color: colors.success,
  },
  badgeDifferentiator: {
    backgroundColor: '#E8890A20',
    color: colors.primary,
  },
  badgeStrong: {
    backgroundColor: '#10B98120',
    color: colors.success,
  },
  badgeSupporting: {
    backgroundColor: '#E8DDD2',
    color: colors.textSecondary,
  },
  // Row layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 8,
  },
  col: {
    flex: 1,
  },
  // Salary bars
  salaryCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 12,
    border: `1px solid ${colors.border}`,
    flex: 1,
  },
  salaryLabel: {
    fontSize: 8,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: 700,
  },
  salaryRange: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Action items
  actionItem: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
    border: `1px solid ${colors.border}`,
  },
  actionText: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  actionMeta: {
    fontSize: 8,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  impactText: {
    fontSize: 8,
    color: colors.success,
    marginTop: 3,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.textSecondary,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 10,
  },
  // Utilities
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mt8: { marginTop: 8 },
  textSmall: { fontSize: 8, color: colors.textSecondary },
  textPrimary: { color: colors.textPrimary },
  textSuccess: { color: colors.success },
  textDanger: { color: colors.danger },
  textWarning: { color: colors.warning },
  bold: { fontWeight: 600 },
});

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-US')}`;
}

function getSeverityBadge(severity: string) {
  const map: Record<string, typeof styles.badgeCritical> = {
    critical: styles.badgeCritical,
    moderate: styles.badgeModerate,
    minor: styles.badgeMinor,
  };
  return map[severity] || styles.badgeMinor;
}

function getTierBadge(tier: string) {
  const map: Record<string, typeof styles.badgeDifferentiator> = {
    differentiator: styles.badgeDifferentiator,
    strong: styles.badgeStrong,
    supporting: styles.badgeSupporting,
  };
  return map[tier] || styles.badgeSupporting;
}

// --- PDF Document ---

export interface PDFLabels {
  brandLine: string;
  strengths: string;
  gaps: string;
  roles: string;
  salaryAnalysis: string;
  actionPlan30: string;
  actionPlan90: string;
  actionPlan12m: string;
  negotiationTips: string;
  current: string;
  required: string;
  growthPotential: string;
  currentRoleMarket: string;
  targetRoleMarket: string;
  companies: string;
  salarySubtitle: string;
  generatedOn: string;
  fitScoreLabel: string;
  dateLocale?: string;
  // New sections
  jobMatch: string;
  matchScore: string;
  matchingSkills: string;
  missingSkills: string;
  overallAdvice: string;
  cvSuggestions: string;
  suggested: string;
  reasoning: string;
  atsScore: string;
  keywordScore: string;
  formatScore: string;
  formatIssues: string;
  recommendations: string;
  githubAnalysis: string;
  projectIdea: string;
  improvements: string;
  whyRelevant: string;
  estimatedTime: string;
  coverLetter: string;
  tone: string;
  weaknessAcknowledgments: string;
  strengthHighlights: string;
}

const DEFAULT_LABELS: PDFLabels = {
  brandLine: 'GapZero - AI-Powered Career Advisor',
  strengths: 'Your Strengths',
  gaps: 'Skill Gaps',
  roles: 'Recommended Roles',
  salaryAnalysis: 'Salary Analysis',
  actionPlan30: '30-Day Quick Wins',
  actionPlan90: '90-Day Skill Building',
  actionPlan12m: '12-Month Career Trajectory',
  negotiationTips: 'Negotiation Tips',
  current: 'Current',
  required: 'Required',
  growthPotential: 'Growth Potential',
  currentRoleMarket: 'Current Role Market',
  targetRoleMarket: 'Target Role Market',
  companies: 'Companies',
  salarySubtitle: 'All figures are gross annual (before tax)',
  generatedOn: 'Generated on',
  fitScoreLabel: 'Career Fit Score',
  dateLocale: 'en-US',
  // New sections
  jobMatch: 'Job Match Analysis',
  matchScore: 'Match Score',
  matchingSkills: 'Matching Skills',
  missingSkills: 'Missing Keywords',
  overallAdvice: 'Overall Advice',
  cvSuggestions: 'CV Suggestions',
  suggested: 'Suggested',
  reasoning: 'Reasoning',
  atsScore: 'ATS Score Analysis',
  keywordScore: 'Keyword Score',
  formatScore: 'Format Score',
  formatIssues: 'Format Issues',
  recommendations: 'Recommendations',
  githubAnalysis: 'GitHub Analysis',
  projectIdea: 'Recommended Project',
  improvements: 'Areas to Improve',
  whyRelevant: 'Why This Helps',
  estimatedTime: 'Estimated Time',
  coverLetter: 'Cover Letter',
  tone: 'Tone',
  weaknessAcknowledgments: 'Weakness Acknowledgments',
  strengthHighlights: 'Strength Highlights',
};

function CareerReport({ result, labels: l }: { result: AnalysisResult; labels?: PDFLabels }) {
  const labels = l || DEFAULT_LABELS;
  return (
    <Document>
      {/* PAGE 1: Overview + Strengths */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Gap<Text style={styles.logoAccent}>Zero</Text>
          </Text>
          <Text style={styles.headerMeta}>
            {clean(labels.fitScoreLabel)} - {clean(result.metadata.targetRole)} - {clean(result.metadata.country)}
          </Text>
          <Text style={styles.headerMeta}>
            {clean(labels.generatedOn)} {new Date(result.metadata.analyzedAt).toLocaleDateString(labels.dateLocale || 'en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })} - CV: {clean(result.metadata.cvFileName)}
          </Text>
        </View>

        {/* Fit Score */}
        <View style={styles.fitScoreContainer}>
          <Text style={styles.fitScoreNumber}>{result.fitScore.score}/10</Text>
          <Text style={styles.fitScoreLabel}>{clean(result.fitScore.label)}</Text>
          <Text style={styles.fitScoreSummary}>{clean(result.fitScore.summary)}</Text>
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.strengths)}</Text>
          {result.strengths.map((str: Strength, i: number) => (
            <View key={i} style={styles.card}>
              <View style={styles.row}>
                <Text style={[styles.badge, getTierBadge(str.tier)]}>{str.tier.toUpperCase()}</Text>
                <Text style={styles.cardTitle}>{clean(str.title)}</Text>
              </View>
              <Text style={styles.cardText}>{clean(str.description)}</Text>
              <Text style={[styles.cardText, { color: colors.primary, marginTop: 4 }]}>{clean(str.relevance)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>{clean(labels.brandLine)}</Text>
          <Text>Page 1</Text>
        </View>
      </Page>

      {/* PAGE 2: Skill Gaps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.gaps)}</Text>
          {result.gaps.map((g: Gap, i: number) => (
            <View key={i} style={styles.card}>
              <View style={styles.row}>
                <Text style={[styles.badge, getSeverityBadge(g.severity)]}>{g.severity.toUpperCase()}</Text>
                <Text style={styles.cardTitle}>{clean(g.skill)}</Text>
                <Text style={[styles.textSmall, { marginLeft: 'auto' }]}>{clean(g.timeToClose)}</Text>
              </View>
              <Text style={[styles.cardText, { color: colors.danger }]}>{clean(g.impact)}</Text>
              <View style={[styles.twoCol, styles.mt8]}>
                <View style={styles.col}>
                  <Text style={[styles.textSmall, styles.bold]}>{clean(labels.current)}</Text>
                  <Text style={styles.cardText}>{clean(g.currentLevel)}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={[styles.textSmall, styles.bold]}>{clean(labels.required)}</Text>
                  <Text style={styles.cardText}>{clean(g.requiredLevel)}</Text>
                </View>
              </View>
              <Text style={[styles.cardText, { color: colors.primary, marginTop: 6 }]}>{clean(g.closingPlan)}</Text>
              {g.resources.length > 0 && (
                <View style={styles.mt8}>
                  {g.resources.map((res: string, ri: number) => (
                    <Text key={ri} style={[styles.textSmall, styles.mb4]}>- {clean(res)}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>{clean(labels.brandLine)}</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* PAGE 3: Role Recommendations + Salary */}
      <Page size="A4" style={styles.page}>
        {/* Roles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.roles)}</Text>
          {[...result.roleRecommendations].sort((a, b) => b.fitScore - a.fitScore).map((role: RoleRecommendation, i: number) => (
            <View key={i} style={styles.card}>
              <View style={styles.row}>
                <Text style={[styles.badge, styles.badgeDifferentiator]}>{role.fitScore}/10</Text>
                <Text style={styles.cardTitle}>{clean(role.title)}</Text>
              </View>
              <Text style={styles.cardText}>{clean(role.reasoning)}</Text>
              <View style={[styles.row, styles.mt8]}>
                <Text style={[styles.textSmall, styles.textSuccess]}>
                  {formatCurrency(role.salaryRange.low, role.salaryRange.currency)} - {formatCurrency(role.salaryRange.high, role.salaryRange.currency)}
                </Text>
                <Text style={[styles.textSmall, { marginLeft: 12 }]}>{clean(role.timeToReady)}</Text>
              </View>
              <Text style={[styles.textSmall, styles.mt8]}>
                {clean(labels.companies)}: {role.exampleCompanies.map(c => clean(c)).join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Salary Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.salaryAnalysis)}</Text>
          <Text style={[styles.textSmall, styles.mb8]}>{clean(labels.salarySubtitle)}</Text>
          <View style={[styles.twoCol, styles.mb8]}>
            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>{clean(labels.currentRoleMarket)}</Text>
              <Text style={[styles.salaryValue, styles.textPrimary]}>
                {formatCurrency(result.salaryAnalysis.currentRoleMarket.mid, result.salaryAnalysis.currentRoleMarket.currency)}
              </Text>
              <Text style={styles.salaryRange}>
                {formatCurrency(result.salaryAnalysis.currentRoleMarket.low, result.salaryAnalysis.currentRoleMarket.currency)} - {formatCurrency(result.salaryAnalysis.currentRoleMarket.high, result.salaryAnalysis.currentRoleMarket.currency)}
              </Text>
              <Text style={[styles.textSmall, styles.mt8]}>{clean(result.salaryAnalysis.currentRoleMarket.region)}</Text>
            </View>
            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>{clean(labels.targetRoleMarket)}</Text>
              <Text style={[styles.salaryValue, styles.textSuccess]}>
                {formatCurrency(result.salaryAnalysis.targetRoleMarket.mid, result.salaryAnalysis.targetRoleMarket.currency)}
              </Text>
              <Text style={styles.salaryRange}>
                {formatCurrency(result.salaryAnalysis.targetRoleMarket.low, result.salaryAnalysis.targetRoleMarket.currency)} - {formatCurrency(result.salaryAnalysis.targetRoleMarket.high, result.salaryAnalysis.targetRoleMarket.currency)}
              </Text>
              <Text style={[styles.textSmall, styles.mt8]}>{clean(result.salaryAnalysis.targetRoleMarket.region)}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardText, styles.textSuccess, styles.bold]}>{clean(labels.growthPotential)}: {clean(result.salaryAnalysis.growthPotential)}</Text>
            <Text style={[styles.cardText, styles.mt8]}>{clean(result.salaryAnalysis.bestMonetaryMove)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{clean(labels.brandLine)}</Text>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* PAGE 4: Action Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.actionPlan30)}</Text>
          {result.actionPlan.thirtyDays.map((item: ActionItem, i: number) => (
            <View key={i} style={styles.actionItem}>
              <View style={styles.row}>
                <Text style={[styles.badge, getSeverityBadge(item.priority === 'high' ? 'moderate' : item.priority === 'medium' ? 'minor' : 'critical')]}>
                  {item.priority.toUpperCase()}
                </Text>
                <Text style={styles.textSmall}>{clean(item.timeEstimate)}</Text>
              </View>
              <Text style={styles.actionText}>{clean(item.action)}</Text>
              <Text style={styles.actionMeta}>{clean(item.resource)}</Text>
              <Text style={styles.impactText}>{clean(item.expectedImpact)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.actionPlan90)}</Text>
          {result.actionPlan.ninetyDays.map((item: ActionItem, i: number) => (
            <View key={i} style={styles.actionItem}>
              <View style={styles.row}>
                <Text style={[styles.badge, getSeverityBadge(item.priority === 'high' ? 'moderate' : item.priority === 'medium' ? 'minor' : 'critical')]}>
                  {item.priority.toUpperCase()}
                </Text>
                <Text style={styles.textSmall}>{clean(item.timeEstimate)}</Text>
              </View>
              <Text style={styles.actionText}>{clean(item.action)}</Text>
              <Text style={styles.actionMeta}>{clean(item.resource)}</Text>
              <Text style={styles.impactText}>{clean(item.expectedImpact)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>{clean(labels.brandLine)}</Text>
          <Text>Page 4</Text>
        </View>
      </Page>

      {/* PAGE 5: 12-Month + Negotiation Tips */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{clean(labels.actionPlan12m)}</Text>
          {result.actionPlan.twelveMonths.map((item: ActionItem, i: number) => (
            <View key={i} style={styles.actionItem}>
              <View style={styles.row}>
                <Text style={[styles.badge, getSeverityBadge(item.priority === 'high' ? 'moderate' : item.priority === 'medium' ? 'minor' : 'critical')]}>
                  {item.priority.toUpperCase()}
                </Text>
                <Text style={styles.textSmall}>{clean(item.timeEstimate)}</Text>
              </View>
              <Text style={styles.actionText}>{clean(item.action)}</Text>
              <Text style={styles.actionMeta}>{clean(item.resource)}</Text>
              <Text style={styles.impactText}>{clean(item.expectedImpact)}</Text>
            </View>
          ))}
        </View>

        {/* Negotiation tips */}
        {result.salaryAnalysis.negotiationTips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{clean(labels.negotiationTips)}</Text>
            {result.salaryAnalysis.negotiationTips.map((tip: string, i: number) => (
              <View key={i} style={[styles.card, styles.mb8]}>
                <Text style={styles.cardText}>
                  <Text style={[styles.bold, { color: colors.primary }]}>{i + 1}. </Text>
                  {clean(tip)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>{clean(labels.brandLine)}</Text>
          <Text>Page 5</Text>
        </View>
      </Page>

      {/* PAGE 6 (conditional): Job Match */}
      {result.jobMatch && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Gap<Text style={styles.logoAccent}>Zero</Text></Text>
            <Text style={styles.headerMeta}>{clean(labels.jobMatch)}</Text>
          </View>

          {/* Match score */}
          <View style={styles.fitScoreContainer}>
            <Text style={styles.fitScoreNumber}>{result.jobMatch.matchScore}%</Text>
            <Text style={styles.fitScoreLabel}>{clean(labels.matchScore)}</Text>
          </View>

          {/* Matching skills */}
          {result.jobMatch.matchingSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.matchingSkills)}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {result.jobMatch.matchingSkills.map((skill: string, i: number) => (
                  <Text key={i} style={[styles.badge, styles.badgeStrong]}>{clean(skill)}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Missing skills */}
          {result.jobMatch.missingSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.missingSkills)}</Text>
              {result.jobMatch.missingSkills.map((ms: MissingSkill, i: number) => (
                <View key={i} style={[styles.row, styles.mb4]}>
                  <Text style={[styles.badge, ms.importance === 'important' ? styles.badgeCritical : ms.importance === 'not_a_deal_breaker' ? styles.badgeModerate : styles.badgeMinor]}>
                    {ms.importance === 'important' ? 'REQUIRED' : ms.importance === 'not_a_deal_breaker' ? 'PREFERRED' : 'OPTIONAL'}
                  </Text>
                  <Text style={styles.cardText}>{clean(ms.skill)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* CV Suggestions */}
          {result.jobMatch.cvSuggestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.cvSuggestions)}</Text>
              {result.jobMatch.cvSuggestions.map((s, i) => (
                <View key={i} style={[styles.card, styles.mb8]}>
                  <Text style={[styles.textSmall, styles.bold, { color: colors.primary, marginBottom: 4 }]}>{clean(s.section)}</Text>
                  <Text style={[styles.textSmall, styles.bold]}>{clean(labels.current)}:</Text>
                  <Text style={[styles.cardText, { fontStyle: 'italic', marginBottom: 4 }]}>{clean(s.current)}</Text>
                  <Text style={[styles.textSmall, styles.bold]}>{clean(labels.suggested)}:</Text>
                  <Text style={[styles.cardText, { color: colors.success, marginBottom: 4 }]}>{clean(s.suggested)}</Text>
                  <Text style={[styles.textSmall, { color: colors.textSecondary }]}>{clean(s.reasoning)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overall advice */}
          {result.jobMatch.overallAdvice && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.overallAdvice)}</Text>
              <View style={styles.card}>
                <Text style={styles.cardText}>{clean(result.jobMatch.overallAdvice)}</Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text>{clean(labels.brandLine)}</Text>
            <Text>Job Match</Text>
          </View>
        </Page>
      )}

      {/* PAGE 7 (conditional): ATS Score */}
      {result.atsScore && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Gap<Text style={styles.logoAccent}>Zero</Text></Text>
            <Text style={styles.headerMeta}>{clean(labels.atsScore)}</Text>
          </View>

          {/* Score cards */}
          <View style={[styles.twoCol, styles.mb12]}>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={[styles.salaryValue, { color: colors.primary }]}>{result.atsScore.overallScore}</Text>
              <Text style={styles.salaryLabel}>Overall Score</Text>
            </View>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={[styles.salaryValue, { color: colors.success }]}>{result.atsScore.keywordScore}</Text>
              <Text style={styles.salaryLabel}>{clean(labels.keywordScore)}</Text>
            </View>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={[styles.salaryValue, { color: colors.textPrimary }]}>{result.atsScore.formatScore}</Text>
              <Text style={styles.salaryLabel}>{clean(labels.formatScore)}</Text>
            </View>
          </View>

          {/* Matched keywords */}
          {result.atsScore.keywords.matched.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.matchingSkills)}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {result.atsScore.keywords.matched.map((kw: ATSKeyword, i: number) => (
                  <Text key={i} style={[styles.badge, styles.badgeStrong]}>{clean(kw.keyword)}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Missing keywords */}
          {result.atsScore.keywords.missing.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.missingSkills)}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {result.atsScore.keywords.missing.map((kw: ATSKeyword, i: number) => (
                  <Text key={i} style={[styles.badge, kw.importance === 'high' ? styles.badgeCritical : kw.importance === 'medium' ? styles.badgeModerate : styles.badgeMinor]}>
                    {clean(kw.keyword)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Format issues */}
          {result.atsScore.formatIssues.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.formatIssues)}</Text>
              {result.atsScore.formatIssues.map((issue: ATSFormatIssue, i: number) => (
                <View key={i} style={[styles.card, styles.mb8]}>
                  <View style={styles.row}>
                    <Text style={[styles.badge, getSeverityBadge(issue.severity === 'critical' ? 'critical' : issue.severity === 'warning' ? 'moderate' : 'minor')]}>
                      {issue.severity.toUpperCase()}
                    </Text>
                    <Text style={styles.cardTitle}>{clean(issue.issue)}</Text>
                  </View>
                  <Text style={styles.cardText}>{clean(issue.description)}</Text>
                  <Text style={[styles.cardText, { color: colors.primary, marginTop: 4 }]}>{clean(issue.fix)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {result.atsScore.recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.recommendations)}</Text>
              {result.atsScore.recommendations.map((rec: ATSRecommendation, i: number) => (
                <View key={i} style={[styles.card, styles.mb8]}>
                  <View style={styles.row}>
                    <Text style={[styles.badge, getSeverityBadge(rec.priority === 'critical' ? 'critical' : rec.priority === 'high' ? 'moderate' : 'minor')]}>
                      {rec.priority.toUpperCase()}
                    </Text>
                    <Text style={styles.cardTitle}>{clean(rec.section)}</Text>
                  </View>
                  <Text style={styles.cardText}>{clean(rec.action)}</Text>
                  {rec.example && (
                    <Text style={[styles.cardText, { color: colors.primary, fontStyle: 'italic', marginTop: 4 }]}>{clean(rec.example)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Text>{clean(labels.brandLine)}</Text>
            <Text>ATS Score</Text>
          </View>
        </Page>
      )}

      {/* PAGE 8 (conditional): GitHub Analysis */}
      {result.githubAnalysis && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Gap<Text style={styles.logoAccent}>Zero</Text></Text>
            <Text style={styles.headerMeta}>{clean(labels.githubAnalysis)}</Text>
          </View>

          {/* Stats */}
          <View style={[styles.twoCol, styles.mb12]}>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={styles.salaryValue}>{result.githubAnalysis.stats.totalRepos}</Text>
              <Text style={styles.salaryLabel}>Repos</Text>
            </View>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={[styles.salaryValue, { fontSize: 11 }]}>{result.githubAnalysis.stats.topLanguages.slice(0, 3).join(', ')}</Text>
              <Text style={styles.salaryLabel}>Top Languages</Text>
            </View>
            <View style={[styles.salaryCard, { alignItems: 'center' }]}>
              <Text style={styles.salaryValue}>{result.githubAnalysis.stats.avgStars.toFixed(1)}</Text>
              <Text style={styles.salaryLabel}>Avg Stars</Text>
            </View>
          </View>

          {/* Strengths */}
          {result.githubAnalysis.strengths.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.strengths)}</Text>
              {(result.githubAnalysis as GitHubAnalysis).strengths.map((s, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{clean(s.area)}</Text>
                  <Text style={styles.cardText}>{clean(s.description)}</Text>
                  <Text style={[styles.textSmall, { color: colors.success, marginTop: 4, fontStyle: 'italic' }]}>{clean(s.evidence)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Improvements */}
          {result.githubAnalysis.improvements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.improvements)}</Text>
              {(result.githubAnalysis as GitHubAnalysis).improvements.map((imp, i) => (
                <View key={i} style={[styles.card, styles.mb8]}>
                  <View style={styles.row}>
                    <Text style={[styles.badge, getSeverityBadge(imp.priority === 'high' ? 'critical' : imp.priority === 'medium' ? 'moderate' : 'minor')]}>
                      {imp.priority.toUpperCase()}
                    </Text>
                    <Text style={styles.cardTitle}>{clean(imp.area)}</Text>
                  </View>
                  <Text style={styles.cardText}>{clean(imp.description)}</Text>
                  <Text style={[styles.cardText, { color: colors.primary, marginTop: 4 }]}>{clean(imp.actionable)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Project Idea */}
          {result.githubAnalysis.projectIdea?.name && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.projectIdea)}</Text>
              <View style={[styles.card, { borderColor: colors.primary, borderWidth: 1.5 }]}>
                <Text style={[styles.cardTitle, { color: colors.primary, fontSize: 13 }]}>{clean(result.githubAnalysis.projectIdea.name)}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 6 }}>
                  {result.githubAnalysis.projectIdea.techStack.map((tech, i) => (
                    <Text key={i} style={[styles.badge, styles.badgeDifferentiator]}>{clean(tech)}</Text>
                  ))}
                </View>
                <Text style={styles.cardText}>{clean(result.githubAnalysis.projectIdea.description)}</Text>
                <Text style={[styles.cardText, { color: colors.success, marginTop: 4 }]}>
                  {clean(labels.whyRelevant)}: {clean(result.githubAnalysis.projectIdea.whyRelevant)}
                </Text>
                <Text style={[styles.textSmall, { marginTop: 4 }]}>
                  {clean(labels.estimatedTime)}: {clean(result.githubAnalysis.projectIdea.estimatedTime)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text>{clean(labels.brandLine)}</Text>
            <Text>GitHub</Text>
          </View>
        </Page>
      )}

      {/* PAGE 9 (conditional): Cover Letter */}
      {result.coverLetter && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Gap<Text style={styles.logoAccent}>Zero</Text></Text>
            <Text style={styles.headerMeta}>{clean(labels.coverLetter)}</Text>
          </View>

          <View style={styles.section}>
            {/* Letter body */}
            <View style={[styles.card, { padding: 20 }]}>
              <Text style={[styles.cardText, styles.mb8]}>{clean((result.coverLetter as CoverLetter).greeting)}</Text>
              <Text style={[styles.cardText, styles.mb8]}>{clean((result.coverLetter as CoverLetter).openingParagraph)}</Text>
              {(result.coverLetter as CoverLetter).bodyParagraphs.map((para: string, i: number) => (
                <Text key={i} style={[styles.cardText, styles.mb8]}>{clean(para)}</Text>
              ))}
              <Text style={[styles.cardText, styles.mb8]}>{clean((result.coverLetter as CoverLetter).closingParagraph)}</Text>
              <Text style={[styles.cardText, styles.bold]}>{clean((result.coverLetter as CoverLetter).signature)}</Text>
            </View>
          </View>

          {/* Tone + highlights metadata */}
          <View style={[styles.twoCol, styles.mb8]}>
            <View style={styles.col}>
              <View style={styles.card}>
                <Text style={[styles.textSmall, styles.bold, styles.mb4]}>{clean(labels.tone)}: {clean((result.coverLetter as CoverLetter).toneUsed)}</Text>
              </View>
            </View>
          </View>

          {(result.coverLetter as CoverLetter).strengthHighlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.strengthHighlights)}</Text>
              {(result.coverLetter as CoverLetter).strengthHighlights.map((h: string, i: number) => (
                <Text key={i} style={[styles.cardText, styles.mb4]}>- {clean(h)}</Text>
              ))}
            </View>
          )}

          {(result.coverLetter as CoverLetter).weaknessAcknowledgments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{clean(labels.weaknessAcknowledgments)}</Text>
              {(result.coverLetter as CoverLetter).weaknessAcknowledgments.map((w: string, i: number) => (
                <Text key={i} style={[styles.cardText, styles.mb4]}>- {clean(w)}</Text>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Text>{clean(labels.brandLine)}</Text>
            <Text>Cover Letter</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

// --- Download Button ---
export function PDFDownloadButton({ result, buttonLabel, labels }: { result: AnalysisResult; buttonLabel?: string; labels?: PDFLabels }) {
  const filename = `GapZero_Analysis_${result.metadata.targetRole.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<CareerReport result={result} labels={labels} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {loading ? '...' : (buttonLabel || 'Download Report')}
        </button>
      )}
    </PDFDownloadLink>
  );
}