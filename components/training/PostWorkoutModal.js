'use client';

/**
 * ========================================================================
 * COMPONENTE: Modal Post-Entrenamiento (components/training/PostWorkoutModal.js)
 * ========================================================================
 * - Check-out rápido de 1 clic al finalizar la sesión.
 * - Evalúa el impacto psicológico y la percepción del esfuerzo (RPE):
 *   1. Impacto anímico: 📉 Peor/Más cansado, ➖ Igual, 📈 Mucho mejor/Renovado
 *   2. RPE (1 al 10): Barra deslizable nativa con clase 'accent-blue-500'
 *   3. Desahogo mental: Sí totalmente, Un poco, No sigo a mil
 * - Diseño fresco con paletas blue & sky:
 *   - Fondo del modal con degradado 'bg-gradient-to-b from-white to-sky-50'
 *   - Tarjetas internas blancas con bordes celestes
 *   - Tipografía en 'text-blue-900' y 'text-blue-700'
 *   - Botón principal 'bg-blue-600' con sombra iluminada 'shadow-blue-500/30'
 *   - Botón secundario 'bg-sky-100' con texto azul oscuro
 *   - Input Range con clase 'accent-blue-500'
 *   - Emojis con 'hover:-translate-y-1' y efecto de escala/escala de grises
 */

import { useState } from 'react';
import { Trophy, Activity, Heart, X, CheckCircle, Sparkles } from 'lucide-react';

export default function PostWorkoutModal({
  isOpen = false,
  onClose,
  onSubmit,
  nombreRutina = 'Entrenamiento de Hoy',
  guardando = false,
}) {
  const [animoFinal, setAnimoFinal] = useState(3); // 1 = Peor, 2 = Igual, 3 = Mucho mejor
  const [rpe, setRpe] = useState(7); // Escala 1 al 10 (por defecto 7 = Duro / Exigente)
  const [desahogo, setDesahogo] = useState('Sí, totalmente'); // 'Sí, totalmente', 'Un poco', 'No, sigo a mil'

  if (!isOpen) return null;

  const opcionesAnimo = [
    { valor: 1, emoji: '📉', label: 'Peor / Más cansado', desc: 'Agotamiento alto' },
    { valor: 2, emoji: '➖', label: 'Igual que antes', desc: 'Sin gran cambio' },
    { valor: 3, emoji: '📈', label: 'Mucho mejor / Renovado', desc: 'Pura energía positiva' },
  ];

  const getRpeInfo = (valor) => {
    if (valor <= 2) return { label: 'Muy suave', desc: 'Paseo por el parque 🚶‍♂️', color: 'text-sky-600 bg-sky-100' };
    if (valor <= 4) return { label: 'Ligero / Cómodo', desc: 'Ritmo conversacional 🙂', color: 'text-cyan-700 bg-cyan-100' };
    if (valor <= 6) return { label: 'Moderado', desc: 'Buen estímulo, sin llegar al límite 💪', color: 'text-blue-700 bg-blue-100' };
    if (valor <= 8) return { label: 'Duro / Exigente', desc: 'Cerca del límite (RIR 1 - 2) 🔥', color: 'text-indigo-700 bg-indigo-100' };
    return { label: 'Máximo Esfuerzo', desc: 'No podía hacer ni una rep más ⚡', color: 'text-red-700 bg-red-100' };
  };

  const rpeActual = getRpeInfo(rpe);

  const opcionesDesahogo = [
    { id: 'Sí, totalmente', emoji: '🙌', label: 'Sí, totalmente' },
    { id: 'Un poco', emoji: '🧘‍♂️', label: 'Un poco' },
    { id: 'No, sigo a mil', emoji: '🤯', label: 'No, sigo a mil' },
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmit) {
      onSubmit({
        animoFinal,
        esfuerzoFinal: rpe,
        desahogoFinal: desahogo,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn font-sans">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-white to-sky-50 rounded-3xl border border-sky-200/80 shadow-2xl shadow-blue-900/20 p-6 sm:p-7 relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Botón cerrar / volver */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-blue-900 p-1.5 rounded-full hover:bg-sky-100/80 transition-colors"
          title="Volver a la rutina"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABECERA */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider mb-2 border border-blue-200">
            <Trophy className="w-3.5 h-3.5 text-blue-600 fill-current" />
            <span>Check-out Post-Entrenamiento</span>
          </div>

          <h2 className="text-2xl font-black text-blue-900 tracking-tight">
            ¡Misión Cumplida! 🎉
          </h2>

          <p className="text-xs sm:text-sm text-blue-700 mt-1">
            Contanos cómo te sentiste en 10 segundos para que Matías calibre el volumen de tu próxima sesión.
          </p>
        </div>

        {/* TARJETAS INTERNAS DE PREGUNTAS */}
        <div className="space-y-4">

          {/* TARJETA 1: IMPACTO ANÍMICO */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <span>¿Cómo te sentís ahora que terminaste?</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {opcionesAnimo.map((item) => {
                const seleccionado = animoFinal === item.valor;
                return (
                  <button
                    key={item.valor}
                    type="button"
                    onClick={() => setAnimoFinal(item.valor)}
                    className={`py-3 px-2 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 flex flex-col items-center justify-center gap-1.5 ${
                      seleccionado
                        ? 'scale-105 grayscale-0 opacity-100 border-2 border-blue-500 ring-2 ring-blue-200 bg-sky-50 shadow-md shadow-blue-500/20 text-blue-900 font-extrabold'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 bg-slate-50 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">{item.emoji}</span>
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARJETA 2: ESFUERZO PERCIBIDO (RPE - SLIDER) */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>¿Qué tan duro sentiste el entrenamiento?</span>
              </span>

              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${rpeActual.color}`}>
                RPE {rpe} / 10
              </span>
            </div>

            <div className="mb-3">
              <span className="text-xs font-bold text-blue-900 block">
                {rpeActual.label} • <span className="font-medium text-slate-500">{rpeActual.desc}</span>
              </span>
            </div>

            {/* INPUT RANGE NATIVO CON CLASE ACCENT-BLUE-500 */}
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rpe}
                onChange={(e) => setRpe(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-sky-100 rounded-lg cursor-pointer accent-blue-500 transition-all"
              />

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1">
                <span>1 (Paseo por el parque)</span>
                <span>5 (Medio)</span>
                <span>10 (Al fallo absoluto)</span>
              </div>
            </div>
          </div>

          {/* TARJETA 3: DESAHOGO MENTAL */}
          <div className="bg-white border border-sky-200/80 rounded-2xl p-4 sm:p-4.5 shadow-sm shadow-sky-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>¿El entrenamiento te ayudó a despejar la mente hoy?</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {opcionesDesahogo.map((item) => {
                const seleccionado = desahogo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDesahogo(item.id)}
                    className={`py-2 px-1.5 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 flex items-center justify-center gap-1.5 ${
                      seleccionado
                        ? 'scale-105 grayscale-0 opacity-100 border-2 border-blue-500 ring-2 ring-blue-200 bg-sky-50 shadow-md shadow-blue-500/20 text-blue-900 font-extrabold'
                        : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 bg-slate-50 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-lg leading-none">{item.emoji}</span>
                    <span className="text-xs font-bold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-blue-900 font-bold text-xs sm:text-sm transition-all text-center order-2 sm:order-1"
          >
            Volver a la rutina
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={guardando}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-60"
          >
            {guardando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando sesión...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar y Guardar Sesión</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
