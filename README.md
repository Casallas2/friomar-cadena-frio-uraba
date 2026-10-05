# FríoMar — Inventario y cadena de frío para comerciantes de pescado (Urabá)

Prototipo navegable (solo frontend) del sistema **FríoMar**, caso de estudio 8 de la asignatura
**Ingeniería de Software II** — Corporación Universitaria Remington, sede Apartadó.

| | |
|---|---|
| **Estudiante / Líder de Configuración** | Jean Londoño |
| **Docente** | Marta Lucía Jiménez Torres |
| **Contexto** | Cooperativas pesqueras de Necoclí y Turbo |
| **Versión de línea base** | `v1.0.0` (Parcial I — UI/UX y Scrum) |
| **Despliegue** | Vercel (producción = rama `main`, vista previa = cada rama/PR) |

> **Importante:** es una demostración de interfaz. No hay backend, base de datos, sensores ni envío real de SMS;
> todos los datos están simulados en `lib/data.ts`.

## Problema

Las cooperativas pierden producto pesquero porque las fallas de las cavas de congelación (puerta abierta,
compresor dañado, cortes de energía) no se detectan a tiempo. FríoMar controla las entradas y salidas de producto,
vigila la temperatura de las cavas en todo momento, dispara alarmas audibles y SMS cuando se supera **-18 °C** y
calcula cuánto tiempo puede seguir almacenado cada lote sin perder calidad.

## Pantallas del prototipo

| # | Ruta | Pantalla | Historia de usuario |
|---|---|---|---|
| 1 | `/` | Inicio de sesión | HU-01 Iniciar sesión |
| 2 | `/inicio` | Panel principal | HU-03 Monitorear cavas · HU-06 Ver lotes por vencer |
| 3 | `/cavas` | Monitoreo de cavas | HU-03 Monitorear cavas · HU-04 Recibir alarmas |
| 4 | `/registrar` | Entradas y salidas | HU-02 Registrar entrada · HU-05 Registrar salida |
| 5 | `/inventario` | Inventario y vida útil | HU-06 Calcular tiempo de almacenamiento seguro |
| 6 | `/alertas` | Alarmas | HU-04 Recibir alarmas |

Product Backlog y Sprints: [`docs/backlog-scrum.md`](docs/backlog-scrum.md).

## Catálogo de Elementos de Configuración de Software (ECS)

Cada ECS tiene un identificador único, un responsable y queda bajo control de versiones en este repositorio.
Un cambio a cualquier ECS exige una **Solicitud de Cambio** (Issue) y un **Pull Request** aprobado.

### 1. Programas (fuentes y ejecutables)

| ID | Elemento | Ubicación | Descripción |
|---|---|---|---|
| ECS-P-01 | Vista Inicio de sesión | `app/page.tsx` | Acceso con correo o PIN (simulado) |
| ECS-P-02 | Vista Panel principal | `app/(app)/inicio/page.tsx` | Indicadores, alarma activa, estado de cavas, lotes por vencer |
| ECS-P-03 | Vista Monitoreo de cavas | `app/(app)/cavas/page.tsx` | Temperatura en vivo, gráfico 24 h, energía y sensor |
| ECS-P-04 | Vista Entradas y salidas | `app/(app)/registrar/page.tsx` | Especie, peso y temperatura de ingreso |
| ECS-P-05 | Vista Inventario | `app/(app)/inventario/page.tsx` | Lotes y cálculo de vida útil segura |
| ECS-P-06 | Vista Alarmas | `app/(app)/alertas/page.tsx` | Alarmas críticas, advertencias y atención |
| ECS-P-07 | Componentes compartidos | `components/` | Marco, navegación, encabezados, gráfico de temperatura |
| ECS-P-08 | Configuración de build | `package.json`, `next.config.ts`, `tsconfig.json` | Dependencias y compilación |
| ECS-P-09 | Ejecutable desplegado | Vercel (build de `main`) | Artefacto generado por `next build` |

### 2. Datos

| ID | Elemento | Ubicación / origen | Descripción |
|---|---|---|---|
| ECS-D-01 | Datos simulados del dominio | `lib/data.ts` | Cavas, lecturas, lotes y alarmas |
| ECS-D-02 | Catálogo de especies y vida útil | `lib/data.ts` (`especies`) | Vida útil de referencia a ≤ -18 °C |
| ECS-D-03 | Lecturas de termómetros IoT (externas) | Sensores Elitech, Testo y PT100/Modbus | Temperatura cada 30 s |
| ECS-D-04 | Pasarela SMS (externa, futura) | Proveedor de mensajería | Entrega de alarmas críticas |
| ECS-D-05 | Base de datos de inventario (futura) | PostgreSQL + base de series de tiempo | Movimientos y lecturas históricas |

### 3. Documentación

| ID | Elemento | Ubicación |
|---|---|---|
| ECS-DOC-01 | Catálogo de ECS y guía del repositorio | `README.md` |
| ECS-DOC-02 | Especificación arquitectónica | `docs/arquitectura.md` |
| ECS-DOC-03 | Manual de usuario | `docs/manual-usuario.md` |
| ECS-DOC-04 | Manual técnico | `docs/manual-tecnico.md` |
| ECS-DOC-05 | Plan de Gestión de Configuración | `docs/gcs/plan-gcs.md` |
| ECS-DOC-06 | Registro de cambios | `CHANGELOG.md` |
| ECS-DOC-07 | Plantillas de control de cambios | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` |
| ECS-DOC-08 | Infraestructura como código | `infra/main.tf` |
| ECS-DOC-09 | Requisitos funcionales y no funcionales | `docs/requisitos.md` |
| ECS-DOC-10 | Product Backlog y Sprints (Scrum) | `docs/backlog-scrum.md` |

## Estrategia de ramas (GitFlow simplificado)

```
main      ●──────────────────────────────●  v1.0.0 → v1.1.0 (producción)
           \                            /
develop     ●──────────────●──────────●     integración
                \          /
feature/OCI-…    ●──●──●──●                 cambio aprobado por el ACC
```

- `main`: solo versiones liberadas y etiquetadas. Protegida: requiere PR, revisión y CI en verde.
- `develop`: integración de cambios aprobados. Protegida: requiere PR y CI en verde.
- `feature/OCI-<n>-<nombre>`: una rama por Orden de Cambio de Ingeniería.
- `hotfix/<n>-<nombre>`: correcciones urgentes desde `main`.

Versionamiento: **SemVer** `MAYOR.MENOR.PARCHE`. Detalle completo en [`docs/gcs/plan-gcs.md`](docs/gcs/plan-gcs.md).

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000>. En escritorio el prototipo se muestra dentro de un marco de teléfono; en el
celular ocupa toda la pantalla.

## Tecnologías

Next.js (App Router) · React · TypeScript · Tailwind CSS · lucide-react · Vercel · GitHub Actions · Terraform
