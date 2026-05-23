# BUILD-NOTES-work (FEATURE D2 — work index + two case studies)

Running log for the `/arbeiten` ↔ `/en/work` build. Decisions, deviations, and the
win-flip mechanism. Authoritative source ordering: PLAN.md (incl. USER OVERRIDES +
POSITIONING CORRECTION) > VISION.md > research/presence-findings.md §4.1/§4.2/§4.5.
Companion to the shared BUILD-NOTES.md (read-only here).

## What shipped

Static DE/EN pages following the established `leistungen`/`impressum` pattern (NOT a
`[lang]` dynamic route):

- `src/pages/de/arbeiten.astro` + `src/pages/en/work.astro` — case-study index.
- `src/pages/de/arbeiten/angebotskarte.astro` ↔ `src/pages/en/work/offer-map.astro`
  — offer-map demonstrator.
- `src/pages/de/arbeiten/redaktions-workflow.astro` ↔
  `src/pages/en/work/editorial-workflow.astro` — editorial-CMS demonstrator.
- `src/components/CaseStudy.astro` — shared case-study shell (label, title, gallery,
  win-flip live-demo affordance). Prose is authored per-locale in the page files via
  named slots (`problem`, `approach`, `demonstrates`).
- `src/data/work/{types,offer-map,editorial-workflow,index}.ts` — the win-flip data.

All six locale pages render (200 in dev, prerendered to `dist/.../index.html`); build
clean (`npm run build`). 11 screenshots display (verified each `complete:true` with
correct `naturalWidth` via Playwright). Strip-list grep over the six built HTML pages:
clean. No public demo URL or iframe anywhere.

## WIN-FLIP architecture (single-flag award-day change)

Each case study is driven by a data object in `src/data/work/<key>.ts`. The flag is
`anonymized: boolean`:

- `true` (current): generic title (authored in the page), `Demonstrator / Arbeitsprobe`
  label, screenshots, and a `Live-Demo auf Anfrage` / `Live demo on request` callout
  that links to the contact page (NO buyer URL).
- `false` (on award): the page renders `study.namedTitle[lang]` instead of the generic
  title, a `Client:` line from `study.buyerName`, and a live-demo link button to
  `study.liveUrl`.

The entire award-day change is editing that one data file (flip `anonymized`, fill
`liveUrl` + `buyerName` + `namedTitle`). No page or component edits. The render branch
lives in `CaseStudy.astro` (search `study.anonymized`). Placeholder fields are present
as commented examples in each data file.

## Decisions / deviations (flag-worthy)

1. **Slug `angebotskarte`, not `angebotslandkarte`.** PLAN gave `angebotslandkarte` as
   an *example* slug, but "Angebotslandkarte" is the first word of the buyer's public
   map title ("Angebotslandkarte gegen Einsamkeit") and is a de-anonymization handle.
   The C1 session deliberately used the neutral term "Angebotskarte" in its alt text;
   I aligned the slug, page titles, and meta to "Angebotskarte" so no echo of the
   buyer's title ships. Editorial slug: `redaktions-workflow` ↔ `editorial-workflow`
   (both clean). All slugs free of strip-list terms.

2. **Entry-count generalised to "weit über tausend" / "well over a thousand."** The
   findings §4.1 copy uses "around 1,600 / rund 1.600", but "1.600" is in the C1
   residual-token grep set and §4.5 flags the figure as buyer-identifying. The gate
   demands ZERO strip-list strings in body/meta. Used the findings' own safer
   suggestion ("well over a thousand entries"). Also reworded two source comments that
   originally quoted the figure (committed source comments are in scope for the
   strip-list rule).

3. **Nationwide-offers surface dropped from the offer-map case study.** Per
   `public/work/INVENTORY.md`, that surface does not exist as a distinct UI in the
   prototype and has no screenshot. Findings §4.1 lists it under both "approach" and
   "what it demonstrates", but claiming it (with no screenshot, and the feature absent)
   would be a false claim about the demonstrator and breaks the honest-Arbeitsprobe
   thesis. Dropped it from both sections. The five offer-map shots
   (clustering/overview, filters, radius, list, mobile) tell a complete story.
   ORCHESTRATOR: if the case study should show it, the feature must be built in the
   demo first (same flag C1 raised).

4. **Em dashes removed from findings §4.1/§4.2 copy.** The source copy used em dashes
   ("audit log — every action", "bottleneck — and needed", "the surface — directly
   testable"). Rewrote each as a colon or a split sentence per the site voice rule.

5. **"spreadsheet" / "Tabelle" instead of "Excel".** Findings §4.1 DE says "Excel-Datei";
   harmonised to the generic "Tabelle" (and "spreadsheet" in EN, matching the EN
   source) to avoid naming a specific product when describing the old manual pipeline.
   Not strictly strip-list, just cleaner and brand-neutral.

6. **Buyer framing = "bundesweites Beratungsnetzwerk" / "national advisory network."**
   The §4.5 sanctioned generic. Used "advisory" in EN (a touch more neutral than
   "counseling", both are sanctioned) and "Beratungsnetzwerk" in DE.

7. **No new shared chrome strings.** The work-section labels (Demonstrator/Arbeitsprobe,
   Problem/Ausgangslage, Vorgehen, "Was der Demonstrator zeigt", back link, live-demo
   strings) live in a small per-locale dict INSIDE `CaseStudy.astro`, not in
   `src/i18n/ui.ts`. They are case-study scaffolding, not global chrome. `ui.ts`,
   `routes.ts`, `Header.astro`, `Footer.astro`, `LanguageSwitcher.astro` were NOT
   edited.

## FOR F1 (route wiring + audit) — interim behavior to be aware of

- **Case-study sub-routes are not in `routes.ts`** (per the orchestrator's instruction
  to not edit the shared route-map for sub-routes). The localized slugs are hardcoded
  in `src/data/work/<key>.ts` (`slug: {de, en}`) and the URL is built by
  `caseStudyPath(study, lang)` in `src/data/work/index.ts`.
- **Case-study pages pass `pageKey="arbeiten"` to Layout.** Consequences:
  - Header/Footer highlight "Arbeiten"/"Work" (correct).
  - The global LanguageSwitcher resolves DE↔EN via `localizedPath('arbeiten', target)`,
    so on a case-study page it lands on the OTHER locale's *work index*, not the sibling
    case study. This is a graceful degrade (never a 404), identical to how the switcher
    handles unpaired blog posts. The index pages themselves switch correctly (they ARE
    the route-map entry).
  - hreflang alternates on case-study sub-pages therefore point at the work-index pair,
    not the sibling case study. Canonical is self-referential and correct.
  - If sibling-accurate switching + hreflang on case studies is wanted, the cleanest fix
    is to give the shared `LanguageSwitcher` an `arbeiten`-sub-route special-case
    (mirroring its existing blog-post branch) using the `slug` map in
    `src/data/work/<key>.ts`. That touches shared chrome, so it belongs in F1, not D2.
- **Homepage (D4)** should link the two demonstrators to `caseStudyPath(study, lang)`
  (import from `src/data/work`) and use the same `Demonstrator/Arbeitsprobe` label,
  with no external live link (per D4).

## Voice-playbook pass

Ran `voice-playbook` and scanned every user-facing string (DE + EN): no em dashes (verified
by regex over all 11 files), no superlatives ("vollständig interaktiv"/"fully interactive"
and "vollständiges Audit-Log"/"complete audit log" are factual, not puffery), no emoji
(the `→`/`←` are aria-hidden nav affordances, consistent with the existing pages), no
pronoun drops, DE Sie-Form, "(haftungsbeschränkt)" spelled out and "USt-IdNr." canonical
(both sourced from `legal.ts` via the footer). AI is not mentioned in the work section at
all, so no forbidden positioning framing (POSITIONING CORRECTION block) is possible here.

## NOT done (out of D2 scope)

- No deploy (G3). No a11y/Pa11y/Lighthouse pass (G2). No homepage reframe (D4).
- The DE `ContactCTA` on these pages passes full German form labels (E-Mail / Worum geht
  es? / etc.). The existing `de/leistungen.astro` + `de/index.astro` do NOT (they fall
  back to English form labels) — I did not "fix" those (out of scope, parallel-session
  hygiene), but flagging the inconsistency for whoever owns D1/D4.
