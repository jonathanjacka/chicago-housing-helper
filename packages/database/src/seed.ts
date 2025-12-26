import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed 2024 AMI limits for Chicago metro area (Cook County)
  // Source: HUD FY 2024 Income Limits
  const amiLimits2024 = [
    { householdSize: 1, ami100: 82200, ami80: 62000, ami60: 46500, ami50: 38750, ami30: 23250 },
    { householdSize: 2, ami100: 93950, ami80: 70850, ami60: 53100, ami50: 44300, ami30: 26600 },
    { householdSize: 3, ami100: 105700, ami80: 79700, ami60: 59775, ami50: 49850, ami30: 29900 },
    { householdSize: 4, ami100: 117400, ami80: 88550, ami60: 66375, ami50: 55350, ami30: 33200 },
    { householdSize: 5, ami100: 126800, ami80: 95650, ami60: 71700, ami50: 59800, ami30: 35900 },
    { householdSize: 6, ami100: 136200, ami80: 102750, ami60: 77025, ami50: 64250, ami30: 38550 },
    { householdSize: 7, ami100: 145600, ami80: 109850, ami60: 82350, ami50: 68700, ami30: 41200 },
    { householdSize: 8, ami100: 155000, ami80: 116900, ami60: 87675, ami50: 73100, ami30: 43850 },
  ];

  for (const limit of amiLimits2024) {
    await prisma.amiLimit.upsert({
      where: { year_householdSize: { year: 2024, householdSize: limit.householdSize } },
      update: limit,
      create: { year: 2024, ...limit },
    });
  }
  console.log('✅ AMI limits seeded');

  // Seed sample housing programs
  const programs = [
    // CHA Programs
    {
      name: 'Housing Choice Voucher (Section 8)',
      provider: 'Chicago Housing Authority',
      type: 'HCV' as const,
      description: 'Tenant-based rental assistance allowing families to choose housing in the private market.',
      waitlistStatus: 'CLOSED' as const,
      targetPopulation: 'ALL' as const,
      incomeLimitPctAmi: 50,
      websiteUrl: 'https://www.thecha.org/residents/housing-choice-voucher-hcv',
      applicationUrl: 'https://www.thecha.org/apply',
      dataSource: 'CHA Website',
    },
    {
      name: 'Public Housing - Family Properties',
      provider: 'Chicago Housing Authority',
      type: 'PUBLIC_HOUSING' as const,
      description: 'Affordable rental housing owned and operated by CHA for low-income families.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'FAMILY' as const,
      incomeLimitPctAmi: 80,
      websiteUrl: 'https://www.thecha.org/residents/public-housing',
      applicationUrl: 'https://www.thecha.org/apply',
      dataSource: 'CHA Website',
    },
    {
      name: 'Public Housing - Senior Properties',
      provider: 'Chicago Housing Authority',
      type: 'PUBLIC_HOUSING' as const,
      description: 'Affordable rental housing for seniors 62 years and older.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'SENIOR' as const,
      incomeLimitPctAmi: 80,
      minHouseholdSize: 1,
      maxHouseholdSize: 2,
      websiteUrl: 'https://www.thecha.org/residents/public-housing',
      applicationUrl: 'https://www.thecha.org/apply',
      dataSource: 'CHA Website',
    },
    // ARO Programs
    {
      name: 'Affordable Requirements Ordinance (ARO) Units',
      provider: 'City of Chicago',
      type: 'ARO' as const,
      description: 'Affordable units in new developments required by city ordinance.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'ALL' as const,
      incomeLimitPctAmi: 60,
      websiteUrl: 'https://www.chicago.gov/city/en/depts/doh/provdrs/developers/svcs/affordable-requirements-ordinance.html',
      dataSource: 'Chicago.gov',
    },
    // Non-profit housing
    {
      name: 'The Resurrection Project - Family Housing',
      provider: 'The Resurrection Project',
      type: 'OTHER' as const,
      description: 'Affordable family housing in Pilsen and Little Village neighborhoods.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'FAMILY' as const,
      incomeLimitPctAmi: 60,
      neighborhood: 'Pilsen',
      websiteUrl: 'https://resurrectionproject.org',
      contactPhone: '(312) 666-1323',
      dataSource: 'Manual Entry',
    },
    {
      name: 'Bickerdike Redevelopment Corporation',
      provider: 'Bickerdike Redevelopment Corporation',
      type: 'OTHER' as const,
      description: 'Affordable housing in West Town, Humboldt Park, and Logan Square.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'ALL' as const,
      incomeLimitPctAmi: 60,
      neighborhood: 'Humboldt Park',
      websiteUrl: 'https://www.bickerdike.org',
      contactPhone: '(773) 278-4232',
      dataSource: 'Manual Entry',
    },
    {
      name: 'Hispanic Housing Development Corporation',
      provider: 'Hispanic Housing Development Corporation',
      type: 'OTHER' as const,
      description: 'Affordable housing serving Latino families across Chicago.',
      waitlistStatus: 'OPEN' as const,
      targetPopulation: 'FAMILY' as const,
      incomeLimitPctAmi: 60,
      websiteUrl: 'https://hispanichousingdevelopment.org',
      contactPhone: '(773) 638-1283',
      dataSource: 'Manual Entry',
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { id: program.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      update: program,
      create: {
        id: program.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...program,
        lastSynced: new Date(),
      },
    });
  }
  console.log('✅ Programs seeded');

  // Seed document requirements
  console.log('📄 Seeding document requirements...');

  const documentRequirements = [
    // Income Documents
    {
      id: 'pay-stubs',
      name: 'Pay Stubs (3-6 months)',
      description: 'Most recent pay stubs showing employer name, pay period, and gross income. Need 3-6 months depending on program.',
      category: 'INCOME' as const,
      validityDays: 90,
      isRequired: true,
      sortOrder: 1,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER'] as const,
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements (3 months)',
      description: 'Statements from all checking, savings, and investment accounts for the past 3 months.',
      category: 'INCOME' as const,
      validityDays: 90,
      isRequired: true,
      sortOrder: 2,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER'] as const,
    },
    {
      id: 'tax-returns',
      name: 'Tax Returns (2 years)',
      description: 'Complete federal tax returns including all schedules for the past 2 years.',
      category: 'INCOME' as const,
      validityDays: 365,
      isRequired: true,
      sortOrder: 3,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA'] as const,
    },
    {
      id: 'benefit-letters',
      name: 'Benefit Award Letters',
      description: 'Current award letters for SSI, SSDI, TANF, unemployment, or other benefits.',
      category: 'INCOME' as const,
      validityDays: 365,
      isRequired: false,
      sortOrder: 4,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER'] as const,
    },
    // Identity Documents
    {
      id: 'photo-id',
      name: 'Photo ID',
      description: 'Valid government-issued photo ID (driver\'s license, state ID, or passport) for all adults.',
      category: 'IDENTITY' as const,
      validityDays: null,
      isRequired: true,
      sortOrder: 10,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER'] as const,
    },
    {
      id: 'ssn-cards',
      name: 'Social Security Cards',
      description: 'Social Security cards for all household members.',
      category: 'IDENTITY' as const,
      validityDays: null,
      isRequired: true,
      sortOrder: 11,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA'] as const,
    },
    {
      id: 'birth-certificates',
      name: 'Birth Certificates',
      description: 'Birth certificates for all household members, or valid alternative documentation.',
      category: 'IDENTITY' as const,
      validityDays: null,
      isRequired: true,
      sortOrder: 12,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA'] as const,
    },
    // Housing History
    {
      id: 'lease-agreement',
      name: 'Current Lease Agreement',
      description: 'Copy of your current lease or rental agreement.',
      category: 'HOUSING_HISTORY' as const,
      validityDays: null,
      isRequired: true,
      sortOrder: 20,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA'] as const,
    },
    {
      id: 'landlord-references',
      name: 'Landlord References',
      description: 'Contact information for current and previous landlords (past 5 years).',
      category: 'HOUSING_HISTORY' as const,
      validityDays: null,
      isRequired: true,
      sortOrder: 21,
      programTypes: ['HCV', 'PUBLIC_HOUSING'] as const,
    },
    {
      id: 'utility-bills',
      name: 'Utility Bills',
      description: 'Recent utility bills (gas, electric) in your name showing current address.',
      category: 'OTHER' as const,
      validityDays: 60,
      isRequired: false,
      sortOrder: 30,
      programTypes: ['HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER'] as const,
    },
  ];

  for (const doc of documentRequirements) {
    await prisma.documentRequirement.upsert({
      where: { id: doc.id },
      update: {
        name: doc.name,
        description: doc.description,
        category: doc.category,
        validityDays: doc.validityDays,
        isRequired: doc.isRequired,
        sortOrder: doc.sortOrder,
        programTypes: [...doc.programTypes],
      },
      create: {
        ...doc,
        programTypes: [...doc.programTypes],
      },
    });
  }
  console.log('✅ Document requirements seeded');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
