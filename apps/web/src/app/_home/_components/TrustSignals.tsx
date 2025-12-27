import { CircleCheck } from 'lucide-react';
import { TRUST_ITEMS } from '../_constants/trust-signals';

export function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 py-4">
      {TRUST_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-1">
          <CircleCheck className="w-4 h-4 text-green-600" />
          {item}
        </span>
      ))}
    </div>
  );
}
