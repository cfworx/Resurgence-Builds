// Where a tag chip should link.
// Most tags have a /tag/<slug>/ archive. A few old archives were retired and now 301
// elsewhere (see public/_redirects and the redirects in astro.config.mjs), so chips for
// those tags link straight to the destination instead of through a redirect.

const RETIRED_TAG_DESTINATIONS: Record<string, string> = {
  general: '/guides/',
  'v1.1.1': '/patch-notes/',
  'v1.1.2': '/patch-notes/',
  'v1.1.2.2': '/patch-notes/',
  'v1.2.0': '/patch-notes/',
  'v1.2.1': '/patch-notes/',
};

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function tagHref(tag: string): string {
  const slug = tagSlug(tag);
  return RETIRED_TAG_DESTINATIONS[slug] ?? `/tag/${slug}/`;
}
