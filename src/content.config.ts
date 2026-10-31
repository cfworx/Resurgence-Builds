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
    // false = a creator's build we have documented but not re-tested ourselves (a "Creator build" badge instead of "Verified")
    verified: z.boolean().optional(),
    // true = our own original design, put together from the in-game Build-Making Database rather than
    // documented from a creator. Set verified: false with it until RapidF5 has played it: the page gets
    // an "Original build" badge instead of "Creator build" (and no green Verified badge).
    original: z.boolean().optional(),
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
    // The channel's YouTube address, only when verified: it becomes the video markup's author.url
    videoChannelUrl: z.string().url().optional(),
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
    // The loadout panel at the top of the page (src/components/BuildLoadout.astro). Names are the game's, exactly as
    // the Build-Making Database records them; scripts/check-rolls.mjs checks every roll against the Source lists.
    loadout: z.object({
      statsFrom: z.string().optional(),            // whose numbers: "GGReborn's loadout screen", "On paper"
      stats: z.array(z.object({ value: z.coerce.string(), label: z.string() })).max(3).optional(),
      must: z.array(z.string()).optional(),        // the one or two pieces the build can't work without
      weapons: z.array(z.object({
        role: z.string(),                          // Primary, Secondary
        name: z.string(),
        exotic: z.boolean().optional(),
        tier: z.string().optional(),               // only when the creator's copy differs from the Armory tier
        note: z.string().optional(),               // "Level 50 · Shotgun Extended Magazine"
        talents: z.array(z.string()).optional(),   // an exotic's own talent is added automatically
        attrs: z.array(z.string()).optional(),
      }).strict()).min(1).max(2),
      os: z.object({ name: z.string(), note: z.string().optional() }).strict().optional(),
      mods: z.array(z.string()).max(3).optional(),
      gear: z.array(z.object({
        slot: z.enum(['Mask', 'Body Armor', 'Backpack', 'Gloves', 'Holster', 'Knee Pads']),
        set: z.string(),
        piece: z.string().optional(),              // the creator's piece, when the source names it
        any: z.boolean().optional(),               // any piece of the set, any tier
        options: z.array(z.string()).optional(),   // the only pieces that carry this set and talent
        talent: z.string().optional(),             // body armor and backpack only
        note: z.string().optional(),
        attrs: z.array(z.string()).optional(),
      }).strict()).length(6),
      notes: z.array(z.object({ label: z.string(), text: z.string() })).optional(),
    }).strict().optional(),
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
    // The channel's YouTube address, only when verified: it becomes the video markup's author.url
    videoChannelUrl: z.string().url().optional(),
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
