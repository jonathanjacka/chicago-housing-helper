/**
 * Sync script for Chicago Open Data - Affordable Housing
 * Run with: pnpm db:sync:chicago
 * 
 * Source: Chicago Data Portal - Affordable Rental Housing Developments
 * https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/s6ha-ppgi
 */

import { PrismaClient, ProgramType } from '@prisma/client';
import { fetchAffordableHousing, mapPropertyType } from '../services/chicago-data';

const prisma = new PrismaClient();

async function syncChicagoData() {
  console.log('🏙️  Syncing Affordable Housing from Chicago Data Portal...\n');

  const properties = await fetchAffordableHousing(2000);

  if (properties.length === 0) {
    console.log('⚠️  No properties returned from API');
    return;
  }

  console.log(`   📊 Found ${properties.length} properties\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const property of properties) {
    // Skip if no name or address
    if (!property.property_name || !property.address) {
      skipped++;
      continue;
    }

    // Create a unique source ID based on address
    const sourceId = `chicago:${property.address.toLowerCase().replace(/\s+/g, '-')}`;

    try {
      // Check if program already exists with this source
      const existing = await prisma.program.findFirst({
        where: { dataSource: sourceId },
      });

      const programData = {
        name: property.property_name,
        provider: property.management_company || 'City of Chicago',
        type: mapPropertyType(property.property_type) as ProgramType,
        address: property.address,
        neighborhood: property.community_area,
        zipCode: property.zip_code,
        contactPhone: property.phone_number || null,
        dataSource: sourceId,
        lastSynced: new Date(),
        // Most Chicago ARO units are 60% AMI
        incomeLimitPctAmi: property.property_type === 'ARO' ? 60 : 80,
        waitlistStatus: 'UNKNOWN' as const,
        targetPopulation: 'ALL' as const,
        description: `${property.units || 'Multiple'} affordable units in ${property.community_area}`,
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
      console.error(`   ❌ Error syncing ${property.property_name}:`, error);
      skipped++;
    }
  }

  console.log(`\n   ✅ Created: ${created} programs`);
  console.log(`   🔄 Updated: ${updated} programs`);
  console.log(`   ⏭️  Skipped: ${skipped} properties`);

  const total = await prisma.program.count();
  console.log(`\n🎉 Total programs in database: ${total}`);
}

syncChicagoData()
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
