/**
 * ========================================================================
 * ENDPOINT API: Check-in Pre y Post Entrenamiento (app/api/entrenamiento/checkin/route.js)
 * ========================================================================
 * Registra las respuestas rápidas de 1 clic del alumno:
 * - Pre: nivel de energía (1 a 5), estado de ánimo/estrés (1 a 5), descanso anoche.
 * - Post: impacto anímico, esfuerzo percibido (RPE 1 al 10), desahogo mental.
 * 
 * Persiste tanto en el almacén en memoria (fallbackStore) para reflejar las alertas
 * en el panel del profesor de inmediato, como en PostgreSQL vía Prisma si está disponible.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { registrarCheckinEnStore } from '@/lib/fallbackStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      rutinaId,
      alumnoId = 'demo-alumno-1',
      tipo, // 'PRE' o 'POST'
      energiaInicial,
      animoInicial,
      descansoInicial,
      animoFinal,
      esfuerzoFinal,
      desahogoFinal,
    } = body;

    // Detectar fatiga inmediata:
    // Pre-entreno: Energía <= 2 (Agotado o Bajo), Ánimo <= 2 (Muy estresado o Desmotivado), Descanso 'Mal'
    // Post-entreno: RPE >= 9 (esfuerzo extremo), Ánimo empeoró (1), Desahogo negativo
    const esFatigaPre =
      (energiaInicial !== undefined && Number(energiaInicial) <= 2) ||
      (animoInicial !== undefined && Number(animoInicial) <= 2) ||
      descansoInicial === 'Mal';

    const esFatigaPost =
      (esfuerzoFinal !== undefined && Number(esfuerzoFinal) >= 9) ||
      (animoFinal !== undefined && Number(animoFinal) === 1) ||
      desahogoFinal === 'No, sigo a mil';

    const esFatiga = esFatigaPre || esFatigaPost;

    // 1. Guardar SIEMPRE en fallbackStore para que el Dashboard del entrenador
    // lea inmediatamente la fatiga y el historial sin demoras ni fallos de red
    const checkinEnStore = registrarCheckinEnStore(alumnoId, rutinaId, {
      tipo,
      energiaInicial,
      animoInicial,
      descansoInicial,
      animoFinal,
      esfuerzoFinal,
      desahogoFinal,
    });

    // 2. Intentar persistir en PostgreSQL (Prisma) si la base de datos está conectada
    try {
      if (rutinaId) {
        const updateData = {};
        if (tipo === 'PRE' || energiaInicial !== undefined) {
          if (energiaInicial !== undefined) updateData.energiaInicial = parseInt(energiaInicial, 10);
          if (animoInicial !== undefined) updateData.animoInicial = parseInt(animoInicial, 10);
          if (descansoInicial !== undefined) updateData.descansoInicial = descansoInicial;
        }

        if (tipo === 'POST' || esfuerzoFinal !== undefined) {
          if (animoFinal !== undefined) updateData.animoFinal = parseInt(animoFinal, 10);
          if (esfuerzoFinal !== undefined) updateData.esfuerzoFinal = parseInt(esfuerzoFinal, 10);
          if (desahogoFinal !== undefined) updateData.desahogoFinal = desahogoFinal;
          updateData.fechaCompletada = new Date();
          updateData.estado = 'COMPLETADA';
        }

        await prisma.rutina.update({
          where: { id: rutinaId },
          data: updateData,
        });
      }

      // Registrar también en el historial de RutinaRealizada
      if (prisma.rutinaRealizada) {
        await prisma.rutinaRealizada.create({
          data: {
            rutinaId: rutinaId || null,
            alumnoId: alumnoId || 'demo-alumno-1',
            energiaInicial: energiaInicial ? parseInt(energiaInicial, 10) : null,
            animoInicial: animoInicial ? parseInt(animoInicial, 10) : null,
            descansoInicial: descansoInicial || null,
            animoFinal: animoFinal ? parseInt(animoFinal, 10) : null,
            esfuerzoFinal: esfuerzoFinal ? parseInt(esfuerzoFinal, 10) : null,
            desahogoFinal: desahogoFinal || null,
            alertaFatiga: esFatiga,
          },
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ No se pudo persistir check-in en PostgreSQL (usando fallbackStore):', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      mensaje: tipo === 'PRE' ? '¡Check-in pre-entreno registrado!' : '¡Check-out guardado con éxito!',
      alertaFatiga: esFatiga,
      data: checkinEnStore,
    });
  } catch (error) {
    console.error('❌ Error al procesar check-in:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el check-in' },
      { status: 500 }
    );
  }
}
