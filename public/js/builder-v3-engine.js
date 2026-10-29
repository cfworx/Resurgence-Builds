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
    { id: 'kneepads', key: 'k', label: 'Kneepads' },
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
        if (t && !ps.has(str(t.id))) warns.push([B(t.name), ` doesn't roll on the ${wp.name}. The game's Build-Making Database leaves it out of that gun's talent pool.`]);
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

  function renderSpec() {
    for (const b of $$('.spec-btn')) {
      const on = b.dataset.spec === S.spec;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    const btn = $('#subBtn');
    btn.disabled = !S.spec;
    setText('#subLabel', S.spec ? `${S.focus} (${focusStat(S)})` : 'Pick a specialization');
  }

  function renderGear(counts) {
    let filled = 0;
    for (const btn of $$('.gearslot')) {
      const s = SLOT[btn.dataset.slot];
      if (!s) continue;
      const g = S.gear[s.id];
      const set = SETS.get(g.set);
      const tiers = set ? setTiers(set) : [];
      const active = !!set && tiers.length > 0 && counts.get(str(set.id)) >= tiers[0].pieces;
      const attrs = g.attrs.filter((x) => x.a);
      if (set) filled++;
      btn.classList.toggle('is-set', !!set || attrs.length > 0);
      btn.classList.toggle('is-bonus', active);
      setText('.gearslot__val', set ? set.name : attrs.length ? 'No set' : 'Empty', btn);
      $('.gearslot__attrs', btn).replaceChildren(...attrs.map((x) => h('span', {
        class: 'gearslot__attr' + (GEAR_ATTRS.has(x.a) ? '' : ' is-legacy'),
      }, short(x.a) + (x.v == null ? '' : ' ' + fmt(x.v, true)))));
      btn.setAttribute('aria-label', `${s.label}: ${set ? set.name : 'no set'}${attrs.length ? ', ' + attrs.map(attrLabel).join(', ') : ''}`);
    }
    setText('#gearPieces', `${filled} / 6`);
    const rig = $('#gearPanel .rig');
    if (rig) rig.classList.toggle('is-linked', [...counts].some(([id, n]) => { const set = SETS.get(id); const t = set ? setTiers(set) : []; return t.length && n >= t[0].pieces; }));
  }

  function renderArmorTalents() {
    for (const btn of $$('[data-armortalent]')) {
      const s = SLOT[btn.dataset.armortalent];
      const t = s && s.talents.get(S.gear[s.id].talent);
      setText('.picktag__val', t ? t.name : 'Not set', btn);
      effectText($('.picktag__desc', btn), t ? str(t.description) : '', t);
      btn.classList.toggle('is-set', !!t);
    }
  }

  function renderWeapons() {
    S.w.forEach((w, i) => {
      const n = i + 1;
      const wp = getWeapon(w.id);
      const exo = isExotic(wp);
      setText(`#w${n}name`, wp ? wp.name : 'Select weapon');
      setText(`#w${n}sub`, wp ? weaponLine(wp) : 'Not set');
      const btn = $(`#w${n}btn`);
      btn.classList.toggle('is-set', !!wp);
      btn.classList.toggle('is-exotic', exo);
      btn.setAttribute('aria-label', `${WEAPON_LABEL[i]} weapon: ${wp ? wp.name : 'not set'}`);
      const tier = $(`#w${n}tier`);
      tier.disabled = !wp;
      tier.value = wp ? w.tier : '';
      const fixed = $(`#w${n}fixed`);
      fixed.hidden = !exo;
      if (exo) {
        setText('.picktag__val', str(wp.talentName) || 'Exotic talent', fixed);
        effectText($('.picktag__desc', fixed), str(wp.talentDescription), wp);
      }
      [0, 1].forEach((j) => {
        const tb = $(`[data-talent="w${n}t${j + 1}"]`);
        const t = WT.get(w.t[j]);
        tb.disabled = !wp;
        tb.classList.toggle('is-set', !!t);
        setText('.picktag__val', t ? t.name : wp ? 'Not set' : 'Pick a weapon first', tb);
        effectText($('.picktag__desc', tb), t ? str(t.description) : '', t);
        tb.setAttribute('aria-label', `${WEAPON_LABEL[i]} talent ${j + 1}: ${t ? t.name : 'not set'}`);
      });
      [0, 1].forEach((j) => {
        const bb = $(`[data-wbonus="${n}"][data-wbidx="${j + 1}"]`);
        const x = w.attrs[j];
        bb.disabled = !wp;
        bb.classList.toggle('is-set', !!x.a);
        bb.classList.toggle('is-legacy', !!x.a && !WEAPON_ATTRS.has(x.a));
        setText('.picktag__val', x.a ? short(x.a) + (x.v == null ? '' : ' ' + fmt(x.v, true)) : wp ? 'Not set' : 'Pick a weapon first', bb);
        bb.setAttribute('aria-label', `${WEAPON_LABEL[i]} weapon attribute ${j + 1}: ${x.a ? attrLabel(x) : 'not set'}`);
      });
    });
  }

  function renderOS() {
    const os = OSP.get(S.os);
    setText('#osName', os ? os.name : 'Select OS Protocol');
    setText('#osSub', os ? [os.specialization, os.rarity, os.mainStat && os.mainValue ? `${os.mainStat} ${os.mainValue}` : ''].filter(Boolean).join(' · ') : 'Not set');
    effectText($('#osDesc'), os ? str(os.talentDescription) : '', os);
    const slot = $('#osSlot');
    slot.classList.toggle('is-set', !!os);
    slot.setAttribute('aria-label', `OS Protocol: ${os ? os.name : 'not set'}`);
  }

  function renderMods() {
    const skills = S.spec ? focusSkills(S) : null;
    $$('.skill-slot').forEach((btn, i) => {
      const m = MODS.get(S.mods[i]);
      const skill = skills ? skills[i] : '';
      btn.disabled = !S.spec;
      btn.classList.toggle('is-set', !!m);
      setText('.skill-slot__skill', skill, btn);
      setText('.skill-slot__nm', m ? m.name : S.spec ? 'Select skill mod' : 'Pick a specialization first', btn);
      setText('.skill-slot__sub', m ? [!skill && m.skill ? str(m.skill) : '', `2pc: ${bonusText(m.bonus2)}`].filter(Boolean).join(' · ') : '', btn);
      effectText($('.skill-slot__desc', btn), m ? `3pc: ${str(m.bonus3)}` : '', m);
      btn.setAttribute('aria-label', `${skill ? skill + ' mod' : 'Skill mod ' + (i + 1)}: ${m ? m.name : 'not set'}`);
    });
    setText('#skillCount', `${S.mods.filter(Boolean).length} / 3`);
  }

  function renderBonuses(counts) {
    const box = $('#bonusList');
    const active = [...counts]
      .map(([id, n]) => ({ set: SETS.get(id), n }))
      .filter((x) => x.set && setTiers(x.set).some((t) => x.n >= t.pieces));
    if (!active.length) {
      box.replaceChildren(h('p', { class: 'empty' }, 'Equip 2 pieces of a set to activate it.'));
      return;
    }
    box.replaceChildren(...active.map(({ set, n }) => h('div', { class: 'bonus' },
      h('div', { class: 'bonus__hd' }, h('span', { class: 'bonus__nm' }, set.name), h('span', { class: 'bonus__pc' }, `${n} pc`)),
      setTiers(set).filter((t) => n >= t.pieces).map((t) => h('div', { class: 'bonus__line' }, `${t.pieces}pc: ${t.text}`)),
      caveatOf(set) ? h('div', { class: 'caveat' }, caveatOf(set)) : null,
    )));
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
    setText('#ratingScore', S.spec ? `${a.score} / 100` : '');
    setText('#rigScore', String(a.score));
    const meter = $('#ratingMeter');
    if (meter) meter.style.width = a.score + '%';
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
  }

  function renderAll() {
    const counts = setCounts(S);
    const stats = computeStats(S);
    renderSpec();
    renderGear(counts);
    renderArmorTalents();
    renderWeapons();
    renderOS();
    renderMods();
    renderBonuses(counts);
    renderStats(stats);
    renderChecks(analyze(S, stats));
    renderTemplateBar();
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
    S = emptyState();
    loadedTemplate = -1;
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
  }

  function loadTemplate(i) {
    const t = TEMPLATES[i];
    const r = t && decode(t.hash);
    if (!r || !r.state) return;
    S = r.state;
    loadedTemplate = i;
    notice = '';
    hideShareLink();
    renderAll();
    writeUrl();
  }

  /* ---------- dialogs ---------- */
  let dialog = null; // { el, opener, onClose }
  const INERT_TARGETS = () => [$('.skip-link'), $('#site-header'), $('.hero'), lab, $('.lab-about'), $('.site-footer'), $('#mobStatus')].filter(Boolean);
  const focusables = (root) => $$('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])', root)
    .filter((n) => !n.disabled && !n.hidden && n.getClientRects().length > 0);

  function openDialog(el, initial, onClose) {
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
        class: 'opt' + (cur ? ' is-current' : '') + (it.none ? ' opt--none' : ''),
        'data-id': it.id,
        disabled: !!it.disabled,
        'aria-current': cur ? 'true' : null,
      },
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
      items.push({ id: String(i), name: str(t.name), tag: r.state ? r.state.focus : '', group: str(t.spec) });
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
      id: str(wp.id), name: wp.name, tag: str(wp.type), group: 'Exotic',
      desc: [weaponLine(wp), wp.talentName ? `Talent: ${wp.talentName}` : ''].filter(Boolean).join('. '),
      note: caveatOf(wp),
    }));
    const types = [];
    for (const wp of STD.items) if (!types.includes(str(wp.type))) types.push(str(wp.type));
    for (const type of types) {
      STD.items.filter((wp) => str(wp.type) === type).sort(byName).forEach((wp) => items.push({
        id: str(wp.id), name: wp.name, group: type || 'Other',
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
      disabled: str(t.id) === other, why: 'Already on this weapon.', group,
    });
    openList({
      title: `${wp.name}: talent ${j + 1}`,
      items: [
        ...inPool.map((t) => item(t, poolSet ? `The ${inPool.length} talents the ${wp.name} can roll` : '')),
        ...offPool.map((t) => ({ ...item(t, 'Picked, but not in its pool'), note: "The game's Build-Making Database doesn't list it for this gun." })),
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
      id: str(t.id), name: t.name, desc: str(t.description), alias: aliasText(t), find: guessedAliases(t), group,
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
        id: str(o.id), name: o.name,
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
          id: str(m.id), name: m.name, tag: '', group: hasSkill ? str(m.skill) || 'Other' : '',
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
  async function shareBuild() {
    if (!S.spec) { toast('Pick a specialization first.'); return; }
    writeUrl();
    const url = location.origin + location.pathname + '#' + encode(S);
    const box = $('#shareLink');
    const field = $('#shareLinkField');
    field.value = url;
    if (await copyText(url)) {
      box.hidden = true;
      toast('Link copied.');
      return;
    }
    box.hidden = false;
    field.focus();
    field.select();
    toast('Couldn\'t copy automatically. Copy the link below.');
  }

  function openCard() {
    const a = analyze(S, computeStats(S));
    const sets = [...setCounts(S)]
      .map(([id, n]) => ({ set: SETS.get(id), n }))
      .filter((x) => x.set && setTiers(x.set).some((t) => x.n >= t.pieces))
      .map((x) => `${x.n}pc ${x.set.name}`).join(' · ') || 'None active';
    const weapons = S.w.map((w) => getWeapon(w.id)).filter(Boolean).map((w) => w.name).join(' · ') || 'None';
    const os = OSP.get(S.os);
    const col = (k, v) => h('div', { class: 'cardx__col' }, h('span', { class: 'cardx__k' }, k), h('span', { class: 'cardx__v' }, v));
    $('#cardPreview').replaceChildren(h('div', { class: 'cardx' },
      h('span', { class: 'cardx__brand' }, 'Resurgence Builds · Build Planner'),
      h('p', { class: 'cardx__name' }, S.name || 'Untitled build'),
      h('span', { class: 'cardx__spec' }, S.spec ? `${S.spec} · ${S.focus}` : 'No specialization'),
      h('div', { class: 'cardx__row' },
        col('Gear sets', sets), col('Weapons', weapons), col('OS Protocol', os ? os.name : 'None'),
        h('div', { class: 'cardx__col cardx__score' }, h('span', { class: 'cardx__k' }, a.grade), h('b', null, String(a.score))))));
    openDialog($('#cardModal'), $('#cardModal .modal__x'));
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
  $('#cardBtn').addEventListener('click', openCard);
  $('#shareLinkField').addEventListener('focus', (e) => e.target.select());
  const nameInput = $('#buildNameInput');
  nameInput.addEventListener('input', () => {
    S.name = cleanName(nameInput.value);
    notice = '';
    renderTemplateBar();
    clearTimeout(urlTimer);
    urlTimer = setTimeout(writeUrl, 300);
  });
  $('#mobStatusGo').addEventListener('click', () => {
    const p = $('#checksPanel');
    p.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    p.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', () => {
    if (!isBuildHash(location.hash.slice(1)) && location.hash) return;
    clearTimeout(urlTimer);
    if (dialog) closeDialog(true);
    hideShareLink();
    loadFromLocation();
    renderAll();
  });

  /* ---------- start ---------- */
  loadFromLocation();
  renderAll();
  const rig = $('#gearPanel .rig');
  if (rig) rig.classList.add('is-active');
  lab.setAttribute('data-ready', '');
})();
