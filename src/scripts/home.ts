/**
 * Hero slider de la home: dos Swipers sincronizados (texto + imagen).
 */
import Swiper from 'swiper';
import { Autoplay, Controller, Mousewheel, Navigation, Pagination, Parallax } from 'swiper/modules';
import { gsap } from 'gsap';
import { qs } from '@scripts/lib/dom';

export function initHome(): void {
  const textRoot = qs('.fs-gallery-wrap .swiper-container');
  const imageRoot = qs('.hero-slider-img .swiper-container');
  if (!textRoot || !qs('.home-half-slider')) return;

  const textSwiper = new Swiper(textRoot, {
    modules: [Autoplay, Controller, Mousewheel, Navigation, Pagination],
    preloadImages: false,
    loop: true,
    grabCursor: true,
    resistance: true,
    resistanceRatio: 0.6,
    speed: 2400,
    spaceBetween: 0,
    effect: 'slide',
    mousewheel: true,
    init: false,
    pagination: {
      el: '.hero-slider-wrap_pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.hsc-next',
      prevEl: '.hsc-prev',
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });

  const imageSwiper = imageRoot
    ? new Swiper(imageRoot, {
        modules: [Controller, Parallax],
        preloadImages: false,
        loop: true,
        resistance: true,
        parallax: true,
        effect: 'slide',
      })
    : null;

  if (imageSwiper) {
    textSwiper.controller.control = imageSwiper;
    imageSwiper.controller.control = textSwiper;
  }

  textSwiper.on('slideChange', () => {
    const num = (textSwiper.realIndex ?? 0) + 1;
    const current = qs('.hs_counter .current');
    if (!current) return;
    gsap.to(current, {
      y: -10,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        current.textContent = `0${num}`;
        gsap.set(current, { y: 10 });
        gsap.to(current, { y: 0, opacity: 1, duration: 0.2, delay: 0.1, ease: 'power2.out' });
      },
    });
  });

  textSwiper.on('slideChangeTransitionStart', () => {
    qs('.hc_dec')?.classList.add('start_anim');
    qs('.slider-progress-bar')?.classList.remove('act-slider');
  });
  textSwiper.on('slideChangeTransitionEnd', () => {
    qs('.hc_dec')?.classList.remove('start_anim');
    qs('.slider-progress-bar')?.classList.add('act-slider');
  });

  const autoBtn = qs('.play-pause_slider');
  autoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (autoBtn.classList.contains('auto_actslider')) {
      autoBtn.classList.remove('auto_actslider');
      textSwiper.autoplay.stop();
    } else {
      autoBtn.classList.add('auto_actslider');
      textSwiper.autoplay.start();
    }
  });

  window.setTimeout(() => {
    textSwiper.init();
    const total = Math.max(textSwiper.slides.length - 2, 1);
    const totalEl = qs('.hs_counter .total');
    if (totalEl) totalEl.textContent = `0${total}`;
    qs('.slider-progress-bar')?.classList.add('act-slider');
  }, 2000);
}
