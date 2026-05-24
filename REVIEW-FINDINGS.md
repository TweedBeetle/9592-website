# Independent Review — 9592.tech (pre-deploy quality gate)

**Reviewer:** independent, source-blind (built site only; no `src/` read).
**Method:** `npm run build` (clean) + `astro dev` served at `localhost:4321` (the Vercel adapter does not support `astro preview`); reviewed entirely through the browser (Playwright) plus HTTP-level checks of redirects, routes, and the built `.vercel/output` config. Visual screenshots in `review/screenshots/`; downscaled copies of the shipped work-images were inspected for buyer-identity leaks.
**Lens:** a skeptical German public-sector / Mittelstand procurement evaluator who has just received a 9592 bid and is checking whether the vendor is credible and shortlist-worthy. The site's job is to *reinforce* the bid.
**Verdict in one line:** The positioning, legal pages, and text-level anonymization are genuinely strong and would reinforce a bid. But there is one anonymization leak baked into shipped screenshots that the automated gate cannot see, a half-English contact form on the two most bid-relevant German pages, and a dead portfolio link. Fix the BLOCKER and MAJORs before deploy.

---

## BLOCKER

### B1. Buyer's product name "Angebotslandkarte 2.0" is visible inside three shipped case-study screenshots
- **Where:** `/de/arbeiten/redaktions-workflow/` and `/en/work/editorial-workflow/` (the editorial-CMS demonstrator). The images `editorial-personas.png`, `editorial-intake-queue.png`, and `editorial-reminders.png` all carry the CMS header line **"Redaktionelles Workflow-CMS für die Angebotslandkarte 2.0"**.
- **What's wrong:** "Angebotslandkarte" is a strip-list term — it is the buyer's actual product name, and the whole site deliberately uses the neutral **"Angebotskarte"** instead (the offer-map case study is even titled and slugged `angebotskarte` precisely to avoid this word). Here it sits in plain sight in three shipped PNGs.
- **Why the automated gate missed it:** the release strip-list grep scans `dist/` *text* (HTML/JS/XML/JSON). I confirmed that text gate is clean — 0 occurrences of `Angebotslandkarte`, `KNE`, `Kompetenznetz`, `Einsamkeit`, etc. in `dist/`, and filenames are clean. But **text rendered inside a PNG is invisible to a text grep**, so this leak passes the gate while being plainly readable to any human visitor who looks at the screenshot. This is exactly the class of defect a source-blind visual review exists to catch.
- **What the evaluator experiences:** an attentive reader (the procurement audience is, by definition, reading closely) sees the buyer's real product name on the page that is otherwise scrupulously anonymized. It both risks de-anonymizing a not-yet-awarded bid and signals an internal inconsistency in the team's own anonymization discipline.
- **Fix:** re-capture or crop those three shots to exclude the CMS header band, or relabel the demo app's header to a neutral string before re-capturing. (Screenshots: `editorial-personas.png`, `editorial-intake-queue.png`, `editorial-reminders.png` — read via the work-asset inspection.)
- **Calibration note:** "Angebotslandkarte" in isolation is a moderately generic German compound, so its standalone identifying power is debatable. But it is an explicit hard-rule strip term, the rest of the site honors that rule, and pre-award the decision was unambiguous: do not surface the buyer's terms. Combined with B-list finding M1 below, the compound de-anonymization risk is real. Treated as a deploy blocker on the strength of the explicit rule.

---

## MAJOR

### M1. The loneliness / social-isolation domain is legible in the demonstrator screenshots
- **Where:** the editorial-CMS screenshots (`editorial-submit.png`, `editorial-intake-queue.png`, `editorial-diff.png`, `editorial-reminders.png`, `editorial-audit-log.png`) and, more faintly, the offer-map "Themen"/category controls.
- **What's wrong:** the synthetic demo content consistently paints one specific picture: `Akute Lebenskrise`, `Trauer um Partner`, `Männer 60+` / `Frauen 60+` (topic tags on the submission form); `Männer-Trauergruppe 60+ — Schweigen ist keine Lösung`; `Trauerbegleitung nach Suizid`; `Telefonseelsorge — kostenfrei, anonym, rund um die Uhr`; `Seniorentreff`, `Seniorenkreis`, `Letzte-Hilfe-Kurse`. That is an unmistakable bereavement / elderly-isolation / loneliness-prevention fingerprint.
- **Why it matters:** the project's own VISION states plainly that *"the loneliness topic itself is identifying."* No literal buyer name or the word "Einsamkeit" appears, but a knowledgeable German social-sector evaluator could plausibly infer the domain — and the specific buyer — from the topic set. This is softer than B1 (it is synthetic data, not a name) but it directly undercuts the explicit anonymization intent.
- **What the evaluator experiences:** the "anonymized" demonstrator quietly reveals what it was built for.
- **Fix:** re-skin the demo seed data toward a domain-neutral counseling/advisory theme (generic municipal services, library programs, etc.) before re-capturing, so the screenshots demonstrate the *capability* (clustering, filters, four-eyes editorial workflow, diff, audit log) without the sensitive topic. The text already does this well; the images need to match.

### M2. The German contact form is half-English on the homepage and the capabilities page
- **Where:** `/de/` (homepage CTA "Sie haben ein Projekt im Kopf?") and `/de/leistungen/` (CTA "Sie haben einen konkreten Bedarf?"). Screenshots: `review/screenshots/de-home-form.png`, `de-leistungen-desktop.png`.
- **What's wrong:** on these two pages the embedded form renders English chrome amid otherwise-German copy:
  - field label **"Email"** (German should be "E-Mail")
  - textarea label **"What are you working on?"**
  - **"Or email me directly at"** christo@9592.tech
  - the outgoing email subject is also English: "New project inquiry from 9592."
- **The tell that this is a bug, not a choice:** the *same* form renders **fully and correctly in German** elsewhere — `/de/kontakt/` ("E-Mail", "Worum geht es?", "Senden", "Oder schreiben Sie mir direkt an"), `/de/arbeiten/`, and the DE blog posts ("E-Mail", "Anforderung schildern", "Oder schreiben Sie mir direkt an"). So the German strings exist; they are simply not applied on the homepage and the Leistungen page — the two pages a bid is most likely to link to.
- **What the evaluator experiences:** a half-translated contact form on the German landing page and the procurement-facing capabilities page reads as machine-generated / unfinished and undercuts the site's implicit "we do bilingual properly" claim. For an audience that equates attention-to-detail with delivery quality, this is a credibility tax exactly where it costs most.
- **Fix:** pass the German locale to the contact-form component on the homepage and the Leistungen page (translation already exists; this is a prop, not new copy).

### M3. Broken external portfolio link: "AI Actions" → ai-actions.app 404s
- **Where:** homepage "Ausgewählte Arbeiten" / "Selected work", the "AI Actions" entry links to `https://ai-actions.app` (opens in a new tab).
- **What's wrong:** `https://ai-actions.app` 301-redirects to `https://www.ai-actions.app/`, which returns **404** (Cloudflare). The link is dead. (The neighboring links are fine: `askjeevesny.com` → 200, the Master's-thesis PDF → 200.)
- **What the evaluator experiences:** clicking a portfolio entry lands on a 404. On the one page whose job is to signal that this vendor ships working, inspectable software, a broken link to one's own product is a self-inflicted credibility wound.
- **Fix:** point the entry at a live URL (working domain or the App Store listing), or remove the outbound link if the product is no longer hosted.

### M4. Legacy blog redirect 404s on the trailing-slash form in production
- **Where:** the three legacy `/blog/<slug>` URLs (`ai-support-premium-service-businesses`, `claude-code-workflow-tool-first-look`, `epd-cost-crisis-small-manufacturers`).
- **What's wrong:** the built `.vercel/output/config.json` contains the redirect rule for each slug **only in its no-trailing-slash form** (`^/blog/<slug>$`) — and each is listed *twice as an identical duplicate* (routes 0=1, 2=3, 4=5), which is the smoking gun that the two intended forms both rendered to the same pattern. The canonical **trailing-slash** form `/blog/<slug>/` matches no route and has no static file in `dist`, so on the real Vercel edge it falls through to a 404. Because this is a directory-format build, the *old* site's canonical blog URL was almost certainly the trailing-slash form — i.e. the form search engines indexed and external links use is the one that 404s.
- **Why dev hides it:** `astro dev` matched both forms and returned 301 for each during my test; the gap only appears against the Vercel routing model. This also contradicts the project's own documented intent (the CLAUDE.md gotcha states "the three legacy `/blog/<slug>` 301s list both forms" — the build output does not).
- **What the evaluator experiences:** mostly invisible (the audience reads current bid URLs, not legacy blog links), so the direct mission impact is low — but it is a genuine production 404 path and a lost-SEO regression that the team believes is already handled. Flagged MAJOR because it is a real defect masked by dev and contradicted by the docs; downgrade to MINOR if legacy-URL SEO is judged irrelevant.
- **Fix:** emit both `/blog/<slug>` and `/blog/<slug>/` redirect entries (or a single regex tolerant of the optional trailing slash), and verify against the Vercel routing model, not `astro dev`.

---

## MINOR

### m1. Impressum displays a contact URL that doesn't resolve if typed
- `/de/impressum/` shows "Kontaktformular: **9592.tech/kontakt**". The clickable link works (`href=/de/kontakt/`), but the *displayed/typed* URL `9592.tech/kontakt` 404s — there is no unprefixed `/kontakt` route (only `/de/kontakt/` and `/en/contact/`). The EN Impressum is accurate ("9592.tech/en/contact" → `/en/contact/`). In a legal notice that cites this form as the §5 DDG "second means of fast electronic contact," the inaccurate displayed URL is sloppy. Fix: show `9592.tech/de/kontakt` or add a `/kontakt` → locale redirect.

### m2. Language switcher loses your place on case studies
- Toggling DE↔EN on a case study (`/de/arbeiten/angebotskarte/`) lands on the *work index* (`/en/work/`), not the sibling case study. It does not 404, and this is a documented intentional tradeoff — but the blog switcher *does* preserve the post (jumps to the translated sibling). The inconsistency is noticeable: a reader comparing the German and English versions of a specific case study is bounced back to the index and has to re-navigate. Consider mirroring the blog switcher's sibling-jump for case studies.

### m3. Ich/Wir voice inconsistency on the capabilities page
- `/de/leistungen/` uses corporate "Wir" ("Wir arbeiten EU-datenschutzkonform", "WAS WIR NICHT ANBIETEN") but its contact CTA switches to "Ich melde mich innerhalb eines Tages"; the homepage uses "Ich" throughout. For an owner-led one-person company either voice is defensible, but mixing them on a single page reads slightly unconsidered. Pick one register per page.

### m4. Demonstrator screenshots lose legibility on mobile
- At phone width (`de-casestudy-mobile.png`) the offer-map screenshots shrink so the cluster counts and filter labels are no longer readable, and there is no tap-to-enlarge / lightbox. Since the demonstrator's whole point is "inspectable," near-illegible thumbnails weaken that on mobile. Consider a lightbox or larger mobile rendering.

### m5. Em-dashes appear in the demo-content screenshots
- The demo app's own content uses em-dashes (e.g. "Status veröffentlicht — das ist die Ansicht", "Trauerbegleitung nach Suizid — Einzelgespräche"). These are inside the demonstrator UI, not the site's editorial voice, so the site's no-em-dash rule isn't technically violated — but they are visible on the site. Cosmetic; only worth touching if the screenshots are re-captured for M1/B1 anyway.

### m6. "Einzel-Prinzipal-Praxis" reads awkwardly in German
- The homepage Leistungen teaser ("Leistungen im Überblick: Einzel-Prinzipal-Praxis, Direktvertrag, EU/DE-Datenschutz, Barrierefreiheit") uses "Einzel-Prinzipal-Praxis," a literal Germanization of "single-principal practice" that reads unusual to a native German business reader. "Inhabergeführte Praxis" or "Ein-Personen-Gesellschaft" would land more naturally. Minor register polish.

---

## What works well (and should not be touched)

- **Positioning lands cleanly.** Hero (both locales) leads with concrete delivery — "Ich entwickle individuelle, lauffähige Software... baue ich einen funktionierenden Demonstrator, den Sie vor einer Beauftragung selbst prüfen können" / "I build a working demonstrator you can inspect before you commit." Owner-led, direct technical responsibility, single contracting party, prototype-before-award. **AI is never framed as the product/headline** — the capabilities page mentions AI nowhere at all. No superlatives, no startup tone, no "KI-Agentur," no AI-throughput claims. This is exactly the bid-reinforcing frame the VISION asked for.
- **Impressum (both locales) is complete and correct.** All §5 DDG fields; "(haftungsbeschränkt)" spelled out; **Amtsgericht München HRB 287814** (the corrected register, not Düsseldorf); USt-IdNr. DE364316497; §18 MStV content-responsible; a clear "Sitz München · Geschäftsanschrift Düsseldorf · operativ Berlin" bridge; EN carries a "courtesy translation, German is legally binding" disclaimer. The mobile number does **not** appear anywhere (per the email+form decision) — verified.
- **Datenschutz is honest and matches reality.** Verantwortlicher mirrors the Impressum; Vercel + Cloudflare disclosed as processors with the EU-US DPF note; §25 TDDDG "no non-essential cookies/no tracking"; Web3Forms covered; **no Google Fonts clause, no Mixpanel clause, no consent banner** — all consistent with the self-hosted-fonts / cookieless build.
- **Text-level anonymization is excellent.** "ein bundesweites Beratungsnetzwerk", "weit über tausend", "Kein Kundenprojekt, kein Produkt", "Live-Demo auf Anfrage / Zugang anfragen", neutral slugs, clean German alt text, no public demo links. The `dist/` text strip-grep is clean (0 buyer terms; clean filenames). The offer-map screenshots themselves are clean (generic Modalität/Zielgruppe/PLZ filters, no buyer chrome, no URL bar, no logo).
- **Behavior is solid.** `/` Accept-Language redirect correct (`de-*`/`de-AT` → `/de/`; `en`/`fr`/none → `/en/`). All 24 nav-reachable pages return 200 in both locales — no internal 404s. The switcher round-trips on localized slugs (`/de/leistungen/` ↔ `/en/services/`). The DE blog index shows DE posts plus a working "Nur auf Englisch verfügbar" affordance for EN-only posts. The mobile menu is keyboard-accessible (`aria-expanded`/`aria-controls`, Esc closes). Console is clean (0 errors, 0 warnings; only cookieless Vercel Analytics debug logs).
- **Build hygiene.** Build is clean; the Astro dev toolbar is absent from `dist`; fonts are self-hosted (6 woff2 in the build); Selected-work order puts the two demonstrators first with the retained consumer work (Jeeves, AI Actions, thesis) below.
- **Visual quality.** Clean dark theme, strong typographic hierarchy, generous whitespace, mono uppercase eyebrow labels, professional and credible. It does not read as vibe-coded or machine-generated. The Impressum and case-study layouts in particular look like a serious vendor's site.

---

## Priority order for the fix pass

1. **B1** — strip "Angebotslandkarte 2.0" from the three editorial screenshots (re-crop or relabel-then-recapture). Hard-rule, deploy-blocking.
2. **M1** — re-skin the demonstrator demo data off the loneliness domain before re-capturing (do together with B1, same screenshots).
3. **M2** — German-localize the contact form on the homepage + capabilities page.
4. **M3** — fix the dead "AI Actions" link.
5. **M4** — both-forms legacy blog redirect (or accept the legacy-SEO loss knowingly).
6. **m1–m6** — polish.

Items 1–4 are the credibility-relevant ones for the procurement lens; 1 and 2 are the ones that could actually compromise a not-yet-awarded bid.
