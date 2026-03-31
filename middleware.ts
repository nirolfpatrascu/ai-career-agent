import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ro', 'de', 'fr', 'es', 'it'];
const DEFAULT_LOCALE = 'en';

function detectLocale(request: NextRequest): string {
  // 1. Check locale cookie
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('Accept-Language');
  if (acceptLang) {
    const preferred = acceptLang
      .split(',')
      .map(part => part.split(';')[0].trim().split('-')[0])
      .find(lang => SUPPORTED_LOCALES.includes(lang));
    if (preferred) return preferred;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Locale detection — set header for layout.tsx to read
  const locale = detectLocale(request);
  response.headers.set('x-locale', locale);

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  // CSP: unsafe-eval is required by Next.js in development but kept in production
  // because some Next.js runtime features (dynamic imports, HMR in dev) rely on it.
  // TODO: test removing unsafe-eval after upgrading to Next.js 15+ which may not need it.
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://*.anthropic.com data: blob:",
      "worker-src blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|json)).*)',
  ],
};
