import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-500 font-mono">
        <p>ADVANCED LINK TRACKING ARCHITECTURE • TELEMETRY ENGINE & SENSOR RADAR</p>
      </footer>
    </div>
  );
}
