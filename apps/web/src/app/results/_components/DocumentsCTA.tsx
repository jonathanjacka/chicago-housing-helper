import Link from 'next/link';
import { ClipboardList, ChevronRight } from 'lucide-react';

export function DocumentsCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-4">
      <Link
        href="/documents"
        className="block bg-gradient-to-r from-chicago-blue-50 to-chicago-blue-100 border border-chicago-blue-200 rounded-lg p-4 hover:from-chicago-blue-100 hover:to-chicago-blue-200 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-chicago-blue-600" />
            <div>
              <h3 className="font-semibold text-chicago-blue-800">
                Prepare Your Documents
              </h3>
              <p className="text-sm text-chicago-blue-600">
                Get a personalized checklist of required documents
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-chicago-blue-500" />
        </div>
      </Link>
    </section>
  );
}
