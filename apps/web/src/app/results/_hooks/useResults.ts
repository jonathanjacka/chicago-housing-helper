'use client';

import { useEffect, useState, useCallback } from 'react';
import { MatchResponse, MatchResult, FilterType } from '@/types/results';

interface UseResultsReturn {
  results: MatchResponse | null;
  loading: boolean;
  error: string | null;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  expandedProgram: string | null;
  toggleProgram: (programId: string) => void;
  filteredMatches: MatchResult[];
}

export function useResults(): UseResultsReturn {
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

  const toggleProgram = useCallback((programId: string) => {
    setExpandedProgram((prev) => (prev === programId ? null : programId));
  }, []);

  const filteredMatches = results?.matches.filter((match) => {
    if (filter === 'eligible') return match.eligibility.isEligible;
    if (filter === 'open')
      return (
        match.eligibility.isEligible && match.program.waitlistStatus === 'OPEN'
      );
    return true;
  }) ?? [];

  return {
    results,
    loading,
    error,
    filter,
    setFilter,
    expandedProgram,
    toggleProgram,
    filteredMatches,
  };
}
