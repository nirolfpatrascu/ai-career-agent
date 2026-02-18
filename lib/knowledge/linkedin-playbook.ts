// ============================================================================
// Knowledge Base: LinkedIn Optimization Playbook
// Data-driven LinkedIn strategies for tech professionals in career transition
// ============================================================================

export const LINKEDIN_PLAYBOOK = `=== LINKEDIN OPTIMIZATION KNOWLEDGE ===

LinkedIn has 1 billion members but only ~1% actively post content. This creates massive opportunity for active users. Recruiters use LinkedIn as their primary sourcing tool — 87% of recruiters use it.

PROFILE OPTIMIZATION (in priority order):

1. HEADLINE (most important — shows in search results, comments, messages)
   - Formula: [Target Role] | [Key Differentiator] | [Proof Point]
   - BAD: "Technical Enablement Engineer at UiPath"
   - GOOD: "AI Solutions Architect | Enterprise Automation → AI Transformation | Building with Claude API, n8n, Azure AI"
   - Include target role keywords (recruiters search by keywords)
   - Update BEFORE job searching — your current title auto-populates from Experience
   - Max 220 characters, front-load keywords (truncates in mobile/search)

2. ABOUT SECTION (your story — first 3 lines show without clicking "see more")
   - First 3 lines must hook: who you are, what you do, for whom
   - Structure: Hook → Background → Current focus → What you're looking for → CTA
   - Include keywords naturally (LinkedIn search indexes this section)
   - Write in first person, conversational tone
   - End with a CTA: "Open to AI Solutions Architect roles (remote EU) — let's connect."
   - 2,600 character max. Use all of it.

3. FEATURED SECTION (visual proof)
   - Pin 3-6 items: best projects, portfolio links, articles, presentations
   - Use custom thumbnails (Canva works well)
   - This is the visual portfolio that proves your headline claims
   - Reorder periodically to keep fresh content at top

4. EXPERIENCE SECTION
   - Mirror your CV but optimize for LinkedIn's search algorithm
   - Add rich media: slides, documents, links to projects
   - Include relevant keywords in descriptions (LinkedIn indexes them)
   - For career changers: update current role description to reflect new direction
   - Add freelance/consulting experience as a separate position

5. SKILLS SECTION
   - LinkedIn allows 50 skills. Use ALL 50.
   - Put target role skills FIRST (top 3 shown by default, most weight in search)
   - Take LinkedIn Skill Assessments for top skills (badge boosts profile visibility)
   - Get endorsements from colleagues (even 5-10 helps)
   - Remove irrelevant skills (Excel, PowerPoint unless relevant to target role)

6. RECOMMENDATIONS
   - 3-5 recommendations from different roles/companies = social proof
   - Ask specifically: "Could you mention my work on [X project] and my ability to [Y skill]?"
   - Provide a draft to make it easy for them
   - Reciprocate — write recommendations for others first

7. PROFILE SETTINGS FOR JOB SEEKERS
   - Turn ON "Open to Work" (recruiter-only mode, not the green banner)
   - Set to target role titles, locations, and work types
   - Turn ON "Creator Mode" to increase content distribution
   - Set profile to "All LinkedIn Members" for messages
   - Add relevant hashtags to Creator Mode topics (max 5)

CONTENT STRATEGY (for career changers):

Posting consistently is the #1 thing that accelerates career transitions on LinkedIn. You don't need to go viral — you need to be visible to the right 500 people.

WHAT TO POST (1-3 times per week):
- Project showcases: "I just built [X] with [tech stack]. Here's what I learned..."
- Learning journey: "Week 3 of my Azure certification journey. Key takeaway: [insight]"
- Industry analysis: "3 trends I'm seeing in AI automation after [event/report]"
- Before/after: "How I went from [old skill] to [new skill] in [time]"
- Curated insights: "I read [report/article]. Here are the 3 things that matter for [audience]"

WHAT NOT TO POST:
- Generic motivational quotes
- AI-generated posts without personal insight (people can tell)
- Complaints about job search or rejections
- Political content unrelated to your professional domain
- Reposting without adding your own commentary

POST FORMAT BEST PRACTICES:
- Hook in first 2 lines (determines whether people click "see more")
- Short paragraphs (1-3 sentences)
- Use line breaks liberally — dense blocks of text get scrolled past
- Include 3-5 relevant hashtags at the end
- Add an image or document (3x more engagement than text-only)
- End with a question or CTA to drive comments
- Best posting times: Tue-Thu, 8-10 AM in your target market's timezone

NETWORKING STRATEGY:
- Connect with: recruiters in target domain, hiring managers, peers in target role
- Personalize EVERY connection request (3-4 sentences max)
- Comment on 5-10 posts daily from people in your target domain (most underrated growth tactic)
- Join 3-5 LinkedIn groups in target domain (shows in profile, access to group posts)
- After connecting: don't immediately pitch. Engage with their content first.

LINKEDIN FOR CAREER CHANGERS — KEY MOVES:
1. Update headline to target role BEFORE starting job search
2. Publish 4-6 posts about your new domain in the first 2 weeks
3. Build a "Featured" section with projects in the new domain
4. Get 2-3 recommendations mentioning skills relevant to new role
5. Engage daily with content in the target domain (comments > posts for networking)
6. Use LinkedIn's "Career Explorer" tool to find roles matching your skills
`;

/**
 * Get LinkedIn optimization context for a specific career transition
 */
export function getLinkedInContext(currentRole: string, targetRole: string): string {
  const target = targetRole.toLowerCase();

  let roleSpecific = '';

  if (target.includes('architect') || target.includes('solution')) {
    roleSpecific = `\nLINKEDIN TIPS FOR ASPIRING SOLUTIONS ARCHITECTS:
- Headline should include "Solutions Architect" or "Enterprise Architect" even before you have the title
- Post about system design decisions, architecture trade-offs, and technology evaluations
- Share diagrams (architecture diagrams get high engagement in tech LinkedIn)
- Connect with other SAs and pre-sales engineers at target companies
- Follow and comment on content from cloud vendors (AWS, Azure, GCP) and analyst firms (Gartner, Forrester)\n`;
  } else if (target.includes('ai') || target.includes('ml')) {
    roleSpecific = `\nLINKEDIN TIPS FOR ASPIRING AI/ML ENGINEERS:
- Headline: include "AI" and specific tech (Claude, LangChain, RAG, etc.)
- Post project demos with short video/GIF walkthroughs (AI demos get very high engagement)
- Share learnings from papers or new model releases
- Follow key voices: Andrej Karpathy, Andrew Ng, Anthropic/OpenAI company pages
- Join AI-focused LinkedIn groups (many have 50K+ members)\n`;
  } else if (target.includes('consult')) {
    roleSpecific = `\nLINKEDIN TIPS FOR ASPIRING CONSULTANTS:
- Position yourself as a domain expert, not a generalist
- Headline should include your specialty niche
- Publish longer "article" posts that demonstrate thought leadership
- Share case studies (anonymized) from past work
- Featured section should include any speaking engagements, podcasts, or published content
- Add "Providing Services" section with your consulting offerings\n`;
  }

  return LINKEDIN_PLAYBOOK + roleSpecific;
}
