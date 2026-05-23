# PLAN — 9592.tech presence sculpting for structured-RFP evaluators

Build plan derived from `VISION.md` + `research/presence-findings.md`. The decisions are
already made (see VISION "Decided" and findings §5). This plan turns them into an ordered,
gated build. A later session implements it; this session does not write site code.

Read this top-to-bottom once: the "What the finished site looks like" section lets you see
the end state; "Planner's calls" records the micro-decisions made here (all reversible);
the dependency graph shows what gates what; the phases carry the verifiable gates.

---

## ⚠️ USER OVERRIDES (2026-05-23) — AUTHORITATIVE, supersede any contrary line below

Two planner's calls were decided by the user and OVERRIDE the plan text wherever it disagrees:

1. **Impressum second contact = email + monitored contact form. NOT phone (PC4 overruled).**
   - The mobile `+49 172 767 7643` must NOT appear anywhere public (Impressum, footer, JSON-LD,
     any page). Remove `phone` from the `legal.ts` constant's public surface (keep it out
     entirely, or keep it unused/non-rendered).
   - Add a `/kontakt` ↔ `/en/contact` page (both locales) backed by the existing Web3Forms
     contact component, with a stated response expectation. The Impressum's "fast electronic
     contact" second means = email `christo@9592.tech` + a link to that contact form.
   - Footer "Kontakt" points at `/kontakt` (the form page), not a bare mailto-only.

2. **Root `/` = browser-language detection (overrides the `prefixDefaultLocale: false` / DE-at-root choice).**
   - **Both locales are explicitly prefixed: `/de/...` and `/en/...`.** There is no unprefixed
     content tree. Use `prefixDefaultLocale: true`.
   - **`/` redirects by `Accept-Language`:** browser `de-*` → `/de`, everything else → `/en`.
     Implement via the mechanism Astro 5 + Vercel best supports (Astro middleware reading the
     `Accept-Language` header, or a Vercel edge/`vercel.json` redirect) — confirm the current
     approach via Context7 before coding. The redirect must be a real per-request decision, not
     a static default.
   - **`x-default` hreflang → `/en/`** (international/unknown audience). `defaultLocale` may stay
     `'de'` for Astro's internal fallback, but no locale lives at the unprefixed root.
   - **Every "DE at `/`" / "EN at `/en/`" / "DE-canonical unprefixed" phrasing below now means
     "`/de/` and `/en/`, with `/` detecting and redirecting."** This affects the finished-site
     description, PC1, PC6, A2, A3, A4, D-phase routes, E1, F1, G3.
   - **Existing blog redirects (PC6):** the three current `/blog/<slug>` URLs → 301 →
     `/en/blog/<slug>` (they are English). The new DE blog content lives at `/de/blog/<slug>`.

These two are cheap to reverse later (one config flip / one constant), consistent with the
reversibility constraint.

---

## ⚠️ POSITIONING CORRECTION (2026-05-23) — AUTHORITATIVE, overrides findings §4.3/§4.4 copy

The research findings' capability copy (§4.4) and the blog-writeup voice note (§4.3) lead with
"uses AI orchestration to deliver ... at the throughput of a small team" / "die
AI-Orchestrierung nutzt". **That framing is WRONG and must not ship.** It was lifted from the
older capability statement, which predates the KNE bid's positioning patch. The KNE work
(`~/projects/bid-pipeline/notes/research/chatgpt-tender27-framing-2026-05-11.md`, the submitted
Angebot/Konzept, and chronicle `2026-05-16…tender27-patch-pass-framing`) explicitly REMOVED the
AI-orchestration self-positioning. Apply that verdict here.

**Lead identity (the correct anchor):**
- DE: "9592 Solutions UG ist ein inhabergeführter Softwareanbieter mit direkter technischer
  Gesamtverantwortung durch die Geschäftsführung."
- EN: "9592 Solutions is an owner-led software provider with direct, end-to-end technical
  responsibility held by its management."

**The edge is the working, inspectable DEMONSTRATOR** (prototype-first: the buyer can verify
core deliverables before award) — NOT AI.

**AI handling — bounded to an internal tool only:** mention AI ONLY as a DSGVO-safe internal
development/QA instrument, with the data-protection reassurance, e.g. "KI-gestützte Werkzeuge
werden ausschließlich als internes Entwicklungs- und Qualitätssicherungsinstrument eingesetzt;
keine Übertragung personenbezogener Daten an externe KI-Dienste" (BfDI/DSK orientation). AI is
NEVER a value proposition, a headline, or a capacity/throughput claim.

**FORBIDDEN (verbatim, from the brief's preserved-language list):** "AI-Orchestrierung nutzt",
"AI orchestration", "AI-/KI-orchestrierte Arbeitsweise", "Solo-Auftragnehmer mit
AI-Orchestrierung", "Durchsatz eines kleinen Teams" / "throughput of a small team", and any
"jung / agil / cheap / startup" framing — plus the already-noted "KI-Agentur" / "KI-Lösungen"
(findings §2.2).

**Translation table (apply wherever §4.3/§4.4 or the old capability statement used the old framing):**
- "uses AI orchestration to deliver custom working software at the throughput of a small team"
  → DROP. Replace with the inhabergeführt + direct-technical-responsibility identity and the
  working-demonstrator edge. Do not substitute another AI-capacity claim.
- "die AI-Orchestrierung nutzt, um ... mit dem Durchsatz eines kleinen Teams zu liefern" → DROP
  likewise.
- "AI-orchestrierte Arbeitsweise" → "KI-gestützte interne Arbeitsweise".
- "Solo-Senior-Entwickler" → "alleinverantwortlicher Senior-Entwickler in inhabergeführter Struktur".

This applies to D1 (capabilities), D3 (blog writeup), D4 (homepage hero), and any positioning
copy. Demo-specific case-study copy (D2, §4.1/§4.2) is about the demonstrators, not the company
positioning, but must still avoid the forbidden framings.

---

## What the finished site looks like (end state)

A bilingual (DE-canonical, EN at `/en/`) company site on the existing dark Astro design system.

- **Landing on `/`** (German): a minimal header (wordmark `9592 Solutions` left; `Leistungen ·
  Arbeiten · Blog` + a `DE | EN` switcher right). A hero that leads with concrete delivery —
  custom working software for structured buyers — with AI named as the enabling *method*, not
  the headline. A short capabilities teaser linking to `/leistungen`. A "Ausgewählte Arbeiten"
  list that surfaces the **two procurement demonstrators first** (offer-map, editorial
  workflow), each linking to a wrapped case study, followed by the retained consumer work
  (Jeeves, AI Actions, Master's thesis). A writing teaser to `/blog`. A contact form. A footer
  carrying `Impressum · Datenschutz · Kontakt`, the legal-entity line (9592 Solutions UG
  (haftungsbeschränkt), Amtsgericht München HRB 287814, USt-IdNr. DE364316497), and the
  language switcher.
- **`/en/`**: the same site in English, every page mirrored, switcher preserves the current
  page when toggling language.
- **`/leistungen` ↔ `/en/services`**: a procurement-facing capabilities page (single-principal
  practice, AI-orchestrated throughput, prototype-first engagement, direct contracting, EU/DE
  data posture, accessibility orientation, explicit "what we do not do"). Carries the
  location-bridge sentence (Sitz München · Geschäftsanschrift Düsseldorf · operativ Berlin).
- **`/arbeiten` ↔ `/en/work`**: a case-study index plus two wrapped case studies (offer-map
  demonstrator, editorial-CMS demonstrator). Each: problem → approach → anonymized screenshots
  → "what it demonstrates", labelled **Demonstrator / Arbeitsprobe**, with a "Live-Demo auf
  Anfrage" line and **no public link to the buyer-branded demos**. Architected so a contract
  win flips it to a named + live-linked version via a single data flag.
- **`/blog` ↔ `/en/blog`**: the existing posts (English) plus a new anonymized procurement-demo
  writeup published in both languages. Mandatory CTA preserved. Unpaired (single-language)
  posts carry a small "only in English" affordance and do not break the build.
- **`/impressum` ↔ `/en/impressum`**: a compliant §5 DDG Impressum.
- **`/datenschutz` ↔ `/en/datenschutz`**: a short, honest Datenschutzerklärung that matches the
  site's actual (minimised) tool set.
- **Under the hood**: self-hosted fonts (no Google-Fonts CDN), no Mixpanel, Vercel cookieless
  analytics only → **no consent banner**. WCAG 2.1 AA verified via Pa11y-CI + Lighthouse.
  Dynamic `<html lang>`, hreflang pairs, localized OG locale.

Nothing in the existing identity is destroyed: the consumer-AI work stays, the dark design
system stays, and the whole sculpt is section/route/flag-level — dial-back-able without a
rebuild.

---

## Cross-cutting constraints (apply to EVERY feature)

1. **STRIP-LIST is a hard rule.** None of the strings/facts in findings §4.5 may appear
   anywhere public: page bodies, headings, blog posts, case studies, **alt text, meta tags,
   image filenames, slugs, committed source comments, JSON-LD, or the sitemap.** This includes
   `Kompetenznetz Einsamkeit`/`KNE`, `ISS`, `gegen Einsamkeit`/loneliness as the domain, the
   funding ministry/minister, the price/cap/tender-number/deadlines, any "we bid for / won X"
   narration, and the buyer's incumbent stack. The buyer is only ever "a national
   counseling/advisory network" / "ein bundesweites Beratungsnetzwerk." A `dist/`-grep for the
   full strip-list is a release gate (G3).
2. **Voice-playbook before finalizing ANY public copy.** Run the `voice-playbook` skill on
   every user-facing string (DE and EN) before a content feature's gate is met. Enforce the
   site voice rules in both languages: no superlatives, no em dashes (use colons or split
   sentences), short active sentences, honest about scope, no emoji, **never lead with
   "KI-Agentur"/"KI-Lösungen"/AI-as-product** (AI is the method). German uses Sie-Form,
   procurement register, "(haftungsbeschränkt)" always spelled out, "USt-IdNr." canonical.
3. **Keep the design system.** Dark theme + tokens in `src/styles/global.css` + project
   `CLAUDE.md`; Inter / JetBrains Mono (now self-hosted). Use the `frontend-design` skill for
   any new UI (header, footer, switcher, case-study layout, capabilities page) to keep quality
   high and avoid generic-AI aesthetics.
4. **Reversibility is a hard constraint.** Additive sections + locale routing + data flags, not
   an identity teardown. Every positioning change must be dial-back-able at the
   section/route/flag level.
5. **No new heavy dependencies** beyond `@fontsource/*` (fonts). Use Astro's **built-in** i18n
   (no plugin). Confirm Astro 5.16 i18n APIs via **Context7** (`/websites/astro_build_en`,
   i18n routing guide + `astro:i18n` reference) before/while coding A2–A4 and E1.
6. **No time estimates** anywhere in implementation, commits, or status.
7. **Correct the register error everywhere it is authored on this site:** it is **Amtsgericht
   München, HRB 287814**, NOT "Handelsregister Düsseldorf" (findings §0.1). Düsseldorf is the
   *Geschäftsanschrift* only.

---

## Planner's calls (made here; all reversible — flagged for the user to veto)

These were under-specified by VISION/findings. Calls made so the build is unambiguous; each is
cheap to reverse.

- **PC1 — Localized slugs via a central route-map.** Use a small `src/i18n/routes.ts` mapping
  page keys to per-locale slugs: `leistungen`/`services`, `arbeiten`/`work`. Keep `impressum`,
  `datenschutz`, `blog` identical across locales (recognized German legal terms / universal).
  Rationale: the brief wants bilingual "done properly"; German slugs under `/en/` read wrong to
  English readers. A central map keeps the switcher and `getStaticPaths` trivial and is the
  idiomatic Astro translated-routes pattern. Reverse by collapsing the map to identical slugs.
- **PC2 — Add a global header + footer.** The site currently has no nav chrome (single-scroll
  homepage). Multi-page + a language switcher needs a home. Minimal header (wordmark + 3 nav
  links + switcher) and a footer (legal links + entity line + switcher). This is the most
  identity-visible change; keep it minimal and on-system. Reverse by removing the partials
  (routes still work). This is on-thesis: a company site with Leistungen/Arbeiten/legal reads
  correctly to a procurement evaluator.
- **PC3 — Capabilities as a dedicated page + homepage teaser** (not homepage-only). A dedicated
  `/leistungen` is linkable from bids; the homepage carries a condensed teaser. Reverse by
  inlining.
- **PC4 — Impressum second contact means = email + phone.** Findings §1.1 offered phone (option
  a, "unambiguously compliant") or a monitored form (option b). Call: publish **email
  `christo@9592.tech` + phone `+49 172 767 7643`** (procurement readers expect a reachable
  number; the number already appears in outward bid materials), keep the Web3Forms contact
  route as the third channel. The phone lives in the single legal-data constant so it is
  one-line removable if the user prefers form-only. **User may veto → fall back to email +
  contact form with a stated response expectation.**
- **PC5 — Blog translation scope (first pass).** Translate `ai-support-premium-service-
  businesses` to DE (most on-thesis for the DACH SMB reader). Keep `claude-code-workflow-tool-
  first-look` and `epd-cost-crisis-small-manufacturers` EN-only (technical/US-niche audiences)
  with the "only in English" affordance. The new procurement-demo writeup is bilingual. This
  satisfies "translate the evergreen posts per the findings policy" without forcing low-value
  translations. Reverse/extend by adding more `de/` siblings later (`translationKey` is
  optional, so the build never breaks).
- **PC6 — Existing EN posts move to `/en/blog/<slug>` with 301 redirects from old
  `/blog/<slug>`.** With DE-canonical unprefixed routing, the unprefixed `/blog` namespace is
  German; English posts belong under `/en/`. Add Vercel/Astro redirects from the three current
  URLs to preserve inbound links. (The three slugs: `ai-support-premium-service-businesses`,
  `claude-code-workflow-tool-first-look`, `epd-cost-crisis-small-manufacturers`.) The DE
  translation of the first lands at `/blog/ai-support-premium-service-businesses`.
- **PC7 — JSON-LD reflects the legal entity.** Update the `ProfessionalService` block in the
  layout to add `legalName: "9592 Solutions UG (haftungsbeschränkt)"`, `vatID: "DE364316497"`,
  and set the `PostalAddress` to the Düsseldorf Geschäftsanschrift (not Berlin) so the
  machine-readable data matches the Impressum. Avoids a Berlin/Düsseldorf contradiction an
  evaluator could surface in source.
- **PC8 — robots.txt unchanged (allow-all).** The case-study pages are anonymized and *meant*
  to be discoverable; there are no live-demo links on the site to deindex (VISION decision 2 is
  satisfied by simply never linking/embedding the buyer-branded URLs). No robots/meta-noindex
  changes needed.

---

## Dependency graph

```
A1 fonts/Mixpanel ─┐
                   ├─► A2 i18n config+routing ─► A3 html-lang/hreflang/JSON-LD ─► A4 switcher+header+footer
                   │                                                                      │
                   │   (A1 also gates B1's tool list)                                     │
                   ▼                                                                      ▼
                                              ┌──────────────┬───────────────┬───────────┴───────┬─────────────┐
                                              ▼              ▼               ▼                   ▼             ▼
                                        B1 Datenschutz  B2 Impressum    D1 Capabilities      E1 blog i18n   D4 home reframe
                                              │           (built;            │              restructure        │ (needs D2)
                                              │            publish-gated     │                   │             │
                                              │            on G1)            │                   ▼             │
C1 screenshots (independent) ───────────────────────────────────► D2 case studies        D3 blog writeup     │
                                                                        │  (needs C1+A4)    (needs E1+A4)      │
                                                                        └──────────────┬──────────────────────┘
                                                                                       ▼
                                                          F1 wire nav/footer + route audit (needs B1,B2,D1,D2,D3,D4,E1)
                                                                                       ▼
                                              G1 fresh Handelsregister (gates Impressum publish) ─► G2 a11y pass ─► G3 build+deploy
```

Parallelizable once A4 is done: **B1, B2, D1, E1** in parallel; **C1** can run anytime from the
start (independent); **D2** waits on C1+A4; **D3** waits on E1+A4; **D4** waits on D2.

---

## PHASE A — Foundation (privacy + i18n spine)

### A1 — Self-host fonts + remove Mixpanel
- **What:** In `src/layouts/Layout.astro` remove the Google Fonts `<link>`/`preconnect`
  (lines ~47–49) and the entire Mixpanel `<script>` block (lines ~74–129). Self-host Inter +
  JetBrains Mono via `@fontsource/inter` + `@fontsource/jetbrains-mono` (import the needed
  weights: Inter 400/500/600/700, JetBrains Mono 400/500) or vendored WOFF2 in `/public` with
  `@font-face` in `global.css`. Remove `mixpanel-browser` from `package.json`. Remove the
  dead `mixpanel.track` TODO in `BlogCTA.astro` (line ~243).
- **Gate:** `npm run build` clean; a grep of `dist/` finds **zero** references to
  `fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.mxpnl.com`, or `mixpanel`; a Playwright
  network capture on the built preview shows **no** request to Google or Mixpanel hosts; Inter
  and JetBrains Mono render correctly (visual check, headings + mono labels). `@vercel/analytics`
  is retained (cookieless).
- **Depends on:** none.

### A2 — i18n config + routing scaffold
- **What:** Add the i18n block to `astro.config.mjs`: `locales: ['de','en']`,
  `defaultLocale: 'de'`, `routing: { prefixDefaultLocale: false }`. Create `src/i18n/routes.ts`
  (PC1 route-map) and `src/i18n/utils.ts` (`getLangFromUrl(url)`, `stripLocale(pathname)`,
  `localizedPath(key, lang)`, `useTranslations(lang)`), and `src/i18n/ui.ts` (a dictionary for
  chrome strings: nav labels, footer labels, switcher, "skip to content", "only in English"
  affordance — DE + EN). Restructure pages so default-locale (DE) pages live at
  `src/pages/*` and English mirrors live at `src/pages/en/*`. Page-body copy is authored
  per-locale in the page files (DE/EN copy is hand-written from findings, not key-mapped);
  only chrome uses the dictionary. Confirm the exact API shapes via Context7 first.
- **Gate:** `/` serves DE and `/en/` serves EN; `npm run build` clean; every page in the
  mirrored route set resolves in both locales with no 404; the route-map is the single source
  for the `leistungen/services` + `arbeiten/work` slugs.
- **Depends on:** A1 (shares `Layout.astro`; do privacy edit first to avoid churn).

### A3 — Dynamic `<html lang>` + hreflang + localized OG + JSON-LD fix
- **What:** In `Layout.astro`, set `<html lang={lang}>` from `getLangFromUrl(Astro.url)` /
  `Astro.currentLocale`. Emit `<link rel="alternate" hreflang>` for `de`, `en`, and
  `x-default` pointing at each page's locale counterparts (use the route-map to build pairs).
  Set `og:locale` dynamically (`de_DE` / `en_US`). Apply PC7 (legalName + vatID + Düsseldorf
  PostalAddress) to the JSON-LD. Keep canonical correct per page.
- **Gate:** view-source shows `lang="de"` at `/` and `lang="en"` at `/en/`; each page emits
  hreflang for de/en/x-default with correct counterpart URLs; `og:locale` differs by locale;
  JSON-LD shows the legal name, VAT-ID, and Düsseldorf address; build clean.
- **Depends on:** A2.

### A4 — Language switcher + global header + footer (shell)
- **What:** Build `LanguageSwitcher.astro` (uses route-map + `getRelativeLocaleUrl`, preserves
  the current page, marks the active locale `aria-current`, fully keyboard-focusable with
  visible focus). Build a minimal `Header.astro` (wordmark/name left; nav `Leistungen ·
  Arbeiten · Blog` + switcher right; accessible mobile menu that traps no focus and closes on
  Esc) and `Footer.astro` (legal links `Impressum · Datenschutz`, `Kontakt` mailto, the
  legal-entity line, switcher). Wire both into `Layout.astro`. Use `frontend-design` for
  quality; keep on the dark design system. Footer/legal links may point at routes not yet built
  (final wiring verified in F1).
- **Gate:** toggling DE↔EN on any built page lands on the **same page** in the other locale
  (not home); switcher + nav + mobile menu are keyboard-operable with visible focus and Esc
  closes the menu; header + footer render correctly in both locales and on mobile; no layout
  shift / contrast regressions on the dark theme.
- **Depends on:** A2, A3.

---

## PHASE B — Legal pages

### B1 — Datenschutzerklärung (DE + EN)
- **What:** `/datenschutz` + `/en/datenschutz`, structured per findings §1.2 (Verantwortlicher
  mirroring the Impressum; Websitebesuch/server-logs; Hosting Vercel + CDN Cloudflare as
  processors with the US-transfer/DPF note; a §25 TDDDG line stating no non-essential
  cookies/tracking; Vercel Web Analytics as cookieless Reichweitenmessung; Web3Forms as the
  contact processor with data categories + ~30-day retention; Betroffenenrechte). **Must match
  the post-A1 reality:** self-hosted fonts → **no Google Fonts clause**; Mixpanel removed → **no
  Mixpanel clause**; **no consent banner**. Honest, short. Run voice-playbook.
- **Gate:** both locale pages render every applicable section; the controller block mirrors the
  Impressum (B2); the page mentions neither Google Fonts nor Mixpanel; no consent banner exists
  anywhere on the site; voice-playbook passed; Pa11y passes the page; build clean.
- **Depends on:** A1 (final tool set), A4 (footer link target).

### B2 — Impressum (DE + EN) with one-line-updatable register slot
- **What:** `/impressum` + `/en/impressum` with all §5 DDG mandatory fields (findings §1.1):
  legal name **with "(haftungsbeschränkt)" spelled out**, Geschäftsanschrift `Fährstraße 217,
  40221 Düsseldorf`, `Geschäftsführer: Christo Wilken`, `Registergericht: Amtsgericht München ·
  HRB 287814`, `USt-IdNr.: DE364316497`, contact email + phone (PC4). Put **all** entity data
  in one constant `src/i18n/legal.ts` (`{ legalName, address, managingDirector, court, hrb,
  vatId, email, phone }`) consumed by both locales, the footer, and the JSON-LD — so the
  register line is a single edit. Add the location-bridge sentence (Sitz München ·
  Geschäftsanschrift Düsseldorf · operativ Berlin). Do **not** add empty Aufsichtsbehörde/
  Kammer fields. Run voice-playbook. The page is **built** in this phase; its **public deploy
  is gated on G1** (fresh Auszug).
- **Gate:** both locale pages render all §5 DDG fields with the values above; entity data lives
  in exactly one constant (grep confirms no duplicated HRB/VAT literals in page files); the
  bridge sentence is present; no empty regulated-profession fields; voice-playbook passed;
  Pa11y passes; build clean. (Publish correctness is G1.)
- **Depends on:** A4. (Register-value confirmation = G1, a publish gate, not a build blocker.)

---

## PHASE C — Demo screenshots (independent; gates D2)

### C1 — Capture + anonymize demonstrator screenshots
- **What:** Produce a set of anonymized PNGs under `public/work/` (neutral filenames, e.g.
  `offer-map-overview.png`, `offer-map-filters.png`, `offer-map-radius.png`,
  `offer-map-list.png`, `offer-map-mobile.png`, `editorial-queue.png`, `editorial-diff.png`,
  `editorial-reminders.png`, `editorial-audit.png`). **Reuse the demos' existing Playwright
  capture harness:** `~/projects/kne-angebotslandkarte-demo/scripts/screenshots.mjs` already
  drives Playwright (it captures overview / filter-active / detail / mobile / iframe / PLZ-
  radius and honors `KNE_BASE_URL`); `~/projects/kne-cms-demo` has the CMS source + a
  `run-pa11y.sh`. Capture the capability-demonstrating crops: marker clustering + category-aware
  cluster counts, filter sidebar (category/subcategory/topic/radius), radius/PLZ search, the
  nationwide-offers surface, the accessible list view, mobile; and for the CMS: the persona
  switch, contributor submission, editor intake queue, change queue with diff view, the
  "fast-forward 6 months" reminder trigger + preview outbox, and the audit log. **Strip ALL
  identifying chrome** (findings §4.5): crop out / exclude the page title "Angebotslandkarte
  gegen Einsamkeit", "Kompetenznetz Einsamkeit (KNE)", any "~1,600 KNE entries" copy, the URL
  bar (`kne-demo.9592.tech` / `kne-cms-demo.9592.tech`), and any buyer logo/footer. Prefer
  **element-level / clipped screenshots** (capture just the component) over full-page +
  post-blur; use crop (`sips`) to trim chrome; blur only where chrome can't be cleanly excluded.
  Optimize for retina (≥2x) and reasonable file size.
- **Gate:** **every** shipped PNG is visually inspected (Read each image) and contains **zero**
  strip-list strings or buyer logos/URLs; filenames and the planned alt-text contain zero
  strip-list terms; images are retina-crisp and size-reasonable. Any shot where identifying
  chrome cannot be cleanly cropped is re-captured, not shipped blurred-but-legible.
- **Depends on:** none (start anytime).
- **Planner's note:** the cleanest capture would run the demo repos locally with anonymized
  labels, but that is a demo-repo change (out of this project's scope). Per VISION decision 2 +
  the brief, the locked path is capture-then-crop/blur. Flag to the orchestrator if a key crop
  is impossible to anonymize cleanly.

---

## PHASE D — Content (depends on scaffold; D2 also on C1, D4 on D2)

### D1 — Capabilities page + homepage teaser (DE + EN)
- **What:** `/leistungen` ↔ `/en/services` from findings §4.4 (single-principal practice,
  AI-orchestrated throughput, prototype-first engagement, direct contracting, EU/DE data
  posture, accessibility orientation, explicit "What we do not do"). **Use the corrected
  register fact (Amtsgericht München)** wherever entity facts appear. Include the location-
  bridge sentence. Add a condensed capabilities teaser block to the homepage (both locales)
  linking to the page. AI framed strictly as the enabling method. Run voice-playbook;
  `frontend-design` for layout.
- **Gate:** both locale pages render; copy passed voice-playbook (no "KI-Agentur"/superlatives/
  em-dashes; AI as method not headline; Sie-Form + register on DE); homepage teaser links
  correctly in both locales; Pa11y + dark-contrast pass; build clean.
- **Depends on:** A4.

### D2 — Work index + two case-study pages (DE + EN) — win-flip architected
- **What:** `/arbeiten` ↔ `/en/work` index + two case studies (slugs free of strip-list terms,
  e.g. `arbeiten/angebotslandkarte`↔`work/offer-map` and `arbeiten/redaktions-workflow`↔
  `work/editorial-workflow`). Copy from findings §4.1 (offer-map) and §4.2 (editorial CMS):
  problem → approach → screenshots (from C1) → "what it demonstrates". Label each
  **Demonstrator / Arbeitsprobe** (not a customer project / not a product). Add a "Live-Demo auf
  Anfrage" / "Live demo on request" line; **no public link or embed of the buyer-branded
  demos.** **Win-flip architecture (concrete):** drive each case study from a small data object,
  e.g. `src/data/work/<key>.ts` with `{ anonymized: boolean, liveUrl?: string, buyerName?: string,
  ... }`. When `anonymized: true` → render the generic framing + "on request" + screenshots.
  When flipped (`anonymized: false` + `liveUrl`/`buyerName` set) → render the named title + a
  live-link button + (optionally) the public URL. So the award-day change is a single data
  edit, not a rebuild. Run voice-playbook; `frontend-design` for the case-study layout (image
  galleries with proper alt text).
- **Gate:** 2 index locale pages + 4 case-study locale pages render; C1 screenshots display
  with strip-list-clean alt text; **zero** strip-list strings in body/headings/alt/meta/slug;
  **no** public demo URL or iframe anywhere; the win-flip is demonstrably a single data flag
  (documented in the page/data file); voice-playbook passed; Pa11y + dark-contrast pass; build
  clean.
- **Depends on:** A4, C1.

### D3 — Anonymized procurement-demo blog writeup (DE + EN)
- **What:** A new post from findings §4.3 ("What it takes to ship a working demo instead of a
  slide deck" / "Was es heißt, einen lauffähigen Demonstrator statt eines Foliensatzes
  abzugeben"), authored in both locales at `src/content/blog/en/<slug>.mdx` and
  `src/content/blog/de/<slug>.mdx` with a shared `translationKey`. Cover the source beats
  (trigger pattern, three-requirements-as-one-problem, two demonstrators, accessibility
  discipline, EU data stance, honest Arbeitsprobe framing, "the demo is the instrument not the
  deliverable"). **Mandatory `cta` frontmatter block** (build fails without it). Run
  voice-playbook.
- **Gate:** post builds in both locales with a valid `cta` block (verify the build-fail
  guarantee still holds — temporarily removing the CTA must fail the build); `translationKey`
  pairs the two; renders at `/blog/<slug>` (DE) + `/en/blog/<slug>` (EN); **zero** strip-list
  strings; voice-playbook passed.
- **Depends on:** E1 (blog i18n collection), A4.

### D4 — Homepage hero + Selected-work reframe (DE + EN)
- **What:** Rewrite the hero (both locales) to **lead with concrete delivery** (custom working
  software for structured buyers), AI as method — replacing the current AI-led
  "I build AI systems that pay for themselves". Reorder "Selected work" / "Ausgewählte
  Arbeiten" so the **two demonstrators appear first** (each linking to its `/arbeiten` case
  study, with the Demonstrator/Arbeitsprobe label and **no** external live link), followed by
  the retained Jeeves, AI Actions, and Master's thesis entries (all kept). Section-level change
  only (reversible). Run voice-playbook.
- **Gate:** both locale homepages render; demonstrators are first in Selected work and link to
  the case studies (not external); Jeeves/AI Actions/thesis retained; hero contains no AI-led
  headline / superlatives / em-dashes; voice-playbook passed; Pa11y + dark-contrast pass.
- **Depends on:** A4, D2 (case-study routes must exist to link to).

---

## PHASE E — Blog i18n (gates D3 + the translated post)

### E1 — Blog collection restructure + locale-aware routing
- **What:** Move the three existing posts to `src/content/blog/en/` (slugs unchanged). Add the
  DE translation of `ai-support-premium-service-businesses` at
  `src/content/blog/de/ai-support-premium-service-businesses.mdx` (PC5; voice-playbook the DE
  copy). Make `translationKey` an **optional** field in `src/content/config.ts` (keep the rest
  of the Zod schema + mandatory `cta`). Rewrite `src/pages/blog/[...slug].astro` and
  `src/pages/blog/index.astro` to be locale-aware: derive `lang` from the entry path
  (`post.id.split('/')`), route DE at `/blog/<slug>` (no prefix) and EN at `/en/blog/<slug>`,
  localize date formatting via `lang`, and have each locale's blog index list only that
  locale's posts. Add the "only in English / nur auf Englisch verfügbar" affordance for posts
  with no sibling. The language switcher uses `translationKey` to jump to a post's sibling, or
  degrades to the localized blog index (never 404). Add **301 redirects** from the three old
  `/blog/<slug>` paths to `/en/blog/<slug>` (PC6; Vercel/Astro redirects). Confirm content-
  collection i18n APIs via Context7.
- **Gate:** build clean with `translationKey` absent on legacy posts (no build break); the DE
  homepage/blog shows the DE post + the affordance for EN-only ones; EN blog shows all English
  posts; existing three URLs 301-redirect to their `/en/` counterparts (verify each); switcher
  on a paired post jumps to the sibling and on an unpaired post degrades gracefully; the
  mandatory-CTA build-fail guarantee still holds.
- **Depends on:** A2, A4.

---

## PHASE F — Integration

### F1 — Wire all nav/footer links + full route audit
- **What:** Point every header/footer link at the real routes in both locales (Leistungen,
  Arbeiten, Blog, Impressum, Datenschutz, Kontakt). Confirm the footer legal-entity line shows
  the corrected facts (Amtsgericht München, HRB 287814, USt-IdNr. DE364316497, Geschäftsanschrift
  Düsseldorf) from the single `legal.ts` constant. Verify the sitemap includes both locale
  trees.
- **Gate:** an automated link-check (crawl both locale trees) returns **no 404 / no dead link**;
  `sitemap-index.xml` lists DE + EN pages; footer entity line is correct and sourced from the
  one constant; switcher works from every page type (home, leistungen, arbeiten, case study,
  blog index, blog post, impressum, datenschutz).
- **Depends on:** B1, B2, D1, D2, D3, D4, E1.

---

## PHASE G — Verification & publish gates

### G1 — Fresh Handelsregisterauszug confirmation (Impressum publish gate)
- **What:** Immediately before the Impressum goes public, pull a fresh Handelsregisterauszug
  (or check handelsregister.de) and reconcile against `legal.ts`. Current best-known (Abruf
  2026-05-09, findings §0.1): **Sitz München, Registergericht Amtsgericht München, HRB 287814,
  Geschäftsanschrift Fährstraße 217 40221 Düsseldorf, Geschäftsführer Christo Wilken, USt-IdNr.
  DE364316497.** If a Sitzverlegung to Düsseldorf has completed, update the **single constant**
  accordingly (and note the capability-statement / UNGM "Handelsregister Düsseldorf" correction
  for the orchestrator). If the register API/site is unreachable, surface it to the user rather
  than publishing an unverified register line.
- **Gate:** a fresh handelsregister.de check is performed on/near publish day; `legal.ts`
  matches what the register says that day; any discrepancy is applied to the one constant before
  deploy. **Blocks the public deploy of the Impressum** (and therefore G3).
- **Depends on:** B2 built.

### G2 — Accessibility verification pass (WCAG 2.1 AA)
- **What:** Run **Pa11y-CI** (WCAG2AA, axe + htmlcs runners — model the config on
  `~/projects/kne-angebotslandkarte-demo/tests/pa11yci.json`) against the built main site for
  **every locale page** (home, leistungen/services, arbeiten/work + both case studies, blog
  index, the new post, impressum, datenschutz — DE and EN). Run **Lighthouse mobile** (a11y +
  perf). Explicitly verify the dark-theme contrast pairs (findings §1.3): `#a1a1a1`, `#3b82f6`,
  `#60a5fa` on `#0a0a0a` and `#141414` (body ≥ 4.5:1, large/UI ≥ 3:1). Verify: one `<h1>` per
  page, logical heading order, landmarks + skip-to-content link, keyboard operability of
  switcher/nav/mobile-menu/forms, visible `:focus-visible`, `prefers-reduced-motion` respected,
  meaningful alt text + empty alt on decorative, form labels + `aria-describedby`, touch targets
  (match the demos' 44×44 on mobile). Use the `axiom`/accessibility tooling or the demos'
  toolchain. Optionally add a short honest "Erklärung zur Barrierefreiheit" note (state the
  standard targeted + testing done; do not overclaim full conformance) — parked, not required.
- **Gate:** Pa11y-CI passes WCAG2AA with **zero errors** on every locale page; Lighthouse a11y
  meets the demos' bar (≥95) and mobile perf ≥90; the contrast pairs are documented as passing
  (with the measured ratios); a keyboard walkthrough of switcher + nav + mobile menu + both
  forms passes.
- **Depends on:** F1.

### G3 — Final build + deploy verification
- **What:** `npm run build` clean. Playwright walkthrough of the built preview: screenshot every
  page type in **both** locales; confirm the switcher, nav, forms, and case-study galleries
  render. **Grep `dist/` for the full strip-list (§4.5) → must return nothing.** Network capture
  → **no** request to `fonts.google*`, `gstatic`, `cdn.mxpnl.com`, or any unexpected third party
  pre-consent. Confirm **G1** is satisfied (register line verified) before the Impressum is
  live. Then `vercel --prod`. Post-deploy smoke: both locales live, `cf-ray` + `server:
  cloudflare` headers present, switcher works in prod, `/impressum` + `/datenschutz` live in
  both locales, sitemap reachable, the three old blog URLs 301 correctly.
- **Gate:** clean build; `dist/` strip-list grep empty; network capture clean; prod smoke passes
  on both locales; the three redirects work; Impressum live only after G1.
- **Depends on:** G1, G2.

---

## Reusable assets (paths the build session should mine, not re-derive)

- **Anonymized DE+EN copy** (case studies, blog writeup, capabilities, register notes,
  strip-list): `research/presence-findings.md` §4.1–§4.5 (this repo).
- **i18n approach** (config, collection strategy, switcher shape, html-lang): findings §3;
  confirm live API shapes via Context7 `/websites/astro_build_en`.
- **Legal field spec**: findings §1.1 (Impressum), §1.2 (Datenschutz structure), §1.3 (a11y set).
- **Screenshot capture harness**: `~/projects/kne-angebotslandkarte-demo/scripts/screenshots.mjs`
  (Playwright, honors `KNE_BASE_URL`); CMS source + `~/projects/kne-cms-demo` (`run-pa11y.sh`).
- **Pa11y-CI config to model**: `~/projects/kne-angebotslandkarte-demo/tests/pa11yci.json`,
  `~/projects/kne-cms-demo/.pa11yci.json`.
- **Capability-statement source** (correct the "Düsseldorf" register error when reusing):
  `~/projects/bid-pipeline/notes/ungm/capability-statement-draft.md`.
- **Buyer-culture / evaluator-signal source**: findings §2 +
  `~/projects/bid-pipeline/notes/research/buyers/iss-kne-buyer-culture-chatgpt-2026-05-09.md`.
- **Skills**: `voice-playbook` (every public string), `frontend-design` (all new UI), Context7
  (Astro i18n APIs), the demos' Pa11y-CI + Lighthouse toolchain (G2).

---

*Plan only. No `src/` files were modified in this session. Decisions are locked per VISION +
findings §5; planner's calls (PC1–PC8) are flagged and reversible.*
