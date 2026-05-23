# BUILD-NOTES — D4 (homepage hero + Selected-work reframe)

Running notes for feature D4. Scope: `src/pages/de/index.astro` + `src/pages/en/index.astro`
only. No other pages/components touched. Built on the committed D1 state.

Authoritative source ordering: PLAN.md (incl. the `⚠️ USER OVERRIDES` and `⚠️ POSITIONING
CORRECTION` blocks, which supersede contrary plan text) > VISION.md >
research/presence-findings.md (§2 evaluator signals).

## What changed (both locales)

1. **Hero tagline rewrite.** Replaced the AI-led hero ("Ich entwickle KI-Systeme, die sich um
   ein Vielfaches auszahlen." / "I build AI systems that pay for themselves many times over.")
   with a concrete-delivery lead that foregrounds the inspectable working demonstrator as the
   edge:
   - DE: "Ich entwickle individuelle, lauffähige Software. Statt eine Lösung nur zu beschreiben,
     baue ich einen funktionierenden Demonstrator, den Sie vor einer Beauftragung selbst prüfen
     können."
   - EN: "I build custom working software. Rather than only describing a solution, I build a
     working demonstrator you can inspect for yourself before you commit."
   - AI is named nowhere in the hero. No superlatives, no em dashes, no forbidden framing.

2. **"Was ich mache" / "What I do" rewrite (judgment call — see below).** The prior copy still
   led with AI-as-product ("Ich entwickle ... KI-Systeme ..." / "Der größte Teil meiner Arbeit
   dreht sich um LLMs" / "Most of my work involves LLMs. Conversational agents, retrieval
   systems, data extraction."). D1 had not touched this section (D1 only patched the Services
   teaser, commit 7b3724c). Leaving it would have put an AI-as-offering statement one section
   below a concrete-delivery hero, contradicting the POSITIONING CORRECTION ("AI is NOT the
   headline ... if AI appears at all it is only a bounded internal tool"). Rewrote it to lead
   with the owner-led identity + direct-contracting signal + full-stack technical range + the
   "ehrlich mitdenken" honest-scope signal (§2.1's most-resonant counter-positioning):
   - DE P1: owner-led provider, "die technische Gesamtverantwortung trägt", "einen einzigen
     Vertragspartner ohne Mittler" (Direktvertrag / keine Mittler, §2.1).
   - DE P2: full-stack range (no AI-as-offering) + "Ob ein Vorhaben in der angedachten Form
     sinnvoll ist, sage ich Ihnen ehrlich, auch wenn die Antwort manchmal Nein lautet."
   - EN mirrors.

3. **Selected-work reorder.** The two procurement demonstrators now appear FIRST, each linking
   to its wrapped case study (INTERNAL, via `caseStudyPath` — not an external live link),
   labelled "Demonstrator / Arbeitsprobe" / "Demonstrator / work sample":
   - offer-map → `/de/arbeiten/angebotskarte/` · `/en/work/offer-map/`
   - editorial-workflow → `/de/arbeiten/redaktions-workflow/` · `/en/work/editorial-workflow/`
   Rendered by mapping over `caseStudies` (order: offer-map, editorial-workflow) with a local
   homepage-length `cards` titles/teasers dict keyed by `study.key` (mirrors the work-index
   pattern). The retained Jeeves / AI Actions / Master's-thesis entries follow, unchanged.
   Internal chevron icon (`M9 5l7 7-7 7`), not the external-link icon.

## Judgment calls (flagged for the orchestrator / F1 review)

- **Touched "Was ich mache" / "What I do", which is adjacent to but not literally "the hero".**
  Justification above: the POSITIONING CORRECTION explicitly covers "D4 (homepage hero) and any
  positioning copy", and a concrete-delivery hero followed by an AI-as-offering section would be
  incoherent and would re-introduce AI as a de-facto headline. Section-level, reversible. If the
  orchestrator wants the original "Was ich mache" back, it is a single revert of that block; the
  hero + Selected-work changes are independent.
- **Brand form in body copy.** Used the brand "9592 Solutions" (no "UG") in the homepage body to
  avoid an incomplete legal-form reference; the full "9592 Solutions UG (haftungsbeschränkt)"
  lives in the Footer/Impressum where the spelled-out-form rule applies. The hero subtitle
  already reads "9592 Solutions", so this is consistent.
- **No new shared chrome strings.** All new copy is page-body; `ui.ts` untouched. The
  demonstrator label text is authored inline in the page files (it is case-study scaffolding,
  matching how `CaseStudy.astro` keeps its own labels local, not in `ui.ts`).

## Voice-playbook pass (DE + EN, every user-facing string)

Ran on all new/changed strings. No em dashes, no superlatives, no emoji, no AI-as-product lead,
no forbidden framings (`AI-Orchestrierung`/`AI orchestration`/`Durchsatz eines kleinen
Teams`/`throughput of a small team`/`jung`/`agil`/`startup`/`KI-Agentur` — all absent, grep-
confirmed in `dist/`). DE uses Sie-Form throughout. Short active sentences; comma lists carry
real connectors (not bare comma-list sentences). No pronoun drops, no punchy-copywriter register.

## Verification

- `npm run build` clean (both runs). `/de/` + `/en/` build to static `index.html`.
- Rendered-HTML checks (built `dist/`): demonstrators render first in Selected work; internal
  case-study links correct; Jeeves/AI Actions/thesis retained below; old AI-led hero strings
  absent; forbidden-term + em-dash grep clean on both homepages.
- Dev-server route check: all four demonstrator targets resolve 200.
- Playwright full-page screenshots both locales: dark design system intact, demonstrators first,
  D1 Services teaser preserved, layout clean. (`de-home-d4.png`, `en-home-d4.png` in repo root —
  housekeeping should remove before commit, or they are gitignored.)

## Accessibility (Pa11y-CI WCAG2AA, axe + htmlcs)

Ran against both homepages on the dev server.

- **D4-introduced issue, FIXED:** the two new demonstrator labels initially used
  `text-text-secondary/70`, which composites to ~4.3:1 on `#0a0a0a` (below the 4.5:1 small-text
  threshold) and was flagged by axe. Changed to full `text-text-secondary` (~7.7:1), matching the
  `CaseStudy.astro` label styling. Re-run confirms these two are resolved.
- **Pre-existing, OUT OF SCOPE for D4 (locked chrome/components — G2 owns the site-wide a11y
  pass):** the remaining Pa11y errors are identical on every page and live in files D4 may not
  touch:
  - Header/Footer `lang-sep` "/" separator (`text` 1.74:1) — `LanguageSwitcher.astro` (A4).
  - Footer `entity-line` (3.66:1) — `Footer.astro` (A4).
  - ContactCTA submit button (3.68:1), fallback paragraph (2.47:1) + its mailto link
    (link-in-text-block), and the hidden `botcheck` honeypot checkbox (no accessible name) —
    `ContactCTA.astro` (shared component).
  - The hero `mailto` arrow `<span>→</span>` (accent on bg) and the Jeeves "live" badge
    (`emerald-500/50`) — both PRE-EXISTING markup unchanged by D4.
  These are flagged here for G2 (the dedicated WCAG pass) and/or the component owners. D4
  introduced no new failure beyond the demonstrator label, which is fixed.
- **Contrast pairs (homepage body, D4-authored):** body text `#a1a1a1` on `#0a0a0a` ≈ 7.7:1;
  headings `#fafafa` on `#0a0a0a` pass comfortably; the fixed demonstrator label ≈ 7.7:1.

## Win-flip note

Untouched by D4. The demonstrator entries read from `src/data/work/*` via `caseStudies`; on
award the existing `anonymized` flag in those data files flips the case-study pages. The homepage
titles/teasers are generic (`cards` dict) and would also want a touch-up on award, but the link
targets (`caseStudyPath`) are stable.
