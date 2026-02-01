import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
    // CTA configuration - required for each post
    cta: z.object({
      headline: z.string(),
      description: z.string(),
      buttonText: z.string(),
      fields: z.array(z.enum(['email', 'website'])).default(['email', 'website']),
    }),
  }),
});

export const collections = { blog };
