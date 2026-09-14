/**
 * CHA Autonomous Data Sync Script
 * Run with: pnpm db:sync:cha
 */
import { WaitlistStatus } from '@prisma/client';
/**
 * Derive waitlist status from CHA XLSX status field.
 * Does NOT hardcode OPEN — maps from actual source value.
 */
export declare function mapChaWaitlistStatus(status: string | undefined): WaitlistStatus;
//# sourceMappingURL=sync-cha.d.ts.map