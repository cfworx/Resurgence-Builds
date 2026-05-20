/* Builder Engine — ResurgenceBuilds.com */
(function(){
  const DATA = JSON.parse(document.getElementById('builder-data').textContent);
  const {gearSets, weaponTalents, exoticWeapons, bodyArmorTalents, backpackTalents, osProtocols, skillModCombos} = DATA;

  const SPEC_OS_MAP = {
    'Demolitionist':'Engineering','Tech Operator':'Engineering',
    'Bulwark':'Toughness','Vanguard':'Firepower','Field Medic':'Toughness'
  };
  const GEAR_SLOTS = ['mask','gloves','holster','kneepads','body','backpack'];

  let state = {spec:null, slots:{}, weapon1:{exotic:'',talent:''}, weapon2:{exotic:'',talent:''}, os:'', smc:''};
  GEAR_SLOTS.forEach(s => state.slots[s] = {set:'',talent:'',attr1:'',attr2:''});

  function init(){
    document.getElementById('spec-picker').addEventListener('click', e => {
      const btn = e.target.closest('.spec-btn');
      if(!btn) return;
      document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.spec = btn.dataset.spec;
      populateOSDropdown();
      populateSMCDropdown();
      update();
    });

    GEAR_SLOTS.forEach(slot => {
      ['set','talent','attr1','attr2'].forEach(field => {
        const el = document.getElementById(`${field === 'set' ? 'set' : field === 'talent' ? 'talent' : field}-${slot}`);
        if(el) el.addEventListener('change', () => { state.slots[slot][field] = el.value; update(); });
      });
    });

    [1,2].forEach(n => {
      const exEl = document.getElementById(`exotic-w${n}`);
      const tEl = document.getElementById(`wtalent-w${n}`);
      exEl.addEventListener('change', () => {
        state[`weapon${n}`].exotic = exEl.value;
        if(exEl.value){
          const ex = exoticWeapons.find(e => e.id === exEl.value);
          if(ex){
            const matchT = weaponTalents.find(t => t.name === ex.talentName);
            if(matchT){ tEl.value = matchT.id; state[`weapon${n}`].talent = matchT.id; }
          }
          tEl.disabled = true;
        } else { tEl.disabled = false; }
        update();
      });
      tEl.addEventListener('change', () => { state[`weapon${n}`].talent = tEl.value; update(); });
    });

    document.getElementById('select-os').addEventListener('change', e => { state.os = e.target.value; showOSDetail(); update(); });
    document.getElementById('select-smc').addEventListener('change', e => { state.smc = e.target.value; showSMCDetail(); update(); });
    document.getElementById('btn-copy').addEventListener('click', copyLink);
    document.getElementById('btn-reset').addEventListener('click', resetBuild);

    loadFromURL();
  }

  function populateOSDropdown(){
    const sel = document.getElementById('select-os');
    const cat = SPEC_OS_MAP[state.spec] || '';
    const filtered = cat ? osProtocols.filter(p => p.specialization === cat) : [];
    sel.innerHTML = '<option value="">— Select OS Protocol —</option>';
    const rarityOrder = {'High-End':0,'Superior':1,'Specialized':2,'Standard':3};
    filtered.sort((a,b) => (rarityOrder[a.rarity]||9) - (rarityOrder[b.rarity]||9));
    filtered.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = `[${p.rarity}] ${p.name} — ${p.mainStat} ${p.mainValue}`;
      sel.appendChild(opt);
    });
    if(state.os && filtered.find(p => p.id === state.os)) sel.value = state.os;
    else { state.os = ''; }
    showOSDetail();
  }

  function populateSMCDropdown(){
    const sel = document.getElementById('select-smc');
    const filtered = state.spec ? skillModCombos.filter(s => s.specialization === state.spec) : [];
    sel.innerHTML = '<option value="">— Select Skill Mod Combo —</option>';
    filtered.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id; opt.textContent = s.name;
      sel.appendChild(opt);
    });
    if(state.smc && filtered.find(s => s.id === state.smc)) sel.value = state.smc;
    else { state.smc = ''; }
    showSMCDetail();
  }

  function showOSDetail(){
    const el = document.getElementById('os-detail');
    const badge = document.getElementById('badge-os');
    if(!state.os){ el.classList.remove('is-visible'); badge.className = 'slot-card__badge'; badge.textContent = ''; return; }
    const p = osProtocols.find(x => x.id === state.os);
    if(!p){ el.classList.remove('is-visible'); return; }
    el.innerHTML = `<strong>${p.name}</strong> <span style="opacity:.6">(${p.rarity})</span><br>${p.talentDescription}${p.cooldown ? '<br>Cooldown: '+p.cooldown : ''}<br><span style="opacity:.5">${p.attr1} ${p.val1} · ${p.attr2} ${p.val2} · ${p.attr3} ${p.val3}</span>`;
    el.classList.add('is-visible');
    const rc = p.rarity === 'High-End' ? 'rarity-high-end' : p.rarity === 'Superior' ? 'rarity-superior' : p.rarity === 'Specialized' ? 'rarity-specialized' : 'rarity-standard';
    badge.className = `slot-card__badge has-set ${rc}`; badge.textContent = p.rarity;
  }

  function showSMCDetail(){
    const el = document.getElementById('smc-detail');
    if(!state.smc){ el.classList.remove('is-visible'); return; }
    const s = skillModCombos.find(x => x.id === state.smc);
    if(!s){ el.classList.remove('is-visible'); return; }
    el.innerHTML = `<strong>${s.name}</strong><br><em>2pc:</em> ${s.bonus2}<br><em>3pc:</em> ${s.bonus3}`;
    el.classList.add('is-visible');
  }

  function countSets(){
    const counts = {};
    GEAR_SLOTS.forEach(slot => {
      const sid = state.slots[slot].set;
      if(sid){ counts[sid] = (counts[sid]||0) + 1; }
    });
    return counts;
  }

  function update(){
    updateBadges();
    renderSummary();
    updateURL();
  }

  function updateBadges(){
    const counts = countSets();
    GEAR_SLOTS.forEach(slot => {
      const badge = document.getElementById(`badge-${slot}`);
      const sid = state.slots[slot].set;
      if(!sid){ badge.className = 'slot-card__badge'; badge.textContent = ''; return; }
      const gs = gearSets.find(g => g.id === sid);
      const c = counts[sid] || 0;
      badge.textContent = `${c}pc ${gs ? gs.name : ''}`;
      badge.className = 'slot-card__badge has-set' + (c >= 4 ? ' full-bonus' : '');
    });
  }

  function renderSummary(){
    const counts = countSets();
    const hasAnything = Object.keys(counts).length > 0 || state.weapon1.talent || state.weapon2.talent || state.os || state.smc || state.spec;
    document.getElementById('summary-empty').style.display = hasAnything ? 'none' : 'block';

    // Set bonuses
    const setsEl = document.getElementById('summary-sets-list');
    const setsSection = document.getElementById('summary-sets');
    const setEntries = Object.entries(counts).filter(([,c]) => c >= 2);
    if(setEntries.length > 0){
      setsSection.style.display = 'block';
      setsEl.innerHTML = setEntries.map(([sid, c]) => {
        const gs = gearSets.find(g => g.id === sid);
        if(!gs) return '';
        let html = `<div class="summary-set-item tier-${Math.min(c,4)}"><span class="summary-set-name">${gs.name}</span> <span class="summary-set-count">${c}pc</span>`;
        html += `<div class="summary-set-bonus">2pc: ${gs.bonus2}</div>`;
        if(c >= 3) html += `<div class="summary-set-bonus">3pc: ${gs.bonus3}</div>`;
        if(c >= 4) html += `<div class="summary-set-bonus">4pc: ${gs.bonus4}</div>`;
        html += '</div>';
        return html;
      }).join('');
    } else { setsSection.style.display = 'none'; }

    // Single-piece warnings
    const singles = Object.entries(counts).filter(([,c]) => c === 1);

    // Talents
    const talentsEl = document.getElementById('summary-talents-list');
    const talentsSection = document.getElementById('summary-talents');
    let talentHTML = '';
    const bodyT = state.slots.body.talent ? bodyArmorTalents.find(t => t.id === state.slots.body.talent) : null;
    const bpT = state.slots.backpack.talent ? backpackTalents.find(t => t.id === state.slots.backpack.talent) : null;
    const w1T = state.weapon1.talent ? weaponTalents.find(t => t.id === state.weapon1.talent) : null;
    const w2T = state.weapon2.talent ? weaponTalents.find(t => t.id === state.weapon2.talent) : null;
    const w1E = state.weapon1.exotic ? exoticWeapons.find(e => e.id === state.weapon1.exotic) : null;
    const w2E = state.weapon2.exotic ? exoticWeapons.find(e => e.id === state.weapon2.exotic) : null;
    const osP = state.os ? osProtocols.find(p => p.id === state.os) : null;

    if(bodyT) talentHTML += `<div class="summary-talent-item"><strong>Body:</strong> ${bodyT.name}</div>`;
    if(bpT) talentHTML += `<div class="summary-talent-item"><strong>Pack:</strong> ${bpT.name}</div>`;
    if(w1E) talentHTML += `<div class="summary-talent-item"><strong>W1:</strong> ${w1E.name} (${w1E.talentName})</div>`;
    else if(w1T) talentHTML += `<div class="summary-talent-item"><strong>W1:</strong> ${w1T.name}</div>`;
    if(w2E) talentHTML += `<div class="summary-talent-item"><strong>W2:</strong> ${w2E.name} (${w2E.talentName})</div>`;
    else if(w2T) talentHTML += `<div class="summary-talent-item"><strong>W2:</strong> ${w2T.name}</div>`;
    if(osP) talentHTML += `<div class="summary-talent-item"><strong>OS:</strong> ${osP.name} (${osP.rarity})</div>`;

    if(talentHTML){ talentsSection.style.display = 'block'; talentsEl.innerHTML = talentHTML; }
    else { talentsSection.style.display = 'none'; }

    // Synergies & conflicts
    const synergies = [];
    const conflicts = [];
    detectSynergies(synergies, conflicts, counts, {bodyT, bpT, w1T, w2T, w1E, w2E, osP});

    const synEl = document.getElementById('summary-synergies-list');
    const synSection = document.getElementById('summary-synergies');
    if(synergies.length){ synSection.style.display = 'block'; synEl.innerHTML = synergies.map(s => `<div class="summary-synergy">${s}</div>`).join(''); }
    else { synSection.style.display = 'none'; }

    const conEl = document.getElementById('summary-conflicts-list');
    const conSection = document.getElementById('summary-conflicts');
    // Add single-piece warnings
    singles.forEach(([sid]) => {
      const gs = gearSets.find(g => g.id === sid);
      if(gs) conflicts.push(`<strong>${gs.name}</strong> has only 1 piece — no set bonus active. Add a 2nd piece or replace it.`);
    });
    if(conflicts.length){ conSection.style.display = 'block'; conEl.innerHTML = conflicts.map(c => `<div class="summary-conflict">${c}</div>`).join(''); }
    else { conSection.style.display = 'none'; }
  }

  function detectSynergies(syn, con, counts, talents){
    const allDescs = [];
    const {bodyT, bpT, w1T, w2T, w1E, w2E, osP} = talents;
    if(bodyT) allDescs.push({src:'Body: '+bodyT.name, d:bodyT.description});
    if(bpT) allDescs.push({src:'Backpack: '+bpT.name, d:bpT.description});
    if(w1E) allDescs.push({src:'W1: '+w1E.name, d:w1E.talentDescription});
    else if(w1T) allDescs.push({src:'W1: '+w1T.name, d:w1T.description});
    if(w2E) allDescs.push({src:'W2: '+w2E.name, d:w2E.talentDescription});
    else if(w2T) allDescs.push({src:'W2: '+w2T.name, d:w2T.description});
    if(osP) allDescs.push({src:'OS: '+osP.name, d:osP.talentDescription});

    // Collect active set bonus text
    const activeBonuses = [];
    Object.entries(counts).forEach(([sid,c]) => {
      if(c < 2) return;
      const gs = gearSets.find(g => g.id === sid);
      if(!gs) return;
      activeBonuses.push(gs.bonus2);
      if(c >= 3) activeBonuses.push(gs.bonus3);
      if(c >= 4) activeBonuses.push(gs.bonus4);
    });

    const allText = allDescs.map(x => x.d).join(' ') + ' ' + activeBonuses.join(' ');
    const allLower = allText.toLowerCase();

    // Stat stacking detection
    const statPatterns = [
      {key:'wdmg', pat:/weapon damage/gi, label:'Weapon Damage'},
      {key:'sdmg', pat:/skill damage/gi, label:'Skill Damage'},
      {key:'wchc', pat:/weapon critical hit chance|weapon crit/gi, label:'Weapon Crit Chance'},
      {key:'wchd', pat:/weapon critical hit damage/gi, label:'Weapon Crit Damage'},
      {key:'schc', pat:/skill critical (?:hit )?chance/gi, label:'Skill Crit Chance'},
      {key:'schd', pat:/skill critical (?:hit )?damage/gi, label:'Skill Crit Damage'},
      {key:'eng',  pat:/engineering/gi, label:'Engineering'},
      {key:'fp',   pat:/firepower/gi, label:'Firepower'},
      {key:'tough',pat:/toughness/gi, label:'Toughness'},
      {key:'dr',   pat:/damage reduction/gi, label:'Damage Reduction'},
      {key:'armor',pat:/armor/gi, label:'Armor'},
      {key:'heal', pat:/healing intensity|incoming healing|restore.*health/gi, label:'Healing'},
      {key:'cdr',  pat:/skill cooldown/gi, label:'Skill Cooldown'},
      {key:'move', pat:/movement speed/gi, label:'Movement Speed'},
      {key:'sace', pat:/signature ability charge/gi, label:'Signature Ability Charge'},
    ];

    const sources = {};
    statPatterns.forEach(sp => {
      sources[sp.key] = [];
      allDescs.forEach(item => {
        if(sp.pat.test(item.d)){ sp.pat.lastIndex = 0; sources[sp.key].push(item.src); }
      });
      activeBonuses.forEach((b,i) => {
        if(sp.pat.test(b)){ sp.pat.lastIndex = 0; sources[sp.key].push('Set Bonus'); }
      });
    });

    // Report synergies where 2+ sources stack the same stat
    const reported = new Set();
    statPatterns.forEach(sp => {
      const unique = [...new Set(sources[sp.key])];
      if(unique.length >= 2 && !reported.has(sp.key)){
        reported.add(sp.key);
        syn.push(`<strong>${sp.label} stacking</strong> — ${unique.length} sources: ${unique.join(', ')}`);
      }
    });

    // Crit pairing
    if(sources.wchc.length > 0 && sources.wchd.length > 0 && !reported.has('wcrit')){
      syn.push('<strong>Weapon Crit pairing</strong> — Crit Chance + Crit Damage sources active together.');
    }
    if(sources.schc.length > 0 && sources.schd.length > 0 && !reported.has('scrit')){
      syn.push('<strong>Skill Crit pairing</strong> — Skill Crit Chance + Skill Crit Damage sources active together.');
    }

    // Conflicts
    if(bodyT && bodyT.name === 'Glass Cannon'){
      // Check if there are survivability sources OTHER THAN Glass Cannon itself
      const survivalDescs = allDescs.filter(item => item.src !== 'Body: Glass Cannon');
      const survivalBonusText = survivalDescs.map(x => x.d).join(' ') + ' ' + activeBonuses.join(' ');
      const hasDR = /damage reduction/i.test(survivalBonusText);
      const hasArmor = /\barmor\b/i.test(survivalBonusText);
      const hasTough = /toughness/i.test(survivalBonusText);
      if(!hasDR && !hasArmor && !hasTough) con.push('<strong>Glass Cannon</strong> active with no Damage Reduction, Armor, or Toughness sources — extremely fragile build.');
    }

    // Mixed focus warning
    if(osP){
      const osIsEng = osP.specialization === 'Engineering';
      const osIsFP = osP.specialization === 'Firepower';
      const osIsTough = osP.specialization === 'Toughness';
      const fpSets = ['gs-1','gs-2','gs-3','gs-4','gs-5']; // weapon-focused sets
      const engSets = ['gs-7','gs-8','gs-10','gs-11','gs-12']; // skill-focused sets
      const hasFPSet = Object.keys(counts).some(sid => fpSets.includes(sid) && counts[sid] >= 2);
      const hasEngSet = Object.keys(counts).some(sid => engSets.includes(sid) && counts[sid] >= 2);
      if(osIsEng && hasFPSet && !hasEngSet) con.push('<strong>Mixed focus</strong> — Engineering OS Protocol with weapon-focused gear sets. Consider matching your OS to your gear set focus.');
      if(osIsFP && hasEngSet && !hasFPSet) con.push('<strong>Mixed focus</strong> — Firepower OS Protocol with skill-focused gear sets. Consider matching your OS to your gear set focus.');
    }
  }

  // URL Serialization (defined below with correct prefix mapping)

  function loadFromURL(){
    if(!location.hash || location.hash.length < 2) return;
    const p = new URLSearchParams(location.hash.slice(1));
    if(p.has('s')){
      state.spec = p.get('s');
      const btn = document.querySelector(`.spec-btn[data-spec="${state.spec}"]`);
      if(btn){ document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active')); btn.classList.add('is-active'); }
      populateOSDropdown();
      populateSMCDropdown();
    }
    // Gear slots use first char: m=mask, g=gloves, h=holster, k=kneepads, b=body/backpack
    // Handle body vs backpack collision on 'b' prefix
    const slotPrefixMap = {m:'mask',g:'gloves',h:'holster',k:'kneepads'};
    Object.entries(slotPrefixMap).forEach(([pre, slot]) => {
      if(p.has(pre+'s')){ state.slots[slot].set = p.get(pre+'s'); const el = document.getElementById(`set-${slot}`); if(el) el.value = state.slots[slot].set; }
      if(p.has(pre+'t')){ state.slots[slot].talent = p.get(pre+'t'); const el = document.getElementById(`talent-${slot}`); if(el) el.value = state.slots[slot].talent; }
      if(p.has(pre+'1')){ state.slots[slot].attr1 = p.get(pre+'1'); const el = document.getElementById(`attr1-${slot}`); if(el) el.value = state.slots[slot].attr1; }
      if(p.has(pre+'2')){ state.slots[slot].attr2 = p.get(pre+'2'); const el = document.getElementById(`attr2-${slot}`); if(el) el.value = state.slots[slot].attr2; }
    });
    // Body uses 'c' prefix (chest), backpack uses 'p' prefix (pack)
    [['c','body'],['p','backpack']].forEach(([pre, slot]) => {
      if(p.has(pre+'s')){ state.slots[slot].set = p.get(pre+'s'); const el = document.getElementById(`set-${slot}`); if(el) el.value = state.slots[slot].set; }
      if(p.has(pre+'t')){ state.slots[slot].talent = p.get(pre+'t'); const el = document.getElementById(`talent-${slot}`); if(el) el.value = state.slots[slot].talent; }
      if(p.has(pre+'1')){ state.slots[slot].attr1 = p.get(pre+'1'); const el = document.getElementById(`attr1-${slot}`); if(el) el.value = state.slots[slot].attr1; }
      if(p.has(pre+'2')){ state.slots[slot].attr2 = p.get(pre+'2'); const el = document.getElementById(`attr2-${slot}`); if(el) el.value = state.slots[slot].attr2; }
    });
    if(p.has('w1e')){ state.weapon1.exotic = p.get('w1e'); document.getElementById('exotic-w1').value = state.weapon1.exotic; document.getElementById('wtalent-w1').disabled = true; }
    if(p.has('w1t')){ state.weapon1.talent = p.get('w1t'); document.getElementById('wtalent-w1').value = state.weapon1.talent; }
    if(p.has('w2e')){ state.weapon2.exotic = p.get('w2e'); document.getElementById('exotic-w2').value = state.weapon2.exotic; document.getElementById('wtalent-w2').disabled = true; }
    if(p.has('w2t')){ state.weapon2.talent = p.get('w2t'); document.getElementById('wtalent-w2').value = state.weapon2.talent; }
    if(p.has('os')){ state.os = p.get('os'); document.getElementById('select-os').value = state.os; showOSDetail(); }
    if(p.has('smc')){ state.smc = p.get('smc'); document.getElementById('select-smc').value = state.smc; showSMCDetail(); }
    update();
  }

  function copyLink(){
    updateURL();
    const url = location.href;
    navigator.clipboard.writeText(url).then(() => {
      const toast = document.getElementById('copy-toast');
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = location.href; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      const toast = document.getElementById('copy-toast');
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2000);
    });
  }

  function resetBuild(){
    state = {spec:null, slots:{}, weapon1:{exotic:'',talent:''}, weapon2:{exotic:'',talent:''}, os:'', smc:''};
    GEAR_SLOTS.forEach(s => state.slots[s] = {set:'',talent:'',attr1:'',attr2:''});
    document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.slot-select').forEach(el => { el.value = ''; el.disabled = false; });
    document.getElementById('select-os').innerHTML = '<option value="">— Choose specialization first —</option>';
    document.getElementById('select-smc').innerHTML = '<option value="">— Choose specialization first —</option>';
    document.getElementById('os-detail').classList.remove('is-visible');
    document.getElementById('smc-detail').classList.remove('is-visible');
    document.getElementById('badge-os').className = 'slot-card__badge';
    history.replaceState(null, '', location.pathname);
    update();
  }

  function updateURL(){
    const p = new URLSearchParams();
    if(state.spec) p.set('s', state.spec);
    const prefixMap = {mask:'m',gloves:'g',holster:'h',kneepads:'k',body:'c',backpack:'p'};
    GEAR_SLOTS.forEach(slot => {
      const pre = prefixMap[slot];
      const sl = state.slots[slot];
      if(sl.set) p.set(pre + 's', sl.set);
      if(sl.talent) p.set(pre + 't', sl.talent);
      if(sl.attr1) p.set(pre + '1', sl.attr1);
      if(sl.attr2) p.set(pre + '2', sl.attr2);
    });
    if(state.weapon1.exotic) p.set('w1e', state.weapon1.exotic);
    if(state.weapon1.talent) p.set('w1t', state.weapon1.talent);
    if(state.weapon2.exotic) p.set('w2e', state.weapon2.exotic);
    if(state.weapon2.talent) p.set('w2t', state.weapon2.talent);
    if(state.os) p.set('os', state.os);
    if(state.smc) p.set('smc', state.smc);
    const hash = p.toString();
    if(hash) history.replaceState(null, '', '#' + hash);
    else history.replaceState(null, '', location.pathname);
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
