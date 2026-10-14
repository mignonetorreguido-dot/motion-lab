/**
 * ========================================================================
 * PÁGINA: Onboarding de Alumno (app/onboarding/page.js)
 * ========================================================================
 * Pantalla que aloja el formulario por pasos para el alta de nuevos alumnos
 * con la identidad visual de Motion Lab.
 */

import Wizard from '@/components/onboarding/Wizard';
import MotionLabLogo from '@/components/MotionLabLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Onboarding & Registro | MOTION LAB',
  description: 'Digitalización del proceso de alta, evaluación física y selección de plan de entrenamiento con Matías en Motion Lab.',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden hero-gradient">
      
      {/* CABECERA CON LOGO Y VOLVER */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <Link href="/" className="group">
          <MotionLabLogo className="group-hover:scale-105 transition-transform" />
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL: WIZARD */}
      <main className="flex-grow flex items-center justify-center py-4">
        <Wizard />
      </main>

      {/* PIE DISCRETO */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 text-xs text-slate-600">
        © {new Date().getFullYear()} MOTION LAB • Matías Personal Trainer • Todos los derechos reservados.
      </footer>

    </div>
  );
}
