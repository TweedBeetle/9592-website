---
date: 2026-05-23T17:01:51
title: Phase A i18n + Privacy Spine
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: ed7ceee1-f2d9-47ea-8da8-350fc1813e31
---

## Summary

Built Phase A (A1–A4) of the 9592.tech presence sculpt: self-hosted fonts + Mixpanel
removal, Astro built-in i18n (bilingual DE/EN), dynamic html-lang/hreflang/og/JSON-LD, and
an accessible language-switcher + header + footer shell. Spawned implementation session
orchestrated by bid-pipeline; scope was strictly A1–A4 (B/C/D/E not started).

## What Was Done

- **A1 — privacy foundation.** Removed the Google Fonts CDN `<link>`/preconnect (the LG
  München I IP-transfer exposure) and the consent-less Mixpanel `<script>` block; dropped
  `mixpanel-browser` and the dead `mixpanel.track` TODO in BlogCTA. Self-hosted Inter
  (400/500/600/700) + JetBrains Mono (400/500) via `@fontsource/*` (latin subset, covers
  äöüß). Kept `@vercel/analytics` (cookieless). `dist/` grep for google/mixpanel empty;
  6 self-hosted woff2 emitted.
- **A2 — i18n config + scaffold.** Per the USER OVERRIDE: `prefixDefaultLocale: true`,
  both locales prefixed (`/de/`, `/en/`), no unprefixed content tree,
  `redirectToDefaultLocale: false`. Built `src/i18n/` (routes.ts route-map, utils.ts,
  ui.ts chrome dictionary, legal.ts entity constant with NO public phone). Restructured the
  homepage to `src/pages/de/index.astro` + `en/index.astro`; root `src/pages/index.astro`
  is now an on-demand (`prerender=false`) Accept-Language redirector.
- **A3 — head/meta i18n.** Layout sets `<html lang>` from the URL, emits hreflang
  de/en/x-default (x-default → /en per override), dynamic og:locale + alternate, and the
  PC7 JSON-LD fix (legalName, vatID, Düsseldorf PostalAddress) sourced from legal.ts. Blog
  pages pass `lang="en"` to avoid a regression while still at unprefixed `/blog`.
- **A4 — shell.** LanguageSwitcher (route-map, same-page preservation, aria-current),
  Header (mono wordmark, route-map nav, accessible mobile menu with Esc-close + focus
  return + no trap), Footer (legal links + entity line from legal.ts + switcher), skip
  link, wired into Layout. frontend-design lens = refined minimalism on the existing dark
  system. voice-playbook pass on chrome strings (DE+EN).

## Key Decisions / Steering

- **USER OVERRIDES were authoritative.** Two planner's calls were overruled by the user
  before this session: (1) Impressum second contact = email + contact form, NOT phone (the
  mobile number must not appear on any public surface → legal.ts has no phone field);
  (2) root `/` = browser-language detection with both locales prefixed (overriding the
  plan's `prefixDefaultLocale: false` DE-at-root choice). Both honored.
- **Accept-Language mechanism:** chose an on-demand Astro page over a vercel.json `has`
  regex. Parsed the highest-priority language tag manually rather than using
  `Astro.preferredLocale` (which returns the best *configured* match regardless of
  priority) so `fr-FR,fr;q=0.9,de;q=0.5` lands on `/en` per the override's "everything
  else → /en", not `/de`. 302 + `Vary: Accept-Language`.
- **Scope discipline:** the contact page (`/kontakt` ↔ `/en/contact`, an override addition)
  was NOT built — it is content for a later phase. Footer links to it. Nav/footer targets
  point at final localized routes that 404 until B/D/E land (F1 audits). Blog stays at
  `/blog` (E1 relocates).

## Verification

Per-feature commits (A1 aa56f4a, A2 d61df4b, A3 b6bde85, A4 8d89110), each with a clean
build. The Playwright MCP browser was locked by a parallel C1 (screenshots) session, so
verification ran on an isolated headless Chromium via `playwright-core` + explicit
`executablePath` (no project dep added). Confirmed: zero Google/Mixpanel network calls on
both locales; Inter renders; mobile menu open/Esc-close/focus-return; switcher lands on the
same page in the other locale; header+footer render desktop+mobile both locales; JSON-LD +
hreflang + og:locale correct. Screenshots + scripts in the job dir (ephemeral).

## Open Threads

- **Contact page** (`/kontakt` ↔ `/en/contact`) unbuilt; override item 1 needs a later phase.
- **Nav/footer targets** 404 until B1/B2/D1/D2/E1 + contact page land; F1 is the wiring+audit gate.
- **Blog** at unprefixed `/blog` (dev 404s it, build emits it); E1 relocates under locales + 301s.
- **`/` redirect** is a Vercel serverless function, not exercised by `astro preview`; confirm on the real deploy in G3 (do NOT deploy this phase).
- Running log of judgment calls in `BUILD-NOTES.md` (`## Phase A`).
