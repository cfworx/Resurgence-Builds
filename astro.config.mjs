// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import rehypeExternalLinks from 'rehype-external-links';
import rehypeCallouts from './scripts/rehype-callouts.mjs';
import rehypeAdsense from './scripts/rehype-adsense.mjs';
import rehypeTableA11y from './scripts/rehype-table-a11y.mjs';
// Static fallback date — update this whenever you do a major site update
const SITE_LAST_UPDATED = new Date().toISOString().slice(0, 10);

// Build the set of indexed tag slugs from tag-intros.json
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tagIntros = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src', 'data', 'tag-intros.json'), 'utf-8')
);
const INDEXED_TAGS = new Set(Object.keys(tagIntros));

export default defineConfig({
  site: 'https://resurgencebuilds.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/tag/general/': '/guides/',
    '/build-planner/': '/builder/',
    '/cdn-cgi/l/email-protection': '/',
    '/tag/v1.1.1/': '/patch-notes/',
    '/tag/v1.1.2/': '/patch-notes/',
    '/tag/v1.2.0/': '/patch-notes/',
    '/tag/v1.1.2.2/': '/patch-notes/',
    '/tag/v1.2.1/': '/patch-notes/',
    '/ai.txt': '/llms.txt',
    '/.well-known/ai.txt': '/llms.txt',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        // Exclude known non-content paths
        if (
          page.includes('/api/') ||
          page.includes('/cdn-cgi/') ||
          page.includes('/build-planner/') ||
          page.includes('/map/')
        ) return false;

        // For /tag/ pages, only include if the slug is in tag-intros.json
        const tagMatch = page.match(/\/tag\/([^/]+)\/?$/);
        if (tagMatch) return INDEXED_TAGS.has(tagMatch[1]);

        return true;
      },
      serialize(item) {
        const url = item.url;

        // --- Homepage ---
        if (url === 'https://resurgencebuilds.com/') {
          return { ...item, priority: 1.0, changefreq: 'weekly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Index listing pages ---
        if (
          url === 'https://resurgencebuilds.com/builds/' ||
          url === 'https://resurgencebuilds.com/guides/' ||
          url === 'https://resurgencebuilds.com/news/' ||
          url === 'https://resurgencebuilds.com/patch-notes/'
        ) {
          return { ...item, priority: 0.9, changefreq: 'weekly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Tier List ---
        if (url === 'https://resurgencebuilds.com/tier-list/') {
          return { ...item, priority: 0.8, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- About ---
        if (url === 'https://resurgencebuilds.com/about/') {
          return { ...item, priority: 0.4, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Build Planner ---
        if (url.includes('/builder/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Individual build guides ---
        if (url.includes('/builds/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }

        // --- Database pages ---
        if (url.includes('/database/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Map page ---
        if (url.includes('/division-resurgence-interactive-map/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- News articles ---
        if (url.includes('/news/')) {
          return { ...item, priority: 0.7, changefreq: 'never' };
        }

        // --- Patch notes ---
        if (url.includes('/patch-notes/')) {
          return { ...item, priority: 0.6, changefreq: 'never' };
        }

        // --- Guides ---
        if (url.includes('/guides/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }

        // --- Legal / utility pages ---
        if (
          url.includes('/privacy/') ||
          url.includes('/terms/') ||
          url.includes('/dmca/') ||
          url.includes('/contact/')
        ) {
          return { ...item, priority: 0.3, changefreq: 'never', lastmod: SITE_LAST_UPDATED };
        }

        // --- Class pages ---
        if (url.includes('/class/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Tag archive pages ---
        if (url.includes('/tag/')) {
          return { ...item, priority: 0.4, changefreq: 'weekly', lastmod: SITE_LAST_UPDATED };
        }

        // Fallback
        return { ...item, priority: 0.5, changefreq: 'monthly' };
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeCallouts,
      rehypeAdsense,
      rehypeTableA11y
    ]
  },
});
