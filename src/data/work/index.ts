import type { Locale } from '../../i18n/routes';
import { localizedPath } from '../../i18n/utils';
import type { CaseStudy } from './types';
import { offerMap } from './offer-map';
import { editorialWorkflow } from './editorial-workflow';
import { courseSync } from './course-sync';

export type { CaseStudy, WorkImage } from './types';
export { offerMap } from './offer-map';
export { editorialWorkflow } from './editorial-workflow';
export { courseSync } from './course-sync';

/** Ordered for the work index (demonstrators surfaced first elsewhere too). */
export const caseStudies: CaseStudy[] = [offerMap, editorialWorkflow, courseSync];

/** Build a case study's localized URL: `/{locale}/{arbeiten|work}/{slug}/`. */
export function caseStudyPath(study: CaseStudy, lang: Locale): string {
  return `${localizedPath('arbeiten', lang)}${study.slug[lang]}/`;
}
