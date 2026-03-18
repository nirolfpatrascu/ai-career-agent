/**
 * Build-time UI string translator.
 * Reads lib/i18n/translations/en.json, translates via DeepL API,
 * and writes ro.json, de.json, fr.json, es.json, it.json.
 *
 * Run: npm run translate
 * Requires: DEEPL_API_KEY and optionally DEEPL_API_URL in .env.local
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Load env from .env.local (simple parser, no external deps)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com';

const LOCALES = [
  { locale: 'ro', deeplLang: 'RO' },
  { locale: 'de', deeplLang: 'DE' },
  { locale: 'fr', deeplLang: 'FR' },
  { locale: 'es', deeplLang: 'ES' },
  { locale: 'it', deeplLang: 'IT' },
];

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');
const BATCH_SIZE = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flatten nested object to dot-paths: { a: { b: "x" } } → { "a.b": "x" } */
function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'string') out[`${key}.${i}`] = item;
      });
    } else if (typeof v === 'string') {
      out[key] = v;
    }
  }
  return out;
}

/** Reconstruct nested object from dot-paths */
function unflatten(flat) {
  const out = {};
  for (const [dotPath, val] of Object.entries(flat)) {
    const parts = dotPath.split('.');
    let node = out;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const isNextArray = /^\d+$/.test(nextPart);
      if (node[part] === undefined) {
        node[part] = isNextArray ? [] : {};
      }
      node = node[part];
    }
    const lastPart = parts[parts.length - 1];
    node[lastPart] = val;
  }
  return out;
}

/** Extract {placeholder} tokens and replace with markers DeepL won't translate */
function protectPlaceholders(text) {
  const tokens = [];
  const protected_ = text.replace(/\{([^}]+)\}/g, (match) => {
    const idx = tokens.length;
    tokens.push(match);
    return `PHDR${idx}RHDP`;
  });
  return { protected: protected_, tokens };
}

/** Restore original {placeholder} tokens */
function restorePlaceholders(text, tokens) {
  return text.replace(/PHDR(\d+)RHDP/g, (_, idx) => {
    return tokens[parseInt(idx, 10)] || _;
  });
}

async function translateBatch(texts, targetLang) {
  const body = JSON.stringify({
    text: texts,
    target_lang: targetLang,
  });

  const res = await fetch(`${DEEPL_API_URL}/v2/translate`, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.translations.map(t => t.text);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!DEEPL_API_KEY) {
    console.error('Error: DEEPL_API_KEY is not set. Add it to .env.local');
    process.exit(1);
  }

  const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const flat = flatten(en);

  const keys = Object.keys(flat);
  const values = Object.values(flat);

  // Protect {placeholder} tokens in all strings
  const protectedData = values.map(protectPlaceholders);
  const protectedTexts = protectedData.map(d => d.protected);
  const tokenLists = protectedData.map(d => d.tokens);

  let totalChars = values.join('').length;
  console.log(`Source: ${keys.length} strings, ~${totalChars} chars`);

  for (const { locale, deeplLang } of LOCALES) {
    console.log(`\nTranslating to ${locale} (${deeplLang})...`);

    const translated = [];
    for (let i = 0; i < protectedTexts.length; i += BATCH_SIZE) {
      const batch = protectedTexts.slice(i, i + BATCH_SIZE);
      const results = await translateBatch(batch, deeplLang);
      translated.push(...results);
      process.stdout.write(`  ${Math.min(i + BATCH_SIZE, protectedTexts.length)}/${protectedTexts.length} strings\r`);
    }
    process.stdout.write('\n');

    // Restore placeholders
    const restored = translated.map((t, i) => restorePlaceholders(t, tokenLists[i]));

    // Rebuild nested object
    const flatTranslated = {};
    keys.forEach((k, i) => { flatTranslated[k] = restored[i]; });
    const nested = unflatten(flatTranslated);

    const outPath = path.join(TRANSLATIONS_DIR, `${locale}.json`);
    fs.writeFileSync(outPath, JSON.stringify(nested, null, 2) + '\n', 'utf8');
    console.log(`  Wrote ${outPath}`);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
