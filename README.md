# CareerLens AI

**AI-Powered Career Growth Advisor** — Upload your CV, get a personalized career strategy in 60 seconds.

> Gap analysis, learning plans, salary benchmarks, role recommendations, and CV optimization — career coaching that used to cost $500/hour, now powered by AI.

🔗 **Live Demo:** [ai-career-agent-gamma.vercel.app](https://ai-career-agent-gamma.vercel.app) · [Try with sample data](https://ai-career-agent-gamma.vercel.app/analyze?demo=true)

---

## What It Does

CareerLens AI analyzes your CV against your target role and generates:

- **Fit Score** (1-10) with detailed assessment
- **Strengths** identified and ranked by relevance (differentiator / strong / supporting)
- **Skill Gaps** color-coded by severity (critical / moderate / minor) with closing plans, time estimates, and specific resources
- **Role Recommendations** — Top 3 best-fit roles with salary ranges and target companies
- **Action Plan** — 30-day quick wins, 90-day skill building, 12-month career trajectory
- **Salary Analysis** — Location-aware market ranges for current and target roles, growth potential, negotiation tips
- **Job Match** (optional) — Paste a job posting to get ATS match score, missing keywords, and CV rewrite suggestions
- **PDF Report** — Download a 5-page formatted report

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14** (App Router) | Fullstack in one repo, serverless API routes |
| Language | **TypeScript** (strict) | Type safety, better AI code generation |
| Styling | **Tailwind CSS** | Utility-first, dark theme, fast iteration |
| AI Engine | **Claude Sonnet 4** (Anthropic) | Best reasoning for analysis, structured JSON output |
| PDF Parsing | **pdf-parse** | Server-side CV text extraction |
| PDF Generation | **@react-pdf/renderer** | Client-side downloadable reports |
| Deployment | **Vercel** | Zero-config, serverless, free tier |

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
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add ANTHROPIC_API_KEY

# Deploy to production
vercel --prod
```

### Vercel Configuration Notes

- **Function timeout:** 60s on free tier (tight for 3 Claude calls). Analysis runs ~90s locally; Vercel's faster infra typically handles it under 60s. If timeouts occur, upgrade to Pro ($20/mo) for 300s timeout.
- **No database needed** — stateless, analysis happens in-memory per request.
- **No build secrets** — only `ANTHROPIC_API_KEY` needed at runtime.

## Project Structure

```
ai-career-agent/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── analyze/page.tsx         # Upload + questionnaire + results
│   ├── error.tsx                # Global error page
│   ├── not-found.tsx            # 404 page
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
│   └── prompts/                 # Claude prompt templates (core IP)
│       ├── skill-extraction.ts  # CV → structured profile
│       ├── gap-analysis.ts      # Profile → gaps + strengths + roles
│       ├── career-plan.ts       # Gaps → action plan + salary benchmarks
│       ├── job-matcher.ts       # CV + job posting → match analysis
│       └── cv-rewriter.ts       # CV → optimization suggestions
└── public/                      # Static assets
```

## Features

### Core Analysis Pipeline
- 3-4 sequential Claude API calls per analysis
- Calls 3 & 4 parallelized for performance
- Structured JSON output with TypeScript validation
- Fallback defaults if any call fails

### UI
- Dark theme (Linear/Vercel aesthetic)
- Drag-and-drop PDF upload with validation
- Animated progress screen with rotating status messages
- Expandable gap cards with severity color coding
- Tabbed action plan (30/90/365 day)
- Visual salary comparison bars
- Fully responsive (mobile-first)
- Demo mode with sample data (no API call needed)

### Error Handling
- React ErrorBoundary wrapping all pages
- Next.js error.tsx + not-found.tsx
- API-level error messages (not stack traces)
- Rate limiting (10 req/hour/IP)
- File validation (PDF only, 5MB max)

### PDF Report
- 5-page dark-themed downloadable PDF
- Generated client-side with @react-pdf/renderer
- Unicode character sanitization for font compatibility
- Includes all analysis sections

## API Reference

### POST /api/analyze

Main analysis endpoint. Accepts multipart form data.

**Request:**
- `cv` (File) — PDF, max 5MB
- `questionnaire` (JSON string) — `{ currentRole, targetRole, yearsExperience, country, workPreference, currentSalary?, targetSalary?, jobPosting? }`

**Response:** Full `AnalysisResult` JSON (see `lib/types.ts`)

**Latency:** 30-90 seconds (3-4 Claude calls)

### POST /api/match-job

Match CV against a specific job posting.

### POST /api/rewrite-cv

Generate CV optimization suggestions for a target role.

## Development

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Cost Estimates

| Usage | Monthly Cost |
|-------|-------------|
| 10 analyses | ~$2 |
| 100 analyses | ~$20 |
| 1,000 analyses | ~$200 |
| 5,000 analyses | ~$1,000 |

Each analysis uses ~11-17K input tokens + ~10-12K output tokens across 3-4 Claude calls.

## Roadmap (Post-MVP)

- [ ] User accounts + saved analysis history
- [ ] Stripe payment integration
- [ ] LinkedIn profile import
- [ ] Real-time job market data integration
- [ ] Multi-language support
- [ ] A/B testing on prompts
- [ ] Upstash Redis for production rate limiting
- [ ] UI revamp with enhanced animations

## Built By

**Florin Pătrașcu** — Enterprise automation architect transitioning to AI solutions.

- [LinkedIn](https://linkedin.com/in/florinpatrascu)
- [GitHub](https://github.com/nirolfpatrascu)

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Claude Sonnet 4 by Anthropic.*
