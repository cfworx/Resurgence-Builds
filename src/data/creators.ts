// The creators whose builds are written up on the site. A build belongs to a creator when its `author` field ends in
// "(via <name>)" or "via <name>". Channel links are only the ones we opened and checked ourselves (date in `checked`);
// a creator without a verified channel gets no link. Used by /creators/ and /creators/<slug>/.
import type { CollectionEntry } from 'astro:content';

export interface Creator {
  slug: string;
  /** The name as the build pages credit it */
  name: string;
  /** Where the creator publishes, in a few words */
  where: string;
  /** Verified profile link, if any */
  href?: string;
  linkLabel?: string;
  /** Day the link was last opened and checked */
  checked?: string;
}

export const CREATORS: Creator[] = [
  { slug: 'tiktokandy', name: 'TikTokAndy', where: 'YouTube', href: 'https://www.youtube.com/@TikTokAndy', linkLabel: 'TikTokAndy on YouTube', checked: '2026-11-15' },
  { slug: 'ggreborn', name: 'GGReborn', where: 'YouTube', href: 'https://www.youtube.com/@GGReborn', linkLabel: 'GGReborn on YouTube', checked: '2026-11-15' },
  { slug: 'nadie', name: 'Nadie', where: 'Shared in the community' },
  { slug: 'roguemadras', name: 'RogueMadras', where: 'YouTube', href: 'https://www.youtube.com/@RogueMadras', linkLabel: 'RogueMadras on YouTube', checked: '2026-11-15' },
  { slug: 'saiynergy', name: 'Saiynergy', where: 'YouTube', href: 'https://www.youtube.com/@saiynergy', linkLabel: 'Saiynergy on YouTube', checked: '2026-11-15' },
  { slug: 'agenthuntzman', name: 'AgentHuntzman', where: 'YouTube', href: 'https://www.youtube.com/@AgentHuntzman', linkLabel: 'AgentHuntzman on YouTube', checked: '2026-11-15' },
  { slug: 'pve-enjoyer', name: 'PVE Enjoyer', where: 'YouTube', href: 'https://www.youtube.com/@PVE-Enjoyer', linkLabel: 'PVE Enjoyer on YouTube', checked: '2026-11-15' },
  { slug: 'tampishach', name: 'Tampishach', where: 'YouTube video' },
  { slug: 'ltfoe', name: 'LtFoe', where: 'Sent to us directly' },
  { slug: 'demo2x', name: 'Demø2x', where: 'YouTube' },
  { slug: 'pym-gamecat', name: 'PYM GameCat', where: 'YouTube' },
];

/** The creator name a build's author line credits, or null for our own builds. */
export function creditedName(author: string): string | null {
  const m = author.match(/\bvia\s+([^)]+?)\)?\s*$/i);
  return m ? m[1].trim() : null;
}

export function buildsOf(creator: Creator, builds: CollectionEntry<'builds'>[]) {
  return builds
    .filter((b) => creditedName(String(b.data.author || '')) === creator.name)
    .sort((a, b) => b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime());
}

/** Creators with at least this many builds get a page of their own; the others are listed on /creators/ only. */
export const OWN_PAGE_MIN = 2;
