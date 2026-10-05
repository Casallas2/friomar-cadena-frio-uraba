# Especificación arquitectónica — FríoMar

El prototipo implementa solo la capa de presentación; los servicios se describen como arquitectura objetivo.

## Estilo: arquitectura orientada a eventos con alertas proactivas

```
 Termómetros (Elitech · Testo · PT100/Modbus)
        │  lecturas cada 30 s
 ┌──────▼──────────────────────┐
 │ Gateway local (borde)        │  batería de respaldo · guarda lecturas si cae la red
 │  Adaptadores de sensores     │  ← patrón Adapter
 └──────┬──────────────────────┘
        │ evento LecturaTermica
 ┌──────▼──────┐    evento AnomaliaTermica    ┌───────────────────────────┐
 │ Monitoreo   │ ───────────────────────────► │ Servicio de alertas        │
 │ de cavas    │                              │  Alerta base               │
 └──────┬──────┘                              │   + Sirena  + SMS  + Log   │ ← patrón Decorator
        │                                     └───────────────────────────┘
 ┌──────▼──────┐   ┌────────────────────┐
 │ Inventario  │──►│ Vida útil (cálculo) │
 └─────────────┘   └────────────────────┘
        ▲
        │ HTTPS / JSON
 App móvil / web (este repositorio)
```

| Componente | Responsabilidad | Pantalla que lo consume |
|---|---|---|
| Gateway local | Leer sensores, guardar lecturas sin conexión, operar con batería | Monitoreo de cavas |
| Monitoreo de cavas | Comparar lecturas con el umbral de -18 °C y emitir eventos | Panel, Cavas |
| Servicio de alertas | Entregar alarmas en < 30 s por sirena y SMS | Alarmas |
| Inventario | Entradas, salidas y lotes | Entradas y salidas, Inventario |
| Vida útil | Calcular el tiempo de almacenamiento seguro | Inventario, Panel |

## Patrones de diseño

- **Adapter** — cada marca de termómetro (Elitech por Bluetooth, Testo por USB/Wi-Fi, PT100 por Modbus) tiene un
  adaptador que convierte su formato a la interfaz común `LecturaTermica { cava, temperatura, fecha }`. Agregar
  una marca nueva no cambia el resto del sistema.
- **Decorator** — una `Alerta` base se envuelve con `ConSirena`, `ConSMS` y `ConRegistro` según el nivel: una
  alarma crítica usa todos; una advertencia, solo SMS y registro.
- **Observer** — el servicio de alertas y el panel se suscriben a los eventos `AnomaliaTermica`.

## Resiliencia (restricción del entorno)

- Hardware con protección IP67 frente a humedad salina.
- Gateway con batería: ante un corte de energía sigue leyendo y guarda las lecturas para enviarlas al volver la red.

## Capa de presentación (este repositorio)

- `app/` — una carpeta por vista (ECS-P-01 a ECS-P-06).
- `components/` — componentes reutilizables (ECS-P-07).
- `lib/data.ts` — datos simulados que reemplazan las respuestas de los servicios (ECS-D-01, ECS-D-02).
