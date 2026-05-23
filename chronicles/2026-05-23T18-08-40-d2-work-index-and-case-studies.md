---
date: 2026-05-23T18:08:40
title: D2 Work Index and Two Case Studies
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7[1m]"
session_id: 89e4b826-9c71-4232-bee1-eb2090abe39c
---

## Summary

Built PLAN feature D2: the `/arbeiten` ↔ `/en/work` case-study index plus two
anonymized demonstrator case studies (offer-map, editorial-CMS) in DE+EN, with a
data-driven win-flip so a contract win is a single data edit. Build clean, all six
locale pages render, screenshots verified, strip-list clean. Not deployed.

## What Was Done

Six static de/en pages (following the `leistungen`/`impressum` pattern, NOT a `[lang]`
route):

- `src/pages/de/arbeiten.astro` + `src/pages/en/work.astro` — index: two cards, each
  labelled `Demonstrator / Arbeitsprobe`, framed as work samples (not customer projects),
  with a "Live-Demo auf Anfrage" line and a contact CTA.
- `src/pages/de/arbeiten/angebotskarte.astro` ↔ `src/pages/en/work/offer-map.astro`.
- `src/pages/de/arbeiten/redaktions-workflow.astro` ↔
  `src/pages/en/work/editorial-workflow.astro`.

Supporting code:

- `src/components/CaseStudy.astro` — shared shell. Prose comes in via named slots
  (`problem`/`approach`/`demonstrates`); section labels live in a local per-locale dict
  (NOT `ui.ts`); the gallery renders `study.images` with bilingual alt + caption and
  intrinsic width/height (CLS); the live-demo affordance is win-flip controlled.
- `src/data/work/{types,offer-map,editorial-workflow,index}.ts` — the win-flip data.
  Alt text copied verbatim from `public/work/INVENTORY.md` (C1).

**Win-flip architecture**: `anonymized: boolean` in each `src/data/work/<key>.ts` is the
single award-day switch. `true` → generic title + Arbeitsprobe label + screenshots +
"on request" callout (no buyer URL). Set `false` + fill `liveUrl`/`buyerName`/`namedTitle`
→ named title + live-link button. No page/component edits needed on award.

## Steering / reasoning

The orchestrator's spawn prompt was detailed and pre-decided most structure (static
de/en pages, win-flip data shape, slug examples, Demonstrator labelling, no public demo
link). Judgment calls I made within that frame:

- **Slug `angebotskarte`, not the PLAN's example `angebotslandkarte`.** "Angebotslandkarte"
  is the first word of the buyer's real map title and a de-anonymization handle; C1 had
  already chosen the neutral "Angebotskarte" in its alt text. Aligned slug + title + meta
  to the neutral term.
- **Generalised the entry count.** Findings §4.1 says "around 1,600"; "1.600" is in C1's
  residual-token grep and §4.5 flags it. Used the findings' own safer "well over a
  thousand" / "weit über tausend". Also scrubbed the figure from source comments (the
  strip-list rule covers committed comments).
- **Dropped the nationwide-offers surface** from the offer-map case study: INVENTORY says
  it doesn't exist in the prototype and there's no screenshot, so claiming it would be a
  false demonstrator claim. Honest-Arbeitsprobe thesis won over source-copy fidelity.
- **Removed em dashes** from the findings §4.1/§4.2 copy (site voice rule) by colon/split.
- **No shared chrome touched.** Work-section labels live inside `CaseStudy.astro`, not
  `ui.ts`; sub-route slugs are hardcoded in the data, not `routes.ts` (per instruction).

## Verification

- `npm run build` clean; all 6 locale pages prerender; 11 screenshots referenced with
  alt text; `dist/` strip-list grep over the 6 pages: clean.
- Dev: all 6 routes 200. Playwright visual check of DE case study, EN case study, DE
  index. Confirmed all 11 gallery images decode (`complete:true`, correct
  `naturalWidth`) — a fullPage screenshot initially showed dark placeholders for lazy
  below-fold images, which turned out to be a Playwright lazy-load capture artifact, not
  a load failure (captured as a learning).
- voice-playbook run on every user-facing string, DE+EN: no em dashes, no superlatives,
  no emoji, DE Sie-Form, no forbidden AI-positioning (AI isn't mentioned in the work
  section at all).

## Open Threads

- **NOT deployed** (G3). No a11y/Pa11y/Lighthouse pass (G2).
- **F1 (route wiring + audit)**: case-study pages pass `pageKey="arbeiten"`, so the global
  LanguageSwitcher degrades DE↔EN to the work *index* on a case-study page (never a 404),
  not the sibling, and hreflang points at the index pair. If sibling-accurate switching is
  wanted, give the switcher an `arbeiten` sub-route special-case (mirror the blog branch)
  using the data `slug` map. Documented in BUILD-NOTES-work.md and project CLAUDE.md.
- **D4 (homepage reframe)** should link the two demonstrators via `caseStudyPath` from
  `src/data/work`, with the Demonstrator label and no external live link.
- The existing `de/leistungen.astro` + `de/index.astro` `ContactCTA` calls fall back to
  English form labels (emailLabel etc.); my work pages pass full German labels. Flagged
  for whoever owns D1/D4; left the other pages untouched (out of scope).
- Full deviation log: `BUILD-NOTES-work.md`.
