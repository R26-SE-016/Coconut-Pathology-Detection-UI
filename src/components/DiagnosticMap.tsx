'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Diagnostic } from '@/lib/types';
import { DISEASE_COLORS } from '@/lib/types';

interface DiagnosticMapProps {
  diagnostics: Diagnostic[];
}

export default function DiagnosticMap({ diagnostics }: DiagnosticMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Find center from data
    if (diagnostics.length === 0) return;

    const lats = diagnostics.map((d) => d.location.lat);
    const lngs = diagnostics.map((d) => d.location.lng);
    const center: [number, number] = [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ];

    const map = L.map(mapRef.current, {
      center,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO',
      maxZoom: 19,
    }).addTo(map);

    diagnostics.forEach((d) => {
      const info = DISEASE_COLORS[d.disease_class];
      const color = info?.color || '#64748b';

      const marker = L.circleMarker([d.location.lat, d.location.lng], {
        radius: 7,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.5,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:150px">
          <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;color:${color}">
            ${info?.label || d.disease_class}
          </div>
          <div style="font-size:0.75rem;color:#94a3b8">
            Confidence: <strong style="color:#f1f5f9">${(d.confidence * 100).toFixed(1)}%</strong>
          </div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:4px">
            ${d.captured_at ? new Date(d.captured_at).toLocaleString() : '—'}
          </div>
        </div>`
      );
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [diagnostics]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: 500,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    />
  );
}
