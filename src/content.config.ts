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
    // false = a creator's build we have documented but not re-tested ourselves (no "Verified" badge, not ranked on the tier list)
    verified: z.boolean().optional(),
    tags: z.array(z.string()),
    description: z.string(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
    subtitle: z.string().optional(),
    subclass: z.string().optional(),
    author: z.string(),
    shareTitle: z.string().optional(),
    shareText: z.string().optional(),
    plannerHash: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    sources: z.array(z.string()).optional(),
    videoId: z.string().optional(),
    videoTitle: z.string().optional(),
    videoChannel: z.string().optional(),
    // Upload date and length as YouTube lists them (ISO 8601). VideoObject markup needs the
    // upload date, so a video without one is embedded with no markup.
    videoUploadDate: z.string().optional(),
    videoDuration: z.string().optional(),
    howTo: z.object({
      name: z.string(),
      description: z.string(),
      totalTime: z.string(),
      tool: z.array(z.string()),
      steps: z.array(z.object({
        name: z.string(),
        text: z.string()
      }))
    }).optional(),
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
    // first published (used for datePublished and the homepage feed); lastUpdated = last material update
    publishDate: z.coerce.date().optional(),
    lastUpdated: z.coerce.date(),
    tags: z.array(z.string()),
    description: z.string(),
    author: z.string().optional(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
    shareTitle: z.string().optional(),
    shareText: z.string().optional(),
    howTo: z.object({
      name: z.string(),
      description: z.string(),
      totalTime: z.string(),
      tool: z.array(z.string()),
      steps: z.array(z.object({
        name: z.string(),
        text: z.string()
      }))
    }).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    videoId: z.string().optional(),
    videoTitle: z.string().optional(),
    videoChannel: z.string().optional(),
    // Upload date and length as YouTube lists them (ISO 8601). VideoObject markup needs the
    // upload date, so a video without one is embedded with no markup.
    videoUploadDate: z.string().optional(),
    videoDuration: z.string().optional(),
    sources: z.array(z.string()).optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    shareTitle: z.string().optional(),
    shareText: z.string().optional(),
    tags: z.array(z.string()),
    description: z.string(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    sources: z.array(z.string()).optional(),
  }),
});

const patchNotes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/patch-notes' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    patchDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    shareTitle: z.string().optional(),
    shareText: z.string().optional(),
    summary: z.string(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    sources: z.array(z.string()).optional(),
  }),
});

export const collections = {
  builds,
  guides,
  news,
  patchNotes,
};
