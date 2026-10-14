# 🏋️‍♂️ Plataforma Web para Personal Trainer

¡Bienvenido/a al proyecto! Esta es una aplicación web moderna, atlética y completa creada especialmente para un **Entrenador Personal (Personal Trainer)**. Permite a los futuros alumnos responder un **cuestionario inicial de evaluación física** para diagnosticar su nivel y necesidades, y presenta una comparativa clara entre el **Plan Base** y el **Plan Premium Personalizado**.

El proyecto está construido con:
- **Next.js 14** (Framework moderno de React para aplicaciones web rápidas y optimizadas para Google)
- **React 18** (Biblioteca para crear interfaces interactivas mediante componentes)
- **JavaScript estándar** (Sin TypeScript, con código limpio y comentarios línea por línea para facilitar el aprendizaje)
- **Tailwind CSS** (Diseño moderno, modo oscuro atlético y totalmente responsive para teléfonos y PC)
- **MySQL** (Base de datos relacional para registrar prospectos, alumnos y respuestas del cuestionario)
- **Vercel** (Plataforma recomendada para publicar tu web en internet con un clic y de forma gratuita)

---

## 📂 Estructura del Proyecto Explicada

```text
├── app/
│   ├── api/
│   │   ├── cuestionario/
│   │   │   └── route.js      -> Backend: Recibe los datos del cuestionario y los guarda en MySQL
│   │   └── planes/
│   │       └── route.js      -> Backend: Devuelve la lista y precios de los planes
│   ├── globals.css           -> Estilos globales y temas deportivos de Tailwind
│   ├── layout.js             -> Estructura común (HTML, fuentes, metadatos para Google SEO)
│   └── page.js               -> Página principal donde se unen todas las secciones
├── components/
│   ├── Navbar.js             -> Barra de navegación fija con menú móvil
│   ├── Hero.js               -> Portada impactante con llamadas a la acción
│   ├── AboutTrainer.js       -> Presentación del entrenador, certificaciones y método
│   ├── FitnessQuiz.js        -> Cuestionario interactivo paso a paso con diagnóstico
│   ├── PricingSection.js     -> Comparación de Plan Base vs Plan Premium Personalizado
│   ├── TestimonialsAndFaq.js -> Casos de éxito y acordeón de preguntas frecuentes
│   ├── Footer.js             -> Pie de página con redes sociales y aviso de salud
│   └── WhatsAppButton.js     -> Botón flotante siempre visible para chatear
├── database/
│   └── schema.sql            -> Script SQL listo para crear las tablas en tu MySQL
├── lib/
│   └── db.js                 -> Conexión reutilizable a MySQL (Connection Pool)
├── .env.example              -> Plantilla con las variables de configuración
├── .env.local                -> Tus contraseñas y configuración local (no se sube a internet)
├── package.json              -> Lista de herramientas instaladas en el proyecto
└── tailwind.config.js        -> Configuración de colores y estilos visuales
```

---

## 🚀 Cómo Ejecutar el Proyecto en tu Computadora

### 1. Requisitos previos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 2. Iniciar el servidor de desarrollo
Abre tu terminal (PowerShell o Command Prompt) en esta carpeta y escribe:

```bash
npm run dev
```

Abre tu navegador y entra a:
👉 **[http://localhost:3000](http://localhost:3000)**

¡Ya verás tu página web funcionando en vivo!

---

## 🗄️ Cómo Configurar la Base de Datos MySQL

### Opción A: En tu computadora con XAMPP (Local)
1. Abre **XAMPP** y activa el botón **Start** en el módulo **MySQL**.
2. Entra en tu navegador a: `http://localhost/phpmyadmin`
3. Haz clic en la pestaña superior llamada **SQL**.
4. Abre el archivo `database/schema.sql` de este proyecto, copia todo su contenido y pégalo allí.
5. Presiona el botón **Continuar** (o *Go*). ¡Listo! Se creará la base de datos `personal_trainer_db` con sus 3 tablas (`planes`, `alumnos`, `evaluaciones`).
6. Verifica que en tu archivo `.env.local` tengas:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=personal_trainer_db
   ```

### Opción B: En la Nube (Gratis y lista para Vercel)
Si no quieres instalar nada en tu computadora, puedes crear una base de datos MySQL gratuita en la nube con servicios como:
- [Aiven](https://aiven.io/) (MySQL gratis)
- [Railway](https://railway.app/)
- [TiDB Cloud](https://tidbcloud.com/) (MySQL Serverless)

Solo copias las credenciales que te den y las pegas en tu archivo `.env.local`.

> **Nota:** La aplicación incluye un modo inteligente de tolerancia a fallos. Si aún no has conectado MySQL, la web funcionará igual y te permitirá probar el cuestionario sin romperse.

---

## 🧠 Conceptos Clave de Programación Explicados para Principiantes

### 1. ¿Qué es un Componente en React?
Un componente es como un bloque de Lego. En vez de escribir 1000 líneas en un solo archivo HTML, dividimos la web en piezas pequeñas y reutilizables: `Navbar`, `Hero`, `FitnessQuiz`, etc. Cada archivo exporta una función que devuelve código visual (JSX).

### 2. ¿Para qué sirve `'use client'`?
En Next.js existen dos tipos de componentes:
- **Server Components:** Se procesan en el servidor y envían solo HTML limpio al navegador. Son súper rápidos y seguros para SEO.
- **Client Components (con `'use client'`):** Necesarios cuando el usuario interactúa con la pantalla (por ejemplo, hacer clic en botones, escribir en inputs de texto o abrir menús).

### 3. ¿Qué es el Hook `useState`?
En JavaScript normal, si una variable cambia, la pantalla no se actualiza automáticamente. `useState` es la forma en que React "recuerda" datos y vuelve a pintar la pantalla cuando cambian:
```javascript
// 'pasoActual' es el valor actual (ej: 1)
// 'setPasoActual' es la función que usamos para cambiarlo a 2, 3, etc.
const [pasoActual, setPasoActual] = useState(1);
```

### 4. ¿Cómo viajan los datos al Backend?
Cuando el alumno presiona "Ver mi Diagnóstico":
1. El archivo `FitnessQuiz.js` junta las respuestas y hace una petición con `fetch('/api/cuestionario', { method: 'POST', body: ... })`.
2. El archivo `app/api/cuestionario/route.js` recibe la información en el servidor.
3. El archivo `lib/db.js` ejecuta la sentencia SQL `INSERT INTO alumnos (...)` para guardar los datos en MySQL.
4. El servidor responde con `{ success: true }` y la pantalla le muestra el plan recomendado y el botón de WhatsApp.

---

## 🎨 Cómo Personalizar la Web con tus Datos

1. **Tu número de WhatsApp:**
   - Abre `components/FitnessQuiz.js`, `components/PricingSection.js`, `components/Footer.js` y `.env.local`.
   - El número configurado para Matías es `'5493624654911'` (+54 9 362 465-4911). Puedes modificarlo en `.env.local` si cambia en el futuro.
2. **Nombre del Entrenador:**
   - Coach Matías (Motion Lab). Puedes personalizar su biografía y certificaciones en `components/AboutTrainer.js`.
3. **Precios de los Planes:**
   - Abre `components/PricingSection.js` y cambia `$29.99` o `$69.99` por la moneda y valor que prefieras.

---

## ☁️ Cómo Desplegar en Vercel (Poner tu Web en Internet)

1. Sube este proyecto a tu cuenta de **GitHub**.
2. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New Project"** y selecciona tu repositorio.
4. En la sección **Environment Variables**, agrega las variables de tu archivo `.env.example` (tus datos de conexión a MySQL y teléfono).
5. Haz clic en **Deploy**. ¡En menos de 2 minutos tu web estará activa con un enlace HTTPS público gratuito!
