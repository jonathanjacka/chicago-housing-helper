/**
 * HUD API Service
 * Fetches Income Limits from the HUD User API
 *
 * API Docs: https://www.huduser.gov/portal/dataset/fmr-api.html
 * Cook County, IL Entity ID: 1703199999 (State 17 + County 031 + 99999)
 */
export interface ParsedIncomeLimit {
    year: number;
    areaName: string;
    medianIncome: number;
    limits: {
        householdSize: number;
        ami30: number;
        ami50: number;
        ami60: number;
        ami80: number;
        ami100: number;
    }[];
}
export declare function fetchIncomeLimits(year?: number): Promise<ParsedIncomeLimit | null>;
//# sourceMappingURL=hud-api.d.ts.map