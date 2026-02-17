import type { ExtractedProfile, CareerQuestionnaire } from '../types';

// ============================================================================
// Prompt #1: Skill & Profile Extraction
// Takes raw CV text → produces structured profile
// ============================================================================

export function buildSkillExtractionPrompt(
  cvText: string,
  questionnaire: CareerQuestionnaire
): { system: string; userMessage: string } {
  const system = `You are an expert CV analyst and career strategist with 20 years of experience in tech recruitment. Your role is to extract a comprehensive, structured profile from a CV/resume.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

EXTRACTION RULES:
1. Extract ALL skills mentioned — both explicit ("Python") and implicit (if they describe building REST APIs, add "API Design")
2. Categorize skills into logical groups (Programming Languages, Cloud & DevOps, AI/ML, Frameworks, etc.)
3. Infer proficiency levels based on context: years used, depth of work described, certifications
4. Extract ALL certifications, including expired or in-progress ones
5. For experience items, focus on quantifiable achievements and technologies used
6. Be thorough — missing a skill means it won't be analyzed in later steps

PROFICIENCY LEVELS:
- "expert": 5+ years daily use, architect-level decisions, led teams using this tech
- "advanced": 3-5 years regular use, can solve complex problems independently
- "intermediate": 1-3 years or used in several projects
- "beginner": mentioned once, or listed as "familiar with", or used briefly

JSON SCHEMA:
{
  "name": "string — full name from CV",
  "currentRole": "string — most recent job title, or from questionnaire if clearer",
  "totalYearsExperience": number,
  "skills": [
    {
      "category": "string — e.g. 'Programming Languages', 'Cloud & DevOps', 'AI/ML'",
      "skills": ["string array of skill names"],
      "proficiencyLevel": "expert | advanced | intermediate | beginner"
    }
  ],
  "certifications": ["string array of all certifications"],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string or null",
      "field": "string"
    }
  ],
  "experience": [
    {
      "title": "string — job title",
      "company": "string",
      "duration": "string — e.g. '2019-2024 (5 years)'",
      "highlights": ["string array — key achievements, max 4 per role"],
      "technologies": ["string array — all tech used in this role"]
    }
  ],
  "languages": [
    {
      "language": "string",
      "level": "string — e.g. 'Native', 'C1', 'B2', 'A2'"
    }
  ],
  "summary": "string — 2-3 sentence professional summary synthesized from the CV"
}`;

  const userMessage = `Here is the CV text to analyze:

---CV TEXT START---
${cvText}
---CV TEXT END---

Additional context from the user's questionnaire:
- Current Role: ${questionnaire.currentRole}
- Target Role: ${questionnaire.targetRole}
- Years of Experience: ${questionnaire.yearsExperience}
- Country: ${questionnaire.country}
- Work Preference: ${questionnaire.workPreference}

Extract the complete professional profile as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if extraction fails
 */
export const EXTRACTION_FALLBACK: ExtractedProfile = {
  name: 'Unknown',
  currentRole: 'Not specified',
  totalYearsExperience: 0,
  skills: [],
  certifications: [],
  education: [],
  experience: [],
  languages: [],
  summary: 'Could not extract profile from CV.',
};
