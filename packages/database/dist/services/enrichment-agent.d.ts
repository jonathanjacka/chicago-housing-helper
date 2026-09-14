/**
 * LLM Enrichment Agent - research and fill missing contact/application info for housing programs.
 */
import { z } from 'zod';
declare const EnrichmentSchema: z.ZodObject<{
    websiteUrl: z.ZodNullable<z.ZodString>;
    applicationUrl: z.ZodNullable<z.ZodString>;
    contactPhone: z.ZodNullable<z.ZodString>;
    contactEmail: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
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
declare function enrichProgram(program: ProgramToEnrich): Promise<EnrichmentResult | null>;
/**
 * Get default enrichment based on provider
 */
declare function getDefaultEnrichment(provider: string): Partial<EnrichmentResult>;
/**
 * Run enrichment for all programs that need it
 */
export declare function runEnrichment(options?: {
    limit?: number;
    forceAll?: boolean;
}): Promise<void>;
export { enrichProgram, getDefaultEnrichment };
//# sourceMappingURL=enrichment-agent.d.ts.map