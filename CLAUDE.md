# 9592 Solutions Website

Personal/business website for Christo Wilken / 9592 Solutions.

## About

**Business**: 9592 Solutions UG (German limited liability)
**Location**: Berlin (as of Nov 2025)
**Email**: christo@9592.tech
**Domain**: 9592.tech

**What I do**: AI systems and software development. Conversational agents, retrieval pipelines, LLM integrations, data extraction. Clients include content creators and small businesses needing AI-powered tools.

**Background**: CS from TU Munich. Self-employed, working with clients worldwide.

## Stack

- **Framework**: Astro 5 (static site generator)
- **Styling**: Tailwind CSS v4
- **TypeScript**: Strict mode
- **Hosting**: Vercel
- **Fonts**: Inter (body), JetBrains Mono (code), self-hosted via `@fontsource/*` (no Google Fonts CDN)
- **i18n**: Astro built-in routing, bilingual DE/EN (`prefixDefaultLocale: true`); see Gotchas

## Design Philosophy

**Minimalist, not minimal**: Clean and uncluttered, but with enough personality to be memorable. Typography and spacing do the heavy lifting.

**Dark theme primary**: #0a0a0a background, off-white text. Easier on eyes, fits the technical aesthetic.

**No gratuitous animations**: Subtle hover states and transitions only. Motion should feel purposeful.

**Professional but not corporate**: This is a personal brand. Technical sophistication over marketing polish.

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#0a0a0a` | Page background |
| `bg-secondary` | `#141414` | Card/section backgrounds |
| `text-primary` | `#fafafa` | Headings, important text |
| `text-secondary` | `#a1a1a1` | Body text, descriptions |
| `accent` | `#3b82f6` | Links, highlights |
| `accent-hover` | `#60a5fa` | Hover states |

**Contrast: avoid `/NN` opacity modifiers on `text-secondary` for small text** <!-- added: 2026-05-23 -->: `text-text-secondary/70` composites to ~4.3:1 on `#0a0a0a` (below WCAG2AA's 4.5:1 small-text threshold) and Pa11y/axe flags it. Use full `text-text-secondary` (~7.7:1) for muted small labels (mono uppercase eyebrow labels, captions). The `/arbeiten` ↔ `/en/work` index demonstrator-label eyebrow was reconciled to full `text-text-secondary` in G2 (no `/70` eyebrows remain). For muted text that must stay dimmer than `text-secondary`, use the `text-text-muted` token (`#888`, 5.58:1 on `#0a0a0a`) added in G2; never a darker grey at small sizes. Button fills with white text use `--color-accent-strong` (`#2563eb`, white = 5.17:1), NOT `--color-accent` (`#3b82f6`, white = only 3.68:1).

### Typography

- **Headings**: Inter, semibold/bold
- **Body**: Inter, regular
- **Code/monospace**: JetBrains Mono

### Spacing

Generous whitespace. Use Tailwind's scale:
- Section padding: `py-24` or `py-32`
- Content max-width: `max-w-3xl` for text, `max-w-5xl` for wider layouts

## Content & Voice

**Be direct**: Say what you mean. No filler, no hedging.

**No superlatives**: Avoid "amazing", "incredible", "cutting-edge". Let the work speak.

**Technically accurate**: Prefer precise descriptions over marketing speak.

**Honest about scope**: Don't overclaim. If it's a small project, say so.

### Writing Style

- Active voice
- Short sentences and paragraphs
- No em dashes (use colons or break into sentences)
- No emoji unless explicitly requested

## Code Standards

**No over-engineering**: Only add what's needed. Three similar lines > premature abstraction.

**No dead code**: Delete unused code completely. No commented-out blocks.

**TypeScript strict**: Avoid `any`. Use proper types.

**Edit over create**: Prefer modifying existing files over adding new ones.

## Project Structure

```
src/
  layouts/
    Layout.astro      # Base layout: html lang, hreflang, og:locale, JSON-LD, Header/Footer
  pages/
    index.astro       # On-demand Accept-Language redirector (/ -> /de/ or /en/)
    de/index.astro    # German homepage
    en/index.astro    # English homepage
    [lang]/blog/      # Locale-aware blog: index + [...slug] (/de/blog, /en/blog)
    de/arbeiten.astro + de/arbeiten/*  # Work index + case studies (DE)
    en/work.astro + en/work/*          # Work index + case studies (EN)
  content/
    config.ts         # Content Layer glob loader + Zod schema (mandatory cta)
    blog/{de,en}/     # MDX posts; locale = first path segment of the entry id
  data/
    work/             # Per-case-study win-flip data objects (anonymized flag, localized slugs, screenshots)
  components/         # Header, Footer, LanguageSwitcher, BlogCTA, ContactCTA, CaseStudy
  i18n/               # routes.ts (route-map), utils.ts, ui.ts (chrome dict), legal.ts
  styles/
    global.css        # Tailwind imports + theme tokens
public/
  favicon.svg
```

## Content

### Current Pages

- `/` - On-demand redirect by browser language to `/de/` or `/en/`
- `/de/`, `/en/` - Bilingual homepage (hero, services, selected work)
- `/leistungen` ↔ `/en/services` - Capabilities page (procurement-facing) + homepage teaser
- `/de/blog` ↔ `/en/blog` - Blog index + posts (MDX). EN lists all posts; DE lists translated posts plus an "only in English" affordance for unpaired ones
- `/impressum`, `/datenschutz` (both locales) - Legal pages (§5 DDG Impressum, minimised Datenschutz)
- `/kontakt` ↔ `/en/contact` - Contact page (Web3Forms; email + form is the Impressum's second contact)
- `/arbeiten` ↔ `/en/work` - Work index + two anonymized demonstrator case studies (offer-map, editorial-workflow). Data-driven win-flip (see Gotchas)

### Planned

- (no page-level items outstanding; D1-D4 + E1 content built. F1 nav/footer wiring + route audit DONE; G2 WCAG 2.1 AA pass DONE (Pa11y 24/24 0 errors, Lighthouse a11y=100, see BUILD-NOTES-integration-a11y.md). Remaining: G1 (fresh Handelsregister check before the Impressum goes public) and G3 (final build + `vercel --prod` deploy + post-deploy smoke) per PLAN.md. NOT yet deployed.)

## Blog Infrastructure

- **Content**: MDX files in `src/content/blog/{de,en}/` (locale = first path segment of the entry id)
- **Schema**: Defined in `src/content/config.ts` (Content Layer glob loader) with Zod validation; `translationKey` is optional and pairs locale siblings
- **CTA required**: Every blog post must have a `cta` frontmatter block (headline, description, buttonText). Build fails without it.

### Blog Post Frontmatter

```yaml
---
title: "Post Title"
description: "Meta description"
publishedAt: 2026-01-28
author: "Christo Wilken"
tags: ["tag1", "tag2"]
cta:
  headline: "CTA headline"
  description: "CTA description"
  buttonText: "Button text"
---
```

## Forms

**Web3Forms** for serverless form handling (free tier: 250/mo).

- **Dashboard**: https://app.web3forms.com
- **Access key**: In `src/components/BlogCTA.astro`
- **Submissions**: Stored 30 days on free plan

**⚠️ Gmail spam issue**: First Web3Forms notification may land in spam. Mark as "not spam" or create filter for `from:notify@web3forms.com`. <!-- added: 2026-02-01 -->

## Development

```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Infrastructure

**Hosting**: Vercel (auto-deploys from `main`)
**CDN/Proxy**: Cloudflare (nameservers: anahi/rodrigo.ns.cloudflare.com) <!-- added: 2026-02-02 -->
**Domain**: 9592.tech (managed in Cloudflare)

Traffic flow: User → Cloudflare → Vercel

**Cloudflare features available:**
- Bot protection (Security → Bots)
- Rate limiting (Security → WAF → Rate limiting rules)
- Turnstile (CAPTCHA for specific actions - doesn't require domain move, can be added standalone)

**Verify Cloudflare is proxying:** Check for `cf-ray` and `server: cloudflare` headers.

## Deployment

Vercel auto-deploys from `main` branch.

```bash
npx vercel        # Deploy preview
npx vercel --prod # Deploy production
```

### Workflow

**Always preview locally before deploying to production.** Use `npm run dev` and Playwright to verify changes visually before running `vercel --prod`.

For pixel-perfect adjustments, use Playwright's `browser_evaluate()` to tweak styles in real-time before committing to code.

## Reference Material

For profile content and project details: `~/memex/2_Areas/Self/Profile/`

## Gotchas

**Astro i18n routing (`prefixDefaultLocale: true`)** <!-- added: 2026-05-23 -->: Both locales are explicitly prefixed (`/de/...`, `/en/...`); all content pages live under `src/pages/<locale>/`. There is no content page at the bare root: `src/pages/index.astro` is an on-demand (`export const prerender = false`) redirector that reads `Accept-Language` and 302s to `/de/` or `/en/` (real per-request decision, so `redirectToDefaultLocale: false` in `astro.config.mjs`). **Gotcha:** a physical unprefixed route (a file directly under `src/pages/` rather than under a locale folder) still PRERENDERS to a static file in `npm run build` even though `astro dev` returns 404 for it at the locale-prefix check. So such routes work in production (Vercel serves the static file) but appear broken in dev. Don't "fix" a dev-only 404 on an unprefixed legacy route by panicking; check the build output. i18n single-source-of-truth lives in `src/i18n/`: `routes.ts` (page-key -> per-locale slug map; localized slugs leistungen/services, arbeiten/work), `utils.ts` (`getLangFromUrl`, `localizedPath`, `pickLocaleFromAcceptLanguage`, `useTranslations`), `ui.ts` (chrome-string dictionary), `legal.ts` (the ONE legal-entity constant consumed by Impressum, footer, and JSON-LD; register fact = Amtsgericht München, no public phone). `<html lang>`, hreflang (x-default -> /en), and og:locale are set in `Layout.astro` from the active locale + an optional `pageKey` prop.

**Accessibility / Pa11y gate (WCAG 2.1 AA)** <!-- added: 2026-05-23 -->: Verified with Pa11y-CI (axe + htmlcs, WCAG2AA) + Lighthouse mobile, modelled on the demos' config. Gate met: 24/24 pages 0 errors, Lighthouse a11y=100, mobile perf >=90 on key pages (full results + measured contrast ratios in `BUILD-NOTES-integration-a11y.md`). Gotchas for re-running: (1) **pa11y types axe `incomplete`/needs-review (`needsFurtherReview:true`) as `error`.** Use `levelCapWhenNeedsReview: "warning"` in the pa11y config so "0 errors" means 0 real *violations*. The legitimate needs-review here is **Mermaid SVG text** (axe cannot measure SVG contrast; the labels render `#fafafa` on dark = 17:1, i.e. actually passing) on the one diagram post. (2) **axe color-contrast checks VISIBLE text even when `aria-hidden`** (low contrast still harms sighted low-vision users), so aria-hidden does NOT exempt text from contrast, and bare decorative glyph nodes (literal `&rarr;`/`&larr;`) trip a "non-text characters" needs-review — render arrows as CSS generated content on an empty aria-hidden span (`.deco-arrow-l`/`.deco-arrow-r` in `global.css`), never as literal entity text. (3) **pa11y-ci buffers per-URL output to the end** (looks hung but isn't) and can exhaust resources at high concurrency — run with `concurrency:1` and let it finish, or drive `pa11y` per-URL with `timeout`. (4) pa11y's JSON reporter strips axe's computed fg/bg/ratio — to see real numbers, run axe-core directly via puppeteer. (5) Touch-target sizing only matters on touch: verify with an emulated touch device (`pointer: coarse`), where the switcher links and submit buttons expand to 44x44; small mouse targets on desktop are fine. Tokens: dim text = `text-text-muted` (#888, 5.58:1); white-text button fills = `--color-accent-strong` (#2563eb), never `--color-accent` (3.68:1 with white).

**Legacy redirects on the Vercel adapter** <!-- added: 2026-05-23 -->: `redirects` in `astro.config.mjs` become **exact-anchored** regex routes in `.vercel/output/config.json` (`^/path$`), with NO automatic trailing-slash normalization. Directory-format builds make `/foo/` (trailing slash) the canonical, so a legacy redirect needs BOTH the `/foo` and `/foo/` keys or the canonical inbound form 404s on the real Vercel edge. The three legacy `/blog/<slug>` 301s list both forms for this reason. `astro dev` is more forgiving (matches both) so it masks the gap — verify redirect behaviour against the Vercel routing model, not just dev.

**Mermaid diagrams in blog posts** <!-- added: 2026-05-21 -->: Client-side Mermaid is wired in `src/pages/[lang]/blog/[...slug].astro` and triggers on any fenced `mermaid` block in MDX. **Selector caveat**: Astro's default Shiki syntax-highlighter rewrites fenced blocks and strips the `language-mermaid` class from the `<code>` element. The standard `pre > code.language-mermaid` selector returns 0 nodes. Use `pre[data-language="mermaid"]` instead and read `textContent` from the `<pre>` itself (Shiki splits source across many spans; `textContent` reassembles cleanly). Theme variables in the `mermaid.initialize` config match the site's dark palette; if you re-theme the site, update those too. Quote node labels containing `=`, `:`, or `@` (Mermaid 11+ parser sees them as link-IDs otherwise). **Perf (G2):** Mermaid is ~0.5MB; it is `await import()`ed (dynamic) only when the page actually contains a `pre[data-language="mermaid"]` block. Do NOT convert this back to a top-level `import mermaid` — that ships the bundle on every blog post (eager import measured LCP 5.3s / Lighthouse perf 67 on text-only posts; dynamic import → perf 97+). Only the one post that uses diagrams pays the cost. **A11y (G2):** each rendered diagram gets `role="img"` + an `aria-label` taken from the introducing sentence (faithful text equivalent, since SVG diagrams are not reliably read), and the inner `<svg>` is `aria-hidden`. axe still cannot compute SVG text contrast, so the diagrams produce axe needs-review (see the Pa11y gotcha) — that is expected, not a failure.

**Blog i18n / content collection (E1)** <!-- added: 2026-05-23 -->: The blog collection uses the **Astro 5 Content Layer glob loader** (`src/content/config.ts`), NOT legacy `type: 'content'`. This matters: under the glob loader the entry `id` is **extensionless** with the locale as its first path segment (`en/<slug>`, `de/<slug>`), so `const [lang, ...slug] = post.id.split('/')` and `render(post)` (top-level import from `astro:content`, not `post.render()`) work per the official Astro i18n recipe. Legacy `type: 'content'` keeps the `.mdx` extension in `post.id`, which would break that split. Posts live under `src/content/blog/{de,en}/`; routes are the dynamic `src/pages/[lang]/blog/{index,[...slug]}.astro` rendering `/de/blog/<slug>` + `/en/blog/<slug>` (both prefixed; directory build → trailing-slash canonical, so links/redirects use the trailing slash). `translationKey` (optional) pairs siblings: the `LanguageSwitcher` detects a blog-post path itself, queries the collection, and jumps to the sibling or degrades to the localized blog index (never a 404) without any change to the global Header/Footer/Layout chrome. The DE index surfaces English-only posts with the `blog.onlyEnglish` ui key (there is no `blog.onlyGerman`; add one only if a DE-only post is ever introduced). `BlogCTA.astro` takes an optional `lang` prop for German form chrome (defaults to `'en'`, so EN posts are unchanged). The remark footnotes heading ("Footnotes") is localized to "Quellen" on DE pages via the footnote script in `[...slug].astro` (the global markdown `footnoteLabel` can't vary per locale). Legacy `/blog/<slug>` URLs 301 to `/en/blog/<slug>/` via `redirects` in `astro.config.mjs` (the Vercel adapter emits real 301s; the sitemap excludes the redirect stubs). hreflang is NOT emitted on blog *posts* (Layout builds hreflang from `pageKey`, and posts have none); the blog *index* pages do emit it.

**Work section / case-study win-flip (D2)** <!-- added: 2026-05-23 -->: `/arbeiten` ↔ `/en/work` (index) plus two case studies are STATIC de/en pages (`src/pages/de/arbeiten{,/*}.astro`, `src/pages/en/work{,/*}.astro`), NOT a `[lang]` route. Each case study is driven by a data object in `src/data/work/<key>.ts` rendered through the shared `src/components/CaseStudy.astro` (prose via named slots `problem`/`approach`/`demonstrates`; the section labels live in a local per-locale dict inside that component, NOT `ui.ts`). **WIN-FLIP**: the boolean `anonymized` is the single award-day switch. `true` = generic title (authored in the page) + `Demonstrator/Arbeitsprobe` label + screenshots + a `Live-Demo auf Anfrage` callout that links to the contact page (no buyer URL). To go named + live on award, edit ONLY the data file: set `anonymized:false` and fill `liveUrl`/`buyerName`/`namedTitle`; the page then renders the named title + a live-link button (render branch is `study.anonymized` in `CaseStudy.astro`). Case-study sub-route slugs (`angebotskarte`/`offer-map`, `redaktions-workflow`/`editorial-workflow`) are hardcoded in the data `slug:{de,en}` map, NOT in `routes.ts`; the URL is built by `caseStudyPath()` in `src/data/work/index.ts`. Consequence: case-study pages pass `pageKey="arbeiten"`, so the global `LanguageSwitcher` degrades DE↔EN to the work *index* (never a 404), not the sibling case study, and hreflang points at the index pair (same tradeoff the blog solved with a switcher special-case; mirror that in the switcher if sibling-accurate work switching is ever wanted). The homepage demonstrator links (D4) should import `caseStudyPath` from `src/data/work`. Strip-list discipline carried into this section: the offer-map slug/title use the neutral `Angebotskarte` (never the buyer's `Angebotslandkarte`), the entry count is generalised ("weit über tausend" / "well over a thousand", since `1.600` is a strip token), and the nationwide-offers surface is omitted (absent in the prototype, no screenshot). Screenshot alt text is the single source in the data files (verified clean against `public/work/INVENTORY.md`).
