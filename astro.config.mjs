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