import { ExternalLink, Code, Mail, LucideIcon } from 'lucide-react';
import { FOOTER_RESOURCES, PROJECT_LINKS } from '../_constants/footer-links';

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  mail: Mail,
};

export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">
              Chicago Housing Helper
            </h3>
            <p className="text-sm mb-4">
              A free, open source, public service to help Chicago residents find affordable
              housing options.
            </p>
            <ul className="space-y-2 text-sm">
              {PROJECT_LINKS.map((link) => {
                const Icon = ICON_MAP[link.iconName];
                const isExternal = link.url.startsWith('http');
                return (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white inline-flex items-center gap-1"
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                      {isExternal && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_RESOURCES.map((resource) => (
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
