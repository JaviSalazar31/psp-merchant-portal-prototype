# Contexto del Proyecto — Merchant Portal PSP Paynau

**Última actualización**: 15 mayo 2026
**Propósito**: archivo de contexto para retomar el proyecto rápidamente en cualquier conversación nueva con Claude (o para compartir con miembros del equipo que necesiten entender el estado del prototipo).

---

## Qué es este proyecto

Prototipo navegable "de juguete" del nuevo **Merchant Portal del PSP de Paynau** (orquestador de pagos LATAM). Sirve para presentarle al equipo de UX/UI los layouts esperados y al equipo técnico la arquitectura base sobre la que se va a construir el MVP productivo.

- **NO es** el producto real. Todo es mock + setTimeout, sin backend.
- **Release del MVP real**: mediados julio - principios agosto 2026.
- **Equipo**: 4 devs + 1 UX/UI (Tonantzin Head + Gerardo).

---

## Stack técnico

| Componente | Versión / Detalle |
|---|---|
| Build tool | Vite v5 |
| Framework | React 18 + TypeScript |
| UI library | MUI v6.1.x (v7 no estaba en npm a la fecha) |
| Estado | Zustand 5 (in-memory, no localStorage) |
| Routing | React Router 6 |
| Forms | react-hook-form + yup |
| Theme | Light por defecto, paleta verde brand `#7CFF45` |
| Idioma | Español rioplatense unificado (tuteo: tenés, completá, acordate) |

---

## Estructura de archivos del proyecto

```
C:\Users\javie\proyecto-merchant-portal\
├── Arquitectura_Merchant_Portal.md      ← Doc maestro (2932 líneas, autosuficiente)
├── Adenda_v1.md                          ← 8 cambios cerrados al doc maestro
├── README.md                             ← Guía de uso del paquete
├── Roadmap_Merchant_Portal.xlsx          ← Cronograma de pantallas (4 hojas)
├── Contexto_Proyecto.md                  ← Este archivo
│
├── figma-captures/                       ← 55 PNGs referenciados en el doc
│   └── 00-54_*.png
│
├── referencias/
│   └── Cruce_v2.md                       ← Consolidado de research (fallback opcional)
│
└── psp-merchant-portal-prototype/        ← Código generado por Claude Code
    ├── src/
    ├── package.json
    └── ...

Repo GitHub: github.com/JaviSalazar31/psp-merchant-portal-prototype
```

---

## Estado actual de las fases

10 fases totales para construir el prototipo. Estado al 15 mayo 2026:

| Fase | Descripción | Estado |
|---|---|---|
| 1 | Setup base (Vite + React + TS + MUI + Zustand + paleta) | ✅ Completada y commiteada |
| 2 | Pre-login (Login, Registro, Confirm Email, Password Reset) | ✅ Completada y commiteada |
| 3 | Onboarding wizard de 6 steps + pantalla bloqueante | ✅ Completada y commiteada |
| 4 | Layout post-aprobación (Sidebar, Topbar, Home Dashboard) | ✅ Completada y commiteada |
| 5 | Transacciones (Pay-In/Pay-Out + Create Pay-Out + drill-down) | ✅ Completada y commiteada |
| 6 | Settlements | ✅ Completada y commiteada |
| 7 | Users y Roles | ✅ Completada y commiteada |
| 8 | Settings (Account + Seguridad + API Keys + Webhooks + Profile) | ⏳ Próxima a arrancar |
| 9 | Patterns transversales y polish | ○ Pendiente |
| 10 | Build estático y entrega | ○ Pendiente |

---

## Decisiones cerradas que NO se reabren

(Listadas en §1.4 del doc maestro)

- Stack: Vite + React + TS + MUI v6.1.x + Zustand 5 + React Router 6 (NO Next.js)
- Idioma default: rioplatense unificado
- 8 estados visibles al comercio: Creado, Pendiente, En revisión, Autorizado, En disputa, Reembolsado, Rechazado, Fallido
- Wizard Onboarding: 6 steps (no 5)
- Sidebar: 5 entradas (Home, Transactions, Settlements, Users, Roles)
- Settings va en avatar dropdown (no en sidebar)
- 2FA en V1: placeholder "Próximamente"
- KYC en V1: plantilla Word descargable + drop zone para subir el firmado

---

## Cambios cerrados por la Adenda v1 (ya aplicados en fases anteriores)

1. **Email duplicado permitido** en Registro (un mismo correo puede registrar varias empresas)
2. **Campo "Idioma preferido"** en Registro
3. **Password 8-24 chars** (tope máximo)
4. **4to estado del Login** — "Cuenta bloqueada persistente"
5. **NO botones de Refund/Dispute** en drill-down (se gestionan por correo con Operaciones)
6. **Botón "Crear Pay-Out"** + pantalla CreatePayOutPage (formulario manual)
7. **Mensajes de error técnicos traducidos** a español amigable (errorMessages.ts)
8. **Ceguera del proveedor**: el comercio nunca ve el partner real (Kushki, Unlimit, PayCash) ni la traza de ruteo

---

## Fuera del scope V1 (postpuesto a V2)

- 2FA real funcional
- Barra de fuerza de password (Débil/Media/Fuerte/Muy fuerte)
- reCAPTCHA invisible v3
- Botones de iniciar disputa / ejecutar refund desde el portal
- Carga de evidencias defensivas para disputas
- Roles custom (V1 trae solo 3 built-in: Admin/Operator/Viewer)
- Programación de exportaciones recurrentes
- Edición de información del comercio mientras está en revisión

---

## Ajustes pendientes (para aplicar en Fase 9 - Polish)

Lista acumulada de detalles encontrados durante reviews visuales:

1. **Copy del email duplicado en Registro** — cambiar texto actual por:
   *"Si manejás varias empresas, podés usar el mismo correo para registrar cada una."*

2. **Dropdowns de idioma — unificar a 3 opciones**:
   - Español
   - English
   - Português (Brasil)

   Aplica al `LanguageSelector` flotante Y al campo "Idioma preferido" del `RegistroForm`.
   Type en `uiStore.language`: `'es' | 'en' | 'pt-BR'`.

3. **Selects de filtros con texto solapado** en Settlements, Pay-In y Pay-Out. El placeholder ("Todos", "Todas") se renderiza encima del label flotante ("Estado", "Moneda", "Método"). Probable causa: configuración de `Select` de MUI sin `displayEmpty` o conflicto con `InputLabel`.

---

## Configuración de Claude Code

| Item | Valor |
|---|---|
| Versión | 2.1.142 |
| Modelo | Opus 4.7 (1M context) |
| Plan | Claude Max |
| Effort | `max` |
| Pensamiento adicional | `ultrathink` en el prompt |
| Working dir | `C:\Users\javie\proyecto-merchant-portal\` |

---

## Reglas críticas que sigue Claude

### Reglas de Paynau (siempre)
- **Documentos internos**: nunca citar fuentes ni nombres individuales en outputs que vayan a Jira, Confluence o comunicaciones formales. Presentar todo en términos del producto/sistema/equipo.
- **Reportes**: consultar NotebookLM ("Contexto PSP-Paynau H1") en orden cronológico, más reciente prevalece. Confluence/Jira como cross-reference, pero NotebookLM gana salvo que Confluence/Jira sea más reciente.

### Reglas del prototipo
- **Funcional > pixel-perfect**: el objetivo es el flujo, no replicar el Figma al pixel.
- **Mocks + setTimeout**: nada de backend real.
- **No reabrir decisiones cerradas**: las de §1.4 del doc maestro son inamovibles.

---

## Workflow del proyecto

```
1. Después de cada fase, hacer commit + push a GitHub:
   git add .
   git commit -m "Fase X completada"
   git push

2. Probar visualmente en localhost:5173 antes de avanzar a la siguiente fase.

3. Anotar ajustes encontrados en la "Lista de ajustes pendientes"
   para aplicarlos todos juntos en Fase 9 (Polish).

4. Pasar el OK a Claude Code para avanzar.
```

---

## Cómo retomar el proyecto en un chat nuevo

Si arrancás una conversación nueva, pegale a Claude este mensaje de apertura:

```
Hola. Retomamos un proyecto que vengo trabajando. Te paso el contexto
en este archivo: [adjuntar Contexto_Proyecto.md]

Estoy en la fase [X] del prototipo. Necesito que [acción concreta].
```

Claude tiene memoria automática de chats anteriores (userMemories) que incluye background personal y profesional. Lo que NO tiene es el detalle exacto palabra por palabra de cada chat — para eso puede usar la herramienta `conversation_search` si le pedís refrescar algún tema puntual.

---

## Contactos clave del proyecto

- **PO**: Javier Salazar (contractor, desde Buenos Aires)
- **Tech Lead / Arquitecto**: Ismael Ramos
- **Head de Producto**: Ricardo
- **Frontend Lead**: Dietrich
- **UX/UI Head**: Tonantzin
- **UX/UI Designer asignado**: Gerardo
- **CISO**: Debanie
- **Devs**: Ubaldo, Emiliano, Héctor

*Recordatorio: estos nombres NO se citan en documentos que van a Jira, Confluence o comunicaciones internas. Solo se usan en contexto privado del PO.*

---

## Links útiles

- Repo del prototipo: https://github.com/JaviSalazar31/psp-merchant-portal-prototype
- Jira project: APSP (paynautech.atlassian.net)
- Confluence space: PSPPaynau
- NotebookLM: "Contexto PSP-Paynau H1"

---

*Fin del archivo de contexto. Mantener actualizado tras cada hito importante del proyecto.*
