"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Snowflake, Eye, EyeOff, Loader2, KeyRound, MessageSquare } from "lucide-react";
import { StatusBar } from "@/components/ui";
import { APP_VERSION } from "@/lib/version";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("bodega@coopescagolfo.co");
  const [clave, setClave] = useState("demo1234");
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Simulación: valida que los campos no estén vacíos y entra al panel.
  function ingresar(e: React.FormEvent) {
    e.preventDefault();
    if (!correo.includes("@") || clave.length < 4) {
      setError("Revisa el correo y la contraseña (mínimo 4 caracteres).");
      return;
    }
    setError("");
    setCargando(true);
    setTimeout(() => router.push("/inicio"), 700);
  }

  return (
    <div className="scroll-area flex h-full flex-col overflow-y-auto bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500">
      <StatusBar />
      <div className="flex flex-col items-center px-6 pb-8 pt-10 text-white">
        <span className="grid size-20 place-items-center rounded-3xl border border-white/30 bg-white/15 shadow-lg backdrop-blur">
          <Snowflake className="size-10" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">FríoMar</h1>
        <p className="mt-1 text-sm text-white/85">Cadena de frío para cooperativas pesqueras</p>
      </div>

      <form
        onSubmit={ingresar}
        noValidate
        className="rise mx-4 mb-6 rounded-[1.75rem] bg-white px-6 pb-6 pt-7 shadow-xl"
      >
        <h2 className="text-2xl font-bold">Bienvenido</h2>
        <p className="mt-1 text-sm text-muted">Ingresa tus credenciales para continuar</p>

        <label className="mt-6 block text-[11px] font-bold uppercase tracking-wider text-ink" htmlFor="correo">
          Correo electrónico
        </label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 text-[15px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-200"
        />

        <label className="mt-5 block text-[11px] font-bold uppercase tracking-wider text-ink" htmlFor="clave">
          Contraseña
        </label>
        <div className="relative mt-2">
          <input
            id="clave"
            type={verClave ? "text" : "password"}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="h-14 w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 pr-12 text-[15px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-200"
          />
          <button
            type="button"
            onClick={() => setVerClave((v) => !v)}
            aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-muted hover:bg-brand-100"
          >
            {verClave ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        <div className="mt-2 text-right">
          <button type="button" className="text-xs font-semibold text-brand-700 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-risk-high-bg px-3 py-2 text-sm text-risk-high">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition active:scale-[0.98] disabled:opacity-80"
        >
          {cargando && <Loader2 className="size-5 animate-spin" />}
          {cargando ? "Ingresando…" : "Iniciar sesión"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-brand-100" />o continúa con<span className="h-px flex-1 bg-brand-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/inicio")}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-200 text-sm font-semibold hover:bg-brand-50"
          >
            <KeyRound className="size-4 text-brand-600" /> PIN rápido
          </button>
          <button
            type="button"
            onClick={() => router.push("/inicio")}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-200 text-sm font-semibold hover:bg-brand-50"
          >
            <MessageSquare className="size-4 text-brand-600" /> SMS
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          ¿No tienes cuenta? <span className="font-bold text-brand-700">Regístrate</span>
        </p>
      </form>

      <p className="mt-auto pb-6 text-center text-[11px] text-white/70">FríoMar v{APP_VERSION} · Necoclí y Turbo, Urabá</p>
    </div>
  );
}
