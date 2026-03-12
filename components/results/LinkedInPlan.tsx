'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { AnalysisResult } from '@/lib/types';
import { FeedbackButton } from './FeedbackButton';

interface LinkedInPlanProps {
  analysis: AnalysisResult;
}

// Icons
const CopyIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const CheckIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.activeElement as HTMLButtonElement;
      if (btn) {
        btn.dataset.copied = 'true';
        setTimeout(() => { btn.dataset.copied = ''; }, 2000);
      }
    } catch { /* fallback: user can select manually */ }
  };

  return (
    <button
      onClick={handleCopy}
      className="group/copy flex items-center gap-1.5 text-xs text-text-tertiary hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/[0.06] data-[copied=true]:text-success"
      title={t('linkedin.copy')}
    >
      <span className="group-data-[copied=true]/copy:hidden">{CopyIcon}</span>
      <span className="hidden group-data-[copied=true]/copy:inline text-success">{CheckIcon}</span>
      <span className="group-data-[copied=true]/copy:hidden">{t('linkedin.copy')}</span>
      <span className="hidden group-data-[copied=true]/copy:inline">{t('linkedin.copied')}</span>
    </button>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-black/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function LinkedInPlan({ analysis }: LinkedInPlanProps) {
  const { t } = useTranslation();

  // Compute a LinkedIn Profile Grade (0-10)
  const profileGrade = useMemo(() => {
    const { strengths, gaps, fitScore } = analysis;
    const differentiators = strengths.filter(s => s.tier === 'differentiator').length;
    const criticalGaps = gaps.filter(g => g.severity === 'critical').length;
    const hasCerts = strengths.some(s => s.title.toLowerCase().includes('certif'));
    let grade = fitScore.score;
    grade += Math.min(differentiators, 3) * 0.5;
    grade -= criticalGaps * 0.5;
    if (hasCerts) grade += 0.5;
    return Math.max(0, Math.min(10, Math.round(grade)));
  }, [analysis]);

  const plan = useMemo(() => {
    const { metadata, strengths, gaps, roleRecommendations } = analysis;
    const target = metadata.targetRole;
    const sortedRoles = [...roleRecommendations].sort((a, b) => b.fitScore - a.fitScore);
    const topRole = sortedRoles[0];

    // --- Headline suggestions ---
    const differentiators = strengths.filter(s => s.tier === 'differentiator').map(s => s.title);
    const strongSkills = strengths.filter(s => s.tier === 'strong').map(s => s.title);
    const topSkillPhrase = differentiators.length > 0
      ? differentiators.slice(0, 2).join(' & ')
      : strongSkills.slice(0, 2).join(' & ');

    const headlines = [
      `${target} | ${topSkillPhrase} | ${differentiators[1] || strongSkills[2] || `Driving ${target} Impact`}`,
      `${target} → ${topRole?.title || target} | ${differentiators[0] || strongSkills[0] || 'Tech Professional'} | Open to Opportunities`,
      `${topRole?.title || target} | ${metadata.country} (Remote) | ${topSkillPhrase}`,
    ];

    // --- About section draft ---
    const currentTitle = analysis.profile?.currentRole || 'professional';
    const strengthBullets = strengths.slice(0, 3).map(s => s.title).join(', ');
    const gapActions = gaps.filter(g => g.severity === 'critical').slice(0, 2).map(g => g.closingPlan);

    // Pull top quantified highlight from CV experience (prefer bullets containing a number/metric)
    const topHighlight = (analysis.profile?.experience ?? [])
      .flatMap(e => e.highlights ?? [])
      .find(h => typeof h === 'string' && /\d/.test(h));

    const about = `As a ${currentTitle} transitioning into ${target}, I bring ${topSkillPhrase} with a track record of delivering results.

What I bring to the table:
${topHighlight
  ? `→ ${topHighlight}\n${strengths.slice(0, 3).map(s => `→ ${s.title}: ${s.description.split('.')[0]}.`).join('\n')}`
  : strengths.slice(0, 4).map(s => `→ ${s.title}: ${s.description.split('.')[0]}.`).join('\n')}

Currently focused on:
${gapActions.length > 0 ? gapActions.map(a => `→ ${a.split('.')[0]}.`).join('\n') : `→ Deepening expertise in ${target} and staying current with industry developments.`}

I'm passionate about delivering impact as a ${target}. Let's connect if you're hiring or working in this space.

🔍 Open to: ${target} roles${metadata.country ? ` | ${metadata.country} / Remote` : ''}`;

    // --- Featured projects ---
    const github = analysis.githubAnalysis;

    // Item 1: Portfolio Project
    let portfolioItem: { title: string; tip: string };
    if (github && github.strengths.length > 0) {
      const topStrength = github.strengths[0];
      const partA = `${topStrength.evidence} — This is your strongest signal for ${target} roles. Optimize the README with: problem statement, tech decisions, live demo link, and measurable results.`;
      const partB = `💡 Want a stronger signal? Consider building '${github.projectIdea.name}' (${github.projectIdea.techStack.join(', ')}) — ${github.projectIdea.whyRelevant} Estimated effort: ${github.projectIdea.estimatedTime}.`;
      portfolioItem = { title: topStrength.area, tip: `${partA}\n\n${partB}` };
    } else if (github) {
      portfolioItem = {
        title: `Build: ${github.projectIdea.name}`,
        tip: `${github.projectIdea.description} Tech stack: ${github.projectIdea.techStack.join(', ')}. ${github.projectIdea.whyRelevant} Estimated: ${github.projectIdea.estimatedTime}. Pin it on LinkedIn as Featured once live.`,
      };
    } else {
      portfolioItem = {
        title: `Portfolio Project: ${target}`,
        tip: `Build one focused project that solves a real problem using ${topSkillPhrase}. Deploy it live, write a clear README with screenshots and measurable outcomes. A single well-documented project outperforms 10 half-finished ones for ${target} hiring managers.`,
      };
    }

    // Item 2: Case Study / Article
    const primaryGap = gaps.find(g => g.severity === 'critical') || gaps.find(g => g.severity === 'moderate');
    const articleTitle = primaryGap
      ? `"How I applied ${primaryGap.skill} to solve a real problem — and what I'd do differently"`
      : `"${target} in ${new Date().getFullYear()}: what most people get wrong about ${topSkillPhrase}"`;
    const caseStudyItem = {
      title: `Case Study or Article`,
      tip: `${articleTitle} — Long-form articles targeting '${primaryGap?.skill || topSkillPhrase}' get significant algorithmic reach to recruiters searching for ${target} candidates. Lead with a specific result or number in the first line. Aim for 600–900 words with one concrete takeaway.`,
    };

    // Item 3: Certification Badge
    const certGap = gaps.find(g => g.severity === 'critical') || gaps.find(g => g.severity === 'moderate');
    const existingCert = analysis.profile?.certifications?.[0];
    const certItem = certGap
      ? {
          title: `Certification: ${certGap.skill}`,
          tip: `${existingCert ? `You already have "${existingCert}" — pin it now as a featured credential. ` : ''}Earning a recognised credential in ${certGap.skill} directly addresses your most critical gap for ${target} roles. ${certGap.closingPlan.split('.')[0]}. Once earned, pin the Credly/Coursera badge here — credentials with a clickable verification link get 40% more profile views from recruiters filtering for ${certGap.skill}.`,
        }
      : {
          title: existingCert ? `Pin Your Certification: ${existingCert}` : `Advanced Certification in ${topSkillPhrase}`,
          tip: existingCert
            ? `You already have "${existingCert}" — this is your strongest credentialing signal for ${target} roles. Pin it as a featured item with the verification link. An advanced or specialisation credential in ${topSkillPhrase} would further differentiate you from other candidates.`
            : `Your profile is already strong. An advanced or specialisation credential in ${topSkillPhrase} would signal seniority and differentiate you from other ${target} candidates. Look for vendor-specific certs (AWS, GCP, Azure, etc.) or role-specific ones aligned to your top target companies.`,
        };

    const featuredItems = [portfolioItem, caseStudyItem, certItem];

    // --- Skills to add/reorder ---
    const skillsToAdd: string[] = [];
    const skillsToRemove: string[] = [];

    gaps.forEach(g => {
      if (g.severity === 'critical' || g.severity === 'moderate') {
        skillsToAdd.push(g.skill);
      }
    });
    // Add target role as a keyword; also add top recommended role title if it differs
    skillsToAdd.push(target);
    if (topRole?.title && topRole.title !== target) skillsToAdd.push(topRole.title);

    // Skills to deprioritize: supporting-tier strengths the user actually has
    // that are not already in the "add" list for the target role
    const addSet = new Set(skillsToAdd.map(s => s.toLowerCase()));
    const supportingSkills = strengths
      .filter(s => s.tier === 'supporting')
      .map(s => s.title)
      .filter(s => !addSet.has(s.toLowerCase()));
    skillsToRemove.push(...supportingSkills.slice(0, 4));

    // --- Content plan ---
    const contentIdeas = [
      { type: 'project', text: `"I just built [${topRole?.title || target} project] with [tech stack]. Here's what I learned and 3 things that surprised me."` },
      { type: 'learning', text: `"Week [X] of my ${gaps[0]?.skill || 'cloud certification'} journey. Key insight: [specific takeaway]. Here's what I'd do differently."` },
      { type: 'insight', text: `"${strengthBullets} taught me something most ${target}s miss: [counterintuitive insight from your experience]."` },
      { type: 'comparison', text: `"I went from [current domain] to ${target}. These 3 skills transferred perfectly — and these 2 didn't."` },
    ];

    // --- Connection strategy ---
    const connectionTargets = [
      ...(topRole?.exampleCompanies?.slice(0, 3) || []).map(c => `Recruiters and engineers at ${c}`),
      `Other ${target}s in ${metadata.country || 'your region'}`,
      `Content creators in the ${target} space`,
    ];

    return { headlines, about, featuredItems, skillsToAdd, skillsToRemove, contentIdeas, connectionTargets };
  }, [analysis]);

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">
              {t('linkedin.title')}
            </h2>
            <p className="text-text-tertiary text-sm mt-0.5">
              {t('linkedin.subtitle')}
            </p>
          </div>
        </div>
        <FeedbackButton section="linkedinPlan" />
      </div>

      {/* Profile Grade Badge */}
      <div className={`rounded-xl border p-4 flex items-center gap-4 ${profileGrade >= 6 ? 'border-success/20 bg-success/[0.04]' : 'border-warning/20 bg-warning/[0.04]'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg ${profileGrade >= 6 ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
          {profileGrade}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">{t('linkedin.grade')}</p>
          <p className="text-xs text-text-secondary mt-0.5">
            {profileGrade >= 6 ? t('linkedin.gradeGood') : t('linkedin.gradeNeedsWork')}
          </p>
        </div>
      </div>

      {/* 1. Headline */}
      <SectionCard
        title={t('linkedin.headline')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
      >
        <p className="text-sm text-text-secondary mb-4">
          {t('linkedin.headlineAdvice')}
        </p>
        <div className="space-y-3">
          {plan.headlines.map((h, i) => (
            <div key={i} className="flex items-start justify-between gap-3 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-xs font-bold text-primary/60 bg-primary/[0.08] rounded-md px-1.5 py-0.5 mt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-text-primary font-medium break-words">{h}</p>
              </div>
              <CopyButton text={h} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 2. About Section */}
      <SectionCard
        title={t('linkedin.aboutSection')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
      >
        <p className="text-sm text-text-secondary mb-4">
          {t('linkedin.aboutAdvice')}
        </p>
        <div className="relative bg-black/[0.03] border border-black/[0.06] rounded-xl p-4">
          <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
            {plan.about}
          </pre>
          <div className="absolute top-3 right-3">
            <CopyButton text={plan.about} />
          </div>
        </div>
      </SectionCard>

      {/* 3. Featured Section */}
      <SectionCard
        title={t('linkedin.featured')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
      >
        <p className="text-sm text-text-secondary mb-4">
          {t('linkedin.featuredAdvice')}
        </p>
        <div className="space-y-3">
          {plan.featuredItems.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
              <div className="w-6 h-6 rounded-lg bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-orange">{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                <p className="text-xs text-text-tertiary mt-1 leading-relaxed">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 4. Skills */}
      <SectionCard
        title={t('linkedin.skills')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skills to add / prioritize */}
          <div>
            <p className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {t('linkedin.skillsAdd')}
            </p>
            <div className="space-y-1.5">
              {Array.from(new Set(plan.skillsToAdd)).slice(0, 8).map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-secondary bg-success/[0.04] border border-success/10 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Skills to deprioritize */}
          <div>
            <p className="text-sm font-semibold text-text-tertiary mb-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {t('linkedin.skillsDeprioritize')}
            </p>
            <div className="space-y-1.5">
              {plan.skillsToRemove.slice(0, 6).map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-tertiary bg-black/[0.02] border border-black/[0.06] rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary flex-shrink-0" />
                  {skill}
                  <span className="text-xs text-text-tertiary/60 ml-auto">{t('linkedin.moveDown')}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-2 italic">
              {t('linkedin.skillsNote')}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* 5. Content Strategy */}
      <SectionCard
        title={t('linkedin.content')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
      >
        <p className="text-sm text-text-secondary mb-4">
          {t('linkedin.contentAdvice')}
        </p>
        <div className="space-y-3">
          {plan.contentIdeas.map((idea, i) => (
            <div key={i} className="flex items-start justify-between gap-3 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0 mt-1 ${
                  idea.type === 'project' ? 'bg-primary/[0.08] text-primary' :
                  idea.type === 'learning' ? 'bg-success/[0.08] text-success' :
                  idea.type === 'insight' ? 'bg-accent-orange/[0.08] text-accent-orange' :
                  'bg-purple-500/[0.08] text-purple-400'
                }`}>
                  {idea.type}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">{idea.text}</p>
              </div>
              <CopyButton text={idea.text} />
            </div>
          ))}
        </div>
        <p className="text-xs text-text-tertiary mt-4">
          {t('linkedin.contentFrequency')}
        </p>
      </SectionCard>

      {/* 6. Connection Strategy */}
      <SectionCard
        title={t('linkedin.connections')}
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
      >
        <p className="text-sm text-text-secondary mb-4">
          {t('linkedin.connectionsAdvice')}
        </p>
        <div className="space-y-2">
          {plan.connectionTargets.map((target, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-text-secondary bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              {target}
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
