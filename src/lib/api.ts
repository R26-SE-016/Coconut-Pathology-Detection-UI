// ══════════════════════════════════════════════════════════════════════
// CocoCastAI — API Client for Cloud Functions
// ══════════════════════════════════════════════════════════════════════

import type {
  HeatmapResponse,
  DiagnosticHistoryResponse,
  SyncRequest,
  SyncResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

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

  const res = await fetch(`${API_BASE}/predict_mobile_disease`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}
