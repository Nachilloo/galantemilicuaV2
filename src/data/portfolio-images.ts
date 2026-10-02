/**
 * Registro de imágenes del portfolio para usar con `<Image />` de `astro:assets`.
 *
 * Las imágenes viven en `src/assets/portfolio/` y son procesadas por Vite:
 * hash + resize + WebP/AVIF automáticos. Este módulo expone un helper que
 * mapea la ruta legacy (`/images/folio/xxx.jpg`, tal como está guardada en
 * `src/data/projects.ts`) al `ImageMetadata` correspondiente.
 *
 * Uso:
 *
 * ```astro
 * ---
 * import { Image } from 'astro:assets';
 * import { getPortfolioImage } from '@data/portfolio-images';
 * const img = getPortfolioImage(project.gridImage);
 * ---
 * {img ? <Image src={img} alt={project.title} width={800} /> : <img src={project.gridImage} alt={project.title} />}
 * ```
 */
import type { ImageMetadata } from 'astro';

// eager: true → todas las imágenes se resuelven en tiempo de build (no runtime).
// La clave devuelta por `import.meta.glob` es la ruta absoluta desde la raíz.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/portfolio/**/*.{jpg,jpeg,png,webp,gif}',
  { eager: true },
);

/**
 * Devuelve el `ImageMetadata` para una ruta legacy tipo
 * `/images/folio/xxx.jpg` o `images/folio/xxx.jpg`.
 * Retorna `undefined` si la imagen no existe en `src/assets/portfolio/`
 * (deja que el componente caiga en el fallback `<img>`).
 */
export function getPortfolioImage(legacyPath: string): ImageMetadata | undefined {
  if (!legacyPath || legacyPath === '#') return undefined;
  // Extrae el filename: `/images/folio/ouzo01.jpg` → `ouzo01.jpg`.
  const filename = legacyPath.split('/').pop();
  if (!filename) return undefined;
  const key = `/src/assets/portfolio/${filename}`;
  return modules[key]?.default;
}
