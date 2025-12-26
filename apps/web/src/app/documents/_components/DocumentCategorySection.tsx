import { DocumentRequirement, CATEGORY_LABELS, CATEGORY_ICONS, DocumentCategory } from '@/types/documents';
import { FileText } from 'lucide-react';
import { DocumentCard } from './DocumentCard';

interface DocumentCategoryProps {
  category: string;
  documents: DocumentRequirement[];
  checkedDocs: Set<string>;
  onToggle: (docId: string) => void;
}

export function DocumentCategorySection({
  category,
  documents,
  checkedDocs,
  onToggle
}: DocumentCategoryProps) {
  const Icon = CATEGORY_ICONS[category as DocumentCategory] || FileText;
  const label = CATEGORY_LABELS[category as DocumentCategory] || category;

  const sortedDocuments = [...documents].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-chicago-blue-600" />
        {label}
      </h2>
      <div className="space-y-3">
        {sortedDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isChecked={checkedDocs.has(doc.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
