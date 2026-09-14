import { describe, it, expect } from 'vitest';
import { getIncomeLimit, ALL_INCOME_LIMITS } from '../data/hud-limits';
describe('AMI limits', () => {
    it('has 2026 official data', () => {
        const limit2026 = ALL_INCOME_LIMITS.find(l => l.year === 2026 && l.householdSize === 1);
        expect(limit2026).toBeDefined();
        expect(limit2026.ami100).toBe(85050);
    });
    it('2026 is NOT a ×1.03 estimate of 2024', () => {
        const limit2024 = ALL_INCOME_LIMITS.find(l => l.year === 2024 && l.householdSize === 1);
        const limit2026 = ALL_INCOME_LIMITS.find(l => l.year === 2026 && l.householdSize === 1);
        expect(limit2026.ami80).not.toBe(Math.round(limit2024.ami80 * 1.03 * 1.03));
        expect(limit2026.ami80).toBe(68050);
    });
    it('getIncomeLimit returns 2026 values for size-4', () => {
        expect(getIncomeLimit(4, 80, 2026)).toBe(97200);
        expect(getIncomeLimit(4, 50, 2026)).toBe(60750);
        expect(getIncomeLimit(4, 60, 2026)).toBe(72900);
    });
    it('2025 estimate is gone', () => {
        const limit2025 = ALL_INCOME_LIMITS.find(l => l.year === 2025);
        expect(limit2025).toBeUndefined();
    });
    it('has household sizes 1-8 for 2026', () => {
        for (let size = 1; size <= 8; size++) {
            const found = ALL_INCOME_LIMITS.find(l => l.year === 2026 && l.householdSize === size);
            expect(found, `Missing size ${size} for 2026`).toBeDefined();
        }
    });
});
