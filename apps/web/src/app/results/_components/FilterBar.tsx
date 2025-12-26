import { FilterType, MatchResponse } from '@/types/results';

interface FilterBarProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  summary: MatchResponse['summary'] | undefined;
}

export function FilterBar({ filter, setFilter, summary }: FilterBarProps) {
  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: 'All Programs', count: summary?.total },
    { key: 'eligible', label: 'Eligible', count: summary?.eligible },
    { key: 'open', label: 'Open Now', count: summary?.openWaitlists },
  ];

  return (
    <section className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex gap-2">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === key
                  ? 'bg-chicago-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {label} {count !== undefined && `(${count})`}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
