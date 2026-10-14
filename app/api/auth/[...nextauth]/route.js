/**
 * ========================================================================
 * CONFIGURACIÓN DE NEXTAUTH (app/api/auth/[...nextauth]/route.js)
 * ========================================================================
 * Maneja la autenticación social (Google OAuth) y tradicional (Email / Password).
 * Utiliza PrismaAdapter para persistir usuarios, cuentas y sesiones en MySQL.
 * 
 * ¿CÓMO FUNCIONA LA SESIÓN CON CREDENTIALS Y JWT?
 * Cuando se usa el proveedor de credenciales (email y contraseña), NextAuth requiere
 * usar la estrategia 'jwt' (JSON Web Token) para la sesión.
 * En los 'callbacks' adjuntamos el 'id', el 'rol' (ALUMNO/ENTRENADOR) y el
 * 'estadoPago' (PENDIENTE/ACTIVO) para poder proteger las vistas de la app.
 */

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    // Usamos estrategia JWT para compatibilidad total con Credentials y Google
    strategy: 'jwt',
  },

  providers: [
    // 1. PROVEEDOR GOOGLE OAUTH
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'DEMO_GOOGLE_CLIENT_SECRET',
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. PROVEEDOR TRADICIONAL (Email y Contraseña)
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email o Usuario', type: 'text', placeholder: 'tu@correo.com' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor ingresa tu email y contraseña');
        }

        // Credenciales maestras para el Entrenador (Panel Admin)
        if (credentials.email.trim() === 'matiasMotionLab' && credentials.password === 'laboratorio123') {
          return {
            id: 'matias-coach-id',
            name: 'Matías Entrenador',
            email: 'matias@motionlab.fit',
            rol: 'ENTRENADOR',
            estadoPago: 'ACTIVO',
            tipoPlan: 'PREMIUM',
          };
        }

        // Buscar al usuario en la base de datos por email
        let usuario;
        try {
          usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });
        } catch (dbErr) {
          console.warn('⚠️ No se pudo consultar Prisma en authorize:', dbErr.message);
        }

        if (!usuario) {
          throw new Error('No existe ningún usuario registrado con ese email');
        }

        // Si el usuario no tiene contraseña (se registró exclusivamente con Google)
        if (!usuario.passwordHash) {
          throw new Error('Esta cuenta fue registrada con Google. Inicia sesión con el botón de Google.');
        }

        // Validar contraseña con bcryptjs
        const passwordValida = await bcrypt.compare(credentials.password, usuario.passwordHash);
        if (!passwordValida) {
          throw new Error('La contraseña ingresada es incorrecta');
        }

        // Devolvemos el objeto usuario que pasará al token JWT
        return {
          id: usuario.id,
          name: `${usuario.nombre} ${usuario.apellido || ''}`.trim(),
          email: usuario.email,
          rol: usuario.rol,
          estadoPago: usuario.estadoPago,
          tipoPlan: usuario.tipoPlan,
        };
      },
    }),
  ],

  callbacks: {
    // El callback 'jwt' se ejecuta cuando se crea o actualiza el token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol || 'ALUMNO';
        token.estadoPago = user.estadoPago || 'PENDIENTE';
        token.tipoPlan = user.tipoPlan || 'BASE';
      }

      // Si se solicita actualizar la sesión desde el frontend (ej: cuando el profe activa el pago)
      if (trigger === 'update' && session) {
        if (session.estadoPago) token.estadoPago = session.estadoPago;
        if (session.rol) token.rol = session.rol;
      }

      return token;
    },

    // El callback 'session' pasa los datos del token a la sesión accesible en el navegador
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.rol = token.rol;
        session.user.estadoPago = token.estadoPago;
        session.user.tipoPlan = token.tipoPlan;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET || 'motion_lab_super_secret_jwt_key_2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
