'use client';

/**
 * ========================================================================
 * COMPONENTE: Tarjeta de Ejercicio de Desarrollo (components/training/ExerciseCard.js)
 * ========================================================================
 * - Soporta Auto-Minimización al completar todas las series.
 * - Vista compacta / minimizada con resumen de series y cargas levantadas.
 * - Modo edición para modificar series ya completadas o agregar notas.
 * - Steppers [-] [+] para Reps y Kilos, selectores RIR y slider RPE.
 * - Sincroniza en tiempo real con el componente padre WorkoutView.
 */

import { useState, useEffect } from 'react';
import { 
  Check, MessageSquare, ChevronDown, ChevronUp, Save, 
  Minus, Plus, Edit3 
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';

export default function ExerciseCard({ ejercicio, onUpdateEjercicio }) {
  const [series, setSeries] = useState(ejercicio.series || []);
  const [videoAbierto, setVideoAbierto] = useState(false);
  const [mostrarObservacion, setMostrarObservacion] = useState(
    Boolean(ejercicio.observacion && ejercicio.observacion.trim().length > 0)
  );
  const [observacion, setObservacion] = useState(ejercicio.observacion || '');
  const [guardandoObs, setGuardandoObs] = useState(false);
  const [obsGuardadaExito, setObsGuardadaExito] = useState(false);

  // Serie específica que el usuario eligió re-editar manualmente
  const [serieEnEdicionId, setSerieEnEdicionId] = useState(null);

  // Comprobar si todas las series del ejercicio están completadas
  const todasCompletadas = series.length > 0 && series.every((s) => s.completado);

  // Estado de minimizado: si ya vino completado, inicia minimizado
  const [minimizado, setMinimizado] = useState(todasCompletadas);

  // Actualizar si el ejercicio cambia externamente
  useEffect(() => {
    if (ejercicio.series) {
      setSeries(ejercicio.series);
      const allDone = ejercicio.series.length > 0 && ejercicio.series.every((s) => s.completado);
      if (allDone) {
        setMinimizado(true);
      }
    }
    if (ejercicio.observacion !== undefined) {
      setObservacion(ejercicio.observacion || '');
    }
  }, [ejercicio]);

  // Índice de la serie activa (la primera no completada)
  const serieActivaIndex = series.findIndex((s) => !s.completado);

  // Actualizar datos de una serie localmente y notificar al padre
  const actualizarSerieLocal = (serieId, campo, valor) => {
    const seriesActualizadas = series.map((s) => {
      if (s.id === serieId) {
        return { ...s, [campo]: valor };
      }
      return s;
    });
    setSeries(seriesActualizadas);

    if (onUpdateEjercicio) {
      onUpdateEjercicio(ejercicio.id, { series: seriesActualizadas });
    }
  };

  // Guardar y completar la serie activa
  const guardarSerieActiva = async (serie) => {
    // 1. Marcar como completada
    const seriesActualizadas = series.map((s) => {
      if (s.id === serie.id) {
        return { ...s, completado: true };
      }
      return s;
    });
    setSeries(seriesActualizadas);

    // Si estábamos re-editando una serie completada, cerramos su modo edición
    if (serieEnEdicionId === serie.id) {
      setSerieEnEdicionId(null);
    }

    // Notificar inmediatamente al componente padre (WorkoutView)
    if (onUpdateEjercicio) {
      onUpdateEjercicio(ejercicio.id, { series: seriesActualizadas });
    }

    // 2. Verificar si con esta serie se completaron TODAS
    const ahoraTodasCompletadas = seriesActualizadas.every((s) => s.completado);
    if (ahoraTodasCompletadas) {
      // Auto-minimizar con una pequeña pausa para que el alumno perciba la confirmación
      setTimeout(() => {
        setMinimizado(true);
      }, 400);
    }

    // 3. Persistir en backend (asíncrono)
    try {
      await fetch('/api/entrenamiento/serie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serieId: serie.id, 
          completado: true,
          repsRealizadas: serie.repsRealizadas,
          cargaKg: serie.cargaKg,
          rir: serie.rir,
          rpe: serie.rpe
        }),
      });
    } catch (err) {
      console.error('Error guardando serie:', err);
    }
  };

  // Guardar observación técnica
  const guardarObservacion = async () => {
    setGuardandoObs(true);
    setObsGuardadaExito(false);
    try {
      const res = await fetch(`/api/entrenamiento/ejercicio/${ejercicio.id}/observacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observacion }),
      });
      const data = await res.json();
      if (data.success) {
        setObsGuardadaExito(true);
        setTimeout(() => setObsGuardadaExito(false), 2500);
        if (onUpdateEjercicio) onUpdateEjercicio(ejercicio.id, { observacion });
      }
    } catch (err) {
      console.error('Error al guardar observación:', err);
    } finally {
      setGuardandoObs(false);
    }
  };

  // ========================================================================
  // 1. VISTA MINIMIZADA (Cuando el ejercicio está completado)
  // ========================================================================
  if (minimizado && todasCompletadas) {
    const cargasResumen = series.map((s) => `${s.cargaKg || 0}kg`).join(' • ');
    return (
      <div 
        onClick={() => setMinimizado(false)}
        className="group bg-[#0c1322] hover:bg-[#0f172a] border border-emerald-500/30 hover:border-emerald-400/50 rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-500/5 transition-all cursor-pointer flex items-center justify-between gap-4 mb-4"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-black text-white truncate">
                {ejercicio.nombre}
              </h4>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ✓ Completado
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
              <span>{series.length}/{series.length} series listas</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-semibold">{cargasResumen}</span>
              {observacion && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-sky-400 text-[11px] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Con nota
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Botón para editar / expandir */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMinimizado(false);
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-400 text-xs font-bold transition-all shadow-sm group-hover:scale-105"
        >
          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
          <span>Editar</span>
        </button>
      </div>
    );
  }

  // ========================================================================
  // 2. VISTA EXPANDIDA (En progreso o en modo edición)
  // ========================================================================
  return (
    <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 shadow-2xl mb-6 relative">
      
      {/* Botón flotante para minimizar si ya está completado */}
      {todasCompletadas && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setMinimizado(true)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Minimizar ejercicio</span>
          </button>
        </div>
      )}

      {/* Título y objetivo de Matías */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xl font-black text-white">{ejercicio.nombre}</h4>
          <div className="flex items-center gap-2">
            {ejercicio.videoUrl && !videoAbierto && (
  <button
    type="button"
    onClick={() => setVideoAbierto(true)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors border border-red-500/20"
  >
    ▶ Reproducir Video
  </button>
)}
            {todasCompletadas && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Completado
              </span>
            )}
          </div>
        </div>

        {ejercicio.videoUrl && videoAbierto && (
          <div className="mt-4">
            <VideoPlayer videoUrl={ejercicio.videoUrl} onClose={() => setVideoAbierto(false)} />
          </div>
        )}

        {ejercicio.indicacionProfe && (
          <p className="text-sm font-semibold text-sky-400 mt-2 flex items-start gap-2 bg-blue-900/20 p-3 rounded-xl border border-blue-500/20">
            <span className="shrink-0">🎯</span>
            <span>Objetivo de Matías: {ejercicio.indicacionProfe}</span>
          </p>
        )}
        
        {ejercicio.videoRecomendacion && (
          <p className="text-xs font-medium text-slate-300 mt-2 flex items-start gap-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <span className="shrink-0">💡</span>
            <span>Tip del video: {ejercicio.videoRecomendacion}</span>
          </p>
        )}
      </div>

      {/* Listado de Series */}
      <div className="space-y-4">
        {series.map((serie, index) => {
          // Si estamos reeditando esta serie puntual
          const estaEnEdicion = serieEnEdicionId === serie.id;
          
          // Es activa si es la primera no completada (cuando no estamos en re-edición puntual)
          const isActiva = estaEnEdicion || (serieEnEdicionId === null && index === serieActivaIndex);
          const isCompletada = serie.completado && !estaEnEdicion;
          const isFutura = !serie.completado && !isActiva;

          // A) SERIE COMPLETADA (Tarjeta compacta con botón de re-editar)
          if (isCompletada) {
            return (
              <div 
                key={serie.id} 
                className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl transition-all"
              >
                <div>
                  <span className="text-sm font-bold text-white mr-2">Serie {serie.numeroSerie}</span>
                  <span className="text-xs text-slate-400">
                    | Reps: <strong className="text-white">{serie.repsRealizadas || '-'}</strong> | Carga: <strong className="text-white">{serie.cargaKg || '-'} kg</strong> | RIR: <strong className="text-white">{serie.rir !== null ? serie.rir : '-'}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSerieEnEdicionId(serie.id)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-400 border border-slate-700 text-xs transition-colors"
                    title="Editar esta serie"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[#0c1322]">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          }

          // B) SERIE ACTUAL O EN EDICIÓN
          if (isActiva) {
            return (
              <div 
                key={serie.id} 
                className="bg-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-xl shadow-blue-500/5 relative overflow-hidden animate-fadeIn"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-black text-blue-400 flex items-center gap-2">
                    <span>Serie {serie.numeroSerie}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {estaEnEdicion ? 'Modificando' : 'Actual'}
                    </span>
                  </h5>

                  {estaEnEdicion && (
                    <button
                      type="button"
                      onClick={() => setSerieEnEdicionId(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Stepper Reps */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
                      Reps
                    </label>
                    <div className="flex items-center justify-between bg-[#05070c] rounded-xl p-1 border border-slate-700">
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'repsRealizadas', Math.max(0, (serie.repsRealizadas || 0) - 1))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-black text-white">{serie.repsRealizadas || 0}</span>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'repsRealizadas', (serie.repsRealizadas || 0) + 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stepper Kilos */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
                      Kilos
                    </label>
                    <div className="flex items-center justify-between bg-[#05070c] rounded-xl p-1 border border-slate-700">
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'cargaKg', Math.max(0, (serie.cargaKg || 0) - 2.5))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-black text-white flex items-baseline gap-0.5">
                        {serie.cargaKg || 0} <span className="text-xs font-normal text-slate-500">kg</span>
                      </span>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'cargaKg', (serie.cargaKg || 0) + 2.5)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selectores RIR circulares */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-400 mb-3 text-center">
                    RIR (Repeticiones en Reserva)
                  </label>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, '4+'].map((val) => {
                      const isActive = String(serie.rir) === String(val);
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => actualizarSerieLocal(serie.id, 'rir', val)}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full font-bold text-sm transition-all border ${
                            isActive 
                              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 scale-105' 
                              : 'bg-[#05070c] text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slider RPE */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 mb-3 text-center">
                    RPE (Esfuerzo Percibido 1-10)
                  </label>
                  <div className="px-2 sm:px-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="0.5"
                      value={serie.rpe || 5}
                      onChange={(e) => actualizarSerieLocal(serie.id, 'rpe', parseFloat(e.target.value))}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-2 px-1">
                      <span>1 (Muy Suave)</span>
                      <span className="text-blue-400 text-sm font-black">{serie.rpe || 5}</span>
                      <span>10 (Máximo)</span>
                    </div>
                  </div>
                </div>

                {/* Botón Guardar Serie */}
                <button
                  type="button"
                  onClick={() => guardarSerieActiva(serie)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/25 active:scale-[0.99]"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>
                    {estaEnEdicion ? `Actualizar Serie ${serie.numeroSerie}` : `✓ Guardar Serie ${serie.numeroSerie}`}
                  </span>
                </button>
              </div>
            );
          }

          // C) SERIE FUTURA INACTIVA
          if (isFutura) {
            return (
              <div 
                key={serie.id} 
                className="flex items-center justify-between bg-slate-900/40 border border-slate-800/40 p-4 rounded-2xl opacity-60"
              >
                <span className="text-sm font-bold text-slate-500">Serie {serie.numeroSerie}</span>
                <span className="text-xs text-slate-600 font-medium">Pendiente</span>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Observación Colapsable del Alumno */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setMostrarObservacion(!mostrarObservacion)}
          className="flex items-center justify-center w-full gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors py-2 focus:outline-none bg-slate-900/50 rounded-xl border border-slate-800/50 hover:border-slate-700"
        >
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>
            {mostrarObservacion ? '💬 Ocultar observación' : '💬 + Agregar observación (Opcional)'}
          </span>
          {mostrarObservacion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {mostrarObservacion && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            <textarea
              rows={3}
              placeholder="¿Cómo se sintió el peso? ¿Alguna molestia o detalle técnico para Matías?..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full bg-[#05070c] border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-y shadow-inner"
            />
            <button
              type="button"
              disabled={guardandoObs}
              onClick={guardarObservacion}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-slate-700"
            >
              <Save className="w-4 h-4" />
              {guardandoObs ? 'Guardando nota...' : (obsGuardadaExito ? '¡Nota guardada para Matías!' : 'Guardar Observación')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
