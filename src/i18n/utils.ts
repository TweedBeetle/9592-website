import { defaultLocale, isLocale, routes, type Locale, type PageKey } from './routes';
import { ui, type UIKey } from './ui';

/** Read the active locale from a URL path (`/de/...` -> 'de'). Falls back to default. */
export function getLangFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/')[1];
  return isLocale(seg) ? seg : defaultLocale;
}

/** Drop a leading locale prefix from a pathname (`/de/blog` -> `/blog`). */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) parts.splice(1, 1);
  const result = parts.join('/');
  return result === '' ? '/' : result;
}

/** Build the localized URL for a page key in a locale (`leistungen`,'en' -> `/en/services`). */
export function localizedPath(key: PageKey, lang: Locale): string {
  const slug = routes[key][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

/** The other locale. */
export function otherLocale(lang: Locale): Locale {
  return lang === 'de' ? 'en' : 'de';
}

/** Translation accessor for chrome strings. Falls back to the default locale. */
export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLocale][key];
  };
}

/**
 * Pick the target locale from an `Accept-Language` header for the root `/` redirect.
 *
 * Per the USER OVERRIDE: browser `de-*` -> 'de', everything else -> 'en'. We inspect
 * the single highest-priority (q-sorted) language tag rather than Astro.preferredLocale,
 * which would return the best *configured* match regardless of priority (so a
 * `fr-FR,fr;q=0.9,de;q=0.5` header would wrongly resolve to 'de'). Here that visitor
 * lands on 'en' (the international/unknown default).
 */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return 'en';
  const top = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)[0];
  if (!top) return 'en';
  return top.tag === 'de' || top.tag.startsWith('de-') ? 'de' : 'en';
}
