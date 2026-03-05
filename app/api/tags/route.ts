import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import type { OutputTag, OutputTagInput, OutputTagType } from '@/lib/types';

const VALID_TAGS: OutputTagType[] = ['accurate', 'inaccurate', 'irrelevant', 'missing_context', 'too_generic'];

const VALID_SECTIONS = [
  'fitScore', 'strengths', 'gaps', 'actionPlan', 'salary',
  'roles', 'ats', 'jobMatch', 'linkedin', 'cv', 'coverLetter',
];

/** Map DB snake_case row to camelCase OutputTag */
function mapRow(row: Record<string, unknown>): OutputTag {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    analysisId: row.analysis_id as string,
    section: row.section as string,
    elementIndex: row.element_index as number | null,
    elementKey: row.element_key as string | null,
    taggedText: row.tagged_text as string | null,
    tag: row.tag as OutputTagType,
    comment: row.comment as string | null,
    createdAt: row.created_at as string,
  };
}

/**
 * POST /api/tags — Create a tag on an analysis output element.
 */
export async function POST(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: OutputTagInput = await req.json();

    // Validate required fields
    if (!body.analysisId || !body.section || !body.tag) {
      return NextResponse.json(
        { error: 'analysisId, section, and tag are required' },
        { status: 400 }
      );
    }

    if (!VALID_TAGS.includes(body.tag)) {
      return NextResponse.json(
        { error: `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!VALID_SECTIONS.includes(body.section)) {
      return NextResponse.json(
        { error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.comment && body.comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (body.taggedText && body.taggedText.length > 1000) {
      return NextResponse.json(
        { error: 'Tagged text must be 1000 characters or less' },
        { status: 400 }
      );
    }

    // Verify the analysis belongs to the user
    const { data: analysis, error: analysisErr } = await client
      .from('analyses')
      .select('id')
      .eq('id', body.analysisId)
      .eq('user_id', userId)
      .single();

    if (analysisErr || !analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const { data, error } = await client
      .from('output_tags')
      .insert({
        user_id: userId,
        analysis_id: body.analysisId,
        section: body.section,
        element_index: body.elementIndex ?? null,
        element_key: body.elementKey ?? null,
        tagged_text: body.taggedText ?? null,
        tag: body.tag,
        comment: body.comment ?? null,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tag: mapRow(data) }, { status: 201 });
  } catch (error) {
    console.error('[tags POST]', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tags?analysisId=<uuid> — Get all tags for an analysis.
 */
export async function GET(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analysisId = req.nextUrl.searchParams.get('analysisId');
  if (!analysisId) {
    return NextResponse.json(
      { error: 'analysisId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await client
      .from('output_tags')
      .select('*')
      .eq('analysis_id', analysisId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      tags: (data || []).map(mapRow),
    });
  } catch (error) {
    console.error('[tags GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tags?id=<uuid> — Remove a tag.
 */
export async function DELETE(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tagId = req.nextUrl.searchParams.get('id');
  if (!tagId) {
    return NextResponse.json(
      { error: 'id query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { error } = await client
      .from('output_tags')
      .delete()
      .eq('id', tagId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[tags DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
