---
date: 2026-05-23T17:58:05
title: D3 Procurement-Demo Blog Writeup
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: 0ddbd2c0-570c-488d-bc1a-6b7f896e4467
---

## Summary

Built the D3 bilingual blog post ("What it takes to ship a working demo instead of a slide
deck" / "Was es heißt, einen lauffähigen Demonstrator statt eines Foliensatzes abzugeben") in
both locales, on the spine that a working, inspectable demonstrator beats a slide deck for a
structured-buyer software requirement.

## What Was Done

- `src/content/blog/en/working-demo-not-slide-deck.mdx` + `src/content/blog/de/working-demo-not-slide-deck.mdx`,
  shared `translationKey: "working-demo-not-slide-deck"`, mandatory `cta` block in both.
- Slug identical across locales (repo convention from the existing `ai-support-...` pair;
  pairing is by `translationKey`). Strip-list-clean, reads as a sane English URL under both
  `/de/` and `/en/`.
- CTA uses `fields: ["email"]` (not the default email+website): the audience is a structured
  buyer / decision-maker reaching out about a requirement, where the "Business website" field
  does not fit. BlogCTA renders email-only correctly.
- Covered all seven findings §4.3 source beats: trigger pattern (manual pipeline stopped
  scaling, visible "updates delayed" symptom), three-requirements-as-one-coupled-problem, two
  demonstrators (public map + editorial workflow), accessibility discipline (WCAG 2.1 AA
  orientation, BIK-BITV main evidence, Pa11y-CI + mobile-perf gates, building-accessibly-IS-the-
  proof), EU data stance (OSM tiles + EU geocoder, no US-cloud), honest Arbeitsprobe framing
  (verifiable before contract), and the closing "the demo is the instrument, not the deliverable."

## Steering / reasoning

- **POSITIONING CORRECTION was authoritative over findings §4.3.** Findings §4.3's own voice
  note said "AI is the enabling method (orchestration -> small-team throughput), never the
  headline" — but the PLAN's POSITIONING CORRECTION block explicitly forbids that exact framing
  (lifted from the pre-KNE-patch capability statement). So the post does NOT frame around AI
  orchestration or small-team throughput at all. AI appears exactly once, bounded to a DSGVO-
  safe internal development/QA instrument ("no personal data sent to external AI services"),
  inside the data-handling section. Not a value prop, headline, or throughput claim.
- **Em-dash divergence from existing posts.** The two legacy EN posts use em dashes; the project
  voice rule (CLAUDE.md + voice-playbook + PLAN cross-cutting #2) forbids them. Followed the
  rule, not the legacy posts. Zero em dashes (incl. `&mdash;`/entity forms) in both files.
- **Strip-list conservatism.** Used "well over a thousand entries" / "weit über tausend
  Einträge" rather than the exact ~1,600 figure (findings §4.5 flags the exact number as
  buyer-identifying-in-combination; conservative for a wide-audience blog post). Buyer is only
  "a national counseling network" / "ein bundesweites Beratungsnetzwerk."
- **Did not claim the "nationwide-offers surface" beat** from findings §4.1: the C1 BUILD-NOTES
  recorded that surface does not exist in the actual offer-map prototype, so the post describes
  only what the demonstrators actually show (map, category/topic/PLZ-radius filters, accessible
  list view, mobile). Avoids overclaiming what a reader could open and verify.

## Verification (all PLAN D3 gates met)

- `npm run build` clean; both routes emit (`/de/blog/working-demo-not-slide-deck/`,
  `/en/blog/working-demo-not-slide-deck/`).
- Mandatory-CTA build-fail guarantee re-verified: removing the `cta` block failed the build
  with `InvalidContentEntryDataError ... cta: Required`; restored.
- Dev render: EN HTTP 200 `lang="en"`, DE HTTP 200 `lang="de"`, correct titles; DE blog index
  lists the new DE post.
- Strip-list grep clean on source and on the two D3 post HTML files. Voice-playbook pass in
  both languages (no em dashes, no superlatives, no emoji, DE Sie-Form).
- Did NOT deploy (per instruction).

## Open Threads

- **CRITICAL cross-session finding (NOT D3):** the C1 (screenshots) session placed its
  anonymization-rationale file at `public/work/INVENTORY.md`. Astro copies `public/` verbatim
  into the build, so it ships to `https://9592.tech/work/INVENTORY.md` as a reachable asset, and
  it quotes the strip-list VERBATIM (`Kompetenznetz Einsamkeit`, `KNE`, `ISS`,
  `kompetenznetz-einsamkeit`, `~1.600`, the buyer-named map title, etc.). This will FAIL the G3
  `dist/` strip-list grep gate and is a real buyer-identity leak in production. I did not touch
  it (out of D3 scope; D2 is told to mine it; shared-file/parallel-session hazard). Recommended
  fix for the orchestrator / F1 / a C1 follow-up: move `INVENTORY.md` out of `public/` (repo-root
  `work/`, `research/`, or `docs/`) so it stays a build-time reference without shipping. The PNGs
  under `public/work/` are fine; only the markdown rationale leaks. Also flagged in
  `BUILD-NOTES-blogpost.md`.
- D3 depends on E1 (done) + A4 (done); F1 will wire nav/footer and run the full route audit. G3
  owns the production `dist/` strip-list gate and the deploy. This session committed to `main`,
  no deploy.
- Parallel D2 (case studies) was in flight during this session (untracked `src/components/CaseStudy.astro`,
  `src/data/`, `src/pages/de/arbeiten/` present); D3 staged only its own three files.
