import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, startTimer } from '@/lib/logger';

describe('Logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('log levels', () => {
    it('logger.debug outputs via console.log', () => {
      logger.debug('test.event', { key: 'value' });
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('test.event');
    });

    it('logger.info outputs via console.log', () => {
      logger.info('info.event');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('info.event');
    });

    it('logger.warn outputs via console.warn', () => {
      logger.warn('warn.event', { detail: 'something' });
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      const output = consoleSpy.warn.mock.calls[0][0] as string;
      expect(output).toContain('warn.event');
    });

    it('logger.error outputs via console.error', () => {
      logger.error('error.event', new Error('test error'));
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const output = consoleSpy.error.mock.calls[0][0] as string;
      expect(output).toContain('error.event');
      expect(output).toContain('test error');
    });

    it('logger.error handles non-Error objects', () => {
      logger.error('error.event', 'string error');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const output = consoleSpy.error.mock.calls[0][0] as string;
      expect(output).toContain('string error');
    });
  });

  describe('data formatting', () => {
    it('includes data in output', () => {
      logger.info('event.with_data', { count: 42, name: 'test' });
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('42');
      expect(output).toContain('test');
    });

    it('handles missing data gracefully', () => {
      logger.info('event.no_data');
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('event.no_data');
    });
  });

  describe('timed logging', () => {
    it('logger.timed includes duration', () => {
      logger.timed('step.complete', 150, { step: 'extraction' });
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('step.complete');
      expect(output).toContain('150');
    });
  });

  describe('startTimer', () => {
    it('measures elapsed time', () => {
      const timer = startTimer('timed.operation');
      // Timer should return a non-negative duration
      const duration = timer.end({ result: 'success' });
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('timed.operation');
    });

    it('passes data to timed log', () => {
      const timer = startTimer('op.with_data');
      timer.end({ items: 5 });
      const output = consoleSpy.log.mock.calls[0][0] as string;
      expect(output).toContain('op.with_data');
      expect(output).toContain('5');
    });
  });
});
