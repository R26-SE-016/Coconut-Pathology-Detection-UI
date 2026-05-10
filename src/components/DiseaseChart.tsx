'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DISEASE_COLORS } from '@/lib/types';
import type { Diagnostic } from '@/lib/types';

interface DiseaseChartProps {
  diagnostics: Diagnostic[];
  title?: string;
}

export default function DiseaseChart({ diagnostics, title = 'Disease Distribution' }: DiseaseChartProps) {
  // Aggregate counts by disease class
  const counts: Record<string, number> = {};
  diagnostics.forEach((d) => {
    counts[d.disease_class] = (counts[d.disease_class] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name: DISEASE_COLORS[name]?.label || name,
    value,
    color: DISEASE_COLORS[name]?.color || '#64748b',
    key: name,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card-static" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
        <p className="text-muted">No diagnostic data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
      <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-4)' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <div style={{ width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.color,
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
