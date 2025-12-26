// Results page types - shared across results components

export interface EligibilityCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'blocker' | 'warning' | 'info';
}

export interface Program {
  id: string;
  name: string;
  provider: string;
  type: string;
  description: string | null;
  waitlistStatus: string;
  targetPopulation: string;
  incomeLimitPctAmi: number | null;
  websiteUrl: string | null;
  applicationUrl: string | null;
  contactPhone: string | null;
  neighborhood: string | null;
}

export interface MatchResult {
  program: Program;
  eligibility: {
    isEligible: boolean;
    score: number;
    checks: EligibilityCheck[];
  };
}

export interface MatchResponse {
  matches: MatchResult[];
  summary: {
    total: number;
    eligible: number;
    openWaitlists: number;
  };
}

export type FilterType = 'all' | 'eligible' | 'open';
