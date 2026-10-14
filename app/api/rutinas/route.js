/**
 * ========================================================================
 * ENDPOINT API: Rutinas en 3 Bloques y Plan Semanal (app/api/rutinas/route.js)
 * ========================================================================
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ------------------------------------------------------------------------
// GET: Obtener las rutinas activas del alumno para armar el plan semanal
// ------------------------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const alumnoId = searchParams.get('alumnoId');
    const diaId = searchParams.get('diaId');

    let rutinasActivas = [];

    if (alumnoId) {
      try {
        rutinasActivas = await prisma.rutina.findMany({
          where: {
            alumnoId: alumnoId,
            estado: 'ACTIVA',
          },
          orderBy: {
            createdAt: 'asc', // Ordenar por creación para tener Día 1, Día 2...
          },
          include: {
            bloques: {
              orderBy: { orden: 'asc' },
              include: {
                ejercicios: {
                  include: {
                    series: {
                      orderBy: { numeroSerie: 'asc' },
                    },
                  },
                },
              },
            },
          },
        });
      } catch (dbErr) {
        console.warn('⚠️ No se pudo consultar rutinas en MySQL:', dbErr.message);
      }
    }

    // Armar la respuesta
    if (rutinasActivas.length > 0) {
      // Si pidió un día en particular, lo buscamos. Si no, usamos el primero.
      let rutinaSeleccionada = rutinasActivas[0];
      if (diaId) {
        const encontrada = rutinasActivas.find(r => r.id === diaId);
        if (encontrada) rutinaSeleccionada = encontrada;
      }

      const planSemanal = rutinasActivas.map((rutina, idx) => ({
        id: rutina.id,
        numeroDia: idx + 1,
        nombre: rutina.nombre,
        enfoque: rutina.descripcion || '',
        duracionMin: 60,
        estado: idx === 0 ? 'HOY' : 'PENDIENTE',
        ejerciciosCount: rutina.bloques.reduce((acc, b) => acc + b.ejercicios.length, 0),
        bloquesCount: rutina.bloques.length,
        // Mantenemos los bloques enteros por si el frontend los usa desde aquí
        bloques: rutina.bloques,
        // Check-in pre y post entrenamiento
        energiaInicial: rutina.energiaInicial,
        animoInicial: rutina.animoInicial,
        descansoInicial: rutina.descansoInicial,
        animoFinal: rutina.animoFinal,
        esfuerzoFinal: rutina.esfuerzoFinal,
        desahogoFinal: rutina.desahogoFinal,
        fechaCompletada: rutina.fechaCompletada,
      }));

      return NextResponse.json({
        success: true,
        rutina: rutinaSeleccionada,
        planSemanal,
        diaHoyId: rutinasActivas[0].id,
      });
    }

    // Fallback: Si no hay rutinas en DB, devolvemos un arreglo vacío
    return NextResponse.json({
      success: true,
      rutina: null,
      planSemanal: [],
      diaHoyId: null,
    });
  } catch (error) {
    console.error('❌ Error al obtener la rutina:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la rutina' },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------------------------
// POST: Asignar o crear una rutina de múltiples días
// ------------------------------------------------------------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const { alumnoId, dias } = body;

    if (!alumnoId || !dias || !Array.isArray(dias)) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios o el formato de "dias" es inválido' },
        { status: 400 }
      );
    }

    try {
      // 1. Marcar las rutinas anteriores como completadas/archivadas
      await prisma.rutina.updateMany({
        where: { alumnoId: alumnoId, estado: 'ACTIVA' },
        data: { estado: 'COMPLETADA' }
      });

      // 2. Insertar los nuevos días
      // Prisma en su versión actual no soporta createMany con nested relations complejas, 
      // así que iteramos y creamos secuencialmente (o en Promise.all)
      const nuevasRutinas = [];
      for (const dia of dias) {
        const rutina = await prisma.rutina.create({
          data: {
            alumnoId,
            entrenadorId: 'matias-coach-id', // ID fijo por ahora
            nombre: dia.nombre,
            descripcion: dia.descripcion,
            bloques: {
              create: dia.bloques.map((bloque, indexBloque) => ({
                tipo: bloque.tipo,
                orden: indexBloque + 1,
                ejercicios: {
                  create: bloque.ejercicios.map((ej) => ({
                    nombre: ej.nombre,
                    indicacionProfe: ej.indicacionProfe,
                    videoUrl: ej.videoUrl,
                    videoRecomendacion: ej.videoRecomendacion,
                    rirObjetivo: ej.rirObjetivo ? parseInt(ej.rirObjetivo) : null,
                    series: {
                      create: (ej.series || []).map((s, idxSerie) => ({
                        numeroSerie: idxSerie + 1,
                        repsRealizadas: s.repsRealizadas ? parseInt(s.repsRealizadas) : null,
                        cargaKg: s.cargaKg ? parseFloat(s.cargaKg) : null,
                        rir: s.rir ? parseInt(s.rir) : null,
                        rpe: s.rpe ? parseFloat(s.rpe) : null,
                        completado: false,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        });
        nuevasRutinas.push(rutina);
      }

      return NextResponse.json({
        success: true,
        mensaje: '¡Plan semanal asignado exitosamente al alumno!',
        rutinas: nuevasRutinas,
      });
    } catch (dbErr) {
      console.warn('⚠️ No se pudo persistir en MySQL:', dbErr.message);
      return NextResponse.json(
        { success: false, error: 'Fallo al guardar en la base de datos', detalle: dbErr.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error al crear la rutina:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al asignar el plan' },
      { status: 500 }
    );
  }
}
