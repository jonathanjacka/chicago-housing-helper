/**
 * CHA Autonomous Data Sync Script
 * Run with: pnpm db:sync:cha
 * 
 * Uses a mission-driven autonomous agent to:
 * 1. Discover data sources from CHA website
 * 2. Analyze XLS structure dynamically
 * 3. Extract all housing program data
 * 4. Validate before saving
 */

import { PrismaClient, ProgramType, TargetPopulation, WaitlistStatus } from '@prisma/client';
import { runAutonomousAgent, ValidationResult } from '../services/cha-agent';

const prisma = new PrismaClient();

/**
 * Map extracted program type to our enum
 */
function mapProgramType(program: string | undefined): ProgramType {
  if (!program) return 'OTHER';
  const normalized = program.toUpperCase();

  if (normalized.includes('PBV') || normalized.includes('PROJECT-BASED VOUCHER') || normalized.includes('PROJECT BASED')) {
    return 'PBV';
  }
  if (normalized.includes('PUBLIC HOUSING') || normalized === 'PH') {
    return 'PUBLIC_HOUSING';
  }
  if (normalized.includes('HCV') || normalized.includes('HOUSING CHOICE')) {
    return 'HCV';
  }
  if (normalized.includes('PBRA') || normalized.includes('RENTAL ASSISTANCE')) {
    return 'PBRA';
  }
  return 'OTHER';
}

/**
 * Map target population to our enum
 */
function mapTargetPopulation(population: string | undefined): TargetPopulation {
  if (!population) return 'ALL';
  const normalized = population.toUpperCase();

  if (normalized.includes('SENIOR') || normalized.includes('ELDERLY') || normalized.includes('62+')) {
    return 'SENIOR';
  }
  if (normalized.includes('DISABLED') || normalized.includes('DISABILITY')) {
    return 'DISABLED';
  }
  if (normalized.includes('FAMILY') || normalized.includes('FAMILIES')) {
    return 'FAMILY';
  }
  return 'ALL';
}

/**
 * Upsert validated CHA properties to database
 */
async function upsertChaPrograms(validated: ValidationResult): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const prop of validated.cleanedProperties) {
    // Generate source ID from waitlist code or name
    const sourceId = `cha:${(prop.waitlistCode || prop.waitlistName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    try {
      const existing = await prisma.program.findFirst({
        where: { dataSource: sourceId },
      });

      const programData = {
        name: prop.waitlistName || prop.propertyName || 'CHA Program',
        provider: 'Chicago Housing Authority',
        type: mapProgramType(prop.programType),
        targetPopulation: mapTargetPopulation(prop.targetPopulation),
        waitlistStatus: 'OPEN' as WaitlistStatus, // Active waitlists
        dataSource: sourceId,
        lastSynced: new Date(),
        description: prop.applicantCount
          ? `${prop.targetPopulation || 'General'} housing - ${prop.applicantCount.toLocaleString()} applicants on waitlist`
          : `${prop.targetPopulation || 'General'} housing`,
        notes: prop.programType,
      };

      if (existing) {
        await prisma.program.update({
          where: { id: existing.id },
          data: programData,
        });
        updated++;
      } else {
        await prisma.program.create({
          data: programData,
        });
        created++;
      }
    } catch (error) {
      console.error(`   ❌ Error upserting ${prop.waitlistName}:`, error);
    }
  }

  return { created, updated };
}

async function syncCha() {
  console.log('🏠 CHA Autonomous Data Sync\n');
  console.log('='.repeat(50));

  // Run the autonomous agent
  const validated = await runAutonomousAgent();

  if (!validated) {
    console.log('\n❌ Agent could not complete extraction');
    console.log('   Existing CHA data will be preserved.\n');
    return;
  }

  if (validated.cleanedProperties.length === 0) {
    console.log('\n⚠️ No valid records to save');
    console.log(`   Summary: ${validated.summary}`);
    return;
  }

  // Log validation notes
  if (!validated.isValid) {
    console.log(`\n📝 Validation notes: ${validated.summary}`);
  }

  // Upsert to database
  console.log(`\n💾 Saving ${validated.cleanedProperties.length} CHA properties...`);
  const { created, updated } = await upsertChaPrograms(validated);

  console.log(`\n   ✅ Created: ${created} programs`);
  console.log(`   🔄 Updated: ${updated} programs`);

  // Summary
  const chaCount = await prisma.program.count({
    where: { dataSource: { startsWith: 'cha:' } },
  });
  const totalCount = await prisma.program.count();

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 CHA programs in database: ${chaCount}`);
  console.log(`📊 Total programs: ${totalCount}`);
}

syncCha()
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
