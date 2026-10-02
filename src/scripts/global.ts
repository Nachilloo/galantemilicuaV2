/**
 * Chrome global: loader, fondos data-bg, menú, share, cursor, filtros móviles.
 * Sustituye el arranque de js/scripts.js + TweenMax + $.coretemp.
 *
 * La navegación AJAX del template (`$.coretemp`) NO se porta: Astro es un
 * sitio estático y las transiciones de página nativas son el comportamiento
 * correcto. Las clases `.ajax` se dejan por CSS.
 */
import { gsap } from 'gsap';
import { applyDataBackgrounds, isTouchDevice, on, qs, qsa } from '@scripts/lib/dom';

function initLoader(): void {
  const loader = qs<HTMLElement>('.loader');
  if (!loader) return;

  const countEl = qs('.loader_count', loader);
  let count = 0;
  const ticker = window.setInterval(() => {
    count += 1;
    if (countEl) countEl.textContent = String(count);
    if (count >= 100) window.clearInterval(ticker);
  }, 13);

  const subtitle = qs('.page-subtitle span');
  const pageTitle = qs('.content')?.dataset.pagetitle ?? '';
  if (subtitle && pageTitle) subtitle.textContent = pageTitle;

  gsap.to('.loading-text-container', {
    y: -150,
    opacity: 0,
    duration: 1,
    delay: 1.2,
    ease: 'expo.inOut',
    force3D: true,
    onComplete: () => {
      gsap.to('.loader-anim', {
        bottom: '100%',
        duration: 0.8,
        ease: 'expo.inOut',
        force3D: true,
      });
      gsap.to('.loader-anim2', {
        bottom: '100%',
        duration: 0.8,
        delay: 0.2,
        ease: 'expo.inOut',
        force3D: true,
        onComplete: () => {
          loader.style.display = 'none';
        },
      });
    },
  });
}

function initMenu(): void {
  const button = qs('.nav-button');
  const holder = qs('.nav-holder');
  const wrap = qs('.nav-holder-wrap');
  const overlay = qs<HTMLElement>('.nav-overlay');
  const line = qs('.nav-holder-wrap_line');
  const nav = qs('nav.nav-inner');
  const footer = qs('.nav-footer');
  const dec = qs('.nav-holder-wrap_dec');
  if (!button || !holder || !wrap || !overlay) return;

  wrap.classList.add('but-hol');

  const show = () => {
    holder.classList.add('nh_vis');
    overlay.style.display = 'block';
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.to(dec, { left: 0, duration: 0.6, ease: 'expo.inOut', force3D: true });
    gsap.to(footer, { bottom: 0, duration: 0.6, delay: 0.3, ease: 'expo.inOut', force3D: true });
    gsap.to(line, { top: 0, duration: 1.2, delay: 0.3, ease: 'expo.inOut', force3D: true });
    gsap.to(nav, { opacity: 1, x: 0, duration: 0.8, delay: 0.6, ease: 'expo.inOut', force3D: true });
    wrap.classList.remove('but-hol');
    button.classList.add('cmenu');
  };

  const hide = () => {
    gsap.to(line, {
      top: '100%',
      duration: 0.3,
      ease: 'expo.inOut',
      force3D: true,
      onComplete: () => {
        gsap.to(footer, { bottom: '-70px', duration: 0.2, ease: 'expo.inOut', force3D: true });
        gsap.to(nav, {
          opacity: 0,
          x: 50,
          duration: 0.4,
          ease: 'expo.inOut',
          force3D: true,
          onComplete: () => {
            gsap.to(dec, { left: '100%', duration: 0.4, ease: 'expo.inOut', force3D: true });
            holder.classList.remove('nh_vis');
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.35,
              onComplete: () => {
                overlay.style.display = 'none';
              },
            });
          },
        });
      },
    });
    wrap.classList.add('but-hol');
    button.classList.remove('cmenu');
  };

  on(button, 'click', () => {
    if (wrap.classList.contains('but-hol')) show();
    else hide();
  });
  on(overlay, 'click', hide);
}

function initShare(): void {
  const container = qs('.share-container');
  const wrapper = qs('.share-wrapper');
  const closeBtn = qs('.close-share-btn');
  const showBtn = qs('.showshare');
  if (!container || !wrapper || !closeBtn || !showBtn) return;

  if (!container.querySelector('.share-icon')) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const networks = [
      { name: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
      { name: 'twitter', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
      { name: 'linkedin', href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}` },
      { name: 'pinterest', href: `https://pinterest.com/pin/create/button/?url=${url}` },
      { name: 'tumblr', href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}` },
    ];
    container.innerHTML = networks
      .map(
        (n) =>
          `<a class="share-icon share-icon-${n.name}" href="${n.href}" target="_blank" rel="noopener noreferrer" aria-label="Share on ${n.name}"></a>`,
      )
      .join('');
  }

  const icons = qsa('.share-icon', container);

  const show = () => {
    showBtn.classList.add('uncl-share');
    container.classList.remove('isShare');
    gsap.to(wrapper, {
      width: 225,
      duration: 0.6,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.to(closeBtn, { right: 0, duration: 0.4, force3D: true });
        icons.forEach((icon, i) => {
          gsap.to(icon, { opacity: 1, duration: 1, delay: i * 0.13 });
        });
      },
    });
  };

  const hide = () => {
    showBtn.classList.remove('uncl-share');
    container.classList.add('isShare');
    gsap.to(icons, { opacity: 0, duration: 0.4 });
    gsap.to(closeBtn, {
      right: -75,
      duration: 0.4,
      force3D: true,
      onComplete: () => {
        gsap.to(wrapper, { width: 0, duration: 0.6, delay: 0.2, ease: 'expo.inOut' });
      },
    });
  };

  on(showBtn, 'click', () => {
    if (container.classList.contains('isShare')) show();
    else hide();
  });
  on(closeBtn, 'click', hide);
}

function initCursor(): void {
  const ball = qs<HTMLElement>('.element-item');
  if (!ball || isTouchDevice()) return;

  gsap.set(ball, { xPercent: -50, yPercent: -50 });
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  const ratio = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * ratio;
    pos.y += (mouse.y - pos.y) * ratio;
    gsap.set(ball, { x: pos.x, y: pos.y });
  });

  const hover = (selector: string, cls: string) => {
    qsa(selector).forEach((el) => {
      el.addEventListener('mouseenter', () => ball.classList.add(cls));
      el.addEventListener('mouseleave', () => ball.classList.remove(cls));
    });
  };

  hover('a, .btn, textarea, input, .leaflet-control-zoom, .aside-show_cf, .close-contact_form, .closedet_style', 'elem_hover');
  hover('.swiper-slide, #portfolio_horizontal_container', 'slider_hover');
  hover('.nav-overlay, .det-overlay', 'close-icon');
  hover('.next-project-swiper-link', 'slider_linknext');
  hover('.pr-det-container, .column-wrap', 'white_blur');
}

function initMobileFilters(): void {
  qsa('.act-filter').forEach((btn) => {
    on(btn, 'click', (e) => {
      e.preventDefault();
      qsa<HTMLElement>('.init_hidden_filter').forEach((panel) => {
        const open = panel.style.display === 'block';
        panel.style.display = open ? 'none' : 'block';
      });
    });
  });

  qsa('.page-scroll-nav_wrap ul li a, .gallery-filters a').forEach((link) => {
    on(link, 'click', () => {
      if (window.innerWidth < 565) {
        window.setTimeout(() => {
          qsa<HTMLElement>('.init_hidden_filter').forEach((panel) => {
            panel.style.display = 'none';
          });
        }, 600);
      }
    });
  });
}

export function setLayoutSizes(): void {
  const slideshow = qs('.slideshow-container_wrap');
  if (slideshow) {
    const h = slideshow.getBoundingClientRect().height;
    qsa<HTMLElement>('.ms-item_fs').forEach((el) => {
      el.style.height = `${h}px`;
    });
  }

  const horPad = qs('.hor-content_padd');
  const horWrap = qs<HTMLElement>('.horizontal-grid-wrap');
  if (horPad && horWrap) {
    horWrap.style.height = `${horPad.getBoundingClientRect().height - 75}px`;
  }

  const fw = qs('.fw-carousel');
  const fwSwiper = qs<HTMLElement>('.fw-carousel .swiper-container');
  if (fw && fwSwiper) {
    fwSwiper.style.height = `${fw.getBoundingClientRect().height}px`;
  }
}

let globalReady = false;

export function initGlobal(): void {
  // El módulo no se autoejecuta: BaseLayout llama a initGlobal() una sola vez.
  // Un segundo arranque duplicaba listeners del menú (abrir + cerrar al instante).
  if (globalReady) return;
  globalReady = true;

  applyDataBackgrounds();
  initLoader();
  initMenu();
  initShare();
  initCursor();
  initMobileFilters();
  setLayoutSizes();
  window.addEventListener('resize', setLayoutSizes);

  document.addEventListener('gesturestart', (e) => e.preventDefault());
}
