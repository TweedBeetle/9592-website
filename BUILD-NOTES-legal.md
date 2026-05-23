# BUILD-NOTES-legal (Phase B1/B2 + /kontakt)

Running log for the legal-pages + contact-page wave. Scope: B1 (Datenschutz),
B2 (Impressum), and the `/kontakt` ↔ `/en/contact` page (USER OVERRIDE item 1).
Source ordering: PLAN.md (incl. USER OVERRIDES) > VISION.md > research/presence-findings.md.

This session does NOT deploy. The Impressum's public deploy is gated on G1 (fresh
Handelsregisterauszug); building it now with Amtsgericht München is the instruction.

## Routes built

- `/de/impressum` -> `src/pages/de/impressum.astro`
- `/en/impressum` -> `src/pages/en/impressum.astro`
- `/de/datenschutz` -> `src/pages/de/datenschutz.astro`
- `/en/datenschutz` -> `src/pages/en/datenschutz.astro`
- `/de/kontakt` -> `src/pages/de/kontakt.astro`
- `/en/contact` -> `src/pages/en/contact.astro` (route-map: kontakt.en = 'contact')

All carry `pageKey` so the Layout emits the correct hreflang pair + the
Header/Footer mark the active route.

## Entity data — single source

All entity facts come from `src/i18n/legal.ts` (imported into each page). No HRB
or VAT literal is typed into any page file. `legal.ts` already had every field
this wave needs (legalName, street, postalCode, city, countryCode,
managingDirector, registerCourt, registerNumber, vatId, email, seat,
operativeCity), so I did NOT extend it. No `phone` field exists, per the override
(mobile number must not appear on any public surface). Register fact = Amtsgericht
München (NOT Düsseldorf; Düsseldorf is the Geschäftsanschrift only).

## Decisions / judgment calls

- **§ 18 Abs. 2 MStV content-responsibility line included.** Findings §1.1 lists the
  §5 DDG fields and warns against adding *empty* regulated-profession fields
  (Aufsichtsbehörde/Kammer). The §18 MStV line is not empty: it names a real person
  (the Geschäftsführer) and is the standard companion field for a site with editorial
  content (the blog). Included concisely in both locales. NOT added: Aufsichtsbehörde,
  Kammer, berufsrechtliche Regelungen (none apply — software dev is not a regulated
  profession). Also NOT added: EU-ODR-Plattform link (the EU ODR platform ceased
  operation in 2025) and a § 36 VSBG Verbraucherstreitbeilegung statement (a solo UG
  ≤ 10 employees is exempt from that info duty). Adding either would be the
  "generated-template" padding findings §1.1 warns against.
- **EN pages are courtesy translations.** EN Impressum carries a small muted note that
  the German version is the legally binding one. German proper-noun legal terms
  (legal name, Amtsgericht München, USt-IdNr.) are wrapped in `lang="de"` on the EN
  pages for screen-reader pronunciation (findings §3.4).
- **Datenschutz tool set matches the post-A1 minimised reality.** No Google Fonts clause
  (fonts self-hosted), no Mixpanel clause (removed), no consent banner (the §25 TDDDG
  section explicitly states there is none and why). Processors disclosed: Vercel
  (hosting) + Cloudflare (CDN/proxy) with the EU-US Data Privacy Framework transfer
  basis; Vercel Web Analytics as cookieless Reichweitenmessung; Web3Forms as the
  contact processor (email + message, ~30-day retention). Server-log retention is
  stated as "only as long as needed" rather than a fabricated number (I could not
  verify Vercel's exact log retention; not inventing one). Web3Forms named as
  "Web3Forms (web3forms.com)" without inventing a legal operator entity/country.
  No Datenschutzbeauftragter section (a solo UG is below the §38 BDSG threshold;
  per findings "don't invent a DPO" — omitted rather than asserted).
- **Datenschutz dated "Stand: Mai 2026" / "Last updated: May 2026".**

## Contact page (`/kontakt` ↔ `/en/contact`)

- Backed by the existing Web3Forms setup. Rather than duplicate the form markup, I
  **extended `src/components/ContactCTA.astro`** (edit-over-create) with optional
  localization props: `emailLabel`, `messageLabel`, `successMessage`, `fallbackBefore`,
  `sendingText`, `errorText`, `subject`. All default to the current English strings, so
  the homepage usages (`/de/`, `/en/`) render byte-identically (verified: EN homepage
  still shows "Have a project in mind" / "Or email me directly at christo@9592.tech" /
  "Tell me about it"). The contact pages pass fully localized strings. The same
  Web3Forms access key + submit-handler pattern is reused; `sendingText`/`errorText`
  are passed to the inline script via `data-` attributes on the submit button.
- **One shared-component default changed:** the error-state microcopy default went from
  `"Error - try again"` (used a spaced hyphen as a dash, which the voice rules
  discourage) to `"Error, please try again"`. This only shows on a failed submit and is
  a voice improvement; the success path and all normal homepage rendering are
  unchanged. Flagging because ContactCTA is a shared component used by the homepages
  (D4's scope).
- The contact-page fallback email is sourced from `legal.email` (no hardcoded address
  in the component anymore). Each page states a response expectation ("innerhalb eines
  Werktags" / "within one business day").
- Impressum (both locales) + footer link here. Footer "Kontakt"/"Contact" already
  pointed at `/de/kontakt` / `/en/contact` from the A4 shell; these pages now exist.

## ui.ts / chrome strings

Did NOT touch `src/i18n/ui.ts`. All new copy is page-body copy authored per-locale in
the page files (and as ContactCTA props), not shared chrome. The footer/header already
had the `Impressum` / `Datenschutz` / `Kontakt` labels (`Imprint` / `Privacy` /
`Contact` in EN) from A4. No new shared chrome string was needed.

## legal.ts

Not modified. It already carried every field this wave needs and (correctly) has no
`phone` field. Register fact = Amtsgericht München.

## Verification

- `npm run build` clean. The only build warning is the pre-existing `/blog` route
  conflict (E1-pending unprefixed blog), documented in BUILD-NOTES.md — not from this
  wave.
- All six pages serve 200 in `astro dev`. Impressum links resolve to the contact form
  in both locales (`/de/kontakt/`, `/en/contact/`). Contact forms carry the Web3Forms
  action + localized labels.
- Grep gates: zero hardcoded `287814`/`DE364316497` literals in page files; Datenschutz
  mentions neither Google Fonts nor Mixpanel; no consent-banner UI/script anywhere (the
  only "consent"/"cookie-banner" string matches are the prose stating none exists +
  the withdrawal-of-consent right). Entity facts (Amtsgericht München, HRB 287814,
  DE364316497, haftungsbeschränkt) render in the built `dist/` Impressum pages.
- Visual check via isolated headless Chromium (Playwright MCP was held by the parallel
  C1 session; no new dependency added): DE Impressum, DE Kontakt, EN Datenschutz all
  render correctly on the dark design system with header/footer chrome, correct active
  locale in the switcher, and complete content. Screenshots in the job dir.
- voice-playbook run on all user-facing strings (DE + EN): Sie-Form on DE, no
  superlatives, no em dashes (separators are periods/commas), no emoji,
  "(haftungsbeschränkt)" spelled out, "USt-IdNr." canonical, contact copy leads with
  delivery/contact not AI-as-product.

## NOT done (out of scope / later phases)

- No deploy (G3). Impressum public deploy is gated on G1 (fresh Handelsregisterauszug).
- F1 owns the final nav/footer route audit across all pages.
- Homepage hero/selected-work reframe is D4; homepage ContactCTA copy stays English-
  default until D4 localizes it (the new props make that a one-line change per page).
