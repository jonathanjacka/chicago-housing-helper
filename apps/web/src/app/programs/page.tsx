import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { ProgramTypeSection, StatsSection, FAQ, DataSources } from './_components';
import { Footer } from '@/app/_home/_components/Footer';

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-chicago-blue-600 font-semibold inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Chicago Housing Helper
          </Link>
          <Link href="/onboarding" className="btn-primary text-sm py-2 px-4">
            Find Programs
          </Link>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Understanding Chicago&apos;s Housing Programs
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Chicago offers several types of subsidized housing to help residents afford a safe place to live.
            Learn about your options before finding programs you may qualify for.
          </p>
          <Link
            href="/onboarding"
            className="btn-primary inline-flex items-center gap-2 text-lg px-6 py-3"
          >
            Find Programs You Qualify For
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <StatsSection />
      <ProgramTypeSection />
      <FAQ />
      <DataSources />

      {/* Final CTA */}
      <section className="py-16 bg-chicago-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Find Housing?
          </h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            Complete our simple questionnaire to see which programs you may qualify for based on your income and household.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="bg-white text-chicago-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Eligibility Check
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/documents"
              className="border border-white/50 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              View Document Checklist
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
