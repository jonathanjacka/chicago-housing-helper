/**
 * Autonomous CHA Agent
 * 
 * A mission-driven agent that understands the goal of helping Chicago residents
 * find housing, and autonomously extracts data from CHA sources.
 * 
 * 4-Phase Flow:
 * 1. Discovery - Find data sources from CHA website
 * 2. Analysis - Understand XLS structure and content 
 * 3. Extraction - Extract all relevant housing data
 * 4. Validation - Quality check before saving
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const CHA_WAITLIST_URL = 'https://www.thecha.org/transparency-action-cha-data-impact-hub/waitlist';
const CACHE_FILE = path.join(__dirname, '../data/cha-cache.json');

// ============================================================================
// MISSION CONTEXT - Shared across all agent phases
// ============================================================================

const MISSION_CONTEXT = `
You are a data extraction agent for Chicago Housing Helper, an application that 
helps low-income Chicago residents find affordable housing options.

YOUR MISSION: Extract housing program data from the Chicago Housing Authority (CHA)
so residents can easily discover what programs they're eligible for.

DATA WE NEED (but you may find more valuable data):
- Properties/developments with active waitlists
- Target populations (seniors, families, disabled, veterans, etc.)
- Program types (Public Housing, Project-Based Vouchers, HCV, etc.)
- Waitlist names and codes
- Any eligibility requirements or restrictions
- Contact information
- Application links or instructions

BE CREATIVE: If you find valuable data we didn't explicitly ask for, include it.
If the format changes from what you expect, adapt and do your best.
If something seems wrong or unusual, flag it in your response.

SUCCESS = Residents can answer: "What housing programs am I eligible for?"
`.trim();

// ============================================================================
// PHASE 1: DISCOVERY - Find data sources
// ============================================================================

const DiscoveredSourcesSchema = z.object({
  sources: z.array(z.object({
    url: z.string().describe('Full URL to the data file'),
    filename: z.string().describe('The filename'),
    description: z.string().describe('What data this file likely contains'),
    dataType: z.enum(['waitlist_properties', 'waitlist_totals', 'leasing_outcomes', 'other']),
    quarter: z.string().optional().describe('The data period, e.g., "2025 Q2"'),
  })),
  notes: z.string().optional().describe('Any observations about the data sources'),
});

export type DiscoveredSources = z.infer<typeof DiscoveredSourcesSchema>;

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function discoverDataSources(): Promise<DiscoveredSources | null> {
  console.log('   🔍 Phase 1: Discovering data sources...');

  const html = await fetchHtml(CHA_WAITLIST_URL);
  if (!html) {
    console.error('   ❌ Could not fetch CHA website');
    return null;
  }

  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: DiscoveredSourcesSchema,
      prompt: `${MISSION_CONTEXT}

---

PHASE 1: DISCOVERY

You are looking at the Chicago Housing Authority's waitlist data page.
Find ALL data files (XLS, XLSX, CSV) that could contain housing program information.

For each file found:
- Extract the full URL
- Describe what data it likely contains
- Identify the time period (quarter/year)

Focus on the LATEST data files (most recent quarter).

HTML CONTENT:
${html.slice(0, 60000)}`,
    });

    console.log(`   ✅ Found ${object.sources.length} data sources`);
    if (object.notes) console.log(`   📝 ${object.notes}`);

    return object;
  } catch (error) {
    console.error('   ❌ Discovery failed:', error);
    return null;
  }
}

// ============================================================================
// PHASE 2: ANALYSIS - Understand data structure
// ============================================================================

const DataAnalysisSchema = z.object({
  sheets: z.array(z.object({
    name: z.string(),
    isDataSheet: z.boolean().describe('True if this sheet contains actual data rows'),
    description: z.string(),
    columns: z.array(z.object({
      originalName: z.string(),
      semanticMeaning: z.string().describe('What this column represents'),
      mapsTo: z.enum([
        'property_code', 'property_name', 'waitlist_name', 'waitlist_code',
        'program_type', 'target_population', 'applicant_count',
        'address', 'contact_phone', 'status', 'other', 'ignore'
      ]),
    })).optional(),
    rowCount: z.number().optional(),
  })),
  recommendations: z.string().describe('Which sheets to extract data from and how'),
});

export type DataAnalysis = z.infer<typeof DataAnalysisSchema>;

async function downloadFile(url: string): Promise<Buffer | null> {
  // Resolve relative URLs to absolute
  const absoluteUrl = url.startsWith('http') ? url : `https://www.thecha.org${url.startsWith('/') ? '' : '/'}${url}`;

  try {
    console.log(`   📥 Downloading: ${absoluteUrl.split('/').pop()}`);
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`   ❌ Download error:`, error);
    return null;
  }
}

function xlsToSummary(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const summary: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { header: 1 });

    summary.push(`\n## Sheet: "${sheetName}" (${rows.length} rows)`);

    // First row (likely headers)
    if (rows[0]) {
      summary.push(`Headers: ${JSON.stringify(rows[0])}`);
    }

    // Sample data rows (skip header, take first 5)
    const sampleRows = rows.slice(1, 6);
    if (sampleRows.length > 0) {
      summary.push(`Sample data (first ${sampleRows.length} rows):`);
      sampleRows.forEach((row, i) => {
        summary.push(`  Row ${i + 1}: ${JSON.stringify(row)}`);
      });
    }
  }

  return summary.join('\n');
}

export async function analyzeDataStructure(buffer: Buffer, filename: string): Promise<DataAnalysis | null> {
  console.log(`   🔬 Phase 2: Analyzing structure of ${filename}...`);

  const summary = xlsToSummary(buffer);

  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: DataAnalysisSchema,
      prompt: `${MISSION_CONTEXT}

---

PHASE 2: ANALYSIS

You downloaded a file from CHA: "${filename}"
Below is the structure and sample data from this Excel file.

Analyze each sheet and determine:
1. Is it a data sheet or metadata/readme?
2. What columns exist and what do they mean?
3. How do columns map to our mission (property info, waitlists, etc.)?

FILE CONTENTS:
${summary}`,
    });

    const dataSheets = object.sheets.filter(s => s.isDataSheet);
    console.log(`   ✅ Found ${dataSheets.length} data sheet(s)`);

    return object;
  } catch (error) {
    console.error('   ❌ Analysis failed:', error);
    return null;
  }
}

// ============================================================================
// PHASE 3: EXTRACTION - Extract housing data
// ============================================================================

const ExtractedDataSchema = z.object({
  properties: z.array(z.object({
    propertyCode: z.string().optional(),
    propertyName: z.string().optional(),
    waitlistName: z.string().optional(),
    waitlistCode: z.string().optional(),
    programType: z.string().optional(),
    targetPopulation: z.string().optional(),
    applicantCount: z.number().optional(),
    address: z.string().optional(),
    contactPhone: z.string().optional(),
    status: z.string().optional(),
    additionalInfo: z.string().optional().describe('Any other valuable data as a JSON string'),
  })),
  extractionNotes: z.string().optional().describe('Any issues or observations during extraction'),
});

export type ExtractedData = z.infer<typeof ExtractedDataSchema>;

/**
 * Extract housing data using the column mappings from analysis phase
 * This is done programmatically - Claude already told us which columns map to which fields
 */
export async function extractHousingData(buffer: Buffer, analysis: DataAnalysis): Promise<ExtractedData | null> {
  console.log('   📊 Phase 3: Extracting housing data (using column mappings)...');

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const properties: ExtractedData['properties'] = [];

  for (const sheetInfo of analysis.sheets.filter(s => s.isDataSheet)) {
    const sheet = workbook.Sheets[sheetInfo.name];
    if (!sheet || !sheetInfo.columns) continue;

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    // Build column mapping from analysis
    const columnMap: Record<string, string> = {};
    for (const col of sheetInfo.columns) {
      if (col.mapsTo !== 'ignore' && col.mapsTo !== 'other') {
        columnMap[col.mapsTo] = col.originalName;
      }
    }

    console.log(`   📋 Processing ${rows.length} rows from "${sheetInfo.name}"`);

    for (const row of rows) {
      const getValue = (field: string): string | undefined => {
        const colName = columnMap[field];
        if (!colName) return undefined;
        const val = row[colName];
        return val !== undefined && val !== null ? String(val).trim() : undefined;
      };

      const getNumber = (field: string): number | undefined => {
        const val = getValue(field);
        if (!val) return undefined;
        const num = parseInt(val.replace(/[^\d]/g, ''), 10);
        return isNaN(num) ? undefined : num;
      };

      const property = {
        propertyCode: getValue('property_code'),
        propertyName: getValue('property_name'),
        waitlistName: getValue('waitlist_name'),
        waitlistCode: getValue('waitlist_code'),
        programType: getValue('program_type'),
        targetPopulation: getValue('target_population'),
        applicantCount: getNumber('applicant_count'),
        address: getValue('address'),
        contactPhone: getValue('contact_phone'),
        status: getValue('status'),
      };

      // Only add if we have at least a waitlist name or property name
      if (property.waitlistName || property.propertyName) {
        properties.push(property);
      }
    }
  }

  console.log(`   ✅ Extracted ${properties.length} property records`);

  return {
    properties,
    extractionNotes: `Extracted ${properties.length} records using column mappings from analysis phase`,
  };
}

// ============================================================================
// PHASE 4: VALIDATION - Quality check
// ============================================================================

const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  totalRecords: z.number(),
  validRecords: z.number(),
  issues: z.array(z.object({
    severity: z.enum(['error', 'warning', 'info']),
    message: z.string(),
    affectedRecords: z.number().optional(),
  })),
  cleanedProperties: z.array(z.object({
    propertyCode: z.string().optional(),
    propertyName: z.string().optional(),
    waitlistName: z.string(),
    waitlistCode: z.string().optional(),
    programType: z.string().optional(),
    targetPopulation: z.string().optional(),
    applicantCount: z.number().optional(),
  })),
  summary: z.string(),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export async function validateExtraction(extracted: ExtractedData): Promise<ValidationResult | null> {
  console.log('   ✅ Phase 4: Validating extracted data...');

  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: ValidationResultSchema,
      prompt: `${MISSION_CONTEXT}

---

PHASE 4: VALIDATION

Review the extracted data for quality issues:
1. Are there duplicates?
2. Are required fields (waitlistName) present?
3. Do values look reasonable?
4. Any obvious data problems?

Clean the data:
- Remove duplicates
- Drop records missing essential data
- Standardize values where possible

EXTRACTED DATA:
${JSON.stringify(extracted.properties, null, 2).slice(0, 80000)}`,
    });

    console.log(`   ✅ Validation complete: ${object.validRecords}/${object.totalRecords} valid`);
    object.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`   ${icon} ${issue.message}`);
    });

    return object;
  } catch (error) {
    console.error('   ❌ Validation failed:', error);
    return null;
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

export interface CachedData {
  sources: DiscoveredSources;
  timestamp: string;
}

export function loadCache(): CachedData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch { }
  return null;
}

export function saveCache(sources: DiscoveredSources): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ sources, timestamp: new Date().toISOString() }, null, 2));
    console.log('   💾 Cached discovery results');
  } catch { }
}

// ============================================================================
// MAIN AGENT RUNNER
// ============================================================================

export async function runAutonomousAgent(): Promise<ValidationResult | null> {
  console.log('\n🤖 Starting Autonomous CHA Agent...\n');

  // Phase 1: Discovery
  let sources = await discoverDataSources();

  if (!sources || sources.sources.length === 0) {
    console.log('   ⚠️ No sources found, trying cache...');
    const cached = loadCache();
    sources = cached?.sources || null;
  }

  if (!sources || sources.sources.length === 0) {
    console.log('   ❌ No data sources available');
    return null;
  }

  saveCache(sources);

  // Find the main waitlist file
  const mainSource = sources.sources.find(s => s.dataType === 'waitlist_properties') || sources.sources[0];

  // Download the file
  const buffer = await downloadFile(mainSource.url);
  if (!buffer) {
    console.log(`   ❌ Failed to download ${mainSource.filename}`);
    return null;
  }

  // Phase 2: Analysis
  const analysis = await analyzeDataStructure(buffer, mainSource.filename);
  if (!analysis) {
    console.log('   ❌ Analysis failed');
    return null;
  }

  // Phase 3: Extraction
  const extracted = await extractHousingData(buffer, analysis);
  if (!extracted) {
    console.log('   ❌ Extraction failed');
    return null;
  }

  // Phase 4: Validation
  const validated = await validateExtraction(extracted);

  return validated;
}
