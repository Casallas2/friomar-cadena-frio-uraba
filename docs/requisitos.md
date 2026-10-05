# Requisitos del prototipo FríoMar (línea base v1.0.0)

Requisitos tomados en cuenta para construir el frontend. Se derivan del **caso de estudio 8 del Anexo No. 1**
(requisitos funcionales, no funcionales, restricciones y reto de diseño) y de los principios de UI/UX del módulo.
En el prototipo cada requisito se **simula** en la interfaz: no hay backend ni sensores reales.

## Requisitos del Anexo No. 1 (caso 8)

| Tipo | Requisito del enunciado |
|---|---|
| RF | Control de entradas/salidas de producto marino por especie, peso y temperatura de ingreso |
| RF | Monitoreo continuo de las cavas de congelación y alarmas audibles/SMS si la temperatura supera los -18 °C |
| RF | Cálculo automático del tiempo máximo de almacenamiento seguro antes de pérdida organoléptica |
| RNF | Disponibilidad de alertas: entrega de alertas críticas en menos de 30 s tras detectar una anomalía térmica |
| RNF | Usabilidad: interfaces simplificadas para ambientes húmedos (botones táctiles de gran tamaño) |
| R | Entorno: humedad salina (ambiente marino) e interrupciones del fluido eléctrico |
| Reto | Arquitectura de alertas proactivas; patrones estructurales (Adapter o Decorator) para integrar distintas marcas de termómetros |

## Requisitos funcionales (RF) del prototipo

| ID | Requisito | HU | Pantalla | Cómo se refleja en el prototipo |
|---|---|---|---|---|
| RF-01 | El sistema debe permitir iniciar sesión con correo y contraseña o con PIN rápido. | HU-01 | `/` | Formulario validado y botón de PIN (simulado). |
| RF-02 | El sistema debe registrar entradas de producto indicando especie, peso y temperatura de ingreso. | HU-02 | `/registrar` | Botones grandes por especie, peso con +/- 10 kg y lectura de termómetro. |
| RF-03 | El sistema debe rechazar el ingreso de producto con temperatura mayor a 4 °C. | HU-02 | `/registrar` | Mensaje rojo y botón "Guardar" bloqueado. |
| RF-04 | El sistema debe impedir asignar producto a una cava en alarma. | HU-02 | `/registrar` | La cava en alarma aparece deshabilitada en el selector. |
| RF-05 | El sistema debe registrar salidas por lote, cantidad y cliente, sugiriendo primero el lote que vence antes (FEFO). | HU-05 | `/registrar` | Lotes ordenados por días restantes y validación de cantidad disponible. |
| RF-06 | El sistema debe mostrar la temperatura actual de cada cava y su historial de 24 h con la línea de -18 °C. | HU-03 | `/cavas`, `/inicio` | Tarjetas por cava y gráfico de línea con zona de riesgo. |
| RF-07 | El sistema debe mostrar el estado de energía de cada sede (red o batería) y la autonomía restante. | HU-03 | `/cavas`, `/inicio` | Indicador de energía y aviso de corte en Turbo. |
| RF-08 | El sistema debe mostrar la marca, el modelo y el protocolo del termómetro de cada cava. | HU-03 | `/cavas` | Tarjeta "Sensor" (patrón Adapter). |
| RF-09 | El sistema debe generar una alarma audible y SMS cuando una cava supere -18 °C. | HU-04 | `/alertas`, `/cavas` | Alarma crítica con detalle de entrega por SMS y sirena. |
| RF-10 | El sistema debe permitir silenciar la sirena sin detener el monitoreo y probar la alarma. | HU-04 | `/cavas` | Botones "Silenciar sirena" y "Probar alarma". |
| RF-11 | El sistema debe clasificar las alarmas en crítica, advertencia e información y permitir marcarlas como atendidas. | HU-04 | `/alertas` | Filtros Todas/Activas/Atendidas y botón de atención. |
| RF-12 | El sistema debe calcular el tiempo máximo de almacenamiento seguro de cada lote. | HU-06 | `/inventario` | Días restantes = vida útil de referencia − días almacenado − descuento por excursiones térmicas. |
| RF-13 | El sistema debe señalar con semáforo los lotes que deben venderse pronto. | HU-06 | `/inventario`, `/inicio` | Seguro / Pronto / Vender ya. |
| RF-14 | El sistema debe mostrar un panel con cavas, cavas en alarma, stock total y lotes por vencer. | HU-03, HU-06 | `/inicio` | Indicadores y listas resumidas. |
| RF-15 | El sistema debe ofrecer navegación permanente entre las secciones. | Todas | Todas | Barra inferior: Inicio, Cavas, Registrar (central), Inventario, Alarmas. |

## Requisitos no funcionales (RNF)

| ID | Categoría | Requisito | Cómo se aplicó |
|---|---|---|---|
| RNF-01 | Disponibilidad de alertas | Alarmas críticas entregadas en menos de 30 s. | Cada alarma muestra el tiempo de entrega (p. ej. "SMS en 12 s"). |
| RNF-02 | Usabilidad en ambiente húmedo | Botones táctiles grandes, usables con guantes o manos mojadas. | Botones de 56–80 px, botón central de 64 px, peso con +/- en vez de teclado. |
| RNF-03 | Claridad | Color consistente: rojo = alarma, naranja = vigilar, verde = normal. | Mismos colores en panel, cavas, inventario y alarmas, siempre con texto. |
| RNF-04 | Legibilidad | Temperatura visible a distancia en la bodega. | Cifra principal de 48 px en el monitoreo. |
| RNF-05 | Prevención de errores | No registrar producto caliente, cantidades mayores al stock ni destinos vacíos. | Validaciones con mensajes y botones bloqueados. |
| RNF-06 | Retroalimentación | Toda acción responde visiblemente. | Estados "Leyendo termómetro…", "Guardando…", confirmaciones. |
| RNF-07 | Carga de memoria | El usuario no calcula ni recuerda: el sistema propone. | Lectura automática del termómetro, lotes ordenados por vencimiento, cálculo de vida útil. |
| RNF-08 | Resiliencia ante cortes de energía | La interfaz informa el modo batería y la autonomía. | Indicador de energía por sede. |
| RNF-09 | Interoperabilidad | Integrar termómetros de distintas marcas y protocolos. | Patrón Adapter documentado; la app muestra un formato único. |
| RNF-10 | Accesibilidad | Etiquetas, `aria-label`, contraste y color nunca como única señal. | Etiquetas en campos, `aria-pressed`, textos junto a colores. |
| RNF-11 | Adaptabilidad (*responsive*) | Celular, tableta de bodega y escritorio. | Pantalla completa en móvil; marco de teléfono en escritorio. |
| RNF-12 | Rendimiento | Carga rápida con conexión limitada. | Páginas estáticas, gráficos en SVG, sin imágenes pesadas. |
| RNF-13 | Mantenibilidad | Código modular por vistas, componentes y datos. | `app/`, `components/`, `lib/`; cada vista es un ECS. |
| RNF-14 | Trazabilidad / GCS | Todo cambio versionado y justificado. | Git con ramas protegidas, SemVer, plantillas y CHANGELOG. |

## Restricciones

- Prototipo de **solo frontend**: sin backend, sensores, SMS ni autenticación reales.
- Hardware real (no incluido): termómetros con carcasa IP67 resistente a humedad salina y gateway con batería de respaldo.
- Los nombres de personas y de la cooperativa son ficticios; la vida útil por especie es ilustrativa.

## Requisitos añadidos por la OCI-001 (v1.1.0)

| ID | Tipo | Requisito | Pantalla |
|---|---|---|---|
| RF-16 | Funcional | El sistema debe generar por lote un registro HACCP con temperatura mínima, máxima, minutos fuera de rango y acciones correctivas. | `/certificados` |
| RF-17 | Funcional | El sistema debe determinar si un lote es certificable: ≤ 30 min acumulados por encima de -18 °C y nunca por encima de -15 °C. | `/certificados` |
| RF-18 | Funcional | El sistema debe emitir el Certificado de Cadena de Frío (CCF) con código único y QR de verificación. | `/certificados` |
| RF-19 | Funcional | El sistema debe bloquear las salidas a mercado nacional de lotes sin certificado emitido. | `/registrar` |
| RF-20 | Funcional | El sistema debe mostrar el estado del certificado en el inventario y alertar los lotes no certificables. | `/inventario`, `/alertas` |
| RNF-15 | No funcional (integridad) | Los registros de temperatura que soportan un certificado no deben poder alterarse. | — |
| RNF-16 | No funcional (verificabilidad) | Un comprador debe poder verificar el certificado escaneando su QR. | `/certificados` |
