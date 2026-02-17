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

    if (!text || text.length < 50) {
      throw new Error(
        'Could not extract meaningful text from this PDF. ' +
        'The file might be a scanned image without OCR, or it may be empty. ' +
        'Please upload a text-based PDF.'
      );
    }

    return {
      text: cleanText(text),
      pageCount: data.numpages,
      info: {
        title: data.info?.Title || undefined,
        author: data.info?.Author || undefined,
        creationDate: data.info?.CreationDate || undefined,
      },
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
