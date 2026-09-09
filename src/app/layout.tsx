import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Tracker & Telemetry System",
  description: "Advanced Link Tracking, Device Fingerprinting, and Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 cyber-grid antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
