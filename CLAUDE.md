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
    blog/             # Blog (English, unprefixed for now; E1 relocates under locales)
  components/         # Header, Footer, LanguageSwitcher, BlogCTA, ContactCTA
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
- `/blog` - Blog index and posts (MDX, English; E1 relocates under `/de/blog` + `/en/blog`)
- `/impressum`, `/datenschutz` (both locales) - Legal pages (§5 DDG Impressum, minimised Datenschutz)
- `/kontakt` ↔ `/en/contact` - Contact page (Web3Forms; email + form is the Impressum's second contact)

### Planned

- `/arbeiten` ↔ `/en/work` - Case studies (D2)

## Blog Infrastructure

- **Content**: MDX files in `src/content/blog/`
- **Schema**: Defined in `src/content/config.ts` with Zod validation
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

**Astro i18n routing (`prefixDefaultLocale: true`)** <!-- added: 2026-05-23 -->: Both locales are explicitly prefixed (`/de/...`, `/en/...`); all content pages live under `src/pages/<locale>/`. There is no content page at the bare root: `src/pages/index.astro` is an on-demand (`export const prerender = false`) redirector that reads `Accept-Language` and 302s to `/de/` or `/en/` (real per-request decision, so `redirectToDefaultLocale: false` in `astro.config.mjs`). **Gotcha:** a physical unprefixed route (e.g. legacy `src/pages/blog/*`) still PRERENDERS to a static file in `npm run build` even though `astro dev` returns 404 for it at the locale-prefix check. So such routes work in production (Vercel serves the static file) but appear broken in dev. Don't "fix" a dev-only 404 on an unprefixed legacy route by panicking; check the build output. i18n single-source-of-truth lives in `src/i18n/`: `routes.ts` (page-key -> per-locale slug map; localized slugs leistungen/services, arbeiten/work), `utils.ts` (`getLangFromUrl`, `localizedPath`, `pickLocaleFromAcceptLanguage`, `useTranslations`), `ui.ts` (chrome-string dictionary), `legal.ts` (the ONE legal-entity constant consumed by Impressum, footer, and JSON-LD; register fact = Amtsgericht München, no public phone). `<html lang>`, hreflang (x-default -> /en), and og:locale are set in `Layout.astro` from the active locale + an optional `pageKey` prop.

**Mermaid diagrams in blog posts** <!-- added: 2026-05-21 -->: Client-side Mermaid is wired in `src/pages/blog/[...slug].astro` and triggers on any fenced `mermaid` block in MDX. **Selector caveat**: Astro's default Shiki syntax-highlighter rewrites fenced blocks and strips the `language-mermaid` class from the `<code>` element. The standard `pre > code.language-mermaid` selector returns 0 nodes. Use `pre[data-language="mermaid"]` instead and read `textContent` from the `<pre>` itself (Shiki splits source across many spans; `textContent` reassembles cleanly). Theme variables in the `mermaid.initialize` config match the site's dark palette; if you re-theme the site, update those too. Quote node labels containing `=`, `:`, or `@` (Mermaid 11+ parser sees them as link-IDs otherwise).
