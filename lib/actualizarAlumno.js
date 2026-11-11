import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ALUMNOS_DEMO } from '@/lib/demoAlumnos';
import {
  guardarAlumnoEnStore,
  obtenerAlumnoDeStore,
  obtenerRutinasDeStore,
} from '@/lib/fallbackStore';

function numeroONull(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = Number.parseFloat(String(valor).replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

function texto(valor) {
  return valor === null || valor === undefined ? '' : String(valor);
}

/**
 * Actualiza la ficha de un alumno.
 * - Con DATABASE_URL usa PostgreSQL/Prisma.
 * - Sin base de datos (modo demo) guarda los cambios en fallbackStore.
 *
 * Devuelve el alumno actualizado con la misma forma que consume el panel.
 */
export async function actualizarAlumno(alumnoId, data = {}) {
  if (!alumnoId) {
    return { success: false, error: 'Falta el identificador del alumno' };
  }

  const {
    nombre, apellido, email, password, whatsapp, peso, altura, lesiones, estadoPago, tipoPlan,
    objetivo, deporte, club, nivel, focos, disponibilidad, rmEstimado, puntosDebiles
  } = data;

  // Datos que se comparten entre PostgreSQL y el modo demo
  const perfil = {
    objetivo: objetivo || 'Rendimiento',
    deporte: deporte || 'Fitness General',
    club: club === true || club === 'true',
    nivel: nivel || 'Principiante',
    focos: focos || 'General',
    disponibilidad: disponibilidad || '3 días',
    rmEstimado: rmEstimado || '',
    puntosDebiles: puntosDebiles || '',
  };

  // Preparar campos para actualizar el usuario base
  const updateData = {
    nombre: texto(nombre),
    apellido: texto(apellido),
    email: texto(email).toLowerCase().trim(),
    whatsapp: texto(whatsapp),
  };

  // Si se proporciona una contraseña, actualizarla
  if (password && password.trim() !== '') {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  // 1. Intentar guardar en PostgreSQL cuando la base de datos está configurada
  if (process.env.DATABASE_URL) {
    try {
      const alumnoActualizado = await prisma.usuario.update({
        where: { id: alumnoId },
        data: {
          ...updateData,
          peso: numeroONull(peso),
          altura: numeroONull(altura),
          lesiones: texto(lesiones),
          estadoPago: estadoPago || 'PENDIENTE',
          tipoPlan: tipoPlan || 'BASE',
          perfilDeportivo: {
            upsert: {
              create: perfil,
              update: perfil,
            },
          },
        },
        include: {
          perfilDeportivo: true,
          rutinasComoAlumno: {
            where: { estado: 'ACTIVA' },
            select: { id: true, nombre: true, fechaAsignada: true },
          },
        },
      });

      return { success: true, alumno: alumnoActualizado };
    } catch (error) {
      console.warn('⚠️ No se pudo actualizar el alumno en PostgreSQL (se usará modo demo):', error.message);
    }
  }

  // 2. Respaldo en memoria para que la ficha siga siendo editable sin PostgreSQL
  const base = ALUMNOS_DEMO.find((alumno) => alumno.id === alumnoId) || {};
  const anterior = obtenerAlumnoDeStore(alumnoId) || {};

  const alumnoActualizado = {
    ...base,
    ...anterior,
    id: alumnoId,
    nombre: updateData.nombre || anterior.nombre || base.nombre || 'Sin Nombre',
    apellido: updateData.apellido,
    email: updateData.email || anterior.email || base.email || '',
    whatsapp: updateData.whatsapp,
    peso: numeroONull(peso),
    altura: numeroONull(altura),
    lesiones: texto(lesiones),
    estadoPago: estadoPago || anterior.estadoPago || base.estadoPago || 'PENDIENTE',
    tipoPlan: tipoPlan || anterior.tipoPlan || base.tipoPlan || 'BASE',
    perfilDeportivo: {
      ...(base.perfilDeportivo || {}),
      ...(anterior.perfilDeportivo || {}),
      ...perfil,
    },
    checkins: anterior.checkins || base.checkins || [],
    alertaBienestar: anterior.alertaBienestar || base.alertaBienestar || 'VERDE',
    consecutivosFatiga: anterior.consecutivosFatiga ?? base.consecutivosFatiga ?? 0,
    sesionesBaseline: anterior.sesionesBaseline ?? base.sesionesBaseline ?? 0,
    sesionesCompletadas: anterior.sesionesCompletadas ?? base.sesionesCompletadas ?? 0,
    rutinasComoAlumno: (obtenerRutinasDeStore(alumnoId) || []).map((rutina) => ({
      id: rutina.id,
      nombre: rutina.nombre,
      fechaAsignada: rutina.createdAt || null,
      estado: rutina.estado || 'ACTIVA',
    })),
    createdAt: anterior.createdAt || base.createdAt || new Date().toISOString(),
  };

  guardarAlumnoEnStore(alumnoId, {
    nombre: alumnoActualizado.nombre,
    apellido: alumnoActualizado.apellido,
    email: alumnoActualizado.email,
    whatsapp: alumnoActualizado.whatsapp,
    peso: alumnoActualizado.peso,
    altura: alumnoActualizado.altura,
    lesiones: alumnoActualizado.lesiones,
    estadoPago: alumnoActualizado.estadoPago,
    tipoPlan: alumnoActualizado.tipoPlan,
    perfilDeportivo: alumnoActualizado.perfilDeportivo,
    checkins: alumnoActualizado.checkins,
    alertaBienestar: alumnoActualizado.alertaBienestar,
    consecutivosFatiga: alumnoActualizado.consecutivosFatiga,
    sesionesBaseline: alumnoActualizado.sesionesBaseline,
    sesionesCompletadas: alumnoActualizado.sesionesCompletadas,
    createdAt: alumnoActualizado.createdAt,
  });

  return { success: true, alumno: alumnoActualizado };
}
