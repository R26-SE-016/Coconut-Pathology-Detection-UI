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

function loadScript(src: string, checkGlobal?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded by looking for the global variable
    if (checkGlobal && (window as any)[checkGlobal]) {
      resolve();
      return;
    }
    
    // Check if script tag exists but maybe hasn't loaded global yet
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      // If it exists, wait for it or just check periodically
      const interval = setInterval(() => {
        if (checkGlobal && (window as any)[checkGlobal]) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
      // Timeout after 5s
      setTimeout(() => {
        clearInterval(interval);
        if (checkGlobal && !(window as any)[checkGlobal]) {
           reject(new Error(`Script ${src} exists but global ${checkGlobal} never appeared.`));
        } else {
           resolve();
        }
      }, 5000);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      if (checkGlobal) {
        // Wait a tiny bit for global to be ready
        let count = 0;
        const i = setInterval(() => {
          if ((window as any)[checkGlobal] || count > 10) {
            clearInterval(i);
            resolve();
          }
          count++;
        }, 10);
      } else {
        resolve();
      }
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureScriptsLoaded(): Promise<void> {
  // If already loaded via Layout Script tags, just return
  if ((window as any).tf && (window as any).tflite) {
    scriptsLoaded = true;
    return;
  }

  if (scriptsLoaded) return;

  console.log('[CocoCastAI] Scripts not found in layout, loading dynamically...');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js', 'tf');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js', 'tflite');

  scriptsLoaded = true;
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

  const tflite = (window as any).tflite || (globalThis as any).tflite;
  if (!tflite) {
    throw new Error('TFLite runtime not available. Check CDN scripts.');
  }

  console.log('[CocoCastAI] Loading MobileNetV2-INT8 model from', MODEL_PATH);
  // Ensure absolute path for the model
  cachedModel = await tflite.loadTFLiteModel(MODEL_PATH);
  console.log('[CocoCastAI] Model loaded successfully.');

  return cachedModel;
}

/**
 * Run real inference on an image element using the trained MobileNetV2-INT8 model.
 */
export async function runInference(
  imgElement: HTMLImageElement
): Promise<InferenceResult> {
  const model = await loadModel();

  const tf = (window as any).tf || (globalThis as any).tf;
  if (!tf) {
    throw new Error('TF.js runtime not available. Ensure layout scripts are loaded.');
  }

  // Force global assignment to help internal TFLite logic
  (window as any).tf = tf;

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
    console.log('[CocoCastAI] Running model.predict(tensor)...');
    
    // Safety check for TFLite environment: ensure window.tf is exactly our tf
    if ((window as any).tf !== tf) {
       (window as any).tf = tf;
    }

    // Run prediction
    const output = model.predict(tensor);
    
    if (!output) {
      throw new Error('Model prediction returned null output.');
    }

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
  } catch (err) {
    console.error('[CocoCastAI] Internal model.predict error:', err);
    throw err;
  } finally {
    if (tensor) tensor.dispose();
  }
}
