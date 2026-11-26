import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Google reads a VideoObject's uploadDate as a date and time with a time zone, and flags a bare date
// ("missing a timezone", "invalid datetime value"). Use YouTube's own value, such as
// 2026-10-16T04:00:15-07:00; when only the day is known, use noon UTC on it (2026-10-31T12:00:00Z),
// which is the same calendar day across the Americas, Europe and most of Asia.
const uploadDate = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
    'videoUploadDate needs a date, time and time zone, such as 2026-10-16T04:00:15-07:00 (or 2026-10-31T12:00:00Z when only the day is known)')
  .optional();

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
    videoUploadDate: uploadDate,
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
    videoUploadDate: uploadDate,
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
    /** Kept for readers but out of Google: "noindex, follow" and left out of the sitemap (astro.config.mjs). */
    noindex: z.boolean().optional(),
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

// Reviews of things we own: controllers, Division books and comics (see CLAUDE.md, "Reviews, gear and gift pages").
// The box at the top of the page comes from `product`. A score is shown only when the owner gave one himself.
const reviews = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['Controller', 'Book', 'Art book', 'Comic', 'Novel', 'Game']),
    publishDate: z.coerce.date(),
    lastUpdated: z.coerce.date(),
    description: z.string(),
    author: z.string().optional(),
    featuredImage: z.string().optional(),
    imageAlt: z.string().optional(),
    shareTitle: z.string().optional(),
    shareText: z.string().optional(),
    product: z.object({
      name: z.string(),
      summary: z.string(),                       // what it is, in one or two sentences
      owned: z.string(),                         // "RapidF5's own copy, photographed November 15, 2026"
      facts: z.array(z.object({ label: z.string(), value: z.string() })),
      goodFor: z.array(z.string()).optional(),   // "Buy it if"
      notFor: z.array(z.string()).optional(),    // "Skip it if"
      // Where to buy. An Amazon link carries our tag (https://www.amazon.com/dp/<ASIN>?tag=...) and no price, ever.
      buy: z.array(z.object({ label: z.string(), href: z.string().url(), note: z.string().optional() })).optional(),
      buyNote: z.string().optional(),            // one line under the buttons: out of print, which edition, and so on
      // The owner's own score out of 10, in his words. Never filled in for him.
      score: z.object({ value: z.number().min(0).max(10), by: z.string(), note: z.string().optional() }).optional(),
      // What the page is about, for search engines: a book (with the ISBN printed on our copy) or a thing
      about: z.object({
        type: z.enum(['Book', 'Thing']),
        name: z.string(),
        isbn: z.string().optional(),
        author: z.string().optional(),
        publisher: z.string().optional(),
        url: z.string().url().optional(),
      }).optional(),
    }),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    sources: z.array(z.string()).optional(),
  }),
});

// Translations of guides (TRANSLATIONS.md). One file per language and guide: src/content/translations/<lang>/<guide id>.md.
// The page is served at /<lang>/guides/<guide id>/ and borrows the English guide's picture, author and dates.
const translations = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/translations' }),
  schema: z.object({
    lang: z.string(),                       // a code from src/data/languages.ts
    source: z.string(),                     // id of the English guide
    title: z.string(),
    description: z.string(),
    imageAlt: z.string().optional(),
    // lastUpdated of the English guide when this translation was made: a newer English date marks the page as behind
    sourceUpdated: z.coerce.date(),
    translatedAt: z.coerce.date(),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    sources: z.array(z.string()).optional(),
  }),
});

export const collections = {
  builds,
  guides,
  news,
  patchNotes,
  reviews,
  translations,
};
