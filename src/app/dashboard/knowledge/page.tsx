'use client';

import { useState } from 'react';
import { DEMO_KNOWLEDGE } from '@/lib/demo-data';
import {
  HiOutlineSearch,
  HiOutlineExclamationCircle,
  HiOutlineBeaker,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const SEVERITY_BADGE: Record<string, { color: string; bg: string }> = {
  low: { color: 'var(--green-400)', bg: 'rgba(34, 197, 94, 0.12)' },
  medium: { color: 'var(--amber)', bg: 'rgba(234, 179, 8, 0.12)' },
  high: { color: 'var(--orange)', bg: 'rgba(249, 115, 22, 0.12)' },
  critical: { color: 'var(--red)', bg: 'rgba(239, 68, 68, 0.12)' },
};

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = DEMO_KNOWLEDGE.filter(
    (k) =>
      k.common_name.toLowerCase().includes(search.toLowerCase()) ||
      k.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
      k.symptoms.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>
          <span className="gradient-text">Knowledge Base</span>
        </h1>
        <p>Coconut pathology reference from the Coconut Research Institute of Sri Lanka</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 'var(--space-6)' }}>
        <HiOutlineSearch
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
          }}
        />
        <input
          className="input"
          placeholder="Search diseases, symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.map((entry) => {
          const sev = SEVERITY_BADGE[entry.severity_level];
          const isExpanded = expanded === entry.id;

          return (
            <div
              key={entry.id}
              className="glass-card"
              style={{
                padding: 'var(--space-5)',
                cursor: 'pointer',
                borderColor: isExpanded ? 'var(--border-accent)' : undefined,
              }}
              onClick={() => setExpanded(isExpanded ? null : entry.id!)}
            >
              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: isExpanded ? 'var(--space-4)' : 0 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>
                    {entry.common_name}
                  </h3>
                  <div className="text-xs text-muted" style={{ fontStyle: 'italic' }}>
                    {entry.scientific_name}
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: sev.bg,
                    color: sev.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {entry.severity_level}
                </span>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div
                  className="animate-fadeIn"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-5)',
                    marginTop: 'var(--space-2)',
                  }}
                >
                  {/* Symptoms */}
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                      <HiOutlineExclamationCircle style={{ color: 'var(--orange)' }} />
                      <h4 style={{ fontSize: '0.85rem' }}>Symptoms</h4>
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {entry.symptoms.map((s, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            paddingLeft: 14,
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: 'var(--text-muted)',
                            }}
                          >
                            •
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                      <HiOutlineBeaker style={{ color: 'var(--green-400)' }} />
                      <h4 style={{ fontSize: '0.85rem' }}>Treatment Protocols</h4>
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {entry.treatment_protocols.map((t, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            paddingLeft: 14,
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: 'var(--green-400)',
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}.
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advisory note */}
                  {entry.vernacular_advice && (
                    <div
                      style={{
                        gridColumn: '1 / -1',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'rgba(34, 197, 94, 0.04)',
                        border: '1px solid rgba(34, 197, 94, 0.1)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                        <HiOutlineShieldCheck style={{ color: 'var(--green-400)', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-400)' }}>
                          Advisory Note
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {entry.vernacular_advice}
                      </p>
                    </div>
                  )}

                  {entry.source && (
                    <div className="text-xs text-muted" style={{ gridColumn: '1 / -1' }}>
                      Source: {entry.source}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
