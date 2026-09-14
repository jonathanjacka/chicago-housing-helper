/**
 * Sync script for Chicago Open Data - Affordable Housing
 * Run with: pnpm db:sync:chicago
 */

import { PrismaClient } from '@prisma/client';
import {
  fetchAffordableHousing,
  mapPropertyType,
  mapTargetPopulation,
  deriveIncomeLimitPctAmi,
} from '../services/chicago-data';
import { startSyncRun, completeSyncRun } from '../services/sync-audit';

const prisma = new PrismaClient();

async function syncChicagoData() {
  const runId = await startSyncRun('chicago', process.env.CI ? 'github_actions' : 'manual');
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errorCount = 0;
  const errors: string[] = [];
  let properties: Awaited<ReturnType<typeof fetchAffordableHousing>> = [];

  try {
    console.log('🏙️  Syncing Affordable Housing from Chicago Data Portal...\n');

    properties = await fetchAffordableHousing(2000);

    if (properties.length === 0) {
      console.log('⚠️  No properties returned from API');
      return;
    }

    console.log(`   📊 Found ${properties.length} properties\n`);

    for (const property of properties) {
      if (!property.property_name || !property.address) {
        skipped++;
        continue;
      }

      const sourceId = `chicago:${property.address.toLowerCase().replace(/\s+/g, '-')}`;

      try {
        const existing = await prisma.program.findFirst({
          where: { dataSource: sourceId },
        });

        // Use Socrata lat/lng directly when available (authoritative geocoords)
        const latitude = property.latitude ? parseFloat(property.latitude) : null;
        const longitude = property.longitude ? parseFloat(property.longitude) : null;
        const hasGeocoords = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

        const programData = {
          name: property.property_name,
          provider: property.management_company || 'City of Chicago',
          type: mapPropertyType(property.property_type),
          targetPopulation: mapTargetPopulation(property.property_type),
          address: property.address,
          neighborhood: property.community_area,
          zipCode: property.zip_code,
          contactPhone: property.phone_number || null,
          // Only set lat/lng from Socrata; leave null for Nominatim to fill later
          ...(hasGeocoords ? { latitude, longitude } : {}),
          dataSource: sourceId,
          lastSynced: new Date(),
          incomeLimitPctAmi: deriveIncomeLimitPctAmi(property.property_type),
          waitlistStatus: 'UNKNOWN' as const,
          description: `${property.units || 'Multiple'} affordable units in ${property.community_area}`,
        };

        if (existing) {
          await prisma.program.update({ where: { id: existing.id }, data: programData });
          updated++;
        } else {
          await prisma.program.create({ data: programData });
          created++;
        }
      } catch (error) {
        console.error(`   ❌ Error syncing ${property.property_name}:`, error);
        errorCount++;
        errors.push(`${property.property_name}: ${String(error).slice(0, 100)}`);
      }
    }

    console.log(`\n   ✅ Created: ${created} programs`);
    console.log(`   🔄 Updated: ${updated} programs`);
    console.log(`   ⏭️  Skipped: ${skipped} properties`);

    const total = await prisma.program.count();
    console.log(`\n🎉 Total programs in database: ${total}`);
  } finally {
    await completeSyncRun(runId, {
      recordsFetched: properties.length,
      recordsUpserted: created + updated,
      recordsSkipped: skipped,
      recordsErrored: errorCount,
    }, undefined, errors.length > 0 ? errors.join(' | ') : undefined);
  }
}

syncChicagoData()
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
