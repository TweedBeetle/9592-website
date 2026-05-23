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
