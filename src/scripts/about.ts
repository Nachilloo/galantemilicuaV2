/**
 * About: slideshow de la columna fija, testimonios, skillbars, piecharts
 * y navegación por secciones.
 */
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';
import { appearOnce, on, qs, qsa } from '@scripts/lib/dom';
import { setLayoutSizes } from '@scripts/global';

function initSlideshow(): void {
  const root = qs('.slideshow-container_wrap .swiper-container');
  if (!root) return;
  const swiper = new Swiper(root, {
    modules: [Autoplay, EffectFade, Pagination],
    preloadImages: false,
    loop: true,
    speed: 1400,
    spaceBetween: 0,
    effect: 'fade',
    init: false,
    autoplay: { delay: 2500, disableOnInteraction: false },
    pagination: { el: '.fcwc-pagination', clickable: true },
  });
  window.setTimeout(() => swiper.init(), 2000);
}

function initTestimonials(): void {
  const root = qs('.testimonilas-carousel .swiper-container');
  if (!root) return;
  new Swiper(root, {
    modules: [Navigation, Pagination],
    preloadImages: false,
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    pagination: { el: '.tc-pagination', clickable: true },
    navigation: { nextEl: '.tc-button-next', prevEl: '.tc-button-prev' },
    breakpoints: {
      801: { slidesPerView: 2 },
    },
  });
}

function initSkillbars(): void {
  const box = qs<HTMLElement>('.skillbar-box');
  if (!box) return;

  const play = () => {
    qsa<HTMLElement>('.skillbar-bg', box).forEach((bar, i) => {
      const fill = qs<HTMLElement>('.custom-skillbar', bar);
      if (!fill) return;
      gsap.fromTo(
        fill,
        { width: 0 },
        {
          width: bar.dataset.percent ?? '0',
          duration: 1.5,
          delay: 0.35 + i * 0.08,
          ease: 'power2.out',
        },
      );
    });
  };

  appearOnce(box, play);
}

function initPiecharts(): void {
  const holder = qs<HTMLElement>('.piechart-holder');
  if (!holder) return;
  const color = holder.dataset.skcolor ?? '#F2842F';

  const draw = (chart: HTMLElement) => {
    if (chart.dataset.drawn === '1') return;
    chart.dataset.drawn = '1';

    const percent = Number(chart.dataset.percent ?? 0);
    const size = 70;
    const stroke = 12;
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.zIndex = '1';

    const bg = document.createElementNS(ns, 'circle');
    bg.setAttribute('cx', String(size / 2));
    bg.setAttribute('cy', String(size / 2));
    bg.setAttribute('r', String(radius));
    bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', '#3a3a3a');
    bg.setAttribute('stroke-width', String(stroke));

    const fg = document.createElementNS(ns, 'circle');
    fg.setAttribute('cx', String(size / 2));
    fg.setAttribute('cy', String(size / 2));
    fg.setAttribute('r', String(radius));
    fg.setAttribute('fill', 'none');
    fg.setAttribute('stroke', color);
    fg.setAttribute('stroke-width', String(stroke));
    fg.setAttribute('stroke-linecap', 'butt');
    fg.setAttribute('stroke-dasharray', String(circ));
    fg.setAttribute('stroke-dashoffset', String(circ));
    fg.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);

    svg.append(bg, fg);
    chart.style.position = 'relative';
    chart.style.display = 'inline-block';
    chart.style.width = `${size}px`;
    chart.style.height = `${size}px`;
    chart.prepend(svg);

    const label = qs('.percent', chart);
    const state = { value: 0 };
    gsap.to(state, {
      value: percent,
      duration: 3.5,
      ease: 'power2.out',
      onUpdate: () => {
        fg.setAttribute('stroke-dashoffset', String(circ * (1 - state.value / 100)));
        if (label) label.textContent = String(Math.round(state.value));
      },
    });
  };

  const charts = qsa<HTMLElement>('.chart', holder);
  const start = () => charts.forEach(draw);
  appearOnce(holder, start);
  charts.forEach((chart) => appearOnce(chart, () => draw(chart)));
}

function initSectionNav(): void {
  const links = qsa<HTMLAnchorElement>('.page-scroll-nav_wrap a.scroll-link');
  const sections = qsa<HTMLElement>('section.scroll_sec');
  const total = qs('.sc_total');
  if (total) total.textContent = `0${sections.length}`;

  links.forEach((link) => {
    on(link, 'click', (e) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (!sections.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = (visible.target as HTMLElement).id;
      links.forEach((link) => {
        link.classList.toggle('act-sec', link.getAttribute('href') === `#${id}`);
      });
      const idx = sections.findIndex((s) => s.id === id);
      const current = qs('.sc_current span');
      if (current && idx >= 0) current.textContent = String(idx + 1).padStart(2, '0');
    },
    { threshold: 0.35 },
  );
  sections.forEach((s) => observer.observe(s));
}

function initProcessDetails(): void {
  qsa('.show-phdc').forEach((btn) => {
    on(btn, 'click', () => {
      const panel = btn.parentElement?.querySelector<HTMLElement>('.proces-details-content');
      if (panel) gsap.to(panel, { bottom: 0, duration: 1.2, ease: 'expo.inOut', force3D: true });
    });
  });
  qsa('.close-hidden_pdc').forEach((btn) => {
    on(btn, 'click', () => {
      const panel = btn.closest('.process-details')?.querySelector<HTMLElement>('.proces-details-content');
      if (panel) gsap.to(panel, { bottom: '-100%', duration: 0.6, ease: 'expo.inOut', force3D: true });
    });
  });
}

function initScrollChrome(): void {
  const bar = qs<HTMLElement>('.js-progress-bar');
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop / Math.max(doc.scrollHeight - window.innerHeight, 1);
    if (bar) bar.style.strokeDashoffset = String(100 - scrolled * 100);
  });

  qs('.to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function initAbout(): void {
  setLayoutSizes();
  initSkillbars();
  initPiecharts();
  initSlideshow();
  initTestimonials();
  initSectionNav();
  initProcessDetails();
  initScrollChrome();
}
