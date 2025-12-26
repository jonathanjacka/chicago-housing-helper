'use client';

import { useEffect, useState, useCallback } from 'react';
import { DocumentRequirement, GroupedDocuments, CATEGORY_ORDER } from '@/types/documents';

interface UseDocumentChecklistReturn {
  documents: DocumentRequirement[];
  checkedDocs: Set<string>;
  loading: boolean;
  error: string | null;
  matchedProgramTypes: string[];
  toggleDocument: (docId: string) => void;
  // Computed values
  relevantDocs: DocumentRequirement[];
  groupedDocs: GroupedDocuments;
  sortedCategories: string[];
  progressPercent: number;
  checkedRequired: number;
  totalRequired: number;
}

export function useDocumentChecklist(): UseDocumentChecklistReturn {
  const [documents, setDocuments] = useState<DocumentRequirement[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedProgramTypes, setMatchedProgramTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Get user's matched program types from session storage
        const profileData = sessionStorage.getItem('housingProfile');

        const response = await fetch('/api/documents');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await response.json();
        setDocuments(data.documents);

        // Load checked state from localStorage
        const savedChecks = localStorage.getItem('documentChecklist');
        if (savedChecks) {
          setCheckedDocs(new Set(JSON.parse(savedChecks)));
        }

        // If we have profile data, get matched program types
        if (profileData) {
          const matchResponse = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: profileData,
          });
          if (matchResponse.ok) {
            const matchData = await matchResponse.json();
            const types = new Set<string>();
            matchData.matches
              .filter((m: { eligibility: { isEligible: boolean } }) => m.eligibility.isEligible)
              .forEach((m: { program: { type: string } }) => types.add(m.program.type));
            setMatchedProgramTypes(Array.from(types));
          }
        }
      } catch (err) {
        setError('Failed to load document checklist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const toggleDocument = useCallback((docId: string) => {
    setCheckedDocs((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(docId)) {
        newChecked.delete(docId);
      } else {
        newChecked.add(docId);
      }
      localStorage.setItem('documentChecklist', JSON.stringify(Array.from(newChecked)));
      return newChecked;
    });
  }, []);

  // Filter documents based on matched program types
  const relevantDocs = matchedProgramTypes.length > 0
    ? documents.filter(doc =>
      doc.programTypes.some(type => matchedProgramTypes.includes(type))
    )
    : documents;

  // Group documents by category
  const groupedDocs: GroupedDocuments = relevantDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as GroupedDocuments);

  // Sort categories
  const sortedCategories = Object.keys(groupedDocs).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a as typeof CATEGORY_ORDER[number]) -
      CATEGORY_ORDER.indexOf(b as typeof CATEGORY_ORDER[number])
  );

  // Calculate progress
  const totalRequired = relevantDocs.filter(d => d.isRequired).length;
  const checkedRequired = relevantDocs.filter(d => d.isRequired && checkedDocs.has(d.id)).length;
  const progressPercent = totalRequired > 0 ? Math.round((checkedRequired / totalRequired) * 100) : 0;

  return {
    documents,
    checkedDocs,
    loading,
    error,
    matchedProgramTypes,
    toggleDocument,
    relevantDocs,
    groupedDocs,
    sortedCategories,
    progressPercent,
    checkedRequired,
    totalRequired,
  };
}
