import { getCollection } from 'astro:content';

export async function GET() {
  const allBuilds = await getCollection('builds');
  const allGuides = await getCollection('guides');
  const allNews = await getCollection('news');
  const allPatchNotes = await getCollection('patchNotes');

  const searchIndex = [];

  // Map Builds
  allBuilds.forEach(post => {
    searchIndex.push({
      title: post.data.title,
      url: `/builds/${post.id}/`,
      type: 'Build',
      description: post.data.description,
      tags: post.data.tags || [],
      content: `${post.data.title} ${post.data.description} ${post.data.specialization} ${post.data.playstyle}`
    });
  });

  // Map Guides
  allGuides.forEach(post => {
    searchIndex.push({
      title: post.data.title,
      url: `/guides/${post.id}/`,
      type: 'Guide',
      description: post.data.description,
      tags: post.data.tags || [],
      content: `${post.data.title} ${post.data.description} ${post.data.category}`
    });
  });

  // Map News
  allNews.forEach(post => {
    searchIndex.push({
      title: post.data.title,
      url: `/news/${post.id}/`,
      type: 'News',
      description: post.data.description,
      tags: post.data.tags || [],
      content: `${post.data.title} ${post.data.description}`
    });
  });

  // Map Patch Notes
  allPatchNotes.forEach(post => {
    searchIndex.push({
      title: post.data.title,
      url: `/patch-notes/${post.id}/`,
      type: 'Patch Notes',
      description: post.data.summary,
      tags: [],
      content: `${post.data.title} ${post.data.summary} ${post.data.version}`
    });
  });

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    }
  });
}
