import { Users, Search, FileCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Tell Us About Your Household',
    description: 'Answer a few simple questions about your family size and income. Takes about 2 minutes.',
    icon: Users,
  },
  {
    number: 2,
    title: 'See Your Matches',
    description: "We'll show you all the housing programs you may qualify for, with clear explanations.",
    icon: Search,
  },
  {
    number: 3,
    title: 'Take the Next Step',
    description: 'Get details on how to apply, what documents you need, and direct links to applications.',
    icon: FileCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-chicago-blue-100 text-chicago-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
