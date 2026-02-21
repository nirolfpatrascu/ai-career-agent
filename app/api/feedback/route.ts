import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';

// Valid section names for feedback
const VALID_SECTIONS = [
  'fitScore',
  'strengths',
  'gaps',
  'actionPlan',
  'roleRecommendations',
  'salaryAnalysis',
  'linkedinPlan',
  'jobMatch',
  'cvSuggestions',
  'atsScore',
  'cvBuilder',
  'overall',
] as const;

type FeedbackSection = (typeof VALID_SECTIONS)[number];

interface FeedbackBody {
  analysisId?: string;
  section: string;
  rating: boolean;
  comment?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // --- Rate limit (use IP as identifier, with a generous limit for feedback) ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimitKey = `feedback:${ip}`;
    const { allowed } = checkRateLimit(rateLimitKey);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = (await request.json()) as FeedbackBody;
    const { analysisId, section, rating, comment } = body;

    // Validate section
    if (!section || !VALID_SECTIONS.includes(section as FeedbackSection)) {
      return NextResponse.json(
        {
          error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (typeof rating !== 'boolean') {
      return NextResponse.json(
        { error: 'Rating must be a boolean (true = helpful, false = not helpful).' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment && comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or fewer.' },
        { status: 400 }
      );
    }

    // --- Resolve user (optional auth) ---
    let userId: string | null = null;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      const {
        data: { user },
      } = await authClient.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    // --- Insert feedback ---
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error: insertError } = await supabase.from('feedback').insert({
      analysis_id: analysisId || null,
      user_id: userId,
      section,
      rating,
      comment: comment?.trim() || null,
    });

    if (insertError) {
      console.error('[feedback] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save feedback.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[feedback] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
