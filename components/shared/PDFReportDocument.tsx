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
import type { AnalysisResult, Gap, ActionItem, Strength, RoleRecommendation } from '@/lib/types';

// Register Inter font (fallback to Helvetica if unavailable)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ],
});

// Disable hyphenation to avoid font encoding issues
Font.registerHyphenationCallback((word) => [word]);

/**
 * Sanitize text for @react-pdf/renderer.
 * Replaces Unicode characters that cause DataView encoding errors
 * with safe ASCII equivalents.
 */
function clean(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019\u201A]/g, "'")   // smart single quotes
    .replace(/[\u201C\u201D\u201E]/g, '"')    // smart double quotes
    .replace(/[\u2013\u2014]/g, '-')          // en/em dashes
    .replace(/\u2026/g, '...')                // ellipsis
    .replace(/\u20AC/g, 'EUR ')               // euro sign
    .replace(/\u00A3/g, 'GBP ')               // pound sign
    .replace(/\u00A5/g, 'JPY ')               // yen sign
    .replace(/\u2192/g, '->')                  // right arrow
    .replace(/\u2190/g, '<-')                  // left arrow
    .replace(/\u2191/g, '^')                   // up arrow
    .replace(/\u2193/g, 'v')                   // down arrow
    .replace(/\u2022/g, '-')                   // bullet
    .replace(/\u00B7/g, '-')                   // middle dot
    .replace(/\u2019/g, "'")                   // right single quotation
    .replace(/[\u00E0-\u00FF]/g, (c) => {      // accented latin chars
      const map: Record<string, string> = {
        '\u00E0': 'a', '\u00E1': 'a', '\u00E2': 'a', '\u00E3': 'a', '\u00E4': 'a',
        '\u00E8': 'e', '\u00E9': 'e', '\u00EA': 'e', '\u00EB': 'e',
        '\u00EC': 'i', '\u00ED': 'i', '\u00EE': 'i', '\u00EF': 'i',
        '\u00F2': 'o', '\u00F3': 'o', '\u00F4': 'o', '\u00F5': 'o', '\u00F6': 'o',
        '\u00F9': 'u', '\u00FA': 'u', '\u00FB': 'u', '\u00FC': 'u',
        '\u00E7': 'c', '\u00F1': 'n', '\u00FD': 'y', '\u00FF': 'y',
        '\u00DF': 'ss',
      };
      return map[c] || c;
    })
    .replace(/[^\x00-\x7F]/g, '');            // strip any remaining non-ASCII
}

const colors = {
  bg: '#0A0A0B',
  card: '#141416',
  border: '#27272A',
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#EF4444',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    padding: 40,
    fontFamily: 'Inter',
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
    backgroundColor: '#22C55E20',
    color: colors.success,
  },
  badgeDifferentiator: {
    backgroundColor: '#3B82F620',
    color: colors.primary,
  },
  badgeStrong: {
    backgroundColor: '#22C55E20',
    color: colors.success,
  },
  badgeSupporting: {
    backgroundColor: '#27272A',
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
function CareerReport({ result }: { result: AnalysisResult }) {
  return (
    <Document>
      {/* PAGE 1: Overview + Strengths */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Career<Text style={styles.logoAccent}>Lens</Text> AI
          </Text>
          <Text style={styles.headerMeta}>
            Career Analysis Report - {clean(result.metadata.targetRole)} - {clean(result.metadata.country)}
          </Text>
          <Text style={styles.headerMeta}>
            Generated {new Date(result.metadata.analyzedAt).toLocaleDateString('en-US', {
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
          <Text style={styles.sectionTitle}>Your Strengths</Text>
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
          <Text>CareerLens AI - AI-Powered Career Advisor</Text>
          <Text>Page 1</Text>
        </View>
      </Page>

      {/* PAGE 2: Skill Gaps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Gaps</Text>
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
                  <Text style={[styles.textSmall, styles.bold]}>Current</Text>
                  <Text style={styles.cardText}>{clean(g.currentLevel)}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={[styles.textSmall, styles.bold]}>Required</Text>
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
          <Text>CareerLens AI - AI-Powered Career Advisor</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* PAGE 3: Role Recommendations + Salary */}
      <Page size="A4" style={styles.page}>
        {/* Roles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Roles</Text>
          {result.roleRecommendations.map((role: RoleRecommendation, i: number) => (
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
                Companies: {role.exampleCompanies.map(c => clean(c)).join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Salary Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Analysis</Text>
          <Text style={[styles.textSmall, styles.mb8]}>All figures are gross annual (before tax)</Text>
          <View style={[styles.twoCol, styles.mb8]}>
            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>Current Role Market</Text>
              <Text style={[styles.salaryValue, styles.textPrimary]}>
                {formatCurrency(result.salaryAnalysis.currentRoleMarket.mid, result.salaryAnalysis.currentRoleMarket.currency)}
              </Text>
              <Text style={styles.salaryRange}>
                {formatCurrency(result.salaryAnalysis.currentRoleMarket.low, result.salaryAnalysis.currentRoleMarket.currency)} - {formatCurrency(result.salaryAnalysis.currentRoleMarket.high, result.salaryAnalysis.currentRoleMarket.currency)}
              </Text>
              <Text style={[styles.textSmall, styles.mt8]}>{clean(result.salaryAnalysis.currentRoleMarket.region)}</Text>
            </View>
            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>Target Role Market</Text>
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
            <Text style={[styles.cardText, styles.textSuccess, styles.bold]}>Growth Potential: {clean(result.salaryAnalysis.growthPotential)}</Text>
            <Text style={[styles.cardText, styles.mt8]}>{clean(result.salaryAnalysis.bestMonetaryMove)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>CareerLens AI - AI-Powered Career Advisor</Text>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* PAGE 4: Action Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>30-Day Quick Wins</Text>
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
          <Text style={styles.sectionTitle}>90-Day Skill Building</Text>
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
          <Text>CareerLens AI - AI-Powered Career Advisor</Text>
          <Text>Page 4</Text>
        </View>
      </Page>

      {/* PAGE 5: 12-Month + Negotiation Tips */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12-Month Career Trajectory</Text>
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
            <Text style={styles.sectionTitle}>Negotiation Tips</Text>
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
          <Text>CareerLens AI - AI-Powered Career Advisor</Text>
          <Text>Page 5</Text>
        </View>
      </Page>
    </Document>
  );
}

// --- Download Button ---
export function PDFDownloadButton({ result }: { result: AnalysisResult }) {
  const filename = `CareerLens_Analysis_${result.metadata.targetRole.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<CareerReport result={result} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {loading ? 'Generating PDF...' : 'Download Report'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
