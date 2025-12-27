'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS } from '../_constants/faq-items';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
