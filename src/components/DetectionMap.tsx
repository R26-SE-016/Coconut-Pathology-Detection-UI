'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Heatmap, GeoBounds } from '@/lib/types';
import { DISEASE_COLORS } from '@/lib/types';

interface DetectionMapProps {
  heatmap: Heatmap;
  bounds: GeoBounds;
}

export default function DetectionMap({ heatmap, bounds }: DetectionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const center: [number, number] = [
      (bounds.ne.lat + bounds.sw.lat) / 2,
      (bounds.ne.lng + bounds.sw.lng) / 2,
    ];

    const map = L.map(mapRef.current, {
      center,
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO',
      maxZoom: 19,
    }).addTo(map);

    // Draw estate bounds
    L.rectangle(
      [
        [bounds.sw.lat, bounds.sw.lng],
        [bounds.ne.lat, bounds.ne.lng],
      ],
      {
        color: '#22c55e',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.05,
        dashArray: '8 4',
      }
    ).addTo(map);

    // Place detections as markers within the estate bounds
    const latRange = bounds.ne.lat - bounds.sw.lat;
    const lngRange = bounds.ne.lng - bounds.sw.lng;

    heatmap.detections.forEach((det) => {
      const relX = det.bbox[0] / heatmap.image_dimensions.width;
      const relY = det.bbox[1] / heatmap.image_dimensions.height;

      const lat = bounds.ne.lat - relY * latRange;
      const lng = bounds.sw.lng + relX * lngRange;

      const info = DISEASE_COLORS[det.class];
      const color = info?.color || '#64748b';

      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:140px">
          <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;color:${color}">
            ${info?.label || det.class}
          </div>
          <div style="font-size:0.75rem;color:#94a3b8">
            Confidence: <strong style="color:#f1f5f9">${(det.confidence * 100).toFixed(1)}%</strong>
          </div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:2px">
            bbox: [${det.bbox.map((b) => Math.round(b)).join(', ')}]
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
  }, [heatmap, bounds]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: 480,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    />
  );
}
