import { NextRequest, NextResponse } from 'next/server';
import { parsePDF, validatePDFBuffer } from '@/lib/pdf-parser';
import { callClaude, truncateCVText } from '@/lib/claude';

export const maxDuration = 30;

interface DetectedProfile {
  isLinkedIn: boolean;
  currentRole: string;
  yearsExperience: number;
  country: string;
  summary: string;
}

const FALLBACK: DetectedProfile = {
  isLinkedIn: false,
  currentRole: '',
  yearsExperience: 0,
  country: '',
  summary: '',
};

/**
 * Cheap string-based heuristic to detect LinkedIn PDF exports.
 * LinkedIn PDFs have a very distinctive format — check for multiple signals.
 */
function looksLikeLinkedIn(text: string): boolean {
  const lower = text.toLowerCase();
  const signals = [
    /linkedin\.com/i.test(text),
    /\bexperience\b/i.test(text) && /\beducation\b/i.test(text),
    /\bskills\b/i.test(text),
    // LinkedIn PDFs typically contain "Page X of Y" or contact info format
    /page \d+ of \d+/i.test(text),
    // LinkedIn summary section marker
    /\bsummary\b|\babout\b/i.test(text),
    // LinkedIn-specific patterns
    /\bconnections?\b/i.test(text),
    /\bendorsements?\b/i.test(text),
    // Date range patterns common in LinkedIn (e.g., "Jan 2020 - Present")
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\s*[-–]\s*(present|\w+\s+\d{4})/i.test(text),
  ];

  // If 3+ signals match, it's very likely a LinkedIn export (or a well-structured CV — either way, worth extracting)
  return signals.filter(Boolean).length >= 3;
}

const SYSTEM_PROMPT = `You are a CV/profile analyzer. Given text extracted from a PDF, determine if it appears to be a LinkedIn profile export and extract key career details.

You must respond ONLY with a valid JSON object matching this schema. No preamble, no explanation, no markdown fences — just pure JSON.

DETECTION RULES:
- "isLinkedIn": true if the text appears to be from a LinkedIn profile PDF export (contains typical LinkedIn sections like Experience, Education, Skills, and has the LinkedIn formatting style). Also set true if it's clearly a structured CV/resume — the auto-fill is useful regardless of source.
- Even if not LinkedIn specifically, if you can confidently extract career details from the text, set isLinkedIn to true so the user benefits from auto-fill.

EXTRACTION RULES:
1. "currentRole": The person's most recent/current job title. Extract from the most recent position in the Experience section. Be precise — use their actual title.
2. "yearsExperience": Calculate total professional years from the earliest work experience to February 2026. Round to nearest integer. If unclear, estimate conservatively.
3. "country": Extract from location/address/contact info. Use the full country name (e.g., "Romania", "Germany", "United States"). If only a city is visible, infer the country. If the person has multiple locations, use the most recent one.
4. "summary": A brief 1-sentence description of their professional profile to confirm the detection to the user.

If you cannot extract a field, use empty string for strings and 0 for numbers.

JSON SCHEMA:
{
  "isLinkedIn": boolean,
  "currentRole": "string",
  "yearsExperience": number,
  "country": "string",
  "summary": "string"
}`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get('cv') as File | null;

    if (!cvFile) {
      return NextResponse.json(
        { error: 'Missing file', message: 'No PDF file provided.' },
        { status: 400 }
      );
    }

    if (cvFile.type !== 'application/pdf') {
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    // Parse PDF
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    if (!validatePDFBuffer(buffer)) {
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    const parsed = await parsePDF(buffer);
    const cvText = truncateCVText(parsed.text);

    // Quick heuristic check — if it doesn't look like a structured profile, skip the Claude call
    if (cvText.length < 100 || !looksLikeLinkedIn(cvText)) {
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    // Use Claude to extract profile fields — use only first ~4000 chars to keep it fast
    const textForDetection = cvText.slice(0, 4000);

    const result = await callClaude<DetectedProfile>({
      system: SYSTEM_PROMPT,
      userMessage: `PDF TEXT:\n---\n${textForDetection}\n---\n\nDetect and extract profile data as JSON.`,
      maxTokens: 1024,
      temperature: 0.1,
      fallback: FALLBACK,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[detect-profile] Error:', error);
    // Non-critical feature — just return empty result on failure
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}