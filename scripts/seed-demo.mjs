/**
 * Carga inicial de los alumnos reales del panel de Matías en PostgreSQL.
 *
 * Uso local (con DATABASE_URL configurada):
 *   npm run db:seed
 *
 * En Vercel el build no ejecuta este script automáticamente. Se corre una vez
 * desde un entorno con acceso a la base para no duplicar datos en cada deploy.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ALUMNOS_DEMO } from '../lib/demoAlumnos.js';

const prisma = new PrismaClient();

async function main() {
  // Contraseña inicial para los alumnos de la demo. Se puede cambiar desde
  // el panel de Matías cuando se edite la ficha de cada alumno.
  const passwordHash = await bcrypt.hash('alumno123', 10);

  await prisma.usuario.upsert({
    where: { id: 'matias-coach-id' },
    update: {},
    create: {
      id: 'matias-coach-id',
      nombre: 'Matías',
      apellido: 'Entrenador',
      email: 'matias@motionlab.fit',
      rol: 'ENTRENADOR',
      estadoPago: 'ACTIVO',
      tipoPlan: 'PREMIUM',
    },
  });

  for (const alumno of ALUMNOS_DEMO) {
    const perfil = alumno.perfilDeportivo || {};

    const datosPerfil = {
      objetivo: perfil.objetivo || 'Rendimiento',
      deporte: perfil.deporte || 'Fitness General',
      club: Boolean(perfil.club),
      nivel: perfil.nivel || 'Principiante',
      focos: perfil.focos || 'General',
      disponibilidad: perfil.disponibilidad || '3 días',
      rmEstimado: perfil.rmEstimado || null,
      puntosDebiles: perfil.puntosDebiles || null,
    };

    await prisma.usuario.upsert({
      where: { id: alumno.id },
      update: {
        nombre: alumno.nombre,
        apellido: alumno.apellido || '',
        email: alumno.email,
        passwordHash,
        whatsapp: alumno.whatsapp || null,
        peso: alumno.peso || null,
        altura: alumno.altura || null,
        lesiones: alumno.lesiones || null,
        estadoPago: alumno.estadoPago || 'PENDIENTE',
        tipoPlan: alumno.tipoPlan || 'BASE',
        perfilDeportivo: {
          upsert: {
            create: datosPerfil,
            update: datosPerfil,
          },
        },
      },
      create: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido || '',
        email: alumno.email,
        passwordHash,
        whatsapp: alumno.whatsapp || null,
        peso: alumno.peso || null,
        altura: alumno.altura || null,
        lesiones: alumno.lesiones || null,
        estadoPago: alumno.estadoPago || 'PENDIENTE',
        tipoPlan: alumno.tipoPlan || 'BASE',
        rol: 'ALUMNO',
        createdAt: alumno.createdAt ? new Date(alumno.createdAt) : new Date(),
        perfilDeportivo: {
          create: datosPerfil,
        },
      },
    });
  }

  const total = await prisma.usuario.count({ where: { rol: 'ALUMNO' } });
  console.log(`✅ Seed completado. Alumnos en PostgreSQL: ${total}`);
}

main()
  .catch((error) => {
    console.error('❌ Error en el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
