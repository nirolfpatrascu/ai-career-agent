// ============================================================================
// Post-processing translation prompt
// Extracts only translatable text fields (~75% smaller than full AnalysisResult),
// translates those, then merges back — keeping numbers/enums/arrays intact.
// ============================================================================

import type { AnalysisResult } from '@/lib/types';
import type { CoverLetter } from './cover-letter';

const LANGUAGE_NAMES: Record<string, string> = {
  ro: 'Romanian (Română)',
  de: 'German (Deutsch)',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  it: 'Italian (Italiano)',
};

const EXAMPLES: Record<string, { strongFit: string; free: string; readyNow: string }> = {
  ro: { strongFit: 'Potrivire Puternică', free: 'gratuit', readyNow: 'Pregătit acum' },
  de: { strongFit: 'Starke Passung', free: 'kostenlos', readyNow: 'Sofort bereit' },
  fr: { strongFit: 'Forte Correspondance', free: 'gratuit', readyNow: 'Prêt maintenant' },
  es: { strongFit: 'Alta Compatibilidad', free: 'gratuito', readyNow: 'Listo ahora' },
  it: { strongFit: 'Alta Compatibilità', free: 'gratuito', readyNow: 'Pronto ora' },
};

// Only the human-readable text fields (~75% smaller than the full AnalysisResult JSON)
export interface TranslatableFields {
  fitScore: { label: string; summary: string };
  strengths: Array<{ title: string; description: string; relevance: string }>;
  gaps: Array<{
    skill: string;
    currentLevel: string;
    requiredLevel: string;
    impact: string;
    closingPlan: string;
    timeToClose: string;
    resources: string[];
  }>;
  roleRecommendations: Array<{ title: string; reasoning: string; timeToReady: string }>;
  actionPlan: {
    thirtyDays: Array<{ action: string; timeEstimate: string; resource: string; expectedImpact: string }>;
    ninetyDays: Array<{ action: string; timeEstimate: string; resource: string; expectedImpact: string }>;
    twelveMonths: Array<{ action: string; timeEstimate: string; resource: string; expectedImpact: string }>;
  };
  salaryAnalysis: {
    currentRoleMarket: { region: string };
    targetRoleMarket: { region: string };
    growthPotential: string;
    bestMonetaryMove: string;
    negotiationTips: string[];
  };
  jobMatch?: {
    overallAdvice: string;
    cvSuggestions: Array<{ current: string; suggested: string; reasoning: string }>;
  };
  coverLetter?: {
    greeting: string;
    openingParagraph: string;
    bodyParagraphs: string[];
    closingParagraph: string;
    signature: string;
    weaknessAcknowledgments: string[];
    strengthHighlights: string[];
  };
}

export function extractTranslatableFields(result: AnalysisResult): TranslatableFields {
  const fields: TranslatableFields = {
    fitScore: { label: result.fitScore.label, summary: result.fitScore.summary },
    strengths: result.strengths.map(s => ({ title: s.title, description: s.description, relevance: s.relevance })),
    gaps: result.gaps.map(g => ({
      skill: g.skill,
      currentLevel: g.currentLevel,
      requiredLevel: g.requiredLevel,
      impact: g.impact,
      closingPlan: g.closingPlan,
      timeToClose: g.timeToClose,
      resources: g.resources,
    })),
    roleRecommendations: result.roleRecommendations.map(r => ({
      title: r.title,
      reasoning: r.reasoning,
      timeToReady: r.timeToReady,
    })),
    actionPlan: {
      thirtyDays: result.actionPlan.thirtyDays.map(a => ({ action: a.action, timeEstimate: a.timeEstimate, resource: a.resource, expectedImpact: a.expectedImpact })),
      ninetyDays: result.actionPlan.ninetyDays.map(a => ({ action: a.action, timeEstimate: a.timeEstimate, resource: a.resource, expectedImpact: a.expectedImpact })),
      twelveMonths: result.actionPlan.twelveMonths.map(a => ({ action: a.action, timeEstimate: a.timeEstimate, resource: a.resource, expectedImpact: a.expectedImpact })),
    },
    salaryAnalysis: {
      currentRoleMarket: { region: result.salaryAnalysis.currentRoleMarket.region },
      targetRoleMarket: { region: result.salaryAnalysis.targetRoleMarket.region },
      growthPotential: result.salaryAnalysis.growthPotential,
      bestMonetaryMove: result.salaryAnalysis.bestMonetaryMove,
      negotiationTips: result.salaryAnalysis.negotiationTips,
    },
  };

  if (result.jobMatch) {
    fields.jobMatch = {
      overallAdvice: result.jobMatch.overallAdvice,
      cvSuggestions: result.jobMatch.cvSuggestions.map(s => ({ current: s.current, suggested: s.suggested, reasoning: s.reasoning })),
    };
  }

  if (result.coverLetter) {
    const cl = result.coverLetter as CoverLetter;
    fields.coverLetter = {
      greeting: cl.greeting,
      openingParagraph: cl.openingParagraph,
      bodyParagraphs: cl.bodyParagraphs,
      closingParagraph: cl.closingParagraph,
      signature: cl.signature,
      weaknessAcknowledgments: cl.weaknessAcknowledgments,
      strengthHighlights: cl.strengthHighlights,
    };
  }

  return fields;
}

export function mergeTranslatedFields(result: AnalysisResult, t: TranslatableFields): AnalysisResult {
  const merged = { ...result };

  // fitScore — preserve score, overwrite only text (cast label: translation returns plain string)
  merged.fitScore = { ...result.fitScore, label: t.fitScore.label as typeof result.fitScore.label, summary: t.fitScore.summary };

  // strengths — merge by index, preserve tier
  merged.strengths = result.strengths.map((s, i) => {
    const ts = t.strengths[i];
    return ts ? { ...s, title: ts.title, description: ts.description, relevance: ts.relevance } : s;
  });

  // gaps — merge by index, preserve severity
  merged.gaps = result.gaps.map((g, i) => {
    const tg = t.gaps[i];
    return tg ? { ...g, skill: tg.skill, currentLevel: tg.currentLevel, requiredLevel: tg.requiredLevel, impact: tg.impact, closingPlan: tg.closingPlan, timeToClose: tg.timeToClose, resources: tg.resources } : g;
  });

  // roleRecommendations — merge by index, preserve fitScore and salaryRange
  merged.roleRecommendations = result.roleRecommendations.map((r, i) => {
    const tr = t.roleRecommendations[i];
    return tr ? { ...r, title: tr.title, reasoning: tr.reasoning, timeToReady: tr.timeToReady } : r;
  });

  // actionPlan — merge by index, preserve priority and resourceUrl
  const mergeActions = (
    originals: typeof result.actionPlan.thirtyDays,
    translated: TranslatableFields['actionPlan']['thirtyDays']
  ) => originals.map((a, i) => {
    const ta = translated[i];
    return ta ? { ...a, action: ta.action, timeEstimate: ta.timeEstimate, resource: ta.resource, expectedImpact: ta.expectedImpact } : a;
  });
  merged.actionPlan = {
    thirtyDays: mergeActions(result.actionPlan.thirtyDays, t.actionPlan.thirtyDays),
    ninetyDays: mergeActions(result.actionPlan.ninetyDays, t.actionPlan.ninetyDays),
    twelveMonths: mergeActions(result.actionPlan.twelveMonths, t.actionPlan.twelveMonths),
  };

  // salaryAnalysis — merge text only, preserve all numbers and currency
  merged.salaryAnalysis = {
    ...result.salaryAnalysis,
    currentRoleMarket: { ...result.salaryAnalysis.currentRoleMarket, region: t.salaryAnalysis.currentRoleMarket.region },
    targetRoleMarket: { ...result.salaryAnalysis.targetRoleMarket, region: t.salaryAnalysis.targetRoleMarket.region },
    growthPotential: t.salaryAnalysis.growthPotential,
    bestMonetaryMove: t.salaryAnalysis.bestMonetaryMove,
    negotiationTips: t.salaryAnalysis.negotiationTips,
  };

  // jobMatch — merge text only, preserve matchScore and skill arrays
  if (result.jobMatch && t.jobMatch) {
    merged.jobMatch = {
      ...result.jobMatch,
      overallAdvice: t.jobMatch.overallAdvice,
      cvSuggestions: result.jobMatch.cvSuggestions.map((s, i) => {
        const ts = t.jobMatch!.cvSuggestions[i];
        return ts ? { ...s, current: ts.current, suggested: ts.suggested, reasoning: ts.reasoning } : s;
      }),
    };
  }

  // coverLetter — merge all text fields, preserve toneUsed enum
  if (result.coverLetter && t.coverLetter) {
    const cl = result.coverLetter as CoverLetter;
    merged.coverLetter = {
      ...cl,
      greeting: t.coverLetter.greeting,
      openingParagraph: t.coverLetter.openingParagraph,
      bodyParagraphs: t.coverLetter.bodyParagraphs,
      closingParagraph: t.coverLetter.closingParagraph,
      signature: t.coverLetter.signature,
      weaknessAcknowledgments: t.coverLetter.weaknessAcknowledgments,
      strengthHighlights: t.coverLetter.strengthHighlights,
    } as unknown as typeof result.coverLetter;
  }

  return merged;
}

export function buildTranslationPrompt(
  fields: TranslatableFields,
  language: string
): { system: string; userMessage: string } {
  const langName = LANGUAGE_NAMES[language] || language;
  const ex = EXAMPLES[language] || EXAMPLES.fr;

  const system = `You are a professional translator specializing in career advisory and technology content. Your ONLY task is to translate a JSON object of career analysis text fields from English into ${langName}.

CRITICAL RULES:
1. Return ONLY the complete translated JSON object. No preamble, no explanation, no markdown fences — just pure JSON.
2. The JSON structure must be IDENTICAL to the input — same keys, same nesting, same array lengths.
3. Translate ALL string values into natural, professional ${langName}.
4. DO NOT change array lengths — translate each item, never add or remove items.

TRANSLATE into ${langName}:
- fitScore.label (e.g. "Strong Fit" → "${ex.strongFit}")
- fitScore.summary
- All strengths[]: title, description, relevance
- All gaps[]: skill (display name), currentLevel, requiredLevel, impact, closingPlan, timeToClose
- All gaps[].resources[] — translate descriptions but keep course/certification names in original (e.g. "Microsoft Learn: AZ-900 Learning Path (${ex.free})")
- All roleRecommendations[]: title, reasoning, timeToReady (e.g. "Ready now" → "${ex.readyNow}")
- All actionPlan items (thirtyDays, ninetyDays, twelveMonths): action, timeEstimate, resource, expectedImpact
- salaryAnalysis.currentRoleMarket.region, salaryAnalysis.targetRoleMarket.region
- salaryAnalysis.growthPotential, salaryAnalysis.bestMonetaryMove
- All salaryAnalysis.negotiationTips[]
- jobMatch.overallAdvice (if present)
- All jobMatch.cvSuggestions[]: current, suggested, reasoning (if present)
- coverLetter fields (if present): greeting, openingParagraph, bodyParagraphs[], closingParagraph, signature, weaknessAcknowledgments[], strengthHighlights[]

KEEP in English — do NOT translate:
- Technology names: Docker, Kubernetes, Python, TypeScript, etc.
- Certification names: AZ-900, AI-102, AWS Solutions Architect, etc.
- Course/platform names: Coursera, Microsoft Learn, fast.ai, etc.
- Company names: Microsoft, AWS, Google, Salesforce, SAP, etc.
- Currency codes: EUR, USD, etc.

Write naturally in ${langName} with professional career advice tone. Not machine-translated.`;

  return { system, userMessage: JSON.stringify(fields) };
}
