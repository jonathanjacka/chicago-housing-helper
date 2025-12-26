import Link from 'next/link';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  titleIcon?: ReactNode;
  subtitle?: string;
  backLink?: {
    href: string;
    label: string;
  };
}

export function PageHeader({ title, titleIcon, subtitle, backLink }: PageHeaderProps) {
  return (
    <>
      {/* Navigation Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-chicago-blue-600 font-semibold">
            Chicago Housing Helper
          </Link>
          {backLink && (
            <Link href={backLink.href} className="btn-secondary text-sm py-2 px-4">
              ← {backLink.label}
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-chicago-blue-600 to-chicago-blue-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
            {titleIcon}
            {title}
          </h1>
          {subtitle && <p className="text-chicago-blue-100">{subtitle}</p>}
        </div>
      </section>
    </>
  );
}
