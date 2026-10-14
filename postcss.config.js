/**
 * Configuración de PostCSS
 * PostCSS es la herramienta que procesa Tailwind CSS y aplica prefijos
 * automáticos a las reglas CSS para que funcionen bien en todos los navegadores.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
