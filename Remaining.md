# Remaining — Open Backlog Items

Last updated: Sprint 13 (2026-03-04)

---

## Done in Sprint 13

- [x] CI/CD pipeline (`.github/workflows/ci.yml` + `deploy.yml`) — 4 parallel jobs: lint, typecheck, test, build
- [x] Cover Letter tab — generic cover letter with tone selection, weakness framing, strength highlighting
- [x] GitHub Analysis tab — repo/language analysis, strengths, improvements, project idea recommendation
- [x] GitHub URL input in wizard (CV step)
- [x] ~40 new i18n keys across all 6 languages (en, ro, de, fr, es, it)
- [x] `githubUrl` added to `CareerQuestionnaire` + `AnalysisMetadata` types
- [x] Barrel exports for cover-letter + github-analysis prompts

---

## High Priority

### Rate Limiter Fix
**Problem**: In-memory `Map` resets on every Vercel serverless cold start. Rate limiting is effectively broken in production.
**Fix**: Migrate to Upstash Redis (free tier: 10K commands/day). Replace `lib/rate-limit.ts` with Redis-backed implementation.
**Files**: `lib/rate-limit.ts`, `package.json` (add `@upstash/redis`)
**Effort**: ~2 hours

### sitemap.xml
**Problem**: `robots.txt` references `/sitemap.xml` but it doesn't exist. Search engines following the robots.txt directive get a 404.
**Fix**: Create `app/sitemap.ts` using Next.js built-in sitemap generation. Include all public routes.
**Files**: `app/sitemap.ts` (new), verify `public/robots.txt`
**Effort**: ~30 minutes

### SSRF Hardening
**Problem**: URL-fetching endpoints (`/api/fetch-job`, `/api/upwork/import`) validate URLs but don't guard against DNS rebinding, redirect-to-internal, IPv4-mapped IPv6, or decimal/octal IP encodings.
**Fix**: Add a `validateExternalUrl()` helper that resolves DNS before connecting, blocks private IP ranges (including mapped formats), and follows redirects with the same validation.
**Files**: `lib/url-validator.ts` (new), `app/api/fetch-job/route.ts`, `app/api/upwork/import/route.ts`
**Effort**: ~3 hours

---

## Medium Priority

### WizardFlow Decomposition
**Problem**: `components/analyze/WizardFlow.tsx` is 906+ lines — a god component with 5 step renderers, file handling, auto-detection, job posting state, and form validation all in one file.
**Fix**: Extract each step into its own component (`LinkedInStep`, `CVStep`, `DetailsStep`, `JobsStep`, `ReviewStep`). Share state via props or a small context.
**Files**: `components/analyze/WizardFlow.tsx` → split into `components/analyze/steps/`
**Effort**: ~4 hours

### CVOptimizerPanel Decomposition
**Problem**: Still large after previous refactor. Mixes ATS scoring, keyword analysis, format issues, CV editor, and suggestion management.
**Fix**: Extract into `ATSScoreCard`, `KeywordAnalysis`, `FormatIssues`, `CVEditor`, `SuggestionList` sub-components.
**Files**: `components/results/CVOptimizerPanel.tsx` → split into `components/results/cv-optimizer/`
**Effort**: ~3 hours

### Dead Code Cleanup
**Problem**: Duplicate implementations scattered across the codebase.
- `CopyButton` — 5 independent implementations (UpworkPanel, LinkedInPlan, ChatPanel, CVOptimizerPanel, CoverLetterPanel)
- `STATUS_COLORS` — 4 definitions across job tracker components
**Fix**: Extract shared `CopyButton` into `components/shared/CopyButton.tsx`. Consolidate `STATUS_COLORS` into `lib/constants.ts`.
**Files**: Multiple result/shared components
**Effort**: ~2 hours

### Extract Shared Analysis Middleware
**Problem**: Rate limiting, IP extraction, and error response formatting are copy-pasted across every API route.
**Fix**: Create `lib/api-middleware.ts` with `withRateLimit()`, `getClientIp()`, and `apiError()` helpers.
**Files**: `lib/api-middleware.ts` (new), all `app/api/*/route.ts`
**Effort**: ~3 hours

### Test Coverage Expansion
**Problem**: 1011 tests pass but coverage is uneven. New features (cover letter, GitHub analysis, Upwork) have no unit tests.
**Fix**: Add tests for new prompt builders, API routes (with mocked Claude), and panel components.
**Files**: `__tests__/unit/cover-letter.test.ts`, `__tests__/unit/github-analysis.test.ts`, etc.
**Effort**: ~4 hours

### i18n Key Parity CI Check
**Problem**: No automated way to detect missing translation keys across languages. Keys get added to `en.json` but may be forgotten in other languages.
**Fix**: Add a script or vitest that compares all language files against `en.json` and fails if keys are missing.
**Files**: `scripts/check-i18n-parity.ts` (new), `.github/workflows/ci.yml`
**Effort**: ~1 hour

---

## Low Priority

### Analytics / Monitoring
**Problem**: Zero observability. No error tracking, no usage analytics, no performance monitoring.
**Fix**: Add Sentry for error tracking + Vercel Analytics for usage. Both have free tiers.
**Files**: `lib/sentry.ts` (new), `next.config.ts`, `package.json`
**Effort**: ~2 hours

### CSP unsafe-eval Removal
**Problem**: `middleware.ts` CSP includes `'unsafe-eval'` in `script-src` — required by some Next.js internals in dev mode but a security concern in production.
**Fix**: Test with Next.js 15+ which may not require `unsafe-eval`. Use nonce-based CSP if possible.
**Files**: `middleware.ts`
**Effort**: ~2 hours (mostly testing)

### GitHub API Auth Token
**Problem**: Unauthenticated GitHub API has a 60 requests/hour limit. Heavy usage will hit this quickly.
**Fix**: Add a GitHub personal access token (classic, no scopes needed for public data) as `GITHUB_TOKEN` env var. Raises limit to 5,000/hour.
**Files**: `app/api/analyze-github/route.ts`, `.env.example`
**Effort**: ~15 minutes
