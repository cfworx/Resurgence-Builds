// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://resurgencebuilds.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ]
  },
});
