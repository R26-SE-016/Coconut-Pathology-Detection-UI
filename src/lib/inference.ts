// ══════════════════════════════════════════════════════════════════════
// CocoCastAI — Real MobileNetV2-INT8 TFLite Inference Engine
//
// Loads the actual trained model via CDN-hosted TensorFlow.js + TFLite
// runtime (same approach as diagnostic_sandbox.html). This avoids
// npm bundler issues with @tensorflow/tfjs-tflite's broken ESM exports.
// ══════════════════════════════════════════════════════════════════════

import type { MobileDiseaseClass } from './types';

// Class names in the exact order the model was trained with.
// Matches diagnostic_sandbox.html: ['BudRootDropping', 'BudRot', 'GrayLeafSpot', 'Healthy', 'LeafRot', 'StemBleeding']
const CLASS_NAMES: MobileDiseaseClass[] = [
  'bud root dropping',
  'bud rot',
  'gray leaf spot',
  'healthy leaves',
  'leaf rot',
  'stembleeding',
];

const MODEL_PATH = '/models/system_b_baseline_int8.tflite';

export interface InferenceResult {
  disease_class: MobileDiseaseClass;
  confidence: number;
  all_predictions: { class: MobileDiseaseClass; confidence: number }[];
  inference_time_ms: number;
}

// ── Script loader ───────────────────────────────────────────────────

let scriptsLoaded = false;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureScriptsLoaded(): Promise<void> {
  if (scriptsLoaded) return;

  // Load TF.js core first, then TFLite plugin — exactly like the sandbox
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js');

  scriptsLoaded = true;
  console.log('[CocoCastAI] TF.js + TFLite scripts loaded from CDN.');
}

// ── Model cache ─────────────────────────────────────────────────────

let cachedModel: any = null;

/**
 * Load the TFLite model. Returns the model instance.
 * Caches the model after first load.
 */
export async function loadModel(): Promise<any> {
  if (cachedModel) return cachedModel;

  await ensureScriptsLoaded();

  const tflite = (window as any).tflite;
  if (!tflite) {
    throw new Error('TFLite runtime not available. Check CDN scripts.');
  }

  console.log('[CocoCastAI] Loading MobileNetV2-INT8 model from', MODEL_PATH);
  cachedModel = await tflite.loadTFLiteModel(MODEL_PATH);
  console.log('[CocoCastAI] Model loaded successfully.');

  return cachedModel;
}

/**
 * Run real inference on an image element using the trained MobileNetV2-INT8 model.
 *
 * Preprocessing matches diagnostic_sandbox.html exactly:
 * - Resize to 224×224 via resizeNearestNeighbor
 * - Cast to int32 (0-255 pixel values, NO normalization)
 * - Expand dims to [1, 224, 224, 3]
 *
 * Post-processing:
 * - INT8 model outputs values in 0-255 range
 * - Convert to 0-1 probability by dividing by 255 if > 1.0
 */
export async function runInference(
  imgElement: HTMLImageElement
): Promise<InferenceResult> {
  const model = await loadModel();

  const tf = (window as any).tf;
  if (!tf) {
    throw new Error('TF.js runtime not available. Check CDN scripts.');
  }

  const startTime = performance.now();

  // Preprocess: exactly matching the sandbox logic
  const tensor = tf.tidy(() => {
    return tf.browser
      .fromPixels(imgElement)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .cast('int32'); // INT8 model requires int32 input (0-255)
  });

  try {
    // Run prediction
    const output = model.predict(tensor);
    const probs: Float32Array = await output.data();

    const endTime = performance.now();
    const inference_time_ms = Math.round(endTime - startTime);

    // Find the top prediction
    let maxIdx = 0;
    let maxVal = -1;
    for (let i = 0; i < probs.length; i++) {
      if (probs[i] > maxVal) {
        maxVal = probs[i];
        maxIdx = i;
      }
    }

    // INT8 outputs are 0-255. Convert to 0-1 probability.
    const toProb = (v: number) => (v > 1.0 ? v / 255 : v);

    // Build all predictions sorted by confidence
    const all_predictions = CLASS_NAMES.map((cls, i) => ({
      class: cls,
      confidence: toProb(probs[i]),
    })).sort((a, b) => b.confidence - a.confidence);

    const topConfidence = toProb(maxVal);

    console.log(
      `[CocoCastAI] Inference: ${CLASS_NAMES[maxIdx]} (${(topConfidence * 100).toFixed(1)}%) in ${inference_time_ms}ms`
    );

    return {
      disease_class: CLASS_NAMES[maxIdx],
      confidence: topConfidence,
      all_predictions,
      inference_time_ms,
    };
  } finally {
    tensor.dispose();
  }
}
