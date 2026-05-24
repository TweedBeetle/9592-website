---
date: 2026-05-23T21:43:28
title: Pre-deploy review code/copy fix pass
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: 899db7cb-a157-476c-a861-ae81ef8f0b7f
---

## Summary

Fixed the website-code/copy findings from the independent pre-deploy review
(`REVIEW-FINDINGS.md`): M2, M3, M4, m1, m3, m6. The screenshot findings (B1, M1, m5)
were owned by a parallel session and not touched here. Not deployed.

## What Was Done

This ran as one of two parallel fix sessions (the other re-captures the leaking
screenshots). Scope was strictly the site `src/` + `astro.config.mjs`; I explicitly
did not touch `public/work/*.png`, `BUILD-NOTES-screenshots.md`, or
`scripts/capture-work-screenshots.mjs` (the latter showed up modified in `git status`
mid-session — confirmed it's the parallel session's, left it unstaged).

- **M2 (contact form half-English on `/de/` + `/de/leistungen`):** root cause was that
  `ContactCTA.astro` defaults every form-chrome string to English and those two pages
  never passed the German overrides (unlike `/de/kontakt` and `/de/arbeiten`, which do).
  Passed the German props, reusing the exact already-shipped strings from `/de/arbeiten`.
  Web3Forms subjects made page-specific (`Neue Anfrage über 9592.tech` /
  `…/leistungen`) for source attribution.
- **M3 (dead AI Actions link):** `ai-actions.app` 404s. Verified the App Store listing
  `apps.apple.com/app/id6447460842` ("AI Actions - Shortcut AI", 9592 Solutions UG)
  returns 200 and pointed both homepages there.
- **M4 (legacy blog redirect 404s on trailing-slash form):** the meaty one. Read the
  `@astrojs/vercel` 9.0.2 source and confirmed the adapter builds each redirect `src`
  from path *segments*, dropping the trailing slash, so both `/blog/<slug>` and
  `/blog/<slug>/` keys collapse to the identical `^/blog/<slug>$` (emitted as duplicates).
  Astro's default `trailingSlash: 'ignore'` means no normalization route is emitted, so
  the canonical trailing-slash form 404s on the real edge (dev masks it). Listing both
  forms — the prior belief, baked into a now-corrected CLAUDE.md gotcha — cannot work.
  Considered and rejected flipping global `trailingSlash: 'always'` (site-wide 308
  normalizer, too broad) and `vercel.json` redirects (ignored under Build Output API).
  Fix: an inline `patchLegacyBlogRedirects` Astro integration that runs in
  `astro:build:done` after the adapter writes `.vercel/output/config.json`, rewrites the
  trailing `$` → `/?$` on the legacy blog 301s, dedupes, and throws if it finds nothing
  to patch. Verified empirically that my hook runs after the adapter (build-log order)
  and that the built config has 3 deduped slash-tolerant routes matching both forms.
- **m1:** DE Impressum displayed `9592.tech/kontakt` (typed → 404); changed displayed
  text to `9592.tech/de/kontakt` (href already correct). EN left as-is.
- **m3:** unified `/de/leistungen` provider voice to "Ich" (was mixed Wir/Ich); left the
  form placeholder "Wir brauchen…" alone since that's the buyer's voice, not the provider's.
- **m6:** "Einzel-Prinzipal-Praxis" → "Inhabergeführte Praxis" on the homepage teaser,
  and the same Germanization in the Leistungen meta description, for coherence.

Ran the voice-playbook skill before finalizing German copy (minimal grounded edits, no
anti-patterns). Confirmed no Pa11y/WCAG2AA regression via axe-core (Playwright on dev) on
all 4 changed pages: 0 violations each. `npm run build` clean. Notes in
`BUILD-NOTES-fixpass.md`.

## Implications

The code/copy half of the G3 deploy gate is cleared. The corrected CLAUDE.md gotcha and
the new ContactCTA-locale gotcha should stop both bug classes from recurring on future
DE pages.

## Open Threads

- **Still gating G3 (parallel screenshot session):** B1 (buyer term "Angebotslandkarte
  2.0" in 3 editorial screenshots) and M1 (loneliness domain legible in demo screenshots)
  need PNG re-capture.
- **Then G1** (fresh Handelsregisterauszug confirmation before the Impressum publishes)
  **and G3** (final build + `vercel --prod` + post-deploy smoke).
- Committed to `main` but **NOT pushed/deployed** (push auto-deploys via Vercel; the
  brief said do not deploy). Push is deferred until B1/M1/G1 are done.
- The `patchLegacyBlogRedirects` fix is verified only against the built config + regex
  matching, not a live Vercel edge (no deploy). Worth a 30-second curl of both URL forms
  in the G3 post-deploy smoke.
