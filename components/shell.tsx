"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Snowflake, GitBranch, Info } from "lucide-react";
import { APP_RELEASE, APP_VERSION } from "@/lib/version";
import { pantallas } from "@/lib/pantallas";

// Marco del prototipo: en escritorio muestra el teléfono junto a un panel
// de contexto; en el celular la app ocupa toda la pantalla.
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:flex lg:items-center lg:justify-center lg:gap-14 lg:px-10 lg:py-8">
      <aside className="hidden w-80 shrink-0 lg:block">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-brand-600 text-white shadow-md">
            <Snowflake className="size-6" />
          </span>
          <div>
            <p className="text-xl font-bold leading-tight text-brand-800">FríoMar</p>
            <p className="text-sm text-muted">Inventario y cadena de frío · Urabá</p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted">
          Prototipo navegable del sistema de inventario y cadena de frío para cooperativas pesqueras de Necoclí y Turbo.
          Presentado por <strong className="text-ink">Jean Londoño</strong>{" "}
          — Ingeniería de Software II, Uniremington.
        </p>

        <nav className="mt-6 rounded-2xl border border-brand-100 bg-white/70 p-2 shadow-sm">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Pantallas
          </p>
          <ul>
            {pantallas.map((p) => {
              const activa = pathname === p.href;
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                      activa
                        ? "bg-brand-600 font-semibold text-white"
                        : "text-ink hover:bg-brand-50"
                    }`}
                  >
                    <span>{p.nombre}</span>
                    {p.etiqueta && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activa ? "bg-white/20 text-white" : "bg-info-bg text-info"
                        }`}
                      >
                        {p.etiqueta}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-brand-100 bg-white/70 px-4 py-3 text-sm shadow-sm">
          <GitBranch className="size-4 text-brand-600" />
          <span className="font-semibold">v{APP_VERSION}</span>
          <span className="text-muted">· {APP_RELEASE}</span>
        </div>

        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Demostración de interfaz: no hay backend ni datos reales. Todo lo que ves es simulado.
        </p>
      </aside>

      {/* Teléfono */}
      <div className="relative mx-auto h-dvh w-full overflow-hidden bg-surface lg:h-[860px] lg:w-[400px] lg:shrink-0 lg:rounded-[3.2rem] lg:border-[12px] lg:border-[#1d1f1d] lg:shadow-[0_30px_80px_-20px_rgba(10,40,70,0.45)]">
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-50 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-[#1d1f1d] lg:block" />
        {children}
      </div>
    </div>
  );
}
