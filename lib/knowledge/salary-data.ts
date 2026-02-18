// ============================================================================
// Knowledge Base: Salary Benchmarks by Region & Role
// Sources: Glassdoor, Levels.fyi, PayScale, Stack Overflow Survey,
//          Hired.com State of Salaries, Robert Half Salary Guide (public data)
// Last updated: 2026-02 | All figures: GROSS ANNUAL in EUR equivalent
// ============================================================================

export interface SalaryBand {
  role: string;
  junior: { low: number; mid: number; high: number };    // 0-3 yrs
  mid: { low: number; mid: number; high: number };        // 4-8 yrs
  senior: { low: number; mid: number; high: number };     // 9-15 yrs
  lead: { low: number; mid: number; high: number };       // 15+ yrs
  currency: string;
}

export interface RegionalSalaryData {
  region: string;
  label: string;
  costOfLivingIndex: number;  // 100 = EU average
  remoteMultiplier: number;   // 1.0 = local, 1.3-1.8 = remote for Western co
  notes: string;
  roles: SalaryBand[];
}

// Key: country name as it appears in the questionnaire
export const SALARY_DATA: Record<string, RegionalSalaryData> = {
  'Romania': {
    region: 'Eastern Europe',
    label: 'Romania (local market)',
    costOfLivingIndex: 52,
    remoteMultiplier: 1.5,
    notes: 'Romanian tech salaries are 40-60% below Western EU for on-site roles. Remote workers for Western EU/US companies typically earn 1.3-1.8x local rates. The 1% micro-enterprise (SRL-D) tax regime makes Romania highly attractive for independent contractors. Bucharest and Cluj command 15-25% premium over other cities.',
    roles: [
      { role: 'Software Engineer', currency: 'EUR', junior: { low: 12000, mid: 18000, high: 25000 }, mid: { low: 25000, mid: 35000, high: 48000 }, senior: { low: 40000, mid: 55000, high: 72000 }, lead: { low: 55000, mid: 72000, high: 95000 } },
      { role: 'Solutions Architect', currency: 'EUR', junior: { low: 20000, mid: 28000, high: 35000 }, mid: { low: 35000, mid: 48000, high: 60000 }, senior: { low: 50000, mid: 68000, high: 85000 }, lead: { low: 65000, mid: 85000, high: 110000 } },
      { role: 'AI/ML Engineer', currency: 'EUR', junior: { low: 15000, mid: 22000, high: 30000 }, mid: { low: 30000, mid: 42000, high: 55000 }, senior: { low: 45000, mid: 62000, high: 80000 }, lead: { low: 60000, mid: 80000, high: 105000 } },
      { role: 'DevOps/Cloud Engineer', currency: 'EUR', junior: { low: 14000, mid: 20000, high: 28000 }, mid: { low: 28000, mid: 38000, high: 50000 }, senior: { low: 42000, mid: 58000, high: 75000 }, lead: { low: 58000, mid: 75000, high: 95000 } },
      { role: 'Technical Enablement', currency: 'EUR', junior: { low: 15000, mid: 22000, high: 30000 }, mid: { low: 28000, mid: 40000, high: 52000 }, senior: { low: 40000, mid: 55000, high: 70000 }, lead: { low: 55000, mid: 70000, high: 90000 } },
      { role: 'Product Manager', currency: 'EUR', junior: { low: 18000, mid: 25000, high: 32000 }, mid: { low: 30000, mid: 42000, high: 55000 }, senior: { low: 45000, mid: 60000, high: 80000 }, lead: { low: 62000, mid: 80000, high: 105000 } },
      { role: 'Data Scientist', currency: 'EUR', junior: { low: 14000, mid: 20000, high: 28000 }, mid: { low: 28000, mid: 38000, high: 50000 }, senior: { low: 42000, mid: 58000, high: 75000 }, lead: { low: 58000, mid: 75000, high: 98000 } },
      { role: 'RPA Developer', currency: 'EUR', junior: { low: 10000, mid: 15000, high: 22000 }, mid: { low: 20000, mid: 30000, high: 42000 }, senior: { low: 35000, mid: 48000, high: 62000 }, lead: { low: 48000, mid: 62000, high: 80000 } },
      { role: 'Automation Consultant', currency: 'EUR', junior: { low: 18000, mid: 25000, high: 35000 }, mid: { low: 32000, mid: 45000, high: 58000 }, senior: { low: 48000, mid: 65000, high: 85000 }, lead: { low: 65000, mid: 85000, high: 120000 } },
    ],
  },
  'Germany': {
    region: 'Western Europe',
    label: 'Germany',
    costOfLivingIndex: 108,
    remoteMultiplier: 1.0,
    notes: 'Germany is the largest tech market in continental Europe. Berlin, Munich, and Hamburg are primary hubs. Social contributions are ~20% of gross. Strong demand for AI/ML and cloud engineers. B1+ German often expected for on-site roles; English-only common in Berlin startups and international companies.',
    roles: [
      { role: 'Software Engineer', currency: 'EUR', junior: { low: 42000, mid: 52000, high: 62000 }, mid: { low: 58000, mid: 72000, high: 85000 }, senior: { low: 75000, mid: 92000, high: 110000 }, lead: { low: 95000, mid: 115000, high: 140000 } },
      { role: 'Solutions Architect', currency: 'EUR', junior: { low: 50000, mid: 60000, high: 72000 }, mid: { low: 68000, mid: 82000, high: 98000 }, senior: { low: 85000, mid: 105000, high: 130000 }, lead: { low: 110000, mid: 135000, high: 165000 } },
      { role: 'AI/ML Engineer', currency: 'EUR', junior: { low: 48000, mid: 58000, high: 68000 }, mid: { low: 65000, mid: 80000, high: 98000 }, senior: { low: 85000, mid: 105000, high: 130000 }, lead: { low: 110000, mid: 135000, high: 170000 } },
      { role: 'DevOps/Cloud Engineer', currency: 'EUR', junior: { low: 45000, mid: 55000, high: 65000 }, mid: { low: 62000, mid: 75000, high: 90000 }, senior: { low: 80000, mid: 98000, high: 120000 }, lead: { low: 100000, mid: 120000, high: 150000 } },
      { role: 'Product Manager', currency: 'EUR', junior: { low: 48000, mid: 58000, high: 68000 }, mid: { low: 65000, mid: 80000, high: 95000 }, senior: { low: 85000, mid: 105000, high: 125000 }, lead: { low: 110000, mid: 130000, high: 160000 } },
    ],
  },
  'United Kingdom': {
    region: 'Western Europe',
    label: 'United Kingdom',
    costOfLivingIndex: 115,
    remoteMultiplier: 1.0,
    notes: 'London commands 20-40% premium. Outside London, salaries are closer to EU averages. Strong fintech and AI ecosystems. Post-Brexit visa rules affect non-UK candidates. Contract/freelance market is mature (IR35 regulations apply).',
    roles: [
      { role: 'Software Engineer', currency: 'GBP', junior: { low: 35000, mid: 45000, high: 55000 }, mid: { low: 52000, mid: 68000, high: 82000 }, senior: { low: 72000, mid: 90000, high: 110000 }, lead: { low: 95000, mid: 115000, high: 145000 } },
      { role: 'Solutions Architect', currency: 'GBP', junior: { low: 45000, mid: 55000, high: 68000 }, mid: { low: 65000, mid: 80000, high: 98000 }, senior: { low: 85000, mid: 105000, high: 130000 }, lead: { low: 110000, mid: 135000, high: 170000 } },
      { role: 'AI/ML Engineer', currency: 'GBP', junior: { low: 40000, mid: 52000, high: 62000 }, mid: { low: 58000, mid: 75000, high: 92000 }, senior: { low: 80000, mid: 100000, high: 125000 }, lead: { low: 105000, mid: 130000, high: 165000 } },
    ],
  },
  'United States': {
    region: 'North America',
    label: 'United States',
    costOfLivingIndex: 130,
    remoteMultiplier: 1.0,
    notes: 'Highest tech salaries globally. Bay Area/NYC/Seattle command 30-50% premium. Stock options/RSUs are significant part of total comp at FAANG+ (can add 30-100% to base). Healthcare costs offset some salary advantage. H-1B visa required for non-citizens.',
    roles: [
      { role: 'Software Engineer', currency: 'USD', junior: { low: 80000, mid: 105000, high: 135000 }, mid: { low: 120000, mid: 155000, high: 195000 }, senior: { low: 160000, mid: 200000, high: 260000 }, lead: { low: 200000, mid: 260000, high: 350000 } },
      { role: 'Solutions Architect', currency: 'USD', junior: { low: 95000, mid: 120000, high: 150000 }, mid: { low: 140000, mid: 175000, high: 210000 }, senior: { low: 180000, mid: 225000, high: 280000 }, lead: { low: 220000, mid: 280000, high: 380000 } },
      { role: 'AI/ML Engineer', currency: 'USD', junior: { low: 100000, mid: 130000, high: 165000 }, mid: { low: 150000, mid: 190000, high: 240000 }, senior: { low: 200000, mid: 260000, high: 330000 }, lead: { low: 260000, mid: 340000, high: 450000 } },
    ],
  },
  'Netherlands': {
    region: 'Western Europe',
    label: 'Netherlands',
    costOfLivingIndex: 112,
    remoteMultiplier: 1.0,
    notes: 'Amsterdam is a major tech hub with many international companies. 30% ruling for expats reduces tax significantly for first 5 years. English widely spoken in tech. Strong AI/fintech/logistics-tech ecosystem.',
    roles: [
      { role: 'Software Engineer', currency: 'EUR', junior: { low: 38000, mid: 48000, high: 58000 }, mid: { low: 55000, mid: 68000, high: 82000 }, senior: { low: 72000, mid: 88000, high: 108000 }, lead: { low: 92000, mid: 112000, high: 138000 } },
      { role: 'Solutions Architect', currency: 'EUR', junior: { low: 48000, mid: 58000, high: 70000 }, mid: { low: 65000, mid: 80000, high: 95000 }, senior: { low: 82000, mid: 100000, high: 125000 }, lead: { low: 105000, mid: 128000, high: 160000 } },
      { role: 'AI/ML Engineer', currency: 'EUR', junior: { low: 42000, mid: 52000, high: 65000 }, mid: { low: 60000, mid: 75000, high: 92000 }, senior: { low: 80000, mid: 98000, high: 120000 }, lead: { low: 102000, mid: 125000, high: 155000 } },
    ],
  },
};

// Remote EU market rates (for anyone working remotely for Western companies)
export const REMOTE_EU_RATES: SalaryBand[] = [
  { role: 'Software Engineer', currency: 'EUR', junior: { low: 35000, mid: 48000, high: 62000 }, mid: { low: 55000, mid: 72000, high: 92000 }, senior: { low: 75000, mid: 95000, high: 120000 }, lead: { low: 95000, mid: 120000, high: 155000 } },
  { role: 'Solutions Architect', currency: 'EUR', junior: { low: 45000, mid: 58000, high: 72000 }, mid: { low: 65000, mid: 82000, high: 100000 }, senior: { low: 82000, mid: 105000, high: 135000 }, lead: { low: 105000, mid: 135000, high: 175000 } },
  { role: 'AI/ML Engineer', currency: 'EUR', junior: { low: 40000, mid: 55000, high: 68000 }, mid: { low: 60000, mid: 78000, high: 98000 }, senior: { low: 80000, mid: 102000, high: 130000 }, lead: { low: 105000, mid: 135000, high: 170000 } },
  { role: 'DevOps/Cloud Engineer', currency: 'EUR', junior: { low: 38000, mid: 50000, high: 62000 }, mid: { low: 55000, mid: 72000, high: 90000 }, senior: { low: 75000, mid: 95000, high: 120000 }, lead: { low: 95000, mid: 118000, high: 150000 } },
  { role: 'Technical Enablement', currency: 'EUR', junior: { low: 35000, mid: 45000, high: 58000 }, mid: { low: 50000, mid: 65000, high: 82000 }, senior: { low: 68000, mid: 85000, high: 108000 }, lead: { low: 85000, mid: 108000, high: 140000 } },
  { role: 'Product Manager', currency: 'EUR', junior: { low: 40000, mid: 52000, high: 65000 }, mid: { low: 58000, mid: 75000, high: 92000 }, senior: { low: 78000, mid: 98000, high: 125000 }, lead: { low: 100000, mid: 125000, high: 160000 } },
  { role: 'Automation Consultant', currency: 'EUR', junior: { low: 35000, mid: 48000, high: 60000 }, mid: { low: 55000, mid: 72000, high: 90000 }, senior: { low: 75000, mid: 95000, high: 125000 }, lead: { low: 95000, mid: 125000, high: 165000 } },
  { role: 'RPA Developer', currency: 'EUR', junior: { low: 28000, mid: 38000, high: 48000 }, mid: { low: 42000, mid: 55000, high: 68000 }, senior: { low: 58000, mid: 72000, high: 90000 }, lead: { low: 72000, mid: 90000, high: 115000 } },
  { role: 'Data Scientist', currency: 'EUR', junior: { low: 38000, mid: 50000, high: 62000 }, mid: { low: 55000, mid: 72000, high: 90000 }, senior: { low: 75000, mid: 95000, high: 120000 }, lead: { low: 98000, mid: 120000, high: 155000 } },
];

/**
 * Get salary context for a specific country + work preference
 */
export function getSalaryContext(country: string, workPreference: string): string {
  const local = SALARY_DATA[country];
  const isRemote = workPreference === 'remote' || workPreference === 'flexible';

  let context = '=== SALARY REFERENCE DATA ===\n';

  if (local) {
    context += `\nLOCAL MARKET (${local.label}):\n`;
    context += `- Cost of living index: ${local.costOfLivingIndex} (EU avg = 100)\n`;
    context += `- ${local.notes}\n`;
    context += `- Roles (all gross annual, ${local.roles[0]?.currency || 'EUR'}):\n`;
    for (const r of local.roles) {
      context += `  ${r.role}: Junior ${r.junior.low}-${r.junior.high} | Mid ${r.mid.low}-${r.mid.high} | Senior ${r.senior.low}-${r.senior.high} | Lead ${r.lead.low}-${r.lead.high}\n`;
    }
  }

  if (isRemote) {
    context += `\nREMOTE EU/EMEA MARKET (for ${country}-based professionals working for Western companies):\n`;
    if (local) {
      context += `- Remote multiplier vs local: ~${local.remoteMultiplier}x\n`;
    }
    context += `- All gross annual EUR:\n`;
    for (const r of REMOTE_EU_RATES) {
      context += `  ${r.role}: Junior ${r.junior.low}-${r.junior.high} | Mid ${r.mid.low}-${r.mid.high} | Senior ${r.senior.low}-${r.senior.high} | Lead ${r.lead.low}-${r.lead.high}\n`;
    }
  }

  context += '\nIMPORTANT: These are reference benchmarks from public salary surveys. Adjust based on specific company size, funding stage, and exact role scope. Always quote GROSS ANNUAL figures.\n';

  return context;
}
