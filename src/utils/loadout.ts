// Turns a build's `loadout` front matter into everything the loadout panel draws: names resolved against the game's
// Build-Making Database records, icons from the image manifest, links to the database pages, the active gear set
// bonuses and a color per set. Every name must exist in the records (scripts/check-rolls.mjs checks the rolls).
import standardWeapons from '../data/standard-weapons.json';
import exoticWeapons from '../data/exotic-weapons.json';
import weaponTalents from '../data/weapon-talents.json';
import gearSets from '../data/gear-set-effects.json';
import bodyArmorTalents from '../data/body-armor-talents.json';
import backpackTalents from '../data/backpack-talents.json';
import osProtocols from '../data/os-protocols.json';
import skillModCombos from '../data/skill-mod-combos.json';
import gearSources from '../data/gear-sources.json';
import { dbImage, type DbImage } from './db-images';

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export type LoadoutData = {
  statsFrom?: string;
  stats?: { value: string; label: string }[];
  must?: string[];
  weapons: { role: string; name: string; exotic?: boolean; tier?: string; note?: string; talents?: string[]; attrs?: string[] }[];
  os?: { name: string; note?: string };
  mods?: string[];
  gear: { slot: string; set: string; piece?: string; any?: boolean; options?: string[]; talent?: string; note?: string; attrs?: string[] }[];
  notes?: { label: string; text: string }[];
};

type Named = { id?: string; name: string; [k: string]: any };
const list = (d: any): Named[] => (Array.isArray(d) ? d : (Object.values(d).find(Array.isArray) as Named[]) || []);
function finder(d: any, what: string) {
  const rows = list(d);
  const map = new Map(rows.map((r) => [r.name.toLowerCase(), r]));
  return (name: string) => {
    const r = map.get(name.toLowerCase());
    if (!r) throw new Error(`loadout: no ${what} named "${name}"`);
    return r;
  };
}
const findWeapon = finder(standardWeapons, 'standard weapon');
const findExotic = finder(exoticWeapons, 'exotic weapon');
const findWeaponTalent = finder(weaponTalents, 'weapon talent');
const findSet = finder(gearSets, 'gear set');
const findBodyTalent = finder(bodyArmorTalents, 'body armor talent');
const findBackpackTalent = finder(backpackTalents, 'backpack talent');
const findOs = finder(osProtocols, 'OS Protocol');
const findMod = finder(skillModCombos, 'skill mod combo');
const pieces = (gearSources as any).pieces as Record<string, { name: string; slot: string; tier: string }>;
const pieceByName = new Map(Object.entries(pieces).map(([slug, p]) => [p.name.toLowerCase(), { slug, ...p }]));
function findPiece(name: string) {
  const p = pieceByName.get(name.toLowerCase());
  if (!p) throw new Error(`loadout: no gear piece named "${name}"`);
  return p;
}

/** Short names for the attribute chips. Anything not listed shows its full name. */
const SHORT: Record<string, string> = {
  'Weapon Critical Hit Chance': 'Crit Chance',
  'Weapon Critical Hit Damage': 'Crit Damage',
  'Weapon Multi-Shot Chance': 'Multi-Shot',
  'Headshot Damage': 'Headshot Dmg',
  'Weapon Damage': 'Weapon Dmg',
  'All Weapon Damage': 'All Weapon Dmg',
  'Skill Critical Chance': 'Skill Crit Chance',
  'Skill Critical Damage': 'Skill Crit Dmg',
  'Skill Multi-Shot Chance': 'Skill Multi-Shot',
  'Skill Cooldown Recovery': 'Cooldown Recovery',
  'Signature Ability Charge Efficiency': 'Signature Charge',
  'Damage Reduction': 'Damage Reduction',
  'Received Healing': 'Received Healing',
  'All Skill Damage': 'All Skill Dmg',
};
export const shortAttr = (a: string) => SHORT[a] ?? a;

/** One color per gear set in a build, biggest set first. Light tones that read on the dark panel. */
const SET_COLORS = ['#5EC8F0', '#F5C542', '#C4A1FF', '#7EE2B8'];

// "Reload Speed +12.0%" -> "Reload Speed +12%"
const tidy = (b: string) => b.replace(/(\d)\.0%/g, '$1%').replace(/\s+/g, ' ').trim();

export type Chip = { name: string; slug: string; href: string; icon?: DbImage };

export function resolveLoadout(lo: LoadoutData) {
  const talentChip = (name: string): Chip => {
    const t = findWeaponTalent(name);
    const slug = slugify(t.name);
    return { name: t.name, slug, href: `/database/weapon-talents/${slug}/`, icon: dbImage(`weapon-talents/${slug}`, 'icon') };
  };

  const weapons = lo.weapons.map((w) => {
    if (w.exotic) {
      const e = findExotic(w.name);
      const slug = slugify(e.name);
      return {
        role: w.role, name: e.name, slug, exotic: true, href: `/database/exotic-weapons/${slug}/`,
        image: dbImage(`exotic-weapons/${slug}`, 'hero'), meta: [`Exotic ${e.type}`, w.note].filter(Boolean).join(' · '),
        talents: [e.talentName, ...(w.talents ?? [])].filter(Boolean).map((n: string) => {
          try { return talentChip(n); } catch { return { name: n, slug: slugify(n), href: `/database/exotic-weapons/${slug}/` }; }
        }),
        attrs: (w.attrs ?? []).map(shortAttr),
      };
    }
    const r = findWeapon(w.name);
    const slug = slugify(r.name);
    return {
      role: w.role, name: r.name, slug, exotic: false, href: `/database/weapons/${slug}/`,
      image: dbImage(`weapon-icons/${slug}`, 'card'), tier: w.tier ?? r.armoryTier,
      meta: [`${w.tier ?? r.armoryTier} ${r.type}`, w.note].filter(Boolean).join(' · '),
      talents: (w.talents ?? []).map(talentChip),
      attrs: (w.attrs ?? []).map(shortAttr),
    };
  });

  const os = lo.os ? (() => {
    const o = findOs(lo.os!.name);
    const slug = slugify(o.name);
    return { name: o.name, slug, href: `/database/os-protocols/${slug}/`, icon: dbImage(`os-protocols/${slug}`, 'icon'),
      meta: [o.rarity, lo.os!.note].filter(Boolean).join(' · ') };
  })() : undefined;

  const mods = (lo.mods ?? []).map((n) => {
    const m = findMod(n);
    const slug = slugify(m.name);
    return { name: m.name, slug, skill: m.skill as string, href: `/database/skill-mod-combos/${slug}/`, icon: dbImage(`skill-mod-combos/${slug}`, 'icon') };
  });

  // Gear sets: count, order (biggest first, then first seen), color, active bonuses
  const counts = new Map<string, number>();
  lo.gear.forEach((g) => counts.set(g.set, (counts.get(g.set) ?? 0) + 1));
  const order = [...counts.keys()].sort((a, b) => (counts.get(b)! - counts.get(a)!));
  const sets = order.map((name, i) => {
    const s = findSet(name);
    const slug = slugify(s.name);
    const n = counts.get(name)!;
    const bonuses = [n >= 2 && s.bonus2, n >= 3 && s.bonus3, n >= 4 && s.bonus4].filter(Boolean).map((b) => tidy(b as string));
    return { name: s.name, slug, count: n, color: SET_COLORS[i % SET_COLORS.length], href: `/database/gear-set-effects/${slug}/`,
      icon: dbImage(`gear-set-effects/${slug}`, 'icon'), bonuses };
  });
  const setBy = new Map(sets.map((s) => [s.name.toLowerCase(), s]));

  const gear = lo.gear.map((g) => {
    const set = setBy.get(g.set.toLowerCase())!;
    const isBody = g.slot === 'Body Armor';
    const isPack = g.slot === 'Backpack';
    let talent: Chip | undefined;
    if (g.talent) {
      const t = (isBody ? findBodyTalent : findBackpackTalent)(g.talent);
      const slug = slugify(t.name);
      talent = { name: t.name, slug, href: `/database/${isBody ? 'body-armor' : 'backpack'}-talents/#${slug}`,
        icon: dbImage(`${isBody ? 'body-armor' : 'backpack'}-talents/${slug}`, 'icon') };
    }
    const main = g.piece ? findPiece(g.piece) : g.options ? findPiece(g.options[0]) : undefined;
    const alts = g.options ? g.options.slice(1).map((n) => { const p = findPiece(n); return `${p.name} (${p.tier})`; }) : [];
    return {
      slot: g.slot,
      set,
      any: !!g.any,
      piece: main ? { name: main.name, slug: main.slug, tier: main.tier, href: `/database/gear/#${main.slug}`, image: dbImage(`gear-icons/${main.slug}`, 'card') } : undefined,
      alts,
      talent,
      note: g.note,
      attrs: (g.attrs ?? []).map(shortAttr),
      fullAttrs: g.attrs ?? [],
    };
  });

  const setLabel = sets.map((s) => `${s.count}pc ${s.name}`).join(' + ');

  return { weapons, os, mods, sets, gear, setLabel, stats: lo.stats ?? [], statsFrom: lo.statsFrom, must: lo.must ?? [], notes: lo.notes ?? [] };
}

/** Bold, italics and links in a note line (front matter text), with everything else escaped. */
export function inlineMd(s: string) {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}
