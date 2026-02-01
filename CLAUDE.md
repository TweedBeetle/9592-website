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
- **Fonts**: Inter (body), JetBrains Mono (code)

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
    Layout.astro      # Base HTML layout
  pages/
    index.astro       # Homepage
  components/         # Reusable components (as needed)
  styles/
    global.css        # Tailwind imports + theme tokens
public/
  favicon.svg
```

## Content

### Current Pages

- `/` - Homepage with hero, services, selected work
- `/blog` - Blog index and posts (MDX)

### Planned

- `/work` - Case studies

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
