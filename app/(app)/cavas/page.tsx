"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plug, BatteryCharging, Cpu, BellOff, BellRing, Volume2, Package, Timer } from "lucide-react";
import { ScreenHeader, SectionTitle, Card } from "@/components/ui";
import { TempChart } from "@/components/temp-chart";
import { cavas, estadoCavaStyles, UMBRAL_CONGELACION } from "@/lib/data";

export default function CavasPage() {
  return (
    <Suspense>
      <Cavas />
    </Suspense>
  );
}

function Cavas() {
  const params = useSearchParams();
  const inicial = cavas.find((c) => c.id === params.get("c"))?.id ?? "c2";
  const [id, setId] = useState(inicial);
  const [silenciada, setSilenciada] = useState(false);
  const [prueba, setPrueba] = useState(false);
  const cava = cavas.find((c) => c.id === id)!;
  const s = estadoCavaStyles[cava.estado];
  const minima = Math.min(...cava.lecturas);
  const maxima = Math.max(...cava.lecturas);

  function probarAlarma() {
    setPrueba(true);
    setTimeout(() => setPrueba(false), 2500);
  }

  return (
    <div>
      <ScreenHeader title="Monitoreo de cavas" subtitle="Lectura cada 30 s · en vivo" back="/inicio" />

      <div className="px-4 pb-8 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {cavas.map((c) => {
            const cs = estadoCavaStyles[c.estado];
            return (
              <button
                key={c.id}
                onClick={() => {
                  setId(c.id);
                  setSilenciada(false);
                }}
                className={`rounded-2xl border p-2.5 text-left transition ${
                  id === c.id ? "border-brand-600 bg-white ring-2 ring-brand-600" : "border-brand-100 bg-white"
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`size-2 rounded-full ${cs.dot}`} /> {c.nombre}
                </span>
                <span className={`mt-0.5 block text-lg font-bold ${cs.text}`}>{c.temperatura.toFixed(1)}°</span>
              </button>
            );
          })}
        </div>

        <Card className={`mt-4 ${s.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted">
                {cava.nombre} · {cava.sede}
              </p>
              <p className={`text-5xl font-bold tracking-tight ${s.text}`}>
                {cava.temperatura.toFixed(1)}
                <span className="text-2xl"> °C</span>
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${s.bg} ${s.text}`}>{s.label}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Límite seguro: {UMBRAL_CONGELACION} °C o menos · mín {minima.toFixed(1)} · máx {maxima.toFixed(1)}
          </p>
          <div className="mt-3">
            <TempChart lecturas={cava.lecturas} />
          </div>
        </Card>

        {cava.estado === "alarma" && (
          <div className="mt-3 rounded-2xl border border-risk-high/30 bg-risk-high-bg p-4">
            <p className="flex items-center gap-2 font-bold text-risk-high">
              <BellRing className="size-5" /> Fuera de rango hace {cava.minutosFueraRango} min
            </p>
            <p className="mt-1 text-xs text-risk-high/90">SMS enviado a 3 responsables en 12 s. Alarma sonora en la bodega.</p>
            <button
              onClick={() => setSilenciada((v) => !v)}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-risk-high font-bold text-white active:scale-[0.98]"
            >
              {silenciada ? <BellRing className="size-5" /> : <BellOff className="size-5" />}
              {silenciada ? "Reactivar sirena" : "Silenciar sirena (sigue el monitoreo)"}
            </button>
          </div>
        )}

        <SectionTitle>Detalles</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Dato
            icon={cava.energia === "red" ? <Plug className="size-5 text-risk-low" /> : <BatteryCharging className="size-5 text-risk-mid" />}
            label="Energía"
            valor={cava.energia === "red" ? "Red eléctrica" : `Batería · ${cava.autonomia}`}
          />
          <Dato icon={<Package className="size-5 text-brand-600" />} label="Ocupación" valor={`${cava.ocupacion}% de ${cava.capacidadKg.toLocaleString("es-CO")} kg`} />
          <Dato icon={<Timer className="size-5 text-brand-600" />} label="Fuera de rango hoy" valor={`${cava.minutosFueraRango} min`} />
          <Dato
            icon={<Cpu className="size-5 text-brand-600" />}
            label={`Sensor ${cava.sensor.marca}`}
            valor={`${cava.sensor.modelo} · ${cava.sensor.protocolo}`}
          />
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          Cada marca de termómetro se conecta mediante un adaptador (patrón Adapter): la app muestra todas las lecturas en el
          mismo formato.
        </p>

        <button
          onClick={probarAlarma}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-white font-semibold text-brand-700"
        >
          <Volume2 className="size-5" /> {prueba ? "Sonando… alarma de prueba enviada" : "Probar alarma"}
        </button>
      </div>
    </div>
  );
}

function Dato({ icon, label, valor }: { icon: React.ReactNode; label: string; valor: string }) {
  return (
    <Card className="p-3.5">
      {icon}
      <p className="mt-2 text-sm font-bold leading-tight">{valor}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}
