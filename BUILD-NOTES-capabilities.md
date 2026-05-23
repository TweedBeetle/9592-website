# BUILD-NOTES — D1 Capabilities page + homepage teaser

Running log for PLAN feature D1 (`/leistungen` ↔ `/en/services` + homepage teaser).
This is my own notes file; the shared `BUILD-NOTES.md` (Phase A) is read-only for me.

Authoritative source ordering: PLAN.md (incl. `⚠️ USER OVERRIDES`) > VISION.md >
research/presence-findings.md. Copy source for this feature: findings §4.4.

## Scope built

- `src/pages/de/leistungen.astro` → `/de/leistungen` (route-map `leistungen`).
- `src/pages/en/services.astro` → `/en/services` (route-map `leistungen` / EN slug `services`).
- Homepage teaser ADDED to `src/pages/de/index.astro` and `src/pages/en/index.astro`
  (the two index files I was cleared to edit this wave). Hero and Selected-work
  list left untouched (those are D4).

Out of scope (not touched): Header/Footer/LanguageSwitcher, routes.ts, ui.ts,
legal.ts, utils.ts (all consumed via import only). No new shared chrome string was
needed — all page-body copy lives in the page files.

## Copy decisions (findings §4.4)

- **Em dashes removed (site voice rule #2).** The §4.4 source wraps the
  prototype-seeding clause in em dashes (`… requested system — seeded with … —
  rather than …`). Restructured into separate sentences in both languages:
  "… of the requested system, seeded with your domain language, sample data, and
  realistic workflows. It begins with working software, not slide decks or
  capability statements." (DE analogously). Zero em dashes in the built output
  (grepped `dist/` for U+2014 across all 4 files: 0).
- **AI as method, never headline.** h1 leads with concrete delivery:
  DE "Lauffähige Software, auf Ihren Prozess zugeschnitten" / EN "Working software,
  built for your process". The string "AI" appears only in the lead paragraph
  ("uses AI orchestration to deliver …" / "die AI-Orchestrierung nutzt, um …").
  Verified: no `AI`/`KI` token in any `<h1>/<h2>/<h3>` on either page. No
  "KI-Agentur"/"KI-Lösungen" anywhere (anti-keywords §2.2; grep clean).
- **`AI-Orchestrierung` kept in DE** per the §4.4 register note ("reads better than
  KI-Orchestrierung in DE B2B"). The note's strict-Behördendeutsch alternative
  ("KI-gestützte Orchestrierung") was not needed; the audience is mixed
  procurement + Mittelstand and the source's choice is the safer default.
- **Company "wir"/"we" voice on the capabilities page** (matches the §4.4 source and
  the task-mandated headings "Was wir nicht anbieten" / "What we do not do"). This is
  the legal entity speaking to a buyer, not a team fiction: the single-principal
  framing is explicit in the lead ("Einzel-Prinzipal-Softwarepraxis" /
  "single-principal software practice"), so "wir" reads as "the practice", not
  implied headcount (§2.2 anti-signal avoided). The homepage stays first-person
  "ich"/"I"; the two registers coexist deliberately (homepage = Christo personally,
  capabilities page = the company). Homepage teaser bridges with "liefere ich" /
  "I deliver".
- **Sie-Form throughout DE** ("Ihren Prozess", "Ihrer Fachsprache", "Sie haben einen
  konkreten Bedarf?"). "(haftungsbeschränkt)" spelled out (sourced from
  `legal.legalName`).
- **`Was wir nicht anbieten` / `What we do not do`** rendered as an explicit muted
  card (bg-secondary), four items verbatim from §4.4 (Schulungen/Workshops,
  Personal-Augmentation, Großteam-Integration mit Schein-Personal-Profilen,
  Hardware-Beschaffung).

## Entity facts (corrected register) — single source of truth

All entity facts pull from `src/i18n/legal.ts` (no literals duplicated in the page
files): `legal.legalName`, `legal.seat` (München), `legal.city` (Düsseldorf),
`legal.operativeCity` (Berlin). The location-bridge sentence is therefore
register-correct by construction: "Sitz München, Geschäftsanschrift Düsseldorf,
operativ in Berlin." / "Registered office in München, business address in
Düsseldorf, operating from Berlin." **Amtsgericht München** is the register fact
(the page itself does not restate HRB/court; that is the Impressum's job — the page
carries only the location bridge per the D1 spec). If the Sitz moves (G1), the bridge
updates automatically from the constant.

Note: EN copy uses the German city names verbatim (München, Düsseldorf) rather than
exonyms (Munich), to keep one source of truth and match the Impressum/JSON-LD.

## Design (frontend-design lens)

Followed the A4 precedent: refined minimalism on the established dark system, not the
skill's maximalist push. The overriding constraints are design-system consistency
(cross-cutting #3) + procurement-evaluator credibility. Reused the existing token set
and component idioms (mono uppercase section labels, `max-w-3xl` column, `p-4 -mx-4`
hover link cards, the arrow SVG). New detail: practice areas as a 2-col grid with
`gap-px bg-bg-secondary` hairline dividers; negative-scope list as a `divide-y
divide-white/5` stack inside a secondary-bg card. One `<h1>` per page; h2 section
labels; h3 for grid items / link-card titles (logical heading order for G2).

## Homepage teaser

Inserted a `Leistungen` / `Services` section between "Was ich mache" / "What I do"
and "Ausgewählte Arbeiten" / "Selected work". Condensed framing (single-principal,
working software over slide decks, AI as method) + a link card to the capabilities
page via `localizedPath('leistungen', lang)` where `lang = getLangFromUrl(Astro.url)`
(imported into each index frontmatter). Verified the rendered links: DE →
`/de/leistungen/`, EN → `/en/services/` in both `dist/` and the dev server.

## Verification

- `npm run build`: clean (the >500 kB chunk warning is pre-existing, from the blog's
  mermaid/cytoscape/katex bundles, unrelated to D1). Both `/de/leistungen/index.html`
  and `/en/services/index.html` prerender.
- Dev server: `/de/leistungen/`, `/en/services/`, `/de/`, `/en/` all HTTP 200;
  teaser links present in dev HTML.
- Visual: full-page screenshots of `/de/leistungen/`, `/en/services/`, and `/de/`
  (with teaser) confirmed correct dark-theme rendering, on-system layout, header
  (active nav), footer (entity line + switcher), and the contact form. Screenshots
  were inspected then deleted (not committed).
- voice-playbook run on every user-facing string in both languages: no em dashes, no
  superlatives, no emoji, AI as method not headline, Sie-Form on DE,
  "(haftungsbeschränkt)" spelled out. The ContactCTA props use the conditional
  register ("I'll get back to you within a day", "Ich melde mich innerhalb eines
  Tages").
- strip-list (§4.5) spot-grep on the two capability pages: clean (no KNE /
  Einsamkeit / Kompetenznetz / ISS / loneliness). Full `dist/` strip-list grep is the
  G3 release gate.

## For the orchestrator / later phases

- **F1** will do final nav/footer wiring + the full route audit. The Header nav
  "Leistungen"/"Services" link now resolves (no longer 404) because this page exists.
- **D4** rewrites the homepage hero + Selected-work order. The teaser I added is a
  separate additive section and does not conflict; D4 can leave it or relocate it.
- **G2** (a11y) should include both new pages in the Pa11y-CI run. Markup is
  landmark- + heading-correct and uses only existing tokens (contrast already
  validated for the design system), but the formal WCAG2AA pass is G2's gate.
- The capabilities page intentionally does NOT restate HRB/USt-IdNr. (only the
  location bridge); the verifiable-entity facts live on the Impressum (B2) and in the
  JSON-LD (A3/PC7).
