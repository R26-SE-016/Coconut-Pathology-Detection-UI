'use client';

import {
  HiOutlineMap,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import DiseaseBadge from '@/components/DiseaseBadge';

export default function HeatmapsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>
          <span className="gradient-text">UAV Heatmaps</span> — System A
        </h1>
        <p>YOLOv11 + SAHI detection pipeline for high-resolution aerial orthomosaics</p>
      </div>

      {/* Coming Soon Banner */}
      <div
        className="glass-card-static"
        style={{
          padding: 'var(--space-12) var(--space-8)',
          textAlign: 'center',
          maxWidth: 700,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-5)',
            fontSize: '2rem',
            color: 'var(--cyan)',
          }}
        >
          <HiOutlineMap />
        </div>

        <span className="badge badge-cyan" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
          <HiOutlineLockClosed style={{ fontSize: '0.7rem' }} />
          Premium Feature — Coming Soon
        </span>

        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-3)' }}>
          Macroscopic UAV Analysis
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            maxWidth: 480,
            margin: '0 auto var(--space-6)',
            lineHeight: 1.7,
          }}
        >
          This module will process 4K drone orthomosaics through a SAHI-sliced YOLOv11 pipeline —
          detecting disease patterns across entire coconut estates. Designed for estate owners and
          agricultural researchers with access to UAV imagery.
        </p>

        {/* Planned detection classes */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div
            className="text-xs text-muted"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              marginBottom: 'var(--space-3)',
            }}
          >
            Planned Detection Classes
          </div>
          <div className="flex gap-2 justify-center" style={{ flexWrap: 'wrap' }}>
            <DiseaseBadge disease="v_cut" size="sm" />
            <DiseaseBadge disease="scorching" size="sm" />
            <DiseaseBadge disease="wilting" size="sm" />
          </div>
        </div>

        {/* Pipeline Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          {[
            { label: 'Model', value: 'YOLOv11' },
            { label: 'Slicing', value: 'SAHI 1024px' },
            { label: 'Region', value: 'asia-south1' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: 'var(--space-3)',
                background: 'rgba(148, 163, 184, 0.04)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-xs text-muted">{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
