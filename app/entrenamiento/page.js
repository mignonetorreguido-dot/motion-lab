/**
 * ========================================================================
 * PÁGINA: Entrenamiento del Alumno (app/entrenamiento/page.js)
 * ========================================================================
 * Pantalla interactiva donde el alumno:
 * 1. Accede a su Hub con el entrenamiento de hoy y cronograma semanal.
 * 2. Puede saltar de día o recuperar días pendientes de la semana.
 * 3. Registra series interactivas con auto-minimización y notas técnicas.
 */

import TrainingContainer from '@/components/training/TrainingContainer';
import MotionLabLogo from '@/components/MotionLabLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Mi Entrenamiento • Plan Semanal | MOTION LAB',
  description: 'Seguimiento interactivo de series, cronograma semanal y observaciones de entrenamiento.',
};

export default function EntrenamientoPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden hero-gradient">
      
      {/* CABECERA */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <Link href="/" className="group">
          <MotionLabLogo className="group-hover:scale-105 transition-transform" />
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow max-w-4xl mx-auto w-full">
        <TrainingContainer />
      </main>

      {/* PIE */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-12 text-xs text-slate-600">
        © {new Date().getFullYear()} MOTION LAB • Planificación Semanal y Planilla Digital de Entrenamiento.
      </footer>

    </div>
  );
}
