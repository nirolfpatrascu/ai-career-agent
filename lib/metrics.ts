// ============================================================================
// GapZero — Analysis Metrics Collector
// Tracks step timings, token usage, scores, and validation stats.
// ============================================================================

import { logger } from './logger';

// Pricing: Claude 3.5 Sonnet approximate rates (USD per million tokens)
const INPUT_COST_PER_M = 3;
const OUTPUT_COST_PER_M = 15;

export interface StepMetric {
  name: string;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
  source?: string;
}

export interface MetricsSummary {
  totalDurationMs: number;
  steps: StepMetric[];
  totalTokensIn: number;
  totalTokensOut: number;
  estimatedCostUSD: number;
  scores: {
    fitScore?: number;
    matchScore?: number;
    atsScore?: number;
  };
  validation: {
    totalIssues: number;
    errors: number;
    warnings: number;
    autoFixed: number;
  };
}

export class MetricsCollector {
  private steps: StepMetric[] = [];
  private activeTimers: Map<string, number> = new Map();
  private scores: MetricsSummary['scores'] = {};
  private validation: MetricsSummary['validation'] = {
    totalIssues: 0,
    errors: 0,
    warnings: 0,
    autoFixed: 0,
  };
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  startStep(name: string): () => void {
    const start = Date.now();
    this.activeTimers.set(name, start);
    return () => {
      const duration = Date.now() - start;
      this.activeTimers.delete(name);
      // Find existing step or create new one
      const existing = this.steps.find(s => s.name === name);
      if (existing) {
        existing.durationMs = duration;
      } else {
        this.steps.push({ name, durationMs: duration, tokensIn: 0, tokensOut: 0 });
      }
    };
  }

  recordStepTokens(step: string, tokensIn: number, tokensOut: number, source?: string): void {
    const existing = this.steps.find(s => s.name === step);
    if (existing) {
      existing.tokensIn = tokensIn;
      existing.tokensOut = tokensOut;
      if (source) existing.source = source;
    } else {
      this.steps.push({ name: step, durationMs: 0, tokensIn, tokensOut, source });
    }
  }

  recordScores(scores: { fitScore?: number; matchScore?: number; atsScore?: number }): void {
    this.scores = { ...this.scores, ...scores };
  }

  recordValidation(stats: { totalIssues: number; errors: number; warnings: number; autoFixed: number }): void {
    this.validation = stats;
  }

  finalize(): MetricsSummary {
    const totalDurationMs = Date.now() - this.startTime;
    const totalTokensIn = this.steps.reduce((sum, s) => sum + s.tokensIn, 0);
    const totalTokensOut = this.steps.reduce((sum, s) => sum + s.tokensOut, 0);
    const estimatedCostUSD = Number(
      ((totalTokensIn / 1_000_000) * INPUT_COST_PER_M +
        (totalTokensOut / 1_000_000) * OUTPUT_COST_PER_M).toFixed(4)
    );

    return {
      totalDurationMs,
      steps: [...this.steps],
      totalTokensIn,
      totalTokensOut,
      estimatedCostUSD,
      scores: { ...this.scores },
      validation: { ...this.validation },
    };
  }

  flush(): MetricsSummary {
    const summary = this.finalize();
    logger.info('analysis.metrics', {
      totalDurationMs: summary.totalDurationMs,
      totalTokensIn: summary.totalTokensIn,
      totalTokensOut: summary.totalTokensOut,
      estimatedCostUSD: summary.estimatedCostUSD,
      steps: summary.steps.map(s => ({ name: s.name, ms: s.durationMs, in: s.tokensIn, out: s.tokensOut })),
      scores: summary.scores,
      validation: summary.validation,
    });
    return summary;
  }
}
