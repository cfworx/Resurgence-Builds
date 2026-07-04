// Shared indexability logic for thin database item pages.
// Used by BOTH the Astro item templates (noindex meta tag) and astro.config.mjs
// (sitemap filter), so the sitemap can never disagree with the robots meta.
// Plain .mjs + fs so it loads identically under Vite and under Node config load.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

/** An item page is thin (→ noindex, out of sitemap) below this unique word count. */
export const THIN_WORD_THRESHOLD = 150;

export const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Count words across any mix of strings / arrays / note objects, ignoring empties. */
export function uniqueWordCount(...parts) {
  let text = '';
  const push = (p) => {
    if (!p) return;
    if (typeof p === 'string') text += ' ' + p;
    else if (Array.isArray(p)) p.forEach(push);
    else if (typeof p === 'object') Object.values(p).forEach(push);
  };
  parts.forEach(push);
  return text.split(/\s+/).filter(Boolean).length;
}

/** Unique (non-boilerplate) text for a weapon talent page. */
function weaponTalentUnique(talent, notes) {
  return [talent.name, talent.description, talent.upgradedName, talent.upgradedDescription, notes?.usageNotes, notes?.metaBuilds?.map(b => b.title), notes?.patchHistory?.map(p => p.note)];
}

/** Unique (non-boilerplate) text for a skill mod combo page. */
function skillModUnique(mod, notes) {
  return [mod.name, mod.bonus2, mod.bonus3, notes?.usageNotes, notes?.metaBuilds?.map(b => b.title), notes?.patchHistory?.map(p => p.note)];
}

export function isWeaponTalentIndexable(talent, notes) {
  return uniqueWordCount(...weaponTalentUnique(talent, notes)) >= THIN_WORD_THRESHOLD;
}

export function isSkillModIndexable(mod, notes) {
  return uniqueWordCount(...skillModUnique(mod, notes)) >= THIN_WORD_THRESHOLD;
}

/**
 * Full set of database item pathnames that must be EXCLUDED from the sitemap
 * (they carry a noindex meta tag). Pathnames include trailing slash.
 */
export function getNoindexedDatabasePaths() {
  const weaponTalents = readJson('weapon-talents.json');
  const wtNotes = readJson('weapon-talent-notes.json');
  const skillMods = readJson('skill-mod-combos.json');
  const smcNotes = readJson('skill-mod-combo-notes.json');

  const paths = [];
  for (const t of weaponTalents) {
    if (!isWeaponTalentIndexable(t, wtNotes[toSlug(t.name)])) {
      paths.push(`/database/weapon-talents/${toSlug(t.name)}/`);
    }
  }
  for (const m of skillMods) {
    if (!isSkillModIndexable(m, smcNotes[toSlug(m.name)])) {
      paths.push(`/database/skill-mod-combos/${toSlug(m.name)}/`);
    }
  }
  return new Set(paths);
}
