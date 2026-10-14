/**
 * ========================================================================
 * COMPONENTE: Logotipo Oficial MOTION LAB (MotionLabLogo.js)
 * ========================================================================
 * Recreación en formato SVG vectorial del imagotipo de "MOTION LAB".
 * Al ser un SVG:
 * 1. Es ultraligero y carga al instante (0 milisegundos).
 * 2. Se ve 100% nítido en pantallas Retina y 4K sin pixelarse.
 * 3. Permite cambiar el tamaño mediante la propiedad 'size'.
 */

export default function MotionLabLogo({ className = '', iconOnly = false, size = 'default' }) {
  // Ajuste de proporciones según el tamaño solicitado
  const isLarge = size === 'large';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* ISOTIPO VECTORIAL: Formas geométricas dinámicas en Azul Eléctrico y Cyan */}
      <svg
        viewBox="0 0 52 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isLarge ? 'w-12 h-12' : 'w-9 h-9'}
      >
        {/* Barra inclinada izquierda (color azul deportivo sólido) */}
        <path
          d="M13.5 12L5 38C4.5 39.5 5.8 41 7.5 41H17C18.2 41 19.3 40.2 19.7 39L26 20C26.5 18.5 25.2 17 23.5 17H15.5C14.7 17 13.9 16.4 13.7 15.6L13.5 12Z"
          fill="url(#motionGrad1)"
        />
        {/* Barra inclinada derecha en ángulo complementario */}
        <path
          d="M27.5 16L20 39C19.6 40.2 20.5 41 21.8 41H31.5C32.7 41 33.8 40.2 34.2 39L41.5 16H27.5Z"
          fill="url(#motionGrad2)"
        />
        {/* Punto / Círculo superior derecho característico del logo */}
        <circle cx="39" cy="9" r="4.5" fill="#38BDF8" />

        {/* Gradientes que dan el brillo y contraste tecnológico deportivo */}
        <defs>
          <linearGradient id="motionGrad1" x1="5" y1="12" x2="26" y2="41" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0066FF" />
            <stop offset="1" stopColor="#00D4FF" />
          </linearGradient>
          <linearGradient id="motionGrad2" x1="20" y1="16" x2="41" y2="41" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0052CC" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>

      {/* TEXTO DE MARCA (WORDMARK): MOTION LAB */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-black tracking-wider text-white uppercase ${
            isLarge ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
          }`}>
            MOTION<span className="text-sky-400">LAB</span>
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-slate-400 font-bold uppercase mt-0.5">
            HIGH PERFORMANCE
          </span>
        </div>
      )}
    </div>
  );
}
