/**
 * Grid horizontal del portfolio: Isotope + Packery + LightGallery + filtros
 * + scroll horizontal (rueda / trackpad / arrastre) + hoverdir.
 */
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import 'isotope-packery';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery-bundle.css';
import { on, qs, qsa } from '@scripts/lib/dom';
import { initHoverDir } from '@scripts/lib/hoverdir';
import { setLayoutSizes } from '@scripts/global';

const MOBILE_BREAKPOINT = 764;

function bindLightGallery(container: HTMLElement): void {
  if (container.dataset.lgBound === '1') return;
  container.dataset.lgBound = '1';

  lightGallery(container, {
    plugins: [lgZoom, lgVideo],
    selector: 'a.grid-media-zoom, a.popup-image, a.popup-video',
    download: false,
    counter: false,
    loop: false,
  });
}

function bindHorizontalScroll(wrap: HTMLElement): void {
  if (wrap.dataset.scrollBound === '1') return;
  wrap.dataset.scrollBound = '1';

  wrap.addEventListener(
    'wheel',
    (e) => {
      if (window.innerWidth < MOBILE_BREAKPOINT) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      wrap.scrollLeft += e.deltaY;
    },
    { passive: false },
  );

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  wrap.addEventListener('pointerdown', (e) => {
    if (window.innerWidth < MOBILE_BREAKPOINT) return;
    if ((e.target as HTMLElement).closest('a')) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScroll = wrap.scrollLeft;
    wrap.classList.add('is-dragging');
  });

  wrap.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    wrap.scrollLeft = startScroll - dx;
  });

  const stopDrag = () => {
    dragging = false;
    wrap.classList.remove('is-dragging');
  };
  wrap.addEventListener('pointerup', stopDrag);
  wrap.addEventListener('pointercancel', stopDrag);
  wrap.addEventListener('pointerleave', stopDrag);

  wrap.addEventListener(
    'click',
    (e) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    },
    true,
  );
}

function bindItemNavigation(container: HTMLElement): void {
  qsa<HTMLElement>('.portfolio_item', container).forEach((item) => {
    if (item.dataset.navBound === '1') return;
    item.dataset.navBound = '1';

    const link = qs<HTMLAnchorElement>('.grid-det_link', item);
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    item.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;
      window.location.assign(link.href);
    });
  });
}

function updateProgress(wrap: HTMLElement, container: HTMLElement): void {
  const bar = qs<HTMLElement>('.js-progress-bar');
  if (!bar) return;
  const max = container.scrollWidth - wrap.clientWidth;
  const pct = max > 0 ? (wrap.scrollLeft / max) * 100 : 0;
  bar.style.strokeDashoffset = String(100 - pct);
}

export function initPortfolioGrid(): void {
  const container = qs<HTMLElement>('#portfolio_horizontal_container');
  if (!container) return;

  setLayoutSizes();
  initHoverDir(container);
  bindLightGallery(container);
  bindItemNavigation(container);

  const count = qsa('.portfolio_item', container).length;
  qsa('.all-album').forEach((el) => {
    el.textContent = String(count);
  });
  qsa('.num-album span').forEach((el) => {
    el.textContent = String(count);
  });
  qsa('.num-album').forEach((el) => {
    if (!el.querySelector('span')) el.textContent = String(count);
  });

  const wrap = qs<HTMLElement>('.horizontal-grid-wrap');
  if (wrap) {
    bindHorizontalScroll(wrap);
    wrap.addEventListener('scroll', () => updateProgress(wrap, container), { passive: true });
  }

  imagesLoaded(container, () => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const iso = new Isotope(container, {
      itemSelector: '.portfolio_item',
      layoutMode: 'packery',
      // @ts-expect-error packery options are provided by isotope-packery
      packery: { isHorizontal: !isMobile, gutter: 0 },
      transitionDuration: '700ms',
    });

    const refreshCount = () => {
      const visible = iso.getFilteredItemElements().length;
      qsa('.num-album span').forEach((el) => {
        el.textContent = String(visible);
      });
      qsa('.num-album').forEach((el) => {
        if (!el.querySelector('span')) el.textContent = String(visible);
      });
    };

    iso.on('layoutComplete', refreshCount);
    iso.layout();

    qsa<HTMLAnchorElement>('.gallery-filters a').forEach((link) => {
      on(link, 'click', (e) => {
        e.preventDefault();
        wrap?.scrollTo({ left: 0, behavior: 'smooth' });
        const filter = link.dataset.filter ?? '*';
        window.setTimeout(() => iso.arrange({ filter }), 400);
        qsa('.gallery-filters a').forEach((a) => a.classList.remove('gallery-filter-active'));
        link.classList.add('gallery-filter-active');
      });
    });

    window.addEventListener('resize', () => {
      setLayoutSizes();
      iso.arrange({
        // @ts-expect-error packery options are provided by isotope-packery
        packery: { isHorizontal: window.innerWidth >= MOBILE_BREAKPOINT, gutter: 0 },
      });
    });
  });
}
