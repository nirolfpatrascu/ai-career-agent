// lib/prompts/ats-scoring.ts
// Claude prompt for ATS keyword extraction and scoring

import { ATSKeywordAnalysis, ATSRecommendation } from '../types';

export function buildATSKeywordExtractionPrompt(
  jobPosting: string
): string {
  return `You are an expert ATS (Applicant Tracking System) analyst who understands how Workday, Greenhouse, Lever, Taleo, and iCIMS parse and rank resumes.

TASK: Extract ALL keywords, skills, and requirements from this job posting. Categorize them by importance.

JOB POSTING:
---
${jobPosting}
---

Extract keywords into three categories:
1. **required** — explicitly stated as required, must-have, or mentioned in minimum qualifications
2. **preferred** — stated as preferred, nice-to-have, bonus, or mentioned in preferred qualifications
3. **nice-to-have** — implied by job description context but not explicitly required

For each keyword, also determine:
- **importance**: "high" (deal-breaker if missing), "medium" (strengthens application), "low" (minor advantage)
- **variants**: common alternative phrasings (e.g., "AWS" → ["Amazon Web Services", "AWS Cloud"], "React" → ["React.js", "ReactJS"])

IMPORTANT RULES:
- Extract SPECIFIC technical skills, not generic phrases like "team player" or "communication skills"
- Include: programming languages, frameworks, tools, platforms, certifications, methodologies, domain expertise
- Include soft skills ONLY if explicitly required (e.g., "public speaking experience required")
- Include years of experience requirements as keywords (e.g., "5+ years Python")
- Do NOT invent keywords not present in the posting

STRICT DATA SOURCING:
- Extract keywords ONLY from the provided job posting text. Do NOT add skills or requirements from other sources.

ANTI-HALLUCINATION RULES:
- Only extract keywords that are EXPLICITLY present in the job posting text. Do NOT add assumed requirements.
- Category assignment must be based on the actual text:
  * "required" = explicitly stated as "required", "must have", "minimum qualification", or listed under "Requirements"
  * "preferred" = explicitly stated as "preferred", "nice to have", "bonus", or listed under "Preferred Qualifications"
  * "nice-to-have" = mentioned in the job description body but not in requirements sections
- Do NOT inflate keyword counts by splitting compound terms (e.g., "React and TypeScript" is 2 keywords, not 4).

Respond ONLY with this JSON (no markdown, no backticks, no preamble):
{
  "keywords": [
    {
      "keyword": "Python",
      "category": "required",
      "importance": "high",
      "variants": ["Python 3", "Python programming"]
    }
  ],
  "roleLevel": "junior|mid|senior|lead|principal",
  "domain": "string describing the domain (e.g., 'AI/ML Engineering', 'Full-Stack Web Development')"
}`;
}

export function buildATSMatchingPrompt(
  cvText: string,
  jobKeywords: Array<{ keyword: string; category: string; importance: string; variants: string[] }>
): string {
  return `You are an expert ATS (Applicant Tracking System) matching engine. Your job is to determine which keywords from a job posting appear in a candidate's CV.

CANDIDATE CV TEXT:
---
${cvText}
---

JOB POSTING KEYWORDS TO MATCH:
${JSON.stringify(jobKeywords, null, 2)}

For each keyword, determine:
1. **status**: "exact_match" (keyword or variant found verbatim), "semantic_match" (related skill found, e.g., CV says "React Native" and keyword is "React"), or "missing" (not found)
2. **matchedAs**: if matched, what text in the CV matched it
3. **cvSection**: which section of the CV contains the match (e.g., "Experience - [Company Name]", "Skills", "Education", "Summary"), or if missing, which section it SHOULD be added to

MATCHING RULES:
- Case-insensitive matching
- "React.js" matches "React" and vice versa
- "Amazon Web Services" matches "AWS" and vice versa
- "ML" matches "Machine Learning" and vice versa
- "5 years of Python" matches if CV shows Python experience across roles totaling ~5 years
- Abbreviations and full forms are equivalent
- Certifications match if the cert name or issuing body is mentioned
- Do NOT count a keyword as matched if only a tangentially related skill exists (e.g., "Java" does NOT match "JavaScript")

Respond ONLY with this JSON (no markdown, no backticks, no preamble):
{
  "matches": [
    {
      "keyword": "Python",
      "category": "required",
      "importance": "high",
      "status": "exact_match",
      "matchedAs": "Python",
      "cvSection": "Skills"
    }
  ],
  "recommendations": [
    {
      "action": "Add 'Docker' to your Skills section — it's a required skill",
      "section": "Skills",
      "priority": "critical",
      "keywords": ["Docker", "Containerization"],
      "example": "Tools: Docker, Docker Compose, Kubernetes"
    }
  ]
}`;
}

export function computeATSScore(
  matches: Array<{
    keyword: string;
    category: string;
    importance: string;
    status: string;
    matchedAs?: string;
    cvSection?: string;
  }>
): {
  overallScore: number;
  keywordScore: number;
  keywords: ATSKeywordAnalysis;
} {
  // Weight system: required keywords count more
  const weights = {
    required: { high: 10, medium: 7, low: 4 },
    preferred: { high: 5, medium: 3, low: 2 },
    'nice-to-have': { high: 3, medium: 2, low: 1 },
  };

  let totalWeight = 0;
  let matchedWeight = 0;

  const matched: Array<{
    keyword: string;
    category: 'required' | 'preferred' | 'nice-to-have';
    matchedAs?: string;
    cvSection?: string;
    importance: 'high' | 'medium' | 'low';
  }> = [];

  const semanticMatch: Array<{
    keyword: string;
    category: 'required' | 'preferred' | 'nice-to-have';
    matchedAs?: string;
    cvSection?: string;
    importance: 'high' | 'medium' | 'low';
  }> = [];

  const missing: Array<{
    keyword: string;
    category: 'required' | 'preferred' | 'nice-to-have';
    cvSection?: string;
    importance: 'high' | 'medium' | 'low';
  }> = [];

  let requiredTotal = 0;
  let requiredMatched = 0;

  for (const m of matches) {
    const cat = m.category as 'required' | 'preferred' | 'nice-to-have';
    const imp = m.importance as 'high' | 'medium' | 'low';
    const w = weights[cat]?.[imp] ?? 2;
    totalWeight += w;

    if (cat === 'required') requiredTotal++;

    if (m.status === 'exact_match') {
      matchedWeight += w;
      if (cat === 'required') requiredMatched++;
      matched.push({
        keyword: m.keyword,
        category: cat,
        matchedAs: m.matchedAs,
        cvSection: m.cvSection,
        importance: imp,
      });
    } else if (m.status === 'semantic_match') {
      matchedWeight += w * 0.7; // Semantic matches count 70%
      if (cat === 'required') requiredMatched += 0.7;
      semanticMatch.push({
        keyword: m.keyword,
        category: cat,
        matchedAs: m.matchedAs,
        cvSection: m.cvSection,
        importance: imp,
      });
    } else {
      missing.push({
        keyword: m.keyword,
        category: cat,
        cvSection: m.cvSection,
        importance: imp,
      });
    }
  }

  const keywordScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return {
    overallScore: keywordScore, // Will be blended with format score in the API route
    keywordScore,
    keywords: {
      matched,
      semanticMatch,
      missing,
      total: {
        required: requiredTotal,
        matched: Math.round(requiredMatched),
        missing: requiredTotal - Math.round(requiredMatched),
      },
    },
  };
}
