// app/api/ats-score/route.ts
// POST /api/ats-score — ATS keyword matching + format scoring

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { analyzeATSFormat } from '@/lib/ats-format-check';
import {
  buildATSKeywordExtractionPrompt,
  buildATSMatchingPrompt,
  computeATSScore,
} from '@/lib/prompts/ats-scoring';
import { lookupCompanyATS, getATSSystemTips } from '@/lib/knowledge/company-ats';
import type { ATSScoreResult, CompanyATSInfo } from '@/lib/types';

export const maxDuration = 120; // 2 minutes max for Vercel serverless

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { cvText, jobPosting, extractedSkills, companyName, jobUrl } = body;

    // Validation
    if (!cvText || typeof cvText !== 'string' || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'CV text is required and must be at least 50 characters.' },
        { status: 400 }
      );
    }

    if (!jobPosting || typeof jobPosting !== 'string' || jobPosting.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job posting text is required and must be at least 50 characters.' },
        { status: 400 }
      );
    }

    // --- Step 1: Extract keywords from job posting ---
    const extractionPrompt = buildATSKeywordExtractionPrompt(jobPosting);
    const extractionResponse = await callClaude(extractionPrompt, {
      maxTokens: 4000,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    let jobKeywords: Array<{
      keyword: string;
      category: string;
      importance: string;
      variants: string[];
    }>;
    let roleLevel = 'mid';
    let domain = 'General';

    try {
      const parsed = JSON.parse(extractionResponse);
      jobKeywords = parsed.keywords || [];
      roleLevel = parsed.roleLevel || 'mid';
      domain = parsed.domain || 'General';
    } catch {
      console.error('Failed to parse keyword extraction response:', extractionResponse.substring(0, 200));
      return NextResponse.json(
        { error: 'Failed to analyze job posting. Please try again.' },
        { status: 500 }
      );
    }

    if (jobKeywords.length === 0) {
      return NextResponse.json(
        { error: 'Could not extract keywords from the job posting. Please check the posting text.' },
        { status: 400 }
      );
    }

    // --- Step 2: Match keywords against CV ---
    const matchingPrompt = buildATSMatchingPrompt(cvText, jobKeywords);
    const matchingResponse = await callClaude(matchingPrompt, {
      maxTokens: 6000,
      temperature: 0.1,
    });

    let matches: Array<{
      keyword: string;
      category: string;
      importance: string;
      status: string;
      matchedAs?: string;
      cvSection?: string;
    }>;
    let recommendations: Array<{
      action: string;
      section: string;
      priority: string;
      keywords: string[];
      example?: string;
    }>;

    try {
      const parsed = JSON.parse(matchingResponse);
      matches = parsed.matches || [];
      recommendations = parsed.recommendations || [];
    } catch {
      console.error('Failed to parse matching response:', matchingResponse.substring(0, 200));
      return NextResponse.json(
        { error: 'Failed to match keywords. Please try again.' },
        { status: 500 }
      );
    }

    // --- Step 3: Compute scores ---
    const { keywordScore, keywords } = computeATSScore(matches);

    // --- Step 4: Format analysis (if we have PDF metadata) ---
    // For now, we use heuristic analysis on the extracted text
    // Real PDF metadata would come from the initial upload; we simulate with basic stats
    const formatAnalysis = analyzeATSFormat(
      cvText,
      { numpages: Math.ceil(cvText.length / 3000) }, // Rough estimate
      cvText.length * 2 // Rough byte estimate
    );

    // --- Step 5: Company ATS lookup ---
    let companyATS: CompanyATSInfo | undefined;
    const searchTerm = companyName || jobUrl || '';
    if (searchTerm) {
      const atsEntry = lookupCompanyATS(searchTerm);
      if (atsEntry) {
        const systemTips = getATSSystemTips(atsEntry.atsSystem);
        companyATS = {
          company: atsEntry.company,
          atsSystem: atsEntry.atsSystem,
          tips: [...atsEntry.tips, ...systemTips],
        };
      }
    }

    // Also try to extract company name from job posting if not provided
    if (!companyATS) {
      const companyFromPosting = extractCompanyFromPosting(jobPosting);
      if (companyFromPosting) {
        const atsEntry = lookupCompanyATS(companyFromPosting);
        if (atsEntry) {
          const systemTips = getATSSystemTips(atsEntry.atsSystem);
          companyATS = {
            company: atsEntry.company,
            atsSystem: atsEntry.atsSystem,
            tips: [...atsEntry.tips, ...systemTips],
          };
        }
      }
    }

    // --- Step 6: Blend scores ---
    // Keyword score is 80% of total, format is 20%
    const overallScore = Math.round(keywordScore * 0.8 + formatAnalysis.formatScore * 0.2);

    // --- Step 7: Build response ---
    const result: ATSScoreResult = {
      overallScore,
      keywordScore,
      formatScore: formatAnalysis.formatScore,
      keywords,
      formatIssues: formatAnalysis.issues,
      recommendations: recommendations.map((r) => ({
        action: r.action,
        section: r.section,
        priority: r.priority as 'critical' | 'high' | 'medium',
        keywords: r.keywords,
        example: r.example,
      })),
      companyATS,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('ATS scoring error:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing your CV. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Try to extract company name from job posting text
 * Looks for patterns like "About [Company]", "[Company] is hiring", etc.
 */
function extractCompanyFromPosting(text: string): string | null {
  const patterns = [
    /(?:about|join)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is|\s+—|\s+-|\s*\n)/i,
    /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+we|\s*,|\s*\n)/i,
    /^([A-Z][A-Za-z0-9\s&.]+?)\s+(?:is hiring|is looking|seeks)/im,
    /company:\s*([A-Za-z0-9\s&.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 1 && name.length < 50) {
        return name;
      }
    }
  }

  return null;
}
