import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-chicago-blue-600 via-chicago-blue-500 to-chicago-blue-400 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
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
                className="btn-warm text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Get Started
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
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

      {/* Trust Signals */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Based on Official CHA Data</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your Data Stays Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-chicago-blue-100 text-chicago-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tell Us About Your Household
              </h3>
              <p className="text-gray-600">
                Answer a few simple questions about your family size and income.
                Takes about 2 minutes.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-chicago-blue-100 text-chicago-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                See Your Matches
              </h3>
              <p className="text-gray-600">
                We&apos;ll show you all the housing programs you may qualify
                for, with clear explanations.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-chicago-blue-100 text-chicago-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Take the Next Step
              </h3>
              <p className="text-gray-600">
                Get details on how to apply, what documents you need, and direct
                links to applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
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
            {[
              {
                name: 'Housing Choice Voucher (Section 8)',
                provider: 'CHA',
              },
              { name: 'Public Housing', provider: 'CHA' },
              { name: 'Project-Based Vouchers', provider: 'CHA' },
              { name: 'ARO Units', provider: 'City of Chicago' },
            ].map((program) => (
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
              className="text-chicago-blue-600 hover:text-chicago-blue-700 font-medium inline-flex items-center"
            >
              View all programs
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-chicago-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Housing Options?
          </h2>
          <p className="text-chicago-blue-100 mb-8 text-lg">
            It only takes a few minutes to see what programs you may qualify
            for.
          </p>
          <Link
            href="/onboarding"
            className="btn-warm text-lg px-8 py-4 inline-flex items-center"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">
                Chicago Housing Helper
              </h3>
              <p className="text-sm">
                A free public service to help Chicago residents find affordable
                housing options.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.thecha.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Chicago Housing Authority
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.chicago.gov/city/en/depts/doh.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Chicago Dept. of Housing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Disclaimer</h4>
              <p className="text-sm">
                This tool provides information only and is not affiliated with
                CHA or the City of Chicago. Always verify eligibility directly
                with housing providers.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            © {new Date().getFullYear()} Chicago Housing Helper. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
