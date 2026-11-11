'use client';

/**
 * ========================================================================
 * COMPONENTE: Vista de Entrenamiento del Alumno (components/training/WorkoutView.js)
 * ========================================================================
 * - Soporta navegación multidía y regreso al cronograma semanal.
 * - Header con progreso en tiempo real y botón de cambio de día.
 * - 3 Bloques colapsables: Movilidad, Activación, Desarrollo.
 * - Integra ExerciseCard con soporte de auto-minimización y re-edición.
 * - Soporta Modo Soleado de Alto Contraste para entrenar en exteriores.
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Check, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, Trophy, 
  Calendar, Save, Edit3, Sparkles, Zap, Heart, Activity 
} from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import VideoPlayer from './VideoPlayer';
import PreWorkoutModal from './PreWorkoutModal';
import PostWorkoutModal from './PostWorkoutModal';
import { useTheme } from '@/components/ThemeProvider';

export default function WorkoutView({ 
  alumnoId = 'demo-alumno-1', 
  diaId = 'dia-1', 
  rutinaInicial = null,
  esModoEdicion = false,
  onFinalizar = null,
  onVolver = null 
}) {
  const { isSunlight } = useTheme();
  const [rutina, setRutina] = useState(rutinaInicial);
  const [cargando, setCargando] = useState(!rutinaInicial);
  const [videoActivoId, setVideoActivoId] = useState(null);
  
  // Modales de Check-in Pre y Post entrenamiento (UX rápida de 1 clic)
  const [mostrarModalPre, setMostrarModalPre] = useState(false);
  const [mostrarModalPost, setMostrarModalPost] = useState(false);
  const [guardandoPost, setGuardandoPost] = useState(false);
  const [mostrarAvisoSeries, setMostrarAvisoSeries] = useState(false);
  const [preCheckinHecho, setPreCheckinHecho] = useState(
    Boolean(rutinaInicial?.energiaInicial)
  );

  // Estado para los acordeones
  const [acordeones, setAcordeones] = useState({
    MOVILIDAD: true,
    ACTIVACION: true,
    DESARROLLO: true
  });

  useEffect(() => {
    if (rutinaInicial) {
      setRutina(rutinaInicial);
      setCargando(false);
      if (rutinaInicial.energiaInicial) {
        setPreCheckinHecho(true);
      } else if (!esModoEdicion) {
        setMostrarModalPre(true);
      }
      return;
    }

    async function cargarRutina() {
      setCargando(true);
      try {
        const url = `/api/rutinas?alumnoId=${alumnoId}${diaId ? `&diaId=${diaId}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.rutina) {
          setRutina(data.rutina);
          if (data.rutina.energiaInicial) {
            setPreCheckinHecho(true);
          } else if (!esModoEdicion) {
            setMostrarModalPre(true);
          }
        }
      } catch (err) {
        console.error('Error cargando rutina:', err);
      } finally {
        setCargando(false);
      }
    }
    cargarRutina();
  }, [alumnoId, diaId, rutinaInicial, esModoEdicion]);

  // Actualizar checkbox de Movilidad o Activación
  const toggleCheckMovilidad = async (ejercicioId, estadoActual) => {
    if (!rutina) return;
    const nuevoEstado = !estadoActual;
    setRutina((prev) => {
      const bloquesActualizados = prev.bloques.map((b) => {
        if (b.tipo === 'MOVILIDAD' || b.tipo === 'ACTIVACION') {
          return {
            ...b,
            ejercicios: b.ejercicios.map((ej) =>
              ej.id === ejercicioId ? { ...ej, completado: nuevoEstado } : ej
            ),
          };
        }
        return b;
      });
      return { ...prev, bloques: bloquesActualizados };
    });

    try {
      await fetch(`/api/entrenamiento/ejercicio/${ejercicioId}/observacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completado: nuevoEstado }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Sincronizar cambios de un ejercicio de desarrollo desde ExerciseCard
  const handleUpdateEjercicio = (ejercicioId, cambios) => {
    setRutina((prev) => {
      if (!prev) return prev;
      const bloquesActualizados = prev.bloques?.map((b) => {
        if (b.tipo === 'DESARROLLO') {
          return {
            ...b,
            ejercicios: b.ejercicios?.map((ej) => {
              if (ej.id === ejercicioId) {
                return { ...ej, ...cambios };
              }
              return ej;
            }),
          };
        }
        return b;
      });
      return { ...prev, bloques: bloquesActualizados };
    });
  };

  const toggleAcordeon = (bloque) => {
    setAcordeones((prev) => ({
      ...prev,
      [bloque]: !prev[bloque]
    }));
  };

  const progreso = useMemo(() => {
    if (!rutina) return 0;
    let totalSeries = 0;
    let seriesCompletadas = 0;
    
    rutina.bloques?.forEach((b) => {
      if (b.tipo === 'DESARROLLO') {
        b.ejercicios?.forEach((ej) => {
          if (ej.series) {
            totalSeries += ej.series.length;
            seriesCompletadas += ej.series.filter((s) => s.completado).length;
          }
        });
      }
    });

    if (totalSeries === 0) return 0;
    return Math.round((seriesCompletadas / totalSeries) * 100);
  }, [rutina]);

  // Recordatorio: series de desarrollo que todavía no fueron guardadas
  const seriesPendientes = useMemo(() => {
    if (!rutina) return 0;
    let pendientes = 0;
    rutina.bloques?.forEach((b) => {
      if (b.tipo === 'DESARROLLO') {
        b.ejercicios?.forEach((ej) => {
          (ej.series || []).forEach((s) => {
            if (!s.completado) pendientes += 1;
          });
        });
      }
    });
    return pendientes;
  }, [rutina]);

  // Guardar respuestas del modal Pre-Entrenamiento (1 clic)
  const handleGuardarPreWorkout = async (datosPre) => {
    setPreCheckinHecho(true);
    setMostrarModalPre(false);
    const rutinaActualizada = {
      ...rutina,
      ...datosPre,
    };
    setRutina(rutinaActualizada);

    try {
      await fetch('/api/entrenamiento/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rutinaId: rutina?.id,
          alumnoId,
          tipo: 'PRE',
          ...datosPre,
        }),
      });
    } catch (e) {
      console.warn('Error guardando check-in pre-entreno:', e);
    }
  };

  // Abrir modal de evaluación post-entrenamiento (RPE, impacto anímico, desahogo)
  const handleFinalizarEntrenamiento = () => {
    // Si quedan series sin guardar, recordarle al alumno antes de cerrar el día
    if (seriesPendientes > 0) {
      setMostrarAvisoSeries(true);
      return;
    }
    setMostrarModalPost(true);
  };

  // El alumno decidió finalizar aunque queden series sin guardar
  const continuarFinalizacion = () => {
    setMostrarAvisoSeries(false);
    setMostrarModalPost(true);
  };

  // Guardar respuestas del modal Post-Entrenamiento y finalizar la sesión
  const handleGuardarPostWorkout = async (datosPost) => {
    setGuardandoPost(true);
    const rutinaFinal = {
      ...rutina,
      ...datosPost,
      fechaCompletada: new Date().toISOString(),
      estado: 'COMPLETADA',
    };
    setRutina(rutinaFinal);

    try {
      await fetch('/api/entrenamiento/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rutinaId: rutina?.id,
          alumnoId,
          tipo: 'POST',
          ...datosPost,
        }),
      });
    } catch (e) {
      console.warn('Error guardando check-out post-entreno:', e);
    } finally {
      setGuardandoPost(false);
      setMostrarModalPost(false);
      if (onFinalizar) {
        onFinalizar(rutinaFinal);
      } else if (onVolver) {
        onVolver();
      }
    }
  };

  if (cargando) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-20 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
        <p className={`font-semibold text-sm ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`}>
          Cargando tu planificación...
        </p>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className={`w-full max-w-lg mx-auto text-center py-16 p-8 rounded-3xl border ${
        isSunlight ? 'bg-white border-slate-300 text-slate-900 shadow-md' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">No se encontró esta sesión</h3>
        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Volver al Cronograma
          </button>
        )}
      </div>
    );
  }

  const bloqueMovilidad = rutina.bloques?.find((b) => b.tipo === 'MOVILIDAD');
  const bloqueActivacion = rutina.bloques?.find((b) => b.tipo === 'ACTIVACION');
  const bloqueDesarrollo = rutina.bloques?.find((b) => b.tipo === 'DESARROLLO');

  return (
    <div className={`w-full max-w-md mx-auto min-h-screen pb-24 font-sans transition-colors ${
      isSunlight ? 'bg-white text-slate-900' : 'bg-[#05070c] text-white'
    }`}>
      
      {/* BOTÓN REGRESAR AL CRONOGRAMA */}
      {onVolver && (
        <div className="pt-2 pb-3 px-4">
          <button
            type="button"
            onClick={onVolver}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border transition-all touch-target ${
              isSunlight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                : 'text-slate-300 hover:text-sky-300 bg-slate-900/80 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Cronograma Semanal (Cambiar Día)</span>
          </button>
        </div>
      )}

      {/* BANNER SI ESTÁ EN MODO EDICIÓN */}
      {esModoEdicion && (
        <div className={`mx-4 mb-3 p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          isSunlight
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
        }`}>
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Modo Edición: Modificando día finalizado</span>
          </div>
          <button
            type="button"
            onClick={handleFinalizarEntrenamiento}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition-colors shrink-0 touch-target"
          >
            Guardar
          </button>
        </div>
      )}

      {/* HEADER: ¡A entrenar! y Barra de progreso */}
      <div className={`pt-3 pb-6 px-4 sticky top-0 z-10 border-b transition-colors ${
        isSunlight 
          ? 'bg-white/95 backdrop-blur-md border-slate-300 text-slate-900' 
          : 'bg-[#05070c]/95 backdrop-blur-md border-slate-800/80 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <span>{esModoEdicion ? 'Editando Sesión' : '¡A entrenar!'}</span>
            <span className="text-2xl">{esModoEdicion ? '✏️' : '💪'}</span>
          </h1>
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                isSunlight
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
              title="Ver otros días"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Días</span>
            </button>
          )}
        </div>

        <p className={`font-bold text-xs sm:text-sm mt-1 ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
          {rutina.nombre}
        </p>
        
        {/* BARRA DE PROGRESO */}
        <div className="mt-4">
          <div className="flex justify-between items-end mb-1.5">
            <span className={`text-xs font-black uppercase tracking-wider ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`}>
              Progreso de la sesión
            </span>
            <span className={`text-sm font-black ${isSunlight ? 'text-blue-700' : 'text-blue-400'}`}>{progreso}%</span>
          </div>
          <div className={`w-full h-3.5 rounded-full overflow-hidden border ${
            isSunlight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400 transition-all duration-500 ease-out" 
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* PILL DE ESTADO CHECK-IN PRE-ENTRENO */}
        <div className="mt-3.5">
          {rutina?.energiaInicial ? (
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-sky-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-sky-300 font-semibold truncate">
                <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0 fill-current" />
                <span className="truncate">
                  Check-in: <strong>Batería {rutina.energiaInicial}/5</strong> • {rutina.animoInicial === 1 ? '😫 Estresado' : rutina.animoInicial === 2 ? '🙁 Desmotivado' : rutina.animoInicial === 3 ? '😐 Neutral' : rutina.animoInicial === 4 ? '🙂 Bien' : '🤩 A tope'} {rutina.descansoInicial ? `• 😴 ${rutina.descansoInicial}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalPre(true)}
                className="text-[10px] font-bold text-sky-400 hover:text-white px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 transition-colors shrink-0"
              >
                Modificar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMostrarModalPre(true)}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-sky-900/20 border border-blue-500/30 hover:border-blue-400 flex items-center justify-between gap-2 text-xs text-left transition-all"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-300">¿Cómo venís hoy? 2 preguntas de 1 clic para Matías.</span>
              </div>
              <span className="text-[10px] font-black text-white px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 shrink-0">
                Check-in
              </span>
            </button>
          )}
        </div>
      </div>

      {/* BLOQUES DE ENTRENAMIENTO */}
      <div className="px-4 py-6 space-y-4">
        
        {/* BLOQUE 1: MOVILIDAD */}
        {bloqueMovilidad && (
          <div className={`rounded-2xl border overflow-hidden shadow-md transition-all ${
            isSunlight ? 'bg-white border-2 border-slate-300' : 'bg-[#0b1220] border-slate-800'
          }`}>
            <button 
              type="button"
              onClick={() => toggleAcordeon('MOVILIDAD')}
              className={`w-full p-4 sm:p-5 flex items-center justify-between transition-colors touch-target ${
                isSunlight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-900/50 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border ${
                  isSunlight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                }`}>
                  1
                </span>
                <h2 className={`text-base font-black uppercase tracking-wide ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
                  Movilidad Articular
                </h2>
              </div>
              {acordeones.MOVILIDAD ? (
                <ChevronUp className={`w-5 h-5 ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`} />
              )}
            </button>
            
            {acordeones.MOVILIDAD && (
              <div className={`p-4 space-y-3 border-t animate-fadeIn ${
                isSunlight ? 'bg-white border-slate-200' : 'bg-[#0c1322] border-slate-800/80'
              }`}>
                {bloqueMovilidad.ejercicios.map((ej) => (
                  <div 
                    key={ej.id}
                    onClick={() => toggleCheckMovilidad(ej.id, ej.completado)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all touch-target ${
                      isSunlight 
                        ? ej.completado ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-300 hover:border-blue-400'
                        : ej.completado ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                      ej.completado 
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                        : isSunlight ? 'border-slate-400 text-transparent' : 'border-slate-600 text-transparent'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-black block ${
                        ej.completado 
                          ? 'text-slate-400 line-through' 
                          : isSunlight ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {ej.nombre}
                      </span>
                      {ej.indicacionProfe && (
                        <span className={`text-xs font-semibold block mt-0.5 ${
                          isSunlight ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {ej.indicacionProfe}
                        </span>
                      )}
                      
                      {(ej.videoUrl || ej.videoRecomendacion) && (
                        <div className="mt-2 flex flex-col items-start gap-1.5 w-full">
                          {ej.videoUrl && videoActivoId !== ej.id && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setVideoActivoId(ej.id); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-black transition-colors"
                            >
                              ▶ Reproducir Video
                            </button>
                          )}
                          {ej.videoUrl && videoActivoId === ej.id && (
                            <div onClick={(e) => e.stopPropagation()} className="w-full">
                              <VideoPlayer videoUrl={ej.videoUrl} onClose={() => setVideoActivoId(null)} />
                            </div>
                          )}
                          {ej.videoRecomendacion && (
                            <span className={`text-[11px] font-bold p-1.5 rounded-md border ${
                              isSunlight 
                                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                                : 'text-slate-300 bg-slate-800/50 border-slate-700/50'
                            }`}>
                              💡 {ej.videoRecomendacion}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BLOQUE 2: ACTIVACIÓN */}
        {bloqueActivacion && (
          <div className={`rounded-2xl border overflow-hidden shadow-md transition-all ${
            isSunlight ? 'bg-white border-2 border-slate-300' : 'bg-[#0b1220] border-slate-800'
          }`}>
            <button 
              type="button"
              onClick={() => toggleAcordeon('ACTIVACION')}
              className={`w-full p-4 sm:p-5 flex items-center justify-between transition-colors touch-target ${
                isSunlight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-900/50 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border ${
                  isSunlight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                }`}>
                  2
                </span>
                <h2 className={`text-base font-black uppercase tracking-wide ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
                  Activación & Potenciación
                </h2>
              </div>
              {acordeones.ACTIVACION ? (
                <ChevronUp className={`w-5 h-5 ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${isSunlight ? 'text-slate-700' : 'text-slate-400'}`} />
              )}
            </button>
            
            {acordeones.ACTIVACION && (
              <div className={`p-4 space-y-3 border-t animate-fadeIn ${
                isSunlight ? 'bg-white border-slate-200' : 'bg-[#0c1322] border-slate-800/80'
              }`}>
                {bloqueActivacion.ejercicios.map((ej) => (
                  <div 
                    key={ej.id}
                    onClick={() => toggleCheckMovilidad(ej.id, ej.completado)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all touch-target ${
                      isSunlight 
                        ? ej.completado ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-300 hover:border-blue-400'
                        : ej.completado ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                      ej.completado 
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                        : isSunlight ? 'border-slate-400 text-transparent' : 'border-slate-600 text-transparent'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <span className={`block text-sm font-black ${
                        ej.completado 
                          ? 'text-slate-400 line-through' 
                          : isSunlight ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {ej.nombre}
                      </span>
                      {ej.indicacionProfe && (
                        <span className={`block text-xs font-semibold mt-0.5 ${
                          isSunlight ? 'text-blue-700' : 'text-sky-400'
                        }`}>
                          {ej.indicacionProfe}
                        </span>
                      )}
                      
                      {(ej.videoUrl || ej.videoRecomendacion) && (
                        <div className="mt-2 flex flex-col items-start gap-1.5 w-full">
                          {ej.videoUrl && videoActivoId !== ej.id && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setVideoActivoId(ej.id); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-black transition-colors"
                            >
                              ▶ Reproducir Video
                            </button>
                          )}
                          {ej.videoUrl && videoActivoId === ej.id && (
                            <div onClick={(e) => e.stopPropagation()} className="w-full">
                              <VideoPlayer videoUrl={ej.videoUrl} onClose={() => setVideoActivoId(null)} />
                            </div>
                          )}
                          {ej.videoRecomendacion && (
                            <span className={`text-[11px] font-bold p-1.5 rounded-md border ${
                              isSunlight 
                                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                                : 'text-slate-300 bg-slate-800/50 border-slate-700/50'
                            }`}>
                              💡 {ej.videoRecomendacion}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BLOQUE 3: DESARROLLO */}
        {bloqueDesarrollo && (
          <div className={`rounded-2xl border overflow-hidden shadow-lg transition-all ${
            isSunlight ? 'bg-white border-2 border-blue-400' : 'bg-[#0b1220] border-slate-800 border-blue-500/30'
          }`}>
            <button 
              type="button"
              onClick={() => toggleAcordeon('DESARROLLO')}
              className={`w-full p-4 sm:p-5 flex items-center justify-between transition-colors touch-target ${
                isSunlight 
                  ? 'bg-blue-50/80 hover:bg-blue-100' 
                  : 'bg-gradient-to-r from-blue-900/30 to-slate-900 hover:from-blue-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h2 className={`text-base font-black uppercase tracking-wide ${isSunlight ? 'text-blue-900' : 'text-blue-400'}`}>
                  Desarrollo Principal
                </h2>
                <div className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                  isSunlight ? 'bg-blue-600 text-white' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  Clave
                </div>
              </div>
              {acordeones.DESARROLLO ? (
                <ChevronUp className={`w-5 h-5 ${isSunlight ? 'text-blue-700' : 'text-blue-400'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${isSunlight ? 'text-blue-700' : 'text-blue-400'}`} />
              )}
            </button>
            
            {acordeones.DESARROLLO && (
              <div className={`p-4 border-t animate-fadeIn ${
                isSunlight ? 'bg-white border-slate-200' : 'bg-[#0c1322] border-slate-800/80'
              }`}>
                <p className={`text-xs mb-5 font-semibold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Registra tus series. Al completar la última serie, el ejercicio se minimizará automáticamente y podrás editarlo si lo necesitas.
                </p>
                
                {bloqueDesarrollo.ejercicios.map((ejercicio) => (
                  <ExerciseCard
                    key={ejercicio.id}
                    ejercicio={ejercicio}
                    onUpdateEjercicio={handleUpdateEjercicio}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* BOTÓN FINAL DE COMPLETAR O GUARDAR CAMBIOS */}
      <div className="text-center px-4 pt-4 space-y-3">
        {seriesPendientes > 0 && (
          <div className={`text-left flex items-start gap-3 p-3.5 rounded-2xl border ${
            isSunlight
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div className="text-xs sm:text-sm">
              <p className="font-black">
                Te {seriesPendientes === 1 ? 'queda 1 serie' : `quedan ${seriesPendientes} series`} sin guardar.
              </p>
              <p className="font-medium mt-0.5">
                Completalas antes de finalizar para que Matías vea tu entrenamiento completo.
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleFinalizarEntrenamiento}
          className={`w-full py-4 px-6 rounded-2xl text-white font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-target ${
            esModoEdicion
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 shadow-emerald-600/30'
              : 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 shadow-blue-600/30'
          }`}
        >
          {esModoEdicion ? (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Cambios de {rutina.nombre.split(':')[0] || 'la Sesión'}</span>
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5" />
              <span>Finalizar y Guardar Entrenamiento de Hoy</span>
            </>
          )}
        </button>

        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className={`text-xs font-bold py-2 transition-colors touch-target ${
              isSunlight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Guardar y volver al cronograma semanal
          </button>
        )}
      </div>

      {/* MODAL CHECK-IN PRE-ENTRENAMIENTO (1 CLIC) */}
      <PreWorkoutModal
        isOpen={mostrarModalPre}
        onClose={() => setMostrarModalPre(false)}
        onSubmit={handleGuardarPreWorkout}
        nombreRutina={rutina.nombre}
      />

      {/* MODAL CHECK-OUT POST-ENTRENAMIENTO (RPE E IMPACTO ANÍMICO) */}
      <PostWorkoutModal
        isOpen={mostrarModalPost}
        onClose={() => setMostrarModalPost(false)}
        onSubmit={handleGuardarPostWorkout}
        nombreRutina={rutina.nombre}
        guardando={guardandoPost}
      />

      {/* RECORDATORIO: SERIES PENDIENTES ANTES DE FINALIZAR */}
      {mostrarAvisoSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border relative ${
            isSunlight ? 'bg-white border-amber-300 text-slate-900' : 'bg-[#0c1322] border-amber-500/40 text-white'
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-black ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
              Te {seriesPendientes === 1 ? 'queda 1 serie' : `quedan ${seriesPendientes} series`} por completar
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
              Todavía hay series sin guardar en el bloque de Desarrollo. Si finalizás ahora, esas series quedarán vacías en tu planilla.
            </p>
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => setMostrarAvisoSeries(false)}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 hover:from-blue-600 hover:to-sky-400 text-white font-black text-sm shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                Volver y completar las series
              </button>
              <button
                type="button"
                onClick={continuarFinalizacion}
                className={`w-full py-3 px-5 rounded-2xl font-bold text-xs border transition-colors ${
                  isSunlight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Finalizar de todos modos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
