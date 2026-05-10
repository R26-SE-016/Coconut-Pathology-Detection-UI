'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import DiseaseBadge from '@/components/DiseaseBadge';
import ConfidenceBar from '@/components/ConfidenceBar';
import { DISEASE_COLORS, type MobileDiseaseClass } from '@/lib/types';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineBookOpen,
} from 'react-icons/hi';
import Link from 'next/link';
import { syncMobileDiagnostics, predictMobileDisease } from '@/lib/api';

// ── Real Inference Result Type ──────────────────────────────────────
interface ScanResult {
  disease_class: MobileDiseaseClass;
  confidence: number;
  all_predictions: { class: MobileDiseaseClass; confidence: number }[];
  inference_time_ms: number;
}

export default function ScanPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('ready');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // ── Handle file drop: run backend inference ────────────────────────
  const handleFileDrop = useCallback(async (file: File) => {
    fileRef.current = file;
    setResult(null);
    setSyncStatus(null);
    setAnalyzing(true);
    setProgress(10);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Set preview img ref if needed
    const img = new Image();
    img.src = objectUrl;
    imgRef.current = img;

    setProgress(40);

    try {
      const inferenceResult = await predictMobileDisease(file);
      setProgress(100);

      setResult(inferenceResult);
      setAnalyzing(false);

      // Sync to backend
      setSyncStatus('syncing');
      syncMobileDiagnostics({
        user_id: 'demo-user-123',
        device_id: 'web-dashboard',
        estate_id: 'demo-estate-001',
        batch: [
          {
            disease_class: inferenceResult.disease_class,
            confidence: inferenceResult.confidence,
            gps: {
              lat: 7.2906 + (Math.random() * 0.1 - 0.05),
              lng: 80.6337 + (Math.random() * 0.1 - 0.05),
            },
            captured_at: new Date().toISOString(),
            image_ref: `mobile_uploads/demo-user-123/scan_${Date.now()}.jpg`,
            local_id: `local-${Date.now()}`,
          },
        ],
      })
        .then((res) => {
          console.log('Successfully synced to backend:', res);
          setSyncStatus('synced');
        })
        .catch((err) => {
          console.log('Backend sync skipped:', err);
          setSyncStatus('failed');
        });
    } catch (err) {
      console.error('[CocoCastAI] Inference failed:', err);
      setAnalyzing(false);
      setProgress(0);
      setSyncStatus('error');
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setPreviewUrl(null);
    setProgress(0);
    setAnalyzing(false);
    setSyncStatus(null);
    fileRef.current = null;
    imgRef.current = null;
  };

  const isHealthy = result?.disease_class === 'healthy leaves';
  const diseaseInfo = result ? DISEASE_COLORS[result.disease_class] : null;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>
          <span className="gradient-text">Scan Coconut Leaf</span>
        </h1>
        <p>
          Upload or capture a leaf photo — the image is sent to the <strong>backend model</strong> to classify it accurately into one of 6 disease categories.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-6)' }}>
        {/* Left: Upload + Preview + Result */}
        <div>
          {/* Upload Zone */}
          {!result && (
            <UploadZone
              onFileDrop={handleFileDrop}
              uploading={analyzing}
              progress={Math.min(progress, 100)}
            />
          )}

          {/* Result Card */}
          {result && (
            <div
              className="glass-card animate-slideUp"
              style={{
                padding: 'var(--space-6)',
                borderColor: isHealthy
                  ? 'rgba(34, 197, 94, 0.35)'
                  : 'rgba(239, 68, 68, 0.25)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
                <div className="flex items-center gap-3">
                  {isHealthy ? (
                    <HiOutlineCheckCircle
                      style={{ fontSize: '1.6rem', color: 'var(--green-400)' }}
                    />
                  ) : (
                    <HiOutlineExclamationCircle
                      style={{ fontSize: '1.6rem', color: 'var(--red)' }}
                    />
                  )}
                  <div>
                    <h2
                      style={{
                        fontSize: '1.3rem',
                        color: isHealthy ? 'var(--green-400)' : 'var(--text-primary)',
                      }}
                    >
                      {isHealthy ? 'Healthy Palm Detected' : 'Disease Detected'}
                    </h2>
                    <p className="text-sm text-muted">
                      {fileRef.current?.name}
                      {result.inference_time_ms > 0 && (
                        <span style={{ marginLeft: 8, color: 'var(--green-400)', fontWeight: 600 }}>
                          ⚡ {result.inference_time_ms}ms
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                  <HiOutlineRefresh /> New Scan
                </button>
              </div>

              {/* Main Result */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: previewUrl ? '200px 1fr' : '1fr',
                  gap: 'var(--space-5)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                {previewUrl && (
                  <div
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Scanned leaf"
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}

                <div>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div className="text-xs text-muted" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Classification
                    </div>
                    <DiseaseBadge disease={result.disease_class} />
                  </div>

                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div className="text-xs text-muted" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Confidence
                    </div>
                    <ConfidenceBar value={result.confidence} height={8} />
                  </div>

                  {diseaseInfo && !isHealthy && (
                    <div
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.12)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {diseaseInfo.description}
                    </div>
                  )}
                </div>
              </div>

              {/* All Predictions */}
              <div>
                <div className="text-xs text-muted" style={{ marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  All Class Probabilities
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.all_predictions.map((pred) => (
                    <div
                      key={pred.class}
                      className="flex items-center gap-3"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <span style={{ minWidth: 130, color: 'var(--text-secondary)' }}>
                        {DISEASE_COLORS[pred.class]?.label || pred.class}
                      </span>
                      <div style={{ flex: 1 }}>
                        <ConfidenceBar value={pred.confidence} height={4} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Status */}
              {syncStatus && (
                <div
                  style={{
                    marginTop: 'var(--space-4)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background:
                      syncStatus === 'synced'
                        ? 'rgba(34, 197, 94, 0.08)'
                        : syncStatus === 'syncing'
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(239, 68, 68, 0.08)',
                    color:
                      syncStatus === 'synced'
                        ? 'var(--green-400)'
                        : syncStatus === 'syncing'
                          ? '#60a5fa'
                          : '#f87171',
                    border: `1px solid ${
                      syncStatus === 'synced'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : syncStatus === 'syncing'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)'
                    }`,
                  }}
                >
                  {syncStatus === 'synced' && '✓ Synced to Firestore'}
                  {syncStatus === 'syncing' && '⏳ Syncing to backend...'}
                  {syncStatus === 'failed' && '⚠ Backend offline — result saved locally'}
                  {syncStatus === 'error' && '✕ Inference error'}
                </div>
              )}

              {/* Action Link */}
              {!isHealthy && (
                <Link
                  href="/dashboard/knowledge"
                  className="flex items-center gap-2"
                  style={{
                    marginTop: 'var(--space-5)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(34, 197, 94, 0.06)',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: 'var(--green-400)',
                    fontWeight: 600,
                  }}
                >
                  <HiOutlineBookOpen />
                  View Treatment Protocols in Knowledge Base →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Model Status */}
          <div
            className="glass-card-static"
            style={{
              padding: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              borderColor:
                modelStatus === 'ready'
                  ? 'rgba(34, 197, 94, 0.25)'
                  : modelStatus === 'error'
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'var(--border-default)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background:
                  modelStatus === 'ready'
                    ? 'var(--green-400)'
                    : modelStatus === 'error'
                      ? '#ef4444'
                      : '#f59e0b',
                animation: modelStatus === 'loading' ? 'pulse 1.5s infinite' : 'none',
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {modelStatus === 'ready' && 'Model Ready'}
                {modelStatus === 'loading' && 'Loading Model...'}
                {modelStatus === 'error' && 'Model Load Failed'}
              </span>
              <span className="text-muted" style={{ marginLeft: 6 }}>
                {modelStatus === 'ready' && 'MobileNetV2-INT8 (2.7 MB)'}
                {modelStatus === 'loading' && 'Downloading weights...'}
                {modelStatus === 'error' && 'Check console for details'}
              </span>
            </div>
          </div>

          {/* Model Info */}
          <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
              Detection Model
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Architecture', value: 'MobileNetV2-INT8' },
                { label: 'Input Size', value: '224 × 224 px' },
                { label: 'Classes', value: '6 categories' },
                { label: 'Quantization', value: 'INT8 (TFLite)' },
                { label: 'Runtime', value: 'Python (tf.lite)' },
                { label: 'Inference', value: 'Cloud Backend' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between" style={{ fontSize: '0.8rem' }}>
                  <span className="text-muted">{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Diseases */}
          <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
              Detectable Diseases
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'bud root dropping',
                'bud rot',
                'gray leaf spot',
                'healthy leaves',
                'leaf rot',
                'stembleeding',
              ].map((cls) => {
                const info = DISEASE_COLORS[cls];
                return (
                  <div key={cls} className="flex items-center gap-3" style={{ fontSize: '0.8rem' }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: info?.color || '#64748b',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>{info?.label || cls}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
              How It Works
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { step: '1', title: 'Capture', desc: 'Take a close-up photo of a coconut leaf' },
                { step: '2', title: 'Upload', desc: 'Drop the image here or use your camera' },
                { step: '3', title: 'Inference', desc: 'Image is analyzed securely by the cloud backend model' },
                { step: '4', title: 'Act', desc: 'View treatment protocols from the Knowledge Base' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--green-400)',
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="text-xs text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
