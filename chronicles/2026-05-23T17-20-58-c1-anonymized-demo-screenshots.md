---
date: 2026-05-23T17:20:58
title: C1 Anonymized Demo Screenshots
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: c7159e6b-26af-443f-a798-285d4beb7732
---

## Summary

Captured + anonymized 11 demonstrator screenshots into `public/work/` for the
`/arbeiten` ↔ `/en/work` case studies (PLAN feature C1), plus a reusable capture
script and an `INVENTORY.md` with neutral captions and bilingual alt text.

## What Was Done

Spawned as the C1-only implementation session (orchestrator = bid-pipeline). Scope
was strictly `public/work/` + an optional `scripts/` capture script; a parallel
session owns `src/`, config, `package.json`.

**Reused the demos' own tooling.** Offer-map demo (`~/projects/kne-angebotslandkarte-demo`)
served via `npm run preview` (:4173); CMS demo (`~/projects/kne-cms-demo`) served via
`npm run db:reset && npm run pages:dev` (:8788, local D1). Wrote
`scripts/capture-work-screenshots.mjs` (Playwright, resolved from the offer-map demo's
`node_modules` via `createRequire` since 9592-website has no Playwright). One script
drives both demos and the CMS via the same install.

**11 shots, all visually verified strip-list-clean:**
- Offer map (5): `offer-map-overview` (category-aware marker clustering), `-filters`,
  `-radius` (PLZ + Umkreis circle), `-list` (accessible list view), `-mobile`.
- CMS (6): `editorial-personas` (demo persona switch), `-submit` (5-step contributor
  form), `-intake-queue`, `-diff` (before/after change diff), `-audit-log` (state
  timeline), `-reminders` (preview outbox after triggering the reminder pipeline).

## Key Decisions & Reasoning

**Anonymization method: clean exclusion, never blur** (plan's stated preference).
Two techniques, chosen per the structure of each demo:
- *Offer map → clip.* The only identifying chrome is the page `<header>`
  ("Angebotslandkarte gegen Einsamkeit" + "Kompetenznetz Einsamkeit (KNE)") and the
  `demo-disclosure` `<footer>` ("KNE-Einträgen", "~1.600 Einträge"). First attempt hid
  them via injected `display:none` — but that **collapsed the MapLibre canvas to zero
  height** (the demo's own screenshots proved the map renders only with layout intact).
  Switched to: keep chrome in the DOM, clip each shot to the union bounding box of the
  filter strip + map (`#main`) so the header (above) and footer (below) fall out of
  frame. Map renders correctly; chrome excluded.
- *CMS → capture-time DOM text-replacement.* Identifying tokens are *interleaved* with
  content the shot must show (header "KNE CMS Demo", persona "KNE-Redakteurin", audit
  actor "KNE-REDAKTION"). Clipping can't exclude a token mid-timeline; blur would leave
  it legible. So the script rewrites tokens in rendered text nodes (never
  attributes/hrefs) to the generic framing ("Kompetenznetz Einsamkeit"→"Beratungsnetzwerk",
  "KNE-"→"", standalone "Einsamkeit"→"Isolation", dropped parenthetical "(Konzept §x)"
  bid-doc refs) before each screenshot. This is a transform in this repo's script, not a
  demo-repo edit, and is VISION decision 2's sanctioned anonymization. A per-shot
  residual-token regex check ran clean for all six.

**Data risk handled.** Offer-map data is real scraped orgs; only 2 entries contain the
word "Einsamkeit" (Nürnberg, Paderborn). The list-view shot was scoped to a Berlin
radius to exclude both. CMS seed is otherwise synthetic (Mustermann names, `*.example.org`).

**Deviation flagged.** `offer-map-nationwide.png` (requested) was NOT produced: the
"nationwide-offers surface" does not exist as a distinct UI in the prototype (no such
surface/string; all seeded offers carry an address). Documented in INVENTORY + BUILD-NOTES.

**Other calls:** retina DPR 2 (mobile 3); mobile shot kept as the honest responsive
filter-UI + map peek (the demo's mobile map is genuinely short, marked out-of-scope by
its author) rather than inflating the map height; transient "Demo-Persona gewechselt"
toasts removed by waiting for auto-dismiss + safe hide (never removing structural nodes,
after a first attempt accidentally removed `document.body`).

## Parallel-session git incident (and fix)

My second commit (`git add BUILD-NOTES.md` then `git commit` without a pathspec) swept
in 3 `src/content/blog/en/*.mdx` files the parallel session had **staged** (their E1
blog relocation, real 138-line files). Caught it via `git diff --staged` in the same
output. Fixed with `git reset --soft HEAD~1` (HEAD only; working tree untouched) then
`git commit BUILD-NOTES.md` by pathspec — which re-committed only my file AND restored
the 3 blog files to the parallel session's staged state. Verified. No parallel work
lost or disrupted. Lesson reinforced: in a live shared repo, always commit by explicit
pathspec, never bare `git commit` after a single `git add`.

## Implications

Unblocks PLAN **D2** (work index + case studies), which consumes these PNGs + the
INVENTORY alt text. The win-flip path is preserved: on award, re-capture against a
rebranded demo (or drop the neutralize transform) and swap named versions in.

## Open Threads

- **Orchestrator:** C1 done. If the case study wants a nationwide-offers view, it must
  be built in the offer-map demo first.
- File sizes: the four full-DE map PNGs are ~0.8–1 MB (lossless, retina 2560px); no PNG
  optimizer was available locally. The build/case-study session can optimize for the G2
  perf gate if needed.
- Demo servers (:4173, :8788) were stopped; CMS local D1 was left seeded (gitignored).
