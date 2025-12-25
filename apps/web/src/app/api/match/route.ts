import { NextRequest, NextResponse } from 'next/server';
import { findMatchingPrograms, UserProfile } from '@/lib/matching';

export async function POST(request: NextRequest) {
  try {
    const profile: UserProfile = await request.json();

    // Validate required fields
    if (!profile.householdSize || profile.householdSize < 1) {
      return NextResponse.json(
        { error: 'Invalid household size' },
        { status: 400 }
      );
    }

    if (typeof profile.annualIncome !== 'number' || profile.annualIncome < 0) {
      return NextResponse.json(
        { error: 'Invalid annual income' },
        { status: 400 }
      );
    }

    const matches = await findMatchingPrograms(profile);

    return NextResponse.json({
      matches,
      summary: {
        total: matches.length,
        eligible: matches.filter((m) => m.eligibility.isEligible).length,
        openWaitlists: matches.filter(
          (m) => m.eligibility.isEligible && m.program.waitlistStatus === 'OPEN'
        ).length,
      },
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matching programs' },
      { status: 500 }
    );
  }
}
