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
import { z } from 'zod';
declare const DiscoveredSourcesSchema: z.ZodObject<{
    sources: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        filename: z.ZodString;
        description: z.ZodString;
        dataType: z.ZodEnum<{
            other: "other";
            waitlist_properties: "waitlist_properties";
            waitlist_totals: "waitlist_totals";
            leasing_outcomes: "leasing_outcomes";
        }>;
        quarter: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DiscoveredSources = z.infer<typeof DiscoveredSourcesSchema>;
export declare function discoverDataSources(): Promise<DiscoveredSources | null>;
declare const DataAnalysisSchema: z.ZodObject<{
    sheets: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        isDataSheet: z.ZodBoolean;
        description: z.ZodString;
        columns: z.ZodOptional<z.ZodArray<z.ZodObject<{
            originalName: z.ZodString;
            semanticMeaning: z.ZodString;
            mapsTo: z.ZodEnum<{
                other: "other";
                address: "address";
                property_code: "property_code";
                property_name: "property_name";
                waitlist_name: "waitlist_name";
                waitlist_code: "waitlist_code";
                program_type: "program_type";
                target_population: "target_population";
                applicant_count: "applicant_count";
                contact_phone: "contact_phone";
                status: "status";
                ignore: "ignore";
            }>;
        }, z.core.$strip>>>;
        rowCount: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    recommendations: z.ZodString;
}, z.core.$strip>;
export type DataAnalysis = z.infer<typeof DataAnalysisSchema>;
export declare function analyzeDataStructure(buffer: Buffer, filename: string): Promise<DataAnalysis | null>;
declare const ExtractedDataSchema: z.ZodObject<{
    properties: z.ZodArray<z.ZodObject<{
        propertyCode: z.ZodOptional<z.ZodString>;
        propertyName: z.ZodOptional<z.ZodString>;
        waitlistName: z.ZodOptional<z.ZodString>;
        waitlistCode: z.ZodOptional<z.ZodString>;
        programType: z.ZodOptional<z.ZodString>;
        targetPopulation: z.ZodOptional<z.ZodString>;
        applicantCount: z.ZodOptional<z.ZodNumber>;
        address: z.ZodOptional<z.ZodString>;
        contactPhone: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        additionalInfo: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    extractionNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExtractedData = z.infer<typeof ExtractedDataSchema>;
/**
 * Extract housing data using the column mappings from analysis phase
 * This is done programmatically - Claude already told us which columns map to which fields
 */
export declare function extractHousingData(buffer: Buffer, analysis: DataAnalysis): Promise<ExtractedData | null>;
declare const ValidationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    totalRecords: z.ZodNumber;
    validRecords: z.ZodNumber;
    issues: z.ZodArray<z.ZodObject<{
        severity: z.ZodEnum<{
            info: "info";
            error: "error";
            warning: "warning";
        }>;
        message: z.ZodString;
        affectedRecords: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    cleanedProperties: z.ZodArray<z.ZodObject<{
        propertyCode: z.ZodOptional<z.ZodString>;
        propertyName: z.ZodOptional<z.ZodString>;
        waitlistName: z.ZodString;
        waitlistCode: z.ZodOptional<z.ZodString>;
        programType: z.ZodOptional<z.ZodString>;
        targetPopulation: z.ZodOptional<z.ZodString>;
        applicantCount: z.ZodOptional<z.ZodNumber>;
        address: z.ZodOptional<z.ZodString>;
        contactPhone: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    summary: z.ZodString;
}, z.core.$strip>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export declare function validateExtraction(extracted: ExtractedData): Promise<ValidationResult | null>;
export interface CachedData {
    sources: DiscoveredSources;
    timestamp: string;
}
export declare function loadCache(): CachedData | null;
export declare function saveCache(sources: DiscoveredSources): void;
export declare function runAutonomousAgent(): Promise<ValidationResult | null>;
export {};
//# sourceMappingURL=cha-agent.d.ts.map