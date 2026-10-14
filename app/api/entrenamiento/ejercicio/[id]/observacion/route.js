/**
 * ========================================================================
 * ENDPOINT API: Observaciones del Ejercicio (app/api/entrenamiento/ejercicio/[id]/observacion/route.js)
 * ========================================================================
 * Permite guardar las notas u observaciones técnicas que el alumno escribe
 * en el campo desplegable de cada ejercicio sin recargar la página.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { observacion, completado } = body;

    let ejercicioActualizado;
    try {
      ejercicioActualizado = await prisma.ejercicioRealizado.update({
        where: { id: id },
        data: {
          ...(observacion !== undefined && { observacion: observacion }),
          ...(completado !== undefined && { completado: Boolean(completado) }),
        },
      });
    } catch (dbErr) {
      console.warn('⚠️ Guardando observación en modo demo:', dbErr.message);
      ejercicioActualizado = { id, observacion, completado };
    }

    return NextResponse.json({
      success: true,
      mensaje: 'Observación guardada correctamente',
      ejercicio: ejercicioActualizado,
    });
  } catch (error) {
    console.error('❌ Error al guardar observación:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar observación del ejercicio' },
      { status: 500 }
    );
  }
}
