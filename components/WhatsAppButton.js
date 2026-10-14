'use client';

/**
 * ========================================================================
 * COMPONENTE: Botón Flotante de WhatsApp (WhatsAppButton.js)
 * ========================================================================
 * Permite que los visitantes hagan clic en cualquier momento desde su teléfono
 * o computadora para chatear directamente con el entrenador.
 * Se mantiene fijo en la esquina inferior derecha con 'fixed bottom-6 right-6'.
 */

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  // Número de WhatsApp con prefijo internacional (Matías: 3624654911)
  const numeroWhatsApp = '5493624654911';
  const mensajePredeterminado = encodeURIComponent(
    '¡Hola Coach Matías! Estuve viendo la web de Motion Lab y quisiera consultar por los planes de entrenamiento.'
  );

  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajePredeterminado}`;

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">¿Hablamos por WhatsApp?</span>
      </a>
    </aside>
  );
}
