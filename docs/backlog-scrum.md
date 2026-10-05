# Product Backlog y Sprints — FríoMar (Parcial I)

## Roles Scrum

| Rol | Responsable |
|---|---|
| Product Owner | Gerente de la cooperativa pesquera |
| Scrum Master | Jean Londoño |
| Developers | Equipo de desarrollo (frontend, backend, IoT) |

## Product Backlog

| ID | Historia de usuario | Criterios de aceptación | Prioridad | Puntos |
|---|---|---|---|---|
| HU-01 | Como **bodeguero**, quiero iniciar sesión con correo o PIN, para acceder rápido incluso con guantes. | Valida correo y clave; PIN de 4 dígitos; error claro si falla. | Alta | 3 |
| HU-02 | Como **bodeguero**, quiero registrar la entrada de producto por especie, peso y temperatura, para saber qué hay en cada cava. | Especie y peso obligatorios; temperatura leída del termómetro; rechaza > 4 °C; no permite cavas en alarma. | Alta | 8 |
| HU-03 | Como **administrador**, quiero ver la temperatura de cada cava en vivo y su historial de 24 h, para detectar fallas a tiempo. | Lectura cada 30 s; línea de -18 °C; estado de energía; marca del sensor. | Alta | 8 |
| HU-04 | Como **administrador**, quiero recibir una alarma sonora y un SMS si una cava supera -18 °C, para actuar antes de perder producto. | Entrega en < 30 s; sirena silenciable sin detener el monitoreo; registro de atención. | Alta | 13 |
| HU-05 | Como **bodeguero**, quiero registrar salidas sugiriendo el lote que vence primero, para reducir el desperdicio. | Orden FEFO; no supera el stock; destino obligatorio. | Media | 5 |
| HU-06 | Como **administrador**, quiero conocer el tiempo de almacenamiento seguro de cada lote, para vender antes de que pierda calidad. | Cálculo automático con descuento por excursiones térmicas; semáforo; lotes por vencer en el panel. | Media | 8 |
| HU-07 | Como **sistema**, quiero integrar termómetros de distintas marcas mediante adaptadores, para no depender de un fabricante. | Interfaz común `LecturaTermica`; Elitech, Testo y PT100/Modbus. | Media | 8 |

**Definición de Preparado (Ready):** historia en formato INVEST, criterios de aceptación escritos y estimada.
**Definición de Terminado (Done):** cumple los criterios, pasa lint y build, revisada por PR y desplegada en la vista previa.

## Sprints (2 semanas)

| Sprint | Objetivo | Historias | Incremento |
|---|---|---|---|
| Sprint 1 | Acceso y registro de producto | HU-01, HU-02 | Login y entradas de producto |
| Sprint 2 | Monitoreo y alarmas | HU-03, HU-04, HU-07 | Cavas en vivo y alarmas SMS/sirena |
| Sprint 3 | Inventario inteligente | HU-05, HU-06 | Salidas FEFO y cálculo de vida útil |

Ceremonias: Sprint Planning al inicio, Daily Scrum de 15 min, Sprint Review con la cooperativa y Sprint Retrospective al cierre.
