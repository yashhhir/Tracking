"use client";

import { useEffect, useState } from "react";
import { Newspaper, Clock, ExternalLink, ArrowRight } from "lucide-react";

interface ArticleBaitProps {
  title?: string | null;
  content?: string | null;
  targetUrl: string;
  redirectDelay?: number;
}

export default function ArticleBait({
  title,
  content,
  targetUrl,
  redirectDelay = 5,
}: ArticleBaitProps) {
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
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
    <div className="min-h-screen bg-[#080c14] text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#10141f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Banner Alert */}
        <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-center space-x-2 text-cyan-300 text-xs sm:text-sm font-medium">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Mengalihkan ke berita utama dalam <b>{secondsLeft}</b> detik...</span>
          </div>
          <button
            onClick={() => { window.location.href = targetUrl; }}
            className="flex items-center space-x-1 text-xs bg-cyan-500 text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-cyan-400 transition-all"
          >
            <span>Buka Langsung</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Article Meta */}
        <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3 font-mono">
          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
            Trending Now
          </span>
          <span>•</span>
          <span>Baru saja diperbarui</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white leading-snug mb-4">
          {title || "Informasi Mendesak: Laporan Fakta & Peristiwa Terkini"}
        </h1>

        <div className="space-y-3 text-gray-300 text-sm leading-relaxed border-y border-white/10 py-5 my-5">
          <p>
            {content ||
              "Laporan ini sedang disinkronkan dengan jaringan pusat penyedia informasi. Silakan tunggu beberapa saat sementara sistem mengarahkan Anda ke portal verifikasi dokumen resmi secara lengkap tanpa gangguan."}
          </p>
          <p className="text-gray-400 text-xs">
            Pastikan koneksi internet Anda stabil untuk memuat seluruh lampiran multimedia dan data pendukung yang tersedia pada halaman tujuan.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">Sumber: Global News Feed Wire</span>
          <button
            onClick={() => { window.location.href = targetUrl; }}
            className="flex items-center space-x-2 text-cyan-400 text-sm font-medium hover:underline"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
