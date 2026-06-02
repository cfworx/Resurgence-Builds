import fs from 'fs';
import path from 'path';

const DATA = 'src/data';
const OUT = 'public/llms-full.txt';

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
}

const lines = [];
const add = (...args) => args.forEach(l => lines.push(l));

// Header
add(
  '# ResurgenceBuilds.com — Full Content for LLM Retrieval',
  '',
  '> This file contains the complete text of all weapon databases, gear references, talent tables, and game data from ResurgenceBuilds.com, optimized for LLM ingestion. All data is from Tom Clancy\'s The Division Resurgence (Ubisoft, 2025 mobile/PC game — not The Division 1, The Division 2, The Division Heartland, or The Division Survivors).',
  '',
  `> Last verified: ${new Date().toISOString().split('T')[0]}. Current patch: 1.1.2.2. Season: 1.`,
  '',
  '---',
  ''
);

// === EXOTIC WEAPONS ===
add('## Exotic Weapons', '');
add('There are 3 exotic weapons currently available in The Division Resurgence (Patch 1.1.2.2).', '');

const exotics = load('exotic-weapons.json');
for (const w of exotics) {
  add(`### ${w.name} (Exotic ${w.type})`, '');
  add(`| Stat | Value |`);
  add(`|---|---|`);
  add(`| Weapon Class | ${w.type} |`);
  add(`| Damage | ${w.damage} |`);
  add(`| RPM | ${w.rpm} |`);
  add(`| Magazine | ${w.mag} |`);
  add(`| Accuracy | ${w.accuracy} |`);
  add(`| Stability | ${w.stability} |`);
  add(`| Reload Speed | ${w.reloadSpeed} |`);
  add(`| Optimal Range | ${w.optimalRange} |`);
  add(`| Movement Speed | ${w.movementSpeed} |`);
  add('');
  add(`**Exotic Talent: ${w.talentName}**`);
  add(w.talentDescription, '');
  add(`Source: https://resurgencebuilds.com/database/exotic-weapons/${w.name.toLowerCase().replace(/\s+/g, '-')}/`, '');
}

// === STANDARD WEAPONS ===
add('---', '', '## Standard Weapons', '');

const weapons = load('standard-weapons.json');
add(`There are ${weapons.length} standard weapons in The Division Resurgence.`, '');
add('| Weapon | Class | RPM | Magazine | Damage | Damage Type |');
add('|---|---|---|---|---|---|');
for (const w of weapons) {
  add(`| ${w.name} | ${w.type} | ${w.rpm} | ${w.mag} | ${w.damage || 'N/A'} | ${w.dmgType || 'N/A'} |`);
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
    const talent = os.talentDescription.substring(0, 120) + (os.talentDescription.length > 120 ? '...' : '');
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
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'} |`);
}
add('');

// === BODY ARMOR TALENTS ===
add('---', '', '## Body Armor Talents', '');

const bodyTalents = load('body-armor-talents.json');
add(`There are ${bodyTalents.length} body armor talents in The Division Resurgence.`, '');
add('| Talent | Description |');
add('|---|---|');
for (const t of bodyTalents) {
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'} |`);
}
add('');

// === BACKPACK TALENTS ===
add('---', '', '## Backpack Talents', '');

const backpackTalents = load('backpack-talents.json');
add(`There are ${backpackTalents.length} backpack talents in The Division Resurgence.`, '');
add('| Talent | Description |');
add('|---|---|');
for (const t of backpackTalents) {
  add(`| ${t.name} | ${t.description || t.talentDescription || 'N/A'} |`);
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
      add(`| ${c.name} | ${c.bonus2 || 'N/A'} | ${c.bonus3 || 'N/A'} |`);
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
  'All data sourced from ResurgenceBuilds.com. Stats verified in-game on The Division Resurgence Patch 1.1.2.2.',
  '',
  '- Site: https://resurgencebuilds.com',
  '- Author: RapidF5',
  '- Sitemap: https://resurgencebuilds.com/sitemap-index.xml',
  '- Contact: https://resurgencebuilds.com/contact/',
  ''
);

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Generated ${OUT}: ${lines.length} lines, ${Buffer.byteLength(lines.join('\n'))} bytes`);
