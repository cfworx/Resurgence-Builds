/* Builder Engine — ResurgenceBuilds.com */
(function(){
  const DATA = JSON.parse(document.getElementById('builder-data').textContent);
  const {gearSets, weaponTalents, exoticWeapons, standardWeapons, bodyArmorTalents, backpackTalents, osProtocols, skillModCombos} = DATA;

  const SPEC_OS_MAP = {
    'Demolitionist':'Engineering','Tech Operator':'Engineering',
    'Bulwark':'Toughness','Vanguard':'Firepower','Field Medic':'Toughness'
  };
  const SPEC_SUBCLASSES = {
    'Demolitionist': ['HE Munitions', 'Field Grenadier'],
    'Tech Operator': ['Offensive Operations', 'Aegis Operations'],
    'Bulwark': ['Juggernaut', 'Breacher'],
    'Vanguard': ['Commando', 'Recon'],
    'Field Medic': ['Tactical Pharma', 'Combat Medicine']
  };
  const GEAR_SLOTS = ['mask','gloves','holster','kneepads','body','backpack'];

  let state = {spec:null, subclass:'', slots:{}, weapon1:{id:'',tier:'T2',talent:'',talent2:''}, weapon2:{id:'',tier:'T2',talent:'',talent2:''}, os:'', smc1:'', smc2:'', smc3:'', buildName:''};
  GEAR_SLOTS.forEach(s => state.slots[s] = {set:'',talent:'',attr1:'',attr2:''});

  function init(){
    document.getElementById('spec-picker').addEventListener('click', e => {
      const btn = e.target.closest('.spec-btn');
      if(!btn) return;
      document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.spec = btn.dataset.spec;
      populateOSDropdown();
      populateSubclassDropdown();
      populateSMCDropdowns();
      update();
    });

    GEAR_SLOTS.forEach(slot => {
      ['set','talent','attr1','attr2'].forEach(field => {
        const el = document.getElementById(`${field === 'set' ? 'set' : field === 'talent' ? 'talent' : field}-${slot}`);
        if(el) el.addEventListener('change', () => { state.slots[slot][field] = el.value; update(); });
      });
    });

    [1,2].forEach(n => {
      const wEl = document.getElementById(`weapon-w${n}`);
      const tEl = document.getElementById(`wtalent-w${n}`);
      const tEl2 = document.getElementById(`wtalent2-w${n}`);
      const tierEl = document.getElementById(`tier-w${n}`);
      const rowTier = document.getElementById(`row-tier-w${n}`);

      wEl.addEventListener('change', () => {
        const val = wEl.value;
        state[`weapon${n}`].id = val;
        const exoticRow = document.getElementById(`row-exotic-w${n}`);
        const exoticDisplay = document.getElementById(`exotic-talent-w${n}`);
        
        if (val.startsWith('ex-')) {
          rowTier.style.display = 'none';
          // Show exotic native talent
          const exId = val.substring(3);
          const ex = exoticWeapons.find(e => e.id === exId);
          if (ex && exoticRow && exoticDisplay) {
            exoticDisplay.textContent = ex.talentName;
            exoticRow.style.display = 'block';
          }
        } else if (val.startsWith('std-')) {
          rowTier.style.display = 'block';
          if (exoticRow) exoticRow.style.display = 'none';
        } else {
          rowTier.style.display = 'none';
          if (exoticRow) exoticRow.style.display = 'none';
          state[`weapon${n}`].talent = '';
          tEl.value = '';
          state[`weapon${n}`].talent2 = '';
          tEl2.value = '';
        }
        showWeaponDetail(n);
        enforceExoticRestriction(n);
        update();
      });

      tierEl.addEventListener('change', () => {
        state[`weapon${n}`].tier = tierEl.value;
        showWeaponDetail(n);
        update();
      });

      tEl.addEventListener('change', () => {
        state[`weapon${n}`].talent = tEl.value;
        update();
      });

      tEl2.addEventListener('change', () => {
        state[`weapon${n}`].talent2 = tEl2.value;
        update();
      });
    });

    document.getElementById('select-os').addEventListener('change', e => { state.os = e.target.value; showOSDetail(); update(); });
    document.getElementById('select-subclass').addEventListener('change', e => { state.subclass = e.target.value; update(); });
    ['1', '2', '3'].forEach(num => {
      document.getElementById(`select-smc${num}`).addEventListener('change', e => {
        state[`smc${num}`] = e.target.value;
        populateSMCDropdowns();
        update();
      });
    });
    document.getElementById('input-build-name').addEventListener('input', e => {
      state.buildName = e.target.value;
      update();
    });
    const selectTemplate = document.getElementById('select-template');
    if (selectTemplate) {
      selectTemplate.addEventListener('change', e => {
        if (e.target.value) {
          // Use replaceState to set hash without triggering hashchange,
          // then directly call loadFromURL for reliable mobile support
          history.replaceState(null, '', '#' + e.target.value);
          loadFromURL();
        }
      });
    }
    document.getElementById('btn-copy').addEventListener('click', copyLink);
    document.getElementById('btn-reset').addEventListener('click', resetBuild);
    const btnCopyBottom = document.getElementById('btn-copy-bottom');
    const btnResetBottom = document.getElementById('btn-reset-bottom');
    if (btnCopyBottom) btnCopyBottom.addEventListener('click', copyLink);
    if (btnResetBottom) btnResetBottom.addEventListener('click', resetBuild);

    populateOSDropdown();
    populateSubclassDropdown();
    populateSMCDropdowns();
    loadFromURL();
    window.addEventListener('hashchange', loadFromURL);
  }

  function populateOSDropdown(){
    const sel = document.getElementById('select-os');
    const recCat = SPEC_OS_MAP[state.spec] || '';
    // Show ALL OS protocols — any spec can equip any OS protocol
    const all = [...osProtocols];
    
    sel.innerHTML = state.spec 
      ? '<option value="">— Select OS Protocol —</option>'
      : '<option value="">— Select OS Protocol (All) —</option>';
      
    const rarityOrder = {'High-End':0,'Superior':1,'Specialized':2,'Standard':3};
    // Sort: recommended category first, then by rarity within each group
    all.sort((a,b) => {
      const aRec = a.specialization === recCat ? 0 : 1;
      const bRec = b.specialization === recCat ? 0 : 1;
      if(aRec !== bRec) return aRec - bRec;
      return (rarityOrder[a.rarity]||9) - (rarityOrder[b.rarity]||9);
    });
    
    const catColors = {'Engineering':'#3b82f6','Firepower':'#f97316','Toughness':'#22c55e'};
    const groups = {};
    all.forEach(p => {
      const cat = p.specialization;
      if (!groups[cat]) {
        groups[cat] = document.createElement('optgroup');
        groups[cat].label = cat;
        groups[cat].style.cssText = `color:${catColors[cat]||'inherit'};font-weight:700;background:#16161c`;
      }
      const opt = document.createElement('option');
      opt.value = p.id;
      const recTag = (recCat && p.specialization === recCat) ? ' ★' : '';
      opt.textContent = `${p.name}${recTag}`;
      opt.style.cssText = `color:${catColors[cat]||'inherit'};background:#1e1e24`;
      groups[cat].appendChild(opt);
    });
    // Add recommended category first
    if (recCat && groups[recCat]) sel.appendChild(groups[recCat]);
    Object.keys(groups).forEach(cat => {
      if (cat !== recCat) sel.appendChild(groups[cat]);
    });
    
    if(state.os && all.find(p => p.id === state.os)) sel.value = state.os;
    else { state.os = ''; }
    showOSDetail();
  }

  function populateSubclassDropdown(){
    const sel = document.getElementById('select-subclass');
    const filtered = state.spec ? SPEC_SUBCLASSES[state.spec] : [];
    
    sel.innerHTML = state.spec
      ? '<option value="">— Select Focus —</option>'
      : '<option value="">— Choose spec first —</option>';
      
    filtered.forEach(sc => {
      const opt = document.createElement('option');
      opt.value = sc;
      opt.textContent = sc;
      opt.style.cssText = 'background:#1e1e24;color:#e0e0e0';
      sel.appendChild(opt);
    });
    
    if(state.subclass && filtered.includes(state.subclass)) sel.value = state.subclass;
    else { state.subclass = ''; }
  }

  function populateSMCDropdowns(){
    const filtered = state.spec ? skillModCombos.filter(s => s.specialization === state.spec) : skillModCombos;
    
    ['1', '2', '3'].forEach(num => {
      const sel = document.getElementById(`select-smc${num}`);
      const val = state[`smc${num}`];
      
      sel.innerHTML = state.spec
        ? `<option value="">— Select Skill Mod ${num} —</option>`
        : `<option value="">— Select Skill Mod ${num} (All) —</option>`;
        
      const specColors = {'Demolitionist':'#3b82f6','Tech Operator':'#3b82f6','Vanguard':'#f97316','Bulwark':'#22c55e','Field Medic':'#a855f7'};
      filtered.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        opt.style.cssText = `color:${specColors[s.specialization]||'inherit'};background:#1e1e24`;
        
        // Disable option if selected in another slot
        const isSelectedElsewhere = ['1', '2', '3'].some(other => other !== num && state[`smc${other}`] === s.id);
        if (isSelectedElsewhere) {
          opt.disabled = true;
        }
        
        sel.appendChild(opt);
      });
      
      if(val && filtered.find(s => s.id === val)) sel.value = val;
      else { state[`smc${num}`] = ''; }
    });
    
    showSMCDetails();
  }

  function showWeaponDetail(n) {
    const el = document.getElementById(`w${n}-detail`);
    const wState = state[`weapon${n}`];
    if (!wState.id) {
      el.classList.remove('is-visible');
      return;
    }
    
    if (wState.id.startsWith('ex-')) {
      const exId = wState.id.substring(3);
      const ex = exoticWeapons.find(e => e.id === exId);
      if (!ex) {
        el.classList.remove('is-visible');
        return;
      }
      el.innerHTML = `<strong>${ex.name}</strong> <span style="opacity:.6">(${ex.type})</span><br>${ex.talentDescription}<br>` +
        `<div class="weapon-detail__stats">` +
        `<div class="weapon-detail__stat">RPM: <strong>${ex.rpm || '--'}</strong></div>` +
        `<div class="weapon-detail__stat">Mag: <strong>${ex.magazineSize || '--'}</strong></div>` +
        `<div class="weapon-detail__stat">Type: <strong>Exotic</strong></div>` +
        `</div>`;
      el.classList.add('is-visible');
    } else if (wState.id.startsWith('std-')) {
      const stdId = wState.id.substring(4);
      const std = standardWeapons.find(w => w.id === stdId);
      if (!std) {
        el.classList.remove('is-visible');
        return;
      }
      el.innerHTML = `<strong>${std.name}</strong> <span style="opacity:.6">(${std.type})</span><br>` +
        `<div class="weapon-detail__stats">` +
        `<div class="weapon-detail__stat">RPM: <strong>${std.rpm}</strong></div>` +
        `<div class="weapon-detail__stat">Mag: <strong>${std.mag}</strong></div>` +
        `<div class="weapon-detail__stat">Tier: <strong>${wState.tier}</strong></div>` +
        `</div>`;
      el.classList.add('is-visible');
    }
  }

  function enforceExoticRestriction() {
    const w1Exotic = state.weapon1.id && state.weapon1.id.startsWith('ex-');
    const w2Exotic = state.weapon2.id && state.weapon2.id.startsWith('ex-');
    
    if (w1Exotic && w2Exotic) {
      state.weapon2.id = '';
      const w2Sel = document.getElementById('weapon-w2');
      if (w2Sel) w2Sel.value = '';
    }

    const finalW1Ex = state.weapon1.id && state.weapon1.id.startsWith('ex-');
    const finalW2Ex = state.weapon2.id && state.weapon2.id.startsWith('ex-');

    const sel1 = document.getElementById('weapon-w1');
    const sel2 = document.getElementById('weapon-w2');
    
    if (sel1) {
      Array.from(sel1.options).forEach(opt => {
        if (opt.value && opt.value.startsWith('ex-')) opt.disabled = finalW2Ex;
      });
    }
    if (sel2) {
      Array.from(sel2.options).forEach(opt => {
        if (opt.value && opt.value.startsWith('ex-')) opt.disabled = finalW1Ex;
      });
    }
    
    showWeaponDetail(1);
    showWeaponDetail(2);
  }

  function showOSDetail(){
    const el = document.getElementById('os-detail');
    const badge = document.getElementById('badge-os');
    if(!state.os){ el.classList.remove('is-visible'); badge.className = 'slot-card__badge'; badge.textContent = ''; return; }
    const p = osProtocols.find(x => x.id === state.os);
    if(!p){ el.classList.remove('is-visible'); return; }
    el.innerHTML = `<strong>${p.name}</strong> <span style="opacity:.6">(${p.rarity} · ${p.specialization})</span><br>${p.talentDescription}${p.cooldown ? '<br>Cooldown: '+p.cooldown : ''}<br><span style="opacity:.5">${p.attr1} ${p.val1} · ${p.attr2} ${p.val2} · ${p.attr3} ${p.val3}</span>`;
    el.classList.add('is-visible');
    const rc = p.rarity === 'High-End' ? 'rarity-high-end' : p.rarity === 'Superior' ? 'rarity-superior' : p.rarity === 'Specialized' ? 'rarity-specialized' : 'rarity-standard';
    badge.className = `slot-card__badge has-set ${rc}`; badge.textContent = p.rarity;
  }

  function showSMCDetails(){
    ['1', '2', '3'].forEach(num => {
      const el = document.getElementById(`smc-detail-${num}`);
      const val = state[`smc${num}`];
      if(!val){ el.classList.remove('is-visible'); return; }
      const s = skillModCombos.find(x => x.id === val);
      if(!s){ el.classList.remove('is-visible'); return; }
      el.innerHTML = `<strong>${s.name}</strong> <span style="opacity:.6">(${s.specialization})</span><br><em>2pc:</em> ${s.bonus2}<br><em>3pc:</em> ${s.bonus3}`;
      el.classList.add('is-visible');
    });
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
      const card = document.getElementById(`slot-${slot}`);
      const sid = state.slots[slot].set;

      // Clear previous flame classes
      if(card) card.classList.remove('set-active-2','set-active-3','set-active-4');

      if(!sid){ badge.className = 'slot-card__badge'; badge.textContent = ''; return; }
      const gs = gearSets.find(g => g.id === sid);
      const c = counts[sid] || 0;
      badge.textContent = `${c}pc ${gs ? gs.name : ''}`;
      badge.className = 'slot-card__badge has-set' + (c >= 4 ? ' full-bonus' : '');

      // Apply flame class based on set piece count
      if(card && c >= 2) {
        const tier = c >= 4 ? 4 : c >= 3 ? 3 : 2;
        card.classList.add(`set-active-${tier}`);
      }
    });
  }

  function renderSummary(){
    const counts = countSets();
    const hasAnything = Object.keys(counts).length > 0 || state.weapon1.talent || state.weapon2.talent || state.os || state.smc1 || state.smc2 || state.smc3 || state.subclass || state.spec || state.weapon1.id || state.weapon2.id || state.buildName;
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

    // Talents / Loadout
    const talentsEl = document.getElementById('summary-talents-list');
    const talentsSection = document.getElementById('summary-talents');
    let talentHTML = '';
    const bodyT = state.slots.body.talent ? bodyArmorTalents.find(t => t.id === state.slots.body.talent) : null;
    const bpT = state.slots.backpack.talent ? backpackTalents.find(t => t.id === state.slots.backpack.talent) : null;
    const w1T = state.weapon1.talent ? weaponTalents.find(t => t.id === state.weapon1.talent) : null;
    const w1T2 = state.weapon1.talent2 ? weaponTalents.find(t => t.id === state.weapon1.talent2) : null;
    const w2T = state.weapon2.talent ? weaponTalents.find(t => t.id === state.weapon2.talent) : null;
    const w2T2 = state.weapon2.talent2 ? weaponTalents.find(t => t.id === state.weapon2.talent2) : null;
    
    let w1Name = '';
    if (state.weapon1.id) {
      if (state.weapon1.id.startsWith('ex-')) {
        const ex = exoticWeapons.find(e => e.id === state.weapon1.id.substring(3));
        if (ex) w1Name = ex.name;
      } else {
        const std = standardWeapons.find(w => w.id === state.weapon1.id.substring(4));
        if (std) w1Name = std.name;
      }
    }
    let w2Name = '';
    if (state.weapon2.id) {
      if (state.weapon2.id.startsWith('ex-')) {
        const ex = exoticWeapons.find(e => e.id === state.weapon2.id.substring(3));
        if (ex) w2Name = ex.name;
      } else {
        const std = standardWeapons.find(w => w.id === state.weapon2.id.substring(4));
        if (std) w2Name = std.name;
      }
    }

    const osP = state.os ? osProtocols.find(p => p.id === state.os) : null;

    // Spec group
    if (state.spec) {
      const specName = state.spec === 'Tech Operator' ? 'Tech Op' : state.spec === 'Field Medic' ? 'Medic' : state.spec;
      talentHTML += `<div class="sl-row sl-row--spec"><span class="sl-icon">🎯</span><div class="sl-body"><span class="sl-label">SPEC</span><span class="sl-val">${specName}${state.subclass ? ' <span class="sl-dim">/ ' + state.subclass + '</span>' : ''}</span></div></div>`;
    }

    // Primary Weapon group
    if (w1Name) {
      const tierTag = state.weapon1.id.startsWith('ex-') ? '<span class="sl-pill sl-pill--exotic">Exotic</span>' : `<span class="sl-pill">${state.weapon1.tier}</span>`;
      const isExotic1 = state.weapon1.id.startsWith('ex-');
      const ex1 = isExotic1 ? exoticWeapons.find(e => e.id === state.weapon1.id.substring(3)) : null;
      let talents = [];
      if (ex1) talents.push(`<span style="color:#f5a623">${ex1.talentName}</span>`);
      if (w1T) talents.push(w1T.name);
      if (w1T2) talents.push(w1T2.name);
      talentHTML += `<div class="sl-row sl-row--weapon"><span class="sl-icon">🔫</span><div class="sl-body"><span class="sl-label">PRIMARY</span><span class="sl-val">${w1Name} ${tierTag}</span>${talents.length ? '<span class="sl-talents">' + talents.join(' · ') + '</span>' : ''}</div></div>`;
    }

    // Secondary Weapon group
    if (w2Name) {
      const tierTag = state.weapon2.id.startsWith('ex-') ? '<span class="sl-pill sl-pill--exotic">Exotic</span>' : `<span class="sl-pill">${state.weapon2.tier}</span>`;
      const isExotic2 = state.weapon2.id.startsWith('ex-');
      const ex2 = isExotic2 ? exoticWeapons.find(e => e.id === state.weapon2.id.substring(3)) : null;
      let talents = [];
      if (ex2) talents.push(`<span style="color:#f5a623">${ex2.talentName}</span>`);
      if (w2T) talents.push(w2T.name);
      if (w2T2) talents.push(w2T2.name);
      talentHTML += `<div class="sl-row sl-row--weapon"><span class="sl-icon">🔫</span><div class="sl-body"><span class="sl-label">SECONDARY</span><span class="sl-val">${w2Name} ${tierTag}</span>${talents.length ? '<span class="sl-talents">' + talents.join(' · ') + '</span>' : ''}</div></div>`;
    }

    // Gear Talents group
    if (bodyT || bpT) {
      let gearParts = [];
      if (bodyT) gearParts.push(`<span class="sl-val">${bodyT.name} <span class="sl-dim">chest</span></span>`);
      if (bpT) gearParts.push(`<span class="sl-val">${bpT.name} <span class="sl-dim">pack</span></span>`);
      talentHTML += `<div class="sl-row sl-row--gear"><span class="sl-icon">🛡️</span><div class="sl-body"><span class="sl-label">GEAR TALENTS</span>${gearParts.join('')}</div></div>`;
    }

    // OS Protocol group
    if (osP) {
      const osColor = osP.specialization === 'Engineering' ? '#3b82f6' : osP.specialization === 'Firepower' ? '#f97316' : '#22c55e';
      talentHTML += `<div class="sl-row sl-row--os"><span class="sl-icon">⚙️</span><div class="sl-body"><span class="sl-label">OS PROTOCOL</span><span class="sl-val">${osP.name} <span class="sl-pill" style="background:${osColor}22;color:${osColor};border-color:${osColor}44">${osP.specialization}</span></span></div></div>`;
    }

    // Skill Mods group
    let hasChipsets = false;
    let chipsetNames = [];
    ['1', '2', '3'].forEach(num => {
      const val = state[`smc${num}`];
      if (val) {
        const s = skillModCombos.find(x => x.id === val);
        if (s) {
          hasChipsets = true;
          chipsetNames.push(s.name);
        }
      }
    });
    if (hasChipsets) {
      talentHTML += `<div class="sl-row sl-row--smc"><span class="sl-icon">🔩</span><div class="sl-body"><span class="sl-label">SKILL MODS</span>${chipsetNames.map(n => '<span class="sl-val">' + n + '</span>').join('')}</div></div>`;
    }

    if(talentHTML){ talentsSection.style.display = 'block'; talentsEl.innerHTML = talentHTML; }
    else { talentsSection.style.display = 'none'; }

    // Synergies & conflicts
    const synergies = [];
    const conflicts = [];
    
    // Custom weapon details extraction for synergy detector
    let w1E = null;
    if (state.weapon1.id && state.weapon1.id.startsWith('ex-')) {
      w1E = exoticWeapons.find(e => e.id === state.weapon1.id.substring(3));
    }
    let w2E = null;
    if (state.weapon2.id && state.weapon2.id.startsWith('ex-')) {
      w2E = exoticWeapons.find(e => e.id === state.weapon2.id.substring(3));
    }

    const score = detectSynergies(synergies, conflicts, counts, {bodyT, bpT, w1T, w2T, w1E, w2E, osP});

    // Update Build Quality Indicator
    const qualityBadge = document.getElementById('build-quality-badge');
    const qualityText = document.getElementById('build-quality-text');
    const qualityBox = document.getElementById('build-quality-indicator');
    
    if (qualityBadge && qualityText && qualityBox) {
      if (score === 0) {
        qualityBadge.innerHTML = '💩 FLAMING PILE OF GARBAGE';
        qualityBadge.style.color = '#e74c3c';
        qualityBox.style.background = 'rgba(231, 76, 60, 0.1)';
        qualityBox.style.borderColor = '#e74c3c';
        qualityText.textContent = "This build is an absolute dumpster fire. You're going to get spawn-trapped by a standard red-bar NPC in a level 1 tutorial zone. Select a spec and get some actual gear set bonuses or weapon talents before someone sees you like this.";
      } else if (score < 7) {
        qualityBadge.innerHTML = '⚠️ MILDLY PATHETIC';
        qualityBadge.style.color = '#f1c40f';
        qualityBox.style.background = 'rgba(241, 196, 15, 0.1)';
        qualityBox.style.borderColor = '#f1c40f';
        qualityText.textContent = "You managed to find exactly one stat connection. Congratulations, you are now slightly more useful than a decorative traffic cone. Keep linking slots to get past this embarrassment.";
      } else if (score < 13) {
        qualityBadge.innerHTML = '🍕 SEMI-COMPETENT';
        qualityBadge.style.color = '#3498db';
        qualityBox.style.background = 'rgba(52, 152, 219, 0.1)';
        qualityBox.style.borderColor = '#3498db';
        qualityText.textContent = "Two synergies! You might not instantly explode the split second you step into the Dark Zone, but don't go challenging anyone who has a pulse or a working keyboard just yet.";
      } else if (score < 18) {
        qualityBadge.innerHTML = '🔥 CERTIFIED SWEATY';
        qualityBadge.style.color = '#9b59b6';
        qualityBox.style.background = 'rgba(155, 89, 182, 0.1)';
        qualityBox.style.borderColor = '#9b59b6';
        qualityText.textContent = "Three synergies! Look at you go, you absolute tryhard. You're probably running around the house telling your dog about your optimal crit stacking. Go take a shower, you've earned it.";
      } else {
        qualityBadge.innerHTML = '🐐 GOD-TIER CHAD LOADOUT';
        qualityBadge.style.color = '#2ecc71';
        qualityBox.style.background = 'rgba(46, 204, 113, 0.1)';
        qualityBox.style.borderColor = '#2ecc71';
        qualityText.textContent = "Four or more synergies. Absolute theorycrafting perfection. This is so beautiful we might actually cry. Copy this link immediately, spam it in your clan Discord and watch the salt flow.";
      }
    }

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
    if(w1E) allDescs.push({src:'Primary: '+w1E.name, d:w1E.talentDescription});
    else if(w1T) allDescs.push({src:'Primary: '+w1T.name, d:w1T.description});
    if(w2E) allDescs.push({src:'Secondary: '+w2E.name, d:w2E.talentDescription});
    else if(w2T) allDescs.push({src:'Secondary: '+w2T.name, d:w2T.description});
    if(osP) allDescs.push({src:'OS: '+osP.name, d:osP.talentDescription});

    ['1', '2', '3'].forEach(num => {
      const val = state[`smc${num}`];
      if (val) {
        const s = skillModCombos.find(x => x.id === val);
        if (s) {
          allDescs.push({src:`Skill Mod ${num}: ` + s.name, d: `${s.bonus2} ${s.bonus3}`});
        }
      }
    });

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

    let score = 0;
    
    // 1. Base components selected
    if (state.spec) score += 1;
    if (state.subclass) score += 1;
    if (state.weapon1.id) score += 1;
    if (state.weapon2.id) score += 1;
    if (state.weapon1.talent) score += 1;
    if (state.weapon2.talent) score += 1;
    if (state.os) score += 1;
    if (state.smc1) score += 1;
    if (state.smc2) score += 1;
    if (state.smc3) score += 1;
    if (state.slots.body.talent) score += 1;
    if (state.slots.backpack.talent) score += 1;

    // 2. Active gear sets
    Object.entries(counts).forEach(([sid, c]) => {
      if (c >= 4) score += 3;
      else if (c === 3) score += 2;
      else if (c === 2) score += 1;
    });

    // Report synergies where 2+ sources stack the same stat
    const reported = new Set();
    statPatterns.forEach(sp => {
      const unique = [...new Set(sources[sp.key])];
      if(unique.length >= 2 && !reported.has(sp.key)){
        reported.add(sp.key);
        syn.push(`<strong>${sp.label} stacking</strong> — ${unique.length} sources: ${unique.join(', ')}`);
        
        // Add synergy weight to score
        score += unique.length;
      }
    });

    // Crit pairing
    if(sources.wchc.length > 0 && sources.wchd.length > 0 && !reported.has('wcrit')){
      syn.push('<strong>Weapon Crit pairing</strong> — Crit Chance + Crit Damage sources active together.');
      score += 2;
    }
    if(sources.schc.length > 0 && sources.schd.length > 0 && !reported.has('scrit')){
      syn.push('<strong>Skill Crit pairing</strong> — Skill Crit Chance + Skill Crit Damage sources active together.');
      score += 2;
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
    
    return score;
  }

  function loadFromURL(){
    if(!location.hash || location.hash.length < 2) {
      if(state.spec || state.buildName || state.os) {
        resetBuild();
      }
      return;
    }
    const p = new URLSearchParams(location.hash.slice(1));
    if(p.has('s')){
      state.spec = p.get('s');
      const btn = document.querySelector(`.spec-btn[data-spec="${state.spec}"]`);
      if(btn){ document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active')); btn.classList.add('is-active'); }
      populateOSDropdown();
      populateSubclassDropdown();
      populateSMCDropdowns();
    }
    
    // Gear slots prefix mapping
    const slotPrefixMap = {m:'mask',g:'gloves',h:'holster',k:'kneepads'};
    Object.entries(slotPrefixMap).forEach(([pre, slot]) => {
      if(p.has(pre+'s')){ state.slots[slot].set = p.get(pre+'s'); const el = document.getElementById(`set-${slot}`); if(el) el.value = state.slots[slot].set; }
      if(p.has(pre+'t')){ state.slots[slot].talent = p.get(pre+'t'); const el = document.getElementById(`talent-${slot}`); if(el) el.value = state.slots[slot].talent; }
      if(p.has(pre+'1')){ state.slots[slot].attr1 = p.get(pre+'1'); const el = document.getElementById(`attr1-${slot}`); if(el) el.value = state.slots[slot].attr1; }
      if(p.has(pre+'2')){ state.slots[slot].attr2 = p.get(pre+'2'); const el = document.getElementById(`attr2-${slot}`); if(el) el.value = state.slots[slot].attr2; }
    });
    
    [['c','body'],['p','backpack']].forEach(([pre, slot]) => {
      if(p.has(pre+'s')){ state.slots[slot].set = p.get(pre+'s'); const el = document.getElementById(`set-${slot}`); if(el) el.value = state.slots[slot].set; }
      if(p.has(pre+'t')){ state.slots[slot].talent = p.get(pre+'t'); const el = document.getElementById(`talent-${slot}`); if(el) el.value = state.slots[slot].talent; }
      if(p.has(pre+'1')){ state.slots[slot].attr1 = p.get(pre+'1'); const el = document.getElementById(`attr1-${slot}`); if(el) el.value = state.slots[slot].attr1; }
      if(p.has(pre+'2')){ state.slots[slot].attr2 = p.get(pre+'2'); const el = document.getElementById(`attr2-${slot}`); if(el) el.value = state.slots[slot].attr2; }
    });
    
    if(p.has('w1e')){
      state.weapon1.id = 'ex-' + p.get('w1e');
      document.getElementById('weapon-w1').value = state.weapon1.id;
      const ex1 = exoticWeapons.find(e => e.id === p.get('w1e'));
      const exRow1 = document.getElementById('row-exotic-w1');
      const exDisp1 = document.getElementById('exotic-talent-w1');
      if (ex1 && exRow1 && exDisp1) { exDisp1.textContent = ex1.talentName; exRow1.style.display = 'block'; }
    }
    else if(p.has('w1s')){ state.weapon1.id = 'std-' + p.get('w1s'); document.getElementById('weapon-w1').value = state.weapon1.id; document.getElementById('row-tier-w1').style.display = 'block'; }
    if(p.has('w1t')){ state.weapon1.talent = p.get('w1t'); document.getElementById('wtalent-w1').value = state.weapon1.talent; }
    if(p.has('w1t2')){ state.weapon1.talent2 = p.get('w1t2'); document.getElementById('wtalent2-w1').value = state.weapon1.talent2; }
    if(p.has('w1tr')){ state.weapon1.tier = p.get('w1tr'); document.getElementById('tier-w1').value = state.weapon1.tier; }
    
    if(p.has('w2e')){
      state.weapon2.id = 'ex-' + p.get('w2e');
      document.getElementById('weapon-w2').value = state.weapon2.id;
      const ex2 = exoticWeapons.find(e => e.id === p.get('w2e'));
      const exRow2 = document.getElementById('row-exotic-w2');
      const exDisp2 = document.getElementById('exotic-talent-w2');
      if (ex2 && exRow2 && exDisp2) { exDisp2.textContent = ex2.talentName; exRow2.style.display = 'block'; }
    }
    else if(p.has('w2s')){ state.weapon2.id = 'std-' + p.get('w2s'); document.getElementById('weapon-w2').value = state.weapon2.id; document.getElementById('row-tier-w2').style.display = 'block'; }
    if(p.has('w2t')){ state.weapon2.talent = p.get('w2t'); document.getElementById('wtalent-w2').value = state.weapon2.talent; }
    if(p.has('w2t2')){ state.weapon2.talent2 = p.get('w2t2'); document.getElementById('wtalent2-w2').value = state.weapon2.talent2; }
    if(p.has('w2tr')){ state.weapon2.tier = p.get('w2tr'); document.getElementById('tier-w2').value = state.weapon2.tier; }
    
    if(p.has('os')){ state.os = p.get('os'); document.getElementById('select-os').value = state.os; showOSDetail(); }
    if(p.has('sc')){ state.subclass = p.get('sc'); document.getElementById('select-subclass').value = state.subclass; }
    if(p.has('n')){ state.buildName = p.get('n'); document.getElementById('input-build-name').value = state.buildName; }
    else { state.buildName = ''; document.getElementById('input-build-name').value = ''; }
    
    if(p.has('smc')){ state.smc1 = p.get('smc'); }
    if(p.has('sm1')){ state.smc1 = p.get('sm1'); }
    if(p.has('sm2')){ state.smc2 = p.get('sm2'); }
    if(p.has('sm3')){ state.smc3 = p.get('sm3'); }
    populateSMCDropdowns();
    
    showWeaponDetail(1);
    showWeaponDetail(2);
    
    // Sync the select-template dropdown value to match current hash if applicable
    const selectTemplate = document.getElementById('select-template');
    if (selectTemplate) {
      const currentHash = location.hash.slice(1);
      let matchedValue = '';
      if (currentHash) {
        for (const opt of selectTemplate.options) {
          if (opt.value && (currentHash.includes(opt.value) || opt.value.includes(currentHash))) {
            matchedValue = opt.value;
            break;
          }
        }
      }
      selectTemplate.value = matchedValue;
    }

    enforceExoticRestriction();
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
      const ta = document.createElement('textarea');
      ta.value = location.href; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      const toast = document.getElementById('copy-toast');
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2000);
    });
  }

  function resetBuild(){
    state = {spec:null, subclass:'', slots:{}, weapon1:{id:'',tier:'T2',talent:'',talent2:''}, weapon2:{id:'',tier:'T2',talent:'',talent2:''}, os:'', smc1:'', smc2:'', smc3:'', buildName:''};
    GEAR_SLOTS.forEach(s => state.slots[s] = {set:'',talent:'',attr1:'',attr2:''});
    
    document.querySelectorAll('.spec-btn').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.slot-select').forEach(el => { el.value = ''; el.disabled = false; });
    document.querySelectorAll('.slot-input').forEach(el => { el.value = ''; });
    document.getElementById('input-build-name').value = '';
    
    document.getElementById('row-tier-w1').style.display = 'none';
    document.getElementById('row-tier-w2').style.display = 'none';
    document.getElementById('row-exotic-w1').style.display = 'none';
    document.getElementById('row-exotic-w2').style.display = 'none';
    document.getElementById('w1-detail').classList.remove('is-visible');
    document.getElementById('w2-detail').classList.remove('is-visible');
    
    populateOSDropdown();
    populateSubclassDropdown();
    populateSMCDropdowns();
    
    document.getElementById('os-detail').classList.remove('is-visible');
    ['1', '2', '3'].forEach(num => document.getElementById(`smc-detail-${num}`).classList.remove('is-visible'));
    document.getElementById('badge-os').className = 'slot-card__badge';
    
    history.replaceState(null, '', location.pathname);
    enforceExoticRestriction();
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
    
    if(state.weapon1.id) {
      if(state.weapon1.id.startsWith('ex-')) p.set('w1e', state.weapon1.id.substring(3));
      else if(state.weapon1.id.startsWith('std-')) {
        p.set('w1s', state.weapon1.id.substring(4));
        p.set('w1tr', state.weapon1.tier);
      }
    }
    if(state.weapon1.talent) p.set('w1t', state.weapon1.talent);
    if(state.weapon1.talent2) p.set('w1t2', state.weapon1.talent2);
    
    if(state.weapon2.id) {
      if(state.weapon2.id.startsWith('ex-')) p.set('w2e', state.weapon2.id.substring(3));
      else if(state.weapon2.id.startsWith('std-')) {
        p.set('w2s', state.weapon2.id.substring(4));
        p.set('w2tr', state.weapon2.tier);
      }
    }
    if(state.weapon2.talent) p.set('w2t', state.weapon2.talent);
    if(state.weapon2.talent2) p.set('w2t2', state.weapon2.talent2);
    
    if(state.os) p.set('os', state.os);
    if(state.subclass) p.set('sc', state.subclass);
    if(state.smc1) p.set('sm1', state.smc1);
    if(state.smc2) p.set('sm2', state.smc2);
    if(state.smc3) p.set('sm3', state.smc3);
    if(state.buildName) p.set('n', state.buildName);
    
    const hash = p.toString();
    if(hash) history.replaceState(null, '', '#' + hash);
    else history.replaceState(null, '', location.pathname);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
