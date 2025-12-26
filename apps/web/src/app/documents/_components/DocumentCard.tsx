import { DocumentRequirement } from '@/types/documents';

interface DocumentCardProps {
  document: DocumentRequirement;
  isChecked: boolean;
  onToggle: (docId: string) => void;
}

export function DocumentCard({ document, isChecked, onToggle }: DocumentCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${isChecked
          ? 'bg-green-50 border-green-300'
          : 'bg-white border-gray-200 hover:border-chicago-blue-300'
        }`}
      onClick={() => onToggle(document.id)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Circle */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}
        >
          {isChecked && <span className="text-white text-sm">✓</span>}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium ${isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                }`}
            >
              {document.name}
            </span>
            {document.isRequired && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                Required
              </span>
            )}
            {document.validityDays && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                Valid {document.validityDays} days
              </span>
            )}
          </div>
          {document.description && (
            <p className="text-sm text-gray-600 mt-1">{document.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
