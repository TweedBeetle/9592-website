# BUILD-NOTES

Running log of judgment calls, deviations, and anything not reconstructable from the
code. Append as work proceeds.

## Phase A — Foundation (privacy + i18n spine)

Session scope: A1–A4 only (per orchestrator). Phases B/C/D/E NOT started.
Authoritative source ordering: PLAN.md (incl. the `⚠️ USER OVERRIDES` block, which
supersedes contrary plan text) > VISION.md > research/presence-findings.md.

### Context7 confirmation (done before coding A2–A4)

Queried `/websites/astro_build_en` (i18n routing, on-demand rendering, `astro:i18n`):

- **`prefixDefaultLocale: true`** requires *all* page content under a locale folder
  (`src/pages/de/...`, `src/pages/en/...`). Per the docs a bare root content file
  "would result in a 404 unless a fallback strategy is defined." Verified empirically
  during the build (see A2 notes for what actually happened to `/blog`).
- **`Astro.preferredLocale` / `Astro.request.headers`** expose the `Accept-Language`
  header, but only on **on-demand** routes (`export const prerender = false`).
- **`astro:i18n`** exports `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`,
  `getLocaleByPath`, `getPathByLocale`, etc.

### i18n mechanism chosen (and why)

- **Config:** `locales: ['de','en']`, `defaultLocale: 'de'` (Astro's internal fallback
  only), `routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }`.
  Per the USER OVERRIDE both locales are explicitly prefixed (`/de/...`, `/en/...`);
  there is no unprefixed content tree. `redirectToDefaultLocale: false` because Astro's
  built-in `/` -> `/de` redirect is a *static default*; the override requires a real
  per-request `Accept-Language` decision, so we own the `/` route ourselves.
- **Root `/` redirect:** `src/pages/index.astro` with `export const prerender = false`
  (on-demand). It parses the `Accept-Language` header: highest-priority (q-sorted)
  language tag with primary subtag `de` -> redirect `/de/`; everything else -> `/en/`.
  302 (not 301: the target is request-dependent) + `Vary: Accept-Language` so any cache
  layer (Cloudflare) keys per language. This is the override's "real per-request
  decision, not a static default."
  - **Refinement vs `Astro.preferredLocale`:** `preferredLocale` returns the best
    *configured* match regardless of priority, so a header like `fr-FR,fr;q=0.9,de;q=0.5`
    would resolve to `de`. The override says "browser `de-*` -> /de, everything else ->
    /en", so we instead inspect the single highest-priority tag. A fr-primary visitor
    who also lists de therefore lands on `/en` (the international/unknown default),
    matching the override intent. Implemented in `src/i18n/utils.ts:pickLocaleFromAcceptLanguage`.
- **Vercel:** the on-demand `/` becomes a serverless function via `@astrojs/vercel`
  (already configured). No `vercel.json` needed; chose the Astro-native path over a
  `vercel.json` `has`-header regex because q-value parsing in code is more faithful to
  the override than a coarse header regex, and it is unit-testable in `astro dev`.

### Scope boundaries honored

- **Contact page (`/kontakt` ↔ `/en/contact`, USER OVERRIDE item 1):** NOT built this
  session (it is content, belongs to a later phase). The footer "Kontakt" link points
  at its eventual route per A4's allowance ("footer links may target routes not built
  yet"). Orchestrator: slot the contact-page build into a later phase.
- **`legal.ts` phone:** omitted entirely per the override (mobile number must not appear
  on any public surface). The constant has no `phone` field.
- **Nav targets:** Header nav (Leistungen/Arbeiten/Blog) points at the final localized
  routes via the route-map. Those routes 404 until B/D/E land; final wiring + route
  audit is F1. This is the A4-permitted interim state.
- **Homepage content:** `/de/` + `/en/` homepages created so the routes resolve. The
  hero/selected-work *reframe* is D4; this session ports the existing homepage content
  (EN as-is; DE a faithful translation) and wires it into the new bilingual shell.
  Authoritative voice-playbook pass on homepage body copy is D4's gate.

### A2 empirical findings (verified against `astro dev` + build)

- **Physical unprefixed routes still generate under `prefixDefaultLocale: true`.** The
  Context7 doc warned a bare root content file "would 404"; in practice `src/pages/blog/*`
  still prerenders to static `/blog/...index.html` in the build. The docs' 404 caveat is
  about i18n *content fallback resolution*, not physical file routing.
- **`/blog` 404s in `astro dev` but not in the build.** The astro-dev i18n layer enforces
  the locale prefix at request time and 404s unprefixed `/blog`; the production build still
  emits `/blog/index.html` as a static asset (Vercel serves static files before the
  on-demand function, so inbound `/blog` links keep working in prod). Known, acceptable
  interim state: **E1 relocates the blog under `/de/blog` + `/en/blog` and adds 301
  redirects from the legacy `/blog/<slug>` URLs.** Phase A does not touch the blog.
- **Root `/` redirect verified** in dev with curl:
  `Accept-Language: de-DE,...` -> 302 `/de/`; `en-US` -> `/en/`;
  `fr-FR,fr;q=0.9,de;q=0.5` -> `/en/` (faithful to the override, not `/de/`);
  no header -> `/en/`. `Vary: Accept-Language` + `Cache-Control: no-store` present.

### A4 shell (Header / Footer / LanguageSwitcher)

- **frontend-design lens:** refined minimalism on the existing dark system (not the
  skill's maximalist push) — the overriding constraints are design-system consistency
  (cross-cutting #3) + procurement-evaluator credibility. Hairline borders, established
  tokens, mono wordmark, subtle hover, accessible-first.
- **Switcher** preserves the current page via the route-map (`localizedPath(pageKey, target)`),
  with a stripLocale fallback for pages without a pageKey. Active locale = a non-link
  `<span aria-current="true">`; the other is a focusable `<a>` with visible focus.
- **Header** mobile menu: button with `aria-expanded` / `aria-controls`; panel toggles the
  `hidden` attr; Esc closes and returns focus to the toggle; click-outside closes; a
  `matchMedia` listener resets state when crossing to desktop width. No focus trap.
  44x44 touch target on the toggle.
- **Footer** entity line built from `legal.ts`: "9592 Solutions UG (haftungsbeschränkt) ·
  Amtsgericht München HRB 287814 · USt-IdNr. DE364316497" (register fact = München, not
  Düsseldorf). Separators are `·`, not em dashes.
- **Skip link** in Layout targets `#main`; all page `<main>` elements carry `id="main"`
  (homepages + blog pages). Visible on `:focus`.
- **voice-playbook pass (chrome strings, DE+EN):** conventional single-word UI labels,
  no superlatives / em dashes / emoji; "haftungsbeschränkt" spelled out, "USt-IdNr."
  canonical. Recorded choice: EN legal labels use "Imprint" / "Privacy" (conventional
  English renderings of Impressum / Datenschutz). No string changes were needed.

### Phase A verification (isolated headless Chromium against `astro dev`)

The Playwright MCP browser was held by a parallel session (C1 screenshots), so I drove
an isolated Chromium via `playwright-core` + an explicit `executablePath` (no project
dependency added, per constraint #5). Results:

- **Network capture (A1 runtime gate):** zero requests to fonts.googleapis / fonts.gstatic
  / cdn.mxpnl / mixpanel on both `/de/` and `/en/`.
- **Fonts:** h1 computes to `Inter, ...` (self-hosted, served from localhost).
- **Mobile menu:** hidden -> open on click (`aria-expanded=true`) -> Esc closes -> focus
  returns to the toggle.
- **Switcher:** clicking EN on `/de/` navigates to `/en/` (same page).
- **Visual:** header + footer render correctly desktop + mobile, both locales; dark theme
  and Inter/JetBrains Mono intact; no layout regressions. Screenshots in the job dir.

### For the orchestrator / later phases

- **Contact page (`/kontakt` ↔ `/en/contact`)** still needs building (USER OVERRIDE item 1).
  Footer "Kontakt"/"Contact" already points at it.
- **Nav targets** (`/{locale}/leistungen|arbeiten|blog`) and **footer legal targets**
  (`/{locale}/impressum|datenschutz|kontakt`) 404 until B1/B2/D1/D-contact/E1 land. F1 is
  the route-wiring + audit gate.
- **Blog** stays at unprefixed `/blog` (English) this phase; E1 relocates it under locales
  with 301s and per-locale `lang`.
- **Runtime `/` redirect** is a Vercel serverless function (on-demand). Not exercised by
  `astro preview` (Vercel adapter); verified in `astro dev`. Confirm on the real deploy in
  G3 (out of this session's scope; do NOT deploy here).

## Phase C — Demo screenshots (C1)

Session scope: C1 only (independent; gates D2). Touched only `public/work/` (new PNGs +
`INVENTORY.md`) and `scripts/capture-work-screenshots.mjs`. No `src/`, config, or demo-repo
source modified. Full per-image captions + bilingual alt text + the anonymization rationale
live in `public/work/INVENTORY.md` (the case-study session D2 should mine that file).

- **11 retina PNGs shipped:** offer map (5) — `overview` (category-aware marker clustering),
  `filters`, `radius` (PLZ + Umkreis), `list` (accessible list view), `mobile`; editorial CMS
  (6) — `personas`, `submit` (5-step contributor form), `intake-queue`, `diff`, `audit-log`,
  `reminders` (preview outbox). Captured via the demos' own Playwright/local servers
  (offer-map `npm run preview` :4173; CMS `npm run db:reset && npm run pages:dev` :8788).
- **Anonymization (no blurring).** Offer map: the buyer-named header + ~1.600-entry
  disclosure footer are excluded by clipping each shot to the filter-strip+map region (header
  above the clip, footer below). CMS: identifying tokens are interleaved with content the shot
  must show (header `KNE CMS Demo`, persona `KNE-Redakteurin`, audit actor `KNE-REDAKTION`),
  so the capture script rewrites them to the generic framing (`KNE-`→`` , `Kompetenznetz
  Einsamkeit`→`Beratungsnetzwerk`, internal `(Konzept §x)` refs dropped) in the rendered DOM
  text nodes at capture time. Not a demo-repo edit; it is VISION decision 2's sanctioned
  anonymization. A per-shot residual-token check ran clean; every PNG was visually inspected.
- **Deviation — `offer-map-nationwide.png` not produced.** The requested
  "nationwide-offers surface" does not exist as a distinct UI in the offer-map prototype
  (no such surface/string in the built app; all seeded offers carry an address). Absent
  feature, not an anonymization failure. **Orchestrator:** if the case study needs it, it
  must be built in the demo first. The other five offer-map shots cover the demonstrated
  capabilities.
- **Win-flip note for D2:** these are the anonymized assets. On award, re-capture against a
  rebranded demo (or drop the anonymization transform) and swap in named versions.
