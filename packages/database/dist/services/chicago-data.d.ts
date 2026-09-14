/**
 * Chicago Open Data API Service
 * Dataset: Affordable Rental Housing Developments (s6ha-ppgi)
 * https://data.cityofchicago.org/resource/s6ha-ppgi.json
 * No authentication required.
 */
import { ProgramType, TargetPopulation } from '@prisma/client';
export interface ChicagoPropertyData {
    property_name: string;
    address: string;
    zip_code: string;
    community_area: string;
    community_area_number: string;
    property_type: string;
    units: string;
    phone_number?: string;
    management_company?: string;
    latitude?: string;
    longitude?: string;
    x_coordinate?: string;
    y_coordinate?: string;
}
export declare function fetchAffordableHousing(limit?: number): Promise<ChicagoPropertyData[]>;
/**
 * Map Socrata property_type to ProgramType enum.
 * Senior/Supportive types remain OTHER here; their target population is
 * handled by mapTargetPopulation separately.
 */
export declare function mapPropertyType(propertyType: string): ProgramType;
/**
 * Map Socrata property_type to TargetPopulation enum.
 * This is separate from mapPropertyType because a property_type like
 * "Senior HUD 202" tells us BOTH the program type (OTHER/202) and
 * the target population (SENIOR).
 */
export declare function mapTargetPopulation(propertyType: string): TargetPopulation;
/**
 * Derive income limit %AMI from Socrata property_type.
 * These are best-effort defaults; authoritative values come from HUD LIHTC DB
 * or property-level sources in later pipeline phases.
 *
 * Historical default was 80% for all non-ARO — this was wrong.
 * LIHTC units are most commonly 60% AMI.
 * Supportive/Senior HUD 202 units are commonly 30-50% AMI.
 */
export declare function deriveIncomeLimitPctAmi(propertyType: string): number;
//# sourceMappingURL=chicago-data.d.ts.map