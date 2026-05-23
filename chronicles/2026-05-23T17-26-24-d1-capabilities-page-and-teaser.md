---
date: 2026-05-23T17:26:24
title: D1 Capabilities Page and Homepage Teaser
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: 2f1801c5-16b7-4b3a-95f2-0f71d26bb118
---

## Summary

Built the procurement-facing capabilities page in both locales (`/de/leistungen`,
`/en/services`) plus a condensed homepage teaser linking to it, per PLAN feature D1.

## What Was Done

- `src/pages/de/leistungen.astro` and `src/pages/en/services.astro` from findings
  §4.4: single-principal practice, AI-orchestrated throughput, prototype-first
  engagement, direct contracting (keine Mittler), EU/DE data posture, accessibility
  orientation (WCAG 2.1 AA), and an explicit "Was wir nicht anbieten" / "What we do
  not do" block. Practice areas rendered as a 2-col hairline-divided grid; the
  negative-scope list in a muted secondary-bg card. Location-bridge sentence (Sitz
  München, Geschäftsanschrift Düsseldorf, operativ Berlin) and the entity name pull
  from `src/i18n/legal.ts` so the register fact (Amtsgericht München) and
  "(haftungsbeschränkt)" are sourced once.
- Homepage teasers ADDED to `src/pages/de/index.astro` + `src/pages/en/index.astro`
  (the two files this wave was cleared to edit). Hero and Selected-work list left
  untouched (those are D4). Each teaser is a new section between "Was ich mache" /
  "What I do" and "Ausgewählte Arbeiten" / "Selected work", linking via
  `localizedPath('leistungen', lang)` with `lang = getLangFromUrl(Astro.url)`.

## Decisions / Steering

- **Em dashes in the source copy.** Findings §4.4 wraps the prototype-seeding clause
  in em dashes; the site voice rule forbids them. Restructured into separate sentences
  in both languages (verified zero U+2014 in the built output).
- **AI as method, never headline.** h1s lead with concrete delivery ("Working
  software, built for your process" / "Lauffähige Software, auf Ihren Prozess
  zugeschnitten"); "AI" appears only in the lead paragraph. Verified no AI/KI token in
  any h1/h2/h3. No "KI-Agentur"/"KI-Lösungen" anywhere (anti-keywords §2.2).
- **Company "wir"/"we" voice on the capabilities page** (matches §4.4 and the
  task-mandated "Was wir nicht anbieten" heading), while the homepage stays
  first-person "ich"/"I". Single-principal framing is explicit in the lead so "wir"
  reads as "the practice", not a team fiction (§2.2 anti-signal avoided). Flagged in
  BUILD-NOTES-capabilities.md for D2/D4 consistency rather than hardened into project
  CLAUDE.md (D4 reframes the homepage and may revisit the register).
- **`AI-Orchestrierung` kept in DE** per the §4.4 register note (reads better than
  KI-Orchestrierung in DE B2B); the strict-Behördendeutsch alternative wasn't needed.
- **Followed the A4 frontend-design lens** (refined minimalism on the established dark
  system, not the skill's maximalist push) for design-system consistency +
  procurement credibility.

## Verification

- `npm run build` clean; both pages prerender. Dev server returns 200 for
  `/de/leistungen/`, `/en/services/`, `/de/`, `/en/`; teaser links present in dev +
  dist HTML.
- Full-page Playwright screenshots of both capability pages and the DE homepage
  confirmed correct dark-theme rendering, on-system layout, header/footer, and the
  contact form. (Screenshots inspected then deleted, not committed.)
- voice-playbook run on all strings (both languages); strip-list (§4.5) spot-grep on
  both pages clean.
- Committed as `712ff8d` (5 files, 456 insertions) using `git commit --only -m … --
  <my paths>` to avoid bundling four parallel sessions' pre-staged work (B1/B2/E1/
  contact) sitting in the shared index. Did NOT deploy (out of scope).

## Open Threads

- **F1** wires nav/footer + does the full route audit. The Header "Leistungen"/
  "Services" nav link now resolves (no longer 404).
- **D4** rewrites the homepage hero + Selected-work order; the additive teaser does
  not conflict and can stay or be relocated.
- **G2** (a11y) should include both new pages in the Pa11y-CI run. Markup is
  landmark/heading-correct (one h1, h2 section labels, h3 items) and uses only the
  already-contrast-validated design tokens, but the formal WCAG2AA pass is G2's gate.
- The capabilities page intentionally carries only the location bridge, not HRB/
  USt-IdNr.; the verifiable-entity facts live on the Impressum (B2) and JSON-LD (PC7).
