# Auditoría JS — estado tras Fase 4

El monolito `jquery + plugins.js + scripts.js` (~210 KB gzip) se sustituyó
por módulos ES en `src/scripts/`. Vite hace tree-shaking y code-splitting
por página.

## Qué se carga ahora

| Módulo | Dónde | Librerías npm |
|---|---|---|
| `global.ts` | `BaseLayout` (todas) | `gsap` |
| `home.ts` | `/` | `swiper` + gsap |
| `about.ts` | `/about` | `swiper` + gsap |
| `portfolio-grid.ts` | `/portfolio` | `isotope-layout`, `isotope-packery`, `imagesloaded`, `lightgallery` |
| `portfolio-single.ts` | `/portfolio/[slug]` | `swiper`, `lightgallery` + gsap |
| `contacts.ts` | `/contacts` | `leaflet` |

`/404` solo usa `global.ts`.

## Qué se dejó fuera a propósito

- **Navegación AJAX** (`$.coretemp`): incompatible con un sitio estático Astro.
  Los enlaces `.ajax` siguen en el HTML por CSS, pero recargan la página.
- **Swipers muertos** del template (`.fs-slider`, `.center-carousel`,
  `.single-slider`, `.hero-carousel`, `.grid-carousel`, `.gallery-items`).
- **niceScroll / hoverdir / easyPieChart / YTPlayer / menu()**: sustituidos
  por overflow nativo, IntersectionObserver, SVG y GSAP 3.
- **`src/scripts/legacy/`**: se conserva como referencia, ya no se carga.

## Fallbacks visuales

El loader, el menú overlay, el share y el cursor se portaron a GSAP 3
(`expo.inOut` ≡ `Expo.easeInOut` de TweenMax).
