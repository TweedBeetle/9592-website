---
date: 2026-05-23T18:45:26
title: D4 Homepage Hero and Selected-Work Reframe
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-7"
session_id: e4ed33eb-6a8f-4d86-a0e7-f0b4d3905025
---

## Summary

Reframed both homepages (`/de/`, `/en/`) to lead with concrete delivery instead of AI, and
surfaced the two procurement demonstrators first in Selected work, linking internally to their
wrapped case studies. PLAN feature D4.

## What Was Done

Edited only `src/pages/de/index.astro` + `src/pages/en/index.astro` (D4's allowed scope).

- **Hero tagline.** Replaced the AI-led line ("KI-Systeme, die sich um ein Vielfaches auszahlen"
  / "AI systems that pay for themselves many times over") with a concrete-delivery lead that
  foregrounds the inspectable working demonstrator as the edge ("Statt eine Lösung nur zu
  beschreiben, baue ich einen funktionierenden Demonstrator, den Sie vor einer Beauftragung
  selbst prüfen können" / "Rather than only describing a solution, I build a working demonstrator
  you can inspect for yourself before you commit"). AI named nowhere in the hero.
- **"Was ich mache" / "What I do" (scope judgment call).** D1 (commit 7b3724c) had only patched
  the Services teaser, leaving this intro still AI-led ("Der größte Teil meiner Arbeit dreht sich
  um LLMs" / "Most of my work involves LLMs. Conversational agents, retrieval systems, data
  extraction."). Leaving it would have re-introduced AI as a de-facto headline one section below
  a concrete-delivery hero, contradicting the PLAN POSITIONING CORRECTION ("AI is NOT the
  headline ... if AI appears at all it is only a bounded internal tool", which explicitly covers
  "D4 homepage hero and any positioning copy"). Rewrote it to the owner-led identity + direct
  contracting (one party, no intermediaries) + full-stack range + the "ehrlich mitdenken"
  honest-scope signal (findings §2.1's most-resonant counter-positioning). Flagged as a
  judgment call in BUILD-NOTES-homepage.md so F1/orchestrator can review or revert independently.
- **Selected work reorder.** The two demonstrators now render first via a `.map` over
  `caseStudies` (order: offer-map, editorial-workflow) with a homepage-length `cards`
  titles/teasers dict keyed by `study.key`. Each links INTERNALLY through `caseStudyPath`
  (`/de/arbeiten/angebotskarte/`, `/de/arbeiten/redaktions-workflow/` + EN `/work` mirrors), not
  an external live link, labelled "Demonstrator / Arbeitsprobe" / "Demonstrator / work sample"
  with the internal chevron icon. Jeeves, AI Actions, and the Master's thesis retained below,
  unchanged. D1 Services teaser preserved.

## Verification

- `npm run build` clean (both runs). Rendered-`dist/` checks: demonstrators first, internal links
  correct, retained entries below, old AI-led hero strings absent, forbidden-term + em-dash grep
  clean on both homepages. Dev-server: all four demonstrator routes resolve 200. Playwright
  full-page screenshots both locales confirm the dark design system intact and the new order.
- voice-playbook run on every new/changed string (DE Sie-Form, no superlatives, no em dashes, no
  emoji, no AI-as-product lead, none of the forbidden framings).
- Pa11y-CI WCAG2AA (axe + htmlcs) on both homepages: the one D4-introduced contrast issue (the
  new demonstrator eyebrow label at `text-text-secondary/70`, ~4.3:1 on `#0a0a0a`) was fixed to
  full `text-text-secondary` (~7.7:1) and re-run confirms it resolved. The remaining Pa11y errors
  are all pre-existing, in locked chrome/components (Header/Footer `lang-sep`, Footer
  `entity-line`, ContactCTA submit button + fallback link + honeypot checkbox, plus the
  pre-existing hero mailto arrow and Jeeves "live" badge) — out of D4 scope, owned by A4 /
  ContactCTA / G2.

## Steering / Reasoning

- The spawn brief carried the POSITIONING CORRECTION verbatim and an explicit FORBIDDEN-words
  list (AI-Orchestrierung, throughput of a small team, jung/agil/startup, KI-Agentur). The hero
  edit was the literal D4 task; extending to "Was ich mache" was the model's judgment call,
  grounded in the correction's "any positioning copy" clause and page coherence, and recorded as
  reversible.
- Did NOT push: this repo auto-deploys to Vercel on push and the brief said "Do NOT deploy".
  Committed to main locally only (commit 022a3e7); the orchestrator's G3 owns deploy.

## Open Threads

- **Work-index latent contrast bug:** `/arbeiten` ↔ `/en/work` index demonstrator-label eyebrows
  still use `text-text-secondary/70` (same sub-4.5:1 failure D4 fixed on the homepage). Captured
  in the project CLAUDE.md Design-System note; G2 should reconcile. D4 could not touch those files.
- **Homepage demonstrator titles/teasers are generic** (`cards` dict); on contract award the
  win-flip would also want these touched up, though the link targets (`caseStudyPath`) are stable.
- F1 (nav/footer wiring + route audit) and G1/G2/G3 publish gates remain per PLAN.md.
