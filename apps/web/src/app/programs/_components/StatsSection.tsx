'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, Clock, TrendingUp } from 'lucide-react';

interface ProgramStats {
  total: number;
  programTypes: Record<string, number>;
  openWaitlists: number;
  lastUpdated: string;
}

export function StatsSection() {
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-chicago-blue-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-48 bg-white/20 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      icon: Building2,
      value: stats.total.toLocaleString(),
      label: 'Housing Programs',
    },
    {
      icon: Clock,
      value: stats.openWaitlists.toLocaleString(),
      label: 'Open Waitlists',
    },
    {
      icon: TrendingUp,
      value: (stats.programTypes['LIHTC'] || 0).toLocaleString(),
      label: 'LIHTC Properties',
    },
    {
      icon: Users,
      value: (stats.programTypes['ARO'] || 0).toLocaleString(),
      label: 'ARO Units',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-chicago-blue-600 to-chicago-blue-500 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold text-center mb-8 text-white/90">
          Our Database at a Glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="text-sm text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
