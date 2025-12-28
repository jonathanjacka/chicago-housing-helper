'use client';

import { Search, X } from 'lucide-react';
import { MatchFilters } from '@/types/results';
import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchFilterProps {
  filters: MatchFilters;
  onFilterChange: (filters: MatchFilters) => void;
  availableFilters: {
    neighborhoods: string[];
    programTypes: string[];
  };
  loading?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 300; // ms

export function SearchFilter({
  filters,
  onFilterChange,
  availableFilters,
  loading,
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Refs to avoid stale closures in useEffect while satisfying exhaustive-deps
  const filtersRef = useRef(filters);
  const onFilterChangeRef = useRef(onFilterChange);

  // Keep refs updated
  useEffect(() => {
    filtersRef.current = filters;
    onFilterChangeRef.current = onFilterChange;
  }, [filters, onFilterChange]);

  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);

  useEffect(() => {
    const currentFilters = filtersRef.current;
    const searchValue = debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch :
      debouncedSearch.length === 0 ? undefined :
        currentFilters.search;

    if (searchValue !== currentFilters.search) {
      onFilterChangeRef.current({ ...currentFilters, search: searchValue });
    }
  }, [debouncedSearch]);

  // Keep focus on search input after filter changes
  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      if (searchInput.length > 0) {
        searchInputRef.current.focus();
      }
    }
  }, [loading, searchInput.length]);

  const updateFilter = useCallback((key: keyof MatchFilters, value: string | undefined) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    onFilterChange({ eligibility: 'all' });
  }, [onFilterChange]);

  const hasActiveFilters =
    searchInput ||
    filters.neighborhood ||
    filters.programType ||
    (filters.eligibility && filters.eligibility !== 'all');

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, address, or provider (min 3 chars)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-chicago-blue-500 focus:border-transparent"
            disabled={loading}
          />
          {searchInput.length > 0 && searchInput.length < MIN_SEARCH_LENGTH && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {MIN_SEARCH_LENGTH - searchInput.length} more chars
            </span>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {/* Eligibility filter */}
          <select
            value={filters.eligibility || 'all'}
            onChange={(e) => updateFilter('eligibility', e.target.value as MatchFilters['eligibility'])}
            className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-chicago-blue-500"
            disabled={loading}
          >
            <option value="all">All Programs</option>
            <option value="eligible">Eligible Only</option>
            <option value="open">Open Waitlists</option>
          </select>

          {/* Neighborhood filter */}
          <select
            value={filters.neighborhood || ''}
            onChange={(e) => updateFilter('neighborhood', e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-chicago-blue-500"
            disabled={loading}
          >
            <option value="">All Neighborhoods</option>
            {availableFilters.neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Program type filter */}
          <select
            value={filters.programType || ''}
            onChange={(e) => updateFilter('programType', e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-chicago-blue-500"
            disabled={loading}
          >
            <option value="">All Program Types</option>
            {availableFilters.programTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
