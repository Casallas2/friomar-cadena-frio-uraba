"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Thermometer, PackagePlus, Boxes, Bell } from "lucide-react";

const items = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/cavas", label: "Cavas", icon: Thermometer },
  { href: "/registrar", label: "Registrar", icon: PackagePlus, principal: true },
  { href: "/inventario", label: "Inventario", icon: Boxes },
  { href: "/alertas", label: "Alarmas", icon: Bell, badge: 2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-20 grid grid-cols-5 border-t border-brand-100 bg-white px-2 pb-5 pt-2 lg:pb-6">
      {items.map(({ href, label, icon: Icon, principal, badge }) => {
        const activo = pathname === href;
        if (principal) {
          return (
            <Link key={href} href={href} className="flex flex-col items-center" aria-label="Registrar entrada o salida">
              <span
                className={`-mt-8 grid size-16 place-items-center rounded-full border-4 border-white text-white shadow-lg transition active:scale-95 ${
                  activo ? "bg-brand-800" : "bg-brand-600 hover:bg-brand-700"
                }`}
              >
                <Icon className="size-7" />
              </span>
              <span className={`mt-1 text-[11px] font-semibold ${activo ? "text-brand-700" : "text-ink"}`}>
                {label}
              </span>
            </Link>
          );
        }
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] transition-colors ${
              activo ? "font-semibold text-brand-700" : "text-muted hover:text-brand-700"
            }`}
          >
            <span className="relative">
              <Icon className="size-[22px]" strokeWidth={activo ? 2.4 : 2} />
              {badge && (
                <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-risk-high text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
