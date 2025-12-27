import { ExternalLink } from 'lucide-react';
import { DATA_SOURCES, ADDITIONAL_RESOURCES } from '../_constants/data-sources';

export function DataSources() {
  return (
    <section className="py-16 bg-white border-t">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Where Our Data Comes From
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          We aggregate information from official government sources to provide you with accurate, up-to-date housing program data.
        </p>

        <div className="space-y-4 mb-12">
          {DATA_SOURCES.map((source) => (
            <div
              key={source.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium bg-chicago-blue-100 text-chicago-blue-700 px-2 py-0.5 rounded">
                    {source.dataType}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">{source.name}</h3>
                <p className="text-sm text-gray-600">{source.description}</p>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-1 whitespace-nowrap"
              >
                Visit Source
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Resources
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {ADDITIONAL_RESOURCES.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <h4 className="font-medium text-gray-900 group-hover:text-chicago-blue-600 inline-flex items-center gap-1">
                {resource.name}
                <ExternalLink className="w-3 h-3" />
              </h4>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </a>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Data is automatically updated daily to ensure accuracy.
        </p>
      </div>
    </section>
  );
}
