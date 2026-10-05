"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, ChevronDown } from "lucide-react";
import { ScreenHeader, Card } from "@/components/ui";
import { lotes, cavas, diasRestantes, semaforoVida } from "@/lib/data";
import { estadoCertificado, registroDe } from "@/lib/certificados";

export default function InventarioPage() {
  const [cava, setCava] = useState("todas");
  const [abierto, setAbierto] = useState<string | null>("LOT-0409");
  const visibles = lotes
    .filter((l) => cava === "todas" || l.cava === cava)
    .map((l) => ({ ...l, dias: diasRestantes(l) }))
    .sort((a, b) => a.dias - b.dias);
  const total = visibles.reduce((s, l) => s + l.kg, 0);

  return (
    <div>
      <ScreenHeader title="Inventario" subtitle={`${total.toLocaleString("es-CO")} kg en ${visibles.length} lotes`} back="/inicio" />
      <div className="px-4 pb-8 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["todas", ...cavas.map((c) => c.nombre)].map((c) => (
            <button
              key={c}
              onClick={() => setCava(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                cava === c ? "border-brand-600 bg-brand-600 text-white" : "border-brand-200 bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visibles.map((l) => {
            const sv = semaforoVida(l.dias);
            const pct = Math.round((l.dias / l.vidaBaseDias) * 100);
            const open = abierto === l.id;
            const reg = registroDe(l.id); // OCI-001
            return (
              <Card key={l.id} className="rise">
                <button onClick={() => setAbierto(open ? null : l.id)} className="w-full text-left" aria-expanded={open}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">
                        {l.especie} · {l.kg} kg
                      </p>
                      <p className="text-xs text-muted">
                        {l.id} · {l.cava} · ingresó {l.ingreso} a {l.tempIngreso.toFixed(1)} °C
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${sv.bg} ${sv.text}`}>{sv.label}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-50">
                      <div className={`h-full rounded-full ${sv.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${sv.text}`}>{l.dias} días</span>
                    <ChevronDown className={`size-4 text-muted transition ${open ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {reg && (
                  <Link href="/certificados" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold">
                    <span className={`rounded-full px-2 py-0.5 ${estadoCertificado[reg.estado].clase}`}>{estadoCertificado[reg.estado].label}</span>
                    <span className="text-muted">{reg.certificado ?? "Certificado de cadena de frío"} →</span>
                  </Link>
                )}
                {open && (
                  <div className="mt-3 rounded-xl bg-brand-50 p-3 text-xs">
                    <p className="font-semibold">Cálculo del tiempo máximo de almacenamiento seguro</p>
                    <dl className="mt-2 space-y-1">
                      <Fila k={`Vida útil de referencia (${l.especie}, ≤ -18 °C)`} v={`${l.vidaBaseDias} días`} />
                      <Fila k="Días almacenado" v={`− ${l.diasAlmacenado}`} />
                      <Fila k="Descuento por excursiones térmicas" v={`− ${l.penalizacionDias}`} alerta={l.penalizacionDias > 0} />
                      <div className="border-t border-brand-200 pt-1">
                        <Fila k="Tiempo seguro restante" v={`${l.dias} días`} fuerte />
                      </div>
                    </dl>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <p className="mt-4 flex gap-2 text-[11px] leading-snug text-muted">
          <Info className="size-3.5 shrink-0" />
          Cada hora por encima de -18 °C descuenta vida útil antes de la pérdida organoléptica (sabor, olor y textura).
        </p>
      </div>
    </div>
  );
}

function Fila({ k, v, alerta, fuerte }: { k: string; v: string; alerta?: boolean; fuerte?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{k}</dt>
      <dd className={`${fuerte ? "font-bold text-ink" : ""} ${alerta ? "font-semibold text-risk-high" : ""}`}>{v}</dd>
    </div>
  );
}
