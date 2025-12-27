'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useResults } from './_hooks/useResults';
import {
  ProgramCard,
  DocumentsCTA,
  CitizenshipNote,
  Pagination,
  SearchFilter,
} from './_components';
import { Footer } from '@/app/_home/_components/Footer';

export default function ResultsPage() {
  const {
    results,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPage,
    setPageSize,
    expandedProgram,
    toggleProgram,
  } = useResults();

  if (!results && loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chicago-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding your matches...</p>
        </div>
      </main>
    );
  }

  if (error && !results) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/onboarding" className="btn-primary">
            Complete Questionnaire
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
      <section className="bg-gradient-to-r from-chicago-blue-600 to-chicago-blue-500 text-white py-8">
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

      <CitizenshipNote />
      <DocumentsCTA />

      {/* Search & Filters */}
      <SearchFilter
        filters={filters}
        onFilterChange={setFilters}
        availableFilters={results?.availableFilters || { neighborhoods: [], programTypes: [] }}
        loading={loading}
      />

      {/* Results List */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chicago-blue-600" />
          </div>
        )}

        {!loading && (
          <>
            <div className="space-y-4">
              {results?.matches.map((match) => (
                <ProgramCard
                  key={match.program.id}
                  match={match}
                  isExpanded={expandedProgram === match.program.id}
                  onToggle={() => toggleProgram(match.program.id)}
                />
              ))}

              {results?.matches.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-600">
                    No programs match your current filters. Try adjusting your search or filters above.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalCount > 0 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                pageSize={pagination.pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
