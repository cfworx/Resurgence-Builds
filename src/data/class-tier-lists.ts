// The class (specialization) tier list: the published class tier lists we could read, each with its link and date,
// and the average of their tiers. Used by /tier-list/classes/ (the full page) and /tier-list/ (the summary strip).
// It is not voted on yet. When one of the lists changes or a new one appears, update LISTS and CLASS_TIERS_CHECKED
// (AUTOMATION.md, monthly check). Every `read` line repeats something the site already says in the class guide
// (src/content/guides/which-specialization-to-pick.md) or the patch notes: no new opinion goes in here.
import type { Tier } from '../utils/votes';

export const CLASS_TIERS_CHECKED = '2026-11-15';
export const CLASS_TIERS_PUBLISHED = '2026-11-15T12:00:00.000Z';

export type ClassEntry = { id: string; name: string; role: string; ours?: boolean; read: string };

// Role lines as on the class pages (src/pages/class/[spec].astro).
export const CLASSES: ClassEntry[] = [
  { id: 'vanguard', name: 'Vanguard', role: 'DPS / Team Utility', ours: true,
    read: 'Our pick. Scanning Pulse shows enemies through walls, its mobility skills are the best in the game, and both its damage and support builds were top-tier when we tested them, even after Season 2 Phase 1 cut the Commando talent Target Acquisition.' },
  { id: 'demolitionist', name: 'Demolitionist', role: 'AoE DPS / Explosive Specialist',
    read: 'The class for explosions. Season 2 Phase 2 buffed a long list of its skill-tree nodes on September 16, 2026, after every list below was last updated.' },
  { id: 'field-medic', name: 'Field Medic', role: 'Healer / Support',
    read: 'The healer and support class. Its Tactical Pharma focus swaps some of that for Corrosion, a debuff that makes enemies take more damage.' },
  { id: 'bulwark', name: 'Bulwark', role: 'Tank / Frontline',
    read: 'The frontline tank. Its crowd control was trimmed in 2026: the Pummeling Shield OS Protocol and Shockwave Spike both lost stun time.' },
  { id: 'tech-operator', name: 'Tech Operator', role: 'Skill DPS / Utility',
    read: 'The gadget class, built around drones. No published tier list ranks it, so it has no tier here yet.' },
];

export type PublishedList = { site: string; url: string; dated: string; note?: string; tiers: Record<string, Tier> };

export const LISTS: PublishedList[] = [
  { site: 'AllThingsHow', url: 'https://allthings.how/the-division-resurgence-specializations-tier-list/', dated: 'updated August 6, 2026',
    tiers: { vanguard: 'S', demolitionist: 'A', 'field-medic': 'A', bulwark: 'B' } },
  { site: 'Mobi.gg', url: 'https://mobi.gg/en/tips/the-division-resurgence-specialization-tier-list/', dated: 'updated August 17, 2026',
    tiers: { vanguard: 'S', 'field-medic': 'S', bulwark: 'A', demolitionist: 'B' } },
  { site: 'Destructoid', url: 'https://www.destructoid.com/the-division-resurgence-specialization-tier-list/', dated: 'April 2026', note: 'says the Tech class was yet to be assessed',
    tiers: { vanguard: 'S', demolitionist: 'S', 'field-medic': 'A', bulwark: 'A' } },
  { site: 'Fdaytalk', url: 'https://www.fdaytalk.com/division-resurgence-specialization-tier-list/', dated: 'April 6, 2026',
    tiers: { vanguard: 'S', demolitionist: 'S', bulwark: 'A', 'field-medic': 'A' } },
];

// Same points and cut-offs as the lists readers vote on: S 5, A 4, B 3, C 2, D 1; 4.5 and up is S, 3.5 A, 2.5 B, 1.5 C.
const POINTS: Record<Tier, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
const tierOf = (avg: number): Tier => (avg >= 4.5 ? 'S' : avg >= 3.5 ? 'A' : avg >= 2.5 ? 'B' : avg >= 1.5 ? 'C' : 'D');

export type ClassTierRow = ClassEntry & { given: Tier[]; avg: number | null; tier: Tier | null };

/** Every class with the tiers the published lists give it, their average and the tier that average earns. Best first. */
export function classTierRows(): ClassTierRow[] {
  return CLASSES.map((c) => {
    const given = LISTS.map((l) => l.tiers[c.id]).filter(Boolean) as Tier[];
    const avg = given.length ? given.reduce((n, t) => n + POINTS[t], 0) / given.length : null;
    return { ...c, given, avg, tier: avg === null ? null : tierOf(avg) };
  }).sort((x, y) => (y.avg ?? 0) - (x.avg ?? 0) || Number(!!y.ours) - Number(!!x.ours));
}

export const joinNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] || '';

export const classTiersCheckedLong = new Date(CLASS_TIERS_CHECKED + 'T12:00:00Z')
  .toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
