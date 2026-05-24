// @ts-check
import { defineConfig } from 'astro/config';
import { readFile, writeFile } from 'node:fs/promises';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';

// Make the legacy /blog/<slug> 301s tolerate an optional trailing slash on the
// real Vercel edge. The @astrojs/vercel adapter builds each redirect route's
// `src` from the path SEGMENTS, which drop the trailing slash, so both the
// `/blog/<slug>` and `/blog/<slug>/` keys in `redirects` collapse to the same
// anchored regex `^/blog/<slug>$` (emitted twice as identical duplicates). With
// Astro's default `trailingSlash: 'ignore'` no normalization route is emitted,
// so the canonical trailing-slash form `/blog/<slug>/` (the directory-format
// canonical that search engines indexed) matches no route and 404s in prod.
// `astro dev` masks this because it matches both forms. We can't influence the
// emitted regex through the `redirects` config, so we post-process the built
// Build Output API config here: rewrite the trailing `$` to `/?$` on the legacy
// blog redirects and drop exact-duplicate routes. Runs inside `astro build`, so
// it applies whether Vercel invokes `astro build` or `npm run build`.
function patchLegacyBlogRedirects() {
  let configRoot;
  return {
    name: 'patch-legacy-blog-redirects',
    hooks: {
      'astro:config:done': ({ config }) => {
        configRoot = config.root;
      },
      'astro:build:done': async ({ logger }) => {
        const configPath = new URL('.vercel/output/config.json', configRoot);
        const vercelConfig = JSON.parse(await readFile(configPath, 'utf-8'));
        const routes = vercelConfig.routes ?? [];

        // Legacy blog redirect: a 301 whose source anchors on /blog/<slug> and
        // whose destination is the post's new home under /en/blog/.
        const isLegacyBlogRedirect = (route) =>
          route?.status === 301 &&
          typeof route.src === 'string' &&
          route.src.startsWith('^/blog/') &&
          typeof route.headers?.Location === 'string' &&
          route.headers.Location.startsWith('/en/blog/');

        let patched = 0;
        for (const route of routes) {
          if (isLegacyBlogRedirect(route) && route.src.endsWith('$') && !route.src.endsWith('/?$')) {
            route.src = `${route.src.slice(0, -1)}/?$`;
            patched++;
          }
        }

        // Drop exact-duplicate routes (the adapter emits each slug twice).
        const seen = new Set();
        vercelConfig.routes = routes.filter((route) => {
          const key = JSON.stringify(route);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (patched === 0) {
          throw new Error(
            'patch-legacy-blog-redirects: expected at least one legacy /blog/<slug> 301 to patch, found none. ' +
              'The Vercel adapter output shape may have changed; verify .vercel/output/config.json.'
          );
        }

        await writeFile(configPath, JSON.stringify(vercelConfig, null, 2));
        logger.info(`patched ${patched} legacy blog redirect(s) to tolerate a trailing slash`);
      },
    },
  };
}

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
  // each of these as an exact-anchored regex route `^/blog/<slug>$` (the trailing
  // slash is dropped at segment parsing, so listing both URL forms here is futile;
  // see the patchLegacyBlogRedirects integration below, which makes the emitted
  // route tolerate an optional trailing slash).
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
    // Default Shiki theme (github-dark) renders comment tokens at ~3:1 on its own
    // background, below WCAG AA. github-dark-high-contrast lifts every token to >=4.5:1.
    shikiConfig: {
      theme: 'github-dark-high-contrast',
    },
  },
  integrations: [mdx(), sitemap(), patchLegacyBlogRedirects()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});