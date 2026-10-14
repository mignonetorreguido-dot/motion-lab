'use client';

/**
 * ========================================================================
 * COMPONENTE: Barra de Navegación MOTION LAB (Navbar.js)
 * ========================================================================
 * Barra de menú superior fija con efecto translúcido (backdrop-blur),
 * logotipo oficial y accesos directos al Onboarding, a la Planilla de Entrenamiento
 * y al Panel del Entrenador Matías.
 */

import { useState } from 'react';
import { Menu, X, Flame, Dumbbell, ShieldAlert, UserPlus, ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import MotionLabLogo from './MotionLabLogo';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#05070c]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGOTIPO OFICIAL DE MOTION LAB */}
          <Link href="/" className="flex items-center group">
            <MotionLabLogo className="group-hover:scale-105 transition-transform" />
          </Link>

          {/* ENLACES DE NAVEGACIÓN EN ESCRITORIO */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/onboarding" className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-bold">
              <UserPlus className="w-4 h-4" />
              Onboarding Alumno
            </Link>
            <Link href="/entrenamiento" className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              Mi Entrenamiento
            </Link>
            <Link href="/admin" className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Panel Matías
            </Link>
            <a href="/#planes" className="text-slate-300 hover:text-sky-400 transition-colors">
              Planes
            </a>
            <a href="/#faq" className="text-slate-300 hover:text-sky-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* BOTÓN CALL TO ACTION (AZUL ELÉCTRICO) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-bold transition-colors flex items-center gap-1"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/#planes"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-full transition-all shadow-lg shadow-blue-500/25 hover:scale-105"
            >
              <span>Ver Planes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
              aria-label="Abrir menú"
            >
              {menuAbierto ? <X className="w-7 h-7 text-sky-400" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <Link
            href="/login"
            onClick={() => setMenuAbierto(false)}
            className="block text-base font-bold text-sky-400 py-2 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Iniciar Sesión</span>
          </Link>
          <Link
            href="/entrenamiento"
            onClick={() => setMenuAbierto(false)}
            className="block text-base font-medium text-slate-200 hover:text-sky-400 py-2 flex items-center gap-2"
          >
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            <span>Mi Planilla de Entrenamiento</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setMenuAbierto(false)}
            className="block text-base font-medium text-slate-200 hover:text-sky-400 py-2 flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Panel del Entrenador (Matías)</span>
          </Link>
          <a
            href="/#planes"
            onClick={() => setMenuAbierto(false)}
            className="block text-base font-medium text-slate-300 hover:text-sky-400 py-2"
          >
            Planes y Membresías
          </a>
          <div className="pt-2">
            <Link
              href="/#planes"
              onClick={() => setMenuAbierto(false)}
              className="w-full block text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl"
            >
              Ver Planes
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
