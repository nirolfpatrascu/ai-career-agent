import Anthropic from '@anthropic-ai/sdk';
import { safeParseJSON } from './utils';

// ============================================================================
// Claude API Client — Central wrapper for all Anthropic API interactions
// ============================================================================

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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
      if (lastError.message.includes('401') || lastError.message.includes('400')) {
        break;
      }

      // Wait before retry
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  console.error('All Claude API attempts failed. Using fallback.');
  return fallback;
}

/**
 * Call Claude for plain text responses (not JSON).
 * Used for CV rewriting and other text-generation tasks.
 */
export async function callClaudeText(options: {
  system: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const { system, userMessage, maxTokens = 4096, temperature = 0.4 } = options;

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

        controller.close();
      } catch (error) {
        console.error('[streamClaude] Error:', error);
        const msg =
          error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`\n\n[Error: ${msg}]`)
        );
        controller.close();
      }
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