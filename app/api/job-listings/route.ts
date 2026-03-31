import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

/** Map app country names → Adzuna country codes (unsupported fall back to nearest market) */
const COUNTRY_CODE: Record<string, string> = {
  'Romania':        'gb', // not in Adzuna, fallback to UK
  'Germany':        'de',
  'United Kingdom': 'gb',
  'United States':  'us',
  'Netherlands':    'nl',
  'France':         'fr',
  'Spain':          'es',
  'Italy':          'it',
  'Poland':         'pl',
  'Austria':        'at',
  'Switzerland':    'ch',
  'Sweden':         'gb',
  'Denmark':        'gb',
  'Norway':         'gb',
  'Finland':        'gb',
  'Belgium':        'be',
  'Ireland':        'gb',
  'Portugal':       'es',
  'Czech Republic': 'de',
  'Hungary':        'de',
  'Canada':         'ca',
  'Australia':      'au',
  'India':          'in',
  'Singapore':      'sg',
  'Japan':          'gb',
  'Brazil':         'br',
  'Other':          'gb',
};

/** Currency per Adzuna country code — salary is always in local currency */
const COUNTRY_CURRENCY: Record<string, string> = {
  gb: 'GBP', us: 'USD', au: 'AUD', at: 'EUR', be: 'EUR',
  br: 'BRL', ca: 'CAD', de: 'EUR', fr: 'EUR', in: 'INR',
  it: 'EUR', nl: 'EUR', pl: 'PLN', es: 'EUR', ch: 'CHF',
  sg: 'SGD',
};

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  currency: string;
  salaryMin?: number;
  salaryMax?: number;
}

interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  redirect_url: string;
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
}

// Redis cache (shared across all serverless instances) — 6h TTL
// Falls back to in-memory if Upstash is not configured
const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const memCache = new Map<string, { jobs: JobListing[]; expires: number }>();

async function getCached(key: string): Promise<JobListing[] | null> {
  if (redis) {
    try {
      const val = await redis.get<JobListing[]>(`jl:${key}`);
      return val ?? null;
    } catch { /* fall through to memory */ }
  }
  const entry = memCache.get(key);
  return (entry && entry.expires > Date.now()) ? entry.jobs : null;
}

async function setCached(key: string, jobs: JobListing[]): Promise<void> {
  if (redis) {
    try {
      await redis.set(`jl:${key}`, jobs, { ex: CACHE_TTL_SECONDS });
      return;
    } catch { /* fall through to memory */ }
  }
  memCache.set(key, { jobs, expires: Date.now() + CACHE_TTL_SECONDS * 1000 });
}

export async function GET(req: NextRequest) {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return NextResponse.json({ error: 'Job search not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role')?.trim();
  const country = searchParams.get('country')?.trim() ?? 'United Kingdom';

  if (!role) {
    return NextResponse.json({ error: 'role is required' }, { status: 400 });
  }

  const countryCode = COUNTRY_CODE[country] ?? 'gb';
  const currency = COUNTRY_CURRENCY[countryCode] ?? 'GBP';
  const cacheKey = `${countryCode}:${role.toLowerCase()}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ jobs: cached, currency });
  }

  try {
    const params = new URLSearchParams({
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: '5',
      what: role,
      sort_by: 'relevance',
    });

    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`Adzuna returned ${res.status}`);
    }

    const data = await res.json();

    const jobs: JobListing[] = (data.results ?? []).map((j: AdzunaJob) => ({
      id: j.id,
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      url: j.redirect_url,
      currency,
      ...(j.salary_min != null && { salaryMin: Math.round(j.salary_min) }),
      ...(j.salary_max != null && { salaryMax: Math.round(j.salary_max) }),
    }));

    await setCached(cacheKey, jobs);
    return NextResponse.json({ jobs, currency });
  } catch (err) {
    console.error('[api/job-listings]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
