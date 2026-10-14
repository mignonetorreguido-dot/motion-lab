/**
 * ========================================================================
 * COMPONENTE: Sobre MOTION LAB & Metodología (AboutTrainer.js)
 * ========================================================================
 * Sección que presenta el enfoque metodológico de MOTION LAB.
 * Integra la fotografía de entrenamiento con kettlebell, libreta de control
 * y cronómetro de descanso provista por el cliente.
 */

import { CheckCircle2, Award, Zap, Activity } from 'lucide-react';

export default function AboutTrainer() {
  return (
    <section id="sobre-mi" className="py-24 bg-[#080d1a] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: Fotografía del Cliente (gym-kettlebell.jpg) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600/30 to-blue-600/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500" />

              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/gym-kettlebell.jpg"
                  alt="Planificación y equipamiento en MOTION LAB"
                  className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-black/20" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
                      ML
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Metodología Basada en Evidencia</h4>
                      <p className="text-xs text-slate-400">Biomecánica, sobrecarga progresiva y control</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: El Método MOTION LAB */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
              <Activity className="w-3.5 h-3.5" />
              <span>Filosofía MOTION LAB</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              NO ES SOLO ENTRENAR, ES <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PLANIFICAR TU RENDIMIENTO</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              En el mundo del entrenamiento tradicional se copia la rutina del mes sin tener en cuenta las palancas anatómicas, el historial de lesiones ni la capacidad de recuperación del alumno. En <strong className="text-white">MOTION LAB</strong> tratamos tu proceso con rigor científico.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Análisis Biomecánico y Rango de Movimiento</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Evaluamos cómo se mueve tu estructura articular para elegir ejercicios que estimulen el músculo sin comprometer ligamentos ni articulaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Control de Volumen e Intensidad (RPE / RIR)</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Medimos el esfuerzo real de cada serie para garantizar que estés cerca del fallo muscular óptimo sin acumular fatiga innecesaria.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Acompañamiento Técnico por Video</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Nos envías grabaciones de tus levantamientos clave y recibes correcciones en video con indicaciones precisas de postura y trayectoria de la barra.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
