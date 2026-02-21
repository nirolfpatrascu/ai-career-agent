// ============================================================================
// Knowledge Base: Salary Benchmarks by Region & Role
// Sources: Glassdoor, Levels.fyi, PayScale, Stack Overflow Survey,
//          Hired.com State of Salaries, Robert Half Salary Guide (public data)
// Last updated: 2026-02 | All figures: GROSS ANNUAL in local currency
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

// ---------------------------------------------------------------------------
// Internal: base salary data (Germany mid-level midpoint in EUR) per role,
// country multipliers, and level spread factors. Exported constants below are
// generated from these compact tables so we can cover 50 roles x 20 markets
// without thousands of hand-typed lines.
// ---------------------------------------------------------------------------

/** Mid-level midpoint salary (EUR) using Germany as the 1.0 reference */
const BASE: Record<string, number> = {
  'Software Engineer': 72000,
  'Solutions Architect': 82000,
  'AI/ML Engineer': 80000,
  'DevOps/Cloud Engineer': 75000,
  'Technical Enablement': 65000,
  'Product Manager': 80000,
  'Data Scientist': 75000,
  'RPA Developer': 58000,
  'Automation Consultant': 72000,
  'Data Engineer': 72000,
  'Frontend Developer': 65000,
  'Backend Developer': 70000,
  'DevOps Engineer': 73000,
  'SRE': 78000,
  'Engineering Manager': 95000,
  'Cybersecurity Analyst': 68000,
  'UX Designer': 60000,
  'Scrum Master': 62000,
  'Business Analyst': 60000,
  'QA Engineer': 55000,
  'Technical Writer': 52000,
  'Mobile Developer': 68000,
  'Cloud Architect': 88000,
  'Database Administrator': 62000,
  'Network Engineer': 58000,
  'Systems Administrator': 55000,
  'IT Project Manager': 68000,
  'Data Analyst': 55000,
  'Machine Learning Engineer': 82000,
  'NLP Engineer': 82000,
  'Computer Vision Engineer': 80000,
  'Blockchain Developer': 78000,
  'Game Developer': 55000,
  'Embedded Systems Engineer': 65000,
  'IoT Engineer': 65000,
  'Robotics Engineer': 70000,
  'AR/VR Developer': 72000,
  'Technical Lead': 92000,
  'VP Engineering': 135000,
  'CTO': 155000,
  'Chief Data Officer': 145000,
  'Security Engineer': 72000,
  'Penetration Tester': 65000,
  'Platform Engineer': 75000,
  'Release Engineer': 62000,
  'Site Reliability Engineer': 78000,
  'Technical Account Manager': 65000,
  'Solutions Consultant': 70000,
  'Pre-Sales Engineer': 68000,
  'Full Stack Developer': 70000,
};

const ROLES = Object.keys(BASE);

const EXEC_ROLES = new Set(['VP Engineering', 'CTO', 'Chief Data Officer', 'Engineering Manager']);

/** Spread factors: how each experience band relates to mid-mid */
const STD_SPREAD = {
  jl: 0.56, jm: 0.70, jh: 0.84,
  ml: 0.80, mm: 1.00, mh: 1.18,
  sl: 1.05, sm: 1.30, sh: 1.55,
  ll: 1.32, lm: 1.60, lh: 1.95,
};
const EXEC_SPREAD = {
  jl: 0.50, jm: 0.65, jh: 0.80,
  ml: 0.78, mm: 1.00, mh: 1.22,
  sl: 1.10, sm: 1.40, sh: 1.75,
  ll: 1.45, lm: 1.80, lh: 2.30,
};

interface CountryDef {
  mult: number;           // salary multiplier vs Germany
  currency: string;
  round: number;          // rounding granularity
  currencyMult?: number;  // EUR->local currency conversion (1.0 if already EUR)
  region: string;
  label: string;
  costOfLivingIndex: number;
  remoteMultiplier: number;
  notes: string;
}

const COUNTRY_DEFS: Record<string, CountryDef> = {
  'Romania': {
    mult: 0.48, currency: 'EUR', round: 1000,
    region: 'Eastern Europe',
    label: 'Romania (local market)',
    costOfLivingIndex: 52,
    remoteMultiplier: 1.5,
    notes: 'Romanian tech salaries are 40-60% below Western EU for on-site roles. Remote workers for Western EU/US companies typically earn 1.3-1.8x local rates. The 1% micro-enterprise (SRL-D) tax regime makes Romania highly attractive for independent contractors. Bucharest and Cluj command 15-25% premium over other cities.',
  },
  'Germany': {
    mult: 1.0, currency: 'EUR', round: 1000,
    region: 'Western Europe',
    label: 'Germany',
    costOfLivingIndex: 108,
    remoteMultiplier: 1.0,
    notes: 'Germany is the largest tech market in continental Europe. Berlin, Munich, and Hamburg are primary hubs. Social contributions are ~20% of gross. Strong demand for AI/ML and cloud engineers. B1+ German often expected for on-site roles; English-only common in Berlin startups and international companies.',
  },
  'United Kingdom': {
    mult: 0.92, currency: 'GBP', round: 1000,
    region: 'Western Europe',
    label: 'United Kingdom',
    costOfLivingIndex: 115,
    remoteMultiplier: 1.0,
    notes: 'London commands 20-40% premium. Outside London, salaries are closer to EU averages. Strong fintech and AI ecosystems. Post-Brexit visa rules affect non-UK candidates. Contract/freelance market is mature (IR35 regulations apply).',
  },
  'United States': {
    mult: 1.65, currency: 'USD', round: 5000,
    region: 'North America',
    label: 'United States',
    costOfLivingIndex: 130,
    remoteMultiplier: 1.0,
    notes: 'Highest tech salaries globally. Bay Area/NYC/Seattle command 30-50% premium. Stock options/RSUs are significant part of total comp at FAANG+ (can add 30-100% to base). Healthcare costs offset some salary advantage. H-1B visa required for non-citizens.',
  },
  'Netherlands': {
    mult: 0.95, currency: 'EUR', round: 1000,
    region: 'Western Europe',
    label: 'Netherlands',
    costOfLivingIndex: 112,
    remoteMultiplier: 1.0,
    notes: 'Amsterdam is a major tech hub with many international companies. 30% ruling for expats reduces tax significantly for first 5 years. English widely spoken in tech. Strong AI/fintech/logistics-tech ecosystem.',
  },
  'France': {
    mult: 0.88, currency: 'EUR', round: 1000,
    region: 'Western Europe',
    label: 'France',
    costOfLivingIndex: 107,
    remoteMultiplier: 1.0,
    notes: 'Paris is the main tech hub with a thriving startup ecosystem (Station F). 35-hour work week culture with strong labor protections. Strong AI/fintech scene. Social contributions are high (~25% employer-side). English increasingly common in tech but French often expected.',
  },
  'Spain': {
    mult: 0.62, currency: 'EUR', round: 1000,
    region: 'Southern Europe',
    label: 'Spain',
    costOfLivingIndex: 78,
    remoteMultiplier: 1.3,
    notes: 'Madrid and Barcelona are the primary tech hubs. Growing startup scene with increasing VC investment. Salaries are 20-35% below Western EU averages but rising steadily. Autonomo (freelance) regime is common. Strong quality of life attracts remote workers.',
  },
  'Italy': {
    mult: 0.68, currency: 'EUR', round: 1000,
    region: 'Southern Europe',
    label: 'Italy',
    costOfLivingIndex: 85,
    remoteMultiplier: 1.2,
    notes: 'Milan is the main tech hub, followed by Rome and Turin. Strong manufacturing-tech and fintech sectors. Salaries are 25-35% below Western EU but rising fast, especially in AI and cloud. High social contributions (~33% total). Partita IVA (freelance) regime is common for contractors.',
  },
  'Poland': {
    mult: 0.45, currency: 'PLN', round: 1000, currencyMult: 4.3,
    region: 'Eastern Europe',
    label: 'Poland',
    costOfLivingIndex: 55,
    remoteMultiplier: 1.5,
    notes: 'Warsaw, Krakow, and Wroclaw are major tech hubs. Fast-growing market with a strong outsourcing and nearshoring sector. B2B contracts (dzialalnosc gospodarcza) are very common and offer significant tax advantages. Salaries are 40-55% below Western EU but climbing rapidly.',
  },
  'Czechia': {
    mult: 0.50, currency: 'CZK', round: 5000, currencyMult: 25.0,
    region: 'Eastern Europe',
    label: 'Czechia',
    costOfLivingIndex: 62,
    remoteMultiplier: 1.4,
    notes: 'Prague is the main tech hub with a strong developer community. Growing startup ecosystem. Salaries are 35-50% below Western EU. Strong tradition in systems programming and cybersecurity. English widely spoken in tech companies.',
  },
  'Switzerland': {
    mult: 1.75, currency: 'CHF', round: 1000,
    region: 'Western Europe',
    label: 'Switzerland',
    costOfLivingIndex: 160,
    remoteMultiplier: 1.0,
    notes: 'Zurich is the main tech hub, with Google, ETH spin-offs, and major banks. Highest tech salaries in Europe (2-3x Germany). Very high cost of living offsets salary advantage. Low taxes by European standards. Permits required for non-EU citizens (B/C permits).',
  },
  'Austria': {
    mult: 0.92, currency: 'EUR', round: 1000,
    region: 'Western Europe',
    label: 'Austria',
    costOfLivingIndex: 105,
    remoteMultiplier: 1.0,
    notes: 'Vienna is the main tech hub with a growing startup scene. Salaries are similar to Germany but slightly lower. Strong social security system. German language often expected. Good quality of life and central European location.',
  },
  'Sweden': {
    mult: 0.88, currency: 'SEK', round: 5000, currencyMult: 11.2,
    region: 'Nordic',
    label: 'Sweden',
    costOfLivingIndex: 110,
    remoteMultiplier: 1.0,
    notes: 'Stockholm is a major European startup hub (Spotify, Klarna, King). High salaries but high taxes and cost of living. Strong engineering culture. English widely spoken in tech. Generous benefits (6 weeks vacation, parental leave).',
  },
  'Denmark': {
    mult: 0.98, currency: 'DKK', round: 5000, currencyMult: 7.45,
    region: 'Nordic',
    label: 'Denmark',
    costOfLivingIndex: 125,
    remoteMultiplier: 1.0,
    notes: 'Copenhagen is the main tech hub with strong fintech and biotech sectors. Excellent work-life balance culture. High salaries but very high taxes (up to 52%). Strong social safety net. English widely spoken in tech.',
  },
  'Ireland': {
    mult: 0.95, currency: 'EUR', round: 1000,
    region: 'Western Europe',
    label: 'Ireland',
    costOfLivingIndex: 118,
    remoteMultiplier: 1.0,
    notes: 'Dublin is the EMEA headquarters for many US tech giants (Google, Meta, Microsoft, Salesforce). High salaries driven by multinational presence. Housing costs in Dublin are very high. English-speaking market. 12.5% corporate tax rate attracts companies.',
  },
  'Portugal': {
    mult: 0.55, currency: 'EUR', round: 1000,
    region: 'Southern Europe',
    label: 'Portugal',
    costOfLivingIndex: 68,
    remoteMultiplier: 1.4,
    notes: 'Lisbon tech hub growing fast with Web Summit relocation and increasing VC investment. Digital nomad friendly with NHR tax regime for new residents. Salaries are 35-50% below Western EU but rising. Porto is a secondary hub. Strong quality of life and affordable cost of living.',
  },
  'Canada': {
    mult: 1.15, currency: 'CAD', round: 1000, currencyMult: 1.38,
    region: 'North America',
    label: 'Canada',
    costOfLivingIndex: 105,
    remoteMultiplier: 1.0,
    notes: 'Toronto and Vancouver are the main tech hubs. Salaries are typically 20-30% below US equivalents. Strong AI/ML ecosystem (Montreal/Toronto). Immigration-friendly with Express Entry and Global Talent Stream. Benefits usually include healthcare (provincial) and RRSP matching.',
  },
  'India': {
    mult: 0.22, currency: 'INR', round: 50000, currencyMult: 90.0,
    region: 'Asia',
    label: 'India',
    costOfLivingIndex: 30,
    remoteMultiplier: 2.0,
    notes: 'Bangalore, Hyderabad, and Pune are the main tech hubs. Massive talent pool with the fastest-growing tech market globally. Salaries are lowest in absolute terms but high relative to cost of living. FAANG/top-tier companies pay 3-5x local market rates. Strong IT services and startup ecosystem.',
  },
  'Brazil': {
    mult: 0.30, currency: 'BRL', round: 1000, currencyMult: 5.3,
    region: 'South America',
    label: 'Brazil',
    costOfLivingIndex: 42,
    remoteMultiplier: 1.6,
    notes: 'Sao Paulo is the main tech hub, followed by Belo Horizonte and Florianopolis. Growing tech scene with increasing international remote opportunities. CLT (formal employment) includes 13th salary and FGTS. PJ (contractor) arrangements are common for higher pay. USD-denominated remote roles are highly sought after.',
  },
};

// ---------------------------------------------------------------------------
// Generator helpers
// ---------------------------------------------------------------------------

function rnd(v: number, r: number): number {
  return Math.round(v / r) * r;
}

function buildRoles(mult: number, currency: string, roundTo: number, currencyMult = 1): SalaryBand[] {
  const f = mult * currencyMult;
  return ROLES.map((role) => {
    const b = BASE[role];
    const s = EXEC_ROLES.has(role) ? EXEC_SPREAD : STD_SPREAD;
    return {
      role,
      currency,
      junior: { low: rnd(b * s.jl * f, roundTo), mid: rnd(b * s.jm * f, roundTo), high: rnd(b * s.jh * f, roundTo) },
      mid:    { low: rnd(b * s.ml * f, roundTo), mid: rnd(b * s.mm * f, roundTo), high: rnd(b * s.mh * f, roundTo) },
      senior: { low: rnd(b * s.sl * f, roundTo), mid: rnd(b * s.sm * f, roundTo), high: rnd(b * s.sh * f, roundTo) },
      lead:   { low: rnd(b * s.ll * f, roundTo), mid: rnd(b * s.lm * f, roundTo), high: rnd(b * s.lh * f, roundTo) },
    };
  });
}

// ---------------------------------------------------------------------------
// Exported data
// ---------------------------------------------------------------------------

/** Key: country name as it appears in the questionnaire */
export const SALARY_DATA: Record<string, RegionalSalaryData> = Object.fromEntries(
  Object.entries(COUNTRY_DEFS).map(([name, def]) => [
    name,
    {
      region: def.region,
      label: def.label,
      costOfLivingIndex: def.costOfLivingIndex,
      remoteMultiplier: def.remoteMultiplier,
      notes: def.notes,
      roles: buildRoles(def.mult, def.currency, def.round, def.currencyMult),
    },
  ]),
);

/** Remote EU market rates (for anyone working remotely for Western EU companies) */
export const REMOTE_EU_RATES: SalaryBand[] = buildRoles(0.95, 'EUR', 1000);

/** Remote US market rates (for anyone working remotely for US companies) */
export const REMOTE_US_RATES: SalaryBand[] = buildRoles(1.65 * 0.85, 'USD', 5000);

// ---------------------------------------------------------------------------
// Context builder
// ---------------------------------------------------------------------------

/**
 * Get salary context for a specific country + work preference
 */
export function getSalaryContext(country: string, workPreference: string): string {
  const local = SALARY_DATA[country];
  const isRemote = workPreference === 'remote' || workPreference === 'flexible';
  const isNorthAmerica = country === 'United States' || country === 'Canada';

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

    if (isNorthAmerica) {
      context += `\nREMOTE US MARKET (for ${country}-based professionals working for US companies):\n`;
      context += `- All gross annual USD:\n`;
      for (const r of REMOTE_US_RATES) {
        context += `  ${r.role}: Junior ${r.junior.low}-${r.junior.high} | Mid ${r.mid.low}-${r.mid.high} | Senior ${r.senior.low}-${r.senior.high} | Lead ${r.lead.low}-${r.lead.high}\n`;
      }
    }
  }

  context += '\nIMPORTANT: These are reference benchmarks from public salary surveys. Adjust based on specific company size, funding stage, and exact role scope. Always quote GROSS ANNUAL figures.\n';

  return context;
}
