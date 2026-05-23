import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Astro 5 Content Layer (glob loader). Locale is the first path segment of each
// entry id: src/content/blog/en/<slug>.mdx -> id "en/<slug>", de/<slug>.mdx -> "de/<slug>".
// Pages derive `lang` via `post.id.split('/')` (the official Astro i18n recipe shape).
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // For article structured data
    author: z.string().default('Christo Wilken'),
    // Optional OG image override
    ogImage: z.string().optional(),
    // Tags for categorization
    tags: z.array(z.string()).default([]),
    // Pairs a post with its sibling in the other locale (same value in de/ and en/).
    // Optional: single-language posts are legal and must not break the build.
    translationKey: z.string().optional(),
    // CTA configuration - required for each post
    cta: z.object({
      headline: z.string(),
      description: z.string(),
      buttonText: z.string(),
      fields: z.array(z.enum(['email', 'website'])).default(['email', 'website']),
      href: z.string().url().optional(),
    }),
  }),
});

export const collections = { blog };
