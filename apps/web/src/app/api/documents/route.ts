import { NextResponse } from 'next/server';
import { prisma } from '@chicago-housing-helper/database';

export async function GET() {
  try {
    const documents = await prisma.documentRequirement.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document requirements' },
      { status: 500 }
    );
  }
}
