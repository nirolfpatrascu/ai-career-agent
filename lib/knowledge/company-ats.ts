// lib/knowledge/company-ats.ts
// Curated database of which ATS systems major tech companies use
// Sources: public job board URLs, recruiter community data, job posting metadata

export interface CompanyATSEntry {
  company: string;
  aliases: string[]; // Alternative names/abbreviations
  atsSystem: string;
  tips: string[];
}

export const COMPANY_ATS_DATABASE: CompanyATSEntry[] = [
  // --- FAANG / Big Tech ---
  { company: 'Google', aliases: ['Alphabet', 'Google Cloud', 'Google DeepMind', 'DeepMind'], atsSystem: 'Custom (Google Hire successor)', tips: ['Use standard section headers — Google\'s system handles most formats', 'Keywords are less important than demonstrated impact', 'Include metrics in every experience bullet'] },
  { company: 'Amazon', aliases: ['AWS', 'Amazon Web Services'], atsSystem: 'Custom (Amazon Jobs)', tips: ['Use STAR format in bullet points — their system flags it', 'Include Amazon Leadership Principles keywords naturally', 'Quantify everything: revenue, scale, team size'] },
  { company: 'Meta', aliases: ['Facebook', 'Instagram', 'WhatsApp', 'Meta Platforms'], atsSystem: 'Custom', tips: ['Focus on impact and scale metrics', 'Standard formatting works best', 'Mention open source contributions if relevant'] },
  { company: 'Apple', aliases: [], atsSystem: 'Workday', tips: ['Keep formatting simple — Workday struggles with columns', 'Use standard section headers (Experience, Education, Skills)', 'Avoid tables, text boxes, and graphics'] },
  { company: 'Microsoft', aliases: ['MS', 'Azure', 'LinkedIn (employer)'], atsSystem: 'Custom (iCIMS-based)', tips: ['Standard formatting recommended', 'Include Azure/cloud certifications prominently', 'Growth mindset language aligns with culture'] },
  { company: 'Netflix', aliases: [], atsSystem: 'Greenhouse', tips: ['Greenhouse handles most formats well', 'Focus on senior-level impact — Netflix hires experienced', 'Keep to 1-2 pages'] },

  // --- AI / ML Companies ---
  { company: 'Anthropic', aliases: ['Claude'], atsSystem: 'Greenhouse', tips: ['Greenhouse parses well — focus on content over formatting', 'Highlight AI safety or alignment interest', 'Mention specific AI/ML papers or research'] },
  { company: 'OpenAI', aliases: ['ChatGPT'], atsSystem: 'Greenhouse', tips: ['Standard formatting works', 'Research publications and open-source work matter', 'Highlight novel technical contributions'] },
  { company: 'DeepMind', aliases: ['Google DeepMind'], atsSystem: 'Custom (Google)', tips: ['Academic CV format is acceptable', 'Publications section is important', 'Include research impact metrics'] },
  { company: 'Cohere', aliases: [], atsSystem: 'Lever', tips: ['Lever handles modern formats well', 'Include NLP/LLM-specific project details', 'Open source contributions valued'] },
  { company: 'Hugging Face', aliases: ['HF'], atsSystem: 'Lever', tips: ['Open source contributions are heavily weighted', 'Include GitHub profile and contribution metrics', 'Community involvement matters'] },
  { company: 'Stability AI', aliases: [], atsSystem: 'Greenhouse', tips: ['Include generative AI project experience', 'Open source and community contributions valued', 'Research papers a plus'] },
  { company: 'Databricks', aliases: [], atsSystem: 'Greenhouse', tips: ['Include Spark/data engineering experience prominently', 'Certifications in Databricks platform stand out', 'Scale metrics are important'] },
  { company: 'Dataiku', aliases: [], atsSystem: 'Greenhouse', tips: ['Highlight enterprise data science experience', 'Customer-facing roles value communication examples', 'Include MLOps/deployment experience'] },

  // --- Automation / Low-Code ---
  { company: 'UiPath', aliases: [], atsSystem: 'Greenhouse', tips: ['Include UiPath certification details', 'Enterprise deployment scale matters', 'Mention specific products: Orchestrator, AI Center, Document Understanding'] },
  { company: 'n8n', aliases: [], atsSystem: 'Lever', tips: ['Open source contributions to n8n repo are a strong signal', 'Include Node.js/TypeScript prominently', 'Community engagement matters'] },
  { company: 'Make', aliases: ['Integromat', 'Make.com'], atsSystem: 'Greenhouse', tips: ['Include integration/automation experience', 'API experience is important', 'Mention specific platforms and connectors'] },
  { company: 'Celonis', aliases: [], atsSystem: 'Greenhouse', tips: ['Process mining experience is highly valued', 'Include SAP or enterprise ERP experience', 'Data analysis skills important'] },
  { company: 'Automation Anywhere', aliases: ['AA'], atsSystem: 'Workday', tips: ['Simple formatting — Workday is strict', 'Include RPA certifications', 'Enterprise scale metrics matter'] },
  { company: 'ServiceNow', aliases: ['SNOW'], atsSystem: 'Workday', tips: ['Use single-column layout', 'Include ITSM/ITOM experience', 'ServiceNow certifications stand out'] },
  { company: 'Workato', aliases: [], atsSystem: 'Greenhouse', tips: ['Integration platform experience valued', 'Include API development experience', 'Enterprise customer experience matters'] },

  // --- Cloud Providers ---
  { company: 'AWS (hiring)', aliases: ['Amazon Web Services'], atsSystem: 'Custom (Amazon)', tips: ['Use STAR format for bullet points', 'Include AWS certifications prominently', 'Quantify scale: users, requests, data volume'] },
  { company: 'Google Cloud', aliases: ['GCP'], atsSystem: 'Custom (Google)', tips: ['Include Google Cloud certifications', 'Open source contributions valued', 'System design experience important'] },
  { company: 'Azure (Microsoft)', aliases: ['Microsoft Azure'], atsSystem: 'Custom (iCIMS)', tips: ['Azure certifications are strongly valued', 'Include enterprise deployment experience', 'Mention hybrid cloud experience'] },

  // --- Enterprise Tech ---
  { company: 'Salesforce', aliases: ['SFDC', 'Slack'], atsSystem: 'Workday', tips: ['Simple single-column format', 'Include Salesforce certifications prominently', 'Trailhead badges worth mentioning'] },
  { company: 'SAP', aliases: [], atsSystem: 'SuccessFactors', tips: ['Standard formatting required', 'SAP certifications are essential', 'Include ERP module-specific experience'] },
  { company: 'Oracle', aliases: [], atsSystem: 'Taleo', tips: ['Very strict parser — use simplest possible formatting', 'No tables, no columns, no text boxes', 'Standard headers only: Experience, Education, Skills'] },
  { company: 'IBM', aliases: ['Red Hat'], atsSystem: 'Workday', tips: ['Standard formatting — Workday handles basics well', 'Include IBM/Red Hat certifications', 'Open source contributions valued for Red Hat roles'] },
  { company: 'Cisco', aliases: [], atsSystem: 'Workday', tips: ['Simple formatting preferred', 'Include Cisco certifications (CCNA, CCNP)', 'Network engineering metrics important'] },
  { company: 'VMware', aliases: ['Broadcom VMware'], atsSystem: 'Workday', tips: ['Standard section headers', 'VMware certifications (VCP, VCAP) valued', 'Include virtualization/cloud experience'] },

  // --- Consulting ---
  { company: 'Deloitte', aliases: ['Deloitte Digital', 'Deloitte Consulting'], atsSystem: 'Taleo', tips: ['Very simple formatting — Taleo is the most restrictive parser', 'No columns, no tables, no fancy formatting', 'Use exact section headers: Experience, Education, Skills'] },
  { company: 'Accenture', aliases: ['Accenture Technology'], atsSystem: 'Workday', tips: ['Single-column layout', 'Industry-specific keywords matter', 'Include client-facing project examples'] },
  { company: 'McKinsey', aliases: ['McKinsey & Company'], atsSystem: 'Custom', tips: ['Follow their specific resume format guidelines', 'Impact-first bullet points', 'Education section prominence matters'] },
  { company: 'Capgemini', aliases: ['Capgemini Engineering'], atsSystem: 'Workday', tips: ['Standard formatting', 'Include domain-specific certifications', 'Multi-language skills valued for EU roles'] },
  { company: 'Cognizant', aliases: [], atsSystem: 'Workday', tips: ['Simple formatting', 'Include technology certifications', 'Offshore/onshore collaboration experience valued'] },

  // --- Startups / Scale-ups ---
  { company: 'Stripe', aliases: [], atsSystem: 'Greenhouse', tips: ['Greenhouse handles most formats well', 'Include payments/fintech experience', 'Writing quality in CV itself matters — Stripe values written communication'] },
  { company: 'Vercel', aliases: [], atsSystem: 'Lever', tips: ['Include open source contributions prominently', 'Next.js/React expertise front and center', 'Portfolio projects and live links matter more than formatting'] },
  { company: 'Figma', aliases: [], atsSystem: 'Greenhouse', tips: ['Design tools experience prominent', 'Include collaboration platform experience', 'Portfolio link is essential for design roles'] },
  { company: 'Notion', aliases: [], atsSystem: 'Greenhouse', tips: ['Clean formatting valued', 'Include productivity/collaboration tool experience', 'Writing quality matters'] },
  { company: 'Linear', aliases: [], atsSystem: 'Ashby', tips: ['Ashby is modern and handles most formats', 'Focus on craft and quality signals', 'Include experience with developer tools'] },
  { company: 'Postman', aliases: [], atsSystem: 'Greenhouse', tips: ['Include API development experience prominently', 'Open source and community involvement valued', 'Developer tools experience important'] },
  { company: 'GitLab', aliases: [], atsSystem: 'Greenhouse', tips: ['Remote-first experience is a plus', 'Include DevOps/CI-CD pipeline experience', 'Open source contributions matter'] },
  { company: 'GitHub', aliases: [], atsSystem: 'Custom (Microsoft)', tips: ['Open source contribution history is critical', 'Active GitHub profile expected', 'Developer tools experience important'] },
  { company: 'Shopify', aliases: [], atsSystem: 'Greenhouse', tips: ['E-commerce platform experience valued', 'Include Ruby/Rails experience if applicable', 'Entrepreneurial experience is a plus'] },
  { company: 'Twilio', aliases: ['SendGrid'], atsSystem: 'Greenhouse', tips: ['Communications/API experience valued', 'Include SDK/developer experience work', 'Customer-facing technical experience matters'] },
  { company: 'Cloudflare', aliases: [], atsSystem: 'Greenhouse', tips: ['Systems/network engineering experience important', 'Performance optimization metrics valued', 'Security experience is a plus'] },
  { company: 'MongoDB', aliases: ['Mongo'], atsSystem: 'Greenhouse', tips: ['Database/data engineering experience key', 'Include NoSQL expertise', 'Include scale metrics'] },
  { company: 'Elastic', aliases: ['Elasticsearch', 'ELK'], atsSystem: 'Greenhouse', tips: ['Search/observability experience valued', 'Include open source contributions', 'Distributed systems experience important'] },
  { company: 'HashiCorp', aliases: ['Terraform', 'Vault'], atsSystem: 'Greenhouse', tips: ['Infrastructure-as-code experience essential', 'Include specific HashiCorp tool expertise', 'Open source contributions valued'] },
  { company: 'Confluent', aliases: ['Kafka'], atsSystem: 'Greenhouse', tips: ['Streaming data experience important', 'Include Kafka-specific experience', 'Distributed systems knowledge valued'] },
  { company: 'Snowflake', aliases: [], atsSystem: 'Greenhouse', tips: ['Data warehouse experience key', 'Include SQL expertise', 'Cloud platform experience important'] },

  // --- European Tech ---
  { company: 'Spotify', aliases: [], atsSystem: 'Greenhouse', tips: ['Include music/media tech experience if relevant', 'Agile methodology experience valued', 'Data-driven decision making examples matter'] },
  { company: 'Klarna', aliases: [], atsSystem: 'Lever', tips: ['Fintech/payments experience valued', 'Include engineering metrics', 'Consumer product experience a plus'] },
  { company: 'Bolt', aliases: ['Bolt Technology'], atsSystem: 'Greenhouse', tips: ['Marketplace/platform experience valued', 'Include scale metrics', 'Mobile engineering experience a plus'] },
  { company: 'Wise', aliases: ['TransferWise'], atsSystem: 'Greenhouse', tips: ['Financial services/compliance experience valued', 'Include international/multi-currency experience', 'Customer-impact metrics important'] },
  { company: 'Revolut', aliases: [], atsSystem: 'Greenhouse', tips: ['Fintech experience important', 'High-velocity delivery experience valued', 'Include security/compliance experience'] },
  { company: 'Delivery Hero', aliases: [], atsSystem: 'Greenhouse', tips: ['Marketplace/logistics experience valued', 'Include scale metrics', 'International team experience a plus'] },
  { company: 'Adyen', aliases: [], atsSystem: 'Workday', tips: ['Payments processing experience key', 'Standard formatting for Workday', 'Include compliance/PCI experience'] },
];

/**
 * Look up a company's ATS system by name or URL
 * Returns undefined if company not found
 */
export function lookupCompanyATS(
  companyNameOrUrl: string
): CompanyATSEntry | undefined {
  const query = companyNameOrUrl.toLowerCase().trim();

  // Try exact match first
  const exact = COMPANY_ATS_DATABASE.find(
    (c) =>
      c.company.toLowerCase() === query ||
      c.aliases.some((a) => a.toLowerCase() === query)
  );
  if (exact) return exact;

  // Try partial match (company name contained in query or vice versa)
  const partial = COMPANY_ATS_DATABASE.find(
    (c) =>
      query.includes(c.company.toLowerCase()) ||
      c.company.toLowerCase().includes(query) ||
      c.aliases.some(
        (a) => query.includes(a.toLowerCase()) || a.toLowerCase().includes(query)
      )
  );
  if (partial) return partial;

  // Try extracting company from URL
  if (query.includes('.')) {
    const domainMatch = query.match(/(?:https?:\/\/)?(?:www\.)?([^./]+)/i);
    if (domainMatch) {
      const domain = domainMatch[1].toLowerCase();
      return COMPANY_ATS_DATABASE.find(
        (c) =>
          c.company.toLowerCase().replace(/\s+/g, '') === domain ||
          c.aliases.some((a) => a.toLowerCase().replace(/\s+/g, '') === domain)
      );
    }
  }

  return undefined;
}

/**
 * Get ATS system-specific formatting tips
 */
export function getATSSystemTips(atsSystem: string): string[] {
  const systemTips: Record<string, string[]> = {
    'Workday': [
      'Use single-column layout only — Workday cannot parse multi-column resumes',
      'Avoid tables, text boxes, headers/footers — Workday ignores or scrambles them',
      'Use standard section headers: "Experience", "Education", "Skills"',
      'Save as .docx if possible — Workday parses Word better than PDF',
      'Keep bullet points simple: no nested bullets, no special characters',
    ],
    'Greenhouse': [
      'Greenhouse has a modern parser — most standard formats work well',
      'PDF format is fine — Greenhouse handles it well',
      'Focus on content over formatting — the parser is forgiving',
      'Ensure contact info is at the top of the first page',
    ],
    'Lever': [
      'Lever has a solid modern parser — standard PDF formatting works',
      'Include a skills section — Lever indexes it for search',
      'Job titles and company names should be clearly delineated',
    ],
    'Taleo': [
      'Taleo has the MOST restrictive parser — use the simplest possible format',
      'Absolutely no tables, columns, text boxes, graphics, or headers/footers',
      'Use plain text bullet points (•) not fancy Unicode characters',
      'Standard chronological format only',
      'Section headers must be exact: "Experience", "Education", "Skills"',
      'Consider submitting .txt format if the option is available',
    ],
    'iCIMS': [
      'iCIMS handles standard formats reasonably well',
      'Avoid complex layouts — single column recommended',
      'Include a clear skills section for keyword matching',
      'Standard section headers recommended',
    ],
    'SuccessFactors': [
      'SAP SuccessFactors prefers simple formatting',
      'Standard section headers required',
      'Avoid graphics and complex layouts',
    ],
    'Ashby': [
      'Ashby is a modern ATS with excellent parsing capabilities',
      'Most standard formats work well',
      'Focus on content quality over formatting tricks',
    ],
  };

  return systemTips[atsSystem] || [
    'Standard single-column format recommended',
    'Use clear section headers: Experience, Education, Skills',
    'Avoid tables, text boxes, and complex graphics',
  ];
}
