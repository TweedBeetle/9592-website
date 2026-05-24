# BUILD-NOTES — F1 (integration + route audit) + G2 (WCAG 2.1 AA)

Session scope: PLAN.md F1 and G2 only. All content pages already existed (foundation, legal,
capabilities, case studies, blog, homepage). This session wired the final audit, found and fixed
accessibility defects, and verified the gates. No deploy (G3 is a later gated step).

Authoritative tooling (modelled on the demos per PLAN F1/G2 + `tests/pa11yci.json`):
Pa11y-CI (axe + htmlcs, WCAG2AA), Lighthouse mobile, plus axe-core driven directly via puppeteer
for exact per-node contrast data. Built site served statically from `dist/client` on :4399 for
auditing; runtime redirects verified against `astro dev` (Vercel functions/redirects are not in
the static output).

---

## F1 — integration + route audit: PASS

- **Internal links:** crawled every `href`/`src` in all 24 built pages. 43 distinct internal
  links, **0 dead** (every target resolves to a real file). No page links to a legacy
  `/blog/<slug>` path. External links are legitimate citations + the owner's own demos
  (askjeevesny.com, ai-actions.app, epd.9592.tech, epd.guide); **no buyer-demo URLs** (strip-list
  clean on links).
- **Header + Footer links** (both locales) resolve: Leistungen/Services, Arbeiten/Work, Blog,
  Impressum, Datenschutz, Kontakt/Contact — all via `localizedPath` + `src/i18n/routes.ts`.
- **Root `/` Accept-Language redirect** (verified in `astro dev`, 302 per-request):
  `de-DE…` → `/de/`; `en-US…` → `/en/`; `fr-FR,fr;q=0.9,de;q=0.5` → `/en/`; no header → `/en/`.
- **Legacy blog 301s** (verified in `astro dev`): all three `/blog/<slug>` → `/en/blog/<slug>/`.
  - **FIX:** the Vercel config emits exact-anchored regex routes (`^/blog/<slug>$`), so only the
    no-trailing-slash form was covered. The original posts were directory-format, canonical
    `/blog/<slug>/` (trailing slash). Added the trailing-slash variants to `redirects` in
    `astro.config.mjs` so both forms 301 on the real Vercel edge. (G3 should confirm on prod.)
- **Footer legal-entity line** (both locales), sourced from `src/i18n/legal.ts`:
  `9592 Solutions UG (haftungsbeschränkt) · Amtsgericht München HRB 287814 · USt-IdNr. DE364316497`.
- **JSON-LD** (`Layout.astro`): legalName + vatID `DE364316497` + PostalAddress = Fährstraße 217 /
  40221 / Düsseldorf (PC7). Impressum carries Sitz München + operativ Berlin bridge.
- **No phone, no "Handelsregister/Amtsgericht Düsseldorf"** anywhere in `dist/` (grep clean).
- **Sitemap:** `sitemap-index.xml` → `sitemap-0.xml` lists both locale trees (DE + EN, all pages).
  Legacy `/blog/<slug>` redirect stubs are excluded. Note: the root `/` redirect URL
  (`https://9592.tech/`) is currently listed in the sitemap; it 302-redirects. Low priority —
  flagged for the orchestrator (could exclude `/` from the sitemap), not a build/audit failure.

## G2 — accessibility (WCAG 2.1 AA): PASS

Authoritative gate: **Pa11y-CI (axe + htmlcs, WCAG2AA) — 24/24 pages, 0 errors** (config modelled
on the demos, incl. `levelCapWhenNeedsReview: "warning"`; see Mermaid note below). Direct axe-core
sweep: **0 violations on all 24 pages.**

### Lighthouse mobile (a11y / perf)

| Page | a11y | perf |
|------|------|------|
| /de/, /en/ (home) | 100 | 93 |
| /de/leistungen/ (≈/en/services) | 100 | 98 |
| /en/work/offer-map/ | 100 | 98 |
| /de/kontakt/ | 100 | 98 |
| /de/impressum/ | 100 | 99 |
| /de/blog/ (index) | 100 | 98 |
| blog posts (working-demo de+en, ai-support) | 100 | 97 |
| /en/blog/claude-code-workflow-tool-first-look/ | 100 | 70 |

All a11y = 100 (≥95 gate). All key pages perf ≥90. The workflow post is 70: it is the only post
with Mermaid diagrams and must load the ~0.5MB Mermaid library; it is not a key marketing page.
(Before the code-split fix below, every blog post was perf 67; now only the one that needs Mermaid
is below 90.)

### Dark-theme contrast pairs (measured, findings 1.3)

Body text needs ≥4.5:1, large/UI ≥3:1. Measured against `#0a0a0a` (primary bg) and `#141414`
(secondary bg):

| Foreground | on #0a0a0a | on #141414 | Verdict |
|------------|-----------:|-----------:|---------|
| `#fafafa` text-primary | 18.97 | 17.65 | PASS (AA normal) |
| `#a1a1a1` text-secondary | 7.66 | 7.13 | PASS (AA normal) |
| `#3b82f6` accent (links) | 5.38 | 5.01 | PASS (AA normal) |
| `#60a5fa` accent-hover | 7.79 | 7.25 | PASS (AA normal) |
| `#888888` text-muted (NEW token) | 5.58 | 5.20 | PASS (AA normal) |
| `#2563eb` accent-strong + white text (NEW, buttons) | white = 5.17 | — | PASS (AA normal) |

The three findings-1.3 pairs (`#a1a1a1`, `#3b82f6`, `#60a5fa` on both bgs) all pass AA for normal
text. The pre-existing failures (below) were dimmer one-off greens/greys/whites, now fixed.

### Keyboard, focus, motion, targets

- **Keyboard walkthrough (mobile, headless):** logical tab order skip-link → wordmark → switcher →
  menu toggle → content. All interactive chrome shows a visible 2–3px `:focus-visible` accent
  outline; content links fall back to the UA default ring (visible). Mobile menu opens on Enter,
  **Escape closes and returns focus to the toggle** — no focus trap. Contact form: `<label for>`
  bound to both fields, email `required`.
- **prefers-reduced-motion:** added a global reduced-motion block (`global.css`) that disables
  smooth scroll and neutralizes the infinite "live" pulse animation.
- **Touch targets (mobile, `pointer: coarse`):** menu toggle 44×44, mobile nav links 342×52,
  language-switcher links **44×44** (was 34×24), submit buttons **83×44** (was 83×38). All meet
  the demos' 44×44 bar on touch; desktop layout unchanged (scoped via `@media (pointer: coarse)`).
- **Landmarks/headings:** exactly one `<h1>` per page on all 24; `<header>/<nav>/<main id=main>/
  <footer>` present; skip-to-content link visible on focus.

---

## Fixes applied (all small, targeted)

Contrast (real axe/htmlcs failures, with measured ratios):

1. **Footer `.entity-line`** `#6a6a6a` 12px → 3.66:1 FAIL → `var(--color-text-muted)` (#888, 5.58).
2. **`en/impressum` courtesy-translation note** `#6a6a6a` 14px → 3.66 FAIL → `text-text-muted`.
3. **Submit buttons** (ContactCTA + BlogCTA) white on `#3b82f6` → 3.67 FAIL → `--color-accent-strong`
   `#2563eb` (white = 5.17); hover `--color-accent-strong-hover` `#1d4ed8` (6.70, stays passing).
4. **`.cta-fallback` text** `#555` 13px → 2.47 FAIL → `var(--color-text-secondary)`.
5. **Homepage "live" badge** `text-emerald-500/50` (#056343, 2.7) → `text-emerald-400` (10.3).
6. **Work-index eyebrow** `text-text-secondary/70` (#747474, 4.23) → full `text-text-secondary`
   (7.66). This is the latent instance the project CLAUDE.md flagged for G2 to reconcile — done in
   both `/de/arbeiten` and `/en/work`.
7. **Shiki code tokens** default `github-dark` comments `#6a737d` on `#24292e` = 3.04 FAIL → set
   `markdown.shikiConfig.theme: 'github-dark-high-contrast'` (comments now ≥4.5:1; bg #0a0c10).

New design tokens added to `src/styles/global.css` `@theme`: `--color-text-muted` (#888888),
`--color-accent-strong` (#2563eb), `--color-accent-strong-hover` (#1d4ed8). All AA-verified.

htmlcs / structural:

8. **Language-switcher `/` separator** `#3a3a3a` (1.74) text node → CSS `::before` generated
   content (decorative, no DOM text node; not a contrast obligation). `LanguageSwitcher.astro`.
9. **Honeypot checkbox** (ContactCTA + BlogCTA) had no accessible name (htmlcs H91/F68) → added
   `aria-label` + `tabindex="-1"` + `aria-hidden="true"` (it is `display:none`).
10. **Inline prose links** in datenschutz + impressum (de+en) flagged `link-in-text-block` (color
    alone) → added `underline underline-offset-2`. Same for the `.cta-fallback` email links.
11. **Decorative arrow glyphs** (`&larr;`/`&rarr;`, 8 spots) tripped axe needs-review ("element
    contains only non-text characters"). Converted to empty aria-hidden spans with CSS
    `::before`/`::after` content (`.deco-arrow-l` / `.deco-arrow-r`). They were already aria-hidden
    and inherited passing colors; this removes the bare-glyph DOM node so axe has nothing to review.

Motion + targets: items under "Keyboard, focus, motion, targets" above (reduced-motion block;
`pointer: coarse` 44×44 targets for switcher links + submit buttons).

Performance (blog posts):

12. **Mermaid was imported eagerly on EVERY blog post** (~594KB bundle, 465KB unused, LCP 5.3s →
    perf 67 even on text-only posts). Changed `[lang]/blog/[...slug].astro` to **dynamic-import**
    Mermaid only when the page actually contains a `pre[data-language="mermaid"]` block. Posts
    without diagrams now ship 4KB of orchestration JS (perf 97–98); Mermaid is a code-split chunk
    fetched only on the one post that uses it.

Diagram accessibility:

13. **Mermaid diagrams** now render with `role="img"` + an `aria-label` derived from the
    introducing sentence (a faithful text equivalent, per findings 1.3 "SVG diagrams are not
    reliably read"), and the inner SVG is `aria-hidden`. Screen-reader users get the labelled
    summary instead of an un-navigable SVG.

---

## Mermaid needs-review adjudication (the only non-trivial gate call)

The EN-only post `claude-code-workflow-tool-first-look` has 3 client-rendered Mermaid diagrams.
axe's `color-contrast` rule **cannot evaluate SVG text** (it returns `incomplete` /
`needsFurtherReview: true` with `fg/bg/ratio = undefined`), and pa11y types `incomplete` as
`error` by default. So a default pa11y run reports ~38 "errors" on this page that are **zero
real violations** (verified: axe `violations` = 0 at 2500 ms and 4000 ms; only `incomplete`).

Adjudication (manual, per WCAG): the diagram text renders at `#fafafa` (text-primary) on Mermaid
node fills `#141414`/`#1f2937` = 17:1 / 13:1 — comfortably passing. axe simply cannot measure SVG.

Resolution (not masking):
- The diagrams are given a real text equivalent (`role="img"` + faithful `aria-label`, fix 13).
- The authoritative gate config uses `levelCapWhenNeedsReview: "warning"` — exactly the setting the
  demos' Pa11y config uses (PLAN F1/G2 said to model on them). This classifies axe needs-review as
  warnings, so the gate's "0 errors" means **0 real violations**, which is the WCAG-correct reading.
  With this config the workflow post passes with 0 errors (confirmed standalone and in the full run).

Rasterizing Mermaid to static images at build would also remove the needs-review, but that is a
disproportionate rework for one legacy post and was not done (per the "don't silently rework" rule).

---

## Notes for the orchestrator (not gate failures)

- **Form placeholder contrast.** `::placeholder` is `#4a4a4a` (~2.2:1). Neither axe nor htmlcs
  flags placeholder text, and every field has a real `<label>`, so this does NOT fail the gate.
  It is genuinely dim, though. Left as-is to avoid placeholders reading like pre-filled values;
  flagged for a product call if a lighter placeholder is preferred.
- **Honeypot `aria-label` is English on DE pages** ("Leave this field empty"). It is
  `display:none` + `aria-hidden`, so never rendered or announced — not localized on purpose.
- **Workflow post perf = 70** (Mermaid library). Acceptable: not a key page, genuinely needs the
  library. Could be lifted by build-time static rendering of those 3 diagrams (future, optional).
- **Sitemap lists the `/` redirect URL.** Minor; could be excluded from the sitemap.
- **No new user-facing copy** was introduced by F1/G2 (only CSS, markup, config, and an
  aria-hidden honeypot label). The voice-playbook pass on visible copy belongs to the content
  phases; nothing new here triggered it.

## Verification method notes (for reproducing)

- Build: `npm run build` (clean). Serve: `python3 -m http.server 4399` from `dist/client`.
- Pa11y-CI batch buffers per-URL output to the end; an early run looked "hung" but was progressing
  — use `concurrency: 1` and let it finish. Config: `$CLAUDE_JOB_DIR/pa11yci-final.json`.
- Exact per-node contrast came from running axe-core directly via puppeteer (pa11y's JSON reporter
  strips axe's color data). Scripts live in the job dir (`axe-*.mjs`, `contrast.py`).
- Touch-target re-check needs `pointer: coarse`: emulate a touch device (puppeteer
  `emulate({hasTouch:true,isMobile:true})`), not just a small viewport.
- Runtime redirects (`/` + legacy blog 301s) are Vercel functions/config — verify in `astro dev`,
  not `astro preview` or the static server.
