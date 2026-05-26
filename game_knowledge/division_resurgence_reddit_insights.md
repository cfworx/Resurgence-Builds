# Division Resurgence — Reddit Community Insights
**For AI build authoring at resurgencebuilds.com | Byline: RapidF5**

> This document captures community-validated mechanics corrections, testing results, and build insights from Reddit (r/thedivisionresurgence, Feb–May 2026). Entries are filtered for mechanics relevance only — anything that changes how builds work, corrects tooltips, or reveals hidden behavior qualifies. General game impressions, complaints, cosmetics, and lore discussion are excluded.
>
> Trust hierarchy for these insights: entries with multiple community confirmation (upvotes + corroborating comments) outweigh single-source claims. Sources with high reliability are noted by handle.

---

## SECTION 1: SCALING CORRECTIONS (Tooltip Lies)

### Combat Medic Heals Scale Off Toughness, NOT Engineering
**Sources:** u/LaClown-ua (EU, top-ranked Juggernaut), u/troxrawr, u/mt0386 (Asia)

The in-game tooltip implies Engineering affects heal output. It does not for the Combat Medic / Field Medic subclass. The correct stat is **Toughness**.

**u/LaClown-ua (confirmed, widely upvoted):** "Your heal skills depend on Toughness stat, not engineering and not anything else. The more Toughness you have — the more heals you will do. I'm shocked that not a lot of people who play Medic even know about this."

**u/troxrawr:** "Your heals in combat medic are based off of your max hp, so toughness is better for healer build. Engineering will still help toward your healing, but HP, Skill CD, Skill Duration, Radius and Healing intensity is what you look for."

**u/LaClown-ua clarification:** "Yes, Engineering descriptions say about 'damage, skills, healing' because AEGIS healer indeed scaled through Engineering. But Medic — solely on Toughness. This game is just bad at describing stuff."

**Practical impact:** Any Combat Medic build recommending Engineering as the primary stat is wrong. Build Toughness to 1,600+ for ~260,000 HP. At 300,000+ HP, Defensive Measures mod procs at 70–80k damage every 2–3 seconds.

**u/Available_Airline648:** "I actually built my combat medic full toughness. Sitting around 1.6k toughness and 260k health. I can still face tank a full team in conflict, get tickled by NPC's and bosses in the dark zone."

---

### Aegis Operator Heals Scale Off Engineering (Different System)
**Source:** u/LaClown-ua, community consensus

Aegis Operator uses Engineering for its healing output — the opposite of Combat Medic. These are two completely different healing systems that happen to both be in the "medic" category.

- Aegis heals: Engineering is the primary driver
- Combat Medic heals: Toughness is the primary driver
- Mixing stats on either subclass produces significantly worse output than specializing

---

### Aegis Burst Does NOT Scale With Skill Intensity
**Sources:** u/p377y7h33f, u/nasanhak, u/Luminem57

The tooltip is misleading. Aegis 3-second passive burst scales with:
- **Skill Crit Chance** — most impactful
- **Skill Crit Damage** — direct multiplier
- **Multishot** — additional projectile chance

Skill Intensity provides minimal benefit to Aegis burst compared to these three stats. Engineering benefits Aegis burst 2.25× more than raw Skill Damage stat.

**u/p377y7h33f (damage formula testing):** Confirmed Engineering vs Skill Damage ratio discrepancy through practical testing. Engineering is the more efficient investment per point for skill-based classes past approximately 1,500 Firepower equivalent.

**Aegis 3-second burst trigger (confirmed):** Automatic periodic pulse on a ~3-second timer while shield is active. Not triggered by weapon hits or taking damage — purely passive timer.

**Practical impact:** Do not recommend Skill Intensity as the primary Aegis Operator attribute. Prioritize Skill Crit Chance, Skill Crit Damage, and Engineering.

---

### Skill Intensity Does Not Mean Skill Intensity Stat
**Community-wide clarification:**

"Engineering" (core stat) and "Skill Intensity" (bonus attribute) are separate. Engineering is the primary multiplier that governs skill output. Skill Intensity is a bonus attribute that stacks on top. Both scale heals and skill damage but are distinct and stack multiplicatively — they do not add together into one pool.

---

## SECTION 2: DAMAGE MECHANICS (Tested)

### In Sync — Hidden Double-Dip Confirmed (Still Active Post-May 2026)
**Source:** Community testing, multiple confirmations; no patch removal noted

In Sync weapon talent: "Weapon Hits grant +9% Skill Damage 8s. Skill Hits grant +9% Weapon Damage 8s."

**Hidden mechanic:** When BOTH buffs are active simultaneously, the bonus is doubled — resulting in effectively +18% in both directions. The talent text does not state this. It is confirmed through damage testing, not speculation.

**Post-May 2026 status:** Mechanic still exists — no patch notes have mentioned removal. The perceived power drop in the community is due to surrounding system nerfs (BoB removal, healing adjustments), not direct removal of the double-dip.

**Practical impact:** In Sync is significantly stronger than it appears on paper. Builds that mix weapon and skill damage — hybrids, Field Medics who shoot, Tech Ops — get more value from this talent than pure DPS or pure skill builds.

---

### Firepower vs Weapon Damage — Tested Ratio
**Source:** u/p377y7h33f (damage formula testing), u/General-Nature2025

**u/p377y7h33f confirmed:** 15 Firepower ≈ 18 Weapon Damage in terms of effective DPS output. Firepower adds flat to base damage (additive), Weapon Damage is a multiplicative multiplier.

**u/General-Nature2025 (formula explanation):** "FP adds flat. WD is multiplier. Say you deal 100 weapon dmg. If you get 100 FP it might give you flat 100 to your weapon dmg then you deal 200 weapon dmg. If you get 50% WD you deal 150. Both together: (100 + 100) × 1.5 = 300."

**Godroll weapon mod:** Firepower (primary) + Weapon Damage (substat) + correct damage-type bonus (substat). This triple-combination is more efficient than any other mod setup.

**Breakpoint:** Past approximately 1,500 Firepower total, Weapon Damage % becomes better per point (u/General-Nature2025). Up to that threshold, stacking Firepower is optimal. Beyond it, switch to WD%.

---

### Character Sheet DPS Is Not Real DPS
**Source:** u/Camoflauge94

Character sheet DPS does not count active talents or signature ability effects. Real burst DPS is 3–5× the displayed number.

**u/Camoflauge94 (measured):** 178,000 displayed base → 535,000 actual burst DPS when talents are active. This is not an edge case — it's how the game functions for any build that uses talent stacking.

**Practical impact:** Never cite character-sheet DPS as the build's damage output in a guide. Use "displayed DPS" as the baseline and explain the multiplier stack that produces real output.

---

### Skill Crit Chance — No Hard Cap Confirmed
**Source:** u/TheeLoo (Americas)

**u/TheeLoo (tested full Nest run):** "I can say there is no Crit Cap. Did the entire thing with just skills only got a single noncrit at the very end with the Grenade launcher." Achieved 99% Skill Crit Chance using Rampart Gold OS (Lv50 = +36% Skill CHC) plus sniper TAM (+12% Skill CHC).

**Practical impact:** There is no artificial ceiling on Skill Crit Chance. Stack as high as gear allows — the breakpoints are budget-limited, not cap-limited.

---

### SMG-Exclusive Talents — Confirmed No AR/LMG Crossover
**Source:** Build Database + community consensus (no credible exceptions found)

Fully Charged and Torrential Downpour are **SMG-only talents** — confirmed. No credible evidence of either appearing on AR, LMG, MMR, or Rifle. Do not suggest these talents are achievable on non-SMG weapons in any build.

---

### Skill Damage Type Follows Currently Equipped Weapon
**Source:** u/NecessaryComputer450 (striker drone damage-type discovery)

Skills inherit the damage type (Blast / Piercing / Shredding) of whichever weapon is currently equipped. Switching weapons mid-combat changes your skill's effective damage type immediately. This applies to ALL skills including drones, grenades, and pulses.

**Practical impact:** Weapon choice is not just a DPS decision — it determines what armor types your skills are effective against. For armored enemy matchups, swap to the weapon whose damage type counters their armor before deploying skills.

---

### Both Weapons Do NOT Share Ammo
**Source:** u/cyanxde666

Each weapon has its own ammo pool. Running dry on weapon 1 does not reduce weapon 2's ammunition. Swap to weapon 2 for a full magazine immediately.

**Practical impact:** This matters for rotation planning. If your primary weapon runs dry mid-fight, an immediate swap gives you a full magazine of damage before reloading.

---

## SECTION 3: BUILD MECHANICS (Community-Validated)

### Mender Drone + Aegis — Pre-Stack Trick
**Source:** Community (multiple threads)

Self-heals from the Mender Drone count as "Damage Taken" for passive proc purposes. This triggers DR passives before combat begins. The Mender Drone can also maintain Aegis stacks at maximum permanently when properly deployed.

**Practical use:** Deploy Mender Drone before engagement to pre-stack damage-taken-triggered effects. Keeps shield mechanics at max entering fights.

---

### Shotgun Pellet Stacking for Talents
**Source:** Community consensus

Every pellet from a shotgun counts separately for talent stacking. A double-barrel shotgun firing 8 pellets generates 8 talent procs per trigger pull. This is critical for proc-based builds using:
- Concentrated Fire (8 stacks in one shot)
- Steady Handed (8 stacks toward the 30-stack magazine refill)
- Target Acquisition (8 hits toward the 5-consecutive-hit threshold)

**Practical impact:** Double Barrel Shotgun with In Sync activates both weapon and skill buffs almost instantly. The DBS + Tactical Link Vanguard build exploits this mechanic for near-infinite ammo by triggering Neverending faster than with any other weapon type.

---

### T2 Not Required to Tier Up from T0
**Source:** u/MAXISBND, confirmed u/N43n1r4

Direct T0 → T2 upgrade is possible using 2 augment kits. This is not a bug — it is an intentional design. You need 6 T2 weapons maxed at proficiency Level 10 to unlock the T2 upgrade path, but the T1 intermediate step is skippable with kits.

**u/N43n1r4:** "You have to spend 2 augment kits to go from T0 to T2. It's more like 'you can't upgrade to T1? Here, use 1 upgrade kit, and I'll let you use another when you have unlocked T2.'"

---

### Targeted Loot — First Run Only
**Sources:** u/PapaTim68, community consensus

Targeted loot (the mission-specific item type shown in the mission select screen) is only active on the **first run per difficulty per day**. After the first run, drops revert to random/reduced. Repeatable missions (no checkmark icon) have unlimited runs but still follow this first-run rule for targeted loot quality.

**u/PapaTim68:** "But the target loot only works for the first run of that mission on that difficulty on that day. After the first run it's random and reduced."

---

### T2 Gear — DZ Does Drop It
**Source:** u/notpostaldude12 (screenshot proof)

T2 gear does drop in the Dark Zone — specifically confirmed from the Subway DZ boss. The drop rate is very low, and loot from player kills is re-rolled, not transferred from the victim's actual inventory.

**u/ExamFinal2163:** "I'm not sure if it's a bug but my friend and I PVP for fun and after he killed me the loot I drop was completely different from the actual loot in my bag. I think the game might randomly generate loot when you kill a player instead of actually what's in the bag."

---

### High-End Gun with Good Rolls > Stock Exotic
**Source:** u/Godzillaguy15 (high upvotes)

Exotics are not automatically BiS. A well-rolled high-end T1 weapon with relevant talents can outperform a stock exotic in most content. Exotic weapons have fixed talents — their value comes from the specific talent combination, not raw tier.

**Practical impact:** Do not default to recommending exotic weapons in every build. If the build's talent synergies align better with a craftable/farmable T1, say so.

---

### Roll Quality > Gear Tier
**Source:** u/mt0386 (Asia, extensive testing reputation)

High-end T0 > badly-rolled T1. High-end T1 > badly-rolled T2. A T0 with perfect rolls and correct attributes for the build outperforms a T2 with wrong core stat or broken attributes.

**Practical impact:** Always evaluate gear by stat alignment first, tier second. Upgrading a badly-rolled piece wastes augment kits.

---

## SECTION 4: GEAR SET INSIGHTS (Community-Tested)

### Captain Cow — The Healer Cornerstone
**Source:** u/LaClown-ua, community builds consensus

Captain Cow 4pc (+20% Healing Intensity) is the mandatory anchor for Combat Medic builds. The 2pc (+3.6% Move Speed) and 3pc (+14.4% Skill Duration) are valuable stepping stones. The move speed bonus is not cosmetic — it enables the medic to stay mobile while maintaining heal cycles.

**Confirmed complement:** Captain Cow 4pc + Deep Focus chest (+28% Skill Duration) + Brainstorm backpack = Support Station duration from ~44.9s base to ~84s (approaching permanent uptime in high-CDR builds).

---

### Mechanical Expert — Support Cornerstone
**Community consensus (multiple high-voted build posts)**

Mechanical Expert 4pc (+24% SAC Efficiency + −9% Skill CDR + +9.6% Skill Duration) is the universal support anchor for Vanguard Scout and Aegis Operator builds. The −9% Skill CDR combined with Boom-Shakalaka 2pc (−6% Skill CDR) and Pressing Matter OS (+10% Skill CDR) creates permanent uptime on Tactical Smart Cover (41s duration vs 35s CD with these bonuses applied).

---

### Jackpot — The Skill Crit Platform
**Source:** u/TheeLoo build breakdown

Jackpot 3pc (+10.8% Skill CHC) is a key building block for reaching 99% Skill Crit Chance on Demo/Tech Op builds. Combined with Rampart Gold OS (Lv50 +36% Skill CHC) and Sniper TAM (+12%), a full skill-crit-focused build can reach near-cap without relying on gear roll RNG for all crit chance.

---

### Warlord — Buy Only in Firepower Spec
**Source:** game_knowledge.md §16, community tip (high-signal)

**Critical warning:** If you purchase the Warlord exotic AR from the DZ vendor while in Engineering spec, the weapon rolls land on Engineering-compatible attributes and cannot be recalibrated to Firepower-relevant stats. Buy the Warlord ONLY while actively in Firepower specialization to guarantee Firepower-pool rolls.

---

### Healing Hive Mods — Two Are Broken (Do Not Recommend)
**Source:** u/LaClown-ua post-nerf breakdown, community-wide consensus

- **240% Healing Hive Damage Mod:** Broken. Does not function. Do not recommend in any build.
- **25% Damage Amplification Hive Mod:** Broken. Does not function. Do not recommend.

These were relied upon in pre-nerf Combat Medic builds that stacked Firepower. After the Healing Hive multi-tick patch (late April 2026), those builds also stopped working. Medic builds must be rebuilt from scratch around Toughness stat + correct gear sets (Captain Cow, Dr. Medic, Healing Elites).

---

### Healing Elites — T2 Only, Worth It
**Source:** Community consensus on leaderboard builds

Healing Elites 4pc (+28% Armor) is a top-tier T2 endgame set for survival-focused medics and tanks. Its T2-only availability means it is not accessible until Elite/Legendary difficulty farming, but its bonuses (+14.4% Received Healing, +15% Release Extra Protection, +28% Armor) are uniquely powerful.

---

## SECTION 5: DARK ZONE MECHANICS (Validated by u/LaClown-ua Guide)

### Complete DZ Rules (from LaClown-ua's High-Voted Guide)
u/LaClown-ua posted the definitive DZ mechanics guide (134 upvotes, 62 comments). Key mechanics-relevant points:

- **20-minute timer:** After timer expires, NPCs despawn at extraction zone. Get your extraction done before the clock.
- **Solo vs team queuing:** If you queue solo, everyone on the map is solo. Queue as a team, everyone is a team. Choose your mode deliberately.
- **Rogue drops are re-rolled:** When a player is killed, the dropped loot is randomly generated — it is NOT their actual inventory. Cannot steal godrolls.
- **Rope cut = rogue keeps 50%:** Even if the rope cutter is immediately killed, they keep 50% of what was on the rope.
- **Matchmaking:** DZ matches you within ±2 levels when solo. A team with a higher-level player breaks the range rule.
- **DZ mod dismantle location matters:** Dismantling mods inside the DZ (or contextually tied extraction loot) yields DZ Credits (~15 Blue / ~75 Purple / ~750 Yellow). Dismantling outside the DZ yields standard materials, NOT DZ Credits.
- **Smuggling vs extraction:** Smuggling (300/600/1,200 DZ Intel) is safer than rope extraction. Use rope for high-value hauls when you've cleared the zone.
- **Extraction advice from LaClown-ua:** "Extract only when you are alone. If you need to rearrange loot — hide somewhere."

---

### DZ Boss Loot — Gold Chips NOT in Boss Caches
**Source:** u/Juanraden (comment on PC launch PSA, high upvotes)

"You can get everything for free by playing the game, even the gold OS (weekly bounty) and exotic weapon (DZ)."

Gold OS Chipsets are available from the DZ vendor for DZ Credits — they do NOT drop from DZ boss caches. DZ Credits are the gating resource, not boss RNG.

---

## SECTION 6: PVP INSIGHTS (Community-Validated)

### Bulwark Spike — No Counterplay Consensus
**Source:** u/LaClown-ua (Guide flair, multiple build posts), u/Iamonslaughtt

u/LaClown-ua (confirmed Bulwark leaderboard player): "I don't say that I AM amazing in PVP, I say that Bulwark IS amazing in PVP because of Spike. I acknowledge that this is low skill and cheesy, so there is no illusions that winning in PVP is some kind of math or skill, but fact is fact — Bulwark dominates PVP right now."

Stun Grenade + Bulwark Shield: confirmed 5-second stunlock. Community consensus: no counterplay available in current meta.

**Shockwave Spike:** 3–5 second stun, 10-second cooldown. The gap between stuns is the only window of counterplay.

---

### Conflict HP Normalization — Talents Carry Through
**Source:** Community multiple threads

Conflict (PvP Domination) normalizes base HP to approximately 20,000–22,000 regardless of actual HP stat. However, talents, OS Protocols, and skill effects carry through normalization. This means:
- DPS spec builds are hurt most by normalization (they had less HP to trade; now their damage advantage also shrinks)
- Bulwark benefits most (shield mechanic is unaffected by HP normalization)
- Do not queue Conflict below Level 40 — the normalization does not fully protect undergeared players from talent gaps

---

### PC Launch — DZ and Conflict Impact
**Source:** Multiple community threads (April 28, 2026 PC launch)

Community concern: Mouse aim advantage in PvP/DZ versus mobile players. Cross-play is enabled by default. u/SloshedJapan: "There's no way you can match a Mouse's aim." u/Kobayanator: "Not gonna touch Conflict and DZ moving forward." This is a current (May 2026) build and content consideration — DZ builds for mobile players should account for PC player presence.

---

## SECTION 7: FARMING AND PROGRESSION INSIGHTS

### Top 15 Offensive Tech Operator Build Analysis
**Source:** u/asaling229 (Americas, leaderboard stat analysis)

Analyzed Top 15 Offensive Tech Operators on Americas server. Key findings:
- Most common stat across gear: **Skill Crit Hit Damage** (appeared 34/240 possible slots), **Skill Crit Hit Chance** (28/240)
- "After the Top 15, builds get VERY diverse and there are a lot more 'hybrid' Eng/Firepower setups"
- "Engineering specs have a much higher cap than Firepower" (u/MuteDeafenSelf observation, confirmed by leaderboard distribution)
- u/asaling229: "From what I can tell in other posts, the Brains-Over-Braun [BoB] was being used by several of the top players" — this analysis predates the BoB nerf; the top builds have since shifted

### Top 15 Demo Field Grenadier Build Analysis
**Source:** u/asaling229

Most common skill mod used: Potent Composition (5/15 top players). Average stats: Field Grenadier builds run Engineering-heavy with Skill Crit focus. "The red build [Field Grenadier] is definitely less meta" compared to HE Demo.

**u/Plus-Editor-6928 caution:** "Don't look at leaderboards for 'top' players. Power Score is mostly irrelevant and top leaderboard players are, most of the time, just equipping whatever has the highest score to top them." Useful context: leaderboard data shows what stats are common, but high PS ≠ optimal build.

---

### Tech Op / Vanguard DBS — Strict Performance Requirements
**Source:** Build flair threads (4000–5100 region of kb.md)

The Vanguard Double Barrel Shotgun build specifically: "Strict internet/performance requirements." Players with latency issues reported the Tactical Link ult not reliably generating the near-infinite ammo effect. This build requires low-latency mobile/PC connection to function as intended.

---

### kimbaoki (MimiLolita) — 900k → 1M DPS Milestone
**Source:** u/kimbaoki post (93 upvotes)

"900k DPS today without T2 gears — Tech OOP. All yellow T1 gears, no crazy rolls, OS lv41." Updated in comments to 1M DPS after optimization.

**u/nephiliasm observation:** "No crazy rolls but you got 2.7k Eng" — showing that Engineering stat depth is the key to Tech Op DPS, not exotic gear. 2,700+ Engineering is a meaningful endgame target for offensive Tech Op builds.

---

### Rule of Threes — Why Exactly Three
**Source:** game_knowledge.md §18.33 (Podcast/Masterclass section)

Open-world activities (Arms Deals, Hostage Rescues, Supply Runs) have hidden economic throttles on Electronic Alpha/Beta/Gamma component drops. Drop rates are heavily weighted toward the first few completions of each type per day. After three completions of one activity, the drop rate for its specific component drops sharply.

- Grinding 50 Supply Runs = huge Gamma stack + no Alpha or Beta = class upgrade still fails
- Rule of Threes (3+3+3) guarantees balanced inflow of all three components in the ratio the upgrade algorithm requires
- These components gate all class upgrades — there is no workaround

---

### Weekly Bounty Boss — First Clear Rule
**Source:** u/0kills, u/Wruh00, u/The_Law- (confirmed)

Weekly bounty boss guarantees a Gold OS on first clear. Replays yield Purple only. This is the primary F2P source of Gold OS. Missing the first clear is a meaningful progression loss per week.

**Reset:** Weekly server reset occurs Sunday at ~6 PM server time. Set a reminder.

---

## SECTION 8: QOL AND HIDDEN MECHANICS (Worth Knowing for Content)

### Buy-Back Vendor Mechanic
**Source:** game_knowledge.md §18.30

Sold or dismantled items can be bought back within the same session. Logging out clears the buy-back list. This is a safety net for accidental dismantles — not advertised anywhere in-game.

### Hostile Nest Party Finder Teleport
**Source:** u/Porturan (↑30)

Quick-joining a Hostile Nest through the party finder teleports you directly inside the instance — no travel required. Significant time saver for Nest farming.

### XP Bonus Indicator
**Source:** u/j4nku

The up-arrow icon next to the XP bar indicates bonus status. Yellow arrow = bonus active (10,000+ XP per run). White arrow = bonus exhausted (~3,000 cap). Stop running the same mission for XP when the arrow turns white — you're losing efficiency.

### Unstuck Option
Available in the Settings menu. Faster than quitting if you fall through the world or enemies become invisible. Not widely known.

### DZ Interactive Map
**Source:** u/patrikjuvonen

Full interactive DZ map available at: [thedivision.fandom.com/wiki/Map:Tom_Clancy's_The_Division_Resurgence/N.Y.C._Dark_Zone](https://thedivision.fandom.com/wiki/Map:Tom_Clancy%27s_The_Division_Resurgence/N.Y.C._Dark_Zone)

Full open-world LZ map: [thedivision.fandom.com/wiki/Map:Tom_Clancy's_The_Division_Resurgence/New_York_City](https://thedivision.fandom.com/wiki/Map:Tom_Clancy's_The_Division_Resurgence/New_York_City)

---

## SECTION 9: CONFIRMED BUG IMPACTS ON BUILDS

These community-reported bugs directly affect build recommendations. Do not design builds around them.

| Bug | Community Source | Build Impact |
|---|---|---|
| Healing Hive 240% mod broken | u/LaClown-ua post-nerf guide + community consensus | Do not include in any Combat Medic build |
| Healing Hive 25% damage amp mod broken | Community testing | Do not include in any build |
| Recursive Treatment OS | u/Silent-Farm-6997 + community testing | Does not proc from Mender Drone (confirmed). Inconsistent or non-functional with Healing Hive, Support Station, Medkit. Treat as broadly broken across all heal sources. Do not build around it. |
| Steady Handed on Lady Death | game_knowledge.md §18.27, no community contradiction | Remove from all Lady Death build talent listings |
| Warlord proficiency wiping (iOS) | Multiple community threads | Warn iOS players; recommend logging into PC client to stabilize |
| Weapon proficiency stuck at Lv3/Lv5 | u/TheKramer1978 + many others | Known bug; largely fixed by April 28 patch but still active in some cases |
| Healing Hive multi-tick | Patched late April 2026 | Pre-patch medic builds are broken; rebuilt for Toughness-primary stat |
| Prime Engineer stat display | game_knowledge.md §18.27 | "Stat may display but not affect skill damage" — avoid recommending it |
| Fury Strike 4pc crit bonus display | game_knowledge.md §18.17 | "May not display in attributes panel" — monitor for patches |
| Brains Over Brawn (BoB) double-dip | Patched EU May 7–8, 2026 | Pre-nerf Aegis builds no longer valid; rebuild with correct stats |
| Neverending reload animation | Community consensus | Animation plays but damage timing is affected — flag in any build using this talent |

---

## SECTION 10: OS PROTOCOL COMMUNITY INSIGHT

### Fire for Effect vs. Concerted Strike
**Source:** u/Corruptsmurf OS Protocol post (community notice)

The OS Protocol named "Fire for Effect" in the community-compiled list corresponds to what game_knowledge.md calls "Concerted Strike" (Firepower HE OS: Skill damage within 20m → +8% Damage Bonus 10s, up to 3 stacks, 1s CD). The naming discrepancy between community sources and the Build Database is notable — always use the effect text to confirm identity, not just the name.

### Recursive Treatment Error — Community Correction
**Source:** u/Silent-Farm-6997 (OS Protocol list thread)

"There is one little mistake with recursive treatment, the passive is 18% of engineering not skill crit chance." The Recursive Treatment OS bonus stat is Engineering +18%, not Skill Crit Chance as some sources listed. Confirm against the Build Database.

---

## SECTION 11: MEDIC GEAR SET — COMMUNITY CORRECTION

**u/LaClown-ua (post-nerf PSA, 70 upvotes):**

"There is actually gear sets for medics. Not Phalanx Attack, not Quick Draw, not Jackpot and Fire Cycle. But Captain Cow, Dr. Medic, Healing Elites."

Many players were running non-medic gear sets on Field Medic builds (Firepower sets) because they stacked stats incorrectly for the bugged heals. Post-nerf, the correct sets are:
- **Captain Cow** (T0+) — healing intensity, skill duration, move speed
- **Dr. Medic** (T0+) — healing intensity, skill intensity, release extra protection
- **Healing Elites** (T2 only) — received healing, release extra protection, armor

These are the only three sets with healing-specific bonuses. Any other set on a pure Combat Medic is suboptimal.

---

*End of Division Resurgence Reddit Community Insights — pair with division_resurgence_mechanics_kb.md for full context*
*RapidF5 / resurgencebuilds.com | Sources: r/thedivisionresurgence Feb–May 2026*
