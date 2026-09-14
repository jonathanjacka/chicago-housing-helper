/**
 * Link Validation Sync Script
 *
 * Validates all URLs in the database:
 * 1. Quick mode (--quick): HTTP checks only
 * 2. Smart mode (default): HTTP + LLM analysis to verify content relevance
 */
import { prisma } from '../index';
import { validateUrl, quickValidateUrl } from '../services/link-validator';
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function runValidation(options) {
    const { quick = false, limit, fix = false } = options;
    console.log(`🔗 Link Validation - ${quick ? 'Quick Mode (HTTP only)' : 'Smart Mode (HTTP + LLM)'}\n`);
    // Find programs with URLs to validate
    const programs = await prisma.program.findMany({
        where: {
            OR: [
                { websiteUrl: { not: null } },
                { applicationUrl: { not: null } },
            ],
        },
        select: {
            id: true,
            name: true,
            provider: true,
            websiteUrl: true,
            applicationUrl: true,
        },
        take: limit,
    });
    console.log(`   Found ${programs.length} programs with URLs to validate\n`);
    const report = [];
    let checked = 0;
    let broken = 0;
    let irrelevant = 0;
    for (const program of programs) {
        const urlsToCheck = [];
        if (program.websiteUrl) {
            urlsToCheck.push({ field: 'websiteUrl', url: program.websiteUrl, purpose: 'website' });
        }
        if (program.applicationUrl) {
            urlsToCheck.push({ field: 'applicationUrl', url: program.applicationUrl, purpose: 'application' });
        }
        for (const { field, url, purpose } of urlsToCheck) {
            checked++;
            const progress = Math.round(checked / (programs.length * 2) * 100);
            process.stdout.write(`\r   [${progress}%] Checking: ${program.name.substring(0, 40)}...`);
            if (quick) {
                // Quick mode: HTTP check only
                const result = await quickValidateUrl(url);
                if (!result.valid) {
                    broken++;
                    report.push({
                        programId: program.id,
                        programName: program.name,
                        field,
                        url,
                        isReachable: false,
                        isRelevant: false,
                        confidence: 100,
                        issue: result.error || `HTTP ${result.status}`,
                        suggestion: 'Remove and re-enrich',
                    });
                    if (fix) {
                        await prisma.program.update({
                            where: { id: program.id },
                            data: { [field]: null, enrichedAt: null },
                        });
                    }
                }
            }
            else {
                // Smart mode: HTTP + LLM analysis
                const urlInfo = {
                    url,
                    expectedPurpose: purpose,
                    programName: program.name,
                    provider: program.provider,
                };
                const result = await validateUrl(urlInfo);
                if (!result.isReachable) {
                    broken++;
                    report.push({
                        programId: program.id,
                        programName: program.name,
                        field,
                        url,
                        ...result,
                    });
                    if (fix) {
                        await prisma.program.update({
                            where: { id: program.id },
                            data: { [field]: null, enrichedAt: null },
                        });
                    }
                }
                else if (!result.isRelevant && result.confidence >= 70) {
                    irrelevant++;
                    report.push({
                        programId: program.id,
                        programName: program.name,
                        field,
                        url,
                        ...result,
                    });
                    if (fix) {
                        await prisma.program.update({
                            where: { id: program.id },
                            data: { [field]: null, enrichedAt: null },
                        });
                    }
                }
                // Rate limit for LLM calls
                await sleep(500);
            }
            // Small delay between HTTP requests
            await sleep(200);
        }
    }
    console.log(`\n\n📊 Validation Complete:`);
    console.log(`   ✅ URLs checked: ${checked}`);
    console.log(`   ❌ Broken (404/error): ${broken}`);
    if (!quick) {
        console.log(`   ⚠️  Irrelevant content: ${irrelevant}`);
    }
    if (report.length > 0) {
        console.log(`\n📋 Issues Found:\n`);
        for (const item of report) {
            console.log(`   ${item.programName}`);
            console.log(`      ${item.field}: ${item.url}`);
            console.log(`      Issue: ${item.issue}`);
            if (item.suggestion) {
                console.log(`      Suggestion: ${item.suggestion}`);
            }
            console.log('');
        }
        if (fix) {
            console.log(`\n🔧 Fixed: Cleared ${report.length} broken URLs and reset enrichedAt for re-processing`);
        }
        else {
            console.log(`\n💡 Run with --fix to clear broken URLs and allow re-enrichment`);
        }
    }
    else {
        console.log(`\n✅ All URLs are valid!`);
    }
}
// Parse command line args
const args = process.argv.slice(2);
const quick = args.includes('--quick');
const fix = args.includes('--fix');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
runValidation({ quick, limit, fix })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
