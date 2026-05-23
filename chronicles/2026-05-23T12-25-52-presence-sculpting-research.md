---
date: 2026-05-23T12:25:52
title: Presence-Sculpting Research Findings
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: 925ec790-260b-48a4-b22a-14acf200b78c
---

## Summary

Produced `research/presence-findings.md` — the research artifact backing the VISION to re-sculpt 9592.tech for German structured-RFP evaluators. Research-only session spawned by the bid-pipeline orchestrator; no `src/` was touched.

## What Was Done

Four research areas, all written into one sectioned findings file:

1. **German legal requirements.** Impressum §5 DDG field-by-field for the UG; Datenschutzerklärung tied to the site's actual tooling (Google Fonts CDN, Mixpanel, Vercel Analytics, Web3Forms); BFSG applicability honestly assessed (not legally binding here, but build accessible anyway as a competence signal) plus a concrete WCAG 2.1 AA checklist for static Astro.
2. **Buyer-evaluation signals.** Mined the bid-pipeline buyer-culture, capability-statement, Mittelstand-project-shapes, and outreach-tactics files. Produced must-signal / must-avoid lists. Key anti-keyword: "KI-Agentur" / "irgendwas mit KI" is negative-anchored in DACH discourse — lead with concrete delivery + working software, never AI-as-headline.
3. **Astro 5 i18n.** Verified via Context7. Recommended built-in i18n, `defaultLocale: 'de'`, `prefixDefaultLocale: false` (DE at `/`, EN at `/en/`), one `blog` collection with `de/`+`en/` path segments and an optional `translationKey`, language switcher via `astro:i18n` `getRelativeLocaleUrl` preserving the current path, dynamic `<html lang>`.
4. **Anonymized copy source.** Two `/work` case studies (offer-map + editorial-CMS demonstrators), one anonymized blog writeup, a procurement-facing capabilities section — all in EN + DE registers — plus an explicit STRIP-LIST of buyer/pricing/tender strings that must never appear publicly.

## Three findings that change assumptions (the load-bearing output)

- **Registergericht is Amtsgericht München, not Düsseldorf.** Resolved the brief's open Sitzverlegung question authoritatively by extracting the company's own Handelsregisterauszug (Abruf 2026-05-09) from the submission folder: Sitz = München, Registergericht = Amtsgericht München, HRB 287814; Düsseldorf (Fährstr. 217) is only the Geschäftsanschrift. No Sitzverlegung to Düsseldorf has been entered. This means the capability statement's repeated "Handelsregister Düsseldorf HRB 287814" wording is **wrong** and needs correcting everywhere (UNGM profile, cover letters, site). Caveat noted: re-pull the register immediately before publishing in case a Sitzverlegung is pending.
- **The live demos still name the buyer (KNE).** `kne-demo.9592.tech` shows "Kompetenznetz Einsamkeit (KNE)" and "~1,600 entries." VISION says link them AND don't name the buyer — direct contradiction. Flagged as the first blocking decision for the build session (recommend anonymizing the demos + neutral subdomains before linking).
- **Two real privacy gaps in current code.** Confirmed by reading `src/`: Google Fonts loaded from the CDN (LG München I, 3 O 17493/20 exposure → self-host) and Mixpanel firing on page load with no consent gate (§25 TDDDG → either drop it or gate it). Recommended config: self-hosted fonts + Vercel cookieless analytics + drop Mixpanel = no consent banner needed.

## Implications

The planning session has a grounded brief with the legal facts corrected, the buyer-signal axis defined, a concrete i18n recommendation, and ready-to-edit anonymized copy. VISION.md now points to the findings file.

## Open Threads

- **Build-session blocking decision:** resolve the demo-anonymization contradiction (Recommendation §A in the findings).
- **Before Impressum goes live:** pull a fresh Handelsregisterauszug to confirm Sitz/Registergericht.
- **Cross-artifact correction owed:** "Handelsregister Düsseldorf" → "Amtsgericht München" in the bid-pipeline capability statement and UNGM profile (out of this repo's scope; orchestrator's call).
- The Mixpanel-vs-consent-banner fork and the second-contact-means choice (mobile vs contact form) are decisions left for planning, with recommendations given.
