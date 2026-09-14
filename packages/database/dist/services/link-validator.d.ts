/**
 * Smart Link Validation Service
 *
 * Validates URLs are not only reachable but also contextually correct.
 * Uses LLM to analyze page content and determine if URLs match their purpose.
 */
import { z } from 'zod';
declare const LinkValidationSchema: z.ZodObject<{
    isReachable: z.ZodBoolean;
    isRelevant: z.ZodBoolean;
    confidence: z.ZodNumber;
    issue: z.ZodNullable<z.ZodString>;
    suggestion: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type LinkValidationResult = z.infer<typeof LinkValidationSchema>;
interface UrlToValidate {
    url: string;
    expectedPurpose: 'application' | 'website' | 'contact';
    programName: string;
    provider: string;
}
/**
 * Validate a single URL with smart analysis
 */
export declare function validateUrl(urlInfo: UrlToValidate): Promise<LinkValidationResult>;
/**
 * Quick validation (HTTP check only, no LLM)
 */
export declare function quickValidateUrl(url: string): Promise<{
    valid: boolean;
    status?: number;
    error?: string;
}>;
export { LinkValidationResult, UrlToValidate };
//# sourceMappingURL=link-validator.d.ts.map