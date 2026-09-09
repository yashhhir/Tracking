"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, PlusCircle, ListFilter, ShieldAlert, Cpu, Activity } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: Activity },
    { label: "Tracking Links", href: "/links", icon: ListFilter },
    { label: "Create Link", href: "/create", icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080c14]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  TRACKER<span className="text-fuchsia-400">.LINK</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase -mt-1">
                  Telemetry & Intel System
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-white/10">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                Radar Active
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>v1.2</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
