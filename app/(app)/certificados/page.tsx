"use client";

import { useState } from "react";
import { BadgeCheck, FileDown, Loader2, QrCode, ShieldAlert, Wrench, ChevronDown } from "lucide-react";
import { ScreenHeader, Card } from "@/components/ui";
import { estadoCertificado, registros, esCertificable, TOLERANCIA_MINUTOS, LIMITE_CRITICO } from "@/lib/certificados";

// OCI-001 · Certificados de Cadena de Frío por lote (ECS-P-10)
export default function CertificadosPage() {
  const [items, setItems] = useState(registros);
  const [emitiendo, setEmitiendo] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<string | null>("LOT-0409");
  const [descargado, setDescargado] = useState<string | null>(null);

  const emitidos = items.filter((r) => r.estado === "emitido").length;
  const porEmitir = items.filter((r) => r.estado === "por-emitir").length;
  const noCert = items.filter((r) => r.estado === "no-certificable").length;

  function emitir(lote: string) {
    setEmitiendo(lote);
    setTimeout(() => {
      setItems((xs) => xs.map((r) => (r.lote === lote ? { ...r, estado: "emitido", certificado: "CCF-2026-0034", emitido: "hoy" } : r)));
      setEmitiendo(null);
    }, 1100);
  }

  return (
    <div>
      <ScreenHeader title="Certificados de frío" subtitle="Registro HACCP por lote · INVIMA" back="/inicio" />

      <div className="px-4 pb-8 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <Resumen valor={emitidos} label="Certificados" clase="text-risk-low" />
          <Resumen valor={porEmitir} label="Por emitir" clase="text-info" />
          <Resumen valor={noCert} label="No aptos" clase="text-risk-high" />
        </div>

        <p className="mt-3 rounded-xl bg-info-bg px-3 py-2 text-[12px] leading-snug text-info">
          Regla: certificable si acumula ≤ {TOLERANCIA_MINUTOS} min por encima de -18 °C y nunca supera {LIMITE_CRITICO} °C.
        </p>

        <div className="mt-4 space-y-3">
          {items.map((r) => {
            const e = estadoCertificado[r.estado];
            const open = abierto === r.lote;
            return (
              <Card key={r.lote} className="rise">
                <button onClick={() => setAbierto(open ? null : r.lote)} className="w-full text-left" aria-expanded={open}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">
                        {r.especie} · {r.kg} kg
                      </p>
                      <p className="text-xs text-muted">
                        {r.lote} · {r.cava}
                        {r.certificado && (
                          <>
                            {" "}
                            · <strong className="text-ink">{r.certificado}</strong>
                          </>
                        )}
                      </p>
                    </div>
                    <span className="flex items-center gap-1">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${e.clase}`}>{e.label}</span>
                      <ChevronDown className={`size-4 text-muted transition ${open ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </button>

                {open && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Medida k="Mínima" v={`${r.tempMin.toFixed(1)} °C`} />
                      <Medida k="Máxima" v={`${r.tempMax.toFixed(1)} °C`} alerta={r.tempMax > -18} />
                      <Medida k="Fuera de rango" v={`${r.minutosFuera} min`} alerta={r.minutosFuera > 0} />
                    </div>
                    {r.accionCorrectiva && (
                      <p className="flex gap-2 rounded-xl bg-brand-50 p-3 text-xs">
                        <Wrench className="size-4 shrink-0 text-brand-600" />
                        <span>
                          <strong>Acción correctiva:</strong> {r.accionCorrectiva}
                        </span>
                      </p>
                    )}

                    {r.estado === "emitido" && (
                      <div className="flex items-center gap-3 rounded-xl border border-risk-low/30 bg-risk-low-bg p-3">
                        <QrCode className="size-12 shrink-0 text-ink" />
                        <div className="flex-1 text-xs">
                          <p className="flex items-center gap-1 font-bold text-risk-low">
                            <BadgeCheck className="size-4" /> {r.certificado}
                          </p>
                          <p className="text-ink/70">Emitido {r.emitido}. El comprador lo verifica escaneando el QR.</p>
                        </div>
                        <button
                          onClick={() => setDescargado(r.lote)}
                          aria-label="Descargar certificado"
                          className="grid size-11 place-items-center rounded-xl bg-white text-brand-700 shadow-sm"
                        >
                          <FileDown className="size-5" />
                        </button>
                      </div>
                    )}
                    {descargado === r.lote && <p className="text-center text-xs text-risk-low">Certificado listo para compartir (simulado).</p>}

                    {r.estado === "por-emitir" && esCertificable(r) && (
                      <button
                        onClick={() => emitir(r.lote)}
                        disabled={emitiendo === r.lote}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-info font-bold text-white active:scale-[0.98] disabled:opacity-80"
                      >
                        {emitiendo === r.lote ? <Loader2 className="size-5 animate-spin" /> : <BadgeCheck className="size-5" />}
                        {emitiendo === r.lote ? "Emitiendo…" : "Emitir certificado"}
                      </button>
                    )}

                    {r.estado === "no-certificable" && (
                      <p className="flex gap-2 rounded-xl bg-risk-high-bg p-3 text-xs text-risk-high">
                        <ShieldAlert className="size-4 shrink-0" />
                        Superó el límite crítico ({r.tempMax.toFixed(1)} °C, {r.minutosFuera} min fuera de rango). Solo puede salir como venta local o
                        procesamiento.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Resumen({ valor, label, clase }: { valor: number; label: string; clase: string }) {
  return (
    <Card className="flex flex-col items-center p-3 text-center">
      <span className={`text-2xl font-bold ${clase}`}>{valor}</span>
      <span className="text-[11px] text-muted">{label}</span>
    </Card>
  );
}

function Medida({ k, v, alerta }: { k: string; v: string; alerta?: boolean }) {
  return (
    <div className="rounded-xl bg-surface p-2">
      <p className={`text-sm font-bold ${alerta ? "text-risk-high" : ""}`}>{v}</p>
      <p className="text-[10px] text-muted">{k}</p>
    </div>
  );
}
