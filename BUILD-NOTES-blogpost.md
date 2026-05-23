# BUILD-NOTES — D3 (procurement-demo blog writeup, DE+EN)

Running log for the D3 feature only. Shared BUILD-NOTES.md is read-only for me.

## Scope

Build one bilingual blog post from findings §4.3, in both locales:
- `src/content/blog/en/working-demo-not-slide-deck.mdx`
- `src/content/blog/de/working-demo-not-slide-deck.mdx`
Shared `translationKey: working-demo-not-slide-deck`. Mandatory `cta` block in both.

## Key decisions

- **Slug `working-demo-not-slide-deck`** (identical across locales, matching the repo
  convention from the existing `ai-support-premium-service-businesses` pair). Strip-list-clean:
  no buyer/tender/domain term. Reads correctly as an English URL under `/en/` and `/de/`
  (the established pattern keeps slugs identical and pairs via `translationKey`).
- **translationKey** pairs the two; the `[lang]/blog/[...slug].astro` route derives `lang`
  from `post.id.split('/')` and `LanguageSwitcher` jumps siblings via the key.
- **CTA `fields: ['email']`** (not the default `['email','website']`). The audience here is a
  structured buyer / decision-maker reaching out about a requirement, not an SMB owner sharing
  a marketing site; the "Business website / Website Ihres Unternehmens" field does not fit, and
  the email-only ask is cleaner. BlogCTA renders email-only correctly (`showWebsite` gates the
  website field), verified by reading the component.
- **AI handling (POSITIONING CORRECTION):** AI appears ONCE, bounded to an internal
  development/QA instrument with the DSGVO reassurance ("no personal data sent to external AI
  services" / "keine Übertragung personenbezogener Daten an externe KI-Dienste"), inside the
  data-handling section. It is NOT a value prop, headline, or throughput claim. No
  "AI orchestration", "Durchsatz eines kleinen Teams", "KI-Agentur", "jung/agil/startup".
  The forbidden findings-§4.3 framing ("AI is the enabling method, orchestration -> small-team
  throughput") is NOT used. The spine is the working/inspectable demonstrator vs slide deck.
- **No company-entity naming** in the post body, so no "(haftungsbeschränkt)" suffix needed
  here; the post is first-person (author Christo Wilken) about the work. Positioning stays on
  the demonstrator-as-better-artifact thesis, not company self-description.

## Strip-list handling (findings §4.5)

- Buyer = "a national counseling network" / "ein bundesweites Beratungsnetzwerk" only.
- "well over a thousand entries" / "weit über tausend Einträge" (NOT the exact ~1,600 figure;
  conservative per the §4.5 ambiguous-default-to-strip note for a wide-audience blog post).
- "spreadsheet" / "Excel-Datei" is part of the approved §4.1 problem copy (the manual process),
  NOT the buyer's incumbent CMS stack (WordPress/IONOS/Brevo/Matomo) which is forbidden and
  absent here.
- BIK-BITV named as a method (explicitly safe per §4.5). OSM tiles, EU geocoder, five-state
  workflow, Pa11y-CI = techniques, safe.
- No "I bid for / won / submitted to" narration. Demonstrators framed as Arbeitsproben /
  work samples built around a real public situation.

## Source-beat coverage (findings §4.3)

1. Trigger pattern (manual pipeline stopped scaling, visible "updates delayed" symptom) — §"trigger"
2. Three requirements as one coupled problem — §"three requirements"
3. Two demonstrators, not one — §"why two"
4. Accessibility discipline (WCAG 2.1 AA orientation, BIK-BITV main evidence, Pa11y-CI + mobile
   perf gate, building-accessibly-IS-the-proof) — §"accessibility was the proof"
5. EU data stance (OSM + EU geocoder, no US-cloud) — §"data-handling stance"
6. Honest Arbeitsprobe framing, verifiable before contract — §"these are work samples"
7. The demo is the instrument not the deliverable — §"closing"

- **Deviation from §4.1:** the "nationwide-offers surface" beat is NOT claimed. C1 BUILD-NOTES
  recorded that surface does not exist in the actual offer-map prototype, so the blog describes
  only what the demonstrators actually show (map, category/topic/PLZ-radius filters, the
  accessible list view, mobile). Avoids overclaiming what a reader could open and check.

## Voice-playbook pass (both languages)

- No em dashes anywhere (existing posts use them; D3 follows the strict project rule, not the
  legacy posts). Verified by grep on both files: zero `—`.
- No superlatives, no emoji. Dropped two slick closers and a "the X and the Y are the same
  thing" reveal during the scan. Reworded "the most convincing thing" to avoid the superlative.
- Hedge once, not three times: "I think" used twice, spaced.
- DE: Sie-Form throughout; no gender-colon forms (used neutral "eintragende Person",
  "Eintragende"); "USt-IdNr." not needed (entity not named). German procurement register,
  sachlich.

## Gate verification (all PLAN D3 gates met)

- **Builds in both locales with valid cta:** `npm run build` clean; emits
  `/de/blog/working-demo-not-slide-deck/index.html` + `/en/blog/working-demo-not-slide-deck/index.html`.
- **CTA build-fail guarantee holds:** temporarily removed the `cta` block from the EN file ->
  build failed with `[InvalidContentEntryDataError] blog → en/working-demo-not-slide-deck ...
  cta: Required`. Restored; rebuild clean.
- **translationKey pairs the two:** both files carry `translationKey: "working-demo-not-slide-deck"`.
- **Renders at both routes (dev):** EN HTTP 200 `lang="en"`, DE HTTP 200 `lang="de"`, correct
  titles; DE blog index lists the new DE post (EN-only affordance for unpaired posts unaffected).
- **Zero strip-list strings:** source grep clean; full-dist grep clean for the two D3 post HTML
  files (the only dist matches are in the unrelated C1 file `public/work/INVENTORY.md`, see below).
- **No forbidden positioning framings:** no "AI orchestration" / "Durchsatz eines kleinen
  Teams" / "KI-Agentur" / "jung/agil/startup"; the single AI mention is bounded + DSGVO-framed.
- **Voice-playbook:** zero em dashes (incl. `&mdash;`/`&#8212;` entities) in both post HTML
  files; no superlatives, no emoji; DE Sie-Form throughout.
- **Build clean** (final post-restore build verified).

## ⚠️ CRITICAL flag for the orchestrator (NOT a D3 issue) — C1 strip-list leak in `dist/`

The C1 (screenshots) session placed its anonymization-rationale file at
`public/work/INVENTORY.md`. Anything under `public/` is copied verbatim into the build, so it
ships to **`https://9592.tech/work/INVENTORY.md`** as a publicly-reachable asset. That file
quotes the strip-list VERBATIM ("Kompetenznetz Einsamkeit", "KNE", "ISS",
"kompetenznetz-einsamkeit", "~1.600", "Angebotslandkarte gegen Einsamkeit", etc.) to document
the anonymization. This will FAIL the G3 `dist/` strip-list grep gate and is a genuine
buyer-identity leak in production.

I did NOT touch it: it is out of D3 scope, D2 is instructed to mine it, and editing another
session's artifact risks a parallel-session conflict. **Recommended fix (orchestrator / F1 / a
C1 follow-up):** move `INVENTORY.md` out of `public/` (e.g. to repo-root `work/INVENTORY.md`,
`research/`, or `docs/`) so it stays a build-time reference without shipping. The PNGs under
`public/work/` are fine to ship; only the markdown rationale leaks.
