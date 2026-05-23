import type { Locale } from './routes';

// Chrome string dictionary (header, footer, switcher, skip link, blog affordance).
// Page-body copy is authored per-locale in the page files, NOT here.
// User-facing strings pass voice-playbook (DE: Sie-Form, no superlatives, no em dashes).

export const ui = {
  de: {
    'skip.toContent': 'Zum Inhalt springen',
    'nav.leistungen': 'Leistungen',
    'nav.arbeiten': 'Arbeiten',
    'nav.blog': 'Blog',
    'nav.menu.open': 'Menü öffnen',
    'nav.menu.close': 'Menü schließen',
    'nav.primary': 'Hauptnavigation',
    'footer.impressum': 'Impressum',
    'footer.datenschutz': 'Datenschutz',
    'footer.kontakt': 'Kontakt',
    'switcher.label': 'Sprache wählen',
    'lang.de': 'Deutsch',
    'lang.en': 'English',
    'blog.onlyEnglish': 'Nur auf Englisch verfügbar',
  },
  en: {
    'skip.toContent': 'Skip to content',
    'nav.leistungen': 'Services',
    'nav.arbeiten': 'Work',
    'nav.blog': 'Blog',
    'nav.menu.open': 'Open menu',
    'nav.menu.close': 'Close menu',
    'nav.primary': 'Primary navigation',
    'footer.impressum': 'Imprint',
    'footer.datenschutz': 'Privacy',
    'footer.kontakt': 'Contact',
    'switcher.label': 'Choose language',
    'lang.de': 'Deutsch',
    'lang.en': 'English',
    'blog.onlyEnglish': 'Only available in English',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['de'];
