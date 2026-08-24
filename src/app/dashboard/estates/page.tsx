'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineOfficeBuilding,
  HiOutlinePlus,
  HiOutlineMap,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
  HiOutlineSparkles,
} from 'react-icons/hi';

interface EstateRecord {
  id: string;
  name: string;
  location: string;
  province: string;
  hectares: number;
  detectedPalms: number;
  meanNdvi: number;
  meanVari: number;
  healthGrade: string;
  riskStatus: string;
  lastSurvey: string;
}

const INITIAL_ESTATES: EstateRecord[] = [
  {
    id: 'estate_001',
    name: 'Green Valley Commercial Block',
    location: 'Kurunegala',
    province: 'North Western Province',
    hectares: 2.2,
    detectedPalms: 238,
    meanNdvi: 0.572,
    meanVari: 0.103,
    healthGrade: 'A (Optimal)',
    riskStatus: 'Low / Healthy',
    lastSurvey: '2026-08-24',
  },
  {
    id: 'estate_002',
    name: 'Bandirippuwa Research Center (CRI)',
    location: 'Lunuwila',
    province: 'North Western Province',
    hectares: 6.5,
    detectedPalms: 812,
    meanNdvi: 0.624,
    meanVari: 0.128,
    healthGrade: 'A (Optimal)',
    riskStatus: 'Low / Healthy',
    lastSurvey: '2026-08-22',
  },
  {
    id: 'estate_003',
    name: 'Pallekele Coconut Genetic Block',
    location: 'Kundasale',
    province: 'Central Province',
    hectares: 3.8,
    detectedPalms: 456,
    meanNdvi: 0.491,
    meanVari: 0.072,
    healthGrade: 'B (Good)',
    riskStatus: 'Isolated Outliers',
    lastSurvey: '2026-08-20',
  },
];

export default function EstatesPage() {
  const [estates, setEstates] = useState<EstateRecord[]>(INITIAL_ESTATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEstate, setNewEstate] = useState({
    name: '',
    location: '',
    province: 'North Western Province',
    hectares: 3.0,
  });

  const handleAddEstate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEstate.name || !newEstate.location) return;

    const record: EstateRecord = {
      id: `estate_${Date.now().toString().slice(-4)}`,
      name: newEstate.name,
      location: newEstate.location,
      province: newEstate.province,
      hectares: Number(newEstate.hectares),
      detectedPalms: Math.round(Number(newEstate.hectares) * 115),
      meanNdvi: 0.55,
      meanVari: 0.09,
      healthGrade: 'A (Optimal)',
      riskStatus: 'Low / Healthy',
      lastSurvey: new Date().toISOString().split('T')[0],
    };

    setEstates([record, ...estates]);
    setShowAddModal(false);
    setNewEstate({ name: '', location: '', province: 'North Western Province', hectares: 3.0 });
  };

  const filteredEstates = estates.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPalms = estates.reduce((acc, curr) => acc + curr.detectedPalms, 0);
  const totalHectares = estates.reduce((acc, curr) => acc + curr.hectares, 0);

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>
            <span className="gradient-text">Estate Management</span> — System A
          </h1>
          <p>Register, monitor, and dispatch aerial UAV surveys across registered coconut plantations</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          Register Estate
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Registered Estates
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--cyan)', marginTop: 4 }}>
            {estates.length} Plantations
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Active UAV Coverage
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Monitored Canopy Area
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--emerald)', marginTop: 4 }}>
            {totalHectares.toFixed(1)} Ha
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            ~{(totalHectares * 2.471).toFixed(1)} Acres
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Palm Census
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8', marginTop: 4 }}>
            {totalPalms.toLocaleString()} Palms
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            EDT Topological Census
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Overall Health Grade
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#a855f7', marginTop: 4 }}>
            Grade A (Optimal)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Biosecurity Rating
          </div>
        </div>
      </div>

      {/* Estates Grid List */}
      <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HiOutlineOfficeBuilding style={{ fontSize: '1.3rem', color: 'var(--cyan)' }} />
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Registered Coconut Plantations</h2>
          </div>
          <input
            type="text"
            placeholder="Search by estate or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ maxWidth: 280, fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Estate Name</th>
                <th>Location / Province</th>
                <th>Acreage & Palms</th>
                <th>Latest Spectral (NDVI / VARI)</th>
                <th>Health Grade</th>
                <th>Last UAV Scan</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstates.map((est) => (
                <tr key={est.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{est.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {est.id}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                      <HiOutlineLocationMarker style={{ color: 'var(--cyan)' }} />
                      {est.location}, {est.province}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--cyan)' }}>{est.detectedPalms} Palms</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{est.hectares} Hectares</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>NDVI {est.meanNdvi.toFixed(3)}</span>
                      <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>•</span>
                      <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>VARI {est.meanVari.toFixed(3)}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${est.healthGrade.startsWith('A') ? 'badge-emerald' : 'badge-amber'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {est.healthGrade}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <HiOutlineCalendar />
                      {est.lastSurvey}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href="/dashboard/heatmaps"
                      className="btn btn-sm btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                    >
                      <HiOutlineMap style={{ fontSize: '0.9rem' }} />
                      Launch UAV Scan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Estate Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: 480,
              width: '100%',
              padding: 'var(--space-6)',
              position: 'relative',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)' }}>Register New Coconut Estate</h3>
            <form onSubmit={handleAddEstate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>
                  Estate / Plantation Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahaberiatenna Coconut Block"
                  value={newEstate.name}
                  onChange={(e) => setNewEstate({ ...newEstate, name: e.target.value })}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>
                    District / Town
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kurunegala"
                    value={newEstate.location}
                    onChange={(e) => setNewEstate({ ...newEstate, location: e.target.value })}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>
                    Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={newEstate.hectares}
                    onChange={(e) => setNewEstate({ ...newEstate, hectares: Number(e.target.value) })}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>
                  Province
                </label>
                <select
                  value={newEstate.province}
                  onChange={(e) => setNewEstate({ ...newEstate, province: e.target.value })}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value="North Western Province">North Western Province (Coconut Triangle)</option>
                  <option value="Western Province">Western Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Central Province">Central Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
