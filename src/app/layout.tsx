import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CocoCastAI — Coconut Pathology Intelligence Platform",
  description:
    "AI-powered multiscale computer vision ecosystem for coconut palm disease detection. Combining UAV-based YOLOv11 macroscopic analysis with MobileNetV2 on-device microscopic diagnostics.",
  keywords: [
    "coconut pathology",
    "disease detection",
    "computer vision",
    "YOLOv11",
    "MobileNetV2",
    "precision agriculture",
    "UAV",
    "plant health",
  ],
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Pre-load TF.js to ensure it is available globally before any model logic runs */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js" 
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

