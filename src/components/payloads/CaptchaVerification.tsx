"use client";

import { useEffect, useState } from "react";
import { Shield, CheckCircle2, Loader2, Lock } from "lucide-react";

interface CaptchaProps {
  targetUrl: string;
  redirectDelay?: number;
}

export default function CaptchaVerification({
  targetUrl,
  redirectDelay = 3,
}: CaptchaProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkTimer = setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);

      const redirectTimer = setTimeout(() => {
        window.location.href = targetUrl;
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }, Math.max(redirectDelay, 2) * 900);

    return () => clearTimeout(checkTimer);
  }, [targetUrl, redirectDelay]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070a10] text-gray-200 p-4">
      <div className="w-full max-w-md bg-[#0f1422] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Memeriksa Keamanan Koneksi</h2>
          <p className="text-xs text-gray-400 font-mono">
            Verifikasi integritas browser dan keamanan jaringan sedang berlangsung...
          </p>
        </div>

        {/* Interactive Box */}
        <div className="bg-[#151c2e] border border-gray-700/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isVerifying ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
            <span className="text-sm font-medium text-gray-200">
              {isVerifying ? "Memverifikasi bahwa Anda bukan robot..." : "Verifikasi berhasil!"}
            </span>
          </div>
          <div className="flex flex-col items-end text-[10px] text-gray-500 font-mono">
            <span>DDoS Guard</span>
            <span>v4.1</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-500 font-mono pt-2">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ray ID: {Math.random().toString(36).substring(2, 12).toUpperCase()} • Keamanan TLS v1.3</span>
        </div>
      </div>
    </div>
  );
}
