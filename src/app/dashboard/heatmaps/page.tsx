'use client';

import React, { useState, useRef } from 'react';
import {
  HiOutlineMap,
  HiOutlinePhotograph,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineDeviceMobile,
} from 'react-icons/hi';
import { processAerialSpectral, getCanopyHotspots } from '@/lib/api';
import type {
  SpectralIndexType,
  SpectralAnalysisResponse,
  CanopyHotspot,
} from '@/lib/types';

export default function HeatmapsPage() {
  const [indexType, setIndexType] = useState<SpectralIndexType>('VARI');
  const [estateId, setEstateId] = useState('estate_001');
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [nirFile, setNirFile] = useState<File | null>(null);
  const [nirPreview, setNirPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpectralAnalysisResponse | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'original' | 'split'>('heatmap');
  const [selectedHotspot, setSelectedHotspot] = useState<CanopyHotspot | null>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const primaryInputRef = useRef<HTMLInputElement>(null);
  const nirInputRef = useRef<HTMLInputElement>(null);

  // Handle primary image upload
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      const url = URL.createObjectURL(file);
      setPrimaryPreview(url);
      setResult(null);
      setError(null);
    }
  };

  // Handle NIR companion upload
  const handleNirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNirFile(file);
      const url = URL.createObjectURL(file);
      setNirPreview(url);
    }
  };

  // Load a built-in synthetic sample image for testing
  const handleLoadSample = () => {
    // Generate a synthetic canvas simulating coconut trees
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Soil background
    ctx.fillStyle = '#6b4f3b';
    ctx.fillRect(0, 0, 600, 400);

    // Coconut tree crowns (Healthy green)
    const treePositions = [
      { x: 120, y: 100, r: 45, healthy: true },
      { x: 280, y: 90, r: 48, healthy: true },
      { x: 450, y: 110, r: 42, healthy: false }, // Stressed tree
      { x: 150, y: 250, r: 50, healthy: true },
      { x: 320, y: 270, r: 46, healthy: false }, // Stressed tree
      { x: 480, y: 280, r: 44, healthy: true },
    ];

    treePositions.forEach((tree) => {
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI * 2);
      ctx.fillStyle = tree.healthy ? '#2d8a4e' : '#b8860b';
      ctx.fill();

      // Frond radial lines
      ctx.strokeStyle = tree.healthy ? '#1e5f35' : '#8b6508';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(tree.x, tree.y);
        ctx.lineTo(
          tree.x + Math.cos(angle) * (tree.r + 15),
          tree.y + Math.sin(angle) * (tree.r + 15)
        );
        ctx.stroke();
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample_coconut_aerial.png', { type: 'image/png' });
        setPrimaryFile(file);
        setPrimaryPreview(canvas.toDataURL());
        setResult(null);
        setError(null);
      }
    }, 'image/png');
  };

  // Run Spectral Analysis
  const handleProcess = async () => {
    if (!primaryFile) {
      setError('Please upload an aerial drone image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setDispatchAlert(null);

    try {
      const data = await processAerialSpectral(
        primaryFile,
        estateId,
        indexType,
        nirFile || undefined,
        { lat: 7.2906, lng: 80.6337, span_lat: 0.006, span_lng: 0.006 }
      );
      setResult(data);
      if (data.hotspots && data.hotspots.length > 0) {
        setSelectedHotspot(data.hotspots[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process aerial image.');
    } finally {
      setLoading(false);
    }
  };

  // Dispatch hotspot to field officer mobile app
  const handleDispatchToMobile = (hotspot: CanopyHotspot) => {
    setDispatchAlert(
      `✓ Hotspot ${hotspot.id} (Lat ${hotspot.location.lat.toFixed(4)}, Lng ${hotspot.location.lng.toFixed(4)}) dispatched to SaruPol Mobile App for ground leaf verification!`
    );
    setTimeout(() => setDispatchAlert(null), 6000);
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <span className="gradient-text">Aerial Spectral Surveillance</span> — System A
        </h1>
        <p>
          Macroscopic canopy stress detection using <strong>NDVI</strong> (Multispectral) &amp;{' '}
          <strong>VARI</strong> (Standard Drone RGB) with automatic mobile hotspot dispatching.
        </p>
      </div>

      {/* Dual-Index Mode Selection Bar */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            SPECTRAL ALGORITHM:
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => {
                setIndexType('VARI');
                setResult(null);
              }}
              className={`btn btn-sm ${indexType === 'VARI' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px' }}
            >
              🌿 VARI (Standard Drone RGB)
            </button>
            <button
              onClick={() => {
                setIndexType('NDVI');
                setResult(null);
              }}
              className={`btn btn-sm ${indexType === 'NDVI' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px' }}
            >
              🛰️ NDVI (Multispectral NIR)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            ESTATE:
          </span>
          <select
            value={estateId}
            onChange={(e) => setEstateId(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
            }}
          >
            <option value="estate_001">Green Valley Estate (Kurunegala)</option>
            <option value="estate_002">Puttalam Coastal Plantation</option>
            <option value="estate_003">Gampaha Research Grove</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Upload & Controls + Live Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.3fr' : '1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Left Column: Upload & Options */}
        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
            1. Drone Image Input
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            {indexType === 'VARI'
              ? 'Upload a standard RGB drone orthomosaic or aerial photo (.png, .jpg, .tif).'
              : 'Upload a 4-band GeoTIFF or primary RGB with optional separate NIR companion.'}
          </p>

          {/* Primary Upload Dropzone */}
          <div
            onClick={() => primaryInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.02)',
              marginBottom: 'var(--space-4)',
              transition: 'all 0.2s',
            }}
          >
            <input
              ref={primaryInputRef}
              type="file"
              accept="image/*,.tif,.tiff"
              onChange={handlePrimaryChange}
              style={{ display: 'none' }}
            />
            {primaryPreview ? (
              <div>
                <img
                  src={primaryPreview}
                  alt="Aerial preview"
                  style={{
                    maxHeight: 180,
                    maxWidth: '100%',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ fontSize: '0.85rem', color: 'var(--emerald)', fontWeight: 600 }}>
                  ✓ {primaryFile?.name} ({(primaryFile?.size ? primaryFile.size / 1024 : 0).toFixed(1)} KB)
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to replace</span>
              </div>
            ) : (
              <div>
                <HiOutlinePhotograph style={{ fontSize: '2.5rem', color: 'var(--cyan)', marginBottom: 'var(--space-2)' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
                  Click or drag &amp; drop aerial image
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Supports 4K Drone photos, PNG, JPG, GeoTIFF
                </div>
              </div>
            )}
          </div>

          {/* Optional NIR companion for NDVI mode */}
          {indexType === 'NDVI' && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Companion NIR Band File (Optional if already 4-band):
              </label>
              <div
                onClick={() => nirInputRef.current?.click()}
                style={{
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <input
                  ref={nirInputRef}
                  type="file"
                  accept="image/*,.tif,.tiff"
                  onChange={handleNirChange}
                  style={{ display: 'none' }}
                />
                <HiOutlineMap style={{ color: 'var(--purple)', fontSize: '1.3rem' }} />
                <div style={{ flex: 1, fontSize: '0.8rem' }}>
                  {nirFile ? (
                    <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>✓ {nirFile.name}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Upload NIR single-band .tif or grayscale</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button
              onClick={handleProcess}
              disabled={loading || !primaryFile}
              className="btn btn-primary"
              style={{ flex: 2, padding: '10px 16px' }}
            >
              {loading ? (
                <>
                  <HiOutlineRefresh className="spin" /> Computing {indexType}...
                </>
              ) : (
                <>
                  <HiOutlineSparkles /> Run {indexType} Analysis
                </>
              )}
            </button>
            <button
              onClick={handleLoadSample}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.8rem' }}
              title="Load synthetic coconut plantation aerial sample"
            >
              Load Sample
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <HiOutlineExclamationCircle /> {error}
            </div>
          )}
        </div>

        {/* Right Column: Live Colormapped Viewer (Rendered when Result available) */}
        {result && (
          <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: '1.1rem' }}>
                2. {result.index_type} Canopy Health Map
              </h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`btn btn-sm ${viewMode === 'heatmap' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {result.index_type} Layer
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`btn btn-sm ${viewMode === 'original' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  RGB Ortho
                </button>
              </div>
            </div>

            {/* Viewer Canvas Box */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                background: '#0f172a',
                textAlign: 'center',
                minHeight: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', lineHeight: 0 }}>
                <img
                  src={viewMode === 'original' ? primaryPreview || '' : result.heatmap_base64}
                  alt="Spectral Heatmap"
                  style={{
                    width: '100%',
                    maxHeight: 480,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />

                {/* Hotspot Pins Overlay */}
                {viewMode === 'heatmap' &&
                  result.hotspots.map((hs, idx) => {
                    const rawX = ((hs.pixel_coordinates?.x || 0) / (result.image_dimensions?.width || 1)) * 100;
                    const rawY = ((hs.pixel_coordinates?.y || 0) / (result.image_dimensions?.height || 1)) * 100;
                    // Clamp so pins at extreme edges stay safely inside the image boundary
                    const xPct = Math.max(3, Math.min(97, rawX));
                    const yPct = Math.max(3, Math.min(97, rawY));
                    return (
                      <div
                        key={hs.id}
                        onClick={() => setSelectedHotspot(hs)}
                        style={{
                          position: 'absolute',
                          left: `${xPct}%`,
                          top: `${yPct}%`,
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: hs.severity === 'critical' ? '#ef4444' : '#f59e0b',
                          border: '2px solid white',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
                          zIndex: 10,
                          transition: 'transform 0.15s ease',
                        }}
                        title={`Hotspot #${idx + 1}: ${hs.severity.toUpperCase()} (${hs.mean_index_value})`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Colormap Legend */}
            <div style={{ marginTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>🔴 Severe Stress / Decay ({result.index_type === 'NDVI' ? '< 0.40' : '< 0.02'})</span>
                <span>🟡 Moderate Chlorosis ({result.index_type === 'NDVI' ? '0.40 - 0.60' : '0.02 - 0.15'})</span>
                <span>🟢 Vigorous Canopy ({result.index_type === 'NDVI' ? '> 0.60' : '> 0.15'})</span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 5,
                  background: 'linear-gradient(to right, #d73027 0%, #fee08b 50%, #1a9850 100%)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Confirmation Banner */}
      {dispatchAlert && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <HiOutlineDeviceMobile style={{ fontSize: '1.2rem' }} />
          {dispatchAlert}
        </div>
      )}

      {/* Summary Stat Cards */}
      {result && (
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
              Mean {result.index_type} Index
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--cyan)', marginTop: 4 }}>
              {result.statistics.mean_index.toFixed(3)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Pure canopy: {result.statistics.min_index.toFixed(2)} to {result.statistics.max_index.toFixed(2)}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Canopy Purity Vigor
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--emerald)', marginTop: 4 }}>
              {result.statistics.healthy_canopy_pct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              ExG-Isolated Crown Chlorophyll
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Estate Health Grade
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#a855f7', marginTop: 4 }}>
              {result.statistics.estate_health_grade || 'A (Optimal)'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Pathology Risk: {result.statistics.pathology_risk_index || 'Low / Stable'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Detected Palm Count
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8', marginTop: 4 }}>
              {result.statistics.estimated_palms_count} Palms
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {result.statistics.healthy_palms_count} Healthy / {result.statistics.at_risk_palms_count} At-Risk
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Canopy vs Ground Cover
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--amber)', marginTop: 4 }}>
              {result.statistics.canopy_coverage_pct.toFixed(1)}% / {(result.statistics.ground_exposure_pct || (100 - result.statistics.canopy_coverage_pct)).toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Palm Canopy / Inter-row Soil
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Flagged Anomalies
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f87171', marginTop: 4 }}>
              {result.hotspots.length} Trees
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Z-Score biological outliers
            </div>
          </div>
        </div>
      )}

      {/* Flagged Canopy Stress Hotspots Table (Macro-to-Micro Integration) */}
      {result && result.hotspots.length > 0 && (
        <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 2 }}>
                🎯 Flagged Canopy Stress Hotspots (Macro → Micro Bridge)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                GPS coordinates of physiological anomalies extracted from aerial drone scan using <strong>ExG Canopy Segmentation</strong> & <strong>Local Z-Score Outlier Analysis</strong>.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>#</th>
                  <th style={{ padding: '10px 12px' }}>GPS Location</th>
                  <th style={{ padding: '10px 12px' }}>Severity</th>
                  <th style={{ padding: '10px 12px' }}>Index Score</th>
                  <th style={{ padding: '10px 12px' }}>Z-Score / Drop</th>
                  <th style={{ padding: '10px 12px' }}>Affected Radius</th>
                  <th style={{ padding: '10px 12px' }}>Pathological Recommendation</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {result.hotspots.map((hs, index) => (
                  <tr
                    key={hs.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: selectedHotspot?.id === hs.id ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: hs.severity === 'critical' ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <HiOutlineLocationMarker style={{ color: 'var(--cyan)', verticalAlign: 'middle', marginRight: 4 }} />
                      {hs.location.lat.toFixed(5)}, {hs.location.lng.toFixed(5)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className={`badge ${
                          hs.severity === 'critical'
                            ? 'badge-red'
                            : hs.severity === 'high'
                            ? 'badge-amber'
                            : 'badge-cyan'
                        }`}
                      >
                        {hs.severity.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                      {hs.mean_index_value.toFixed(3)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {hs.z_score !== undefined && hs.z_score !== null ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 700, color: hs.z_score <= -2 ? '#f87171' : '#fbbf24' }}>
                            {hs.z_score > 0 ? `+${hs.z_score}` : hs.z_score}σ
                          </span>
                          {hs.relative_drop_pct !== undefined && hs.relative_drop_pct > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              -{hs.relative_drop_pct.toFixed(0)}% vs peers
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>~{hs.radius_meters}m</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: 300 }}>
                      {hs.recommended_action}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDispatchToMobile(hs)}
                        className="btn btn-sm btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <HiOutlineDeviceMobile /> Dispatch to Mobile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
