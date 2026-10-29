// Shared extras for database item pages: Ubisoft's official sealed-cache odds
// for the item (from drop-rates.json, matched by exact item name) and the
// build guides on this site that mention it.
import { getCollection } from 'astro:content';
import dropRates from '../data/drop-rates.json';
import gearSetData from '../data/gear-set-effects.json';

export type DbKind = 'os-protocol' | 'exotic-weapon' | 'skill-mod' | 'gear-set' | 'weapon-talent' | 'weapon';
type Item = { tier: string; item: string; amount: string; chance: string };
type Cache = { name: string; tierRates: { S: string; A: string; B: string }; pity: { S: number; A: number }; items: Item[] };
const caches = dropRates.caches as Cache[];

export const dropSource = dropRates.source as string;
export const dropChecked = dropRates.checked as string;
export const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const TIER_LABEL: Record<string, string> = { S: 'Tier S', A: 'Tier A', B: 'Tier B' };
const RARITY_PREFIX: Record<string, string> = { HE: 'High-End', Su: 'Superior', Sp: 'Specialized' };

export type DropRow = { cache: string; cacheId: string; label: string; tier: string; chance: string };

/** Every row of Ubisoft's table for this item. Skill mod pieces of one rarity are grouped per cache. */
export function dropRowsFor(kind: DbKind, name: string): DropRow[] {
  const rows: DropRow[] = [];
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const c of caches) {
    if (kind === 'os-protocol' && c.name === 'OS Protocol Cache') {
      for (const i of c.items) if (i.item === `OS Protocol - ${name}`) rows.push({ cache: c.name, cacheId: toSlug(c.name), label: i.item, tier: TIER_LABEL[i.tier], chance: i.chance });
    }
    if (kind === 'exotic-weapon' && c.name === 'Exotic Cache') {
      const re = new RegExp(`(^|[ :-])(The )?${esc}( |$)`);
      for (const i of c.items) if (re.test(i.item)) rows.push({ cache: c.name, cacheId: toSlug(c.name), label: i.item, tier: TIER_LABEL[i.tier], chance: i.chance });
    }
    if (kind === 'skill-mod') {
      const groups = new Map<string, { pieces: string[]; skill: string; rarity: string; tier: string; chance: string }>();
      for (const i of c.items) {
        const m = i.item.match(/^\[(HE|Su|Sp)\] (.+?) (Firmware|Software|Chipset) - (.+)$/);
        if (!m || m[4] !== name) continue;
        const key = `${m[1]}|${m[2]}|${i.chance}`;
        const g = groups.get(key) || { pieces: [], skill: m[2], rarity: RARITY_PREFIX[m[1]], tier: TIER_LABEL[i.tier], chance: i.chance };
        g.pieces.push(m[3]);
        groups.set(key, g);
      }
      for (const g of groups.values()) {
        rows.push({ cache: c.name, cacheId: toSlug(c.name), label: `${g.rarity} ${g.skill} ${g.pieces.join(', ')}`, tier: g.tier, chance: `${g.chance}${g.pieces.length > 1 ? ' each' : ''}` });
      }
    }
  }
  return rows;
}

/** Tier odds and pity for the caches that hold these rows (Ubisoft uses the same numbers for every cache today). */
export function cacheRules(rows: DropRow[]) {
  const used = caches.filter((c) => rows.some((r) => r.cache === c.name));
  const first = used[0];
  const same = used.every((c) => JSON.stringify(c.tierRates) === JSON.stringify(first?.tierRates) && JSON.stringify(c.pity) === JSON.stringify(first?.pity));
  return first && same ? { tierRates: first.tierRates, pity: first.pity } : null;
}

// Names that also mean something else in build guides (a subclass, a weapon attribute),
// so a text match would point at the wrong thing.
const AMBIGUOUS: Partial<Record<DbKind, string[]>> = {
  'skill-mod': ['Commando', 'Optimal Range'],
};

export type BuildMention = { title: string; url: string; specialization: string; verified: boolean; theorycraft: boolean; patch: string };

/** Build guides whose text names this item, matched as a whole name (so "ACR" doesn't match "ACR-E"). */
export async function buildsMentioning(kind: DbKind, name: string): Promise<BuildMention[]> {
  if (AMBIGUOUS[kind]?.includes(name)) return [];
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Not part of a longer capitalized name on either side ("Wave Vector", "Jackpot Striker"),
  // but a roman numeral rank after it is fine ("In Sync II").
  const re = new RegExp(`(?<![A-Za-z0-9-])(?<![A-Z][A-Za-z]+ )${esc}(?![A-Za-z0-9-])(?! (?!(?:I{1,3}|IV|V)\\b)[A-Z])`);
  const builds = await getCollection('builds');
  return builds
    .filter((b) => {
      const d = b.data;
      const text = [b.body, d.title, d.description, d.subtitle, ...(d.tags || []), ...(d.faqs || []).flatMap((f) => [f.question, f.answer])].join('\n');
      return re.test(text);
    })
    .map((b) => ({ title: b.data.title, url: `/builds/${b.id}/`, specialization: b.data.specialization, verified: b.data.verified !== false, theorycraft: b.data.theorycraft === true, patch: /^\d/.test(b.data.patch) ? `Patch ${b.data.patch}` : b.data.patch }))
    .sort((a, b) => Number(b.verified) - Number(a.verified) || a.title.localeCompare(b.title));
}

// Gear set slots in a build's planner link: mask, chest, knee pads, backpack ("pack"), gloves, holster.
const SET_SLOT_KEYS = ['ms', 'cs', 'ks', 'ps', 'gs', 'hs'];
const setNames = new Map((gearSetData as { id: string; name: string }[]).map((s) => [s.id, s.name]));

export type SetLoadout = {
  title: string; url: string; specialization: string; creator: string | null; verified: boolean;
  /** Pieces per gear set id, from the build's planner link. */
  pieces: Map<string, number>;
};

/** Every build guide's gear set split, read from its planner link (the loadout the guide documents). */
export async function buildSetLoadouts(): Promise<SetLoadout[]> {
  const builds = await getCollection('builds');
  const out: SetLoadout[] = [];
  for (const b of builds) {
    if (!b.data.plannerHash) continue;
    const q = new URLSearchParams(b.data.plannerHash);
    const pieces = new Map<string, number>();
    for (const k of SET_SLOT_KEYS) {
      const id = q.get(k);
      if (id && setNames.has(id)) pieces.set(id, (pieces.get(id) || 0) + 1);
    }
    if (pieces.size === 0) continue;
    const via = b.data.author.match(/via\s+([^)]+?)\)?\s*$/);
    out.push({ title: b.data.title, url: `/builds/${b.id}/`, specialization: b.data.specialization, creator: via ? via[1].trim() : null, verified: b.data.verified !== false, pieces });
  }
  return out;
}

export type SetWearer = { title: string; url: string; specialization: string; creator: string | null; pieces: number; partner: string | null; partnerPieces: number };

/** Build guides whose loadout wears this gear set: how many pieces, and the set worn beside it. */
export async function buildsWearingSet(setId: string): Promise<SetWearer[]> {
  return (await buildSetLoadouts())
    .filter((l) => l.pieces.has(setId))
    .map((l) => {
      const other = [...l.pieces.entries()].filter(([id]) => id !== setId).sort((a, b) => b[1] - a[1])[0];
      return { title: l.title, url: l.url, specialization: l.specialization, creator: l.creator, pieces: l.pieces.get(setId) || 0, partner: other ? setNames.get(other[0]) || null : null, partnerPieces: other ? other[1] : 0 };
    })
    .sort((a, b) => b.pieces - a.pieces || a.title.localeCompare(b.title));
}
