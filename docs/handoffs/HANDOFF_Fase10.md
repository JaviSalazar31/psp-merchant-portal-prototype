# Handoff Fase 10 — Build estático y entrega del Merchant Portal PSP

**Fecha**: 20 mayo 2026
**Autor**: Conversación previa con Claude (cierre de Corrida 7)
**Propósito**: documento autocontenido para arrancar la **Fase 10 (última)** del prototipo Merchant Portal PSP en un chat nuevo, sin tener que repetir historia.
**Para usar**: pegar este archivo en el inicio de un chat nuevo, o subirlo como contexto.

---

## 1. Qué es Fase 10

**Fase 10 = Build estático + Deploy + README final de entrega.**

Es la fase más liviana del proyecto:

1. `npm run build` final
2. Deploy a Vercel o Netlify → URL pública navegable (`psp-merchant-portal.vercel.app` o similar)
3. Para que el equipo (María, Gerardo, Ricardo, Dietrich, Ismael) abra el link sin instalar nada
4. README final de entrega con credenciales mock + URLs útiles para la demo

**No hay build de pantallas nuevas** en Fase 10. Solo packaging y publicación.

---

## 2. Estado del proyecto al iniciar Fase 10

### Repositorio

- **GitHub**: https://github.com/JaviSalazar31/psp-merchant-portal-prototype
- **Branch**: `main`
- **HEAD actual**: `5907771` (commit 18 - "feat(onboarding): alinear Paso 5 con lista de documentos definida por equipo comercial")
- **Local del PO (Javi)**: `C:\Users\javie\proyecto-merchant-portal\psp-merchant-portal-prototype\`

### Fases cerradas

| Fase | Estado | Commits clave |
|---|---|---|
| 1 — Setup base (Vite + React + TS + MUI + Zustand) | ✅ | iniciales |
| 2 — Pre-login (Login, Registro, Recuperar) | ✅ | iniciales |
| 3 — Onboarding Wizard (5 pasos) + pantalla "En revisión" | ✅ | iniciales |
| 4 — Layout post-aprobación (Sidebar + Topbar + Home) | ✅ | iniciales |
| 5 — Transacciones (Pay-In + drill-down + filtros + export) | ✅ | iniciales |
| 6 — Settlements | ✅ | iniciales |
| 7 — Users y Roles | ✅ | iniciales |
| 8 — Settings (API Keys, Webhooks, Centro Seguridad, Cuenta, Perfil) | ✅ | iniciales |
| 9 — Polish y refinamiento (Corridas 1-4.1) | ✅ | `595ef1e` y previos |

### Corridas posteriores a Fase 9 ejecutadas en esta sesión y la previa

| Corrida | Resumen | HEAD |
|---|---|---|
| 5 | Branding PSP + país de constitución + dashboard moneda local + payment methods Fase 1 + reducción a MX/CO/BR + ajustes UX | `903531d` |
| 6 | Generador de KYC en Word por país, año dinámico, descarga real desde Step 5 del Wizard | `3226d5b` |
| 7 | Alinear Paso 5 con lista de documentos definida por equipo comercial (Liliana): set único por entidad legal, Poder Legal condicional a MX, etiqueta fiscal dinámica RFC/NIT/CNPJ, Logotipo SVG/AI/EPS/PDF/PNG, eliminar chips de país en Step 5 | `5907771` |

### Stack técnico

| Componente | Versión |
|---|---|
| Vite | v5.4.21 |
| React | 18.3 + TypeScript |
| MUI | v6.1.x |
| Zustand | 5.0 |
| React Router | 6.28 |
| react-hook-form + yup | 7.54 / 1.5 |
| docx (generador KYC Word) | 9.6 |
| file-saver | 2.0 |
| Theme | Light, paleta verde brand `#7CFF45` |
| Idioma | Español rioplatense unificado |

---

## 3. Comandos clave del proyecto

```powershell
# Local
cd C:\Users\javie\proyecto-merchant-portal\psp-merchant-portal-prototype

# Levantar dev server
npm run dev          # puerto 5173 (o 5174/5175 si están ocupados)

# Type check
npx tsc --noEmit

# Build de producción (genera dist/)
npm run build

# Preview del build local
npm run preview
```

El `npm run build` actual genera:
- `dist/index.html` (~0.77 kB)
- `dist/assets/index-{hash}.js` (~1.6 MB, ~485 kB gzip)

Pasa limpio con warnings menores de React Router v7 future flags (no son bloqueantes).

---

## 4. Credenciales mock para la demo

Password global: **`Test1234!`**

| Email | Estado del usuario | Adónde cae al loguear |
|---|---|---|
| `nuevo@test.com` | Onboarding desde cero | Wizard Paso 1 |
| `wizard@test.com` | Onboarding en progreso | Wizard Paso 3 |
| `pending@test.com` | Solicitud enviada, en revisión | Pantalla "En revisión" |
| `admin@test.com` | Cuenta aprobada (rol Admin) | Dashboard MX |

(Se agregaron usuarios extra durante Corridas 5-7 con países de constitución variables — Tacos Pancho MX, Arepas Bogotá CO, Feijão Brasileiro BR — pero no quedaron persistidos porque el authStore es in-memory).

---

## 5. Pendientes documentados del cierre de Fase 9 (Validación visual del 20 mayo)

> **Fuente**: documento `Validacion_Total_Fase9.md` generado en el chat anterior "Error en commit de documentos KYC". Recomendaciones del cierre de la corrida visual sobre commit `595ef1e`.

**Antes de hacer deploy**, validar si estos pendientes ya están resueltos en las Corridas 5-7 o todavía están abiertos.

### P0 — Desvíos críticos (~5 horas)

3 desvíos detectados respecto a decisiones más recientes del equipo (Cruce v2 del 14/05 + corrida visual del 18/05). Cada uno necesita verificación manual:

1. **Módulo Desarrolladores visible** — si todavía aparece en el sidebar, hay que sacarlo. La decisión más reciente del equipo lo dejó fuera de MVP Fase 1.
2. **Settlements en español** — los labels de estado tienen que estar en inglés rígido (Pending / Ready to settle / Settled). El commit `bbeeeb5` de Corrida 5 lo arregló. **Verificar que sigue OK.**
3. **Tercer desvío** — está documentado en `Validacion_Total_Fase9.md`. Conviene abrir ese archivo del repo (si está agregado) o del documento generado en el chat anterior y leerlo entero.

### P1 — Ajustes finos (~3 horas)

5 ajustes visuales/copy menores listados en el mismo documento. No bloqueantes pero conviene hacerlos antes del deploy porque "en la demo se notan".

### P2 — Nice-to-haves (~4 horas)

- SweetAlert "Contraseña actualizada" antes del logout forzado
- Persistencia del authStore con sessionStorage (evita logout en URL directa)
- Rutas dedicadas `/_demo-500` y `/_demo-403`

**Total recomendado pre-deploy según Validacion_Total_Fase9.md**: 8 horas (P0 + P1) = 1 día de trabajo concentrado.

**Recomendación para el chat nuevo**: arrancar pidiéndole a Claude que lea `Validacion_Total_Fase9.md` (si está en el repo) o que solicite el archivo, y haga un cross-check con el código actual para ver cuáles de los P0/P1/P2 siguen abiertos después de Corridas 5-7. Probablemente varios ya están cerrados.

---

## 6. Plan recomendado para Fase 10

### Paso 1 — Cross-check de pendientes P0/P1 (1-2 horas)

Antes de tocar deploy, validar uno por uno cuáles de los 3 + 5 pendientes del cierre de Fase 9 siguen vigentes después de las Corridas 5-7. Algunos ya pueden estar resueltos.

### Paso 2 — Ejecutar P0 que sigan abiertos (~2-5 horas según cuánto quede)

Hacer commits chicos por cada P0, push, validar build.

### Paso 3 — Ejecutar P1 si el tiempo lo permite (~3 horas)

### Paso 4 — Build de producción final

```powershell
cd C:\Users\javie\proyecto-merchant-portal\psp-merchant-portal-prototype
npm run build
npm run preview   # verificar localmente que el build anda
```

### Paso 5 — Deploy a Vercel (recomendado)

Vercel es el más simple para apps Vite + React. Pasos:

1. Crear cuenta en https://vercel.com (signup con GitHub).
2. "Import Project" → seleccionar el repo `psp-merchant-portal-prototype`.
3. Vercel detecta Vite automáticamente. Build command: `npm run build`. Output: `dist`.
4. Click "Deploy".
5. Te entrega una URL del tipo `https://psp-merchant-portal-prototype.vercel.app`.

Alternativa: **Netlify** (similar UX) o **GitHub Pages** (gratis pero requiere config extra en `vite.config.ts` para `base`).

### Paso 6 — README final de entrega

Crear `README.md` en el root del repo con:

```markdown
# Merchant Portal PSP — Prototipo navegable

URL pública: https://psp-merchant-portal-prototype.vercel.app

## Para qué sirve

Prototipo de juguete del nuevo Merchant Portal del PSP de Paynau (orquestador
de pagos LATAM). Sirve para presentarle a UX/UI los layouts esperados y al
equipo técnico la arquitectura base sobre la que se construirá el MVP productivo.

**No es el producto real**: todo es mock + setTimeout, sin backend.

## Credenciales mock

Password global: `Test1234!`

| Email | Adónde cae al loguear |
|---|---|
| nuevo@test.com | Wizard Paso 1 |
| wizard@test.com | Wizard Paso 3 |
| pending@test.com | Pantalla "En revisión" |
| admin@test.com | Dashboard MX |

## Pantallas principales para la demo

- Login / Registro / Recuperar contraseña
- Wizard de onboarding (5 pasos) + descarga real del KYC en Word
- Pantalla "En revisión" post-envío
- Dashboard con balance + volumen por país
- Transacciones Pay-In con filtros, columnas configurables, drill-down y export
- Settlements
- Users y Roles
- Settings (API Keys, Webhooks, Centro de Seguridad, Cuenta, Perfil)

## Stack

Vite v5 + React 18 + TypeScript + MUI v6 + Zustand 5 + React Router 6.
```

### Paso 7 — Compartir la URL

Mandarle el link a María (UX Head), Gerardo (UX/UI), Ricardo (Head Product), Dietrich (Frontend Lead), Ismael (Tech Lead). Cualquier cambio post-feedback es un commit + push y Vercel redespliega automático.

---

## 7. Decisiones críticas vigentes (NO romper en Fase 10)

### Producto

- **Fase 1 MVP = 3 países: México, Colombia, Brasil.** (Sin Argentina, sin Perú, sin Costa Rica todavía.)
- **Branding visible al merchant = "PSP"** (no Paynau). Logo tipográfico PSP con punto verde.
- **Métodos de pago Fase 1**: tarjeta crédito/débito, SPEI (MX), PIX (BR), Efectivo. Eliminado USD consolidado del dashboard (cada país muestra su moneda local).
- **Idioma**: español rioplatense unificado (tenés, completá, acordate). Selector global de idioma con es/en/pt-BR. Selector también en avatar dropdown post-login.
- **Step 5 del Wizard (Corrida 7)**: set único de documentos por entidad legal (no por país). Set de 7 docs alineado con lista del equipo comercial (Acta Constitutiva, Poder Legal solo MX, ID Rep Legal, Documento Fiscal con label dinámico RFC/NIT/CNPJ, Comprobante de domicilio, Certificado de cuenta bancaria, Logotipo). + KYC firmado.

### Arquitectura

- **MVP = 1 entidad legal por cuenta.** Casos con filiales en múltiples países se manejan vía cuentas independientes (fuera de alcance MVP).
- **8 estados de transacción al merchant**: Created, Pending, Under Review, Authorized, In Dispute, Refunded, Rejected, Failed.

### Reglas operativas para el chat nuevo

Estas reglas aplican a CUALQUIER trabajo de Paynau. Activarlas al iniciar el chat nuevo:

- **Skill `paynau-docs`** activa siempre que se generen documentos/HUs/PRDs/correos formales del proyecto.
- **Anti-alucinación**: NUNCA inventar ni completar de memoria. Si falta info, consultar NotebookLM (notebook "Contexto PSP-Paynau H1") en orden cronológico viejo→nuevo.
- **Anti-IA en prosa**: aplicar `deslop` + `humanizer` al final de los drafts.
- **HUs para Jira**: formato "Como / Quiero / Para" + sección "Contexto" + 3 criterios de aceptación. Modelo APSP-247.
- **Documentos Paynau**: nunca mencionar fuentes (notebooks, archivos, reuniones por nombre) ni personas por nombre. Presentar en términos del producto/sistema/equipo.
- **Prompts para Claude Code CLI**: incluir SIEMPRE "ultrathink" al inicio.
- **MCP de Claude Chrome**: cuando se pide validación visual, activarlo y hacerlo funcionar; no derivar al manual. Si `permission_required`, resolver con `switch_browser`.

### Reglas de uso del MCP de Chrome (aprendido en esta sesión)

- **Estimación honesta**: cada flujo completo del Wizard son 5-8 minutos en MCP en condiciones óptimas. Para validar 3 países = 15-25 minutos. Si el MCP se cuelga: +4-5 minutos por crash. Si se reinicia el dev server: pierde state, hay que rehacer flujo.
- **Antes de proponer validación visual extensa**: dar estimación realista al PO y ofrecer alternativa "vos lo probás a mano en 1 minuto" cuando sea más eficiente.
- Para campos MUI usar combo `find` + `form_input` (no clicks por coordenada).
- Para dropdowns MUI: click en el combobox abre la lista, después `find` para localizar la option, después click en la option.

---

## 8. Tensión pendiente NO bloqueante para Fase 10

### Corrida 8 (POST-deploy o paralela): Steps 2/3/4 del Wizard

Hay una tensión documentada entre la objeción del PO (Javi) y la decisión técnica del equipo (Ismael, Dietrich, Gerardo) sobre los chips MX/CO/BR en Steps 2, 3 y 4:

- **Decisión del equipo técnico** (documentada en NotebookLM): eliminar los chips, wizard único y lineal. Una sola cuenta bancaria, una sola dirección, un set de contactos.
- **Objeción del PO**: un comercio multi-país probablemente tiene más de una cuenta bancaria. Propuesta intermedia: mantener los chips pero permitir N/A en los campos por país que no apliquen. Criterio: "mejor que sobre a que falte".

**Camino sugerido**:
- Sync corto entre Javi, Ismael, Dietrich y Gerardo para zanjar la tensión.
- Si el equipo confirma el corte radical → Corrida 8 = barrido completo de chips en Steps 2/3/4.
- Si el equipo acepta el enfoque conservador → Corrida 8 = solo agregar opcionalidad/N/A en campos por país.

**Esta decisión NO bloquea el deploy de Fase 10.** El prototipo se puede publicar con la versión actual y la corrección queda para una iteración posterior.

---

## 9. Validación visual pendiente de Corrida 7 (opcional)

Quedó SIN validar visualmente en pantalla el Step 5 con país de constitución = Brasil. Sí está validado lógicamente (script tsx) y por inferencia (la lógica idéntica funciona para MX y CO en pantalla).

**Para cerrar al 100% si querés**: en el local, borrar localStorage del browser, login `nuevo@test.com` / `Test1234!`, Step 1 con paisConstitucion = Brasil, completar mínimo, llegar al Step 5. Tiene que aparecer: 7 docs (sin Poder Legal) + label "CNPJ — Cartão CNPJ" en el doc fiscal.

Tiempo estimado: 1-2 minutos manual.

---

## 10. Cierre

Cuando arranques el chat nuevo:

1. Pegar este documento como contexto.
2. Pedir leer `Contexto_Proyecto_Merchant_Portal_PSP.md` del repo (tiene más detalle del stack y la historia).
3. Pedir cross-check de pendientes P0/P1 contra el código actual.
4. Decidir orden de ataque (P0 → P1 → build → deploy).
5. Ejecutar.

**Estimación realista de Fase 10 completa**: 1-2 días de trabajo concentrado, dependiendo de cuántos P0/P1 sigan abiertos.

---

**Fin del handoff.**
