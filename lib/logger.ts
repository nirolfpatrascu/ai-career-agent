// ============================================================================
// GapZero — Structured Logger
// Dev: pretty console output. Prod: JSON lines for log aggregation.
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  data?: Record<string, unknown>;
  duration_ms?: number;
  error?: string;
}

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = process.env.NODE_ENV !== 'production';
const minLevel: LogLevel = isDev ? 'debug' : 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minLevel];
}

function formatEntry(entry: LogEntry): string {
  if (isDev) {
    // Pretty format for development
    const prefix = `[${entry.level.toUpperCase()}]`;
    const duration = entry.duration_ms !== undefined ? ` (${entry.duration_ms}ms)` : '';
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    const error = entry.error ? ` ERROR: ${entry.error}` : '';
    return `${prefix} ${entry.event}${duration}${data}${error}`;
  }
  // JSON lines for production
  return JSON.stringify(entry);
}

function log(level: LogLevel, event: string, data?: Record<string, unknown>, extra?: Partial<LogEntry>): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...extra,
    ...(data && { data }),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (event: string, data?: Record<string, unknown>) => log('debug', event, data),
  info: (event: string, data?: Record<string, unknown>) => log('info', event, data),
  warn: (event: string, data?: Record<string, unknown>) => log('warn', event, data),
  error: (event: string, error?: unknown, data?: Record<string, unknown>) => {
    const errorStr = error instanceof Error ? error.message : String(error ?? '');
    log('error', event, data, { error: errorStr });
  },
  timed: (event: string, durationMs: number, data?: Record<string, unknown>) => {
    log('info', event, data, { duration_ms: durationMs });
  },
};

export interface TimerHandle {
  end: (data?: Record<string, unknown>) => number;
}

export function startTimer(event: string): TimerHandle {
  const start = Date.now();
  return {
    end(data?: Record<string, unknown>): number {
      const duration = Date.now() - start;
      logger.timed(event, duration, data);
      return duration;
    },
  };
}
