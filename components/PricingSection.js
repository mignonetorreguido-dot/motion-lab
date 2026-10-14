/**
 * ========================================================================
 * COMPONENTE: Planes y Membresías MOTION LAB (PricingSection.js)
 * ========================================================================
 * Presentación de las dos opciones de planificación:
 * 1. Plan Base: Planificación estructurada periódica para alumnos autónomos.
 * 2. Plan Premium Personalizado: Acompañamiento 1 a 1 continuo,
 *    revisión de técnica en video y ajustes semanales por WhatsApp.
 */

import { Check, Zap, Crown, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const whatsappTrainer = '5493624654911';

  const getLinkPlan = (planNombre) => {
    const texto = `¡Hola Equipo de MOTION LAB! Me gustaría contratar el *${planNombre}*. ¿Cuáles son los métodos de pago y pasos para comenzar?`;
    return `https://wa.me/${whatsappTrainer}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <section id="planes" className="py-24 bg-[#080d1a] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/20">
            Membresías de Rendimiento
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ELIGE TU NIVEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PLANIFICACIÓN</span>
          </h2>
          <p className="text-slate-400 text-base mt-4">
            Planes flexibles sin permanencia obligatoria en MOTION LAB. Cancela o cambia de modalidad en cualquier momento.
          </p>
        </div>

        {/* COMPARATIVA DE PLANES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* ================================================================
              TARJETA 1: PLAN BASE
             ================================================================ */}
          <div className="bg-[#0b1220] border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-sky-400 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  Autónomo
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">Plan Base</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Ideal para alumnos que conocen la técnica básica y solo necesitan una rutina estructurada y científicamente periodizada para progresar por su cuenta.
              </p>

              {/* Texto Oculto / Sin Precios */}
              <div className="mt-6 mb-8 pb-6 border-b border-slate-800">
                <p className="text-slate-300 text-sm">
                  Los valores y métodos de pago se coordinan de forma personalizada según tu país de residencia.
                </p>
                <span className="text-xs text-slate-500 block mt-2">Renovación mensual sin ataduras</span>
              </div>

              {/* Beneficios */}
              <div className="space-y-3.5 mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Qué incluye:
                </span>

                {[
                  'Rutina estructurada mensual en PDF interactivo',
                  'Periodización de cargas, series y repeticiones',
                  'Guía nutricional general y cálculo de mantenimiento calórico',
                  'Acceso a la comunidad privada de alumnos MOTION LAB',
                  'Actualización de la planificación cada 4 semanas',
                  'Soporte por correo electrónico para consultas',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/15 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={getLinkPlan('Plan Base')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center border border-slate-700 transition-all block hover:scale-[1.02]"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* ================================================================
              TARJETA 2: PLAN PREMIUM PERSONALIZADO (DESTACADO)
             ================================================================ */}
          <div className="bg-gradient-to-b from-[#0e172a] to-[#080d1a] border-2 border-amber-500/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative premium-glow hover:border-amber-400 transition-all">
            
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>100% Individualizado - Recomendado</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  Asesoría 1 a 1
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">Plan Premium</h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                El laboratorio completo para ti. Planificación ajustada a tu anatomía, horarios y equipamiento con revisión de técnica diaria y contacto 24/7.
              </p>

              {/* Texto Oculto / Sin Precios */}
              <div className="mt-6 mb-8 pb-6 border-b border-slate-800">
                <p className="text-slate-300 text-sm">
                  Los valores y métodos de pago se coordinan de forma personalizada según tu país de residencia.
                </p>
                <span className="text-xs text-amber-500/80 block mt-2">Cupos limitados para garantizar máxima precisión</span>
              </div>

              {/* Beneficios */}
              <div className="space-y-3.5 mb-8">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Todo lo del Plan Base, MÁS:
                </span>

                {[
                  'Planificación 100% individualizada a tu nivel y equipo',
                  'Adaptación estricta para cuidar lesiones o molestias articulares',
                  'Cálculo de macros y calorías exactas según gasto energético',
                  'Corrección de técnica por video (me envías tus grabaciones)',
                  'Acompañamiento y resolución de dudas por WhatsApp 24/7',
                  'Ajustes semanales basados en tu fatiga, fuerza y peso',
                  '1 Videollamada mensual de revisión y mentalidad',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={getLinkPlan('Plan Premium')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm text-center shadow-xl shadow-amber-500/20 transition-all block hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Consultar por WhatsApp</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
