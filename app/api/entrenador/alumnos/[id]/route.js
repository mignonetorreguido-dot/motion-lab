import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    const alumnoId = params.id;
    const data = await req.json();

    const {
      nombre, apellido, email, password, whatsapp, peso, altura, lesiones, estadoPago, tipoPlan,
      objetivo, deporte, club, nivel, focos, disponibilidad, rmEstimado, puntosDebiles
    } = data;
    
    // Preparar campos para actualizar el usuario base
    const updateData = {
      nombre,
      apellido,
      email,
      whatsapp,
    };
    
    // Si se proporciona una contraseña, actualizarla
    if (password && password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    const alumnoActualizado = await prisma.usuario.update({
      where: { id: alumnoId },
      data: {
        ...updateData,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        lesiones,
        estadoPago,
        tipoPlan,
        perfilDeportivo: {
          upsert: {
            create: {
              objetivo: objetivo || 'Rendimiento',
              deporte: deporte || 'Fitness General',
              club: club || false,
              nivel: nivel || 'Principiante',
              focos: focos || 'General',
              disponibilidad: disponibilidad || '3 días',
              rmEstimado,
              puntosDebiles
            },
            update: {
              objetivo,
              deporte,
              club,
              nivel,
              focos,
              disponibilidad,
              rmEstimado,
              puntosDebiles
            }
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

    return NextResponse.json({ success: true, alumno: alumnoActualizado });
  } catch (error) {
    console.error('Error al actualizar alumno:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar el alumno' }, { status: 500 });
  }
}
