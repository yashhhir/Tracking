"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MousePointerClick, Users, ShieldAlert, Battery, Globe, ArrowLeft,
  Copy, Check, QrCode, Download, ExternalLink, RefreshCw,
  Smartphone, Laptop, Radio, Signal, Share2,
} from "lucide-react";
import StatCard from "@/components/stats/StatCard";
import LogTable from "@/components/stats/LogTable";
import QrModal from "@/components/stats/QrModal";

const SOURCE_ICONS: Record<string, string> = {
  "Instagram": "??",
  "WhatsApp": "??",
  "Telegram": "??",
  "Facebook": "??",
  "Twitter / X": "??",
  "TikTok": "??",
  "YouTube": "??",
  "Google Search": "??",
  "Discord": "??",
  "LINE": "??",
  "Direct / Tidak Diketahui": "??",
  "Email": "??",
};

export default function LinkStatsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!id) return;
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/links/${id}`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-sm text-cyan-400 animate-pulse">
        Menghubungkan ke sensor analitik...
      </div>
    );
  }

  if (!data?.link) {
    return (
      <div className="py-20 text-center text-white">
        <h2 className="text-xl font-bold">Data Link Tidak Ditemukan</h2>
        <Link href="/links" className="text-cyan-400 text-sm mt-3 inline-block underline">Kembali</Link>
      </div>
    );
  }

  const { link, stats } = data;
  const trackingUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${link.slug}`
    : `/${link.slug}`;

  const batteryLogs = link.clickLogs.filter((l: any) => l.batteryLevel !== null && l.batteryLevel !== undefined);
  const avgBattery = batteryLogs.length > 0
    ? Math.round(batteryLogs.reduce((acc: number, cur: any) => acc + cur.batteryLevel, 0) / batteryLogs.length)
    : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function BreakdownBar({ data, color }: { data: Record<string, number>; color: string }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    return (
      <div className="space-y-2.5">
        {Object.entries(data).map(([key, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-200 truncate max-w-[70%]">{key}</span>
                <span className="text-gray-400">{count} ({pct}%)</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        {Object.keys(data).length === 0 && (
          <p className="text-xs text-gray-600 font-mono">Belum ada data</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/links" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-cyan-300 font-mono mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Semua Link</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{link.title}</h1>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
              {link.payloadType}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Target: <a href={link.targetUrl} target="_blank" rel="noreferrer" className="text-gray-300 hover:underline">{link.targetUrl}</a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={fetchStats} disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
          </button>
          <a href={`/api/export/${link.id}?format=csv`} download
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </a>
          <a href={`/api/export/${link.id}?format=json`} download
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-4 h-4 text-purple-400" />
            <span>JSON</span>
          </a>
          <button onClick={() => setShowQr(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95">
            <QrCode className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Tracking URL Bar */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#101522]/90 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Tautan Siap Dibagikan ? Radar Aktif</span>
            <span className="text-sm font-mono font-bold text-cyan-300 truncate">{trackingUrl}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleCopy}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-xs font-bold text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Tersalin!" : "Salin Link"}</span>
          </button>
          <a href={`/${link.slug}`} target="_blank" rel="noreferrer"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95">
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Klik" value={stats.totalClicks} subtitle="Semua klik masuk" icon={MousePointerClick} color="cyan" />
        <StatCard title="Manusia" value={stats.humanClicks} subtitle="Klik valid" icon={Users} color="emerald" />
        <StatCard title="Bot & Crawler" value={stats.botClicks} subtitle="Difilter otomatis" icon={ShieldAlert} color="rose" />
        <StatCard title="IP Unik" value={stats.uniqueIps} subtitle="Perangkat berbeda" icon={Globe} color="purple" />
      </div>

      {/* Baterai */}
      {avgBattery !== null && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-3 flex items-center space-x-4">
          <Battery className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-amber-300">Rata-rata Baterai Pengunjung: <span className="text-white">{avgBattery}%</span></span>
          <span className="text-xs text-gray-500">(hanya dari perangkat Chromium/Android)</span>
        </div>
      )}

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ISP / Provider */}
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl">
          <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Signal className="w-4 h-4" />
            <span>ISP / Provider Internet</span>
          </h3>
          <BreakdownBar data={stats.isps || {}} color="bg-emerald-400" />
        </div>

        {/* Referrer Sources */}
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl">
          <h3 className="text-xs font-bold font-mono text-pink-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Asal Klik (Referrer)</span>
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.referrerSources || {}).map(([src, count]) => {
              const icon = SOURCE_ICONS[src] || "??";
              const total = stats.totalClicks || 1;
              const pct = Math.round(((count as number) / total) * 100);
              return (
                <div key={src} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-200">{icon} {src}</span>
                    <span className="text-gray-400">{count as number} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.referrerSources || {}).length === 0 && (
              <p className="text-xs text-gray-600 font-mono">Belum ada data referrer</p>
            )}
          </div>
        </div>

        {/* Device & OS */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>Perangkat</span>
            </h3>
            <BreakdownBar data={stats.devices || {}} color="bg-cyan-400" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl">
            <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Laptop className="w-4 h-4" />
              <span>Sistem Operasi</span>
            </h3>
            <BreakdownBar data={stats.oss || {}} color="bg-purple-400" />
          </div>
        </div>
      </div>

      {/* Lokasi */}
      <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl">
        <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>Distribusi Negara / Lokasi</span>
        </h3>
        <BreakdownBar data={stats.countries || {}} color="bg-amber-400" />
      </div>

      {/* Full Telemetry Log Table */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">Log Telemetri Real-Time</h2>
          </div>
          <span className="text-xs font-mono text-gray-500">Auto-refresh setiap 10 detik</span>
        </div>
        <LogTable logs={link.clickLogs} />
      </div>

      <QrModal isOpen={showQr} url={trackingUrl} slug={link.slug} onClose={() => setShowQr(false)} />
    </div>
  );
}
