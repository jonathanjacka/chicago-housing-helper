import { ExternalLink } from 'lucide-react';

const RESOURCES = [
  { name: 'Chicago Housing Authority', url: 'https://www.thecha.org' },
  { name: 'Chicago Dept. of Housing', url: 'https://www.chicago.gov/city/en/depts/doh.html' },
];

export function Footer() {
  return (
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
              {RESOURCES.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white inline-flex items-center gap-1"
                  >
                    {resource.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Disclaimer</h4>
            <p className="text-sm">
              This tool provides information only and is not affiliated with CHA
              or the City of Chicago. Always verify eligibility directly with
              housing providers.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} Chicago Housing Helper. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
