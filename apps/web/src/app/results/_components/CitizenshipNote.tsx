import { Info } from 'lucide-react';

export function CitizenshipNote() {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Important Note</h3>
            <p className="text-sm text-amber-700">
              Most federal housing programs require at least one household member
              to be a U.S. citizen or have eligible immigration status. Eligibility
              will be verified during the application process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
