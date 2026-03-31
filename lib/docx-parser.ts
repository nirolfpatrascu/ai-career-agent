import mammoth from 'mammoth';
import { cleanText, assessTextQuality } from './pdf-parser';
import type { ParsedPDF } from './pdf-parser';

// DOCX magic bytes: PK\x03\x04 (ZIP-based format)
const DOCX_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

/**
 * Detect document format by magic bytes.
 * Returns 'pdf', 'docx', or 'unknown'.
 */
export function detectDocumentFormat(buffer: Buffer): 'pdf' | 'docx' | 'unknown' {
  if (buffer.length < 4) return 'unknown';

  // PDF: starts with %PDF
  if (buffer.subarray(0, 5).toString('ascii').startsWith('%PDF')) return 'pdf';

  // DOCX/DOC (Office Open XML / ZIP): PK\x03\x04
  if (buffer.subarray(0, 4).equals(DOCX_MAGIC)) return 'docx';

  return 'unknown';
}

/**
 * Parse a DOCX (or DOC) buffer and extract text.
 * Returns the same ParsedPDF interface as the PDF parser for drop-in compatibility.
 */
export async function parseDOCX(buffer: Buffer): Promise<ParsedPDF> {
  let rawText: string;

  try {
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value?.trim() ?? '';
  } catch (err) {
    throw new Error(
      'Failed to parse the Word document. Please ensure it\'s a valid .docx file. ' +
      'If the file is in .doc format, try saving it as .docx first.'
    );
  }

  if (!rawText || rawText.length < 200) {
    throw new Error(
      'Could not extract meaningful text from this Word document. ' +
      'The file may be empty or contain only images.'
    );
  }

  const cleaned = cleanText(rawText);
  const quality = assessTextQuality(cleaned);

  return {
    text: cleaned,
    pageCount: 1, // mammoth doesn't expose page count
    info: {},
    qualityScore: quality.score,
    qualityWarning: quality.warning,
  };
}

/**
 * Validate that a buffer has DOCX magic bytes.
 */
export function validateDOCXBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return buffer.subarray(0, 4).equals(DOCX_MAGIC);
}
