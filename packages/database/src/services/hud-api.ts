/**
 * HUD API Service
 * Fetches Income Limits from the HUD User API
 * 
 * API Docs: https://www.huduser.gov/portal/dataset/fmr-api.html
 * Cook County, IL Entity ID: 1703199999 (State 17 + County 031 + 99999)
 */

const HUD_API_BASE = 'https://www.huduser.gov/hudapi/public';
const COOK_COUNTY_ENTITY_ID = '1703199999';

interface HudIncomeLimitResponse {
  data: {
    county_name: string;
    metro_name: string;
    area_name: string;
    year: string;
    median_income: number;
    very_low: Record<string, number>;      // 50% AMI: il50_p1 through il50_p8
    extremely_low: Record<string, number>; // 30% AMI: il30_p1 through il30_p8
    low: Record<string, number>;           // 80% AMI: il80_p1 through il80_p8
  };
}

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

export async function fetchIncomeLimits(year: number = 2024): Promise<ParsedIncomeLimit | null> {
  const token = process.env.HUD_API_TOKEN;

  if (!token) {
    console.error('   ❌ HUD_API_TOKEN not found in environment variables');
    return null;
  }

  try {
    const url = `${HUD_API_BASE}/il/data/${COOK_COUNTY_ENTITY_ID}?year=${year}`;
    console.log(`   Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`   ❌ HUD API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result: HudIncomeLimitResponse = await response.json();
    const data = result.data;

    // Parse into our format
    const limits = [];
    for (let size = 1; size <= 8; size++) {
      const ami30 = data.extremely_low[`il30_p${size}`] || 0;
      const ami50 = data.very_low[`il50_p${size}`] || 0;
      const ami80 = data.low[`il80_p${size}`] || 0;

      // Calculate ami60 (interpolate between 50% and 80%)
      const ami60 = Math.round(ami50 + (ami80 - ami50) * 0.4);

      // Calculate ami100 (extrapolate from 80%)
      const ami100 = Math.round(ami80 * 1.25);

      limits.push({
        householdSize: size,
        ami30,
        ami50,
        ami60,
        ami80,
        ami100,
      });
    }

    return {
      year: parseInt(data.year),
      areaName: data.area_name || data.metro_name,
      medianIncome: data.median_income,
      limits,
    };
  } catch (error) {
    console.error('   ❌ Failed to fetch HUD income limits:', error);
    return null;
  }
}
