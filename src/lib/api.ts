// ══════════════════════════════════════════════════════════════════════
// CocoCastAI — API Client for Cloud Functions
// ══════════════════════════════════════════════════════════════════════

import type {
  HeatmapResponse,
  DiagnosticHistoryResponse,
  SyncRequest,
  SyncResponse,
} from './types';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5001/coconut-pathology-detection/asia-south1';
const API_BASE = RAW_API_BASE.replace('localhost', '127.0.0.1');

// ── Helpers ─────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ── System A — UAV Heatmaps ─────────────────────────────────────────

export async function getEstateHeatmap(
  estateId: string,
  limit = 10
): Promise<HeatmapResponse> {
  const params = new URLSearchParams({ estate_id: estateId, limit: String(limit) });
  return apiFetch<HeatmapResponse>(
    `${API_BASE}/get_estate_heatmap?${params}`
  );
}

// ── System B — Mobile Diagnostics ───────────────────────────────────

export async function syncMobileDiagnostics(
  payload: SyncRequest
): Promise<SyncResponse> {
  return apiFetch<SyncResponse>(`${API_BASE}/sync_mobile_diagnostics`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getDiagnosticHistory(
  userId: string,
  estateId?: string,
  limit = 50
): Promise<DiagnosticHistoryResponse> {
  const params = new URLSearchParams({ user_id: userId, limit: String(limit) });
  if (estateId) params.set('estate_id', estateId);
  return apiFetch<DiagnosticHistoryResponse>(
    `${API_BASE}/get_diagnostic_history?${params}`
  );
}

export async function predictMobileDisease(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('image', file);

  const url = `${API_BASE.replace(/\/$/, '')}/predict_mobile_disease`;
  
  console.log(`[CocoCastAI] Calling backend inference: ${url}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      // Note: Do NOT set Content-Type header when using FormData
    });

    if (!res.ok) {
      let errorDetail = '';
      try {
        const body = await res.json();
        errorDetail = body.error || JSON.stringify(body);
      } catch (e) {
        errorDetail = `Status ${res.status}`;
      }
      throw new Error(`Backend API error: ${errorDetail}`);
    }

    return res.json();
  } catch (err: any) {
    console.error(`[CocoCastAI] API call failed for ${url}:`, err);
    
    if (err.message.includes('Failed to fetch')) {
      throw new Error(
        `Unable to reach the backend at ${url}. ` +
        `Check if the Firebase Functions emulator is running (firebase emulators:start) ` +
        `and that CORS is enabled in the function.`
      );
    }
    throw err;
  }
}

// ── System A — Aerial Spectral Analysis (NDVI & VARI) ───────────────

import type {
  SpectralIndexType,
  SpectralAnalysisResponse,
  CanopyHotspotsResponse,
  CanopyHotspot,
} from './types';

export async function processAerialSpectral(
  imageFile: File,
  estateId: string = 'estate_001',
  indexType: SpectralIndexType = 'VARI',
  nirFile?: File,
  gpsBounds?: { lat: number; lng: number; span_lat: number; span_lng: number }
): Promise<SpectralAnalysisResponse> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('estate_id', estateId);
  formData.append('index_type', indexType);

  if (nirFile) {
    formData.append('nir_image', nirFile);
  }
  if (gpsBounds) {
    formData.append('gps_bounds', JSON.stringify(gpsBounds));
  }

  const url = `${API_BASE.replace(/\/$/, '')}/process_aerial_spectral`;
  console.log(`[CocoCastAI] Calling aerial spectral processing: ${url} (mode: ${indexType})`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errorDetail = '';
      try {
        const body = await res.json();
        errorDetail = body.error || JSON.stringify(body);
      } catch (e) {
        errorDetail = `Status ${res.status}`;
      }
      throw new Error(`Spectral API error: ${errorDetail}`);
    }

    return res.json();
  } catch (err: any) {
    console.error(`[CocoCastAI] Spectral analysis API call failed for ${url}:`, err);
    throw err;
  }
}

export async function getCanopyHotspots(
  estateId: string,
  status?: string,
  limit = 50
): Promise<CanopyHotspotsResponse> {
  const params = new URLSearchParams({ estate_id: estateId, limit: String(limit) });
  if (status) params.set('status', status);

  return apiFetch<CanopyHotspotsResponse>(
    `${API_BASE}/get_canopy_hotspots?${params}`
  );
}

export async function updateHotspotStatus(
  hotspotId: string,
  status: 'pending' | 'inspected' | 'resolved',
  leafDiagnosticId?: string
): Promise<{ success: boolean; hotspot_id: string; status: string }> {
  return apiFetch<{ success: boolean; hotspot_id: string; status: string }>(
    `${API_BASE}/update_hotspot_status`,
    {
      method: 'POST',
      body: JSON.stringify({
        hotspot_id: hotspotId,
        status,
        leaf_diagnostic_id: leafDiagnosticId,
      }),
    }
  );
}


