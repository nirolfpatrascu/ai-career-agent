# Sprint 7 — Batch 1 Integration Guide

## Files Delivered

```
lib/prompts/ats-scoring.ts      → NEW file
lib/ats-format-check.ts         → NEW file
lib/knowledge/company-ats.ts    → NEW file
app/api/ats-score/route.ts      → NEW file
components/results/ATSScorePanel.tsx → NEW file
```

## Integration Steps

### 1. Merge types into `lib/types.ts`

Add all interfaces from `types-ats-additions.ts` to the end of your existing `lib/types.ts`.

Then add the `atsScore` field to your existing `AnalysisResult` interface:

```typescript
interface AnalysisResult {
  // ... existing fields ...
  jobMatch?: JobMatch;
  atsScore?: ATSScoreResult;  // ← ADD THIS
}
```

### 2. Add ATS tab to ChapterNav

In `components/results/ChapterNav.tsx`, add the new tab constant and entry. Based on the existing pattern (conditional tabs like jobMatch/cvSuggestions):

```typescript
// Add to the tabs array (after 'cv-suggestions' or wherever appropriate)
// This tab only shows when atsScore exists AND a job posting was provided

// In your tab definitions:
{ id: 'ats-score', icon: Shield, labelKey: 'ats.tab' }

// Import Shield from lucide-react
```

**Conditional rendering** — same pattern as jobMatch:
```typescript
// Only include the ats-score tab when data exists
if (analysisResult.atsScore) {
  tabs.push({ id: 'ats-score', icon: Shield, labelKey: 'ats.tab' });
}
```

### 3. Add ATS panel rendering in analyze/page.tsx

In the section where you render panels based on the active tab:

```tsx
import { ATSScorePanel } from '@/components/results/ATSScorePanel';

// In the render switch/conditional:
{activeTab === 'ats-score' && analysisResult.atsScore && (
  <ATSScorePanel atsScore={analysisResult.atsScore} />
)}
```

### 4. Add SectionIntro message for ATS tab

In `components/results/SectionIntro.tsx`, add the 'atsScore' section:

```typescript
// In your section config/messages map:
atsScore: {
  key: 'ats.sectionIntro'
}
```

### 5. Trigger ATS scoring during analysis

**Option A: Call ATS scoring as part of streaming analysis** (recommended)

In `app/api/analyze-stream/route.ts`, after the existing Claude calls (skill extraction, gap analysis, career plan), add a 4th step if a job posting was provided:

```typescript
// After existing analysis steps, if job posting exists:
if (questionnaire.jobPosting) {
  // Send SSE progress update
  sendEvent({ step: 'ats', status: 'Scoring ATS compatibility...' });

  // Call the ATS scoring logic directly (don't HTTP call your own API)
  // Import and use the functions from lib/prompts/ats-scoring.ts
  const extractionPrompt = buildATSKeywordExtractionPrompt(questionnaire.jobPosting);
  const extractionResponse = await callClaude(extractionPrompt, { maxTokens: 4000, temperature: 0.1 });
  // ... match, compute, format check ...

  result.atsScore = atsResult;
}
```

**Option B: Separate API call from frontend** (if you prefer independence)

After the main analysis completes, call `/api/ats-score` from the frontend with the CV text and job posting, then merge the result.

### 6. Merge translations

For each of the 6 language files (`en.json`, `ro.json`, `de.json`, `fr.json`, `es.json`, `it.json`), add all the ATS keys from `ats-translations.ts`.

The keys are organized by language in the translation file — just copy the key-value pairs into each respective JSON file.

### 7. Add streaming progress message

In `components/analyze/StreamingProgress.tsx`, add a step for ATS scoring:

```typescript
// In your progress steps array:
{ id: 'ats', label: 'Scoring ATS compatibility...', labelKey: 'progress.ats' }
```

Add translation key `progress.ats` to all 6 language files:
- EN: "Scoring ATS compatibility..."
- RO: "Se calculează compatibilitatea ATS..."
- DE: "ATS-Kompatibilität wird bewertet..."
- FR: "Évaluation de la compatibilité ATS..."
- ES: "Evaluando compatibilidad ATS..."
- IT: "Valutazione compatibilità ATS..."

---

## Testing Checklist

- [ ] Upload a CV PDF + provide a job posting → ATS tab appears in results
- [ ] ATS score shows 0-100% with color coding
- [ ] Keyword analysis shows matched/semantic/missing with correct categorization
- [ ] Format issues display with severity colors and fix suggestions
- [ ] Company ATS info shows when company is recognized
- [ ] Recommendations expand on click to show examples
- [ ] All text is translated (switch to RO/DE/FR/ES/IT and verify)
- [ ] Works on mobile (responsive layout)
- [ ] Without job posting → ATS tab does NOT appear
- [ ] API handles errors gracefully (malformed input, Claude timeout)

---

## What's Next (Batch 2)

Once this is tested and working, the next batch will integrate ATS scoring into the streaming analysis pipeline directly (so it runs as part of the main analysis flow rather than a separate call). Then we move to Sprint 8 (Real Salary Data).
