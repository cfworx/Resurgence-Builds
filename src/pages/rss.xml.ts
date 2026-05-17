import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const news = await getCollection('news');
  const patchNotes = await getCollection('patchNotes');

  const allItems = [
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
    title: 'Resurgence Builds',
    description: 'Builds, guides, tier lists, and news for Tom Clancy\'s The Division Resurgence.',
    site: context.site!.toString(),
    items: allItems,
    customData: '<language>en-us</language>',
  });
}
