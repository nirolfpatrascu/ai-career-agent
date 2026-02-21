import { NextRequest } from 'next/server';
import { streamClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { getLanguageInstruction } from '@/lib/prompts/language';
import type { AnalysisResult } from '@/lib/types';

export const maxDuration = 60;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  analysis: AnalysisResult;
  language?: string;
}

/**
 * Compress the analysis into a concise context string.
 * Full JSON is too large — extract only what Claude needs for chat.
 */
function buildAnalysisContext(a: AnalysisResult): string {
  const strengths = a.strengths
    .map((s) => `- ${s.title} [${s.tier}]: ${s.description.slice(0, 120)}`)
    .join('\n');

  const gaps = a.gaps
    .map(
      (g) =>
        `- ${g.skill} [${g.severity}]: Current: ${g.currentLevel}. Required: ${g.requiredLevel}. Plan: ${g.closingPlan.slice(0, 100)}. Time: ${g.timeToClose}`
    )
    .join('\n');

  const roles = a.roleRecommendations
    .map(
      (r) =>
        `- ${r.title} (fit: ${r.fitScore}/10, salary: ${r.salaryRange.low}-${r.salaryRange.high} ${r.salaryRange.currency}, ready: ${r.timeToReady}). ${r.reasoning.slice(0, 120)}`
    )
    .join('\n');

  const plan30 = a.actionPlan.thirtyDays
    .map((i) => `- [${i.priority}] ${i.action} (${i.timeEstimate})`)
    .join('\n');

  const plan90 = a.actionPlan.ninetyDays
    .map((i) => `- [${i.priority}] ${i.action} (${i.timeEstimate})`)
    .join('\n');

  const plan12 = a.actionPlan.twelveMonths
    .map((i) => `- [${i.priority}] ${i.action} (${i.timeEstimate})`)
    .join('\n');

  const salary = a.salaryAnalysis;

  return `CAREER ANALYSIS RESULTS:
Target Role: ${a.metadata.targetRole}
Country: ${a.metadata.country}
Fit Score: ${a.fitScore.score}/10 (${a.fitScore.label})
Assessment: ${a.fitScore.summary}

STRENGTHS:
${strengths}

SKILL GAPS:
${gaps}

RECOMMENDED ROLES:
${roles}

ACTION PLAN (30 days):
${plan30}

ACTION PLAN (90 days):
${plan90}

ACTION PLAN (12 months):
${plan12}

SALARY:
Current role market: ${salary.currentRoleMarket.low}-${salary.currentRoleMarket.high} ${salary.currentRoleMarket.currency} (${salary.currentRoleMarket.region})
Target role market: ${salary.targetRoleMarket.low}-${salary.targetRoleMarket.high} ${salary.targetRoleMarket.currency} (${salary.targetRoleMarket.region})
Growth potential: ${salary.growthPotential}
Best move: ${salary.bestMonetaryMove}
${a.jobMatch ? `\nJOB MATCH: ${a.jobMatch.matchScore}% match. Missing: ${a.jobMatch.missingSkills.join(', ')}` : ''}`;
}

const SYSTEM_PROMPT = `You are an expert AI career coach embedded in GapZero, a career analysis tool. The user has just received their personalized career analysis and is now chatting with you about it.

You have FULL ACCESS to their analysis results (provided below). Use this data to give hyper-personalized, specific advice.

YOUR CAPABILITIES:
1. Answer questions about any part of their analysis
2. Dive deeper into specific gaps, strengths, or role recommendations
3. Rewrite CV sections / professional summaries tailored to specific roles
4. Generate interview prep — likely questions, suggested answers using their experience, how to address gaps
5. Create cover letter drafts for specific companies/roles
6. Suggest networking strategies and specific people/communities to connect with
7. Help prioritize their action plan based on constraints (time, energy, budget)
8. Compare roles they're considering with pros/cons analysis
9. Draft LinkedIn posts about their projects or career transition

RESPONSE STYLE:
- Be direct, specific, and actionable — reference their actual skills, gaps, and experience by name
- Use markdown formatting: **bold** for key points, bullet lists for actionable items, headers for structure
- Keep responses focused. Don't repeat the full analysis — they can already see it
- When giving advice, always tie it back to their specific profile data
- For CV rewrites, output the ready-to-use text they can copy-paste
- For interview prep, format as Q: question / A: suggested answer structure

IMPORTANT: Never make up skills, experience, or qualifications the user doesn't have. Reference only what's in their analysis.`;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || 'unknown';
  const rateLimit = checkRateLimit(`chat:${ip}`);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: ChatRequest = await request.json();

    if (!body.messages || !body.analysis) {
      return new Response(
        JSON.stringify({ error: 'Missing messages or analysis context' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Conversation too long. Start a new analysis.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const analysisContext = buildAnalysisContext(body.analysis);
    const langInstruction = getLanguageInstruction(body.language);
    const system = `${SYSTEM_PROMPT}${langInstruction ? `\n\n${langInstruction}` : ''}\n\n---\n${analysisContext}\n---`;

    const stream = streamClaude({
      system,
      messages: body.messages,
      maxTokens: 2048,
      temperature: 0.4,
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[chat] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Chat failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
