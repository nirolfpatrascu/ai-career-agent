// UK SOC 2020 → role title mapping for ONS salary lookups

export const UK_SOC_TO_ROLES: Record<string, string[]> = {
  '2134': ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Cloud Engineer', 'Data Engineer', 'AI Engineer', 'Machine Learning Engineer', 'SRE', 'Platform Engineer'],
  '2135': ['Solutions Architect', 'Enterprise Architect', 'Business Analyst', 'Data Scientist', 'Database Architect'],
  '2136': ['IT Project Manager', 'Technical Program Manager', 'Scrum Master', 'Agile Coach', 'Project Manager', 'Program Manager'],
  '2137': ['Frontend Developer', 'Web Developer', 'Mobile Developer'],
  '2133': ['IT Manager', 'IT Director', 'Engineering Manager', 'VP of Engineering', 'CTO', 'Product Manager'],
  '2139': ['Cybersecurity Analyst', 'Security Engineer', 'Penetration Tester', 'Network Engineer', 'Database Administrator', 'Cloud Architect', 'Data Analyst', 'Analytics Engineer', 'BI Analyst'],
  '3131': ['Systems Administrator', 'Network Administrator'],
  '3132': ['IT Support Specialist', 'Help Desk', 'Technical Support Engineer'],
  '1132': ['Marketing Manager', 'Sales Manager', 'Digital Marketing Manager', 'Brand Manager', 'Growth Marketing Manager'],
  '1131': ['Financial Analyst', 'Finance Manager'],
  '1135': ['HR Manager', 'Human Resources Manager', 'Training Manager', 'Learning & Development Manager'],
  '1139': ['Operations Manager', 'Compliance Manager', 'Chief of Staff'],
  '2421': ['Accountant'],
  '2422': ['Financial Analyst', 'Venture Capital Analyst'],
  '2423': ['Management Consultant', 'Strategy Consultant', 'Transformation Manager', 'Implementation Consultant', 'ERP Consultant'],
  '2461': ['QA Engineer', 'Quality Assurance'],
  '2121': ['Civil Engineer'],
  '2123': ['Electrical Engineer'],
  '2122': ['Mechanical Engineer'],
  '2142': ['Embedded Systems Engineer', 'IoT Engineer', 'Robotics Engineer'],
  '3422': ['UX Designer', 'UI Designer', 'Product Designer', 'UX Researcher', 'Design Manager', 'Graphic Designer'],
  '3414': ['Technical Writer', 'Content Strategist'],
  '3545': ['Account Executive', 'Sales Engineer', 'Pre-Sales Engineer', 'Solutions Consultant', 'Technical Account Manager'],
  '3542': ['Business Development Representative', 'BDR', 'SDR', 'Sales Representative'],
  '2431': ['Recruiter', 'Talent Acquisition Specialist', 'Technical Recruiter'],
  '2472': ['Public Relations Manager', 'Social Media Manager', 'Event Manager'],
  '4122': ['Administrative Assistant', 'Executive Assistant'],
  '7211': ['Customer Success Manager', 'Customer Service Representative', 'Customer Engineer'],
};

// Reverse mapping: role title → UK SOC code
export function getRoleUKSOC(roleTitle: string): string | undefined {
  const normalized = roleTitle.toLowerCase().trim();
  for (const [soc, roles] of Object.entries(UK_SOC_TO_ROLES)) {
    if (roles.some(r => r.toLowerCase() === normalized)) {
      return soc;
    }
  }
  for (const [soc, roles] of Object.entries(UK_SOC_TO_ROLES)) {
    if (roles.some(r =>
      r.toLowerCase().includes(normalized) ||
      normalized.includes(r.toLowerCase())
    )) {
      return soc;
    }
  }
  return undefined;
}
