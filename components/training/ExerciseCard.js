'use client';

/**
 * ========================================================================
 * COMPONENTE: Tarjeta de Ejercicio de Desarrollo (components/training/ExerciseCard.js)
 * ========================================================================
 * - Soporta Auto-Minimización al completar todas las series.
 * - Vista compacta / minimizada con resumen de series y cargas levantadas.
 * - Modo edición para modificar series ya completadas o agregar notas.
 * - Steppers [-] [+] para Reps y Kilos, selectores RIR y slider RPE.
 * - Soporte de Modo Soleado de Alto Contraste para máxima legibilidad al sol.
 */

import { useState, useEffect } from 'react';
import { 
  Check, MessageSquare, ChevronDown, ChevronUp, Save, 
  Minus, Plus, Edit3, HelpCircle, X 
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useTheme } from '@/components/ThemeProvider';

// Explicaciones cortas que aparecen al tocar cada dato de la serie
const AYUDA_CAMPOS = {
  reps: {
    titulo: 'Repeticiones',
    texto: 'Cuántas repeticiones hiciste en esta serie. Si hiciste 8, tocá + hasta llegar a 8.',
  },
  kg: {
    titulo: 'Peso (kg)',
    texto: 'Peso que usaste en esta serie. Los botones suman o restan 2,5 kg. Si es con tu peso corporal, dejá 0.',
  },
  rir: {
    titulo: 'RIR (Repeticiones en Reserva)',
    texto: 'Cuántas repeticiones más podrías haber hecho antes del fallo. RIR 0 = al límite; RIR 2 = te quedaban 2; RIR 4+ = te sobró energía.',
  },
  rpe: {
    titulo: 'RPE (Esfuerzo percibido)',
    texto: 'Qué tan duro se sintió del 1 al 10. 1 = muy suave; 10 = máximo esfuerzo. Ejemplo: 8 = duro pero controlable.',
  },
};

export default function ExerciseCard({ ejercicio, onUpdateEjercicio }) {
  const { isSunlight } = useTheme();
  const [series, setSeries] = useState(ejercicio.series || []);
  const [videoAbierto, setVideoAbierto] = useState(false);
  const [mostrarObservacion, setMostrarObservacion] = useState(
    Boolean(ejercicio.observacion && ejercicio.observacion.trim().length > 0)
  );
  const [observacion, setObservacion] = useState(ejercicio.observacion || '');
  const [guardandoObs, setGuardandoObs] = useState(false);
  const [obsGuardadaExito, setObsGuardadaExito] = useState(false);

  // Ventanita chica de recordatorio por campo (reps, kg, rir, rpe)
  const [ayudaCampo, setAyudaCampo] = useState(null);

  // Serie específica que el usuario eligió re-editar manualmente
  const [serieEnEdicionId, setSerieEnEdicionId] = useState(null);

  // Comprobar si todas las series del ejercicio están completadas
  const todasCompletadas = series.length > 0 && series.every((s) => s.completado);

  // Estado de minimizado
  const [minimizado, setMinimizado] = useState(todasCompletadas);

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

  const serieActivaIndex = series.findIndex((s) => !s.completado);

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

  // Abrir/cerrar la ventanita de recordatorio de un campo
  const alternarAyudaCampo = (campo) => {
    setAyudaCampo((prev) => (prev === campo ? null : campo));
  };

  // Posición de la ventanita según la columna del campo
  const posicionAyudaCampo = (campo) => {
    if (campo === 'reps') return 'left-0';
    if (campo === 'kg') return 'right-0';
    return 'left-1/2 -translate-x-1/2';
  };

  // Título táctil: al tocar el nombre del dato se abre su explicación
  const renderTituloAyuda = (campo, texto) => (
    <button
      type="button"
      onClick={() => alternarAyudaCampo(campo)}
      aria-expanded={ayudaCampo === campo}
      className={`mx-auto flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider transition-colors ${
        isSunlight ? 'text-slate-800 hover:text-blue-800' : 'text-slate-300 hover:text-sky-300'
      }`}
    >
      <span>{texto}</span>
      <HelpCircle className={`w-3.5 h-3.5 ${
        ayudaCampo === campo
          ? isSunlight ? 'text-blue-700' : 'text-sky-400'
          : isSunlight ? 'text-slate-500' : 'text-slate-400'
      }`} />
    </button>
  );

  // Ventanita chica con la explicación del campo
  const renderAyudaCampo = (campo) => {
    if (ayudaCampo !== campo) return null;
    const datos = AYUDA_CAMPOS[campo];
    return (
      <div
        role="tooltip"
        className={`absolute top-full mt-2 z-40 w-60 max-w-[calc(100vw-2.5rem)] rounded-2xl border p-3 text-left shadow-2xl animate-fadeIn ${posicionAyudaCampo(campo)} ${
          isSunlight
            ? 'bg-white border-slate-300 text-slate-800'
            : 'bg-[#0c1322] border-slate-600 text-slate-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[10px] font-black uppercase tracking-wider ${isSunlight ? 'text-blue-800' : 'text-sky-400'}`}>
            {datos.titulo}
          </p>
          <button
            type="button"
            onClick={() => setAyudaCampo(null)}
            aria-label="Cerrar ayuda"
            className={`p-0.5 rounded transition-colors ${
              isSunlight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] leading-relaxed mt-1 font-medium">{datos.texto}</p>
      </div>
    );
  };

  const guardarSerieActiva = async (serie) => {
    const seriesActualizadas = series.map((s) => {
      if (s.id === serie.id) {
        return { ...s, completado: true };
      }
      return s;
    });
    setSeries(seriesActualizadas);
    setAyudaCampo(null);

    if (serieEnEdicionId === serie.id) {
      setSerieEnEdicionId(null);
    }

    if (onUpdateEjercicio) {
      onUpdateEjercicio(ejercicio.id, { series: seriesActualizadas });
    }

    const ahoraTodasCompletadas = seriesActualizadas.every((s) => s.completado);
    if (ahoraTodasCompletadas) {
      setTimeout(() => {
        setMinimizado(true);
      }, 400);
    }

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
        className={`group rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex items-center justify-between gap-4 mb-4 border ${
          isSunlight
            ? 'bg-emerald-50/70 hover:bg-emerald-100/80 border-2 border-emerald-400 text-slate-900 shadow-sm'
            : 'bg-[#0c1322] hover:bg-[#0f172a] border-emerald-500/30 hover:border-emerald-400/50 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-base font-black truncate ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                {ejercicio.nombre}
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                ✓ Listo
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 flex items-center gap-2 ${
              isSunlight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              <span>{series.length}/{series.length} series listas</span>
              <span>•</span>
              <span className={`font-bold ${isSunlight ? 'text-emerald-800' : 'text-emerald-400'}`}>{cargasResumen}</span>
              {observacion && (
                <>
                  <span>•</span>
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`}>
                    <MessageSquare className="w-3 h-3" /> Con nota
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMinimizado(false);
          }}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-sm touch-target ${
            isSunlight
              ? 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-400'
          }`}
        >
          <Edit3 className={`w-3.5 h-3.5 ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`} />
          <span>Editar</span>
        </button>
      </div>
    );
  }

  // ========================================================================
  // 2. VISTA EXPANDIDA (En progreso o en modo edición)
  // ========================================================================
  return (
    <div className={`rounded-3xl p-5 mb-6 relative transition-all border ${
      isSunlight
        ? 'bg-white border-2 border-slate-300 shadow-md text-slate-900'
        : 'bg-[#0c1322] border border-slate-800 shadow-2xl text-white'
    }`}>
      
      {/* Botón flotante para minimizar si ya está completado */}
      {todasCompletadas && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setMinimizado(true)}
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
              isSunlight
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border border-slate-800'
            }`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Minimizar ejercicio</span>
          </button>
        </div>
      )}

      {/* Título y objetivo */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className={`text-xl font-black ${isSunlight ? 'text-[#020617]' : 'text-white'}`}>{ejercicio.nombre}</h4>
          <div className="flex items-center gap-2">
            {ejercicio.videoUrl && !videoAbierto && (
              <button
                type="button"
                onClick={() => setVideoAbierto(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black transition-colors"
              >
                ▶ Reproducir Video
              </button>
            )}
            {todasCompletadas && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950">
                Completado
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs font-semibold mt-1 ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>
          Series realizadas: <strong className={isSunlight ? 'text-slate-900' : 'text-slate-200'}>{series.filter((s) => s.completado).length}</strong> de {series.length}
        </p>

        {ejercicio.videoUrl && videoAbierto && (
          <div className="mt-4">
            <VideoPlayer videoUrl={ejercicio.videoUrl} onClose={() => setVideoAbierto(false)} />
          </div>
        )}

        {ejercicio.indicacionProfe && (
          <p className={`text-sm font-bold mt-2 flex items-start gap-2 p-3 rounded-xl border ${
            isSunlight
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-blue-900/20 text-sky-400 border-blue-500/20'
          }`}>
            <span className="shrink-0">🎯</span>
            <span>Objetivo de Matías: {ejercicio.indicacionProfe}</span>
          </p>
        )}
        
        {ejercicio.videoRecomendacion && (
          <p className={`text-xs font-medium mt-2 flex items-start gap-2 p-3 rounded-xl border ${
            isSunlight
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-slate-800/50 text-slate-300 border-slate-700'
          }`}>
            <span className="shrink-0">💡</span>
            <span>Tip del video: {ejercicio.videoRecomendacion}</span>
          </p>
        )}

      </div>

      {/* Listado de Series */}
      <div className="space-y-4">
        {series.map((serie, index) => {
          const estaEnEdicion = serieEnEdicionId === serie.id;
          const isActiva = estaEnEdicion || (serieEnEdicionId === null && index === serieActivaIndex);
          const isCompletada = serie.completado && !estaEnEdicion;
          const isFutura = !serie.completado && !isActiva;

          // A) SERIE COMPLETADA
          if (isCompletada) {
            return (
              <div 
                key={serie.id} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  isSunlight
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-white'
                }`}
              >
                <div>
                  <span className={`text-sm font-black mr-2 ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                    Serie {serie.numeroSerie}
                  </span>
                  <span className={`text-xs font-semibold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
                    | Reps: <strong>{serie.repsRealizadas || '-'}</strong> | Carga: <strong>{serie.cargaKg || '-'} kg</strong> | RIR: <strong>{serie.rir !== null ? serie.rir : '-'}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSerieEnEdicionId(serie.id)}
                    className={`p-2 rounded-lg text-xs font-bold transition-colors touch-target ${
                      isSunlight
                        ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                    title="Editar esta serie"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </button>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
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
                className={`rounded-2xl p-5 shadow-xl relative animate-fadeIn border-2 ${
                  ayudaCampo ? 'overflow-visible z-40' : 'overflow-hidden'
                } ${
                  isSunlight
                    ? 'bg-slate-50 border-blue-500 text-slate-900'
                    : 'bg-slate-900 border-blue-500/60 text-white shadow-blue-500/5'
                }`}
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 rounded-l-2xl" />
                
                <div className="flex items-center justify-between mb-4">
                  <h5 className={`text-sm font-black flex items-center gap-2 ${
                    isSunlight ? 'text-blue-900' : 'text-blue-400'
                  }`}>
                    <span>Serie {serie.numeroSerie}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                      {estaEnEdicion ? 'Modificando' : 'Actual'}
                    </span>
                  </h5>

                  {estaEnEdicion && (
                    <button
                      type="button"
                      onClick={() => setSerieEnEdicionId(null)}
                      className={`text-xs font-bold ${isSunlight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                {/* Fondo invisible para cerrar la ventanita al tocar afuera */}
                {ayudaCampo && (
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAyudaCampo(null)}
                    aria-hidden="true"
                  />
                )}

                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Stepper Reps */}
                  <div>
                    <div className="relative mb-2">
                      {renderTituloAyuda('reps', 'Repeticiones')}
                      {renderAyudaCampo('reps')}
                    </div>
                    <div className={`flex items-center justify-between rounded-2xl p-1.5 border ${
                      isSunlight ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#05070c] border-slate-700'
                    }`}>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'repsRealizadas', Math.max(0, (serie.repsRealizadas || 0) - 1))}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 touch-target ${
                          isSunlight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        <Minus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      <span className={`text-2xl font-black ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                        {serie.repsRealizadas || 0}
                      </span>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'repsRealizadas', (serie.repsRealizadas || 0) + 1)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 touch-target ${
                          isSunlight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Stepper Kilos */}
                  <div>
                    <div className="relative mb-2">
                      {renderTituloAyuda('kg', 'Peso (kg)')}
                      {renderAyudaCampo('kg')}
                    </div>
                    <div className={`flex items-center justify-between rounded-2xl p-1.5 border ${
                      isSunlight ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#05070c] border-slate-700'
                    }`}>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'cargaKg', Math.max(0, (serie.cargaKg || 0) - 2.5))}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 touch-target ${
                          isSunlight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        <Minus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      <span className={`text-2xl font-black flex items-baseline gap-0.5 ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                        {serie.cargaKg || 0} <span className="text-xs font-bold text-slate-500">kg</span>
                      </span>
                      <button 
                        type="button"
                        onClick={() => actualizarSerieLocal(serie.id, 'cargaKg', (serie.cargaKg || 0) + 2.5)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 touch-target ${
                          isSunlight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selectores RIR circulares */}
                <div className="mb-6">
                  <div className="relative mb-3">
                    {renderTituloAyuda('rir', 'RIR (Repeticiones en Reserva)')}
                    {renderAyudaCampo('rir')}
                  </div>
                  <div className="flex justify-center gap-2.5">
                    {[0, 1, 2, 3, '4+'].map((val) => {
                      const isActive = String(serie.rir) === String(val);
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => actualizarSerieLocal(serie.id, 'rir', val)}
                          className={`w-12 h-12 rounded-full font-black text-sm transition-all border touch-target ${
                            isActive 
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105' 
                              : isSunlight
                                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                : 'bg-[#05070c] text-slate-300 border-slate-700 hover:border-slate-500'
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
                  <div className="relative mb-3">
                    {renderTituloAyuda('rpe', 'RPE (Esfuerzo Percibido 1-10)')}
                    {renderAyudaCampo('rpe')}
                  </div>
                  <div className="px-2 sm:px-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="0.5"
                      value={serie.rpe || 5}
                      onChange={(e) => actualizarSerieLocal(serie.id, 'rpe', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 h-2.5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className={`flex justify-between text-[11px] font-bold mt-2 px-1 ${
                      isSunlight ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      <span>1 (Muy Suave)</span>
                      <span className={`text-base font-black ${isSunlight ? 'text-blue-800' : 'text-blue-400'}`}>{serie.rpe || 5}</span>
                      <span>10 (Máximo)</span>
                    </div>
                  </div>
                </div>

                {/* Botón Guardar Serie */}
                <button
                  type="button"
                  onClick={() => guardarSerieActiva(serie)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 hover:from-blue-600 hover:to-sky-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] touch-target"
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
                className={`flex items-center justify-between p-4 rounded-2xl border ${
                  isSunlight
                    ? 'bg-slate-100/70 border-slate-200 text-slate-500'
                    : 'bg-slate-900/40 border-slate-800/40 opacity-60 text-slate-400'
                }`}
              >
                <span className="text-sm font-bold">Serie {serie.numeroSerie}</span>
                <span className="text-xs font-semibold">Pendiente</span>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Observación Colapsable del Alumno */}
      <div className={`mt-6 pt-4 border-t ${isSunlight ? 'border-slate-200' : 'border-slate-800/80'}`}>
        <button
          type="button"
          onClick={() => setMostrarObservacion(!mostrarObservacion)}
          className={`flex items-center justify-center w-full gap-2 text-xs font-black transition-colors py-3 focus:outline-none rounded-xl border touch-target ${
            isSunlight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
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
              className={`w-full rounded-2xl p-4 text-sm font-medium transition-colors resize-y border ${
                isSunlight
                  ? 'bg-white border-2 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600'
                  : 'bg-[#05070c] border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              disabled={guardandoObs}
              onClick={guardarObservacion}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 touch-target ${
                isSunlight
                  ? 'bg-slate-900 text-white hover:bg-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
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
