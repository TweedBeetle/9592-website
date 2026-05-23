# BUILD-NOTES-blog (E1 — blog collection restructure + locale-aware routing)

Notes for E1. Append-only log of judgment calls, deviations, and anything not
reconstructable from the code. My own notes file (shared BUILD-NOTES.md is the
Phase A foundation log; BUILD-NOTES-legal.md is the B1/B2 session's).

Authoritative source order: PLAN.md (incl. `⚠️ USER OVERRIDES`) > VISION.md >
research/presence-findings.md (§3.2 content-collection strategy).

## Context7 confirmation (done before coding)

Queried `/websites/astro_build_en` (content collections, i18n recipe, glob loader):

- The official Astro i18n recipe derives locale + slug from the entry id:
  `const [lang, ...slug] = page.id.split('/')`, and renders with the top-level
  `render(entry)` from `astro:content` (NOT `entry.render()`). This recipe shape is
  the glob-loader / Content Layer API, whose `id` is **extensionless** (`en/<slug>`).
- The legacy `type: 'content'` collections API (what this project used) produces
  `entry.id` **with** the `.mdx` extension (`en/<slug>.mdx`) and a separate
  `entry.slug`. So `post.id.split('/')` under the legacy loader would carry `.mdx`
  into the routed slug.

## Key decision: migrated the blog collection to the glob loader (Content Layer)

`src/content/config.ts` now uses `loader: glob({ pattern: '**/[^_]*.{md,mdx}', base:
'./src/content/blog' })` instead of `type: 'content'`. Reasons:

1. The task instruction and the findings recipe both say derive lang via
   `post.id.split('/')`. That only yields a clean (extensionless) slug under the glob
   loader. With legacy `type: 'content'`, `id` is `en/<slug>.mdx` and routing would
   need an ad-hoc `.replace(/\.mdx$/, '')`.
2. Legacy `type: 'content'` is deprecated in Astro 5 and slated for removal in Astro 6.
   The glob loader is the non-deprecated, future-proof path.
3. Migration is contained: the two blog page files were being rewritten anyway, so the
   switch to `render(entry)` + `entry.id` cost nothing extra.

`translationKey` added as an **optional** Zod field. The mandatory `cta` block and the
rest of the schema are unchanged.

## Content moves (PC5)

- The three existing posts moved to `src/content/blog/en/` (slugs unchanged), via
  `git mv` to preserve history.
- `translationKey: "ai-support-premium-service-businesses"` set on the paired EN post
  and on the new DE translation. The other two EN posts have NO `translationKey`
  (legal — they build fine without it; that is the "no build break" gate).
- DE translation of only `ai-support-premium-service-businesses` created at
  `src/content/blog/de/...` (PC5). The other two stay EN-only with the affordance.

## Routing: dynamic `[lang]` segment (matches the Astro recipe)

New page files:
- `src/pages/[lang]/blog/index.astro` (getStaticPaths emits one path per locale)
- `src/pages/[lang]/blog/[...slug].astro` (getStaticPaths maps each post; lang+slug
  split off `post.id`)

Old unprefixed `src/pages/blog/index.astro` + `[...slug].astro` deleted (`git rm`).

Chose the dynamic `[lang]` folder over duplicated physical `de/blog/` + `en/blog/`
folders: it is DRY, collection-driven, and matches the official recipe exactly. No
route collision with the static `de/`/`en/` homepage folders (paths differ: `/de/` vs
`/de/blog/`). Both `/de/blog/...` and `/en/blog/...` resolve in `astro dev` (they are
prefixed, so they pass the dev i18n prefix check — this also fixes the dev-only 404 the
old unprefixed `/blog` had, noted in BUILD-NOTES Phase A).

## Trailing-slash convention

Astro builds directory format (`/en/blog/<slug>/index.html`), so the canonical URL
carries a trailing slash. All blog-post links, the 301 redirect destinations, and the
switcher sibling hrefs use the trailing-slash form to match the canonical and avoid a
follow-up normalization hop.

## 301 redirects (PC6)

Added to `astro.config.mjs` `redirects` (object form, explicit `status: 301`). Verified
in `.vercel/output/config.json`: the three legacy `/blog/<slug>` URLs emit
`status: 301` with `Location: /en/blog/<slug>/`. Astro's sitemap correctly excludes the
redirect stub pages (sitemap lists only the real locale pages).

## Blog index affordance (asymmetric by design)

- **EN index** lists all English posts, no affordance (English is the superset).
- **DE index** lists DE posts, and additionally surfaces English-only posts (those with
  no DE sibling) with the `blog.onlyEnglish` pill ("Nur auf Englisch verfügbar"),
  linking to the English version (never a 404). Sorted newest-first across both.

The affordance is rendered with existing design tokens (mono, muted border pill). Page
body/header copy ("Blog", intro, "Zurück"/"Back", empty state) is authored per-locale
in the page file, NOT in `ui.ts` (per the task: only genuinely shared chrome touches
ui.ts). Only the shared `blog.onlyEnglish` key is consumed from `ui.ts` (already
present; not edited).

## Shared components I edited (and why it is safe)

The task lists Header.astro + Footer.astro as read-only; those were NOT touched.
LanguageSwitcher.astro and BlogCTA.astro are not in the read-only list, and the edits
are additive/backward-compatible:

- **LanguageSwitcher.astro** — added a self-contained branch: on a `/{locale}/blog/{slug}`
  path it queries the collection, finds the post by id, and resolves the switch target
  from `translationKey` (jump to sibling, or degrade to `/{locale}/blog/` index). All
  logic lives inside the switcher (driven by URL + collection), so the global chrome
  (Header/Footer/Layout) is untouched and no new prop is threaded. Existing static-page
  behavior (pageKey route-map / stripLocale fallback) is unchanged. This is the
  "use translationKey, never 404" gate. **NOT punted to F1** — it is contained and
  shipping it now avoids a known 404 on the two EN-only posts' DE switcher.
  - Verified: paired EN post -> DE link = `/de/blog/ai-support.../`; unpaired EN post
    -> DE link = `/de/blog/`; paired DE post -> EN link = `/en/blog/ai-support.../`.
- **BlogCTA.astro** — added an optional `lang?: 'de'|'en'` prop (defaults to `'en'`, so
  all existing EN posts render byte-identically). When `lang='de'` the component chrome
  (field labels, placeholders, button status text, email-fallback line, success message,
  Web3Forms subject prefix) is German. The post page passes `lang` derived from the
  entry id. DE strings ran through voice-playbook (Sie-Form, no em dashes, no
  superlatives).

## Footnotes label localization

remark renders the footnotes section heading in English ("Footnotes"). On German pages
the existing footnote DOMContentLoaded script now rewrites that heading to "Quellen"
(guarded by `document.documentElement.lang === 'de'`). Chosen over changing the global
markdown `footnoteLabel` because that config is single/global and cannot vary per
locale without splitting the pipeline. EN posts are unaffected. Verified live.

## voice-playbook (DE copy)

Ran the voice-playbook skill before writing any DE copy. Applied to: the full DE
translation of the ai-support post (body + frontmatter title/description/cta), the DE
blog-index page strings, and the BlogCTA DE chrome. Sie-Form throughout, no em dashes
(the one em dash in the English source — "without human escalation—often half" — was
replaced with a comma), no superlatives ("dramatic" -> "erheblich"), no emoji. Real
cited figures kept in their source currency (Sierra $100M, Klarna $40M, $70,000 Tahoe);
the hypothetical small-business math localized to euros (2.000 / 3.000 / 36.000 €) since
it is a generic illustration for the DACH reader. German number/percent formatting
("62 %", "2,3 Millionen", "3.000 Euro"). This post is editorial content discussing AI
support as a market topic, so it does not violate the "never lead with KI-Agentur /
AI-as-product" positioning rule (that rule governs the company's self-description, not
blog topic titles); title parallels the live EN counterpart.

## Gate results (PLAN E1)

- Build clean with `translationKey` absent on legacy posts: PASS (the two EN-only posts
  carry no translationKey; build green).
- Mandatory-CTA build-fail guarantee still holds: PASS (temp post without `cta` ->
  `InvalidContentEntryDataError ... cta: Required`, build failed; temp file removed).
- DE blog shows the DE post + affordance for EN-only ones: PASS (verified in built HTML
  and visually — 2 "Nur auf Englisch verfügbar" pills, 1 DE post).
- EN blog shows all English posts: PASS (3 posts, no affordance).
- Three old `/blog/<slug>` URLs 301 to `/en/blog/<slug>/`: PASS (verified in
  `.vercel/output/config.json`, status 301).
- Renders at `/de/blog/<slug>` and `/en/blog/<slug>`: PASS (dev 200s; `<html lang>`
  de/en correct; localized dates; German/English CTA chrome).
- Switcher paired -> sibling, unpaired -> graceful degrade (never 404): PASS.
- Zero strip-list strings: PASS (grep of `dist/client/{de,en}/blog` for the §4.5 terms
  returned nothing; these posts are generic and unrelated to the procurement buyer).

## Flags for the orchestrator / F1

- **hreflang for blog posts is not emitted.** `Layout.astro` builds hreflang alternates
  from the `pageKey` route-map; blog posts carry no pageKey (the slug is not in the
  map), so no `<link rel="alternate" hreflang>` is emitted on post pages. Canonical is
  still correct per page. A proper per-post hreflang (de/en sibling + x-default) would
  need sibling-aware alternates threaded through `Layout.astro` (out of E1's gate set).
  Possible F1/SEO enhancement. The blog **index** pages DO emit hreflang (they pass
  `pageKey="blog"`).
- **No `blog.onlyGerman` chrome string exists.** `ui.ts` (read-only this wave) only has
  `blog.onlyEnglish`, so the EN index does not surface DE-only posts with an affordance.
  There are currently no DE-only posts, so this is moot. If a DE-only post is ever
  added, a symmetric `blog.onlyGerman` key (genuinely shared chrome) should be added to
  `ui.ts` and the EN index branch extended. Flagging rather than editing the read-only
  `ui.ts`.
- The `/` redirect remains a Vercel serverless function (Phase A); unchanged here.
