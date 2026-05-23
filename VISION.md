# VISION — 9592.tech presence sculpting for structured-RFP bids

## What this is

A focused evolution of the existing 9592.tech site (Astro 5 + MDX + Tailwind v4, Vercel + Cloudflare) so that when a **structured-RFP evaluator** — German public-sector procurement officer, Mittelstand decision-maker, or any structured buyer — reads a 9592 bid and then visits the website, the site *reinforces* the bid instead of undercutting it.

Today the site is an English personal page led by consumer-AI work (a laundry-influencer chatbot, an iOS Shortcuts app, a master's thesis). That is the wrong first impression for the buyers the bid-pipeline project targets. This project sculpts the presence to surface tailored-software delivery capability, the live procurement demonstrators, and the credibility signals German buyers expect — without throwing away the existing identity.

This serves the bid-pipeline **content-flywheel** thesis: publishing demo writeups and surfacing live demonstrators is the natural marketing channel, and a credible site is a pre-bid authority-building artifact.

## Decided (from user, 2026-05-23)

These four were settled with the user before planning:

1. **Positioning — sculpt meaningfully toward procurement evaluators, but keep it REVERSIBLE.**
   - User did not pick "additive / repivot / light-touch"; the directive was *"allow for pivoting back later."*
   - Interpretation (hard constraint): go beyond a light touch — genuinely reshape the presence for evaluators — but do NOT burn the consumer-AI identity. Keep Jeeves / AI Actions / thesis as real shipped-work proof. No destructive rewrites of existing work. Positioning must be dial-back-able (content/section-level changes, not an identity teardown).
   - The site should read credibly to BOTH a procurement evaluator and an existing creator/SMB client.

2. **KNE demo writeup — anonymized now.**
   - KNE (Tender 27) is submitted but NOT yet awarded. Do not name the buyer or narrate "we bid for X."
   - Frame generically: e.g. "an accessibility-focused offer map + editorial CMS for a national counseling network."
   - Leave a clear upgrade path to a named version if/when the contract is won.

   **Live-demo handling (resolved 2026-05-23):** the live demos are heavily buyer-branded (~900 KNE/ISS/"gegen Einsamkeit" strings across the two repos; the loneliness topic itself is identifying). Therefore, pre-award:
   - Case-study pages use **anonymized screenshots / walkthrough only** — choose crops that demonstrate capability (map marker-clustering, category-aware cluster counts, filter sidebar, radius search, the CMS four-eyes editorial workflow, accessible list view) WITHOUT the identifying title/topic text. Crop or blur any "KNE" / "Kompetenznetz" / "gegen Einsamkeit" chrome.
   - **Do NOT publicly link or index the live demo URLs** pre-award. The live URLs stay shareable privately inside bids. A "live demo available on request" line is fine.
   - On win: flip to public live links + a named version of the case studies. Architect the case-study pages so this is a content swap, not a rebuild (e.g. a frontmatter flag or a clearly-marked anonymized block).
   - This adds a screenshot-capture + light-image-edit task to implementation.

3. **Language — full bilingual DE + EN**, with a language switcher; blog posts translated. User accepted the higher maintenance burden knowingly.

4. **Demo presentation — wrapped `/work` case-study pages** (problem / approach / screenshots / what it demonstrates). Pre-award these show anonymized screenshots and a "live demo on request" line rather than a public link (see decision 2). Not raw direct links to the buyer-branded apps.

## Known constraints

- **Impressum is legally required** (§5 DDG, formerly TMG) for a German business website and currently ABSENT. It must carry the **registered company address: Fährstr. 217, 40221 Düsseldorf** (legal requirement — the registered seat, not Berlin). The site's narrative copy may still say "based in Berlin / operative Leitung Berlin" (per the company's outward-comms convention). Make the Düsseldorf-seat / Berlin-operations relationship explicit rather than contradictory.
- **Datenschutzerklärung** (privacy policy) also required — the site uses Vercel Analytics, Mixpanel, Web3Forms, Google Fonts; all need disclosure. Currently absent.
- **BFSG (Barrierefreiheitsstärkungsgesetz)** took effect 28 June 2025 and extends web-accessibility duties to many commercial sites. Accessibility is also directly on-thesis (the KNE demo's whole point is WCAG/BITV compliance) — the site itself should be accessible, and that is a credibility signal in its own right.
- **Reversibility**: prefer additive sections and locale-routing over rewriting the hero/identity. Keep the existing design system (dark theme, Inter/JetBrains Mono, tokens in CLAUDE.md).
- **Honesty / scope**: no overclaiming. The site's own voice rules (no superlatives, no em dashes, honest about scope) stay in force. Demo pages must use the demonstrator/Arbeitsprobe framing, not "production product."
- **No new heavy dependencies** without reason. Astro has built-in i18n routing; prefer it over a plugin unless the planning session finds a strong reason.

## Reusable assets already in hand (in the bid-pipeline repo)

The planning + content sessions should mine these rather than writing from scratch:
- `~/projects/bid-pipeline/notes/ungm/capability-statement-draft.md` — EN + DE capability-statement copy (lead-with-prototype + lead-with-pain variants).
- `~/projects/bid-pipeline/notes/research/buyers/iss-kne-buyer-culture-chatgpt-2026-05-09.md` — buyer-culture / pricing-psychology insight.
- `~/projects/bid-pipeline/tenders/27-kne-angebotslandkarte/submission/` — the submitted Konzept/Angebot (source for the anonymized case study; STRIP buyer name, pricing, tender specifics).
- `~/projects/bid-pipeline/CLAUDE.md` — company identity block (legal name, HRB, VAT, addresses), thesis, content-flywheel rationale.
- Live demos: `https://kne-demo.9592.tech` (Angebotslandkarte) + `https://kne-cms-demo.9592.tech` (editorial CMS).

Synthesized research backing this VISION (legal requirements, buyer-evaluation signals, Astro i18n approach, anonymized copy source + strip-list) lives in `research/presence-findings.md`. Read it before planning.

## Out of scope (this iteration)

- Naming KNE or any buyer publicly (revisit on award).
- A full marketing redesign / new visual identity (keep the current design system).
- New backend/services; this is a static content + i18n + legal-pages effort.
- Repointing positioning so far that the consumer-AI work is removed.

## Success

When a German public-sector evaluator (or DACH Mittelstand buyer) lands on 9592.tech after reading a bid:
- They see, in their language, that 9592 delivers tailored working software for structured buyers.
- They can click through to live, working demonstrators framed by case studies.
- They find a proper Impressum + Datenschutzerklärung and an accessible site — the baseline-competence signals that, when absent, quietly sink credibility.
- The existing consumer-AI proof-of-shipping remains, and the positioning can be dialed back later without a rebuild.
