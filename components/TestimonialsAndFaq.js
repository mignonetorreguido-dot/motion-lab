'use client';

/**
 * ========================================================================
 * COMPONENTE: Testimonios, Galería y FAQ (TestimonialsAndFaq.js)
 * ========================================================================
 * Integra:
 * 1. Galería visual con las fotografías oficiales del cliente (pista de atletismo,
 *    cancha con balón y zapatillas de running).
 * 2. Casos de éxito y testimonios reales de alumnos.
 * 3. Acordeón interactivo de Preguntas Frecuentes.
 */

import { useState } from 'react';
import { Star, ChevronDown, HelpCircle, Quote, Compass } from 'lucide-react';

export default function TestimonialsAndFaq() {
  const [preguntaAbierta, setPreguntaAbierta] = useState(0);

  const togglePregunta = (index) => {
    setPreguntaAbierta(preguntaAbierta === index ? null : index);
  };

  const testimonios = [
    {
      nombre: 'Martín Gómez',
      rol: 'Alumno Plan Premium (6 meses)',
      resultado: '-12 kg y recuperación de dolor lumbar',
      texto: 'Trabajo 8 horas sentado y sufría molestias constantes. En MOTION LAB adaptaron el entrenamiento para reforzar mi cadena posterior. Hoy entreno con pesos serios sin ningún dolor.',
    },
    {
      nombre: 'Sofía Álvarez',
      rol: 'Alumna Plan Base (4 meses)',
      resultado: 'Constancia y aumento de masa muscular',
      texto: 'Siempre dejaba el entrenamiento a las pocas semanas por falta de guía. El Plan Base me dio la estructura clara de series y ejercicios que necesitaba para ir con seguridad.',
    },
    {
      nombre: 'Diego Fernández',
      rol: 'Alumno Plan Premium (8 meses)',
      resultado: '+8 kg de masa magra y técnica limpia',
      texto: 'Las correcciones por video en WhatsApp son oro puro. Te marcan el segundo exacto y la postura para ejecutar perfecto. La dedicación del equipo es increíble.',
    },
  ];

  const faqs = [
    {
      pregunta: '¿Necesito ir a un gimnasio obligatoriamente para entrenar con MOTION LAB?',
      respuesta: 'No. Al solicitar tu plan por WhatsApp puedes especificar si tienes gimnasio o si entrenarás en casa (con mancuernas o solo con peso corporal). Adaptamos los ejercicios y la sobrecarga para que progreses al máximo con el equipo que tengas.',
    },
    {
      pregunta: '¿Qué ocurre si soy completamente principiante y nunca levanté pesas?',
      respuesta: '¡Es el mejor momento para empezar! Gran parte de nuestros alumnos comenzaron desde cero. En MOTION LAB priorizamos la técnica correcta y la higiene postural antes de subir cargas.',
    },
    {
      pregunta: '¿Cómo recibo mi rutina y plan de comidas?',
      respuesta: 'Recibirás un documento digital interactivo con videos demostrativos de cada ejercicio, cantidad exacta de series, repeticiones y descansos con cronómetro. En el Plan Premium, todo se sincroniza además mediante WhatsApp directo.',
    },
    {
      pregunta: '¿Cuál es la diferencia principal entre el Plan Base y el Plan Premium?',
      respuesta: 'El Plan Base te brinda la rutina mensual estructurada para que entrenes por tu cuenta. El Plan Premium incluye acompañamiento individual diario por WhatsApp, corrección técnica de tus videos y ajustes semanales según tu recuperación.',
    },
    {
      pregunta: '¿Cómo se realizan los pagos?',
      respuesta: 'Aceptamos transferencias bancarias locales, tarjetas y Mercado Pago / PayPal. No hay contratos de permanencia: puedes renovar mes a mes o pausar cuando quieras.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#05070c] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================================================================
            SECCIÓN VISUAL: ÁREAS DE ENTRENAMIENTO (FOTOGRAFÍAS OFICIALES)
           ================================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/20">
            <Compass className="w-3.5 h-3.5" />
            Ecosistema MOTION LAB
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            DONDE EL MOVIMIENTO SE CONVIERTE EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">RESULTADOS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Pista de velocidad, sala de fuerza, campo deportivo o en casa: adaptamos la ciencia a tu entorno.
          </p>
        </div>

        {/* GALERÍA CON LAS FOTOS PROVISTAS POR EL CLIENTE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-24">
          
          {/* Foto 1: Pista de Atletismo Día */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 group h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/track-day.jpg"
              alt="Entrenamiento en pista de atletismo - MOTION LAB"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/80 text-white">
                Velocidad & Pista
              </span>
              <h4 className="text-white font-bold text-sm mt-1">Control de Cronómetro</h4>
            </div>
          </div>

          {/* Foto 2: Pista de Atletismo Noche con Calzado */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 group h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/track-night.jpg"
              alt="Planificación nocturna en pista - MOTION LAB"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-600/80 text-white">
                Capacidad Atlética
              </span>
              <h4 className="text-white font-bold text-sm mt-1">Periodización Continua</h4>
            </div>
          </div>

          {/* Foto 3: Cancha con Balón */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 group h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/soccer-turf.jpg"
              alt="Preparación física deportiva de campo - MOTION LAB"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-600/80 text-white">
                Rendimiento Deportivo
              </span>
              <h4 className="text-white font-bold text-sm mt-1">Fuerza Aplicada al Deporte</h4>
            </div>
          </div>

        </div>

        {/* ================================================================
            TESTIMONIOS
           ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {testimonios.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-[#0b1220] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-sky-500/20 mb-2" />
                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">
                  &quot;{t.texto}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="text-white font-bold text-base">{t.nombre}</div>
                <div className="text-xs text-sky-400 font-medium">{t.rol}</div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">
                  🎯 {t.resultado}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================
            PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
           ================================================================ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-semibold mb-3 border border-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Resuelve tus Dudas</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const estaAbierta = preguntaAbierta === index;
              return (
                <div
                  key={index}
                  className="bg-[#0b1220] border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => togglePregunta(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">
                      {faq.pregunta}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-sky-400 shrink-0 transition-transform duration-200 ${
                        estaAbierta ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {estaAbierta && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
