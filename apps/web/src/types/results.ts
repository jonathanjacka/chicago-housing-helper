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
  contactEmail: string | null;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  dataSource: string | null;
}

export interface MatchResult {
  program: Program;
  eligibility: {
    isEligible: boolean;
    score: number;
    checks: EligibilityCheck[];
  };
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface MatchFilters {
  eligibility?: 'all' | 'eligible' | 'open';
  neighborhood?: string;
  programType?: string;
  search?: string;
}

export interface MatchResponse {
  matches: MatchResult[];
  pagination: PaginationInfo;
  summary: {
    total: number;
    eligible: number;
    openWaitlists: number;
  };
  availableFilters: {
    neighborhoods: string[];
    programTypes: string[];
  };
}

export type FilterType = 'all' | 'eligible' | 'open';
