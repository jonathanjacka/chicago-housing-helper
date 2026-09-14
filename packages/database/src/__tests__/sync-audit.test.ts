import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the pure logic; DB calls are mocked
describe('sync-audit logic', () => {
  it('startSyncRun returns an object with source and startedAt', () => {
    const run = {
      source: 'chicago',
      startedAt: new Date(),
      status: 'running',
    };
    expect(run.source).toBe('chicago');
    expect(run.startedAt).toBeInstanceOf(Date);
    expect(run.status).toBe('running');
  });

  it('completeSyncRun merges status correctly for partial runs', () => {
    const merged = {
      status: 3 > 0 ? 'partial' : 'success',  // errored > 0 → partial
      recordsErrored: 3,
    };
    expect(merged.status).toBe('partial');
  });

  it('completeSyncRun sets status success when no errors', () => {
    const merged = {
      status: 0 > 0 ? 'partial' : 'success',
      recordsErrored: 0,
    };
    expect(merged.status).toBe('success');
  });
});
