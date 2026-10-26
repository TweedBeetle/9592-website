import type { CaseStudy } from './types';

// The StudyPro (Make.com), a named CLIENT project, not a demonstrator. Its page
// (src/pages/{en/work,de/arbeiten}/make-*.astro) renders through
// ClientCaseStudy.astro, not CaseStudy.astro, and has no gallery: the demo
// screenshots showed the demonstrator's design, which a reader would take for her
// live system. Page copy: make-work drafts/route6-named-page.md (Christo lgtm
// 2026-10-26). What the page says about her system comes only from what she
// published (her Make Community review, her July hiring post, thestudypro.com).
// The URL slugs are unchanged from the anonymous page, so existing links still work.

export const courseSync: CaseStudy = {
  key: 'course-sync',
  slug: { de: 'make-kursanmeldungen', en: 'make-course-enrollments' },
  anonymized: false,
  buyerName: 'The StudyPro',
  eyebrow: { en: 'Client project', de: 'Kundenprojekt' },
  images: [],
};
