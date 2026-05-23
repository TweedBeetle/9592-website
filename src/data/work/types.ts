import type { Locale } from '../../i18n/routes';

/** One screenshot in a case-study gallery. Alt text is the detailed screen-reader
 *  description; caption is the short visible figcaption. Both are bilingual and were
 *  verified strip-list-clean against public/work/INVENTORY.md (C1). */
export interface WorkImage {
  /** Path under /public (e.g. `/work/offer-map-overview.png`). */
  src: string;
  /** Intrinsic pixel dimensions (retina source); used for the aspect ratio so the
   *  gallery reserves space and avoids layout shift. */
  width: number;
  height: number;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
}

/**
 * A case study, driven entirely by this data object so the award-day change is a
 * single edit (see `anonymized`).
 */
export interface CaseStudy {
  /** Stable key (also used to look up per-locale teaser copy on the index). */
  key: 'offer-map' | 'editorial-workflow';
  /** Path segment AFTER `/{locale}/{arbeiten|work}/`. Localized; free of strip-list terms. */
  slug: Record<Locale, string>;
  /**
   * WIN-FLIP FLAG.
   *
   * `true`  = anonymized Arbeitsprobe framing: generic title (authored in the page),
   *           no buyer name, "live demo on request" (no public link), screenshots only.
   * `false` = flipped (on contract award). Fill `liveUrl` + `buyerName` + `namedTitle`
   *           below and the page renders the named title plus a live-demo link button.
   *
   * This single flag, plus its payload in THIS file, is the entire award-day change.
   * No page edits are needed. See BUILD-NOTES-work.md.
   */
  anonymized: boolean;
  /** Rendered ONLY when `anonymized === false`: the public live-demo URL. */
  liveUrl?: string;
  /** Rendered ONLY when `anonymized === false`: the named client. */
  buyerName?: string;
  /** Used ONLY when `anonymized === false`: overrides the page's generic title. */
  namedTitle?: Record<Locale, string>;
  /** Gallery, ordered to follow the case study's approach narrative. */
  images: WorkImage[];
}
