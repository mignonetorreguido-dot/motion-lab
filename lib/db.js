/**
 * ========================================================================
 * MÓDULO DE CONEXIÓN A BASE DE DATOS MYSQL (lib/db.js)
 * ========================================================================
 * Soporta tanto DATABASE_URL (Railway / Prisma) como variables individuales.
 */

import mysql from 'mysql2/promise';

let pool;

export function getDbPool() {
  let host = process.env.MYSQL_HOST || 'localhost';
  let user = process.env.MYSQL_USER || 'root';
  let password = process.env.MYSQL_PASSWORD || '';
  let database = process.env.MYSQL_DATABASE || 'railway';
  let port = Number(process.env.MYSQL_PORT) || 3306;

  // Si DATABASE_URL está definida (ej. en Railway o Vercel), la parseamos
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      host = url.hostname;
      port = Number(url.port) || 3306;
      user = url.username;
      password = decodeURIComponent(url.password);
      database = url.pathname.replace(/^\//, '');
    } catch (err) {
      console.warn('⚠️ No se pudo parsear DATABASE_URL en lib/db.js:', err.message);
    }
  }

  if (!pool) {
    try {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 7000,
        ssl: {
          rejectUnauthorized: false
        }
      });
    } catch (error) {
      console.error('❌ Error al inicializar el Pool de MySQL:', error.message);
      pool = null;
    }
  }

  return pool;
}

export async function query(sql, params = []) {
  const dbPool = getDbPool();

  if (!dbPool) {
    throw new Error('No hay conexión disponible a la base de datos MySQL');
  }

  try {
    const [results] = await dbPool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Error ejecutando la consulta SQL:', error.message);
    throw error;
  }
}
