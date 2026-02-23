// ============================================================================
// Knowledge Base: Career Transition Patterns
// Common tech career pivots with success factors, timelines, and blockers
// ============================================================================

export interface TransitionPattern {
  from: string;
  to: string;
  difficulty: 'low' | 'medium' | 'high';
  timeToTransition: string;
  transferableSkills: string[];
  criticalGaps: string[];
  successPattern: string;
  commonMistakes: string[];
  fastTrackTip: string;
}

export const TRANSITION_PATTERNS: TransitionPattern[] = [
  {
    from: 'RPA Developer',
    to: 'AI/ML Engineer',
    difficulty: 'high',
    timeToTransition: '6-12 months',
    transferableSkills: ['Process automation thinking', 'Data pipeline understanding', 'Business process analysis', 'Document processing (IDP/OCR)'],
    criticalGaps: ['Python proficiency for ML', 'Statistics & linear algebra', 'ML model training & evaluation', 'Cloud ML platforms (SageMaker/Vertex AI)'],
    successPattern: 'Most successful transitions focus on the automation-AI intersection: building intelligent automation that combines RPA workflows with ML models. The "AI automation architect" niche pays well and has low competition because few people have both skill sets.',
    commonMistakes: ['Trying to become a pure data scientist (over-indexed on theory, ignores their automation advantage)', 'Spending 12 months on courses before building anything', 'Not leveraging their enterprise network from RPA vendor relationships'],
    fastTrackTip: 'Build 3 projects that combine automation + AI: e.g., intelligent document processing pipeline, AI-powered email triage agent, predictive process mining dashboard. These prove you bridge both worlds.',
  },
  {
    from: 'RPA Developer',
    to: 'Solutions Architect',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['Enterprise system integration', 'Process analysis & optimization', 'Stakeholder management', 'Technical documentation', 'Orchestrator/infrastructure management'],
    criticalGaps: ['Cloud platform certification (AWS/Azure/GCP)', 'System design at scale', 'API architecture & microservices', 'Cost optimization & capacity planning'],
    successPattern: 'RPA developers who become SAs leverage their unique advantage: they understand how enterprise processes actually work, not just how technology works. The best pivot is into SA roles at automation/AI vendors where their domain expertise is the differentiator.',
    commonMistakes: ['Applying to pure cloud SA roles without any cloud certification', 'Underselling their enterprise experience', 'Not building a portfolio of architecture diagrams and design documents'],
    fastTrackTip: 'Get AZ-900 + one specialty cert (AI-102 or AZ-305) within 8 weeks. Then target SA roles at automation vendors (n8n, Make, Celonis, Workato) where your domain knowledge gives you an unfair advantage.',
  },
  {
    from: 'Backend Developer',
    to: 'Full-Stack Developer',
    difficulty: 'low',
    timeToTransition: '1-3 months',
    transferableSkills: ['API design', 'Database management', 'Server architecture', 'Testing methodologies', 'Git/CI-CD workflows'],
    criticalGaps: ['React/Vue/Angular (pick one)', 'CSS/Tailwind proficiency', 'State management patterns', 'Responsive design', 'Browser APIs & performance'],
    successPattern: 'Backend devs transitioning to fullstack typically succeed fastest by choosing React + Next.js (largest job market) and building 2-3 full-stack projects that showcase both their backend strength and new frontend skills.',
    commonMistakes: ['Learning frontend in isolation without building real projects', 'Trying to learn all three frameworks instead of mastering one', 'Neglecting CSS — many backend devs can make things work but they look terrible'],
    fastTrackTip: 'Build one polished full-stack app with Next.js that has authentication, a database, and a clean UI. Ship it to production. This single project proves full-stack capability more than any course completion certificate.',
  },
  {
    from: 'Backend Developer',
    to: 'AI/ML Engineer',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['Python proficiency', 'Data processing & pipelines', 'API development', 'System architecture', 'Performance optimization'],
    criticalGaps: ['ML fundamentals (supervised/unsupervised/RL)', 'Model training & evaluation', 'ML frameworks (PyTorch/TensorFlow)', 'MLOps & model deployment', 'Statistics foundation'],
    successPattern: 'Backend devs have the strongest engineering foundation for ML roles. The fastest path is through ML engineering (deploying and scaling models) rather than research (building novel models). Companies desperately need people who can productionize ML.',
    commonMistakes: ['Over-indexing on theory and Kaggle competitions instead of production ML', 'Ignoring MLOps (the actual bottleneck at most companies)', 'Not realizing their engineering skills are more valuable than a fresh PhD in many ML roles'],
    fastTrackTip: 'Build an end-to-end ML pipeline: data ingestion → training → evaluation → deployment → monitoring. Use MLflow or Weights & Biases. This shows you can productionize ML, which is the #1 hiring gap at most companies.',
  },
  {
    from: 'Embedded Systems Engineer',
    to: 'Cloud/DevOps Engineer',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['Low-level system understanding', 'Performance optimization', 'Debugging complex systems', 'Hardware-software integration', 'Safety-critical mindset'],
    criticalGaps: ['Cloud platform (AWS/Azure/GCP)', 'Containerization (Docker/Kubernetes)', 'CI/CD pipelines', 'Infrastructure as Code (Terraform/Pulumi)', 'Linux system administration'],
    successPattern: 'Embedded engineers bring a reliability-first mindset that cloud-native engineers often lack. The IoT/edge computing niche is the perfect bridge — companies building connected devices need someone who understands both the device and the cloud.',
    commonMistakes: ['Trying to learn everything at once instead of focusing on one cloud provider', 'Not recognizing that their C/systems knowledge is actually valuable for performance-critical cloud work', 'Skipping containerization — Docker is the gateway skill'],
    fastTrackTip: 'Get AWS Solutions Architect Associate or AZ-104 within 6 weeks. Containerize a personal project. Then target IoT/edge roles at companies like Siemens, Bosch, or cloud-native IoT startups where your embedded background is a differentiator.',
  },
  {
    from: 'Embedded Systems Engineer',
    to: 'AI/ML Engineer',
    difficulty: 'high',
    timeToTransition: '6-12 months',
    transferableSkills: ['C/C++ (TensorFlow core is C++)', 'Performance optimization', 'Mathematical foundations', 'Signal processing', 'Real-time systems understanding'],
    criticalGaps: ['Python proficiency', 'ML theory & frameworks', 'Data manipulation (pandas/numpy)', 'Cloud ML platforms', 'Modern software development practices (Git, CI/CD, agile)'],
    successPattern: 'The edge AI / TinyML niche is the goldmine. Deploying ML models on embedded hardware (MCUs, FPGAs) is extremely high demand and very few people can do it. This is where embedded + ML skills create a rare combination.',
    commonMistakes: ['Trying to compete with pure ML researchers', 'Abandoning their embedded expertise entirely', 'Not learning Python seriously (treating it as a scripting toy)'],
    fastTrackTip: 'Focus on edge AI/TinyML. Learn TensorFlow Lite, ONNX Runtime. Deploy a model on an STM32 or Raspberry Pi. Companies like Qualcomm, NXP, and Edge Impulse specifically hire for this intersection.',
  },
  {
    from: 'QA/Test Engineer',
    to: 'Software Engineer',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['Testing methodology', 'Bug analysis & debugging', 'API understanding', 'Automation scripting', 'Quality mindset'],
    criticalGaps: ['Production code writing (not just test scripts)', 'System design', 'Data structures & algorithms', 'Framework proficiency (React/Node/Django etc)', 'Deployment & DevOps basics'],
    successPattern: 'QA engineers who already write automation code are halfway there. The key transition is from "testing other peoples code" to "building features." Internal transfers work well — QA engineers who fix the bugs they find often get moved to dev teams.',
    commonMistakes: ['Grinding LeetCode for 6 months instead of building projects', 'Not leveraging their QA background (testing skills are valuable in dev teams)', 'Applying to senior dev roles when they need to accept a mid-level title initially'],
    fastTrackTip: 'Start contributing to the codebase you test. Fix bugs, then build small features. An internal transfer (QA → dev at same company) is 3x easier than external job search. Build 2 side projects to prove you can code independently.',
  },
  {
    from: 'Technical Support/Enablement',
    to: 'Solutions Architect',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['Customer-facing communication', 'Product deep knowledge', 'Troubleshooting complex systems', 'Technical documentation', 'Cross-functional collaboration', 'Demo/presentation skills'],
    criticalGaps: ['System design at enterprise scale', 'Cloud architecture', 'Pre-sales methodology', 'Business case / ROI analysis', 'Competitive landscape knowledge'],
    successPattern: 'Technical enablement engineers at software vendors have the perfect springboard to SA roles. They already know the product deeply and can communicate technically. The gap is usually strategic thinking and architecture skills.',
    commonMistakes: ['Not positioning their training experience as "customer success" and "solution design"', 'Undervaluing their product expertise', 'Trying to move to a completely different technology stack instead of leveraging their vendor ecosystem'],
    fastTrackTip: 'Target SA roles at competitors or adjacent vendors. Your inside knowledge of one platform is extremely valuable when selling against it. Get a cloud cert to signal architecture capability. Lead with your customer-facing experience in applications.',
  },
  {
    from: 'Data Analyst',
    to: 'Data Scientist',
    difficulty: 'medium',
    timeToTransition: '3-6 months',
    transferableSkills: ['SQL mastery', 'Data visualization', 'Business domain knowledge', 'Statistical analysis basics', 'Stakeholder communication'],
    criticalGaps: ['Python for ML (scikit-learn, pandas beyond basics)', 'ML algorithms & when to use them', 'Feature engineering', 'Model evaluation & validation', 'Experiment design (A/B testing)'],
    successPattern: 'Data analysts who transition to DS succeed by starting with their domain. Instead of learning ML in abstract, apply ML to the exact business problems they already understand. Their business context makes their models more useful than a pure ML engineers models.',
    commonMistakes: ['Spending a year on math theory before doing any ML', 'Ignoring their business domain advantage', 'Trying to do deep learning before mastering logistic regression and random forests'],
    fastTrackTip: 'Take one business problem from your current role and solve it with ML instead of a dashboard. A/B test your ML solution vs the current approach. This single project demonstrates more than any bootcamp certificate.',
  },
  {
    from: 'Any Tech Role',
    to: 'Engineering Manager',
    difficulty: 'medium',
    timeToTransition: '6-12 months',
    transferableSkills: ['Technical depth', 'Code review mentoring', 'Project estimation', 'Cross-team communication', 'Technical decision-making'],
    criticalGaps: ['People management (1:1s, feedback, performance reviews)', 'Hiring & interview process design', 'Team velocity & capacity planning', 'Conflict resolution', 'Strategic thinking (roadmap, prioritization)'],
    successPattern: 'The most common path is tech lead → EM within the same company. Engineers who mentor juniors, lead projects, and volunteer for cross-team initiatives naturally grow into EM roles. The key is demonstrating people skills before getting the title.',
    commonMistakes: ['Thinking management means giving up coding (at most companies, EMs still code 20-40%)', 'Not building a track record of mentoring and project leadership first', 'Applying externally for EM roles without any management experience — internal promotion is much easier'],
    fastTrackTip: 'Volunteer to lead a project, mentor a junior, or run a team retrospective. Document the outcomes. Then have a career conversation with your manager about the EM track. Most companies prefer to promote from within for first-time managers.',
  },
];

/**
 * Find relevant transition patterns for a given career move
 */
export function findTransitionPatterns(currentRole: string, targetRole: string): string {
  const current = currentRole.toLowerCase();
  const target = targetRole.toLowerCase();

  const relevant = TRANSITION_PATTERNS.filter(p => {
    const fromMatch = current.includes(p.from.toLowerCase()) || p.from.toLowerCase().split('/').some(f => current.includes(f.trim().toLowerCase()));
    const toMatch = target.includes(p.to.toLowerCase()) || p.to.toLowerCase().split('/').some(t => target.includes(t.trim().toLowerCase()));
    // Also match partial: "RPA" in "RPA Developer" from field
    const fromPartial = p.from.toLowerCase().split(' ').some(w => w.length > 2 && current.includes(w));
    const toPartial = p.to.toLowerCase().split(' ').some(w => w.length > 2 && target.includes(w));
    return (fromMatch || fromPartial) && (toMatch || toPartial);
  });

  if (relevant.length === 0) return '';

  let context = '=== CAREER TRANSITION INTELLIGENCE ===\n';
  context += 'Based on patterns from thousands of similar career transitions:\n\n';

  for (const p of relevant) {
    context += `TRANSITION: ${p.from} → ${p.to}\n`;
    context += `- Difficulty: ${p.difficulty.toUpperCase()} | Typical timeline: ${p.timeToTransition}\n`;
    context += `- Transferable skills: ${p.transferableSkills.join(', ')}\n`;
    context += `- Critical gaps: ${p.criticalGaps.join(', ')}\n`;
    context += `- Success pattern: ${p.successPattern}\n`;
    context += `- Common mistakes to avoid: ${p.commonMistakes.join('; ')}\n`;
    context += `- Fast-track tip: ${p.fastTrackTip}\n\n`;
  }

  context += 'Use these patterns to calibrate your gap analysis and action plan. Reference specific success patterns and warn about common mistakes.\n';

  return context;
}
