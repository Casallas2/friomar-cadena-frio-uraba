import Link from "next/link";
import { MapPin, Siren, ChevronRight, Thermometer, AlertTriangle, Scale, BatteryCharging, Hourglass, BadgeCheck } from "lucide-react";
import { StatusBar, SectionTitle, Card } from "@/components/ui";
import { TempChart } from "@/components/temp-chart";
import { cavas, estadoCavaStyles, lotes, diasRestantes, semaforoVida } from "@/lib/data";

export default function InicioPage() {
  const stock = lotes.reduce((s, l) => s + l.kg, 0);
  const enAlarma = cavas.filter((c) => c.estado === "alarma").length;
  const porVencer = lotes
    .map((l) => ({ ...l, dias: diasRestantes(l) }))
    .filter((l) => l.dias <= 30)
    .sort((a, b) => a.dias - b.dias);

  return (
    <div className="bg-brand-600">
      <header className="text-white">
        <StatusBar />
        <div className="flex items-start justify-between px-5 pb-10 pt-3">
          <div>
            <p className="text-sm text-white/80">Buenos días,</p>
            <h1 className="text-2xl font-bold">Rosa Palacios</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
              <MapPin className="size-3.5" /> Coop. Pescadores del Golfo · Necoclí
            </p>
          </div>
          <span className="grid size-11 place-items-center rounded-full border-2 border-white/40 bg-white/15 font-bold">RP</span>
        </div>
      </header>

      <div className="-mt-6 rounded-t-[1.75rem] bg-surface px-4 pb-8 pt-5">
        <div className="grid grid-cols-3 gap-3">
          <Card className="flex flex-col items-center p-3 text-center">
            <Thermometer className="size-5 text-brand-600" />
            <span className="mt-1 text-2xl font-bold">{cavas.length}</span>
            <span className="text-[11px] text-muted">Cavas</span>
          </Card>
          <Card className="flex flex-col items-center border-risk-high/30 bg-risk-high-bg p-3 text-center">
            <AlertTriangle className="size-5 text-risk-high" />
            <span className="mt-1 text-2xl font-bold text-risk-high">{enAlarma}</span>
            <span className="text-[11px] text-risk-high">En alarma</span>
          </Card>
          <Card className="flex flex-col items-center p-3 text-center">
            <Scale className="size-5 text-brand-600" />
            <span className="mt-1 text-2xl font-bold">{(stock / 1000).toFixed(1)} t</span>
            <span className="text-[11px] text-muted">En stock</span>
          </Card>
        </div>

        <Link
          href="/alertas"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-risk-high/30 bg-risk-high-bg p-4 transition hover:brightness-[0.98]"
        >
          <span className="relative grid size-10 shrink-0 place-items-center">
            <span className="pulse-ring absolute inset-0 rounded-full bg-risk-high/40" />
            <Siren className="relative size-7 text-risk-high" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-risk-high">ALARMA ACTIVA</p>
            <p className="text-[13px] leading-snug text-risk-high/90">Cava 2 a -16,2 °C. SMS enviado a 3 responsables.</p>
          </div>
          <span className="rounded-full bg-risk-high px-3 py-1 text-xs font-bold text-white">Atender</span>
        </Link>

        <Link href="/cavas" className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-brand-100">
          <BatteryCharging className="size-6 text-risk-mid" />
          <p className="flex-1 text-[13px]">
            <strong>Turbo sin energía</strong> · Cava 3 en batería (5 h 40 min)
          </p>
          <ChevronRight className="size-4 text-muted" />
        </Link>

        {/* OCI-001: certificados de cadena de frío */}
        <Link href="/certificados" className="mt-3 flex items-center gap-3 rounded-2xl border border-info/30 bg-info-bg p-3.5">
          <BadgeCheck className="size-6 text-info" />
          <p className="flex-1 text-[13px]">
            <strong className="text-info">Certificados de frío</strong> · 1 lote por emitir
          </p>
          <span className="rounded-full bg-info px-2 py-0.5 text-[10px] font-bold text-white">NUEVO</span>
          <ChevronRight className="size-4 text-muted" />
        </Link>

        <SectionTitle
          action={
            <Link href="/cavas" className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              Ver todas
            </Link>
          }
        >
          Estado de las cavas
        </SectionTitle>
        <div className="space-y-3">
          {cavas.map((c) => {
            const s = estadoCavaStyles[c.estado];
            return (
              <Link key={c.id} href={`/cavas?c=${c.id}`} className="block">
                <Card className={`flex items-center gap-3 ${s.border}`}>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-bold">
                      {c.nombre} <span className="text-xs font-normal text-muted">· {c.sede}</span>
                    </p>
                    <p className={`text-2xl font-bold ${s.text}`}>{c.temperatura.toFixed(1)} °C</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="w-32 shrink-0">
                    <TempChart lecturas={c.lecturas} compacto />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <SectionTitle
          action={
            <Link href="/inventario" className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              Inventario
            </Link>
          }
        >
          Lotes por vencer
        </SectionTitle>
        <Card className="divide-y divide-brand-50 p-0">
          {porVencer.map((l) => {
            const sv = semaforoVida(l.dias);
            return (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3">
                <Hourglass className={`size-5 ${sv.text}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {l.especie} · {l.kg} kg
                  </p>
                  <p className="text-xs text-muted">
                    {l.id} · {l.cava}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${sv.bg} ${sv.text}`}>{l.dias} días</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
