import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx — standard pattern for shadcn/ui projects
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values with locale awareness
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a salary range string
 */
export function formatSalaryRange(
  low: number,
  high: number,
  currency: string = 'EUR'
): string {
  return `${formatCurrency(low, currency)} – ${formatCurrency(high, currency)}`;
}

/**
 * Get color class for gap severity
 */
export function getSeverityColor(severity: 'critical' | 'moderate' | 'minor'): string {
  const colors = {
    critical: 'text-danger',
    moderate: 'text-warning',
    minor: 'text-success',
  };
  return colors[severity];
}

/**
 * Get background color class for gap severity
 */
export function getSeverityBg(severity: 'critical' | 'moderate' | 'minor'): string {
  const colors = {
    critical: 'bg-danger/10 border-danger/20',
    moderate: 'bg-warning/10 border-warning/20',
    minor: 'bg-success/10 border-success/20',
  };
  return colors[severity];
}

/**
 * Get color for fit score gauge
 */
export function getFitScoreColor(score: number): string {
  if (score >= 8) return '#10B981'; // emerald — strong fit
  if (score >= 6) return '#FBBF24'; // amber — moderate fit
  if (score >= 4) return '#FB923C'; // orange — stretch
  return '#EF4444'; // red — significant gap
}

/**
 * Get label for fit score
 */
export function getFitScoreLabel(score: number): string {
  if (score >= 8) return 'Strong Fit';
  if (score >= 6) return 'Moderate Fit';
  if (score >= 4) return 'Stretch';
  return 'Significant Gap';
}

/**
 * Get tier color for strengths
 */
export function getTierColor(tier: 'differentiator' | 'strong' | 'supporting'): string {
  const colors = {
    differentiator: 'text-primary',
    strong: 'text-success',
    supporting: 'text-text-secondary',
  };
  return colors[tier];
}

/**
 * Get tier badge style
 */
export function getTierBg(tier: 'differentiator' | 'strong' | 'supporting'): string {
  const colors = {
    differentiator: 'bg-primary/10 text-primary border-primary/20',
    strong: 'bg-success/10 text-success border-success/20',
    supporting: 'bg-zinc-800/50 text-text-secondary border-card-border',
  };
  return colors[tier];
}

/**
 * Get priority color for action items
 */
export function getPriorityColor(priority: 'critical' | 'high' | 'medium'): string {
  const colors = {
    critical: 'text-danger',
    high: 'text-warning',
    medium: 'text-primary-light',
  };
  return colors[priority];
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate PDF file
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF document' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
}

/**
 * Parse JSON safely with a fallback
 */
export function safeParseJSON<T>(text: string, fallback: T): T {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error('Failed to parse JSON:', text.slice(0, 200));
    return fallback;
  }
}

/**
 * Country list for the questionnaire dropdown
 */
export const COUNTRIES = [
  'Romania',
  'Germany',
  'United Kingdom',
  'United States',
  'Netherlands',
  'France',
  'Spain',
  'Italy',
  'Poland',
  'Austria',
  'Switzerland',
  'Sweden',
  'Denmark',
  'Norway',
  'Finland',
  'Belgium',
  'Ireland',
  'Portugal',
  'Czech Republic',
  'Hungary',
  'Canada',
  'Australia',
  'India',
  'Singapore',
  'Japan',
  'Brazil',
  'Other',
] as const;

/**
 * Map countries to their primary currency
 */
export const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string }> = {
  'Romania': { code: 'RON', symbol: 'RON' },
  'Germany': { code: 'EUR', symbol: 'EUR' },
  'United Kingdom': { code: 'GBP', symbol: 'GBP' },
  'United States': { code: 'USD', symbol: 'USD' },
  'Netherlands': { code: 'EUR', symbol: 'EUR' },
  'France': { code: 'EUR', symbol: 'EUR' },
  'Spain': { code: 'EUR', symbol: 'EUR' },
  'Italy': { code: 'EUR', symbol: 'EUR' },
  'Poland': { code: 'PLN', symbol: 'PLN' },
  'Austria': { code: 'EUR', symbol: 'EUR' },
  'Switzerland': { code: 'CHF', symbol: 'CHF' },
  'Sweden': { code: 'SEK', symbol: 'SEK' },
  'Denmark': { code: 'DKK', symbol: 'DKK' },
  'Norway': { code: 'NOK', symbol: 'NOK' },
  'Finland': { code: 'EUR', symbol: 'EUR' },
  'Belgium': { code: 'EUR', symbol: 'EUR' },
  'Ireland': { code: 'EUR', symbol: 'EUR' },
  'Portugal': { code: 'EUR', symbol: 'EUR' },
  'Czech Republic': { code: 'CZK', symbol: 'CZK' },
  'Hungary': { code: 'HUF', symbol: 'HUF' },
  'Canada': { code: 'CAD', symbol: 'CAD' },
  'Australia': { code: 'AUD', symbol: 'AUD' },
  'India': { code: 'INR', symbol: 'INR' },
  'Singapore': { code: 'SGD', symbol: 'SGD' },
  'Japan': { code: 'JPY', symbol: 'JPY' },
  'Brazil': { code: 'BRL', symbol: 'BRL' },
  'Other': { code: 'EUR', symbol: 'EUR' },
};

/**
 * Work preference options
 */
export const WORK_PREFERENCES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'flexible', label: 'Flexible' },
] as const;

/**
 * Sanitize text from API responses — replaces Unicode special characters
 * with ASCII equivalents to prevent display issues.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/\u2014/g, ' - ')
    .replace(/\u2013/g, ' - ')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2192/g, '->')
    .replace(/\u2022/g, '-');
}

/**
 * Recursively sanitize all string values in an object.
 */
export function sanitizeResult<T>(obj: T): T {
  if (typeof obj === 'string') return sanitizeText(obj) as T;
  if (Array.isArray(obj)) return obj.map(sanitizeResult) as T;
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeResult(value);
    }
    return result as T;
  }
  return obj;
}