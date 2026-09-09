"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Copy, Check, QrCode as QrIcon } from "lucide-react";

interface QrModalProps {
  url: string;
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function QrModal({ url, slug, isOpen, onClose }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: "#00F0FF",
          light: "#0B0F19",
        },
      }).then(setQrDataUrl);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode_${slug}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0f1422] p-6 shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center space-x-2 text-cyan-400 mb-4">
          <QrIcon className="w-5 h-5" />
          <h3 className="text-base font-bold text-white font-mono uppercase">
            Radar QR Code
          </h3>
        </div>

        <div className="mx-auto my-4 w-64 h-64 rounded-xl border border-cyan-500/20 bg-[#0b0f19] p-3 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-full h-full rounded-lg" />
          ) : (
            <div className="animate-pulse text-xs text-gray-500 font-mono">Generating QR...</div>
          )}
        </div>

        <p className="text-xs text-gray-400 font-mono truncate px-2 py-1 bg-black/40 rounded border border-white/5 mb-4">
          {url}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 hover:bg-white/10 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? "Tersalin!" : "Salin URL"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-cyan-500 text-xs font-semibold text-black hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Unduh QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
