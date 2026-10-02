/**
 * Sustituto de jquery.hoverdir: desliza `.grid-det` según el lado por el
 * que entra/sale el cursor. Sin esto el overlay queda en `left: -100%` y
 * los enlaces del proyecto no son clicables.
 */
import { qs, qsa } from '@scripts/lib/dom';

type Dir = 0 | 1 | 2 | 3;

function getDir(el: HTMLElement, x: number, y: number): Dir {
  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const dx = (x - rect.left - w / 2) * (w > h ? h / w : 1);
  const dy = (y - rect.top - h / 2) * (h > w ? w / h : 1);
  return (Math.round(((Math.atan2(dy, dx) * (180 / Math.PI) + 180) / 90 + 3)) % 4) as Dir;
}

function pos(dir: Dir): { left: string; top: string } {
  switch (dir) {
    case 0:
      return { left: '0', top: '-100%' };
    case 1:
      return { left: '100%', top: '0' };
    case 2:
      return { left: '0', top: '100%' };
    default:
      return { left: '-100%', top: '0' };
  }
}

function applyPos(el: HTMLElement, p: { left: string; top: string }): void {
  el.style.left = p.left;
  el.style.top = p.top;
}

export function initHoverDir(root: ParentNode = document): void {
  qsa<HTMLElement>('.portfolio_item, .gallery-items .gallery-item', root).forEach(
    (item) => {
      const overlay = qs<HTMLElement>('.grid-det', item);
      if (!overlay || overlay.dataset.hoverdir === '1') return;
      overlay.dataset.hoverdir = '1';
      overlay.style.transition = 'left 300ms ease, top 300ms ease';

      item.addEventListener('mouseenter', (e) => {
        const from = pos(getDir(item, e.clientX, e.clientY));
        overlay.style.transition = 'none';
        applyPos(overlay, from);
        requestAnimationFrame(() => {
          overlay.style.transition = 'left 300ms ease, top 300ms ease';
          applyPos(overlay, { left: '0', top: '0' });
        });
      });

      item.addEventListener('mouseleave', (e) => {
        overlay.style.transition = 'left 300ms ease, top 300ms ease';
        applyPos(overlay, pos(getDir(item, e.clientX, e.clientY)));
      });
    },
  );
}
