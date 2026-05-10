import type { Metadata } from "next";
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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
