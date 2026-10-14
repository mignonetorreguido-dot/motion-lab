'use client';

/**
 * ========================================================================
 * COMPONENTE: Vista de Entrenamiento del Alumno (components/training/WorkoutView.js)
 * ========================================================================
 * - Soporta navegaciÃ³n multidÃ­a y regreso al cronograma semanal.
 * - Header con progreso en tiempo real y botÃ³n de cambio de dÃ­a.
 * - 3 Bloques colapsables: Movilidad, ActivaciÃ³n, Desarrollo.
 * - Integra ExerciseCard con soporte de auto-minimizaciÃ³n y re-ediciÃ³n.
 * - Permite guardar y finalizar el dÃ­a, actualizando el progreso y avanzando
 *   el sugerido al prÃ³ximo dÃ­a disponible.
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

export default function WorkoutView({ 
  alumnoId = 'demo-alumno-1', 
  diaId = 'dia-1', 
  rutinaInicial = null,
  esModoEdicion = false,
  onFinalizar = null,
  onVolver = null 
}) {
  const [rutina, setRutina] = useState(rutinaInicial);
  const [cargando, setCargando] = useState(!rutinaInicial);
  const [videoActivoId, setVideoActivoId] = useState(null);
  
  // Modales de Check-in Pre y Post entrenamiento (UX rápida de 1 clic)
  const [mostrarModalPre, setMostrarModalPre] = useState(false);
  const [mostrarModalPost, setMostrarModalPost] = useState(false);
  const [guardandoPost, setGuardandoPost] = useState(false);
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

  // Actualizar checkbox de Movilidad o ActivaciÃ³n
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
    
    // Contamos las series de los ejercicios de Desarrollo para la barra de progreso
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
        <p className="text-slate-400 font-medium text-sm">Cargando tu planificaciÃ³n...</p>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-16 p-8 rounded-3xl bg-slate-900 border border-slate-800">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">No se encontrÃ³ esta sesiÃ³n</h3>
        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
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
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#05070c] pb-24 font-sans">
      
      {/* BOTÃ“N REGRESAR AL CRONOGRAMA */}
      {onVolver && (
        <div className="pt-2 pb-3 px-4">
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>â† Cronograma Semanal (Cambiar DÃ­a)</span>
          </button>
        </div>
      )}

      {/* BANNER SI ESTÃ EN MODO EDICIÃ“N */}
      {esModoEdicion && (
        <div className="mx-4 mb-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <Edit3 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Modo EdiciÃ³n: Modificando dÃ­a finalizado</span>
          </div>
          <button
            type="button"
            onClick={handleFinalizarEntrenamiento}
            className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-colors shrink-0"
          >
            Guardar
          </button>
        </div>
      )}

      {/* HEADER: Â¡A entrenar! y Barra de progreso */}
      <div className="pt-3 pb-6 px-4 bg-[#05070c] sticky top-0 z-10 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>{esModoEdicion ? 'Editando SesiÃ³n' : 'Â¡A entrenar!'}</span>
            <span className="text-2xl">{esModoEdicion ? 'âœï¸' : 'ðŸ’ª'}</span>
          </h1>
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1"
              title="Ver otros dÃ­as"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">DÃ­as</span>
            </button>
          )}
        </div>

        <p className="text-slate-400 font-semibold text-xs sm:text-sm mt-1">
          {rutina.nombre}
        </p>
        
        {/* BARRA DE PROGRESO */}
        <div className="mt-5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Progreso de la sesiÃ³n
            </span>
            <span className="text-sm font-black text-blue-400">{progreso}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-500 ease-out" 
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
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <button 
              type="button"
              onClick={() => toggleAcordeon('MOVILIDAD')}
              className="w-full p-5 flex items-center justify-between bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-black flex items-center justify-center border border-sky-500/30">
                  1
                </span>
                <h2 className="text-base font-black text-white uppercase tracking-wide">
                  Movilidad Articular
                </h2>
              </div>
              {acordeones.MOVILIDAD ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            
            {acordeones.MOVILIDAD && (
              <div className="p-4 space-y-3 border-t border-slate-800/80 bg-[#0c1322] animate-fadeIn">
                {bloqueMovilidad.ejercicios.map((ej) => (
                  <div 
                    key={ej.id}
                    onClick={() => toggleCheckMovilidad(ej.id, ej.completado)}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all"
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${ej.completado ? 'bg-emerald-500 border-emerald-500 text-[#0c1322]' : 'border-slate-600 text-transparent'}`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-bold block ${ej.completado ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {ej.nombre}
                      </span>
                      {ej.indicacionProfe && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">{ej.indicacionProfe}</span>
                      )}
                      
                      {(ej.videoUrl || ej.videoRecomendacion) && (
  <div className="mt-2 flex flex-col items-start gap-1.5 w-full">
    {ej.videoUrl && videoActivoId !== ej.id && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setVideoActivoId(ej.id); }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors border border-red-500/20"
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
      <span className="text-[10px] font-medium text-slate-400 bg-slate-800/50 p-1.5 rounded-md border border-slate-700/50">
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

        {/* BLOQUE 2: ACTIVACIÃ“N */}
        {bloqueActivacion && (
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <button 
              type="button"
              onClick={() => toggleAcordeon('ACTIVACION')}
              className="w-full p-5 flex items-center justify-between bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/30">
                  2
                </span>
                <h2 className="text-base font-black text-white uppercase tracking-wide">
                  ActivaciÃ³n & PotenciaciÃ³n
                </h2>
              </div>
              {acordeones.ACTIVACION ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            
            {acordeones.ACTIVACION && (
              <div className="p-4 space-y-3 border-t border-slate-800/80 bg-[#0c1322] animate-fadeIn">
                {bloqueActivacion.ejercicios.map((ej) => (
                  <div 
                    key={ej.id}
                    onClick={() => toggleCheckMovilidad(ej.id, ej.completado)}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all"
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${ej.completado ? 'bg-emerald-500 border-emerald-500 text-[#0c1322]' : 'border-slate-600 text-transparent'}`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <span className={`block text-sm font-bold ${ej.completado ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {ej.nombre}
                      </span>
                      {ej.indicacionProfe && (
                        <span className="block text-xs font-semibold text-sky-400 mt-0.5">{ej.indicacionProfe}</span>
                      )}
                      
                      {(ej.videoUrl || ej.videoRecomendacion) && (
  <div className="mt-2 flex flex-col items-start gap-1.5 w-full">
    {ej.videoUrl && videoActivoId !== ej.id && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setVideoActivoId(ej.id); }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors border border-red-500/20"
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
      <span className="text-[10px] font-medium text-slate-400 bg-slate-800/50 p-1.5 rounded-md border border-slate-700/50">
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

        {/* BLOQUE 3: DESARROLLO (Crucial con auto-minimizaciÃ³n) */}
        {bloqueDesarrollo && (
          <div className="bg-[#0b1220] rounded-2xl border border-slate-800 overflow-hidden shadow-lg border-blue-500/30">
            <button 
              type="button"
              onClick={() => toggleAcordeon('DESARROLLO')}
              className="w-full p-5 flex items-center justify-between bg-gradient-to-r from-blue-900/30 to-slate-900 hover:from-blue-900/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500 text-slate-950 text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-black text-blue-400 uppercase tracking-wide">
                  Desarrollo Principal
                </h2>
                <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded uppercase">
                  Clave
                </div>
              </div>
              {acordeones.DESARROLLO ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
            </button>
            
            {acordeones.DESARROLLO && (
              <div className="p-4 border-t border-slate-800/80 bg-[#0c1322] animate-fadeIn">
                <p className="text-xs text-slate-400 mb-5 font-medium">
                  Registra tus series. Al completar la Ãºltima serie, el ejercicio se minimizarÃ¡ automÃ¡ticamente y podrÃ¡s editarlo si lo necesitas.
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

      {/* BOTÃ“N FINAL DE COMPLETAR O GUARDAR CAMBIOS */}
      <div className="text-center px-4 pt-4 space-y-3">
        <button
          type="button"
          onClick={handleFinalizarEntrenamiento}
          className={`w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] ${
            esModoEdicion
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-blue-500/25'
          }`}
        >
          {esModoEdicion ? (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Cambios de {rutina.nombre.split(':')[0] || 'la SesiÃ³n'}</span>
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
            className="text-xs font-semibold text-slate-400 hover:text-white py-1 transition-colors"
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

    </div>
  );
}

