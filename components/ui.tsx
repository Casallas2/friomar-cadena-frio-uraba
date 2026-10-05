import Link from "next/link";
import { ChevronLeft, Signal, Wifi, BatteryFull } from "lucide-react";

export function StatusBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div
      className={`hidden items-center justify-between px-7 pb-1 pt-3.5 text-[13px] font-semibold lg:flex ${
        tone === "light" ? "text-white" : "text-ink"
      }`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal className="size-3.5" />
        <Wifi className="size-3.5" />
        <BatteryFull className="size-4" />
      </span>
    </div>
  );
}

// Encabezado verde reutilizado por las pantallas internas (consistencia visual)
export function ScreenHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="bg-brand-600 text-white">
      <StatusBar />
      <div className="flex items-center gap-3 px-5 pb-5 pt-3">
        {back && (
          <Link
            href={back}
            aria-label="Volver"
            className="-ml-1 grid size-9 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-2.5 mt-6 flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-brand-100 bg-white p-4 shadow-[0_2px_10px_-4px_rgba(15,60,100,0.15)] ${className}`}>
      {children}
    </div>
  );
}
