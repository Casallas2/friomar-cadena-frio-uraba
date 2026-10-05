import { UMBRAL_CONGELACION } from "@/lib/data";

// Gráfico de línea (SVG) de las últimas 24 h con la línea de umbral de -18 °C.
export function TempChart({ lecturas, compacto = false }: { lecturas: number[]; compacto?: boolean }) {
  const w = 300;
  const h = compacto ? 56 : 150;
  const pad = compacto ? 4 : 18;
  const min = Math.min(-23, ...lecturas);
  const max = Math.max(-15, ...lecturas);
  const x = (i: number) => pad + (i * (w - pad * 2)) / (lecturas.length - 1);
  const y = (t: number) => pad + ((max - t) * (h - pad * 2)) / (max - min);
  const puntos = lecturas.map((t, i) => `${x(i)},${y(t)}`).join(" ");
  const ultimo = lecturas[lecturas.length - 1];
  const color = ultimo > UMBRAL_CONGELACION ? "#d32f2f" : ultimo > -19.5 ? "#ef7d00" : "#0f6292";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block w-full" role="img" aria-label="Temperatura de las últimas 24 horas">
      <rect x="0" y="0" width={w} height={y(UMBRAL_CONGELACION)} fill="#d32f2f" opacity="0.06" />
      <line x1="0" x2={w} y1={y(UMBRAL_CONGELACION)} y2={y(UMBRAL_CONGELACION)} stroke="#d32f2f" strokeDasharray="5 4" strokeWidth="1.2" />
      {!compacto && (
        <text x={w - 4} y={y(UMBRAL_CONGELACION) - 5} textAnchor="end" fontSize="10" fill="#d32f2f" fontWeight="600">
          Límite -18 °C
        </text>
      )}
      <polyline points={puntos} fill="none" stroke={color} strokeWidth={compacto ? 2 : 2.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(lecturas.length - 1)} cy={y(ultimo)} r={compacto ? 3 : 4.5} fill={color} stroke="white" strokeWidth="2" />
      {!compacto && (
        <>
          <text x={pad} y={h - 2} fontSize="10" fill="#5b6b78">-24 h</text>
          <text x={w - pad} y={h - 2} fontSize="10" fill="#5b6b78" textAnchor="end">Ahora</text>
        </>
      )}
    </svg>
  );
}
