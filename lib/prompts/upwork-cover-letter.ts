import type {
  UpworkJobPosting,
  UpworkProfile,
  UpworkCoverLetter,
} from '../types';
import { getLanguageInstruction } from './language';

// ============================================================================
// Upwork Prompt #4: Cover Letter / Proposal Generator
// Takes job posting + profile/CV → tailored Upwork proposal with screening answers
// ============================================================================

interface UpworkCoverLetterOptions {
  jobPosting: UpworkJobPosting;
  profile?: UpworkProfile;
  cvText?: string;
  tone?: 'professional' | 'conversational' | 'bold';
  language?: string;
}

export function buildUpworkCoverLetterPrompt(
  options: UpworkCoverLetterOptions
): { system: string; userMessage: string } {
  const {
    jobPosting,
    profile,
    cvText,
    tone = 'professional',
    language,
  } = options;

  const langInstruction = getLanguageInstruction(language);

  const toneInstructions: Record<string, string> = {
    professional: 'Write in a polished, confident, and professional tone. Use clear, concise language. Demonstrate expertise through specificity, not adjectives.',
    conversational: 'Write in a warm, approachable, and conversational tone. Use natural language as if speaking to a colleague. Still demonstrate expertise but in a friendly way.',
    bold: 'Write in a bold, direct, and assertive tone. Lead with results and confidence. Be slightly provocative — stand out from the sea of generic proposals.',
  };

  const screeningQuestionsContext = jobPosting.screeningQuestions.length > 0
    ? `\nSCREENING QUESTIONS (ANSWER THESE FIRST, IN EXACT ORDER):
${jobPosting.screeningQuestions
  .sort((a, b) => a.order - b.order)
  .map((q, i) => `  ${i + 1}. [${q.type.toUpperCase()}${q.required ? ', REQUIRED' : ', OPTIONAL'}] ${q.question}${q.options ? ` (Options: ${q.options.join(', ')})` : ''}${q.maxLength ? ` (Max ${q.maxLength} chars)` : ''}`)
  .join('\n')}`
    : '';

  const system = `${langInstruction}You are an elite Upwork proposal writer who has helped freelancers win over $10M in contracts. You understand client psychology, Upwork's platform mechanics, and what separates winning proposals from the 95% that get ignored.

Your task is to generate a highly targeted, compelling Upwork proposal (cover letter) that maximizes the chance of getting hired.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

TONE: ${toneInstructions[tone]}

CRITICAL PROPOSAL RULES:

1. THE FIRST 2 LINES ARE EVERYTHING:
   - On Upwork, clients see only the first ~160 characters before clicking "Read More."
   - The opening hook MUST be compelling enough to earn the click.
   - Do NOT start with: "Dear Client", "Hi there", "I am writing to express my interest", "I have X years of experience."
   - DO start with: a specific observation about their project, a relevant result you've achieved, or a question that shows you understood their needs.

2. SCREENING QUESTIONS — ANSWERED FIRST AND IN ORDER:
   - If screening questions exist, they MUST be answered BEFORE the main proposal body.
   - Answer them in the EXACT ORDER they appear (by order field).
   - Each answer must be strategic — not just factual but demonstrating fit.
   - For yes/no questions: answer definitively, then add a brief qualifier that builds confidence.
   - For text questions: be concise but show expertise. Reference specific experience.
   - For choice questions: select the best option and briefly explain why.
   - For attachment requests: describe what you would attach and why it's relevant.

3. SHOW, DON'T TELL:
   - BAD: "I am an experienced developer"
   - GOOD: "I built a similar real-time dashboard for [Client] that reduced their reporting time from 2 hours to 15 minutes"
   - Every claim must be backed by a specific example from the freelancer's real profile or CV.

4. REFERENCE SPECIFIC JOB DETAILS:
   - Mention specific requirements, technologies, or goals from the job posting.
   - Show you actually read the posting — reference unique details, not generic requirements.

5. KEEP IT CONCISE (150-250 words for the body):
   - Busy clients don't read walls of text.
   - Every sentence must earn its place.
   - Use short paragraphs (2-3 sentences max).

6. SPECIFIC CTA (Call to Action):
   - End with a concrete next step, not a generic "looking forward to hearing from you."
   - Suggest a specific deliverable, a quick call, or a pointed question that invites response.
   - The CTA should make it EASY for the client to say yes.

7. RATE SUGGESTION:
   - Based on the job budget, freelancer's profile, and market positioning, suggest a rate.
   - Include reasoning for the rate (value-based, not cost-based).
   - If the job is fixed-price, suggest a fixed-price bid with milestones reasoning.
   - If hourly, suggest an hourly rate within or strategically near the posted range.

8. PROFILE OPTIMIZATION:
   - Suggest 2-4 quick profile tweaks that would strengthen this specific application.
   - These should be things the freelancer can do in 5 minutes before submitting.

ANTI-HALLUCINATION RULES:
- Every claim, example, or result cited in the proposal MUST be based on REAL content from the freelancer's profile or CV data provided.
- Do NOT invent projects, clients, results, or metrics that are not in the provided data.
- If the freelancer's profile/CV lacks relevant experience for a requirement, acknowledge the gap honestly and pivot to transferable skills — do NOT fabricate experience.
- If no profile or CV data is provided, write a strong generic proposal template with clear [PLACEHOLDER] markers where the freelancer should insert their own specifics.

JSON SCHEMA:
{
  "openingHook": "string — the critical first 2 lines (~160 chars). Must compel the client to click 'Read More'",
  "screeningAnswers": [
    {
      "question": "string — the screening question (for reference)",
      "answer": "string — the strategic answer",
      "order": number (matches the original question order),
      "strategy": "string — brief note on why this answer works"
    }
  ],
  "body": "string — the main proposal body (150-250 words). Paragraphs separated by newlines.",
  "closingCta": "string — specific call to action that makes it easy for the client to respond",
  "suggestedRate": {
    "amount": number,
    "type": "hourly | fixed",
    "currency": "string — default 'USD'",
    "reasoning": "string — value-based justification for this rate"
  },
  "profileOptimization": ["string array — 2-4 quick profile tweaks for this specific application"]
}`;

  const profileSection = profile
    ? `FREELANCER'S UPWORK PROFILE:
${JSON.stringify(profile, null, 2)}`
    : 'No Upwork profile data provided. Use [PLACEHOLDER] markers where freelancer-specific details should go.';

  const cvSection = cvText
    ? `\nFREELANCER'S CV/RESUME TEXT:
---CV START---
${cvText}
---CV END---`
    : '';

  const userMessage = `JOB POSTING:
${JSON.stringify(jobPosting, null, 2)}
${screeningQuestionsContext}

${profileSection}
${cvSection}

TONE PREFERENCE: ${tone}

Generate a winning Upwork proposal as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if Upwork cover letter generation fails
 */
export const UPWORK_COVER_LETTER_FALLBACK: UpworkCoverLetter = {
  openingHook: '',
  screeningAnswers: [],
  body: 'Unable to generate proposal. Please try again.',
  closingCta: '',
  suggestedRate: {
    amount: 0,
    type: 'hourly',
    currency: 'USD',
    reasoning: '',
  },
  profileOptimization: [],
};
