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
export interface IncomeLimitData {
    year: number;
    householdSize: number;
    ami30: number;
    ami50: number;
    ami60: number;
    ami80: number;
    ami100: number;
}
export declare const INCOME_LIMITS_2024: IncomeLimitData[];
export declare const INCOME_LIMITS_2026: IncomeLimitData[];
export declare const ALL_INCOME_LIMITS: IncomeLimitData[];
/**
 * Get income limit for a specific household size and year.
 * Defaults to most recent year (2026).
 */
export declare function getIncomeLimit(householdSize: number, pctAmi: 30 | 50 | 60 | 80 | 100, year?: number): number | null;
//# sourceMappingURL=hud-limits.d.ts.map