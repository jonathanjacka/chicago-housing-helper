/**
 * Geocoding Sync Script
 * 
 * Batch geocodes all programs with addresses but no coordinates.
 * Uses Nominatim API with rate limiting (1 req/sec).
 */

import { prisma } from '../index';
import { geocodeAddress } from '../services/geocoding';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncGeocode() {
  console.log('📍 Starting Geocoding Sync...\n');

  // Find programs with addresses but no coordinates
  const programsToGeocode = await prisma.program.findMany({
    where: {
      address: { not: null },
      latitude: null,
    },
    select: {
      id: true,
      name: true,
      address: true,
    },
  });

  console.log(`   Found ${programsToGeocode.length} programs to geocode\n`);

  if (programsToGeocode.length === 0) {
    console.log('   ✅ All programs already geocoded!\n');
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < programsToGeocode.length; i++) {
    const program = programsToGeocode[i];

    // Rate limit: 1 request per second
    if (i > 0) {
      await sleep(1100); // Slightly over 1 second to be safe
    }

    // Progress indicator
    const progress = Math.round((i + 1) / programsToGeocode.length * 100);
    process.stdout.write(`\r   [${progress}%] Geocoding ${i + 1}/${programsToGeocode.length}: ${program.name.substring(0, 40)}...`);

    try {
      const result = await geocodeAddress(program.address!);

      if (result) {
        await prisma.program.update({
          where: { id: program.id },
          data: {
            latitude: result.latitude,
            longitude: result.longitude,
          },
        });
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`\n   ❌ Error geocoding ${program.name}:`, error);
      failed++;
    }
  }

  console.log(`\n\n📊 Geocoding Complete:`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);

  // Show stats
  const withCoords = await prisma.program.count({
    where: { latitude: { not: null } },
  });
  console.log(`\n🗺️  Programs with coordinates: ${withCoords}`);
}

// Run if called directly
syncGeocode()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
