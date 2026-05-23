---
date: 2026-05-23T17:35:20
title: E1 Blog i18n Restructure
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: 424d0c2c-f215-4aec-b629-b5720d7184dc
---

## Summary

Restructured the blog into a bilingual, locale-aware collection (DE/EN) with paired
translations, an English-only affordance, a translationKey-aware language switcher, and
301 redirects from the legacy `/blog/<slug>` URLs. Feature E1 from PLAN.md, run as a
spawned implementation session in parallel with B1/B2/D1/C1.

## What Was Done

- **Collection migrated to the Astro 5 Content Layer glob loader** (`src/content/config.ts`),
  replacing the deprecated `type: 'content'`. The deciding factor: the task and the
  findings §3.2 recipe both derive locale via `post.id.split('/')`, which only yields a
  clean extensionless slug under the glob loader. Legacy `type: 'content'` keeps the
  `.mdx` extension in `post.id`, which would break the split. Confirmed the recipe shape
  (`render(post)` top-level import, `page.id.split('/')`) via Context7 against
  `/websites/astro_build_en` before coding. Added `translationKey` as an optional Zod
  field; kept the mandatory `cta` block and the rest of the schema.
- **Posts moved** to `src/content/blog/en/` (git mv, slugs unchanged). Added the DE
  translation of only `ai-support-premium-service-businesses` (PC5) at
  `src/content/blog/de/`; the other two stay EN-only. `translationKey` set on the paired
  pair.
- **New locale-aware pages** `src/pages/[lang]/blog/{index,[...slug]}.astro` (dynamic
  `[lang]` segment, matching the Astro recipe), rendering `/de/blog/<slug>` and
  `/en/blog/<slug>` (both prefixed). Deleted the old unprefixed `src/pages/blog/`. Dates
  localized via `lang`. The EN index lists all English posts; the DE index lists DE posts
  plus English-only posts carrying the `blog.onlyEnglish` pill (linking to the EN
  version, never a 404).
- **LanguageSwitcher** made blog-post-aware in a self-contained branch: on a
  `/{locale}/blog/{slug}` path it queries the collection and resolves the switch target
  from `translationKey` (jump to sibling, or degrade to the localized blog index). No
  changes to the read-only Header/Footer/Layout chrome.
- **BlogCTA** got an optional `lang` prop (defaults to `'en'`, so EN posts are
  unchanged); DE chrome strings (labels, placeholders, button states, fallback, success,
  Web3Forms subject) voice-playbooked in Sie-Form.
- **Footnotes heading** localized to "Quellen" on DE pages via the existing footnote
  script (the global markdown `footnoteLabel` can't vary per locale).
- **301 redirects** for the three legacy `/blog/<slug>` URLs to `/en/blog/<slug>/` in
  `astro.config.mjs` (PC6).

## Steering / Reasoning

- The brief flagged the switcher dilemma explicitly ("if editing shared switcher logic
  heavily, note it for F1 instead"). I judged the collection-aware branch to be contained
  (no chrome threading needed, existing behavior untouched) and shipping it now avoids a
  known 404 on the two EN-only posts' DE switcher, so I implemented rather than punted,
  and documented it.
- Read-only files (Header.astro, Footer.astro, routes.ts, ui.ts) were respected. The DE
  index surfaces English-only posts with the existing `blog.onlyEnglish` key; I did NOT
  add a `blog.onlyGerman` key (no DE-only post exists, ui.ts is read-only this wave) and
  flagged it for F1.
- Localizing BlogCTA was a judgment call beyond the literal E1 gates, made because a
  German page with an English form is a visible quality gap; kept backward-compatible.

## Verification

Build clean. Verified in the build output / dev: CTA build-fail guarantee still holds
(temp post without `cta` → `InvalidContentEntryDataError`); 301s emit `status: 301` with
`/en/blog/<slug>/` destinations in `.vercel/output/config.json`; sitemap lists both
locale trees and excludes the redirect stubs; DE/EN indexes correct; switcher jumps to
sibling on paired posts and degrades to `/de/blog/` on the unpaired ones; `<html lang>`
de/en correct; German CTA + "Quellen" render; dist blog output is strip-list clean.
Visually confirmed the DE index affordance pills and the DE post CTA via Playwright.

## Implications

- Unblocks **D3** (the bilingual anonymized procurement-demo blog writeup) — it just adds
  `de/`+`en/` MDX with a shared `translationKey`.
- The blog structure, glob-loader gotcha, switcher behavior, and BlogCTA `lang` prop are
  now documented in the project CLAUDE.md Gotchas section.

## Open Threads

- **hreflang on blog posts is not emitted** (Layout builds it from `pageKey`; posts have
  none). Index pages do emit it. Possible F1/SEO enhancement (sibling-aware alternates
  threaded through Layout). Canonical is correct per page.
- **No `blog.onlyGerman` ui key.** If a DE-only post is ever added, add the symmetric
  shared chrome key and extend the EN index branch. Flagged for F1.
- F1 will do the final nav/footer wiring + route audit; this session left switcher/CTA in
  a working state but F1 owns the cross-page audit.
- Did NOT push (repo auto-deploys from `main` on push; deploy is gated on G3). Did NOT
  edit the Executive backend (cross-project orchestrator state) from this bg session.
- Notes in `BUILD-NOTES-blog.md`.
