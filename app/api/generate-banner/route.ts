import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 60;

// ─── Canva token cache (server memory, resets on cold start) ─────────────────
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getCanvaToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 30_000) return cachedToken;

  const clientId = process.env.CANVA_CLIENT_ID!;
  const clientSecret = process.env.CANVA_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://api.canva.com/rest/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=design:content:write design:content:read asset:read',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Canva auth failed: ${err}`);
  }

  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + json.expires_in * 1000;
  return cachedToken!;
}

// ─── Poll helper ──────────────────────────────────────────────────────────────
async function poll<T>(
  fn: () => Promise<{ status: string; result?: T }>,
  intervalMs = 1500,
  timeoutMs = 45_000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { status, result } = await fn();
    if (status === 'success' && result) return result;
    if (status === 'failed') throw new Error('Canva job failed');
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Canva job timed out');
}

// ─── Canva API helpers ────────────────────────────────────────────────────────
async function canvaFetch(path: string, options: RequestInit, token: string) {
  const res = await fetch(`https://api.canva.com/rest/v1${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Canva API error (${res.status}): ${err}`);
  }
  return res.json();
}

// ─── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed } = checkRateLimit(`banner:${ip}`, 10, 3600);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { templateId, role, skills } = await req.json() as {
    templateId: string;
    role: string;
    skills: string[];
  };

  // Validate templateId is one of our approved templates
  const allowedIds = (process.env.CANVA_TEMPLATE_IDS ?? '').split(',').map(s => s.trim());
  if (!allowedIds.includes(templateId)) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  if (!role || typeof role !== 'string' || role.length > 100) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const cleanSkills = (skills ?? [])
    .filter((s): s is string => typeof s === 'string')
    .slice(0, 5)
    .map(s => s.slice(0, 40));

  try {
    const token = await getCanvaToken();

    // 1. Create autofill job
    const autofillData: Record<string, { type: 'text'; text: string }> = {
      role_title: { type: 'text', text: role },
    };
    cleanSkills.forEach((skill, i) => {
      autofillData[`skill_${i + 1}`] = { type: 'text', text: skill };
    });
    // Empty out unused skill slots so Canva doesn't leave placeholder text
    for (let i = cleanSkills.length + 1; i <= 5; i++) {
      autofillData[`skill_${i}`] = { type: 'text', text: '' };
    }

    const autofillJob = await canvaFetch('/autofills', {
      method: 'POST',
      body: JSON.stringify({
        brand_template_id: templateId,
        title: `LinkedIn Banner — ${role}`,
        data: autofillData,
      }),
    }, token);

    const jobId: string = autofillJob.job?.id;
    if (!jobId) throw new Error('No autofill job ID returned');

    // 2. Poll autofill until design is ready
    const design = await poll(async () => {
      const r = await canvaFetch(`/autofills/${jobId}`, { method: 'GET' }, token);
      return {
        status: r.job?.status ?? 'pending',
        result: r.job?.result?.design as { id: string } | undefined,
      };
    });

    // 3. Request PNG export
    const exportJob = await canvaFetch('/exports', {
      method: 'POST',
      body: JSON.stringify({
        design_id: design.id,
        format: 'png',
        export_quality: 'pro',
      }),
    }, token);

    const exportJobId: string = exportJob.job?.id;
    if (!exportJobId) throw new Error('No export job ID returned');

    // 4. Poll export until URL is ready
    const exportResult = await poll(async () => {
      const r = await canvaFetch(`/exports/${exportJobId}`, { method: 'GET' }, token);
      return {
        status: r.job?.status ?? 'pending',
        result: r.job?.result as { urls: string[] } | undefined,
      };
    });

    const downloadUrl = exportResult.urls?.[0];
    if (!downloadUrl) throw new Error('No download URL in export result');

    return NextResponse.json({ url: downloadUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Banner generation failed';
    console.error('generate-banner:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
