// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
  site: 'https://9592.tech',
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      // Both locales explicitly prefixed (/de/..., /en/...); no unprefixed content tree.
      prefixDefaultLocale: true,
      // We own `/` ourselves (src/pages/index.astro) for a real per-request
      // Accept-Language redirect, so disable Astro's static `/` -> /de default.
      redirectToDefaultLocale: false,
    },
  },
  // PC6: the three legacy English posts moved under /en/blog/. 301 the old unprefixed
  // URLs to their new homes so inbound links keep working. The Vercel adapter emits
  // these as real HTTP redirects in the build output.
  redirects: {
    '/blog/ai-support-premium-service-businesses': {
      status: 301,
      destination: '/en/blog/ai-support-premium-service-businesses/',
    },
    '/blog/claude-code-workflow-tool-first-look': {
      status: 301,
      destination: '/en/blog/claude-code-workflow-tool-first-look/',
    },
    '/blog/epd-cost-crisis-small-manufacturers': {
      status: 301,
      destination: '/en/blog/epd-cost-crisis-small-manufacturers/',
    },
  },
  markdown: {
    remarkPlugins: [remarkGfm],
  },
  integrations: [mdx(), sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});