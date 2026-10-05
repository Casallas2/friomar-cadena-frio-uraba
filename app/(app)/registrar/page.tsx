"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Thermometer, Loader2, CheckCircle2, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, BadgeCheck } from "lucide-react";
import { ScreenHeader, Card } from "@/components/ui";
import { cavas, especies, lotes, MAX_TEMP_INGRESO, diasRestantes } from "@/lib/data";
import { registroDe } from "@/lib/certificados";

type Tipo = "entrada" | "salida";

export default function RegistrarPage() {
  const [tipo, setTipo] = useState<Tipo>("entrada");
  const [hecho, setHecho] = useState<string | null>(null);

  if (hecho) {
    return (
      <div className="flex min-h-full flex-col">
        <ScreenHeader title="Movimiento registrado" back="/inicio" />
        <div className="rise flex flex-1 flex-col items-center px-6 pt-10 text-center">
          <span className="grid size-24 place-items-center rounded-full bg-risk-low-bg">
            <CheckCircle2 className="size-14 text-risk-low" />
          </span>
          <h2 className="mt-5 text-2xl font-bold">¡Listo!</h2>
          <p className="mt-2 text-sm text-muted">{hecho}</p>
          <div className="mt-8 grid w-full gap-3">
            <Link href="/inventario" className="flex h-14 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              Ver inventario
            </Link>
            <button onClick={() => setHecho(null)} className="h-14 rounded-2xl border border-brand-200 text-lg font-semibold text-brand-700">
              Registrar otro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Entradas y salidas" subtitle="Control de producto por especie y peso" back="/inicio" />
      <div className="px-4 pb-8 pt-4">
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-brand-100/70 p-1">
          <button
            onClick={() => setTipo("entrada")}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold transition ${
              tipo === "entrada" ? "bg-white text-brand-700 shadow-sm" : "text-muted"
            }`}
          >
            <ArrowDownToLine className="size-5" /> Entrada
          </button>
          <button
            onClick={() => setTipo("salida")}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold transition ${
              tipo === "salida" ? "bg-white text-brand-700 shadow-sm" : "text-muted"
            }`}
          >
            <ArrowUpFromLine className="size-5" /> Salida
          </button>
        </div>
        {tipo === "entrada" ? <Entrada onListo={setHecho} /> : <Salida onListo={setHecho} />}
      </div>
    </div>
  );
}

function Entrada({ onListo }: { onListo: (m: string) => void }) {
  const [especie, setEspecie] = useState<string | null>(null);
  const [kg, setKg] = useState(50);
  const [temp, setTemp] = useState<number | null>(null);
  const [leyendo, setLeyendo] = useState(false);
  const [cava, setCava] = useState("c1");
  const [enviando, setEnviando] = useState(false);

  // Lectura simulada del termómetro de punzón (vía adaptador)
  function leerTermometro() {
    setLeyendo(true);
    setTimeout(() => {
      setTemp(temp === null ? 2.1 : temp === 2.1 ? 6.4 : 2.1);
      setLeyendo(false);
    }, 900);
  }

  const tempAlta = temp !== null && temp > MAX_TEMP_INGRESO;
  const completo = especie !== null && kg > 0 && temp !== null && !tempAlta;

  function guardar() {
    setEnviando(true);
    setTimeout(() => {
      const e = especies.find((x) => x.id === especie)!;
      const c = cavas.find((x) => x.id === cava)!;
      onListo(`Lote LOT-0415 · ${e.nombre} · ${kg} kg a ${temp?.toFixed(1)} °C → ${c.nombre}. Vida útil segura: ${e.vidaBaseDias} días.`);
    }, 800);
  }

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <h2 className="font-bold">1. Especie</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {especies.map((e) => (
            <button
              key={e.id}
              onClick={() => setEspecie(e.id)}
              aria-pressed={especie === e.id}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition ${
                especie === e.id ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600" : "border-brand-100"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {e.emoji}
              </span>
              {e.nombre}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold">2. Peso</h2>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => setKg((k) => Math.max(0, k - 10))} aria-label="Restar 10 kg" className="grid size-16 place-items-center rounded-2xl bg-brand-100 text-brand-700 active:scale-95">
            <Minus className="size-7" />
          </button>
          <div className="flex-1 text-center">
            <input
              type="number"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(Number(e.target.value))}
              aria-label="Peso en kilogramos"
              className="w-full bg-transparent text-center text-4xl font-bold outline-none"
            />
            <p className="text-xs text-muted">kilogramos</p>
          </div>
          <button onClick={() => setKg((k) => k + 10)} aria-label="Sumar 10 kg" className="grid size-16 place-items-center rounded-2xl bg-brand-600 text-white active:scale-95">
            <Plus className="size-7" />
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-bold">3. Temperatura de ingreso</h2>
        <button
          onClick={leerTermometro}
          className={`mt-3 flex h-20 w-full items-center justify-center gap-3 rounded-2xl border-2 text-lg font-bold transition ${
            tempAlta ? "border-risk-high bg-risk-high-bg text-risk-high" : temp !== null ? "border-risk-low bg-risk-low-bg text-risk-low" : "border-dashed border-brand-300 bg-brand-50 text-brand-700"
          }`}
        >
          {leyendo ? <Loader2 className="size-7 animate-spin" /> : <Thermometer className="size-7" />}
          {leyendo ? "Leyendo termómetro…" : temp === null ? "Leer termómetro" : `${temp.toFixed(1)} °C`}
        </button>
        {temp !== null && !tempAlta && <p className="mt-2 text-xs text-risk-low">Temperatura correcta (máximo {MAX_TEMP_INGRESO} °C). Toca de nuevo para repetir la lectura.</p>}
        {tempAlta && (
          <p className="mt-2 flex gap-1.5 text-xs text-risk-high">
            <AlertTriangle className="size-4 shrink-0" /> Supera {MAX_TEMP_INGRESO} °C: el producto no puede ingresar. Enfríalo con hielo y vuelve a medir.
          </p>
        )}
        <label className="mt-4 block text-xs font-semibold text-muted" htmlFor="cava">
          Cava de destino
        </label>
        <select id="cava" value={cava} onChange={(e) => setCava(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-brand-200 bg-white px-3 text-base outline-none focus:ring-4 focus:ring-brand-200">
          {cavas.map((c) => (
            <option key={c.id} value={c.id} disabled={c.estado === "alarma"}>
              {c.nombre} · {c.sede} ({c.temperatura.toFixed(1)} °C){c.estado === "alarma" ? " — en alarma" : ""}
            </option>
          ))}
        </select>
      </Card>

      {!completo && <p className="text-center text-xs text-muted">Elige la especie, el peso y toma la temperatura para guardar.</p>}
      <button
        onClick={guardar}
        disabled={!completo || enviando}
        className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-600/30 transition enabled:active:scale-[0.98] disabled:bg-brand-200 disabled:shadow-none"
      >
        {enviando && <Loader2 className="size-5 animate-spin" />}
        {enviando ? "Guardando…" : "Guardar entrada"}
      </button>
    </div>
  );
}

function Salida({ onListo }: { onListo: (m: string) => void }) {
  const disponibles = [...lotes].sort((a, b) => diasRestantes(a) - diasRestantes(b));
  const [loteId, setLoteId] = useState(disponibles[0].id);
  const [kg, setKg] = useState(100);
  const [destino, setDestino] = useState("");
  const [venta, setVenta] = useState<"nacional" | "local">("nacional");
  const [enviando, setEnviando] = useState(false);
  const lote = lotes.find((l) => l.id === loteId)!;
  const excede = kg > lote.kg;
  // OCI-001: la venta a mercado nacional exige certificado de cadena de frío emitido
  const registro = registroDe(lote.id);
  const sinCertificado = venta === "nacional" && registro?.estado !== "emitido";
  const completo = kg > 0 && !excede && destino.trim() !== "" && !sinCertificado;

  function guardar() {
    setEnviando(true);
    const cert = venta === "nacional" ? ` Se adjunta el certificado ${registro?.certificado}.` : "";
    setTimeout(() => onListo(`Salida de ${kg} kg de ${lote.especie} (${lote.id}) hacia ${destino}. Quedan ${lote.kg - kg} kg.${cert}`), 800);
  }

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <h2 className="font-bold">1. Lote</h2>
        <p className="text-xs text-muted">Ordenados por vencimiento: primero el que vence antes.</p>
        <div className="mt-3 space-y-2">
          {disponibles.map((l) => (
            <button
              key={l.id}
              onClick={() => setLoteId(l.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                loteId === l.id ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600" : "border-brand-100"
              }`}
            >
              <span>
                <span className="block font-semibold">
                  {l.especie} · {l.kg} kg
                </span>
                <span className="text-xs text-muted">
                  {l.id} · {l.cava}
                </span>
              </span>
              <span className="text-xs font-bold text-muted">{diasRestantes(l)} días</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold">2. Cantidad y destino</h2>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => setKg((k) => Math.max(0, k - 10))} aria-label="Restar 10 kg" className="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
            <Minus className="size-6" />
          </button>
          <p className="flex-1 text-center text-3xl font-bold">{kg} kg</p>
          <button onClick={() => setKg((k) => k + 10)} aria-label="Sumar 10 kg" className="grid size-14 place-items-center rounded-2xl bg-brand-600 text-white">
            <Plus className="size-6" />
          </button>
        </div>
        {excede && <p className="mt-2 text-xs text-risk-high">El lote solo tiene {lote.kg} kg disponibles.</p>}
        <label className="mt-4 block text-xs font-semibold text-muted" htmlFor="destino">
          Cliente o destino
        </label>
        <input
          id="destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          placeholder="Ej.: Comercializadora Medellín"
          className="mt-1 h-12 w-full rounded-xl border border-brand-200 px-3 text-base outline-none focus:ring-4 focus:ring-brand-200"
        />
      </Card>

      {/* OCI-001: certificado de cadena de frío */}
      <Card className="border-info/30">
        <h2 className="flex items-center gap-2 font-bold">
          <BadgeCheck className="size-5 text-info" /> 3. Tipo de venta
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["nacional", "local"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVenta(v)}
              aria-pressed={venta === v}
              className={`h-12 rounded-xl border text-sm font-bold transition ${venta === v ? "border-info bg-info-bg text-info ring-2 ring-info" : "border-brand-100"}`}
            >
              {v === "nacional" ? "Mercado nacional" : "Venta local"}
            </button>
          ))}
        </div>
        {venta === "nacional" && registro?.estado === "emitido" && (
          <p className="mt-3 rounded-xl bg-risk-low-bg p-3 text-xs text-risk-low">
            Certificado <strong>{registro.certificado}</strong> vigente: se adjuntará al despacho.
          </p>
        )}
        {sinCertificado && (
          <div className="mt-3 rounded-xl bg-risk-high-bg p-3 text-xs text-risk-high">
            <p>
              {registro?.estado === "no-certificable"
                ? "Este lote no es certificable: solo puede salir como venta local."
                : "Este lote aún no tiene certificado de cadena de frío. Emítelo para venderlo en mercado nacional."}
            </p>
            {registro?.estado === "por-emitir" && (
              <Link href="/certificados" className="mt-2 inline-block font-bold underline">
                Ir a certificados →
              </Link>
            )}
          </div>
        )}
      </Card>

      <button
        onClick={guardar}
        disabled={!completo || enviando}
        className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-600/30 transition enabled:active:scale-[0.98] disabled:bg-brand-200 disabled:shadow-none"
      >
        {enviando && <Loader2 className="size-5 animate-spin" />}
        {enviando ? "Guardando…" : "Registrar salida"}
      </button>
    </div>
  );
}
