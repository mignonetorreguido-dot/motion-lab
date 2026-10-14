'use client';

/**
 * ========================================================================
 * WIZARD MULTIESTEP: Onboarding del Alumno (components/onboarding/Wizard.js)
 * ========================================================================
 * Guía interactiva de 6 pasos (Paso 0 a Paso 5) con animaciones suaves,
 * lógica condicional y registro final conectado a NextAuth y WhatsApp.
 */

import { useState } from 'react';
import { 
  Zap, Crown, ArrowRight, ArrowLeft, Check, Target, Dumbbell, 
  Activity, Heart, ShieldAlert, Sparkles, MessageCircle, Lock, Mail, User, Phone 
} from 'lucide-react';
import MotionLabLogo from '@/components/MotionLabLogo';

export default function Wizard() {
  // ------------------------------------------------------------------------
  // ESTADOS DEL FORMULARIO Y PASOS
  // ------------------------------------------------------------------------
  const [paso, setPaso] = useState(0); // Pasos: 0 al 5
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registroCompletado, setRegistroCompletado] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  // Objeto central con todos los datos recolectados
  const [formData, setFormData] = useState({
    // Paso 0: Plan
    tipoPlan: 'PREMIUM', // 'BASE' o 'PREMIUM'
    // Paso 1: Objetivos
    objetivo: 'Rendimiento', // 'Rendimiento', 'Estética', 'Salud'
    deporte: '',
    club: false,
    // Paso 2: Nivel y Focos
    nivel: 'Intermedio', // 'Principiante', 'Intermedio', 'Avanzado'
    focos: ['Fuerza'], // 'Fuerza', 'Velocidad', 'Técnica', 'Resistencia'
    disponibilidad: '4 días por semana',
    // Paso 3: Condicional (RM y Puntos débiles)
    rmEstimado: '',
    puntosDebiles: '',
    // Paso 4: Físico
    peso: '',
    altura: '',
    lesiones: '',
    // Paso 5: Autenticación / Registro
    nombre: '',
    apellido: '',
    whatsapp: '',
    email: '',
    password: '',
  });

  // ------------------------------------------------------------------------
  // LÓGICA CONDICIONAL: ¿Debe mostrarse el Paso 3 (RM y Puntos Débiles)?
  // Solo si el alumno tiene nivel Intermedio o Avanzado Y seleccionó Foco en Fuerza o Técnica.
  // ------------------------------------------------------------------------
  const requierePasoCondicional = () => {
    const esIntermedioOAvanzado = formData.nivel === 'Intermedio' || formData.nivel === 'Avanzado';
    const tieneFocoFuerzaOTecnica = formData.focos.includes('Fuerza') || formData.focos.includes('Técnica');
    return esIntermedioOAvanzado && tieneFocoFuerzaOTecnica;
  };

  // ------------------------------------------------------------------------
  // MANEJADORES DE ESTADO
  // ------------------------------------------------------------------------
  const actualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    setErrorMsg('');
  };

  // Alternar selección en lista de focos múltiples
  const toggleFoco = (foco) => {
    setFormData((prev) => {
      const yaExiste = prev.focos.includes(foco);
      if (yaExiste) {
        // Evitamos dejar el array vacío
        if (prev.focos.length === 1) return prev;
        return { ...prev, focos: prev.focos.filter((f) => f !== foco) };
      } else {
        return { ...prev, focos: [...prev.focos, foco] };
      }
    });
  };

  // Navegación hacia adelante con salto condicional si no aplica
  const irAlSiguiente = () => {
    // Validaciones por paso
    if (paso === 1 && !formData.deporte.trim()) {
      setErrorMsg('Por favor especifica tu deporte o disciplina principal.');
      return;
    }
    if (paso === 4 && (!formData.peso || !formData.altura)) {
      setErrorMsg('Por favor ingresa tu peso y altura aproximados.');
      return;
    }

    // Lógica condicional al salir del Paso 2
    if (paso === 2) {
      if (requierePasoCondicional()) {
        setPaso(3); // Mostrar preguntas de RM
      } else {
        setPaso(4); // Saltar directamente a datos físicos
      }
      return;
    }

    setPaso((prev) => Math.min(prev + 1, 5));
  };

  // Navegación hacia atrás
  const irAlAnterior = () => {
    setErrorMsg('');
    if (paso === 4 && !requierePasoCondicional()) {
      setPaso(2); // Volver al paso 2 si nos habíamos saltado el 3
      return;
    }
    setPaso((prev) => Math.max(prev - 1, 0));
  };

  // ------------------------------------------------------------------------
  // ENVÍO FINAL DEL REGISTRO (Paso 5)
  // ------------------------------------------------------------------------
  const manejarRegistro = async (e) => {
    e?.preventDefault();

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Por favor completa tu nombre, correo y contraseña.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    setErrorMsg('');

    try {
      const respuesta = await fetch('/api/auth/register-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el registro');
      }

      setWhatsappLink(data.whatsappUrl);
      setRegistroCompletado(true);
    } catch (err) {
      console.error('Error de registro:', err);
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // Registro social con Google (simulación / NextAuth)
  const iniciarConGoogle = () => {
    // Si estuviéramos en producción con Google Client ID configurado:
    // signIn('google', { callbackUrl: '/onboarding' });
    alert('Redirigiendo a autenticación segura de Google... (Configura GOOGLE_CLIENT_ID en producción)');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* TARJETA PRINCIPAL DEL WIZARD */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden card-glow">
        
        {/* BARRA DE PROGRESO */}
        {!registroCompletado && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
              <span className="text-sky-400 tracking-wider uppercase">Paso {paso} de 5</span>
              <span>{Math.round((paso / 5) * 100)}% Completado</span>
            </div>
            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${(paso / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* MENSAJE DE ERROR SI EXISTE */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================================================================
            PANTALLA DE ÉXITO FINAL: COORDINACIÓN DE PAGO POR WHATSAPP
           ================================================================ */}
        {registroCompletado ? (
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-sky-400/40 text-sky-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Estado: Pendiente de Pago
              </span>
              <h3 className="text-3xl font-black text-white mt-3">
                ¡Bienvenido a Motion Lab, {formData.nombre}!
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                Tu perfil deportivo ha sido guardado. Para que el entrenador Matías active tu cuenta y comience la planificación de tu rutina, coordina el pago por WhatsApp:
              </p>
            </div>

            {/* CAJA RESUMEN */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Plan Seleccionado:</span>
                <span className="font-bold text-white">
                  {formData.tipoPlan === 'PREMIUM' ? 'Plan Premium Personalizado' : 'Plan Base'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Objetivo:</span>
                <span className="font-bold text-white">{formData.objetivo} ({formData.deporte})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frecuencia:</span>
                <span className="font-bold text-white">{formData.disponibilidad}</span>
              </div>
            </div>

            {/* BOTÓN DIRECTO A WHATSAPP DE MATÍAS */}
            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>Coordinar Pago con Matías por WhatsApp</span>
              </a>
              <span className="text-[11px] text-slate-500 block mt-2">
                Se abrirá un chat directo con tu ficha deportiva pre-cargada.
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* ================================================================
                PASO 0: SELECCIÓN DE PLAN (Base vs Premium)
               ================================================================ */}
            {paso === 0 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Paso 0 • Membresía
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Selecciona tu Modalidad de Entrenamiento
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Elige el nivel de acompañamiento que necesitas de Matías en Motion Lab.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* TARJETA 1: PLAN BASE */}
                  <button
                    type="button"
                    onClick={() => actualizarCampo('tipoPlan', 'BASE')}
                    className={`p-6 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      formData.tipoPlan === 'BASE'
                        ? 'bg-blue-600/15 border-sky-400 text-white shadow-xl shadow-blue-500/10 ring-1 ring-sky-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mb-3">
                        <Zap className="w-5 h-5 text-sky-400" />
                      </div>
                      <div className="font-extrabold text-lg text-white">Plan Base</div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Rutina personalizada estructurada. Ideal para quienes entrenan por su cuenta con disciplina.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-lg font-black text-white">$29.99/mes</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        formData.tipoPlan === 'BASE' ? 'bg-sky-400 border-sky-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {formData.tipoPlan === 'BASE' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>
                  </button>

                  {/* TARJETA 2: PLAN PREMIUM (DESTACADO) */}
                  <button
                    type="button"
                    onClick={() => actualizarCampo('tipoPlan', 'PREMIUM')}
                    className={`p-6 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative ${
                      formData.tipoPlan === 'PREMIUM'
                        ? 'bg-gradient-to-b from-amber-500/15 to-slate-900 border-amber-400 text-white shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                      Recomendado
                    </span>
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div className="font-extrabold text-lg text-white">Plan Premium</div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Asistencia inmediata, revisión de técnica por video, coordinación de clases presenciales y seguimiento 1 a 1.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-lg font-black text-amber-400">$69.99/mes</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        formData.tipoPlan === 'PREMIUM' ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {formData.tipoPlan === 'PREMIUM' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>
                  </button>

                </div>
              </div>
            )}

            {/* ================================================================
                PASO 1: OBJETIVOS, DEPORTE Y CLUB
               ================================================================ */}
            {paso === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Paso 1 • Enfoque Deportivo
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    ¿Cuál es tu Objetivo Primario?
                  </h3>
                </div>

                {/* BOTONES GRANDES DE OBJETIVO */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Rendimiento', label: '⚡ Rendimiento', desc: 'Velocidad, potencia y fuerza para competir' },
                    { id: 'Estética', label: '💪 Estética', desc: 'Hipertrofia muscular y definición corporal' },
                    { id: 'Salud', label: '🌱 Salud', desc: 'Movilidad, postura y prevención de dolores' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => actualizarCampo('objetivo', item.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.objetivo === item.id
                          ? 'bg-blue-600/20 border-sky-400 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</div>
                    </button>
                  ))}
                </div>

                {/* INPUT DEPORTE */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Deporte o Disciplina que practicas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Fútbol, Rugby, Running, Tenis, Gimnasio Tradicional..."
                    value={formData.deporte}
                    onChange={(e) => actualizarCampo('deporte', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* BOTONES SÍ / NO PARA CLUB */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    ¿Entrenas o compites en algún Club o Institución Federada?
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('club', true)}
                      className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                        formData.club === true
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      Sí, pertenezco a un club
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('club', false)}
                      className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                        formData.club === false
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      No, entreno por mi cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================
                PASO 2: NIVEL, FOCOS MÚLTIPLES Y DISPONIBILIDAD
               ================================================================ */}
            {paso === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Paso 2 • Nivel y Capacidad
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Tu Nivel Actual de Entrenamiento
                  </h3>
                </div>

                {/* BOTONES DE NIVEL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Principiante', label: 'Principiante', desc: '0 a 6 meses de constancia' },
                    { id: 'Intermedio', label: 'Intermedio', desc: '6 meses a 2 años dominando básicos' },
                    { id: 'Avanzado', label: 'Avanzado', desc: '+2 años con cargas y técnica sólida' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => actualizarCampo('nivel', item.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.nivel === item.id
                          ? 'bg-blue-600/20 border-sky-400 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>

                {/* FOCO MÚLTIPLE */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Focos prioritarios de trabajo (Selecciona uno o más):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Fuerza', 'Velocidad', 'Técnica', 'Resistencia'].map((foco) => {
                      const activo = formData.focos.includes(foco);
                      return (
                        <button
                          key={foco}
                          type="button"
                          onClick={() => toggleFoco(foco)}
                          className={`py-3 px-3 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 ${
                            activo
                              ? 'bg-sky-500/20 text-sky-400 border-sky-400 shadow-sm'
                              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {activo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>{foco}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SELECT DISPONIBILIDAD */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Disponibilidad Semanal para Entrenar:
                  </label>
                  <select
                    value={formData.disponibilidad}
                    onChange={(e) => actualizarCampo('disponibilidad', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="2 días por semana">2 días por semana</option>
                    <option value="3 días por semana">3 días por semana (Frecuencia Estándar)</option>
                    <option value="4 días por semana">4 días por semana (Recomendado)</option>
                    <option value="5 o más días por semana">5 o más días por semana (Alto Rendimiento)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ================================================================
                PASO 3: CONDICIONAL (RM Y PUNTOS DÉBILES)
               ================================================================ */}
            {paso === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Paso 3 (Avanzado) • Métricas de Carga
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Calibración de Fuerza Máxima
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Detectamos que tienes nivel {formData.nivel} con foco en {formData.focos.join('/')}. Matías necesita estos datos para calcular tu volumen exacto.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    RM (Repetición Máxima) Estimada en Levantamientos Clave:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Sentadilla 120kg, Banco 90kg, Peso Muerto 150kg..."
                    value={formData.rmEstimado}
                    onChange={(e) => actualizarCampo('rmEstimado', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Si no conoces tu 1RM exacto, puedes colocar el peso con el que haces 5 o 8 repeticiones.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Puntos Débiles o Asimetrías a Mejorar:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej: Me cuesta despegar la barra del suelo, siento desbalance en la pierna izquierda, fatiga rápida en hombros..."
                    value={formData.puntosDebiles}
                    onChange={(e) => actualizarCampo('puntosDebiles', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            )}

            {/* ================================================================
                PASO 4: DATOS FÍSICOS Y LESIONES
               ================================================================ */}
            {paso === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Paso 4 • Parámetros Físicos
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Composición y Salud Articular
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Peso Corporal (Kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Ej. 75.5"
                      value={formData.peso}
                      onChange={(e) => actualizarCampo('peso', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Altura (cm) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Ej. 178"
                      value={formData.altura}
                      onChange={(e) => actualizarCampo('altura', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Lesiones previas, cirugías o molestias articulares:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Cirugía de menisco en 2022, dolor lumbar ocasional al estar sentado..."
                    value={formData.lesiones}
                    onChange={(e) => actualizarCampo('lesiones', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Si no tienes ninguna lesión, puedes dejarlo en blanco o escribir &quot;Ninguna&quot;.
                  </span>
                </div>
              </div>
            )}

            {/* ================================================================
                PASO 5: REGISTRO Y AUTENTICACIÓN
               ================================================================ */}
            {paso === 5 && (
              <form onSubmit={manejarRegistro} className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Paso 5 • Crear Cuenta
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Crea tu Cuenta para Guardar tu Ficha
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Accederás a tu panel de entrenamiento y seguimiento con Matías.
                  </p>
                </div>

                {/* BOTÓN GOOGLE OAUTH */}
                <button
                  type="button"
                  onClick={iniciarConGoogle}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-md transition-all hover:scale-[1.01]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar con Google</span>
                </button>

                {/* DIVISOR VISUAL */}
                <div className="flex items-center gap-3">
                  <div className="flex-grow h-px bg-slate-800" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    o regístrate con tu email
                  </span>
                  <div className="flex-grow h-px bg-slate-800" />
                </div>

                {/* CAMPOS TRADICIONALES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Juan"
                        value={formData.nombre}
                        onChange={(e) => actualizarCampo('nombre', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={(e) => actualizarCampo('apellido', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Teléfono *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11 1234-5678"
                      value={formData.whatsapp}
                      onChange={(e) => actualizarCampo('whatsapp', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="juan@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => actualizarCampo('email', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Crear Contraseña *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => actualizarCampo('password', e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 hover:scale-[1.02]"
                  >
                    {cargando ? (
                      <span>Creando cuenta y guardando ficha...</span>
                    ) : (
                      <>
                        <span>Confirmar Registro y Coordinar Pago</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* BOTONES DE NAVEGACIÓN ANTERIOR / SIGUIENTE (Pasos 0 a 4) */}
            {paso < 5 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-8">
                <button
                  type="button"
                  onClick={irAlAnterior}
                  disabled={paso === 0}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={irAlSiguiente}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
