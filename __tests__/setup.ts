/**
 * Global test setup for GapZero test suite.
 * Mocks the Claude API module to prevent real API calls.
 */

import { vi } from 'vitest';

// Mock the Claude module globally - prevents any real API calls
vi.mock('@/lib/claude', () => ({
  callClaude: vi.fn().mockResolvedValue({}),
  callClaudeText: vi.fn().mockResolvedValue(''),
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
  truncateCVText: vi.fn((text: string, maxChars: number = 40000) => {
    return text.length <= maxChars ? text : text.slice(0, maxChars);
  }),
  streamClaude: vi.fn(),
}));

// Mock environment variables
process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
process.env.CLAUDE_MODEL = 'test-model';
