export type Pantalla = { href: string; nombre: string; etiqueta?: string };

export const pantallas: Pantalla[] = [
  { href: "/", nombre: "1. Inicio de sesión" },
  { href: "/inicio", nombre: "2. Panel principal" },
  { href: "/cavas", nombre: "3. Monitoreo de cavas" },
  { href: "/registrar", nombre: "4. Entradas y salidas" },
  { href: "/inventario", nombre: "5. Inventario y vida útil" },
  { href: "/alertas", nombre: "6. Alarmas" },
];
