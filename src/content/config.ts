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
  }),
});

export const collections = { blog };
