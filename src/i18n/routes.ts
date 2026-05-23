// Central route-map (PC1): page key -> per-locale slug.
//
// The slug is the path segment AFTER the locale prefix. An empty string means the
// locale root (`/de/` or `/en/`). Localized slugs (leistungen/services, arbeiten/work)
// read correctly in each language; impressum / datenschutz / blog are kept identical
// across locales (recognized German legal terms / universal). `kontakt` <-> `contact`
// per the USER OVERRIDE (EN contact page lives at /en/contact).
//
// Collapse a row to identical values to reverse a localized slug.

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export type PageKey =
  | 'home'
  | 'leistungen'
  | 'arbeiten'
  | 'blog'
  | 'impressum'
  | 'datenschutz'
  | 'kontakt';

export const routes: Record<PageKey, Record<Locale, string>> = {
  home: { de: '', en: '' },
  leistungen: { de: 'leistungen', en: 'services' },
  arbeiten: { de: 'arbeiten', en: 'work' },
  blog: { de: 'blog', en: 'blog' },
  impressum: { de: 'impressum', en: 'impressum' },
  datenschutz: { de: 'datenschutz', en: 'datenschutz' },
  kontakt: { de: 'kontakt', en: 'contact' },
};

export function isLocale(value: string | undefined): value is Locale {
  return value === 'de' || value === 'en';
}
