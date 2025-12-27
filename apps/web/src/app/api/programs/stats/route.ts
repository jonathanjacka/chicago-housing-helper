import { NextResponse } from 'next/server';
import { prisma } from '@chicago-housing-helper/database';

export async function GET() {
  try {
    // Get counts by program type
    const byType = await prisma.program.groupBy({
      by: ['type'],
      _count: { type: true },
    });

    // Get counts by waitlist status
    const byStatus = await prisma.program.groupBy({
      by: ['waitlistStatus'],
      _count: { waitlistStatus: true },
    });

    // Get total count
    const total = await prisma.program.count();

    // Transform data
    const programTypes = byType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<string, number>);

    const waitlistStatus = byStatus.reduce((acc, item) => {
      acc[item.waitlistStatus] = item._count.waitlistStatus;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      total,
      programTypes,
      waitlistStatus,
      openWaitlists: waitlistStatus['OPEN'] || 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching program stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program stats' },
      { status: 500 }
    );
  }
}
