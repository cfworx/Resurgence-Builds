# Division Resurgence — Game Mechanics & Build Knowledge Base
**For AI build authoring at resurgencebuilds.com | Byline: RapidF5**

> This document is the primary reference for AI build generation and game mechanics reasoning. Read this alongside the Division_Resurgence_Build_Database.md before producing any build. The Build Database has numeric values; this document provides context, edge cases, corrections, and rules.

---

## AUTHORITY ORDER (When Sources Conflict)

1. In-game player observation by RapidF5 (supersedes everything)
2. Video creators (Godlike, Saiynergy, PVE Enjoyer transcripts) — trust for mechanic interpretation
3. The Build Database spreadsheet — trust for numeric values and talent text
4. AI inference — only fills gaps when nothing above conflicts

---

## PART 1: BUILD PHILOSOPHY RULES (Non-Negotiable)

### Rule 1: Text Must Say "Team"
Do NOT assume a talent grants a team-wide buff unless the talent text explicitly includes **"to allies," "to team," "to ally team,"** or **"ally."**

- **Hypervigilant** (chest): "Healing grants +5% DR" — **SELF-ONLY**
- **Rock Solid** (backpack): "Receiving Healing grants +15% DR" — applies to the wearer
- **Boosted Shield, Duality, Fearless Charge** — all chest DR talents in Field Medic pool — every one is self-only

Talents that DO say "team":
- **Slaughter Healing** (weapon): "+7% Incoming Healing to **all allies within 40 meters**"
- **Medical Excellence** (OS): "grants **the ally team** additional healing equal to 5% Max Health"
- **Rescue Signal** (chest): "Being downed grants **all allies within 40 meters** +10% MS and +100% Rescue Efficiency"
- **Pulse Enhancement** (Vanguard mod): "Deploying Scanning Pulse grants **Pulsed allies** Weapon CHC"
- **Tactical Reinforcement** (Vanguard mod): "Increases SAC Efficiency of **players applied with Tactical Link** by 28.80%"

### Rule 2: Math on the Page
Every numerical claim must be traceable. Show calculations. The user reviews builds for accuracy.

### Rule 3: Three Stats Per Gear Piece
Every gear slot must list:
- Core stat (Firepower / Toughness / Engineering)
- Bonus #1 (specific bonus attribute name)
- Bonus #2 (specific bonus attribute name)
- Plus Brand and Talent when applicable. Never write "good stats."

### Rule 4: Bridge Gear Ladder
Every build must name a T0 / T1 / T2 progression so a new player can start immediately. Specify which gear sets are T2-only and which roll T0+.

### Rule 4b: Standard 4-Piece Slotting
Default 4pc gear set slots: **Mask, Gloves, Holster, Kneepads**
- Chest and Backpack are free slots — the talent is what matters, not the brand
- Optional 4+2 split: 4pc on Mask/Gloves/Holster, 2pc on Backpack+Kneepads

### Rule 5: Off-Meta Direction
Builds should be fun and not obviously underpowered — not a carbon copy of popular YouTuber builds. Exception: the healer build is intentionally the apex meta build.

### Rule 6: Spreadsheet > Video for Numbers
When video says one number and the spreadsheet says another, spreadsheet wins for values. Video wins for mechanic interpretation.

### Rule 7: Post Format
Structure: YAML frontmatter → H1 title → Byline + SEO opener → At-a-glance bullets → TOC (13–15 sections) → Thesis → Why off-meta → Weapon section → Full Loadout table → Per-Piece Stat Sheet → Math section → Skill Mod choices → OS justification → Chest/Backpack justification → Gear Set Ladder table (T0→T1→T2) → Combat Rotation → Loot Quick-Reference → TL;DR (five things) → Footer with companion links.

---

## PART 2: THE THREE DAMAGE CORES

**Firepower** — drives Weapon Damage. Adds Firepower stat (multiplier) + Firepower-pool bonuses.
**Toughness** — drives Health/Armor/DR. Adds Toughness stat + Toughness-pool bonuses.
**Engineering** — drives Skill output. Adds Engineering stat + Engineering-pool bonuses.

### Mixing Cores Is a Trap
A 6-piece Firepower stack gives ~+135% Firepower. A pure-Engineering healer gives ~+135% Engineering. **Mixed cores dilute everything.** Standard rule: pick one Core, run it on 5–6 pieces. Acceptable to keep 1–2 Toughness pieces for survival on legendary.

### Bonus Attribute Pools
- **Firepower pool**: Weapon CHC, WCHD, Weapon Damage, Multi-Shot, Headshot Damage, Weapon Blast/Piercing/Shredding Damage
- **Toughness pool**: Max Health, Armor, Damage Reduction
- **Engineering pool**: Skill CHC, Skill CHD, Skill Intensity, Skill Multi-Shot, Skill Duration, Skill Radius, Skill CDR, Skill Blast/Piercing/Shredding Damage
- **Universal pool** (any Core): Received Healing, Damage to Elites, Signature Ability Charge Efficiency

---

## PART 3: SKILL STAT GLOSSARY

| Stat | What It Does |
|---|---|
| Skill Intensity | Multiplies skill damage AND healing output. Primary stat for any skill-based build. |
| Skill Duration | Extends deployed skill active time. Critical for Support Station healers. |
| Skill Cooldown Recovery | Reduces skill CDs. Stacks with Pressing Matter OS and Healing Elites passives. |
| Skill Radius | Expands skill area. Important for AoE builds (Demo Artillery, Field Medic Support Station). |
| Skill Crit Chance | Crit pool for skills only. Tech Op Striker Drone scales hard with this. |
| Skill Crit Damage | Multiplier when skill crits land. |
| Skill Multi-Shot Chance | Random extra projectile/pulse. Toymaker chest + Overclocking OS + Spray 'n' Pray makes this an engine. |
| Engineering | The stat multiplier that scales Skill Intensity, Skill Duration, and all skill output. Distinct from Skill Intensity (which is a bonus attribute). |

**Skill Intensity vs Engineering:** Engineering is the primary stat (core stat multiplier). Skill Intensity is a bonus attribute that stacks on top. Both scale heals and skill damage, but they are separate and stack multiplicatively.

---

## PART 4: WEAPON STATS GLOSSARY

| Stat | Notes |
|---|---|
| Weapon Damage | Base multiplier |
| Weapon CHC (WCHC) | Crit chance — pool with gear bonuses |
| Weapon CHD (WCHD) | Crit damage — Cover Shooter OS + One Shot One Kill + Fury Strike all stack |
| Headshot Damage (HSD) | Quick Draw 4pc (+28.8%), One Shot One Kill 3pc (+21.6%) are the big two |
| Weapon Multi-Shot Chance | Dominating Presence OS scales it |
| Optimal Range | Extends falloff. Fury Strike 2pc (+10%) is cheapest |
| Rate of Fire | Fire rate multiplier |
| Reload Speed | Quick Draw 2pc (+12%) |
| Magazine Size | Quick Draw 3pc (+27%), Phalanx Attack 2pc (+18%) |
| Stability / Accuracy | Recoil and bullet spread |
| Blast / Piercing / Shredding | Armor-type-specific damage (less commonly relied on) |

---

## PART 5: DAMAGE FORMULA & STACKING RULES

### Community-Derived Damage Formula
Damage = Base Weapon Damage × (1 + Weapon Damage%) × (1 + Firepower multiplier) × Crit modifier × Headshot modifier × Damage type modifier

- **Weapon Damage and Firepower:** 15 Firepower ≈ 18 Weapon Damage in terms of DPS output. Firepower scales slightly better per point, but Weapon Damage rolls higher on mods. Optimal: Firepower as main stat + Weapon Damage bonus attribute + correct type damage.
- **Engineering vs Skill Damage (Aegis burst):** Engineering benefits Aegis burst 2.25× more than Skill Damage. Heavily prioritize Engineering for skill-based classes.

### Additive vs. Multiplicative Stacking
- **Weapon Damage** — additive within category, multiplicative across categories
- **Engineering Multipliers** — stack multiplicatively
- **Toughness + Defensive Measures** — multiplicative final product
- **Blood for Blood OS + Damage Sources** — confirmed stacking
- **DoT Corrosive Stacks** — additive per stack, scale with Weapon Damage

### Things That Do NOT Stack
- Steady Reload + Multishot — do NOT stack
- Multishot does NOT compound with Headshot Damage multiplier
- Headshot + Multishot — do NOT compound

---

## PART 6: CRITICAL HIT MECHANICS

- Weapon Crit and Skill Crit are **completely separate stat pools** — one does not affect the other
- **No confirmed hard cap on Skill Crit Chance** (u/TheeLoo tested 99% skill crit build successfully)
- Jackpot 3pc = +10.8% Skill CHC
- Skill Crits trigger additional mechanics (chipset procs, etc.)
- Crit Damage Type changes on Aegis: Skill Crit can fire on weapon hits via Performance Enhancer mod

---

## PART 7: GEAR SETS (All 16 — Complete Reference)

T2-only sets are marked. Format: 2pc / 3pc / 4pc.

| Gear Set | 2pc | 3pc | 4pc | Tier |
|---|---|---|---|---|
| Fury Strike | +10% Optimal Range | +10.8% WCHC | +24% WCHD | T0/T1/T2 |
| Quick Draw | +12% Reload Speed | +27% Mag Size | +28.8% HSD | T0/T1/T2 |
| Phalanx Attack | +18% Mag Size | +18% Rate of Fire | +12% Multi-Shot | T0/T1/T2 |
| One Shot One Kill | +24% Accuracy | +21.6% HSD | +18% Firepower | T1/T2 (no T0) |
| Gunny Johnny | +12% Rate of Fire | +18% Reload Speed | +12% Weapon Damage | **T2 only** |
| Mechanical Enemy | +7.2% WCHC | +15% Optimal Range | −12% Skill CDR | **T2 only** |
| Jackpot | +12% Skill Radius | +10.8% Skill CHC | +24% Skill CHD | T0/T1/T2 |
| Long-term Effect | +12% Skill Health | +14.4% Skill Duration | +18% Engineering | T0/T1/T2 |
| Dr. Medic | +10% Healing Intensity | +9% Skill Intensity | +20% Release Extra Protection | T0/T1/T2 |
| Boom-Shakalaka | −6% Skill CDR | +18% Skill Radius | +12% Skill Intensity | T0/T1/T2 |
| Fire Cycle | +12% Skill CHD | +18% SAC Efficiency | +12% Skill Multi-Shot | **T2 only** |
| Mechanical Expert | +9.6% Skill Duration | −9% Skill CDR | +24% SAC Efficiency | T0/T1/T2 |
| Captain Cow | +3.6% Move Speed | +14.4% Skill Duration | +20% Healing Intensity | T0/T1/T2 |
| Healing Elites | +14.4% Received Healing | +15% Release Extra Protection | +28% Armor | **T2 only** |
| Self-Propelled Shield | +14% Armor | +5.4% Move Speed | +24% Max Health | T0/T1/T2 |
| Fearless Warrior | +6% Damage Reduction | +9% Damage Bonus | +18% Toughness | T0/T1/T2 |

**T2-only sets** (cannot be found at T0/T1): Healing Elites, Gunny Johnny, Mechanical Enemy, Fire Cycle
**T0+ sets** (available from start as a bridge): Captain Cow, Fearless Warrior, Self-Propelled Shield, Phalanx Attack, Jackpot, Long-term Effect, Boom-Shakalaka, Fury Strike, Quick Draw

---

## PART 8: EXOTIC WEAPONS (Corrected Authoritative Data)

### Lady Death (SMG — Exotic)
- **Damage Type:** Blast
- **Damage:** 299 | RPM: 900 | Mag: 32 | Accuracy: 50 | Reload: 2.98s | Range: 10m | Movement: 91 | Stability: 50
- **Talent — Breathe Free:** While moving, grants 4 stacks/second (8 if sprinting) up to 40 stacks. Each round fired consumes 1 stack granting +15% Weapon Damage. Deploying a Skill consumes 10 stacks and grants +15% Skill Damage. Kills grant +10% Movement Speed for 10 seconds.
- **Usage:** DPS powerhouse while moving. Stack stacks before engagement. Pairs with skill deployment for hybrid output.

### Warlord (AR — Exotic)
- **Damage Type:** Blast
- **Damage:** 324 | RPM: 600 | Mag: 30 | Accuracy: 68 | Reload: 3.1s | Range: 29m
- **Talent — Play Rough:** While firing, reduces incoming damage by 25%. When firing ceases, applies 60% of the reduced damage to enemies AND grants +10% Skill Damage for 10 seconds.
- **Acquisition:** Drops from the Battle Pass (T1 version). Proficiency requires PvP kills — Level 7 requires ~70 agent kills. Known proficiency bug exists.
- **Warning — The Warlord Specialization Trap:** Warlord is a T1 Exotic AR. Committing to it requires significant PvP farming for proficiency. Evaluate whether the build needs it before recommending.

### Strawberry Milkshake (LMG — Exotic) — CORRECTED
- **Damage Type: SHREDDING** (NOT Blast — common AI error)
- **Damage:** 300 | RPM: 550 | Mag: 100
- **Talent 1 — Anarchy (DoT):** Body shots deal 2.40% Weapon Damage as DoT over 4.50 seconds, up to 50 stacks. Stacks transfer to nearby enemies within 12 meters on kill. (NOT 100% WD, NOT 10s, NOT 25m)
- **Talent 2 — Steady Handed:** Hits grant +1.20% Accuracy and Stability, up to 30 stacks. At 30 stacks, consumes them to refill the magazine.
- **Talent 3 — Swift Taunt:** Hitting 3 enemies within 5 seconds taunts nearby enemies and grants Extra Health equal to 25% Max Health for 10 seconds.
- **Talent 4 — Concentrated Fire:** Hitting the same enemy grants +0.36% WCHD for 5 seconds, up to 100 stacks. Stacks halved when switching targets.
- **Talent 5 — Tactical Reload (T1):** Reloading grants +2.60% Skill CDR for 10 seconds, up to 5 stacks.
- **Talent 6 — Take a Breath (T1):** Reloading empty mag grants +7.50% Toughness for 8 seconds, up to 3 stacks.
- **Community Assessment:** The Anarchy DoT is effectively non-functional in practice (almost negligible real-world impact). Do not build around the DoT mechanic. The Strawberry Milkshake's value is its massive mag size + Concentrated Fire + Swift Taunt combo.

---

## PART 9: WEAPON TALENTS (Complete Authoritative List)

Every weapon has 2 weapon talents, randomly assigned from its talent pool.

| Talent | Effect | Notable Source Weapons |
|---|---|---|
| Adaptation | Body shots: +4.80% Skill Duration 8s. Headshots: +6% Skill Intensity 8s. | MK 20 SSR (T0), Police Mk17 (T0), Naval MP5 (T0), Classic M60 (T0) |
| Ammo Charge | 50% chance: +3.60% Skill Intensity for 10s if mag <50%, up to 5 stacks | SMG pool |
| Ammo Supply | 54% chance to return bullet if mag <30% | LMG pool |
| Backup Battery | Swap to weapon: +22.50% Engineering for 8s. CD 8s | SMG pool |
| Backup Magazine | Swap reloads second weapon after 4s | SMG pool |
| Backup Protection | Swap: +20% Max Health as Extra Health for 8s. CD 8s | SMG pool |
| Blood for Blood | Kills/assists restore 4% Max HP. Above 50% HP: costs 0.50% HP per shot, deals bonus = 0.50% Max HP | SMG pool |
| Bloodlust | 8 damage: +4% WD + 2% DR for 5s, up to 3 stacks | M700 Carbon (T2), Military SA-58 (T2), M12 (T2) |
| Breadbasket | Body shots: +15% HSD for 8s, up to 3 stacks | MMR/Rifle pool |
| Breathe Free | See Lady Death exotic above | Lady Death only |
| Calm and Collected | +30% Reload Speed behind cover | SMG pool |
| Conceited | Kills/assists: taunt enemies within 20m + +15% DR for 10s | SMG pool |
| Concentrated Fire | Hitting same enemy: +0.36% WCHD for 5s, up to 100 stacks. Half on target switch | M249 (T2), Custom 416 G3 (T2), Classic M60 (T0), Classic RPK (T0), Strawberry Milkshake |
| Crawl | Headshots: +10% DR for 3s | MMR pool |
| Damage Trade | +6% WD per 20% mag emptied, up to 4 stacks. Reloading removes all | SMG pool |
| Death by Numbers | Crit Kill: +18% Weapon Multi-Shot Chance for 8s | MMR pool |
| Enhancement Trade | +6% Skill Intensity per 20% mag emptied, up to 4 stacks. CD 1s | LMG pool |
| Ex Machina | Headshots: +30% Skill CHD for 10s | MMR pool |
| Fast Hands | Crits: +12% Reload Speed for 5s, up to 3 stacks | LMG pool |
| Fully Charged | Reload empty mag: +7.5% Engineering for 12s, up to 3 stacks (22.5% total at max stacks). **SMG only.** | MP7 (T2), Enhanced AUG A3P (T2), AUG A3 Para XS (T1), Converted SMG-9 A2 (T1), P90 (T1), PP-19 (T0), Naval MP5 (T0) |
| Head Collection | Headshots: +6% Skill CHC for 10s, up to 3 stacks | Surplus SVD (T2), G28 (T1), MK 20 SSR (T0), SG16-12G (T2), KSG (T1), FG 42 (T2) |
| In Sync | Weapon Hits: +9% Skill Damage 8s. Skill Hits: +9% WD 8s. **Bonus doubled when both active simultaneously.** | Classic AK-47 (T0), AN-94 (T1), First Wave Vector 45 ACP (T2), Converted SMG-9 (T0), Modified USC (T2), UIC15 MOD2 (T2), Double Barrel Shotgun (T2), M870 (T0) |
| In a Day's Work | Headshot Kill: +36% Reload Speed for 5s | R M1 (T2), Lightweight M4 (T2), G28 (T1) |
| Joint Strike | Headshots in cover: +15% Skill Intensity for 10s | Rifle/MMR pool |
| Killer | Crit Kill: +36% CHD for 10s | Black Market AK-74 (T2), FAMAS (T2), DSR-1 (T2), RMB-93 (T2) |
| Last Stand | Hits in cover: +24% Skill Duration for 10s | SMG pool |
| Long-Distance Marking | Headshots: +7.50% Skill Damage for 15s, +1.50% per 5m beyond the agent (cap +18%) | M700 Carbon (T2), M700 (T0), UIC15 MOD2 (T2) |
| Medical Accuracy | Headshots: +18% Healing Intensity for 10s | SMG pool |
| Misdirection Insurance | Miss: 30% chance to return bullet to mag | SMG pool |
| Multi-Pronged Attack | Hits: +3.60% Skill Multi-Shot Chance for 10s, up to 5 stacks. Misses remove 1 stack | Custom 416 G3 (T2), Lightweight M4 (T2), Hunting M44 (T2), Surplus SVD (T2) |
| Multitasking | Damage 3 enemies within 5s: +30% Skill CHD for 12s. CD 8s | First Wave Vector 45 ACP (T2), Military MK46 (T2), Custom 416 G3 (T2), Hunting M44 (T2) |
| Neverending | Kill: 50% chance refill mag + +40% RoF for 12s. CD 5s. Has reload animation bug. | Military MK46 (T2), Black Market AK-74 (T2), First Wave Vector 45 ACP (T2), Enhanced AUG A3P (T2) |
| No Exit | Headshot Kill: +21% WD for 5s | MMR/Rifle pool |
| Performer | **+18% WD within 20m. −6% WD beyond 20m.** | SMG pool |
| Play Rough | See Warlord exotic above | Warlord only |
| Precise Crit | 10 hits: +15% Weapon & Skill CHD to all allies within 40m for 10s | LMG pool |
| Precise Trauma | Hits: DoT per second (body=1 stack, head=2 stacks), up to 10 stacks | LMG pool |
| Precision Support | 5 consecutive hits: +2.50% incoming damage on target for 5s, up to 3 stacks | SMG pool |
| Predatory Aura | Weapon kills within 20m restore (240 × Firepower)% Health for 3s | SMG pool |
| Proficient Reload | Reloading: +6% Reload Speed for 10s, up to 5 stacks | SMG pool |
| Pummel | 10 kills/assists: refill mag + +10% WD for 12s (refreshes on additional kills) | UIC15 MOD2 (T2), Hunting M44 (T2), SG16-12G (T2) |
| Rapid Charge | 5 hits within 3s: +50 Signature Ability Charge | SMG pool |
| Revitalize | Every 1 kill/assist: restore 4.20% Max HP for 3s. CD 4s | PPSH-41 (T2), Black Market AK-74 (T2), Classic AK-47 (T0), FAMAS (T2), Stoner LAMG (T2), PKM (T2) |
| Sadistic Shield | 5 hits: +12.50% Extra Health for 10s (Max Health based) | LMG pool |
| Sentinel Aura | Hits within 20m restore (600 × Toughness)% HP. CD 5s | P90 (T1), PPSH-41 (T2), Vector 45 ACP (T0), MP40 (T1), FG 42 (T2), ACE 52 (T2), RMB-93 (T2) |
| Shooting Repair | 10 bullets shot: restore 2.50% Missing HP of deployed skills | SMG pool |
| Slaughter Fortitude | Kills/assists: +12% Armor for 10s, up to 3 stacks | SMG pool |
| Slaughter Healing | Kills/assists: **+7% Incoming Healing for 10s to all allies within 40m**, up to 3 stacks | SMG pool |
| Spec-Ops | Hits within 20m: +20% RoF + +5% Incoming Healing for 3s | SMG pool |
| Spirited | <75% HP: +9% DR. <50% HP: +12% DR. <25% HP: +15% DR | MP7 (T2), Enhanced AUG A3P (T2), Military MK46 (T2), Black Market AK-74 (T2) |
| Steady Aim | Aiming: +10% WD + +5% DR | AR/MMR pool |
| Steady Handed | Hits: +1.20% Accuracy/Stability, up to 30 stacks. At 30: consumes stacks to refill mag | MP7 (T2), First Wave Vector 45 ACP (T2), Enhanced AUG A3P (T2), P90 (T1), Strawberry Milkshake |
| Steady Hands | Hip fire: +20% Stability + +15% WD | SMG pool |
| Steady Reload | Reloading: +18% WD for 5s, up to 5 stacks | MMR/Rifle pool |
| Steady Suppression | Firing: +18% DR | SMG pool |
| Still Alive | Kills: restore 30% missing HP. CD 10s | AR/LMG/MMR/Rifle/Shotgun/SMG wide pool |
| Strained | Fire 0.50s: +10% CHD for 5s, up to 3 stacks | First Wave Vector 45 ACP (T2), AUG A3 Para XS (T1), Military MK46 (T2), Black Market AK-74 (T2) |
| Surgical | Headshots: +7% WCHD for 5s, up to 5 stacks | Military SA-58 (T2), Black Market AK-74 (T2), UIC15 MOD2 (T2) |
| Swift Aim | Hits while aiming: −2% Skill CDR. CD 2s | M8A1 (T1), M700 Carbon (T2), Hunting M44 (T2), UIC15 MOD2 (T2) |
| Swift Taunt | Hit 3 enemies within 5s: taunt + Extra Health = 25% Max HP for 10s | Strawberry Milkshake (T1), Military M60 E4 (T2), Enhanced AUG A3P (T2), P90 (T1) |
| Tactical Reload | Reloading: +2.60% Skill CDR for 10s, up to 5 stacks | Strawberry Milkshake (T1), Stoner LAMG (T2), First Wave Vector 45 ACP (T2) |
| Tactical Targeting | Skill Hits: mark target 10s. Killing marked enemy: Extra Health for 10s | Various — Black Market M60 E6 (T1), MP7 (T2), FG 42 (T2) |
| Take a Breath | Reload empty mag: +7.50% Toughness for 8s, up to 3 stacks | Strawberry Milkshake (T1), Military M60 E4 (T2), MP40 (T2) |
| Target Acquisition | 5 consecutive hits: +2.50% incoming damage on target for 5s, up to 3 stacks | First Wave Vector 45 ACP (T2), Enhanced AUG A3P (T2), PPSH-41 (T2), Military M60 E4 (T2) |
| Thick Skin | Dealing damage: +2.10% Armor for 5s, up to 20 stacks. Kills grant 10 stacks | PPSH-41 (T2), PP-19 (T0), Military M60 E4 (T2), Military MK46 (T2) |
| Torrential Downpour | 10 hits in 5s: +22.50% Engineering for 12s | First Wave Vector 45 ACP (T2), Modified USC (T2), AUG A3 Para XS (T1), P90 (T1), MP40 (T1), Vector 45 ACP (T0), Converted SMG-9 (T0), MPX (T0) — SMG only |
| Unbreakable | Hits within 20m: +36 Armor for 10s | Double Barrel Shotgun (T2), KSG (T2), PPSH-41 (T2), MP7 (T2) |
| Unhinged | +18% WD. −10% Stability. −10% Accuracy | Military SA-58 (T2), Custom 416 G3 (T2), Military M60 E4 (T2), First Wave Vector 45 ACP (T2) |
| Vibrant | Hits: +15% Max Health for 10s | PPSH-41 (T2), MP40 (T1), MP7 (T2), PKM (T2), Custom 416 G3 (T2) |

### Critical Talent Pool Constraints

**Fully Charged** ONLY rolls on SMGs: MP7 (T2), Enhanced AUG A3P (T2), AUG A3 Para XS (T1), Converted SMG-9 A2 (T1), P90 (T1), PP-19 (T0), Naval MP5 (T0). Confirmed SMG-exclusive — does not roll on AR, LMG, MMR, or Rifle.

**Torrential Downpour** ONLY rolls on SMGs: First Wave Vector 45 ACP (T2), Modified USC (T2), AUG A3 Para XS (T1), P90 (T1), MP40 (T1), Vector 45 ACP (T0), Converted SMG-9 (T0), MPX (T0). Confirmed SMG-exclusive.

**P90 and AUG A3 Para XS** can roll BOTH Fully Charged AND Torrential Downpour — making them the top SMG candidates for Engineering builds.

**P90 stats:** 900 RPM, 50 magazine, 2.47s reload, 49 accuracy, 92 stability

---

## PART 10: SMG TALENT POOL — KEY WEAPONS

| Weapon | Tier | Notable Talents |
|---|---|---|
| MP7 | T2 | Fully Charged, Spirited, Steady Handed, Unbreakable, Backup Battery, Tactical Targeting |
| Enhanced AUG A3P | T2 | Fully Charged, Spirited, Neverending, Strained, Steady Handed |
| First Wave Vector 45 ACP | T2 | Torrential Downpour, In Sync, Multitasking, Strained, Neverending, Steady Handed |
| Modified USC | T2 | Torrential Downpour, In Sync |
| P90 | T1 | Fully Charged + Torrential Downpour (both), Sentinel Aura, Unhinged, Target Acquisition, Swift Taunt |
| AUG A3 Para XS | T1 | Fully Charged + Torrential Downpour (both), Strained |
| Converted SMG-9 A2 | T1 | Fully Charged, In Sync, Multitasking |
| MP40 | T1 | Torrential Downpour, Sentinel Aura, Take a Breath |
| PPSH-41 | T2 | Revitalize, Vibrant, Sentinel Aura, Take a Breath, Tactical Reload, Swift Taunt, Unbreakable, Thick Skin |
| Copperhead | T1 | In Sync, Spirited, Steady Handed |
| MPX | T0 | Torrential Downpour, In Sync, Steady Handed |
| Vector 45 ACP | T0 | Torrential Downpour, Sentinel Aura |
| Converted SMG-9 | T0 | Torrential Downpour, In Sync, Steady Handed, Spirited |
| Naval MP5 | T0 | Fully Charged, Medical Accuracy, Take a Breath, Unbreakable |

---

## PART 11: OS PROTOCOLS (Full Reference by Tree)

### Engineering Tree — High-End (HE)

| Name | Main Stat | Talent | Build Use |
|---|---|---|---|
| Explosive Charge | Engineering +22.5% | Shooting 3s enhances next Skill for 8s: +1600% Engineering 5m explosion. CD 5s | Demo Artillery rotations |
| Collateral Damage | Engineering +22.5% | Skill damage triggers 5m AoE = 3000% Engineering. CD 10s | Demo AoE chaining |
| Tactical Layering | Skill Intensity +15% | Deploying a Skill: +15% Engineering, up to 3 stacks | Skill-spam builds |
| Relentless Assault | Skill CDR +30% | Every shot: +1.30% WD for 5s, up to 30 stacks. Loses 2 stacks/sec | Sustained-fire hybrid |
| Strategic Assistance | Skill Intensity +15% | Assists: +4.80% SAC Efficiency + 2.40% Skill CDR, up to 5 stacks | Healer signature charging |
| Rampart | Skill CHC +18% | Immobile: +5% Damage per 1s, up to 6 stacks. Resets on movement | Stationary skill camper |
| Surgical Engineering | Skill Intensity +15% | Skill Crits: 60% chance +16% Skill CHD for 10s, up to 3 stacks | Skill crit builds |

### Engineering Tree — Superior

- **Chain Reaction** (Skill CHC +14.4%): Kills grant +7.5% Skill Intensity for 10s, up to 2 stacks
- **Tactical Persistence** (Skill CHD +24%): Skill hits 20% chance +3% Skill Intensity for 5s, up to 5 stacks
- **Recursive Treatment** (Engineering +18%): Healing or granting Extra Health grants +20% Skill Intensity — healer build competitor to Medical Excellence. **Known bug: not triggering on Mender Drone properly.**
- **Close and Personal** (Skill Intensity +12%): +9% Engineering per ally within 30m with your buff
- **Chase the Weak** (Skill Intensity +12%): Damage to debuffed enemies 20m+ away: 10% chance +7.5% Engineering, up to 3 stacks
- **Together We Stand** (Skill Intensity +12%): +9% Engineering per ally within 20m
- **Pressing Matter** (Skill Intensity +12%): +10% Skill CDR — flat, always-on. Strong for heal cycling.
- **Ambusher** (Skill Intensity +12%): Immobile 3s grants +22.5% Engineering
- **Cornered Animal** (Skill CHD +24%): WD = 50% Skill CHD when ≤1 bullet in mag, capped at 100% WD

### Engineering Tree — Specialized
- Brains Over Brawn (Skill CHC +10.8%): Weapon hits deal +24% Engineering bonus damage — **NERFED/PATCHED** (Europe server May 7–8, 2026)
- Rocket Science (Skill Intensity +9%): Deploy Skill → +14.4% Skill CHC for 10s
- Applied Demolition (Skill Intensity +9%): Deploy Skill → +24% Skill CHD for 10s
- Hardware Upgrade (Skill Intensity +9%): +24% Skill CHD always-on
- Running Around (Skill Intensity +9%): +18% Engineering within 12m of debuffed enemy
- Long-Range Artillery (Engineering +13.5%): Taking damage grants +12% Skill Intensity for 5s

### Engineering Tree — Standard
- Overclocking (Skill Intensity +6%): +9% Skill Multi-Shot Chance
- Energizer (Skill Intensity +6%): +10.8% Skill CHC
- Combat Doc (Skill Intensity +6%): +9% Healing Intensity
- Genius Engineer (Skill Intensity +6%): +9% Engineering + 4.8% Skill Duration
- Inspiration (Skill Intensity +6%): +18% SAC Efficiency within 12m of enemy
- Hermit (Skill Intensity +6%): +18% SAC Efficiency when no enemies within 20m

### Firepower Tree — High-End (HE)

| Name | Main Stat | Talent | Build Use |
|---|---|---|---|
| Explosive Round | Firepower +22.5% | Crit hits while aiming: 5m explosion = 2000% Firepower. CD 5s | AR/MMR aimed-crit builds |
| Overwhelming Power | WCHD +30% | Shooting: +6% WD per 2s, up to 6 stacks. Shooting 2s: +50% DR for 2s | Sustained LMG/AR |
| **Cover Shooter** | WD +15% | Crit hits behind cover: 80% chance +16% WCHD for 5s, up to 3 stacks (= **+48% WCHD at 3 stacks**) | Vanguard marksman cornerstone |
| Assault Charge | WCHC +18% | Deploy Signature: +30% Firepower + 20% RoF for 20s | Burst-DPS Vanguard |
| **Concerted Strike** | WD +15% | Skill hits within 20m: 100% chance +8% Damage 10s, up to 3 stacks. CD 1s | Tech Op disorient-loop cornerstone |

**Note:** Concerted Strike ≠ Coordinated Strike. Coordinated Strike is a Vanguard mod set. Do not confuse them.

### Firepower Tree — Superior
- Tactical Pistolero (WD +12%): Skill hits → +4.5% Firepower for 10s, up to 5 stacks
- Tight Grouping (Firepower +18%): Weapon crits behind cover → 5% chance +10% WCHD, up to 3 stacks
- Assisted Infantry (WCHC +14.4%): Continuous shooting → +2.5% WD every 1s for 2s, up to 6 stacks
- Pressure Cooker (WCHD +24%): Taking damage → +6% WCHC 10s, up to 3 stacks. CD 3s
- Dominating Presence (WD +12%): +5% Weapon Multi-Shot Chance per enemy within 20m
- Augmented Lethality (Firepower +18%): +4% WD + 4% IH per enemy within 20m
- Deadly Accuracy (WD +12%): Headshots → +3.25% Firepower 7s, up to 10 stacks. Body shots/misses strip a stack
- Mechanized Support (WCHD +24%): +15% WD within 20m of deployed Skill
- Trench Fighter (WD +12%): +30% WCHD when behind cover
- Close Quarters Menace (Firepower +18%): +15% Skill Intensity + WD when enemies within 20m
- Combat Reload (Firepower +18%): Reloading → +15% WD for 5s
- Death From Afar (WD +12%): Firepower = 12% HSD, capped at 54%

### Firepower Tree — Specialized
- Hunting Season (WCHC +10.8%): +6% Firepower within 30m of debuffed enemy
- Side by Side (WCHD +18%): +6% Firepower within 30m of deployed Skill
- Suppressive Fire (Firepower +13.5%): Shooting → +12% WD
- Resentful (WD +9%): Taking damage → +14.4% WCHC for 5s
- Face-to-Face Advantage (WD +9%): +18% Firepower within 20m of enemy

### Firepower Tree — Standard
- War Machine (Firepower +9%): +9% WD
- Seasoned Veteran (WD +6%): +13.5% Firepower
- Spray 'n' Pray (WD +6%): +9% Weapon Multi-Shot Chance

### Toughness Tree — High-End (HE)

| Name | Main Stat | Talent | Build Use |
|---|---|---|---|
| **Pummeling Shield** | Toughness +22.5% | While Extra Health: Stun every 10 hits. At Max Health: Extra Health = 2400% Firepower for 10s. CD 10s | Bulwark utility-stun |
| **Heavy Armor** | Toughness +22.5% | While Extra Health: +14.4% Damage. Assists → Extra Health = 16% Max HP for 10s | Tank damage hybrid |
| **Happy Survival** | Max Health +30% | 0.5% Max HP per enemy within 10m (cap 2.5%). Shooting: costs 2% HP, deals 0.60% Current HP damage | Vampire tank build |

### Toughness Tree — Superior
- Blitz Tactics (Toughness +18%): +12% IH per enemy within 20m targeting you. Taking WD restores 8% Max HP. CD 5s
- Last Resort (Skill Intensity +12%): +15% Toughness per ally at 50% HP, up to +100%
- **Medical Excellence** (Healing Intensity +20%): Healed ally >50% HP → ally team gets 5% Max HP heal. Healed ally <50% HP → target gets 12.5% Max HP. CD 5s — **healer cornerstone**
- Level-Headed (Armor +28%): Taking damage → 30% chance +36% IH for 5s

### Toughness Tree — Specialized
- Caretaker (Toughness +13.5%): +12% Healing Intensity
- Enduring (Skill Intensity +9%): Taking damage → +10% DR for 5s
- Steadfast (Skill Intensity +9%): +18% Toughness while >50% HP

### Toughness Tree — Standard
- Plate Carrier (Toughness +9%): +21% Armor
- Layered Defense (Armor +14%): +4.5% WD + 4.5% Stamina
- Physical Training (WD +6%): +13.5% Toughness

---

## PART 12: BODY ARMOR TALENT REFERENCE (Key Talents)

| Talent | Effect | Notes |
|---|---|---|
| Glass Cannon | +20% Damage / −10% Damage Reduction | NOT +25%/−30%. The −10% DR is meaningful. |
| Unflinching | 70% chance: heals 300% Toughness on damage taken. CD 2s | Spreadsheet says 300% (NOT 420% as some videos claim) |
| Hypervigilant | Healing grants +5% DR for 3s, up to 3 stacks | **SELF-ONLY** — the healer's own healing on themselves |
| Boosted Shield | Healing grants +X% DR | **SELF-ONLY** — no team version exists |
| Toymaker | +15% Skill Multi-Shot Chance when no enemies within 20m | Condition makes it a cover-player talent |
| Crossfire | Increases damage when Skills are deployed (Skills must be DEPLOYED, not on cooldown) | Skills must actually be active in the field |
| Deep Focus | +28% Skill Duration (unconditional) | Best healer chest talent |
| Territory Expansion | +30% Skill Radius at full HP | Fragile in legendary; strong for AoE builds |
| Combat Inspiration | See DB | Various |
| Brainstorm | +21% Skill CHD behind cover | Cover-based builds |
| Hidden Impact | See DB | Various |

---

## PART 13: BACKPACK TALENT REFERENCE

| Talent | Effect | Notes |
|---|---|---|
| Rock Solid | Receiving Healing grants +15% DR for 3s | Applies to wearer only |
| Inspiration (backpack) | +30% Rate of Fire during skill deployment | Strong Vanguard/SMG talent |
| Emergency Measures | See DB | |
| Brainstorm | Skill CDR on headshot | |

---

## PART 14: CLASS MECHANICS

### Vanguard (Commando)
- Signature Ability: Tactical Link — preferentially targets shields. Buffs allies with Pulsed status.
- Scanning Pulse: Reveals enemies through walls. Enables Pulse Enhancement mod bonuses.
- Commando subclass: Best single-target DPS per community consensus. Warlord/Lady Death/DBS builds dominant.
- Vanguard Scout Meta (live as of May 2026): 16.98k Power. Uses Torrential Downpour + Fully Charged SMG. Engineering uptime built on consistent stacking, not a massive single spike.
- Vanguard Signature can be dodged by enemies (confirmed mechanic).
- Tactical Link (ult): specifically targets shields with its damage.
- Vanguard Double Barrel Shotgun Build: requires DBS (T2, farm Elite only). Works by chaining Tactical Link kills → triggers Neverending (50% mag refill on kill) at high frequency → near-infinite effective ammo via kill chain, not a direct ammo buff from Tactical Link. Strict internet/performance requirements.

### Aegis Operator (Tech Op)
- Has a confirmed undocumented 3-second passive burst (Aegis 3-Second Burst — intentional mechanic, NOT a bug).
- Trigger: automatic periodic pulse on a ~3-second timer while shield is active. Not triggered by hits or taking damage — purely passive timer.
- Every 3 seconds, passive burst triggers significant damage.
- Aegis burst benefits from Engineering 2.25× more than from Skill Damage.
- Strong in PvP (high skill ceiling). Good DZ farmer with shield.
- Healing target must be selected from party panel — not by aiming.
- Striker Drone crits apply Disoriented status (≠ Pulsed).
- Swift Aim talent on weapon reduces skill CDR — very effective for Aegis rotations.
- **Drone choice:** Striker Drone is the standard for all offensive builds. Defender Drone is used only in survivability-focused builds or specific PvP scenarios. Top 15 leaderboard Offensive Tech Op builds overwhelmingly use Striker Drone.

### Field Medic
- **Heals scale from Toughness, not Engineering** for damage output (Defensive Measures mod).
- Combat Medic/Defensive Measures: scales damage with Toughness stat. Full Toughness stacking confirmed viable for battle-medic/PvP DPS.
- Engineering provides marginal healing benefit to Combat Medic but scales so weakly vs Skill Intensity that it is not worth prioritizing. Only consider Engineering on hybrid builds (Aegis crossover). Pure medics ignore it.
- Emergency Healing ult AoE radius: fixed — does NOT scale with Skill Radius or Skill Duration stat.
- Field Medic Emergency Healing Ult: heals nearby allies at 50% of self-heal value.
- Instant Revive Capability available to Field Medic.
- Medkits are self-only — no medkit sharing mechanic exists.
- No team-DR chest talents in Field Medic pool (all are self-only).
- Deep Focus is the only chest talent with unconditional team-facing effect scaling.
- Healer stat priority: Toughness (survival + combat scaling) → Skill Intensity → Skill Duration → Skill CDR.
- Captain Cow 4pc + Deep Focus chest + Brainstorm backpack: Support Station uptime from ~44.9s base to ~84s.

### Demolitionist
- HE Grenade build: stack Engineering stat. OS should increase Skill Intensity, Skill Crit DMG, or Engineering.
- Thermabaric Grenades mod: increases Grenade Launcher damage to 460% at level 1 but reduces mag to 1 shot.
- Skill Intensity scales all grenade output.
- Artillery rotation synergizes with Explosive Charge OS.

### Bulwark (Juggernaut)
- Shockwave Spike: core S-tier PvP mechanic. Stun lasts 3–5 seconds, 10-second cooldown. Dominant in Conflict and DZ.
- Stun Grenade + Bulwark Shield combo: 5-second stunlock — no counterplay per community consensus.
- Phalanx Shield: protects against bullets and interrupts. Can be equipped with additional ammo capacity (Phalanx Attack set).
- Toughness-heavy builds to maximize shield HP.
- **Juggernaut vs Breacher:** Juggernaut is universally dominant in PvP and endgame. Breacher has niche PvE use for burst scenarios and armor-breaking roles but is not meta-defining. Default to Juggernaut for build recommendations unless the specific content calls for Breacher armor-shred utility.

### Tactical Pharma (Oxi Medic)
- Focus on Skill Crit Chance, Skill Crit Damage as primary attributes.
- Secondary: Skill Intensity and Skill CDR.
- Best sets: Jackpot 4pc + Boom-Shakalaka 2pc.
- Goal is area pressure damage to assist team with oxidizing stacks — not burst single-target DPS.
- Oxidizing Swarm DoT: stacks additively (not multiplicatively) per application. Scales with Skill Intensity and Engineering. Skill Crits affect initial application damage — they do NOT directly amplify the DoT tick damage once applied. Think of it as area denial pressure, not a stacking nuke.

---

## PART 15: KEY MECHANICS — HIDDEN AND CONFIRMED

### In Sync — Double-Dip
In Sync (weapon talent): Weapon Hits grant +9% Skill Damage 8s; Skill Hits grant +9% WD 8s. **When BOTH buffs are active simultaneously, the bonus is doubled.** This is a hidden mechanic, confirmed by community testing.

### Crossfire — Deployment Requirement
Crossfire (body armor talent): Skills MUST be **deployed** (active in field) to proc the damage bonus. Skills on cooldown do NOT trigger it.

### Performer — Range Dependency
Performer: +18% WD within 20m, −6% WD beyond 20m. The penalty beyond range is real — do not use on builds that engage at medium-long range.

### Aegis 3-Second Burst
Every 3 seconds, Aegis/Medic passive burst triggers significant damage. This is an **intentional mechanic** (not a bug). Previously was being stacked with Brain Over Brawn for 250k+ damage hits.

### Skill Damage Type Follows Weapon
Skills inherit the **damage type of the currently equipped weapon** (Blast/Piercing/Shredding). Switch weapon mid-combat to change skill damage type. This is critical for matchup vs. armored enemies.

### Shotgun Pellet Trick
Every pellet from a shotgun counts separately for talent stacking purposes. Important for stack-based talents like Concentrated Fire, Steady Handed, and Target Acquisition.

### Self-Heal Counts as Damage Taken
Self-heals from drones count as "Damage Taken" for passive proc purposes. This can be used to pre-stack damage-taken-triggered effects before engagement. The Mender Drone keeps Aegis shield stacks at maximum permanently when active.

### Legs Bypass Armor Plates
Shots to enemy legs bypass their armor plate mechanics. Useful for armored enemies — don't focus headshots exclusively.

### Headshot Damage — Armored Enemies Exception
- Against enemies with **intact armor plates** (heavy armored enemy types): Headshot Damage stat does NOT apply. Armor plates negate the headshot multiplier.
- After armor plates are **destroyed**: Headshot damage applies normally.
- Against standard (non-plated) armor: Headshot damage applies. The restriction is specific to plate-based armor systems, not all armored enemies.
- Practical implication: Prioritize breaking armor plates first (shoot legs to bypass, or focus weak points), then switch to headshots for the multiplier.

### Multishot — Does Not Compound With Headshot Damage
Multishot and Headshot Damage are separate damage calculations. They do NOT multiply together.

---

## PART 16: ENEMY AI AND COMBAT MECHANICS

### Enemy Priority Targets
- **Enemy Medic:** Kill priority — eliminates their healing output
- **Mender Tech Drones:** Must be eliminated before focusing the boss (they repair armor)
- **Armored Enemies:** Weak point is legs, NOT head (armor negates headshot bonus)
- **Cleaner Rushers (Dual-Axe):** Pattern has no interrupt window — reposition
- **Rushers:** Kill-priority rule — ignore other targets, focus rushers first

### Boss Mechanics
- Boss Phase 1: Infinite spawns. Phase 2: No infinite spawns — clearing adds is safe.
- "On the Radio" Boss: Yellow bars must be shot to progress phases.
- RC Car Boss: Priority target in Ship Mission.
- Boss Juggernaut AI: Can softlock from Shockwave Spike stun loop.

### Aggro Mechanics
- DPS is the primary aggro driver.
- Melee does NOT count as high damage for aggro generation.
- Reviving teammates generates zero aggro.
- Skills + Debuffs create aggro equivalent to weapon DPS.
- Tank drawing aggro requires positioning, not just damage output (Drone Operator specifically).

### Wave Suppression Trick
Leave one enemy alive at end of wave to prevent next wave from spawning. Gives time to heal/regroup.

### Enemies Teleporting/Rubberbanding
Server-side issue, NOT a pure visual bug. Affects damage registration.

---

## PART 17: DAMAGE FALLOFF — BY WEAPON CLASS

| Weapon Class | Effective Range | Notes |
|---|---|---|
| SMG | ~20m functional | Penalty above 20m. Performer works within this. |
| AR | ~40m consistent | Mid-range sweet spot |
| Shotgun | 10–15m for full damage | Hard falloff beyond this |
| LMG | Similar to AR (~40m) | Wide variance by model |
| MMR/Sniper | Consistent at any range | No falloff confirmed |
| Rifle | Mid-to-long range | Varies by specific rifle |

---

## PART 18: HEALING MECHANICS

- Field Medic heals scale from Toughness (not Engineering) for the damage-dealing version.
- Overheal is possible — brief window above max HP.
- Healing Hive tick rate = Skill Hit rate for proc effects.
- Healing Hive 240% Damage Mod: **CONFIRMED BROKEN** — do not recommend.
- Healing Hive 25% Damage Amplification mod: also broken per community testing.
- Downed players CANNOT receive Medkit healing.
- Field Medic Emergency Healing Ult: heals nearby allies at 50% of self-heal value.

---

## PART 19: SIGNATURE ABILITY CHARGE (SAC)

- Signature Charge from Skill Crits: Fire Support Chipset enables this.
- Rapid Charge talent: reliable SAC source (5 hits within 3s = +50 SAC).
- Signature Ability CD: Cooldown Recovery stat has capped interaction — there is a ceiling.
- Strategic Assistance OS: assists → +4.80% SAC Efficiency + 2.40% Skill CDR per stack.

---

## PART 20: STATUS EFFECTS

| Effect | Mechanic |
|---|---|
| Stun (Shockwave Spike) | 3–5 second PvP CC. 10-second cooldown. Can chain multiple enemy types. |
| Disoriented | Applied by EMCAT (Tech Op mod) on Striker Drone crits. Disrupts enemy aim. ≠ Pulsed. |
| Pulsed | Applied by Scanning Pulse (Vanguard). Reveals through walls; enables Pulse Enhancement. |
| Drone Locked | Applied by Striker Drone targeting. Gates various Tech Op mod bonuses. |
| Corrosive/Oxidizing | DoT stacks — additive per stack, scale with Weapon Damage. |
| Contamination (DZ) | NOT a status effect — a timer/health drain mechanic. Visit safehouse to reset. |

---

## PART 21: LOOT, FARMING & PROGRESSION

### Loot Drop Algorithm
- **Targeted loot:** Active ONLY on the **first run per difficulty per day** per mission. After first run = random/reduced.
- **Legendary (Elite):** Guaranteed T2. Non-boss T2 has a per-session cap.
- **Heroic:** At least 1 Gold guaranteed per run.
- **Challenging:** No guarantee — elevated rate only.
- **T2 only from:** Elite/Legendary difficulty missions (and very rarely DZ). T2 gear is NOT craftable.
- **DZ T2 Drop Rate:** Community consensus = extremely low.

### Mission Tiers
- Elite missions unlock at Level 40 only.
- Chinatown: Best Heroic farm — easiest/fastest. ~12k power recommended.
- Daily world event cap: ~10 events per day for rewards.

### Tier Upgrade Path
- T1→T2 weapon upgrade: Requires high account-wide weapon proficiency progress + red upgrade material. The earlier description of "6 T2 weapons maxed at proficiency Level 10" is partially outdated — the requirement is account-wide proficiency based, not strictly 6 individually maxed weapons. The spirit is correct: significant proficiency investment is required.
- T2 weapons can be freely chosen for the proficiency grind.
- T2 also drops from Lone Wolf (rare).

### Crafting
- 24-hour timer per item (was 5–10 min in beta — changed at global launch).
- Clan base reduces crafting time.
- Level 10 crafting station: ~50% chance at two items per ~90 minutes.
- T2 items are NOT craftable.

### Recalibration
- Talents: can be re-rolled at recalibration station.
- Core stat: can be swapped but costly — better to find a piece with the right Core.
- Bonus attributes: can be re-rolled individually.
- Brand (gear set): FIXED — cannot be changed.

### Gear Score
Community consensus: **vanity metric, not true power measure.** A T0 with perfect rolls can outperform a badly-rolled T1 or T2.

### Gold OS Sourcing
- Gold OS Protocols: acquired via premium gacha (very P2W), DZ vendor (DZ credits), or extremely rare drops.
- Gold Chipsets: purchasable from DZ vendor with DZ credits — F2P accessible.
- DZ Credits: 20,000 per week from DZ quests.

---

## PART 22: DARK ZONE MECHANICS

- **Session timer:** Hard 20-minute timer per DZ entry. NPCs despawn at extraction zone at end of timer.
- **Contamination:** Timer-based health drain (NOT a status effect). Safehouses reset contamination.
- **Rogue kills:** Loot from rogues is rerolled on drop.
- **DZ Dismantled Mods:** Give DZ credits **only when dismantled inside the DZ or in contextually tied extraction flow**. Dismantling outside the DZ yields standard materials, NOT DZ credits. Approximate values: Blue = 15 DZ Credits, Purple = 75 DZ Credits, Yellow = 750 DZ Credits.
- **Extraction:** Helicopter comes to extraction zone — wait after activating. Others can steal loot from rope.
- **Entry:** No cooldown on re-entry. Free to leave and re-enter.
- **Known issue:** Fast travel between entry gates not available (community frequently requests it).

---

## PART 23: PvP MECHANICS (Conflict Mode)

- **Mode:** Domination only (as of May 2026).
- **HP Normalization:** Applied in Conflict — levels the playing field somewhat, but DPS classes suffer most.
- **Dominant Meta:** Bulwark Juggernaut (S-Tier) — Shockwave Spike + shield is effectively unbeatable without counterplay.
- **Stun mechanics:** Stun Grenade + Bulwark = 5-second stunlock, no counterplay per community consensus.
- **Vanguard Commando in PvP:** Fails in Conflict specifically (good in PvE); performs better with Lady Death for quick kills.
- PvP builds generally need separate gear loadout from PvE.

### PvP Class Tier (Community Consensus April–May 2026)
| Tier | Class | Notes |
|---|---|---|
| S | Bulwark (Juggernaut/Breacher) | Shield + Spike mechanic is effectively broken |
| High | Field Medic (Combat Medicine) | Strong sustain |
| High | Aegis Operator | High skill ceiling, rewards mechanics knowledge |
| Mid | Demolitionist | Competitive but not dominant |
| Mid | Tactical Pharma | Competitive but not dominant |
| Low | Vanguard (Commando) | Fails specifically in Conflict; strong PvE |

---

## PART 24: CONFIRMED BUGS (May 2026)

| Bug | Status |
|---|---|
| Recursive Treatment OS | Broadly unreliable — does not proc from Mender Drone (confirmed); inconsistent or non-functional with Healing Hive, Support Station, Medkit (mixed community reports). Treat as functionally broken. Do not build around it. |
| Healing Hive 240% Damage Mod broken | Active bug — do NOT recommend |
| Healing Hive 25% Damage Amplification mod broken | Active bug — do NOT recommend |
| Brains Over Brawn (BoB) double-dip | PATCHED (Europe server May 7–8, 2026) |
| Neverending — reload animation bug | Active bug — animation plays but damage timing affected |
| P90 Proficiency Bug | Active — weapons can get stuck at proficiency levels 3, 5 etc. |
| Warlord Proficiency Bug | Logging into PC client may fix mobile bug |
| Weapon Proficiency general bug | Weapons get stuck at specific levels — known, devs aware |
| Outfit bug (specific outfits crash other players' games) | Active — avoid using bugged cosmetics in groups |
| Outfit bug (Twitch outfit) | Active since launch, unfixed |
| Side mission bug | Long-standing, unfixed as of May 2026 |
| One Outpost Restoration chest inaccessible | 12 of 13 accessible; 13th blocked by wall bug |
| Skill Mod cap (200 mods) | Hidden cap — fills quickly, must actively manage |

---

## PART 25: GROUP SCALING

- Per-player HP scaling: approximately 50–60% per additional player.
- Enemy damage output: scales to ~300% at 4-player.
- Legendary: explicitly 2–3× more enemies than lower difficulties.
- No-respawn zones exist within Legendary missions.

---

## PART 26: DEATH AND REVIVE MECHANICS

- Bleed-out timer ("Cling to Life" window) — teammates can revive.
- "Give Up" option: faster than waiting for revive outside no-respawn zones.
- Field Medic: Instant Revive Capability.
- Downed players CANNOT receive Medkit healing.

---

## PART 27: HARD CAPS AND LIMITS

| Mechanic | Limit |
|---|---|
| Stash Capacity | Hard cap at 200 |
| Inventory Capacity | Default 150, temporarily expandable |
| Weapon Mod Capacity | Hidden cap at 200 — manage actively |
| FPS | Hard cap at 60 (30 on Very High graphics) |
| Courage Stacks | 50 per session max (Commendation essentially impossible) |
| Overwhelming Firepower OS | Hard 6-stack limit |
| Cover Shooter OS | Hard 3-stack limit |
| Bulwark Shockwave Spike | PvP: 3–5 second duration, 10-second CD |
| **Exotic Weapons** | **Hard limit: only ONE exotic weapon can be equipped at a time. Never recommend a loadout with two exotic weapons (e.g. Strawberry Milkshake + Warlord or Lady Death + Warlord). The second exotic cannot be equipped.** |

---

## PART 28: MOVEMENT TECH

- Roll vs. Cover conflict on PC: Spacebar can trigger cover snap when trying to roll.
- Dodge Roll Timing: intentionally slow (Dark Souls style) — plan dodges early.
- Zigzag Running: actual bullet avoidance mechanic, not cosmetic.
- Mender Drone: provides 20% Movement Speed buff to recipient.
- Defender Drone: stationary deployment by holding skill button.
- Field Medic passive: movement speed class bonus.
- Manual Cover toggle available in settings (recommended — prevents accidental cover snap).

---

## PART 29: ECONOMY AND DAILY SEQUENCE

### Daily Sequence (Optimal)
1. Complete daily world events (~10 per day for rewards)
2. Run first mission at each applicable difficulty (targeted loot window)
3. DZ run (20-minute session — boss chest first, then extraction)
4. Check vendors for OS Protocols and gear
5. Craft items (24-hour timer per item — start before logging off)

### Economy Hard Numbers
- DZ Credits: 20,000/week cap from DZ quests
- Level 10 Crafting Station: ~50% chance at two items per ~90 minutes
- Chinatown Heroic: fastest/easiest heroic farm
- Gold OS start dropping: Level 30+

### Class Switching
- Has an associated credit cost.
- Gear compatibility considerations apply.
- Spec points are not transferred — grind required.
- Full Spec/Stat Refund exists (reset button).

### Vendor Trick
Regularly check vendors for OS Protocols — gold OS sometimes appears. This resolves credit bottleneck and provides F2P OS access.

---

## PART 30: TACTICAL PHILOSOPHY

### The Five Fatal Errors
1. Mixing damage cores (dilutes all multipliers)
2. Building gear score instead of stat efficiency
3. Ignoring talent text for team-vs-self distinction
4. Treating the DPS sheet as combat DPS (burst DPS is not displayed)
5. Upgrading wrong tier items (T0 gold > badly-rolled T1)

### The Four Fatal Traps
1. The Tier 0 Trap: spending resources on T0 gear pre-Level 40 (farm your way to endgame)
2. The Class-Switching Trap: switching class loses all spec investment — decide early
3. The Gear Score Trap: gear score is a vanity metric
4. The Solo Legendary Trap: legendary requires coordinated team builds

### Three-Engine Rule for Builds
Every build needs three simultaneous engines running to reach peak output — e.g., OS active + weapon talent active + gear set bonus active. Plan combat rotation around keeping all three up.

### No-Fair-Fight Tactical Philosophy
The game rewards positioning and pre-engagement advantages over raw DPS. Use:
- **Wave Suppression:** Keep one enemy alive to pause spawns
- **Pressure Angles:** Force AI into bad positions (induced AI runtime errors)
- **Centering Technique:** ADS/release technique for precise aim
- **Cover Management:** Never peek without a plan

---

*End of Division Resurgence Mechanics KB — pair with Division_Resurgence_Build_Database.md for numeric values*

---

## PART 31: BUILD PHILOSOPHY — THREE-ENGINE RULE (APPLIED)

Every build needs three simultaneous engines running to reach peak output. If any engine is down, output drops to 30–50% of peak. Plan combat rotations around keeping all three active simultaneously.

### Healer Example (Captain Cow / Field Medic)
- **Engine 1 — Heal Output:** Medical Accuracy talent + Captain Cow 4pc (+20% Healing Intensity) + Medical Excellence OS (+20% Healing Intensity) = +70–80% effective heal increase
- **Engine 2 — Team Heal Multiplier:** Slaughter Healing talent (+21% IH to all allies within 40m × 3 stacks) + Effective Triage OS (+40% IH)
- **Engine 3 — Skill Uptime:** Deep Focus chest (+28% Skill Duration) + Brainstorm backpack (CDR on headshot) + Captain Cow 3pc (+14.4% Skill Duration) = Support Station uptime from ~44.9s base to ~84s

### Vanguard Scout Example (Mechanical Expert / Boom-Shakalaka)
- **Engine 1 — Engineering Stack:** Torrential Downpour (M4) triggers +22.5% Engineering for 12s on 10 hits; Fully Charged (P90) triggers +7.5% Engineering per stack (up to 3× = +22.5% max) on empty mag reload. Combined with base 1,066 Engineering + gear bonuses, this keeps Engineering elevated consistently during combat
- **Engine 2 — Conversion:** Tactical Smart Cover converts 24% of Engineering → Weapon Damage bonus to all allies behind the cover
- **Engine 3 — Uptime:** Mechanical Expert 3pc (−9% Skill CDR) + Boom-Shakalaka 2pc (−6% Skill CDR) + Pressing Matter OS (+10% CDR) = Smart Cover duration (41s) exceeds its cooldown (35s) → permanent uptime

### No-Fantasy-Stacking Rule
DR talents have cooldowns and conditions. Show math conditionally — do not pretend uncapped uptime when a talent has a 10-second cooldown. Example: Cover Shooter OS at +48% WCHD maximum only while actively behind cover and critting. Always state the condition, not just the peak number.

---

## PART 32: FOUR HIDDEN MECHANICS (CONFIRMED)

### 1. RPM as Trigger Engine
High-RPM weapons generate more proc activations per second. For proc-based builds (In Sync, Torrential Downpour, stack-trigger talents), fire rate > per-bullet damage. The P90 (900 RPM, 50 mag) generates more talent procs per second than an AR — this is why it is the top SMG for Engineering builds.

### 2. Damage Amplification > Raw DPS
Team buffs are multiplicative multipliers. A Vanguard Scout feeding +30% damage via Smart Cover Engineering conversion + Scanning Pulse's 30% vulnerability (3 stacks) to 3 teammates provides more effective team DPS than a second pure-DPS player. Support amplification has no hard ceiling; solo DPS does.

### 3. CDR Breaking Point
When skill duration > cooldown = permanent uptime. Every CDR point invested past that breaking point is wasted budget. Find the breaking point before investing CDR — then stop. Example: Tactical Smart Cover (41s duration vs 35s CD) is already past breaking point. Additional CDR on this build buys nothing.

### 4. Aggressive Support Loops
Support talents trigger from weapon hits and active engagement. Torrential Downpour requires 10 hits in 5 seconds. Stopping shooting = buff cycle halts. Support builds need high-RPM weapons to maintain their proc chains. A support player who plays passively loses 70% of their build's output.

---

## PART 33: SKILL DAMAGE TYPE FOLLOWS WEAPON (CRITICAL MECHANIC)

All skill damage inherits the damage type (Blast / Piercing / Shredding) of the currently equipped weapon. This switches on every weapon swap. Practical implications:
- Stack Shredding Damage bonuses with Strawberry Milkshake equipped to boost Shredding skill damage
- Swap to a Blast weapon before deploying Artillery for Blast-type skill hits against Blast-vulnerable enemies
- In competitive builds, primary weapon choice affects what damage type your skills output — not just weapon DPS

---

## PART 34: VANGUARD SCOUT CANONICAL STAT BLOCK (May 2026 Meta)

**Power Level:** 16.98k | **Set:** 4pc Mechanical Expert + 2pc Boom-Shakalaka

| Stat | Value |
|---|---|
| Firepower | 446 |
| Toughness | 311 |
| Engineering | 1,066 |
| Armor | 5,119 base / 6,000+ in close combat (Socialite chip) |
| Health | ~76,163 (inside 67k–85k synergy band) |
| Displayed DPS | ~142,000 |
| Team DPS Uplift | ~100k → ~300k for allies behind Smart Cover |

**Primary Weapons:** Police M4 (Torrential Downpour) + P90 (Fully Charged + Torrential Downpour)

**Skills:** Tactical Smart Cover (41.20s duration / 35.59s CD — permanent uptime) + Scanning Pulse (17.44s / 14.95s CD)

**Pressing Meta Watch (Lv50):** +24% Skill Intensity, +358 Engineering, +2,586 Skill Damage, +9,442 Health, +10% Skill CDR

**Chip Stack:**
- C-Chip + Mobile Bastion: constant Signature Ability charge to team
- Burgle Call: +14.4% fire rate + 14.4% movement speed
- Foxhole: converts 450% of Engineering into Extra Health while behind cover (largest survivability multiplier in the game for this build)
- Target Rich: +36% Accuracy, +36% Stability
- Socialite: +36% Armor when enemies are close → 6,000+ Armor in combat

**Scanning Pulse effect:** Base Scanning Pulse applies ~20% Vulnerability to pulsed enemies. The additional 10% incoming damage debuff stacking (up to 3× = 30% total) comes from external modifiers (mods, talents, specialization effects) — not from base Pulse. Distinguish base Pulse vs modded Pulse when writing build guides.

**Combat Loop:**
1. Fire 10 hits with M4 → Torrential Downpour triggers (+22.5% Engineering 12s)
2. Swap to P90, empty magazine → reload → Fully Charged triggers (+7.5% Engineering for 12s per stack, up to 3 stacks = +22.5% additional)
3. Sustained elevated Engineering pumps Smart Cover conversion: 24% Engineering → Weapon Damage bonus to all allies behind cover
4. Deploy Scanning Pulse → 30% vulnerability on all pulsed enemies
5. Team DPS: 100k → 300k+

**Fully Charged Clarification (CONFIRMED):** The correct value is **+7.5% Engineering per stack, up to 3 stacks = +22.5% total**. Earlier sources citing "+750% Engineering" were a transcription/UI parsing error. The 1,066 Engineering canonical stat is correct — the build's value comes from consistent Engineering maintenance via Torrential Downpour + Fully Charged stacking + gear set bonuses, not a single massive spike.

---

## PART 35: META GEAR SET RECOMMENDATIONS (May 2026)

| Class/Spec | Primary 4pc | Companion 2pc | Core Stat Priority |
|---|---|---|---|
| Combat Medic | Captain Cow | Dr. Medic OR Mechanical Expert | Toughness first |
| Tactical Pharma (Oxi) | Long-Term Effect OR Jackpot | Boom-Shakalaka OR Mechanical Expert | Engineering + Skill Crit |
| Aegis Operator | Mechanical Expert OR Long-Term Effect | Boom-Shakalaka OR Jackpot | Engineering |
| Vanguard Scout | Mechanical Expert | Boom-Shakalaka | Engineering |
| Vanguard Commando | Phalanx Attack OR Fury Strike | Fury Strike OR Gunny Johnny | Firepower + Multishot |
| Bulwark Juggernaut | Fearless Warrior OR Phalanx Attack | Self-Propelled Shield OR Phalanx Attack | Toughness + Armor |
| Demolitionist HE | Jackpot | Fire Cycle OR Boom-Shakalaka | Engineering + Skill Crit |
| Tech Operator Offensive | Mechanical Expert OR Jackpot | Boom-Shakalaka | Engineering |

**Default 4pc slot placement:** Mask, Gloves, Holster, Kneepads. Chest and Backpack are free (talent-driven) unless running a 4+2+0 split.

---

## PART 36: CONFIRMED NUMBERS (May 2026 — Authoritative)

### Gacha / Progression
- Gold OS pity: 90 pulls from 160 Phoenix Credit Cache
- T2 godroll mask: approximately 1 in 1,845 (~31 hours of Legendary runs)
- Weekly bounty boss: Gold OS on first clear ONLY — replays yield Purple only
- Rampart Gold OS at Lv50: +36% Skill Crit Chance
- Sniper TAM augment: +12% Skill Crit

### Power Breakpoints
| Threshold | Significance |
|---|---|
| 8,000 Armor | DZ Heroic minimum survival |
| 9,000 Armor | Bulwark shield holds in Heroic |
| 11,000 Armor | Bulwark viable in Elite |
| 19,000 Power | Legendary recommended minimum |
| 20,000 Power | Full Legendary eligibility |

### Stat Targets by Class
- Combat Medic: 1,600 Toughness = ~260,000 HP. At 300,000+ HP: Defensive Measures procs at 70–80k damage per tick (every 2–3s)
- Tier 1 Health Band: 67,000–85,000 HP. Below 67k = glass; above 85k = wasted stat budget
- Engineering spike build: 1,066+ Engineering base before Fully Charged trigger

### Weapon / Crafting Numbers
- LMG proficiency: **100 kills per level** (confirmed — not 70 like other weapon classes). Plan Strawberry Milkshake grind accordingly.
- Warlord Level 7 proficiency: 70 agent kills OR destroy 70 deployed skills in Conflict
- T0→T2 direct upgrade: 2 augment kits (legal, not a bug)
- Lady Death at DZ vendor: ~17,500 DZ Credits (confirmed as current baseline; minor rotation variance possible)
- Heroic mission credits: ~8,000; Story mission: ~3,500–4,000 (better credits/minute than Heroic)

### Crafting Times
- BOO station: 1 item per 14+ hours
- Clan Lv10, no Warden Supplies: ~2 items per 4.5 hours
- Clan Lv10 + Warden Supplies ($5/month): 2 items per ~1.5 hours

### Material Economics
- Superior Fabric: 1 per Heroic or Challenging run; 60 needed to max a full 6-piece set
- Dismantle return rate: ~80% general; ~90% if piece was upgraded
- DZ mod dismantle: Blue = 15 DZ Credits; Purple = 75 DZ Credits; Yellow = 750 DZ Credits
- TAM dismantle = Encrypted Data (NOT Clan Credits)
- DZ Credits cap: 20,000/week from DZ quests

---

## PART 37: CONFIRMED BROKEN — EXTENDED (May 2026)

These replace any build recommendation around these mechanics. Do not suggest them.

| Item | Bug Status |
|---|---|
| Steady Handed on Lady Death | Never worked since launch — skip in all Lady Death builds |
| Prime Engineer OS | Stat increase displays but may not affect actual skill damage — unreliable |
| Fury Strike 4pc Crit Chance bonus | May not display in attributes panel — unverified |
| Healing Hive 240% Damage Mod | Broken — do not recommend |
| Healing Hive 25% Damage Amp Mod | Broken — do not recommend |
| Recursive Treatment OS + Mender Drone | Does not proc — cannot be the basis of a Mender Drone heal build |
| Brains Over Brawn (BoB) | PATCHED (EU May 7–8, 2026) — no longer the Aegis cornerstone |
| Neverending — reload animation | Animation plays but damage timing is affected |
| iOS gamepad support | Under investigation — do not recommend iOS gamepad builds |
| DZ TAM quest reward | Cannot be claimed — under investigation |
| Warlord proficiency (iOS) | Can wipe on some accounts — log in to PC client to stabilize |

**Patch 1.2.1 (May 20, 2026) FIXED:**
- Inventory item disappearance (edge cases may still exist)
- DZ vendor missing item-name text
- Strawberry Milkshake Anarchy talent description was showing wrong values — now correct
- Weekly Mission Exotic Booklet now correctly awards Strawberry Milkshake recalibration material

---

## PART 38: BoB NERF — IMPACT ON AEGIS BUILDS

**Brains Over Brawn (BoB) nerf applied EU server May 7–8, 2026.**

- **Pre-nerf peak:** 580,000 damage per weak-point hit achievable with BoB + Aegis burst stack
- **Post-nerf realistic:** 100,000–250,000 per Aegis burst in fully optimized conditions
- **DPS reduction:** Approximately 2× less spike; approximately 3–4× less overall sustained DPS on BoB-dependent builds
- **Impact:** Aegis Operator dropped from S-Tier to A-Tier in PvP. Still strong — no longer broken

**Post-nerf Aegis OS (not fully settled as of May 2026):**
- **Rampart** is the current safest replacement — most consistent post-BoB Aegis OS. At Lv50 Gold: +36% Skill Crit Chance.
- **Tactical Layering** used in hybrid setups
- No single dominant BoB replacement has emerged — meta is still stabilizing

**Post-nerf Aegis scaling priority (confirmed):**
- Aegis burst scales with: Skill Crit Chance, Skill Crit Damage, Multishot
- Aegis burst does NOT scale meaningfully with: Skill Intensity (tooltip is misleading)
- Engineering benefits Aegis burst 2.25× more than raw Skill Damage stat

---

## PART 39: PvP TIER — WITH NUMBERS (May 2026)

| Tier | Class/Spec | Notes |
|---|---|---|
| S | Bulwark Juggernaut | Shield + Shockwave Spike = effectively no counterplay; community consensus broken |
| A | Combat Medic | Strong sustain; Toughness-stack enables Defensive Measures damage |
| A | Aegis Operator | Was S pre-BoB nerf; still high-skill-ceiling PvP |
| B | Demolitionist | Competitive; not dominant |
| B | Tactical Pharma | Competitive; not dominant |
| C (PvP) / S (PvE) | Vanguard Commando | Fails in Conflict specifically; Lady Death helps in PvP |
| C | Tech Operator Offensive | Not competitive in current PvP meta |

**Conflict normalization:** Base HP normalized to ~20,000–22,000 regardless of actual HP. Talents and OS carry through. Do not queue Conflict below Level 40.

**Bulwark Spike details:**
- Shockwave Spike: 3–5 second stun, 10-second cooldown
- Stun Grenade + Bulwark shield combo: 5-second stunlock — no counterplay per community consensus
- Can softlock Boss Juggernaut AI with repeated Spike stun loop

---

## PART 40: DZ MECHANICS (DETAILED)

- Match timer: 20 minutes hard cap. NPCs despawn at extraction zone at end of timer.
- Contamination: Timer-based health drain — NOT a status effect. Visit safehouse to reset.
- Player kill drops: Loot is re-rolled on drop, NOT the victim's actual gear. Cannot steal godrolls.
- Rope cutting: Rogue keeps 50% of loot even if killed after cutting the rope.
- DZ matchmaking: ±2 levels when solo. Party with a higher-level member breaks the rule.
- Smuggling: 300 → 600 → 1,200 DZ Intel progression. Resets daily/weekly.
- Gold chips: Do NOT drop from DZ boss caches — DZ vendor only (purchasable with DZ Credits).
- Extraction site cooldown: 60 seconds between rope activations at the same site.
- Re-entry: No cooldown. Leave and re-enter freely.
- DZ T2 drop rate: Extremely low per community consensus. Subway DZ boss has confirmed T2 chance; Lone Wolf also has confirmed (rare) T2 chance.

**Fast DZ farming loop:** Collect skill mod chips from DZ landmarks → Extract → Dismantle outside DZ → Earn DZ Credits → Repeat. Best repeatable DZ credit generation loop.

---

## PART 41: FARMING ROUTES (OPTIMAL)

### XP Farming
- Supply runs fast-travel loop is fastest for XP
- Daily bonus XP arrow (yellow) = 10,000+ XP per run; white arrow = ~3,000 cap — stop when arrow turns white
- Chinatown Challenging: recommended ~Level 25+; fastest/easiest Heroic farm at endgame
- Easy matchmaking via Mission 1 for group leveling

### Gold OS Sourcing (F2P)
- Weekly bounty first clear: Gold OS guaranteed (first clear ONLY)
- SHD orange crates: Daily reset; give Gold OS or near-equivalent materials
- DZ vendor: Gold Chipsets available with DZ Credits

### T1 Gold Gear
- Chinatown Challenging: fastest T1 Gold farm
- Heroic replays: guaranteed 1+ Gold per run
- Clan Hostile Nest daily: consistent T1 source

### T2 Gear
- Elite/Legendary difficulty only (almost exclusively)
- "Kill first elite, die, repeat" method: bypass long Legendary wipe-risk for targeted T2 chance
- DZ Subway boss: rare T2 drop confirmed
- Lone Wolf: confirmed rare T2 chance

### Skill Mod Chips
- DZ landmarks: primary farming source for skill mod chips
- Keep upgrades; dismantle remainder for DZ Credits

### Electronic Components (Alpha/Beta/Gamma)
- Rule of Threes is the ONLY consistent method: exactly 3 Arms Deals + 3 Hostage Rescues + 3 Supply Runs daily
- Diminishing returns hit hard after 3 completions of any one activity type
- Grinding 50 Supply Runs gives Gamma only — class upgrade still fails without Alpha/Beta
- These three component types gate all class upgrade paths

---

## PART 42: CRAFTING ECONOMY RULES

- T2 items are NOT craftable — only drop from Elite/Legendary
- Craft T0 gear at proficiency level before tiering up — saves purple material costs
- Repeatable missions (no checkmark icon) = unlimited targeted loot farming
- Dismantle ALL gear (weapons, armor, mods); sell ONLY white-rarity cash items
- White cash items stack to ~1,000 by Friday if playing daily; sell half = ~150,000 credits
- Do NOT sell purple/gold gear — always dismantle for materials
- **Strawberry Milkshake recalibration material:** Source is the Weekly Mission Exotic Booklet (fixed in Patch 1.2.1). Effectively one source per week — time-gated, not farmable. Plan SM recalibrations around this weekly cadence.

### Skill Mod Cap Management (200 mod limit)
- Hidden hard cap at 200 skill mods. Once hit, mods stop dropping.
- Recommended management strategy: Keep all yellow (gold) mods; keep high-roll stat combinations (Skill Intensity, CDR) in blue/purple; dismantle everything else immediately.
- Practical rule: If a mod is not part of a current or planned build, dismantle it on the spot. Do not hoard.
- Check mod inventory regularly — approaching the cap silently kills farming efficiency.

---

## PART 43: MYTH BUSTS — CONFIRMED WRONG (Community Tested)

| Myth | Truth |
|---|---|
| Engineering improves Combat Medic healing | WRONG — Toughness does. Engineering scales Aegis healing. |
| Higher Power Score = better build | WRONG — Power can be inflated with wrong-stat gear. Synergy beats score. |
| Exotics are always BiS | WRONG (u/Godzillaguy15) — A well-rolled high-end gun beats a stock exotic in most scenarios |
| T2 always > T1 | WRONG (u/mt0386) — High-end T0 > badly-rolled T1; high-end T1 > badly-rolled T2. Roll quality > tier. |
| Skill Intensity scales Aegis burst | WRONG — Use Skill Crit Chance, Skill Crit Damage, Multishot for Aegis |
| Character-sheet DPS = actual DPS | WRONG — Active talents excluded; real burst is 3–5× displayed |
| "Behind cover" passives require enemies behind cover | WRONG — "Behind cover" means YOU are behind cover, not the enemy |
| Cannot enter Legendary below recommended power | WRONG — You can enter; you take a damage penalty |
| Solo is harder than team | WRONG — Solo = lowest difficulty. Each teammate adds ~50–60% to enemy HP |
| Both weapons share ammo pools | WRONG (u/cyanxde666) — Each weapon has its own pool. Run out on weapon 1, swap to full mag on weapon 2. |
| Headshot Damage stat works on armored enemies | WRONG — Armor plates negate headshot multiplier. Shoot legs instead. |

---

## PART 44: BEHAVIORAL PROGRESSION TRAPS (Masterclass — Canonical List)

These five behaviors cause "my build feels weak" — almost never due to loot RNG:

1. **Constantly changing classes** — resets optimization path, burns scarce mats
2. **Obsessing over Power Score** — destroys set-bonus synergy
3. **Spreading resources across multiple unfinished builds** — total resource starvation
4. **Aimless random farming with no daily checklist**
5. **Valuing raw damage over efficiency and uptime**

### Five Mechanical Build Failures (QA Checklist)
A build that violates any of these is broken regardless of how good the individual gear pieces are:
1. Spread stats — build loses its identity
2. Copying a pro build without understanding buff-maintenance triggers — pays full opportunity cost, gets zero output
3. Recalibrating for comfort (e.g., slapping DR on a build that needs damage) — ruins the win condition
4. Overbuilding survivability — you die slower in a losing fight instead of controlling the field
5. Playstyle contradicts the build — passive play on a proc-dependent build = wasted gear

---

## PART 45: SUPPORT AMPLIFICATION MATH

A solo DPS player has a hard ceiling set by fire rate, reload, and crit. A support build has no output ceiling — it raises every squadmate's ceiling simultaneously.

**Example:** Vanguard Smart Cover (+24% Engineering→WD conversion) applied to one 250k-DPS DPS player = +60k bonus DPS. Applied to four DPS players = +240k bonus DPS — more than a second DPS player would generate.

**Implication for builds:** A coordinated squad with one support always outperforms four solo DPS players. In Legendary content, support is not optional — it is the win condition.

**The Support Role Rule:** Do not write builds where support is treated as backline healing. The support player's combat loop requires active engagement (hits, procs, skill deployments) to keep all three engines running.

---

## PART 46: TACTICAL COMBAT MECHANICS (Operational)

### Pressure Angles (Induced AI Runtime Errors)
When a squad attacks from one direction: enemy AI stabilizes, holds cover, returns accurate fire. When the squad attacks from two 90-degree-opposing angles: AI breaks — abandons optimal cover, repositions across open ground, splits aggression. A player with average aim and good flanking clears rooms 2× faster than a stationary player with perfect aim.

### Shock Trap Timing (Rhythm Breakers)
Elite AI runs a cycle: peek → shoot → suppress → reload → repeat. Shock traps are NOT for their damage value — they are used to collapse the AI cycle mid-sequence. When the cycle breaks, coordinated pushes de-synchronize, AI falls back to defensive self-preservation loop, momentum resets in the squad's favor.

### Tactical vs. Reckless Aggression
Push only when: (1) your damage buffs are actively ticking, (2) squad cooldowns overlap, (3) enemy stability has broken. Pushing without these conditions = wasted momentum, likely wipe.

### Momentum as a Win Condition
Negative momentum signals: a teammate's HP dropping below 50% with no active heal, a buff timer expiring within 3 seconds of a wave spawn, squad spacing tightening. Stabilize the line proactively — reactive support means you're already losing.

---

## PART 47: PATCHES AND NERFS TIMELINE

| Patch | Date | Key Build-Relevant Changes |
|---|---|---|
| Hotfix 1.1.1 | April 13, 2026 | Sound/UI/crash fixes. No mechanic changes. |
| Patch 1.1.2 | April 28, 2026 | Partial FPS unlock. Did NOT fix proficiency bug or Outpost Annihilation. |
| Healing Hive Multi-Tick Patch | Late April 2026 | Hive multi-proc bug fixed. Combat Medic healing significantly reduced. Medic builds built around the bug no longer work. |
| Brains Over Brawn Nerf | ~Early May 2026 | EU server first. Aegis BoB builds lost 3–4× sustained DPS. BoB dropped from S to B tier for offensive builds. |
| Phase 2 Launch | May 12, 2026 | Strawberry Milkshake exotic added. New bugs introduced (inventory, vendor). |
| PC Early Access | April 28, 2026 | Ubisoft Connect. 60fps default. Can unlock to 240fps via GameUserSettings.ini. |
| Patch 1.2.1 | May 20, 2026 | Fixed: inventory disappearance, vendor selling, DZ vendor text, SM Booklet drop, Anarchy description. Still broken: Outpost Annihilation, iOS gamepad, weapon proficiency in some cases. |

---

## PART 48: GLOSSARY (Key Terms for Content Generation)

| Term | Definition |
|---|---|
| T0 / T1 / T2 | Gear tier. T0 = 1 mod slot, entry-level. T1 = standard endgame, multi-slot. T2 = best-in-slot, Elite/Legendary only. |
| BiS | Best in Slot. |
| OS | OS Protocol — gear chip granting major bonuses. Tiers: White→Green→Blue→Purple→Gold. |
| TAM | Tactical Augment Module. Weapon augment chip. |
| DZ | Dark Zone. PvPvE area. |
| BoB | Brains Over Brawn. Nerfed Engineering→weapon damage OS (May 2026). |
| BOO | Base of Operations. Player hub (slow crafting). |
| HE | High Explosive (Demolitionist ult) OR High-End (Gold tier gear). Context-dependent. |
| FG Demo | Field Grenadier. Demolitionist subclass alternative to HE. |
| CC | Crowd Control. |
| ROF / RPM | Rate of Fire / Rounds Per Minute. |
| DR | Damage Reduction. |
| IH | Incoming Healing. |
| SAC | Signature Ability Charge. |
| ADS | Aim Down Sights. |
| DoT | Damage over Time. |
| DPS | Damage Per Second. |
| PC | Phoenix Credits (OS pulls currency) OR Personal Computer. Context-dependent. |
| SHD | Strategic Homeland Division (agent rank / watch). |
| Conflict | Structured PvP mode. HP normalized to ~20–22k. |
| Nest | Hostile Nest. Dungeon-style repeatable activity. |
| Augment Kit | Resource for tier upgrades. |
| Pity | Guaranteed reward at fixed pull count (Gold OS pity = 90 pulls). |
| Truck-Hitter | Slang for Vanguard Scout meta build that uses Fully Charged P90 for Engineering spike. |

---

## PART 49: COMMUNITY AUTHORITY REFERENCE

When citing or weighting mechanic claims, these Reddit sources have the highest confirmed reliability:

| Handle | Known For |
|---|---|
| u/LaClown-ua (EU) | Top-ranked Juggernaut leaderboard. Original Combat Medic Toughness-scaling guide. Most-cited mechanics source. |
| u/mt0386 (Asia) | Extensive testing reputation. Defensive Maneuver Combat Medic originator. Blood for Blood combos. |
| u/p377y7h33f (Global) | Aegis burst damage formula derivation. Firepower vs Weapon Damage ratio testing. |
| u/TheeLoo (Americas) | Skill crit no-cap confirmation (99% in full Nest run). |
| u/Camoflauge94 | Burst DPS investigation. Character-sheet vs actual DPS discovery (178k displayed → 535k actual). |
| u/nasanhak (Global) | Aegis burst mechanical deep-dives, gear progression theory. |
| u/asaling229 (Americas) | Top-15 Offensive Tech Operator and Demo Field Grenadier stat analysis. |
| u/kimbaoki / MimiLolita | Tech Operator HE Demo one-shot, Vanguard DBS, 900k → 1M DPS T1 builds. |
| u/NecessaryComputer450 | Striker drone damage-type discovery, solo Legendary clears. |
| u/Luminem57 (EU) | Solo Legendary Aegis clears, speedrun tips. |
| u/General-Nature2025 | Firepower vs Weapon Damage mechanics formula. Confirmed past ~1,500 Firepower, WD% is better per point. |

---

## PART 50: HOW TO USE THIS DOCUMENT

When generating any build, guide, or news article, apply these checks in order:

1. **Cross-check scaling claims** against Part 31 (Toughness vs Engineering vs Firepower) and Part 43 (Myth Busts)
2. **Cross-check damage math** against Part 5 (damage formula) and Part 38 (Aegis post-nerf numbers)
3. **Reject any build** that recommends broken mods/talents from Part 37 or Part 24
4. **Verify gear set names and slot conventions** against Part 35 — 4pc on Mask/Gloves/Holster/Kneepads by default
5. **Apply the Five Fatal Errors** (Part 30), **Five Behavioral Traps** (Part 44), and **Five Mechanical Build Failures** (Part 44) as QA pass before publishing
6. **Cite community sources by handle** when the claim is testing-based
7. **Always include playstyle trigger requirements** — not just gear lists. A gear list without trigger descriptions = 70% effectiveness loss for readers trying to replicate the build

*This document overrides any prior source where they conflict. Pair with Division_Resurgence_Build_Database.md for numeric values.*

*End of Division Resurgence Mechanics KB v2 — RapidF5 / resurgencebuilds.com*

---

## PART 51: VANGUARD COMMANDO — CONFIRMED SKILL MODS (Player-Verified May 2026)

> Source: In-game screenshots confirmed by RapidF5. These are the ONLY skill mods available to Vanguard Commando. Use this data for all Commando build recommendations — do not infer or guess mod names.

### TACTICAL LINK MODS (6 confirmed)

| Mod Name | 2pc Bonus | 3pc Bonus | Synergy Notes |
|---|---|---|---|
| **Commando** | Armor +4.7–9.3% | Kills/assists during Tactical Link grant +10.2% Weapon Critical Hit Chance for 10s | Strongest crit amplifier during Link window; best for DPS builds |
| **Ammo Refill** | Reload Speed +4.0–8.0% | Shots during first 6s of Tactical Link have 29% chance to restore 1 bullet. Kills reset duration. | Extends effective magazine during Link; excellent for LMGs |
| **Tactical Loop** | Skill Cooldown Recovery -2.0–4.0% | During Tactical Link, hits have 10% chance to extend duration by 0.30s, up to 8 stacks (15s CD when max reached) | Extends Link uptime via hits — very reliable at high RPM |
| **Bugle Call** | Damage Reduction +2.0–4.0% | Deploying Tactical Link grants +14.4% Rate of Fire, Damage Reduction, and Movement Speed for 15s | Core RoF amplifier; always relevant for LMG builds |
| **Tactical Reinforcement** | Damage Reduction +2.0–4.0% | Increases Signature Ability Charge Efficiency of players applied with Tactical Link by 28.8% | Best for Link uptime cycling; team-wide charge acceleration |
| **Liquid Nitrogen** | Skill Cooldown Recovery -2.0–4.0% | Players with self-applied Tactical Link effect have 10% chance to reduce ALL skill cooldowns by 0.80s on each enemy hit (5s CD between triggers) | Skill CD compression during Link; useful for multi-skill builds |

### COMMANDO SMART COVER MODS (5 confirmed)

> NOTE: These mods require Commando Smart Cover specifically. Field Bastion and Advanced Position below require Recon Smart Cover and are NOT available to Commando.

| Mod Name | 2pc Bonus | 3pc Bonus | Synergy Notes |
|---|---|---|---|
| **Armored Train** | Armor +4.7–9.3% | While behind Smart Cover, weapon hits have 5% chance to grant +2% Weapon Critical Hit Chance for 20s, up to 3 stacks (+6% WCHC max) | Passive WCHC accumulation while reloading behind cover |
| **Optimized Armor** | Reload Speed +4.0–8.0% | While behind Smart Cover: +3.2% Damage Reduction + 4.8% chance to restore 1 bullet per hit | Minor utility; reload coverage behind cover |
| **Top Off** | Skill Cooldown Recovery -2.0–4.0% | While behind Smart Cover: +9.6% Signature Ability Charge Efficiency | Sig charge while in cover; passive Link cycling |
| **Effective Deterrent** | Skill Cooldown Recovery -2.0–4.0% | While behind Smart Cover: +1% Damage per stack up to 3 stacks (+3% total). At max stacks: +3% Sig Charge Efficiency. Resets on leaving Smart Cover. | Weak — resets on leaving cover; too conditional for aggressive builds |
| **Advanced Position** | Damage Reduction +2.0–4.0% | While behind Smart Cover: kills/assists grant +10 Signature Ability Charges to self and allies | Team support; best in group content for Link cycling |

### SCANNING PULSE MODS (6 confirmed)

| Mod Name | 2pc Bonus | 3pc Bonus | Synergy Notes |
|---|---|---|---|
| **Optimal Awareness** | Armor +4.7–9.3% | Pulsed enemies within 70m grant +1.4% Weapon Critical Hit Chance, up to 8% total | Passive WCHC from Pulse; scales with number of pulsed enemies |
| **Field Supplies** | Reload Speed +4.0–8.0% | Kills or assists on Pulsed enemies restore 6% Health and refill 6.4% of current magazine | Magazine sustain on Pulsed kills; excellent for LMG builds keeping mag alive |
| **Tactical Insight** | Skill Cooldown Recovery -2.0–4.0% | Deploying Scanning Pulse restores 48 Signature Ability Charges (64 if more than 3 enemies within 70m) | Best single-mod for Link uptime; pairs perfectly with Commando TL mod |
| **Targeted Surveillance** | Damage Reduction +2.0–4.0% | Deploying Scanning Pulse grants Pulsed allies Weapon Critical Hit Chance equal to 3.6% of Engineering for 10s | Engineering-gated; minimal value for Firepower-core builds |
| **Pulse Feedback** | Sig Ability Charge Efficiency +4.0–8.0% | Pulsed enemies grant +8 Signature Ability Charges to the ally team | Team-wide charge generation; best in coordinated group play |
| **Compound Effect** | Skill Cooldown Recovery -2.0–4.0% | Deploying Scanning Pulse while Fortified reduces Skill Cooldown by 1.50s | Requires Fortified status to trigger; niche and conditional |

### RECON SMART COVER MODS (NOT available to Commando — listed for reference)

| Mod Name | Note |
|---|---|
| **Field Bastion** | Recon Smart Cover only. While behind Recon Smart Cover: kills/assists grant allies Extra Health = 120% Engineering for 10s. |
| **Advanced Position** | Listed under Commando mods above — also applies to Recon Smart Cover. |
| **Effective Deterrent** | Recon Smart Cover only per image data. |

### BUILD RULE: Mod Selection for Strawberry Milkshake / Milkshake Machine Build

**Recommended Commando Skill Mod loadout (confirmed optimal for melt/synergy):**

| Skill | Recommended Mod | Reasoning |
|---|---|---|
| Tactical Link | **Commando** | Kills during Link → +10.2% WCHC for 10s. At 550 RPM you are killing constantly during Link windows. More WCHC = more crits = more In Sync procs hit harder. Turns every Link window into a crit avalanche. |
| Commando Smart Cover | **Armored Train** | Passive +6% WCHC while behind cover on reload. No button presses required. Free crit stacking during the only moment you're not shooting. |
| Scanning Pulse | **Field Supplies** | Kills on Pulsed enemies refill 6.4% of current magazine (~7–8 bullets per kill at 118 rounds). Combined with Dominating Presence's group-fighting design, every kill in a crowd partially refills the mag. More mag time = more In Sync uptime = more Multi-Shot procs. |

**Alternative Scanning Pulse mod:** Tactical Insight — deploying Pulse restores 48–64 Sig Charges. Swap Field Supplies for Tactical Insight if you want maximum Tactical Link uptime over magazine sustain. Pairs with Commando TL mod to create a rapid Link cycling loop.

**Do NOT use:** Targeted Surveillance (Engineering-gated, minimal on Firepower build), Compound Effect (requires Fortified status), Effective Deterrent (resets on leaving cover — punishes the aggressive playstyle this build requires).

