/**
 * Smart Link Validation Service
 * 
 * Validates URLs are not only reachable but also contextually correct.
 * Uses LLM to analyze page content and determine if URLs match their purpose.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

// Schema for link validation results
const LinkValidationSchema = z.object({
  isReachable: z.boolean().describe('Whether the URL returned a successful HTTP response'),
  isRelevant: z.boolean().describe('Whether the page content matches the expected purpose'),
  confidence: z.number().min(0).max(100).describe('Confidence score 0-100'),
  issue: z.string().nullable().describe('Description of any issue found'),
  suggestion: z.string().nullable().describe('Suggested action or replacement URL'),
});

type LinkValidationResult = z.infer<typeof LinkValidationSchema>;

interface UrlToValidate {
  url: string;
  expectedPurpose: 'application' | 'website' | 'contact';
  programName: string;
  provider: string;
}

/**
 * Basic HTTP check - is the URL reachable?
 */
async function checkUrlReachable(url: string): Promise<{ reachable: boolean; status?: number; error?: string }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    return { reachable: response.ok, status: response.status };
  } catch (error) {
    // Try GET if HEAD fails (some servers don't support HEAD)
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      });
      return { reachable: response.ok, status: response.status };
    } catch (getError) {
      return {
        reachable: false,
        error: getError instanceof Error ? getError.message : 'Unknown error'
      };
    }
  }
}

/**
 * Fetch page content for LLM analysis
 */
async function fetchPageContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ChicagoHousingHelper/1.0)',
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract meaningful text content (strip HTML, limit length)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000); // Limit to ~3000 chars

    return textContent;
  } catch {
    return null;
  }
}

/**
 * Use LLM to analyze if page content matches expected purpose
 */
async function analyzePageRelevance(
  urlInfo: UrlToValidate,
  pageContent: string
): Promise<LinkValidationResult> {
  const purposeDescriptions = {
    application: 'an application form, waitlist signup, or housing application page',
    website: 'the official website or information page for this housing program or property',
    contact: 'a contact page with phone numbers, email addresses, or contact forms',
  };

  const prompt = `You are validating a link for a Chicago affordable housing program.

Program: ${urlInfo.programName}
Provider: ${urlInfo.provider}
URL: ${urlInfo.url}
Expected Purpose: This link should be ${purposeDescriptions[urlInfo.expectedPurpose]}

Page Content (first 3000 chars):
${pageContent}

Analyze this page and determine:
1. Is this page reachable? (Yes, we got content)
2. Does the page content match the expected purpose?
   - For "application": Look for application forms, "apply now", waitlist signup, eligibility questionnaires
   - For "website": Look for information about the specific property or program, not just a generic homepage
   - For "contact": Look for contact information, phone numbers, email addresses
3. What's your confidence level?
4. If there's an issue, describe it
5. If you have a suggestion for a better URL or action, provide it`;

  try {
    const result = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: LinkValidationSchema,
      prompt,
    });

    return result.object;
  } catch (error) {
    return {
      isReachable: true,
      isRelevant: false,
      confidence: 0,
      issue: `LLM analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      suggestion: null,
    };
  }
}

/**
 * Validate a single URL with smart analysis
 */
export async function validateUrl(urlInfo: UrlToValidate): Promise<LinkValidationResult> {
  // Step 1: Basic reachability check
  const reachabilityCheck = await checkUrlReachable(urlInfo.url);

  if (!reachabilityCheck.reachable) {
    return {
      isReachable: false,
      isRelevant: false,
      confidence: 100,
      issue: `URL not reachable: ${reachabilityCheck.error || `HTTP ${reachabilityCheck.status}`}`,
      suggestion: 'Remove this URL and re-enrich the program',
    };
  }

  // Step 2: Fetch page content
  const pageContent = await fetchPageContent(urlInfo.url);

  if (!pageContent) {
    return {
      isReachable: true,
      isRelevant: false,
      confidence: 50,
      issue: 'Could not fetch page content for analysis',
      suggestion: 'Manual review recommended',
    };
  }

  // Step 3: LLM analysis of content relevance
  const analysisResult = await analyzePageRelevance(urlInfo, pageContent);

  return analysisResult;
}

/**
 * Quick validation (HTTP check only, no LLM)
 */
export async function quickValidateUrl(url: string): Promise<{ valid: boolean; status?: number; error?: string }> {
  const result = await checkUrlReachable(url);
  return {
    valid: result.reachable,
    status: result.status,
    error: result.error,
  };
}

export { LinkValidationResult, UrlToValidate };
