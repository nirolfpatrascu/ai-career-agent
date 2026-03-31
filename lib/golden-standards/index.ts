// ============================================================================
// Golden Standards — Role-specific quality references for AI prompt injection
// ============================================================================
// These files contain industry-grade examples sourced from:
// - Harvard, Stanford, MIT career services
// - Resume Worded, Enhancv, Teal HQ, BeamJobs (real examples)
// - LinkedIn Sales Solutions, Sprout Social (LinkedIn best practices)
// - BrainStation, IGotAnOffer (FAANG-specific examples)
// - Real candidates who landed roles at Google, Stripe, Meta, etc.
//
// Usage: Inject the matching golden standard into prompts as a few-shot
// quality reference. Detect role category first, then load the relevant file.
// ============================================================================

export type RoleCategory = 'marketing' | 'engineering' | 'ai' | 'sales' | 'starter';

/**
 * Detect the role category from a job title or target role string.
 * Returns the closest matching golden standard category.
 */
export function detectRoleCategory(role: string): RoleCategory {
  const lower = role.toLowerCase();

  // AI/ML detection (check before engineering — AI engineers are a subset)
  if (
    lower.includes('machine learning') ||
    lower.includes('ml ') ||
    lower.includes('ai ') ||
    lower.includes('artificial intelligence') ||
    lower.includes('data scientist') ||
    lower.includes('deep learning') ||
    lower.includes('nlp') ||
    lower.includes('computer vision') ||
    lower.includes('llm')
  ) {
    return 'ai';
  }

  // Marketing detection
  if (
    lower.includes('marketing') ||
    lower.includes('brand') ||
    lower.includes('content') ||
    lower.includes('seo') ||
    lower.includes('growth') ||
    lower.includes('demand gen') ||
    lower.includes('communications') ||
    lower.includes('social media') ||
    lower.includes('copywriter') ||
    lower.includes('creative director')
  ) {
    return 'marketing';
  }

  // Sales detection
  if (
    lower.includes('sales') ||
    lower.includes('account executive') ||
    lower.includes('account manager') ||
    lower.includes('business development') ||
    lower.includes('bdr') ||
    lower.includes('sdr') ||
    lower.includes('revenue') ||
    lower.includes('customer success') ||
    lower.includes('partnerships')
  ) {
    return 'sales';
  }

  // Engineering detection
  if (
    lower.includes('engineer') ||
    lower.includes('developer') ||
    lower.includes('programmer') ||
    lower.includes('architect') ||
    lower.includes('devops') ||
    lower.includes('sre') ||
    lower.includes('frontend') ||
    lower.includes('backend') ||
    lower.includes('full stack') ||
    lower.includes('fullstack') ||
    lower.includes('software') ||
    lower.includes('cloud')
  ) {
    return 'engineering';
  }

  // Career starter detection (by experience level keywords)
  if (
    lower.includes('junior') ||
    lower.includes('entry') ||
    lower.includes('intern') ||
    lower.includes('graduate') ||
    lower.includes('associate') ||
    lower.includes('trainee') ||
    lower.includes('apprentice')
  ) {
    return 'starter';
  }

  // Default to engineering (most common in tech)
  return 'engineering';
}

/**
 * File paths for golden standards by category and type.
 * These are markdown files that can be read at runtime and injected into prompts.
 */
/**
 * Load the content of a golden standard file at runtime.
 * Reads from the filesystem — server-side only.
 */
export async function loadGoldenStandard(
  type: 'cvs' | 'coverLetters' | 'linkedin',
  role: string
): Promise<string> {
  const { readFile } = await import('fs/promises');
  const { join } = await import('path');
  const category = detectRoleCategory(role);
  const relativePath = GOLDEN_STANDARD_PATHS[type][category];
  try {
    const fullPath = join(process.cwd(), relativePath);
    return await readFile(fullPath, 'utf-8');
  } catch {
    return ''; // Silently skip if file not found — never block analysis
  }
}

export const GOLDEN_STANDARD_PATHS = {
  cvs: {
    marketing: 'lib/golden-standards/cvs/marketing.md',
    engineering: 'lib/golden-standards/cvs/engineering.md',
    ai: 'lib/golden-standards/cvs/ai.md',
    sales: 'lib/golden-standards/cvs/sales.md',
    starter: 'lib/golden-standards/cvs/starter.md',
  },
  coverLetters: {
    marketing: 'lib/golden-standards/cover-letters/marketing.md',
    engineering: 'lib/golden-standards/cover-letters/engineering.md',
    ai: 'lib/golden-standards/cover-letters/ai.md',
    sales: 'lib/golden-standards/cover-letters/sales.md',
    starter: 'lib/golden-standards/cover-letters/starter.md',
  },
  linkedin: {
    marketing: 'lib/golden-standards/linkedin/marketing.md',
    engineering: 'lib/golden-standards/linkedin/engineering.md',
    ai: 'lib/golden-standards/linkedin/ai.md',
    sales: 'lib/golden-standards/linkedin/sales.md',
    starter: 'lib/golden-standards/linkedin/starter.md',
  },
} as const;
