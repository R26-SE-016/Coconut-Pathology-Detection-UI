// ══════════════════════════════════════════════════════════════════════
// CocoCastAI — Demo/Mock Data for Development
// Provides realistic data when backend is not available
// ══════════════════════════════════════════════════════════════════════

import type { Diagnostic, Heatmap, Estate, KnowledgeEntry } from './types';

// ── Estates ─────────────────────────────────────────────────────────

export const DEMO_ESTATES: Estate[] = [
  {
    id: 'estate_001',
    name: 'Madurankuliya Coconut Estate',
    region_id: 'north_western',
    area_hectares: 142,
    geo_bounds: { ne: { lat: 7.545, lng: 79.852 }, sw: { lat: 7.520, lng: 79.828 } },
    manager_ids: ['mgr_001'],
    created_at: '2025-11-15T08:00:00Z',
  },
  {
    id: 'estate_002',
    name: 'Lunuwila Plantation',
    region_id: 'north_western',
    area_hectares: 89,
    geo_bounds: { ne: { lat: 7.360, lng: 79.865 }, sw: { lat: 7.340, lng: 79.845 } },
    manager_ids: ['mgr_002'],
    created_at: '2025-12-01T08:00:00Z',
  },
  {
    id: 'estate_003',
    name: 'Kurunegala Royal Estate',
    region_id: 'north_western',
    area_hectares: 215,
    geo_bounds: { ne: { lat: 7.498, lng: 80.372 }, sw: { lat: 7.475, lng: 80.350 } },
    manager_ids: ['mgr_003'],
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'estate_004',
    name: 'Matale Hilltop Farm',
    region_id: 'central',
    area_hectares: 56,
    geo_bounds: { ne: { lat: 7.478, lng: 80.635 }, sw: { lat: 7.460, lng: 80.618 } },
    manager_ids: ['mgr_004'],
    created_at: '2026-02-20T08:00:00Z',
  },
];

// ── Diagnostics ─────────────────────────────────────────────────────

export const DEMO_DIAGNOSTICS: Diagnostic[] = [
  {
    id: 'diag_001',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'bud root dropping',
    confidence: 0.94,
    location: { lat: 7.535, lng: 79.840 },
    source: 'mobile_v2',
    captured_at: '2026-05-10T09:15:00Z',
    synced_at: '2026-05-10T09:16:00Z',
    created_at: '2026-05-10T09:16:00Z',
  },
  {
    id: 'diag_002',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'healthy leaves',
    confidence: 0.98,
    location: { lat: 7.530, lng: 79.835 },
    source: 'mobile_v2',
    captured_at: '2026-05-10T09:20:00Z',
    synced_at: '2026-05-10T09:21:00Z',
    created_at: '2026-05-10T09:21:00Z',
  },
  {
    id: 'diag_003',
    user_id: 'user_demo',
    device_id: 'device_002',
    estate_id: 'estate_002',
    disease_class: 'bud rot',
    confidence: 0.87,
    location: { lat: 7.350, lng: 79.855 },
    source: 'mobile_v2',
    captured_at: '2026-05-09T14:30:00Z',
    synced_at: '2026-05-09T14:31:00Z',
    created_at: '2026-05-09T14:31:00Z',
  },
  {
    id: 'diag_004',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'leaf rot',
    confidence: 0.76,
    location: { lat: 7.528, lng: 79.842 },
    source: 'mobile_v2',
    captured_at: '2026-05-09T10:45:00Z',
    synced_at: '2026-05-09T10:46:00Z',
    created_at: '2026-05-09T10:46:00Z',
  },
  {
    id: 'diag_005',
    user_id: 'user_demo',
    device_id: 'device_003',
    estate_id: 'estate_003',
    disease_class: 'gray leaf spot',
    confidence: 0.91,
    location: { lat: 7.485, lng: 80.360 },
    source: 'mobile_v2',
    captured_at: '2026-05-08T16:00:00Z',
    synced_at: '2026-05-08T16:01:00Z',
    created_at: '2026-05-08T16:01:00Z',
  },
  {
    id: 'diag_006',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'stembleeding',
    confidence: 0.83,
    location: { lat: 7.532, lng: 79.838 },
    source: 'mobile_v2',
    captured_at: '2026-05-08T11:20:00Z',
    synced_at: '2026-05-08T11:21:00Z',
    created_at: '2026-05-08T11:21:00Z',
  },
  {
    id: 'diag_007',
    user_id: 'user_demo',
    device_id: 'device_002',
    estate_id: 'estate_002',
    disease_class: 'bud rot',
    confidence: 0.89,
    location: { lat: 7.345, lng: 79.850 },
    source: 'mobile_v2',
    captured_at: '2026-05-07T08:10:00Z',
    synced_at: '2026-05-07T08:11:00Z',
    created_at: '2026-05-07T08:11:00Z',
  },
  {
    id: 'diag_008',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'healthy leaves',
    confidence: 0.97,
    location: { lat: 7.540, lng: 79.843 },
    source: 'mobile_v2',
    captured_at: '2026-05-07T07:30:00Z',
    synced_at: '2026-05-07T07:31:00Z',
    created_at: '2026-05-07T07:31:00Z',
  },
  {
    id: 'diag_009',
    user_id: 'user_demo',
    device_id: 'device_003',
    estate_id: 'estate_003',
    disease_class: 'bud root dropping',
    confidence: 0.72,
    location: { lat: 7.490, lng: 80.365 },
    source: 'mobile_v2',
    captured_at: '2026-05-06T15:40:00Z',
    synced_at: '2026-05-06T15:41:00Z',
    created_at: '2026-05-06T15:41:00Z',
  },
  {
    id: 'diag_010',
    user_id: 'user_demo',
    device_id: 'device_004',
    estate_id: 'estate_004',
    disease_class: 'leaf rot',
    confidence: 0.85,
    location: { lat: 7.470, lng: 80.625 },
    source: 'mobile_v2',
    captured_at: '2026-05-06T12:00:00Z',
    synced_at: '2026-05-06T12:01:00Z',
    created_at: '2026-05-06T12:01:00Z',
  },
  {
    id: 'diag_011',
    user_id: 'user_demo',
    device_id: 'device_001',
    estate_id: 'estate_001',
    disease_class: 'bud rot',
    confidence: 0.91,
    location: { lat: 7.527, lng: 79.836 },
    source: 'mobile_v2',
    captured_at: '2026-05-05T09:00:00Z',
    synced_at: '2026-05-05T09:01:00Z',
    created_at: '2026-05-05T09:01:00Z',
  },
  {
    id: 'diag_012',
    user_id: 'user_demo',
    device_id: 'device_002',
    estate_id: 'estate_002',
    disease_class: 'healthy leaves',
    confidence: 0.96,
    location: { lat: 7.352, lng: 79.858 },
    source: 'mobile_v2',
    captured_at: '2026-05-05T08:30:00Z',
    synced_at: '2026-05-05T08:31:00Z',
    created_at: '2026-05-05T08:31:00Z',
  },
];

// ── Heatmaps ────────────────────────────────────────────────────────

export const DEMO_HEATMAPS: Heatmap[] = [
  {
    id: 'heatmap_001',
    estate_id: 'estate_001',
    image_ref: 'gs://coconut-pathology-detection.appspot.com/orthomosaics/estate_001/scan_2026_05_10.tif',
    image_dimensions: { width: 8192, height: 6144 },
    detections: [
      { bbox: [120, 340, 380, 600], class: 'v_cut', confidence: 0.92, category_id: 0 },
      { bbox: [1200, 800, 1500, 1100], class: 'scorching', confidence: 0.85, category_id: 1 },
      { bbox: [2400, 1600, 2700, 1900], class: 'wilting', confidence: 0.78, category_id: 2 },
      { bbox: [3600, 2200, 3900, 2500], class: 'v_cut', confidence: 0.88, category_id: 0 },
      { bbox: [4800, 1000, 5100, 1300], class: 'scorching', confidence: 0.91, category_id: 1 },
      { bbox: [600, 3000, 900, 3300], class: 'wilting', confidence: 0.73, category_id: 2 },
      { bbox: [5500, 4000, 5800, 4300], class: 'v_cut', confidence: 0.95, category_id: 0 },
    ],
    summary: {
      total: 7,
      by_class: {
        v_cut: { count: 3, mean_confidence: 0.9167, max_confidence: 0.95 },
        scorching: { count: 2, mean_confidence: 0.88, max_confidence: 0.91 },
        wilting: { count: 2, mean_confidence: 0.755, max_confidence: 0.78 },
      },
    },
    created_at: '2026-05-10T06:00:00Z',
    processed_by: 'on_orthomosaic_uploaded/v1',
  },
  {
    id: 'heatmap_002',
    estate_id: 'estate_001',
    image_ref: 'gs://coconut-pathology-detection.appspot.com/orthomosaics/estate_001/scan_2026_05_03.tif',
    image_dimensions: { width: 8192, height: 6144 },
    detections: [
      { bbox: [500, 700, 800, 1000], class: 'scorching', confidence: 0.82, category_id: 1 },
      { bbox: [2000, 1500, 2300, 1800], class: 'v_cut', confidence: 0.90, category_id: 0 },
      { bbox: [4000, 3000, 4300, 3300], class: 'wilting', confidence: 0.88, category_id: 2 },
    ],
    summary: {
      total: 3,
      by_class: {
        scorching: { count: 1, mean_confidence: 0.82, max_confidence: 0.82 },
        v_cut: { count: 1, mean_confidence: 0.90, max_confidence: 0.90 },
        wilting: { count: 1, mean_confidence: 0.88, max_confidence: 0.88 },
      },
    },
    created_at: '2026-05-03T06:00:00Z',
    processed_by: 'on_orthomosaic_uploaded/v1',
  },
];

// ── Knowledge Base ──────────────────────────────────────────────────

export const DEMO_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'kb_001',
    common_name: 'Bud Rot',
    scientific_name: 'Phytophthora palmivora',
    circular_no: 'Advisory Circular No. B 9',
    susceptible_stage: 'Palms of age 3-45 years are particularly susceptible (especially young palms with clustered leaves or shaded by older palms).',
    predisposing_factors: [
      'High atmospheric humidity favoring fungal growth and dispersal',
      'Young palms with clustered leaves shaded by older palms',
      'River banks and low-lying lands subject to flooding',
      'Sporadic occurrence with minor epidemics in wet and intermediate zones'
    ],
    symptoms: [
      'Spear leaf loses its luster and withers gradually',
      'Wilting spreads successively to adjacent fronds',
      'Discolored patches at the base of the spear leaf',
      'Withered fronds turn brown and dry while lower fronds remain green and healthy',
      'Drying of inflorescence and immature nut fall',
      'Advanced stage: spear leaf pulls out easily with a foul rotting odor',
      'Bud and adjacent fronds collapse, leaving only the trunk (palm is beyond recovery once growing point is attacked)'
    ],
    treatment_protocols: [
      'Early detection: thoroughly wet the bud region with Bordeaux mixture or 1% copper fungicide solution',
      'Older bearing palms: wet bud region with recommended copper fungicide to retain bunches until nuts mature',
      'Incineration: for infected young palms in advanced stage, cut and burn crown completely to destroy the fungus',
      'Neighbor protection: treat surrounding healthy palms once in 2-3 weeks with Bordeaux mixture or 1% copper fungicide'
    ],
    preventive_measures: [
      'Fungicidal Bags (convenient protection lasting 4-6 months during dry weather):',
      '1. Take a 15 cm square piece of jute hessian or gunny bag',
      '2. Place a handful of coir dust inside and tie up into a small bag',
      '3. Soak bag overnight in 1% copper fungicide solution and dry a few hours the next morning',
      '4. Place one bag in the axil of the youngest leaf',
      '5. Inspect monthly and shift to the base of the newly emerged spear leaf'
    ],
    recipes: [
      {
        title: 'CRI Bordeaux Mixture (25 Litres)',
        ingredients: ['Copper Sulphate: 200 g', 'Quick Lime: 200 g', 'Water: 25 Litres'],
        steps: [
          'Use earthenware or plastic containers (never metal)',
          'Dissolve 200 g copper sulphate overnight suspended in a cloth bag in 5 L water',
          'Suspend 200 g quick lime in 20 L water separately and strain through fine cloth',
          'Add copper sulphate solution slowly into the lime suspension while stirring vigorously',
          'Use immediately after preparation'
        ],
        safety: 'Both Bordeaux mixture and Copper fungicides are toxic chemicals and must be handled with care.'
      }
    ],
    vernacular_advice: 'Once the terminal growing point is attacked, the palm is beyond recovery. Early detection of spear leaf withering and prophylactic fungicidal bags on surrounding palms are vital.',
    severity_level: 'critical',
    source: 'Coconut Research Institute of Sri Lanka (Advisory Circular No. B 9)',
  },
  {
    id: 'kb_002',
    common_name: 'Gray Leaf Spot',
    scientific_name: 'Pestalozzia palmarum & Bipolaris incurvata',
    circular_no: 'Advisory Circular No. B 11',
    susceptible_stage: 'Seedlings and young palms are very susceptible; prevalent in weak or neglected palms in all coconut growing areas.',
    predisposing_factors: [
      'Neglected, unfertilized plantations',
      'Prolonged dry weather spells',
      'Excessive nitrogen without balanced potassium',
      'Poor drainage and waterlogging'
    ],
    symptoms: [
      'Early stage: yellowish-brown tiny spots appear on leaflets (predominantly on lower fronds)',
      'Spots gradually enlarge and turn grey with dark brown peripheral margins',
      'Patches coalesce to form large brown dead areas, giving leaflets a completely dried appearance',
      'Severe outbreaks in seedlings cause foliage damage and severe growth setbacks',
      'Adult bearing palms experience lower canopy drying and reduced nut setting'
    ],
    treatment_protocols: [
      'Primary Control: Ensure normal CRI fertilizer schedule is carried out on schedule',
      'Additional Potassium: In fertilized lands where blight appears, apply an additional dose of Muriate of Potash (60% K₂O) or Kitchen Ash at 6-monthly intervals when soil is wet until fresh symptoms cease',
      'Dosage for Seedlings/Young palms: 250 g Muriate of Potash OR 5 kg Kitchen Ash per palm',
      'Dosage for Adult palms: 500 g Muriate of Potash OR 10 kg Kitchen Ash per palm',
      'Chemical treatment (rare necessity): if spreading persists after fertilizer, spray Bordeaux mixture or commercial copper fungicide'
    ],
    preventive_measures: [
      'Balanced NPK fertilization based on CRI guidelines',
      'Avoid high unilateral doses of nitrogen',
      'Provide good field drainage during monsoon periods'
    ],
    recipes: [
      {
        title: 'CRI Bordeaux Mixture (25 Litres)',
        ingredients: ['Copper Sulphate: 200 g', 'Quick Lime: 200 g', 'Water: 25 Litres'],
        steps: [
          'Use earthenware or plastic containers',
          'Dissolve 200 g copper sulphate overnight in 5 L water',
          'Suspend 200 g quick lime in 20 L water and strain through fine cloth',
          'Add copper sulphate solution into lime suspension stirring vigorously',
          'Use immediately after preparation'
        ],
        safety: 'Handle copper fungicides and Bordeaux mixture with protective gloves and eye protection.'
      }
    ],
    vernacular_advice: 'Leaf blight is an indicator of weak or neglected palm nutrition. In most cases, applying MOP (Potash) or Kitchen Ash at 6-month intervals cures the condition without needing chemical fungicides.',
    severity_level: 'medium',
    source: 'Coconut Research Institute of Sri Lanka (Advisory Circular No. B 11)',
  },
  {
    id: 'kb_003',
    common_name: 'Leaf Rot',
    scientific_name: 'Exserohilum rostratum / Colletotrichum gloeosporioides',
    circular_no: 'Advisory Circular No. B 12',
    susceptible_stage: 'Young palms under 8 years and central spear leaves damaged by pests.',
    predisposing_factors: [
      'Secondary opportunistic infection following Rhinoceros beetle or Red Palm Weevil injury',
      'High canopy density hindering air circulation',
      'Prolonged wet weather'
    ],
    symptoms: [
      'Water-soaked lesions on tips and margins of emerging tender leaflets',
      'Infected areas turn pitch black, shrivel, and break off in wind currents',
      'Distorted, ragged fan-shaped appearance on maturing fronds',
      'Secondary opportunistic entry following Rhinoceros beetle wounding'
    ],
    treatment_protocols: [
      'Pour 1% Bordeaux mixture into the spindle axil',
      'Apply Mancozeb (3g/L) to affected young leaves during active flush',
      'Control Rhinoceros beetle to eliminate entry points',
      'Clean crown frond axils of decaying organic debris where beetles breed'
    ],
    vernacular_advice: 'Young palms (< 8 years) are highly susceptible. Protecting the central spear leaf from mechanical injury is paramount.',
    severity_level: 'high',
    source: 'CRI Plant Pathology Division',
  },
  {
    id: 'kb_004',
    common_name: 'Stem Bleeding',
    scientific_name: 'Ceratocystis paradoxa (Thielaviopsis paradoxa)',
    circular_no: 'Advisory Circular No. B 10',
    susceptible_stage: 'Common in all coconut growing areas; young palms with rapidly expanding trunk bases are especially prone due to bark cracking.',
    predisposing_factors: [
      'Infection by Ceratocystis paradoxa through bark cracks or growth fissures',
      'Rapid trunk base expansion causing longitudinal cracking',
      'Flooding, waterlogging, or frequently fluctuating water table',
      'High overdose of inorganic fertilizers causing soft bark expansion',
      'Lightning strikes (cluster of palms with broken fronds) or fire damage (charred ash present)',
      'Red Palm Weevil infestation (identifiable by cocoons, circular trunk boreholes, and chewed fiber)',
      'Basal stem bleeding caused by Ganoderma bracket fungus (rare in Sri Lanka; shows bracket-shaped fruiting bodies at base)'
    ],
    symptoms: [
      'Primary symptom: oozing of reddish-brown, rust-colored liquid from longitudinal cracks on trunk bark',
      'Bleeding points turn dark brown and dry into black encrusted patches',
      'Tissues beneath the bleeding spot turn yellow and decay into a brown fibrous rotting mass',
      'Adjacent bleeding points coalesce beneath bark to form large internal decayed cavities',
      'Advanced stage: internal cavitation weakens trunk structural strength and reduces yields'
    ],
    treatment_protocols: [
      'Surgical Chiseling: affected decayed tissues should be chiseled out with a little healthy tissue until clean white trunk wood is exposed',
      'Wound Dressing: treat excised wound immediately with concentrated Bordeaux paste, Bordeaux mixture, or 1% copper fungicide solution',
      'Waterproofing & Termite Prevention: after a few weeks, once bleeding has completely stopped, dress wound with coal tar to prevent termite damage',
      'Lightning Damage Protocol: cut an oblique hole into trunk to drain fluid; seal later with cement-sand mixture',
      'Red Weevil Protocol: inject recommended systemic insecticide into trunk if red weevil larvae are present inside'
    ],
    recipes: [
      {
        title: 'CRI Official Bordeaux Paste Formulation',
        ingredients: [
          'Copper Sulphate: 450 g',
          'Quick Lime: 450 g',
          'Water: 4.5 Litres total (2.25 L + 2.25 L)'
        ],
        steps: [
          'Dissolve 450 g Copper Sulphate completely in 2.25 L water in earthenware or plastic vessel',
          'Suspend 450 g Quick Lime in 2.25 L water separately in non-metallic vessel',
          'Mix copper sulphate solution into lime suspension stirring vigorously to form a thick creamy paste',
          'Apply fresh paste directly onto chiseled trunk wounds using a paintbrush'
        ],
        safety: 'Bordeaux paste, mixture, and copper fungicides are toxic. Handle with rubber gloves and wash hands thoroughly.'
      }
    ],
    vernacular_advice: 'Early chiseling of diseased tissue down to healthy white wood followed by Bordeaux paste and later coal tar dressing stops decay permanently. Confirm bleeding is not caused by Red Palm Weevil or Lightning.',
    severity_level: 'high',
    source: 'Coconut Research Institute of Sri Lanka (Advisory Circular No. B 10)',
  },
];
