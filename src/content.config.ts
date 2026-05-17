import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ============================================================
   MARKDOWN CONTENT COLLECTIONS
   ============================================================ */

const builds = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/builds' }),
  schema: z.object({
    title: z.string(),
    specialization: z.enum([
      'Demolitionist',
      'Tech Operator',
      'Bulwark',
      'Vanguard',
      'Field Medic',
    ]),
    playstyle: z.enum(['DPS', 'Tank', 'Support', 'Hybrid', 'Solo']),
    pve: z.boolean(),
    pvp: z.boolean(),
    lastUpdated: z.coerce.date(),
    patch: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    featuredImage: z.string().optional(),
    author: z.string(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'Beginner',
      'Leveling',
      'Endgame',
      'PvP',
      'Farming',
      'Crafting',
      'General',
    ]),
    lastUpdated: z.coerce.date(),
    tags: z.array(z.string()),
    description: z.string(),
    author: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const patchNotes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/patch-notes' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    patchDate: z.coerce.date(),
    author: z.string(),
    summary: z.string(),
  }),
});

export const collections = {
  builds,
  guides,
  news,
  patchNotes,
};
