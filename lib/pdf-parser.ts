import pdfParse from 'pdf-parse';

// ============================================================================
// PDF Parser — Extract text from uploaded CV PDFs
// ============================================================================

export interface ParsedPDF {
  text: string;
  pageCount: number;
  info: {
    title?: string;
    author?: string;
    creationDate?: string;
  };
  /** 0-100 score indicating text extraction quality */
  qualityScore: number;
  /** Warning message if quality is below threshold */
  qualityWarning?: string;
}

/**
 * Parse a PDF file buffer and extract text content.
 *
 * @param buffer - The PDF file as a Buffer (from uploaded file)
 * @returns Parsed text content and metadata
 * @throws Error if the PDF is invalid, empty, or unreadable
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  try {
    const data = await pdfParse(buffer, {
      // Limit to 20 pages — CVs shouldn't be longer than this
      max: 20,
    });

    const text = data.text?.trim();

    if (!text || text.length < 200) {
      throw new Error(
        'Could not extract meaningful text from this PDF. ' +
        'The file might be a scanned image without OCR, or it may be empty. ' +
        'Please upload a text-based PDF (you can test by selecting text in your PDF viewer).'
      );
    }

    const cleaned = cleanText(text);
    const quality = assessTextQuality(cleaned);

    return {
      text: cleaned,
      pageCount: data.numpages,
      info: {
        title: data.info?.Title || undefined,
        author: data.info?.Author || undefined,
        creationDate: data.info?.CreationDate || undefined,
      },
      qualityScore: quality.score,
      qualityWarning: quality.warning,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Could not extract')) {
      throw error; // Re-throw our custom error
    }

    throw new Error(
      'Failed to parse the PDF file. Please ensure it\'s a valid, non-corrupted PDF document.'
    );
  }
}

/**
 * Assess the quality of extracted PDF text.
 * Returns a 0-100 score and an optional warning message.
 *
 * Checks for:
 * - Word ratio: proportion of text that forms recognizable words
 * - Encoding artifacts: garbled characters, excessive special chars
 * - Structure signals: presence of typical CV sections
 */
function assessTextQuality(text: string): { score: number; warning?: string } {
  const warnings: string[] = [];
  let score = 100;

  // 1. Word ratio: split on whitespace, check how many tokens look like real words
  const tokens = text.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return { score: 0, warning: 'No readable text extracted from PDF.' };

  const wordPattern = /^[a-zA-ZÀ-ÿ0-9@.,\-/()&'+:;!?#]+$/;
  const realWords = tokens.filter((t) => wordPattern.test(t));
  const wordRatio = realWords.length / tokens.length;

  if (wordRatio < 0.4) {
    score -= 50;
    warnings.push('Most of the extracted text appears garbled or unreadable.');
  } else if (wordRatio < 0.65) {
    score -= 25;
    warnings.push('Some parts of the extracted text may be garbled.');
  }

  // 2. Non-alphanumeric ratio: if >50% of chars are non-alphanumeric (excluding spaces/newlines), text is garbled
  const alnumChars = (text.match(/[a-zA-ZÀ-ÿ0-9]/g) || []).length;
  const contentChars = text.replace(/[\s\n\r]/g, '').length;
  const nonAlnumRatio = contentChars > 0 ? 1 - (alnumChars / contentChars) : 1;

  if (nonAlnumRatio > 0.5) {
    score -= 40;
    warnings.push('More than 50% of extracted text is non-alphanumeric — file likely contains garbled or image-based content.');
  } else if (nonAlnumRatio > 0.35) {
    score -= 15;
    warnings.push('High proportion of special characters in extracted text.');
  }

  // 3. Encoding artifact detection: high concentration of replacement chars or control sequences
  const artifactPattern = /[\uFFFD\u0000-\u0008\u000E-\u001F]|\\x[0-9a-f]{2}/gi;
  const artifacts = (text.match(artifactPattern) || []).length;
  const artifactRatio = artifacts / text.length;

  if (artifactRatio > 0.02) {
    score -= 30;
    warnings.push('PDF contains encoding artifacts — file may be a scanned image or use non-standard fonts.');
  } else if (artifactRatio > 0.005) {
    score -= 10;
    warnings.push('Minor encoding issues detected in the PDF.');
  }

  // 4. CV structure signals: check for common section headers
  const sectionKeywords = [
    /\b(experience|employment|work history)\b/i,
    /\b(education|university|degree|bachelor|master)\b/i,
    /\b(skill|competenc|proficienc)\b/i,
    /\b(summary|profile|objective|about)\b/i,
  ];
  const sectionsFound = sectionKeywords.filter((kw) => kw.test(text)).length;

  if (sectionsFound === 0) {
    score -= 15;
    warnings.push('No recognizable CV section headers found — text extraction may be incomplete.');
  }

  // 5. Text length vs page count heuristic (very short text from multi-page PDFs = likely image-based)
  // This is checked externally since we need pageCount

  return {
    score: Math.max(0, Math.min(100, score)),
    warning: warnings.length > 0 ? warnings.join(' ') : undefined,
  };
}

/**
 * Clean extracted PDF text:
 * - Remove excessive whitespace
 * - Fix common extraction artifacts
 * - Normalize line breaks
 */
function cleanText(text: string): string {
  return text
    // Replace multiple spaces with single space
    .replace(/[ \t]+/g, ' ')
    // Replace 3+ consecutive newlines with 2
    .replace(/\n{3,}/g, '\n\n')
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    // Fix common PDF extraction artifacts (bullet characters)
    .replace(/[•◦▪▸►]/g, '- ')
    // Fix ligatures
    .replace(/ﬁ/g, 'fi')
    .replace(/ﬂ/g, 'fl')
    .replace(/ﬀ/g, 'ff')
    // Trim each line
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    // Final trim
    .trim();
}

/**
 * Validate a PDF buffer before parsing.
 * Checks the PDF magic bytes header.
 */
export function validatePDFBuffer(buffer: Buffer): boolean {
  // PDF files start with %PDF
  if (buffer.length < 5) return false;
  const header = buffer.subarray(0, 5).toString('ascii');
  return header.startsWith('%PDF');
}
