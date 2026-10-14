'use client';

/**
 * ========================================================================
 * COMPONENTE: Contenedor Principal de Entrenamiento (components/training/TrainingContainer.js)
 * ========================================================================
 * - Orquesta la navegación entre el Hub Semanal y la Planilla Activa.
 * - Persiste en memoria y localStorage los días completados y las series guardadas.
 * - Al finalizar un día:
 *   1. Lo marca como 'COMPLETADO'.
 *   2. Guarda las series, cargas y notas registradas para poder editarlas luego.
 *   3. Avanza automáticamente el día sugerido ("SUGERIDO PARA HOY") al próximo día disponible.
 */

import { useState, useEffect } from 'react';
import StudentHub from './StudentHub';
import WorkoutView from './WorkoutView';

const STORAGE_PLAN_KEY = 'motion_lab_plan_semanal_v2';
const STORAGE_RUTINAS_KEY = 'motion_lab_rutinas_guardadas_v2';
const STORAGE_DIA_HOY_KEY = 'motion_lab_dia_hoy_v2';

export default function TrainingContainer({ alumnoId = 'demo-alumno-1' }) {
  const [diaSeleccionadoId, setDiaSeleccionadoId] = useState(null);
  const [planSemanal, setPlanSemanal] = useState([]);
  const [rutinasGuardadas, setRutinasGuardadas] = useState({});
  const [diaHoyId, setDiaHoyId] = useState('dia-1');
  const [cargando, setCargando] = useState(true);

  // Cargar estado inicial desde localStorage o desde la API
  useEffect(() => {
    async function cargarPlan() {
      try {
        let planLocal = null;
        let rutinasLocal = null;
        let diaHoyLocal = null;

        if (typeof window !== 'undefined') {
          try {
            const rawPlan = localStorage.getItem(STORAGE_PLAN_KEY);
            const rawRutinas = localStorage.getItem(STORAGE_RUTINAS_KEY);
            const rawDiaHoy = localStorage.getItem(STORAGE_DIA_HOY_KEY);

            if (rawPlan) planLocal = JSON.parse(rawPlan);
            if (rawRutinas) rutinasLocal = JSON.parse(rawRutinas);
            if (rawDiaHoy) diaHoyLocal = rawDiaHoy;
          } catch (e) {
            console.error('Error leyendo de localStorage:', e);
          }
        }

        // Consultamos la API base
        const res = await fetch(`/api/rutinas?alumnoId=${alumnoId}`);
        const data = await res.json();

        if (data.success) {
          // Si ya teníamos progreso guardado localmente, lo respetamos
          if (planLocal && planLocal.length > 0) {
            setPlanSemanal(planLocal);
          } else if (data.planSemanal) {
            setPlanSemanal(data.planSemanal);
          }

          if (rutinasLocal) {
            setRutinasGuardadas(rutinasLocal);
          }

          if (diaHoyLocal) {
            setDiaHoyId(diaHoyLocal);
          } else if (data.diaHoyId) {
            setDiaHoyId(data.diaHoyId);
          }
        }
      } catch (err) {
        console.error('Error cargando plan semanal:', err);
      } finally {
        setCargando(false);
      }
    }
    cargarPlan();
  }, [alumnoId]);

  // Manejar cuando el alumno finaliza o guarda un día de entrenamiento
  const handleFinalizarDia = (rutinaActualizada) => {
    if (!diaSeleccionadoId) return;

    // 1. Guardar la rutina en el diccionario de rutinas guardadas
    const nuevasRutinas = {
      ...rutinasGuardadas,
      [diaSeleccionadoId]: rutinaActualizada,
    };
    setRutinasGuardadas(nuevasRutinas);

    // 2. Marcar el día como COMPLETADO en el cronograma semanal y registrar sus check-ins
    const nuevoPlan = planSemanal.map((dia) => {
      if (dia.id === diaSeleccionadoId) {
        return { 
          ...dia, 
          estado: 'COMPLETADO',
          energiaInicial: rutinaActualizada.energiaInicial,
          animoInicial: rutinaActualizada.animoInicial,
          descansoInicial: rutinaActualizada.descansoInicial,
          animoFinal: rutinaActualizada.animoFinal,
          esfuerzoFinal: rutinaActualizada.esfuerzoFinal,
          desahogoFinal: rutinaActualizada.desahogoFinal,
          fechaCompletada: rutinaActualizada.fechaCompletada,
        };
      }
      return dia;
    });
    setPlanSemanal(nuevoPlan);

    // 3. Calcular el próximo día sugerido (el primer día no completado en secuencia)
    const proximoDiaNoCompletado = nuevoPlan.find((dia) => dia.estado !== 'COMPLETADO');
    const nuevoDiaHoy = proximoDiaNoCompletado ? proximoDiaNoCompletado.id : nuevoPlan[0]?.id;
    setDiaHoyId(nuevoDiaHoy);

    // 4. Persistir en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PLAN_KEY, JSON.stringify(nuevoPlan));
        localStorage.setItem(STORAGE_RUTINAS_KEY, JSON.stringify(nuevasRutinas));
        localStorage.setItem(STORAGE_DIA_HOY_KEY, nuevoDiaHoy);
      } catch (e) {
        console.error('Error guardando en localStorage:', e);
      }
    }

    // 5. Volver al Hub Semanal
    setDiaSeleccionadoId(null);
  };

  // Función para reiniciar el progreso de prueba
  const handleReiniciarProgreso = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_PLAN_KEY);
      localStorage.removeItem(STORAGE_RUTINAS_KEY);
      localStorage.removeItem(STORAGE_DIA_HOY_KEY);
    }
    const planReiniciado = planSemanal.map((dia, idx) => ({
      ...dia,
      estado: idx === 0 ? 'HOY' : 'PENDIENTE',
    }));
    setPlanSemanal(planReiniciado);
    setRutinasGuardadas({});
    setDiaHoyId('dia-1');
  };

  if (cargando) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-20 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-sm">Cargando tu cronograma de entrenamiento...</p>
      </div>
    );
  }

  // 1. Si no hay día seleccionado, mostrar el Hub Semanal
  if (!diaSeleccionadoId) {
    return (
      <StudentHub
        planSemanal={planSemanal}
        diaHoyId={diaHoyId}
        onSeleccionarDia={(id) => setDiaSeleccionadoId(id)}
        onReiniciarProgreso={handleReiniciarProgreso}
      />
    );
  }

  // 2. Si se seleccionó un día, abrir la planilla interactiva de ese día
  const diaSeleccionado = planSemanal.find((d) => d.id === diaSeleccionadoId);
  const esModoEdicion = diaSeleccionado?.estado === 'COMPLETADO';
  const rutinaInicial = rutinasGuardadas[diaSeleccionadoId] || null;

  return (
    <WorkoutView
      alumnoId={alumnoId}
      diaId={diaSeleccionadoId}
      rutinaInicial={rutinaInicial}
      esModoEdicion={esModoEdicion}
      onFinalizar={handleFinalizarDia}
      onVolver={() => setDiaSeleccionadoId(null)}
    />
  );
}
