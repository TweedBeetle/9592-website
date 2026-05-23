import type { Locale } from '../../i18n/routes';
import { localizedPath } from '../../i18n/utils';
import type { CaseStudy } from './types';
import { offerMap } from './offer-map';
import { editorialWorkflow } from './editorial-workflow';

export type { CaseStudy, WorkImage } from './types';
export { offerMap } from './offer-map';
export { editorialWorkflow } from './editorial-workflow';

/** Ordered for the work index (demonstrators surfaced first elsewhere too). */
export const caseStudies: CaseStudy[] = [offerMap, editorialWorkflow];

/** Build a case study's localized URL: `/{locale}/{arbeiten|work}/{slug}/`. */
export function caseStudyPath(study: CaseStudy, lang: Locale): string {
  return `${localizedPath('arbeiten', lang)}${study.slug[lang]}/`;
}
