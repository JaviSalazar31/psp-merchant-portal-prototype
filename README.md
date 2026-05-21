# Merchant Portal PSP — Prototipo navegable

Prototipo navegable del Merchant Portal del PSP — orquestador de pagos LATAM.

Sirve como referencia visual para UX/UI y como arquitectura base sobre la que se construye el MVP productivo (release: julio-agosto 2026).

**No es el producto real**: todo es mock + `setTimeout`, sin backend.

---

## URL pública

> https://psp-merchant-portal-prototype.vercel.app

---

## Credenciales mock para la demo

Password global: `Test1234!`

| Email | Estado del usuario | Adónde cae al loguear |
|---|---|---|
| `nuevo@test.com` | Onboarding desde cero | Wizard Paso 1 |
| `wizard@test.com` | Onboarding en progreso | Wizard Paso 3 |
| `pending@test.com` | Solicitud enviada, en revisión | Pantalla "En revisión" |
| `admin@test.com` | Cuenta aprobada (rol Admin) | Dashboard MX |

> El `authStore` no persiste entre recargas (in-memory). Para reiniciar, refrescá la página y volvé a loguear.

---

## Pantallas principales

### Pre-login

- **Login** con anti-enumeration, lockout temporal y persistente, recuperación de contraseña
- **Registro** con multi-email permitido (una persona puede registrar varias empresas)
- **Confirmación de email** y reseteo de contraseña

### Onboarding (Wizard de 6 pasos)

1. **Datos de la Empresa** — país de constitución (MX/CO/BR), residencia fiscal, ID fiscal con label dinámico (RFC/NIT/CNPJ), volumen mensual, países de operación
2. **Dirección Comercial** — datos por país
3. **Información Bancaria** — cuenta por país, moneda
4. **Contactos y Escalaciones** — matriz de contactos por departamento
5. **Documentos** — KYC firmado descargable en Word (generado dinámicamente por país) + set único de docs de entidad legal con label fiscal dinámico
6. **Enviar para revisión** — resumen pre-envío con acordeones editables y checkbox de confirmación

Tras enviar: pantalla bloqueante "En revisión" hasta aprobación de Backoffice.

### Post-aprobación

- **Home Dashboard** — balance en moneda local, volumen 30 días, tasa de aprobación, últimas transacciones, próximas liquidaciones
- **Transactions Pay-In** — listado con filtros avanzados, columnas configurables, drill-down completo (timeline + tabs CEP Banxico para SPEI), export CSV
- **Settlements** — listado, KPIs, drill-down con detalle de fees
- **Users** — gestión de usuarios + tab interno de Roles (3 roles built-in: Admin/Operator/Viewer)
- **Canales de notificación** — webhooks de eventos del comercio (email + callback URL)
- **Profile (Perfil del comercio)** — datos del comercio en modo read-only
- **Settings** (vía avatar dropdown): Mi perfil, Cuenta, Centro de Seguridad, selector de idioma (es/en/pt-BR), modo oscuro

### Pantallas demo de errores

- `/_demo-404` — Página no encontrada
- `/500` y `/403` — Errores del servidor y de permisos

---

## Decisiones críticas del producto (no se reabren)

- **Fase 1 MVP = 3 países**: México, Colombia, Brasil
- **Branding visible al comercio = "PSP"** (no se expone la marca del orquestador)
- **Métodos de pago Fase 1**: tarjeta crédito/débito, SPEI (MX), PIX (BR), efectivo
- **Idioma default**: español rioplatense unificado
- **8 estados de transacción** al comercio (en inglés): Created, Pending, Under Review, Authorized, In Dispute, Refunded, Rejected, Failed
- **3 estados de settlement** (en inglés): Pending, Ready to settle, Settled
- **1 entidad legal por cuenta** en MVP (casos multi-país se manejan vía cuentas independientes)

---

## Stack técnico

| Componente | Versión |
|---|---|
| Build tool | Vite v5 |
| Framework | React 18 + TypeScript |
| UI library | MUI v6.1.x |
| Estado | Zustand 5 (in-memory) |
| Routing | React Router 6 |
| Forms | react-hook-form + yup |
| Generador KYC | docx 9.6 + file-saver |
| Theme | Light, paleta verde brand `#7CFF45` |

---

## Cómo correr el proyecto local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # preview del build
```

---

## Estructura del repo

```
src/
├── components/       Componentes por dominio (home, onboarding, transactions, settlements, users, settings, layout, prelogin, common)
├── pages/            Páginas montadas en el routing
├── stores/           Stores de Zustand (auth, onboarding, ui, toast, account, users, profile, security, apiKeys, webhooks, notifications)
├── routes/           Guards de routing (ProtectedRoute, PublicRoute, OnboardingGuard, ReviewGuard)
├── constants/        Catálogos cerrados (países, monedas, métodos de pago, estados, industrias, documentos)
├── mocks/            Data mock de cada dominio
├── hooks/            useMerchantScope, useInactivityTimer
├── theme/            Tokens de diseño y theme de MUI
└── utils/kyc/        Generador de plantilla KYC en Word por país

docs/
└── validaciones/     Auditorías de validación de cada fase
```

---

## Brecha vs MVP productivo

El prototipo difiere intencionalmente del MVP productivo (release julio-agosto 2026) en stack: el productivo va sobre Next.js + monorepo Turborepo + BFF Go + cookies httpOnly + Redis + Zod. El prototipo cumple la función de **maqueta navegable de referencia** para alinear UX/UI y arquitectura base, no de producto final.

---

*Última actualización: 20 mayo 2026 — cierre de Fase 10*
