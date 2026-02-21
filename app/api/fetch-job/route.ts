import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';

export const maxDuration = 30;

interface ExtractedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  fullText: string;
}

const FALLBACK: ExtractedJob = {
  title: '',
  company: '',
  location: '',
  description: '',
  requirements: '',
  fullText: '',
};

const SYSTEM_PROMPT = `You are an expert at extracting job posting information from raw web page text. Given text scraped from a job posting URL, extract and organize the job details.

You must respond ONLY with a valid JSON object. No preamble, no markdown fences — just pure JSON.

EXTRACTION RULES:
1. "title": The job title
2. "company": The hiring company name
3. "location": The job location (city, country, remote status)
4. "description": The job description / overview section
5. "requirements": The requirements, qualifications, skills needed section
6. "fullText": The complete job posting text, cleaned up and formatted. This should include the title, company, description, requirements, responsibilities, benefits — everything relevant. Remove navigation elements, cookie banners, footer text, and other non-job content.

If the text doesn't appear to be a job posting, set all fields to empty strings.

JSON SCHEMA:
{
  "title": "string",
  "company": "string",
  "location": "string",
  "description": "string",
  "requirements": "string",
  "fullText": "string"
}`;

// ---------------------------------------------------------------------------
// Domains that block server-side fetching (JS-rendered or anti-scraping)
// ---------------------------------------------------------------------------
const BLOCKED_DOMAINS = [
  'linkedin.com',
  'www.linkedin.com',
  'glassdoor.com',
  'www.glassdoor.com',
  'angel.co',
  'wellfound.com',
];

function isBlockedDomain(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const match = BLOCKED_DOMAINS.find(
      (d) => hostname === d || hostname.endsWith('.' + d)
    );
    return match ?? null;
  } catch {
    return null;
  }
}

/**
 * Get a user-friendly message for blocked domains
 */
function getBlockedDomainMessage(domain: string): string {
  const siteName = domain.replace('www.', '').split('.')[0];
  const capitalized = siteName.charAt(0).toUpperCase() + siteName.slice(1);
  return (
    `${capitalized} blocks automated access, so we can't fetch the job posting directly. ` +
    `Please copy the job description from the posting and paste it into the text field instead.\n\n` +
    `Tip: On ${capitalized}, click the job title → select all the text in the description → copy → paste here.`
  );
}

/**
 * Strip HTML tags and decode entities to get plain text
 */
function htmlToText(html: string): string {
  return html
    // Remove script and style blocks entirely
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Replace block elements with newlines
    .replace(/<\/(p|div|h[1-6]|li|tr|br)[^>]*>/gi, '\n')
    .replace(/<br[^>]*\/?>/gi, '\n')
    // Remove all remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Validate that the URL looks like a legitimate job posting URL
 */
function isValidJobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Must be http or https
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    // Block obvious non-job URLs
    const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.', '172.16.'];
    if (blocked.some((b) => parsed.hostname.includes(b))) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: 'Missing URL', message: 'Please provide a job posting URL.' },
        { status: 400 }
      );
    }

    if (!isValidJobUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL', message: 'Please provide a valid job posting URL (https://...).' },
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------------
    // Fast-fail for domains known to block server-side fetching
    // -----------------------------------------------------------------------
    const blockedDomain = isBlockedDomain(url);
    if (blockedDomain) {
      return NextResponse.json(
        {
          error: 'Blocked domain',
          message: getBlockedDomainMessage(blockedDomain),
          blocked: true,
        },
        { status: 422 }
      );
    }

    // -----------------------------------------------------------------------
    // Fetch the page — 10s timeout (leaves room for Claude within maxDuration)
    // -----------------------------------------------------------------------
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let pageText: string;
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
      });

      clearTimeout(timeout);

      // LinkedIn returns 999, some sites return 403
      if (!response.ok) {
        const hint =
          response.status === 999 || response.status === 403
            ? 'This site blocks automated access. Please copy and paste the job description text instead.'
            : `Could not access the URL (HTTP ${response.status}). Try pasting the job text instead.`;
        return NextResponse.json(
          { error: 'Fetch failed', message: hint },
          { status: 422 }
        );
      }

      const contentType = response.headers.get('content-type') || '';
      if (
        !contentType.includes('text/html') &&
        !contentType.includes('text/plain') &&
        !contentType.includes('application/xhtml')
      ) {
        return NextResponse.json(
          {
            error: 'Not a web page',
            message:
              'The URL does not point to a web page. Please provide a direct link to the job posting.',
          },
          { status: 422 }
        );
      }

      const html = await response.text();
      pageText = htmlToText(html);
    } catch (fetchError) {
      clearTimeout(timeout);
      const isTimeout =
        fetchError instanceof Error && fetchError.name === 'AbortError';
      const msg = isTimeout
        ? 'The request timed out. This site may be slow or blocking automated access. Try pasting the job text instead.'
        : 'Could not fetch the URL. The site may block automated access. Try pasting the job text instead.';
      return NextResponse.json(
        { error: 'Fetch failed', message: msg },
        { status: 422 }
      );
    }

    // -----------------------------------------------------------------------
    // Validate we got meaningful content (JS-rendered pages return empty shells)
    // -----------------------------------------------------------------------
    if (pageText.length < 100) {
      return NextResponse.json(
        {
          error: 'No content',
          message:
            'The page had very little text content. It likely requires JavaScript to load (common with LinkedIn, Glassdoor). Please copy and paste the job description text instead.',
        },
        { status: 422 }
      );
    }

    // Truncate to first 8000 chars to keep Claude costs/latency low
    const truncated = pageText.slice(0, 8000);

    // -----------------------------------------------------------------------
    // Use Claude to extract the job posting from the page content
    // -----------------------------------------------------------------------
    const result = await callClaude<ExtractedJob>({
      system: SYSTEM_PROMPT,
      userMessage: `WEB PAGE TEXT:\n---\n${truncated}\n---\n\nExtract the job posting details as JSON.`,
      maxTokens: 2048,
      temperature: 0.1,
      fallback: FALLBACK,
    });

    if (!result.fullText && !result.title) {
      return NextResponse.json(
        {
          error: 'Not a job posting',
          message:
            'Could not find a job posting on this page. The content may have loaded via JavaScript. Try pasting the job text directly.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[fetch-job] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed',
        message:
          'Something went wrong. Try pasting the job text directly instead.',
      },
      { status: 500 }
    );
  }
}