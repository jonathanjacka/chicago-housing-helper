/**
 * HUD Income Limits Data
 *
 * Official 2024 and 2026 income limits for Chicago/Cook County
 * Chicago-Naperville-Joliet, IL HUD Metro FMR Area
 *
 * 2024: Effective April 1, 2024
 * 2026: Effective May 1, 2026 — source: thecha.org/help-center#IncomeLimits (fetched 2026-09-13)
 *
 * ami60 and ami100 are official values from HUD/CHA published tables,
 * NOT derived estimates.
 */
// Official 2024 HUD Income Limits — Cook County
export const INCOME_LIMITS_2024 = [
    { year: 2024, householdSize: 1, ami30: 23600, ami50: 39250, ami60: 47100, ami80: 62800, ami100: 78500 },
    { year: 2024, householdSize: 2, ami30: 26950, ami50: 44850, ami60: 53820, ami80: 71800, ami100: 89750 },
    { year: 2024, householdSize: 3, ami30: 30300, ami50: 50450, ami60: 60540, ami80: 80750, ami100: 100900 },
    { year: 2024, householdSize: 4, ami30: 33650, ami50: 56050, ami60: 67260, ami80: 89700, ami100: 112100 },
    { year: 2024, householdSize: 5, ami30: 36350, ami50: 60550, ami60: 72660, ami80: 96900, ami100: 121100 },
    { year: 2024, householdSize: 6, ami30: 39050, ami50: 65050, ami60: 78060, ami80: 104100, ami100: 130100 },
    { year: 2024, householdSize: 7, ami30: 41750, ami50: 69550, ami60: 83460, ami80: 111250, ami100: 139100 },
    { year: 2024, householdSize: 8, ami30: 44450, ami50: 74000, ami60: 88800, ami80: 118450, ami100: 148000 },
];
// Official 2026 HUD Income Limits — Cook County
// Effective May 1, 2026. Source: CHA Help Center / chicago.gov AMI chart.
// NOTE: ami60 is the official 60% AMI value, not interpolated.
export const INCOME_LIMITS_2026 = [
    { year: 2026, householdSize: 1, ami30: 25550, ami50: 42550, ami60: 51050, ami80: 68050, ami100: 85050 },
    { year: 2026, householdSize: 2, ami30: 29200, ami50: 48600, ami60: 58350, ami80: 77800, ami100: 97200 },
    { year: 2026, householdSize: 3, ami30: 32850, ami50: 54700, ami60: 65650, ami80: 87500, ami100: 109350 },
    { year: 2026, householdSize: 4, ami30: 36450, ami50: 60750, ami60: 72900, ami80: 97200, ami100: 121500 },
    { year: 2026, householdSize: 5, ami30: 39400, ami50: 65650, ami60: 78750, ami80: 105000, ami100: 131250 },
    { year: 2026, householdSize: 6, ami30: 44400, ami50: 70500, ami60: 84600, ami80: 112800, ami100: 140950 },
    { year: 2026, householdSize: 7, ami30: 50050, ami50: 75350, ami60: 90400, ami80: 120550, ami100: 150700 },
    { year: 2026, householdSize: 8, ami30: 55750, ami50: 80200, ami60: 96250, ami80: 128350, ami100: 160400 },
];
export const ALL_INCOME_LIMITS = [...INCOME_LIMITS_2024, ...INCOME_LIMITS_2026];
/**
 * Get income limit for a specific household size and year.
 * Defaults to most recent year (2026).
 */
export function getIncomeLimit(householdSize, pctAmi, year = 2026) {
    const limit = ALL_INCOME_LIMITS.find(l => l.householdSize === householdSize && l.year === year);
    if (!limit)
        return null;
    switch (pctAmi) {
        case 30: return limit.ami30;
        case 50: return limit.ami50;
        case 60: return limit.ami60;
        case 80: return limit.ami80;
        case 100: return limit.ami100;
    }
}
