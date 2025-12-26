import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-chicago-blue-600 via-chicago-blue-500 to-chicago-blue-400 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Find Affordable Housing
            <br />
            <span className="text-chicago-blue-100">in Chicago</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-chicago-blue-100 max-w-2xl mx-auto text-balance">
            Free tool to discover subsidized housing programs you may qualify
            for. Based on official CHA and city data.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="btn-warm text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/programs"
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center bg-white/10 text-white hover:bg-white/20"
            >
              Browse Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
