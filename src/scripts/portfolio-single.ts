/**
 * Carrusel de un proyecto + LightGallery + thumbnails.
 */
import Swiper from 'swiper';
import { Mousewheel, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { gsap } from 'gsap';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery-bundle.css';
import { on, qs, qsa } from '@scripts/lib/dom';
import { setLayoutSizes } from '@scripts/global';

function bindLightGallery(): void {
  qsa('.popup-image').forEach((el) => {
    lightGallery(el as HTMLElement, {
      plugins: [lgZoom, lgVideo],
      selector: 'this',
      download: false,
      counter: false,
    });
  });
}

function initThumbnails(swiper: Swiper): void {
  const wrap = qs('.thumbnail-wrap');
  if (!wrap) return;

  qsa<HTMLImageElement>('.fw-carousel.thumb-contr .swiper-slide img').forEach((img) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb-img';
    const clone = document.createElement('img');
    clone.src = img.currentSrc || img.src;
    clone.alt = img.alt;
    thumb.append(clone);
    wrap.append(thumb);
    on(thumb, 'click', () => {
      swiper.slideTo(Array.from(wrap.children).indexOf(thumb), 500);
      hideThumbnails();
    });
  });

  const btn = qs('.show_thumbnails');
  const container = qs('.thumbnail-container');
  if (!btn || !container) return;

  on(btn, 'click', () => {
    if (btn.classList.contains('unvisthum')) showThumbnails();
    else hideThumbnails();
  });
}

function showThumbnails(): void {
  const container = qs('.thumbnail-container');
  const btn = qs('.show_thumbnails');
  if (!container || !btn) return;
  gsap.to(container, {
    top: 0,
    duration: 1,
    ease: 'expo.inOut',
    force3D: true,
    onComplete: () => {
      qsa('.thumb-img').forEach((t) => t.classList.add('visthumbnails'));
      window.setTimeout(() => container.classList.add('visthumbnails'), 200);
    },
  });
  btn.classList.remove('unvisthum');
}

function hideThumbnails(): void {
  const container = qs('.thumbnail-container');
  const btn = qs('.show_thumbnails');
  if (!container || !btn) return;
  container.classList.remove('visthumbnails');
  qsa('.thumb-img').forEach((t) => t.classList.remove('visthumbnails'));
  gsap.to(container, {
    top: '100%',
    duration: 1,
    delay: 0.2,
    ease: 'expo.inOut',
    force3D: true,
  });
  btn.classList.add('unvisthum');
}

export function initPortfolioSingle(): void {
  const root = qs('.fw-carousel .swiper-container');
  if (!root || !qs('.fw-carousel')) return;

  setLayoutSizes();
  bindLightGallery();

  if (window.innerWidth < 640) {
    qs('.fw-carousel .swiper-wrapper')?.classList.add('no-horizontal-slider');
    return;
  }

  const mouseControl = qs('.fw-carousel')?.dataset.mousecontrol === 'true';
  const totalSlides = Math.max(qsa('.fw-carousel .swiper-slide').length - 1, 1);

  const swiper = new Swiper(root, {
    modules: [Mousewheel, Navigation, Pagination, Scrollbar],
    preloadImages: false,
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 10,
    grabCursor: true,
    mousewheel: mouseControl,
    speed: 1400,
    scrollbar: { el: '.hs_init', draggable: true },
    pagination: {
      el: '.fw-carousel-counter',
      type: 'fraction',
      renderFraction: (currentClass) =>
        `<span class="${currentClass}"></span><span class="j2total">${totalSlides}</span>`,
    },
    navigation: {
      nextEl: '.fw-carousel-button-next',
      prevEl: '.fw-carousel-button-prev',
    },
  });

  initThumbnails(swiper);
}
