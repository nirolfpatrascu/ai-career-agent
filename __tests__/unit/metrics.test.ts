import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MetricsCollector } from '@/lib/metrics';

describe('MetricsCollector', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('step timing', () => {
    it('records step duration', () => {
      const collector = new MetricsCollector();
      const endStep = collector.startStep('extraction');
      endStep();
      const summary = collector.finalize();
      expect(summary.steps).toHaveLength(1);
      expect(summary.steps[0].name).toBe('extraction');
      expect(summary.steps[0].durationMs).toBeGreaterThanOrEqual(0);
    });

    it('tracks multiple steps', () => {
      const collector = new MetricsCollector();
      const end1 = collector.startStep('extraction');
      end1();
      const end2 = collector.startStep('gap_analysis');
      end2();
      const summary = collector.finalize();
      expect(summary.steps).toHaveLength(2);
      expect(summary.steps[0].name).toBe('extraction');
      expect(summary.steps[1].name).toBe('gap_analysis');
    });
  });

  describe('token accumulation', () => {
    it('accumulates tokens across steps', () => {
      const collector = new MetricsCollector();
      collector.recordStepTokens('extraction', 500, 200);
      collector.recordStepTokens('gap_analysis', 1000, 400);
      const summary = collector.finalize();
      expect(summary.totalTokensIn).toBe(1500);
      expect(summary.totalTokensOut).toBe(600);
    });

    it('records source for step tokens', () => {
      const collector = new MetricsCollector();
      collector.recordStepTokens('extraction', 500, 200, 'claude');
      const summary = collector.finalize();
      expect(summary.steps[0].source).toBe('claude');
    });

    it('merges tokens into existing step', () => {
      const collector = new MetricsCollector();
      const end = collector.startStep('extraction');
      end();
      collector.recordStepTokens('extraction', 500, 200, 'claude');
      const summary = collector.finalize();
      expect(summary.steps).toHaveLength(1);
      expect(summary.steps[0].tokensIn).toBe(500);
      expect(summary.steps[0].durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('cost calculation', () => {
    it('computes estimated cost correctly', () => {
      const collector = new MetricsCollector();
      // 1M tokens in ($3/M) + 1M tokens out ($15/M) = $18
      collector.recordStepTokens('test', 1_000_000, 1_000_000);
      const summary = collector.finalize();
      expect(summary.estimatedCostUSD).toBe(18);
    });

    it('handles zero tokens', () => {
      const collector = new MetricsCollector();
      const summary = collector.finalize();
      expect(summary.estimatedCostUSD).toBe(0);
      expect(summary.totalTokensIn).toBe(0);
      expect(summary.totalTokensOut).toBe(0);
    });

    it('computes fractional costs', () => {
      const collector = new MetricsCollector();
      // 10K in ($0.03) + 5K out ($0.075) = $0.105
      collector.recordStepTokens('test', 10_000, 5_000);
      const summary = collector.finalize();
      expect(summary.estimatedCostUSD).toBeCloseTo(0.105, 3);
    });
  });

  describe('scores and validation', () => {
    it('records scores', () => {
      const collector = new MetricsCollector();
      collector.recordScores({ fitScore: 7, matchScore: 65, atsScore: 72 });
      const summary = collector.finalize();
      expect(summary.scores.fitScore).toBe(7);
      expect(summary.scores.matchScore).toBe(65);
      expect(summary.scores.atsScore).toBe(72);
    });

    it('records validation stats', () => {
      const collector = new MetricsCollector();
      collector.recordValidation({ totalIssues: 5, errors: 1, warnings: 3, autoFixed: 2 });
      const summary = collector.finalize();
      expect(summary.validation.totalIssues).toBe(5);
      expect(summary.validation.errors).toBe(1);
      expect(summary.validation.warnings).toBe(3);
      expect(summary.validation.autoFixed).toBe(2);
    });
  });

  describe('flush', () => {
    it('logs metrics via logger and returns summary', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const collector = new MetricsCollector();
      collector.recordStepTokens('extraction', 500, 200);
      collector.recordScores({ fitScore: 7 });
      const summary = collector.flush();
      expect(summary.totalTokensIn).toBe(500);
      expect(summary.scores.fitScore).toBe(7);
      // Verify logger was called (it calls console.log in dev mode)
      expect(consoleSpy).toHaveBeenCalled();
      const logOutput = consoleSpy.mock.calls.find(
        call => typeof call[0] === 'string' && call[0].includes('analysis.metrics')
      );
      expect(logOutput).toBeDefined();
    });
  });
});
