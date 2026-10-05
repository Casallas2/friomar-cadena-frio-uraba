# Plan de Gestión de Configuración de Software (GCS) — FríoMar

| | |
|---|---|
| **Proyecto** | FríoMar — Inventario y cadena de frío para comerciantes de pescado, Urabá (Necoclí y Turbo) |
| **Líder de Configuración** | Jean Londoño |
| **Línea base** | `v1.0.0` — prototipo UI/UX del Parcial I |
| **Repositorio** | GitHub (público) · despliegue en Vercel |

## 1. Roles

| Rol | Responsable | Función en la GCS |
|---|---|---|
| Líder de Configuración (GCS) | Jean Londoño | Mantiene líneas base, ramas, etiquetas y auditorías |
| Autoridad / Comité de Control de Cambios (ACC) | Product Owner (gerente de la cooperativa) + Líder de Configuración + Líder técnico | Aprueba o rechaza cada Solicitud de Cambio |
| Equipo de desarrollo | Developers del equipo Scrum | Implementan el cambio en su rama `feature/OCI-…` |
| Solicitante | Cooperativas pesqueras, compradores, entidades sanitarias (INVIMA, AUNAP) | Origina la Solicitud de Cambio |

## 2. Identificación de ECS

El catálogo completo (Programas, Datos y Documentación) está en el [`README.md`](../../README.md#catálogo-de-elementos-de-configuración-de-software-ecs).
Nomenclatura: `ECS-P-nn` (programas), `ECS-D-nn` (datos), `ECS-DOC-nn` (documentación).

## 3. Proceso de control de cambios

```
Solicitud de Cambio (Issue)  →  Análisis de impacto  →  Decisión del ACC  →  OCI aprobada
        →  rama feature/OCI-n  →  Pull Request a develop (CI + revisión)  →  auditoría
        →  merge a main  →  etiqueta vX.Y.Z  →  despliegue en Vercel  →  informe de estado
```

1. **Petición de cambio:** se abre un Issue con la plantilla *Solicitud de cambio*.
2. **Análisis de impacto:** esfuerzo, ECS afectados, efecto en la arquitectura, riesgo y costo.
3. **ACC:** aprueba, rechaza o aplaza. La decisión queda escrita en el Issue (etiqueta `aprobado-acc`).
4. **OCI:** documento en `docs/gcs/OCI-nnn.md` con alcance, restricciones y criterios de aceptación.
5. **Implementación** en `feature/OCI-nnn-<nombre>` con commits convencionales que referencian el Issue.
6. **Pull Request** con la plantilla de cambio; requiere CI en verde y revisión del CODEOWNER.
7. **Auditoría de configuración** antes de liberar (lista de chequeo, sección 6).
8. **Liberación:** merge a `main`, etiqueta SemVer y entrada en `CHANGELOG.md`.

## 4. Versionamiento

**SemVer — `MAYOR.MENOR.PARCHE`**

| Incremento | Cuándo | Ejemplo |
|---|---|---|
| MAYOR | Cambio incompatible (nueva arquitectura, API rota) | 1.4.2 → 2.0.0 |
| MENOR | Nueva funcionalidad compatible (una OCI) | 1.0.0 → 1.1.0 |
| PARCHE | Corrección sin funcionalidad nueva (hotfix) | 1.1.0 → 1.1.1 |

- La versión vive en tres lugares que deben coincidir: `package.json`, `lib/version.ts` y la etiqueta Git.
- Commits con **Conventional Commits**: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`,
  con alcance y referencia a la OCI, p. ej. `feat(certificados): certificado de cadena de frío [OCI-001]`.

## 5. Estrategia de ramas — GitFlow simplificado

| Rama | Origen | Destino | Protección |
|---|---|---|---|
| `main` | — | — | PR obligatorio, 1 aprobación de CODEOWNER, CI en verde, sin *force push* ni borrado |
| `develop` | `main` | `main` | PR obligatorio, CI en verde, sin *force push* |
| `feature/OCI-nnn-nombre` | `develop` | `develop` | Se borra tras el merge |
| `hotfix/nnn-nombre` | `main` | `main` y `develop` | Sube PARCHE |

Control de colaboradores: solo el Líder de Configuración tiene permiso de administrador; los
desarrolladores trabajan con *pull requests* y el archivo `CODEOWNERS` asigna la revisión obligatoria.
Control de copias: cada versión liberada queda como etiqueta inmutable y como despliegue en Vercel que
se puede restaurar (*rollback*) en un clic.

## 6. Auditoría de configuración — lista de chequeo (plantilla)

| # | Pregunta de verificación | Evidencia |
|---|---|---|
| 1 | ¿El cambio tiene Solicitud de Cambio y OCI aprobada por el ACC? | Issue + `docs/gcs/OCI-nnn.md` |
| 2 | ¿Todos los commits referencian la OCI y siguen la convención? | Historial de la rama |
| 3 | ¿Solo se modificaron los ECS declarados en el análisis de impacto? | Pestaña *Files changed* del PR |
| 4 | ¿El CI (lint + build) está en verde? | Checks del PR |
| 5 | ¿El despliegue de vista previa funciona y cumple los criterios de aceptación? | URL de Vercel |
| 6 | ¿La versión coincide en `package.json`, `lib/version.ts` y la etiqueta? | Archivos + tag |
| 7 | ¿Se actualizaron README (catálogo de ECS), CHANGELOG y manuales? | Diff de documentación |
| 8 | ¿El PR tiene la revisión del CODEOWNER y conversaciones resueltas? | PR |
| 9 | ¿La línea base anterior sigue recuperable (etiqueta + despliegue)? | Tag `vX.Y.Z` en GitHub y Vercel |

**Revisión Técnica Formal (RTF):** la realiza el revisor del PR usando esta lista antes del merge.

## 7. Informe de Estado / Dictamen (estructura)

| Pregunta | Contenido |
|---|---|
| ¿Qué pasó? | Descripción del cambio, OCI y versión resultante |
| ¿Quién lo hizo? | Solicitante, quién aprobó (ACC), quién implementó y quién revisó |
| ¿Cuándo pasó? | Fechas de solicitud, aprobación, merge y liberación |
| ¿Qué más se vio afectado? | ECS modificados, servicios de la arquitectura, documentación y riesgos residuales |
| Dictamen | Aprobado para liberar / Aprobado con observaciones / Rechazado |

## 8. Herramientas de GCS

| Necesidad | Herramienta | Tipo | Justificación |
|---|---|---|---|
| Repositorio y control de versiones | **GitHub** | Nube / tercero | Ramas protegidas, PR, Issues con plantillas, CODEOWNERS y etiquetas en un solo lugar; gratuito para repos públicos |
| Integración continua | **GitHub Actions** | Nube / nativo de GitHub | Ejecuta lint y build en cada PR; el resultado es un check obligatorio para hacer merge |
| Despliegue y entornos | **Vercel** | Nube / tercero | Producción desde `main`, una URL de vista previa por rama/PR y *rollback* instantáneo a cualquier versión |
| Infraestructura como código | **Terraform** | Tercero, multiplataforma | `infra/main.tf` declara el proyecto de Vercel y la protección de ramas de GitHub; la configuración también se versiona y se revisa por PR |
| Alternativas evaluadas | AWS Config, Ansible, Puppet | Nativo AWS / terceros | AWS Config audita recursos solo dentro de AWS; Ansible y Puppet gestionan servidores, que este proyecto no administra. Terraform es multiplataforma y cubre GitHub y Vercel |
