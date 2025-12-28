import { Check, X, ChevronUp, ChevronDown, ExternalLink, Phone, Mail, MapPin, Navigation } from 'lucide-react';
import { MatchResult } from '@/types/results';
import { StatusBadge, EligibilityBadge } from './Badges';

interface ProgramCardProps {
  match: MatchResult;
  isExpanded: boolean;
  onToggle: () => void;
}

// Default contact info by provider for fallback
const PROVIDER_DEFAULTS: Record<string, { phone?: string; website?: string }> = {
  'Chicago Housing Authority': {
    phone: '(312) 742-8500',
    website: 'https://www.thecha.org',
  },
  'City of Chicago': {
    phone: '311',
    website: 'https://www.chicago.gov/city/en/depts/doh.html',
  },
};

export function ProgramCard({ match, isExpanded, onToggle }: ProgramCardProps) {
  const { program, eligibility } = match;

  // Extract waitlist code from dataSource (e.g., "cha:pbv123" -> "PBV123")
  const getWaitlistCode = (): string | null => {
    if (!program.dataSource) return null;
    if (program.dataSource.startsWith('cha:')) {
      return program.dataSource.replace('cha:', '').toUpperCase();
    }
    return null;
  };

  const waitlistCode = getWaitlistCode();

  // Get map link if coordinates or any location info is available
  const getMapLink = (): string | null => {
    if (program.latitude && program.longitude) {
      return `https://www.google.com/maps?q=${program.latitude},${program.longitude}`;
    }
    if (program.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address + ', Chicago, IL')}`;
    }
    if (program.neighborhood) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.neighborhood + ', Chicago, IL')}`;
    }
    return null;
  };

  // Get contact info with fallbacks
  const getContactPhone = (): string | null => {
    return program.contactPhone || PROVIDER_DEFAULTS[program.provider]?.phone || null;
  };

  const getWebsiteUrl = (): string | null => {
    return program.websiteUrl || PROVIDER_DEFAULTS[program.provider]?.website || null;
  };

  const mapLink = getMapLink();
  const contactPhone = getContactPhone();
  const websiteUrl = getWebsiteUrl();

  return (
    <div
      className={`card cursor-pointer ${!eligibility.isEligible ? 'opacity-75' : ''}`}
      onClick={onToggle}
    >
      {/* Program Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-chicago-blue-600 font-medium mb-1">
            <span>{program.provider}</span>
            {waitlistCode && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                {waitlistCode}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{program.name}</h3>

          {/* Address / Neighborhood with Map Link */}
          {(program.address || program.neighborhood) && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {program.address || program.neighborhood}
              </span>
              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-1 text-chicago-blue-600 hover:text-chicago-blue-700"
                  title="View on map"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <EligibilityBadge match={match} />
          <StatusBadge status={program.waitlistStatus} />
        </div>
      </div>

      {/* Description */}
      {program.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{program.description}</p>
      )}

      {/* Quick Actions (always visible) */}
      <div className="flex flex-wrap gap-2 mb-3">
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 inline-flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            Call
          </a>
        )}
        {program.contactEmail && (
          <a
            href={`mailto:${program.contactEmail}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 inline-flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            Email
          </a>
        )}
      </div>

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
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary text-sm py-2 inline-flex items-center gap-1"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary text-sm py-2 inline-flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                {contactPhone}
              </a>
            )}
          </div>

          {/* Fallback guidance when no application URL */}
          {!program.applicationUrl && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong className="block mb-2">How to apply for this program:</strong>
              {program.type === 'HCV' || program.type === 'PUBLIC_HOUSING' ? (
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Visit <a href="https://www.thecha.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900" onClick={(e) => e.stopPropagation()}>thecha.org</a> to check if the waitlist is open</li>
                  <li>CHA waitlists open periodically - sign up for notifications</li>
                  <li>Call CHA at <a href="tel:+13127428500" className="underline" onClick={(e) => e.stopPropagation()}>(312) 742-8500</a> for current status</li>
                </ol>
              ) : program.type === 'PBV' ? (
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>This is a Project-Based Voucher property at a specific location</li>
                  <li>Contact the property directly{contactPhone && <> at <a href={`tel:${contactPhone}`} className="underline" onClick={(e) => e.stopPropagation()}>{contactPhone}</a></>}</li>
                  <li>Ask about current availability and application process</li>
                </ol>
              ) : program.type === 'LIHTC' || program.type === 'ARO' ? (
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Contact the property&apos;s leasing office directly{contactPhone && <> at <a href={`tel:${contactPhone}`} className="underline" onClick={(e) => e.stopPropagation()}>{contactPhone}</a></>}</li>
                  <li>Ask about income-restricted units and availability</li>
                  <li>Bring proof of income to verify eligibility</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Contact {program.provider} directly{contactPhone && <> at <a href={`tel:${contactPhone}`} className="underline" onClick={(e) => e.stopPropagation()}>{contactPhone}</a></>}</li>
                  <li>Ask about the application process and current availability</li>
                  {websiteUrl && <li>Visit their <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900" onClick={(e) => e.stopPropagation()}>website</a> for more information</li>}
                </ol>
              )}
            </div>
          )}
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
