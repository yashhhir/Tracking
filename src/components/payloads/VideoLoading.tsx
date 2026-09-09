"use client";

import { useEffect, useState } from "react";
import { Play, Loader2, Volume2, ShieldCheck, Wifi } from "lucide-react";

interface VideoLoadingProps {
  title?: string | null;
  targetUrl: string;
  redirectDelay?: number;
}

export default function VideoLoading({
  title,
  targetUrl,
  redirectDelay = 3,
}: VideoLoadingProps) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState("Buffering media stream...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setStatusText("Decoding high bitrate audio/video...");
          return 98;
        }
        const next = prev + Math.floor(Math.random() * 18) + 8;
        if (next > 50 && next < 80) {
          setStatusText("Optimizing video pipeline...");
        } else if (next >= 80) {
          setStatusText("Establishing secure direct connection...");
        }
        return Math.min(next, 98);
      });
    }, 450);

    const redirectTimer = setTimeout(() => {
      window.location.href = targetUrl;
    }, Math.max(redirectDelay, 2) * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [targetUrl, redirectDelay]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      {/* Fake Video Player Frame */}
      <div className="w-full max-w-2xl bg-[#0f1117] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative aspect-video flex flex-col items-center justify-center">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

        {/* Video Header Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-red-600 text-white font-bold text-xs px-2 py-0.5 rounded tracking-wide uppercase animate-pulse">
              LIVE BUFFER
            </span>
            <span className="text-xs text-gray-300 font-medium truncate max-w-xs">
              {title || "Media Stream HD"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-gray-800 text-cyan-400 border border-cyan-500/20">4K HDR</span>
            <Wifi className="w-3.5 h-3.5 text-green-400" />
          </div>
        </div>

        {/* Central Loader */}
        <div className="flex flex-col items-center z-10 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Play className="w-6 h-6 text-white absolute fill-white/80 opacity-80" />
          </div>
          <p className="text-sm text-gray-300 font-medium tracking-wide animate-pulse">
            {statusText}
          </p>
        </div>

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 font-mono">
            <span>00:00 / 12:45</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-2 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Penyambungan aman terenkripsi SSL/TLS</span>
      </div>
    </div>
  );
}
