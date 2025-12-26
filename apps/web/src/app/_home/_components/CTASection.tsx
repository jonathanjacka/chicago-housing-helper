import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 bg-chicago-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Housing Options?
        </h2>
        <p className="text-chicago-blue-100 mb-8 text-lg">
          It only takes a few minutes to see what programs you may qualify for.
        </p>
        <Link
          href="/onboarding"
          className="btn-warm text-lg px-8 py-4 inline-flex items-center"
        >
          Get Started — It&apos;s Free
        </Link>
      </div>
    </section>
  );
}
