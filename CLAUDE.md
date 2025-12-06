# 9592 Solutions Website

Personal/business website for Christo Wilken / 9592 Solutions.

## Stack

- **Framework**: Astro (static site generator)
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel
- **Domain**: 9592.tech

## Design System

### Colors

Dark mode primary:

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#0a0a0a` | Page background |
| `bg-secondary` | `#141414` | Card/section backgrounds |
| `text-primary` | `#fafafa` | Headings, important text |
| `text-secondary` | `#a1a1a1` | Body text, descriptions |
| `accent` | `#3b82f6` | Links, highlights (blue-500) |

### Typography

- **Headings**: Inter (system fallback: sans-serif)
- **Body**: Inter
- **Code/technical**: JetBrains Mono or system monospace

### Spacing

Use Tailwind's default scale. Prefer generous whitespace:
- Section padding: `py-24` or `py-32`
- Content max-width: `max-w-3xl` for text, `max-w-5xl` for wider layouts

## Project Structure

```
src/
  layouts/
    Layout.astro      # Base HTML layout
  pages/
    index.astro       # Homepage
  styles/
    global.css        # Tailwind imports + custom CSS
  components/         # Reusable components (as needed)
public/
  favicon.svg
```

## Content

### Current Pages

- `/` - Homepage with hero, brief intro, contact CTA

### Planned

- `/blog` - Blog posts (MDX)
- `/work` - Case studies

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

Vercel auto-deploys from `main` branch.

```bash
npx vercel        # Deploy preview
npx vercel --prod # Deploy production
```

## Contact

- Email: christo@9592.tech
- No contact form (intentional)
