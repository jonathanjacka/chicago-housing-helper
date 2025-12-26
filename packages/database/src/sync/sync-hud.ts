/**
 * Sync script for HUD Income Limits
 * Run with: pnpm db:sync:hud
 * 
 * Fetches live data from HUD API with fallback to static data
 */

import { PrismaClient } from '@prisma/client';
import { fetchIncomeLimits } from '../services/hud-api';
import { ALL_INCOME_LIMITS } from '../data/hud-limits';

const prisma = new PrismaClient();

async function syncFromApi(year: number): Promise<boolean> {
  console.log(`📊 Fetching ${year} income limits from HUD API...`);

  const data = await fetchIncomeLimits(year);

  if (!data) {
    return false;
  }

  console.log(`   ✅ Area: ${data.areaName}`);
  console.log(`   📈 Median Income: $${data.medianIncome.toLocaleString()}`);

  for (const limit of data.limits) {
    await prisma.amiLimit.upsert({
      where: {
        year_householdSize: {
          year: data.year,
          householdSize: limit.householdSize,
        },
      },
      update: {
        ami100: limit.ami100,
        ami80: limit.ami80,
        ami60: limit.ami60,
        ami50: limit.ami50,
        ami30: limit.ami30,
      },
      create: {
        year: data.year,
        householdSize: limit.householdSize,
        ami100: limit.ami100,
        ami80: limit.ami80,
        ami60: limit.ami60,
        ami50: limit.ami50,
        ami30: limit.ami30,
      },
    });
  }

  console.log(`   ✅ Synced 8 household sizes for ${year}\n`);
  return true;
}

async function syncFromStatic() {
  console.log('📂 Using static fallback data...');

  for (const limit of ALL_INCOME_LIMITS) {
    await prisma.amiLimit.upsert({
      where: {
        year_householdSize: {
          year: limit.year,
          householdSize: limit.householdSize,
        },
      },
      update: {
        ami100: limit.ami100,
        ami80: limit.ami80,
        ami60: limit.ami60,
        ami50: limit.ami50,
        ami30: limit.ami30,
      },
      create: {
        year: limit.year,
        householdSize: limit.householdSize,
        ami100: limit.ami100,
        ami80: limit.ami80,
        ami60: limit.ami60,
        ami50: limit.ami50,
        ami30: limit.ami30,
      },
    });
  }

  console.log(`   ✅ Synced ${ALL_INCOME_LIMITS.length} records from static data\n`);
}

async function syncHudIncomeLimits() {
  console.log('🏛️  Syncing HUD Income Limits for Chicago (Cook County)...\n');

  // Try live API for 2024 and 2025
  const years = [2024, 2025];
  let anySuccess = false;

  for (const year of years) {
    const success = await syncFromApi(year);
    if (success) anySuccess = true;
  }

  // If API failed completely, use static fallback
  if (!anySuccess) {
    console.log('⚠️  API unavailable, falling back to static data...\n');
    await syncFromStatic();
  }

  // Summary
  const total = await prisma.amiLimit.count();
  const byYear = await prisma.amiLimit.groupBy({
    by: ['year'],
    _count: true,
  });

  console.log('📋 Summary:');
  for (const y of byYear) {
    console.log(`   ${y.year}: ${y._count} household sizes`);
  }
  console.log(`\n🎉 Total AMI limits in database: ${total}`);
}

syncHudIncomeLimits()
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
