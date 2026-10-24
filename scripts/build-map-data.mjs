#!/usr/bin/env node
/**
 * Builds src/data/pois.json for the interactive map.
 *
 * Inputs (src/data/map-sources/):
 *   fandom-nyc.json  — open-world markers from The Division Wiki community map (CC BY-SA 3.0)
 *   fandom-dz.json   — Dark Zone markers from The Division Wiki community map (CC BY-SA 3.0)
 *
 * The community maps use their own map images. We convert their coordinates to
 * our base map (public/images/map/manhattan-base.jpg, 1920x1683, served in a
 * 2190x1920 coordinate space) with perspective transforms (homographies) fitted
 * to map-outline corners that are visible on both images:
 *   - Open world: 8 playable-area outline corners, max residual ~3 px (1920 px image).
 *   - Dark Zone: 6 Dark Zone outline corners, max residual ~7 px. The community DZ map
 *     is a flat schematic, so DZ markers are flagged as approximate.
 *
 * Usage: node scripts/build-map-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const NYC = read('src/data/map-sources/fandom-nyc.json');
const DZ = read('src/data/map-sources/fandom-dz.json');

/* ---------- Transforms ---------- */
const H_NYC = [
  [1.74720920283, -0.174069598144, -262.98864046],
  [0.00675553823365, 1.81147568303, -108.318565776],
  [6.86062920804e-06, 7.4540424609e-05, 1.0],
];
const H_DZ = [
  [1.09893232964, -0.552045304394, 921.953968285],
  [0.0540266697981, 0.706366763, 168.598077996],
  [5.05859726349e-05, -0.000350590174264, 1.0],
];
const IMG_W = 1920; // base map pixel width
const COORD_W = 2190; // coordinate space used by pois.json / map engine
const COORD_H = 1920;
const S = COORD_W / IMG_W;

function project(H, x, y) {
  const w = H[2][0] * x + H[2][1] * y + H[2][2];
  return [(H[0][0] * x + H[0][1] * y + H[0][2]) / w, (H[1][0] * x + H[1][1] * y + H[1][2]) / w];
}
function toCoords(H, xFandom, yUpFandom, fandomHeight) {
  const [u, v] = project(H, xFandom, fandomHeight - yUpFandom); // fandom origin is bottom-left
  return [Math.round(u * S), Math.round(v * S)];
}

/* ---------- Text helpers ---------- */
function cleanWiki(s = '') {
  return s
    .replace(/'''/g, '')
    .replace(/''/g, '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/<br\s*\/?>/gi, ' · ')
    .replace(/\s+·\s+·\s+/g, ' · ')
    .replace(/\s+/g, ' ')
    .trim();
}
const levelOf = (d) => { const m = /level (\d+)/i.exec(d || ''); return m ? Number(m[1]) : null; };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- Categories ---------- */
const CATEGORIES = [
  // Hubs
  { id: 'safe_house', label: 'Safe Houses', group: 'Hubs', color: '#F26822', icon: 'house', defaultOn: true },
  { id: 'base', label: 'Base of Operations', group: 'Hubs', color: '#FFB020', icon: 'base', defaultOn: true },
  { id: 'settlement', label: 'Settlements', group: 'Hubs', color: '#34D399', icon: 'tent', defaultOn: true },
  { id: 'clan_fob', label: 'Clan FOB', group: 'Hubs', color: '#A78BFA', icon: 'flag', defaultOn: true },
  { id: 'services', label: 'Vendors & Stations', group: 'Hubs', color: '#60A5FA', icon: 'wrench', defaultOn: false },
  { id: 'landmark', label: 'Landmarks', group: 'Hubs', color: '#E5E7EB', icon: 'landmark', defaultOn: false },
  // Missions & activities
  { id: 'main_mission', label: 'Main Missions', group: 'Missions & Activities', color: '#F87171', icon: 'star', defaultOn: true },
  { id: 'side_mission', label: 'Side Missions', group: 'Missions & Activities', color: '#FBBF24', icon: 'side', defaultOn: false },
  { id: 'instance', label: 'Mission Instances', group: 'Missions & Activities', color: '#F472B6', icon: 'portal', defaultOn: true },
  { id: 'world_event', label: 'World Events', group: 'Missions & Activities', color: '#FB923C', icon: 'alert', defaultOn: false, wip: true },
  { id: 'nest', label: 'Hostile Nests', group: 'Missions & Activities', color: '#EF4444', icon: 'nest', defaultOn: false, wip: true },
  { id: 'nest_investigation', label: 'Nest Investigations', group: 'Missions & Activities', color: '#FCA5A5', icon: 'search', defaultOn: false, wip: true },
  { id: 'missing_signal', label: 'Missing Signals', group: 'Missions & Activities', color: '#22D3EE', icon: 'radar', defaultOn: false, wip: true },
  // Collectibles (trackable)
  { id: 'encrypted_crate', label: 'Encrypted Crates', group: 'Collectibles', color: '#F59E0B', icon: 'lock', defaultOn: true, trackable: true },
  { id: 'shd_crate', label: 'SHD Crates', group: 'Collectibles', color: '#10B981', icon: 'crate', defaultOn: false, trackable: true },
  { id: 'echo', label: 'ECHOs', group: 'Collectibles', color: '#38BDF8', icon: 'echo', defaultOn: false, trackable: true },
  { id: 'artifact', label: 'Artifacts', group: 'Collectibles', color: '#FDE047', icon: 'gem', defaultOn: false, trackable: true },
  { id: 'audio_log', label: 'Audio Logs', group: 'Collectibles', color: '#C084FC', icon: 'audio', defaultOn: false, trackable: true },
  { id: 'ammo', label: 'Ammo Crates', group: 'Collectibles', color: '#94A3B8', icon: 'ammo', defaultOn: false },
  // Dark Zone
  { id: 'dz_extraction', label: 'Extraction Zones', group: 'Dark Zone', color: '#2DD4BF', icon: 'extract', defaultOn: true, approx: true },
  { id: 'dz_landmark', label: 'DZ Landmarks', group: 'Dark Zone', color: '#FACC15', icon: 'landmark', defaultOn: true, approx: true },
  { id: 'dz_gate', label: 'DZ Gates', group: 'Dark Zone', color: '#E879F9', icon: 'gate', defaultOn: false, approx: true },
  { id: 'dz_leader', label: 'DZ Enemy Leaders', group: 'Dark Zone', color: '#DC2626', icon: 'skull', defaultOn: false, approx: true },
  { id: 'dz_contaminated', label: 'Extremely Contaminated', group: 'Dark Zone', color: '#84CC16', icon: 'bio', defaultOn: false, approx: true },
];

const NYC_CAT = {
  '1': 'safe_house', '2': 'base', '3': 'landmark', '4': 'settlement', '5': 'instance', '6': 'clan_fob',
  '7': 'main_mission', '8': 'side_mission', '9': 'echo', '10': 'artifact', '11': 'audio_log',
  '12': 'encrypted_crate', '13': 'shd_crate', '14': 'services', '15': 'services', '16': 'ammo',
  '17': 'services', '18': 'services', '19': 'services', '20': 'services', '21': 'services',
  '22': 'world_event', '23': 'nest', '24': 'nest_investigation', '25': 'missing_signal',
};
const SERVICE_NAME = { '14': 'Dark Zone Vendor', '15': 'Stash', '17': 'Specialization Quartermaster', '18': 'Equipment Improvement Station', '19': 'Gear Crafting Station', '20': 'Weapon Crafting Station', '21': 'Vendor' };
const DZ_CAT = { '1': 'safe_house', '2': 'dz_gate', '3': 'dz_contaminated', '4': 'dz_extraction', '5': 'dz_landmark', '6': 'dz_leader', '7': null };

/* Encrypted crate codes from our Safe Codes guide, only where the guide and the
   community map agree on the clue. Crates 02, 10 and 14 are left without a code
   because sources disagree. */
const CRATE_CODES = {
  1: '0115', 3: 'Randomized (read Code Clue 11)', 4: '1883', 5: '0616', 6: '7716', 7: '1450', 8: '1845',
  9: '1124', 11: '3580', 12: 'Randomized (read Code Clue 08)', 13: '7069', 15: '1987', 16: '1350',
  17: '2010', 18: '0078', 19: '1105', 20: 'Randomized (read Code Clue 04)', 21: '0123',
};

/* ---------- Build ---------- */
const NYC_H = NYC.bounds[1][1];
const DZ_H = DZ.bounds[1][1];

// Items that the community map parks in a legend strip because they live inside instanced missions.
const isInstanceStrip = (m) => m[1] < 260 && m[2] >= 225 && m[2] <= 300;
const OFF_MAP_INSTANCES = new Set(['Chinatown Rescue', 'Wall Street Woes', 'Liberty and Justice for All']);

const raw = [];
const insideInstances = {}; // mission name -> [{type,name}]
const offMap = [];

for (const m of NYC.markers) {
  const [cid, x, y, title, desc, , id] = m;
  const category = NYC_CAT[cid];
  const description = cleanWiki(desc);
  if (isInstanceStrip(m)) {
    const mm = /Main Mission:\s*([^·]+?)(?:\s·|$)/.exec(description);
    const parent = mm ? mm[1].trim() : (title === 'Conflict Ops' ? 'Conflict' : null);
    const type = cid === '9' ? 'ECHO' : cid === '11' ? 'Audio log' : cid === '7' ? 'Main mission' : cid === '8' ? 'Side mission' : 'Item';
    if (parent) (insideInstances[parent] ||= []).push({ type, name: title.replace(/\s*\(ECHO \d+\)/, '') });
    else offMap.push({ type, name: title, note: description });
    continue;
  }
  // ECHO 14 (Liberty Island) sits next to the Wall Street Woes bubble; it lives inside that instance.
  if (cid === '9' && /Main Mission:/.test(description) && x < 260) {
    const parent = /Main Mission:\s*(.+)$/.exec(description)[1].trim();
    (insideInstances[parent] ||= []).push({ type: 'ECHO', name: title.replace(/\s*\(ECHO \d+\)/, '') });
    continue;
  }
  if (cid === '5' && OFF_MAP_INSTANCES.has(title)) {
    offMap.push({ type: 'Mission instance', name: title, note: 'Instanced mission outside the open-world map. Launch it from its bubble on the edge of the in-game map.' });
    continue;
  }
  const [cx, cy] = toCoords(H_NYC, x, y, NYC_H);
  raw.push({ srcId: `nyc-${id}`, cid, category, name: title, description, x: cx, y: cy, fx: x, fy: y, map: 'nyc' });
}

for (const m of DZ.markers) {
  const [cid, x, y, title] = m;
  const category = DZ_CAT[cid];
  if (!category) continue;
  const [cx, cy] = toCoords(H_DZ, x, y, DZ_H);
  raw.push({ srcId: `dz-${slug(title)}-${Math.round(x)}-${Math.round(y)}`, cid, category, name: title, description: '', x: cx, y: cy, fx: x, fy: y, map: 'dz' });
}

// Hubs (safe houses, BoO, settlement) absorb the stash / ammo crate / station markers
// that the community map places right next to them, so the map isn't a pile of icons.
const HUB_CATS = new Set(['safe_house', 'base', 'settlement']);
// Community-map pixels. The BoO is a big building: its vendors sit up to ~21 px from its marker.
const HUB_RADIUS = { base: 24, settlement: 16, safe_house: 14 };
const hubs = raw.filter((r) => HUB_CATS.has(r.category));
for (const h of hubs) h.amenities = [];
const nearestHub = (r, radius) => {
  let best = null; let bd = Infinity;
  for (const h of hubs) {
    if (h.map !== r.map) continue;
    const d = Math.hypot(h.fx - r.fx, h.fy - r.fy);
    if (d < bd) { bd = d; best = h; }
  }
  if (!best) return null;
  return bd <= (radius ?? HUB_RADIUS[best.category]) ? best : null;
};
const kept = [];
for (const r of raw) {
  if (r.category === 'services' || r.category === 'ammo') {
    const hub = nearestHub(r);
    if (hub) {
      const label = r.category === 'ammo' ? 'Ammo Crate' : SERVICE_NAME[r.cid];
      if (!hub.amenities.includes(label)) hub.amenities.push(label);
      continue;
    }
  }
  kept.push(r);
}

// Merge co-located markers of the same category (mission givers, service clusters).
// Chain merge: a marker joins a group if it is close to ANY member of that group.
const MERGE_DIST = 6; // in community-map pixels
const MERGEABLE = new Set(['main_mission', 'side_mission', 'services']);
const parent = kept.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
for (let i = 0; i < kept.length; i++) {
  for (let j = i + 1; j < kept.length; j++) {
    const a = kept[i]; const b = kept[j];
    if (!MERGEABLE.has(a.category) || a.category !== b.category || a.map !== b.map) continue;
    if (Math.hypot(a.fx - b.fx, a.fy - b.fy) <= MERGE_DIST) parent[find(i)] = find(j);
  }
}
const groups = new Map();
kept.forEach((r, i) => {
  const k = find(i);
  if (!groups.has(k)) groups.set(k, { ...r, entries: [] });
  groups.get(k).entries.push(r);
});
const merged = [...groups.values()];
// Recompute merged group positions as the mean of their members.
for (const g of merged) {
  if (g.entries.length > 1) {
    g.x = Math.round(g.entries.reduce((a, e) => a + e.x, 0) / g.entries.length);
    g.y = Math.round(g.entries.reduce((a, e) => a + e.y, 0) / g.entries.length);
  }
}
// District boundaries are not verified, so POIs carry no district field on purpose.

const pois = [];
const usedIds = new Set();
for (const g of merged) {
  const cat = g.category;
  let name = g.name;
  let description = g.description;
  const extra = {};
  if (HUB_CATS.has(cat) && g.amenities && g.amenities.length) {
    extra.amenities = g.amenities;
  }
  if (cat === 'services') {
    const names = [...new Set(g.entries.map((e) => SERVICE_NAME[e.cid]))];
    name = names.length > 1 ? 'Vendors & Stations' : names[0];
    extra.amenities = names;
    description = '';
  } else if (cat === 'main_mission' || cat === 'side_mission') {
    const list = g.entries.map((e) => ({ name: e.name, level: levelOf(e.description) }))
      .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    if (list.length > 1) {
      const hub = nearestHub(g, 20);
      const near = hub ? null : nearestHub(g, 60);
      const kind = cat === 'main_mission' ? 'Main missions' : 'Side missions';
      name = hub ? `${kind} at ${hub.name}`
        : near ? `${kind} near ${near.name}`
        : `${kind}: ${list.map((m) => m.name).join(', ')}`;
      extra.missions = list;
      description = `${list.length} missions start here. Unlock levels per the community map.`;
    } else {
      const lv = list[0].level;
      description = lv ? `Unlocks at level ${lv} (per the community map).` : '';
      if (lv) extra.level = lv;
    }
  } else if (cat === 'encrypted_crate') {
    const n = Number((/Encrypted Crate (\d+)/.exec(g.name) || [])[1]);
    if (n && CRATE_CODES[n]) extra.code = CRATE_CODES[n];
    if (n && !CRATE_CODES[n]) extra.codeNote = 'Code not listed: community sources disagree on this crate. Read the clue in-game.';
    extra.crateNumber = n || undefined;
  } else if (cat === 'instance') {
    if (insideInstances[g.name]) extra.inside = insideInstances[g.name];
  } else if (cat === 'clan_fob') {
    description = 'Instanced clan hub. On the in-game map it appears as a bubble at the top edge.';
  } else if (cat === 'dz_landmark' || cat === 'dz_leader') {
    const mm = /^(.*?)\s*(?:-\s*|\()\s*(Normal|Hard|Challenging|Heroic)\)?$/.exec(g.name);
    if (mm) { name = cat === 'dz_leader' ? 'DZ Enemy Leader' : mm[1]; extra.difficulty = mm[2]; }
  }
  if (cat === 'safe_house' && g.map === 'dz') name = `Dark Zone ${g.name}`;
  if (cat === 'dz_contaminated') name = 'Extremely Contaminated Area';

  let id = `${cat}-${slug(name)}`;
  if (usedIds.has(id) || ['dz_contaminated', 'dz_gate', 'ammo', 'world_event', 'nest', 'nest_investigation', 'missing_signal', 'services', 'dz_leader'].includes(cat)) {
    id = `${cat}-${g.srcId}`;
  }
  while (usedIds.has(id)) id += '-x';
  usedIds.add(id);

  const poi = { id, category: cat, name, x: g.x, y: g.y };
  if (description) poi.description = description;
  Object.assign(poi, extra);
  if (g.map === 'dz') poi.approx = true;
  pois.push(poi);
}

// Sanity: everything must sit inside the coordinate space.
const outside = pois.filter((p) => p.x < 0 || p.y < 0 || p.x > COORD_W || p.y > COORD_H);
if (outside.length) {
  console.error('Markers outside the map:', outside.map((p) => `${p.id} (${p.x},${p.y})`).join(', '));
  process.exit(1);
}

const counts = {};
for (const p of pois) counts[p.category] = (counts[p.category] || 0) + 1;
const out = {
  version: 2,
  generated: new Date().toISOString().slice(0, 10),
  image: { width: COORD_W, height: COORD_H },
  attribution: {
    text: 'Marker locations adapted from The Division Wiki community maps (Fandom), CC BY-SA 3.0. Encrypted crate codes from our Safe Codes guide.',
    sources: [NYC.source, DZ.source],
    license: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  categories: CATEGORIES.map((c) => ({ ...c, count: counts[c.id] || 0 })).filter((c) => c.count > 0),
  offMap,
  pois,
};
fs.writeFileSync(path.join(root, 'src/data/pois.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`pois.json: ${pois.length} markers`, counts, `offMap: ${offMap.length}`);
