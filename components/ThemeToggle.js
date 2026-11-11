'use client';

/**
 * ========================================================================
 * COMPONENTE: Toggle Modo Soleado / Modo Noche (components/ThemeToggle.js)
 * ========================================================================
 * Botón reutilizable para cambiar entre el modo noche y el modo soleado
 * de alto contraste. Disponible en todos los apartados de la aplicación:
 * landing, entrenamiento, onboarding, login y panel del entrenador.
 *
 * Variantes:
 * - 'pill': botón completo con texto (ideal para cabeceras de escritorio).
 * - 'icon': solo el ícono ☀️/🌙 (ideal para espacios reducidos).
 */

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ variant = 'pill', className = '' }) {
  const { isSunlight, toggleSunlight } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleSunlight}
        type="button"
        aria-label={isSunlight ? 'Cambiar a modo noche' : 'Cambiar a modo soleado'}
        title={isSunlight ? 'Cambiar a modo noche' : 'Cambiar a modo soleado (alto contraste para exterior)'}
        className={`inline-flex items-center justify-center p-2.5 rounded-xl border transition-all touch-target ${
          isSunlight
            ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
        } ${className}`}
      >
        {isSunlight ? (
          <Moon className="w-5 h-5 text-slate-800 fill-slate-800" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleSunlight}
      type="button"
      title={isSunlight ? 'Cambiar a modo noche' : 'Cambiar a modo soleado (alto contraste para exterior)'}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-full transition-all border ${
        isSunlight
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-sm'
          : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/30 shadow-inner'
      } ${className}`}
    >
      {isSunlight ? (
        <>
          <Moon className="w-4 h-4 text-slate-800 fill-slate-800" />
          <span>Modo Noche</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Modo Soleado</span>
        </>
      )}
    </button>
  );
}
