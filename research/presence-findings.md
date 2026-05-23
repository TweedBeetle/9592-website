# Presence-sculpting research findings — 9592.tech for structured-RFP evaluators

**Session:** 925ec790-260b-48a4-b22a-14acf200b78c
**Date:** 2026-05-23
**Scope:** Research-only artifact for the planning session. No site source was edited. See `VISION.md` for the decided scope this serves.

This file covers four areas: (1) German business-website legal requirements, (2) how DACH structured-buyer evaluators read a vendor website, (3) Astro 5 i18n best practice for this site, (4) anonymized reusable copy source + a strip-list. It ends with recommendations for the planning session.

---

## 0. Things found that change assumptions (read first)

Three findings overturn or sharpen assumptions in the brief. They are load-bearing for the planning session.

1. **Registergericht is Amtsgericht München, NOT Düsseldorf — the brief's Sitzverlegung assumption is not (yet) reflected in the register.**
   Source: the company's own Handelsregisterauszug, *Abruf vom 09.05.2026* (in `~/projects/bid-pipeline/tenders/27-kne-angebotslandkarte/submission/Handelsregisterauszug.pdf`). Verbatim header: *"Handelsregister B des Amtsgerichts München … HRB 287814"*. Register content as of that Abruf:
   - **Firma:** 9592 Solutions UG (haftungsbeschränkt)
   - **Sitz:** München
   - **Geschäftsanschrift:** Fährstraße 217, 40221 Düsseldorf
   - **Geschäftsführer:** Wilken, Christo Zion, München, *25.05.1999
   - **Registergericht / Registernummer:** Amtsgericht München, HRB 287814
   So the registered **seat (Sitz)** is still München and the **Registergericht** is still **Amtsgericht München**. Only the **Geschäftsanschrift** (the deliverable business address) is the Düsseldorf Fährstraße address. There are effectively three locations to reconcile: legal seat München, business address Düsseldorf, operative "based in Berlin" (outward convention).
   - **Consequence for the Impressum:** state `Registergericht: Amtsgericht München`, `HRB 287814`, and the `Geschäftsanschrift: Fährstraße 217, 40221 Düsseldorf`. Do **not** write "Handelsregister Düsseldorf."
   - **Consequence for existing copy:** the capability statement (`~/projects/bid-pipeline/notes/ungm/capability-statement-draft.md`) repeatedly says "Düsseldorf-registered" and "Handelsregister Düsseldorf HRB 287814." Per the register that is **incorrect** — it is Amtsgericht München. Flag for correction wherever it appears (UNGM profile, cover letters, the website).
   - **Caveat / recovery path:** registers change and the Abruf is 2026-05-09. If a Sitzverlegung to Düsseldorf was filed and is pending, the entry could flip. **Pull a fresh Handelsregisterauszug (or check handelsregister.de) immediately before the Impressum goes live** and use whatever the register says on that day. The authoritative answer *today* is München.

2. **The linked live demos still name the buyer ("Kompetenznetz Einsamkeit (KNE)") — this directly contradicts the "anonymize now" decision.**
   `https://kne-demo.9592.tech` (HTTP 200, reachable) currently shows the heading *"Angebotslandkarte gegen Einsamkeit"*, labels itself a *"Funktionaler Prototyp"*, and names *"Kompetenznetz Einsamkeit (KNE)"* plus *"~1,600 entries"* and *"publicly accessible KNE entries"*. The CMS demo (`https://kne-cms-demo.9592.tech`, also HTTP 200) is built around the same project. VISION says both "link the already-public live demos" AND "do not name the buyer." Those two instructions collide at the demo itself. This needs a decision (see Recommendations §A). It does not block the rest of this research.

3. **The site has two real, current legal/privacy gaps in code right now** (confirmed by reading `src/`):
   - Google Fonts are loaded **from the Google CDN** (`fonts.googleapis.com/css2?...` in `src/layouts/Layout.astro:49`), which transmits visitor IPs to Google — the exact LG München I exposure (§1.2 below).
   - **Mixpanel initialises on page load with no consent gate** (`src/layouts/Layout.astro:74-92`, hardcoded project token), and `@vercel/analytics` is a dependency. Both set/read device identifiers and therefore require prior opt-in consent under §25 TDDDG (§1.2 below). There is no cookie-consent banner in the layout.
   These are not theoretical: a procurement evaluator who opens devtools (some do) will see third-party calls firing before any consent. Fixing them is both a legal requirement and a credibility signal that the vendor practices the WCAG/DSGVO competence it sells.

---

## 1. German business-website legal requirements

### 1.1 Impressum per §5 DDG (for a UG haftungsbeschränkt)

Legal basis: **§ 5 Digitale-Dienste-Gesetz (DDG)**, in force since 14 May 2024 (it replaced § 5 TMG; the obligation itself is unchanged). A UG (haftungsbeschränkt) has the **same Impressum duties as a GmbH**. The Impressum must be reachable in one or two clicks from every page, clearly labelled (e.g. "Impressum"), and not hidden behind a contact form.

**Mandatory fields for 9592 Solutions UG (haftungsbeschränkt):**

| Field | §5 DDG basis | Value to publish |
|---|---|---|
| Full legal name **incl. Rechtsformzusatz** | §5(1) Nr.1 | `9592 Solutions UG (haftungsbeschränkt)` — the "(haftungsbeschränkt)" suffix is mandatory and must be spelled out; "UG" alone is non-compliant and misleads about limited liability. |
| Anschrift (full postal address) | §5(1) Nr.1 | `Fährstraße 217, 40221 Düsseldorf` (the registered Geschäftsanschrift). A P.O. box is not sufficient. |
| Vertretungsberechtigter / Geschäftsführer | §5(1) Nr.1 | `Geschäftsführer: Christo Wilken` (all managing directors must be named; here there is one). |
| Registergericht + Registernummer | §5(1) Nr.4 | `Registergericht: Amtsgericht München · HRB 287814` (see §0.1 — confirm fresh before publishing). |
| USt-IdNr. per §27a UStG | §5(1) Nr.6 | `USt-IdNr.: DE364316497` (canonical written form is "USt-IdNr.", not "USt.-ID"). |
| Contact: email **plus** a second means of fast electronic contact | §5(1) Nr.2 | Email is mandatory in every case: `christo@9592.tech`. §5(1) Nr.2 requires email **and at least one further means enabling fast electronic contact and direct communication.** Per EuGH C-298/07 a telephone number is not strictly required *if* an equally efficient alternative exists; a monitored contact form, or a phone number, satisfies the "second means." Recommendation below. |

**Notes / decisions:**
- **Second contact means:** cleanest options are (a) publish the mobile `+49 172 767 7643` (simplest, unambiguously compliant, but exposes a personal number), or (b) a monitored contact form/Web3Forms-backed contact route on the same domain plus the email. A contact form alone has been litigated as borderline; pairing email + form + a stated response expectation is the safe middle. Pick one in planning. The current site already has Web3Forms contact components, so the form path is low-effort.
- **Sitz vs Geschäftsanschrift vs Berlin:** the Impressum carries the legal facts (Geschäftsanschrift Düsseldorf, Sitz München via the Registergericht line). The narrative/about copy may say "operative Leitung Berlin / based in Berlin." To avoid looking contradictory, add one sentence on the about/contact page that states the relationship plainly, e.g. "Sitz der Gesellschaft: München (Amtsgericht München, HRB 287814). Geschäftsanschrift: Düsseldorf. Operativ geleitet aus Berlin." Do not let the hero say "Berlin" while the Impressum says "Düsseldorf" with no bridge.
- **DDG wording:** label the legal basis as DDG, not TMG; legacy "TMG"-generated Impressümer are stale but not unlawful — still, use current wording.
- **No "Aufsichtsbehörde / Kammer / berufsrechtliche Regelungen" fields apply** here (software dev is not a regulated profession; no Kammer-Zulassung). Skip those §5(1) Nr.5/Nr.7 fields; adding empty ones looks like a generated template.

Sources: [IHK München Merkblatt Pflichtangaben Impressum (Stand 05/2024)](https://www.ihk-muenchen.de/ihk/Merkbl%C3%A4tter-WettbewerbsR/Pflichtangaben-Internetimpressum_Stand05_2024.pdf); [IHK Impressumspflichten 2025 (PDF)](https://www.ihk.de/blueprint/servlet/resource/blob/5372588/d5288ae52241edc3b6ca6c16c5b36a66/impressumspflichten-2025-data.pdf); [eRecht24: E-Mail im Impressum](https://www.e-recht24.de/impressum/7641-impressumspflicht-e-mail.html); [eRecht24: Telefonnummer im Impressum](https://www.e-recht24.de/impressum/1023-impressum-telefonnummer.html); [damm-legal: EuGH C-298/07](https://www.damm-legal.de/eugh-keine-pflicht-zur-angabe-einer-telefonnummer-im-impressum-wenn-kontaktformular-vorhanden-ist).

### 1.2 Datenschutzerklärung — given the tools this site actually uses

Reading the source: the site loads **Google Fonts from the Google CDN**, runs **Mixpanel** (`mixpanel-browser`, init on page load), depends on **@vercel/analytics** (Vercel Web Analytics), and submits forms to **Web3Forms**. Each must be disclosed, and two of them have consent implications.

**Tool-by-tool disclosure obligations:**

| Tool | What it does on this site | Legal handling |
|---|---|---|
| **Google Fonts via CDN** (`fonts.googleapis.com` / `fonts.gstatic.com`) | Loads font CSS/files from Google servers; transmits the visitor's **IP address** to Google (a US transfer). | This is the **LG München I, Urteil 20.01.2022, Az. 3 O 17493/20** scenario: dynamic embedding of Google Fonts without consent was held to violate the DSGVO; the court awarded €100 Schadensersatz and the ruling triggered a mass-Abmahnung wave in 2022. **Recommendation: self-host the fonts** (e.g. `@fontsource/inter` + `@fontsource/jetbrains-mono`, or download the WOFF2 and serve from `/public`). Self-hosting removes the third-party IP transfer entirely, so no consent and no font-specific Datenschutz clause are needed. This is the single highest-value, lowest-risk legal fix and it also improves performance (no extra preconnect/round-trip). |
| **Mixpanel** (`mixpanel-browser`) | Currently inits on page load and sets/reads device storage + tracks events (CTA clicks, footnotes). Sends data to Mixpanel (EU or US endpoint depending on config). | Sets/reads identifiers on the device → **§25 TDDDG requires prior opt-in consent** (TDDDG = the renamed/relocated successor to §25 TTDSG since 2024). It also processes personal data → needs a DSGVO Art. 6(1)(a) consent legal basis + a Datenschutz section (purpose, recipient, retention, US-transfer note unless EU residency is configured). **As-is (fires before consent) it is non-compliant.** Options for planning: (a) gate Mixpanel behind a consent banner; (b) drop Mixpanel from the public marketing site and keep analytics minimal; (c) switch to a cookieless/consent-free analytic. See §1.2-note. |
| **Vercel Web Analytics** (`@vercel/analytics`) | First-party, **cookieless by default**; Vercel states it does not use cookies and hashes identifiers per-day without cross-site tracking. | Vercel positions it as privacy-friendly/consent-free, but the conservative German reading is that any reading of device/connection data for analytics can fall under §25 TDDDG unless strictly "unbedingt erforderlich." Lower risk than Mixpanel. **Recommendation:** disclose it in the Datenschutzerklärung as first-party, cookieless analytics with the legal basis (Art. 6(1)(f) berechtigtes Interesse is defensible for the cookieless variant); revisit whether it needs the consent banner alongside Mixpanel. If a consent banner exists for Mixpanel anyway, gate both for cleanliness. |
| **Web3Forms** | Form submissions (name/email/message) are POSTed to `api.web3forms.com` (third-party processor, US/EU). | Disclose as a Auftragsverarbeitung-style processor for contact handling; legal basis Art. 6(1)(b) (pre-contractual) / (a). Name the processor, the data categories, and that submissions are stored ~30 days. Ideally have an AVV with Web3Forms on file. |

**§1.2-note — the consent-banner question is a real fork, decide it in planning:** the cleanest *and* most on-thesis option is to **minimise** rather than banner-wrap. A marketing/portfolio site does not need Mixpanel-grade behavioural analytics. If the planning session keeps only Vercel's cookieless analytics and self-hosted fonts, the site needs **no consent banner at all**, the Datenschutzerklärung stays short and honest, and there is nothing for an evaluator to catch firing pre-consent. If Mixpanel stays, a compliant consent gate (opt-in, no pre-ticked boxes, reject-as-easy-as-accept, nothing fires before "accept") is mandatory. Recommendation: **drop Mixpanel from the public site, self-host fonts, keep Vercel cookieless analytics, no banner.** That is the lowest-surface, highest-credibility configuration and aligns with the "we practice what we sell" signal. (Reversible: Mixpanel can return behind a banner later if there's a real measurement need.)

**Recommended Datenschutzerklärung structure (pragmatic, accurate):**
1. Verantwortlicher (controller) — name, Geschäftsanschrift, email (mirrors Impressum).
2. (If applicable) Datenschutzbeauftragter — **not required** for a solo UG below the §38 BDSG thresholds; state "nicht erforderlich" or omit. Don't invent a DPO.
3. Allgemeines zur Datenverarbeitung beim Websitebesuch — server logs / IP via the host (Vercel), retention, legal basis Art. 6(1)(f).
4. Hosting (Vercel) + CDN/Proxy (Cloudflare) — named as processors, US-transfer note with the EU-US Data Privacy Framework basis where applicable.
5. Cookies / §25 TDDDG section — only if anything non-essential is used; if minimised per §1.2-note, state "wir setzen keine nicht notwendigen Cookies / kein Tracking ein."
6. Reichweitenmessung (Vercel Web Analytics) — cookieless, purpose, legal basis.
7. Kontaktaufnahme / Formulare (Web3Forms) — processor, data categories, retention, legal basis.
8. (Only if kept) Mixpanel — purpose, recipient, consent basis, US transfer, opt-out.
9. Schriftarten — only if NOT self-hosted; if self-hosted, omit (and that omission is the point).
10. Betroffenenrechte (Auskunft, Löschung, Widerspruch, Beschwerde bei der Aufsichtsbehörde), plus the right to withdraw consent.

A reputable generator (eRecht24, Dr. Schwenke, IT-Recht-Kanzlei) seeded with exactly the four tools above produces a defensible draft; the value-add here is that the tool list is now precise, so the generated policy won't over- or under-disclose.

Sources: [Kanzlei Plutte: LG München Google Fonts](https://www.ra-plutte.de/lg-muenchen-dynamische-einbindung-google-web-fonts-ist-dsgvo/); [IT-Recht-Kanzlei: Webfonts Einwilligung / Schadensersatz](https://www.it-recht-kanzlei.de/lg-muenchen-I-webfonts-einwilligung-schadensersatz.html); [GDPRhub: LG München 3 O 17493/20](https://gdprhub.eu/index.php?title=LG_M%C3%BCnchen_-_3_O_17493/20); [easyRechtssicher: Google Fonts DSGVO 2025](https://easyrechtssicher.de/google-fonts-dsgvo/).

### 1.3 BFSG (Barrierefreiheitsstärkungsgesetz) — does it legally bind this site?

**In force since 28 June 2025.** BFSG is the German transposition of the European Accessibility Act. It binds **products** and certain **consumer-facing digital services** (notably e-commerce / "Dienstleistungen im elektronischen Geschäftsverkehr").

**Honest legal answer for a 9592.tech marketing/portfolio site:**
- **Kleinstunternehmen exemption (§3 Abs. 3 BFSG):** providers of *services* with **< 10 employees AND ≤ €2 million annual turnover** are **exempt** from the BFSG service obligations. 9592 is a single-principal UG → it clearly qualifies as a Kleinstunternehmen on the services side. (Note: the exemption does **not** apply to *product* manufacturers/importers under product-safety law — irrelevant here, 9592 ships no physical products.)
- **B2B vs consumer:** BFSG targets services aimed at **consumers (Verbraucher)**. A pure B2B marketing/portfolio site that does not sell to or transact with consumers is **outside the core scope**. The trigger is a service "for consumers," especially e-commerce with a transaction (cart, checkout, contract conclusion online). A site that only describes services and offers a contact form is not e-commerce in the §-relevant sense.
- **Net:** **the BFSG does not legally compel 9592.tech to be accessible** — both the Kleinstunternehmen exemption and the B2B/non-e-commerce character independently put it out of mandatory scope.

**But build it accessible anyway — it is directly on-thesis and a credibility signal:**
- The bid-pipeline thesis sells WCAG/BITV competence (the demonstrators' whole point is WCAG 2.1 AA + BIK-BITV self-assessment). A vendor that bids accessibility work on an inaccessible own site undercuts the bid the moment an evaluator notices. Accessibility here is a **proof-of-competence artifact**, not a compliance chore.
- It is cheap on a static Astro site and fully reversible/no downside.

**Concrete WCAG 2.1 AA things to get right on a static Astro site (the high-yield set):**
- **Semantic landmarks & headings:** one `<h1>` per page, logical heading order, `<header>/<nav>/<main>/<footer>`, a "skip to content" link.
- **`<html lang>` correct per locale** (DE vs EN) — also an i18n requirement (see §3); screen readers switch pronunciation on it.
- **Colour contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text/UI** — the dark theme (`#0a0a0a` bg, `#fafafa`/`#a1a1a1` text) must be checked: `#a1a1a1` on `#0a0a0a` is ~7:1 (fine for body), but verify the accent `#3b82f6` on dark for links/buttons (it passes for large, check small text) and any muted/secondary states.
- **Visible focus indicators** on all interactive elements (don't strip `:focus-visible`); full keyboard operability (the language switcher, nav, mobile menu, form, any blog Mermaid toggles).
- **Alt text** on meaningful images; empty `alt=""` on decorative ones; Mermaid diagrams need a text equivalent (caption/summary) since SVG diagrams are not reliably read.
- **Forms:** programmatic `<label>` for every field, `aria-describedby` for hints/errors, error messages not by colour alone, sufficient target size (≥ 24×24 CSS px is the WCAG 2.1 AA minimum; the demos use the stricter 44×44 from 2.5.5 AAA — match that on mobile).
- **Respect `prefers-reduced-motion`** for the (subtle) transitions the design system allows.
- **Don't trap focus** in the mobile menu / any overlays; Esc closes.
- **Verification:** run **Pa11y-CI** and **Lighthouse a11y** (the demos already use Pa11y-CI + a Lighthouse mobile ≥ 90 gate; reuse that toolchain on the main site for consistency and so the site's own accessibility is demonstrable). Optionally publish a short, honest "Erklärung zur Barrierefreiheit"-style note — not legally required, but a strong signal; do not overclaim full conformance, state the standard targeted and the testing done.

Sources: [SRD Rechtsanwälte: BFSG ab 28.06.2025](https://www.srd-rechtsanwaelte.de/blog/barrierefreiheitsstaerkungsgesetz-bfsg-neue-pflichten-fuer-unternehmen-ab-28-juni-2025); [Bundesfachstelle Barrierefreiheit: BFSG FAQ](https://www.bundesfachstelle-barrierefreiheit.de/DE/Fachwissen/Produkte-und-Dienstleistungen/Barrierefreiheitsstaerkungsgesetz/FAQ/faq_node); [Wettbewerbszentrale: BFSG ab 28.06.2025](https://www.wettbewerbszentrale.de/barrierefreiheitsstaerkungsgesetz-gilt-ab-28-juni-2025-was-unternehmen-jetzt-wissen-muessen/); [IHK Stuttgart: BFSG](https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/it-recht/barrierefreie-webseiten-6200594).

---

## 2. How German public-sector / DACH-Mittelstand evaluators read a vendor website

Mined from: `iss-kne-buyer-culture-chatgpt-2026-05-09.md`, `capability-statement-draft.md`, `private-mittelstand-project-shapes.md`, `private-outreach-tactics-validated.md`, plus the submitted Konzept. Two distinct-but-overlapping reader types: the **public-sector procurement evaluator** (UVgO/VgV, scoring against a matrix, audit-defensible best-value mindset) and the **DACH-Mittelstand decision-maker** (owner-led, burned by KI-Agentur pitches, wants concrete pain solved). The site must read credibly to both — and, per VISION, still to an existing creator/SMB client.

### 2.1 What the site MUST signal

**Baseline competence (absence quietly sinks credibility — these are gatekeepers, not differentiators):**
- A **proper Impressum and Datenschutzerklärung** (§1). Their absence on a German vendor site reads as amateur or fly-by-night to a procurement reader; their presence is assumed, not rewarded.
- **No broken cookie banner, no third-party calls firing pre-consent, custom domain, plausibly DE/EU-hosted.** The private-Mittelstand research is explicit: a tailored demo "must not betray itself: working Impressum, working Datenschutzerklärung, no broken cookie-banner, custom domain, DE-located host." A vibe-coded smell ("riecht stark nach Claude") is a documented credibility-killer. The same applies to the main site.
- **Accessibility** (§1.3) — for this vendor specifically, because it sells the competence.
- A **verifiable legal entity**: VAT-ID + HRB on the site so a buyer can confirm the company exists in one click. The capability statement already does this deliberately; mirror it on the site (with the corrected Amtsgericht München / HRB).

**Capability & trust signals (the differentiators):**
- **Working software over slide decks.** The strongest, research-validated edge: a deployed, functioning demonstrator seeded with the buyer's domain language beats mockups/capability statements. The two live demos are the embodiment. Frame them as **Arbeitsproben / Eigenreferenzen / zweckgebundene Demonstratoren**, not customer projects (this honesty is itself a trust signal and matches how the Konzept framed them).
- **Tailored delivery for structured buyers** — the site should make it obvious that 9592 builds custom working systems for procurement/Mittelstand contexts, in their language.
- **Process credibility:** evidence of a real delivery method (discovery → prototype → Pflichtenheft → test/Abnahme → handover/Einweisung, with migration treated as a dedicated phase). The Konzept demonstrates exactly this; the case studies should surface the *method*, not just screenshots.
- **Honest scope / "ehrlich mitdenken."** The single most resonant counter-positioning in the Mittelstand corpus: "Es fehlt jemand, der nicht verkaufen will, sondern einfach mal ehrlich mitdenkt, ob das Ganze überhaupt Sinn ergibt." The site's voice (no superlatives, honest about scope, demonstrator-not-product) is on exactly this axis. Keep it.
- **GDPR/DSGVO posture as a feature** — for public-sector and data-sensitive buyers, "EU/DE-hosted, no US-cloud dependency where avoidable, AVV with sub-processors" is a real differentiator. The Konzept leans on this (OSM tiles instead of Google, EU geocoding, no US-cloud binding). Surface a short data-handling stance.
- **Bilingual DE+EN done properly** (§3) — for a German public buyer, German-first competence (correct Behördendeutsch register, "haftungsbeschränkt" spelled out, "USt-IdNr." canonical) signals "this vendor operates in our world."
- **Direct contracting, no intermediaries** — procurement readers value a clean single legal counterparty (the capability statement's "Direktvertrag, keine Mittler" line).

**Credentials worth displaying if/when obtained (parked, not required this iteration):** BITMi membership + "Software Made in Germany" seal lifts evaluator credibility (research: "joining BITMi makes more sense as a bid-credential than as a customer channel"). UNGM registration number. Berufshaftpflicht (a Nachweis already exists in the submission folder) — signalling "insured" reassures procurement. None are blockers; note as upgrade path.

### 2.2 What the site must AVOID (anti-signals)

- **"KI-Agentur" / "wir machen KI-Lösungen" / "irgendwas mit KI."** Documented anti-keywords in DACH discourse 2025-26: "KI-Agentur" is now a negative marker among DACH devs and propagates to decision-makers who've sat through 5+ KI-Agentur pitches; "Jeder Depp macht 'irgendwas mit KI'" is a verbatim buyer quote. **Do not lead with AI as the product.** Lead with concrete delivery and the working software; AI is the *method* (orchestration that lets a small shop ship like a team), mentioned as enabler, not headline.
- **Superlatives / marketing puffery / hype numbers.** Procurement readers in a Zuwendung context are audit-minded and skeptical of padded claims; the Mittelstand corpus is "brutal about Selbstdarsteller" and US-style hook-bait. The site's existing voice rules (no "amazing/cutting-edge", no em dashes, short sentences) are correct — enforce them in both languages.
- **Overclaiming the demos as production products or as client work.** They are demonstrators; calling them "our product for X" or implying a paying client invites a credibility hit and (for the KNE case) a confidentiality problem. Use Arbeitsprobe framing.
- **Naming the buyer / tender** (per VISION, until award). See the strip-list (§4.5).
- **A pure-Beratung / "Digital Transformation" abstraction.** Every documented winning Mittelstand engagement opens with concrete pain, not abstract "Digitalisierung." Avoid consultant-deck language.
- **Fake team / named-associate fictions / "wir sind ein Team von Experten."** The honest single-principal + AI-orchestration framing is more defensible than implied headcount; procurement filters dislike Schein-Personal-Profile.
- **A contradictory location story** (Berlin hero vs Düsseldorf Impressum vs München Sitz with no bridge) — reads as careless. Reconcile explicitly (§1.1).

---

## 3. Astro 5 i18n — recommended bilingual DE+EN approach for THIS site

Verified against current Astro docs via Context7 (`/websites/astro_build_en`, the i18n routing guide + recipe + `astro:i18n` module reference). Astro 5 has **built-in i18n routing** — no plugin needed, which satisfies the VISION "no new heavy dependencies" constraint.

### 3.1 Recommended configuration

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: false,   // see rationale
      // redirectToDefaultLocale: true (default) — '/' serves the default locale
    },
  },
});
```

**Recommended choices, with rationale:**

1. **`defaultLocale: 'de'`.** The primary target reader is a German public-sector / Mittelstand evaluator. German-first is the credibility-correct default; an evaluator landing on `/` should get German. (The existing site is English-led — this is part of the deliberate, reversible re-sculpt. EN remains a first-class locale, not an afterthought.)

2. **`prefixDefaultLocale: false`** (recommended). German lives at clean unprefixed paths (`/`, `/leistungen`, `/arbeiten`, `/blog/...`); English is explicitly prefixed (`/en/`, `/en/work`, `/en/blog/...`).
   - **Why:** the highest-value reader gets the shortest, cleanest URLs; it preserves the existing German-as-canonical SEO surface; and it's the lower-risk migration (existing `/` keeps working). The cost is asymmetry (DE has no `/de/` prefix, EN does) — acceptable for a 2-locale site.
   - **Alternative considered — `prefixDefaultLocale: true`** (everything prefixed: `/de/...` and `/en/...`, with `/` redirecting). Cleaner symmetry and arguably easier to reason about for translated content pairing, but it breaks/redirects every existing URL and pushes the primary reader through a redirect. **Not recommended** unless the planning session wants strict symmetry; if chosen, set `redirectToDefaultLocale: true` so bare `/` resolves.

3. **URL structure recommendation:** `9592.tech/` (DE) and `9592.tech/en/` (EN). Mirror the page set under both. Add `<link rel="alternate" hreflang="de|en|x-default">` tags in the layout head for each translated pair (SEO + signals to the evaluator's search surface that both languages exist).

### 3.2 Translated MDX blog posts — content-collection strategy

Two viable patterns; **recommend the per-locale-path-within-one-collection pattern** (matches Astro's own i18n recipe and keeps a single schema/CTA-validation surface).

**Recommended: one `blog` collection, locale as the first path segment of the entry id.**
```
src/content/blog/
  de/
    accessible-procurement-demo.mdx
  en/
    accessible-procurement-demo.mdx
```
- Keep the existing `src/content/config.ts` Zod schema (incl. the mandatory `cta` block) — it applies to all entries regardless of locale, so the "build fails without CTA" guarantee is preserved in both languages.
- Add an optional frontmatter field to pair translations and detect missing ones, e.g. `translationKey: "accessible-procurement-demo"` (same value in the de/ and en/ files). This lets the language switcher jump to the equivalent post and lets a build check warn on unpaired posts.
- Generate routes in `src/pages/[...]/blog/[...slug].astro` (or locale-scoped page files) via `getStaticPaths`, splitting `lang` off the entry id exactly as the Astro recipe shows:
  ```astro
  export async function getStaticPaths() {
    const posts = await getCollection('blog');
    return posts.map((post) => {
      const [lang, ...slug] = post.id.split('/');
      return { params: { lang, slug: slug.join('/') }, props: post };
    });
  }
  ```
- Date/number formatting: use the `lang` to localise (`date.toLocaleString(lang)`).

**Alternative (not recommended here): a `lang` frontmatter field on flat files + manual slug pairing.** Simpler directory, but you lose the natural URL derivation, and pairing/missing-translation detection becomes manual. Only worth it if posts are rarely translated; given VISION commits to translating posts, the per-locale-path pattern is cleaner.

**Pragmatic content note:** translating every post is the accepted higher maintenance burden (VISION §3). A reasonable default: translate the *evergreen/credibility* posts (the anonymized procurement-demo writeup, capability-style posts) into both languages; allow some consumer-AI/older posts to remain single-language with a small "nur auf Englisch verfügbar / only in English" affordance rather than blocking the build. Decide the policy in planning; the schema can make `translationKey` optional so single-language posts are legal.

### 3.3 Language-switcher component that preserves the current path

Use the `astro:i18n` helpers; **derive the equivalent path rather than hard-linking to home** (a switcher that always returns to `/` is a known UX failure).

- For **static pages**, compute the counterpart URL with `getRelativeLocaleUrl(targetLocale, currentPathWithoutLocalePrefix)`. Helper functions available: `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`, `getLocaleByPath`, plus you can read the current locale from `Astro.currentLocale`.
- A small `src/i18n/utils.ts` with `getLangFromUrl(url)` and a `stripLocale(pathname)` helper keeps the switcher logic in one place (the Astro recipe uses exactly this shape).
- For **blog posts**, use `translationKey` to find the sibling entry's slug in the target locale and link to that; if no translation exists, either disable the switch for that page or point it at the localized blog index (don't 404).
- Switcher markup: two links/buttons "DE" / "EN" (or "Deutsch" / "English"), the active one marked `aria-current="true"`, both keyboard-focusable with visible focus (a11y, §1.3).

### 3.4 `<html lang>` correctness

Set `<html lang={lang}>` dynamically in the base layout from the current locale (via `getLangFromUrl(Astro.url)` or `Astro.currentLocale`), not a hardcoded `lang="en"`. This is both an Astro i18n recipe recommendation and a WCAG requirement (screen-reader pronunciation). For mid-page language shifts (e.g. a German legal term inside an English page), wrap with `lang="de"` on that element — minor, but the kind of detail that signals competence.

---

## 4. Anonymized reusable copy source

All copy below is **source material for the content session**, not final site copy. It is anonymized per the VISION decision and the strip-list (§4.5). The buyer is framed only as **"a national counseling/advisory network" / "ein bundesweites Beratungsnetzwerk."** Two registers are given where useful: **EN** (international/creator-SMB readers, EN locale) and **DE** (procurement/Mittelstand register, Sie-Form, sachlich). The factual basis is the submitted Konzept (offer-map + editorial-CMS demonstrators) and the capability statement.

### 4.1 Case study — the offer-map demonstrator (`/work` page source)

**Working title (EN):** "An accessible, self-updating offer map for a national counseling network"
**Arbeitstitel (DE):** "Eine barrierearme, selbstaktualisierende Angebotslandkarte für ein bundesweites Beratungsnetzwerk"

**Framing label (both locales):** Demonstrator / Arbeitsprobe — a deployed, testable working prototype built to evidence a delivery approach. Not a customer project; not a production product.

**Problem (EN):**
> A national counseling network published an interactive map of around 1,600 local and nationwide support offers. Keeping it current depended on a manual pipeline: people submitted an online form, the team reviewed each entry by hand, and results were transferred into a spreadsheet that fed the map. At that volume the chain stopped scaling — every update cost editorial time the team could not spare, and the public map had been carrying a visible "updates are currently delayed" notice.

**Problem (DE):**
> Ein bundesweites Beratungsnetzwerk betreibt eine interaktive Karte mit rund 1.600 regionalen und bundesweiten Unterstützungsangeboten. Die Aktualität hing an einer manuellen Strecke: Eintragende füllten ein Formular aus, das Team prüfte jeden Eintrag von Hand, und das Ergebnis wurde in eine Excel-Datei überführt, die die Karte speiste. Bei dieser Menge skalierte die Kette nicht mehr; jede Aktualisierung kostete redaktionelle Zeit, und auf der öffentlichen Karte stand zeitweise der sichtbare Hinweis, dass sich Aktualisierungen verzögern.

**Approach (EN, bulleted source):**
- Rebuilt the data path: replaced the spreadsheet step with a documented relational schema, automated geocoding, and a submission form where contributors create and edit records directly.
- Made the map accessible and mobile-first: an external single-page app embedded via iframe, map rendered on OpenStreetMap tiles (no US-cloud map dependency), client-side filtering by category, sub-category, topic and radius, plus a dedicated surface for nationwide offers that have no single address (phone/online services) instead of pinning them to a misleading map centroid.
- Targeted WCAG 2.1 AA: keyboard-operable, labelled filter controls; the result list as an equal-rank alternative to the map for screen-reader users; verification via automated accessibility checks and a mobile performance gate.

**Approach (DE, bulleted source):**
- Datenpfad neu gebaut: An die Stelle der Excel-Strecke trat ein dokumentiertes relationales Schema, automatisiertes Geocoding und eine Eingabemaske, in der Eintragende Datensätze direkt anlegen und ändern.
- Karte zugänglich und mobile-first: eine externe Single-Page-Anwendung, per iframe eingebunden, Kartendarstellung auf OpenStreetMap-Kacheln (keine US-Cloud-Bindung), clientseitige Filterung nach Kategorie, Unterkategorie, Thema und Umkreis, plus eine eigene Fläche für bundesweite Angebote ohne Einzeladresse (Telefon-/Online-Angebote), statt sie irreführend auf einen Karten-Mittelpunkt zu setzen.
- Orientierung an WCAG 2.1 AA: per Tastatur bedienbare, beschriftete Filter; die Ergebnisliste als gleichwertiger Zugang zur Karte für Screenreader-Nutzende; Nachweis über automatisierte Barrierefreiheits-Prüfungen und ein Mobile-Performance-Gate.

**What it demonstrates (EN):**
> The demonstrator shows the public-facing half of the system end to end: data model, search-and-filter UX, map rendering, iframe embedding, and the nationwide-offers surface — directly testable in the browser. [Link to live demo.]

**Was es zeigt (DE):**
> Der Demonstrator bildet die öffentliche Hälfte des Systems vollständig ab: Datenmodell, Such- und Filter-UX, Kartendarstellung, iframe-Einbettung und die Bundesweit-Fläche — im Browser unmittelbar testbar. [Link zur Live-Demo.]

### 4.2 Case study — the editorial-CMS demonstrator (`/work` page source)

**Working title (EN):** "A two-stage editorial workflow that keeps a public dataset current without growing the team's workload"
**Arbeitstitel (DE):** "Ein zweistufiger Redaktions-Workflow, der einen öffentlichen Datenbestand aktuell hält, ohne den Redaktionsaufwand wachsen zu lassen"

**Problem (EN):**
> The same network needed contributors to maintain their own entries without the editorial team becoming the bottleneck — and needed every change to stay reviewable and auditable.

**Problem (DE):**
> Dasselbe Netzwerk wollte, dass Eintragende ihre eigenen Angebote pflegen, ohne dass die Redaktion zum Engpass wird — und dass jede Änderung nachvollziehbar und prüfbar bleibt.

**Approach (EN, bulleted source):**
- A self-service account for contributors (passwordless magic-link login — low friction for volunteer/part-time submitters, no elevated data-protection risk because only publicly-intended offer data is edited).
- A five-state lifecycle for every entry (draft → submitted → published → change-requested → archived) implementing a two-stage review: contributors submit; the editorial team reviews and publishes; published entries can only be changed via a reviewed change-request, with a before/after diff.
- An editorial back-office with an intake queue, a change queue with diff view, full-text search and bulk actions over published entries, and master-data management.
- An automated reminder pipeline: a periodic check flags entries not confirmed in six months and runs a three-step escalation (token-signed one-click "still current / submit change / withdraw" links, no login required), so currency is maintained without editorial initiative.
- A complete audit log — every action timestamped with account and operation.

**Approach (DE, bulleted source):**
- Self-Service-Konto für Eintragende (passwortloses Magic-Link-Login — niedrige Hürde für ehren- oder nebenamtliche Anbieter:innen, kein erhöhter Schutzbedarf, da nur öffentlich vorgesehene Angebotsdaten bearbeitet werden).
- Fünf definierte Zustände je Angebot (Entwurf → Eingereicht → Veröffentlicht → Änderungswunsch → Archiviert) als zweistufige Freigabe: Eintragende reichen ein, die Redaktion prüft und veröffentlicht; veröffentlichte Einträge ändern sich nur über einen geprüften Änderungswunsch mit Vorher/Nachher-Diff.
- Ein Redaktions-Backoffice mit Eingangs-Queue, Änderungs-Queue mit Diff-Anzeige, Volltextsuche und Bulk-Aktionen über veröffentlichte Angebote sowie Stammdaten-Pflege.
- Eine automatisierte Reminder-Pipeline: ein periodischer Lauf markiert seit sechs Monaten unbestätigte Angebote und startet eine dreistufige Eskalation (kryptografisch signierte Ein-Klick-Links "weiterhin aktuell / Änderung einreichen / zurückziehen", ohne Login), sodass die Aktualität ohne Initiative der Redaktion erhalten bleibt.
- Ein vollständiges Audit-Log — jede Aktion mit Zeitstempel, Konto und Vorgang.

**What it demonstrates (EN):**
> The demonstrator is fully interactive: a clearly-labelled demo persona switch moves between the public view, a contributor, and an editor. You can submit an offer, see it appear in the editor's intake queue, publish it, submit a change request and resolve it via the diff view, and use a "fast-forward six months" control to trigger the full reminder escalation and inspect the generated reminder emails in a preview outbox. Every action is written to the audit log. [Link to live demo.]

**Was es zeigt (DE):**
> Der Demonstrator ist vollständig interaktiv: eine deutlich gekennzeichnete Demo-Persona-Auswahl wechselt zwischen öffentlicher Ansicht, Eintragenden und Redaktion. Man kann ein Angebot einreichen, es im Eingangs-Queue der Redaktion erscheinen sehen, es veröffentlichen, einen Änderungswunsch einreichen und ihn über die Diff-Anzeige auflösen, sowie über eine "6 Monate vorspulen"-Schaltfläche die vollständige Reminder-Eskalation auslösen und die erzeugten Reminder-Mails in einem Vorschau-Postausgang prüfen. Jede Aktion landet im Audit-Log. [Link zur Live-Demo.]

### 4.3 Blog writeup — "Building a tailored, accessible procurement demo" (anonymized source)

**Working title (EN):** "What it takes to ship a working demo instead of a slide deck"
**Arbeitstitel (DE):** "Was es heißt, einen lauffähigen Demonstrator statt eines Foliensatzes abzugeben"

**Angle / thesis (the post's spine):** For a structured-buyer software requirement, a deployed working prototype seeded with the domain's real language and realistic workflows is a better artifact than mockups or a capability statement — it lets both sides converge on what the deliverable should be, and it lets the buyer verify claims before any contract. Cost-of-implementation has fallen far enough that a one-to-two-week prototype cycle is routine, not exceptional, for a small AI-orchestrated shop.

**Source beats to cover (anonymized, no buyer/tender specifics):**
- The trigger pattern: a public dataset whose manual update pipeline had stopped scaling, with a visible "updates delayed" symptom — a concrete, recognisable pain, not abstract "digitalization."
- Reading three requirements (better usability, mobile, accessibility) as one coupled problem rather than three features.
- Why two demonstrators, not one: a public-facing map demo and an editorial-workflow demo, each a directly-testable Arbeitsprobe for a distinct half of the system.
- The accessibility discipline: WCAG 2.1 AA as the orientation frame, a recognised national self-assessment method (BIK-BITV) as the main evidence, automated checks (Pa11y-CI) and a mobile performance gate as acceptance criteria — and why building the demo accessibly is itself the proof of competence.
- The data-handling stance: OpenStreetMap tiles and an EU geocoder instead of a US-cloud map dependency; what that buys a public-sector buyer.
- The honest framing: the demos are labelled Arbeitsproben/Eigenreferenzen, not customer work; the buyer can verify every claim before awarding.
- Closing: the demo is not the deliverable, it's the instrument that lets both sides agree on what the deliverable should be.

**Voice constraints (apply when drafting):** no superlatives, no em dashes (use colons or split sentences), short paragraphs, active voice, honest about scope, no emoji. AI is the *enabling method* (orchestration → small-team throughput), never the headline. Must carry the mandatory `cta` frontmatter block (build fails otherwise — see project CLAUDE.md). Run `/voice-playbook` before finalising any public copy.

### 4.4 Procurement-facing capabilities section (source)

Adapted from the capability statement, anonymized and corrected (Amtsgericht München / HRB 287814, not "Düsseldorf").

**EN source:**
> 9592 Solutions UG (haftungsbeschränkt) is a single-principal software practice that uses AI orchestration to deliver custom working software at the throughput of a small team. Practice areas: custom application development across web and iOS, internal tools, data pipelines, and integration work. A typical engagement starts with a deployed, functioning prototype of the requested system — seeded with the buyer's domain language, sample data, and realistic workflows — rather than slide decks or capability statements alone. The prototype is the instrument for agreeing on the specification, not the deliverable. Direct contracting with the buying entity, no intermediaries. Delivered remotely, in German or English. We design for accessibility (WCAG 2.1 AA orientation, recognised self-assessment methods) and for EU data-handling (EU/DE hosting, processor agreements with sub-processors, no US-cloud dependency where avoidable). What we do not do: training and workshop delivery, staff augmentation in someone else's process, large-team integration projects with named-associate fictions, hardware procurement.

**DE source (procurement register, Sie-Form):**
> Die 9592 Solutions UG (haftungsbeschränkt) ist eine Einzel-Prinzipal-Softwarepraxis, die AI-Orchestrierung nutzt, um individuelle, lauffähige Software mit dem Durchsatz eines kleinen Teams zu liefern. Tätigkeitsfelder: individuelle Anwendungsentwicklung für Web und iOS, interne Werkzeuge, Datenpipelines und Integrationsarbeit. Ein typischer Auftrag beginnt mit einem lauffähig bereitgestellten Prototyp des angefragten Systems — befüllt mit Ihrer Fachsprache, Beispieldaten und realistischen Arbeitsabläufen — statt mit Foliensätzen oder reinen Eignungsdarstellungen. Der Prototyp ist das Instrument, um sich auf die Spezifikation zu verständigen, nicht die Leistung selbst. Direktvertrag mit dem Auftraggeber, keine Mittler. Leistungserbringung remote, in deutscher oder englischer Sprache. Wir entwickeln barrierearm (Orientierung an WCAG 2.1 AA, anerkannte Selbstbewertungsverfahren) und EU-datenschutzkonform (EU/DE-Hosting, Auftragsverarbeitungs-Verträge mit Sub-Prozessoren, keine US-Cloud-Bindung wo vermeidbar). Was wir nicht anbieten: Schulungen und Workshops, Personal-Augmentation in fremden Prozessen, Großteam-Integrationsprojekte mit Schein-Personal-Profilen, Hardware-Beschaffung.

**Register notes (carry into drafting):** "haftungsbeschränkt" always spelled out; "USt-IdNr." not "USt.-ID"; "AI-Orchestrierung" reads better than "KI-Orchestrierung" in DE B2B but swap to "KI-gestützte Orchestrierung" if the planning session wants strict Behördendeutsch; never lead with "KI-Agentur" or "KI-Lösungen" (anti-keywords, §2.2).

### 4.5 STRIP-LIST — strings/facts that must NEVER appear publicly (until/unless award)

These come from the Konzept, Angebot, and buyer-culture files. **Hard rule: none of the following may appear anywhere on the public site, in blog posts, in case studies, in alt text, in meta tags, in committed source comments, or in linked artifacts.**

**Buyer / organisation identity:**
- `Kompetenznetz Einsamkeit`, `KNE`
- `Institut für Sozialarbeit und Sozialpädagogik`, `ISS`, `ISS e.V.`
- `Allianz gegen Einsamkeit`
- `BMBFSFJ` (the funding ministry), `Karin Prien` (the minister), `Bundesministerin`
- `kompetenznetz-einsamkeit.de` and any subdomain/path of it (`/angebotslandkarte`)
- `landkarte@kompetenznetz-einsamkeit.de` (the project mailbox)
- "Einsamkeit" / "loneliness" as the buyer's domain — generalise to "a national counseling/advisory network" / "ein bundesweites Beratungsnetzwerk." (Note: the offer map's user-facing title is "Angebotslandkarte gegen Einsamkeit" — do not reproduce it.)

**Commercial / tender specifics:**
- The price and any pricing band: `€19.8k`, `€19,800`, `~17.5% under cap`, the `€24k` cap, any netto figure, "Preisplausibilität" numbers, optional-position (OPT/§11) pricing.
- `Tender 27`, `Tender-27`, `27-kne-angebotslandkarte`, "Vergabe Nr." / any procedure number.
- Frist / deadline dates, submission dates, the `07.05.2026` Ausschreibungsstand, award status.
- Any "we bid for X" / "we won/submitted to X" narration. The demos are framed as Arbeitsproben, not a bid.
- Bieterfragen references (e.g. "Bieterfrage 9/10/26"), Pflichtenheft references, "Bewertungsmatrix Qualität-(a)…/Plan-(i)…".

**Buyer's incumbent stack / internal details (from the Konzept's Randbedingungen):**
- `WordPress` + `Brooklyn`-Theme + `WP Google Maps Pro/Gold` (Codecabin) as *the buyer's* setup, `IONOS`-Server, `Brevo`/`Sendinblue`, `Matomo`, the buyer's `~1,600` entries tied to the named org. (The *techniques* — iframe embedding, OSM tiles, five-state workflow — are fine to describe generically; the buyer's incumbent inventory is not.)
- The specific demo subdomains are public and reachable, but they themselves currently name the buyer — see Recommendation §A before linking them as "anonymized."

**Ambiguous (default to strip, revisit on award):**
- The exact figure "~1,600 offers" is buyer-identifying in combination with the domain; the case study uses "around 1,600" generically, which is acceptable *only* because the buyer name is stripped. If in doubt, say "well over a thousand entries."
- "BIK-BITV-Selbstbewertung" is a generic German accessibility method, safe to name as a method; it is not buyer-identifying.

---

## 5. Recommendations for the planning session

**A. Resolve the demo-anonymization contradiction first (blocking decision).** The live demos at `kne-demo.9592.tech` / `kne-cms-demo.9592.tech` currently name "Kompetenznetz Einsamkeit (KNE)" and "~1,600 KNE entries." VISION says link them AND don't name the buyer. Options: (1) **anonymize the demos themselves** (rename headings/labels to the generic "counseling network" framing, change subdomains to something neutral like `offermap-demo.9592.tech`) before linking — recommended, keeps the decision coherent; (2) link them as-is and accept the buyer is named on the demo (contradicts "anonymize now"); (3) don't publicly link the demos yet, describe the case studies without click-through until award. Recommend option 1. This is a site-source change so it's out of this session's scope, but it's the first thing the build session must settle.

**B. Legal pages are the non-negotiable baseline — ship them with the corrected facts.** Impressum (Amtsgericht München, HRB 287814, Geschäftsanschrift Düsseldorf, email + second contact means) and Datenschutzerklärung. **Pull a fresh Handelsregisterauszug immediately before publishing** to confirm Sitz/Registergericht hasn't moved. Correct the "Handelsregister Düsseldorf" error wherever it lives (UNGM profile, cover letters, capability statement).

**C. Do the two highest-value privacy fixes regardless of the rest.** Self-host the fonts (kills the Google-Fonts-CDN IP-transfer exposure, no consent needed, faster). Decide Mixpanel's fate: recommended config is **self-hosted fonts + Vercel cookieless analytics + drop Mixpanel from the public site → no consent banner needed, short honest Datenschutzerklärung.** If Mixpanel stays, a real opt-in consent gate is mandatory and nothing may fire pre-consent.

**D. Make the site accessible even though BFSG doesn't legally require it.** It's cheap on static Astro, it's the competence the bids sell, and an inaccessible site undercuts an accessibility-focused bid. Reuse the demos' toolchain (Pa11y-CI + Lighthouse mobile ≥ 90) on the main site. Check the dark-theme contrast pairs explicitly.

**E. Positioning: lead with concrete delivery + working software, never with "AI/KI-Agentur."** AI is the enabling method, not the headline. Keep the existing voice rules (no superlatives, no em dashes, honest scope) in both languages. Run `/voice-playbook` before any public copy. Keep the consumer-AI work (Jeeves / AI Actions / thesis) as real shipped-work proof so positioning stays reversible.

**F. i18n: built-in Astro i18n, `defaultLocale: 'de'`, `prefixDefaultLocale: false`** (DE at `/`, EN at `/en/`). One `blog` collection with `de/` and `en/` path segments and an optional `translationKey` for pairing; keep the existing Zod schema + mandatory CTA. Language switcher via `astro:i18n` `getRelativeLocaleUrl`, preserving the current path (not always-home), with dynamic `<html lang>`. Make `translationKey` optional so single-language legacy posts don't break the build.

**G. Parked, not ruled out:** BITMi membership + "Software Made in Germany" seal (evaluator-credibility lift), publishing the Berufshaftpflicht/insured signal, UNGM number, a short "Erklärung zur Barrierefreiheit"-style note. None are blockers for this iteration; note as the credibility-upgrade path.

---

*Research artifact only. No `src/` files were modified in this session.*
