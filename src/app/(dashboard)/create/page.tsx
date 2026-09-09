"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Zap,
  Clock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CreateLinkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    targetUrl: "",
    payloadType: "VIDEO_LOADING",
    payloadTitle: "",
    payloadImage: "",
    payloadContent: "",
    redirectDelay: 3,
    maxClicks: "",
    expiresAt: "",
    requireConsent: false,
    password: "",
  });

  const payloadOptions = [
    {
      id: "VIDEO_LOADING",
      title: "Video Loading Player",
      desc: "Simulasi pemutar video 4K yang sedang buffering sebelum redirect",
      icon: Video,
      badge: "Tingkat Konversi Tinggi",
    },
    {
      id: "FAKE_IMAGE",
      title: "Fake Image Viewer",
      desc: "Tampilan gambar pancingan dengan tombol 'Buka Full HD'",
      icon: ImageIcon,
      badge: "Viral Bait",
    },
    {
      id: "FAKE_ARTICLE",
      title: "News & Article Bait",
      desc: "Cuplikan berita terkini dengan hitung mundur pengalihan",
      icon: FileText,
      badge: "Berita Viral",
    },
    {
      id: "CAPTCHA",
      title: "Security & DDoS Captcha",
      desc: "Verifikasi Cloudflare-style 'Checking your browser'",
      icon: ShieldCheck,
      badge: "Sangat Kredibel",
    },
    {
      id: "DIRECT_REDIRECT",
      title: "Silent Direct Redirect",
      desc: "Pengalihan instan dengan pengiriman sinyal telemetri di latar belakang",
      icon: Zap,
      badge: "Ultra Cepat",
    },
  ];

  const handleRandomSlug = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let rand = "";
    for (let i = 0; i < 7; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, slug: rand }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat link tracking");
      }

      router.push(`/stats/${data.link.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-mono tracking-widest uppercase">
            Radar Generator Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Buat Link Pelacak Baru
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Konfigurasi tautan pancingan, pilih jenis payload layar, dan aktifkan sensor telemetri.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-6 space-y-5 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-3">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            <span>1. Informasi Tautan & Target</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                Judul Kampanye / Catatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Kampanye Instagram Video 01"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Custom Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-300 font-mono">
                  Kustom Slug URL
                </label>
                <button
                  type="button"
                  onClick={handleRandomSlug}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  Acak Slug
                </button>
              </div>
              <div className="flex rounded-xl overflow-hidden border border-white/10 bg-[#080c14]">
                <span className="px-3 py-2.5 bg-white/5 text-gray-500 text-xs font-mono flex items-center border-r border-white/10">
                  /
                </span>
                <input
                  type="text"
                  required
                  placeholder="video-viral-hari-ini"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
                    })
                  }
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-cyan-300 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
              Target URL Asli (Tujuan Akhir Pengalihan) *
            </label>
            <input
              type="url"
              required
              placeholder="https://youtube.com/watch?v=... atau https://google.com"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Payload Selection */}
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-6 space-y-5 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>2. Pilih Tampilan Payload (Saat Link Diklik)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {payloadOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = formData.payloadType === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, payloadType: opt.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/5 bg-[#0b0f19] hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-cyan-500 text-black" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{opt.title}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono font-medium">
                          {opt.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Payload Specific Fields */}
          <div className="border-t border-white/5 pt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                Judul Tampilan Payload (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Video Eksklusif CCTV Viral Terbaru..."
                value={formData.payloadTitle}
                onChange={(e) => setFormData({ ...formData, payloadTitle: e.target.value })}
                className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {formData.payloadType === "FAKE_IMAGE" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                  URL Gambar Pancingan (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.payloadImage}
                  onChange={(e) => setFormData({ ...formData, payloadImage: e.target.value })}
                  className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}

            {formData.payloadType === "FAKE_ARTICLE" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                  Isi Ringkasan Berita / Artikel
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan pembuka berita atau artikel yang memancing rasa penasaran..."
                  value={formData.payloadContent}
                  onChange={(e) => setFormData({ ...formData, payloadContent: e.target.value })}
                  className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Advanced Options */}
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-6 space-y-5 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-white/5 pb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>3. Pengaturan Batas & Keamanan</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Redirect Delay */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                Durasi Tunggu Redirect (Detik)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={formData.redirectDelay}
                onChange={(e) =>
                  setFormData({ ...formData, redirectDelay: Number(e.target.value) })
                }
                className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Waktu bagi sensor browser untuk membaca telemetri & baterai.
              </p>
            </div>

            {/* Max Clicks */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                Maksimal Klik (Batas Kuota)
              </label>
              <input
                type="number"
                min={1}
                placeholder="Tak Terbatas"
                value={formData.maxClicks}
                onChange={(e) => setFormData({ ...formData, maxClicks: e.target.value })}
                className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Tautan akan nonaktif setelah mencapai total klik ini.
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-mono">
                Batas Kadaluarsa (Waktu)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full bg-[#080c14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Otomatis nonaktif setelah waktu tersebut terlewati.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/5 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? "Membangun Tautan..." : "Generate Tracking Link"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
