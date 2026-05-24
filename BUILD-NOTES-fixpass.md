# Build Notes: Pre-deploy review fix pass (code/copy)

Scope: the website-code/copy findings from `REVIEW-FINDINGS.md` — **M2, M3, M4, m1, m3, m6**.
Out of scope (owned by a parallel screenshot session): **B1, M1, m5** (screenshot re-capture), and the
screenshot tooling (`scripts/capture-work-screenshots.mjs`, `public/work/*.png`,
`BUILD-NOTES-screenshots.md`). Also not addressed here: **m2** (case-study language switcher lands on
the work index — documented intentional tradeoff) and **m4** (mobile screenshot lightbox).

Session: 899db7cb-a157-476c-a861-ae81ef8f0b7f. Date: 2026-05-23. Not deployed.

---

## M2 (MAJOR) — German contact form was half-English on `/de/` and `/de/leistungen/`

**Root cause:** `ContactCTA.astro` defaults every form-chrome string to English (`emailLabel="Email"`,
`messageLabel="What are you working on?"`, `fallbackBefore="Or email me directly at"`,
`subject="New project inquiry from 9592.tech"`). `/de/kontakt` and `/de/arbeiten` pass the German
overrides; the homepage and Leistungen page did not, so they rendered English chrome amid German copy.

**Fix:** passed the German overrides on both pages, reusing the exact strings already shipped on
`/de/arbeiten` (`E-Mail`, `Worum geht es?`, `Oder schreiben Sie mir direkt an`, `Wird gesendet...`,
`Fehler, bitte erneut versuchen`, `Danke! Ich melde mich in Kürze.`). Web3Forms subjects are
page-specific for source attribution: homepage `Neue Anfrage über 9592.tech`,
Leistungen `Neue Anfrage über 9592.tech/leistungen`.

No new copy was authored (verbatim reuse of already-voice-checked strings), so the form structure,
label-for associations, and ARIA are byte-identical to the English render. Verified in the shipped
`.vercel/output/static/de/{index,leistungen}/index.html`: 0 English labels, `>E-Mail<`, `>Worum geht es?<`,
German fallback, German subject.

## M3 (MAJOR) — dead "AI Actions" link (`ai-actions.app` 404s)

`https://ai-actions.app` 404s. The product is the iOS app **AI Actions - Shortcut AI** (9592 Solutions UG).
Verified `https://apps.apple.com/app/id6447460842` returns **200**. Pointed the link there on BOTH
homepages (`src/pages/de/index.astro`, `src/pages/en/index.astro`). Link text unchanged ("AI Actions").
Verified `dist`: 0 occurrences of `ai-actions.app`; App Store URL present on both homepages.

## M4 (MAJOR) — legacy blog 301s 404'd on the trailing-slash form in prod

**Root cause (confirmed by reading `@astrojs/vercel` 9.0.2):** the adapter builds each redirect route's
`src` from the path *segments* (`getRedirects` -> `getMatchPattern`), which drop the trailing slash. So
both `/blog/<slug>` and `/blog/<slug>/` keys in `redirects` collapse to the identical anchored regex
`^/blog/<slug>$` (emitted twice as exact duplicates — the smoking gun the review saw). With Astro's
default `trailingSlash: 'ignore'`, `getTransformedRoutes` is passed `trailingSlash: undefined`, so **no**
normalization route is emitted and the regex has no optional slash. The canonical trailing-slash form
`/blog/<slug>/` (the directory-format canonical that search engines indexed) matches no route, falls
through the filesystem handle, and 404s. `astro dev` masks it (it matches both forms). Listing both URL
forms in `redirects` cannot work — the trailing slash is gone before the regex is built.

**Why not the obvious alternatives:** flipping global `trailingSlash: 'always'` would add a site-wide 308
normalizer and change the verified behavior of all 24 pages — too broad for a 3-route fix. A
`vercel.json` `redirects` block is ignored when the adapter writes the Build Output API `config.json`.

**Fix:** a small Astro integration (`patchLegacyBlogRedirects`, inline in `astro.config.mjs`) runs in
`astro:build:done`, *after* the adapter writes `.vercel/output/config.json` (verified by build-log
ordering). It rewrites the trailing `$` to `/?$` on the legacy blog 301s and drops exact-duplicate routes.
It throws (does not silently no-op) if it finds zero routes to patch, so an adapter output-shape change
surfaces loudly at build time. Running inside `astro build` means it applies whether Vercel invokes
`astro build` or `npm run build`. The `redirects` config was reduced to the 3 canonical no-slash keys
(listing both forms was pointless).

**Verified** in the built `.vercel/output/config.json`: exactly 3 deduped 301 routes
`^/blog/<slug>/?$` -> `/en/blog/<slug>/`, all preceding the `filesystem` handle, and the `/?$` regex
matches both `/blog/<slug>` and `/blog/<slug>/`.

## m1 (MINOR) — Impressum displayed a non-resolving URL

`/de/impressum` displayed `9592.tech/kontakt` (typed → 404; only `/de/kontakt` and `/en/contact` exist).
The `href` already pointed at `/de/kontakt/`. Changed the *displayed* text to `9592.tech/de/kontakt`.
EN Impressum was already correct (`9592.tech/en/contact`) and was left unchanged.

## m3 (MINOR) — Ich/Wir voice inconsistency on `/de/leistungen`

The page body used provider-voice "Wir" ("Wir arbeiten EU-datenschutzkonform", "Wir entwickeln
barrierearm", heading "Was wir nicht anbieten") while the CTA used "Ich melde mich". Unified to **"Ich"**
to match the owner-led, single-person voice used throughout the homepage ("Ich entwickle…", "Ich bin
Christo Wilken und führe…"): "Ich arbeite…", "Ich entwickle…", heading "Was ich nicht anbiete" (+ the
matching HTML section comment). The form placeholder ("Wir brauchen… / Wir möchten…") was left as-is —
that is the prospective *buyer's* voice (procurement orgs), not the provider voice the finding flags.

## m6 (MINOR) — "Einzel-Prinzipal-Praxis" Germanization

Replaced the homepage Leistungen teaser "Einzel-Prinzipal-Praxis" with **"Inhabergeführte Praxis"**
(the site already uses "inhabergeführt" twice). Also fixed the same awkward Germanization in the
Leistungen `<meta description>` ("Einzel-Prinzipal-Softwarepraxis" → "Inhabergeführte Softwarepraxis")
for coherence — leaving one instance would contradict the other. Verified: 0 occurrences of
"Einzel-Prinzipal" remain in the build. The EN homepage "Single-principal practice" is natural English
and was left unchanged.

---

## Voice check

Ran the `voice-playbook` skill before finalizing German copy. M2 reuses verbatim, already-shipped German
strings (no new copy). m3 is a pronoun swap of existing grounded copy into the site's established "Ich"
register. m6 uses "inhabergeführt", already on the site. No anti-patterns triggered (no em dashes, no
enthusiasm inflation, no slop). Register matches the site's dry, professional German business voice.

## Accessibility (no Pa11y WCAG2AA regression)

All changes are textual / `href` / hidden-input-value / form-prop only — no color tokens, font metrics,
DOM structure, or ARIA changed. Confirmed with axe-core (tags `wcag2a, wcag2aa, wcag21a, wcag21aa`) via
Playwright against `astro dev` on the 4 changed pages: **0 violations** on `/de/`, `/de/leistungen`,
`/de/impressum`, `/en/`. (pa11y-CI is not a standing dependency; it was run via `npx pa11y-ci` with
`tests/pa11yci.json` for the original G2 gate — see `BUILD-NOTES-integration-a11y.md`.)

## Build

`npm run build` clean (the vite chunk-size WARN is the pre-existing dynamically-imported Mermaid bundle,
unrelated to this pass). Build artifacts (`dist/`, `.vercel/output/`) are gitignored.
