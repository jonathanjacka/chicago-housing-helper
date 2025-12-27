import { Check, CircleAlert, ExternalLink } from 'lucide-react';

interface ProgramTypeCardProps {
  acronym?: string;
  fullName: string;
  description: string;
  benefits: string[];
  considerations: string[];
  sourceUrl: string;
  sourceName: string;
}

export function ProgramTypeCard({
  acronym,
  fullName,
  description,
  benefits,
  considerations,
  sourceUrl,
  sourceName,
}: ProgramTypeCardProps) {
  return (
    <div className="card flex flex-col h-full">
      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 min-h-[56px]">
        {fullName}
      </h3>

      {/* Acronym */}
      <div className="h-8 mb-3">
        {acronym ? (
          <span className="text-xs font-mono bg-chicago-blue-100 text-chicago-blue-700 px-2 py-1 rounded">
            {acronym}
          </span>
        ) : (
          <span className="invisible text-xs px-2 py-1">—</span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 min-h-[84px]">
        {description}
      </p>

      {/* Benefits */}
      <div className="mb-4 min-h-[120px]">
        <h4 className="text-sm font-medium text-green-700 mb-2">Benefits</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Considerations */}
      <div className="mb-4 min-h-[120px]">
        <h4 className="text-sm font-medium text-amber-700 mb-2">Things to Consider</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {considerations.map((consideration, i) => (
            <li key={i} className="flex items-start gap-2">
              <CircleAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{consideration}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Source Link */}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-chicago-blue-600 hover:text-chicago-blue-700 inline-flex items-center gap-1 mt-auto pt-4 border-t"
      >
        Learn more at {sourceName}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
