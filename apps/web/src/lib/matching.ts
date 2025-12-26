import { prisma, Decimal, Program, ProgramType, WaitlistStatus, TargetPopulation } from '@chicago-housing-helper/database';

export interface UserProfile {
  householdSize: number;
  numAdults: number;
  numChildren: number;
  hasSenior: boolean;
  hasDisabled: boolean;
  annualIncome: number;
  hasChaDebt: boolean;
}

export interface MatchResult {
  program: Program;
  eligibility: {
    isEligible: boolean;
    score: number;
    checks: EligibilityCheck[];
  };
}

export interface EligibilityCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'blocker' | 'warning' | 'info';
}

export interface MatchFilters {
  eligibility?: 'all' | 'eligible' | 'open';
  neighborhood?: string;
  programType?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedMatchResult {
  matches: MatchResult[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
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

/**
 * Calculate the user's percentage of Area Median Income
 */
export async function calculateAmiPercentage(
  householdSize: number,
  annualIncome: number
): Promise<number> {
  const amiLimit = await prisma.amiLimit.findFirst({
    where: {
      householdSize: Math.min(householdSize, 8),
    },
    orderBy: { year: 'desc' },
  });

  if (!amiLimit) {
    const estimatedAmi100 = 80000 + (householdSize - 1) * 10000;
    return Math.round((annualIncome / estimatedAmi100) * 100);
  }

  const ami100 = Number(amiLimit.ami100);
  return Math.round((annualIncome / ami100) * 100);
}

/**
 * Get the income limit for a specific AMI percentage and household size
 */
export async function getIncomeLimit(
  householdSize: number,
  amiPercentage: number
): Promise<number> {
  const amiLimit = await prisma.amiLimit.findFirst({
    where: {
      householdSize: Math.min(householdSize, 8),
    },
    orderBy: { year: 'desc' },
  });

  if (!amiLimit) {
    return 0;
  }

  const amiMap: Record<number, Decimal> = {
    30: amiLimit.ami30,
    50: amiLimit.ami50,
    60: amiLimit.ami60,
    80: amiLimit.ami80,
    100: amiLimit.ami100,
  };

  const percentages = [30, 50, 60, 80, 100];
  const closest = percentages.reduce((prev, curr) =>
    Math.abs(curr - amiPercentage) < Math.abs(prev - amiPercentage) ? curr : prev
  );

  return Number(amiMap[closest]);
}

/**
 * Check eligibility for a single program
 */
export async function checkProgramEligibility(
  profile: UserProfile,
  program: Program
): Promise<MatchResult> {
  const checks: EligibilityCheck[] = [];
  let score = 100;

  // 1. Check income eligibility
  if (program.incomeLimitPctAmi) {
    const incomeLimit = await getIncomeLimit(
      profile.householdSize,
      program.incomeLimitPctAmi
    );

    if (profile.annualIncome <= incomeLimit) {
      checks.push({
        name: 'Income',
        passed: true,
        message: `Your income ($${profile.annualIncome.toLocaleString()}) is under the ${program.incomeLimitPctAmi}% AMI limit of $${incomeLimit.toLocaleString()}`,
        severity: 'info',
      });
    } else {
      checks.push({
        name: 'Income',
        passed: false,
        message: `Your income ($${profile.annualIncome.toLocaleString()}) exceeds the ${program.incomeLimitPctAmi}% AMI limit of $${incomeLimit.toLocaleString()}`,
        severity: 'blocker',
      });
      score -= 40;
    }
  }

  // 2. Check household size
  if (
    profile.householdSize >= program.minHouseholdSize &&
    profile.householdSize <= program.maxHouseholdSize
  ) {
    checks.push({
      name: 'Household Size',
      passed: true,
      message: `Your household of ${profile.householdSize} fits the program's unit sizes`,
      severity: 'info',
    });
  } else {
    checks.push({
      name: 'Household Size',
      passed: false,
      message: `This program requires ${program.minHouseholdSize}-${program.maxHouseholdSize} people, but your household has ${profile.householdSize}`,
      severity: 'blocker',
    });
    score -= 30;
  }

  // 3. Check target population
  if (program.targetPopulation === 'ALL') {
    checks.push({
      name: 'Target Population',
      passed: true,
      message: 'This program is open to all eligible households',
      severity: 'info',
    });
  } else if (program.targetPopulation === 'SENIOR' && profile.hasSenior) {
    checks.push({
      name: 'Target Population',
      passed: true,
      message: 'This program is for seniors, and you have a senior in your household',
      severity: 'info',
    });
  } else if (program.targetPopulation === 'SENIOR' && !profile.hasSenior) {
    checks.push({
      name: 'Target Population',
      passed: false,
      message: 'This program is specifically for seniors (62+)',
      severity: 'blocker',
    });
    score -= 50;
  } else if (program.targetPopulation === 'DISABLED' && profile.hasDisabled) {
    checks.push({
      name: 'Target Population',
      passed: true,
      message: 'This program is for people with disabilities, and you qualify',
      severity: 'info',
    });
  } else if (program.targetPopulation === 'DISABLED' && !profile.hasDisabled) {
    checks.push({
      name: 'Target Population',
      passed: false,
      message: 'This program is specifically for people with disabilities',
      severity: 'blocker',
    });
    score -= 50;
  } else if (program.targetPopulation === 'FAMILY') {
    if (profile.numChildren > 0 || profile.householdSize >= 2) {
      checks.push({
        name: 'Target Population',
        passed: true,
        message: 'This program is for families, and you qualify',
        severity: 'info',
      });
    } else {
      checks.push({
        name: 'Target Population',
        passed: false,
        message: 'This program is for families (typically 2+ people or with children)',
        severity: 'warning',
      });
      score -= 20;
    }
  }

  // 4. Check CHA debt
  if (profile.hasChaDebt && (program.provider === 'Chicago Housing Authority' || program.type === 'HCV')) {
    checks.push({
      name: 'CHA Debt',
      passed: false,
      message: 'Outstanding debt to CHA must be paid before qualifying for CHA programs',
      severity: 'blocker',
    });
    score -= 30;
  }

  // 5. Check waitlist status
  if (program.waitlistStatus === 'CLOSED') {
    checks.push({
      name: 'Waitlist Status',
      passed: false,
      message: 'The waitlist for this program is currently closed',
      severity: 'warning',
    });
    score -= 10;
  } else if (program.waitlistStatus === 'OPEN') {
    checks.push({
      name: 'Waitlist Status',
      passed: true,
      message: 'The waitlist for this program is currently open',
      severity: 'info',
    });
  } else if (program.waitlistStatus === 'LOTTERY') {
    checks.push({
      name: 'Waitlist Status',
      passed: true,
      message: 'This program uses a lottery system for applications',
      severity: 'info',
    });
  }

  const hasBlocker = checks.some((c) => !c.passed && c.severity === 'blocker');
  const isEligible = !hasBlocker;

  return {
    program,
    eligibility: {
      isEligible,
      score: Math.max(0, score),
      checks,
    },
  };
}

/**
 * Get available filter options (neighborhoods and program types with data)
 */
export async function getAvailableFilters(): Promise<{ neighborhoods: string[]; programTypes: string[] }> {
  const [neighborhoods, programTypes] = await Promise.all([
    prisma.program.findMany({
      where: { neighborhood: { not: null } },
      select: { neighborhood: true },
      distinct: ['neighborhood'],
    }),
    prisma.program.findMany({
      select: { type: true },
      distinct: ['type'],
    }),
  ]);

  return {
    neighborhoods: neighborhoods
      .map((n) => n.neighborhood)
      .filter((n): n is string => n !== null)
      .sort(),
    programTypes: programTypes.map((p) => p.type).sort(),
  };
}

/**
 * Find matching programs with pagination and filtering
 */
export async function findMatchingPrograms(
  profile: UserProfile,
  filters: MatchFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 20 }
): Promise<PaginatedMatchResult> {
  // Build where clause for filtering
  const where: Record<string, unknown> = {};

  if (filters.neighborhood) {
    where.neighborhood = filters.neighborhood;
  }

  if (filters.programType) {
    where.type = filters.programType;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { address: { contains: filters.search, mode: 'insensitive' } },
      { provider: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Get total count for pagination
  const totalCount = await prisma.program.count({ where });

  // Get all programs (we need to check eligibility for all to filter by eligibility)
  const programs = await prisma.program.findMany({
    where,
    orderBy: [
      { waitlistStatus: 'asc' },
      { name: 'asc' },
    ],
  });

  // Check eligibility for each
  const allResults = await Promise.all(
    programs.map((program) => checkProgramEligibility(profile, program))
  );

  // Apply eligibility filter
  let filteredResults = allResults;
  if (filters.eligibility === 'eligible') {
    filteredResults = allResults.filter((m) => m.eligibility.isEligible);
  } else if (filters.eligibility === 'open') {
    filteredResults = allResults.filter(
      (m) => m.eligibility.isEligible && m.program.waitlistStatus === 'OPEN'
    );
  }

  // Sort by eligibility score
  filteredResults.sort((a, b) => {
    if (a.eligibility.isEligible && !b.eligibility.isEligible) return -1;
    if (!a.eligibility.isEligible && b.eligibility.isEligible) return 1;
    return b.eligibility.score - a.eligibility.score;
  });

  // Calculate summary from filtered results
  const summary = {
    total: filteredResults.length,
    eligible: filteredResults.filter((m) => m.eligibility.isEligible).length,
    openWaitlists: filteredResults.filter(
      (m) => m.eligibility.isEligible && m.program.waitlistStatus === 'OPEN'
    ).length,
  };

  // Paginate
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedMatches = filteredResults.slice(startIndex, startIndex + pagination.pageSize);
  const totalPages = Math.ceil(filteredResults.length / pagination.pageSize);

  // Get available filters
  const availableFilters = await getAvailableFilters();

  return {
    matches: paginatedMatches,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
      totalCount: filteredResults.length,
    },
    summary,
    availableFilters,
  };
}
