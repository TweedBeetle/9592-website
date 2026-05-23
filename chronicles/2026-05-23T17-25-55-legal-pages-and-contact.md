---
date: 2026-05-23T17:25:55
title: Legal Pages and Contact Page (B1/B2 + kontakt)
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: dcf19374-15d2-4ce5-afbd-a45bddf92cf0
---

## Summary

Built the Impressum (B2), Datenschutzerklärung (B1), and the `/kontakt` ↔ `/en/contact`
page (USER OVERRIDE item 1) in both locales on the existing dark Astro shell. All entity
data sourced from the single `src/i18n/legal.ts` constant. Build clean, all six pages
render in dev, committed to main, not deployed.

## What Was Done

Six new prerendered pages plus one shared-component enhancement:

- `/de/impressum` + `/en/impressum`: all §5 DDG mandatory fields, sourced from `legal.ts`
  (legal name with "(haftungsbeschränkt)" spelled out, Geschäftsanschrift Fährstraße 217
  40221 Düsseldorf, Geschäftsführer Christo Wilken, Registergericht Amtsgericht München,
  HRB 287814, USt-IdNr. DE364316497). Second means of fast electronic contact = email +
  a link to the contact form (no phone, per the override). Location-bridge section (Sitz
  München / Geschäftsanschrift Düsseldorf / operativ Berlin). Added a concise § 18 Abs. 2
  MStV content-responsibility line (the site has a blog → editorial content → not an empty
  field). Did NOT add Aufsichtsbehörde/Kammer (not a regulated profession), an EU-ODR link
  (the EU ODR platform shut down in 2025), or a § 36 VSBG statement (a solo UG ≤ 10
  employees is exempt from that info duty). EN page is a flagged courtesy translation;
  German legal proper nouns wrapped in `lang="de"` for screen-reader pronunciation.
- `/de/datenschutz` + `/en/datenschutz`: matched the post-A1 minimised reality. No Google
  Fonts clause (self-hosted), no Mixpanel clause (removed), no consent banner (the § 25
  TDDDG section states there is none and why). Sections: Verantwortlicher (mirrors the
  Impressum), server-logs, Vercel + Cloudflare processors with the EU-US Data Privacy
  Framework transfer note, § 25 TDDDG no-tracking line, Vercel Web Analytics as cookieless
  Reichweitenmessung, Web3Forms as the contact processor (email + message, ~30-day
  retention), Betroffenenrechte. Server-log retention stated as "only as long as needed"
  rather than a fabricated number; Web3Forms named without inventing an operator entity.
- `/de/kontakt` + `/en/contact`: backed by the existing Web3Forms form. Rather than
  duplicate the form markup, extended `ContactCTA.astro` with optional localization props
  (`emailLabel`, `messageLabel`, `successMessage`, `fallbackBefore`, `sendingText`,
  `errorText`, `subject`); all default to the current English strings so the homepage
  usages render byte-identically. Each contact page states a response expectation
  ("innerhalb eines Werktags" / "within one business day"). Impressum + footer link here.

## Steering / Reasoning

- The spawn brief was explicit and pre-decided most calls: source from `legal.ts`, no
  phone anywhere public, build the Impressum with Amtsgericht München (publish gated on
  G1, orchestrator-owned), run voice-playbook on every string in both languages.
- "Edit over create" + DRY drove the ContactCTA enhancement instead of a new component or
  duplicated inline forms. Keeping English defaults made the change additive and D4-safe
  (the homepage ContactCTA usages are unchanged; D4 can localize them by passing props).
- One shared-component default changed: the error microcopy "Error - try again" (spaced
  hyphen used as a dash, discouraged by the voice rules) → "Error, please try again".
  Only shows on a failed submit; flagged in BUILD-NOTES-legal.md because ContactCTA is in
  D4's homepage scope.
- Heavy parallel-session contention this wave (B1/B2/D1/E1/contact). The shared git index
  already held a parallel session's staged blog renames (E1) when I committed. Committed
  only my 8 paths with `git commit --only -- <paths>`, leaving their staged work intact
  (the `--only` parallel-staging pattern, and the `-m`-before-`--` ordering gotcha, are
  already documented in ~/.claude/docs/git-parallel-sessions.md, added earlier today by a
  parallel session that hit the same hazard).

## Verification

- `npm run build` clean (only the pre-existing `/blog` unprefixed-route warning, E1's to
  fix). All six pages serve 200 in `astro dev`; Impressum links resolve to the contact
  form in both locales.
- Grep gates: no `287814`/`DE364316497` literals in page files; Datenschutz mentions
  neither Google Fonts nor Mixpanel; no consent-banner UI/script anywhere. Entity facts
  render in the built dist.
- Visual check via isolated headless Chromium (Playwright MCP held by the parallel C1
  session; no dependency added): DE Impressum, DE Kontakt, EN Datenschutz render correctly
  on the dark system with header/footer chrome and correct active locale. Screenshots in
  the job dir.
- voice-playbook run on all DE + EN strings: Sie-Form, no superlatives/em dashes/emoji,
  "(haftungsbeschränkt)" spelled out, "USt-IdNr." canonical, contact copy leads with
  delivery/contact rather than AI-as-product.

## Open Threads

- **Not deployed.** Impressum's public deploy is gated on G1 (fresh Handelsregisterauszug
  reconciled against `legal.ts`); orchestrator owns that gate.
- **F1 (integration)** owns the wave-level route/nav/footer audit and reconciling the
  project CLAUDE.md "Current Pages" / "Planned" inventory once all routes exist. I left
  that shared file untouched to avoid mid-wave parallel-session conflicts and partial
  state.
- **D4** can localize the homepage ContactCTA copy via the new optional props (a one-line
  change per homepage); until then the homepage form keeps English-default field labels.
- Running notes: `BUILD-NOTES-legal.md`.
