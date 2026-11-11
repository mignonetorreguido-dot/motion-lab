/**
 * ========================================================================
 * SEMILLA COMPATIBLE CON `prisma db seed`
 * ========================================================================
 * La carga real de datos vive en `scripts/seed-demo.mjs`, que usa
 * PostgreSQL y los alumnos actuales del panel de Matías.
 *
 * Este archivo solo redirige el comando de Prisma al seed correcto para
 * evitar ejecutar por error una semilla vieja de MySQL.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const seedScript = path.join(__dirname, '..', 'scripts', 'seed-demo.mjs');
const result = spawnSync(process.execPath, [seedScript], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
