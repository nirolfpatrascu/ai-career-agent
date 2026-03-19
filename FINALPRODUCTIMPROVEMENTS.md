# Final Product Improvements — Sprint Plan & Architecture

## Infrastructure Reality Check

Before planning, here's what already exists that matters:

| Asset | Status | Implication |
|---|---|---|
| `analyses` table (full JSONB) | ✅ Supabase | Analyses are already stored — feedback loop is feasible |
| `feedback` table (`analysis_id` FK) | ✅ Supabase | Can join feedback to output for retraining |
| `lib/knowledge/` (salary, skills, linkedin playbook, cv-practices) | ✅ Exists | Golden examples slot naturally alongside this |
| A/B testing | ❌ Nothing | Build from scratch |
| Golden examples | ❌ Nothing | Build from scratch |
| Quality CI | ✅ GitHub Actions (lint/type/build only) | Extend, don't rebuild |
| Feedback `selectedIssues` | ✅ Stored | Already collecting structured issue types |

---

## Feature-by-Feature Architecture Analysis

---

### Feature 1: Golden Examples

**What "golden examples" actually do in an LLM pipeline:**
They are few-shot examples injected into system prompts. They work because Claude pattern-matches quality — showing it 2 excellent cover letters makes it write closer to that standard than any instruction can. This is the highest-ROI change you can make to output quality, measurably.

**Scope: 3 types, 5 each:**
- **LinkedIn**: About section, Headline, Summary-of-skills block
- **CV**: Profile summary + 3 quantified experience bullets per example
- **Cover letter**: Full 3-paragraph letter (matches the ≤3 paragraph rule)

**File structure:**
```
lib/golden-examples/
  linkedin-about.ts       # 5 examples with metadata
  linkedin-headline.ts    # 5 examples
  cv-profiles.ts          # 5 CV summaries + bullet sets
  cover-letters.ts        # 5 cover letters
  select.ts               # Role/industry keyword matching (no embeddings needed yet)
```

**The selection logic:** simple keyword matching on `targetRole` + `industry`. Pick 1–2 examples per prompt injection. Embeddings/semantic search is a later optimization — keyword matching covers 80% of the value at 5% of the cost.

**Format of each example:**
```typescript
interface GoldenExample {
  id: string;
  role: string;           // "Product Manager"
  industry: string;       // "tech" | "finance" | "healthcare" | "general"
  seniority: string;      // "senior" | "mid" | "junior" | "any"
  content: string;        // The actual text
  whyItWorks: string;     // 1 sentence — used in judge prompts + system prompt commentary
  keywords: string[];     // For matching
}
```

**Integration points:**
1. `lib/prompts/cover-letter.ts` — inject 1 matching example with `[WHY IT WORKS: ...]` annotation
2. LinkedIn plan generation — inject 1 About + 1 Headline example
3. `lib/prompts/gap-analysis.ts` CV suggestions block — inject 1 CV bullets example

**Content curation note:** This is the hardest part and the most important. Bad golden examples actively hurt output quality. Each example needs to pass a human review against a checklist: quantified impact, no buzzwords, industry-specific language, correct length, no AI-sounding phrases.

---

### Feature 2: A/B Testing

**Two levels, built independently:**

**Level A — Prompt A/B (what matters most):**
Test hypothesis: *"Golden example injection improves output quality as measured by positive feedback rate."*

Architecture:
```
New Supabase table: experiments
  experiment_id TEXT,
  user_id_hash TEXT,    -- SHA-256(user_id + experiment_id), never raw user_id
  variant TEXT,         -- 'control' | 'treatment'
  analysis_id UUID FK,
  created_at
```

Variant assignment: deterministic hash — `sha256(userId + experimentId) % 2`. Same user always gets the same variant. Stable across sessions. No cookies needed server-side.

Tracking: add `metadata.experimentVariant` to the SSE `complete` event and to the stored `analyses` row.

Metrics query (raw Supabase SQL):
```sql
SELECT
  e.variant,
  COUNT(*) as analyses,
  AVG(f.rating::int) as positive_rate
FROM experiments e
JOIN feedback f ON e.analysis_id = f.analysis_id
GROUP BY e.variant;
```

**Level B — UI A/B (secondary, lower priority):**
Next.js middleware sets a cookie on first visit, Vercel Analytics tracks page events per variant. Useful for landing page headline tests, CTA copy. Low engineering effort once Level A is built.

**What to test first:** The single most valuable first experiment is **golden examples injection vs. control** (Feature 1 vs. baseline). This ties Features 1 and 2 together in the same sprint.

---

### Feature 3: Automated Testing Against Golden Examples

**What this is NOT:** it is not testing React components. It is **quality regression testing** — given a synthetic CV + job posting, run the full pipeline and judge whether outputs meet quality standards using Claude-as-judge.

**Why this matters:** Every prompt change is a quality change. Without regression tests, you are flying blind. A prompt that makes cover letters shorter might also make them worse. You need to catch that before deploying.

**Test harness:**
```
__tests__/quality/
  fixtures/
    01-senior-engineer/     # CV + JD + expected thresholds
    02-product-manager/
    03-career-changer/
    04-junior-developer/
    05-non-tech-role/       # covers breadth
  run-quality.test.ts       # Vitest integration, calls real API
  judge.ts                  # Claude-as-judge prompt
  rubric.ts                 # Scoring dimensions + thresholds
```

**Rubric (5 dimensions, 1–5 scale each):**
1. **Specificity** — Uses language from the actual JD, not generic
2. **Accuracy** — No hallucinated facts, no invented experience
3. **Actionability** — Reader knows exactly what to do next
4. **Compactness** — Right length, no filler
5. **Quality vs golden** — Comparable to the injected golden example

Pass = average ≥ 3.5/5. Fail = any single dimension ≤ 2.

**Run schedule:** Weekly (Monday 6am via cron) + on `workflow_dispatch` for manual trigger. NOT on every PR — too slow and too expensive. CI on PRs stays lint/typecheck/unit-tests only.

**Cost per run:** 5 fixtures × 3 sections each × 1 judge call = ~15 Claude calls ≈ $0.50–1.50 per week.

**Report format:** JSON to file + GitHub Actions summary table. Optionally pipe to Slack webhook.

---

### Feature 4: Feedback Collection → Monthly Retraining

**Critical framing:** Claude fine-tuning is not publicly available. "Retraining" here means **prompt curation** — high-rated real-user outputs get promoted to golden examples, which get injected into future prompts. This is actually better than fine-tuning for this use case because:
- It is interpretable (you can read what is being promoted)
- It is controllable (human approval gate)
- It is fast (no training cycle)
- It compounds: each month's golden examples are better than last month's

**The full data pipeline already partially exists:**
- `analyses` table stores the full JSONB output ✓
- `feedback` table has `analysis_id` FK ✓
- `feedback` stores `selected_issues` ✓

**What's missing:**
1. The export + curation script
2. The human review step
3. The promotion script that updates golden example files

**Monthly loop:**
```
Week 1 of month:
  1. Run: node scripts/export-golden-candidates.cjs
     → Queries: analyses JOIN feedback WHERE rating=true AND selected_issues='[]'
     → Groups by section type (cover_letter, linkedin_about, etc.)
     → Exports top 20 candidates per section to review/YYYY-MM/candidates.md

  2. Human reviews candidates.md (15–30 min)
     → Annotates: APPROVE / REJECT / NEEDS_EDIT

  3. Run: node scripts/promote-to-golden.cjs --month=YYYY-MM
     → Reads approved candidates
     → Updates lib/golden-examples/*.ts
     → Creates PR for review

  4. Merge PR → triggers quality test run → confirm no regressions
```

**Privacy note:** Full analysis results are already stored. Before promoting user outputs to golden examples, verify the Privacy Policy covers internal quality improvement. Add a clause if not already present.

---

## Sprint Plan

**Total: 4 sprints, ~1 week each**

---

### Sprint 1 — Golden Examples Foundation

**Goal:** Build the library, inject into prompts, deploy. Immediate quality improvement with no new infrastructure.

| # | Task | Effort |
|---|---|---|
| 1.1 | Create `lib/golden-examples/` structure and TypeScript types | S |
| 1.2 | Write + curate 5 LinkedIn About examples (tech, finance, mid-career, senior, career changer) | M |
| 1.3 | Write + curate 5 LinkedIn Headline examples | S |
| 1.4 | Write + curate 5 CV profile summaries + bullet sets | M |
| 1.5 | Write + curate 5 cover letters (aligned with 3-para rule + no AI chars) | M |
| 1.6 | Build `select.ts` — keyword-based 1–2 example picker | S |
| 1.7 | Inject into `cover-letter.ts` prompt | S |
| 1.8 | Inject into LinkedIn plan generation | S |
| 1.9 | Inject into CV suggestions block | S |
| 1.10 | Manual QA: run 3 test analyses, verify richer output | S |

**Deliverable:** Noticeably better cover letters and LinkedIn sections. Zero schema changes.

**Risk:** Content curation (1.2–1.5) is the bottleneck. Set aside 3–4 hours for writing quality examples.

---

### Sprint 2 — A/B Testing Infrastructure

**Goal:** Variant assignment, tracking, and first live experiment (golden examples vs. control).

| # | Task | Effort |
|---|---|---|
| 2.1 | Supabase migration: `experiments` table | S |
| 2.2 | `lib/ab-testing.ts`: `assignVariant()`, `trackExperiment()` | S |
| 2.3 | Integrate variant assignment into `analyze-stream/route.ts` | S |
| 2.4 | Add `experimentVariant` to analysis metadata + `analyses` stored row | S |
| 2.5 | Configure first experiment: `golden-examples-v1` (control = no examples) | S |
| 2.6 | UI A/B middleware (Next.js edge) for landing page CTA test | M |
| 2.7 | Internal dashboard SQL query for variant comparison | S |
| 2.8 | Document experiment protocol (how to read results, significance thresholds) | S |

**Deliverable:** A/B experiment live. Data flowing. First results in ~2 weeks.

---

### Sprint 3 — Automated Quality Testing

**Goal:** Weekly CI quality gate that catches prompt regressions before they reach users.

| # | Task | Effort |
|---|---|---|
| 3.1 | Write 5 synthetic CV + JD test fixtures (realistic, privacy-safe) | M |
| 3.2 | Build `judge.ts` — Claude-as-judge prompt with 5-dimension rubric | M |
| 3.3 | Build `rubric.ts` — scoring logic, pass/fail thresholds | S |
| 3.4 | Build `run-quality.test.ts` — fixture runner, calls real API | M |
| 3.5 | GitHub Actions `quality.yml` (weekly cron + `workflow_dispatch`) | S |
| 3.6 | Quality report: JSON + GitHub Actions summary table | S |
| 3.7 | Test both A/B variants in quality runner (baseline vs. golden examples) | S |
| 3.8 | Set initial quality baselines from first run | S |

**Deliverable:** Weekly quality report. Any future prompt change has a measurable quality impact.

---

### Sprint 4 — Monthly Retraining Pipeline

**Goal:** Close the loop. Real user feedback feeds back into golden examples.

| # | Task | Effort |
|---|---|---|
| 4.1 | Audit feedback table: ensure `analysis_id` always populated | S |
| 4.2 | `scripts/export-golden-candidates.cjs` — SQL join + section extraction | M |
| 4.3 | Human review format: `review/YYYY-MM/candidates.md` with APPROVE/REJECT | S |
| 4.4 | `scripts/promote-to-golden.cjs` — reads approvals, updates JSON files | M |
| 4.5 | Monthly GitHub Actions cron job | S |
| 4.6 | Run first export on existing data | S |
| 4.7 | Review + promote first real-user examples | S |
| 4.8 | Privacy policy check / update for internal quality use | S |
| 4.9 | Write "Monthly Quality Review" runbook | S |

**Deliverable:** First real-world golden examples promoted. The system self-improves.

---

## Dependency Graph

```
Sprint 1 (Golden Examples)
    │
    ├──→ Sprint 2 (A/B) — uses Sprint 1 examples as the "treatment"
    │        │
    │        └──→ Sprint 4 (Retraining) — needs Sprint 2 analysis_id tracking in experiments
    │
    └──→ Sprint 3 (Quality Tests) — uses Sprint 1 examples as benchmarks
              │
              └──→ Sprint 4 — quality tests validate each monthly promotion
```

Sprint 3 can start in parallel with Sprint 2 after Sprint 1 is done.

---

## Key Decisions to Make Before Starting

1. **Content curation ownership**: Who writes the 5 golden examples per category? This is the most important decision — they should be written by someone who has reviewed dozens of real LinkedIn profiles and CVs, not generated by Claude (irony aside).

2. **A/B traffic threshold**: With low/moderate traffic, you need ~100 analyses per variant to see meaningful signal. Set a minimum run duration (2 weeks) before reading results.

3. **What counts as "retraining-eligible" feedback**: Currently `rating=true AND selectedIssues=[]` (positive, no issues). Should you also promote `rating=false` outputs with specific issues as negative examples? Recommend: start positive-only, add negative examples in a later iteration.

4. **Golden examples for non-English users**: The app supports 6 languages. Golden examples in English only will slightly dilute the few-shot benefit for non-English runs. Acceptable for now — address in a later sprint when real translated examples exist.
