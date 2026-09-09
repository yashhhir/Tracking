"use client";

import { useState } from "react";
import {
  Smartphone, Laptop, BatteryCharging, Battery, ShieldAlert, UserCheck,
  Globe, ChevronDown, ChevronRight, Search, Wifi, MapPin, Camera,
  Signal, Share2, Map, Eye, EyeOff,
} from "lucide-react";

interface ClickLogItem {
  id: string;
  ip: string;
  country?: string | null;
  countryCode?: string | null;
  region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isp?: string | null;
  asn?: string | null;
  org?: string | null;
  deviceType?: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  os?: string | null;
  osVersion?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  screenWidth?: number | null;
  screenHeight?: number | null;
  devicePixelRatio?: number | null;
  orientation?: string | null;
  colorDepth?: number | null;
  language?: string | null;
  timezone?: string | null;
  ram?: number | null;
  cpuCores?: number | null;
  batteryLevel?: number | null;
  isCharging?: boolean | null;
  chargingTime?: number | null;
  touchSupport?: boolean | null;
  connectionType?: string | null;
  referrer?: string | null;
  referrerDomain?: string | null;
  referrerSource?: string | null;
  gpsLat?: number | null;
  gpsLon?: number | null;
  gpsAccuracy?: number | null;
  locationGranted?: boolean | null;
  cameraGranted?: boolean | null;
  userAgent: string;
  isBot: boolean;
  botName?: string | null;
  createdAt: string | Date;
}

interface LogTableProps {
  logs: ClickLogItem[];
}

const SOURCE_ICONS: Record<string, string> = {
  "Instagram": "??",
  "WhatsApp": "??",
  "Telegram": "??",
  "Facebook": "??",
  "Twitter / X": "??",
  "TikTok": "??",
  "YouTube": "??",
  "Google Search": "??",
  "Bing Search": "??",
  "Discord": "??",
  "LinkedIn": "??",
  "Reddit": "??",
  "LINE": "??",
  "Direct / Tidak Diketahui": "??",
  "Email": "??",
};

function getReferrerBadgeColor(source?: string | null) {
  if (!source) return "bg-gray-500/10 border-gray-500/20 text-gray-400";
  if (source.includes("Instagram")) return "bg-pink-500/10 border-pink-500/20 text-pink-300";
  if (source.includes("WhatsApp")) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
  if (source.includes("Telegram")) return "bg-blue-500/10 border-blue-500/20 text-blue-300";
  if (source.includes("Facebook")) return "bg-indigo-500/10 border-indigo-500/20 text-indigo-300";
  if (source.includes("TikTok")) return "bg-purple-500/10 border-purple-500/20 text-purple-300";
  if (source.includes("Google")) return "bg-amber-500/10 border-amber-500/20 text-amber-300";
  if (source.includes("Twitter")) return "bg-sky-500/10 border-sky-500/20 text-sky-300";
  return "bg-cyan-500/10 border-cyan-500/20 text-cyan-300";
}

export default function LogTable({ logs }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [botFilter, setBotFilter] = useState<"all" | "human" | "bot">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (botFilter === "human" && log.isBot) return false;
    if (botFilter === "bot" && !log.isBot) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.ip.toLowerCase().includes(term) ||
      (log.city || "").toLowerCase().includes(term) ||
      (log.country || "").toLowerCase().includes(term) ||
      (log.isp || "").toLowerCase().includes(term) ||
      (log.os || "").toLowerCase().includes(term) ||
      (log.browser || "").toLowerCase().includes(term) ||
      (log.referrerSource || "").toLowerCase().includes(term) ||
      (log.botName || "").toLowerCase().includes(term)
    );
  });

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101522]/80 border border-white/10 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari IP, Kota, ISP / Provider, Sumber..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090d16] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </div>
        <div className="flex items-center space-x-1.5 bg-[#090d16] p-1 rounded-xl border border-white/5">
          {(["all", "human", "bot"] as const).map((f) => {
            const count = f === "all" ? logs.length : f === "human" ? logs.filter(l => !l.isBot).length : logs.filter(l => l.isBot).length;
            const label = f === "all" ? "Semua" : f === "human" ? "Manusia" : "Bot";
            const active = botFilter === f;
            const colors: Record<string, string> = {
              all: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
              human: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
              bot: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
            };
            return (
              <button key={f} onClick={() => setBotFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? colors[f] : "text-gray-400 hover:text-white"}`}>
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101522]/90 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0b0f19] text-gray-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Waktu & IP Publik</th>
                <th className="py-3 px-4">Lokasi & ISP / Provider</th>
                <th className="py-3 px-4">Perangkat & OS</th>
                <th className="py-3 px-4">Asal Klik (Referrer)</th>
                <th className="py-3 px-4">Akses Sensor</th>
                <th className="py-3 px-4">Baterai</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-mono">
                    Belum ada data telemetri yang cocok.
                  </td>
                </tr>
              ) : filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                const dateStr = new Date(log.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "medium" });
                const sourceIcon = SOURCE_ICONS[log.referrerSource || ""] || "??";

                return (
                  <>
                    <tr key={log.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => toggleExpand(log.id)}>

                      {/* IP & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">{log.ip}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">{dateStr}</div>
                      </td>

                      {/* Location & ISP */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-medium text-gray-200">
                            {log.city || "?"}, {log.country || "?"}
                          </span>
                        </div>
                        {/* ISP / Provider ? most prominent */}
                        <div className="mt-1 flex items-center space-x-1.5">
                          <Signal className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="font-bold text-emerald-300 text-[11px]">
                            {log.isp || "Provider Tidak Diketahui"}
                          </span>
                        </div>
                        {log.gpsLat && log.gpsLon && (
                          <div className="mt-0.5 flex items-center space-x-1 text-[10px] text-amber-400 font-mono">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{log.gpsLat.toFixed(4)}, {log.gpsLon.toFixed(4)}</span>
                          </div>
                        )}
                      </td>

                      {/* Device & OS */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          {log.deviceType === "mobile" ? (
                            <Smartphone className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Laptop className="w-4 h-4 text-indigo-400" />
                          )}
                          <span className="font-semibold text-gray-200">
                            {log.deviceBrand ? `${log.deviceBrand} ` : ""}{log.deviceModel || (log.deviceType === "mobile" ? "Smartphone" : "PC")}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {log.os || "OS"} {log.osVersion} ? {log.browser || "Browser"}
                        </div>
                        {log.screenWidth && (
                          <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                            {log.screenWidth}x{log.screenHeight} @ {log.devicePixelRatio}x
                          </div>
                        )}
                      </td>

                      {/* Referrer Source */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold font-mono ${getReferrerBadgeColor(log.referrerSource)}`}>
                          <span>{sourceIcon}</span>
                          <span>{log.referrerSource || "Direct"}</span>
                        </span>
                        {log.referrerDomain && log.referrerDomain !== log.referrerSource && (
                          <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[140px] font-mono">
                            {log.referrerDomain}
                          </div>
                        )}
                      </td>

                      {/* Sensor Access */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <MapPin className={`w-3.5 h-3.5 ${log.locationGranted ? "text-emerald-400" : "text-gray-600"}`} />
                            <span className={`text-[11px] font-mono ${log.locationGranted ? "text-emerald-400" : "text-gray-500"}`}>
                              {log.locationGranted ? "GPS Diizinkan" : "GPS Ditolak"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Camera className={`w-3.5 h-3.5 ${log.cameraGranted ? "text-emerald-400" : "text-gray-600"}`} />
                            <span className={`text-[11px] font-mono ${log.cameraGranted ? "text-emerald-400" : "text-gray-500"}`}>
                              {log.cameraGranted ? "Kamera OK" : "Kamera Ditolak"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Battery */}
                      <td className="py-3.5 px-4">
                        {log.batteryLevel !== null && log.batteryLevel !== undefined ? (
                          <div className="flex items-center space-x-1.5">
                            {log.isCharging ? (
                              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
                            ) : (
                              <Battery className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="font-mono font-bold text-gray-200">{log.batteryLevel}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-mono italic">Blocked</span>
                        )}
                      </td>

                      {/* Bot Status */}
                      <td className="py-3.5 px-4 text-center">
                        {log.isBot ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Bot</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                            <UserCheck className="w-3 h-3" />
                            <span>Human</span>
                          </span>
                        )}
                      </td>

                      {/* Expand */}
                      <td className="py-3.5 px-4 text-center">
                        <button onClick={(e) => { e.stopPropagation(); toggleExpand(log.id); }}
                          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr key={`${log.id}-expanded`} className="bg-[#0a0d17]">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            {/* IP & Network */}
                            <div className="space-y-2">
                              <h4 className="font-bold font-mono text-cyan-400 uppercase text-[10px] tracking-wider">IP & Jaringan</h4>
                              <div className="space-y-1 font-mono text-gray-300">
                                <div><span className="text-gray-500">IP:</span> <span className="text-white font-bold">{log.ip}</span></div>
                                <div><span className="text-gray-500">ISP / Provider:</span> <span className="text-emerald-300 font-bold">{log.isp}</span></div>
                                <div><span className="text-gray-500">ASN:</span> <span className="text-gray-300">{log.asn || "N/A"}</span></div>
                                <div><span className="text-gray-500">Org:</span> <span className="text-gray-300 break-words">{log.org || "N/A"}</span></div>
                                <div><span className="text-gray-500">Koneksi:</span> <span className="text-gray-300">{log.connectionType || "unknown"}</span></div>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                              <h4 className="font-bold font-mono text-amber-400 uppercase text-[10px] tracking-wider">Lokasi</h4>
                              <div className="space-y-1 font-mono text-gray-300">
                                <div><span className="text-gray-500">Negara:</span> <span className="text-white">{log.country} ({log.countryCode})</span></div>
                                <div><span className="text-gray-500">Provinsi:</span> <span className="text-white">{log.region}</span></div>
                                <div><span className="text-gray-500">Kota:</span> <span className="text-white">{log.city}</span></div>
                                {log.gpsLat && (
                                  <>
                                    <div><span className="text-gray-500">GPS Lat:</span> <span className="text-amber-300">{log.gpsLat?.toFixed(6)}</span></div>
                                    <div><span className="text-gray-500">GPS Lon:</span> <span className="text-amber-300">{log.gpsLon?.toFixed(6)}</span></div>
                                    <div><span className="text-gray-500">Akurasi GPS:</span> <span className="text-amber-300">{log.gpsAccuracy ? `?${Math.round(log.gpsAccuracy)}m` : "N/A"}</span></div>
                                    <a href={`https://www.google.com/maps?q=${log.gpsLat},${log.gpsLon}`} target="_blank" rel="noreferrer"
                                      className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 hover:underline mt-1">
                                      <Map className="w-3 h-3" />
                                      <span>Buka di Google Maps</span>
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Device */}
                            <div className="space-y-2">
                              <h4 className="font-bold font-mono text-purple-400 uppercase text-[10px] tracking-wider">Perangkat & Browser</h4>
                              <div className="space-y-1 font-mono text-gray-300">
                                <div><span className="text-gray-500">Merk:</span> <span className="text-white">{log.deviceBrand || "Unknown"}</span></div>
                                <div><span className="text-gray-500">Model:</span> <span className="text-white">{log.deviceModel || "Unknown"}</span></div>
                                <div><span className="text-gray-500">OS:</span> <span className="text-white">{log.os} {log.osVersion}</span></div>
                                <div><span className="text-gray-500">Browser:</span> <span className="text-white">{log.browser} {log.browserVersion}</span></div>
                                <div><span className="text-gray-500">Layar:</span> <span className="text-white">{log.screenWidth}x{log.screenHeight} @{log.devicePixelRatio}x</span></div>
                                <div><span className="text-gray-500">RAM:</span> <span className="text-white">{log.ram ? `${log.ram} GB` : "N/A"}</span></div>
                                <div><span className="text-gray-500">CPU Core:</span> <span className="text-white">{log.cpuCores || "N/A"}</span></div>
                                <div><span className="text-gray-500">Bahasa:</span> <span className="text-white">{log.language}</span></div>
                                <div><span className="text-gray-500">Timezone:</span> <span className="text-white">{log.timezone}</span></div>
                              </div>
                            </div>

                            {/* Referrer & Permissions */}
                            <div className="space-y-2">
                              <h4 className="font-bold font-mono text-rose-400 uppercase text-[10px] tracking-wider">Referrer & Izin</h4>
                              <div className="space-y-1 font-mono text-gray-300">
                                <div><span className="text-gray-500">Sumber:</span> <span className="text-pink-300 font-bold">{log.referrerSource || "Direct"}</span></div>
                                <div><span className="text-gray-500">Domain:</span> <span className="text-gray-300 break-words">{log.referrerDomain || "-"}</span></div>
                                <div className="break-words"><span className="text-gray-500">URL Lengkap:</span> <span className="text-gray-400 text-[10px]">{log.referrer?.slice(0, 80) || "-"}</span></div>
                                <div className="mt-2">
                                  <div className="flex items-center space-x-1.5 mb-1">
                                    <MapPin className={`w-3.5 h-3.5 ${log.locationGranted ? "text-emerald-400" : "text-red-400"}`} />
                                    <span className={log.locationGranted ? "text-emerald-400" : "text-red-400"}>
                                      GPS: {log.locationGranted ? "Diizinkan" : "Ditolak"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1.5 mb-1">
                                    <Camera className={`w-3.5 h-3.5 ${log.cameraGranted ? "text-emerald-400" : "text-red-400"}`} />
                                    <span className={log.cameraGranted ? "text-emerald-400" : "text-red-400"}>
                                      Kamera: {log.cameraGranted ? "Diizinkan" : "Ditolak"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    {log.batteryLevel !== null ? (
                                      <>
                                        <BatteryCharging className={`w-3.5 h-3.5 ${log.isCharging ? "text-emerald-400" : "text-amber-400"}`} />
                                        <span className="text-amber-300">{log.batteryLevel}% {log.isCharging ? "(Charging)" : ""}</span>
                                      </>
                                    ) : (
                                      <span className="text-gray-500 text-[10px]">Baterai: Diblokir Browser</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* User Agent */}
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <span className="text-[10px] font-mono text-gray-600">User-Agent: </span>
                            <span className="text-[10px] font-mono text-gray-400 break-words">{log.userAgent}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
