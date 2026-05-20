# Fase 10 — Aplicar cambios + Deploy a Vercel

Todos los cambios de Fase 10 ya están commiteados localmente acá. Vos tenés que aplicarlos en tu Windows y deployar.

---

## Resumen de lo que hice

3 commits sobre el HEAD `5907771`:

| Commit | Tipo | Archivos |
|---|---|---|
| `feat(wizard): restaurar Step 6 'Enviar para revisión' numerado en el stepper` | Fix | 2 archivos del onboarding |
| `feat(notifications): mover Canales de notificación al sidebar como módulo independiente` | UX | 5 archivos (App, Sidebar, AvatarMenu, NotificationChannelsPage, DevelopersPage) |
| `docs: README de entrega Fase 10 + auditoría Validación Total Fase 9` | Docs | `README.md` (raíz) + `docs/validaciones/Validacion_Total_Fase9.md` |

**Build verificado**: `npx tsc --noEmit` limpio + `npm run build` pasa exitoso. Mismo bundle de antes (~1.62 MB, 485 kB gzip).

---

## Paso 1 — Aplicar los patches en tu Windows

Los 3 patches están adjuntos:
- `0001-feat-wizard-restaurar-Step-6-Enviar-para-revisi-n-nu.patch`
- `0002-feat-notifications-mover-Canales-de-notificaci-n-al-.patch`
- `0003-docs-README-de-entrega-Fase-10-auditor-a-Validaci-n-.patch`

En tu PowerShell:

```powershell
cd C:\Users\javie\proyecto-merchant-portal\psp-merchant-portal-prototype

# Verificá que estás en main, sin cambios pendientes y en HEAD 5907771
git status
git log --oneline -1

# Copiá los 3 .patch a la raíz del repo (o pasalos por path absoluto)
# Después aplicalos en orden:
git am 0001-feat-wizard-restaurar-Step-6-Enviar-para-revisi-n-nu.patch
git am 0002-feat-notifications-mover-Canales-de-notificaci-n-al-.patch
git am 0003-docs-README-de-entrega-Fase-10-auditor-a-Validaci-n-.patch

# Verificá que se aplicaron bien
git log --oneline -4
```

Si `git am` da problemas por finales de línea Windows, usá:
```powershell
git am --keep-cr 0001-...
```

Alternativa más simple si `git am` te da dolor de cabeza:
```powershell
git apply 0001-...
git apply 0002-...
git apply 0003-...
# Y después commiteás vos a mano con los mensajes que querás
```

---

## Paso 2 — Validar localmente

```powershell
npm run build
# Tiene que pasar limpio. Si hay error, avisame.

npm run preview
# Abrí http://localhost:4173 y validá:
#  - Sidebar tiene "Canales de notificación" entre Users y Página 404
#  - AvatarMenu ya NO tiene "Notificaciones"
#  - El Wizard muestra Paso 6 numerado al llegar a /onboarding/step-6
```

---

## Paso 3 — Push a GitHub

```powershell
git push origin main
```

---

## Paso 4 — Deploy a Vercel

1. Entrá a https://vercel.com y hacé signup/login con tu cuenta GitHub.
2. Click **"Add New Project"** → **"Import"**.
3. Buscá el repo `psp-merchant-portal-prototype` y click **"Import"**.
4. Vercel detecta Vite automáticamente. Defaults correctos:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**.
6. En ~2 minutos te entrega una URL del tipo `https://psp-merchant-portal-prototype-XXX.vercel.app`.

Cualquier `git push` posterior a `main` redespliega automáticamente.

---

## Paso 5 — Actualizar el README con la URL pública

Cuando tengas la URL final, editá `README.md` en la raíz, reemplazá:
```
> *(Pendiente de deploy a Vercel)*
```
por
```
https://psp-merchant-portal-prototype.vercel.app
```
Commit + push, y Vercel redespliega solo.

---

## Paso 6 — Compartir el link

Mandale la URL al equipo (UX Head, UX/UI Designer, Head Product, Frontend Lead, Tech Lead). Las credenciales mock están en el README.

---

## Pendientes que NO entran en Fase 10 (futuras corridas opcionales)

| Item | Por qué se difirió |
|---|---|
| Limpiar `DevelopersPage` y `ApiKeysList` 100% | Código muerto inocuo; ya no aparece en navegación. Limpieza de housekeeping. |
| Persistencia `sessionStorage` del authStore | Mejora UX al navegar por URL directa. No bloquea la demo. |
| Rutas `/_demo-500` y `/_demo-403` dedicadas | Ya existen `/500` y `/403`; cambio cosmético de naming. |
| Validación visual manual de Wizard + Sign Up + 500/403 | Vos lo hacés en 5-10 minutos antes/después del deploy. |
| Resolver tensión chips MX/CO/BR en Steps 2/3/4 (Corrida 8) | Decisión pendiente con el equipo técnico. NO bloquea deploy. |

---

*Generado al cierre de Fase 10 — 20 mayo 2026.*
