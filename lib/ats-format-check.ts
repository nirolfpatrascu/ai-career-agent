// lib/ats-format-check.ts
// Analyzes PDF structure for ATS compatibility — pure code, no AI needed

import { ATSFormatIssue } from './types';

// Standard ATS-recognized section headers
const ATS_STANDARD_HEADERS = [
  'experience', 'work experience', 'professional experience', 'employment history',
  'education', 'academic background',
  'skills', 'technical skills', 'core competencies', 'key skills',
  'certifications', 'certificates', 'licenses',
  'projects', 'key projects',
  'summary', 'professional summary', 'objective', 'profile',
  'languages', 'language skills',
  'publications', 'awards', 'volunteer', 'references',
];

// Non-standard headers that confuse ATS parsers
const PROBLEMATIC_HEADERS = [
  'my journey', 'about me', 'who i am', 'my story', 'what i do',
  'adventures', 'playground', 'toolbox', 'superpower', 'arsenal',
  'what i bring', 'my expertise', 'passions', 'life philosophy',
];

interface PDFFormatAnalysis {
  formatScore: number; // 0-100
  issues: ATSFormatIssue[];
  stats: {
    pageCount: number;
    charCount: number;
    isTextExtractable: boolean;
    hasImages: boolean;
    estimatedColumns: number;
    fileSize: number;
  };
}

export function analyzeATSFormat(
  cvText: string,
  pdfMetadata: {
    numpages?: number;
    numrender?: number;
    info?: Record<string, unknown>;
  },
  fileSize: number // bytes
): PDFFormatAnalysis {
  const issues: ATSFormatIssue[] = [];
  let deductions = 0;

  const pageCount = pdfMetadata?.numpages ?? 1;
  const charCount = cvText.length;
  const isTextExtractable = charCount > 100;

  // --- Check 1: Text extractability ---
  if (!isTextExtractable) {
    issues.push({
      issue: 'ats.format.noText',
      severity: 'critical',
      description: 'ats.format.noTextDesc',
      fix: 'ats.format.noTextFix',
    });
    deductions += 40;
  }

  // --- Check 2: Page count ---
  if (pageCount > 3) {
    issues.push({
      issue: 'ats.format.tooLong',
      severity: 'warning',
      description: 'ats.format.tooLongDesc',
      fix: 'ats.format.tooLongFix',
    });
    deductions += 10;
  } else if (pageCount > 5) {
    issues.push({
      issue: 'ats.format.wayTooLong',
      severity: 'critical',
      description: 'ats.format.wayTooLongDesc',
      fix: 'ats.format.wayTooLongFix',
    });
    deductions += 20;
  }

  // --- Check 3: File size ---
  const fileSizeMB = fileSize / (1024 * 1024);
  if (fileSizeMB > 2) {
    issues.push({
      issue: 'ats.format.largeFile',
      severity: 'warning',
      description: 'ats.format.largeFileDesc',
      fix: 'ats.format.largeFileFix',
    });
    deductions += 5;
  }

  // --- Check 4: Column detection (heuristic) ---
  const lines = cvText.split('\n').filter((l) => l.trim().length > 0);
  const shortLineRatio = lines.filter((l) => l.trim().length < 30).length / Math.max(lines.length, 1);
  const hasLargeGaps = cvText.includes('    ') || /\t{2,}/.test(cvText);
  const estimatedColumns = shortLineRatio > 0.4 && hasLargeGaps ? 2 : 1;

  if (estimatedColumns > 1) {
    issues.push({
      issue: 'ats.format.multiColumn',
      severity: 'warning',
      description: 'ats.format.multiColumnDesc',
      fix: 'ats.format.multiColumnFix',
    });
    deductions += 15;
  }

  // --- Check 5: Section headers ---
  const textLower = cvText.toLowerCase();
  const foundStandard = ATS_STANDARD_HEADERS.filter((h) => {
    // Check for header-like patterns: header on its own line or followed by colon
    const patterns = [
      new RegExp(`^${escapeRegex(h)}\\s*$`, 'mi'),
      new RegExp(`^${escapeRegex(h)}\\s*:`, 'mi'),
      new RegExp(`^${escapeRegex(h)}\\s*\\n`, 'mi'),
    ];
    return patterns.some((p) => p.test(cvText));
  });

  const foundProblematic = PROBLEMATIC_HEADERS.filter((h) =>
    textLower.includes(h)
  );

  if (foundProblematic.length > 0) {
    issues.push({
      issue: 'ats.format.nonStandardHeaders',
      severity: 'warning',
      description: 'ats.format.nonStandardHeadersDesc',
      fix: 'ats.format.nonStandardHeadersFix',
    });
    deductions += 10;
  }

  // Check for essential sections
  const hasExperience = foundStandard.some((h) =>
    ['experience', 'work experience', 'professional experience', 'employment history'].includes(h)
  );
  const hasEducation = foundStandard.some((h) =>
    ['education', 'academic background'].includes(h)
  );
  const hasSkills = foundStandard.some((h) =>
    ['skills', 'technical skills', 'core competencies', 'key skills'].includes(h)
  );

  if (!hasExperience && isTextExtractable) {
    issues.push({
      issue: 'ats.format.noExperience',
      severity: 'critical',
      description: 'ats.format.noExperienceDesc',
      fix: 'ats.format.noExperienceFix',
    });
    deductions += 15;
  }

  if (!hasSkills && isTextExtractable) {
    issues.push({
      issue: 'ats.format.noSkills',
      severity: 'warning',
      description: 'ats.format.noSkillsDesc',
      fix: 'ats.format.noSkillsFix',
    });
    deductions += 10;
  }

  if (!hasEducation && isTextExtractable) {
    issues.push({
      issue: 'ats.format.noEducation',
      severity: 'info',
      description: 'ats.format.noEducationDesc',
      fix: 'ats.format.noEducationFix',
    });
    deductions += 5;
  }

  // --- Check 6: Contact info ---
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(cvText);
  const hasPhone = /[\+]?\d[\d\s\-().]{7,}/.test(cvText);

  if (!hasEmail) {
    issues.push({
      issue: 'ats.format.noEmail',
      severity: 'critical',
      description: 'ats.format.noEmailDesc',
      fix: 'ats.format.noEmailFix',
    });
    deductions += 10;
  }

  // --- Check 7: Special characters / encoding ---
  const specialCharCount = (cvText.match(/[^\x20-\x7E\n\r\t\u00C0-\u024F]/g) || []).length;
  const specialCharRatio = specialCharCount / Math.max(charCount, 1);

  if (specialCharRatio > 0.05) {
    issues.push({
      issue: 'ats.format.specialChars',
      severity: 'warning',
      description: 'ats.format.specialCharsDesc',
      fix: 'ats.format.specialCharsFix',
    });
    deductions += 10;
  }

  // --- Check 8: Very short CV ---
  if (charCount > 100 && charCount < 500) {
    issues.push({
      issue: 'ats.format.tooShort',
      severity: 'warning',
      description: 'ats.format.tooShortDesc',
      fix: 'ats.format.tooShortFix',
    });
    deductions += 10;
  }

  // --- Check 9: Detect potential images/graphics (heuristic) ---
  const hasImages = pdfMetadata?.numrender ? pdfMetadata.numrender > 2 : false;
  if (hasImages) {
    issues.push({
      issue: 'ats.format.hasImages',
      severity: 'info',
      description: 'ats.format.hasImagesDesc',
      fix: 'ats.format.hasImagesFix',
    });
    deductions += 5;
  }

  // Calculate format score (cap deductions at 100)
  const formatScore = Math.max(0, 100 - Math.min(deductions, 100));

  // If everything is clean, add a positive note
  if (issues.length === 0) {
    issues.push({
      issue: 'ats.format.allGood',
      severity: 'info',
      description: 'ats.format.allGoodDesc',
      fix: '',
    });
  }

  return {
    formatScore,
    issues,
    stats: {
      pageCount,
      charCount,
      isTextExtractable,
      hasImages,
      estimatedColumns,
      fileSize,
    },
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
