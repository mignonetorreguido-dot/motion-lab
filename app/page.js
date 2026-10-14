/**
 * ========================================================================
 * PÁGINA PRINCIPAL (app/page.js)
 * ========================================================================
 * Este archivo representa la ruta principal ("/") de la web del Personal Trainer.
 * En Next.js, cada carpeta o archivo 'page.js' representa una pantalla visible.
 * 
 * Aquí ensamblamos de forma modular y ordenada cada componente de la página:
 * 1. Navbar: Barra de navegación superior
 * 2. Hero: Portada de presentación y llamado a la acción
 * 3. AboutTrainer: Quién es el entrenador y su metodología
 * 4. PricingSection: Comparativa entre el Plan Base y el Plan Premium
 * 5. TestimonialsAndFaq: Testimonios de alumnos y dudas frecuentes
 * 6. Footer: Pie de página y datos de contacto
 * 7. WhatsAppButton: Botón flotante para consultas rápidas
 */

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutTrainer from '@/components/AboutTrainer';
import PricingSection from '@/components/PricingSection';
import TestimonialsAndFaq from '@/components/TestimonialsAndFaq';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Barra de menú superior fija */}
      <Navbar />

      {/* 2. Contenido principal de la landing page */}
      <main className="flex-grow">
        {/* Presentación impactante */}
        <Hero />

        {/* Quién es el coach y cómo trabaja */}
        <AboutTrainer />

        {/* Tabla comparativa de precios: Plan Base vs Plan Premium */}
        <PricingSection />

        {/* Casos de éxito y respuestas a dudas habituales */}
        <TestimonialsAndFaq />
      </main>

      {/* 3. Pie de página con información y redes */}
      <Footer />

      {/* 4. Botón flotante siempre visible para chatear por WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
