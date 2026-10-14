'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dumbbell, ArrowRight, ShieldAlert, LogIn } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Redirigir basado en el rol después de iniciar sesión exitosamente
        // Para esto, en vez de obtener la sesión aquí, podemos ir a una página intermedia o
        // dejar que el usuario vaya a su dashboard.
        // Haremos fetch a /api/auth/session para ver el rol.
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.rol === 'ENTRENADOR') {
          router.push('/admin');
        } else {
          router.push('/entrenamiento');
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 pt-24 relative z-10">
        <div className="w-full max-w-md bg-[#0a0f1d] p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 flex items-center justify-center rounded-full mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <LogIn className="w-8 h-8 text-sky-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Iniciar Sesión</h1>
            <p className="text-slate-400 mt-2 text-sm">
              Accede a tu cuenta de Motion Lab
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email o Usuario</label>
              <input
                type="text"
                required
                className="w-full bg-[#05070c] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                placeholder="tu@correo.com o usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Contraseña</label>
              <input
                type="password"
                required
                className="w-full bg-[#05070c] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Entrar a mi Cuenta'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link href="/onboarding" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
