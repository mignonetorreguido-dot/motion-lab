'use client';

/**
 * ========================================================================
 * COMPONENTE: Modal Pre-Entrenamiento (components/training/PreWorkoutModal.js)
 * ========================================================================
 * - Check-in rápido de 1 clic antes de arrancar la rutina.
 * - Preguntas cortas y directas:
 *   1. Nivel de energía (1 a 5 con batería)
 *   2. Estado de ánimo / estrés (Emojis interactivos)
 *   3. Descanso anoche (Mal, Regular, Bien, Excelente)
 * - Diseño fresco con paleta blue & sky:
 *   - Contenedor con degradado 'bg-gradient-to-b from-white to-sky-50'
 *   - Preguntas separadas en tarjetas blancas con bordes celestes
 *   - Textos importantes en 'text-blue-900' y 'text-blue-700'
 *   - Botón principal vibrante 'bg-blue-600' con sombra iluminada 'shadow-blue-500/30'
 *   - Botón secundario en 'bg-sky-100' con texto azul oscuro
 *   - Emojis con elevación 'hover:-translate-y-1', escala de grises y opacidad reducida cuando no están seleccionados
 */

import { useState } from 'react';
import { BatteryCharging, Sparkles, X, ArrowRight, Zap, Info } from 'lucide-react';

export default function PreWorkoutModal({
  isOpen = false,
  onClose,
  onSubmit,
  nombreRutina = 'Rutina de Hoy',
}) {
  const [energia, setEnergia] = useState(3); // 1 a 5 (por defecto 3 = Normal)
  const [animo, setAnimo] = useState(4); // 1 a 5 (por defecto 4 = 🙂 Bien)
  const [descanso, setDescanso] = useState('Bien'); // Mal, Regular, Bien, Excelente

  if (!isOpen) return null;

  const nivelesEnergia = [
    { valor: 1, label: 'Agotado/a', icon: '🪫', desc: 'Batería baja' },
    { valor: 2, label: 'Bajo', icon: '🔋', desc: 'Poco resto' },
    { valor: 3, label: 'Normal', icon: '🔋', desc: 'Equilibrado' },
    { valor: 4, label: 'Con ganas', icon: '⚡', desc: 'Buena vibra' },
    { valor: 5, label: 'A tope', icon: '🔥', desc: '100% energía' },
  ];

  const nivelesAnimo = [
    { valor: 1, emoji: '😫', label: 'Muy estresado' },
    { valor: 2, emoji: '🙁', label: 'Desmotivado' },
    { valor: 3, emoji: '😐', label: 'Neutral' },
    { valor: 4, emoji: '🙂', label: 'Bien' },
    { valor: 5, emoji: '🤩', label: 'Excelente' },
  ];

  const nivelesDescanso = [
    { id: 'Mal', emoji: '😴', label: 'Mal' },
    { id: 'Regular', emoji: '🥱', label: 'Regular' },
    { id: 'Bien', emoji: '😊', label: 'Bien' },
    { id: 'Excelente', emoji: '🌟', label: 'Excelente' },
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmit) {
      onSubmit({
        energiaInicial: energia,
        animoInicial: animo,
        descansoInicial: descanso,
      });
    }
    if (onClose) onClose();
  };

  const handleSkip = () => {
    if (onSubmit) {
      onSubmit({
        energiaInicial: 3,
        animoInicial: 3,
        descansoInicial: 'Regular',
        omitido: true,
      });
    }
    if (onClose) onClose();
  };

  // Alerta preventiva si el alumno reporta fatiga extrema o estrés alto
  const esFatigaOEstres = energia <= 1 || animo <= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn font-sans">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-white to-sky-50 rounded-3xl border border-sky-200/80 shadow-2xl shadow-blue-900/20 p-6 sm:p-7 relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Botón cerrar / saltar */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-5 text-slate-400 hover:text-blue-900 p-1.5 rounded-full hover:bg-sky-100/80 transition-colors"
          title="Cerrar u omitir"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABECERA */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider mb-2 border border-blue-200">
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
            <span>Check-in Pre-Entrenamiento</span>
          </div>

          <h2 className="text-2xl font-black text-blue-900 tracking-tight">
            ¿Cómo arrancamos hoy?
          </h2>

          <p className="text-xs sm:text-sm text-blue-700 mt-1">
            Solo te tomará un clic. Así Matías sabe si hoy conviene apretar el acelerador o tomárselo con calma.
          </p>
        </div>

        {/* TARJETAS INTERNAS DE PREGUNTAS */}
        <div className="space-y-4">
          
          {/* TARJETA 1: ENERGÍA */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-blue-600" />
                <span>¿Cómo viene tu nivel de energía hoy?</span>
              </span>
              <span className="text-[11px] font-black text-blue-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                {nivelesEnergia.find((n) => n.valor === energia)?.label}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {nivelesEnergia.map((item) => {
                const seleccionado = energia === item.valor;
                return (
                  <button
                    key={item.valor}
                    type="button"
                    onClick={() => setEnergia(item.valor)}
                    className={`py-2.5 px-1 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 flex flex-col items-center justify-center gap-1 ${
                      seleccionado
                        ? 'scale-105 grayscale-0 opacity-100 border-2 border-blue-500 ring-2 ring-blue-200 bg-sky-50 shadow-md shadow-blue-500/20 text-blue-900 font-extrabold'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 bg-slate-50 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl leading-none">{item.icon}</span>
                    <span className="text-[11px] font-bold block">{item.valor}</span>
                    <span className="text-[9px] font-semibold leading-tight hidden sm:block truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARJETA 2: ÁNIMO / ESTRÉS */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>¿Cómo te sentís mentalmente para arrancar?</span>
              </span>
              <span className="text-[11px] font-black text-blue-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                {nivelesAnimo.find((n) => n.valor === animo)?.label}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {nivelesAnimo.map((item) => {
                const seleccionado = animo === item.valor;
                return (
                  <button
                    key={item.valor}
                    type="button"
                    onClick={() => setAnimo(item.valor)}
                    className={`py-2.5 px-1 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 flex flex-col items-center justify-center gap-1 ${
                      seleccionado
                        ? 'scale-105 grayscale-0 opacity-100 border-2 border-blue-500 ring-2 ring-blue-200 bg-sky-50 shadow-md shadow-blue-500/20 text-blue-900 font-extrabold'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 bg-slate-50 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl leading-none">{item.emoji}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold mt-1 text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARJETA 3: DESCANSO */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900">
                ¿Cómo descansaste anoche?
              </span>
              <span className="text-[11px] font-bold text-sky-700">
                Opcional pero clave
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {nivelesDescanso.map((item) => {
                const seleccionado = descanso === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDescanso(item.id)}
                    className={`py-2 px-2 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 flex items-center justify-center gap-1.5 ${
                      seleccionado
                        ? 'scale-105 grayscale-0 opacity-100 border-2 border-blue-500 ring-2 ring-blue-200 bg-sky-50 shadow-md shadow-blue-500/20 text-blue-900 font-extrabold'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 bg-slate-50 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-lg leading-none">{item.emoji}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ALERTA INTELIGENTE DEL COACH SI REPORTA FATIGA O ESTRÉS */}
        {esFatigaOEstres && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-black text-amber-950 block">Nota del Coach Matías:</strong>
              <span>
                Hoy el cuerpo o la cabeza te piden tregua. Ajustá las cargas, descansá más entre series y priorizá la técnica. ¡A disfrutar el movimiento sin castigarte!
              </span>
            </div>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-blue-900 font-bold text-xs sm:text-sm transition-all text-center order-2 sm:order-1"
          >
            Omitir por hoy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <span>¡Comenzar Rutina!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
