"use client";

import { Shield, Check } from "lucide-react";

interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121826] p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Shield className="w-6 h-6" />
          <h3 className="text-base font-bold text-white">Konfirmasi Akses Konten</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Halaman ini menggunakan optimasi sesi dan analisis telemetri jaringan untuk memberikan pengalaman streaming dan tampilan yang optimal pada perangkat Anda.
        </p>
        <div className="pt-2">
          <button
            onClick={onAccept}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-black hover:bg-cyan-400 transition-all active:scale-98 shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Lanjutkan & Izinkan Akses</span>
          </button>
        </div>
      </div>
    </div>
  );
}
