import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const W = 1584;
const H = 396;

// ─── Per-template style config ────────────────────────────────────────────────
// Derived from the reference -text.png images

interface TemplateConfig {
  titleColor: string;
  roleColor: string;
  skillBg: string;
  skillBorder: string;
  skillColor: string;
  /** Where the text block sits horizontally */
  layout: 'right' | 'center' | 'centerleft';
  titleSize: number;
  roleSize: number;
  uppercase: boolean;
  letterSpacing?: string;
}

const CONFIGS: Record<string, TemplateConfig> = {
  dark: {
    titleColor: '#ffffff',
    roleColor: 'rgba(255,255,255,0.75)',
    skillBg: 'rgba(255,255,255,0.12)',
    skillBorder: 'rgba(255,255,255,0.22)',
    skillColor: '#ffffff',
    layout: 'right',
    titleSize: 44,
    roleSize: 14,
    uppercase: true,
    letterSpacing: '4px',
  },
  minimalist: {
    titleColor: '#2a2a2a',
    roleColor: '#555555',
    skillBg: 'rgba(0,0,0,0.06)',
    skillBorder: 'rgba(0,0,0,0.10)',
    skillColor: '#444444',
    layout: 'center',
    titleSize: 48,
    roleSize: 14,
    uppercase: true,
    letterSpacing: '6px',
  },
  colorful: {
    titleColor: '#c96b5e',
    roleColor: '#c96b5e',
    skillBg: 'rgba(201,107,94,0.10)',
    skillBorder: 'rgba(201,107,94,0.20)',
    skillColor: '#c96b5e',
    layout: 'centerleft',
    titleSize: 44,
    roleSize: 15,
    uppercase: false,
  },
  bold: {
    titleColor: '#e8c46a',
    roleColor: '#ffffff',
    skillBg: 'rgba(255,255,255,0.10)',
    skillBorder: 'rgba(255,255,255,0.18)',
    skillColor: '#ffffff',
    layout: 'right',
    titleSize: 40,
    roleSize: 13,
    uppercase: true,
    letterSpacing: '3px',
  },
  lightblue: {
    titleColor: '#1a1a1a',
    roleColor: '#333333',
    skillBg: 'rgba(0,0,0,0.07)',
    skillBorder: 'rgba(0,0,0,0.10)',
    skillColor: '#222222',
    layout: 'centerleft',
    titleSize: 46,
    roleSize: 14,
    uppercase: false,
  },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

function getContainerStyle(layout: TemplateConfig['layout']): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  if (layout === 'right') {
    return {
      ...base,
      right: 60,
      top: '50%',
      transform: 'translateY(-50%)',
      alignItems: 'flex-end',
      maxWidth: 700,
    };
  }
  if (layout === 'center') {
    return {
      ...base,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      alignItems: 'center',
      maxWidth: 800,
    };
  }
  // centerleft — starts after LinkedIn profile photo safe zone (~200px)
  return {
    ...base,
    left: 220,
    top: '50%',
    transform: 'translateY(-50%)',
    alignItems: 'flex-start',
    maxWidth: 800,
  };
}

// ─── Image load helper ────────────────────────────────────────────────────────

function loadBgAsBase64(templateId: string): string {
  const filePath = join(process.cwd(), 'public', 'banners', `bg-${templateId}.png`);
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed } = checkRateLimit(`banner:${ip}`, 10);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await req.json() as { templateId?: string; role?: string; skills?: string[] };
  const { templateId, role, skills } = body;

  const validIds = Object.keys(CONFIGS);
  if (!templateId || !validIds.includes(templateId)) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }
  if (!role || typeof role !== 'string') {
    return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  }

  const cfg = CONFIGS[templateId];
  const cleanRole = role.slice(0, 60);
  const cleanSkills = (skills ?? [])
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .slice(0, 5)
    .map(s => s.slice(0, 35));

  let bgDataUrl: string;
  try {
    bgDataUrl = loadBgAsBase64(templateId);
  } catch {
    return NextResponse.json({ error: `Background image not found: bg-${templateId}.png` }, { status: 500 });
  }

  const containerStyle = getContainerStyle(cfg.layout);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgDataUrl}
          width={W}
          height={H}
          style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, objectFit: 'cover' }}
          alt=""
        />

        {/* Text overlay */}
        <div style={containerStyle as React.CSSProperties}>
          {/* Role title — where the name was */}
          <div
            style={{
              fontSize: cfg.titleSize,
              fontWeight: 700,
              color: cfg.titleColor,
              lineHeight: 1.1,
              textTransform: cfg.uppercase ? 'uppercase' : 'none',
              letterSpacing: cfg.letterSpacing ?? '0px',
              whiteSpace: 'nowrap',
              display: 'flex',
            }}
          >
            {cleanRole}
          </div>

          {/* Divider line — matches minimalist and dark templates */}
          {(templateId === 'minimalist' || templateId === 'dark') && (
            <div
              style={{
                width: '100%',
                height: 1,
                backgroundColor: cfg.roleColor,
                opacity: 0.4,
                display: 'flex',
              }}
            />
          )}

          {/* Skills row — where contact info was */}
          {cleanSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cleanSkills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    fontSize: cfg.roleSize,
                    color: cfg.skillColor,
                    backgroundColor: cfg.skillBg,
                    border: `1px solid ${cfg.skillBorder}`,
                    borderRadius: 20,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 14,
                    paddingRight: 14,
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
    }
  );

  return imageResponse;
}
