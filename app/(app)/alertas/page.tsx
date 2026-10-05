"use client";

import { useState } from "react";
import { MapPin, Thermometer, BatteryWarning, Hourglass, Wifi, Send } from "lucide-react";
import { ScreenHeader } from "@/components/ui";
import { alertasIniciales, type Alerta, type NivelAlerta } from "@/lib/data";

const estilos: Record<NivelAlerta, { card: string; borde: string; chip: string; etiqueta: string; dot: string }> = {
  critico: { card: "bg-risk-high-bg border-risk-high/30", borde: "bg-risk-high", chip: "text-risk-high", etiqueta: "CRÍTICA", dot: "bg-risk-high" },
  advertencia: { card: "bg-risk-mid-bg border-risk-mid/30", borde: "bg-risk-mid", chip: "bg-risk-mid-bg text-risk-mid", etiqueta: "ADVERTENCIA", dot: "bg-risk-mid" },
  info: { card: "bg-white border-brand-100", borde: "bg-transparent", chip: "bg-brand-50 text-brand-700", etiqueta: "INFO", dot: "bg-brand-500" },
};

const iconos: Record<Alerta["icono"], React.ReactNode> = {
  termometro: <Thermometer className="size-5 text-risk-high" />,
  energia: <BatteryWarning className="size-5 text-risk-mid" />,
  vencimiento: <Hourglass className="size-5 text-risk-mid" />,
  sensor: <Wifi className="size-5 text-brand-600" />,
};

type Filtro = "todas" | "activas" | "atendidas";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState(alertasIniciales);
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const activas = alertas.filter((a) => !a.leida).length;
  const visibles = alertas.filter((a) => (filtro === "todas" ? true : filtro === "activas" ? !a.leida : a.leida));
  const atender = (id: string) => setAlertas((as) => as.map((x) => (x.id === id ? { ...x, leida: true } : x)));

  return (
    <div>
      <ScreenHeader title="Alarmas" subtitle={activas ? `${activas} alarmas sin atender` : "Todo bajo control"} />

      <div className="px-4 pb-8 pt-4">
        <div className="flex gap-2">
          {(["todas", "activas", "atendidas"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                filtro === f ? "border-brand-600 bg-brand-600 text-white" : "border-brand-200 bg-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visibles.map((a) => {
            const e = estilos[a.nivel];
            return (
              <div key={a.id} className={`rise relative overflow-hidden rounded-2xl border p-4 ${e.card}`}>
                <span className={`absolute inset-y-0 left-0 w-1 ${e.borde}`} />
                <div className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80">{iconos[a.icono]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{a.titulo}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${e.chip}`}>{e.etiqueta}</span>
                      {!a.leida && <span className={`size-2 rounded-full ${e.dot}`} />}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-ink/80">{a.detalle}</p>
                    {a.entrega && (
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink/70">
                        <Send className="size-3" /> {a.entrega}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                      <span className="flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 font-semibold text-brand-700">
                        <MapPin className="size-3" /> {a.lugar}
                      </span>
                      {a.hace}
                    </p>
                  </div>
                </div>
                {!a.leida && (
                  <button
                    onClick={() => atender(a.id)}
                    className={`mt-3 h-11 w-full rounded-xl text-sm font-bold text-white active:scale-[0.98] ${a.nivel === "critico" ? "bg-risk-high" : "bg-brand-600"}`}
                  >
                    Marcar como atendida
                  </button>
                )}
              </div>
            );
          })}
          {visibles.length === 0 && <p className="py-10 text-center text-sm text-muted">No hay alarmas en esta vista.</p>}
        </div>

        <p className="mt-5 text-center text-[11px] text-muted">
          Las alarmas críticas se entregan por SMS y sirena en menos de 30 segundos.
        </p>
      </div>
    </div>
  );
}
