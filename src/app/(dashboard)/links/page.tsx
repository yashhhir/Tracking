"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon,
  PlusCircle,
  ExternalLink,
  BarChart2,
  Copy,
  Check,
  QrCode,
  Trash2,
  Calendar,
  MousePointerClick,
  Sparkles,
  Layers,
} from "lucide-react";
import QrModal from "@/components/stats/QrModal";

export default function LinksListPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<{ url: string; slug: string } | null>(null);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus link ini beserta seluruh log trackingnya?")) {
      return;
    }

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus link");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest uppercase">
              Management Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daftar Link Pelacak
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Semua tautan aktif yang siap menangkap sinyal telemetri pengunjung.
          </p>
        </div>

        <Link
          href="/create"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Link Baru</span>
        </Link>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-gray-500 animate-pulse">
          Memindai database link telemetri...
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-12 text-center backdrop-blur-xl">
          <LinkIcon className="mx-auto h-12 w-12 text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-white">Belum Ada Tautan Pelacak</h3>
          <p className="text-xs text-gray-400 mt-1 mb-6 max-w-sm mx-auto">
            Buat tautan pelacak pertama Anda dengan berbagai payload menarik untuk mulai merekam data pengunjung.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mulai Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {links.map((link) => {
            const trackingUrl = typeof window !== "undefined" ? `${window.location.origin}/${link.slug}` : `/${link.slug}`;
            const clickCount = link.currentClicks || 0;

            return (
              <div
                key={link.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101522]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#121826]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {link.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-400">
                        {link.payloadType.replace("_", " ")}
                      </span>
                    </div>

                    {/* URLs */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-1.5 bg-[#080c14] px-3 py-1.5 rounded-lg border border-white/5 text-cyan-300">
                        <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>/{link.slug}</span>
                      </div>
                      <span className="text-gray-500">→</span>
                      <a
                        href={link.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white truncate max-w-xs transition-colors"
                      >
                        {link.targetUrl}
                      </a>
                    </div>

                    <div className="flex items-center space-x-4 text-[11px] text-gray-500 font-mono pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(link.createdAt).toLocaleDateString("id-ID")}</span>
                      </span>
                      {link.maxClicks && (
                        <span>Maks: {link.maxClicks} klik</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Stats & Actions */}
                  <div className="flex items-center space-x-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {/* Click Counter Pill */}
                    <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#080c14] border border-cyan-500/20">
                      <MousePointerClick className="w-4 h-4 text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-white">
                          {clickCount}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">
                          Klik
                        </span>
                      </div>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopy(link.slug, link.id)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Salin Tautan Pelacak"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>

                    {/* QR Button */}
                    <button
                      onClick={() => setSelectedQr({ url: trackingUrl, slug: link.slug })}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Lihat QR Code"
                    >
                      <QrCode className="w-4 h-4 text-purple-400" />
                    </button>

                    {/* Open Target Test */}
                    <a
                      href={`/${link.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Uji Coba Tautan Target"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                    </a>

                    {/* Detailed Stats Link */}
                    <Link
                      href={`/stats/${link.id}`}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all active:scale-95"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>Analitik</span>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                      title="Hapus Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {selectedQr && (
        <QrModal
          isOpen={true}
          url={selectedQr.url}
          slug={selectedQr.slug}
          onClose={() => setSelectedQr(null)}
        />
      )}
    </div>
  );
}
