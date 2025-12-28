/**
 * LLM Enrichment Agent - research and fill missing contact/application info for housing programs.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { prisma } from '../index';

const EnrichmentSchema = z.object({
  websiteUrl: z.string().url().nullable().describe('Official website URL for the property or program'),
  applicationUrl: z.string().url().nullable().describe('Direct link to application or waitlist signup'),
  contactPhone: z.string().nullable().describe('Contact phone number'),
  contactEmail: z.string().email().nullable().describe('Contact email address'),
  notes: z.string().nullable().describe('Any additional helpful information found'),
});

type EnrichmentResult = z.infer<typeof EnrichmentSchema>;

interface ProgramToEnrich {
  id: string;
  name: string;
  provider: string;
  type: string;
  address: string | null;
  neighborhood: string | null;
}

/**
 * Enrich a single program using Claude
 */
async function enrichProgram(program: ProgramToEnrich): Promise<EnrichmentResult | null> {
  const prompt = `You are researching Chicago affordable housing programs to help residents find housing.

Program Information:
- Name: ${program.name}
- Provider: ${program.provider}
- Type: ${program.type}
- Address: ${program.address || 'Unknown'}
- Neighborhood: ${program.neighborhood || 'Unknown'}

Your task: Find official contact and APPLICATION information for this property or program.

IMPORTANT: Finding an application URL is the TOP PRIORITY. Many residents need to know exactly where to apply.

Research guidelines for APPLICATION URLs:
1. Search for the exact property name + "apply" or "application"
2. Look for property management portals:
   - RentCafe (apply.rentcafe.com, [property].rentcafe.com)
   - AffordableHousing.com listings
   - Yardi/RealPage portals
   - ApplyOnline247.com
3. For CHA programs:
   - Check thecha.org/residents for waitlist info
   - Many CHA properties use centralized waitlists
4. For LIHTC/affordable properties:
   - Often managed by companies like Related, Evergreen, Hispanic Housing
   - Search "[property name] Chicago apartments apply"
5. If no direct application link exists:
   - Note in the 'notes' field: "Applications accepted by phone/in-person only"

Research guidelines for WEBSITE URLs:
1. For CHA programs, check thecha.org for the specific program page
2. For City of Chicago programs, check chicago.gov/housing
3. For specific properties, search for the property name + "Chicago apartments"
4. Property management company websites are acceptable

Contact information:
1. Look for leasing office phone numbers
2. Property management company contact info
3. Email addresses if available

Only return URLs that are likely to still work (official sites, established property management companies).
If you truly cannot find specific info after thorough research, return null for that field.`;

  try {
    const result = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: EnrichmentSchema,
      prompt,
    });

    return result.object;
  } catch (error) {
    console.error(`Error enriching ${program.name}:`, error);
    return null;
  }
}

/**
 * Get default enrichment based on provider
 */
function getDefaultEnrichment(provider: string): Partial<EnrichmentResult> {
  const defaults: Record<string, Partial<EnrichmentResult>> = {
    'Chicago Housing Authority': {
      websiteUrl: 'https://www.thecha.org',
      applicationUrl: 'https://www.thecha.org/residents',
      contactPhone: '(312) 742-8500',
    },
    'City of Chicago': {
      websiteUrl: 'https://www.chicago.gov/city/en/depts/doh.html',
      contactPhone: '311',
    },
  };

  return defaults[provider] || {};
}

/**
 * Run enrichment for all programs that need it
 */
export async function runEnrichment(options: { limit?: number; forceAll?: boolean } = {}) {
  const { limit, forceAll = false } = options;

  console.log('🤖 Starting LLM Enrichment Agent...\n');

  // Find programs that need enrichment
  const whereClause = forceAll
    ? {}
    : {
      enrichedAt: null,
      OR: [
        { websiteUrl: null },
        { applicationUrl: null },
      ],
    };

  let programsToEnrich = await prisma.program.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      provider: true,
      type: true,
      address: true,
      neighborhood: true,
    },
    take: limit,
  });

  console.log(`   Found ${programsToEnrich.length} programs to enrich\n`);

  if (programsToEnrich.length === 0) {
    console.log('   ✅ All programs already enriched!\n');
    return;
  }

  let enriched = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < programsToEnrich.length; i++) {
    const program = programsToEnrich[i];

    // Progress indicator
    const progress = Math.round((i + 1) / programsToEnrich.length * 100);
    process.stdout.write(`\r   [${progress}%] Enriching ${i + 1}/${programsToEnrich.length}: ${program.name.substring(0, 40)}...`);

    try {
      // Try LLM enrichment
      const result = await enrichProgram(program);

      if (result) {
        // Merge with defaults for fallback
        const defaults = getDefaultEnrichment(program.provider);

        await prisma.program.update({
          where: { id: program.id },
          data: {
            websiteUrl: result.websiteUrl || defaults.websiteUrl || undefined,
            applicationUrl: result.applicationUrl || defaults.applicationUrl || undefined,
            contactPhone: result.contactPhone || defaults.contactPhone || undefined,
            contactEmail: result.contactEmail || undefined,
            notes: result.notes || undefined,
            enrichedAt: new Date(),
          },
        });
        enriched++;
      } else {
        // Fall back to defaults only
        const defaults = getDefaultEnrichment(program.provider);
        if (Object.keys(defaults).length > 0) {
          await prisma.program.update({
            where: { id: program.id },
            data: {
              ...defaults,
              enrichedAt: new Date(),
            },
          });
          skipped++;
        } else {
          failed++;
        }
      }

      // Rate limit to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`\n   ❌ Error enriching ${program.name}:`, error);
      failed++;
    }
  }

  console.log(`\n\n📊 Enrichment Complete:`);
  console.log(`   ✅ LLM Enriched: ${enriched}`);
  console.log(`   📋 Defaults Applied: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);

  // Show stats
  const withWebsite = await prisma.program.count({
    where: { websiteUrl: { not: null } },
  });
  const withAppUrl = await prisma.program.count({
    where: { applicationUrl: { not: null } },
  });
  const totalEnriched = await prisma.program.count({
    where: { enrichedAt: { not: null } },
  });

  console.log(`\n📈 Current Coverage:`);
  console.log(`   Programs enriched: ${totalEnriched}`);
  console.log(`   With website: ${withWebsite}`);
  console.log(`   With application URL: ${withAppUrl}`);
}

// Export for use in sync scripts
export { enrichProgram, getDefaultEnrichment };
