# GapZero

**AI-Powered Career Growth Advisor** — Upload your CV, get a personalized career strategy in under 2 minutes.

> Gap analysis, learning plans, salary benchmarks, role recommendations, and CV optimization — career coaching that used to cost $500/hour, now powered by AI.

🔗 **Live:** [gapzero.app](https://gapzero.app) · [Try Demo](https://gapzero.app/analyze?demo=true)

![GapZero](docs/gapzero-thumbnail.png)

---

## Screenshots

<details>
<summary>📊 Full Results Dashboard (click to expand)</summary>

![Results Dashboard](docs/screenshot-results.png)

</details>

The results page includes: fit score gauge, strengths panel, skill gaps with severity ratings, role recommendations with salary ranges, 30/90/365-day action plan, salary benchmarks with visual comparison bars, and optional job match analysis.

---

## What It Does

GapZero analyzes your CV against your target role and generates:

- **Fit Score** (1-10) with detailed assessment
- **Strengths** identified and ranked by relevance (differentiator / strong / supporting)
- **Skill Gaps** color-coded by severity (critical / moderate / minor) with closing plans, time estimates, and specific resources
- **Role Recommendations** — Top 3 best-fit roles with salary ranges and target companies
- **Action Plan** — 30-day quick wins, 90-day skill building, 12-month career trajectory
- **Salary Analysis** — Location-aware market ranges for current and target roles, EMEA remote rates, growth potential, negotiation tips
- **Job Match** (optional) — Paste a job posting to get ATS match score, missing keywords, and CV rewrite suggestions
- **PDF Report** — Download a formatted report with all sections

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14** (App Router) | Fullstack in one repo, serverless API routes |
| Language | **TypeScript** (strict) | Type safety, better AI code generation |
| Styling | **Tailwind CSS** | Utility-first, dark theme, fast iteration |
| AI Engine | **Claude Sonnet 4** (Anthropic) | Best reasoning for analysis, structured JSON output |
| PDF Parsing | **pdf-parse** | Server-side CV text extraction |
| PDF Generation | **@react-pdf/renderer** | Client-side downloadable reports |
| Deployment | **Vercel** | Zero-config, serverless, edge network |

## Architecture

```
User uploads CV (PDF) + fills questionnaire
         │
         ▼
   POST /api/analyze
         │
    ┌────┴────┐
    │ pdf-parse │ → Extract text from CV
    └────┬────┘
         │
    ┌────┴────────────────┐
    │ Claude API Call #1   │ → Extract skills, experience, certifications
    └────┬────────────────┘
         │
    ┌────┴────────────────┐
    │ Claude API Call #2   │ → Gap analysis, strengths, role recommendations
    └────┬────────────────┘
         │
    ┌────┴─────────────────────────────┐
    │ Claude #3 + #4 (PARALLEL)        │
    │ ├─ Career plan + salary benchmarks│
    │ └─ Job match (if posting provided)│
    └────┬─────────────────────────────┘
         │
         ▼
   Structured JSON → Results Dashboard → PDF Download
```

**Cost per analysis:** ~$0.20 (Claude Sonnet 4)

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/settings/keys))
- $5+ API credits loaded

### Setup

```bash
# Clone
git clone https://github.com/nirolfpatrascu/ai-career-agent.git
cd ai-career-agent

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | — | Your Anthropic API key |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model to use |
| `RATE_LIMIT_PER_HOUR` | No | `10` | Max analyses per hour per IP |

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nirolfpatrascu/ai-career-agent&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20for%20Claude%20AI&envLink=https://console.anthropic.com/settings/keys)

### Manual Deploy

```bash
npm i -g vercel
vercel
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

> **Note:** Analysis runs ~90s (3-4 Claude calls). Free tier has 60s timeout — upgrade to Pro ($20/mo) for 300s if needed.

## Project Structure

```
ai-career-agent/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── analyze/page.tsx         # Upload + questionnaire + results
│   ├── api/
│   │   ├── analyze/route.ts     # Main analysis pipeline
│   │   ├── match-job/route.ts   # Job matching endpoint
│   │   └── rewrite-cv/route.ts  # CV optimization endpoint
│   └── globals.css              # Tailwind + custom styles
├── components/
│   ├── landing/                 # Hero, Features, HowItWorks, CTA
│   ├── analyze/                 # CVUpload, Questionnaire, AnalysisProgress
│   ├── results/                 # FitScore, Strengths, Gaps, Roles, ActionPlan, Salary, JobMatch
│   └── shared/                  # Header, Footer, PDFReport, ErrorBoundary
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── claude.ts                # Anthropic SDK wrapper with retry logic
│   ├── pdf-parser.ts            # PDF text extraction
│   ├── rate-limit.ts            # In-memory rate limiter
│   ├── utils.ts                 # Helpers (formatting, colors, validation)
│   ├── demo.ts                  # Sample data for demo mode
│   └── prompts/                 # Claude prompt templates
│       ├── skill-extraction.ts  # CV → structured profile
│       ├── gap-analysis.ts      # Profile → gaps + strengths + roles
│       ├── career-plan.ts       # Gaps → action plan + salary benchmarks
│       ├── job-matcher.ts       # CV + job posting → match analysis
│       └── cv-rewriter.ts       # CV → optimization suggestions
└── docs/                        # Screenshots and assets
```

## Key Features

**Analysis Pipeline** — 3-4 sequential Claude API calls with calls 3 & 4 parallelized. Structured JSON output with TypeScript validation and fallback defaults.

**Smart Salary Logic** — Auto-detects remote work preference and shows EMEA/EU remote market rates. Cross-currency normalization (e.g., RON → EUR) ensures accurate visual comparisons.

**UI** — Dark theme (Linear/Vercel aesthetic), drag-and-drop PDF upload, animated progress screen, expandable gap cards with severity color coding, tabbed action plan, visual salary comparison bars. Fully responsive.

**Error Handling** — React ErrorBoundary, API-level error messages, rate limiting (10 req/hour/IP), file validation (PDF only, 5MB max).

**PDF Report** — Dark-themed downloadable report generated client-side with @react-pdf/renderer. Unicode sanitization for font compatibility.

## Cost Estimates

| Usage | Monthly Cost |
|-------|-------------|
| 10 analyses | ~$2 |
| 100 analyses | ~$20 |
| 1,000 analyses | ~$200 |

Each analysis uses ~11-17K input tokens + ~10-12K output tokens across 3-4 Claude calls.

## Roadmap

- [ ] Multi-language support (EN / RO / DE)
- [ ] User accounts + saved analysis history
- [ ] Stripe payment integration
- [ ] LinkedIn profile import
- [ ] Real-time job market data
- [ ] Upstash Redis for production rate limiting

## Built By

**Florin Patrascu** — Enterprise automation architect transitioning to AI solutions.

- [LinkedIn](https://linkedin.com/in/florinpatrascu)
- [GitHub](https://github.com/nirolfpatrascu)

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Claude Sonnet 4 by Anthropic.*
