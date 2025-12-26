'use client';

import { Search, X } from 'lucide-react';
import { MatchFilters } from '@/types/results';

interface SearchFilterProps {
  filters: MatchFilters;
  onFilterChange: (filters: MatchFilters) => void;
  availableFilters: {
    neighborhoods: string[];
    programTypes: string[];
  };
  loading?: boolean;
}

export function SearchFilter({
  filters,
  onFilterChange,
  availableFilters,
  loading,
}: SearchFilterProps) {
  const updateFilter = (key: keyof MatchFilters, value: string | undefined) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({ eligibility: 'all' });
  };

  const hasActiveFilters =
    filters.search ||
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
            type="text"
            placeholder="Search by name, address, or provider..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-chicago-blue-500 focus:border-transparent"
            disabled={loading}
          />
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
