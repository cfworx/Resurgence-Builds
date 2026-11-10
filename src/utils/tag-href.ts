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

// What a tag chip shows. Older posts carry slug-style tags ("tech-operator", "build-guide") next to
// plainly written ones ("Tech Operator"), so the same word showed up two ways on one page. Slug-style
// tags read with spaces; real hyphenated words and names ("Multi-Shot", "off-meta") keep their hyphen.
const HYPHENATED_TAGS = new Set(['off-meta', 'cross-play', 'cross-save', 'cross-progression', 'free-to-play']);

export function tagLabel(tag: string): string {
  if (tag !== tag.toLowerCase() || /\s/.test(tag) || HYPHENATED_TAGS.has(tag)) return tag;
  return tag.replace(/-/g, ' ');
}
