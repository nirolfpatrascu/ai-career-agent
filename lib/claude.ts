import Anthropic from '@anthropic-ai/sdk';
import { safeParseJSON } from './utils';

// ============================================================================
// Claude API Client — Central wrapper for all Anthropic API interactions
// ============================================================================

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;

let client: Anthropic | null = null;

/**
 * Get or create the Anthropic client singleton
 */
function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Add it to your .env.local file.'
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/**
 * Check if an error is retryable (overloaded, rate-limited, or server error)
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError) {
    // 429 = rate limited, 529 = overloaded, 500/502/503 = server errors
    return [429, 529, 500, 502, 503].includes(error.status);
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('overloaded') ||
      msg.includes('rate_limit') ||
      msg.includes('529') ||
      msg.includes('503') ||
      msg.includes('econnreset') ||
      msg.includes('timeout')
    );
  }
  return false;
}

/**
 * Check if an error is non-retryable (auth, bad request, etc.)
 */
function isNonRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError) {
    return [400, 401, 403, 404].includes(error.status);
  }
  if (error instanceof Error) {
    return (
      error.message.includes('401') ||
      error.message.includes('400') ||
      error.message.includes('ANTHROPIC_API_KEY')
    );
  }
  return false;
}

/**
 * Get a user-friendly error message based on the error type
 */
function getUserFriendlyError(error: unknown): string {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 429) {
      return 'The AI service is currently rate-limited. Please wait a moment and try again.';
    }
    if (error.status === 529 || error.message?.includes('overloaded')) {
      return 'The AI service is temporarily overloaded. Please try again in a few seconds.';
    }
    if (error.status === 401) {
      return 'AI service authentication error. Please contact support.';
    }
  }
  if (error instanceof Error && error.message.includes('overloaded')) {
    return 'The AI service is temporarily overloaded. Please try again in a few seconds.';
  }
  return 'Something went wrong while generating a response. Please try again.';
}

/**
 * Calculate delay with exponential backoff + jitter
 */
function getRetryDelay(attempt: number): number {
  // Exponential: 1.5s, 3s, 6s + random jitter up to 500ms
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 500;
  return exponential + jitter;
}

/**
 * Call Claude with a structured prompt and get a typed JSON response.
 *
 * This is the primary method used by all prompt templates.
 * It handles retry logic, JSON extraction, and error handling.
 */
export async function callClaude<T>(options: {
  system: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  fallback: T;
}): Promise<T> {
  const { system, userMessage, maxTokens = 4096, temperature = 0.3, fallback } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const anthropic = getClient();

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      // Extract text from response
      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      const result = extractJSON<T>(textBlock.text, fallback);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Claude API call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
        lastError.message
      );

      // Don't retry on auth errors or invalid requests
      if (isNonRetryableError(error)) {
        break;
      }

      // Wait with exponential backoff before retry
      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      } else if (attempt < MAX_RETRIES) {
        // Unknown error — still retry but with shorter delay
        await sleep(BASE_DELAY_MS);
      }
    }
  }

  console.error('All Claude API attempts failed. Using fallback.');
  return fallback;
}

/**
 * Call Claude for plain text responses (not JSON).
 * Used for CV rewriting and other text-generation tasks.
 * Includes retry logic with exponential backoff.
 */
export async function callClaudeText(options: {
  system: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const { system, userMessage, maxTokens = 4096, temperature = 0.4 } = options;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const anthropic = getClient();

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      return textBlock.text;
    } catch (error) {
      lastError = error;
      console.error(
        `callClaudeText failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
        error instanceof Error ? error.message : String(error)
      );

      if (isNonRetryableError(error)) {
        break;
      }

      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      } else if (attempt < MAX_RETRIES) {
        await sleep(BASE_DELAY_MS);
      }
    }
  }

  throw new Error(getUserFriendlyError(lastError));
}

/**
 * Extract JSON from Claude's response text.
 * Handles cases where Claude wraps JSON in markdown code fences or adds preamble.
 */
function extractJSON<T>(text: string, fallback: T): T {
  // Try 1: Direct parse
  try {
    return JSON.parse(text) as T;
  } catch {
    // Continue to next strategy
  }

  // Try 2: Extract from markdown code fences
  const jsonFenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (jsonFenceMatch) {
    try {
      return JSON.parse(jsonFenceMatch[1].trim()) as T;
    } catch {
      // Continue
    }
  }

  // Try 3: Find the first { or [ and parse from there
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIndex = -1;

  if (firstBrace === -1 && firstBracket === -1) {
    console.error('No JSON structure found in response');
    return fallback;
  }

  if (firstBrace === -1) startIndex = firstBracket;
  else if (firstBracket === -1) startIndex = firstBrace;
  else startIndex = Math.min(firstBrace, firstBracket);

  const substring = text.slice(startIndex);

  // Find matching closing brace/bracket
  const openChar = substring[0];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0;
  let endIndex = -1;

  for (let i = 0; i < substring.length; i++) {
    if (substring[i] === openChar) depth++;
    else if (substring[i] === closeChar) {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex !== -1) {
    try {
      return JSON.parse(substring.slice(0, endIndex + 1)) as T;
    } catch {
      // Fall through
    }
  }

  // Try 4: Use safeParseJSON as last resort
  return safeParseJSON(text, fallback);
}

/**
 * Simple sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Estimate token count (rough heuristic — 1 token ≈ 4 chars)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Stream a Claude response as a ReadableStream (for chat).
 * Returns a stream of text chunks that can be piped to the client.
 * Includes retry logic — retries up to MAX_RETRIES times on transient errors.
 */
export function streamClaude(options: {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
  temperature?: number;
}): ReadableStream<Uint8Array> {
  const { system, messages, maxTokens = 2048, temperature = 0.4 } = options;
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let lastError: unknown = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const anthropic = getClient();

          const stream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: maxTokens,
            temperature,
            system,
            messages,
          });

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          // Success — close and return
          controller.close();
          return;
        } catch (error) {
          lastError = error;
          console.error(
            `[streamClaude] Error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
            error instanceof Error ? error.message : String(error)
          );

          // Don't retry on auth or bad request errors
          if (isNonRetryableError(error)) {
            break;
          }

          // Retry with backoff on transient errors
          if (attempt < MAX_RETRIES && isRetryableError(error)) {
            const delay = getRetryDelay(attempt);
            console.log(`[streamClaude] Retrying in ${Math.round(delay)}ms...`);
            await sleep(delay);
            continue;
          }
        }
      }

      // All retries exhausted — send user-friendly message
      const friendlyMsg = getUserFriendlyError(lastError);
      controller.enqueue(encoder.encode(friendlyMsg));
      controller.close();
    },
  });
}

/**
 * Truncate CV text if it's too long to avoid hitting token limits.
 * Claude Sonnet has a 200K context window, but we want to stay well under.
 */
export function truncateCVText(text: string, maxChars: number = 40000): string {
  if (text.length <= maxChars) return text;
  console.warn(
    `CV text truncated from ${text.length} to ${maxChars} characters`
  );
  return text.slice(0, maxChars) + '\n\n[... CV text truncated for processing ...]';
}