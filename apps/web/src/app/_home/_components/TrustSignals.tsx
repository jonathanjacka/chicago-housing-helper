import { CheckCircle } from 'lucide-react';

const TRUST_ITEMS = [
  '100% Free',
  'Based on Official CHA Data',
  'Your Data Stays Private',
];

export function TrustSignals() {
  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          {TRUST_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
