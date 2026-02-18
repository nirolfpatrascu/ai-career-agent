// ============================================================================
// Knowledge Base: In-Demand Skills & Certifications
// Current market demand signals and certification ROI
// Sources: LinkedIn Jobs data, Stack Overflow Survey, Burning Glass/Lightcast,
//          Dice Tech Salary Survey, certification vendor data (public)
// ============================================================================

export const SKILLS_DEMAND = `=== IN-DEMAND SKILLS & CERTIFICATIONS (2025-2026) ===

HOTTEST SKILLS BY DEMAND GROWTH (year-over-year job posting increases):

AI & ML:
- Generative AI / LLM integration: +380% YoY demand. Every company wants to add AI features.
- RAG (Retrieval-Augmented Generation): +250% YoY. The #1 enterprise AI pattern.
- Prompt Engineering: +200% YoY. Emerging as a distinct skill, especially for AI-first products.
- AI Agents / Agentic Workflows: +180% YoY. Building autonomous AI systems that can take actions.
- MLOps / ML Engineering: +85% YoY. Deploying and monitoring ML in production.
- Computer Vision: +45% YoY. Steady demand in manufacturing, healthcare, autonomous vehicles.

Cloud & Infrastructure:
- Kubernetes: +35% YoY. Standard for container orchestration at scale.
- Terraform / IaC: +40% YoY. Infrastructure as Code is now table stakes.
- AWS/Azure/GCP: Steady high demand. Azure growing fastest due to enterprise + OpenAI partnership.

Development:
- TypeScript: +30% YoY. Replacing JavaScript as the default for new projects.
- Next.js: +55% YoY. Dominant React meta-framework.
- Rust: +50% YoY. Growing in systems, crypto, and performance-critical applications.
- Go: +25% YoY. Standard for cloud-native services and DevOps tooling.

Automation:
- n8n / Make / Zapier: +120% YoY. No-code/low-code automation is exploding.
- RPA: -15% YoY. Declining as standalone skill; growing when combined with AI.
- Process Mining: +40% YoY (Celonis, UiPath Process Mining, SAP Signavio).

DECLINING SKILLS (proceed with caution):
- jQuery: -25% YoY. Legacy maintenance only.
- PHP (standalone): -15% YoY. Laravel ecosystem still viable but shrinking.
- Pure RPA without AI: -15% YoY. UiPath/AA pivoting hard to AI.
- Hadoop: -30% YoY. Replaced by cloud-native data platforms.
- On-premises infrastructure management: -20% YoY. Cloud migration accelerating.

CERTIFICATIONS BY ROI (salary impact + market recognition):

HIGHEST ROI (worth the investment):
- AWS Solutions Architect Associate: +15-20% salary impact. ~2-3 months study. Most recognized cloud cert globally. Cost: $150 exam.
- Azure AZ-305 (Solutions Architect): +15-20% salary impact. ~2-3 months. Strong in enterprise. Cost: $165 exam.
- Google Professional Cloud Architect: +15-20% salary impact. ~2-3 months. Smaller market but highest average salary.
- Kubernetes CKA/CKAD: +10-15% salary impact. ~1-2 months. Hands-on exam format highly respected. Cost: $395 exam.
- Terraform Associate: +10% salary impact. ~1 month. Quick win, widely recognized. Cost: $70.50 exam.

GOOD ROI (solid investment):
- Azure AZ-900 (Fundamentals): +5% salary impact but removes the "no cloud" blocker. 2-3 weeks study. FREE learning path, $99 exam (often free vouchers available).
- Azure AI-102 (AI Engineer): +10-15% salary impact. Growing rapidly in relevance. 4-6 weeks study. $165 exam.
- AWS Cloud Practitioner: Same as AZ-900 for AWS ecosystem. Entry-level, removes blockers.
- Google Data Analytics Certificate: Entry-level, good for career changers. 3-6 months on Coursera.
- CompTIA Security+: Required for many government/defense contracts. +10% salary impact.

LOWER ROI (situational value):
- PMP: Traditional project management. Less valued in agile-first tech companies. Still relevant in enterprise/consulting.
- ITIL: Relevant for IT service management roles but rarely moves salary needle in engineering.
- Scrum Master (CSM/PSM): Easy to get, everyone has it. Low differentiation. PSM II has more value.
- Vendor-specific RPA certs (UiPath/AA): Only valuable if staying in RPA. Don't invest if pivoting away.

FREE LEARNING RESOURCES (highest quality, no cost):
- Microsoft Learn: All Azure cert learning paths (free, excellent quality)
- AWS Skill Builder: Free digital training for all AWS certs
- Google Cloud Skills Boost: Free labs and courses
- freeCodeCamp: Full-stack web development curriculum
- fast.ai: Practical Deep Learning course (best practical ML course available)
- CS50 (Harvard): Introduction to Computer Science
- The Odin Project: Full-stack web development
- LeetCode (free tier): Algorithm practice for interviews
- Kaggle Learn: Short, practical ML/data science courses

PAID RESOURCES (worth it):
- Coursera Plus ($59/month): Access to all courses. Andrew Ng's ML Specialization is here.
- LinkedIn Learning ($30/month): Broad tech courses, certificates show on LinkedIn profile.
- A Cloud Guru ($47/month): Best cloud certification prep platform.
- Udemy (sale prices $10-15): Quality varies wildly. Check reviews. Best for specific tech topics.
- Frontend Masters ($39/month): Best for JavaScript/TypeScript/React deep dives.
`;

/**
 * Get skills demand context relevant to a specific career target
 */
export function getSkillsDemandContext(targetRole: string): string {
  const role = targetRole.toLowerCase();

  let focused = SKILLS_DEMAND;

  if (role.includes('ai') || role.includes('ml') || role.includes('machine learning')) {
    focused += `\nPRIORITY SKILLS FOR AI/ML ROLES (ranked by hiring impact):
1. Python + PyTorch/TensorFlow (table stakes — must have)
2. LLM integration (Claude API, OpenAI API, LangChain, LlamaIndex)
3. RAG pipeline design & implementation
4. Vector databases (Pinecone, Weaviate, ChromaDB, pgvector)
5. MLOps (MLflow, Weights & Biases, model monitoring)
6. Cloud ML services (SageMaker, Azure ML, Vertex AI)
7. Fine-tuning & prompt optimization
8. AI agent frameworks (CrewAI, AutoGen, LangGraph)
MINIMUM VIABLE PORTFOLIO: 1 RAG app + 1 AI agent + 1 fine-tuned model deployment\n`;
  } else if (role.includes('architect') || role.includes('solution')) {
    focused += `\nPRIORITY SKILLS FOR SA ROLES (ranked by hiring impact):
1. Cloud platform deep knowledge (pick AWS or Azure, learn one deeply)
2. System design & scalability patterns
3. Enterprise integration (APIs, message queues, event-driven architecture)
4. Presentation & whiteboarding skills
5. Business case development (ROI, TCO analysis)
6. Security & compliance awareness
7. Multi-cloud & hybrid architecture
8. AI/ML integration patterns (growing requirement)
MINIMUM CERTS: One cloud professional-level cert + one specialty cert\n`;
  } else if (role.includes('full') || role.includes('frontend') || role.includes('web')) {
    focused += `\nPRIORITY SKILLS FOR FULL-STACK ROLES (ranked by hiring impact):
1. TypeScript (table stakes for 2025+ roles)
2. React 18+ / Next.js 14+ (dominant framework combo)
3. Node.js / Express or Fastify (backend)
4. PostgreSQL + Redis (database layer)
5. Tailwind CSS (fastest growing CSS approach)
6. Docker + CI/CD (deployment competency)
7. Testing (Jest, Playwright, React Testing Library)
8. Authentication (OAuth, JWT, NextAuth)
MINIMUM VIABLE PORTFOLIO: 2-3 deployed full-stack apps with auth, database, and polished UI\n`;
  } else if (role.includes('devops') || role.includes('cloud') || role.includes('sre')) {
    focused += `\nPRIORITY SKILLS FOR DEVOPS/CLOUD ROLES (ranked by hiring impact):
1. Cloud platform (AWS or Azure, deep knowledge)
2. Terraform / Infrastructure as Code
3. Docker + Kubernetes
4. CI/CD (GitHub Actions, GitLab CI, Jenkins)
5. Monitoring & observability (Datadog, Grafana, Prometheus)
6. Linux system administration
7. Networking fundamentals (DNS, load balancing, CDN)
8. Security (IAM, secrets management, vulnerability scanning)
MINIMUM CERTS: Cloud Associate + one specialty (e.g., DevOps Professional or CKA)\n`;
  } else if (role.includes('consult')) {
    focused += `\nPRIORITY SKILLS FOR CONSULTING ROLES (ranked by hiring impact):
1. Domain expertise (automation, AI, cloud — pick your niche)
2. Client communication & stakeholder management
3. Project scoping & estimation
4. Business case development
5. Technical architecture (prove you can design, not just advise)
6. Content creation (blog, LinkedIn, speaking — establishes authority)
7. Sales & proposal writing
8. Financial modeling basics (for ROI/TCO analyses)
MINIMUM PORTFOLIO: 3-5 demo projects that serve as sales tools for potential clients\n`;
  }

  return focused;
}
