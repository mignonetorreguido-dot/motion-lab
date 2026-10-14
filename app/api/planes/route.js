/**
 * ========================================================================
 * RUTA DE API: /api/planes (app/api/planes/route.js)
 * ========================================================================
 * Endpoint HTTP tipo GET para consultar la lista de planes disponibles.
 * Intenta leer desde MySQL si está disponible, o devuelve los planes
 * por defecto si aún no se ha inicializado la base de datos.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    try {
      // Intentamos consultar la tabla 'planes' en MySQL
      const planesDb = await query('SELECT * FROM planes ORDER BY id ASC');
      if (planesDb && planesDb.length > 0) {
        return NextResponse.json({ success: true, fuente: 'mysql', data: planesDb });
      }
    } catch (dbErr) {
      console.warn('⚠️ Consultando planes con datos estáticos (MySQL no disponible):', dbErr.message);
    }

    // Datos de respaldo en caso de que la base de datos aún no tenga tablas creadas
    const planesDefault = [
      {
        id: 1,
        nombre: 'Plan Base',
        precio_mensual: 29.99,
        descripcion: 'Ideal para personas que tienen disciplina básica y solo necesitan una rutina estructurada y clara para progresar por su cuenta.',
        es_destacado: false,
        beneficios: [
          'Rutina estructurada mensual (PDF interactivo)',
          'Guía de nutrición deportiva general y recetas',
          'Acceso al grupo exclusivo de alumnos',
          'Actualización de rutina cada 4 semanas',
          'Soporte por email para dudas de ejercicios',
        ],
      },
      {
        id: 2,
        nombre: 'Plan Premium Personalizado',
        precio_mensual: 69.99,
        descripcion: 'La experiencia completa 1 a 1. Rutina y alimentación diseñadas 100% a medida para ti, con acompañamiento diario y máxima precisión.',
        es_destacado: true,
        beneficios: [
          'Planificación 100% personalizada según tus objetivos y lesiones',
          'Cálculo exacto de macronutrientes y calorías diarias',
          'Corrección de técnica mediante videos de tus levantamientos',
          'WhatsApp directo e ilimitado 24/7 con el entrenador',
          'Ajustes semanales según tu progreso en peso y fuerza',
          'Videollamada mensual de revisión y mentalidad',
        ],
      },
    ];

    return NextResponse.json({ success: true, fuente: 'estatico', data: planesDefault });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener los planes' },
      { status: 500 }
    );
  }
}
