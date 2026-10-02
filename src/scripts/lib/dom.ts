/** Helpers DOM mínimos para no arrastrar jQuery. */

export function qs<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector(selector);
}

export function qsa<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll(selector));
}

export function on<K extends keyof HTMLElementEventMap>(
  el: EventTarget | null,
  type: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  el?.addEventListener(type, handler as EventListener, options);
}

export function applyDataBackgrounds(root: ParentNode = document): void {
  qsa<HTMLElement>('.bg[data-bg]', root).forEach((el) => {
    const src = el.dataset.bg;
    if (src) el.style.backgroundImage = `url(${src})`;
  });
}

export function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const viewH = window.innerHeight || document.documentElement.clientHeight;
  const viewW = window.innerWidth || document.documentElement.clientWidth;
  return rect.height > 0 && rect.width > 0 && rect.bottom > 80 && rect.top < viewH - 40 && rect.right > 0 && rect.left < viewW;
}

/** Dispara `onAppear` la primera vez que el elemento entra en el área visible. */
export function appearOnce(el: HTMLElement, onAppear: () => void): void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    onAppear();
  };

  const check = () => {
    if (isInViewport(el)) run();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) run();
    },
    { root: null, threshold: 0 },
  );
  observer.observe(el);

  const scrollers: EventTarget[] = [
    window,
    document,
    document.getElementById('wrapper'),
    document.querySelector('.content'),
    document.querySelector('.column-wrap'),
  ].filter((node): node is EventTarget => node != null);

  scrollers.forEach((node) => node.addEventListener('scroll', check, { passive: true }));
  window.addEventListener('resize', check);
  const pulse = window.setInterval(check, 300);

  function cleanup(): void {
    observer.disconnect();
    scrollers.forEach((node) => node.removeEventListener('scroll', check));
    window.removeEventListener('resize', check);
    window.clearInterval(pulse);
  }

  requestAnimationFrame(check);
}
