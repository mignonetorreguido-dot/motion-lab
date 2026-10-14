'use client';

/**
 * ========================================================================
 * COMPONENTE: Hub / Panel Principal de Entrenamiento del Alumno (components/training/StudentHub.js)
 * ========================================================================
 * - Muestra de forma dinámica el "Entrenamiento de Hoy" sugerido por Matías.
 *   Si el Día 1 ya fue finalizado, el sugerido avanza automáticamente al Día 2.
 * - Los días completados quedan marcados con tilde verde y botón de "✏️ Editar Día X".
 * - El alumno puede saltar a otro día o recuperar cualquier día que le haya faltado.
 */

import { 
  Calendar, Clock, ArrowRight, CheckCircle2, 
  RotateCcw, Sparkles, Flame, PlayCircle, Edit3, Trophy, ChevronRight 
} from 'lucide-react';

export default function StudentHub({ 
  planSemanal = [], 
  diaHoyId = 'dia-1', 
  onSeleccionarDia,
  onReiniciarProgreso = null
}) {
  // Encontrar el día sugerido para hoy: el primer día en secuencia que NO esté completado
  const primerNoCompletado = planSemanal.find((d) => d.estado !== 'COMPLETADO');
  
  // El día sugerido es diaHoyId (si no está completado), o el primer no completado
  const diaHoy = (planSemanal.find((d) => d.id === diaHoyId && d.estado !== 'COMPLETADO')) 
                 || primerNoCompletado 
                 || planSemanal[0];

  const todosCompletados = planSemanal.length > 0 && planSemanal.every((d) => d.estado === 'COMPLETADO');
  const diasCompletadosCount = planSemanal.filter((d) => d.estado === 'COMPLETADO').length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeIn font-sans">
      
      {/* SALUDO Y RESUMEN GENERAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0b1220] via-slate-900 to-[#070b14] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Motion Lab • Coach Matías</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Panel de Entrenamiento
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestiona tu semana, realiza la sesión sugerida o edita días finalizados.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Progreso Semanal</span>
            <span className="text-xs font-extrabold text-blue-400">
              {diasCompletadosCount} de {planSemanal.length} Días
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================
          TARJETA HERO: SUGERIDO PARA HOY (O SEMANA CUMPLIDA)
         ================================================================ */}
      {planSemanal.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1818] to-[#05070c] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            No tienes rutinas activas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Actualmente no tienes un plan de entrenamiento asignado. Por favor, contacta con tu entrenador Matías para que te asigne tus próximos días de entrenamiento.
          </p>
        </div>
      ) : todosCompletados ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-[#0a1818] to-[#05070c] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider w-max mb-4">
            <Trophy className="w-4 h-4 fill-current" />
            <span>¡Objetivo Semanal Cumplido!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            ¡Felicitaciones! Completaste todos los entrenamientos
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6">
            Has finalizado las {planSemanal.length} sesiones planificadas por Matías para esta semana. Puedes editar o revisar cualquiera de ellas abajo.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => onSeleccionarDia(planSemanal[0]?.id)}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Revisar Día 1</span>
            </button>
            {onReiniciarProgreso && (
              <button
                type="button"
                onClick={onReiniciarProgreso}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-bold transition-all"
              >
                Reiniciar semana de prueba
              </button>
            )}
          </div>
        </div>
      ) : diaHoy && (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-[#0c1424] to-[#05070c] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-blue-500/10 card-glow">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/30">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Sugerido para Hoy
            </span>

            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {diaHoy.duracionMin || 60} min aprox.
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            {diaHoy.nombre}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6">
            🎯 {diaHoy.enfoque}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Bloques</span>
              <span className="text-xs font-black text-white">3 (M • A • D)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Ejercicios</span>
              <span className="text-xs font-black text-sky-400">{diaHoy.ejerciciosCount || 8} Clave</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Intensidad</span>
              <span className="text-xs font-black text-cyan-300">RIR 1 - 2</span>
            </div>
          </div>

          {/* Botón Principal para entrar al entrenamiento sugerido de hoy */}
          <button
            type="button"
            onClick={() => onSeleccionarDia(diaHoy.id)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-black text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Comenzar Entrenamiento de Hoy</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ================================================================
          CRONOGRAMA SEMANAL (LISTA COMPLETA DE DÍAS)
         ================================================================ */}
      {planSemanal.length > 0 && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <span>Cronograma Semanal de Entrenamientos</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Puedes saltar al día que quieras, editar los días completados o recuperar los pendientes:
              </p>
            </div>
          </div>

        <div className="space-y-3">
          {planSemanal.map((dia) => {
            const isCompletado = dia.estado === 'COMPLETADO';
            const isSugeridoHoy = !todosCompletados && dia.id === diaHoy?.id;

            return (
              <div
                key={dia.id}
                className={`bg-[#0c1322] border rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSugeridoHoy 
                    ? 'border-blue-500/50 bg-blue-950/10' 
                    : isCompletado
                      ? 'border-emerald-500/30 bg-emerald-950/5'
                      : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Información del Día */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs border ${
                    isCompletado 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : isSugeridoHoy 
                        ? 'bg-blue-600 text-white border-blue-400' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {isCompletado ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span>D{dia.numeroDia}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-base font-black ${isCompletado ? 'text-white' : 'text-white'}`}>
                        {dia.nombre}
                      </h4>
                      
                      {isCompletado && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Finalizado
                        </span>
                      )}

                      {isCompletado && dia.esfuerzoFinal && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-sky-400 border border-blue-500/30">
                          RPE {dia.esfuerzoFinal}/10
                        </span>
                      )}

                      {isCompletado && dia.energiaInicial && (
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          🔋 {dia.energiaInicial}/5
                        </span>
                      )}

                      {isCompletado && dia.animoFinal && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {dia.animoFinal === 1 ? '📉 Peor' : dia.animoFinal === 2 ? '➖ Igual' : '📈 Renovado'}
                        </span>
                      )}

                      {isSugeridoHoy && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Sugerido Hoy
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {dia.enfoque}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {dia.duracionMin} min
                      </span>
                      <span>•</span>
                      <span>{dia.ejerciciosCount} ejercicios</span>
                      <span>•</span>
                      <span className="text-sky-400">3 Bloques</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Acción según el estado */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  {isCompletado ? (
                    // Si ya está completado: botón para EDITAR
                    <button
                      type="button"
                      onClick={() => onSeleccionarDia(dia.id)}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>✏️ Editar Día {dia.numeroDia}</span>
                    </button>
                  ) : isSugeridoHoy ? (
                    // Si es el sugerido para hoy
                    <button
                      type="button"
                      onClick={() => onSeleccionarDia(dia.id)}
                      className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95"
                    >
                      <span>Entrenar Hoy</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : dia.numeroDia < (diaHoy?.numeroDia || 99) ? (
                    // Día anterior que faltó hacer -> Recuperar
                    <button
                      type="button"
                      onClick={() => onSeleccionarDia(dia.id)}
                      className="py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Recuperar día que faltó</span>
                    </button>
                  ) : (
                    // Día posterior -> Saltar a este día
                    <button
                      type="button"
                      onClick={() => onSeleccionarDia(dia.id)}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-900/30 text-slate-300 hover:text-sky-400 border border-slate-800 hover:border-blue-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Saltar a este día</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
      )}

    </div>
  );
}
