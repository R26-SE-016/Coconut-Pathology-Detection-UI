'use client';

import { useState, useMemo } from 'react';
import { DEMO_DIAGNOSTICS } from '@/lib/demo-data';
import { DISEASE_COLORS } from '@/lib/types';
import DiseaseBadge from '@/components/DiseaseBadge';
import ConfidenceBar from '@/components/ConfidenceBar';
import dynamic from 'next/dynamic';

const DiagnosticMapInner = dynamic(() => import('@/components/DiagnosticMap'), { ssr: false });

export default function DiagnosticsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [filterDisease, setFilterDisease] = useState('all');

  const diseases = useMemo(() => {
    const set = new Set(DEMO_DIAGNOSTICS.map((d) => d.disease_class));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return DEMO_DIAGNOSTICS.filter((d) => {
      if (filterDisease !== 'all' && d.disease_class !== filterDisease) return false;
      return true;
    });
  }, [filterDisease]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>
              <span className="gradient-text">Diagnostic History</span>
            </h1>
            <p>All leaf scans from MobileNetV2 classification</p>
          </div>
          <div className="flex gap-2">
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode('map')}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ minWidth: 220 }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Filter by Disease
          </label>
          <select
            className="input"
            value={filterDisease}
            onChange={(e) => setFilterDisease(e.target.value)}
          >
            <option value="all">All Diseases</option>
            {diseases.map((d) => (
              <option key={d} value={d}>
                {DISEASE_COLORS[d]?.label || d}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <span className="badge badge-green">{filtered.length} results</span>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="glass-card-static" style={{ padding: 'var(--space-4)', overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Disease</th>
                <th>Confidence</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {d.captured_at
                      ? new Date(d.captured_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td>
                    <DiseaseBadge disease={d.disease_class} />
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <ConfidenceBar value={d.confidence} />
                  </td>
                  <td className="text-sm text-muted">
                    {d.location.lat.toFixed(4)}, {d.location.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card-static" style={{ padding: 'var(--space-4)' }}>
          <DiagnosticMapInner diagnostics={filtered} />
        </div>
      )}
    </div>
  );
}
