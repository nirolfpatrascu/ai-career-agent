import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { safeParseJSON } from './utils';

// ============================================================================
// Claude API Client — Central wrapper for all Anthropic API interactions
// ============================================================================

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
export const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;

/**
 * Default model cascade: Sonnet → Haiku.
 * If Sonnet exhausts all retries, Haiku is tried next.
 * Ensures analysis never fails due to a single model being overloaded.
 */
export const DEFAULT_MODEL_CASCADE = [MODEL, HAIKU_MODEL];

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
      msg.includes('econnreset')
    );
  }
  return false;
}

/**
 * Check if an error is a client-side generation timeout.
 * Timeout errors are treated differently from overload/rate-limit errors:
 * one retry is allowed (covers transient network drops), then cascade immediately.
 * Retrying 3× on a slow model wastes ~165s for no gain.
 */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('timeout') || msg.includes('timed out');
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
  model?: string;
  maxRetries?: number;
  /** Per-call timeout in ms. Defaults to 120s — covers Sonnet 4.6 worst-case 8192-token response (~108s at 77 t/s). */
  timeout?: number;
  /**
   * Override the model cascade. Defaults to DEFAULT_MODEL_CASCADE (Sonnet → Haiku).
   * Pass a single-element array to disable cascading.
   */
  modelCascade?: string[];
  /** Called when the cascade falls back to a different model, e.g. to show a toast. */
  onModelFallback?: (model: string) => void;
  /**
   * Optional Zod schema to validate the parsed JSON against.
   * On validation failure, one retry is attempted with the Zod error appended to the user message.
   * If retry also fails validation, returns fallback.
   */
  schema?: z.ZodType<T>;
}): Promise<T> {
  const {
    system,
    userMessage,
    maxTokens = 4096,
    temperature = 0.3,
    fallback,
    model,
    maxRetries = MAX_RETRIES,
    timeout = 120_000,
    modelCascade,
    onModelFallback,
    schema,
  } = options;

  // Build cascade: explicit modelCascade > [explicit model + haiku] > default cascade
  const cascade = modelCascade ?? (model ? [model, HAIKU_MODEL] : DEFAULT_MODEL_CASCADE);

  for (let cascadeIndex = 0; cascadeIndex < cascade.length; cascadeIndex++) {
    const currentModel = cascade[cascadeIndex];
    const isFallbackModel = cascadeIndex > 0;

    if (isFallbackModel) {
      console.warn(`[callClaude] Primary model failed. Falling back to ${currentModel}`);
      onModelFallback?.(currentModel);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const anthropic = getClient();

        const response = await anthropic.messages.create({
          model: currentModel,
          max_tokens: maxTokens,
          temperature,
          system,
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }, {
          // Disable the SDK's own retry loop — callClaude manages retries explicitly
          // with logging and backoff. Double-retrying silently wastes time budget.
          maxRetries: 0,
          timeout,
        });

        // Extract text from response
        const textBlock = response.content.find((block) => block.type === 'text');
        if (!textBlock || textBlock.type !== 'text') {
          throw new Error('No text content in Claude response');
        }

        const result = extractJSON<T>(textBlock.text, fallback);

        // If JSON parsing failed (extractJSON returned the fallback reference), treat as retryable
        if (result === fallback) {
          console.error(
            `[callClaude] ${currentModel} (attempt ${attempt + 1}/${maxRetries + 1}): JSON parse failed`,
            textBlock.text.slice(0, 200)
          );
          if (attempt < maxRetries) {
            await sleep(BASE_DELAY_MS);
            continue;
          }
          break;
        }

        // Zod schema validation — if provided, validate and retry once with fix prompt on failure
        if (schema) {
          const validation = schema.safeParse(result);
          if (!validation.success) {
            const zodErrors = validation.error.issues
              .slice(0, 5) // cap to avoid huge prompts
              .map(i => `- ${i.path.join('.')}: ${i.message}`)
              .join('\n');
            console.warn(
              `[callClaude] ${currentModel} (attempt ${attempt + 1}): Zod validation failed:\n${zodErrors}`
            );
            if (attempt < maxRetries) {
              // Retry with fix prompt appended
              const fixPrompt = `${userMessage}\n\nYour previous response had these schema errors — fix them in your next response:\n${zodErrors}`;
              try {
                const anthropic = getClient();
                const fixResponse = await anthropic.messages.create({
                  model: currentModel,
                  max_tokens: maxTokens,
                  temperature,
                  system,
                  messages: [{ role: 'user', content: fixPrompt }],
                }, { maxRetries: 0, timeout });
                const fixText = fixResponse.content.find(b => b.type === 'text');
                if (fixText?.type === 'text') {
                  const fixResult = extractJSON<T>(fixText.text, fallback);
                  if (fixResult !== fallback) {
                    const fixValidation = schema.safeParse(fixResult);
                    if (fixValidation.success) return fixResult;
                    console.warn('[callClaude] Fix retry also failed Zod validation — using fallback');
                  }
                }
              } catch (fixErr) {
                console.warn('[callClaude] Fix retry threw:', fixErr instanceof Error ? fixErr.message : fixErr);
              }
              break; // Stop retrying this model, try next in cascade or return fallback
            }
            break;
          }
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(
          `[callClaude] ${currentModel} failed (attempt ${attempt + 1}/${maxRetries + 1}):`,
          lastError.message
        );

        // Don't retry on auth errors or invalid requests
        if (isNonRetryableError(error)) {
          // Non-retryable errors won't be fixed by cascade — bail immediately
          console.error('All Claude API attempts failed. Using fallback.');
          return fallback;
        }

        // Timeout: retry once if maxRetries > 0 (covers transient network drops),
        // then cascade immediately. Callers that pass maxRetries: 0 skip the
        // retry and cascade on the first timeout — use this for optional parallel
        // tasks where a fast Haiku fallback is preferable to blocking 240s.
        if (isTimeoutError(error)) {
          if (attempt === 0 && maxRetries > 0) {
            await sleep(BASE_DELAY_MS);
            continue;
          }
          break;
        }

        // Wait with exponential backoff before retry
        if (attempt < maxRetries && isRetryableError(error)) {
          const delay = getRetryDelay(attempt);
          console.log(`[callClaude] Retrying ${currentModel} in ${Math.round(delay)}ms...`);
          await sleep(delay);
        } else if (attempt < maxRetries) {
          await sleep(BASE_DELAY_MS);
        }
      }
    }

    // All retries for this model failed — try next model in cascade
    console.warn(`[callClaude] ${currentModel} exhausted ${maxRetries + 1} attempts. Trying next model in cascade...`);
  }

  console.error('All models in cascade failed. Using fallback.');
  return fallback;
}

/**
 * Call Claude with source tracking — returns whether data came from Claude or fallback.
 * Used by analyze-stream to populate metadata.dataSources.
 */
export async function callClaudeWithSource<T>(options: {
  system: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  fallback: T;
  model?: string;
  modelCascade?: string[];
}): Promise<{ data: T; source: 'claude' | 'fallback' }> {
  const { fallback } = options;
  const result = await callClaude<T>(options);
  // If the result is the exact same reference as fallback, it was a fallback
  const isFallback = result === fallback;
  return { data: result, source: isFallback ? 'fallback' : 'claude' };
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
  modelCascade?: string[];
  timeout?: number;
}): Promise<string> {
  const { system, userMessage, maxTokens = 4096, temperature = 0.4, modelCascade, timeout = 120_000 } = options;
  const cascade = modelCascade ?? DEFAULT_MODEL_CASCADE;

  for (let cascadeIndex = 0; cascadeIndex < cascade.length; cascadeIndex++) {
    const currentModel = cascade[cascadeIndex];
    if (cascadeIndex > 0) {
      console.warn(`[callClaudeText] Falling back to ${currentModel}`);
    }

    let lastError: unknown = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const anthropic = getClient();

        const response = await anthropic.messages.create({
          model: currentModel,
          max_tokens: maxTokens,
          temperature,
          system,
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }, { maxRetries: 0, timeout });

        const textBlock = response.content.find((block) => block.type === 'text');
        if (!textBlock || textBlock.type !== 'text') {
          throw new Error('No text content in Claude response');
        }

        return textBlock.text;
      } catch (error) {
        lastError = error;
        console.error(
          `[callClaudeText] ${currentModel} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
          error instanceof Error ? error.message : String(error)
        );

        if (isNonRetryableError(error)) {
          throw new Error(getUserFriendlyError(error));
        }

        if (isTimeoutError(error)) {
          if (attempt === 0) {
            await sleep(BASE_DELAY_MS);
            continue;
          }
          break;
        }

        if (attempt < MAX_RETRIES && isRetryableError(error)) {
          const delay = getRetryDelay(attempt);
          console.log(`[callClaudeText] Retrying in ${Math.round(delay)}ms...`);
          await sleep(delay);
        } else if (attempt < MAX_RETRIES) {
          await sleep(BASE_DELAY_MS);
        }
      }
    }

    // All retries failed for this model — try next
    console.warn(`[callClaudeText] ${currentModel} exhausted all attempts. Trying next model...`);
  }

  throw new Error('All models failed. Please try again in a moment.');
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
          }, { maxRetries: 0, timeout: 55_000 });

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