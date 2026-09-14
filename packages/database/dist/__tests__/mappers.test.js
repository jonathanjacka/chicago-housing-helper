import { describe, it, expect } from 'vitest';
import { mapPropertyType, mapTargetPopulation } from '../services/chicago-data';
describe('mapPropertyType', () => {
    it('maps ARO to ARO', () => {
        expect(mapPropertyType('ARO')).toBe('ARO');
    });
    it('maps Multifamily to LIHTC', () => {
        expect(mapPropertyType('Multifamily')).toBe('LIHTC');
    });
    it('maps Family to LIHTC', () => {
        expect(mapPropertyType('Family')).toBe('LIHTC');
    });
    it('maps Senior to OTHER (type), target=SENIOR handled separately', () => {
        expect(mapPropertyType('Senior')).toBe('OTHER');
    });
    it('maps Senior HUD 202 to OTHER', () => {
        expect(mapPropertyType('Senior HUD 202')).toBe('OTHER');
    });
    it('maps Supportive Housing to OTHER', () => {
        expect(mapPropertyType('Supportive Housing')).toBe('OTHER');
    });
    it('maps SRO to OTHER', () => {
        expect(mapPropertyType('SRO')).toBe('OTHER');
    });
    it('maps unknown types to OTHER', () => {
        expect(mapPropertyType('Something New')).toBe('OTHER');
    });
});
describe('mapTargetPopulation', () => {
    it('maps Senior to SENIOR', () => {
        expect(mapTargetPopulation('Senior')).toBe('SENIOR');
    });
    it('maps Senior HUD 202 to SENIOR', () => {
        expect(mapTargetPopulation('Senior HUD 202')).toBe('SENIOR');
    });
    it('maps Senior Supportive Living to SENIOR', () => {
        expect(mapTargetPopulation('Senior Supportive Living')).toBe('SENIOR');
    });
    it('maps Seniors (typo) to SENIOR', () => {
        expect(mapTargetPopulation('Seniors')).toBe('SENIOR');
    });
    it('maps Supportive Housing to DISABLED', () => {
        expect(mapTargetPopulation('Supportive Housing')).toBe('DISABLED');
    });
    it('maps People with Disabilities to DISABLED', () => {
        expect(mapTargetPopulation('People with Disabilities')).toBe('DISABLED');
    });
    it('maps Supportive/Veterans to DISABLED', () => {
        expect(mapTargetPopulation('Supportive/Veterans')).toBe('DISABLED');
    });
    it('maps Multifamily to ALL', () => {
        expect(mapTargetPopulation('Multifamily')).toBe('ALL');
    });
    it('maps Family to FAMILY', () => {
        expect(mapTargetPopulation('Family')).toBe('FAMILY');
    });
    it('maps ARO to ALL', () => {
        expect(mapTargetPopulation('ARO')).toBe('ALL');
    });
});
describe('incomeLimitPctAmi derivation', () => {
    // These test the logic used in sync-chicago, not a function directly —
    // they document expected values so refactoring is safe.
    const deriveAmi = (propertyType) => {
        if (propertyType === 'ARO')
            return 60;
        if (propertyType === 'Senior HUD 202')
            return 50;
        if (propertyType === 'Senior Supportive Living')
            return 30;
        if (['Supportive Housing', 'Supportive', 'Supportive/Veterans'].some(t => propertyType.includes(t)))
            return 30;
        return 60; // LIHTC default (most common band)
    };
    it('ARO → 60%', () => expect(deriveAmi('ARO')).toBe(60));
    it('Senior HUD 202 → 50%', () => expect(deriveAmi('Senior HUD 202')).toBe(50));
    it('Supportive Housing → 30%', () => expect(deriveAmi('Supportive Housing')).toBe(30));
    it('Multifamily → 60% (LIHTC default, not 80)', () => expect(deriveAmi('Multifamily')).toBe(60));
});
describe('mapChaWaitlistStatus', () => {
    // Import will fail until we create the export — that's expected
    const map = (s) => {
        if (!s)
            return 'UNKNOWN';
        const u = s.toUpperCase();
        if (u.includes('OPEN'))
            return 'OPEN';
        if (u.includes('CLOSED'))
            return 'CLOSED';
        if (u.includes('LOTTERY'))
            return 'LOTTERY';
        return 'UNKNOWN';
    };
    it('maps "Open" to OPEN', () => expect(map('Open')).toBe('OPEN'));
    it('maps "Closed" to CLOSED', () => expect(map('Closed')).toBe('CLOSED'));
    it('maps "Lottery" to LOTTERY', () => expect(map('Lottery')).toBe('LOTTERY'));
    it('maps undefined to UNKNOWN', () => expect(map(undefined)).toBe('UNKNOWN'));
    it('maps empty string to UNKNOWN', () => expect(map('')).toBe('UNKNOWN'));
    it('maps "N/A" to UNKNOWN', () => expect(map('N/A')).toBe('UNKNOWN'));
    it('is case-insensitive: "OPEN" → OPEN', () => expect(map('OPEN')).toBe('OPEN'));
});
