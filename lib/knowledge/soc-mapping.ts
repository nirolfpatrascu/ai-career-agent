// ============================================================================
// SOC Mapping — US Bureau of Labor Statistics Standard Occupational Classification
// Maps our role titles to SOC 6-digit codes for BLS salary lookups
// ============================================================================

export const SOC_TO_ROLES: Record<string, string[]> = {
  // Computer and Mathematical
  '15-1252': ['Software Engineer', 'Software Developer', 'Full Stack Developer', 'Backend Developer'],
  '15-1254': ['Frontend Developer', 'Web Developer'],
  '15-1253': ['Software QA Engineer', 'QA Engineer', 'Quality Assurance'],
  '15-1211': ['Computer Systems Analyst', 'Business Analyst', 'Systems Analyst'],
  '15-1212': ['Cybersecurity Analyst', 'Information Security Analyst', 'Security Engineer', 'Penetration Tester'],
  '15-1221': ['Systems Administrator', 'IT Support Specialist', 'Help Desk'],
  '15-1231': ['Network Engineer', 'Network Architect', 'Infrastructure Engineer'],
  '15-1241': ['Database Administrator', 'DBA'],
  '15-1242': ['Database Architect', 'Data Platform Engineer'],
  '15-1243': ['Data Warehouse Architect', 'ETL Developer', 'Data Integration Engineer'],
  '15-1244': ['Network Security Analyst'],
  '15-1245': ['Cloud Engineer', 'Cloud Architect', 'Platform Engineer'],
  '15-1255': ['DevOps Engineer', 'Site Reliability Engineer', 'SRE', 'Release Engineer'],
  '15-1256': ['AI Engineer', 'Machine Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer', 'MLOps Engineer', 'LLM Engineer'],
  '15-1257': ['BI Analyst', 'Business Intelligence Analyst', 'BI Developer', 'Analytics Engineer'],
  '15-2051': ['Data Scientist'],
  '15-2099': ['AI Research Scientist'],

  // Management
  '11-1011': ['CTO', 'Chief Technology Officer', 'Chief Data Officer'],
  '11-1021': ['Operations Manager', 'General Manager'],
  '11-2021': ['Marketing Manager', 'Digital Marketing Manager', 'Brand Manager', 'Growth Marketing Manager', 'Performance Marketing Manager', 'Content Marketing Manager'],
  '11-2022': ['Sales Manager', 'Revenue Operations Manager'],
  '11-3013': ['IT Manager', 'IT Director'],
  '11-3021': ['Engineering Manager', 'VP of Engineering', 'Technical Lead', 'Staff Engineer', 'Principal Engineer'],
  '11-3031': ['Finance Manager'],
  '11-3111': ['Compliance Manager', 'GRC Analyst'],
  '11-3121': ['Human Resources Manager', 'HR Manager'],
  '11-3131': ['Training Manager', 'Learning & Development Manager', 'Technical Enablement Engineer'],
  '11-9041': ['Technical Program Manager'],
  '11-9198': ['Product Manager', 'Technical Product Manager'],

  // Business and Financial
  '13-1023': ['Management Consultant', 'Strategy Consultant'],
  '13-1028': ['Implementation Consultant', 'ERP Consultant'],
  '13-1071': ['Recruiter', 'Talent Acquisition Specialist', 'Technical Recruiter'],
  '13-1111': ['Transformation Manager', 'Change Manager'],
  '13-1151': ['Developer Relations', 'Developer Advocate'],
  '13-1161': ['SEO Specialist', 'SEM Manager', 'Market Research Analyst'],
  '13-1198': ['Project Manager', 'Program Manager', 'IT Project Manager', 'Scrum Master', 'Agile Coach', 'Portfolio Manager'],
  '13-2011': ['Accountant'],
  '13-2051': ['Financial Analyst'],
  '13-2054': ['Venture Capital Analyst'],

  // Sales
  '41-3091': ['Account Executive', 'Sales Representative', 'Business Development Representative', 'BDR', 'SDR'],
  '41-4011': ['Sales Engineer', 'Pre-Sales Engineer', 'Solutions Consultant'],
  '41-3031': ['Technical Account Manager'],

  // Arts/Design/Media
  '27-1024': ['Graphic Designer', 'Visual Designer'],
  '27-1029': ['UX Designer', 'UI Designer', 'Product Designer', 'UX Researcher', 'Design Manager'],
  '27-3042': ['Technical Writer'],
  '27-3043': ['Content Strategist', 'Social Media Manager'],
  '27-1014': ['AR/VR Developer', 'Game Developer'],

  // Office/Administrative
  '43-6011': ['Executive Assistant', 'Administrative Assistant'],
  '43-4051': ['Customer Success Manager', 'Customer Service Representative', 'Customer Engineer'],

  // Architecture/Engineering
  '17-2051': ['Civil Engineer'],
  '17-2071': ['Electrical Engineer'],
  '17-2141': ['Mechanical Engineer'],
  '17-2199': ['Embedded Systems Engineer', 'IoT Engineer', 'Robotics Engineer'],

  // Misc
  '15-1299': ['Salesforce Developer', 'Salesforce Administrator', 'SAP Consultant', 'ServiceNow Developer', 'RPA Developer', 'Automation Engineer', 'Low-Code Developer', 'API Developer', 'Integration Engineer'],
  '41-3099': ['Partner Manager', 'Channel Manager'],
  '11-2031': ['Public Relations Manager', 'Event Manager'],
  '13-1082': ['Sustainability Manager', 'ESG Analyst'],
  '11-1031': ['Chief of Staff', 'Fractional CTO'],
};

// Reverse mapping: role title → SOC code
export function getRoleSOC(roleTitle: string): string | undefined {
  const normalized = roleTitle.toLowerCase().trim();
  for (const [soc, roles] of Object.entries(SOC_TO_ROLES)) {
    if (roles.some(r => r.toLowerCase() === normalized)) {
      return soc;
    }
  }
  // Fuzzy: check if any role contains the search term or vice versa
  for (const [soc, roles] of Object.entries(SOC_TO_ROLES)) {
    if (roles.some(r =>
      r.toLowerCase().includes(normalized) ||
      normalized.includes(r.toLowerCase())
    )) {
      return soc;
    }
  }
  return undefined;
}
