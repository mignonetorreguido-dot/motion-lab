/**
 * ========================================================================
 * SCRIPT DE SEMILLA (prisma/seed.js)
 * ========================================================================
 * Inicializa la base de datos MySQL en Railway con:
 * 1. Usuario Entrenador (Matías).
 * 2. Alumno de prueba con estado de pago ACTIVO.
 * 3. Rutina activa de 3 bloques (Movilidad, Activación, Desarrollo).
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando datos en la base de datos de Railway...');

  // 1. Crear o actualizar Entrenador Matías
  const matias = await prisma.usuario.upsert({
    where: { email: 'matias@motionlab.com' },
    update: {},
    create: {
      id: 'matias-coach-id',
      nombre: 'Matías',
      apellido: 'Entrenador',
      email: 'matias@motionlab.com',
      rol: 'ENTRENADOR',
      whatsapp: '5493624654911',
      estadoPago: 'ACTIVO',
      tipoPlan: 'PREMIUM',
    },
  });
  console.log('✅ Entrenador creado:', matias.email);

  // 2. Crear alumno demo
  const alumno = await prisma.usuario.upsert({
    where: { email: 'alumno@motionlab.com' },
    update: {},
    create: {
      id: 'demo-alumno-1',
      nombre: 'Lucas',
      apellido: 'González',
      email: 'alumno@motionlab.com',
      rol: 'ALUMNO',
      whatsapp: '5491100000000',
      peso: 76.5,
      altura: 178,
      estadoPago: 'ACTIVO',
      tipoPlan: 'PREMIUM',
      perfilDeportivo: {
        create: {
          objetivo: 'Fuerza & Rendimiento',
          deporte: 'Fútbol',
          club: true,
          nivel: 'Intermedio',
          focos: 'Fuerza, Velocidad',
          disponibilidad: '4 días',
          rmEstimado: 'Sentadilla 110kg, Banco 85kg',
        },
      },
    },
  });
  console.log('✅ Alumno demo creado:', alumno.email);

  // 3. Crear Rutina Activa en 3 Bloques
  const rutinaExistente = await prisma.rutina.findFirst({
    where: { alumnoId: alumno.id, estado: 'ACTIVA' },
  });

  if (!rutinaExistente) {
    const nuevaRutina = await prisma.rutina.create({
      data: {
        nombre: 'Día 1: Tren Inferior & Fuerza Unilateral',
        descripcion: 'Dominante de rodilla, cuádriceps, glúteos y potencia reactiva',
        estado: 'ACTIVA',
        alumnoId: alumno.id,
        entrenadorId: matias.id,
        bloques: {
          create: [
            // BLOQUE 1: MOVILIDAD
            {
              tipo: 'MOVILIDAD',
              orden: 1,
              ejercicios: {
                create: [
                  {
                    nombre: 'Dorsiflexión de Tobillo contra pared',
                    indicacionProfe: '2 series x 10 oscilaciones lentas por pierna sin despegar el talón.',
                    completado: true,
                  },
                  {
                    nombre: 'Rotaciones 90/90 de Cadera',
                    indicacionProfe: '2 series x 8 transiciones manteniendo el pecho erguido.',
                    completado: true,
                  },
                  {
                    nombre: 'Gato-Camello con disociación escapular',
                    indicacionProfe: '10 repeticiones fluidas al compás de la respiración.',
                    completado: false,
                  },
                ],
              },
            },
            // BLOQUE 2: ACTIVACIÓN
            {
              tipo: 'ACTIVACION',
              orden: 2,
              ejercicios: {
                create: [
                  {
                    nombre: 'Puente de Glúteo Unilateral con banda',
                    indicacionProfe: '3 series x 12 reps con 2s de pausa arriba.',
                    completado: false,
                  },
                  {
                    nombre: 'Saltos reactivos al cajón bajo',
                    indicacionProfe: '3 series x 4 saltos con aterrizaje silencioso.',
                    completado: false,
                  },
                ],
              },
            },
            // BLOQUE 3: DESARROLLO
            {
              tipo: 'DESARROLLO',
              orden: 3,
              ejercicios: {
                create: [
                  {
                    nombre: 'Sentadilla Trasera con Barra (Back Squat)',
                    indicacionProfe: '3 series x 8 reps | RIR Objetivo: 2 | Descanso: 2:30 min | Tempo 3-0-1-0',
                    rirObjetivo: 2,
                    observacion: 'Sentí buena profundidad en la serie 2.',
                    completado: false,
                    series: {
                      create: [
                        { numeroSerie: 1, repsRealizadas: 8, cargaKg: 80, rir: 3, rpe: 7.0, completado: true },
                        { numeroSerie: 2, repsRealizadas: 8, cargaKg: 85, rir: 2, rpe: 8.0, completado: true },
                        { numeroSerie: 3, repsRealizadas: 8, cargaKg: 85, rir: 2, rpe: 8.5, completado: false },
                      ],
                    },
                  },
                  {
                    nombre: 'Empuje de Cadera con Barra (Barbell Hip Thrust)',
                    indicacionProfe: '3 series x 10 reps | RIR Objetivo: 2 | Pausa 1 seg arriba',
                    rirObjetivo: 2,
                    completado: false,
                    series: {
                      create: [
                        { numeroSerie: 1, repsRealizadas: 10, cargaKg: 100, rir: 2, rpe: 8.0, completado: false },
                        { numeroSerie: 2, repsRealizadas: 10, cargaKg: 105, rir: 2, rpe: 8.5, completado: false },
                        { numeroSerie: 3, repsRealizadas: 10, cargaKg: 110, rir: 1, rpe: 9.0, completado: false },
                      ],
                    },
                  },
                  {
                    nombre: 'Estocada Búlgara con Mancuernas',
                    indicacionProfe: '3 series x 8 reps por pierna | RIR: 1-2 | Descanso: 90s',
                    rirObjetivo: 2,
                    completado: false,
                    series: {
                      create: [
                        { numeroSerie: 1, repsRealizadas: 8, cargaKg: 20, rir: 2, rpe: 8.0, completado: false },
                        { numeroSerie: 2, repsRealizadas: 8, cargaKg: 20, rir: 2, rpe: 8.5, completado: false },
                        { numeroSerie: 3, repsRealizadas: 8, cargaKg: 22, rir: 1, rpe: 9.0, completado: false },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('✅ Rutina de 3 bloques asignada exitosamente:', nuevaRutina.nombre);
  }

  console.log('✨ Base de datos en Railway inicializada al 100%.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
