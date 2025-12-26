import { Check, X, ChevronUp, ChevronDown, ExternalLink, Phone } from 'lucide-react';
import { MatchResult } from '@/types/results';
import { StatusBadge, EligibilityBadge } from './Badges';

interface ProgramCardProps {
  match: MatchResult;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ProgramCard({ match, isExpanded, onToggle }: ProgramCardProps) {
  const { program, eligibility } = match;

  return (
    <div
      className={`card cursor-pointer ${!eligibility.isEligible ? 'opacity-75' : ''}`}
      onClick={onToggle}
    >
      {/* Program Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-xs text-chicago-blue-600 font-medium mb-1">
            {program.provider}
          </div>
          <h3 className="font-semibold text-gray-900">{program.name}</h3>
        </div>
        <div className="flex gap-2">
          <EligibilityBadge match={match} />
          <StatusBadge status={program.waitlistStatus} />
        </div>
      </div>

      {/* Description */}
      {program.description && (
        <p className="text-gray-600 text-sm mb-3">{program.description}</p>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Eligibility Details</h4>
          <div className="space-y-2">
            {eligibility.checks.map((check, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 text-sm p-2 rounded ${check.passed
                    ? 'bg-green-50 text-green-800'
                    : check.severity === 'blocker'
                      ? 'bg-red-50 text-red-800'
                      : 'bg-yellow-50 text-yellow-800'
                  }`}
              >
                {check.passed ? (
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-medium">{check.name}:</span> {check.message}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            {program.applicationUrl && (
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-primary text-sm py-2 inline-flex items-center gap-1"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {program.websiteUrl && (
              <a
                href={program.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary text-sm py-2 inline-flex items-center gap-1"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {program.contactPhone && (
              <a
                href={`tel:${program.contactPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary text-sm py-2 inline-flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                {program.contactPhone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Expand/Collapse Indicator */}
      <div className="mt-3 text-chicago-blue-600 text-sm flex items-center gap-1">
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show eligibility details
          </>
        )}
      </div>
    </div>
  );
}
