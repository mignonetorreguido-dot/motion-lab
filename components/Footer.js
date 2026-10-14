/**
 * ========================================================================
 * COMPONENTE: Pie de Página MOTION LAB (Footer.js)
 * ========================================================================
 * Incluye logotipo oficial, enlaces rápidos, canales de contacto y
 * aviso de responsabilidad médica deportiva.
 */

import { Instagram, Mail, MessageCircle } from 'lucide-react';
import MotionLabLogo from './MotionLabLogo';

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-[#030509] border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* COLUMNA 1: Marca y Misión */}
          <div className="md:col-span-2 space-y-4">
            <MotionLabLogo />
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Centro de rendimiento deportivo y planificación física individualizada. Ciencia, biomecánica y sobrecarga progresiva aplicadas a tu objetivo.
            </p>
          </div>

          {/* COLUMNA 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#sobre-mi" className="hover:text-sky-400 transition-colors">
                  Metodología MOTION LAB
                </a>
              </li>
              <li>
                <a href="#planes" className="hover:text-sky-400 transition-colors">
                  Plan Base vs Plan Premium
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-sky-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Canales de Contacto */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Canales Oficiales
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <a 
                  href="https://wa.me/5493624654911" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +54 9 362 465-4911
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>contacto@motionlab.fit</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-sky-400" />
                <span className="hover:text-white cursor-pointer">@motionlab.performance</span>
              </li>
            </ul>
          </div>

        </div>

        {/* LÍNEA FINAL */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {anioActual} MOTION LAB. Todos los derechos reservados. Desarrollado con Next.js, React y MySQL.
          </p>
          <p className="text-[11px] text-slate-600 max-w-sm text-center sm:text-right">
            Aviso médico: Consulta con un profesional de la salud antes de iniciar planes de entrenamiento de alta exigencia.
          </p>
        </div>

      </div>
    </footer>
  );
}
