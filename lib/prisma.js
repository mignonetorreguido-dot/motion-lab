/**
 * ========================================================================
 * CLIENTE SINGLETON DE PRISMA (lib/prisma.js)
 * ========================================================================
 * Este archivo centraliza la instancia de Prisma Client para toda la app.
 * 
 * ¿POR QUÉ SE USA 'globalThis'?
 * En Next.js, cuando guardamos un archivo en desarrollo, Next recarga los módulos
 * (Hot Reload). Si creáramos 'new PrismaClient()' en cada archivo, se abrirían
 * decenas de conexiones a MySQL simultáneas hasta saturar la base de datos de Railway.
 * Al guardarlo en 'globalThis.prisma', reutilizamos la misma conexión activa siempre.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
