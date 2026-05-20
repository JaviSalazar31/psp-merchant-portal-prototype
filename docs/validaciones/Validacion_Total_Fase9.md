# Validación Total Fase 9 — Merchant Portal PSP

**Fecha de validación**: 20 de mayo 2026  
**Commit del prototipo evaluado**: `595ef1e` (Corrida 4 + Corrida 4.1 cerradas)  
**Alcance**: Validación visual de pantallas + cruce cronológico con fuentes (NotebookLM 15/04 → 19/05) + Confluence Frontend Architecture

---

## 1. Resumen ejecutivo

El prototipo navegable cierra Fase 9 con la **gran mayoría de las decisiones aplicadas correctamente**. La auditoría detectó **3 desvíos críticos** respecto a la decisión más reciente del equipo, **5 ajustes finos** menores y **2 mejoras de UX** sugeridas para Fase 10.

### Veredicto

| Categoría | Cantidad | Severidad |
|---|---|---|
| Decisiones DC1-DC8 + F.1-F.7 aplicadas correctamente | 23 | ✅ |
| Desvíos críticos respecto a decisión más reciente | 3 | 🚨 |
| Ajustes finos visuales o de copy | 5 | 🟡 |
| Mejoras de UX sugeridas para Fase 10 | 2 | 💡 |
| Pendientes de validación (MCP caído en sesión) | 3 | ⏸ |

---

## 2. Fase 1 — Validación visual

### 2.1 Hallazgos OK (aplicación correcta de Corrida 4 + 4.1)

| ID | Decisión | Pantalla validada | Estado |
|---|---|---|---|
| DC1 | Pay-Out deshabilitado en sidebar con badge "Próximamente" | Sidebar | ✅ |
| DC2 | Roles integrado en Users (eliminado ítem independiente) | Sidebar | ✅ |
| DC2 | Perfil al pie del sidebar con separación visual | Sidebar | ✅ |
| DC3 | /account = solo datos del usuario logueado | Cuenta | ✅ |
| DC3 | /profile/wizard = datos comercio read-only con banner azul | Perfil del comercio | ✅ |
| DC3 | Email read-only con texto "Para cambios contactá a soporte" | Cuenta + Security | ✅ |
| DC4 | Módulo Desarrolladores con tabs API Keys + Canales | /developers | ✅ (ver §3 desvío) |
| DC5 | Rebrand de Webhooks → Canales de notificación | /developers tab | ✅ |
| DC5 | Modal con tipos Email/Callback, secret enmascarado | /developers tab | ✅ |
| DC6 | Total Balance USD destacado en verde brand | Dashboard | ✅ |
| DC6 | Gráfico de barras 30 días + sparkline + Tasa Aprobación | Dashboard | ✅ |
| DC6 | Tabla Balance por país (MX + Consolidado USD) | Dashboard | ✅ |
| DC6 | Banner verde bienvenida sin emoji, cerrable con X | Dashboard | ✅ |
| DC6 | Eliminación de "Acciones rápidas" | Dashboard | ✅ |
| DC7 | Estados en inglés (Created, Authorized, Failed, etc.) | Transacciones lista + filtros | ✅ |
| F.2 | Login anti-enumeration, banner sin nombrar campo, ambos en rojo | Login error states | ✅ |
| F.3 | Avatar dropdown con Operador "RED EFECTIVA" + nombre + email + rol | Header dropdown | ✅ |
| F.3 | Links Mi Perfil, Cuenta, Centro de Seguridad, Desarrolladores, Modo oscuro, Cerrar sesión | Header dropdown | ✅ |
| F.4 | Tiempos relativos "hace 4 días" en Canales de notificación | /developers | ✅ |
| F.5 | Secret enmascarado con ícono ojo (`sk_test_••••••••TjLp9Xqy`) | /developers API Keys | ✅ |
| F.6 | Centro de Seguridad 3 tarjetas (Email + 2FA placeholder + Contraseña) | /security | ✅ |
| F.6 | 2FA con badge gris "Próximamente disponible" + botón "Activar 2FA" deshabilitado | /security | ✅ |
| F.6 | Contraseña con "Recomendamos cambiarla cada 90 días" + "Último cambio: hace 1 mes" | /security | ✅ |
| F.7 | Origen ofuscado en transacciones (`**** 1000`) | Drill-down /transactions | ✅ |
| F.7 | Tab CEP Banxico para SPEI con folio, claves, bancos, botón Banxico | Drill-down SPEI MX | ✅ |
| F.7 | Timeline 4 hitos para transacciones Authorized (created → sent → pending → authorized) | Drill-down /transactions | ✅ |
| DP8 | Cambio de contraseña INLINE-EXPAND (no modal) | /security | ✅ |
| 404 | Página 404 con dot verde brand, copy rioplatense, botón "Volver al inicio" | /_demo-404 | ✅ |
| Cliente | Chip "Cliente: Tacos Pancho" en header (multi-tenant) | Header | ✅ |
| Bell | Campana de notificaciones con badge "3" | Header | ✅ |

### 2.2 Pendientes de validación visual

| Item | Razón |
|---|---|
| Wizard de onboarding paso a paso con `nuevo@test.com` | MCP de Chrome caído durante validación |
| Flujo completo de Registro (Sign Up) | MCP de Chrome caído durante validación |
| Pantallas demo de error 500 y 403 | Ruta `/_demo-500` redirige a 404 (no existe ruta dedicada) |

Estos 3 ítems quedan para verificar antes del deploy de Fase 10.

---

## 3. Desvíos críticos respecto a la decisión más reciente

### 🚨 Desvío #1 — Módulo Desarrolladores no debería existir

**Decisión más reciente (18 may 2026)**: en la corrida visual con Dietrich, Ismael cuestionó la presencia del módulo y se decidió **eliminar la gestión de API Keys del portal**. El argumento fue que el perfil del usuario administrativo "no sabe ni va a saber nada sobre APIs" y que la generación de credenciales es función legacy de PayPaga que debe quedar en Backoffice interno. Solo los Canales de Notificación sobreviven en el portal, bajo enfoque simplificado (email o callback URL).

**Estado actual en prototipo**: el módulo Desarrolladores está visible en avatar dropdown y como ruta `/developers` con dos tabs (API Keys + Canales de notificación). Esto **anula la decisión más reciente**.

**Severidad**: ALTA — confronta directamente la decisión consolidada del equipo del 18/05.

**Acción recomendada**:
- Mover el módulo "Canales de notificación" como módulo independiente del sidebar (no como tab anidado).
- Eliminar la pestaña "API Keys" y todo el contenido relacionado del portal.
- Eliminar el link "Desarrolladores" del avatar dropdown.
- Esta acción simplifica DC4 a "DC4-revisado: Módulo Canales de notificación (sin API Keys)".

---

### 🚨 Desvío #2 — Settlements en español (deben estar en inglés)

**Decisión más reciente (Cruce v2 del 14/05 + ratificación 18/05)**: los settlements deben mostrar sus estados **estrictamente en inglés** al igual que las transacciones, en 3 estados únicamente: `Pending`, `Ready to settle`, `Settled`.

**Estado actual en prototipo**: el dashboard muestra "En tránsito" y "Pendiente" en español en la sección "Próximas liquidaciones". Asumo que la pantalla de listado completo `/settlements` también está en español.

**Severidad**: ALTA — viola la convención de estados en inglés decidida explícitamente.

**Acción recomendada**:
- Cambiar todos los estados de settlements a inglés: `Pending`, `Ready to settle`, `Settled`.
- Verificar que la pantalla principal `/settlements` tenga las 8 columnas exactas decididas: `Created On`, `From`, `To`, `Cycle`, `Reporting Amount`, `Settlement Amount`, `Status`, `Actions`.
- Agregar tooltip educativo (ⓘ) en columnas Reporting Amount y Settlement Amount.
- Agregar botón "Descargar reporte" por fila (mock CSV/PDF).

---

### 🚨 Desvío #3 — Falta selector de idioma en avatar dropdown

**Decisión más reciente (Cruce v2 del 14/05)**: el selector de idioma debe estar en **dos ubicaciones**:
- Pantallas públicas (Login, Registro, Recuperar): selector flotante esquina superior derecha (esto sí está implementado, lo vi en /login).
- Pantallas internas (post-login): selector dentro del avatar dropdown.

**Estado actual en prototipo**: el avatar dropdown contiene Mi perfil, Cuenta, Centro de Seguridad, Desarrolladores, Modo oscuro, Cerrar sesión. **NO incluye selector de idioma**. El selector "Español" sigue siendo solo el del header global.

**Severidad**: MEDIA-ALTA — funcionalidad faltante que el Cruce v2 dejó documentada explícitamente.

**Acción recomendada**:
- Agregar opción "Idioma" dentro del avatar dropdown con submenú o radio Español (rioplatense) / Inglés / Portugués brasileño.
- Sincronizar con el selector global del header (mostrar siempre el idioma activo).

---

## 4. Ajustes finos (no críticos)

### 🟡 #1 — Logo PSP con dot verde separado horizontalmente

**Esperado (DC8)**: el dot verde sobre la última "P" del logo debe estar anclado tipográficamente, como una "tilde" o "punto sobre la i".

**Estado actual**: el dot está bien posicionado verticalmente pero **separado horizontalmente** de la P (parece más un orbital satelital que un punto anclado).

**Acción**: ajustar `left` o `transform: translateX` del dot para que esté pegado a la P.

---

### 🟡 #2 — Email read-only sin tooltip explícito

**Esperado (F.6 + Cruce v2)**: el email en `/security` y `/account` debe tener un **tooltip informativo (ⓘ)** al hover que diga "Por seguridad, el cambio de email debe solicitarse a soporte".

**Estado actual**: el copy está como texto inline debajo del campo ("Si necesitás cambiarlo, contactá a soporte" en Security; "Para cambios, contactá a soporte" en Account). Mensaje correcto, formato distinto al pedido.

**Acción**: convertir el copy en un tooltip con ícono ⓘ junto al campo (manteniendo accesibilidad: aria-label).

---

### 🟡 #3 — Mock data inconsistente: "En COP" mostrado para comercio MX

**Esperado**: el dashboard de Transacciones debería mostrar el monto procesado en la moneda principal del comercio. Para Tacos Pancho (MX), debería ser MXN.

**Estado actual**: aparece "$ 676.000 — En COP (moneda principal)" en una pantalla cuyo comercio es México.

**Acción**: corregir el mock data en `/transactions` para que muestre "En MXN (moneda principal)". Es un quirk de mock seeds, no de lógica.

---

### 🟡 #4 — Mezcla MX/CO/AR en lista de Transacciones cuando comercio es MX

**Esperado**: si Bruno opera solo en México (lo vimos en /profile/wizard), las transacciones deberían filtrar por país automáticamente. Si la decisión más reciente confirmó que el dashboard muestra solo países donde el comercio opera, las transacciones deberían respetar la misma regla.

**Estado actual**: filtrando por estado "Authorized" aparecen transacciones de CO y AR mezcladas con MX.

**Acción**: verificar lógica de filtrado por país del comercio (multi-país) o aclarar con mock data más coherente. **Nota**: si la convención es mostrar todos los países del comercio, entonces el mock data del comercio debería declarar que opera en MX+CO+AR (lo que contradice el banner "México" del Profile).

---

### 🟡 #5 — Email mock con typo (ana.lpez en vez de ana.lopez)

**Estado actual**: en drill-down de la primera transacción aparece "ana.lpez@ejemplo.com" (falta la "o").

**Acción**: trivial — corregir el seed. Es cosmético pero da impresión amateur en demo.

---

## 5. Mejoras de UX sugeridas (no eran requisito, las pongo por criterio PO)

### 💡 #1 — SweetAlert de confirmación al cambiar contraseña

**Comportamiento actual**: cambiar la contraseña en `/security` cierra la sesión sin feedback explícito (el usuario aparece de golpe en `/login`). Esto es el comportamiento BFF correcto según docs de Dietrich (rotación de refresh token + re-login obligatorio), pero la UX se siente abrupta.

**Sugerencia para Fase 10**: antes del logout, mostrar SweetAlert2 tipo:
> ✓ Contraseña actualizada  
> Por seguridad, ingresá nuevamente con tu nueva contraseña.

Después auto-redirect a `/login` con el email pre-cargado. Patrón consistente con SweetAlert2 que ya usa Dietrich en su Auth Flow.

---

### 💡 #2 — Persistencia ligera del authStore para evitar logout en URL directa

**Comportamiento actual**: navegar a una URL interna por barra de direcciones (ej. `/security`, `/profile/wizard`) desloguea al usuario porque el authStore no persiste. El workaround es `history.pushState`.

**Posición técnica de Dietrich (STO-001)**: la recomendación oficial es "sin persistencia" (UI data vive en memoria, se pierde en refresh). Esto es coherente con BFF (tokens van en cookies httpOnly, no en localStorage).

**Sugerencia para Fase 10 (prototipo)**: como el prototipo no tiene cookies httpOnly reales, usar `sessionStorage` para persistir solo `user.id` y `sessionId` (datos no sensibles). Esto evita el logout en navegación directa y simula mejor el comportamiento productivo. Coincide con la "Opción 2" que Dietrich plantea en STO-001 como aceptable.

**Importante**: esto es solo para el prototipo navegable. En productivo Next.js, la sesión vive en cookies del BFF.

---

## 6. Fase 2 — Investigación cronológica NotebookLM (15/04 → 19/05)

A continuación, el cruce cronológico decisión-por-decisión, ordenado de lo más viejo a lo más nuevo.

### Semana 1 — 15 al 19 abril 2026

| Decisión | Status en prototipo |
|---|---|
| Plan de migración en 5 fases definido por Dietrich | N/A (fuera de alcance prototipo) |
| Arquitectura BFF (Next.js → Go) confirmada | N/A (prototipo es Vite+React 18 sin BFF) |
| Monorepo Turborepo + pnpm | N/A (prototipo es app única SPA) |
| División en 2 apps: Registration + Operations | N/A (prototipo es app única SPA) |
| Paquetes compartidos (shared-types, shared-constants, shared-utils, i18n, sdk, ui) | N/A |
| Preparación SSO Paynau (Un cliente con múltiples productos) | N/A |
| SweetAlert2 para errores 500 + Toast para errores transitorios | ⏸ No probado todavía |
| Wizard inicialmente proyectado en 6 pasos (luego reducido a 5) | ✅ 5 pasos final |

**Observación**: la brecha entre prototipo (Vite+React 18+MUI 6, app SPA) y productivo (Next.js 16+React 19+MUI 7+BFF+Monorepo) es esperada. El prototipo es navegable de demo, no el producto final. Esto está OK, pero debe documentarse al entregar.

---

### Semana 2 — 20 al 26 abril 2026

| Decisión | Status en prototipo |
|---|---|
| Credencial única para multi-país (un solo email/login) | ✅ Implementado (Bruno admin@test.com con Tacos Pancho MX) |
| Sign Up pide solo "País de Incorporación" + datos básicos | ⏸ Pendiente validar (MCP caído) |
| Wizard pide "Países de Operación" en Paso 1 con checkboxes | ⏸ Pendiente validar |
| KYC simplificado a 3 documentos (modelo TDM): Acta + Poder + DNI/Pasaporte | ⏸ Pendiente validar (en wizard paso 5) |
| Documentos segmentados: pide doc por país, no mezclados | ⏸ Pendiente validar |
| Nuevos estados tarjeta: Under Review, In Dispute, Refunded, Rejected, Processed | ✅ DC7 aplicado |
| Validaciones onBlur (no inline mientras escribís) | ✅ Confirmado por Dietrich 18/05 |
| Checklist visual de password en tiempo real | ⏸ Pendiente validar (cambio contraseña inline) |
| SweetAlert2 para 3 intentos fallidos + Toast para timeouts | ⏸ No probado lockout en sesión |
| Documento AUTH-FLOWS-PO 2.md formalizado el 20/04 | N/A |
| Arquitectura frontend presentada por Dietrich 24/04 (2 plataformas desacopladas) | N/A |

---

### Semana 3 — 27 abril al 3 mayo 2026

| Decisión | Status en prototipo |
|---|---|
| Confirmación BFF + Dockerización paralela | N/A |
| Dashboard inicial: moneda local por país (USD consolidado a futuro) | 🚨 Status actualizado en Cruce v2 (14/05): USD total + por país |
| Webhooks de contracargos de Kushki para automatizar disputas | ⏸ Fuera de alcance prototipo |
| Sin decisiones profundas sobre API Keys, Settlements, Usuarios, Roles esa semana | — |

---

### Semana 4 — 4 al 10 mayo 2026

| Decisión | Status en prototipo |
|---|---|
| Plantilla descargable (Word) en wizard KYC | ⏸ Pendiente validar |
| Volumen mensual transaccionado por país (no global) | ⏸ Pendiente validar |
| Filiales multi-país → comercios independientes (no una cuenta única) | ✅ Consistente con DC3 (MVP un comercio por cuenta) |
| **Costa Rica suma como 4to país** (junto con MX, CO, BR) | ⏸ Pendiente validar en wizard |
| 8 estados consolidados de transacción (created, pending, under review, authorized, in dispute, refunded, rejected, failed) | ✅ DC7 |
| Mensajes de error amigables (traducción técnica → comercial) | ⏸ No probado en sesión |
| Carga manual CSV de conciliación para proveedores sin API | ⏸ No probado en /settlements |
| Timeout por inactividad con SweetAlert "¿deseas continuar?" | ⏸ Pendiente validar (3 min trigger + 2 min countdown) |
| Notificaciones proactivas de contracargos (email + webhook) | ⏸ Fuera de alcance prototipo |
| Levantamiento esqueleto API merchant desacoplada | N/A |
| Pantalla 404 revisada técnicamente | ✅ Implementada |

---

### Semana 5 — 11 al 17 mayo 2026 (Cruce v2 del 14/05)

Esta es la consolidación más completa. Lista exhaustiva:

| Decisión | Status en prototipo |
|---|---|
| **Wizard de 5 pasos** con pestañas persistentes | ⏸ Pendiente validar (presumiblemente OK) |
| Indicador de progreso estilo Stripe (✓ / ⏳ / ❌) por paso | ⏸ Pendiente validar |
| Guardado automático parcial paso a paso | ⏸ Pendiente validar |
| Eliminación de liquidación en criptomonedas | ⏸ Fuera de alcance directa |
| Matriz de Escalamiento → tabla interactiva en Paso 4 con 5 contactos mínimos | ⏸ Pendiente validar |
| KYC Paso 5: Acta + ID Rep Legal + Comprobante Domicilio + Certificado Bancario + Logotipo | ⏸ Pendiente validar |
| Poder Legal solo si país = México (condicional) | ⏸ Pendiente validar |
| ID fiscal con título dinámico por país (RFC en MX, NIT en CO, CNPJ en BR) | ⏸ Pendiente validar |
| Pantalla bloqueante "En revisión" tras submit | ⏸ Pendiente validar |
| Dashboard con KPI Total Balance USD | ✅ Aplicado |
| Banner verde de bienvenida tras aprobación | ✅ Aplicado |
| Sidebar con "Liquidaciones" elemento único (sin duplicados) | ✅ Aplicado |
| **Mobile First**: sidebar drawer < 900px, formularios en columna, tabla con scroll horizontal + primera columna sticky | ⏸ No probado responsive en sesión |
| **Separación Account vs Profile estricta** | ✅ DC3 aplicado |
| **Email read-only con tooltip** | 🟡 Texto inline en vez de tooltip (#2 de ajustes finos) |
| 2FA placeholder visual "Próximamente" (Fase 2) | ✅ Aplicado |
| Indicador de fuerza contraseña + checklist tiempo real | ⏸ Pendiente validar en cambio inline-expand |
| Emails duplicados permitidos en Sign Up | ⏸ Pendiente validar |
| Campana de notificaciones in-app en header | ✅ Aplicado (badge "3") |
| API Keys: sin botón Sandbox/Prod, manejado en /profile/credentials con vigencia 30/90/180/365 días | 🚨 Ver Desvío #1 (módulo Desarrolladores debe quitarse) |
| **Simulador en /dev para QA UX/UI** (estados incompleto, pendiente, rechazado) | ✅ Confirmado (vimos los 4 usuarios mock con estados distintos) |
| **Selector de Países**: Autocomplete MUI, 14 países total (13 PayCash + AR), pre-poblado 4 (MX/CO/BR/CR), max 3 (form arranca inválido) | ⏸ Pendiente validar comportamiento exacto del bloqueo |
| **Settlements**: estados en inglés (Pending / Ready to settle / Settled), 8 columnas, tooltips ⓘ en montos, botón Descargar reporte | 🚨 Ver Desvío #2 (estados en español hoy) |

---

### Semana 6 — 18 al 19 mayo 2026 (Reunión corrida visual con Dietrich)

| Decisión | Status en prototipo |
|---|---|
| Mejorar UX wizard: error solo onBlur (no inline mientras se escribe) | ⏸ Pendiente validar |
| Botón "simular aprobación" para pruebas internas | ⏸ Pendiente validar (puede estar en /dev) |
| Depurar filtros: solo países de operación del comercio (sin USD irrelevante) | 🟡 Posible inconsistencia (#3 + #4 de ajustes finos) |
| Eliminar "PIX" del filtro de métodos → unificar bajo "Transferencia" | ⏸ Pendiente validar en /transactions filtro Método |
| **Quitar módulo Desarrolladores / API Keys del portal** | 🚨 Ver Desvío #1 |
| Mantener "Canales de notificación" simplificados (email o callback URL) | ✅ Aplicado |
| Rol Operador NO puede crear refunds (solo lectura + ver transacciones) | ⏸ Pendiente validar en /users tabla de permisos |
| Sin emojis en saludo de bienvenida (formalidad financiera) | ✅ Aplicado |
| Puntitos de colores como indicadores rápidos de estado | ✅ Aplicado en chips |
| Logo PSP con dot verde sobre P + Favicon + 404 propio | 🟡 Ver ajuste #1 (dot horizontalmente separado) |
| 8 estados de transacción en inglés rígido | ✅ DC7 |
| **Selector de idioma en avatar dropdown post-login** | 🚨 Ver Desvío #3 (falta) |

---

## 7. Fase 3 — Confluence Dietrich: arquitectura frontend desacople

Dietrich publicó **6 páginas** técnicas en Confluence sobre el desacople de la app web entre el 13 abril y el 6 mayo 2026. Resumen de cada una y cómo se conecta con el prototipo.

### 7.1 Auth Flow | Error States (mod 06/05/2026)

Define UX/UI para Registro, Login, Onboarding. Reglas clave:
- Validación onBlur + checklist password en tiempo real
- Botón submit deshabilitado mientras hay errores
- Login con lockout 3 intentos / 5 minutos
- Mensaje anti-enumeration "Credenciales incorrectas. Verificá tu email y contraseña" (ambos campos marcados rojos)
- Toast 3s para errores transitorios
- SweetAlert bloqueante para 500 / 503

**Status en prototipo**:
- ✅ Mensaje anti-enumeration aplicado (F.2)
- ⏸ Lockout 3 intentos pendiente probar
- ⏸ Toast / SweetAlert pendiente probar

---

### 7.2 Authentication (mod 05/05/2026)

Define el BFF pattern para auth:
- Separación auth.ts (LoginResponse mínimo) / user.ts (UserProfile completo)
- 7 casos AUTH-001 a AUTH-007: token expira, refresh, multi-tabs, race condition, device fingerprint, Redis caído, **token robado** (rotación)
- Refresh token rotation
- RememberDevice (7 días con device fingerprint vs 24h sin él)

**Status en prototipo**: N/A directo (prototipo no tiene BFF real). Pero el patrón de **logout forzado al cambiar contraseña** está alineado con AUTH-007 (invalidación + re-login).

---

### 7.3 Transaction Flows (mod 05/05/2026)

Documento maestro del ciclo de vida transaccional. Define:
- 8 estados encapsulados: Created, Pending, UnderReview, Authorized, InDispute, Refunded, Rejected, Failed
- 3 árboles de decisión: Efectivo (PayCash), Transferencia (SPEI/PIX), Tarjeta
- Estados exclusivos: InDispute + Refunded solo aplican a Tarjeta
- Reglas de retry, dispute window, escenarios de reversa

**Status en prototipo**:
- ✅ Los 8 estados están todos en el filtro de Estado en /transactions (DC7)
- ✅ Timeline de eventos muestra hitos correctos (created → sent → pending → authorized)
- ⏸ Estado InDispute, Refunded, Rejected en tarjeta sin probar drill-down específico

---

### 7.4 Network (mod 20/04/2026)

Define manejo de errores de red en BFF:
- NET-001: Timeout 30s + AbortController + UPLOAD_TIMEOUT_MS 2min
- NET-002: Cambio de red (WiFi → Cellular / VPN) con error codes SUSPICIOUS_ACTIVITY + IP_CHANGED
- NET-003: Servidor devuelve HTML en vez de JSON → validar content-type
- NET-004: 429 Rate Limit en login con SweetAlert "Demasiadas solicitudes"

**Status en prototipo**: N/A (sin backend real).

---

### 7.5 Storage (mod 20/04/2026)

Define persistencia local:
- STO-001: tokens en httpOnly cookies (no localStorage). Para UI data (user + sessionId): **Opción 1 sin persistencia (recomendado)** o **Opción 2 sessionStorage** (sobrevive refresh, no nuevas tabs).
- STO-002: validación de schema antes de hidratar (defensa contra datos corruptos)

**Status en prototipo**: el authStore actual NO persiste (sigue Opción 1). Esto causa el logout en URL directa. Ver mejora 💡#2.

---

### 7.6 Timing (mod 20/04/2026)

Define manejo de timing y race conditions:
- TIM-001: Timeout en request lenta
- TIM-002: Hydration mismatch SSR/CSR (`skipHydration` + ProtectedRoute con LoadingSkeleton)
- TIM-003: Memory leak por listeners no limpiados en Zustand
- TIM-004: Estado stale después de logout (guard con `logoutTimestamp`)

**Status en prototipo**: N/A (Vite SPA, sin SSR).

---

### 7.7 Security (mod 13/04/2026)

Define amenazas y mitigaciones BFF:
- SEC-001: CSRF — Cookie SameSite=Lax + httpOnly + same-origin del BFF
- SEC-002: Session fixation — rotación de refresh token invalida tokens fijados
- SEC-003: Browser extension modifica headers — validación SERVER-SIDE de fingerprint, no en headers cliente

**Status en prototipo**: N/A (sin backend real).

---

## 8. Brecha prototipo vs arquitectura productiva

| Aspecto | Prototipo actual | Arquitectura productiva (definida) |
|---|---|---|
| Framework | Vite + React 18 | Next.js 16 + React 19 |
| UI library | MUI v6.1.x | MUI v7.3.9 |
| State management | Zustand 5 (sin persist) | Zustand 5 + Zod 4.3.6 + React Hook Form 7.72.1 |
| Validación | Mocks setTimeout | Zod schemas + BFF validation |
| Backend | Mocks en memoria | Go API + Next.js BFF |
| Auth | localStorage tipo authStore | JWT stateless + Redis + httpOnly cookies + refresh rotation |
| Estructura | App única SPA | Monorepo Turborepo + 2 apps (registration + operations) + 6 packages |
| i18n | Solo Español rioplatense | EN / ES (rioplatense) / PT-BR via packages/i18n |
| Comunicación | Browser → Mocks | Browser → Next.js → Go API |

Esta brecha es **esperada y aceptable** para un prototipo navegable de demostración. **No requiere acción**, pero debe documentarse al entregar.

---

## 9. Lista priorizada de acciones recomendadas

### Acciones P0 (críticas — antes del deploy de Fase 10)

| # | Acción | Tiempo estimado |
|---|---|---|
| 1 | Eliminar módulo Desarrolladores / API Keys del portal (Desvío #1) | 1-2 horas |
| 2 | Mover Canales de notificación como módulo independiente del sidebar | 1 hora |
| 3 | Cambiar estados de Settlements a inglés: Pending / Ready to settle / Settled (Desvío #2) | 1 hora |
| 4 | Agregar selector de idioma al avatar dropdown post-login (Desvío #3) | 1-2 horas |

**Total P0**: ~5 horas. Estos 4 cambios alinean el prototipo con la decisión consolidada más reciente (Cruce v2 + corrida visual 18/05).

### Acciones P1 (importantes — mejor con ellas que sin ellas)

| # | Acción | Tiempo estimado |
|---|---|---|
| 5 | Ajustar dot verde del logo PSP para anclarlo tipográficamente a la P | 30 min |
| 6 | Convertir copy "Para cambios contactá a soporte" del email read-only en tooltip (ⓘ) | 30 min |
| 7 | Corregir mock data inconsistente: "$ 676.000 — En MXN (moneda principal)" para comercio MX | 15 min |
| 8 | Verificar lógica de filtrado por país del comercio en /transactions | 30 min |
| 9 | Corregir typo mock: ana.lpez → ana.lopez (y revisar otros emails mock) | 15 min |
| 10 | Validar visualmente las 3 pantallas pendientes (Wizard + Sign Up + 500/403 demo) | 1 hora |

**Total P1**: ~3 horas.

### Acciones P2 (sugeridas para Fase 10 — mejoras UX)

| # | Acción | Tiempo estimado |
|---|---|---|
| 11 | SweetAlert "Contraseña actualizada" antes del logout forzado | 1 hora |
| 12 | Persistencia ligera del authStore con sessionStorage para evitar logout en URL directa | 1-2 horas |
| 13 | Crear rutas /_demo-500 y /_demo-403 dedicadas (hoy redirigen a 404) | 1 hora |

**Total P2**: ~4 horas.

---

## 10. Conclusión y recomendación final como PO Senior

El prototipo está en muy buen estado. Sobre **30+ decisiones de Corrida 4 + 4.1**, **23 están aplicadas correctamente**. Los **3 desvíos críticos** detectados son todos consecuencia de decisiones tomadas en la última semana (Cruce v2 del 14/05 + corrida visual del 18/05), por lo que es natural que el prototipo aún no los refleje.

### Mi recomendación

**No hagas deploy de Fase 10 sin ejecutar las 4 acciones P0**. Son 5 horas de trabajo y dejan el prototipo perfectamente alineado con la decisión consolidada del equipo. Hacer un deploy con el módulo Desarrolladores visible o con Settlements en español sería entregar al equipo algo que sabés que ya no representa la decisión vigente — y eso erosiona credibilidad como PO.

Las acciones P1 (~3 horas) son altamente recomendables porque son detalles que en el demo se notan. P2 son nice-to-haves que pueden quedar para una iteración siguiente.

**Tiempo total recomendado pre-deploy**: ~8 horas (P0 + P1) = 1 día de trabajo concentrado.

Después de eso, deploy estático limpio (Vercel/Netlify/GitHub Pages) + README con credenciales mock + lista de URLs útiles para la demo, y Fase 10 cerrada.

---

**Documento generado**: 20 may 2026  
**Autor**: Validación asistida con MCP Chrome + NotebookLM + Atlassian Confluence  
**Fuentes consultadas**:
- Prototipo en localhost:5173 (commit 595ef1e)
- NotebookLM notebook "Contexto PSP-Paynau H1" (sesión 300bb66c, 10 queries)
- Confluence space PSPPaynau (6 páginas de Dietrich Fernandez + 1 de Ismael Ramos)
