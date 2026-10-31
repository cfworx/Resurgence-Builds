/* Build Planner engine for /builder/.
   Game data comes from the #builder-data JSON that src/pages/builder.astro writes from src/data.
   Share links are untrusted input: every value in a link is matched against that data before it
   is used, and text reaches the page only through textContent and setAttribute, never innerHTML. */
(() => {
  'use strict';

  const doc = document;
  const $ = (sel, root = doc) => root.querySelector(sel);
  const $$ = (sel, root = doc) => Array.from(root.querySelectorAll(sel));
  const lab = $('#lab');
  if (!lab) return;

  /* ---------- small helpers ---------- */
  const arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const key = (v) => str(v).trim().toLowerCase();
  const byName = (a, b) => str(a.name).localeCompare(str(b.name));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Element builder: props are attributes (class, text, dataset and on* listeners are special);
     children are nodes or plain strings, which become text nodes. */
  function h(tag, props, ...kids) {
    const node = doc.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : str(v));
      }
    }
    for (const kid of kids.flat(3)) {
      if (kid == null || kid === false || kid === '') continue;
      node.append(kid instanceof Node ? kid : doc.createTextNode(str(kid)));
    }
    return node;
  }
  const B = (text) => h('b', null, text);
  /* "a", "a and b", "a, b and c" (strings or nodes) */
  function joined(items) {
    const out = [];
    items.forEach((it, i) => {
      if (i > 0) out.push(i === items.length - 1 ? ' and ' : ', ');
      out.push(it);
    });
    return out;
  }
  const plural = (n, one, many) => (n === 1 ? one : many);

  /* ---------- data ---------- */
  let DATA = null;
  try { DATA = JSON.parse($('#builder-data').textContent); } catch (e) { DATA = null; }
  if (!DATA || typeof DATA !== 'object') return; // the check after this script shows the error line

  /* In-game art: item id -> path under /images/db/ (builder.astro). Only paths shaped like ours are used. */
  const IMG = DATA.img && typeof DATA.img === 'object' ? DATA.img : {};
  const imgOf = (id) => {
    const p = IMG[str(id)];
    return typeof p === 'string' && /^[a-z0-9-]+\/[a-z0-9-]+$/.test(p) ? `/images/db/${p}.webp` : '';
  };

  /* Items by id, by name and by any `aliases` (older names, such as the drop table's skill mod names) */
  function pool(list) {
    const items = arr(list).filter((x) => x && x.id != null && str(x.name));
    const ids = new Map();
    const names = new Map();
    for (const x of items) {
      ids.set(str(x.id), x);
      if (!names.has(key(x.name))) names.set(key(x.name), x);
    }
    for (const x of items) {
      for (const a of arr(x.aliases)) if (str(a).trim() && !names.has(key(a))) names.set(key(a), x);
    }
    return {
      items,
      get(v) {
        const s = str(v).trim();
        if (!s || s.length > 80) return null;
        return ids.get(s) || names.get(s.toLowerCase()) || null;
      },
    };
  }

  const SPECS = arr(DATA.specs && DATA.specs.specs).filter((s) => s && s.name && arr(s.focuses).length);
  const specOf = (name) => SPECS.find((s) => key(s.name) === key(name)) || null;
  function focusOf(spec, name) {
    const k = key(name);
    if (!spec || !k) return null;
    return spec.focuses.find((f) => key(f.name) === k || arr(f.aliases).some((a) => key(a) === k)) || null;
  }
  const focusStat = (st) => {
    const f = focusOf(specOf(st.spec), st.focus);
    return f ? str(f.stat) : '';
  };

  const STD = pool(DATA.standardWeapons);
  const EXO = pool(DATA.exoticWeapons);
  const getWeapon = (v) => EXO.get(v) || STD.get(v);
  const isExotic = (w) => !!w && EXO.items.includes(w);
  /* Talents that belong to an exotic (Breathe Free, Play Rough...) never roll on other guns:
     leave out anything marked exoticOnly, or named like an exotic's own talent. */
  const exoticTalents = new Set(EXO.items.map((e) => key(e.talentName)).filter(Boolean));
  const WT = pool(arr(DATA.weaponTalents).filter((t) => t && t.exoticOnly !== true && !exoticTalents.has(key(t.name))));
  /* Other names. Ones worked out by elimination (aliasBasis "elimination") aren't confirmed: links
     and search still match them, but they aren't shown as the item's other name. */
  const aliasList = (x) => arr(x && x.aliases).map(str).filter(Boolean).join(', ');
  const aliasText = (x) => (x && x.aliasBasis === 'elimination' ? '' : aliasList(x));
  const guessedAliases = (x) => (x && x.aliasBasis === 'elimination' ? aliasList(x) : '');
  /* A note marked caveat: true qualifies the item's effect text, so it is shown as small print
     wherever that text is shown. Other notes are patch history and stay out. Notes are never parsed. */
  const caveatOf = (x) => (x && x.caveat === true ? str(x.note).trim() : '');
  const BODY = pool(DATA.bodyArmorTalents);
  const PACK = pool(DATA.backpackTalents);
  const SETS = pool(DATA.gearSets);
  const OSP = pool(DATA.osProtocols);
  const MODS = pool(DATA.skillModCombos);
  const TEMPLATES = arr(DATA.templates).filter((t) => t && t.hash && t.name);
  /* What can roll where (the game's Build-Making Database Source lists): a weapon's talent pool, and
     for each gear set the body armor / backpack talents a piece of that set can carry. */
  const ROLLS = DATA.rolls && typeof DATA.rolls === 'object' ? DATA.rolls : null;
  function weaponPoolOf(wp) {
    const p = ROLLS && ROLLS.weapons && wp ? ROLLS.weapons[str(wp.id)] : null;
    return Array.isArray(p) && p.length ? new Set(p.map(str)) : null;
  }
  /* Guns whose recalibration pulled talents from the wrong pool until a patch fixed it: older copies
     can carry a talent outside the pool, so a creator's screenshot can show one. */
  const RECAL = ROLLS && ROLLS.recalFixed && typeof ROLLS.recalFixed === 'object' ? ROLLS.recalFixed : null;
  const recalFixed = (wp) => !!(RECAL && wp && arr(RECAL.weapons).map(str).includes(str(wp.id)));
  const recalWhen = () => `${str(RECAL && RECAL.patch)} (${str(RECAL && RECAL.dateText)})`;
  /* { talentId: ['Piece (T2)', ...] } for a slot ('body' or 'backpack') and set, or null when unknown */
  function gearRollsOf(slotId, setId) {
    const m = ROLLS && ROLLS.gear && ROLLS.gear[slotId];
    if (!m || !setId) return null;
    const r = m[str(setId)];
    return r && typeof r === 'object' ? r : null;
  }
  const piecesText = (list) => (list.length === 1 ? `Rolls on ${list[0]}.` : `Rolls on ${joined(list).join('')}.`);

  /* ---------- attributes ---------- */
  const CATS = ['Firepower', 'Toughness', 'Engineering', 'Universal'];
  function attrPool(groups) {
    const list = [];
    const byKey = new Map();
    for (const g of arr(groups)) {
      const cat = str(g && g.category) || 'Universal';
      for (const n of arr(g && g.attributes)) {
        const name = str(n).trim();
        if (!name || byKey.has(key(name))) continue;
        const rec = { name, cat };
        byKey.set(key(name), rec);
        list.push(rec);
      }
    }
    return { list, byKey, has: (n) => byKey.has(key(n)) };
  }
  const GEAR_ATTRS = attrPool(DATA.bonusAttributes);
  const WEAPON_ATTRS = attrPool(DATA.weaponBonusAttributes && DATA.weaponBonusAttributes.categories);
  const REMOVED_WEAPON_ATTRS = new Map();
  for (const r of arr(DATA.weaponBonusAttributes && DATA.weaponBonusAttributes.removed)) {
    for (const n of arr(r && r.attributes)) REMOVED_WEAPON_ATTRS.set(key(n), str(r.note));
  }

  /* Short codes keep links short. The first rows are the old planner's codes, so its links still
     open; an attribute without a code goes into the link by its full name. */
  const CODES = {
    'Weapon Damage': 'wd', 'Weapon Critical Hit Chance': 'chc', 'Weapon Critical Hit Damage': 'chd',
    'Headshot Damage': 'hsd', 'Weapon Multi-Shot Chance': 'wms', 'Rate of Fire': 'rof', 'Magazine Size': 'mag',
    'Reload Speed': 'rls', 'Accuracy': 'acc', 'Stability': 'stb', 'Optimal Range': 'opr', 'Firepower': 'fp',
    'Armor': 'arm', 'Max Health': 'mhp', 'Damage Reduction': 'dr', 'Received Healing': 'rh', 'Movement Speed': 'ms',
    'Toughness': 'tgh', 'Damage Bonus': 'db', 'Skill Damage': 'sd', 'Skill Duration': 'sdu',
    'Skill Cooldown Recovery': 'scr', 'Skill Critical Chance': 'scc', 'Skill Critical Damage': 'scd',
    'Skill Intensity': 'si', 'Skill Radius': 'sr', 'Skill Health': 'sh', 'Skill Multi-Shot Chance': 'sms',
    'Healing Intensity': 'hi', 'Signature Ability Charge Efficiency': 'sace', 'Engineering': 'eng',
    'Release Extra Protection': 'rep',
    'Damage to Elites': 'dte', 'All Weapon Damage': 'awd', 'All Skill Damage': 'asd',
    'Weapon Blast Damage': 'wbd', 'Weapon Piercing Damage': 'wpd', 'Weapon Shredding Damage': 'wsd',
    'Skill Blast Damage': 'sbd', 'Skill Piercing Damage': 'spd', 'Skill Shredding Damage': 'ssd',
  };
  const CODE_NAMES = new Map(Object.entries(CODES).map(([n, c]) => [c, n]));
  const KNOWN_NAMES = new Map(Object.keys(CODES).map((n) => [key(n), n]));

  /* Turns a link value (code or name) into an attribute name, or '' when it isn't one we know. */
  function canonicalAttr(v) {
    const s = str(v).trim();
    if (!s || s.length > 64) return '';
    const k = s.toLowerCase();
    if (CODE_NAMES.has(k)) return CODE_NAMES.get(k);
    const rec = GEAR_ATTRS.byKey.get(k) || WEAPON_ATTRS.byKey.get(k);
    if (rec) return rec.name;
    return KNOWN_NAMES.get(k) || '';
  }

  /* Category for stats that only come from set bonuses, OS stats, skill mods or old links */
  const OTHER_CATS = {
    'Optimal Range': 'Firepower', 'Rate of Fire': 'Firepower', 'Magazine Size': 'Firepower', 'Reload Speed': 'Firepower',
    'Accuracy': 'Firepower', 'Stability': 'Firepower', 'Firepower': 'Firepower', 'All Weapon Damage': 'Firepower',
    'Weapon Blast Damage': 'Firepower', 'Weapon Piercing Damage': 'Firepower', 'Weapon Shredding Damage': 'Firepower',
    'Health': 'Toughness', 'Toughness': 'Toughness', 'Release Extra Protection': 'Toughness',
    'Engineering': 'Engineering', 'Skill Damage': 'Engineering', 'All Skill Damage': 'Engineering',
    'Skill Health': 'Engineering', 'Healing Intensity': 'Engineering', 'Skill Blast Damage': 'Engineering',
    'Skill Piercing Damage': 'Engineering', 'Skill Shredding Damage': 'Engineering',
  };
  function statCat(name) {
    const rec = GEAR_ATTRS.byKey.get(key(name)) || WEAPON_ATTRS.byKey.get(key(name));
    return rec ? rec.cat : OTHER_CATS[name] || 'Universal';
  }
  const catClass = (c) => ({ Firepower: 'cat-fp', Toughness: 'cat-tough', Engineering: 'cat-eng' }[c] || 'cat-uni');

  /* Labels short enough for the gear cards; everything else uses full names */
  const SHORT = {
    'Weapon Critical Hit Chance': 'CHC', 'Weapon Critical Hit Damage': 'CHD', 'Weapon Damage': 'Weapon Dmg',
    'All Weapon Damage': 'All Weapon Dmg', 'Weapon Multi-Shot Chance': 'Multi-Shot', 'Headshot Damage': 'Headshot Dmg',
    'Damage Reduction': 'Dmg Reduction', 'Skill Critical Chance': 'Skill CHC', 'Skill Critical Damage': 'Skill CHD',
    'All Skill Damage': 'All Skill Dmg', 'Skill Multi-Shot Chance': 'Skill Multi-Shot', 'Skill Cooldown Recovery': 'Skill CDR',
    'Signature Ability Charge Efficiency': 'Signature Charge', 'Damage to Elites': 'Dmg to Elites',
    'Weapon Blast Damage': 'Blast Dmg', 'Weapon Piercing Damage': 'Piercing Dmg', 'Weapon Shredding Damage': 'Shredding Dmg',
    'Skill Blast Damage': 'Skill Blast Dmg', 'Skill Piercing Damage': 'Skill Piercing Dmg',
    'Skill Shredding Damage': 'Skill Shredding Dmg', 'Magazine Size': 'Magazine', 'Movement Speed': 'Move Speed',
    'Release Extra Protection': 'Extra Protection', 'Skill Damage': 'Skill Dmg', 'Damage Bonus': 'Dmg Bonus',
  };
  const short = (n) => SHORT[n] || n;
  /* Shown as a negative number in game (a shorter cooldown) */
  const NEGATIVE = new Set(['skill cooldown recovery']);

  /* ---------- numbers ---------- */
  function parseVal(v) {
    const s = str(v).trim().replace(',', '.');
    if (!s || s.length > 12 || !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    const n = Math.round(parseFloat(s) * 100) / 100;
    return Number.isFinite(n) && Math.abs(n) <= 9999 ? n : null;
  }
  const normVal = (attr, v) => (v == null ? null : NEGATIVE.has(key(attr)) ? -Math.abs(v) : v);
  const linkNum = (v) => String(Math.round(v * 100) / 100);
  function fmt(n, pct) {
    const r = Math.round(n * 100) / 100;
    const a = Math.abs(r);
    const body = pct ? (Number.isInteger(a) ? a.toFixed(1) : String(a)) : a.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return (r < 0 ? '-' : '+') + body + (pct ? '%' : '');
  }
  /* "+4.0% to +8.0%"; negative ranges read from small to large too: "-2.0% to -4.0%" */
  const fmtRange = (min, max, pct) => (min === max ? fmt(min, pct)
    : max <= 0 ? `${fmt(max, pct)} to ${fmt(min, pct)}` : `${fmt(min, pct)} to ${fmt(max, pct)}`);
  const an = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a');
  const num = (s) => parseFloat(str(s).replace(/,/g, ''));

  /* "Skill Cooldown Recovery -6.0%", "Optimal Range +10.0%", "Skill Health+[4.0%~8.0%]" */
  function parseBonus(text) {
    const s = str(text).trim();
    let m = s.match(/^(.*?)\s*([+-])?\s*\[\s*([\d.,]+)\s*(%?)\s*~\s*([\d.,]+)\s*(%?)\s*\]$/);
    if (m && m[1]) {
      const sign = m[2] === '-' ? -1 : 1;
      const a = num(m[3]) * sign;
      const b = num(m[5]) * sign;
      if (Number.isFinite(a) && Number.isFinite(b)) return { stat: m[1].trim(), min: Math.min(a, b), max: Math.max(a, b), pct: !!(m[4] || m[6]) };
    }
    m = s.match(/^(.*?)\s*([+-])\s*([\d.,]+)\s*(%?)$/) || s.match(/^(.*?)\s+()([\d.,]+)\s*(%?)$/);
    if (m && m[1]) {
      const v = num(m[3]) * (m[2] === '-' ? -1 : 1);
      if (Number.isFinite(v)) return { stat: m[1].trim(), min: v, max: v, pct: !!m[4] };
    }
    return null;
  }
  /* "+22.50%" or "+2,554" */
  function parseAmount(text) {
    const m = str(text).trim().match(/^([+-])?\s*([\d.,]+)\s*(%?)$/);
    if (!m) return null;
    const v = num(m[2]) * (m[1] === '-' ? -1 : 1);
    return Number.isFinite(v) ? { min: v, max: v, pct: !!m[3] } : null;
  }
  function bonusText(text) {
    const b = parseBonus(text);
    return b ? `${b.stat} ${fmtRange(b.min, b.max, b.pct)}` : str(text);
  }
  /* Set bonus tiers from bonus2, bonus3, bonus4 (any bonusN the data has) */
  function setTiers(set) {
    return Object.keys(set)
      .map((k) => ({ k, m: k.match(/^bonus(\d)$/) }))
      .filter((x) => x.m && str(set[x.k]).trim())
      .map((x) => ({ pieces: +x.m[1], text: str(set[x.k]) }))
      .sort((a, b) => a.pieces - b.pieces);
  }

  /* ---------- state ---------- */
  const SLOTS = [
    { id: 'mask', key: 'm', label: 'Mask' },
    { id: 'gloves', key: 'g', label: 'Gloves' },
    { id: 'holster', key: 'h', label: 'Holster' },
    { id: 'body', key: 'c', label: 'Body armor', talents: BODY },
    { id: 'backpack', key: 'p', label: 'Backpack', talents: PACK },
    { id: 'kneepads', key: 'k', label: 'Knee pads' },
  ];
  const SLOT = Object.fromEntries(SLOTS.map((s) => [s.id, s]));
  const WEAPON_LABEL = ['Primary', 'Secondary'];
  const emptyPiece = () => ({ set: '', talent: '', attrs: [{ a: '', v: null }, { a: '', v: null }] });
  const emptyWeapon = () => ({ id: '', tier: '', t: ['', ''], attrs: [{ a: '', v: null }, { a: '', v: null }] });
  const emptyState = () => ({
    name: '', spec: '', focus: '',
    gear: Object.fromEntries(SLOTS.map((s) => [s.id, emptyPiece()])),
    w: [emptyWeapon(), emptyWeapon()],
    os: '', mods: ['', '', ''],
  });
  /* Build names: no control or text-direction characters, 60 characters at most */
  const cleanName = (v) => str(v).replace(/[\u0000-\u001f\u007f-\u009f‎‏‪-‮⁦-⁩]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);

  let S = emptyState();
  let loadedTemplate = -1; // index of the last template loaded, for the template label
  let notice = ''; // one-line message about the last link that was loaded
  let spin = null; // the slot machine while its reels turn: { stop(), cancel() }
  const endSpin = () => { if (spin) spin.cancel(); };

  /* Skill mods: when the data says which skill each set is for, the three slots are the focus's
     three skills (planner-specs.json). Without that field they are three plain slots. */
  function focusSkills(st) {
    const f = focusOf(specOf(st.spec), st.focus);
    const skills = f ? arr(f.skills).map(str).filter(Boolean) : [];
    if (skills.length !== 3) return null;
    const mods = MODS.items.filter((m) => key(m.specialization) === key(st.spec));
    return mods.length && mods.every((m) => str(m.skill)) ? skills : null;
  }
  /* Puts skill mod ids into their slots (by skill, or by position without skill data) and returns
     how many were left out: another specialization, another focus's skill, or a slot taken twice. */
  function placeMods(st, ids) {
    const skills = focusSkills(st);
    const out = ['', '', ''];
    let left = 0;
    ids.forEach((id, i) => {
      if (!id) return;
      const m = MODS.get(id);
      if (!m || key(m.specialization) !== key(st.spec) || out.includes(str(m.id))) { left++; return; }
      const at = skills ? skills.findIndex((s) => key(s) === key(m.skill)) : i;
      if (at < 0 || at > 2 || out[at]) { left++; return; }
      out[at] = str(m.id);
    });
    st.mods = out;
    return left;
  }

  /* ---------- share links ----------
     Format (unchanged keys, so older links keep working):
     s=spec, sc=focus, n=name; gear prefix m g h c p k (mask, gloves, holster, body armor, backpack,
     kneepads) + s=set id, t=talent id, 1 and 2=attributes, 1v and 2v=roll values;
     w1s or w1e=weapon id (standard or exotic), w1tr=tier, w1t and w1t2=talents, w1b1 and w1b2=attributes,
     w1b1v and w1b2v=roll values; os=OS Protocol id; sm1 to sm3=skill mod ids. */
  const attrCode = (n) => CODES[n] || n;
  function encode(st) {
    if (!st.spec) return '';
    const p = new URLSearchParams();
    p.set('s', st.spec);
    if (st.focus) p.set('sc', st.focus);
    if (st.name) p.set('n', st.name);
    for (const s of SLOTS) {
      const g = st.gear[s.id];
      if (g.set) p.set(s.key + 's', g.set);
      if (g.talent) p.set(s.key + 't', g.talent);
      g.attrs.forEach((x, i) => {
        if (!x.a) return;
        p.set(s.key + (i + 1), attrCode(x.a));
        if (x.v != null) p.set(s.key + (i + 1) + 'v', linkNum(x.v));
      });
    }
    st.w.forEach((w, i) => {
      const n = i + 1;
      const wp = getWeapon(w.id);
      if (!wp) return;
      p.set('w' + n + (isExotic(wp) ? 'e' : 's'), str(wp.id));
      if (w.tier) p.set('w' + n + 'tr', w.tier);
      if (w.t[0]) p.set('w' + n + 't', w.t[0]);
      if (w.t[1]) p.set('w' + n + 't2', w.t[1]);
      w.attrs.forEach((x, j) => {
        if (!x.a) return;
        p.set('w' + n + 'b' + (j + 1), attrCode(x.a));
        if (x.v != null) p.set('w' + n + 'b' + (j + 1) + 'v', linkNum(x.v));
      });
    });
    if (st.os) p.set('os', st.os);
    st.mods.forEach((m, i) => { if (m) p.set('sm' + (i + 1), m); });
    return p.toString();
  }

  /* Reads a link. Anything that doesn't match the data is left out and counted in `dropped`. */
  function decode(raw) {
    const out = { state: null, dropped: 0, legacy: false };
    const text = str(raw).replace(/^#/, '');
    if (/^[bc]=/.test(text)) { out.legacy = true; return out; } // compressed links from the retired planners
    let p;
    try { p = new URLSearchParams(text); } catch (e) { return out; }
    const sp = specOf(p.get('s'));
    if (!sp) return out;
    const st = emptyState();
    let dropped = 0;
    const take = (k) => str(p.get(k)).trim();
    const miss = (v) => { if (v) dropped++; return ''; };
    const readAttrs = (prefix, attrs) => {
      for (let i = 0; i < 2; i++) {
        const raw1 = take(prefix + (i + 1));
        const rawV = take(prefix + (i + 1) + 'v');
        const a = canonicalAttr(raw1);
        if (!a || attrs.some((x) => x.a === a)) { miss(raw1); miss(rawV); continue; }
        const v = parseVal(rawV);
        if (rawV && v == null) dropped++;
        attrs[i].a = a;
        attrs[i].v = normVal(a, v);
      }
    };

    st.spec = sp.name;
    const fv = take('sc');
    const f = focusOf(sp, fv);
    st.focus = f ? f.name : (miss(fv), sp.focuses[0].name);
    st.name = cleanName(p.get('n'));

    for (const s of SLOTS) {
      const g = st.gear[s.id];
      const setV = take(s.key + 's');
      const set = SETS.get(setV);
      g.set = set ? str(set.id) : miss(setV);
      const talV = take(s.key + 't');
      const tal = s.talents ? s.talents.get(talV) : null;
      g.talent = tal ? str(tal.id) : miss(talV);
      readAttrs(s.key, g.attrs);
    }

    let exotics = 0;
    for (let i = 0; i < 2; i++) {
      const n = i + 1;
      const w = st.w[i];
      const sv = take('w' + n + 's');
      const ev = take('w' + n + 'e');
      const wp = getWeapon(ev) || getWeapon(sv);
      if (!wp || (isExotic(wp) && exotics > 0)) {
        // one exotic at a time, and a slot without a weapon keeps nothing else
        miss(sv); miss(ev);
        for (const k of ['tr', 't', 't2', 'b1', 'b1v', 'b2', 'b2v']) miss(take('w' + n + k));
        continue;
      }
      if (isExotic(wp)) exotics++;
      w.id = str(wp.id);
      const tier = take('w' + n + 'tr').toUpperCase();
      if (/^T[012]$/.test(tier)) w.tier = tier;
      else miss(tier);
      ['t', 't2'].forEach((k, j) => {
        const tv = take('w' + n + k);
        const t = WT.get(tv);
        if (!t || w.t.includes(str(t.id))) return miss(tv);
        w.t[j] = str(t.id);
      });
      readAttrs('w' + n + 'b', w.attrs);
    }

    const ov = take('os');
    const os = OSP.get(ov);
    st.os = os ? str(os.id) : miss(ov);
    const mv = ['sm1', 'sm2', 'sm3'].map(take);
    if (!mv[0] && take('smc')) mv[0] = take('smc'); // oldest links used smc for the first mod
    dropped += placeMods(st, mv.map((v) => { const m = MODS.get(v); if (!m) { miss(v); return ''; } return str(m.id); }));

    out.state = st;
    out.dropped = Math.max(0, dropped);
    return out;
  }

  /* Templates in their canonical link form, to tell when the build is an unchanged template */
  const TEMPLATE_KEYS = TEMPLATES.map((t) => {
    const r = decode(t.hash);
    return r.state ? encode(r.state) : '';
  });
  function activeTemplate() {
    if (!S.spec) return -1;
    return TEMPLATE_KEYS.indexOf(encode(S));
  }
  /* A template's note: its text, plus the guide's weapons that aren't in the weapon list yet */
  function templateNote(t) {
    const n = t && t.note;
    if (!n) return '';
    if (typeof n === 'string') return n;
    const missing = arr(n.missingWeapons).filter((x) => Array.isArray(x) && x[0] && !getWeapon(x[0]));
    const parts = [];
    if (missing.length) {
      const names = joined(missing.map(([name, slot]) => `${name} (${str(slot)} weapon)`)).join('');
      parts.push(`The ${names} ${missing.length === 1 ? "isn't" : "aren't"} in the planner's weapon list yet, so ${missing.length === 1 ? 'that slot is' : 'those slots are'} empty.`);
    }
    if (n.text) parts.push(str(n.text));
    return parts.join(' ');
  }

  /* ---------- totals ---------- */
  function setCounts(st) {
    const counts = new Map();
    for (const s of SLOTS) {
      const id = st.gear[s.id].set;
      if (id) counts.set(id, (counts.get(id) || 0) + 1);
    }
    return counts;
  }

  /* Each stat collects { pct, flat } ranges, the rolls without a value, and where it all came from.
     Talent effects are conditional, so they are not added. */
  function computeStats(st) {
    const rows = new Map();
    const row = (stat) => {
      if (!rows.has(stat)) rows.set(stat, { stat, pct: null, flat: null, unvalued: 0, sources: [] });
      return rows.get(stat);
    };
    const add = (stat, part, src) => {
      const name = str(stat).trim();
      if (!name) return;
      const r = row(name);
      if (!part) {
        r.unvalued++;
        r.sources.push({ src, text: 'No value entered' });
        return;
      }
      const bucket = part.pct ? 'pct' : 'flat';
      const cur = r[bucket] || { min: 0, max: 0 };
      r[bucket] = { min: cur.min + part.min, max: cur.max + part.max };
      r.sources.push({ src, text: fmtRange(part.min, part.max, part.pct) });
    };

    for (const [id, n] of setCounts(st)) {
      const set = SETS.get(id);
      if (!set) continue;
      for (const t of setTiers(set)) {
        if (n < t.pieces) continue;
        const b = parseBonus(t.text);
        if (b) add(b.stat, b, `${set.name} ${t.pieces}pc`);
      }
    }
    for (const s of SLOTS) {
      for (const x of st.gear[s.id].attrs) {
        if (x.a) add(x.a, x.v == null ? null : { min: x.v, max: x.v, pct: true }, s.label);
      }
    }
    st.w.forEach((w, i) => {
      const wp = getWeapon(w.id);
      if (!wp) return;
      for (const x of w.attrs) {
        if (x.a) add(x.a, x.v == null ? null : { min: x.v, max: x.v, pct: true }, `${WEAPON_LABEL[i]}: ${wp.name}`);
      }
    });
    const os = OSP.get(st.os);
    if (os) {
      const main = parseAmount(os.mainValue);
      if (os.mainStat && main) add(os.mainStat, main, os.name);
      for (const i of [1, 2, 3]) {
        const amount = parseAmount(os['val' + i]);
        if (os['attr' + i] && amount) add(os['attr' + i], amount, os.name);
      }
    }
    for (const id of st.mods) {
      const m = MODS.get(id);
      const b = m && parseBonus(m.bonus2);
      if (b) add(b.stat, b, `${m.name} 2pc`);
    }
    return rows;
  }

  /* ---------- checks and score ---------- */
  const EH_GIVE = /\bgrants?\b[^.]*\bextra health\b/i;
  const EH_USE = /\b(while possessing|having|gaining) extra health\b/i;

  function analyze(st, stats) {
    const res = { checks: [], score: 0, grade: 'Not started', cls: 'g-incomplete' };
    if (!st.spec) {
      res.checks.push(['info', ['Pick a specialization to start.']]);
      return res;
    }
    const stat = focusStat(st);
    const warns = [];
    const infos = [];
    const oks = [];

    // Sets: pieces that don't reach a bonus, and pieces past the last bonus
    let contributing = 0;
    for (const [id, n] of setCounts(st)) {
      const set = SETS.get(id);
      const tiers = set ? setTiers(set) : [];
      if (!tiers.length) continue;
      const min = tiers[0].pieces;
      const max = tiers[tiers.length - 1].pieces;
      if (n < min) {
        warns.push([B(set.name), `: ${n} ${plural(n, 'piece', 'pieces')}, so no set bonus yet.`]);
      } else {
        contributing += Math.min(n, max);
        if (n > max) warns.push([B(set.name), `: ${n} pieces. Its bonuses stop at ${max}, so ${n - max} ${plural(n - max, 'piece adds', 'pieces add')} nothing.`]);
      }
    }

    // Attributes: offense stats from the other offense tree, and rolls that aren't current
    const picked = [];
    for (const s of SLOTS) for (const x of st.gear[s.id].attrs) if (x.a) picked.push({ a: x.a, where: s.label.toLowerCase(), weapon: false });
    st.w.forEach((w) => {
      const wp = getWeapon(w.id);
      if (wp) for (const x of w.attrs) if (x.a) picked.push({ a: x.a, where: wp.name, weapon: true });
    });
    const offCat = stat === 'Firepower' ? 'Engineering' : stat === 'Engineering' ? 'Firepower' : '';
    const off = new Map();
    let fitting = 0;
    for (const x of picked) {
      if (offCat && statCat(x.a) === offCat) {
        if (!off.has(x.a)) off.set(x.a, []);
        off.get(x.a).push(x.where);
      } else fitting++;
      if (!x.weapon && !GEAR_ATTRS.has(x.a)) infos.push([B(x.a), ` on the ${x.where} isn't in our gear attribute list.`]);
      if (x.weapon && !WEAPON_ATTRS.has(x.a)) {
        const note = REMOVED_WEAPON_ATTRS.get(key(x.a));
        infos.push([B(x.a), ` on the ${x.where} ${note || "isn't in our weapon attribute list"}.`]);
      }
    }
    if (off.size) {
      infos.push([`${offCat} stats on ${an(stat)} ${stat} build: `, joined([...off].map(([a, where]) => [B(a), ` (${joined(where).join('')})`])), '.']);
    }

    // Rolls the game allows: weapon talents from the gun's pool, body armor / backpack talents that a
    // piece of the chosen set can carry (the Build-Making Database Source lists)
    st.w.forEach((w) => {
      const wp = getWeapon(w.id);
      const ps = wp && weaponPoolOf(wp);
      if (!ps) return;
      for (const id of w.t) {
        const t = WT.get(id);
        if (!t || ps.has(str(t.id))) continue;
        if (recalFixed(wp)) {
          infos.push([B(t.name), ` isn't in the ${wp.name}'s talent pool, so one you get now can't roll it. Older copies can have it: until ${recalWhen()}, recalibrating this gun pulled talents from the wrong pool.`]);
        } else warns.push([B(t.name), ` doesn't roll on the ${wp.name}. The game's Build-Making Database leaves it out of that gun's talent pool.`]);
      }
    });
    for (const s of SLOTS) {
      if (!s.talents) continue;
      const g = st.gear[s.id];
      const t = s.talents.get(g.talent);
      const set = SETS.get(g.set);
      if (!t || !set) continue;
      const rolls = gearRollsOf(s.id, set.id);
      if (!rolls) continue;
      const where = rolls[str(t.id)];
      if (where) oks.push([B(`${set.name} ${s.label.toLowerCase()}`), ' with ', B(t.name), `: ${piecesText(where).replace(/^Rolls on /, 'look for ')}`]);
      else warns.push([B(t.name), ` doesn't roll on any ${set.name} ${s.label.toLowerCase()}, so that piece can't drop. Pick another set for the ${s.label.toLowerCase()} or another talent.`]);
    }

    // OS Protocol against the focus
    const os = OSP.get(st.os);
    if (os && stat && os.specialization && key(os.specialization) !== key(stat)) {
      infos.push([B(os.name), ` is a ${os.specialization} protocol; ${st.focus} builds around ${stat}.`]);
    }

    // Crit chance with nothing to multiply it (not for the tree already flagged as off focus)
    if (offCat !== 'Firepower' && stats.has('Weapon Critical Hit Chance') && !stats.has('Weapon Critical Hit Damage')) {
      infos.push(['Weapon Critical Hit Chance with no Weapon Critical Hit Damage to go with it.']);
    }
    if (offCat !== 'Engineering' && stats.has('Skill Critical Chance') && !stats.has('Skill Critical Damage')) {
      infos.push(['Skill Critical Chance with no Skill Critical Damage to go with it.']);
    }

    // Extra Health: talents and protocols that need it, and what grants it
    const effects = [];
    st.w.forEach((w) => {
      const wp = getWeapon(w.id);
      if (!wp) return;
      if (isExotic(wp) && wp.talentName) effects.push({ name: str(wp.talentName), text: str(wp.talentDescription) });
      for (const id of w.t) { const t = WT.get(id); if (t) effects.push({ name: t.name, text: str(t.description) }); }
    });
    for (const s of SLOTS) {
      const t = s.talents && s.talents.get(st.gear[s.id].talent);
      if (t) effects.push({ name: t.name, text: str(t.description) });
    }
    if (os) effects.push({ name: os.name, text: str(os.talentDescription) });
    for (const id of st.mods) { const m = MODS.get(id); if (m) effects.push({ name: m.name, text: str(m.bonus3) }); }
    const givers = effects.filter((e) => EH_GIVE.test(e.text));
    for (const user of effects.filter((e) => EH_USE.test(e.text))) {
      const others = givers.filter((g) => g !== user && g.name !== user.name);
      if (others.length) oks.push([B(user.name), ' gets its Extra Health from ', joined(others.map((g) => B(g.name))), '.']);
      else if (!givers.includes(user)) infos.push([B(user.name), ' needs Extra Health, and nothing picked here grants it (some skills do).']);
    }

    // What is still to pick
    const empty = [];
    const noSet = SLOTS.filter((s) => !st.gear[s.id].set).map((s) => s.label.toLowerCase());
    if (noSet.length === SLOTS.length) empty.push('gear sets');
    else empty.push(...noSet.map((l) => `${l} set`));
    st.w.forEach((w, i) => { if (!getWeapon(w.id)) empty.push(WEAPON_LABEL[i].toLowerCase() + ' weapon'); });
    if (!os) empty.push('OS Protocol');
    const skills = focusSkills(st);
    const noMods = st.mods.filter((m) => !m).length;
    if (skills) st.mods.forEach((m, i) => { if (!m) empty.push(`${skills[i]} mod`); });
    else if (noMods) empty.push(noMods === 1 ? '1 skill mod' : `${noMods} skill mods`);

    // Score: 40 for completeness, 30 for pieces inside an active set bonus, 20 for attributes that fit
    // the focus, 10 for the OS Protocol, minus 5 for each warning
    let have = 0;
    let total = 0;
    const weigh = (cond, w) => { total += w; if (cond) have += w; };
    for (const s of SLOTS) {
      const g = st.gear[s.id];
      weigh(!!g.set, 3);
      g.attrs.forEach((x) => weigh(!!x.a, 1));
      if (s.talents) weigh(!!g.talent, 2);
    }
    st.w.forEach((w) => {
      const ok = !!getWeapon(w.id);
      weigh(ok, 3);
      w.t.forEach((t) => weigh(ok && !!t, 1));
      w.attrs.forEach((x) => weigh(ok && !!x.a, 0.5));
    });
    weigh(!!os, 4);
    st.mods.forEach((m) => weigh(!!m, 2));
    const complete = total ? have / total : 0;
    const osFit = os ? (stat && key(os.specialization) === key(stat) ? 1 : 0.5) : 0;
    let score = 40 * complete + 30 * (contributing / SLOTS.length) + 20 * Math.min(1, fitting / 16) + 10 * osFit - 5 * warns.length;
    score = Math.max(0, Math.min(100, Math.round(score)));

    if (complete < 0.5) { res.grade = 'Incomplete'; res.cls = 'g-incomplete'; }
    else if (score >= 85 && complete >= 0.9) { res.grade = 'Strong'; res.cls = 'g-elite'; }
    else if (score >= 70) { res.grade = 'Good'; res.cls = 'g-opt'; }
    else { res.grade = 'Needs work'; res.cls = 'g-low'; }
    res.score = score;

    res.checks.push(...warns.map((p) => ['warn', p]), ...infos.map((p) => ['info', p]), ...oks.map((p) => ['ok', p]));
    if (empty.length) res.checks.push(['info', ['Still to pick: ', joined(empty), '.']]);
    else if (!warns.length && !infos.length) res.checks.push(['ok', ['No issues found.']]);
    return res;
  }

  /* ---------- rendering ---------- */
  const setText = (sel, text, root) => { const n = typeof sel === 'string' ? $(sel, root) : sel; if (n) n.textContent = text; };
  /* An effect line, with the item's caveat note (if it has one) as small print under it */
  function effectText(el, text, item) {
    if (!el) return;
    const c = caveatOf(item);
    el.replaceChildren(...[text || null, c ? h('span', { class: 'caveat' }, c) : null].filter(Boolean));
    el.hidden = !text && !c;
  }
  const weaponLine = (wp) => [
    isExotic(wp) ? `Exotic ${str(wp.type)}`.trim() : str(wp.type),
    wp.rpm ? `${wp.rpm} RPM` : '',
    wp.mag ? `${wp.mag} mag` : '',
  ].filter(Boolean).join(' · ');
  const attrLabel = (x) => (x.v == null ? x.a : `${x.a} ${fmt(x.v, true)}`);
  /* Shows an <img> with the item's art, or hides it when there is none */
  function setImg(el, url) {
    if (!el) return;
    if (url) { if (el.getAttribute('src') !== url) el.setAttribute('src', url); el.hidden = false; }
    else { el.removeAttribute('src'); el.hidden = true; }
  }

  /* One color per gear set, biggest set first, then the first one in the game's order: the same colors the
     build guides' loadout panels use. */
  const SET_COLORS = ['#5EC8F0', '#F5C542', '#C4A1FF', '#7EE2B8'];
  const GAME_ORDER = ['mask', 'body', 'backpack', 'gloves', 'holster', 'kneepads'];
  function setColors(st, counts) {
    const first = new Map();
    GAME_ORDER.forEach((slot, i) => { const id = st.gear[slot].set; if (id && !first.has(id)) first.set(id, i); });
    const ids = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || (first.get(a) ?? 9) - (first.get(b) ?? 9));
    return new Map(ids.map((id, i) => [id, SET_COLORS[i % SET_COLORS.length]]));
  }
  const RARITY_COLOR = { 'high-end': '#E2B33C', superior: '#B48CF5', specialized: '#5B9BF7', standard: '#9AA0A6' };

  function renderSpec() {
    for (const b of $$('.spec-btn')) {
      const on = b.dataset.spec === S.spec;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!b.title) b.title = b.dataset.spec;
    }
    const sp = specOf(S.spec);
    lab.classList.toggle('has-spec', !!sp);
    const emblem = $('#specEmblem');
    if (emblem) emblem.setAttribute('src', sp && sp.icon ? str(sp.icon) : '/images/icons/icon-spec.webp');
    const btn = $('#subBtn');
    btn.disabled = !S.spec;
    const label = $('#subLabel');
    if (S.spec) label.replaceChildren(S.focus, ' ', h('span', { class: 'stat' }, focusStat(S)));
    else label.textContent = 'Pick a specialization';
  }

  function renderGear(counts, colors) {
    let filled = 0;
    for (const tile of $$('.gtile')) {
      const s = SLOT[tile.dataset.gtile];
      if (!s) continue;
      const btn = $('.gearslot', tile);
      const g = S.gear[s.id];
      const set = SETS.get(g.set);
      const tiers = set ? setTiers(set) : [];
      const n = set ? counts.get(str(set.id)) || 0 : 0;
      const active = !!set && tiers.length > 0 && n >= tiers[0].pieces;
      const attrs = g.attrs.filter((x) => x.a);
      if (set) filled++;
      tile.classList.toggle('is-set', !!set);
      tile.classList.toggle('is-bonus', active);
      if (set && colors.has(str(set.id))) tile.style.setProperty('--set', colors.get(str(set.id)));
      else tile.style.removeProperty('--set');
      setImg($('.gtile__set', tile), set ? imgOf(set.id) : '');
      setText('[data-count]', set ? `${n}pc` : '', tile);
      setText('.gearslot__val', set ? set.name : attrs.length ? 'No set' : 'Add a set', btn);
      $('.gearslot__attrs', btn).replaceChildren(...attrs.map((x) => h('span', {
        class: 'gearslot__attr' + (GEAR_ATTRS.has(x.a) ? '' : ' is-legacy'),
      }, short(x.a) + (x.v == null ? '' : ' ' + fmt(x.v, true)))));
      btn.setAttribute('aria-label', `${s.label}: ${set ? set.name : 'no set'}${attrs.length ? ', ' + attrs.map(attrLabel).join(', ') : ''}. Edit`);
      // Body armor and backpack: which pieces of this set can carry the talent
      const look = $('[data-look]', tile);
      if (look) {
        const t = s.talents && s.talents.get(g.talent);
        const rolls = set ? gearRollsOf(s.id, set.id) : null;
        const where = t && rolls ? rolls[str(t.id)] : null;
        look.classList.toggle('is-bad', !!(t && rolls && !where));
        if (t && where) look.replaceChildren('Look for ', ...joined(where.map((x) => B(x))), '.');
        else if (t && rolls) look.replaceChildren(`No ${set.name} ${s.label.toLowerCase()} rolls ${t.name}.`);
        else look.replaceChildren();
        look.hidden = !look.textContent;
      }
    }
    setText('#gearPieces', `${filled} / 6`);
  }

  function renderArmorTalents() {
    for (const btn of $$('[data-armortalent]')) {
      const s = SLOT[btn.dataset.armortalent];
      const g = S.gear[s.id];
      const t = s && s.talents.get(g.talent);
      const rolls = t ? gearRollsOf(s.id, g.set) : null;
      setText('.picktag__val', t ? t.name : `${s.label} talent`, btn);
      effectText($('.picktag__desc', btn), t ? str(t.description) : '', t);
      setImg($('img', btn), t ? imgOf(t.id) : '');
      btn.classList.toggle('is-set', !!t);
      btn.classList.toggle('is-off', !!(t && rolls && !rolls[str(t.id)]));
      btn.setAttribute('aria-label', `${s.label} talent: ${t ? t.name : 'not set'}`);
    }
  }

  function renderWeapons() {
    S.w.forEach((w, i) => {
      const n = i + 1;
      const wp = getWeapon(w.id);
      const exo = isExotic(wp);
      const ps = wp ? weaponPoolOf(wp) : null;
      const card = $(`#w${n}card`);
      card.classList.toggle('is-set', !!wp);
      card.classList.toggle('is-exotic', exo);
      setImg($(`#w${n}img`), wp ? imgOf(wp.id) : '');
      setText(`#w${n}name`, wp ? wp.name : 'Add a weapon');
      setText(`#w${n}sub`, wp ? weaponLine(wp) : '');
      $(`#w${n}btn`).setAttribute('aria-label', `${WEAPON_LABEL[i]} weapon: ${wp ? wp.name : 'not set'}. Change`);
      const tier = $(`#w${n}tier`);
      tier.disabled = !wp;
      tier.value = wp ? w.tier : '';
      const fixed = $(`#w${n}fixed`);
      fixed.hidden = !exo;
      if (exo) {
        setText('.picktag__val', str(wp.talentName) || 'Exotic talent', fixed);
        effectText($('.picktag__desc', fixed), str(wp.talentDescription), wp);
        setImg($('img', fixed), imgOf('et:' + str(wp.id)));
        fixed.title = str(wp.talentDescription);
      }
      [0, 1].forEach((j) => {
        const tb = $(`[data-talent="w${n}t${j + 1}"]`);
        const t = WT.get(w.t[j]);
        tb.disabled = !wp;
        tb.classList.toggle('is-set', !!t);
        tb.classList.toggle('is-off', !!(t && ps && !ps.has(str(t.id))));
        setText('.picktag__val', t ? t.name : `Talent ${j + 1}`, tb);
        effectText($('.picktag__desc', tb), t ? str(t.description) : '', t);
        setImg($('img', tb), t ? imgOf(t.id) : '');
        tb.title = t ? str(t.description) : '';
        tb.setAttribute('aria-label', `${WEAPON_LABEL[i]} talent ${j + 1}: ${t ? t.name : 'not set'}`);
      });
      [0, 1].forEach((j) => {
        const bb = $(`[data-wbonus="${n}"][data-wbidx="${j + 1}"]`);
        const x = w.attrs[j];
        bb.disabled = !wp;
        bb.classList.toggle('is-set', !!x.a);
        bb.classList.toggle('is-legacy', !!x.a && !WEAPON_ATTRS.has(x.a));
        setText('.picktag__val', x.a ? short(x.a) + (x.v == null ? '' : ' ' + fmt(x.v, true)) : `Attribute ${j + 1}`, bb);
        bb.setAttribute('aria-label', `${WEAPON_LABEL[i]} weapon attribute ${j + 1}: ${x.a ? attrLabel(x) : 'not set'}`);
      });
    });
  }

  function renderOS() {
    const os = OSP.get(S.os);
    const tile = $('.ktile--os');
    tile.classList.toggle('is-set', !!os);
    if (os) tile.style.setProperty('--rarity', RARITY_COLOR[key(os.rarity)] || '#9AA0A6');
    else tile.style.removeProperty('--rarity');
    setImg($('#osImg'), os ? imgOf(os.id) : '');
    setText('#osName', os ? os.name : 'Add an OS Protocol');
    setText('#osSub', os ? [os.rarity, os.specialization, os.mainStat && os.mainValue ? `${os.mainStat} ${os.mainValue}` : ''].filter(Boolean).join(' · ') : '');
    effectText($('#osDesc'), os ? str(os.talentDescription) : '', os);
    $('#osSlot').setAttribute('aria-label', `OS Protocol: ${os ? os.name : 'not set'}. Change`);
  }

  function renderMods() {
    const skills = S.spec ? focusSkills(S) : null;
    $$('.skill-slot').forEach((btn, i) => {
      const m = MODS.get(S.mods[i]);
      const skill = skills ? skills[i] : '';
      btn.disabled = !S.spec;
      btn.classList.toggle('is-set', !!m);
      setImg($('.ktile__icon img:not(.ktile__ph)', btn), m ? imgOf(m.id) : '');
      setText('.skill-slot__skill', skill || (m && m.skill ? str(m.skill) : `Skill mod ${i + 1}`), btn);
      setText('.skill-slot__nm', m ? m.name : S.spec ? 'Add a mod' : 'Pick a specialization first', btn);
      setText('.skill-slot__sub', m ? `2pc ${bonusText(m.bonus2)}` : '', btn);
      effectText($('.skill-slot__desc', btn), m ? `3pc: ${str(m.bonus3)}` : '', m);
      btn.title = m ? `3pc: ${str(m.bonus3)}` : '';
      btn.setAttribute('aria-label', `${skill ? skill + ' mod' : 'Skill mod ' + (i + 1)}: ${m ? m.name : 'not set'}`);
    });
    setText('#skillCount', `${S.mods.filter(Boolean).length} / 3`);
  }

  function renderBonuses(counts, colors) {
    const box = $('#bonusList');
    const sets = [...colors.keys()].map((id) => ({ set: SETS.get(id), n: counts.get(id) || 0, color: colors.get(id) })).filter((x) => x.set);
    if (!sets.length) {
      box.replaceChildren(h('p', { class: 'empty' }, 'Two pieces of one set turn on its first bonus.'));
      return;
    }
    box.replaceChildren(...sets.map(({ set, n, color }) => {
      const tiers = setTiers(set);
      const max = tiers.length ? tiers[tiers.length - 1].pieces : 0;
      const node = h('div', { class: 'bonus' },
        h('div', { class: 'bonus__hd' },
          imgOf(set.id) ? h('img', { src: imgOf(set.id), alt: '', width: '32', height: '32' }) : null,
          h('span', { class: 'bonus__nm' }, set.name),
          h('span', { class: 'bonus__pips', role: 'img', 'aria-label': `${n} of ${max} pieces` },
            Array.from({ length: max }, (_, k) => h('i', { class: k < n ? 'on' : '' })))),
        tiers.map((t) => h('div', { class: 'bonus__line' + (n >= t.pieces ? '' : ' is-off') },
          h('b', null, `${t.pieces}pc`), h('span', null, bonusText(t.text),
            n >= t.pieces ? '' : ` (${t.pieces - n} more)`))),
        caveatOf(set) ? h('span', { class: 'caveat' }, caveatOf(set)) : null);
      node.style.setProperty('--set', color);
      return node;
    }));
  }

  /* Caps on totals, in percent. Damage Reduction: 80% since Ubisoft's June 26, 2026 server hotfix. */
  const CAPS = { 'Damage Reduction': 80 };
  const capOf = (r) => (r.pct && CAPS[r.stat] != null && r.pct.max > CAPS[r.stat] ? CAPS[r.stat] : null);
  function totalText(r) {
    const parts = [];
    if (r.pct) {
      const cap = capOf(r);
      parts.push(cap == null ? fmtRange(r.pct.min, r.pct.max, true)
        : `${fmtRange(Math.min(r.pct.min, cap), cap, true)} (capped at ${cap}%)`);
    }
    if (r.flat) parts.push(fmtRange(r.flat.min, r.flat.max, false));
    return parts.join(' · ');
  }

  function renderStats(stats) {
    const box = $('#statList');
    const open = new Set($$('details[open]', box).map((d) => d.dataset.stat));
    if (!stats.size) {
      box.replaceChildren(h('p', { class: 'empty' }, 'Nothing to add up yet.'));
      return;
    }
    const groups = new Map();
    for (const r of stats.values()) {
      const c = statCat(r.stat);
      if (!groups.has(c)) groups.set(c, []);
      groups.get(c).push(r);
    }
    const order = [...CATS, ...[...groups.keys()].filter((c) => !CATS.includes(c))];
    const nodes = [];
    for (const c of order) {
      const rows = groups.get(c);
      if (!rows) continue;
      rows.sort((a, b) => a.stat.localeCompare(b.stat));
      nodes.push(h('div', { class: 'stat-group' },
        h('h3', { class: 'stat-group__hd ' + catClass(c) }, c),
        rows.map((r) => {
          const total = totalText(r);
          const extra = r.unvalued ? `${total ? '+' : ''}${r.unvalued} ${plural(r.unvalued, 'roll', 'rolls')}` : '';
          return h('details', { class: 'stat-row', 'data-stat': r.stat, open: open.has(r.stat) },
            h('summary', null,
              h('span', { class: 'stat-row__lbl' }, r.stat),
              h('span', { class: 'stat-row__val' }, total, extra ? h('span', { class: 'stat-row__more' }, (total ? ' ' : '') + extra) : null)),
            h('ul', { class: 'stat-src' },
              r.sources.map((s) => h('li', null, h('span', null, s.src), h('span', null, s.text))),
              capOf(r) != null ? h('li', { class: 'stat-src__cap' }, h('span', null, 'Sum before the cap'), h('span', null, fmtRange(r.pct.min, r.pct.max, true))) : null));
        })));
    }
    box.replaceChildren(...nodes);
  }

  const CHECK_WORD = { warn: 'Warning: ', info: 'Note: ', ok: 'Good: ' };
  function renderChecks(a) {
    const grade = $('#ratingGrade');
    grade.textContent = a.grade;
    grade.className = 'rating__grade ' + a.cls;
    setText('#ratingScore', S.spec ? `${a.score} out of 100` : '');
    setText('#rigScore', String(a.score));
    const ring = $('#scoreRing');
    if (ring) {
      ring.className = 'ring ' + a.cls;
      ring.style.setProperty('--score', String(Math.max(0.01, a.score)));
    }
    $('#diagList').replaceChildren(...a.checks.map(([level, parts]) => h('li', { class: `diag diag--${level}` },
      h('span', { class: 'sr-only' }, CHECK_WORD[level] || ''),
      h('span', { class: 'diag__txt' }, parts))));
    setText('#mobScore', String(a.score));
    setText('#mobGrade', a.grade);
  }

  function renderTemplateBar() {
    const ti = activeTemplate();
    const label = ti >= 0 ? TEMPLATES[ti].name
      : loadedTemplate >= 0 && S.spec ? `${TEMPLATES[loadedTemplate].name} (edited)` : 'Load a build guide';
    setText('#tplLabel', label);
    const lines = [];
    if (ti >= 0 && templateNote(TEMPLATES[ti])) lines.push(templateNote(TEMPLATES[ti]));
    if (notice) lines.push(notice);
    const note = $('#labNote');
    note.textContent = lines.join(' ');
    note.hidden = !lines.length;
    const input = $('#buildNameInput');
    if (input && input !== doc.activeElement && cleanName(input.value) !== S.name) input.value = S.name;
    fitName();
  }
  /* The build's name heads the page: on narrow screens a long name shrinks to fit its field (down to 60%)
     instead of running off the edge. */
  function fitName() {
    const input = $('#buildNameInput');
    if (!input) return;
    input.style.fontSize = '';
    if (!input.value || input.scrollWidth <= input.clientWidth) return;
    const base = parseFloat(getComputedStyle(input).fontSize) || 28;
    input.style.fontSize = `${Math.max(base * 0.6, Math.floor(base * (input.clientWidth / input.scrollWidth) * 0.98))}px`;
  }

  function renderAll() {
    const counts = setCounts(S);
    const colors = setColors(S, counts);
    const stats = computeStats(S);
    renderSpec();
    renderGear(counts, colors);
    renderArmorTalents();
    renderWeapons();
    renderOS();
    renderMods();
    renderBonuses(counts, colors);
    renderStats(stats);
    renderChecks(analyze(S, stats));
    renderTemplateBar();
    renderHistory();
  }

  /* ---------- URL ---------- */
  let urlTimer = 0;
  function writeUrl() {
    clearTimeout(urlTimer);
    const want = S.spec ? '#' + encode(S) : '';
    if (location.hash === want) return;
    try {
      history.replaceState(history.state, '', location.pathname + location.search + want);
    } catch (e) { /* some browsers limit how often this may run; the next change writes it */ }
  }
  function changed() {
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
    remember();
  }

  /* A build link always has "=" in it; plain #fragments (the skip link) are left alone. */
  const isBuildHash = (raw) => raw.includes('=');
  function loadFromLocation() {
    const raw = location.hash.slice(1);
    if (raw && !isBuildHash(raw)) return false;
    loadedTemplate = -1;
    notice = '';
    if (!raw) { S = emptyState(); return true; }
    const r = decode(raw);
    if (!r.state) {
      S = emptyState();
      notice = r.legacy ? 'That link is from an older version of the planner and can\'t be opened here.' : 'That link doesn\'t hold a build the planner can read.';
      writeUrl();
      return true;
    }
    S = r.state;
    loadedTemplate = TEMPLATE_KEYS.indexOf(encode(S));
    // a template's own link can name weapons that aren't in the data yet; its note explains that
    const isTemplateLink = TEMPLATES.some((t) => t.hash === raw);
    if (r.dropped && !isTemplateLink) notice = `${r.dropped} ${plural(r.dropped, 'item', 'items')} in that link didn't match our database and ${plural(r.dropped, 'was', 'were')} left out.`;
    writeUrl();
    return true;
  }

  function resetBuild() {
    endSpin();
    S = emptyState();
    loadedTemplate = -1;
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
    remember();
  }

  function loadTemplate(i) {
    const t = TEMPLATES[i];
    const r = t && decode(t.hash);
    if (!r || !r.state) return;
    endSpin();
    S = r.state;
    loadedTemplate = i;
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
    remember();
  }

  /* ---------- undo and redo ----------
     Every change is kept as its link, so stepping back is just reading an older link. */
  const past = { list: [], at: -1 };
  const snapshot = () => (S.spec ? encode(S) : '');
  function remember() {
    const cur = snapshot();
    if (past.list[past.at] === cur) { renderHistory(); return; }
    past.list = past.list.slice(0, past.at + 1);
    past.list.push(cur);
    if (past.list.length > 100) past.list.shift();
    past.at = past.list.length - 1;
    renderHistory();
  }
  function renderHistory() {
    const u = $('#undoBtn');
    const r = $('#redoBtn');
    if (u) u.disabled = past.at <= 0;
    if (r) r.disabled = past.at < 0 || past.at >= past.list.length - 1;
  }
  function restore(i) {
    if (i < 0 || i >= past.list.length) return;
    endSpin();
    past.at = i;
    const raw = past.list[i];
    const r = raw ? decode(raw) : null;
    S = r && r.state ? r.state : emptyState();
    loadedTemplate = TEMPLATE_KEYS.indexOf(encode(S));
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
  }
  const undo = () => { if (past.at > 0) { restore(past.at - 1); toast('Undone.'); } };
  const redo = () => { if (past.at < past.list.length - 1) { restore(past.at + 1); toast('Redone.'); } };

  /* Loads a build from a link (saved builds) */
  function loadHash(raw) {
    const r = decode(raw);
    if (!r.state) { toast('That build can\'t be opened any more.'); return false; }
    endSpin();
    S = r.state;
    loadedTemplate = TEMPLATE_KEYS.indexOf(encode(S));
    notice = r.dropped ? `${r.dropped} ${plural(r.dropped, 'item', 'items')} in that build didn't match our database and ${plural(r.dropped, 'was', 'were')} left out.` : '';
    hideShareLink();
    renderAll();
    writeUrl();
    remember();
    return true;
  }

  /* ---------- dialogs ---------- */
  let dialog = null; // { el, opener, onClose }
  const INERT_TARGETS = () => [$('.skip-link'), $('#site-header'), $('.hero'), lab, $('.site-footer'), $('#mobStatus'), $('#slotWin')].filter(Boolean);
  const focusables = (root) => $$('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])', root)
    .filter((n) => !n.disabled && !n.hidden && n.getClientRects().length > 0);

  function openDialog(el, initial, onClose) {
    endSpin();
    hideWin();
    if (dialog) closeDialog(true);
    dialog = { el, opener: doc.activeElement, onClose };
    el.hidden = false;
    el.classList.add('is-open');
    for (const n of INERT_TARGETS()) n.inert = true;
    doc.body.classList.add('has-dialog');
    const target = initial && !initial.disabled ? initial : focusables(el)[0];
    if (target) target.focus();
  }
  function closeDialog(silent) {
    if (!dialog) return;
    const { el, opener, onClose } = dialog;
    dialog = null;
    el.classList.remove('is-open');
    el.hidden = true;
    for (const n of INERT_TARGETS()) n.inert = false;
    doc.body.classList.remove('has-dialog');
    if (onClose) onClose();
    if (!silent && opener && opener.isConnected && typeof opener.focus === 'function') {
      if (opener.disabled) { const panel = opener.closest('section, .panel'); if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); } }
      else opener.focus();
    }
  }
  doc.addEventListener('keydown', (e) => {
    if (!dialog) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
      return;
    }
    if (e.key === 'Tab') {
      const list = focusables(dialog.el);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !dialog.el.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !dialog.el.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });
  for (const m of $$('.modal')) {
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-close]')) closeDialog();
    });
  }

  /* List picker: searchable list of options, with an optional "None" row */
  let listCtx = null;
  const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  function marked(text, q) {
    const s = str(text);
    if (!q) return [s];
    const out = [];
    const low = s.toLowerCase();
    let i = 0;
    for (;;) {
      const at = low.indexOf(q, i);
      if (at < 0) break;
      if (at > i) out.push(s.slice(i, at));
      out.push(h('mark', { class: 'stat-hit' }, s.slice(at, at + q.length)));
      i = at + q.length;
    }
    if (i < s.length) out.push(s.slice(i));
    return out;
  }

  /* How closely a search matches an option: the exact name, then names that start with it, then a
     word in the name that starts with it, then anywhere in the name, then other names, then the
     rest of the option's text. */
  function matchRank(it, q) {
    const n = key(it.name);
    if (n === q) return 0;
    let at = n.indexOf(q);
    if (at === 0) return 1;
    if (at > 0) {
      while (at > 0 && /[a-z0-9]/.test(n[at - 1])) at = n.indexOf(q, at + 1);
      return at > 0 ? 2 : 3;
    }
    return key(it.alias).includes(q) || key(it.find).includes(q) ? 4 : 5;
  }

  function drawList(query) {
    const q = key(query);
    let items = listCtx.items.filter((it) => !q || it.none || key(`${it.name} ${it.tag || ''} ${it.desc || ''} ${it.group || ''} ${it.alias || ''} ${it.find || ''}`).includes(q));
    if (q) {
      // closest matches first; groups stay together, the group with the closest match goes first
      const order = new Map();
      for (const it of listCtx.items) if (!order.has(it.group || '')) order.set(it.group || '', order.size);
      const ranked = items.map((it, i) => ({ it, i, g: it.group || '', r: it.none ? -1 : matchRank(it, q) }));
      const best = new Map();
      for (const x of ranked) if (!best.has(x.g) || x.r < best.get(x.g)) best.set(x.g, x.r);
      ranked.sort((a, b) => best.get(a.g) - best.get(b.g) || order.get(a.g) - order.get(b.g) || a.r - b.r || a.i - b.i);
      items = ranked.map((x) => x.it);
    }
    const nodes = [];
    let group = '';
    for (const it of items) {
      if (it.group && it.group !== group) {
        group = it.group;
        nodes.push(h('p', { class: 'opt-group' }, group));
      }
      const cur = !it.none && it.id === listCtx.current;
      const btn = h('button', {
        type: 'button',
        class: 'opt' + (cur ? ' is-current' : '') + (it.none ? ' opt--none' : '') + (it.img ? ' has-img' : ''),
        'data-id': it.id,
        disabled: !!it.disabled,
        'aria-current': cur ? 'true' : null,
      },
      it.img ? h('img', { class: 'opt__img' + (it.wide ? ' opt__img--wide' : ''), src: it.img, alt: '', width: it.wide ? '88' : '44', height: it.wide ? '42' : '44', loading: 'lazy', decoding: 'async' }) : null,
      h('span', { class: 'opt__top' }, h('span', { class: 'opt__nm' }, marked(it.name, q)), it.tag ? h('span', { class: 'opt__type' }, it.tag) : null),
      it.desc ? h('span', { class: 'opt__desc' }, marked(it.desc, q)) : null,
      it.alias ? h('span', { class: 'opt__note' }, 'Also called ', marked(it.alias, q)) : null,
      q && it.find && key(it.find).includes(q) ? h('span', { class: 'opt__note' }, 'Possibly once called ', marked(it.find, q), '.') : null,
      it.note ? h('span', { class: 'opt__note' }, it.note) : null,
      it.disabled && it.why ? h('span', { class: 'opt__why' }, it.why) : null);
      btn.addEventListener('click', () => {
        const pick = listCtx.onPick;
        closeDialog();
        pick(it.id);
      });
      nodes.push(btn);
    }
    if (!items.some((it) => !it.none)) nodes.push(h('p', { class: 'opt-empty' }, 'No matches.'));
    $('#modalList').replaceChildren(...nodes);
  }

  function openList({ title, items, current, onPick, none }) {
    const list = none && current ? [{ id: '', name: none, none: true }, ...items] : items;
    listCtx = { items: list, current: current || '', onPick };
    setText('#modalTitle', title);
    const searchable = items.length > 8;
    const wrap = $('#modalSearchWrap');
    const input = $('#modalSearch');
    wrap.hidden = !searchable;
    input.value = '';
    drawList('');
    const box = $('#modalList');
    const cur = $('.opt.is-current', box);
    const first = $('.opt:not(:disabled)', box);
    openDialog($('#modal'), searchable && !isTouch ? input : cur || first);
    if (cur && typeof cur.scrollIntoView === 'function') cur.scrollIntoView({ block: 'nearest' });
  }

  $('#modalSearch').addEventListener('input', (e) => drawList(e.target.value));
  $('#modalSearch').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      const first = $('#modalList .opt:not(:disabled)');
      if (first) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Enter') {
      const first = $('#modalList .opt:not(.opt--none):not(:disabled)');
      if (first) { e.preventDefault(); first.click(); }
    }
  });
  $('#modalList').addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const opts = $$('#modalList .opt:not(:disabled)');
    const i = opts.indexOf(doc.activeElement);
    if (i < 0) return;
    e.preventDefault();
    let next = i;
    if (e.key === 'ArrowDown') next = Math.min(opts.length - 1, i + 1);
    else if (e.key === 'ArrowUp') {
      if (i === 0 && !$('#modalSearchWrap').hidden) { $('#modalSearch').focus(); return; }
      next = Math.max(0, i - 1);
    } else if (e.key === 'Home') next = 0;
    else next = opts.length - 1;
    opts[next].focus();
  });

  /* ---------- pickers ---------- */
  function openTemplates() {
    const items = [{ id: 'empty', name: 'Empty loadout', desc: 'Clear everything and start over.' }];
    TEMPLATES.forEach((t, i) => {
      const r = decode(t.hash);
      const sp = specOf(t.spec);
      items.push({ id: String(i), name: str(t.name), tag: r.state ? r.state.focus : '', group: str(t.spec), img: sp && sp.icon ? str(sp.icon) : '' });
    });
    const ti = activeTemplate();
    openList({
      title: 'Load a template',
      items,
      current: ti >= 0 ? String(ti) : '',
      onPick: (id) => (id === 'empty' ? resetBuild() : loadTemplate(+id)),
    });
  }

  function openFocusPicker() {
    const sp = specOf(S.spec);
    if (!sp) return;
    openList({
      title: `${sp.name} focus`,
      items: sp.focuses.map((f) => ({ id: f.name, name: f.name, tag: str(f.stat), desc: arr(f.skills).join(', ') })),
      current: S.focus,
      onPick: (id) => {
        const f = focusOf(sp, id);
        if (!f || f.name === S.focus) return;
        S.focus = f.name;
        const lost = placeMods(S, S.mods);
        changed();
        if (lost) toast(`${lost} skill ${plural(lost, "mod doesn't", "mods don't")} fit ${S.focus} and ${plural(lost, 'was', 'were')} removed.`);
      },
    });
  }

  function openWeaponPicker(n) {
    const w = S.w[n - 1];
    const items = EXO.items.slice().sort(byName).map((wp) => ({
      id: str(wp.id), name: wp.name, tag: str(wp.type), group: 'Exotic', img: imgOf(wp.id), wide: true,
      desc: [weaponLine(wp), wp.talentName ? `Talent: ${wp.talentName}` : ''].filter(Boolean).join('. '),
      note: caveatOf(wp),
    }));
    const types = [];
    for (const wp of STD.items) if (!types.includes(str(wp.type))) types.push(str(wp.type));
    for (const type of types) {
      STD.items.filter((wp) => str(wp.type) === type).sort(byName).forEach((wp) => items.push({
        id: str(wp.id), name: wp.name, group: type || 'Other', img: imgOf(wp.id), wide: true,
        desc: [wp.rpm ? `${wp.rpm} RPM` : '', wp.mag ? `${wp.mag} mag` : ''].filter(Boolean).join(' · '),
        note: caveatOf(wp),
      }));
    }
    openList({
      title: `${WEAPON_LABEL[n - 1]} weapon`,
      items,
      current: w.id,
      none: 'No weapon',
      onPick: (id) => {
        const wp = getWeapon(id);
        let cleared = false;
        if (!wp) S.w[n - 1] = emptyWeapon();
        else {
          w.id = str(wp.id);
          // One exotic at a time: equipping a second one empties the other slot completely
          if (isExotic(wp) && isExotic(getWeapon(S.w[2 - n].id))) { S.w[2 - n] = emptyWeapon(); cleared = true; }
        }
        changed();
        if (cleared) toast('Only one exotic can be equipped at a time, so the other weapon slot was cleared.');
      },
    });
  }

  function openWeaponTalentPicker(n, j) {
    const w = S.w[n - 1];
    const wp = getWeapon(w.id);
    if (!wp) return;
    const other = w.t[1 - j];
    const poolSet = weaponPoolOf(wp);
    const all = WT.items.slice().sort(byName);
    const inPool = poolSet ? all.filter((t) => poolSet.has(str(t.id))) : all;
    const cur = WT.get(w.t[j]);
    const offPool = poolSet && cur && !poolSet.has(str(cur.id)) ? [cur] : [];
    const item = (t, group) => ({
      id: str(t.id), name: t.name, desc: str(t.description), note: caveatOf(t), alias: aliasText(t), find: guessedAliases(t),
      disabled: str(t.id) === other, why: 'Already on this weapon.', group, img: imgOf(t.id),
    });
    openList({
      title: `${wp.name}: talent ${j + 1}`,
      items: [
        ...inPool.map((t) => item(t, poolSet ? `The ${inPool.length} talents the ${wp.name} can roll` : '')),
        ...offPool.map((t) => ({ ...item(t, 'Picked, but not in its pool'), note: recalFixed(wp)
          ? `Not in its pool now. Older copies can have it: until ${recalWhen()}, recalibrating this gun pulled talents from the wrong pool.`
          : "The game's Build-Making Database doesn't list it for this gun." })),
      ],
      current: w.t[j],
      none: 'No talent',
      onPick: (id) => { w.t[j] = WT.get(id) ? id : ''; changed(); },
    });
  }

  function openArmorTalentPicker(slotId) {
    const s = SLOT[slotId];
    if (!s || !s.talents) return;
    const g = S.gear[s.id];
    const set = SETS.get(g.set);
    const rolls = set ? gearRollsOf(s.id, set.id) : null;
    const all = s.talents.items.slice().sort(byName);
    const ok = rolls ? all.filter((t) => rolls[str(t.id)]) : all;
    const cur = s.talents.get(g.talent);
    const off = rolls && cur && !rolls[str(cur.id)] ? [cur] : [];
    const item = (t, group) => ({
      id: str(t.id), name: t.name, desc: str(t.description), alias: aliasText(t), find: guessedAliases(t), group, img: imgOf(t.id),
      note: [rolls && rolls[str(t.id)] ? piecesText(rolls[str(t.id)]) : '', caveatOf(t)].filter(Boolean).join(' '),
    });
    openList({
      title: `${s.label} talent`,
      items: [
        ...ok.map((t) => item(t, rolls ? `What a ${set.name} ${s.label.toLowerCase()} can roll (${ok.length})` : '')),
        ...off.map((t) => ({ ...item(t, 'Picked, but no piece of this set rolls it'), note: `No ${set.name} ${s.label.toLowerCase()} can roll it in the game's Build-Making Database.` })),
      ],
      current: g.talent,
      none: 'No talent',
      onPick: (id) => { g.talent = s.talents.get(id) ? id : ''; changed(); },
    });
  }

  function openOSPicker() {
    const stat = focusStat(S);
    const rank = { 'high-end': 0, superior: 1, specialized: 2, standard: 3 };
    const fits = (o) => !!stat && key(o.specialization) === key(stat);
    const items = OSP.items.slice()
      .sort((a, b) => (fits(b) - fits(a)) || ((rank[key(a.rarity)] ?? 9) - (rank[key(b.rarity)] ?? 9)) || byName(a, b))
      .map((o) => ({
        id: str(o.id), name: o.name, img: imgOf(o.id),
        tag: [o.specialization, o.rarity].filter(Boolean).join(' · '),
        desc: [o.mainStat && o.mainValue ? `${o.mainStat} ${o.mainValue}.` : '', str(o.talentDescription)].filter(Boolean).join(' '),
        note: caveatOf(o), alias: aliasText(o), find: guessedAliases(o),
        group: stat ? (fits(o) ? `${stat}, matches ${S.focus}` : 'Other protocols') : '',
      }));
    openList({ title: 'OS Protocol', items, current: S.os, none: 'No OS Protocol', onPick: (id) => { S.os = OSP.get(id) ? id : ''; changed(); } });
  }

  function openModPicker(i) {
    if (!S.spec) return;
    const skills = focusSkills(S);
    const skill = skills ? skills[i] : '';
    // a skill's slot lists that skill's sets; plain slots list all of the spec's sets, by skill if known
    const mine = MODS.items.filter((m) => key(m.specialization) === key(S.spec) && (!skill || key(m.skill) === key(skill)));
    const hasSkill = !skill && mine.some((m) => m.skill);
    if (hasSkill) mine.sort((a, b) => str(a.skill).localeCompare(str(b.skill)));
    openList({
      title: skill ? `${skill} mod` : `Skill mod ${i + 1}`,
      items: mine.map((m) => {
        const used = S.mods.indexOf(str(m.id));
        return {
          id: str(m.id), name: m.name, tag: '', group: hasSkill ? str(m.skill) || 'Other' : '', img: imgOf(m.id),
          desc: `2pc: ${bonusText(m.bonus2)}. 3pc: ${str(m.bonus3)}`,
          alias: aliasText(m), find: guessedAliases(m), note: caveatOf(m),
          disabled: used >= 0 && used !== i, why: `Already in slot ${used + 1}.`,
        };
      }),
      current: S.mods[i],
      none: 'No skill mod',
      onPick: (id) => { S.mods[i] = MODS.get(id) ? id : ''; changed(); },
    });
  }

  /* Editor dialog: gear pieces (set, two attributes with values, talent) and weapon attributes */
  let editorCtx = null;

  function attrSelect(id, attrs, i, list, legacyLabel) {
    const sel = h('select', { id, class: 'ed-select' });
    const fill = () => {
      const other = attrs[1 - i].a;
      const cur = attrs[i].a;
      const groups = new Map();
      for (const rec of list.list) {
        if (!groups.has(rec.cat)) groups.set(rec.cat, []);
        groups.get(rec.cat).push(rec);
      }
      const order = [...CATS.filter((c) => groups.has(c)), ...[...groups.keys()].filter((c) => !CATS.includes(c))];
      const opts = [h('option', { value: '' }, 'None')];
      for (const c of order) {
        opts.push(h('optgroup', { label: c }, groups.get(c).map((rec) => h('option', { value: rec.name, disabled: rec.name === other }, rec.name))));
      }
      if (cur && !list.has(cur)) opts.push(h('optgroup', { label: legacyLabel(cur) }, h('option', { value: cur }, cur)));
      sel.replaceChildren(...opts);
      sel.value = cur;
    };
    fill();
    sel._fill = fill;
    return sel;
  }

  function attrField(n, attrs, i, list, legacyLabel, onChange) {
    const sel = attrSelect(`ed-a${n}`, attrs, i, list, legacyLabel);
    const input = h('input', {
      id: `ed-v${n}`, class: 'ed-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false',
      placeholder: 'Value', 'aria-label': `Attribute ${n} roll value, percent`, maxlength: '9',
    });
    const hint = h('p', { class: 'ed-help', id: `ed-h${n}` });
    input.setAttribute('aria-describedby', hint.id);
    const sync = () => {
      const x = attrs[i];
      input.disabled = !x.a;
      if (doc.activeElement !== input) input.value = x.v == null ? '' : linkNum(x.v);
      input.removeAttribute('aria-invalid');
      hint.textContent = x.a && NEGATIVE.has(key(x.a)) ? 'Shows as a negative number in game.' : '';
      hint.hidden = !hint.textContent;
    };
    sel.addEventListener('change', () => {
      attrs[i].a = sel.value;
      if (!sel.value) attrs[i].v = null;
      else attrs[i].v = normVal(sel.value, attrs[i].v);
      onChange();
      sync();
    });
    input.addEventListener('input', () => {
      const raw = input.value.trim();
      const v = parseVal(raw);
      if (raw && v == null) { input.setAttribute('aria-invalid', 'true'); return; }
      input.removeAttribute('aria-invalid');
      attrs[i].v = normVal(attrs[i].a, v);
      onChange();
    });
    input.addEventListener('change', sync);
    sync();
    return {
      node: h('div', { class: 'ed-field' },
        h('label', { class: 'ed-label', for: sel.id }, `Attribute ${n}`),
        h('div', { class: 'ed-row' }, sel, h('span', { class: 'ed-val' }, input, h('span', { class: 'ed-unit', 'aria-hidden': 'true' }, '%'))),
        hint),
      sel, sync,
    };
  }

  function openGearEditor(slotId) {
    const first = buildGearEditor(slotId);
    if (first) openDialog($('#editor'), first);
  }
  /* Fills the editor for a gear slot and returns the control to focus first */
  function buildGearEditor(slotId) {
    const s = SLOT[slotId];
    if (!s) return null;
    const g = S.gear[s.id];
    editorCtx = { kind: 'gear', slot: s.id };
    setText('#editorTitle', s.label);
    setText('#editorClear', `Clear ${s.label.toLowerCase()}`);
    const fields = [];
    const update = () => { for (const f of fields) f.sel._fill && f.sel._fill(); changed(); };

    // "Jackpot: Skill Radius / Skill CHC / Skill CHD", so the list shows what each set gives
    const setLabel = (x) => {
      const stats = setTiers(x).map((t) => { const b = parseBonus(t.text); return b ? short(b.stat) : ''; }).filter(Boolean);
      return stats.length ? `${x.name}: ${stats.join(' / ')}` : x.name;
    };
    const setSel = h('select', { id: 'ed-set', class: 'ed-select', 'aria-describedby': 'ed-set-help' },
      h('option', { value: '' }, 'No set'),
      SETS.items.slice().sort(byName).map((x) => h('option', { value: str(x.id) }, setLabel(x))));
    setSel.value = g.set;
    const setHelp = h('p', { class: 'ed-help', id: 'ed-set-help' });
    const fillSetHelp = () => {
      const set = SETS.get(g.set);
      effectText(setHelp, set ? setTiers(set).map((t) => `${t.pieces}pc: ${t.text}`).join(' · ') : '', set);
    };
    setSel.addEventListener('change', () => { g.set = SETS.get(setSel.value) ? setSel.value : ''; fillSetHelp(); changed(); });
    fillSetHelp();

    const body = [h('div', { class: 'ed-field' }, h('label', { class: 'ed-label', for: 'ed-set' }, 'Gear set'), setSel, setHelp)];
    for (let i = 0; i < 2; i++) {
      const f = attrField(i + 1, g.attrs, i, GEAR_ATTRS, () => 'Not in our gear attribute list', update);
      fields.push(f);
      body.push(f.node);
    }
    if (s.talents) {
      const talSel = h('select', { id: 'ed-talent', class: 'ed-select', 'aria-describedby': 'ed-talent-help' });
      const talHelp = h('p', { class: 'ed-help', id: 'ed-talent-help' });
      const fillTalOptions = () => {
        const rolls = gearRollsOf(s.id, g.set);
        const all = s.talents.items.slice().sort(byName);
        const opts = all.filter((t) => !rolls || rolls[str(t.id)] || str(t.id) === g.talent);
        talSel.replaceChildren(h('option', { value: '' }, 'No talent'),
          ...opts.map((t) => h('option', { value: str(t.id) }, rolls && !rolls[str(t.id)] ? `${t.name} (no piece of this set rolls it)` : t.name)));
        talSel.value = g.talent;
      };
      const fillTal = () => {
        const t = s.talents.get(g.talent);
        const rolls = gearRollsOf(s.id, g.set);
        const where = t && rolls ? (rolls[str(t.id)] ? piecesText(rolls[str(t.id)]) : `No ${SETS.get(g.set).name} ${s.label.toLowerCase()} can roll it.`) : '';
        effectText(talHelp, t ? [str(t.description), where].filter(Boolean).join(' ') : '', t);
      };
      talSel.addEventListener('change', () => { g.talent = s.talents.get(talSel.value) ? talSel.value : ''; fillTal(); changed(); });
      setSel.addEventListener('change', () => { fillTalOptions(); fillTal(); });
      fillTalOptions();
      fillTal();
      body.push(h('div', { class: 'ed-field' }, h('label', { class: 'ed-label', for: 'ed-talent' }, 'Talent'), talSel, talHelp));
    }
    $('#editorBody').replaceChildren(...body);
    return setSel;
  }

  function openWeaponAttrEditor(n, idx) {
    const first = buildWeaponAttrEditor(n, idx);
    if (first) openDialog($('#editor'), first);
  }
  function buildWeaponAttrEditor(n, idx) {
    const w = S.w[n - 1];
    const wp = getWeapon(w.id);
    if (!wp) return null;
    editorCtx = { kind: 'weapon', n };
    setText('#editorTitle', `${wp.name} attributes`);
    setText('#editorClear', 'Clear attributes');
    const fields = [];
    const update = () => { for (const f of fields) f.sel._fill && f.sel._fill(); changed(); };
    const legacy = (a) => (REMOVED_WEAPON_ATTRS.has(key(a)) ? 'No longer rolls on weapons' : 'Not in our weapon attribute list');
    for (let i = 0; i < 2; i++) fields.push(attrField(i + 1, w.attrs, i, WEAPON_ATTRS, legacy, update));
    $('#editorBody').replaceChildren(...fields.map((f) => f.node));
    return fields[idx] ? fields[idx].sel : fields[0].sel;
  }

  $('#editorClear').addEventListener('click', () => {
    if (!editorCtx) return;
    let first = null;
    if (editorCtx.kind === 'gear') {
      S.gear[editorCtx.slot] = emptyPiece();
      changed();
      first = buildGearEditor(editorCtx.slot);
    } else {
      S.w[editorCtx.n - 1].attrs = [{ a: '', v: null }, { a: '', v: null }];
      changed();
      first = buildWeaponAttrEditor(editorCtx.n, 0);
    }
    if (first) first.focus();
    toast('Cleared.');
  });

  /* ---------- share and card ---------- */
  let toastTimer = 0;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
  }
  function hideShareLink() {
    const box = $('#shareLink');
    if (box) box.hidden = true;
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through to the manual field */ }
    return false;
  }
  /* The share box shows a link or a text summary to copy by hand when the browser won't copy it */
  function showShareBox(label, text) {
    setText('#shareLinkLabel', label);
    const box = $('#shareLink');
    const field = $('#shareLinkField');
    field.value = text;
    field.rows = Math.min(12, text.split('\n').length + 1);
    box.hidden = false;
    field.focus();
    field.select();
  }
  const buildUrl = () => location.origin + location.pathname + '#' + encode(S);
  async function shareBuild() {
    if (!S.spec) { toast('Pick a specialization first.'); return; }
    writeUrl();
    const url = buildUrl();
    if (await copyText(url)) { hideShareLink(); toast('Link copied.'); return; }
    showShareBox('Copy this link', url);
    toast('Couldn\'t copy automatically. Copy the link below.');
  }

  /* A short write-up to paste into Discord or Reddit */
  function buildText() {
    const lines = [`${S.name || 'Untitled build'} (${S.spec}, ${S.focus})`];
    S.w.forEach((w, i) => {
      const wp = getWeapon(w.id);
      if (!wp) return;
      const talents = [isExotic(wp) ? str(wp.talentName) : '', ...w.t.map((id) => { const t = WT.get(id); return t ? t.name : ''; })].filter(Boolean);
      const attrs = w.attrs.filter((x) => x.a).map(attrLabel);
      lines.push([`${WEAPON_LABEL[i]}: ${wp.name}${w.tier ? ` (${w.tier})` : ''}`, talents.join(', '), attrs.join(', ')].filter(Boolean).join(' | '));
    });
    const os = OSP.get(S.os);
    if (os) lines.push(`OS Protocol: ${os.name}`);
    const mods = S.mods.map((id) => MODS.get(id)).filter(Boolean).map((m) => m.name);
    if (mods.length) lines.push(`Skill mods: ${mods.join(', ')}`);
    for (const slot of GAME_ORDER) {
      const s = SLOT[slot];
      const g = S.gear[slot];
      const set = SETS.get(g.set);
      const t = s.talents ? s.talents.get(g.talent) : null;
      const attrs = g.attrs.filter((x) => x.a).map(attrLabel);
      if (!set && !t && !attrs.length) continue;
      lines.push([`${s.label}: ${set ? set.name : 'no set'}`, t ? t.name : '', attrs.join(', ')].filter(Boolean).join(' | '));
    }
    const active = [...setCounts(S)].map(([id, n]) => ({ set: SETS.get(id), n }))
      .filter((x) => x.set && setTiers(x.set).some((t) => x.n >= t.pieces)).map((x) => `${x.n}pc ${x.set.name}`);
    if (active.length) lines.push(`Sets: ${active.join(', ')}`);
    lines.push(buildUrl());
    return lines.join('\n');
  }
  async function copyBuildText() {
    if (!S.spec) { toast('Pick a specialization first.'); return; }
    writeUrl();
    const text = buildText();
    if (await copyText(text)) { hideShareLink(); toast('Build copied as text.'); return; }
    showShareBox('Copy this text', text);
    toast('Couldn\'t copy automatically. Copy the text below.');
  }

  function openCard() {
    const a = analyze(S, computeStats(S));
    const sets = [...setCounts(S)]
      .map(([id, n]) => ({ set: SETS.get(id), n }))
      .filter((x) => x.set && setTiers(x.set).some((t) => x.n >= t.pieces))
      .map((x) => `${x.n}pc ${x.set.name}`).join(', ') || 'None active';
    const wps = S.w.map((w) => getWeapon(w.id)).filter(Boolean);
    const os = OSP.get(S.os);
    const sp = specOf(S.spec);
    const icon = (url, wide) => (url ? h('img', { src: url, alt: '', class: wide ? 'wide' : null, width: wide ? '96' : '40', height: wide ? '45' : '40' }) : null);
    const icons = [
      ...wps.map((wp) => icon(imgOf(wp.id), true)),
      os ? icon(imgOf(os.id)) : null,
      ...S.mods.map((id) => (MODS.get(id) ? icon(imgOf(id)) : null)),
      ...[...setCounts(S).keys()].map((id) => icon(imgOf(id))),
    ].filter(Boolean);
    const col = (k, v) => h('div', { class: 'cardx__col' }, h('span', { class: 'cardx__k' }, k), h('span', { class: 'cardx__v' }, v));
    $('#cardPreview').replaceChildren(h('div', { class: 'cardx' },
      h('span', { class: 'cardx__brand' }, 'Resurgence Builds Build Planner'),
      h('div', { class: 'cardx__head' },
        sp && sp.icon ? h('img', { src: str(sp.icon), alt: '', width: '56', height: '56' }) : null,
        h('div', null,
          h('p', { class: 'cardx__name' }, S.name || 'Untitled build'),
          h('span', { class: 'cardx__spec' }, S.spec ? `${S.spec}, ${S.focus}` : 'No specialization'))),
      icons.length ? h('div', { class: 'cardx__icons' }, icons) : null,
      h('div', { class: 'cardx__row' },
        col('Gear sets', sets), col('Weapons', wps.map((w) => w.name).join(', ') || 'None'), col('OS Protocol', os ? os.name : 'None'),
        h('div', { class: 'cardx__col cardx__score' }, h('span', { class: 'cardx__k' }, a.grade), h('b', null, String(a.score))))));
    openDialog($('#cardModal'), $('#cardModal .modal__x'));
  }

  /* ---------- my builds (this browser only) ---------- */
  const SAVE_KEY = 'rb-planner-saves';
  function readSaves() {
    try {
      const v = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      return Array.isArray(v) ? v.filter((x) => x && typeof x.hash === 'string' && x.hash.length < 4000 && typeof x.name === 'string') : [];
    } catch (e) { return []; }
  }
  function writeSaves(list) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(list.slice(0, 40))); return true; } catch (e) { return false; }
  }
  function renderSavesCount() {
    const n = readSaves().length;
    setText('#mineCount', n ? String(n) : '');
  }
  function saveBuild() {
    if (!S.spec) { toast('Pick a specialization first.'); return; }
    const name = S.name || 'Untitled build';
    const list = readSaves();
    const at = list.findIndex((x) => x.name === name);
    if (at >= 0) list.splice(at, 1);
    list.unshift({ name, hash: encode(S), at: Date.now() });
    if (!writeSaves(list)) { toast('This browser won\'t let the planner save. Use Copy link instead.'); return; }
    renderSavesCount();
    toast(at >= 0 ? `Updated "${name}" in My builds.` : `Saved "${name}" to My builds.`);
  }
  function svgIcon(d) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = doc.createElementNS(ns, 'svg');
    for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' })) svg.setAttribute(k, v);
    const path = doc.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.append(path);
    return svg;
  }
  const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  function renderSaves() {
    const list = readSaves();
    const box = $('#savesList');
    if (!list.length) {
      box.replaceChildren(h('p', { class: 'opt-empty' }, 'Nothing saved yet. Name your build and press Save.'));
      return;
    }
    box.replaceChildren(...list.map((x, i) => {
      const r = decode(x.hash);
      const sp = r.state ? specOf(r.state.spec) : null;
      const when = new Date(Number(x.at));
      const name = cleanName(x.name) || 'Untitled build';
      return h('div', { class: 'save-row' },
        h('button', {
          type: 'button', class: 'save-row__load',
          onclick: () => { closeDialog(true); if (loadHash(x.hash)) toast(`Loaded "${name}".`); },
        },
        sp && sp.icon ? h('img', { src: str(sp.icon), alt: '', width: '36', height: '36' }) : null,
        h('span', { class: 'save-row__txt' },
          h('span', { class: 'save-row__nm' }, name),
          h('span', { class: 'save-row__meta' }, [r.state ? `${r.state.spec}, ${r.state.focus}` : 'Can\'t be opened', Number.isNaN(when.getTime()) ? '' : `saved ${dateFmt.format(when)}`].filter(Boolean).join(', ')))),
        h('button', {
          type: 'button', class: 'save-row__del', 'aria-label': `Delete ${name}`, title: 'Delete',
          onclick: () => {
            const l = readSaves();
            l.splice(i, 1);
            writeSaves(l);
            renderSavesCount();
            renderSaves();
            const next = $('#savesList .save-row__load') || $('#savesModal .modal__x');
            if (next) next.focus();
            toast(`Deleted "${name}".`);
          },
        }, svgIcon('M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3')));
    }));
  }
  function openSaves() {
    renderSaves();
    openDialog($('#savesModal'), $('#savesList .save-row__load') || $('#savesModal .modal__x'));
  }

  /* ---------- take your chances: the slot machine ----------
     One press fills every slot with a random loadout the game allows: two different guns with one exotic at
     most, talents from each gun's own pool, body armor and backpack talents a piece of that set can carry,
     the focus's own skill mods and two different attributes on every piece. The build is set (and in the
     link and the undo history) at once; the reels are only a show on top of it. Each slot spins and stops
     in turn, then the score counts up and the payout card calls the pull. Pressing again stops the reels. */
  const rnd = (n) => Math.floor(Math.random() * n);
  const pickOne = (list) => list[rnd(list.length)];
  function pickSome(list, n) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a.slice(0, n);
  }
  /* Build names for the slot machine, written for the dads who play this game. Most fit any pull; the
     themed ones only show up when the pull earns them: its specialization, a gear set it wears two or more
     pieces of, or an exotic in a weapon slot. */
  const NAMES_ANY = [
    // home and family
    'Dad Bod Juggernaut', 'Who Touched the Thermostat', 'Mowed the Lawn, Now You', 'Cargo Shorts Full of Ammo',
    'Socks and Sandals Sniper', 'Back Went Out Mid-Fight', 'Recliner Mode Activated', 'Nap Time Is Over',
    'Dad Reflexes Engaged', 'Grill Master General', 'Leaf Blower at 7 AM', 'Honey-Do List Speedrun',
    'Garage Fridge Raider', 'Minivan Assault Unit', 'Carpool Commando', 'Pickup Line Pro', 'We Have Food at Home',
    'Ask Your Mother', 'Because I Said So', 'Close the Door, AC Is On', 'Were You Born in a Barn',
    'Not Mad, Just Disappointed', 'I Will Turn This Car Around', "Hi Hungry, I'm Dad", 'Hold My Coffee',
    'Hold My Juice Box', 'One More Game, Honey', 'Five More Minutes, I Swear', 'Diaper Change AFK',
    '3 AM Feeding, 3 AM Raid', 'Toddler Pressed Start', 'Kids Asleep, Dad Unleashed', 'Dino Nugget Enjoyer',
    'Stepped on a Toy at 2 AM', 'Dad Joke Detonator', 'Pull My Finger, Then Duck', 'Old Man Strength',
    "We're Not Lost", 'Mortgage Payment Pending', 'Minivan Drift King', 'Bought Ammo in Bulk', 'Did You Lock the Door?',
    'Checked the Stove Twice', 'Asleep Before the Credits', 'Fell Asleep in a Cutscene', 'Who Ate My Leftovers?',
    'Monday Morning Rage Quit', 'Called in Sick to Raid', "Honey, I'm Home (Logging In)", 'Garage Gym, Zero Visits',
    'Lower Back Tank', 'Knees Pop on Reload', 'Pulled a Hamstring Sprinting',
    // old school gamer
    'Boomer Shooter', 'Back in My Day, We Had Lag', 'Dial-Up Veteran', 'LAN Party Survivor', 'Blew on the Cartridge',
    'Couch Co-op Commander', 'Screen Peeker Supreme',
    // skill issues
    'Certified Skill Issue', 'Touched Grass Once', 'Git Gud, Get Groceries', 'Spray, Pray, Pay Bills',
    'Respawn and Regret', 'Rage Quit Ranger', 'Controller Thrower', 'It Was Lag, I Swear', '200 Ping Dad',
    'Router in the Basement', 'Who Is Downloading Right Now', 'Tryhard Tuesday', 'Loot Goblin Dad',
    'Inventory Full Again', 'Saved My Grenades Forever', 'Aim Assist Did the Work', 'Stick Drift Champion',
    'No Scope, No Hope', 'Hip Fire Hero', 'Professional Camper', 'Flank Me, I Dare You', 'Teabag Tuesday',
    'Salt Mine Operator', 'Carry Me Like Groceries', 'Revive Me, Coward', 'Downed and Disappointed',
    'Speedrun to the Grave', 'Nerf This Dad', 'Patch Day Panic', 'Copied a YouTuber', 'Skipped the Tutorial',
    'Button Masher Supreme', 'Pressed Everything, Won', 'RNG Hates Me Personally', 'One More Sealed Cache',
    'Meta Chaser, Fun Hater', 'Read the Patch Notes Once', 'Missed Every Single Shot', 'Professional Wall Shooter',
    // the city
    'Dark Zone Daycare', 'Extracting the Groceries', 'Went Rogue at the PTA', 'Get Off My Dark Zone',
    'Get Off My Lawn, Agent', 'Manhattan Lawn Service', 'Bodega Cat Bodyguard', 'Bodega Run Gone Wrong',
    'Subway Car Sniper', 'Times Square Tantrum', 'Brooklyn Bridge Troll', 'Midtown Meltdown',
    'Shoveled the Driveway First', 'Agent of Chaos and Carpool', 'SHD: Sleepy Hungry Dad',
    // the slot machine
    'House Money', 'Loose Slots', 'Snake Eyes', 'Rolled a Nat 1', 'Double Down on Dad Jokes', 'All In, Out of Breath',
    'Lucky Socks Equipped', 'Lucky Underwear Loadout', 'Scratch-Off Sniper', 'Casino Buffet Champion',
    'What Happens in the DZ', 'Bet the Mortgage', 'Betting the College Fund', 'Spent the Swear Jar', "Beginner's Luck",
    // dad energy
    "Your Dad's Favorite Build", 'Built Different, Built Old', 'Old Enough to Be Your Dad', 'Dad Has Entered the Lobby',
    'Grounded Until Respawn', "You're Grounded, Agent", 'Go to Your Room, Rogue', 'No Dessert for Rogues',
    "Don't Make Me Come Up There", 'Not Angry, Just Reloading', 'Back Pain, Bad Intentions', 'Free Taxi, Paid in Hugs',
    "Ammo Doesn't Grow on Trees", 'Lights Off, Damage On', 'Who Left the Garage Open?', 'Dad Said It Was Fine',
    'Go Ask Your Father', 'Lecture Incoming', "Here's a Fun Fact, Son",
    // fuel
    'Hot Dog Water Hydration', 'Gas Station Sushi Gamble', 'Beef Jerky Breath', 'Fourth Cup of Coffee',
    'Decaf Is for Quitters', 'Microwaved My Coffee Twice', 'Cold Pizza Breakfast', 'Ranch on Everything',
    'Wing Night Menace', 'Chili Cook-Off Champion', 'Brisket Since 4 AM', 'Meat Sweats Meta', 'Hidden Snack Stash',
    'Halloween Candy Dad Tax',
    // sports and the garage
    'Fantasy League Last Place', 'Fourth Quarter Comeback', 'Hail Mary Headshot', 'Lawn Chair Linebacker',
    'Weekend Warrior, Wrecked', 'Beer League Legend', 'Truck Bed Arsenal', 'Check Engine Light Agent',
    'Duct Tape and a Prayer', "Borrowed the Neighbor's Drill", 'Professional Stud Finder', 'Measure Twice, Shoot Once',
    'Leftover Screws Build',
    // getting older
    'Reading Glasses Required', 'Squinting at the Minimap', 'Bifocal Sniper', 'What Did You Say?', 'Ringing in My Ears',
    'Ibuprofen Is a Food Group', 'Heating Pad Hero', 'Ice Pack Assault', 'Joints Louder Than Guns',
    'Made a Noise Standing Up', 'In Bed by 9 PM', 'Up at 5 AM Anyway', 'Senior Discount Sniper',
    'Midlife Crisis Convertible',
    // family IT department
    'Turned It Off and On Again', 'Printer Is My Nemesis', 'Password Is Password123', "Fixed Grandma's Computer",
    'Reply All Disaster', 'Blue Screen Survivor', 'Cable Management Is a Myth',
    // the kids
    "Teen Says I'm Cringe", 'Cringe Dad Certified', 'Still Says Yeet', 'Victory Dance in Public', 'OK Boomer, Reloading',
    'Dad Hat, No Cap', 'Rizz Level: Zero', 'Sigma Dad Grindset', 'Main Character Dad', 'Kids Kicked Me Off the TV',
    'Player Two Is My Son', 'My Son Carried Me', 'Son Is a Better Shot', 'Chores Before Raids',
    // the suburbs
    'Tactical Fanny Pack', 'Fanny Pack Full of Frags', 'Flashlight in the Glovebox', "World's Okayest Dad",
    "World's Okayest Agent", 'Khakis With Extra Pockets', 'Belt Clip Phone Holster', 'Tucked-In Polo Assault',
    'Pleated Pants Paladin', 'New Shoes for Mowing', 'Sunburned at the BBQ', 'Lawn Stripes Specialist',
    "Neighbor's Lawn Envy", "HOA's Worst Nightmare", 'Fence Dispute Final Boss', 'Final Boss of the Cul-de-Sac',
    'Suburban Assault Vehicle', 'Christmas Lights by November', 'Black Friday Breacher', 'Tactical Leaf Raking',
    'Snow Blower Supremacy',
  ];
  const NAMES_SPEC = {
    'Demolitionist': ['Demolished the Buffet', 'Boom Goes the Barbecue', 'Fireworks Permit Pending', 'Mine Your Own Business', 'Demolition Dad'],
    'Tech Operator': ['Have You Tried Rebooting', 'Helicopter Dad, Literally', 'Tech Support for the Family', 'Did You Update Your Drivers', "Tech Op Can't Fix the Printer"],
    'Bulwark': ['Human Shield Husband', 'Load-Bearing Dad', 'Dad Bod Is a Shield', 'Bulwark Belly', 'Unmovable Recliner'],
    'Vanguard': ['Vanguard of the Snack Aisle', 'Front Line, Back Pain', 'Leads the Charge, Forgets Why', 'Charged In, Knee Gave Out', 'First In, First to Nap'],
    'Field Medic': ['Rub Some Dirt on It', 'Walk It Off, Agent', 'Self-Diagnosed Field Medic', 'Medic, Not a Real Doctor', 'Field Medic, Bring Snacks'],
  };
  const NAMES_SET = {
    'Fury Strike': ['Fury Strike at Bath Time', 'Fury Strike, Zero Chill'],
    'Quick Draw': ['Quick Draw, Slow Knees', 'Quick Draw, Slower Wi-Fi'],
    'Phalanx Attack': ['Phalanx of Folding Chairs', 'Phalanx of Lawn Gnomes'],
    'One Shot One Kill': ['One Shot, One Nap', 'One Shot, One Coffee'],
    'Gunny Johnny': ['Gunny Johnny Mows the Lawn', "Gunny Johnny's Day Off"],
    'Mechanical Enemy': ['Mechanical Enemy: My Printer', 'Mechanical Enemy: The Grill'],
    'Jackpot': ['Hit the Jackpot, Hurt My Back', 'Jackpot at the Gas Station'],
    'Long-term Effect': ['Long-term Effect: Back Pain', 'Long-term Effect: Dad Jokes'],
    'Dr. Medic': ['Dr. Medic Will See You Now', 'Dr. Medic Takes Copays'],
    'Boom-Shakalaka': ['Boom-Shakalaka at the BBQ', 'Boom-Shakalaka, Says Dad'],
    'Fire Cycle': ['Fire Cycle on the Grill', 'Fire Cycle, Smoke Alarm'],
    'Mechanical Expert': ['Mechanical Expert, Kinda', 'Mechanical Expert? Barely'],
    'Captain Cow': ['Captain Cow Is My Copilot', 'Holy Cow, Captain'],
    'Healing Elites': ['Healing Elites, Hurt Feelings', 'Healing Elites, Not My Back'],
    'Self-Propelled Shield': ['Self-Propelled Lawn Mower', 'Self-Propelled Snack Cart'],
    'Fearless Warrior': ['Fearless Warrior vs. Spiders', 'Fearless Warrior, Fears HOA'],
  };
  const NAMES_EXOTIC = {
    'Lady Death': ['Lady Death and Gentleman Dad', 'Lady Death, Dad Life'],
    'Warlord': ['Warlord of the Grill', 'Warlord of the Cul-de-Sac'],
    'Strawberry Milkshake': ['Two Straws, One Milkshake', 'Milkshake Brain Freeze'],
    'Scorpio': ['Scorpio, Read My Horoscope', "It's Scorpio Season"],
    'The Bighorn': ['Big Game Hunter, Small Bladder', 'Bighorn, Big Mood'],
    'Diamondback': ['Diamondback, Diamond Hands', 'Diamondback, Bad Back'],
  };
  const byKey = (o) => new Map(Object.entries(o).map(([k, v]) => [key(k), v]));
  const SPEC_NAMES = byKey(NAMES_SPEC);
  const SET_NAMES = byKey(NAMES_SET);
  const EXOTIC_NAMES = byKey(NAMES_EXOTIC);
  const ALL_NAMES = [NAMES_ANY, NAMES_SPEC, NAMES_SET, NAMES_EXOTIC].flatMap((x) => (Array.isArray(x) ? x : Object.values(x).flat()));
  /* About two pulls in five that earn a themed name get one; the rest draw from the general list */
  function luckyName(st) {
    const themed = [...arr(SPEC_NAMES.get(key(st.spec)))];
    for (const [id, n] of setCounts(st)) { const set = SETS.get(id); if (set && n >= 2) themed.push(...arr(SET_NAMES.get(key(set.name)))); }
    for (const w of st.w) { const wp = getWeapon(w.id); if (isExotic(wp)) themed.push(...arr(EXOTIC_NAMES.get(key(wp.name)))); }
    return themed.length && Math.random() < 0.4 ? pickOne(themed) : pickOne(NAMES_ANY);
  }

  function randomBuild() {
    const st = emptyState();
    const sp = pickOne(SPECS);
    st.spec = sp.name;
    st.focus = pickOne(sp.focuses).name;
    // Weapons: two different guns; about one pull in three puts an exotic in one slot
    const exoSlot = EXO.items.length && Math.random() < 0.35 ? rnd(2) : -1;
    const guns = pickSome(STD.items, 2);
    st.w.forEach((w, i) => {
      const wp = i === exoSlot ? pickOne(EXO.items) : guns[i];
      if (!wp) return;
      w.id = str(wp.id);
      const ps = weaponPoolOf(wp);
      const talents = ps ? pickSome([...ps].filter((id) => WT.get(id)), 2) : [];
      w.t = [str(talents[0] || ''), str(talents[1] || '')];
      w.attrs = pickSome(WEAPON_ATTRS.list, 2).map((r) => ({ a: r.name, v: null }));
    });
    // Gear: each pull loads the reels differently. Most pulls weight two sets (plus the odd wild one), some
    // lean on one set, and some are pure chaos, so set bonuses land some of the time, not every time.
    const main = pickSome(SETS.items, 2);
    const mode = Math.random();
    const odds = mode < 0.3 ? [0, 0] : mode < 0.82 ? [0.45, 0.8] : [0.72, 0.72];
    for (const s of SLOTS) {
      const g = st.gear[s.id];
      const roll = Math.random();
      const set = roll < odds[0] ? main[0] : roll < odds[1] ? main[1] : pickOne(SETS.items);
      if (!set) continue;
      g.set = str(set.id);
      if (s.talents) {
        const rolls = gearRollsOf(s.id, set.id);
        const ok = rolls ? Object.keys(rolls).filter((id) => s.talents.get(id)) : [];
        g.talent = ok.length ? pickOne(ok) : '';
      }
      g.attrs = pickSome(GEAR_ATTRS.list, 2).map((r) => ({ a: r.name, v: null }));
    }
    const os = pickOne(OSP.items);
    st.os = os ? str(os.id) : '';
    const mine = MODS.items.filter((m) => key(m.specialization) === key(st.spec));
    const skills = focusSkills(st);
    if (skills) {
      st.mods = skills.map((sk) => {
        const c = mine.filter((m) => key(m.skill) === key(sk));
        return c.length ? str(pickOne(c).id) : '';
      });
    } else placeMods(st, pickSome(mine, 3).map((m) => str(m.id)));
    st.name = luckyName(st); // last: some names depend on the gear and guns
    return st;
  }

  /* Art for the reels: a handful per kind, fetched the first time the button is hovered, focused or touched */
  let reelArt = null;
  function warmReels() {
    if (reelArt) return reelArt;
    const urls = (list) => list.map((x) => imgOf(x.id)).filter(Boolean);
    reelArt = {
      weapons: pickSome(urls(STD.items), 20),
      sets: urls(SETS.items),
      os: pickSome(urls(OSP.items), 20),
      mods: pickSome(urls(MODS.items), 20),
      talents: pickSome(urls(WT.items), 20),
      armor: pickSome(urls([...BODY.items, ...PACK.items]), 14),
      specs: SPECS.map((s) => str(s.icon)).filter(Boolean),
    };
    for (const list of Object.values(reelArt)) for (const u of list) { const im = new Image(); im.decoding = 'async'; im.src = u; }
    return reelArt;
  }

  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const buzz = (p) => { try { if (coarse && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* no vibration here */ } };
  const slotBtn = $('#slotBtn');
  const SLOT_LABEL = slotBtn ? slotBtn.getAttribute('aria-label') : '';

  function spinBuild() {
    if (spin) { spin.stop(); return; }
    if (dialog) closeDialog(true);
    hideWin();
    hideShareLink();
    const before = S.spec ? encode(S) : '';
    let next = randomBuild();
    for (let i = 0; i < 3 && encode(next) === before; i++) next = randomBuild();
    S = next;
    loadedTemplate = -1;
    notice = '';
    renderAll();
    writeUrl();
    remember();
    const result = analyze(S, computeStats(S));
    if (slotBtn) {
      slotBtn.classList.remove('is-pull');
      void slotBtn.offsetWidth;
      slotBtn.classList.add('is-pull');
    }
    if (reduceMotion) { payout(result, true); return; }
    runReels(result);
  }

  function runReels(result) {
    const art = warmReels();
    // One clock for everything: the document timeline the reel animations run on, so a busy first frame
    // delays text and reels alike and they still land together.
    const tl = document.timeline;
    const timeNow = () => (tl && tl.currentTime != null ? tl.currentTime : performance.now());
    const t0 = timeNow();
    const jobs = [];    // { t, fn } once the clock passes t
    const rollers = []; // flickering text and icons: { end, next, tick(), land() }
    const reels = [];   // spinning art windows: { anims, box, done, onLand }
    const reads = [];   // setup reads layout first, then writes, so the page lays out once
    const writes = [];
    let raf = 0;
    let over = false;
    let stops = 0;
    const job = (t, fn) => jobs.push({ t, fn, done: false });
    const write = (fn) => writes.push(fn);

    const pop = (el) => {
      if (!el) return;
      el.classList.remove('slot-pop');
      void el.offsetWidth;
      el.classList.add('slot-pop');
    };
    /* Text that flickers through random words, then lands on what the render already wrote */
    function roll(el, words, end) {
      if (!el || !words.length) return;
      let tall = 0;
      reads.push(() => { tall = el.offsetHeight; });
      write(() => {
        const kept = [...el.childNodes].map((n) => n.cloneNode(true));
        if (tall) el.style.minHeight = `${tall}px`;
        el.classList.add('slot-roll');
        rollers.push({
          end, next: 0, done: false,
          tick() { el.textContent = pickOne(words); },
          land() { el.replaceChildren(...kept); el.classList.remove('slot-roll'); el.style.minHeight = ''; pop(el); },
        });
      });
    }
    /* An icon that flickers (talent chips), then shows its own art again */
    function rollImg(img, urls, end) {
      if (!img || !urls.length) return;
      write(() => {
        const src = img.getAttribute('src');
        const hid = img.hidden;
        img.hidden = false;
        rollers.push({
          end, next: 0, done: false,
          tick() { img.setAttribute('src', pickOne(urls)); },
          land() { if (src) img.setAttribute('src', src); else img.removeAttribute('src'); img.hidden = hid; },
        });
      });
    }
    /* Hidden until its slot stops (attribute chips, set counts, the OS talent text) */
    function holdTill(el, t) {
      if (!el) return;
      write(() => el.classList.add('slot-wait'));
      job(t, () => { el.classList.remove('slot-wait'); pop(el); });
    }
    /* A tile stops: it drops the gold edge and flashes in its own color */
    function flash(tile, color) {
      if (!tile) return;
      tile.classList.remove('is-reeling');
      const glow = h('span', { class: 'slot-glow', 'aria-hidden': 'true' });
      glow.style.setProperty('--flash', color || '#FFD36A');
      tile.append(glow);
      glow.addEventListener('animationend', () => glow.remove(), { once: true });
      buzz(6);
    }
    /* A reel in an art window: a strip of art scrolls down past the window and settles on the final
       picture (cell 1) with a small bounce; cell 0 sits above it for the bounce to show. A window that
       isn't on screen (the agent emblem on phones) just lands on time. */
    function reel(win, urls, finalUrl, t, opts) {
      const o = opts || {};
      if (!win || !urls.length) { if (o.onLand) job(t, o.onLand); return; }
      let H = 0;
      let size = 0;
      reads.push(() => {
        H = win.clientHeight;
        size = o.wide ? 0 : (o.ref && !o.ref.hidden && o.ref.offsetWidth) || Math.round(H * 0.72);
      });
      write(() => {
        if (!H) { if (o.onLand) job(t, o.onLand); return; }
        const n = Math.max(9, Math.min(34, Math.round(t / 66)));
        const cells = [];
        for (let i = 0; i <= n; i++) {
          const url = i === 1 ? finalUrl : pickOne(urls);
          const img = url ? h('img', { src: url, alt: '', decoding: 'async', draggable: 'false' }) : null;
          if (img && size) { img.style.width = `${size}px`; img.style.height = `${size}px`; }
          if (img && i === 1 && o.focus) img.style.objectPosition = o.focus;
          const cell = h('div', { class: 'reel__cell' }, img);
          cell.style.height = `${H}px`;
          cells.push(cell);
        }
        const strip = h('div', { class: 'reel__strip' }, cells);
        const box = h('div', { class: 'reel' + (o.wide ? ' reel--wide' : ''), 'aria-hidden': 'true' }, strip);
        win.append(box);
        const to = -H;
        const bounce = Math.round(H * 0.16);
        const move = strip.animate([
          { transform: `translate3d(0, ${-n * H}px, 0)`, easing: 'cubic-bezier(.3, 0, .2, 1)' },
          { transform: `translate3d(0, ${to + bounce}px, 0)`, offset: 0.9, easing: 'cubic-bezier(.3, 0, .3, 1)' },
          { transform: `translate3d(0, ${to}px, 0)` },
        ], { duration: t, fill: 'forwards' });
        const blur = strip.animate([
          { filter: 'blur(0px)' }, { filter: 'blur(2.4px)', offset: 0.1 }, { filter: 'blur(2.4px)', offset: 0.58 },
          { filter: 'blur(0px)', offset: 0.84 }, { filter: 'blur(0px)' },
        ], { duration: t, fill: 'forwards' });
        // both start on the shared clock, not whenever the browser gets to them
        if (tl && tl.currentTime != null) { move.startTime = t0; blur.startTime = t0; }
        const r = { anims: [move, blur], box, done: false, onLand: o.onLand };
        reels.push(r);
        move.onfinish = () => landReel(r);
      });
    }
    function landReel(r) {
      if (r.done) return;
      r.done = true;
      r.box.classList.add('is-out');
      setTimeout(() => r.box.remove(), 170);
      if (r.onLand) r.onLand();
    }

    // Word lists for the flicker
    const names = (list) => list.map((x) => str(x.name)).filter(Boolean);
    const guns = [...STD.items, ...EXO.items];
    const W = {
      guns: names(guns), gunLines: pickSome(guns, 24).map(weaponLine), talents: names(WT.items),
      gunAttrs: WEAPON_ATTRS.list.map((r) => short(r.name)), os: names(OSP.items),
      osLines: pickSome(OSP.items, 20).map((x) => [x.rarity, x.specialization].filter(Boolean).join(' · ')),
      mods: names(MODS.items), modLines: pickSome(MODS.items, 20).map((m) => `2pc ${bonusText(m.bonus2)}`),
      skills: [...new Set(MODS.items.map((m) => str(m.skill)).filter(Boolean))], sets: names(SETS.items),
      armor: names([...BODY.items, ...PACK.items]), focuses: SPECS.flatMap((s) => s.focuses.map((f) => f.name)),
    };

    const board = $('.pl-board');
    write(() => {
      lab.classList.add('is-spinning');
      if (board) board.inert = true;
      if (slotBtn) { slotBtn.classList.add('is-spinning'); slotBtn.setAttribute('aria-label', 'Stop the reels'); }
    });

    // The agent: chase lights run across the five specializations and slow down onto the pick
    const specBtns = $$('.spec-btn');
    const target = Math.max(0, specBtns.findIndex((b) => b.dataset.spec === S.spec));
    write(() => specBtns.forEach((b) => b.classList.remove('is-active')));
    let t = 0;
    const STEPS = 13;
    for (let k = 0; k < STEPS; k++) {
      const at = (((target - (STEPS - 1 - k)) % specBtns.length) + specBtns.length) % specBtns.length;
      t += 34 + 0.42 * k * k;
      job(t, () => specBtns.forEach((b, i) => b.classList.toggle('is-chase', i === at)));
    }
    const tSpec = Math.round(t + 60);
    const sp = specOf(S.spec);
    reel($('.pl-agent__emblem'), art.specs, sp && sp.icon ? str(sp.icon) : '', tSpec, { ref: $('#specEmblem') });
    job(tSpec, () => { specBtns.forEach((b) => b.classList.remove('is-chase')); renderSpec(); pop(specBtns[target]); flash($('#specPanel'), '#FF8A3D'); });
    roll($('#subLabel'), W.focuses, tSpec + 90);
    const nameInput = $('#buildNameInput');
    if (nameInput && nameInput !== doc.activeElement) {
      rollers.push({ end: tSpec + 150, next: 0, done: false, tick() { nameInput.value = pickOne(ALL_NAMES); }, land() { nameInput.value = S.name; fitName(); pop(nameInput); } });
    }

    // Weapons
    const tGun = tSpec + 190;
    [1, 2].forEach((n, i) => {
      const card = $(`#w${n}card`);
      const wp = getWeapon(S.w[i].id);
      const exo = isExotic(wp);
      const tw = tGun + i * 150;
      write(() => card.classList.add('is-reeling'));
      reel($('.wtile__art', card), art.weapons, wp ? imgOf(wp.id) : '', tw,
        { wide: true, focus: exo ? 'center 30%' : '', onLand: () => flash(card, exo ? '#E2B33C' : '#FF8A3D') });
      roll($(`#w${n}name`), W.guns, tw);
      roll($(`#w${n}sub`), W.gunLines, tw);
      [$(`#w${n}fixed`), $(`[data-talent="w${n}t1"]`), $(`[data-talent="w${n}t2"]`), $(`[data-wbonus="${n}"][data-wbidx="1"]`), $(`[data-wbonus="${n}"][data-wbidx="2"]`)]
        .filter((c) => c && !c.hidden)
        .forEach((c, j) => {
          const tc = tw + 70 + j * 55;
          const attr = c.matches('[data-wbonus]');
          roll($('.picktag__val', c), attr ? W.gunAttrs : W.talents, tc);
          if (!attr) rollImg($('img', c), art.talents, tc);
        });
    });

    // OS Protocol
    const tOs = tGun + 150 + 170;
    const osTile = $('.ktile--os');
    const os = OSP.get(S.os);
    write(() => osTile.classList.add('is-reeling'));
    reel($('.ktile__icon', osTile), art.os, os ? imgOf(os.id) : '', tOs,
      { ref: $('#osImg'), onLand: () => flash(osTile, os ? RARITY_COLOR[key(os.rarity)] : '') });
    roll($('#osName'), W.os, tOs);
    roll($('#osSub'), W.osLines, tOs);
    holdTill($('#osDesc'), tOs + 60);

    // Skill mods
    const tMod = tOs + 110;
    $$('.skill-slot').forEach((btn, i) => {
      const tm = tMod + i * 95;
      const m = MODS.get(S.mods[i]);
      write(() => btn.classList.add('is-reeling'));
      reel($('.ktile__icon', btn), art.mods, m ? imgOf(m.id) : '', tm,
        { ref: $('.ktile__icon img:not(.ktile__ph)', btn), onLand: () => flash(btn, '#FF8A3D') });
      roll($('.skill-slot__skill', btn), W.skills, tm);
      roll($('.skill-slot__nm', btn), W.mods, tm);
      roll($('.skill-slot__sub', btn), W.modLines, tm);
    });

    // Gear, in the game's order, one reel after another
    const tGear = tMod + 2 * 95 + 130;
    GAME_ORDER.forEach((slot, i) => {
      const tile = $(`.gtile[data-gtile="${slot}"]`);
      if (!tile) return;
      const tg = tGear + i * 110;
      const set = SETS.get(S.gear[slot].set);
      write(() => tile.classList.add('is-reeling'));
      reel($('.gtile__emblem', tile), art.sets, set ? imgOf(set.id) : '', tg,
        { ref: $('.gtile__set', tile), onLand: () => flash(tile, tile.style.getPropertyValue('--set')) });
      roll($('.gearslot__val', tile), W.sets, tg);
      holdTill($('[data-count]', tile), tg);
      holdTill($('.gearslot__attrs', tile), tg + 70);
      const chip = $('[data-armortalent]', tile);
      if (chip) { roll($('.picktag__val', chip), W.armor, tg + 120); rollImg($('img', chip), art.armor, tg + 120); }
      holdTill($('[data-look]', tile), tg + 170);
    });
    const tEnd = tGear + 5 * 110 + 220;

    // The button's own three reels stop one by one at the end
    const minis = slotBtn ? $$('.pl-slot__reels i', slotBtn) : [];
    minis.forEach((m, i) => job(tEnd - 300 + i * 130, () => m.classList.add('is-stop')));

    // The score spins as well, and the grade waits
    const ringNum = $('#rigScore');
    const mobNum = $('#mobScore');
    const grade = $('#ratingGrade');
    const mobGrade = $('#mobGrade');
    write(() => {
      grade.textContent = 'Rolling…';
      grade.className = 'rating__grade';
      mobGrade.textContent = 'Rolling…';
    });
    rollers.push({ end: tEnd, next: 0, done: false, tick() { const v = String(10 + rnd(90)); ringNum.textContent = v; mobNum.textContent = v; }, land() {} });
    job(tEnd, () => finish(false));

    // Read every size first, then change the page
    for (const r of reads) r();
    for (const w of writes) w();
    jobs.sort((a, b) => a.t - b.t);

    function frame(ts) {
      const now = ts - t0;
      for (const j of jobs) if (!j.done && now >= j.t) { j.done = true; j.fn(); if (over) return; }
      for (const r of rollers) {
        if (r.done) continue;
        if (now >= r.end) { r.done = true; r.land(); }
        else if (now >= r.next) { r.tick(); const p = Math.min(1, now / r.end); r.next = now + 40 + 170 * p * p * p; }
      }
      if (!over) raf = requestAnimationFrame(frame);
    }

    /* Stop: everything still to come happens five times sooner; a second press lands it all now */
    function hurry(f) {
      const now = timeNow() - t0;
      for (const j of jobs) if (!j.done) j.t = now + Math.max(0, j.t - now) * f;
      for (const r of rollers) if (!r.done) { r.end = now + Math.max(0, r.end - now) * f; r.next = Math.min(r.next, now); }
      for (const r of reels) {
        if (r.done) continue;
        for (const a of r.anims) {
          if (!f) { try { a.finish(); } catch (e) { /* already done */ } }
          else if (typeof a.updatePlaybackRate === 'function') a.updatePlaybackRate(1 / f);
          else a.playbackRate = 1 / f;
        }
      }
    }

    function finish(silent) {
      if (over) return;
      over = true;
      cancelAnimationFrame(raf);
      for (const r of reels) { for (const a of r.anims) { try { a.finish(); } catch (e) { /* already done */ } } landReel(r); }
      for (const r of rollers) if (!r.done) { r.done = true; r.land(); }
      for (const j of jobs) if (!j.done) { j.done = true; j.fn(); }
      for (const n of $$('.is-reeling, .slot-wait, .is-chase')) n.classList.remove('is-reeling', 'slot-wait', 'is-chase');
      for (const m of minis) m.classList.remove('is-stop');
      lab.classList.remove('is-spinning');
      if (board) board.inert = false;
      if (slotBtn) { slotBtn.classList.remove('is-spinning'); slotBtn.setAttribute('aria-label', SLOT_LABEL); }
      spin = null;
      renderAll();
      if (!silent) payout(result, false);
    }

    spin = {
      stop() { hurry(stops++ ? 0 : 0.2); },
      cancel() { finish(true); },
    };
    raf = requestAnimationFrame(frame);
  }

  /* The payout card: the score counts up, then the verdict */
  const PAYOUT = [
    { min: 90, title: 'Jackpot', color: '#FFD36A', lines: ['Screenshot it before the house notices.', 'Even the RNG is impressed.', 'Walk away. Walk away right now.'] },
    { min: 80, title: 'Big win', color: '#4ADE80', lines: ['That one could actually run the Dark Zone.', 'Somewhere a min-maxer just got nervous.', 'The machine owes you nothing now.'] },
    { min: 70, title: 'Winner', color: '#5B9BF7', lines: ['Not bad for one pull of the lever.', 'Respectable. Tweak a piece or two and go.', 'Your dad would call that a solid effort.'] },
    { min: 55, title: 'Push', color: '#FF8A3D', lines: ['Not great, not terrible. Pull again.', 'The machine is just warming up.', 'Could be worse. Could also be a lot better.'] },
    { min: 0, title: 'Bust', color: '#F87171', lines: ['The house wins. The house always wins.', 'That build has strong store credit energy.', 'Even the vendor would pass on this one.'] },
  ];
  let winTimer = 0;
  function payout(a, instant) {
    const box = $('#slotWin');
    if (!box) return;
    const tier = PAYOUT.find((x) => a.score >= x.min) || PAYOUT[PAYOUT.length - 1];
    const panel = $('.slot-win__panel', box);
    panel.style.setProperty('--win', tier.color);
    setText('#slotWinTitle', '');
    $('#slotWinLine').replaceChildren();
    box.classList.remove('is-show', 'is-paid');
    box.hidden = false;
    void box.offsetWidth;
    box.classList.add('is-show');
    const nums = [$('#rigScore'), $('#mobScore'), $('#slotWinNum')].filter(Boolean);
    const settle = () => {
      for (const n of nums) n.textContent = String(a.score);
      setText('#slotWinTitle', tier.title);
      $('#slotWinLine').replaceChildren(pickOne(tier.lines), h('span', { class: 'sr-only' }, ` Score ${a.score} out of 100: ${a.grade}.`));
      box.classList.add('is-paid');
      if (tier.min >= 90 && !instant) { coins(); buzz([30, 40, 30, 40, 70]); const ring = $('#scoreRing'); if (ring) { ring.classList.remove('is-jackpot'); void ring.offsetWidth; ring.classList.add('is-jackpot'); } }
      else if (!instant) buzz(14);
      clearTimeout(winTimer);
      winTimer = setTimeout(hideWin, 8000);
    };
    if (instant) { settle(); return; }
    const start = performance.now();
    const dur = 760;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round(a.score * (1 - Math.pow(1 - p, 3)));
      for (const n of nums) n.textContent = String(v);
      if (p < 1) requestAnimationFrame(step);
      else settle();
    };
    requestAnimationFrame(step);
  }
  function hideWin() {
    clearTimeout(winTimer);
    const box = $('#slotWin');
    if (!box || box.hidden) return;
    box.classList.remove('is-show', 'is-paid');
    box.hidden = true;
  }
  /* Gold coins and sparks fly out of the score, then fall */
  function coins() {
    const fx = $('#slotFx');
    const from = $('#slotWinNum');
    if (!fx || !from) return;
    const r = from.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    for (let i = 0; i < 34; i++) {
      const bit = h('i', { class: i % 3 ? 'coin' : 'spark' });
      bit.style.left = `${x}px`;
      bit.style.top = `${y}px`;
      fx.append(bit);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const v = 200 + Math.random() * 280;
      const vx = Math.cos(ang) * v;
      const vy = Math.sin(ang) * v;
      const g = 900 + Math.random() * 300;
      const spinDeg = (Math.random() - 0.5) * 900;
      const frames = [0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => ({
        transform: `translate(${vx * p}px, ${vy * p + 0.5 * g * p * p}px) rotate(${spinDeg * p}deg) scale(${p < 0.2 ? 0.6 + 2 * p : 1})`,
        opacity: p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3,
      }));
      const anim = bit.animate(frames, { duration: 1100 + Math.random() * 500, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => bit.remove();
    }
  }

  /* ---------- wiring ---------- */
  function chooseSpec(name) {
    const sp = specOf(name);
    if (!sp || S.spec === sp.name) return;
    S.spec = sp.name;
    S.focus = sp.focuses[0].name;
    const removed = placeMods(S, S.mods); // skill mods belong to one specialization
    changed();
    if (removed) toast(`${removed} ${plural(removed, 'skill mod belongs', 'skill mods belong')} to another specialization and ${plural(removed, 'was', 'were')} removed.`);
  }

  for (const b of $$('.spec-btn')) b.addEventListener('click', () => chooseSpec(b.dataset.spec));
  $('#subBtn').addEventListener('click', openFocusPicker);
  $('#tplBtn').addEventListener('click', openTemplates);
  $('#resetBtn').addEventListener('click', () => { resetBuild(); toast('Build cleared.'); });
  for (const b of $$('.gearslot')) b.addEventListener('click', () => openGearEditor(b.dataset.slot));
  for (const b of $$('[data-armortalent]')) b.addEventListener('click', () => openArmorTalentPicker(b.dataset.armortalent));
  $('#osSlot').addEventListener('click', openOSPicker);
  $$('.skill-slot').forEach((b, i) => b.addEventListener('click', () => openModPicker(i)));
  [1, 2].forEach((n) => {
    $(`#w${n}btn`).addEventListener('click', () => openWeaponPicker(n));
    $(`#w${n}tier`).addEventListener('change', (e) => {
      const v = str(e.target.value).toUpperCase();
      S.w[n - 1].tier = /^T[012]$/.test(v) ? v : '';
      changed();
    });
    [1, 2].forEach((j) => {
      $(`[data-talent="w${n}t${j}"]`).addEventListener('click', () => openWeaponTalentPicker(n, j - 1));
      $(`[data-wbonus="${n}"][data-wbidx="${j}"]`).addEventListener('click', () => openWeaponAttrEditor(n, j - 1));
    });
  });
  $('#shareBtn').addEventListener('click', shareBuild);
  $('#mobShare').addEventListener('click', shareBuild);
  $('#textBtn').addEventListener('click', copyBuildText);
  $('#saveBtn').addEventListener('click', saveBuild);
  $('#mineBtn').addEventListener('click', openSaves);
  $('#undoBtn').addEventListener('click', undo);
  $('#redoBtn').addEventListener('click', redo);
  doc.addEventListener('keydown', (e) => {
    if (dialog || !(e.ctrlKey || e.metaKey) || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return; // the field's own undo
    const k = str(e.key).toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redo(); }
  });
  $('#cardBtn').addEventListener('click', openCard);
  // The slot machine. Its art loads the first time someone points at, focuses or touches the button.
  if (slotBtn) {
    slotBtn.addEventListener('click', spinBuild);
    for (const ev of ['pointerenter', 'focus', 'touchstart']) slotBtn.addEventListener(ev, () => { warmReels(); }, { once: true, passive: true });
  }
  const winBox = $('#slotWin');
  const backToSlot = () => { if (slotBtn) slotBtn.focus({ preventScroll: true }); };
  $('#slotAgain').addEventListener('click', () => { backToSlot(); spinBuild(); });
  $('#slotWinX').addEventListener('click', () => { hideWin(); backToSlot(); });
  winBox.addEventListener('pointerenter', () => clearTimeout(winTimer));
  winBox.addEventListener('focusin', () => clearTimeout(winTimer));
  winBox.addEventListener('pointerleave', () => { clearTimeout(winTimer); if (!winBox.hidden) winTimer = setTimeout(hideWin, 3000); });
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || dialog || winBox.hidden) return;
    const inside = winBox.contains(doc.activeElement);
    hideWin();
    if (inside) backToSlot();
  });
  $('#shareLinkField').addEventListener('focus', (e) => e.target.select());
  const nameInput = $('#buildNameInput');
  nameInput.addEventListener('input', () => {
    S.name = cleanName(nameInput.value);
    fitName();
    notice = '';
    renderTemplateBar();
    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => { writeUrl(); remember(); }, 600);
  });
  $('#mobStatusGo').addEventListener('click', () => {
    const p = $('#checksPanel');
    p.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    p.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', () => {
    if (!isBuildHash(location.hash.slice(1)) && location.hash) return;
    if (spin && location.hash === '#' + encode(S)) return; // the spin's own link
    endSpin();
    clearTimeout(urlTimer);
    if (dialog) closeDialog(true);
    hideShareLink();
    loadFromLocation();
    renderAll();
    remember();
  });

  // Refit the name when the screen size changes or the display font finishes loading
  let fitTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitName, 120); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitName).catch(() => {});

  /* ---------- start ---------- */
  loadFromLocation();
  renderAll();
  remember();
  renderSavesCount();
  lab.setAttribute('data-ready', '');
})();
