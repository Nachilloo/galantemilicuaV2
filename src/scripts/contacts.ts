/**
 * Mapa Leaflet + envío AJAX del formulario a /contact.php.
 */
import L from 'leaflet';
import { on, qs, qsa } from '@scripts/lib/dom';

function initMap(): void {
  const el = qs<HTMLElement>('#map-single');
  if (!el) return;

  const raw = el.dataset.latlog ?? '[28.10890152 , -15.4175241]';
  const parsed = raw
    .replace(/[[\]]/g, '')
    .split(',')
    .map((n) => Number(n.trim()));
  const latlng: L.LatLngExpression = [parsed[0] ?? 28.1089, parsed[1] ?? -15.4175];
  const popup = el.dataset.popuptext ?? '';

  const map = L.map(el).setView(latlng, 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(map);

  if (window.innerWidth > 1024) {
    map.panBy(new L.Point(-(map.getSize().x * 0.15), 0), { animate: false });
  }

  L.marker(latlng, {
    icon: L.icon({
      iconUrl: '/images/marker.png',
      iconSize: [40, 40],
      popupAnchor: [0, -26],
    }),
  })
    .addTo(map)
    .bindPopup(popup);
}

function initForm(): void {
  const form = qs<HTMLFormElement>('#contactform');
  const message = qs('#message');
  if (!form) return;

  qsa('#contactform input, #contactform textarea').forEach((field) => {
    field.addEventListener('keyup', () => {
      if (message instanceof HTMLElement) message.style.display = 'none';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = form.getAttribute('action') ?? '/contact.php';
    const submit = qs<HTMLButtonElement>('#submit', form);
    if (submit) submit.disabled = true;
    if (message instanceof HTMLElement) message.style.display = 'none';

    const body = new URLSearchParams();
    body.set('name', (qs<HTMLInputElement>('#name', form)?.value ?? '').trim());
    body.set('email', (qs<HTMLInputElement>('#email', form)?.value ?? '').trim());
    body.set('comments', (qs<HTMLTextAreaElement>('#comments', form)?.value ?? '').trim());

    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const html = await res.text();
      if (message) {
        message.innerHTML = html;
        if (message instanceof HTMLElement) message.style.display = 'block';
      }
    } catch {
      if (message) {
        message.innerHTML = '<div class="error_message">Could not send the message. Please try again.</div>';
        if (message instanceof HTMLElement) message.style.display = 'block';
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  qsa('.show_contact-form').forEach((btn) => {
    on(btn, 'click', (e) => {
      e.preventDefault();
      qs('.content-inner')?.classList.add('vis-con-form');
    });
  });

  qs('.close-contact_form')?.addEventListener('click', () => {
    qs('.content-inner')?.classList.remove('vis-con-form');
    if (message instanceof HTMLElement) message.style.display = 'none';
    form.reset();
  });
}

export function initContacts(): void {
  initMap();
  initForm();
}
