/* ============================================================
   SHD BUILD LAB v3 — Engine (adapted for Astro integration)
   Reads verified data from #builder-data JSON payload.
   ============================================================ */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Load verified data from Astro ---------- */
const DATA = JSON.parse(document.getElementById('builder-data').textContent);
const GAME = {
  gearSets: DATA.gearSets,
  weaponTalents: DATA.weaponTalents,
  bodyArmorTalents: DATA.bodyArmorTalents,
  backpackTalents: DATA.backpackTalents,
  osProtocols: DATA.osProtocols,
  skillModCombos: DATA.skillModCombos,
  standardWeapons: DATA.standardWeapons,
  exoticWeapons: DATA.exoticWeapons,
  templates: DATA.templates || [],
  specSubclasses: {
    'Demolitionist': ['HE Munitions', 'Field Grenadier'],
    'Tech Operator': ['Offensive Operations', 'Aegis Operations'],
    'Bulwark': ['Juggernaut', 'Breacher'],
    'Vanguard': ['Commando', 'Recon'],
    'Field Medic': ['Tactical Pharma', 'Combat Medicine']
  },
  specFocus: {
    'Demolitionist': 'Engineering', 'Tech Operator': 'Engineering',
    'Bulwark': 'Toughness', 'Vanguard': 'Firepower', 'Field Medic': 'Toughness'
  },
  /* Subclass overrides — more accurate than spec-level focus */
  subclassFocus: {
    'HE Munitions': 'Engineering', 'Ordinance': 'Engineering',
    'Offensive Operations': 'Engineering', 'Aegis Operations': 'Engineering',
    'Juggernaut': 'Toughness', 'Breacher': 'Firepower',
    'Commando': 'Firepower', 'Recon': 'Toughness',
    'Tactical Pharma': 'Engineering', 'Combat Medicine': 'Toughness'
  },
};

/* ---------- Spec icons (WebP from our verified assets) ---------- */
const SPEC_ICONS = {
  'Demolitionist': '<img src="/images/ui/specializations/demolitionist.webp" alt="Demolitionist specialization" class="sigil" width="32" height="32">',
  'Tech Operator': '<img src="/images/ui/specializations/tech-operator.webp" alt="Tech Operator specialization" class="sigil" width="32" height="32">',
  'Bulwark':       '<img src="/images/ui/specializations/bulwark.webp" alt="Bulwark specialization" class="sigil" width="32" height="32">',
  'Vanguard':      '<img src="/images/ui/specializations/vanguard.webp" alt="Vanguard specialization" class="sigil" width="32" height="32">',
  'Field Medic':   '<img src="/images/ui/specializations/field-medic.webp" alt="Field Medic specialization" class="sigil" width="32" height="32">',
};

/* ---------- Attribute category mapping ---------- */
const ATTR_CAT = {};
const ATTR_CATEGORIES = {
  'Firepower': ['Weapon Damage','Weapon Critical Hit Chance','Weapon Critical Hit Damage','Headshot Damage','Weapon Multi-Shot Chance','Rate of Fire','Magazine Size','Reload Speed','Accuracy','Stability','Optimal Range','Firepower'],
  'Toughness': ['Armor','Max Health','Damage Reduction','Received Healing','Movement Speed','Toughness','Damage Bonus'],
  'Engineering': ['Skill Damage','Skill Duration','Skill Cooldown Recovery','Skill Critical Chance','Skill Critical Damage','Skill Intensity','Skill Radius','Skill Health','Skill Multi-Shot Chance','Healing Intensity','Signature Ability Charge Efficiency','Engineering','Release Extra Protection']
};
Object.entries(ATTR_CATEGORIES).forEach(([cat, attrs]) => attrs.forEach(a => ATTR_CAT[a] = cat));
function catClass(attr) {
  const c = ATTR_CAT[attr];
  return c === 'Firepower' ? 'cat-fp' : c === 'Toughness' ? 'cat-tough' : c === 'Engineering' ? 'cat-eng' : 'cat-uni';
}

/* ---------- State: start empty ---------- */
let S = {
  name: '', spec: null, subclass: '',
  gear: { mask: {}, gloves: {}, holster: {}, body: {}, backpack: {}, kneepads: {} },
  w1: { id: '', t1: '', t2: '', tier: 'T2' },
  w2: { id: '', t1: '', t2: '', tier: 'T2' },
  os: '', skills: [null, null, null]
};

/* ====================== BOOT SEQUENCE ====================== */
(function boot() {
  const bootEl = $('#boot');
  if (!bootEl) { renderAll(true); return; }
  const steps = ['ESTABLISHING UPLINK', 'DECRYPTING SHD CACHE', 'LOADING AGENT PROFILE', 'TERMINAL ONLINE'];
  let i = 0;
  const st = $('#bootStatus');
  if (!st) { renderAll(true); return; }
  const tick = setInterval(() => { i++; if (steps[i]) st.textContent = steps[i]; }, 430);
  setTimeout(() => {
    clearInterval(tick);
    bootEl.classList.add('is-done');
    renderAll(true);
  }, 1850);
})();

/* ====================== RENDER: SPEC GRID ====================== */
function renderSpecs() {
  const specs = Object.keys(GAME.specSubclasses);
  const grid = $('#specGrid');
  if (!grid) return;
  grid.innerHTML = specs.map((sp, idx) => `
    <button class="spec-btn${sp === S.spec ? ' is-active' : ''}${idx === specs.length - 1 ? ' spec-btn--full' : ''}" data-spec="${sp}">
      ${SPEC_ICONS[sp]}<span class="nm">${sp}</span>
    </button>`).join('');
  $$('.spec-btn').forEach(b => b.addEventListener('click', () => {
    if (S.spec === b.dataset.spec) return;
    S.spec = b.dataset.spec;
    S.subclass = GAME.specSubclasses[S.spec][0];
    let dropped = 0;
    S.skills = S.skills.map(id => {
      const sm = skillMod(id);
      if (sm && sm.specialization !== S.spec) { dropped++; return null; }
      return id;
    });
    scanPulse();
    renderAll();
    if (dropped) toast(`${S.spec.toUpperCase()} SELECTED — ${dropped} INCOMPATIBLE SKILL MOD${dropped > 1 ? 'S' : ''} CLEARED`);
  }));
  const subLabel = $('#subLabel');
  if (subLabel) subLabel.textContent = S.subclass || '—';
}

/* ====================== HELPERS ====================== */
/* Returns the effective stat focus for the current build — subclass-level overrides spec-level */
function getEffectiveFocus() {
  return GAME.subclassFocus[S.subclass] || GAME.specFocus[S.spec] || '';
}
function gearSet(val) { return GAME.gearSets.find(g => g.name === val) || GAME.gearSets.find(g => g.id === val); }
function weapon(id) { return GAME.standardWeapons.find(w => w.id === id) || GAME.exoticWeapons.find(w => w.id === id); }
function osProto(id) { return GAME.osProtocols.find(o => o.id === id); }
function skillMod(id) { return GAME.skillModCombos.find(s => s.id === id); }
function setCounts() {
  const c = {};
  Object.values(S.gear).forEach(g => { if (g.set) c[g.set] = (c[g.set] || 0) + 1; });
  return c;
}

/* ====================== STAT MATH ====================== */
function parsePct(str) {
  if (!str) return 0;
  const m = String(str).match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}
function computeStats() {
  const totals = {};
  const add = (stat, v) => { totals[stat] = (totals[stat] || 0) + v; };
  const counts = setCounts();
  Object.entries(counts).forEach(([name, n]) => {
    const set = gearSet(name);
    if (!set) return;
    if (n >= 2 && set.bonus2) { const [s, v] = splitBonus(set.bonus2); add(s, v); }
    if (n >= 3 && set.bonus3) { const [s, v] = splitBonus(set.bonus3); add(s, v); }
    if (n >= 4 && set.bonus4) { const [s, v] = splitBonus(set.bonus4); add(s, v); }
  });
  Object.values(S.gear).forEach(g => {
    [g.b1, g.b2].forEach(a => { if (a) add(a, repRoll(a)); });
  });
  return totals;
}
function splitBonus(str) {
  const m = str.match(/^(.*?)\s*\+?([\d.]+)/);
  return m ? [m[1].trim(), parseFloat(m[2])] : [str, 0];
}
function repRoll(attr) {
  const cat = ATTR_CAT[attr];
  if (cat === 'Toughness') return attr === 'Max Health' ? 6 : attr === 'Armor' ? 8.5 : 4.2;
  if (cat === 'Firepower') return 5.5;
  if (cat === 'Engineering') return 7;
  return 5;
}

const HEAD_STATS = ['Max Health', 'Armor', 'Damage Reduction', 'Weapon Critical Hit Chance', 'Skill Duration', 'Received Healing', 'Signature Ability Charge Efficiency'];
let prevStats = {};

function renderStats(flash) {
  const t = computeStats();
  const statCatIcons = {
    'Firepower': '/images/ui/attributes/firepower.webp',
    'Toughness': '/images/ui/attributes/toughness.webp',
    'Engineering': '/images/ui/attributes/engineering.webp'
  };
  const rows = HEAD_STATS.map(stat => {
    const v = t[stat] || 0;
    const pv = prevStats[stat] || 0;
    const d = +(v - pv).toFixed(1);
    const changed = flash && Math.abs(d) > 0.05;
    const deltaHtml = changed ? `<span class="delta${d < 0 ? ' neg' : ''}">${d > 0 ? '+' : ''}${d}</span>` : '';
    const cat = ATTR_CAT[stat] || 'Engineering';
    const iconSrc = statCatIcons[cat] || statCatIcons['Engineering'];
    return `<div class="stat-row ${changed ? 'is-flash' : ''}">
      <span class="stat-row__lbl ${catClass(stat)}"><img src="${iconSrc}" alt="${cat}" width="14" height="14" class="stat-ico">${stat}</span>
      <span class="stat-row__val">${v ? '+' + v.toFixed(1) + '%' : '—'}${deltaHtml}</span>
    </div>`;
  }).join('');
  const el = $('#statList');
  if (el) el.innerHTML = rows;
  if (flash) setTimeout(() => $$('.stat-row').forEach(r => r.classList.remove('is-flash')), 700);
  prevStats = t;
}

/* ====================== SET BONUSES ====================== */
function renderBonuses() {
  const counts = setCounts();
  const active = Object.entries(counts).filter(([, n]) => n >= 2);
  const el = $('#bonusList');
  if (!el) return;
  if (!active.length) { el.innerHTML = '<p class="empty">No active set bonuses. Equip 2+ matching pieces.</p>'; return; }
  el.innerHTML = active.map(([name, n]) => {
    const set = gearSet(name); if (!set) return '';
    const lines = [];
    if (n >= 2 && set.bonus2) lines.push(set.bonus2);
    if (n >= 3 && set.bonus3) lines.push(set.bonus3);
    if (n >= 4 && set.bonus4) lines.push(set.bonus4);
    return `<div class="bonus">
      <div class="bonus__hd"><span class="bonus__nm">${name}</span><span class="bonus__pc">${Math.min(n,4)}PC</span></div>
      ${lines.map(l => `<div class="bonus__line">${l}</div>`).join('')}
    </div>`;
  }).join('');
}

/* ====================== ISAC DIAGNOSTICS ====================== */
function buildScore() {
  const counts = setCounts();
  const filledGear = Object.values(S.gear).filter(x => x.set).length;
  let completion = 0;
  completion += filledGear * 4;
  [S.w1, S.w2].forEach(w => { if (w.id) completion += 3; });
  if (S.os) completion += 4;
  completion += S.skills.filter(Boolean).length * 2;
  completion = Math.min(40, completion);

  let synergy = 0;
  Object.values(counts).forEach(n => {
    if (n >= 4) synergy += 24;
    else if (n === 3) synergy += 14;
    else if (n === 2) synergy += 8;
  });
  if (S.gear.body.talent) synergy += 5;
  if (S.gear.backpack.talent) synergy += 5;
  [S.w1, S.w2].forEach(w => { if (w.t1) synergy += 3; if (w.t2) synergy += 3; });
  const focus = GAME.specFocus[S.spec];
  const os = osProto(S.os);
  if (os && focus && (os.specialization === focus)) synergy += 4;
  synergy = Math.min(60, synergy);
  return Math.round(completion + synergy);
}

function renderISAC() {
  const score = buildScore();
  const rigScore = $('#rigScore');
  if (rigScore) rigScore.textContent = score || '—';
  const meter = $('#ratingMeter');
  if (meter) meter.style.width = score + '%';

  let grade, cls, mColor;
  if (score < 30) { grade = 'INCOMPLETE LOADOUT'; cls = 'g-incomplete'; mColor = 'linear-gradient(90deg,#5a6570,#8a96a2)'; }
  else if (score < 50) { grade = 'LOW SYNERGY'; cls = 'g-low'; mColor = 'linear-gradient(90deg,#e8631a,#ff5347)'; }
  else if (score < 70) { grade = 'OPERATIONAL'; cls = 'g-op'; mColor = 'linear-gradient(90deg,#e8631a,#ffc35e)'; }
  else if (score < 88) { grade = 'OPTIMIZED'; cls = 'g-opt'; mColor = 'linear-gradient(90deg,#52a8ff,#52e08a)'; }
  else { grade = 'ELITE SYNERGY'; cls = 'g-elite'; mColor = 'linear-gradient(90deg,#52e08a,#ffd84d)'; }
  const gradeEl = $('#ratingGrade');
  if (gradeEl) { gradeEl.textContent = grade; gradeEl.className = 'rating__grade ' + cls; }
  if (meter) meter.style.background = mColor;
  const isacEl = $('#isacText');
  if (isacEl) isacEl.innerHTML = isacAnalysis();
  renderDiagnostics();
}

function isacAnalysis() {
  const counts = setCounts();
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!S.spec) return 'Awaiting agent configuration. Select a specialization to initialize loadout diagnostics.';
  if (!top) return `<b>${S.spec} / ${S.subclass}</b> selected. Configure gear sets to begin loadout analysis.`;
  const focus = GAME.specFocus[S.spec];
  const stats = computeStats();
  const hasRH = (stats['Received Healing'] || 0) > 0;
  const hasDR = (stats['Damage Reduction'] || 0) > 0;
  let txt = `<b>${S.spec} / ${S.subclass}.</b> `;
  if (top[1] >= 4) txt += `${top[0]} 4-piece bonus active — build core is locked in. `;
  else if (top[1] >= 2) txt += `${top[0]} ${top[1]}-piece detected. `;
  if (hasRH && hasDR) txt += `Defensive synergy detected: incoming healing converts into sustained damage reduction. `;
  if (focus === 'Toughness' && (stats['Max Health'] || 0) > 10) txt += `Toughness-focused — survivability scaling is strong. `;
  if ((stats['Weapon Critical Hit Chance'] || 0) > 0 && !(stats['Weapon Critical Hit Damage'] || 0)) txt += `Note: Crit Chance present without Crit Damage to amplify it. `;
  return txt;
}

function renderDiagnostics() {
  const out = [];
  const counts = setCounts();
  Object.entries(counts).forEach(([name, n]) => {
    if (n === 1) out.push(['warn', `<b>${name}</b> has only 1 piece — no set bonus active. Add a 2nd piece or replace it.`]);
  });
  const stats = computeStats();
  if ((stats['Weapon Critical Hit Chance'] || 0) > 0 && !(stats['Weapon Critical Hit Damage'] || 0))
    out.push(['warn', `No <b>Weapon Crit Damage</b> source despite a Crit Chance roll — crit value is being wasted.`]);
  if ((stats['Received Healing'] || 0) > 0 && (stats['Damage Reduction'] || 0) > 0)
    out.push(['ok', `<b>Received Healing → Damage Reduction</b> loop is online. Strong sustain core.`]);
  const focus = getEffectiveFocus();
  const os = osProto(S.os);
  if (os && os.specialization && focus && os.specialization !== focus)
    out.push(['info', `OS Protocol scales with <b>${os.specialization}</b> but your subclass focus is <b>${focus}</b> — verify the stat investment lines up.`]);
  if (!out.length) out.push(['ok', `No conflicts detected. Loadout is internally consistent.`]);

  const ico = {
    warn: '<svg class="diag__ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 20h20z"/><path d="M12 9v5M12 17h.01"/></svg>',
    ok: '<svg class="diag__ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    info: '<svg class="diag__ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
  };
  const el = $('#diagList');
  if (el) el.innerHTML = out.map(([t, m]) => `<div class="diag diag--${t}">${ico[t]}<span class="diag__txt">${m}</span></div>`).join('');
}

/* ====================== RENDER: GEAR RIG ====================== */
function renderGear() {
  const counts = setCounts();
  let filled = 0;
  $$('.gearslot').forEach(el => {
    const slot = el.dataset.slot;
    const g = S.gear[slot];
    const valEl = el.querySelector('.gearslot__val');
    const txtEl = el.querySelector('.gearslot__txt');
    let attrEl = el.querySelector('.gearslot__attrs');
    if (g && g.set) {
      filled++;
      valEl.textContent = g.set;
      el.classList.add('is-set');
      el.classList.toggle('is-bonus', counts[g.set] >= 2);
      // Show abbreviated attributes inside the txt container
      const attrs = [g.b1, g.b2].filter(Boolean);
      if (attrs.length) {
        if (!attrEl) {
          attrEl = document.createElement('span');
          attrEl.className = 'gearslot__attrs';
          (txtEl || el).appendChild(attrEl);
        }
        attrEl.textContent = attrs.map(a => abbrevAttr(a)).join(' · ');
      } else if (attrEl) {
        attrEl.textContent = '';
      }
    } else {
      valEl.textContent = 'Empty';
      el.classList.remove('is-set', 'is-bonus');
      if (attrEl) attrEl.textContent = '';
    }
  });
  const gp = $('#gearPieces');
  if (gp) gp.textContent = `${filled} / 6 SLOTS`;
  const linked = Object.values(counts).some(n => n >= 2);
  const rig = $('#gearPanel .rig');
  if (rig) rig.classList.toggle('is-linked', linked);
}
/* Abbreviate long attribute names for compact gear slot display */
function abbrevAttr(a) {
  const map = {
    'Weapon Critical Hit Chance': 'CHC',
    'Weapon Critical Hit Damage': 'CHD',
    'Headshot Damage': 'HSD',
    'Weapon Damage': 'WD',
    'Weapon Multi-Shot Chance': 'Multi-Shot',
    'Max Health': 'Health',
    'Damage Reduction': 'DR',
    'Received Healing': 'Heal',
    'Skill Cooldown Recovery': 'CDR',
    'Skill Critical Chance': 'Skill CHC',
    'Skill Critical Damage': 'Skill CHD',
    'Skill Duration': 'Skill Dur',
    'Skill Intensity': 'Intensity',
    'Skill Multi-Shot Chance': 'Skill Multi',
    'Healing Intensity': 'Heal Int',
    'Signature Ability Charge Efficiency': 'Sig Charge',
    'Release Extra Protection': 'Extra Prot',
    'Magazine Size': 'Mag Size',
    'Reload Speed': 'Reload',
    'Optimal Range': 'Range',
    'Rate of Fire': 'RoF',
    'Movement Speed': 'Move Spd',
    'Damage Bonus': 'Dmg Bonus',
    'Skill Damage': 'Skill Dmg',
    'Skill Health': 'Skill HP',
    'Skill Radius': 'Skill Rad',
  };
  return map[a] || a;
}

/* ====================== RENDER: WEAPONS ====================== */
function renderWeapons() {
  [['1', S.w1], ['2', S.w2]].forEach(([k, w]) => {
    const wp = weapon(w.id);
    const isExotic = wp && GAME.exoticWeapons.some(e => e.id === wp.id);
    const exoticData = isExotic ? GAME.exoticWeapons.find(e => e.id === wp.id) : null;
    const nameEl = $(`#w${k}name`);
    const subEl = $(`#w${k}sub`);
    const tierEl = $(`#w${k}tier`);
    if (nameEl) nameEl.textContent = wp ? wp.name : `Select ${k === '1' ? 'Primary' : 'Secondary'}`;
    if (subEl) subEl.textContent = wp ? `${wp.type} · ${wp.rpm} RPM · ${wp.mag} mag` : '—';
    if (tierEl) tierEl.textContent = w.tier || 'T2';
    const slotEl = $(`.slot[data-wslot="${k}"]`);
    if (slotEl) {
      slotEl.classList.toggle('is-set', !!wp);
      slotEl.classList.toggle('is-exotic', isExotic);
    }
    // Exotic fixed talent
    const fixedEl = $(`#w${k}fixed`);
    if (fixedEl) {
      if (isExotic && exoticData) {
        fixedEl.style.display = '';
        const fixedName = fixedEl.querySelector('.picktag__val');
        if (fixedName) fixedName.textContent = exoticData.talentName;
        let fixedDesc = fixedEl.querySelector('.picktag__desc');
        if (!fixedDesc) { fixedDesc = document.createElement('span'); fixedDesc.className = 'picktag__desc'; fixedEl.appendChild(fixedDesc); }
        fixedDesc.textContent = exoticData.talentDescription;
        fixedEl.classList.add('is-set', 'is-fixed');
      } else {
        fixedEl.style.display = 'none';
      }
    }
    setTalent(`w${k}t1`, w.t1);
    setTalent(`w${k}t2`, w.t2);
  });
}
function setTalent(key, val) {
  const el = $(`.picktag[data-talent="${key}"]`);
  if (!el) return;
  el.querySelector('.picktag__val').textContent = val || '—';
  el.classList.toggle('is-set', !!val);
  // Show talent description
  let descEl = el.querySelector('.picktag__desc');
  if (val) {
    const talent = GAME.weaponTalents.find(t => t.name === val);
    if (talent && talent.description) {
      if (!descEl) {
        descEl = document.createElement('span');
        descEl.className = 'picktag__desc';
        el.appendChild(descEl);
      }
      descEl.textContent = talent.description;
    }
  } else if (descEl) {
    descEl.remove();
  }
}

/* ====================== RENDER: OS + SKILLS ====================== */
function renderOS() {
  const os = osProto(S.os);
  const nameEl = $('#osName');
  const subEl = $('#osSub');
  const slotEl = $('#osSlot');
  const focusTag = $('#osFocusTag');
  if (nameEl) nameEl.textContent = os ? os.name : 'Select OS Protocol';
  if (subEl) subEl.textContent = os ? `${os.specialization} · ${os.mainStat} ${os.mainValue}` : 'Choose a protocol matched to your focus';
  if (slotEl) slotEl.classList.toggle('is-set', !!os);
  if (focusTag) {
    const label = os ? os.specialization : (GAME.specFocus[S.spec] || 'SELECT SPEC');
    focusTag.textContent = label.toUpperCase();
    // Color the tag based on focus
    focusTag.className = 'tag';
    if (os) {
      if (os.specialization === 'Firepower') focusTag.classList.add('tag--red');
      else if (os.specialization === 'Toughness') focusTag.classList.add('tag--blue');
      else if (os.specialization === 'Engineering') focusTag.classList.add('tag--purple');
    } else {
      focusTag.classList.add('tag--blue');
    }
  }
}

function renderSkills() {
  const el = $('#skillList');
  if (!el) return;
  if (!S.spec) {
    el.innerHTML = '<div class="skill-slot"><span class="skill-slot__n">—</span><div class="skill-slot__txt"><span class="skill-slot__nm">Choose spec first</span><span class="skill-slot__sub">Skill mods are specialization-locked</span></div></div>';
    const countEl = $('#skillCount');
    if (countEl) countEl.textContent = '0 / 3';
    return;
  }
  const html = [0, 1, 2].map(i => {
    const sm = skillMod(S.skills[i]);
    return `<div class="skill-slot${sm ? ' is-set' : ''}" data-skill="${i}">
      <span class="skill-slot__n">${i + 1}</span>
      <div class="skill-slot__txt">
        <span class="skill-slot__nm">${sm ? sm.name : 'Select Skill Mod'}</span>
        <span class="skill-slot__sub">${sm ? sm.specialization + ' · ' + (sm.bonus2 || '') : '—'}</span>
        ${sm && sm.bonus3 ? `<span class="skill-slot__desc">${sm.bonus3}</span>` : ''}
      </div>
    </div>`;
  }).join('');
  el.innerHTML = html;
  const countEl = $('#skillCount');
  if (countEl) countEl.textContent = `${S.skills.filter(Boolean).length} / 3`;
  $$('.skill-slot').forEach(el => el.addEventListener('click', () => {
    if (!S.spec) return;
    openSkillPicker(+el.dataset.skill);
  }));
}

/* ====================== ARMOR TALENTS ====================== */
function renderArmorTalents() {
  const b = S.gear.body.talent, k = S.gear.backpack.talent;
  const bEl = $('#bodyTalentVal'), kEl = $('#backTalentVal');
  if (bEl) bEl.textContent = b || 'Select talent';
  if (kEl) kEl.textContent = k || 'Select talent';
  const bodyTag = $('.picktag[data-armortalent="body"]');
  const bpTag = $('.picktag[data-armortalent="backpack"]');
  if (bodyTag) {
    bodyTag.classList.toggle('is-set', !!b);
    setArmorTalentDesc(bodyTag, b, GAME.bodyArmorTalents);
  }
  if (bpTag) {
    bpTag.classList.toggle('is-set', !!k);
    setArmorTalentDesc(bpTag, k, GAME.backpackTalents);
  }
}
function setArmorTalentDesc(el, name, pool) {
  let descEl = el.querySelector('.picktag__desc');
  if (name) {
    const t = pool.find(x => x.name === name);
    if (t && t.description) {
      if (!descEl) { descEl = document.createElement('span'); descEl.className = 'picktag__desc'; el.appendChild(descEl); }
      descEl.textContent = t.description;
    }
  } else if (descEl) { descEl.remove(); }
}

/* ====================== SYNERGY MAP + LOOP ====================== */
function renderLoop() {
  const counts = setCounts();
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const bt = S.gear.body.talent, kt = S.gear.backpack.talent;
  const nodes = [];
  if (top && top[1] >= 2) nodes.push(`<div class="loop__node"><b>${top[0]}</b> <span class="arrow">→</span> Set Bonus Active (${Math.min(top[1],4)}pc)</div>`);
  if (kt) nodes.push(`<div class="loop__node"><b>${kt}</b> <span class="arrow">→</span> Backpack talent synergy</div>`);
  if (bt) nodes.push(`<div class="loop__node"><b>${bt}</b> <span class="arrow">→</span> Body armor talent synergy</div>`);
  const os = osProto(S.os);
  if (os) nodes.push(`<div class="loop__node"><b>${os.name}</b> <span class="arrow">→</span> ${os.specialization} focus</div>`);
  if (!nodes.length) nodes.push('<div class="loop__node">Equip gear to map synergies.</div>');
  const graphEl = $('#loopGraph');
  if (graphEl) graphEl.innerHTML = nodes.join('');

  // Dynamic gameplay loop based on spec
  const steps = [];
  if (S.spec) {
    const focus = GAME.specFocus[S.spec];
    if (focus === 'Toughness') {
      steps.push('Anchor the fight with defensive positioning and sustain.');
      steps.push('Trigger Extra Health and damage reduction windows through talents.');
      steps.push('Maintain incoming healing loops to keep armor topped.');
    } else if (focus === 'Firepower') {
      steps.push('Maximize weapon uptime through reload and rate of fire bonuses.');
      steps.push('Chain critical hits to trigger damage amplification talents.');
      steps.push('Use cover transitions to maintain optimal range.');
    } else if (focus === 'Engineering') {
      steps.push('Deploy skills early to activate Engineering scaling.');
      steps.push('Chain skill crits into cooldown reduction for sustained pressure.');
      steps.push('Position to maximize skill radius and duration coverage.');
    }
    steps.push('Use OS Protocol windows to amplify your core stat loop.');
    steps.push('Coordinate signature ability timing with team for maximum impact.');
  }
  const stepsEl = $('#loopSteps');
  if (stepsEl) stepsEl.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
}

/* ====================== MASTER RENDER ====================== */
function renderAll(initial) {
  renderSpecs();
  renderGear();
  renderArmorTalents();
  renderWeapons();
  renderOS();
  renderSkills();
  renderBonuses();
  renderLoop();
  renderStats(!initial);
  renderISAC();
  const tplLabel = $('#tplLabel');
  if (tplLabel) tplLabel.textContent = S.name ? `${S.name} — ${S.spec} ${S.subclass}` : 'Select a verified template…';
  // Sync build name input
  const nameInput = $('#buildNameInput');
  if (nameInput && nameInput !== document.activeElement) nameInput.value = S.name || '';
  if (initial) {
    const rig = $('#gearPanel .rig');
    if (rig) rig.classList.add('is-active');
  }
}

/* ====================== MICRO-INTERACTIONS ====================== */
function scanPulse() {
  const rig = $('#gearPanel .rig');
  if (!rig) return;
  rig.classList.remove('is-active'); void rig.offsetWidth; rig.classList.add('is-active');
}
function flashSlot(el) {
  if (!el) return;
  el.style.transition = 'none'; el.style.boxShadow = '0 0 0 1px var(--amber),0 0 20px rgba(255,195,94,.4)';
  setTimeout(() => { el.style.transition = ''; el.style.boxShadow = ''; }, 300);
}

/* ====================== PICKER MODAL ====================== */
const modal = $('#modal'), modalList = $('#modalList'), modalSearch = $('#modalSearch'), modalTitle = $('#modalTitle');
let modalData = [], modalRender = null, modalSelect = null, modalCurrent = null;

function openModal(title, items, renderFn, selectFn, current) {
  modalTitle.textContent = '// ' + title;
  modalData = items; modalRender = renderFn; modalSelect = selectFn; modalCurrent = current;
  modalSearch.value = '';
  drawModal('');
  modal.classList.add('is-open');
  setTimeout(() => modalSearch.focus(), 50);
}
function closeModal() { modal.classList.remove('is-open'); }
function drawModal(q) {
  q = q.toLowerCase();
  const items = modalData.filter(it => {
    const r = modalRender(it);
    return ((r.name || '') + ' ' + (r.type || '') + ' ' + (r.desc || '')).toLowerCase().includes(q);
  });
  if (!items.length) { modalList.innerHTML = '<div class="opt-empty">No matches found.</div>'; return; }
  modalList.innerHTML = items.map(it => {
    const r = modalRender(it);
    const cur = modalCurrent && r.id === modalCurrent ? ' is-current' : '';
    return `<button class="opt${cur}" data-id="${r.id}">
      <div class="opt__top"><span class="opt__nm">${r.name}</span>${r.type ? `<span class="opt__type">${r.type}</span>` : ''}</div>
      ${r.desc ? `<div class="opt__desc">${highlight(r.desc, q)}</div>` : ''}
    </button>`;
  }).join('');
  $$('.opt', modalList).forEach(b => b.addEventListener('click', () => { closeModal(); setTimeout(() => modalSelect(b.dataset.id), 60); }));
}
function highlight(text, q) {
  if (!q) return text;
  try { return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<span class="stat-hit">$1</span>'); }
  catch { return text; }
}
modalSearch.addEventListener('input', e => drawModal(e.target.value));
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); const cm = $('#cardModal'); if (cm) cm.classList.remove('is-open'); } });

/* ---------- Specific pickers ---------- */
function openGearPicker(slot) {
  openModal('SELECT GEAR SET — ' + slot.toUpperCase(),
    GAME.gearSets,
    g => ({ id: g.name, name: g.name, type: 'Gear Set', desc: `2pc: ${g.bonus2} · 4pc: ${g.bonus4}` }),
    name => {
      S.gear[slot].set = name;
      // Now pick attribute 1
      openAttrPicker(slot, 1);
    },
    S.gear[slot].set);
}
/* All available minor attributes a player can roll on gear */
const ALL_ATTRS = [
  ...ATTR_CATEGORIES['Firepower'],
  ...ATTR_CATEGORIES['Toughness'],
  ...ATTR_CATEGORIES['Engineering']
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

function openAttrPicker(slot, num) {
  const items = ALL_ATTRS.map(a => ({ id: a, name: a, cat: ATTR_CAT[a] }));
  openModal(`${slot.toUpperCase()} — ATTRIBUTE ${num}`,
    items,
    a => ({ id: a.id, name: a.name, type: a.cat, desc: '' }),
    attr => {
      S.gear[slot]['b' + num] = attr;
      if (num === 1) {
        // Pick attribute 2
        openAttrPicker(slot, 2);
      } else {
        afterChange($('.gearslot[data-slot="' + slot + '"]'));
      }
    },
    S.gear[slot]['b' + num]);
}
function openTalentPicker(slot, isBody) {
  const pool = isBody ? GAME.bodyArmorTalents : GAME.backpackTalents;
  openModal((isBody ? 'BODY' : 'BACKPACK') + ' TALENT',
    pool,
    t => ({ id: t.name, name: t.name, type: 'Talent', desc: t.description }),
    name => { S.gear[slot].talent = name; afterChange(); },
    S.gear[slot].talent);
}
function openWeaponPicker(k) {
  const items = [...GAME.exoticWeapons.map(w => ({ ...w, exotic: true })), ...GAME.standardWeapons];
  openModal('SELECT WEAPON ' + (k === '1' ? '(PRIMARY)' : '(SECONDARY)'),
    items,
    w => ({ id: w.id, name: w.name, type: w.exotic ? 'EXOTIC · ' + w.type : w.type, desc: w.exotic ? w.talentDescription : `${w.rpm} RPM · ${w.mag} mag · ${w.dmgType || ''}` }),
    id => {
      // Exotic restriction: can't equip 2 exotics
      const isExotic = GAME.exoticWeapons.some(e => e.id === id);
      const otherKey = k === '1' ? 'w2' : 'w1';
      const otherIsExotic = GAME.exoticWeapons.some(e => e.id === S[otherKey].id);
      if (isExotic && otherIsExotic) {
        S[otherKey] = { id: '', t1: '', t2: '', tier: 'T2' };
        toast('EXOTIC RESTRICTION: Only 1 exotic weapon permitted. Other slot cleared.');
      }
      S['w' + k].id = id;
      afterChange($(`.slot[data-wslot="${k}"]`));
    },
    S['w' + k].id);
}
function openWTalentPicker(key) {
  openModal('WEAPON TALENT',
    GAME.weaponTalents,
    t => ({ id: t.name, name: t.name, type: 'Talent', desc: t.description }),
    name => {
      const k = key[1]; const slot = key.endsWith('t1') ? 't1' : 't2';
      S['w' + k][slot] = name; afterChange();
    },
    (() => { const k = key[1]; const slot = key.endsWith('t1') ? 't1' : 't2'; return S['w' + k][slot]; })());
}
function openOSPicker() {
  // Sort: recommended focus first
  const focus = GAME.specFocus[S.spec] || '';
  const sorted = [...GAME.osProtocols].sort((a, b) => {
    const aRec = a.specialization === focus ? 0 : 1;
    const bRec = b.specialization === focus ? 0 : 1;
    return aRec - bRec;
  });
  openModal('SELECT OS PROTOCOL',
    sorted,
    o => ({ id: o.id, name: o.name, type: o.specialization + (o.specialization === focus ? ' ★' : ''), desc: `${o.mainStat} ${o.mainValue} — ${o.talentDescription}` }),
    id => { S.os = id; afterChange($('#osSlot')); },
    S.os);
}
function openSkillPicker(idx) {
  if (!S.spec) return;
  const pool = GAME.skillModCombos.filter(s => s.specialization === S.spec);
  openModal('SELECT SKILL MOD ' + (idx + 1) + ' — ' + S.spec.toUpperCase(),
    pool,
    s => ({ id: s.id, name: s.name, type: s.specialization, desc: `${s.bonus2} · ${s.bonus3}` }),
    id => { S.skills[idx] = id; afterChange(); },
    S.skills[idx]);
}

function afterChange(flashEl) {
  flashSlot(flashEl);
  renderAll();
}

/* ====================== WIRE UP CLICKS ====================== */
function wire() {
  $$('.gearslot').forEach(el => el.addEventListener('click', () => openGearPicker(el.dataset.slot)));
  const subBtn = $('#subBtn');
  if (subBtn) subBtn.addEventListener('click', () => {
    if (!S.spec) return;
    openModal('SPECIALIZATION FOCUS',
      GAME.specSubclasses[S.spec].map(n => ({ n })),
      x => ({ id: x.n, name: x.n, type: GAME.specFocus[S.spec], desc: '' }),
      n => { S.subclass = n; renderAll(); },
      S.subclass);
  });
  const tplBtn = $('#tplBtn');
  if (tplBtn) tplBtn.addEventListener('click', () => {
    const items = [{ k: 'reset', n: 'Empty Loadout', d: 'Start from a blank agent profile.' }];
    // Add verified build templates from Astro
    GAME.templates.forEach(t => {
      items.push({ k: 'tpl:' + t.hash, n: t.name, d: t.spec + ' build template' });
    });
    openModal('LOADOUT TEMPLATE',
      items,
      x => ({ id: x.k, name: x.n, type: 'Template', desc: x.d }),
      k => {
        if (k === 'reset') { clearBuild(); }
        else if (k.startsWith('tpl:')) {
          // Load from template hash
          clearBuild();
          const hash = k.substring(4);
          // Set hash with # prefix if needed
          location.hash = hash.startsWith('#') ? hash : '#' + hash;
          loadFromHash();
        }
        scanPulse(); renderAll();
      },
      null);
  });
  $$('.slot[data-wslot]').forEach(el => el.addEventListener('click', () => openWeaponPicker(el.dataset.wslot)));
  $$('.picktag[data-talent]').forEach(el => el.addEventListener('click', () => openWTalentPicker(el.dataset.talent)));
  const bodyTalent = $('.picktag[data-armortalent="body"]');
  const bpTalent = $('.picktag[data-armortalent="backpack"]');
  if (bodyTalent) bodyTalent.addEventListener('click', () => openTalentPicker('body', true));
  if (bpTalent) bpTalent.addEventListener('click', () => openTalentPicker('backpack', false));
  const osSlot = $('#osSlot');
  if (osSlot) osSlot.addEventListener('click', openOSPicker);
  const resetBtn = $('#resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => { clearBuild(); scanPulse(); renderAll(); });
  const shareBtn = $('#shareBtn');
  if (shareBtn) shareBtn.addEventListener('click', shareBuild);
  const topShare = $('#topShare');
  if (topShare) topShare.addEventListener('click', shareBuild);
  const cardBtn = $('#cardBtn');
  if (cardBtn) cardBtn.addEventListener('click', openCard);
  const cardClose = $('#cardClose');
  if (cardClose) cardClose.addEventListener('click', () => { const cm = $('#cardModal'); if (cm) cm.classList.remove('is-open'); });
  const cardModal = $('#cardModal');
  if (cardModal) cardModal.addEventListener('click', e => { if (e.target === cardModal) cardModal.classList.remove('is-open'); });
  // Build name input
  const nameInput = $('#buildNameInput');
  if (nameInput) nameInput.addEventListener('input', () => { S.name = nameInput.value; });
}

function clearBuild() {
  S = { name: '', spec: null, subclass: '',
    gear: { mask: {}, gloves: {}, holster: {}, body: {}, backpack: {}, kneepads: {} },
    w1: { id: '', t1: '', t2: '', tier: 'T2' }, w2: { id: '', t1: '', t2: '', tier: 'T2' },
    os: '', skills: [null, null, null] };
  prevStats = {};
}

/* ====================== SHARE + CARD ====================== */
/* Hash key mapping matching the production builder:
   m=mask, g=gloves, h=holster, c=chest(body), p=pack(backpack), k=kneepads
   suffix: s=set(id), t=talent(name), 1=attr1, 2=attr2 */
const SLOT_KEYS = {
  mask: 'm', gloves: 'g', holster: 'h', body: 'c', backpack: 'p', kneepads: 'k'
};
const KEY_SLOTS = {};
Object.entries(SLOT_KEYS).forEach(([slot, key]) => KEY_SLOTS[key] = slot);

function gearSetById(id) { return GAME.gearSets.find(g => g.id === id); }
function gearSetByName(name) { return GAME.gearSets.find(g => g.name === name); }
function weaponById(id) { return GAME.standardWeapons.find(w => w.id === id) || GAME.exoticWeapons.find(w => w.id === id); }
function osById(id) { return GAME.osProtocols.find(o => o.id === id); }
function skillModById(id) { return GAME.skillModCombos.find(s => s.id === id); }

/* Resolve: if value looks like an ID (e.g. "gs-14"), resolve to name; otherwise keep name */
function resolveGearSet(val) {
  if (!val) return '';
  // Try as ID first
  const byId = gearSetById(val);
  if (byId) return byId.name;
  // Try as name
  const byName = gearSetByName(val);
  if (byName) return val;
  return val;
}
function resolveBodyTalent(val) {
  if (!val) return '';
  const byId = GAME.bodyArmorTalents.find(t => t.id === val);
  return byId ? byId.name : val;
}
function resolveBackpackTalent(val) {
  if (!val) return '';
  const byId = GAME.backpackTalents.find(t => t.id === val);
  return byId ? byId.name : val;
}
function resolveWeaponTalent(val) {
  if (!val) return '';
  const byId = GAME.weaponTalents.find(t => t.id === val);
  return byId ? byId.name : val;
}
function resolveWeapon(val) {
  if (!val) return '';
  const w = weaponById(val);
  if (w) return val;
  // Try exotic weapons too
  const ew = GAME.exoticWeapons.find(x => x.id === val);
  return ew ? val : '';
}
function resolveOS(val) {
  if (!val) return '';
  const o = osById(val);
  return o ? val : ''; // OS uses IDs natively
}
function resolveSkillMod(val) {
  if (!val) return null;
  const s = skillModById(val);
  return s ? val : null;
}

function buildHash() {
  const p = new URLSearchParams();
  if (S.spec) p.set('s', S.spec);
  if (S.subclass) p.set('sc', S.subclass);
  if (S.name) p.set('n', S.name);
  Object.entries(S.gear).forEach(([slot, g]) => {
    const key = SLOT_KEYS[slot];
    if (g.set) {
      const gs = gearSetByName(g.set);
      p.set(key + 's', gs ? gs.id : g.set);
    }
    if (g.talent) {
      const pool = slot === 'body' ? GAME.bodyArmorTalents : GAME.backpackTalents;
      const t = pool.find(x => x.name === g.talent);
      p.set(key + 't', t ? t.id : g.talent);
    }
    if (g.b1) p.set(key + '1', g.b1);
    if (g.b2) p.set(key + '2', g.b2);
  });
  // Weapons: w1s=standard weapon, w1e=exotic weapon, w1t=talent1, w1t2=talent2, w1tr=tier
  [['1', S.w1], ['2', S.w2]].forEach(([n, w]) => {
    if (!w.id) return;
    const isExotic = GAME.exoticWeapons.some(x => x.id === w.id);
    p.set(`w${n}${isExotic ? 'e' : 's'}`, w.id);
    if (w.tier) p.set(`w${n}tr`, w.tier);
    if (w.t1) {
      const t = GAME.weaponTalents.find(x => x.name === w.t1);
      p.set(`w${n}t`, t ? t.id : w.t1);
    }
    if (w.t2) {
      const t = GAME.weaponTalents.find(x => x.name === w.t2);
      p.set(`w${n}t2`, t ? t.id : w.t2);
    }
  });
  if (S.os) p.set('os', S.os);
  S.skills.forEach((sm, i) => { if (sm) p.set('sm' + (i + 1), sm); });
  return '#' + p.toString();
}

function loadFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return false;
  const p = new URLSearchParams(hash);
  if (!p.get('s')) return false;

  // Always start fresh
  clearBuild();

  S.spec = p.get('s');
  S.subclass = p.get('sc') || GAME.specSubclasses[S.spec]?.[0] || '';
  S.name = p.get('n') || '';

  // Gear slots: m=mask, g=gloves, h=holster, c=body(chest), p=backpack(pack), k=kneepads
  Object.entries(KEY_SLOTS).forEach(([key, slot]) => {
    const setVal = p.get(key + 's');
    if (setVal) {
      const talentKey = key + 't';
      const isBody = slot === 'body';
      const talent = p.get(talentKey) || '';
      S.gear[slot] = {
        set: resolveGearSet(setVal),
        talent: isBody ? resolveBodyTalent(talent) : (slot === 'backpack' ? resolveBackpackTalent(talent) : ''),
        b1: p.get(key + '1') || '',
        b2: p.get(key + '2') || ''
      };
    }
  });

  // Weapons: w1s=standard, w1e=exotic, w1t=talent1, w1t2=talent2, w1tr=tier
  ['1', '2'].forEach(n => {
    const wId = resolveWeapon(p.get(`w${n}s`) || '') || resolveWeapon(p.get(`w${n}e`) || '');
    S[`w${n}`] = {
      id: wId,
      t1: resolveWeaponTalent(p.get(`w${n}t`) || ''),
      t2: resolveWeaponTalent(p.get(`w${n}t2`) || ''),
      tier: p.get(`w${n}tr`) || 'T2'
    };
  });

  // OS + Skills
  S.os = resolveOS(p.get('os') || '');
  S.skills = [
    resolveSkillMod(p.get('sm1')),
    resolveSkillMod(p.get('sm2')),
    resolveSkillMod(p.get('sm3'))
  ];

  return true;
}

function shareBuild() {
  const url = location.origin + location.pathname + buildHash();
  navigator.clipboard?.writeText(url).catch(() => {});
  toast('TRANSMISSION PACKAGED — LINK COPIED');
}

function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('is-show');
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove('is-show'), 2400);
}

function openCard() {
  const counts = setCounts();
  const sets = Object.entries(counts).filter(([, n]) => n >= 2).map(([n, c]) => `${Math.min(c,4)}× ${n}`).join('  ·  ') || 'No active sets';
  const w1 = weapon(S.w1.id), w2 = weapon(S.w2.id), os = osProto(S.os);
  const score = buildScore();
  const gradeEl = $('#ratingGrade');
  const grade = gradeEl ? gradeEl.textContent : '';
  const preview = $('#cardPreview');
  if (preview) preview.innerHTML = `<div class="cardx">
    <span class="cardx__brand">// ResurgenceBuilds · SHD Build Lab</span>
    <h3 class="cardx__name">${S.name || 'Untitled Loadout'}</h3>
    <span class="cardx__spec">${S.spec || 'No Spec'} · ${S.subclass || ''}</span>
    <div class="cardx__row">
      <div class="cardx__col"><span class="cardx__k">Gear Sets</span><span class="cardx__v">${sets}</span></div>
      <div class="cardx__col"><span class="cardx__k">Weapons</span><span class="cardx__v">${(w1?w1.name:'—')} · ${(w2?w2.name:'—')}</span></div>
      <div class="cardx__col"><span class="cardx__k">OS Protocol</span><span class="cardx__v">${os?os.name:'—'}</span></div>
      <div class="cardx__col cardx__score"><span class="cardx__k">${grade}</span><b>${score}</b></div>
    </div>
  </div>`;
  const cm = $('#cardModal');
  if (cm) cm.classList.add('is-open');
}

/* ====================== INIT ====================== */
// Load from URL hash if present
loadFromHash();
wire();
