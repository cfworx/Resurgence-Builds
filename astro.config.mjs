// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import rehypeExternalLinks from 'rehype-external-links';
import rehypeAdsense from './scripts/rehype-adsense.mjs';
// Static fallback date — update this whenever you do a major site update
const SITE_LAST_UPDATED = '2026-05-20';

export default defineConfig({
  site: 'https://resurgencebuilds.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        const url = item.url;

        // --- Homepage ---
        if (url === 'https://resurgencebuilds.com/') {
          return { ...item, priority: 1.0, changefreq: 'weekly', lastmod: SITE_LAST_UPDATED };
        }

        // --- Index listing pages ---
        if (
          url === 'https://resurgencebuilds.com/builds/' ||
          url === 'https://resurgencebuilds.com/news/' ||
          url === 'https://resurgencebuilds.com/patch-notes/'
        ) {
          return { ...item, priority: 0.9, changefreq: 'weekly', lastmod: SITE_LAST_UPDATED };
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
          url.includes('/dmca/')
        ) {
          return { ...item, priority: 0.3, changefreq: 'never', lastmod: SITE_LAST_UPDATED };
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
      rehypeAdsense
    ]
  },
});
