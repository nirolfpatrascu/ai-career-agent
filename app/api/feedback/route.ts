import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthenticatedClient, getServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Top-level section names
const SECTION_PREFIXES = [
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
  'cvEditor',
  'github',
  'overall',
  'coverLetter',
  'interview-prep',
  'salary',
  'upwork',
  'outcome',
  // per-item prefixes (followed by -<index> or -<tab>-<index>)
  'strength',
  'gap',
  'role',
  'github-strength',
  'github-improvement',
  'github-analysis',
] as const;

function isValidSection(section: string): boolean {
  return SECTION_PREFIXES.some(
    (prefix) => section === prefix || section.startsWith(`${prefix}-`)
  );
}

interface FeedbackBody {
  analysisId?: string;
  section: string;
  rating: boolean;
  comment?: string;
  selectedIssues?: string[];
}

// GET /api/feedback?analysisId=xxx&section=outcome
// Returns whether an outcome has already been recorded for this analysis.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get('analysisId');
  const section = searchParams.get('section') ?? 'outcome';

  if (!analysisId) {
    return NextResponse.json({ exists: false });
  }

  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from('feedback')
      .select('id, comment')
      .eq('analysis_id', analysisId)
      .eq('section', section)
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ exists: !!data, outcome: data?.comment ?? null });
  } catch {
    return NextResponse.json({ exists: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    // --- Rate limit ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const { allowed } = await checkRateLimit(`feedback:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    // --- Parse and validate body ---
    const body = (await request.json()) as FeedbackBody;
    const { analysisId, section, rating, comment, selectedIssues } = body;

    if (!section || !isValidSection(section)) {
      return NextResponse.json({ error: 'Invalid section name.' }, { status: 400 });
    }
    if (typeof rating !== 'boolean') {
      return NextResponse.json({ error: 'Rating must be a boolean.' }, { status: 400 });
    }
    if (comment && comment.length > 1000) {
      return NextResponse.json({ error: 'Comment must be 1000 characters or fewer.' }, { status: 400 });
    }

    // --- Resolve user (optional auth) ---
    let userId: string | null = null;
    try {
      const { userId: uid } = await getAuthenticatedClient(request);
      userId = uid;
    } catch { /* auth is optional for feedback */ }

    // --- Insert via service role (bypasses RLS — feedback is always allowed) ---
    const supabase = getServiceClient();

    const { error: insertError } = await supabase.from('feedback').insert({
      analysis_id: analysisId || null,
      user_id: userId,
      section,
      rating,
      comment: comment?.trim() || null,
      selected_issues: selectedIssues?.length ? selectedIssues : null,
    });

    if (insertError) {
      console.error('[feedback] Insert error:', insertError);
      // If selected_issues column doesn't exist yet, retry without it
      if (insertError.message?.includes('selected_issues')) {
        const { error: retryError } = await supabase.from('feedback').insert({
          analysis_id: analysisId || null,
          user_id: userId,
          section,
          rating,
          comment: comment?.trim() || null,
        });
        if (retryError) {
          console.error('[feedback] Retry insert error:', retryError);
          return NextResponse.json({ error: 'Failed to save feedback.' }, { status: 500 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
      }
      return NextResponse.json({ error: 'Failed to save feedback.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[feedback] Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
