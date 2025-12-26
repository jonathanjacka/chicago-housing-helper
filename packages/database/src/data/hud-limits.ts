/**
 * HUD Income Limits Data
 * 
 * Official 2024 income limits from chicago.gov for Chicago/Cook County
 * Chicago-Naperville-Joliet, IL HUD Metro FMR Area
 * Effective: April 1, 2024
 * 
 * Source: https://www.chicago.gov/city/en/depts/doh/provdrs/renters/svcs/ami.html
 */

export interface IncomeLimitData {
  year: number;
  householdSize: number;
  ami30: number;  // 30% AMI (Extremely Low Income)
  ami50: number;  // 50% AMI (Very Low Income)
  ami60: number;  // 60% AMI (computed)
  ami80: number;  // 80% AMI (Low Income)
  ami100: number; // 100% AMI (computed from median)
}

// Official 2024 HUD Income Limits for Chicago/Cook County
// Source: chicago.gov - effective April 1, 2024
export const INCOME_LIMITS_2024: IncomeLimitData[] = [
  { year: 2024, householdSize: 1, ami30: 23600, ami50: 39250, ami60: 47100, ami80: 62800, ami100: 78500 },
  { year: 2024, householdSize: 2, ami30: 26950, ami50: 44850, ami60: 53820, ami80: 71800, ami100: 89750 },
  { year: 2024, householdSize: 3, ami30: 30300, ami50: 50450, ami60: 60540, ami80: 80750, ami100: 100900 },
  { year: 2024, householdSize: 4, ami30: 33650, ami50: 56050, ami60: 67260, ami80: 89700, ami100: 112100 },
  { year: 2024, householdSize: 5, ami30: 36350, ami50: 60550, ami60: 72660, ami80: 96900, ami100: 121100 },
  { year: 2024, householdSize: 6, ami30: 39050, ami50: 65050, ami60: 78060, ami80: 104100, ami100: 130100 },
  { year: 2024, householdSize: 7, ami30: 41750, ami50: 69550, ami60: 83460, ami80: 111250, ami100: 139100 },
  { year: 2024, householdSize: 8, ami30: 44450, ami50: 74000, ami60: 88800, ami80: 118450, ami100: 148000 },
];

// 2025 estimates (using 2024 + anticipated 3% increase)
// Will be updated when official 2025 limits are released
export const INCOME_LIMITS_2025: IncomeLimitData[] = INCOME_LIMITS_2024.map(limit => ({
  ...limit,
  year: 2025,
  ami30: Math.round(limit.ami30 * 1.03),
  ami50: Math.round(limit.ami50 * 1.03),
  ami60: Math.round(limit.ami60 * 1.03),
  ami80: Math.round(limit.ami80 * 1.03),
  ami100: Math.round(limit.ami100 * 1.03),
}));

export const ALL_INCOME_LIMITS = [...INCOME_LIMITS_2024, ...INCOME_LIMITS_2025];

/**
 * Get income limit for a specific household size and year
 */
export function getIncomeLimit(
  householdSize: number,
  pctAmi: 30 | 50 | 60 | 80 | 100,
  year: number = 2024
): number | null {
  const limit = ALL_INCOME_LIMITS.find(
    l => l.householdSize === householdSize && l.year === year
  );

  if (!limit) return null;

  switch (pctAmi) {
    case 30: return limit.ami30;
    case 50: return limit.ami50;
    case 60: return limit.ami60;
    case 80: return limit.ami80;
    case 100: return limit.ami100;
    default: return null;
  }
}
