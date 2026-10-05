// Datos simulados del prototipo FríoMar. No hay backend: todo vive en memoria.

export const UMBRAL_CONGELACION = -18; // °C — por encima se dispara la alarma
export const MAX_TEMP_INGRESO = 4; // °C — producto fresco debe llegar a 4 °C o menos

export type EstadoCava = "normal" | "advertencia" | "alarma";
export type Energia = "red" | "bateria";

export type Cava = {
  id: string;
  nombre: string;
  sede: string;
  temperatura: number;
  estado: EstadoCava;
  ocupacion: number;
  capacidadKg: number;
  energia: Energia;
  autonomia?: string;
  sensor: { marca: string; modelo: string; protocolo: string };
  minutosFueraRango: number;
  lecturas: number[]; // últimas 24 h, una por hora
};

export const cavas: Cava[] = [
  {
    id: "c1",
    nombre: "Cava 1",
    sede: "Necoclí",
    temperatura: -21.4,
    estado: "normal",
    ocupacion: 72,
    capacidadKg: 2000,
    energia: "red",
    sensor: { marca: "Elitech", modelo: "RC-5+", protocolo: "Bluetooth" },
    minutosFueraRango: 0,
    lecturas: [-21.8, -21.6, -21.9, -21.5, -21.7, -21.4, -21.2, -21.6, -21.8, -21.5, -21.3, -21.6, -21.9, -21.7, -21.4, -21.2, -21.5, -21.8, -21.6, -21.3, -21.5, -21.7, -21.6, -21.4],
  },
  {
    id: "c2",
    nombre: "Cava 2",
    sede: "Necoclí",
    temperatura: -16.2,
    estado: "alarma",
    ocupacion: 58,
    capacidadKg: 1500,
    energia: "red",
    sensor: { marca: "Testo", modelo: "184 T3", protocolo: "USB / Wi-Fi" },
    minutosFueraRango: 14,
    lecturas: [-20.1, -20.4, -20.2, -20.0, -20.3, -20.5, -20.2, -19.9, -20.1, -20.0, -19.8, -20.2, -20.1, -19.9, -19.7, -19.5, -19.2, -19.0, -18.6, -18.3, -17.8, -17.2, -16.7, -16.2],
  },
  {
    id: "c3",
    nombre: "Cava 3",
    sede: "Turbo",
    temperatura: -18.9,
    estado: "advertencia",
    ocupacion: 81,
    capacidadKg: 2500,
    energia: "bateria",
    autonomia: "5 h 40 min",
    sensor: { marca: "Genérico", modelo: "PT100", protocolo: "Modbus RS-485" },
    minutosFueraRango: 0,
    lecturas: [-20.6, -20.8, -20.5, -20.7, -20.6, -20.9, -20.4, -20.6, -20.8, -20.5, -20.7, -20.6, -20.3, -20.5, -20.4, -20.2, -20.0, -19.8, -19.7, -19.5, -19.4, -19.2, -19.0, -18.9],
  },
];

export const estadoCavaStyles: Record<EstadoCava, { label: string; text: string; bg: string; border: string; dot: string }> = {
  normal: { label: "Normal", text: "text-risk-low", bg: "bg-risk-low-bg", border: "border-brand-100", dot: "bg-risk-low" },
  advertencia: { label: "Vigilar", text: "text-risk-mid", bg: "bg-risk-mid-bg", border: "border-risk-mid/30", dot: "bg-risk-mid" },
  alarma: { label: "Alarma", text: "text-risk-high", bg: "bg-risk-high-bg", border: "border-risk-high/40", dot: "bg-risk-high" },
};

export type Especie = { id: string; nombre: string; vidaBaseDias: number; emoji: string };

// Vida útil de referencia a ≤ -18 °C (valores ilustrativos del prototipo)
export const especies: Especie[] = [
  { id: "pargo", nombre: "Pargo rojo", vidaBaseDias: 180, emoji: "🐟" },
  { id: "robalo", nombre: "Róbalo", vidaBaseDias: 180, emoji: "🐠" },
  { id: "sierra", nombre: "Sierra", vidaBaseDias: 120, emoji: "🐟" },
  { id: "jurel", nombre: "Jurel", vidaBaseDias: 90, emoji: "🐟" },
  { id: "camaron", nombre: "Camarón", vidaBaseDias: 150, emoji: "🦐" },
  { id: "langosta", nombre: "Langosta", vidaBaseDias: 120, emoji: "🦞" },
];

export type Lote = {
  id: string;
  especie: string;
  kg: number;
  cava: string;
  ingreso: string;
  tempIngreso: number;
  diasAlmacenado: number;
  vidaBaseDias: number;
  penalizacionDias: number; // días descontados por excursiones térmicas
};

export const lotes: Lote[] = [
  { id: "LOT-0412", especie: "Pargo rojo", kg: 320, cava: "Cava 1", ingreso: "02 oct", tempIngreso: 1.8, diasAlmacenado: 3, vidaBaseDias: 180, penalizacionDias: 0 },
  { id: "LOT-0409", especie: "Camarón", kg: 410, cava: "Cava 2", ingreso: "28 sep", tempIngreso: 2.4, diasAlmacenado: 7, vidaBaseDias: 150, penalizacionDias: 12 },
  { id: "LOT-0405", especie: "Sierra", kg: 280, cava: "Cava 2", ingreso: "21 sep", tempIngreso: 3.1, diasAlmacenado: 14, vidaBaseDias: 120, penalizacionDias: 12 },
  { id: "LOT-0398", especie: "Róbalo", kg: 515, cava: "Cava 3", ingreso: "02 sep", tempIngreso: 2.0, diasAlmacenado: 33, vidaBaseDias: 180, penalizacionDias: 0 },
  { id: "LOT-0371", especie: "Jurel", kg: 260, cava: "Cava 3", ingreso: "14 jul", tempIngreso: 3.6, diasAlmacenado: 83, vidaBaseDias: 90, penalizacionDias: 0 },
];

// Cálculo automático del tiempo máximo de almacenamiento seguro (RF-03)
export function diasRestantes(l: Pick<Lote, "vidaBaseDias" | "diasAlmacenado" | "penalizacionDias">) {
  return Math.max(0, l.vidaBaseDias - l.diasAlmacenado - l.penalizacionDias);
}

export function semaforoVida(dias: number) {
  if (dias <= 10) return { label: "Vender ya", text: "text-risk-high", bg: "bg-risk-high-bg", bar: "bg-risk-high" };
  if (dias <= 30) return { label: "Pronto", text: "text-risk-mid", bg: "bg-risk-mid-bg", bar: "bg-risk-mid" };
  return { label: "Seguro", text: "text-risk-low", bg: "bg-risk-low-bg", bar: "bg-risk-low" };
}

export type NivelAlerta = "critico" | "advertencia" | "info";

export type Alerta = {
  id: string;
  titulo: string;
  detalle: string;
  nivel: NivelAlerta;
  lugar: string;
  hace: string;
  leida: boolean;
  entrega?: string;
  icono: "termometro" | "energia" | "vencimiento" | "sensor";
};

export const alertasIniciales: Alerta[] = [
  {
    id: "a1",
    titulo: "Cava 2 superó los -18 °C",
    detalle: "Temperatura actual -16,2 °C desde hace 14 min. Revisa la puerta y el compresor. Producto en riesgo: 690 kg.",
    nivel: "critico",
    lugar: "Necoclí",
    hace: "hace 14 min",
    leida: false,
    entrega: "SMS a 3 responsables en 12 s · alarma sonora activa",
    icono: "termometro",
  },
  {
    id: "a2",
    titulo: "Corte de energía en la sede Turbo",
    detalle: "La Cava 3 funciona con batería. Autonomía estimada: 5 h 40 min. Temperatura -18,9 °C y subiendo.",
    nivel: "advertencia",
    lugar: "Turbo",
    hace: "hace 38 min",
    leida: false,
    entrega: "SMS a 2 responsables en 9 s",
    icono: "energia",
  },
  {
    id: "a3",
    titulo: "Lote LOT-0371 próximo a vencer",
    detalle: "Jurel, 260 kg. Quedan 7 días de almacenamiento seguro. Prioriza su venta.",
    nivel: "advertencia",
    lugar: "Turbo",
    hace: "hoy, 06:00",
    leida: true,
    icono: "vencimiento",
  },
  {
    id: "a4",
    titulo: "Sensor de la Cava 1 reconectado",
    detalle: "El termómetro Elitech estuvo 2 min sin reportar. Se recuperaron las lecturas guardadas.",
    nivel: "info",
    lugar: "Necoclí",
    hace: "ayer, 22:15",
    leida: true,
    icono: "sensor",
  },
];
