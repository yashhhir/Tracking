import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "cyan" | "purple" | "emerald" | "amber" | "rose";
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "cyan",
}: StatCardProps) {
  const colorMap = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: "group-hover:shadow-cyan-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "group-hover:shadow-emerald-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "group-hover:shadow-amber-500/20",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
      glow: "group-hover:shadow-rose-500/20",
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${scheme.border} bg-[#101522]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
          {title}
        </span>
        <div className={`rounded-xl p-2.5 ${scheme.bg} ${scheme.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-400 font-sans">{subtitle}</p>
      )}

      {/* Decorative gradient corner */}
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/15 transition-all" />
    </div>
  );
}
