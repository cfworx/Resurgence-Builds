import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const builds = await getCollection('builds');
  const guides = await getCollection('guides');
  const news = await getCollection('news');
  const patchNotes = await getCollection('patchNotes');

  const allItems = [
    ...builds.map((post) => ({
      title: post.data.title,
      pubDate: post.data.lastUpdated,
      description: post.data.description,
      link: `/builds/${post.id}/`,
    })),
    ...guides.map((post) => ({
      title: post.data.title,
      pubDate: post.data.lastUpdated,
      description: post.data.description,
      link: `/guides/${post.id}/`,
    })),
    ...news.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/news/${post.id}/`,
    })),
    ...patchNotes.map((pn) => ({
      title: pn.data.title,
      pubDate: pn.data.patchDate,
      description: pn.data.summary,
      link: `/patch-notes/${pn.id}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Resurgence Builds — Builds, Guides & News',
    description: 'Builds, guides, tier lists, and news for Tom Clancy\'s The Division Resurgence.',
    site: context.site!.toString(),
    items: allItems,
    customData: '<language>en-us</language>',
  });
}
