# Salary Data Pipeline

## Sources & Coverage

| Source | Region | Occupations | Granularity | Update Frequency |
|--------|--------|-------------|-------------|-----------------|
| US BLS OEWS | United States | 830 | SOC 6-digit, percentiles | Annual (May) |
| UK ONS ASHE | United Kingdom | 400+ | SOC 4-digit, percentiles | Annual |
| Eurostat SES | 27 EU countries + CH | ISCO 2-digit groups | Country-level | Every 4 years (2022) |
| Stack Overflow | Global (20 countries) | ~30 dev roles | Role x Country | Annual |
| Curated | All markets | 120 roles | Role x Country x Level | Manual |

## Data Files
- `lib/knowledge/bls-salary-data.json` — US government data
- `lib/knowledge/uk-ons-salary-data.json` — UK government data
- `lib/knowledge/eurostat-salary-data.json` — EU government data
- `lib/knowledge/stackoverflow-salary-data.json` — Developer survey data
- `lib/knowledge/salary-data.ts` — Curated fallback data

## Mapping Files
- `lib/knowledge/soc-mapping.ts` — US BLS SOC code mappings (role title -> SOC 6-digit)
- `lib/knowledge/uk-soc-mapping.ts` — UK ONS SOC code mappings (role title -> UK SOC 4-digit)
- `lib/knowledge/isco-mapping.ts` — Eurostat ISCO-08 mappings (role title -> ISCO 2-digit + isTech flag)

## Lookup Priority
1. Government data (BLS/ONS/Eurostat) — most authoritative
2. Stack Overflow Survey — best for tech roles
3. Curated estimates — human-reviewed
4. Claude AI estimate — last resort

## Refreshing Data
1. Download latest BLS: visit https://www.bls.gov/oes/tables.htm
2. Download latest ONS ASHE: visit https://www.ons.gov.uk/
3. Eurostat updates every 4 years (next: 2026)
4. Stack Overflow publishes survey annually
