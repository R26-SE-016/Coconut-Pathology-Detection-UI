<div align="center">

<img src="./docs/brand/logo-icon.png" alt="SaruPol Icon" width="90" />
<br/>
<img src="./docs/brand/logo-text.png" alt="සරුපොල් (SaruPol)" width="380" />

### 🥥 සරුපොල් (SaruPol) — Coconut Pathology Detection Suite
**Multiscale Computer Vision Ecosystem & Interactive Agronomic Dashboard for Coconut Palm Pathology**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebAssembly](https://img.shields.io/badge/Runtime-WebAssembly%20%2F%20TFLite-654FF0.svg?logo=webassembly&logoColor=white)](https://webassembly.org/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20Gen%202-FFCA28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Live-brightgreen.svg)](https://saru-pol-web.vercel.app/pathology)

</div>

---

## 📖 Overview

The **Coconut Pathology Detection Suite** (Project **R26-SE-016**) is the visual intelligence and diagnostic command center of the **SaruPol Smart Plantation Management Ecosystem**. 

Designed in close accordance with the **Coconut Research Institute (CRI) of Sri Lanka**, this platform operationalizes a **two-tier multiscale computer vision architecture**:
1. **Macroscopic UAV Surveillance (Canopy Level)**: Processes high-resolution aerial drone orthomosaics and multispectral GeoTIFFs using **Excess Green (ExG) canopy segmentation**, **VARI/NDVI spectral indices**, and **Euclidean Distance Transform (EDT)** individual tree crown anomaly extraction.
2. **Microscopic Diagnostic Vision (Leaf & Trunk Level)**: Delivers instant, on-device Edge AI inference powered by **quantized MobileNetV2-INT8** with **Shannon Entropy Out-of-Distribution (OOD) Gating** ($H_{th} = 2.10\text{ bits}$) and automated CRI agronomic treatment dispatch.

---

## 🏛️ Multiscale System Architecture

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │       SaruPol Pathology Diagnostic Suite (Web UI)       │
                                  └────────────────────────────┬────────────────────────────┘
                                                               │
                                ┌──────────────────────────────┴──────────────────────────────┐
                                │                                                             │
                                ▼ (Macroscopic Level)                                         ▼ (Microscopic Level)
┌─────────────────────────────────────────────────────────────┐ ┌─────────────────────────────────────────────────────────────┐
│             UAV Aerial Spectral Pipeline                    │ │               On-Device Edge AI Vision Pipeline             │
│                                                             │ │                                                             │
│  ┌───────────────────────┐   ┌───────────────────────────┐  │ │  ┌───────────────────────┐   ┌───────────────────────────┐  │
│  │   RGB Orthomosaic /   │   │  Excess Green (ExG) Mask  │  │ │  │   Leaf & Trunk Photo  │   │  Quantized INT8 MobileNet │  │
│  │   4-Band GeoTIFF      │──▶│  & Discrete Palm Slicing  │  │ │  │   (Macro / Close-up)  │──▶│  (WebAssembly / TFLite)   │  │
│  └───────────────────────┘   └─────────────┬─────────────┘  │ │  └───────────────────────┘   └─────────────┬─────────────┘  │
│                                            │                │ │                                            │                │
│  ┌───────────────────────┐                 ▼                │ │  ┌───────────────────────┐                 ▼                │
│  │  VARI / NDVI Compute  │◀─── Euclidean Distance Transform │ │  │  CRI Treatment Guide  │◀─── Shannon Entropy Gating       │
│  │  & Z-Score Outliers   │     (Tree Crown Extraction)      │ │  │  (Chemical/Bio/Cult)  │     (H_th = 2.10 bits OOD)       │
│  └───────────┬───────────┘                                  │ │  └───────────┬───────────┘                                  │
└──────────────┼──────────────────────────────────────────────┘ └──────────────┼──────────────────────────────────────────────┘
               │                                                               │
               │ HTTP (Port 8000)                                              │ Direct Sync (Firestore / IndexedDB)
               ▼                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                  Cloud Backend & Database Layer                                             │
│                                                                                                                             │
│       ┌──────────────────────────────────────┐                       ┌──────────────────────────────────────────────┐       │
│       │      SaruPol API Gateway             │                       │  Google Cloud Firestore & Storage            │       │
│       │      (Express / Cloud Run)           │──────────────────────▶│  • collections: diagnostics/                 │       │
│       │                                      │                       │  • collections: canopy_hotspots/             │       │
│       │      • /api/pathology/aerial         │                       │  • collections: heatmaps/                    │       │
│       │      • /api/pathology/sync           │                       │  • buckets:    orthomosaics/                 │       │
│       └──────────────────────────────────────┘                       └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Capabilities

### 🚁 1. Aerial Surveillance & Spectral Engine
- **Dual-Index Spectral Analysis**:
  $$\text{VARI} = \frac{R_{\text{green}} - R_{\text{red}}}{R_{\text{green}} + R_{\text{red}} - R_{\text{blue}}}$$
  $$\text{NDVI} = \frac{R_{\text{NIR}} - R_{\text{red}}}{R_{\text{NIR}} + R_{\text{red}}}$$
- **Excess Green (ExG) Chromatic Segmentation**: Filters ground noise and isolates pure coconut palm fronds.
- **Euclidean Distance Transform (EDT) Tree Extraction**: Detects individual tree crowns deterministically across all flights.
- **Local Z-Score Anomaly Profiler**: Flags biological stress outliers ($Z \le -2.0\sigma$) with relative percentage drops vs neighboring peers.
- **Micro-Bridge Dispatch**: Generates GPS hotspot tickets and dispatches them directly to field officers for ground verification.

### 🔬 2. Microscopic Edge AI & Shannon Entropy Gating
- **Zero-Latency In-Browser WASM Inference**: Executes quantized INT8 MobileNetV2 locally on device (<35ms latency).
- **Shannon Entropy Out-of-Distribution (OOD) Gating**:
  $$H(X) = -\sum_{k=1}^{K} p_k \log_2(p_k)$$
  Rejects non-foliage and ambiguous background noise when $H(X) > 2.10\text{ bits}$.
- **6 Pathogen Classes**: *Bud Rot*, *Stem Bleeding*, *Leaf Rot*, *Bud Root Dropping*, *Gray Leaf Spot*, and *Healthy Leaves*.

### 📖 3. Official CRI Treatment Dossiers
- Interactive agronomic repository structured into **3-Way Management Protocols**:
  - 🔴 **Chemical Control**: Active fungicides, dilution ratios (e.g. Copper Oxychloride, Mancozeb, Bordeaux paste).
  - 🟢 **Cultural Control**: Crown surgery, spacing, drainage clearance, incineration of infected fronds.
  - 🟣 **Biological Control**: Bio-amendments, *Trichoderma viride*, neem cake organic soil treatments.

### 🗺️ 4. Geo-Spatial GIS Mapping & Offline Storage
- **Interactive Dark GIS Map**: Integrated Leaflet geospatial viewer visualizing georeferenced disease clusters and historical flight logs.
- **IndexedDB Client Storage**: Persistent offline diagnostic history with automatic background synchronization when online.

---

## 📂 Project Structure

```
Coconut-Pathology-Detection-UI/
├── public/
│   └── models/
│       └── system_b_baseline_int8.tflite   # Quantized INT8 MobileNetV2 model
├── src/
│   ├── app/
│   │   ├── pathology/
│   │   │   └── page.tsx                    # Master Pathology Suite & Command Center
│   │   ├── globals.css                     # Obsidian-emerald design tokens & styles
│   │   └── layout.tsx                      # Root layout with Custom Cursor & Navbar
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx                  # Enterprise header & station status
│   │   ├── pathology/
│   │   │   ├── ConfidenceBar.tsx           # Precision confidence meter
│   │   │   ├── DiagnosticMap.tsx           # Leaflet GIS geo-spatial visualizer
│   │   │   ├── DiseaseBadge.tsx            # CRI pathogen severity badge
│   │   │   ├── DiseaseChart.tsx            # Recharts pathogen distribution breakdown
│   │   │   └── StatCard.tsx                # Glassmorphic KPI metric component
│   │   └── ui/
│   │       └── CustomCursor.tsx            # 144Hz GPU-accelerated requestAnimationFrame cursor
│   └── lib/
│       ├── api.ts                          # Unified API Gateway client
│       ├── demo-data.ts                    # CRI knowledge base & reference datasets
│       ├── edge-inference.ts               # WebAssembly TFLite engine & Shannon OOD gating
│       └── offline-sync.ts                 # IndexedDB offline persistence service
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/R26-SE-016/Coconut-Pathology-Detection-UI.git
   cd Coconut-Pathology-Detection-UI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000/pathology](http://localhost:3000/pathology) in your browser.

---

## ⚙️ Environment Configuration

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:8000` | `https://sarupol-gateway-636168956069.asia-south1.run.app` |

---

## ☁️ Deployment

### Deploy on Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set Framework Preset to **Next.js**.
3. Under **Environment Variables**, set:
   * `NEXT_PUBLIC_GATEWAY_URL` = `https://sarupol-gateway-636168956069.asia-south1.run.app`
4. Click **Deploy**.

---

## 🔬 Research & Agronomic Standards

All diagnostic classifications, spectral thresholding values, and management recommendations are developed under **Project R26-SE-016** and validated in accordance with the official Advisory Circulars of the **Coconut Research Institute (CRI) of Sri Lanka**:
* *Phytophthora palmivora* (Bud Rot) Management Circular
* *Ceratocystis paradoxa* (Stem Bleeding) Agronomic Guidelines
* *Colletotrichum gloeosporioides* (Leaf Rot) Management Circular

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
