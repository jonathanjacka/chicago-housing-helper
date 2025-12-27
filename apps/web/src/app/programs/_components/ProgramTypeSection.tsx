import { ProgramTypeCard } from './ProgramTypeCard';
import { PROGRAM_TYPES } from '../_constants/program-types';

export function ProgramTypeSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Types of Housing Programs
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Chicago offers several types of subsidized housing programs. Here&apos;s what you need to know about each one.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAM_TYPES.map((program) => (
            <ProgramTypeCard
              key={program.id}
              acronym={program.acronym}
              fullName={program.fullName}
              description={program.description}
              benefits={program.benefits}
              considerations={program.considerations}
              sourceUrl={program.sourceUrl}
              sourceName={program.sourceName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
