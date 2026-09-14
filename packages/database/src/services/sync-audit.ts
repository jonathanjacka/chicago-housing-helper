/**
 * Sync audit helpers — write SyncRun records to track every data sync.
 * Callers use startSyncRun() at the top of a sync script, then
 * completeSyncRun() at the end (in a finally block).
 */

import { prisma } from '../index';

export interface SyncCounts {
  recordsFetched?: number;
  recordsUpserted?: number;
  recordsSkipped?: number;
  recordsErrored?: number;
}

/**
 * Create a SyncRun record at the start of a sync.
 * Returns the SyncRun id so completeSyncRun can update it.
 */
export async function startSyncRun(
  source: string,
  triggeredBy = 'manual'
): Promise<string> {
  const run = await prisma.syncRun.create({
    data: {
      source,
      startedAt: new Date(),
      status: 'running',
      triggeredBy,
    },
  });
  return run.id;
}

/**
 * Update the SyncRun record when a sync completes.
 * Pass recordsErrored > 0 to mark as 'partial' rather than 'success'.
 */
export async function completeSyncRun(
  id: string,
  counts: SyncCounts,
  overrideStatus?: 'success' | 'partial' | 'failed',
  errorSummary?: string
): Promise<void> {
  const status =
    overrideStatus ??
    ((counts.recordsErrored ?? 0) > 0 ? 'partial' : 'success');

  await prisma.syncRun.update({
    where: { id },
    data: {
      completedAt: new Date(),
      status,
      recordsFetched: counts.recordsFetched,
      recordsUpserted: counts.recordsUpserted,
      recordsSkipped: counts.recordsSkipped,
      recordsErrored: counts.recordsErrored,
      errorSummary: errorSummary ?? null,
    },
  });
}

/**
 * Get the most recent completed SyncRun for a source.
 * Used by the stats API to report real last-updated time.
 */
export async function getLatestSyncRun(source: string) {
  return prisma.syncRun.findFirst({
    where: { source, status: { in: ['success', 'partial'] } },
    orderBy: { completedAt: 'desc' },
  });
}

/**
 * Get the latest completed SyncRun across all sources.
 */
export async function getLatestAnySyncRun() {
  return prisma.syncRun.findFirst({
    where: { status: { in: ['success', 'partial'] } },
    orderBy: { completedAt: 'desc' },
  });
}
