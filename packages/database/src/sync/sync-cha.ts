/**
 * CHA Autonomous Data Sync Script
 * Run with: pnpm db:sync:cha
 */

import { PrismaClient, ProgramType, TargetPopulation, WaitlistStatus } from '@prisma/client';
import { runAutonomousAgent, ValidationResult } from '../services/cha-agent';
import { startSyncRun, completeSyncRun } from '../services/sync-audit';

const prisma = new PrismaClient();

function mapProgramType(program: string | undefined): ProgramType {
  if (!program) return 'OTHER';
  const normalized = program.toUpperCase();
  if (normalized.includes('PBV') || normalized.includes('PROJECT-BASED VOUCHER') || normalized.includes('PROJECT BASED')) return 'PBV';
  if (normalized.includes('PUBLIC HOUSING') || normalized === 'PH') return 'PUBLIC_HOUSING';
  if (normalized.includes('HCV') || normalized.includes('HOUSING CHOICE')) return 'HCV';
  if (normalized.includes('PBRA') || normalized.includes('RENTAL ASSISTANCE')) return 'PBRA';
  return 'OTHER';
}

function mapTargetPopulation(population: string | undefined): TargetPopulation {
  if (!population) return 'ALL';
  const normalized = population.toUpperCase();
  if (normalized.includes('SENIOR') || normalized.includes('ELDERLY') || normalized.includes('62+')) return 'SENIOR';
  if (normalized.includes('DISABLED') || normalized.includes('DISABILITY')) return 'DISABLED';
  if (normalized.includes('FAMILY') || normalized.includes('FAMILIES')) return 'FAMILY';
  return 'ALL';
}

/**
 * Derive waitlist status from CHA XLSX status field.
 * Does NOT hardcode OPEN — maps from actual source value.
 */
export function mapChaWaitlistStatus(status: string | undefined): WaitlistStatus {
  if (!status) return 'UNKNOWN';
  const upper = status.toUpperCase().trim();
  if (upper.includes('OPEN')) return 'OPEN';
  if (upper.includes('CLOSED')) return 'CLOSED';
  if (upper.includes('LOTTERY')) return 'LOTTERY';
  return 'UNKNOWN';
}

async function upsertChaPrograms(validated: ValidationResult): Promise<{ created: number; updated: number; skipped: number; errors: string[] }> {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const prop of validated.cleanedProperties) {
    // Use propertyCode as primary key when available; fall back to name slug
    const keyPart = prop.propertyCode
      ? `code:${prop.propertyCode.toLowerCase()}`
      : (prop.waitlistCode || prop.waitlistName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sourceId = `cha:${keyPart}`;

    try {
      const existing = await prisma.program.findFirst({
        where: { dataSource: sourceId },
      });

      // Derive waitlist status from XLSX status field, not hardcoded
      const waitlistStatus = mapChaWaitlistStatus(prop.status);

      const programData = {
        name: prop.waitlistName || prop.propertyName || 'CHA Program',
        provider: 'Chicago Housing Authority',
        type: mapProgramType(prop.programType),
        targetPopulation: mapTargetPopulation(prop.targetPopulation),
        waitlistStatus,
        address: prop.address || undefined,
        contactPhone: prop.contactPhone || undefined,
        dataSource: sourceId,
        lastSynced: new Date(),
        description: prop.applicantCount
          ? `${prop.targetPopulation || 'General'} housing - ${prop.applicantCount.toLocaleString()} applicants on waitlist`
          : `${prop.targetPopulation || 'General'} housing`,
        notes: prop.programType,
      };

      if (existing) {
        await prisma.program.update({ where: { id: existing.id }, data: programData });
        updated++;
      } else {
        await prisma.program.create({ data: programData });
        created++;
      }
    } catch (error) {
      console.error(`   ❌ Error upserting ${prop.waitlistName}:`, error);
      skipped++;
      errors.push(`${prop.waitlistName}: ${String(error).slice(0, 100)}`);
    }
  }

  return { created, updated, skipped, errors };
}

async function syncCha() {
  const runId = await startSyncRun('cha', process.env.CI ? 'github_actions' : 'manual');
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errorCount = 0;
  const errors: string[] = [];
  let fetchedCount = 0;

  try {
    console.log('🏠 CHA Autonomous Data Sync\n');
    console.log('='.repeat(50));

    const validated = await runAutonomousAgent();

    if (!validated) {
      console.log('\n❌ Agent could not complete extraction');
      console.log('   Existing CHA data will be preserved.\n');
      return;
    }

    fetchedCount = validated.cleanedProperties.length;

    if (validated.cleanedProperties.length === 0) {
      console.log('\n⚠️ No valid records to save');
      console.log(`   Summary: ${validated.summary}`);
      return;
    }

    if (!validated.isValid) {
      console.log(`\n📝 Validation notes: ${validated.summary}`);
    }

    console.log(`\n💾 Saving ${validated.cleanedProperties.length} CHA properties...`);
    const result = await upsertChaPrograms(validated);
    created = result.created;
    updated = result.updated;
    skipped = result.skipped;
    errorCount = result.errors.length;
    errors.push(...result.errors);

    console.log(`\n   ✅ Created: ${created} programs`);
    console.log(`   🔄 Updated: ${updated} programs`);
    console.log(`   ⏭️  Skipped (errors): ${skipped} programs`);

    const chaCount = await prisma.program.count({ where: { dataSource: { startsWith: 'cha:' } } });
    const totalCount = await prisma.program.count();

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 CHA programs in database: ${chaCount}`);
    console.log(`📊 Total programs: ${totalCount}`);
  } finally {
    await completeSyncRun(runId, {
      recordsFetched: fetchedCount,
      recordsUpserted: created + updated,
      recordsSkipped: skipped,
      recordsErrored: errorCount,
    }, undefined, errors.length > 0 ? errors.join(' | ') : undefined);
  }
}

syncCha()
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
