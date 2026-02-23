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

STRICT DATA SOURCING:
- Base your analysis STRICTLY on the provided CV text, LinkedIn profile text, and questionnaire answers for ALL user-specific content.
- Use the provided reference data (salary benchmarks, best practices, ATS guidelines) ONLY for general knowledge context.
- Do NOT invent, assume, or infer any skills, experience, companies, job titles, or career details not explicitly present in the user's uploaded documents.

ANTI-HALLUCINATION RULES:
- Only extract skills, certifications, and experience that are EXPLICITLY stated in the CV text. Do NOT infer skills not mentioned.
- If the CV mentions a technology briefly (e.g., in a list), note it as "mentioned" not "proficient."
- Do NOT fabricate job titles, company names, dates, or certifications that are not in the CV.
- If the CV is vague or lacks detail in a section, say so explicitly rather than filling in assumptions.
- When identifying years of experience, count ONLY from dates explicitly stated in the CV. Do NOT estimate.

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
${questionnaire.targetRole2 ? `- Alternative Target Role: ${questionnaire.targetRole2}` : ''}
${questionnaire.targetRole3 ? `- Alternative Target Role: ${questionnaire.targetRole3}` : ''}
- Years of Experience: ${questionnaire.yearsExperience}
- Country: ${questionnaire.country}
- Work Preference: ${questionnaire.workPreference}
${questionnaire.linkedInProfile ? `
SUPPLEMENTARY DATA — LinkedIn Profile:
The user provided their LinkedIn profile PDF export. This is a RICH data source — analyze it thoroughly:
- Extract ALL skills listed in the Skills section (LinkedIn often has more skills than a CV)
- Note endorsement counts as a signal of proficiency
- Extract volunteer work, courses, projects, publications, and honors if present
- Use the LinkedIn headline and about section for career positioning insights
- Cross-reference experience dates/titles between CV and LinkedIn for accuracy
- LinkedIn recommendations and endorsements indicate peer-validated skills

---LINKEDIN START---
${questionnaire.linkedInProfile.slice(0, 12000)}
---LINKEDIN END---
` : ''}
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