// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Configuración de Astro.
 *
 * NOTA sobre redirects legacy:
 *   Los 301 desde `/portfolio-single*.html`, `/about.html`, etc. hacia las
 *   nuevas rutas los hace Apache directamente en `public/.htaccess` (301
 *   HTTP reales, mejor SEO que meta-refresh HTML). Por eso NO usamos el
 *   objeto `redirects` de Astro: evitaría duplicados y contaminaría el
 *   sitemap con las URLs legacy.
 */

// https://astro.build/config
export default defineConfig({
  site: 'https://galantemilicua.com',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
  },
  integrations: [sitemap()],
  vite: {
    css: {
      // plugins.css legacy contiene hacks IE (*zoom) que LightningCSS trata
      // como error. Con errorRecovery los ignora (mismo comportamiento que
      // el navegador moderno) sin abortar el build.
      lightningcss: { errorRecovery: true },
    },
  },
});
