/**
 * Chicago Open Data API Service
 * Fetches Affordable Rental Housing Developments from Chicago Data Portal
 * 
 * Dataset: Affordable Rental Housing Developments
 * API: https://data.cityofchicago.org/resource/s6ha-ppgi.json
 * No authentication required (Socrata Open Data API)
 */

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
 * Map Chicago property type to our ProgramType enum
 */
export function mapPropertyType(propertyType: string): string {
  const typeMap: Record<string, string> = {
    'ARO': 'ARO',
    'Multifamily': 'LIHTC', // Most multifamily affordable housing uses LIHTC
    'Senior': 'OTHER',
    'SRO': 'OTHER',
    'Family': 'LIHTC',
  };

  return typeMap[propertyType] || 'OTHER';
}
