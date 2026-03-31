import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 30;

// DeepL locale → DeepL target_lang code
const LOCALE_TO_DEEPL: Record<string, string> = {
  en: 'EN-US',
  ro: 'RO',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  // 200/hour per IP — one locale switch needs ~17 batches, so this allows ~11 switches/hour
  const TRANSLATE_LIMIT = parseInt(process.env.TRANSLATE_RATE_LIMIT_PER_HOUR || '200', 10);
  const rl = await checkRateLimit(`translate:${ip}`, TRANSLATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: { texts?: unknown; targetLang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { texts, targetLang } = body;

  if (!Array.isArray(texts) || texts.length === 0) {
    return NextResponse.json({ error: 'texts must be a non-empty array' }, { status: 400 });
  }
  if (typeof targetLang !== 'string' || !LOCALE_TO_DEEPL[targetLang]) {
    return NextResponse.json({ error: 'Unsupported targetLang' }, { status: 400 });
  }

  // 100k char payload guard
  const totalChars = (texts as string[]).reduce((sum, t) => sum + (typeof t === 'string' ? t.length : 0), 0);
  if (totalChars > 100_000) {
    return NextResponse.json({ error: 'Payload too large (max 100k chars)' }, { status: 413 });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL ?? 'https://api-free.deepl.com';

  if (!apiKey) {
    return NextResponse.json({ error: 'Translation service not configured' }, { status: 503 });
  }

  const deeplLang = LOCALE_TO_DEEPL[targetLang as string];

  const deeplRes = await fetch(`${apiUrl}/v2/translate`, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: (texts as string[]).map(t => (typeof t === 'string' ? t : '')),
      target_lang: deeplLang,
    }),
  });

  if (!deeplRes.ok) {
    const errText = await deeplRes.text();
    console.error('DeepL error:', deeplRes.status, errText);
    return NextResponse.json({ error: 'Translation failed' }, { status: 502 });
  }

  const data = await deeplRes.json() as { translations: Array<{ text: string }> };
  const translations = data.translations.map(t => t.text);

  return NextResponse.json({ translations });
}
