import './globals.css';

/**
 * ========================================================================
 * ARCHIVO DE DISEÑO RAÍZ (app/layout.js) - MOTION LAB
 * ========================================================================
 * Configuración de etiquetas globales y metadatos SEO para MOTION LAB.
 */

export const metadata = {
  title: 'MOTION LAB | High Performance Training & Planificación Personalizada',
  description: 'Laboratorio de movimiento y rendimiento atlético. Planes de entrenamiento con base científica: Plan Base y Plan Premium Personalizado 1 a 1.',
  keywords: ['MOTION LAB', 'entrenamiento de alto rendimiento', 'personal trainer', 'planificación de fuerza', 'biomecánica', 'hipertrofia'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-[#05070c] text-slate-100 antialiased min-h-screen selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
