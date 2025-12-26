import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const PROGRAMS = [
  { name: 'Housing Choice Voucher (Section 8)', provider: 'CHA' },
  { name: 'Public Housing', provider: 'CHA' },
  { name: 'Project-Based Vouchers', provider: 'CHA' },
  { name: 'ARO Units', provider: 'City of Chicago' },
];

export function ProgramsPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Programs We Cover
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We aggregate information from CHA, the City of Chicago, and local
          non-profit housing providers.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROGRAMS.map((program) => (
            <div key={program.name} className="card">
              <div className="text-xs text-chicago-blue-600 font-medium mb-1">
                {program.provider}
              </div>
              <div className="font-semibold text-gray-900">{program.name}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/programs"
            className="text-chicago-blue-600 hover:text-chicago-blue-700 font-medium inline-flex items-center gap-1"
          >
            View all programs
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
