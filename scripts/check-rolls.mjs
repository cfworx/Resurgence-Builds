#!/usr/bin/env node
// Checks every loadout the site shows against what the game says can roll.
//
// The truth is the Source lists recorded in the game's Build-Making Database (src/data/weapon-talent-sources.json and
// src/data/gear-sources.json, copied from research/build-database/). For every post in src/content it checks:
//   - the Build Planner link (plannerHash): each weapon's talents are in that weapon's pool, and each body armor or
//     backpack talent rolls on a piece of the set chosen for that slot;
//   - the build sheet in the body: each weapon's talent chips are in its pool, and each gear piece carries the set and
//     talent chips shown with it.
// A weapon whose recalibration pulled from the wrong pool before the Season 2 Phase 1 fix (recalibration-fixes.json)
// may show an older out-of-pool roll, but only if the post says so ("older roll"/"recalibrat"): that is a warning, not
// an error.
//
// Usage: node scripts/check-rolls.mjs        (exit 1 on any error; runs in `npm run build`)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const data = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const list = (d) => (Array.isArray(d) ? d : Object.values(d).find(Array.isArray) || []);

const talentSources = data('weapon-talent-sources.json').talents; // slug -> { name, id, weapons: [{ slug }] }
const gear = data('gear-sources.json'); // pieces, sets, bodyArmorTalents, backpackTalents
const recal = data('recalibration-fixes.json');

const byId = (arr) => new Map(list(arr).map((x) => [String(x.id), x]));
const WT = byId(data('weapon-talents.json'));
const SW = byId(data('standard-weapons.json'));
const EW = byId(data('exotic-weapons.json'));
const GS = byId(data('gear-set-effects.json'));
const BA = byId(data('body-armor-talents.json'));
const BP = byId(data('backpack-talents.json'));

// Weapon pools: weapon slug -> Set of talent slugs.
const pool = new Map();
for (const [tSlug, t] of Object.entries(talentSources)) {
  for (const w of t.weapons) {
    if (!pool.has(w.slug)) pool.set(w.slug, new Set());
    pool.get(w.slug).add(tSlug);
  }
}
const weaponTalentByName = new Map(Object.entries(talentSources).map(([s, t]) => [t.name.toLowerCase(), s]));
const recalSlugs = new Set((recal.weapons || []).map((id) => (SW.get(String(id)) ? slugify(SW.get(String(id)).name) : String(id))));

const piecesOf = (lists, slug) => new Set(((lists[slug] || {}).pieces || []).map((p) => p.slug));
const setNames = new Map(Object.entries(gear.sets).map(([s, x]) => [x.name.toLowerCase(), s]));
const baNames = new Map(Object.entries(gear.bodyArmorTalents).map(([s, x]) => [x.name.toLowerCase(), s]));
const bpNames = new Map(Object.entries(gear.backpackTalents).map(([s, x]) => [x.name.toLowerCase(), s]));

const SLOT = { m: 'Mask', g: 'Gloves', h: 'Holster', c: 'Body Armor', p: 'Backpack', k: 'Knee Pads' };
const errors = [];
const warnings = [];

// Every standard weapon must map onto the Source lists, or the checks below would pass by accident.
for (const w of SW.values()) {
  if (!pool.has(slugify(w.name))) errors.push(`data: standard weapon ${w.id} "${w.name}" has no pool in weapon-talent-sources.json`);
}

function checkWeapon(where, weaponSlug, weaponName, talentSlugs, text) {
  const p = pool.get(weaponSlug);
  if (!p) return errors.push(`${where}: "${weaponName}" isn't a standard weapon in the Source lists`);
  for (const t of talentSlugs) {
    if (p.has(t)) continue;
    const name = talentSources[t] ? talentSources[t].name : t;
    const msg = `${where}: ${weaponName} can't roll ${name} (not in its Source-list pool)`;
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (recalSlugs.has(weaponSlug) && /older roll|recalibrat/i.test(text)) warnings.push(msg + ' [pre-fix recalibration roll, noted in the post]');
    else if (new RegExp(`can[’']?t roll ${esc}\\b`, 'i').test(text)) warnings.push(msg + ' [creator copy; the post says it can\'t roll]');
    else errors.push(msg);
  }
}

function checkGear(where, slot, setSlug, talentSlug, kind) {
  const inSlot = (slug) => gear.pieces[slug] && gear.pieces[slug].slot.toLowerCase() === slot.toLowerCase();
  const setPieces = [...piecesOf(gear.sets, setSlug)].filter(inSlot);
  if (setSlug && !setPieces.length) return errors.push(`${where}: no ${slot} piece carries ${gear.sets[setSlug]?.name || setSlug}`);
  if (!talentSlug) return;
  const lists = kind === 'ba' ? gear.bodyArmorTalents : gear.backpackTalents;
  const rollers = piecesOf(lists, talentSlug);
  const ok = (setSlug ? setPieces : Object.keys(gear.pieces).filter(inSlot)).some((s) => rollers.has(s));
  if (!ok) errors.push(`${where}: no ${setSlug ? gear.sets[setSlug].name + ' ' : ''}${slot} rolls ${lists[talentSlug]?.name || talentSlug}`);
}

function checkPlanner(file, hash, text) {
  const p = new URLSearchParams(hash);
  const where = `${file} plannerHash`;
  for (const n of [1, 2]) {
    const sw = p.get(`w${n}s`);
    if (!sw) continue;
    const w = SW.get(sw);
    if (!w) { if (!EW.get(sw)) errors.push(`${where}: unknown weapon id w${n}s=${sw}`); continue; }
    const ts = [p.get(`w${n}t`), p.get(`w${n}t2`)].filter(Boolean).map((id) => {
      const t = WT.get(id);
      if (!t) { errors.push(`${where}: unknown weapon talent id ${id}`); return null; }
      return slugify(t.name);
    }).filter(Boolean);
    checkWeapon(where, slugify(w.name), w.name, ts, text);
  }
  for (const [k, slot] of Object.entries(SLOT)) {
    const sid = p.get(`${k}s`);
    const tid = p.get(`${k}t`);
    const set = sid ? GS.get(sid) : null;
    if (sid && !set) { errors.push(`${where}: unknown set id ${k}s=${sid}`); continue; }
    let tal = null;
    if (tid) {
      tal = (k === 'c' ? BA : BP).get(tid);
      if (!tal || !['c', 'p'].includes(k)) { errors.push(`${where}: unknown ${slot} talent id ${k}t=${tid}`); continue; }
    }
    checkGear(where, slot, set ? slugify(set.name) : null, tal ? slugify(tal.name) : null, k === 'c' ? 'ba' : 'bp');
  }
}

// Weapon talent names in a line of text, longest first so "Steady Handed" isn't read as something shorter.
const talentNames = Object.entries(talentSources).map(([s, t]) => [t.name, s]).sort((a, b) => b[0].length - a[0].length);
const unescape = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function talentsIn(text) {
  let rest = text;
  const out = [];
  for (const [name, s] of talentNames) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(rest)) { out.push(s); rest = rest.replace(re, ' '); }
  }
  return out;
}
const CLASSES = [[/\bSMGs?\b/i, 'SMG'], [/\bassault rifles?\b/i, 'Assault Rifle'], [/\bLMGs?\b/i, 'LMG'], [/\bmarksman rifles?\b/i, 'Marksman Rifle'],
  [/\bshotguns?\b/i, 'Shotgun'], [/(?<!assault |marksman )\brifles?\b/i, 'Rifle']];
const weaponBySlug = new Map([...SW.values()].map((w) => [slugify(w.name), w]));

// "No X? These roll A and B too" lists: every weapon linked in the item must roll the talents a positive line names
// (limited to the weapon class the line names, if any). Lines that say what can't roll are left to a person.
function checkAlternatives(file, it) {
  const sub = unescape((it.match(/class="bsheet__sub">([^<]*)</) || [])[1] || '');
  const links = [...it.matchAll(/class="bsheet__pick"><a href="\/database\/weapons\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]);
  if (!links.length || !/\brolls?\b/i.test(sub)) return;
  const chips = [...it.matchAll(/class="bsheet__pick">(?:<img[^>]*>)?([^<]+)<\/span>/g)].map((m) => weaponTalentByName.get(m[1].trim().toLowerCase())).filter(Boolean);
  const label = unescape((it.match(/class="bsheet__name"[^>]*>([^<]*)</) || [])[1] || '').trim();
  for (const seg of sub.split(/,\s*and\s+|;\s*|\.\s+/)) {
    if (!/\brolls?\b/i.test(seg) || /\b(can'?t|cannot|can’t|doesn'?t|doesn’t|does not|neither|never|no longer)\b/i.test(seg)) continue;
    let tals = talentsIn(seg);
    if (!tals.length && /\brolls? it\b/i.test(seg)) tals = chips;
    if (!tals.length) continue;
    const cls = CLASSES.filter(([re]) => re.test(seg)).map(([, c]) => c);
    // A line that names some of the linked guns ("The Vector 45 ACP does roll...") is about those guns only.
    let rest = seg;
    const named = links.filter((l) => weaponBySlug.get(l)).sort((a, b) => weaponBySlug.get(b).name.length - weaponBySlug.get(a).name.length)
      .filter((l) => {
        const re = new RegExp(`\\b${weaponBySlug.get(l).name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (!re.test(rest)) return false;
        rest = rest.replace(re, ' ');
        return true;
      });
    for (const l of named.length ? named : links) {
      const w = weaponBySlug.get(l);
      if (!w || (cls.length && !cls.includes(w.type))) continue;
      for (const t of tals) {
        if (!pool.get(l)?.has(t)) errors.push(`${file} swap "${label}": ${w.name} doesn't roll ${talentSources[t].name}, but the line says it does`);
      }
    }
  }
}

// Build sheet items: <div class="bsheet__item">...<a class="bsheet__name" href="...">...</a>...<span class="bsheet__pick">...Name</span>
function checkSheet(file, body) {
  const items = body.split('class="bsheet__item').slice(1);
  for (const it of items) {
    const href = (it.match(/class="bsheet__name"[^>]*href="([^"]+)"/) || [])[1];
    if (!href) { checkAlternatives(file, it); continue; }
    const picks = [...it.matchAll(/class="bsheet__pick">(?:<img[^>]*>)?([^<]+)<\/span>/g)].map((m) => m[1].trim());
    const where = `${file} build sheet (${href})`;
    const wm = href.match(/^\/database\/weapons\/([a-z0-9-]+)\/?/);
    if (wm) {
      const ts = picks.map((n) => weaponTalentByName.get(n.toLowerCase())).filter(Boolean);
      checkWeapon(where, wm[1], wm[1], ts, body);
      continue;
    }
    const gm = href.match(/^\/database\/gear\/#([a-z0-9-]+)/);
    if (gm && gear.pieces[gm[1]]) {
      const piece = gm[1];
      const slot = gear.pieces[piece].slot;
      for (const n of picks) {
        const key = n.toLowerCase();
        if (setNames.has(key) && !piecesOf(gear.sets, setNames.get(key)).has(piece)) {
          errors.push(`${where}: ${gear.pieces[piece].name} doesn't carry ${n}`);
        }
        const lists = slot === 'Body Armor' ? [baNames, gear.bodyArmorTalents] : slot === 'Backpack' ? [bpNames, gear.backpackTalents] : null;
        if (lists && lists[0].has(key) && !piecesOf(lists[1], lists[0].get(key)).has(piece)) {
          errors.push(`${where}: ${gear.pieces[piece].name} can't roll ${n}`);
        }
      }
    }
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(md|mdx)$/.test(f) ? [p] : [];
  });
}

let posts = 0;
let hashes = 0;
for (const path of walk(join(root, 'src/content'))) {
  const text = readFileSync(path, 'utf8');
  const file = relative(root, path);
  posts++;
  const h = text.match(/^plannerHash:\s*"([^"]+)"/m);
  if (h) { hashes++; checkPlanner(file, h[1], text); }
  if (text.includes('bsheet__item')) checkSheet(file, text);
}

for (const w of warnings) console.log('  warn  ' + w);
for (const e of errors) console.log('  ERROR ' + e);
console.log(`Roll check: ${posts} posts, ${hashes} planner links. ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
