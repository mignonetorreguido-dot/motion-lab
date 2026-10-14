# 🚀 Guía de Despliegue en Vercel - MOTION LAB

Esta aplicación Next.js 14 con Prisma ORM y Tailwind CSS está lista para desplegarse en **Vercel** en menos de 2 minutos.

---

## 📋 Pasos para Desplegar

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Subí el proyecto a un repositorio de GitHub:**
   - Creá un nuevo repositorio en [github.com/new](https://github.com/new) (ej. `motion-lab`).
   - Subí los archivos de este proyecto al repositorio.

2. **Importá el repositorio en Vercel:**
   - Entrá a [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
   - Hacé clic en **"Add New..."** > **"Project"**.
   - Seleccioná tu repositorio `motion-lab` y hacé clic en **"Import"**.

3. **Configurá las Variables de Entorno en Vercel:**
   Antes de hacer clic en Deploy, abrí la pestaña **"Environment Variables"** y agregá:

| Variable | Valor de Ejemplo / Descripción |
| :--- | :--- |
| `DATABASE_URL` | `mysql://usuario:password@host:3306/motion_lab` *(Podés crear una MySQL gratis en Railway, Aiven o PlanetScale)* |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` *(Tu URL generada por Vercel)* |
| `NEXTAUTH_SECRET` | Una clave secreta alfanumérica de 32+ caracteres |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | `5493624654911` *(WhatsApp del Coach Matías)* |
| `GOOGLE_CLIENT_ID` | *(Opcional)* Tu Client ID de Google Cloud |
| `GOOGLE_CLIENT_SECRET` | *(Opcional)* Tu Client Secret de Google Cloud |

> 💡 **Nota:** La aplicación cuenta con modo demo/fallback integrado. Incluso si la base de datos MySQL aún no está enlazada, la web compila y permite probar todas las pantallas interactivas, los modales de Check-in (Pre y Post) y el panel de administración.

4. **Hacé clic en "Deploy":**
   - Vercel ejecutará automáticamente `prisma generate && next build`.
   - En unos segundos tendrás tu URL pública lista (ej. `https://motion-lab.vercel.app`).

---

### Opción 2: Despliegue directo mediante Vercel CLI

Si tenés Node.js y la CLI de Vercel instalada en tu terminal:

```bash
# 1. Instalar Vercel CLI globalmente
npm i -g vercel

# 2. Iniciar sesión y desplegar
vercel

# 3. Para producción
vercel --prod
```

---

## ⚙️ Configuración Incluida (`vercel.json`)

El proyecto ya cuenta con el archivo [`vercel.json`](./vercel.json) configurado:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "prisma generate && next build"
}
```

---

## 🔑 Credenciales de Acceso Rápido para Pruebas

Una vez desplegada la aplicación en Vercel, podés probar:

* **Panel del Entrenador:** `/admin`
  * **Usuario:** `matiasMotionLab`
  * **Contraseña:** `laboratorio123`
  * *Aquí verás las alertas rojas y amarillas de fatiga, historial de check-ins y asignador de rutinas en 3 bloques.*

* **Área del Alumno:** `/entrenamiento`
  * *Aquí podrás probar el Check-in Pre-Entreno (nivel de energía 1-5, estado mental y descanso), el registro de series y el Check-out Post-Entreno con RPE y escala de impacto.*
