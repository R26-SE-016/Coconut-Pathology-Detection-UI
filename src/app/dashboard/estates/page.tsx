'use client';

import {
  HiOutlineOfficeBuilding,
  HiOutlineLockClosed,
} from 'react-icons/hi';

export default function EstatesPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>
          <span className="gradient-text">Estate Management</span> — System A
        </h1>
        <p>Manage coconut plantation estates for UAV-based monitoring</p>
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
          <HiOutlineOfficeBuilding />
        </div>

        <span className="badge badge-cyan" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
          <HiOutlineLockClosed style={{ fontSize: '0.7rem' }} />
          Premium Feature — Coming Soon
        </span>

        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-3)' }}>
          Estate-Level Monitoring
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          This module will allow estate owners and researchers to register their coconut plantations,
          define geo-boundaries, upload drone orthomosaics, and track disease progression across their
          entire estate over time.
        </p>
      </div>
    </div>
  );
}
