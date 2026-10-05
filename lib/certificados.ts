// OCI-001 · Registro HACCP y Certificados de Cadena de Frío por lote (ECS-D-06).
// En producción vendrían del microservicio "Certificación".

export const TOLERANCIA_MINUTOS = 30; // máx. minutos acumulados por encima de -18 °C
export const LIMITE_CRITICO = -15; // °C — nunca debe superarse

export type EstadoCertificado = "emitido" | "por-emitir" | "no-certificable";

export type RegistroHaccp = {
  lote: string;
  especie: string;
  kg: number;
  cava: string;
  tempMin: number;
  tempMax: number;
  minutosFuera: number;
  accionCorrectiva?: string;
  estado: EstadoCertificado;
  certificado?: string;
  emitido?: string;
};

export const registros: RegistroHaccp[] = [
  {
    lote: "LOT-0409",
    especie: "Camarón",
    kg: 410,
    cava: "Cava 2",
    tempMin: -20.5,
    tempMax: -16.2,
    minutosFuera: 14,
    accionCorrectiva: "Puerta de la cava cerrada y compresor revisado por el técnico (05 oct, 08:20).",
    estado: "por-emitir",
  },
  {
    lote: "LOT-0405",
    especie: "Sierra",
    kg: 280,
    cava: "Cava 2",
    tempMin: -20.4,
    tempMax: -12.4,
    minutosFuera: 95,
    accionCorrectiva: "Falla del compresor el 26 sep; producto trasladado a la Cava 1.",
    estado: "no-certificable",
  },
  {
    lote: "LOT-0412",
    especie: "Pargo rojo",
    kg: 320,
    cava: "Cava 1",
    tempMin: -21.9,
    tempMax: -21.2,
    minutosFuera: 0,
    estado: "emitido",
    certificado: "CCF-2026-0031",
    emitido: "03 oct",
  },
  {
    lote: "LOT-0398",
    especie: "Róbalo",
    kg: 515,
    cava: "Cava 3",
    tempMin: -20.9,
    tempMax: -18.9,
    minutosFuera: 0,
    estado: "emitido",
    certificado: "CCF-2026-0027",
    emitido: "29 sep",
  },
  {
    lote: "LOT-0371",
    especie: "Jurel",
    kg: 260,
    cava: "Cava 3",
    tempMin: -21.0,
    tempMax: -19.1,
    minutosFuera: 0,
    estado: "emitido",
    certificado: "CCF-2026-0019",
    emitido: "20 sep",
  },
];

export const estadoCertificado: Record<EstadoCertificado, { label: string; clase: string }> = {
  emitido: { label: "Certificado", clase: "bg-risk-low-bg text-risk-low" },
  "por-emitir": { label: "Por emitir", clase: "bg-info-bg text-info" },
  "no-certificable": { label: "No certificable", clase: "bg-risk-high-bg text-risk-high" },
};

// Regla de la OCI-001
export function esCertificable(r: Pick<RegistroHaccp, "minutosFuera" | "tempMax">) {
  return r.minutosFuera <= TOLERANCIA_MINUTOS && r.tempMax <= LIMITE_CRITICO;
}

export function registroDe(lote: string) {
  return registros.find((r) => r.lote === lote);
}
