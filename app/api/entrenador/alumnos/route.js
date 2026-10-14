/**
 * ========================================================================
 * ENDPOINT API: Lista de Alumnos para el Entrenador (app/api/entrenador/alumnos/route.js)
 * ========================================================================
 * Permite a Matías consultar todos los alumnos registrados, su perfil deportivo,
 * plan seleccionado (BASE / PREMIUM) y estado de pago (PENDIENTE / ACTIVO).
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    let alumnos = [];

    try {
      alumnos = await prisma.usuario.findMany({
        where: { rol: 'ALUMNO' },
        include: {
          perfilDeportivo: true,
          rutinasComoAlumno: {
            select: { 
              id: true, 
              nombre: true, 
              fechaAsignada: true,
              estado: true,
              energiaInicial: true,
              animoInicial: true,
              descansoInicial: true,
              animoFinal: true,
              esfuerzoFinal: true,
              desahogoFinal: true,
              fechaCompletada: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calcular alertas de fatiga para alumnos reales
      alumnos = alumnos.map((alumno) => {
        const rutinas = alumno.rutinasComoAlumno || [];
        const checkinsValidos = rutinas.filter((r) => r.energiaInicial || r.animoInicial);
        let fatigaConsecutiva = 0;
        for (const c of checkinsValidos) {
          if (c.energiaInicial <= 1 || c.animoInicial <= 1) {
            fatigaConsecutiva++;
          } else {
            break;
          }
        }
        let alertaBienestar = 'VERDE';
        if (fatigaConsecutiva >= 3) {
          alertaBienestar = 'ROJA';
        } else if (fatigaConsecutiva > 0 || (checkinsValidos[0] && (checkinsValidos[0].energiaInicial <= 2 || checkinsValidos[0].animoInicial <= 2))) {
          alertaBienestar = 'AMARILLA';
        }

        return {
          ...alumno,
          alertaBienestar,
          consecutivosFatiga: fatigaConsecutiva,
          checkins: checkinsValidos,
        };
      });
    } catch (dbErr) {
      console.warn('⚠️ No se pudo consultar alumnos en MySQL (modo demo):', dbErr.message);
    }

    // Datos de demostración si la base de datos está vacía o sin inicializar
    if (!alumnos || alumnos.length === 0) {
      alumnos = [
        {
          id: 'demo-alumno-1',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@ejemplo.com',
          whatsapp: '+54 9 11 5555-0101',
          peso: 78.5,
          altura: 178,
          lesiones: 'Molestia leve en rodilla derecha al bajar de 90°',
          estadoPago: 'PENDIENTE',
          tipoPlan: 'PREMIUM',
          createdAt: new Date().toISOString(),
          // Alerta Roja: 3 clases seguidas reportando Agotado o Muy Estresado
          alertaBienestar: 'ROJA',
          consecutivosFatiga: 3,
          checkins: [
            {
              clase: 'Clase 3 (Ayer)',
              fecha: '2026-10-13',
              energiaInicial: 1, // Agotado
              animoInicial: 1, // Muy estresado
              descansoInicial: 'Mal',
              esfuerzoFinal: 9,
              animoFinal: 1, // Peor
              desahogoFinal: 'No, sigo a mil',
            },
            {
              clase: 'Clase 2 (Hace 3 días)',
              fecha: '2026-10-11',
              energiaInicial: 1, // Agotado
              animoInicial: 2, // Desmotivado
              descansoInicial: 'Mal',
              esfuerzoFinal: 8,
              animoFinal: 2, // Igual
              desahogoFinal: 'Un poco',
            },
            {
              clase: 'Clase 1 (Hace 5 días)',
              fecha: '2026-10-09',
              energiaInicial: 1, // Agotado
              animoInicial: 1, // Muy estresado
              descansoInicial: 'Regular',
              esfuerzoFinal: 9,
              animoFinal: 1, // Peor
              desahogoFinal: 'No, sigo a mil',
            },
          ],
          perfilDeportivo: {
            objetivo: 'Rendimiento',
            deporte: 'Fútbol',
            club: true,
            nivel: 'Intermedio',
            focos: 'Fuerza, Velocidad',
            disponibilidad: '4 días',
            rmEstimado: 'Sentadilla 110kg, Banco 85kg',
            puntosDebiles: 'Potencia de arranque y estabilidad unilateral',
          },
          rutinasComoAlumno: [],
        },
        {
          id: 'demo-alumno-2',
          nombre: 'Lucía',
          apellido: 'Fernández',
          email: 'lucia.f@ejemplo.com',
          whatsapp: '+54 9 11 5555-0202',
          peso: 62.0,
          altura: 165,
          lesiones: 'Sin lesiones',
          estadoPago: 'ACTIVO',
          tipoPlan: 'BASE',
          createdAt: new Date().toISOString(),
          // Alerta Verde: óptimo descanso y energía
          alertaBienestar: 'VERDE',
          consecutivosFatiga: 0,
          checkins: [
            {
              clase: 'Clase 2 (Ayer)',
              fecha: '2026-10-13',
              energiaInicial: 5, // A tope
              animoInicial: 5, // Excelente
              descansoInicial: 'Excelente',
              esfuerzoFinal: 8,
              animoFinal: 3, // Mucho mejor
              desahogoFinal: 'Sí, totalmente',
            },
            {
              clase: 'Clase 1 (Hace 3 días)',
              fecha: '2026-10-10',
              energiaInicial: 4, // Con ganas
              animoInicial: 4, // Bien
              descansoInicial: 'Bien',
              esfuerzoFinal: 7,
              animoFinal: 3, // Mucho mejor
              desahogoFinal: 'Sí, totalmente',
            },
          ],
          perfilDeportivo: {
            objetivo: 'Estética',
            deporte: 'Fitness General',
            club: false,
            nivel: 'Principiante',
            focos: 'Fuerza, Resistencia',
            disponibilidad: '3 días',
            rmEstimado: null,
            puntosDebiles: null,
          },
          rutinasComoAlumno: [
            {
              id: 'rutina-demo-1',
              nombre: 'Mesociclo 1 - Adaptación Anatómica',
              fechaAsignada: new Date().toISOString(),
            },
          ],
        },
        {
          id: 'demo-alumno-3',
          nombre: 'Martín',
          apellido: 'Benítez',
          email: 'martin.b@ejemplo.com',
          whatsapp: '+54 9 11 5555-0303',
          peso: 82.0,
          altura: 181,
          lesiones: 'Sobrecarga en lumbares tras partidos de fin de semana',
          estadoPago: 'ACTIVO',
          tipoPlan: 'PREMIUM',
          createdAt: new Date().toISOString(),
          // Alerta Amarilla: 1 clase reciente de bajo descanso / estrés
          alertaBienestar: 'AMARILLA',
          consecutivosFatiga: 1,
          checkins: [
            {
              clase: 'Clase 1 (Ayer)',
              fecha: '2026-10-13',
              energiaInicial: 2, // Bajo
              animoInicial: 2, // Desmotivado
              descansoInicial: 'Mal',
              esfuerzoFinal: 7,
              animoFinal: 2, // Igual
              desahogoFinal: 'Un poco',
            },
          ],
          perfilDeportivo: {
            objetivo: 'Salud y Prevención',
            deporte: 'Básquet',
            club: true,
            nivel: 'Intermedio',
            focos: 'Movilidad, Fuerza Lumbar',
            disponibilidad: '3 días',
            rmEstimado: 'Sentadilla 90kg',
            puntosDebiles: 'Cadena posterior y core anterior',
          },
          rutinasComoAlumno: [],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      total: alumnos.length,
      alumnos,
    });
  } catch (error) {
    console.error('❌ Error al obtener alumnos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener lista de alumnos' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      nombre, apellido, email, password, whatsapp, peso, altura, lesiones, estadoPago, tipoPlan,
      objetivo, deporte, club, nivel, focos, disponibilidad, rmEstimado, puntosDebiles
    } = data;

    // Generar email único si no se provee
    const finalEmail = email || `alumno-${Date.now()}@motionlab.local`;
    
    let passwordHash = null;
    if (password && password.trim() !== '') {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const nuevoAlumno = await prisma.usuario.create({
      data: {
        nombre: nombre || 'Sin Nombre',
        apellido: apellido || '',
        email: finalEmail.toLowerCase().trim(),
        passwordHash,
        whatsapp,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        lesiones,
        estadoPago: estadoPago || 'PENDIENTE',
        tipoPlan: tipoPlan || 'BASE',
        rol: 'ALUMNO',
        perfilDeportivo: {
          create: {
            objetivo: objetivo || 'Rendimiento',
            deporte: deporte || 'Fitness General',
            club: club === 'true' || club === true,
            nivel: nivel || 'Principiante',
            focos: focos || 'General',
            disponibilidad: disponibilidad || '3 días',
            rmEstimado,
            puntosDebiles
          }
        }
      },
      include: {
        perfilDeportivo: true,
        rutinasComoAlumno: {
          where: { estado: 'ACTIVA' },
          select: { id: true, nombre: true, fechaAsignada: true },
        },
      }
    });

    return NextResponse.json({ success: true, alumno: nuevoAlumno });
  } catch (error) {
    console.error('Error al crear alumno:', error);
    return NextResponse.json({ success: false, error: 'Error al crear el alumno' }, { status: 500 });
  }
}

