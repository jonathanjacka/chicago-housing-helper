-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('HCV', 'PUBLIC_HOUSING', 'PBV', 'PBRA', 'ARO', 'LIHTC', 'OTHER');

-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('OPEN', 'CLOSED', 'LOTTERY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TargetPopulation" AS ENUM ('FAMILY', 'SENIOR', 'DISABLED', 'ALL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('INTERESTED', 'IN_PROGRESS', 'SUBMITTED', 'ON_WAITLIST', 'OFFERED', 'ACCEPTED', 'DECLINED', 'REMOVED');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('INCOME', 'IDENTITY', 'HOUSING_HISTORY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "householdSize" INTEGER NOT NULL,
    "numAdults" INTEGER NOT NULL DEFAULT 1,
    "numChildren" INTEGER NOT NULL DEFAULT 0,
    "hasSenior" BOOLEAN NOT NULL DEFAULT false,
    "hasDisabled" BOOLEAN NOT NULL DEFAULT false,
    "annualIncome" DECIMAL(12,2) NOT NULL,
    "hasChaDebt" BOOLEAN NOT NULL DEFAULT false,
    "preferredNeighborhoods" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL,
    "description" TEXT,
    "waitlistStatus" "WaitlistStatus" NOT NULL DEFAULT 'UNKNOWN',
    "targetPopulation" "TargetPopulation" NOT NULL DEFAULT 'ALL',
    "incomeLimitPctAmi" INTEGER,
    "minHouseholdSize" INTEGER NOT NULL DEFAULT 1,
    "maxHouseholdSize" INTEGER NOT NULL DEFAULT 10,
    "address" TEXT,
    "neighborhood" TEXT,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "websiteUrl" TEXT,
    "applicationUrl" TEXT,
    "lastSynced" TIMESTAMP(3),
    "enrichedAt" TIMESTAMP(3),
    "dataSource" TEXT,
    "notes" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'INTERESTED',
    "appliedAt" TIMESTAMP(3),
    "waitlistPosition" INTEGER,
    "lastStatusCheck" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmiLimit" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "householdSize" INTEGER NOT NULL,
    "ami100" DECIMAL(12,2) NOT NULL,
    "ami80" DECIMAL(12,2) NOT NULL,
    "ami60" DECIMAL(12,2) NOT NULL,
    "ami50" DECIMAL(12,2) NOT NULL,
    "ami30" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "AmiLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRequirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "DocumentCategory" NOT NULL,
    "validityDays" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "programTypes" "ProgramType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Program_type_idx" ON "Program"("type");

-- CreateIndex
CREATE INDEX "Program_waitlistStatus_idx" ON "Program"("waitlistStatus");

-- CreateIndex
CREATE INDEX "Program_neighborhood_idx" ON "Program"("neighborhood");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_programId_idx" ON "Application"("programId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_programId_key" ON "Application"("userId", "programId");

-- CreateIndex
CREATE INDEX "AmiLimit_year_idx" ON "AmiLimit"("year");

-- CreateIndex
CREATE UNIQUE INDEX "AmiLimit_year_householdSize_key" ON "AmiLimit"("year", "householdSize");

-- CreateIndex
CREATE INDEX "DocumentRequirement_category_idx" ON "DocumentRequirement"("category");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
