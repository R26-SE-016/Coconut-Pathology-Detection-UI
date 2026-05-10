// ══════════════════════════════════════════════════════════════════════
// CocoCastAI — TypeScript Interfaces (mirrors Firestore schema)
// ══════════════════════════════════════════════════════════════════════

// ── Shared ──────────────────────────────────────────────────────────

export type UserRole = 'field_officer' | 'manager' | 'admin';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type DiagnosticSource = 'mobile_v2' | 'uav_yolo';

// System A (YOLOv11) classes
export type UAVDiseaseClass = 'v_cut' | 'scorching' | 'wilting';

// System B (MobileNetV2) classes
export type MobileDiseaseClass =
  | 'bud root dropping'
  | 'bud rot'
  | 'gray leaf spot'
  | 'healthy leaves'
  | 'leaf rot'
  | 'stembleeding';

export type DiseaseClass = UAVDiseaseClass | MobileDiseaseClass;

// ── Collections ─────────────────────────────────────────────────────

export interface User {
  id?: string;
  display_name: string;
  email: string;
  role: UserRole;
  estate_id: string;
  region_id: string;
  device_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoBounds {
  ne: GeoPoint;
  sw: GeoPoint;
}

export interface Estate {
  id?: string;
  name: string;
  region_id: string;
  geo_bounds?: GeoBounds;
  area_hectares?: number;
  manager_ids?: string[];
  owner_id?: string;
  created_at?: string;
}

export interface Diagnostic {
  id?: string;
  user_id: string;
  device_id?: string;
  estate_id: string;
  disease_class: DiseaseClass;
  confidence: number;
  location: GeoPoint;
  source: DiagnosticSource;
  image_ref?: string;
  local_id?: string;
  captured_at?: string;
  synced_at?: string;
  created_at?: string;
}

export interface Detection {
  bbox: number[]; // [x_min, y_min, x_max, y_max]
  class: string;
  confidence: number;
  category_id: number;
}

export interface ClassSummary {
  count: number;
  mean_confidence: number;
  max_confidence: number;
}

export interface Heatmap {
  id?: string;
  estate_id: string;
  image_ref: string;
  image_dimensions: {
    width: number;
    height: number;
  };
  detections: Detection[];
  summary: {
    total: number;
    by_class: Record<string, ClassSummary>;
  };
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

export interface KnowledgeEntry {
  id?: string;
  common_name: string;
  scientific_name: string;
  symptoms: string[];
  treatment_protocols: string[];
  vernacular_advice?: string;
  severity_level: SeverityLevel;
  source?: string;
}

// ── API Request/Response Types ──────────────────────────────────────

export interface SyncBatchItem {
  disease_class: string;
  confidence: number;
  gps: GeoPoint;
  captured_at: string;
  image_ref?: string;
  local_id?: string;
}

export interface SyncRequest {
  user_id: string;
  device_id: string;
  estate_id: string;
  batch: SyncBatchItem[];
}

export interface SyncResponse {
  synced_count: number;
  failed_ids: string[];
  server_timestamp: string;
}

export interface HeatmapResponse {
  estate_id: string;
  heatmaps: Heatmap[];
}

export interface DiagnosticHistoryResponse {
  user_id: string;
  count: number;
  diagnostics: Diagnostic[];
}

// ── Disease Metadata ────────────────────────────────────────────────

export interface DiseaseInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const DISEASE_COLORS: Record<string, DiseaseInfo> = {
  // Mobile (System B) — Custom Trained Model Classes
  'bud root dropping': {
    label: 'Bud Root Dropping',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Advanced bud rot symptom: drooping and dropping of central spindle',
  },
  'bud rot': {
    label: 'Bud Rot',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    description: 'Fatal fungal disease (Phytophthora palmivora) attacking the terminal bud',
  },
  'gray leaf spot': {
    label: 'Gray Leaf Spot',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    description: 'Foliar disease with greyish-white spots and brown margins',
  },
  'healthy leaves': {
    label: 'Healthy',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    description: 'Non-diseased healthy palm tissue',
  },
  'leaf rot': {
    label: 'Leaf Rot',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    description: 'Fungal infection causing rotting and shriveling of younger leaflets',
  },
  'stembleeding': {
    label: 'Stem Bleeding',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    description: 'Thielaviopsis paradoxa infection: oozing dark liquid from trunk',
  },
  // UAV (System A)
  v_cut: {
    label: 'V-Cut',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'V-shaped leaf cutting pattern',
  },
  scorching: {
    label: 'Scorching',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    description: 'Leaf scorching damage',
  },
  wilting: {
    label: 'Wilting',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    description: 'Crown wilting symptom',
  },
};
