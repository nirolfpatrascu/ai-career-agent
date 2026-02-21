import type { UpworkProfile } from '../types';

// ============================================================================
// Upwork Prompt #1: Profile Parser
// Takes raw pasted Upwork profile page text → structured UpworkProfile
// NOTE: No language instruction — output is always structured JSON
// ============================================================================

export function buildUpworkProfileParsePrompt(
  profileText: string
): { system: string; userMessage: string } {

  const system = `You are an expert data-extraction engine specialized in parsing Upwork freelancer profile pages. Your task is to take raw, messy text copied from an Upwork profile page and extract it into a clean, structured JSON object.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

EXTRACTION RULES:
1. Extract ONLY information that is explicitly present in the text. If a field is not found, use null for optional fields or empty arrays for array fields.
2. Do NOT fabricate, infer, or hallucinate any data. If the hourly rate is not visible, set it to null — do NOT guess.
3. Handle messy page text gracefully:
   - Upwork pages often contain navigation text, footer text, ad fragments, and duplicated content. Ignore all non-profile content.
   - Clean up formatting artifacts: extra whitespace, broken line breaks mid-sentence, repeated words from copy-paste glitches.
   - Normalize skill names to their standard casing (e.g., "JAVASCRIPT" → "JavaScript", "react.js" → "React.js").
4. For earnings, job success score, and other numeric stats:
   - Parse "$50K+" as 50000, "$10k+" as 10000, etc.
   - Job Success Score is typically shown as a percentage like "95% Job Success".
   - Total jobs and hours may appear near stats like "142 jobs" or "2,500+ hours".
5. Work history entries: extract each completed job with its title, client (if visible), date range, earnings, feedback/rating, skills used, and description.
6. Portfolio items: extract title, description, and URL if present.
7. Languages: extract language name and proficiency level (e.g., "English - Native or Bilingual", "Spanish - Conversational").
8. Categories: these appear as Upwork service categories (e.g., "Web Development", "Data Science & Analytics").

JSON SCHEMA:
{
  "name": "string",
  "title": "string — professional headline/title",
  "overview": "string — the profile overview/bio section",
  "hourlyRate": number | null,
  "currency": "string — usually 'USD', or null",
  "totalEarnings": number | null,
  "totalJobs": number | null,
  "totalHours": number | null,
  "jobSuccessScore": number | null (0-100),
  "profileUrl": "string | null",
  "location": "string | null — city, country",
  "memberSince": "string | null — e.g. 'January 2019'",
  "skills": ["string array — all listed skills"],
  "categories": ["string array — Upwork service categories"],
  "employmentHistory": [
    {
      "title": "string",
      "company": "string",
      "startDate": "string",
      "endDate": "string | null (null if current)",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string | null"
    }
  ],
  "certifications": ["string array"],
  "portfolio": [
    {
      "title": "string",
      "description": "string",
      "url": "string | null"
    }
  ],
  "workHistory": [
    {
      "title": "string — job/contract title",
      "client": "string | null — client name if visible",
      "dateRange": "string — e.g. 'Jan 2023 - Mar 2023'",
      "earnings": number | null,
      "hours": number | null,
      "feedback": "string | null — client feedback text",
      "rating": number | null (1-5 scale),
      "skills": ["string array — skills used on this job"],
      "description": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "proficiency": "string"
    }
  ],
  "availability": "string | null — e.g. 'More than 30 hrs/week'",
  "responseTime": "string | null — e.g. 'within a few hours'"
}`;

  const userMessage = `RAW UPWORK PROFILE PAGE TEXT:
---PROFILE START---
${profileText}
---PROFILE END---

Parse the above profile text and extract all available information as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if Upwork profile parsing fails
 */
export const UPWORK_PROFILE_PARSE_FALLBACK: UpworkProfile = {
  name: '',
  title: '',
  overview: '',
  skills: [],
  categories: [],
  employmentHistory: [],
  education: [],
  certifications: [],
  portfolio: [],
  workHistory: [],
  languages: [],
};
