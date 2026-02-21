// ============================================================================
// GapZero — Output Validation Layer
// Runs after EVERY Claude response, before sending results to the user.
// Catches hallucinations, schema violations, and obvious errors.
// ============================================================================

import type {
  AnalysisResult,
  FitScore,
  Strength,
  Gap,
  ActionPlan,
  SalaryAnalysis,
  RoleRecommendation,
  JobMatch,
  ValidationIssue,
  ValidationReport,
} from './types';
import type { SalaryLookupResult } from './salary-lookup';

// ============================================================================
// Trusted resource domains (for gap resource URL checking)
// ============================================================================

const TRUSTED_RESOURCE_DOMAINS = [
  'microsoft.com', 'learn.microsoft.com', 'coursera.org', 'udemy.com',
  'freecodecamp.org', 'github.com', 'youtube.com', 'edx.org',
  'pluralsight.com', 'linkedin.com', 'kaggle.com', 'aws.amazon.com',
  'cloud.google.com', 'developer.android.com', 'developer.apple.com',
  'reactjs.org', 'nodejs.org', 'python.org', 'rust-lang.org',
  'typescriptlang.org', 'docker.com', 'kubernetes.io',
  'fast.ai', 'deeplearning.ai', 'huggingface.co',
  'codecademy.com', 'khanacademy.org', 'w3schools.com',
  'mozilla.org', 'developer.mozilla.org', 'stackoverflow.com',
  'hashicorp.com', 'terraform.io', 'jenkins.io',
  'atlassian.com', 'jetbrains.com', 'oracle.com',
  'salesforce.com', 'trailhead.salesforce.com',
  'uipath.com', 'academy.uipath.com',
  'anthropic.com', 'openai.com', 'docs.anthropic.com',
];

// ============================================================================
// Main validation entry point
// ============================================================================

export function validateAnalysisResult(
  result: AnalysisResult,
  salaryLookupFn?: (role: string, country: string, level?: 'junior' | 'mid' | 'senior' | 'lead') => SalaryLookupResult | null
): ValidationReport {
  const issues: ValidationIssue[] = [];

  issues.push(...validateFitScore(result.fitScore));
  issues.push(...validateStrengths(result.strengths));
  issues.push(...validateGaps(result.gaps));
  issues.push(...validateActionPlan(result.actionPlan));
  issues.push(
    ...validateSalaryAnalysis(
      result.salaryAnalysis,
      result.metadata.country,
      result.metadata.targetRole,
      result.metadata.targetRole,
      salaryLookupFn
    )
  );
  issues.push(...validateRoleRecommendations(result.roleRecommendations));

  if (result.jobMatch) {
    issues.push(...validateJobMatch(result.jobMatch));
  }

  // Cross-check: strengths vs gaps overlap
  const strengthTitles = new Set(result.strengths.map(s => s.title.toLowerCase()));
  result.gaps.forEach((gap, i) => {
    if (strengthTitles.has(gap.skill.toLowerCase())) {
      issues.push({
        section: 'gaps',
        severity: 'warning',
        field: `gaps[${i}].skill`,
        message: `Skill "${gap.skill}" appears in both strengths and gaps. Review for consistency.`,
        autoFixable: false,
      });
    }
  });

  // Build sections summary
  const sectionNames = ['fitScore', 'strengths', 'gaps', 'actionPlan', 'salaryAnalysis', 'roleRecommendations', 'jobMatch'];
  const sections: Record<string, { valid: boolean; issueCount: number }> = {};
  for (const name of sectionNames) {
    const sectionIssues = issues.filter(i => i.section === name);
    const hasErrors = sectionIssues.some(i => i.severity === 'error');
    sections[name] = {
      valid: !hasErrors,
      issueCount: sectionIssues.length,
    };
  }

  const hasErrors = issues.some(i => i.severity === 'error');
  const autoFixable = issues.filter(i => i.autoFixable).length;

  return {
    isValid: !hasErrors,
    issues,
    autoFixed: autoFixable,
    sections,
  };
}

// ============================================================================
// FitScore validation
// ============================================================================

export function validateFitScore(fitScore: FitScore): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Score must be integer 1-10
  if (!Number.isInteger(fitScore.score) || fitScore.score < 1 || fitScore.score > 10) {
    issues.push({
      section: 'fitScore',
      severity: 'error',
      field: 'fitScore.score',
      message: `Fit score ${fitScore.score} is outside valid range 1-10.`,
      autoFixable: true,
      autoFixAction: 'Clamp to 1-10 range',
    });
  }

  // Label validation
  const validLabels: FitScore['label'][] = ['Strong Fit', 'Moderate Fit', 'Stretch', 'Significant Gap'];
  if (!validLabels.includes(fitScore.label)) {
    issues.push({
      section: 'fitScore',
      severity: 'warning',
      field: 'fitScore.label',
      message: `Fit score label "${fitScore.label}" is not a recognized value.`,
      autoFixable: true,
      autoFixAction: 'Derive label from score',
    });
  }

  // Summary validation
  if (!fitScore.summary || fitScore.summary.trim().length === 0) {
    issues.push({
      section: 'fitScore',
      severity: 'warning',
      field: 'fitScore.summary',
      message: 'Fit score summary is empty.',
      autoFixable: false,
    });
  } else if (fitScore.summary.length < 50) {
    issues.push({
      section: 'fitScore',
      severity: 'warning',
      field: 'fitScore.summary',
      message: `Fit score summary is very short (${fitScore.summary.length} chars, expected 50-500).`,
      autoFixable: false,
    });
  } else if (fitScore.summary.length > 500) {
    issues.push({
      section: 'fitScore',
      severity: 'warning',
      field: 'fitScore.summary',
      message: `Fit score summary is too long (${fitScore.summary.length} chars, max 500).`,
      autoFixable: true,
      autoFixAction: 'Truncate at sentence boundary',
    });
  }

  return issues;
}

// ============================================================================
// Strengths validation
// ============================================================================

export function validateStrengths(strengths: Strength[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!strengths || strengths.length === 0) {
    issues.push({
      section: 'strengths',
      severity: 'error',
      field: 'strengths',
      message: 'No strengths identified. At least 1 required.',
      autoFixable: false,
    });
    return issues;
  }

  if (strengths.length > 8) {
    issues.push({
      section: 'strengths',
      severity: 'warning',
      field: 'strengths',
      message: `Too many strengths (${strengths.length}, max 8).`,
      autoFixable: true,
      autoFixAction: 'Keep top 8 strengths',
    });
  }

  // Valid tiers
  const validTiers: Strength['tier'][] = ['differentiator', 'strong', 'supporting'];
  const seenTitles = new Set<string>();

  strengths.forEach((s, i) => {
    if (!validTiers.includes(s.tier)) {
      issues.push({
        section: 'strengths',
        severity: 'warning',
        field: `strengths[${i}].tier`,
        message: `Invalid tier "${s.tier}" for strength "${s.title}".`,
        autoFixable: true,
        autoFixAction: 'Default to "supporting"',
      });
    }

    // Duplicate check
    const titleLower = (s.title || '').toLowerCase();
    if (titleLower && seenTitles.has(titleLower)) {
      issues.push({
        section: 'strengths',
        severity: 'warning',
        field: `strengths[${i}].title`,
        message: `Duplicate strength title: "${s.title}".`,
        autoFixable: true,
        autoFixAction: 'Remove duplicate',
      });
    }
    seenTitles.add(titleLower);

    // Required fields
    if (!s.title || s.title.trim().length === 0) {
      issues.push({
        section: 'strengths',
        severity: 'error',
        field: `strengths[${i}].title`,
        message: `Strength at index ${i} has empty title.`,
        autoFixable: false,
      });
    }
    if (!s.description || s.description.trim().length === 0) {
      issues.push({
        section: 'strengths',
        severity: 'warning',
        field: `strengths[${i}].description`,
        message: `Strength "${s.title}" has empty description.`,
        autoFixable: false,
      });
    }
    if (!s.relevance || s.relevance.trim().length === 0) {
      issues.push({
        section: 'strengths',
        severity: 'warning',
        field: `strengths[${i}].relevance`,
        message: `Strength "${s.title}" has empty relevance.`,
        autoFixable: false,
      });
    }
  });

  return issues;
}

// ============================================================================
// Gaps validation
// ============================================================================

export function validateGaps(gaps: Gap[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!gaps || gaps.length === 0) {
    issues.push({
      section: 'gaps',
      severity: 'error',
      field: 'gaps',
      message: 'No gaps identified. At least 1 required.',
      autoFixable: false,
    });
    return issues;
  }

  if (gaps.length > 10) {
    issues.push({
      section: 'gaps',
      severity: 'warning',
      field: 'gaps',
      message: `Too many gaps (${gaps.length}, max 10).`,
      autoFixable: true,
      autoFixAction: 'Keep top 10 by severity',
    });
  }

  const validSeverities: Gap['severity'][] = ['critical', 'moderate', 'minor'];

  gaps.forEach((g, i) => {
    if (!validSeverities.includes(g.severity)) {
      issues.push({
        section: 'gaps',
        severity: 'warning',
        field: `gaps[${i}].severity`,
        message: `Invalid severity "${g.severity}" for gap "${g.skill}".`,
        autoFixable: true,
        autoFixAction: 'Default to "moderate"',
      });
    }

    // Required fields
    const requiredFields = ['skill', 'currentLevel', 'requiredLevel', 'impact', 'closingPlan', 'timeToClose'] as const;
    for (const field of requiredFields) {
      if (!g[field] || (typeof g[field] === 'string' && g[field].trim().length === 0)) {
        issues.push({
          section: 'gaps',
          severity: 'warning',
          field: `gaps[${i}].${field}`,
          message: `Gap "${g.skill || `index ${i}`}" has empty ${field}.`,
          autoFixable: false,
        });
      }
    }

    // Resources array
    if (!g.resources || g.resources.length === 0) {
      issues.push({
        section: 'gaps',
        severity: 'warning',
        field: `gaps[${i}].resources`,
        message: `Gap "${g.skill}" has no resources.`,
        autoFixable: false,
      });
    } else if (g.resources.length > 5) {
      issues.push({
        section: 'gaps',
        severity: 'info',
        field: `gaps[${i}].resources`,
        message: `Gap "${g.skill}" has ${g.resources.length} resources (max recommended: 5).`,
        autoFixable: true,
        autoFixAction: 'Keep first 5 resources',
      });
    }

    // Check resource URLs against trusted domains
    if (g.resources) {
      g.resources.forEach((resource, j) => {
        const urlMatch = resource.match(/https?:\/\/([^/\s]+)/);
        if (urlMatch) {
          const domain = urlMatch[1].toLowerCase();
          const isTrusted = TRUSTED_RESOURCE_DOMAINS.some(
            trusted => domain === trusted || domain.endsWith('.' + trusted)
          );
          if (!isTrusted) {
            issues.push({
              section: 'gaps',
              severity: 'info',
              field: `gaps[${i}].resources[${j}]`,
              message: `Resource URL domain "${domain}" is not in the trusted domains list. May still be legitimate.`,
              autoFixable: false,
            });
          }
        }
      });
    }
  });

  return issues;
}

// ============================================================================
// ActionPlan validation
// ============================================================================

export function validateActionPlan(actionPlan: ActionPlan): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validPriorities: string[] = ['critical', 'high', 'medium'];
  const sections = ['thirtyDays', 'ninetyDays', 'twelveMonths'] as const;

  for (const section of sections) {
    const items = actionPlan[section];
    if (!items || items.length === 0) {
      issues.push({
        section: 'actionPlan',
        severity: 'error',
        field: `actionPlan.${section}`,
        message: `Action plan ${section} section is empty. At least 1 item required.`,
        autoFixable: false,
      });
      continue;
    }

    if (items.length > 7) {
      issues.push({
        section: 'actionPlan',
        severity: 'warning',
        field: `actionPlan.${section}`,
        message: `Action plan ${section} has ${items.length} items (max 7).`,
        autoFixable: true,
        autoFixAction: 'Keep first 7 items',
      });
    }

    items.forEach((item, i) => {
      // Required fields
      const requiredFields = ['action', 'timeEstimate', 'resource', 'expectedImpact'] as const;
      for (const field of requiredFields) {
        if (!item[field] || item[field].trim().length === 0) {
          issues.push({
            section: 'actionPlan',
            severity: 'warning',
            field: `actionPlan.${section}[${i}].${field}`,
            message: `Action plan item "${item.action || `index ${i}`}" in ${section} has empty ${field}.`,
            autoFixable: false,
          });
        }
      }

      // Priority validation
      if (!validPriorities.includes(item.priority)) {
        issues.push({
          section: 'actionPlan',
          severity: 'warning',
          field: `actionPlan.${section}[${i}].priority`,
          message: `Invalid priority "${item.priority}" in ${section}.`,
          autoFixable: true,
          autoFixAction: 'Default to "medium"',
        });
      }

      // thirtyDays items shouldn't have long time estimates
      if (section === 'thirtyDays' && item.timeEstimate) {
        const longPatterns = /\b(6\s*month|1\s*year|12\s*month|9\s*month)/i;
        if (longPatterns.test(item.timeEstimate)) {
          issues.push({
            section: 'actionPlan',
            severity: 'warning',
            field: `actionPlan.thirtyDays[${i}].timeEstimate`,
            message: `30-day action item has a long time estimate: "${item.timeEstimate}". Expected short-term items.`,
            autoFixable: false,
          });
        }
      }
    });
  }

  // Cross-check: twelveMonths should not duplicate thirtyDays
  if (actionPlan.thirtyDays && actionPlan.twelveMonths) {
    for (const twelveItem of actionPlan.twelveMonths) {
      for (const thirtyItem of actionPlan.thirtyDays) {
        const similarity = textSimilarity(twelveItem.action, thirtyItem.action);
        if (similarity > 0.8) {
          issues.push({
            section: 'actionPlan',
            severity: 'warning',
            field: 'actionPlan.twelveMonths',
            message: `12-month item "${twelveItem.action.slice(0, 60)}..." is very similar to 30-day item "${thirtyItem.action.slice(0, 60)}...".`,
            autoFixable: false,
          });
        }
      }
    }
  }

  return issues;
}

// ============================================================================
// SalaryAnalysis validation
// ============================================================================

export function validateSalaryAnalysis(
  salary: SalaryAnalysis,
  country: string,
  currentRole: string,
  targetRole: string,
  salaryLookupFn?: (role: string, country: string, level?: 'junior' | 'mid' | 'senior' | 'lead') => SalaryLookupResult | null
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validate current role market
  issues.push(...validateSalaryRange(salary.currentRoleMarket, 'salaryAnalysis', 'currentRoleMarket'));

  // Validate target role market
  issues.push(...validateSalaryRange(salary.targetRoleMarket, 'salaryAnalysis', 'targetRoleMarket'));

  // growthPotential
  if (!salary.growthPotential || salary.growthPotential.trim().length === 0) {
    issues.push({
      section: 'salaryAnalysis',
      severity: 'warning',
      field: 'salaryAnalysis.growthPotential',
      message: 'Growth potential is empty.',
      autoFixable: false,
    });
  }

  // negotiationTips
  if (!salary.negotiationTips || salary.negotiationTips.length === 0) {
    issues.push({
      section: 'salaryAnalysis',
      severity: 'warning',
      field: 'salaryAnalysis.negotiationTips',
      message: 'No negotiation tips provided.',
      autoFixable: false,
    });
  } else if (salary.negotiationTips.length > 5) {
    issues.push({
      section: 'salaryAnalysis',
      severity: 'info',
      field: 'salaryAnalysis.negotiationTips',
      message: `Too many negotiation tips (${salary.negotiationTips.length}, max 5).`,
      autoFixable: true,
      autoFixAction: 'Keep first 5 tips',
    });
  }

  // Cross-reference with salary lookup data
  if (salaryLookupFn) {
    const targetLookup = salaryLookupFn(targetRole, country);
    if (targetLookup) {
      const claudeMid = salary.targetRoleMarket.mid;
      const dataMid = targetLookup.mid;
      if (dataMid > 0 && claudeMid > 0) {
        const diff = Math.abs(claudeMid - dataMid) / dataMid;
        if (diff > 0.4) {
          issues.push({
            section: 'salaryAnalysis',
            severity: 'warning',
            field: 'salaryAnalysis.targetRoleMarket.mid',
            message: `Salary estimate for ${targetRole} in ${country} differs significantly from ${targetLookup.sourceLabel} data. Data shows median of ${targetLookup.currency} ${dataMid.toLocaleString()}, Claude estimated ${salary.targetRoleMarket.currency} ${claudeMid.toLocaleString()}.`,
            autoFixable: false,
          });
        }
      }
    }

    const currentLookup = salaryLookupFn(currentRole, country);
    if (currentLookup) {
      const claudeMid = salary.currentRoleMarket.mid;
      const dataMid = currentLookup.mid;
      if (dataMid > 0 && claudeMid > 0) {
        const diff = Math.abs(claudeMid - dataMid) / dataMid;
        if (diff > 0.4) {
          issues.push({
            section: 'salaryAnalysis',
            severity: 'warning',
            field: 'salaryAnalysis.currentRoleMarket.mid',
            message: `Salary estimate for ${currentRole} in ${country} differs significantly from ${currentLookup.sourceLabel} data. Data shows median of ${currentLookup.currency} ${dataMid.toLocaleString()}, Claude estimated ${salary.currentRoleMarket.currency} ${claudeMid.toLocaleString()}.`,
            autoFixable: false,
          });
        }
      }
    }
  }

  return issues;
}

function validateSalaryRange(
  range: { low: number; mid: number; high: number; currency: string },
  section: string,
  fieldPrefix: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // All must be positive integers
  for (const key of ['low', 'mid', 'high'] as const) {
    const val = range[key];
    if (typeof val !== 'number' || val <= 0) {
      issues.push({
        section,
        severity: 'error',
        field: `${section}.${fieldPrefix}.${key}`,
        message: `Salary ${fieldPrefix}.${key} must be a positive number (got ${val}).`,
        autoFixable: false,
      });
    }
  }

  // low < mid < high
  if (range.low > 0 && range.mid > 0 && range.high > 0) {
    if (!(range.low <= range.mid && range.mid <= range.high)) {
      issues.push({
        section,
        severity: 'error',
        field: `${section}.${fieldPrefix}`,
        message: `Salary range is not ordered: low=${range.low}, mid=${range.mid}, high=${range.high}. Expected low ≤ mid ≤ high.`,
        autoFixable: true,
        autoFixAction: 'Sort ascending',
      });
    }
  }

  // Currency check
  if (!range.currency || range.currency.trim().length === 0) {
    issues.push({
      section,
      severity: 'error',
      field: `${section}.${fieldPrefix}.currency`,
      message: `Salary ${fieldPrefix} has empty currency.`,
      autoFixable: false,
    });
  }

  return issues;
}

// ============================================================================
// RoleRecommendations validation
// ============================================================================

export function validateRoleRecommendations(roles: RoleRecommendation[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!roles || roles.length === 0) {
    issues.push({
      section: 'roleRecommendations',
      severity: 'error',
      field: 'roleRecommendations',
      message: 'No role recommendations provided. At least 1 required.',
      autoFixable: false,
    });
    return issues;
  }

  if (roles.length > 5) {
    issues.push({
      section: 'roleRecommendations',
      severity: 'warning',
      field: 'roleRecommendations',
      message: `Too many role recommendations (${roles.length}, max 5).`,
      autoFixable: true,
      autoFixAction: 'Keep top 5 by fitScore',
    });
  }

  roles.forEach((role, i) => {
    // fitScore 1-10
    if (typeof role.fitScore !== 'number' || role.fitScore < 1 || role.fitScore > 10) {
      issues.push({
        section: 'roleRecommendations',
        severity: 'warning',
        field: `roleRecommendations[${i}].fitScore`,
        message: `Role "${role.title}" has invalid fitScore: ${role.fitScore}.`,
        autoFixable: true,
        autoFixAction: 'Clamp to 1-10',
      });
    }

    // Salary range validation
    if (role.salaryRange) {
      const sr = role.salaryRange;
      if (sr.low > 0 && sr.mid > 0 && sr.high > 0) {
        if (!(sr.low <= sr.mid && sr.mid <= sr.high)) {
          issues.push({
            section: 'roleRecommendations',
            severity: 'warning',
            field: `roleRecommendations[${i}].salaryRange`,
            message: `Role "${role.title}" salary range not ordered: ${sr.low}/${sr.mid}/${sr.high}.`,
            autoFixable: true,
            autoFixAction: 'Sort ascending',
          });
        }
      }
      for (const key of ['low', 'mid', 'high'] as const) {
        if (typeof sr[key] !== 'number' || sr[key] <= 0) {
          issues.push({
            section: 'roleRecommendations',
            severity: 'warning',
            field: `roleRecommendations[${i}].salaryRange.${key}`,
            message: `Role "${role.title}" salary ${key} must be positive.`,
            autoFixable: false,
          });
        }
      }
    }

    // Required fields
    if (!role.title || role.title.trim().length === 0) {
      issues.push({
        section: 'roleRecommendations',
        severity: 'error',
        field: `roleRecommendations[${i}].title`,
        message: `Role recommendation at index ${i} has empty title.`,
        autoFixable: false,
      });
    }
    if (!role.reasoning || role.reasoning.trim().length === 0) {
      issues.push({
        section: 'roleRecommendations',
        severity: 'warning',
        field: `roleRecommendations[${i}].reasoning`,
        message: `Role "${role.title}" has empty reasoning.`,
        autoFixable: false,
      });
    }
    if (!role.timeToReady || role.timeToReady.trim().length === 0) {
      issues.push({
        section: 'roleRecommendations',
        severity: 'warning',
        field: `roleRecommendations[${i}].timeToReady`,
        message: `Role "${role.title}" has empty timeToReady.`,
        autoFixable: false,
      });
    }

    // exampleCompanies
    if (role.exampleCompanies && role.exampleCompanies.length > 10) {
      issues.push({
        section: 'roleRecommendations',
        severity: 'info',
        field: `roleRecommendations[${i}].exampleCompanies`,
        message: `Role "${role.title}" has ${role.exampleCompanies.length} example companies (max 10).`,
        autoFixable: true,
        autoFixAction: 'Keep first 10 companies',
      });
    }
  });

  return issues;
}

// ============================================================================
// JobMatch validation
// ============================================================================

export function validateJobMatch(jobMatch: JobMatch): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // matchScore 0-100
  if (typeof jobMatch.matchScore !== 'number' || jobMatch.matchScore < 0 || jobMatch.matchScore > 100) {
    issues.push({
      section: 'jobMatch',
      severity: 'warning',
      field: 'jobMatch.matchScore',
      message: `Match score ${jobMatch.matchScore} is outside 0-100 range.`,
      autoFixable: true,
      autoFixAction: 'Clamp to 0-100',
    });
  }

  // matchingSkills and missingSkills should not overlap
  if (jobMatch.matchingSkills && jobMatch.missingSkills) {
    const matchingSet = new Set(jobMatch.matchingSkills.map(s => s.toLowerCase()));
    jobMatch.missingSkills.forEach((skill, i) => {
      if (matchingSet.has(skill.toLowerCase())) {
        issues.push({
          section: 'jobMatch',
          severity: 'error',
          field: `jobMatch.missingSkills[${i}]`,
          message: `Skill "${skill}" appears in both matchingSkills and missingSkills.`,
          autoFixable: true,
          autoFixAction: 'Remove from matchingSkills',
        });
      }
    });
  }

  // CV suggestions validation
  if (jobMatch.cvSuggestions) {
    jobMatch.cvSuggestions.forEach((sug, i) => {
      const requiredFields = ['section', 'current', 'suggested', 'reasoning'] as const;
      for (const field of requiredFields) {
        if (!sug[field] || sug[field].trim().length === 0) {
          issues.push({
            section: 'jobMatch',
            severity: 'warning',
            field: `jobMatch.cvSuggestions[${i}].${field}`,
            message: `CV suggestion at index ${i} has empty ${field}.`,
            autoFixable: false,
          });
        }
      }
    });
  }

  return issues;
}

// ============================================================================
// Auto-fix function
// ============================================================================

export function autoFixResult(result: AnalysisResult, issues: ValidationIssue[]): AnalysisResult {
  // Deep clone
  const fixed: AnalysisResult = JSON.parse(JSON.stringify(result));

  for (const issue of issues) {
    if (!issue.autoFixable) continue;

    // FitScore fixes
    if (issue.field === 'fitScore.score') {
      fixed.fitScore.score = Math.max(1, Math.min(10, Math.round(fixed.fitScore.score)));
    }
    if (issue.field === 'fitScore.label') {
      fixed.fitScore.label = deriveFitLabel(fixed.fitScore.score);
    }
    if (issue.field === 'fitScore.summary' && issue.autoFixAction === 'Truncate at sentence boundary') {
      fixed.fitScore.summary = truncateAtSentence(fixed.fitScore.summary, 500);
    }

    // Strengths fixes
    if (issue.field === 'strengths' && issue.autoFixAction === 'Keep top 8 strengths') {
      fixed.strengths = fixed.strengths.slice(0, 8);
    }
    if (issue.field?.match(/^strengths\[\d+\]\.tier$/)) {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.strengths[idx]) {
        fixed.strengths[idx].tier = 'supporting';
      }
    }
    if (issue.field?.match(/^strengths\[\d+\]\.title$/) && issue.autoFixAction === 'Remove duplicate') {
      // Remove duplicates by keeping first occurrence
      const seen = new Set<string>();
      fixed.strengths = fixed.strengths.filter(s => {
        const key = s.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Gaps fixes
    if (issue.field === 'gaps' && issue.autoFixAction === 'Keep top 10 by severity') {
      const severityOrder = { critical: 0, moderate: 1, minor: 2 };
      fixed.gaps.sort((a, b) => (severityOrder[a.severity] || 1) - (severityOrder[b.severity] || 1));
      fixed.gaps = fixed.gaps.slice(0, 10);
    }
    if (issue.field?.match(/^gaps\[\d+\]\.severity$/)) {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.gaps[idx]) {
        fixed.gaps[idx].severity = 'moderate';
      }
    }
    if (issue.field?.match(/^gaps\[\d+\]\.resources$/) && issue.autoFixAction === 'Keep first 5 resources') {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.gaps[idx]) {
        fixed.gaps[idx].resources = fixed.gaps[idx].resources.slice(0, 5);
      }
    }

    // ActionPlan fixes
    if (issue.field?.match(/^actionPlan\.\w+$/) && issue.autoFixAction === 'Keep first 7 items') {
      const section = issue.field.split('.')[1] as keyof typeof fixed.actionPlan;
      if (fixed.actionPlan[section]) {
        (fixed.actionPlan[section] as typeof fixed.actionPlan.thirtyDays) =
          fixed.actionPlan[section].slice(0, 7);
      }
    }
    if (issue.field?.match(/^actionPlan\.\w+\[\d+\]\.priority$/)) {
      const match = issue.field.match(/actionPlan\.(\w+)\[(\d+)\]/);
      if (match) {
        const section = match[1] as keyof typeof fixed.actionPlan;
        const idx = parseInt(match[2]);
        if (fixed.actionPlan[section]?.[idx]) {
          fixed.actionPlan[section][idx].priority = 'medium';
        }
      }
    }

    // Salary fixes
    if (issue.field?.includes('.currentRoleMarket') && issue.autoFixAction === 'Sort ascending') {
      const vals = [fixed.salaryAnalysis.currentRoleMarket.low, fixed.salaryAnalysis.currentRoleMarket.mid, fixed.salaryAnalysis.currentRoleMarket.high].sort((a, b) => a - b);
      fixed.salaryAnalysis.currentRoleMarket.low = vals[0];
      fixed.salaryAnalysis.currentRoleMarket.mid = vals[1];
      fixed.salaryAnalysis.currentRoleMarket.high = vals[2];
    }
    if (issue.field?.includes('.targetRoleMarket') && issue.autoFixAction === 'Sort ascending') {
      const vals = [fixed.salaryAnalysis.targetRoleMarket.low, fixed.salaryAnalysis.targetRoleMarket.mid, fixed.salaryAnalysis.targetRoleMarket.high].sort((a, b) => a - b);
      fixed.salaryAnalysis.targetRoleMarket.low = vals[0];
      fixed.salaryAnalysis.targetRoleMarket.mid = vals[1];
      fixed.salaryAnalysis.targetRoleMarket.high = vals[2];
    }
    if (issue.field === 'salaryAnalysis.negotiationTips' && issue.autoFixAction === 'Keep first 5 tips') {
      fixed.salaryAnalysis.negotiationTips = fixed.salaryAnalysis.negotiationTips.slice(0, 5);
    }

    // RoleRecommendations fixes
    if (issue.field === 'roleRecommendations' && issue.autoFixAction === 'Keep top 5 by fitScore') {
      fixed.roleRecommendations.sort((a, b) => b.fitScore - a.fitScore);
      fixed.roleRecommendations = fixed.roleRecommendations.slice(0, 5);
    }
    if (issue.field?.match(/^roleRecommendations\[\d+\]\.fitScore$/)) {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.roleRecommendations[idx]) {
        fixed.roleRecommendations[idx].fitScore = Math.max(1, Math.min(10, Math.round(fixed.roleRecommendations[idx].fitScore)));
      }
    }
    if (issue.field?.match(/^roleRecommendations\[\d+\]\.salaryRange$/) && issue.autoFixAction === 'Sort ascending') {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.roleRecommendations[idx]?.salaryRange) {
        const sr = fixed.roleRecommendations[idx].salaryRange;
        const vals = [sr.low, sr.mid, sr.high].sort((a, b) => a - b);
        sr.low = vals[0];
        sr.mid = vals[1];
        sr.high = vals[2];
      }
    }
    if (issue.field?.match(/^roleRecommendations\[\d+\]\.exampleCompanies$/) && issue.autoFixAction === 'Keep first 10 companies') {
      const idx = parseInt(issue.field.match(/\[(\d+)\]/)![1]);
      if (fixed.roleRecommendations[idx]) {
        fixed.roleRecommendations[idx].exampleCompanies = fixed.roleRecommendations[idx].exampleCompanies.slice(0, 10);
      }
    }

    // JobMatch fixes
    if (issue.field === 'jobMatch.matchScore') {
      if (fixed.jobMatch) {
        fixed.jobMatch.matchScore = Math.max(0, Math.min(100, Math.round(fixed.jobMatch.matchScore)));
      }
    }
    if (issue.field?.match(/^jobMatch\.missingSkills/) && issue.autoFixAction === 'Remove from matchingSkills') {
      if (fixed.jobMatch) {
        const missingSet = new Set(fixed.jobMatch.missingSkills.map(s => s.toLowerCase()));
        fixed.jobMatch.matchingSkills = fixed.jobMatch.matchingSkills.filter(
          s => !missingSet.has(s.toLowerCase())
        );
      }
    }
  }

  return fixed;
}

// ============================================================================
// Helpers
// ============================================================================

function deriveFitLabel(score: number): FitScore['label'] {
  if (score >= 8) return 'Strong Fit';
  if (score >= 6) return 'Moderate Fit';
  if (score >= 4) return 'Stretch';
  return 'Significant Gap';
}

function truncateAtSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('.');
  if (lastPeriod > maxLen * 0.5) {
    return truncated.slice(0, lastPeriod + 1);
  }
  return truncated.trim() + '...';
}

/** Simple word-based Jaccard similarity */
function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of Array.from(wordsA)) {
    if (wordsB.has(w)) intersection++;
  }
  const union = wordsA.size + wordsB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

