import fs from 'fs';
import path from 'path';

const DATA = 'src/data';
// Written straight into the build output (run after `astro build`), so it is regenerated on every deploy.
const OUT = 'dist/llms-full.txt';

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
}

const lines = [];
const add = (...args) => args.forEach(l => lines.push(l));

// Header
const status = load('season-status.json');
add(
  '# ResurgenceBuilds.com: Full Database Text for LLM Retrieval',
  '',
  '> The text of the weapon, gear, talent, OS Protocol and skill mod databases on ResurgenceBuilds.com, an independent fan site (not affiliated with Ubisoft). All data is for Tom Clancy\'s The Division Resurgence (Ubisoft; iOS and Android since March 31, 2026, PC on Steam and Ubisoft Connect since August 5, 2026). It is NOT data for The Division (2016), The Division 2, The Division Heartland or The Division Survivors, even where item names match.',
  '',
  `> Generated: ${new Date().toISOString().split('T')[0]}. Live game state: ${status.season} (since ${status.since}). ${status.headline} Each database page on the site shows when its values were last verified in game; official patch changes are applied from Ubisoft\'s notes.`,
  '',
  '---',
  ''
);

// === EXOTIC WEAPONS ===
add('## Exotic Weapons', '');
add('Exotic weapons with full stat entries in our database (newer exotics such as The Bighorn and The Diamondback are covered in the exotic weapons list at https://resurgencebuilds.com/guides/division-resurgence-exotic-weapons-list-2026/ until their stats are verified):', '');

// Entries with statsVerified: false are planner-only and have no database page.
const exotics = load('exotic-weapons.json').filter((w) => w.statsVerified !== false);
for (const w of exotics) {
  add(`### ${w.name} (Exotic ${w.type})`, '');
  add(`| Stat | Value |`);
  add(`|---|---|`);
  for (const [label, val] of [['Weapon Class', w.type], ['Damage', w.damage], ['RPM', w.rpm], ['Magazine', w.mag], ['Accuracy', w.accuracy], ['Stability', w.stability], ['Reload Speed', w.reloadSpeed], ['Optimal Range', w.optimalRange], ['Movement Speed', w.movementSpeed]]) {
    if (val !== undefined && val !== null && String(val).trim() !== '') add(`| ${label} | ${val} |`);
  }
  add('');
  add(`**Exotic Talent: ${w.talentName}**`);
  add(w.talentDescription, '');
  if (w.note) add(`Note: ${w.note}`, '');
  add(`Source: https://resurgencebuilds.com/database/exotic-weapons/${w.name.toLowerCase().replace(/\s+/g, '-')}/`, '');
}

// === STANDARD WEAPONS ===
add('---', '', '## Standard Weapons', '');

const weapons = load('standard-weapons.json').filter((w) => w.statsVerified !== false);
add(`There are ${weapons.length} standard weapons in The Division Resurgence.`, '');
add('| Weapon | Class | RPM | Magazine | Damage | Damage Type |');
add('|---|---|---|---|---|---|');
for (const w of weapons) {
  add(`| ${w.name} | ${w.type} | ${w.rpm || 'Not verified'} | ${w.mag || 'Not verified'} | ${w.damage || 'N/A'} | ${w.dmgType || 'N/A'} |`);
}
add('');

// === OS PROTOCOLS ===
add('---', '', '## OS Protocols', '');

const osProtocols = load('os-protocols.json');
add(`There are ${osProtocols.length} OS Protocols in The Division Resurgence, categorized by specialization focus.`, '');

const osBySpec = {};
for (const os of osProtocols) {
  const spec = os.specialization || 'Unknown';
  if (!osBySpec[spec]) osBySpec[spec] = [];
  osBySpec[spec].push(os);
}

for (const [spec, protocols] of Object.entries(osBySpec)) {
  add(`### ${spec} OS Protocols`, '');
  add('| Name | Rarity | Main Stat | Main Value | Talent |');
  add('|---|---|---|---|---|');
  for (const os of protocols) {
    const talent = os.talentDescription.substring(0, 120) + (os.talentDescription.length > 120 ? '...' : '') + (os.note ? ` (Note: ${os.note})` : '');
    add(`| ${os.name} | ${os.rarity} | ${os.mainStat} | ${os.mainValue} | ${talent} |`);
  }
  add('');
}

// === GEAR SET EFFECTS ===
add('---', '', '## Gear Set Effects', '');

const gearSets = load('gear-set-effects.json');
add(`There are ${gearSets.length} gear sets in The Division Resurgence.`, '');

for (const gs of gearSets) {
  add(`### ${gs.name}`, '');
  if (gs.bonus2) add(`- **2-Piece:** ${gs.bonus2}`);
  if (gs.bonus3) add(`- **3-Piece:** ${gs.bonus3}`);
  if (gs.bonus4) add(`- **4-Piece:** ${gs.bonus4}`);
  add('');
}

// === WEAPON TALENTS ===
add('---', '', '## Weapon Talents', '');

const weaponTalents = load('weapon-talents.json');
add(`There are ${weaponTalents.length} weapon talents in The Division Resurgence.`, '');
add('| Talent | Description |');
add('|---|---|');
for (const t of weaponTalents) {
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'}${t.note ? ` (Note: ${t.note})` : ''} |`);
}
add('');

// === BODY ARMOR TALENTS ===
add('---', '', '## Body Armor Talents', '');

const bodyTalents = load('body-armor-talents.json');
add(`There are ${bodyTalents.length} body armor talents in The Division Resurgence.`, '');
add('| Talent | Description |');
add('|---|---|');
for (const t of bodyTalents) {
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'}${t.note ? ` (Note: ${t.note})` : ''} |`);
}
add('');

// === BACKPACK TALENTS ===
add('---', '', '## Backpack Talents', '');

const backpackTalents = load('backpack-talents.json');
add(`There are ${backpackTalents.length} backpack talents in The Division Resurgence.`, '');
add('| Talent | Description |');
add('|---|---|');
for (const t of backpackTalents) {
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'}${t.note ? ` (Note: ${t.note})` : ''} |`);
}
add('');

// === BONUS ATTRIBUTES ===
add('---', '', '## Bonus Attributes', '');

if (fs.existsSync(path.join(DATA, 'bonus-attributes.json'))) {
  const attrs = load('bonus-attributes.json');
  add(`There are ${attrs.length} bonus attribute categories in The Division Resurgence.`, '');
  for (const a of attrs) {
    add(`### ${a.category}`, '');
    add(`Available attributes: ${a.attributes.join(', ')}`, '');
  }
}

// === SKILL MOD COMBOS ===
add('---', '', '## Skill Mod Combos', '');

if (fs.existsSync(path.join(DATA, 'skill-mod-combos.json'))) {
  const combos = load('skill-mod-combos.json');
  add(`There are ${combos.length} skill mod combos in The Division Resurgence.`, '');
  
  const combosBySpec = {};
  for (const c of combos) {
    const spec = c.specialization || 'General';
    if (!combosBySpec[spec]) combosBySpec[spec] = [];
    combosBySpec[spec].push(c);
  }
  
  for (const [spec, mods] of Object.entries(combosBySpec)) {
    add(`### ${spec} Skill Mods`, '');
    add('| Combo | 2-Piece Bonus | 3-Piece Bonus |');
    add('|---|---|---|');
    for (const c of mods) {
      add(`| ${c.name} | ${c.bonus2 || 'N/A'} | ${c.bonus3 || 'N/A'}${c.note ? ` (Note: ${c.note})` : ''} |`);
    }
    add('');
  }
}

// Footer
add(
  '---',
  '',
  '## Source & License',
  '',
  'All data from ResurgenceBuilds.com databases. Official cache odds: https://resurgencebuilds.com/database/drop-rates/ (transcribed from Ubisoft\'s Help Center).',
  '',
  '- Site: https://resurgencebuilds.com',
  '- Author: RapidF5',
  '- Sitemap: https://resurgencebuilds.com/sitemap-index.xml',
  '- Contact: https://resurgencebuilds.com/contact/',
  ''
);

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Generated ${OUT}: ${lines.length} lines, ${Buffer.byteLength(lines.join('\n'))} bytes`);
