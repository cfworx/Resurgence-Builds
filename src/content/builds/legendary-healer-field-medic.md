---
title: "The Legendary Healer — Field Medic Support Build"
specialization: Field Medic
playstyle: Support
pve: true
pvp: false
lastUpdated: 2026-05-17
patch: "1.2.0"
tags: ["field medic", "healer", "support", "legendary", "endgame", "group"]
description: "The ultimate Field Medic healer build for Legendary difficulty. Three simultaneous healing engines push ~37k HP per tick for 84 seconds. Teams fight over having you."
author: "AgentHex"
---

## The Thesis — How This Build Wins Legendary

Legendary missions punish two things: teams that die, and healers who can't outpace the damage. This build solves both at once by running three team-facing engines simultaneously, none of which depend on a single trigger or proc chain.

**No chest talent in the Field Medic pool grants team-wide damage reduction.** Hypervigilant, Rock Solid, Boosted Shield, Fearless Charge — every DR talent in the chest pool reads "grants +X% DR" with no "to allies" wording, meaning the DR lands on the wearer only. So this build does not pretend to layer team DR. Instead, it pushes heal density so high that allies never spend time at low HP — the HP bar simply does not move.

### Engine 1 — Heal Output (You, the Source)

Stack +18% Healing Intensity (Medical Accuracy) via every SMG headshot, layer it onto +20% HI from Captain Cow 4pc, then add +20% HI from Medical Excellence OS. Multiplicative output stacking that lifts every heal you cast 70-80% over baseline.

### Engine 2 — Team Heal Multiplier (the Receiving Side)

Slaughter Healing gives +7% Incoming Healing per stack to all allies within 40m, up to 3 stacks = +21% team-wide IH as long as your SMG is firing. Effective Triage Support Station mod fires a +40% Incoming Healing buff on any ally below 50% HP standing in the 9.27m radius. Medical Excellence OS adds a flat heal pop on every cast — +5% Max HP to the entire ally team when the healed ally is above 50%, +12.5% Max HP to the target when below 50%. Three independent team-side multipliers compounding on Engine 1.

### Engine 3 — Skill Uptime (the Duration Multiplier)

Deep Focus chest = +28% Skill Duration (trade: −10% Skill Radius). Brainstorm backpack = +30% Skill Duration always-on (you're always within 20m of an ally in team play). Captain Cow 4pc adds +14.4% Skill Duration. Total ~+72% additive Skill Duration on a base 44.9s Support Station, pushing the station past 75s uptime. Each tick is bigger AND the station lasts longer AND your heal stream covers more of the fight.

All three engines run at the same time, every fight, with zero swap penalty.

---

## The One Gun — Why You Never Swap

You run a single SMG. It rolls both healing talents simultaneously. You aim for the head, you contribute kills/assists, and every shot fed into an enemy reloads your team's heal multipliers. No swap, no thinking, no cover dance.

**Primary: SMG with Slaughter Healing + Medical Accuracy (T2)**

Find a T2 SMG with both talents rolled. PPSH-41 family, Vector family, MP7 family are all reasonable candidates — confirm in your inventory.

- **Slaughter Healing** — Kills and assists grant +7% Incoming Healing for 10 seconds to all allies within 40 meters, up to 3 stacks. Permanent uptime in any fight where you're shooting.
- **Medical Accuracy** — Headshots grant +18% Healing Intensity for 10 seconds. Refreshes constantly with SMG fire rate.

**Secondary: Stat stick only — never drawn.** Hold any defensive/utility weapon for stat passives only (e.g., Slaughter Fortitude for +12% Armor on kills/assists).

---

## The Full Loadout

| Slot | Choice | Notes |
|------|--------|-------|
| Specialization | Field Medic | Healing Swarm signature (team-wide micro-drone heal/revive burst) |
| Primary Weapon | SMG with Slaughter Healing + Medical Accuracy (T2) | One gun, both talents |
| Secondary Weapon | Stat-stick only | Roll for Engineering/Toughness passives |
| Combat Skill 1 | Support Station | Effective Triage mod set (3-piece). +40% IH to allies below 50% HP |
| Combat Skill 2 | Healing Hive | Mutual Support mod set (3-piece). +9.60% Skill Intensity while deployed |
| Signature | Healing Swarm | Mass-heal/revive all allies in range. Saved for panic moments |
| OS Protocol | Medical Excellence (Toughness, Superior) | +20% HI passive. Bonus pop on every heal cast |
| Gear Set (endgame) | Healing Elites 4pc | +14.4% Received Healing / +15% Release Extra Protection / +28% Armor |
| Gear Set (bridge) | Captain Cow 4pc | +20% Healing Intensity / +14.4% Skill Duration |
| Body Armor | T2 chest with Deep Focus | +28% Skill Duration (trade: −10% Skill Radius) |
| Backpack | T2 bag with Brainstorm | +30% Skill Duration (within 20m of ally) |

---

## Per-Piece Stat Sheet

Every gear piece chases **Engineering Core** because Engineering bonus attributes contain every healing-relevant stat.

| Slot | Core | Bonus #1 | Bonus #2 | Brand / Talent |
|------|------|----------|----------|----------------|
| Mask | Engineering | Skill Intensity | Skill Duration | Healing Elites OR Captain Cow |
| Chest | Engineering | Skill Intensity | Skill Duration | T2 chest with Deep Focus |
| Backpack | Engineering | Skill Intensity | Skill Duration | T2 bag with Brainstorm |
| Gloves | Engineering | Skill Intensity | Skill Cooldown Recovery | Healing Elites OR Captain Cow |
| Holster | Engineering | Skill Intensity | Skill Duration | Healing Elites OR Captain Cow |
| Knee Pads | Engineering | Skill Intensity | Skill Cooldown Recovery | Healing Elites OR Captain Cow |

**Top-3 Stat Priority:** Skill Intensity → Skill Duration → Skill Cooldown Recovery

**Stats you do NOT chase** (reroll on sight): Received Healing, Max Health/Armor/DR bonus rolls, all Firepower stats, Damage to Elites.

---

## The Math — Per Support Station Tick

100k HP teammate at 40% health, standing in Support Station radius. Healing Hive deployed within 20m. Base Support Station heal tick = 8,000 HP before multipliers.

### Output Stack (What You Multiply)

| Multiplier | Source | Effect |
|-----------|--------|--------|
| +20% Healing Intensity | Captain Cow 4pc | × 1.20 |
| +18% Healing Intensity | Medical Accuracy (headshot up) | × 1.18 |
| +20% Healing Intensity | Medical Excellence OS passive | × 1.20 |
| +9.6% Skill Intensity | Mutual Support (Hive deployed) | × 1.096 |
| **Output subtotal** | 8,000 × 1.20 × 1.18 × 1.20 × 1.096 | **≈ 14,908 HP** |

### Target Stack (What the Receiving Ally Multiplies)

| Multiplier | Source | Effect |
|-----------|--------|--------|
| +21% Incoming Healing | Slaughter Healing (3 stacks) | × 1.21 |
| +40% Incoming Healing | Effective Triage (ally below 50%) | × 1.40 |
| **Target subtotal** | 14,908 × 1.21 × 1.40 | **≈ 25,254 HP per tick** |
| + Medical Excellence pop | +12.5% Max HP (ally below 50%) | + 12,500 HP |
| **Total per tick** | All multipliers + ME target-pop | **≈ 37,754 HP** |

**A 100k HP ally goes from 40% to 78% in ONE tick.**

### Support Station Uptime

| Source | Skill Duration |
|--------|---------------|
| Deep Focus chest | +28% |
| Brainstorm backpack | +30% |
| Captain Cow 4pc | +14.4% |
| Per-piece rolls (~4 pieces) | ~+16% |
| **Total Duration** | **~+88%** |
| Base duration | 44.9s |
| **Extended duration** | **~84 seconds** |
| Ticks per cast | ~56 ticks |

**~37,754 HP per tick × ~56 ticks = ~2.11 million HP per Support Station deployment.**

---

## Team Buff Cascade — What Allies Actually Feel

Everything below applies to your **team**, running simultaneously every fight:

| Source | Effect on Team | Trigger |
|--------|---------------|---------|
| Slaughter Healing (gun) | +21% Incoming Healing on every ally | Any kill or assist |
| Effective Triage (Station mod) | +40% IH to allies below 50% HP | Automatic |
| Medical Excellence (target pop) | +12.5% Max HP to low-HP target | Every heal cast |
| Medical Excellence (team pop) | +5% Max HP to entire team | Every heal on high-HP ally |
| Mutual Support (Hive mod) | +9.60% Skill Intensity to all heals | Passive while Hive deployed |
| Healing Hive (auto-target) | Auto-heals lowest-HP ally | Deploy and forget |
| Medical Accuracy (gun) | +18% Healing Intensity | Every headshot |
| Captain Cow 4pc | +20% Healing Intensity | Passive |
| Deep Focus chest | ~8 extra Station ticks per cast | Passive |
| Brainstorm backpack | Extended Station + Hive uptime | Passive |
| Healing Elites 3pc | +15% overshield on team heals | Passive (endgame) |
| Healing Swarm signature | Mass-heal/revive all allies | On signature ready |

Twelve independent team-facing effects running simultaneously every second.

---

## Skill Mod & OS Choices

### Support Station: Effective Triage (3-piece)

- 2pc: +3.3-6.7% Healing Intensity
- 3pc: +40% Incoming Healing to any ally below 50% HP in radius
- **Strongest healing mod set in your class**

### Healing Hive: Mutual Support (3-piece)

- 2pc: +3.3-6.7% Healing Intensity
- 3pc: +9.60% Skill Intensity while Hive deployed and within 20m of ally
- **Global heal multiplier on every tick**

### OS Protocol: Medical Excellence (Toughness, Superior)

- +20% Healing Intensity passive
- Above 50% HP ally: +5% Max HP to entire team per heal cast
- Below 50% HP ally: +12.5% Max HP to target per heal cast
- 5-second cooldown

---

## Gear Set Ladder

| Set (4pc) | Bonuses | When to Run |
|-----------|---------|-------------|
| Captain Cow | +3.6% MS / +14.4% Skill Duration / +20% HI | **Bridge set.** Highest flat HI bonus. Run from launch through endgame |
| Healing Elites | +14.4% Received Healing / +15% Release Extra Protection / +28% Armor | **Endgame target.** Requires elite missions |
| Boom-Shakalaka | −6% Skill CDR / +18% Skill Radius / +12% SI | Throughput/uptime hybrid alternative |
| Dr. Medic | +10% HI / +9% SI / +20% Release Extra Protection | Partial-set fallback during early game |

---

## Why Deep Focus Earns the Chest Slot

Every chest talent in the Field Medic pool was verified against the spreadsheet. The rule: if the text does not say "ally" or "team," the effect lands on the wearer only.

| Chest Talent | Lands on Team? | Verdict |
|-------------|---------------|---------|
| **Deep Focus** | YES (extends Station/Hive for team) | **USE THIS** |
| Territory Expansion | Indirect (widens radius, but conditional on full HP) | Fragile trigger |
| Hypervigilant | NO (self-only DR) | v6/v7 error corrected |
| Boosted Shield | NO (self-only DR) | No Extra Health source |
| Duality | NO (self-only DR) | — |
| Fearless Charge | NO (self-only DR) | You're stationary |
| Emergency Retreat | NO (self-only DR) | — |

**Deep Focus is the only chest talent that turns your slot into more healing for the team.**

---

## Combat Rotation

### Opening 5-10 Seconds

1. **Drop Support Station** at the team's cover position. Effective Triage activates the moment anyone dips below 50%
2. **Deploy Healing Hive** within 20m. Mutual Support's +9.60% SI activates. Hive auto-heals lowest-HP ally
3. **Start firing SMG** — aim for headshots. First kill/assist hands the team Slaughter Healing stack #1
4. Within 5 seconds: all multipliers are at max
5. At 8-10s: Support Station extended to ~84s uptime. Every heal multiplier is running

### Sustained Mid-Fight

- Stay inside your own Support Station radius for self-healing
- Keep SMG firing for constant headshots (Medical Accuracy refreshes every 10s)
- Re-deploy Healing Hive the instant its CD pops
- Re-position Support Station only when the team moves out of radius

### When an Ally Takes a Heavy Hit

- Inside Station radius → Effective Triage fires automatically. Combined tick: ~37k on a 100k HP ally. They go from 40% to 77% in one second
- Fire SMG at any nearby enemy for an assist — refreshes team's +21% Slaughter Healing aura
- Healing Hive auto-targets them as the lowest-HP ally
- Pop Healing Swarm **only** for whole-team pressure moments

### What You Do NOT Need to Do

- You do not need to spam medkits on allies
- You do not need to break cover to revive
- You do not need to swap to a defensive gun
- You do not need to worry about your own HP — your own Station ticks keep you topped passively

---

## Loot Priority

### Pick Up Immediately

| Item | Why |
|------|-----|
| T2 SMG with Slaughter Healing + Medical Accuracy | The one gun |
| Captain Cow gear piece (any slot) | Bridge 4pc |
| Healing Elites gear piece | Endgame 4pc |
| T2 chest with Deep Focus | Build-defining talent |
| T2 backpack with Brainstorm | Build-defining talent |
| Effective Triage Support Station mods (×6) | Station multiplier |
| Mutual Support Hive mods (×6) | Hive SI multiplier |
| Medical Excellence OS Protocol | Primary OS |

### Scrap on Sight

- Anything with Firepower Core (except stat-stick secondary)
- Anything with Toughness Core
- Bonus rolls of: Weapon Damage, Crit, Headshot Damage, Received Healing
- Any weapon talent that isn't Slaughter Healing or Medical Accuracy on the primary
- Any gear set not Captain Cow / Healing Elites / Boom-Shakalaka / Dr. Medic

---

## TL;DR — The Five Things to Remember

1. **One gun.** SMG with Slaughter Healing + Medical Accuracy. Never swap. Aim for the head
2. **Support Station + Effective Triage. Healing Hive + Mutual Support.** Effective Triage = +40% IH when any ally dips below 50%
3. **One OS Protocol.** Medical Excellence. Two heal pops per cast — +5% Max HP team-wide or +12.5% Max HP to target
4. **Deep Focus chest + Brainstorm backpack + Captain Cow 4pc.** Engineering Core on every slot. Skill Intensity → Skill Duration → Skill CDR
5. **The numbers:** ~37,754 HP per tick × ~56 ticks = ~2.11M HP per deployment. Ally goes from 40% to 77% in ONE tick. Station lasts ~84 seconds

**Now go heal. Nobody approaches zero.**
