'use client';

import Link from 'next/link';
import { ClipboardList, Lightbulb } from 'lucide-react';
import { useDocumentChecklist } from './_hooks/useDocumentChecklist';
import {
  PageHeader,
  ProgressBar,
  DocumentCategorySection
} from './_components';
import { Footer } from '@/app/_home/_components';

export default function DocumentsPage() {
  const {
    loading,
    error,
    matchedProgramTypes,
    checkedDocs,
    toggleDocument,
    groupedDocs,
    sortedCategories,
    checkedRequired,
    totalRequired,
  } = useDocumentChecklist();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chicago-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading document checklist...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/results" className="btn-primary">
            Back to Results
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="Document Checklist"
        titleIcon={<ClipboardList className="w-8 h-8" />}
        subtitle="Gather these documents before you reach the top of a waitlist"
        backLink={{ href: '/results', label: 'Back to Results' }}
      />

      <ProgressBar
        current={checkedRequired}
        total={totalRequired}
        label="Required Documents Progress"
      />

      {matchedProgramTypes.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pt-6">
          <div className="bg-chicago-blue-50 border border-chicago-blue-200 rounded-lg p-4">
            <p className="text-sm text-chicago-blue-700">
              <strong>Personalized for you:</strong> This checklist shows documents
              required for the programs you may qualify for.
            </p>
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <DocumentCategorySection
              key={category}
              category={category}
              documents={groupedDocs[category]}
              checkedDocs={checkedDocs}
              onToggle={toggleDocument}
            />
          ))}
        </div>
      </section>

      {/* Tips Footer */}
      <footer className="bg-white border-t py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Tips
          </h3>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>• Keep documents organized in folders (physical or digital)</li>
            <li>• Make copies of everything before submitting</li>
            <li>• Check expiration dates on time-sensitive documents</li>
            <li>• Request documents early - some can take weeks to obtain</li>
          </ul>
        </div>
      </footer>
      <Footer />
    </main>
  );
}
