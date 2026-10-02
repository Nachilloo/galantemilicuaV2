# galantemilicua V2

Sitio personal de [Ignacio Galante Milicua](https://galantemilicua.com): frontend / full-stack, UX/UI y diseño, desde Gran Canaria.

Esta carpeta es la **migración a Astro** del sitio estático original (`galantemilicua/`: HTML suelto, jQuery, plugins y `scripts.js`). El look y la navegación se mantienen; el HTML, las rutas y el JS se reescribieron.

## Qué cambió respecto al original

- **Astro 7 (SSG)**: páginas en `src/pages/`, layout compartido, build a `dist/`.
- **Rutas limpias**: `/`, `/about`, `/portfolio`, `/portfolio/[slug]`, `/contacts` (y 404).
- **Portfolio en datos**: los 18 proyectos viven en `src/data/projects.ts`. El grid y las fichas se generan en build (antes el HTML del grid se montaba en runtime).
- **JS moderno**: GSAP 3, Swiper, Isotope + Packery, LightGallery 2 y Leaflet. Sin jQuery ni navegación AJAX (`$.coretemp`).
- **SEO**: `site` en `astro.config.mjs`, sitemap (`@astrojs/sitemap`), Open Graph y `robots.txt`.
- **Legacy**: 301 Apache en `public/.htaccess` desde `portfolio-single*.html`, `about.html`, etc. El formulario sigue enviando a `public/contact.php` (hosting dinahosting).

## Stack

Astro · TypeScript · GSAP · Swiper · Isotope/Packery · LightGallery · Leaflet

Node `>= 22.12`.

## Estructura

```text
src/
  pages/           # rutas (index, about, contacts, portfolio, 404)
  layouts/         # BaseLayout
  components/      # header, menú, items de portfolio, etc.
  data/            # site.ts, projects.ts
  scripts/         # init por página (global, home, about, portfolio…)
  styles/          # CSS legacy + color.css + global.css
public/            # imágenes, fonts, .htaccess, contact.php, robots.txt
```

El sitemap sale en el build, en la raíz de `dist/`:

- `dist/sitemap-index.xml`
- `dist/sitemap-0.xml`

## Comandos

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # → ./dist/
npm run preview
```

Para el servidor de desarrollo en segundo plano: `astro dev --background`.

## Despliegue

Build estático. Subir el contenido de `dist/` al hosting (Apache). No borrar `.htaccess` ni `contact.php`.
