// ============================================================================
// Knowledge Base: CV / Resume Best Practices
// Proven frameworks for tech CVs that pass ATS and impress hiring managers
// ============================================================================

export const CV_BEST_PRACTICES = `=== CV / RESUME OPTIMIZATION KNOWLEDGE ===

ATS (APPLICANT TRACKING SYSTEM) RULES:
- 75% of CVs are rejected by ATS before a human sees them
- Use standard section headers: "Experience", "Education", "Skills", "Certifications"
- Avoid tables, columns, graphics, headers/footers — ATS can't parse them
- Use .pdf format (not .docx) for consistent rendering
- Include exact keyword matches from job descriptions (ATS does literal matching)
- Spell out abbreviations on first use: "Amazon Web Services (AWS)"
- Use standard fonts (Arial, Calibri, Times New Roman)

STRUCTURE (reverse chronological, 2 pages max for <15 years, 3 max for 15+):
1. PROFESSIONAL SUMMARY (3-4 lines)
   - Formula: [Years] experience in [domain]. Specializing in [2-3 key skills]. [Quantified achievement]. Seeking [target role] at [company type].
   - BAD: "Passionate team player with excellent communication skills"
   - GOOD: "14-year software engineer with enterprise automation architecture expertise. Led UiPath deployments across 3 Fortune 500 clients reducing manual processing by 85%. Transitioning to AI Solutions Architecture."

2. SKILLS SECTION (immediately after summary)
   - Group by category: Languages, Frameworks, Cloud, AI/ML, Tools, Certifications
   - List only skills you can discuss in an interview
   - Match job posting keywords exactly
   - Include version numbers for rapidly evolving tech: "Python 3.11", "React 18"

3. EXPERIENCE (reverse chronological)
   - Each role: Company | Title | Dates | Location
   - 3-6 bullet points per role using STAR-lite format
   - Formula: [Action verb] + [what you did] + [quantified result]
   - BAD: "Responsible for automation development"
   - GOOD: "Architected 12 enterprise RPA workflows processing 50,000+ documents/month, reducing manual processing time by 85%"
   - Power verbs: Architected, Built, Delivered, Designed, Implemented, Led, Optimized, Reduced, Scaled, Shipped
   - QUANTIFY EVERYTHING: revenue impact, time saved, users served, systems scaled, team size led

4. CERTIFICATIONS & EDUCATION
   - List certifications with dates (shows currency)
   - Include in-progress certifications: "AZ-900 Azure Fundamentals (expected March 2026)"
   - Education: degree, university, year. No GPA unless exceptional and <3 years out.

5. PROJECTS / PORTFOLIO (for career changers — critical section)
   - 2-3 relevant side projects with: name, tech stack, what it does, link
   - This is the #1 way career changers prove new skills
   - Each project should align with target role requirements

COMMON MISTAKES:
- Objective statement instead of professional summary (outdated since ~2015)
- Listing responsibilities instead of achievements
- No quantified metrics (numbers are the most important part)
- Generic skills like "Microsoft Office" or "teamwork"
- Inconsistent date formats or gaps without explanation
- More than 3 pages (recruiters spend 7 seconds on first scan)
- Including photo, age, marital status (not expected in US/UK, varies in EU)
- Using first person ("I designed...") — use implied first person ("Designed...")

CAREER TRANSITION CV TIPS:
- Lead with a "Career Transition Summary" that explicitly names the pivot
- Create a "Relevant Projects" section above experience for new-domain work
- Map old skills to new domain language:
  * "RPA orchestration" → "workflow orchestration & distributed systems"
  * "Process analysis" → "systems analysis & requirements engineering"
  * "Training delivery" → "technical enablement & developer advocacy"
- Include a "Technical Portfolio" section linking to GitHub/live demos
- Address the career change in 1 sentence in the summary, then move on — don't over-explain

KEYWORDS BY ROLE (include these exact terms for ATS matching):
- Solutions Architect: system design, enterprise architecture, scalability, cloud infrastructure, stakeholder management, technical requirements, proof of concept, vendor evaluation
- AI/ML Engineer: machine learning, deep learning, NLP, computer vision, PyTorch, TensorFlow, model training, model deployment, MLOps, data pipeline, feature engineering
- Full-Stack Developer: React, Node.js, TypeScript, REST API, GraphQL, PostgreSQL, CI/CD, responsive design, authentication, testing
- DevOps/Cloud: AWS/Azure/GCP, Terraform, Docker, Kubernetes, CI/CD, monitoring, infrastructure as code, incident response, SRE
- Product Manager: roadmap, user research, A/B testing, stakeholder alignment, sprint planning, metrics, OKRs, go-to-market, competitive analysis
`;

/**
 * Get CV optimization context for a specific target role
 */
export function getCVContext(targetRole: string): string {
  const role = targetRole.toLowerCase();

  let roleSpecific = '';

  if (role.includes('architect') || role.includes('solution')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (Solutions Architect):
- Emphasize breadth over depth — SAs need to show they understand multiple technology domains
- Include architecture diagrams or links to design documents you've authored
- Highlight customer-facing experience (workshops, presentations, demos)
- Show business impact, not just technical achievements
- Mention specific enterprise products/platforms by name (Salesforce, ServiceNow, SAP, etc.)
- Include pre-sales experience if any (RFP responses, POCs, competitive evaluations)\n`;
  } else if (role.includes('ai') || role.includes('ml') || role.includes('machine learning')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (AI/ML Engineer):
- List specific models you've trained/deployed and their performance metrics
- Include dataset sizes and computational requirements
- Show the full ML lifecycle: data → training → evaluation → deployment → monitoring
- Mention specific frameworks with version numbers
- Link to papers, blog posts, or Kaggle profiles
- Distinguish between "used an API" and "trained a model" — both are valuable but different\n`;
  } else if (role.includes('full') || role.includes('frontend') || role.includes('react')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (Full-Stack/Frontend Developer):
- Link to deployed projects (not just GitHub repos)
- Include screenshots or GIF previews in your portfolio README
- Show breadth: authentication, database, API, UI, deployment, testing
- Mention performance optimization (Core Web Vitals, Lighthouse scores)
- Include mobile-responsive design experience
- Show you can ship: "Deployed to production serving X users"\n`;
  } else if (role.includes('devops') || role.includes('cloud') || role.includes('sre')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (DevOps/Cloud/SRE):
- List specific services you've managed (EC2, Lambda, EKS, etc. — not just "AWS")
- Include infrastructure scale (servers managed, requests/second, uptime percentages)
- Show cost optimization achievements ("Reduced cloud spend by 35%")
- Mention incident response experience and on-call rotations
- Include IaC examples (Terraform modules, CloudFormation templates)
- Certifications matter more in cloud than most other domains\n`;
  } else if (role.includes('manager') || role.includes('lead') || role.includes('head')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (Engineering Manager/Lead):
- Lead with team size and scope of responsibility
- Show hiring experience (interviews conducted, team growth)
- Include both technical and people achievements
- Mention process improvements (velocity increases, release frequency)
- Show cross-functional collaboration (product, design, stakeholders)
- Include mentoring examples with outcomes\n`;
  } else if (role.includes('consult')) {
    roleSpecific = `\nROLE-SPECIFIC CV ADVICE (Consultant):
- Lead with client impact and revenue generated
- Show industry breadth (multiple sectors served)
- Include specific methodologies and frameworks
- Highlight repeat clients or contract extensions as trust signals
- Show both strategic (advisory) and hands-on (implementation) experience
- Include speaking engagements, publications, or thought leadership\n`;
  }

  return CV_BEST_PRACTICES + roleSpecific;
}
