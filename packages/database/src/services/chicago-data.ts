/**
 * Chicago Open Data API Service
 * Dataset: Affordable Rental Housing Developments (s6ha-ppgi)
 * https://data.cityofchicago.org/resource/s6ha-ppgi.json
 * No authentication required.
 */

import { ProgramType, TargetPopulation } from '@prisma/client';

const CHICAGO_API_BASE = 'https://data.cityofchicago.org/resource/s6ha-ppgi.json';

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

export async function fetchAffordableHousing(limit: number = 1000): Promise<ChicagoPropertyData[]> {
  try {
    const url = `${CHICAGO_API_BASE}?$limit=${limit}&$order=property_name`;
    console.log(`   Fetching from Chicago Data Portal...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Chicago Data API error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data: ChicagoPropertyData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Chicago housing data:', error);
    return [];
  }
}

/**
 * Map Socrata property_type to ProgramType enum.
 * Senior/Supportive types remain OTHER here; their target population is
 * handled by mapTargetPopulation separately.
 */
export function mapPropertyType(propertyType: string): ProgramType {
  const upper = propertyType.toUpperCase();
  if (upper === 'ARO') return 'ARO';
  if (upper === 'MULTIFAMILY' || upper === 'MUTIFAMILY' || upper === 'MULTFAMILY') return 'LIHTC';
  if (upper === 'FAMILY' || upper === 'ARTIST/FAMILY' || upper === 'INTER-GENERATIONAL') return 'LIHTC';
  return 'OTHER';
}

/**
 * Map Socrata property_type to TargetPopulation enum.
 * This is separate from mapPropertyType because a property_type like
 * "Senior HUD 202" tells us BOTH the program type (OTHER/202) and
 * the target population (SENIOR).
 */
export function mapTargetPopulation(propertyType: string): TargetPopulation {
  const upper = propertyType.toUpperCase();

  if (
    upper.includes('SENIOR') ||
    upper.includes('ELDERLY') ||
    upper === 'SENIORS' ||
    upper === '65+/SUPPORTIVE'
  ) {
    return 'SENIOR';
  }

  if (
    upper.includes('SUPPORTIVE') ||
    upper.includes('DISABILITIES') ||
    upper.includes('DISABLED') ||
    upper === 'SRO/SUPPORTIVE'
  ) {
    return 'DISABLED';
  }

  if (upper === 'FAMILY' || upper === 'ARTIST/FAMILY') {
    return 'FAMILY';
  }

  return 'ALL';
}

/**
 * Derive income limit %AMI from Socrata property_type.
 * These are best-effort defaults; authoritative values come from HUD LIHTC DB
 * or property-level sources in later pipeline phases.
 *
 * Historical default was 80% for all non-ARO — this was wrong.
 * LIHTC units are most commonly 60% AMI.
 * Supportive/Senior HUD 202 units are commonly 30-50% AMI.
 */
export function deriveIncomeLimitPctAmi(propertyType: string): number {
  const upper = propertyType.toUpperCase();
  if (upper === 'ARO') return 60;
  if (upper.includes('SENIOR HUD 202') || upper.includes('SENIOR SUPPORTIVE')) return 50;
  if (upper.includes('SUPPORTIVE') || upper.includes('SRO')) return 30;
  // LIHTC default — most common financing band
  return 60;
}
