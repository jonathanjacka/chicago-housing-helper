'use client';

import { useEffect, useState, useCallback } from 'react';
import { MatchResponse, MatchResult, MatchFilters, PaginationInfo } from '@/types/results';

interface UseResultsReturn {
  results: MatchResponse | null;
  loading: boolean;
  error: string | null;
  filters: MatchFilters;
  setFilters: (filters: MatchFilters) => void;
  pagination: PaginationInfo;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  expandedProgram: string | null;
  toggleProgram: (programId: string) => void;
}

const DEFAULT_FILTERS: MatchFilters = {
  eligibility: 'all',
};

const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  pageSize: 20,
  totalPages: 1,
  totalCount: 0,
};

export function useResults(): UseResultsReturn {
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MatchFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<PaginationInfo>(DEFAULT_PAGINATION);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  const fetchMatches = useCallback(async (
    currentFilters: MatchFilters,
    page: number,
    pageSize: number
  ) => {
    try {
      setLoading(true);

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
        body: JSON.stringify({
          profile,
          filters: currentFilters,
          pagination: { page, pageSize },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data: MatchResponse = await response.json();
      setResults(data);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMatches(filters, pagination.page, pagination.pageSize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when filters change (reset to page 1)
  const handleSetFilters = useCallback((newFilters: MatchFilters) => {
    setFilters(newFilters);
    fetchMatches(newFilters, 1, pagination.pageSize);
  }, [fetchMatches, pagination.pageSize]);

  // Page change
  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchMatches(filters, page, pagination.pageSize);
  }, [fetchMatches, filters, pagination.pageSize]);

  // Page size change (reset to page 1)
  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
    fetchMatches(filters, 1, pageSize);
  }, [fetchMatches, filters]);

  const toggleProgram = useCallback((programId: string) => {
    setExpandedProgram((prev) => (prev === programId ? null : programId));
  }, []);

  return {
    results,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    pagination,
    setPage,
    setPageSize,
    expandedProgram,
    toggleProgram,
  };
}
