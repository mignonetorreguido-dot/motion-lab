/**
 * ========================================================================
 * PÁGINA: Dashboard del Entrenador Matías (app/admin/page.js)
 * ========================================================================
 * Acceso al panel administrativo para validar pagos de alumnos y
 * asignar rutinas en los 3 bloques metodológicos de Motion Lab.
 */

import DashboardTrainer from '@/components/admin/DashboardTrainer';
import MotionLabLogo from '@/components/MotionLabLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Panel del Entrenador • Matías | MOTION LAB',
  description: 'Gestión de alumnos, validación de pagos y asignación de rutinas en 3 bloques.',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      
      {/* CABECERA SUPERIOR */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-8 border-b border-slate-800/80 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Web Principal</span>
        </Link>

        <Link href="/" className="group">
          <MotionLabLogo className="group-hover:scale-105 transition-transform" />
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow max-w-7xl mx-auto w-full">
        <DashboardTrainer />
      </main>

      {/* PIE DISCRETO */}
      <footer className="max-w-7xl mx-auto w-full text-center pt-12 text-xs text-slate-600">
        © {new Date().getFullYear()} MOTION LAB • Panel de Administración para Matías.
      </footer>

    </div>
  );
}
