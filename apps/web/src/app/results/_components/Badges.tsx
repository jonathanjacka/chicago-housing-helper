import { Check, X, AlertTriangle } from 'lucide-react';
import { MatchResult } from '@/types/results';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'OPEN':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          Open
        </span>
      );
    case 'CLOSED':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          Closed
        </span>
      );
    case 'LOTTERY':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
          Lottery
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          Unknown
        </span>
      );
  }
}

interface EligibilityBadgeProps {
  match: MatchResult;
}

export function EligibilityBadge({ match }: EligibilityBadgeProps) {
  if (match.eligibility.isEligible) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-chicago-blue-100 text-chicago-blue-700 rounded-full inline-flex items-center gap-1">
        <Check className="w-3 h-3" />
        Likely Eligible
      </span>
    );
  }

  const warnings = match.eligibility.checks.filter(
    (c) => !c.passed && c.severity === 'warning'
  );

  if (warnings.length > 0 && match.eligibility.score >= 50) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Partial Match
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full inline-flex items-center gap-1">
      <X className="w-3 h-3" />
      Not Eligible
    </span>
  );
}
