---
date: 2026-05-23T21:21:25
title: Independent Pre-Deploy Review
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: f7cc49db-f739-4df1-b36f-3d20ab37c026
---

## Summary

Ran an independent, source-blind, browser-based review of the built 9592.tech site through the lens of a skeptical German procurement evaluator (the final quality gate before the G3 deploy). Found 1 BLOCKER + 4 MAJOR + 6 MINOR; report-only, no fixes, no deploy. Findings in `REVIEW-FINDINGS.md`, screenshots in `review/screenshots/`.

## What Was Done

Built (`npm run build`, clean) and served via `astro dev` (the Vercel adapter rejects `astro preview`). Reviewed only what a visitor sees — never read `src/`. Used PLAN.md/VISION.md solely for purpose/audience. Combined Playwright browser review (visual + interaction in both locales, desktop + mobile) with HTTP-level checks (redirects, full route sweep, the built `.vercel/output/config.json`, and a `dist/` strip-list grep). Inspected the shipped work-screenshots by downscaling copies and reading them.

**The headline find (BLOCKER):** the buyer's real product name **"Angebotslandkarte 2.0"** is baked into three editorial-workflow case-study screenshots (`editorial-personas/intake-queue/reminders.png`) in the CMS header band. The whole site otherwise scrupulously uses the neutral "Angebotskarte" (the case study is slugged `angebotskarte` precisely to avoid this word). Crucially, the release strip-list grep scans `dist/` *text* — which I confirmed is clean (0 buyer terms, clean filenames) — but **text inside a PNG is invisible to a text grep**, so this leak passed the automated gate while being plainly readable. This is the exact class of defect a source-blind visual review exists to catch.

**MAJORs:**
- The loneliness/bereavement/elderly-isolation domain is legible across the demo screenshots (topic tags "Trauer um Partner", "Akute Lebenskrise", "Männer/Frauen 60+"; content like "Männer-Trauergruppe 60+", "Trauerbegleitung nach Suizid", "Telefonseelsorge"). VISION explicitly says the loneliness topic itself is identifying. Synthetic data, no name, but it surfaces the sensitive domain the project meant to keep off the public site.
- The contact form renders half-English on `/de/` and `/de/leistungen/` (label "Email", "What are you working on?", "Or email me directly at", and an English email subject) while the *same* form is fully German on `/de/kontakt/`, `/de/arbeiten/`, and DE blog posts. So the German strings exist but aren't applied on the two pages a bid links to most.
- The "AI Actions" Selected-work link (`ai-actions.app`) 301s to `www.` then 404s — a dead link on the credibility page (askjeevesny.com and the thesis PDF are fine).
- Legacy `/blog/<slug>/` (trailing-slash, the likely-canonical old form) 404s on the real Vercel edge: the built config only 301s the no-trailing-slash form (listed as identical duplicates — the smoking gun). `astro dev` masks this by matching both; contradicts the CLAUDE.md gotcha claiming both forms are listed.

**MINORs:** Impressum displays a non-resolving contact URL "9592.tech/kontakt" (link works, typed URL 404s; EN side accurate); case-study language switcher drops to the work index instead of the sibling (blog switcher does it right); Ich/Wir voice mix on Leistungen; mobile demonstrator screenshots lose legibility with no lightbox; em-dashes in demo-content screenshots; "Einzel-Prinzipal-Praxis" reads awkwardly in German.

**What's genuinely strong (and verified):** positioning lands (owner-led, direct technical responsibility, demonstrator-first, AI never the product/headline — the capabilities page mentions AI nowhere); Impressum + Datenschutz both complete, correct (Amtsgericht München HRB 287814, USt-IdNr., "(haftungsbeschränkt)" spelled out, location bridge, no phone leak, EN courtesy-translation disclaimer, no consent banner, no Google Fonts/Mixpanel clauses); text-level anonymization excellent ("bundesweites Beratungsnetzwerk", "weit über tausend", clean slugs/alt); behavior solid (root Accept-Language redirect correct, all 24 nav pages 200 in both locales, switcher round-trips on localized slugs, DE blog "Nur auf Englisch verfügbar" affordance works, mobile menu keyboard-accessible with Esc-close, console clean, dev toolbar absent from build, fonts self-hosted).

## Implications

The site, once the BLOCKER and MAJORs are fixed, would credibly reinforce a bid. The two anonymization findings (B1 + M1) are the ones that could actually compromise a not-yet-awarded bid and both live in the editorial-workflow screenshots — fixing them is the same task (re-capture those shots with the CMS header excluded and the seed data re-skinned off the loneliness domain). The form-localization and dead-link fixes are quick. The legacy-redirect fix is optional depending on how much legacy-blog SEO is valued.

Notable process point worth carrying forward: the automated strip-list gate has a structural blind spot for text rendered inside images. Any future anonymization gate should include a visual/OCR pass on shipped screenshots, not just a text grep of `dist/`.

## Open Threads

- **G3 deploy is now gated** on resolving the review BLOCKER + MAJORs (synced into CLAUDE.md "Planned"). G1 (fresh Handelsregister check) still also pending. NOT deployed.
- The offer-map list screenshot (`offer-map-list.png`) shows offer names that *look* synthetic ("Familienzentrum Mustertal" etc.) but worth a quick confirm they're not scraped real buyer entries before re-capture.
- Fixes are for the build session to action; this was report-only by design. The orchestrator/user should decide B1/M1 re-capture scope and whether to propagate the deploy-gate status to the Executive backend (the website project is not currently a tracked item there).
