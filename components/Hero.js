/**
 * ========================================================================
 * COMPONENTE: Sección Hero MOTION LAB (Hero.js)
 * ========================================================================
 * Presentación principal de alto rendimiento.
 * Integra la fotografía oficial de MOTION LAB en campo nocturno y
 * resalta la precisión científica de la planificación del entrenamiento.
 */

import { ArrowRight, Sparkles, Activity, ShieldCheck, Timer } from 'lucide-react';
import MotionLabLogo from './MotionLabLogo';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden hero-gradient">
      {/* Luces difuminadas de fondo en tonos Azul Eléctrico y Cyan */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: Titular de alto impacto y llamada a la acción */}
          <div className="lg:col-span-7 text-left">
            
            {/* BADGE DE RENDIMIENTO */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-sky-500/30 text-sky-400 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Laboratorio de Movimiento & Alto Rendimiento</span>
            </div>

            {/* TÍTULO PRINCIPAL CON TIPOGRAFÍA DEPORTIVA */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
              ENTRENA CON <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300">
                PRECISIÓN TOTAL.
              </span>
            </h1>

            {/* SUBTÍTULO DESCRIPTIVO */}
            <p className="text-base sm:text-lg text-slate-300 font-normal mb-8 leading-relaxed max-w-xl">
              En <strong className="text-white font-semibold">MOTION LAB</strong> planificamos cada serie, repetición y descanso según tus métricas reales. Sin improvisación: optimizamos tu fuerza, composición corporal y rendimiento atlético.
            </p>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                href="#planes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 rounded-full transition-all shadow-xl shadow-blue-500/25 hover:scale-105"
              >
                <span>Ver Plan Base & Premium</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* MINI METRICAS ATLÉTICAS */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
                  100%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Individualizado</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400">
                  +150
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Alumnos evaluados</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  24/7
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Monitoreo 1 a 1</div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Fotografía Oficial del Cliente (motion-lab-field.jpg) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              
              {/* Resplandor dinámico en azul eléctrico */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />
              
              {/* Marco de la imagen oficial con estilo de tarjeta atlética */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                {/* Imagen del cliente en campo deportivo nocturno con libreta y cronómetro */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/motion-lab-field.jpg"
                  alt="Planificación y entrenamiento deportivo MOTION LAB"
                  className="w-full h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Capa de gradiente inferior para legibilidad del texto flotante */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-black/30" />

                {/* Badge flotante inferior con datos del método */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center border border-blue-500/30">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">Planificación al Segundo</h4>
                        <p className="text-[11px] text-slate-400">Tiempos de recuperación y cargas exactas</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-blue-500/20 text-sky-400 border border-blue-500/30">
                      LAB
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
