---
date: 2026-05-23T12:40:36
title: Presence-Sculpting Build Plan
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: f2eb9704-489b-4beb-8d8b-d3006ea8db9e
---

## Summary
Turned the locked VISION + research findings into `PLAN.md`: an ordered,
dependency-gated build plan (phases A-G) for sculpting 9592.tech toward
structured-RFP evaluators, plus eight reversible planner's calls.

## What Was Done
Planning-only session (no `src/` edits). Read, in order: `VISION.md`,
`research/presence-findings.md`, then the full existing site source
(`astro.config.mjs`, `Layout.astro`, the three pages, both CTA components,
`content/config.ts`, the three blog posts, `global.css`, `package.json`,
`robots.txt`). Also located the demos' reusable toolchain.

Wrote `PLAN.md` (committed `a461cea`) structured as:
- **What the finished site looks like** — so the orchestrator can see the end state.
- **Cross-cutting constraints** — strip-list as a hard rule (incl. alt/meta/filenames/
  slugs/JSON-LD/sitemap), voice-playbook before any public copy, design-system
  preservation, reversibility, no new heavy deps, no time estimates, the
  Amtsgericht-München register correction.
- **Dependency graph** (ASCII) — A1 fonts/Mixpanel → A2 i18n config → A3 html-lang/
  hreflang → A4 switcher+header+footer; then B/D/E parallelize off A4; C1 screenshots
  independent; F1 wires nav; G1/G2/G3 are publish gates.
- **Phases A-G**, each feature carrying What / Gate (concrete + verifiable) / Depends on,
  and referencing the frontend-design + voice-playbook skills, Context7, and the demos'
  Pa11y toolchain where relevant.

Each gate is verifiable, not "code exists" — e.g. "`dist/` grep for the full strip-list
returns nothing", "Pa11y-CI passes WCAG2AA with zero errors on every locale page",
"toggling DE↔EN lands on the same page not home", "the win-flip is demonstrably a single
data flag".

Housekeeping: linked `PLAN.md` from `VISION.md` (commit `a320187`), matching the
project's established convention of linking derived artifacts (the findings were linked
the same way in `96e4799`).

## Key planner's calls (all flagged reversible, PC1-PC8 in PLAN.md)
- **PC1**: localized slugs via a central `src/i18n/routes.ts` map
  (`leistungen`/`services`, `arbeiten`/`work`; `impressum`/`datenschutz`/`blog` identical).
  Chose "done properly" over identical-slug simplicity because the brief wanted proper
  bilingual and German slugs under `/en/` read wrong.
- **PC2**: add a global header + footer (site currently has no nav chrome). Flagged as the
  most identity-visible change; kept minimal + reversible. Judged on-thesis for a
  procurement reader (company site with Leistungen/Arbeiten/legal).
- **PC4**: Impressum second contact means = email + phone (`+49 172 767 7643`), with the
  Web3Forms route as a third channel; phone in the single legal constant so it is one-line
  removable. Explicitly left as a user veto → fall back to email + form.
- **PC5**: first-pass blog translation = only `ai-support-premium-service-businesses` → DE;
  keep the Claude-Code and EPD posts EN-only (technical/US-niche). The new procurement
  writeup is bilingual.
- **PC6**: existing EN posts move to `/en/blog/<slug>` with 301 redirects from the old
  `/blog/<slug>` (DE-canonical routing claims the unprefixed namespace).
- **PC7**: JSON-LD gets legalName + vatID + Düsseldorf address (kills the Berlin/Düsseldorf
  source contradiction). **PC8**: robots.txt unchanged (case studies are anonymized and
  meant to be found; no live-demo links exist to deindex).

## Notable findings folded into the plan
- Two real legal/privacy gaps in current code: Google Fonts loaded from the Google CDN
  (LG München I IP-transfer exposure) and Mixpanel firing on page load with no consent.
  A1 fixes both → minimised tool set → no consent banner needed.
- The register fact is **Amtsgericht München, HRB 287814** (not Düsseldorf, which is only
  the Geschäftsanschrift). G1 gates the Impressum's public deploy on a fresh
  handelsregister.de check, since a Sitzverlegung could be pending.
- The offer-map demo repo already ships `scripts/screenshots.mjs` (Playwright, honors
  `KNE_BASE_URL`, captures overview/filter/detail/mobile/iframe/radius) — directly reusable
  for the C1 anonymized-screenshot task. Pa11y configs at both demo repos model G2.

## Implications
The orchestrator (bid-pipeline) can hand `PLAN.md` to a build session and execute phase by
phase. B/D/E parallelize once the i18n scaffold (A4) lands; C1 can start immediately.

## Open Threads
- **No spawn-questions raised** — planning was unblocked; all ambiguities resolved as
  reversible planner's calls (PC1-PC8). The user may want to veto PC4 (publishing the
  personal mobile) before the Impressum is built.
- **Demo anonymization (findings Rec §A)** is already resolved by VISION decision 2
  (screenshots-only, no public links) — the plan implements that, so the live demos
  themselves naming the buyer is moot for the site (they are never linked/embedded).
- **Executive backend** (`~/memex/Executive/backend.md`) not touched — the orchestrator in
  bid-pipeline owns the presence-sculpting tracking entry; updating the eb needs a memex
  session.
- G1 (fresh Handelsregisterauszug) and G3 (strip-list `dist/` grep + prod smoke) are the
  hard publish gates the build session must not skip.
