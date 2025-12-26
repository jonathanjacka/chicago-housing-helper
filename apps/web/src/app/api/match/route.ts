import { NextRequest, NextResponse } from 'next/server';
import { findMatchingPrograms, UserProfile, MatchFilters, PaginationParams } from '@/lib/matching';

interface MatchRequestBody {
  profile: UserProfile;
  filters?: MatchFilters;
  pagination?: PaginationParams;
}

export async function POST(request: NextRequest) {
  try {
    const body: MatchRequestBody = await request.json();

    // Support legacy format (just profile) and new format (profile + filters + pagination)
    const profile = body.profile || body as unknown as UserProfile;
    const filters = body.filters || {};
    const pagination = body.pagination || { page: 1, pageSize: 20 };

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

    // Validate pagination
    const validPageSizes = [10, 20, 30];
    if (!validPageSizes.includes(pagination.pageSize)) {
      pagination.pageSize = 20;
    }
    if (pagination.page < 1) {
      pagination.page = 1;
    }

    const result = await findMatchingPrograms(profile, filters, pagination);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matching programs' },
      { status: 500 }
    );
  }
}
