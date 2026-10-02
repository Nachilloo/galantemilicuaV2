/**
 * Configuración global del sitio.
 * Un único punto donde centralizar el nombre, contacto y redes,
 * para no repetir strings en cada página/componente.
 */

export interface SocialLink {
  label: string;
  href: string;
  icon: string; // clase FontAwesome (fab fa-...)
}

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  title: 'Ignacio Galante Milicua Personal Site',
  shortName: 'Ignacio Galante Milicua',
  defaultLang: 'en',
  contact: {
    phone: '+34 629021262',
    phoneHref: 'tel:+34629021262',
    email: 'galantemilicua@gmail.com',
    emailHref: 'mailto:galantemilicua@gmail.com',
  },
  location: {
    label: 'Based In Gran Canaria',
    lat: 28.10890152,
    lon: -15.4175241,
    mapsUrl:
      "https://www.google.com.ua/maps/place/28%C2%B006'31.7%22N+15%C2%B025'02.3%22W/@28.108794,-15.4194792,17z/data=!3m1!4b1!4m4!3m3!8m2!3d28.108794!4d-15.417314?entry=ttu",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: '#', icon: 'fab fa-facebook-f' },
  { label: 'Instagram', href: '#', icon: 'fab fa-instagram' },
  { label: 'Twitter', href: '#', icon: 'fab fa-twitter' },
  { label: 'VK', href: '#', icon: 'fab fa-vk' },
];

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contacts', href: '/contacts' },
];
