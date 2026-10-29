// What each weapon and gear piece can roll, from the Source lists recorded in the game's
// Build-Making Database (research/build-database/*-sources.json; src/data has the site copies).
// Every standard weapon can roll 18 of the 67 weapon talents; every body armor piece and every
// backpack 12 of its 25 talents. Builds, the planner and the database pages read these.
import talentSources from '../data/weapon-talent-sources.json';
import gearSources from '../data/gear-sources.json';
import weaponTalents from '../data/weapon-talents.json';

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

type SourceWeapon = { name: string; slug: string; class: string; tier: string };
type SourceTalent = { name: string; id: string; classOrder: string[]; weapons: SourceWeapon[] };
type GearPiece = { name: string; slot: string; tier: string; family: string };
type GearList = { name: string; pieces: { slug: string; rarities: string[] }[] };

const talents = (talentSources as any).talents as Record<string, SourceTalent>;
const gear = gearSources as unknown as {
  checked: string;
  pieces: Record<string, GearPiece>;
  sets: Record<string, GearList>;
  bodyArmorTalents: Record<string, GearList>;
  backpackTalents: Record<string, GearList>;
};

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });

/** "October 29, 2026": when the Source lists were recorded. */
export const SOURCES_RECORDED = longDate((talentSources as any).checked);
export const GEAR_SOURCES_RECORDED = longDate(gear.checked);

/** The 67 talents that roll on standard weapons (the exotics' own talents are not in it). */
export const POOL_TALENT_COUNT = Object.keys(talents).length;
export const WEAPON_POOL_SIZE = 18;

/** A weapon talent's Source list, by the talent's page slug. */
export function talentSource(talentSlug: string): SourceTalent | undefined {
  return talents[talentSlug];
}

/** The weapon talents a standard weapon can roll (its pool), by the weapon's page slug. */
export function weaponPool(weaponSlug: string): { slug: string; name: string; id: string }[] {
  return Object.entries(talents)
    .filter(([, t]) => t.weapons.some((w) => w.slug === weaponSlug))
    .map(([slug, t]) => ({ slug, name: t.name, id: t.id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Can this weapon (site weapon slug) roll this talent (site talent id, e.g. wt-68)? */
export function weaponCanRoll(weaponSlug: string, talentId: string): boolean {
  return Object.values(talents).some((t) => t.id === talentId && t.weapons.some((w) => w.slug === weaponSlug));
}

// What each talent is for, from its own text: a reading aid for the weapon pages, not a game value.
export const TALENT_ROLE: Record<string, 'Weapon damage' | 'Survival' | 'Skills and healing' | 'Handling and ammo'> = {};
const ROLES: [string, string[]][] = [
  ['Weapon damage', ['Bloodlust', 'Breadbasket', 'Concentrated Fire', 'Damage Trade', 'Death by Numbers', 'Killer', 'Neverending',
    'No Exit', 'Performer', 'Precise Crit', 'Pummel', 'Spec-Ops', 'Steady Aim', 'Steady Hands', 'Steady Reload', 'Strained',
    'Surgical', 'Target Acquisition', 'Unhinged', 'Blood for Blood']],
  ['Survival', ['Backup Protection', 'Conceited', 'Crawl', 'Precise Support', 'Predatory Aura', 'Revitalize', 'Sadistic Shield',
    'Sentinel Aura', 'Slaughter Fortitude', 'Spirited', 'Steady Suppression', 'Still Alive', 'Swift Taunt', 'Tactical Targeting',
    'Take a Breath', 'Thick Skin', 'Unbreakable', 'Vibrant']],
  ['Skills and healing', ['Adaptation', 'Ammo Charge', 'Backup Battery', 'Enhancement Trade', 'Ex Machina', 'Fully Charged',
    'Head Collection', 'In Sync', 'Joint Strike', 'Last Stand', 'Long-Distance Marking', 'Medical Accuracy', 'Multi-Pronged Attack',
    'Multitasking', 'Precise Trauma', 'Rapid Charge', 'Shooting Repair', 'Slaughter Healing', 'Swift Aim', 'Tactical Reload',
    'Torrential Downpour']],
  ['Handling and ammo', ['Ammo Supply', 'Backup Magazine', 'Calm and Collected', 'Fast Hands', "In a Day's Work",
    'Misdirection Insurance', 'Proficient Reload', 'Steady Handed']],
];
for (const [role, names] of ROLES) for (const n of names) TALENT_ROLE[n] = role as any;
export const ROLE_ORDER = ROLES.map(([r]) => r);

const talentText: Record<string, string> = Object.fromEntries((weaponTalents as any[]).map((t) => [t.name, t.description]));
export const talentDescription = (name: string) => talentText[name] ?? '';

// ---------------------------------------------------------------------------------------------
// Gear

export function gearPieces(): (GearPiece & { slug: string })[] {
  return Object.entries(gear.pieces).map(([slug, p]) => ({ slug, ...p }));
}

export function gearPiece(slug: string): GearPiece | undefined {
  return gear.pieces[slug];
}

/** The pieces in a Source list: kind 'sets' (gear set slug), 'bodyArmorTalents' or 'backpackTalents' (talent slug). */
export function piecesFor(kind: 'sets' | 'bodyArmorTalents' | 'backpackTalents', slug: string) {
  const list = gear[kind][slug];
  if (!list) return [];
  return list.pieces.map((p) => ({ slug: p.slug, rarities: p.rarities, ...gear.pieces[p.slug] }));
}

/** The talents a body armor piece or backpack can roll (its pool of 12), by the piece's slug. */
export function pieceTalents(pieceSlug: string): { slug: string; name: string }[] {
  const out: { slug: string; name: string }[] = [];
  for (const kind of ['bodyArmorTalents', 'backpackTalents'] as const) {
    for (const [slug, t] of Object.entries(gear[kind])) {
      if (t.pieces.some((p) => p.slug === pieceSlug)) out.push({ slug, name: t.name });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** The gear sets a piece can carry. */
export function pieceSets(pieceSlug: string): { slug: string; name: string }[] {
  return Object.entries(gear.sets)
    .filter(([, s]) => s.pieces.some((p) => p.slug === pieceSlug))
    .map(([slug, s]) => ({ slug, name: s.name }));
}

/** Pieces of one slot that can carry both a gear set and a talent (the talent slug is a body armor or
 *  backpack talent): what a build that asks for both on one piece actually has to find. */
export function piecesWithSetAndTalent(setSlug: string, talentKind: 'bodyArmorTalents' | 'backpackTalents', talentSlug: string) {
  const inSet = new Set((gear.sets[setSlug]?.pieces || []).map((p) => p.slug));
  return (gear[talentKind][talentSlug]?.pieces || []).filter((p) => inSet.has(p.slug)).map((p) => ({ slug: p.slug, ...gear.pieces[p.slug] }));
}
