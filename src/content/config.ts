import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    book: z.string(),
    subtitle: z.string().optional(),
    isCover: z.boolean().optional(),
    hidden: z.boolean().optional(),
  }),
});

const bookMeta = defineCollection({
  loader: glob({ pattern: '**/book.json', base: './src/content/books' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    author: z.string(),
    lang: z.string(),
    cover: z.string().optional(),
    description: z.string(),
    license: z.string().optional(),
    publishedAt: z.string().optional(),
  }),
});

export const collections = { books, bookMeta };
