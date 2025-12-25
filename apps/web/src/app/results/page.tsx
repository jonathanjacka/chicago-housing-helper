'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EligibilityCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'blocker' | 'warning' | 'info';
}

interface MatchResult {
  program: {
    id: string;
    name: string;
    provider: string;
    type: string;
    description: string | null;
    waitlistStatus: string;
    targetPopulation: string;
    incomeLimitPctAmi: number | null;
    websiteUrl: string | null;
    applicationUrl: string | null;
    contactPhone: string | null;
    neighborhood: string | null;
  };
  eligibility: {
    isEligible: boolean;
    score: number;
    checks: EligibilityCheck[];
  };
}

interface MatchResponse {
  matches: MatchResult[];
  summary: {
    total: number;
    eligible: number;
    openWaitlists: number;
  };
}

type FilterType = 'all' | 'eligible' | 'open';

export default function ResultsPage() {
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const profileData = sessionStorage.getItem('housingProfile');
        if (!profileData) {
          setError('No profile found. Please complete the questionnaire first.');
          setLoading(false);
          return;
        }

        const profile = JSON.parse(profileData);
        const response = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError('Failed to load results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = results?.matches.filter((match) => {
    if (filter === 'eligible') return match.eligibility.isEligible;
    if (filter === 'open')
      return (
        match.eligibility.isEligible && match.program.waitlistStatus === 'OPEN'
      );
    return true;
  });

  const getStatusBadge = (status: string) => {
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
  };

  const getEligibilityBadge = (match: MatchResult) => {
    if (match.eligibility.isEligible) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-chicago-blue-100 text-chicago-blue-700 rounded-full">
          ✓ Likely Eligible
        </span>
      );
    }
    const warnings = match.eligibility.checks.filter(
      (c) => !c.passed && c.severity === 'warning'
    );
    if (warnings.length > 0 && match.eligibility.score >= 50) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          ⚠ Partial Match
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
        ✗ Not Eligible
      </span>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chicago-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your matches...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/onboarding" className="btn-primary">
            Start Over
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-chicago-blue-600 font-semibold">
            Chicago Housing Helper
          </Link>
          <Link href="/onboarding" className="btn-secondary text-sm py-2 px-4">
            Update Profile
          </Link>
        </div>
      </header>

      {/* Summary */}
      <section className="bg-linear-to-r from-chicago-blue-600 to-chicago-blue-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            We found {results?.summary.total} programs
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-bold text-lg">
                {results?.summary.eligible}
              </span>{' '}
              you may qualify for
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-bold text-lg">
                {results?.summary.openWaitlists}
              </span>{' '}
              with open waitlists
            </div>
          </div>
        </div>
      </section>

      {/* Citizenship Note */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-amber-600 text-xl">ℹ️</span>
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Important Note</h3>
              <p className="text-sm text-amber-700">
                Most federal housing programs require at least one household member to be a U.S. citizen
                or have eligible immigration status. Eligibility will be verified during the application process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                ? 'bg-chicago-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({results?.summary.total})
            </button>
            <button
              onClick={() => setFilter('eligible')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'eligible'
                ? 'bg-chicago-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Eligible ({results?.summary.eligible})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'open'
                ? 'bg-chicago-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Open Now ({results?.summary.openWaitlists})
            </button>
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredMatches?.map((match) => (
            <div
              key={match.program.id}
              className={`card cursor-pointer ${!match.eligibility.isEligible ? 'opacity-75' : ''
                }`}
              onClick={() =>
                setExpandedProgram(
                  expandedProgram === match.program.id ? null : match.program.id
                )
              }
            >
              {/* Program Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <div className="text-xs text-chicago-blue-600 font-medium mb-1">
                    {match.program.provider}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {match.program.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  {getEligibilityBadge(match)}
                  {getStatusBadge(match.program.waitlistStatus)}
                </div>
              </div>

              {/* Description */}
              {match.program.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {match.program.description}
                </p>
              )}

              {/* Expanded Details */}
              {expandedProgram === match.program.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Eligibility Details
                  </h4>
                  <div className="space-y-2">
                    {match.eligibility.checks.map((check, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 text-sm p-2 rounded ${check.passed
                          ? 'bg-green-50 text-green-800'
                          : check.severity === 'blocker'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-yellow-50 text-yellow-800'
                          }`}
                      >
                        <span>{check.passed ? '✓' : '✗'}</span>
                        <div>
                          <span className="font-medium">{check.name}:</span>{' '}
                          {check.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {match.program.applicationUrl && (
                      <a
                        href={match.program.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-primary text-sm py-2"
                      >
                        Apply Now →
                      </a>
                    )}
                    {match.program.websiteUrl && (
                      <a
                        href={match.program.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-secondary text-sm py-2"
                      >
                        Learn More
                      </a>
                    )}
                    {match.program.contactPhone && (
                      <a
                        href={`tel:${match.program.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn-secondary text-sm py-2"
                      >
                        Call {match.program.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Expand/Collapse Indicator */}
              <div className="mt-3 text-chicago-blue-600 text-sm">
                {expandedProgram === match.program.id
                  ? '▲ Hide details'
                  : '▼ Show eligibility details'}
              </div>
            </div>
          ))}

          {filteredMatches?.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-600">
                No programs match your current filter. Try selecting a different
                filter above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Help Footer */}
      <footer className="bg-white border-t py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            If you have questions about these programs or need assistance
            applying, contact the Chicago Housing Authority.
          </p>
          <a
            href="tel:3127428500"
            className="text-chicago-blue-600 font-medium"
          >
            CHA Helpline: (312) 742-8500
          </a>
        </div>
      </footer>
    </main>
  );
}
