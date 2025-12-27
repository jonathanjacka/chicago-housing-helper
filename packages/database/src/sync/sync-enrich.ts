/**
 * Enrichment Sync Script
 * 
 * Runs LLM enrichment for programs missing contact/application info.
 * Only enriches programs that haven't been enriched yet.
 */

import { runEnrichment } from '../services/enrichment-agent';
import { prisma } from '../index';

async function main() {
  // Get current stats
  const total = await prisma.program.count();
  const enriched = await prisma.program.count({ where: { enrichedAt: { not: null } } });
  const needsEnrichment = total - enriched;

  console.log('🤖 Program Enrichment via LLM\n');
  console.log(`   Total programs: ${total}`);
  console.log(`   Already enriched: ${enriched}`);
  console.log(`   Needs enrichment: ${needsEnrichment}`);
  console.log('');

  if (needsEnrichment === 0) {
    console.log('✅ All programs are already enriched!\n');
    console.log('   Use --force to re-enrich all programs.');
    return;
  }

  // Parse command line args
  const args = process.argv.slice(2);
  const forceAll = args.includes('--force');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

  if (limit) {
    console.log(`   Limiting to ${limit} programs\n`);
  }

  await runEnrichment({ limit, forceAll });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
