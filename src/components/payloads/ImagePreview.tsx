"use client";

import { useEffect, useState } from "react";
import { Eye, ShieldAlert, ArrowRight, Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  title?: string | null;
  image?: string | null;
  targetUrl: string;
  redirectDelay?: number;
}

export default function ImagePreview({
  title,
  image,
  targetUrl,
  redirectDelay = 4,
}: ImagePreviewProps) {
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080c14] p-4 text-white">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#121826]/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <ImageIcon className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide uppercase font-mono">
              Secure Image Viewer
            </span>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300 border border-cyan-500/20 font-mono">
            Redirect in {countdown}s
          </span>
        </div>

        <h2 className="text-lg font-bold text-gray-100 mb-4">
          {title || "Pratinjau Foto Eksklusif HD"}
        </h2>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center group">
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="h-full w-full object-cover filter blur-[2px] group-hover:blur-none transition-all duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                <Eye className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Gambar memiliki resolusi tinggi (4096 x 2160)
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={() => { window.location.href = targetUrl; }}
              className="flex items-center space-x-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all active:scale-95"
            >
              <span>Buka Gambar Asli</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5 font-mono">
          <span>STATUS: SECURE_PREVIEW</span>
          <span className="text-emerald-400">Pemeriksaan Integritas Lolos</span>
        </div>
      </div>
    </div>
  );
}
