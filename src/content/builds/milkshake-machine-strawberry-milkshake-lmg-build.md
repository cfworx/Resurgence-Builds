---
title: "The Milkshake Machine | Strawberry Milkshake LMG Build for Vanguard"
specialization: "Vanguard"
subclass: "Vanguard"
playstyle: DPS
pve: true
pvp: true
lastUpdated: 2026-05-29T00:00:00Z
patch: "Patch 1.1.2.2"
plannerHash: "s=Vanguard&n=The+Milkshake+Machine&ms=gs-3&m1=Weapon+Critical+Hit+Chance&m2=Weapon+Critical+Hit+Damage&cs=gs-3&ct=ba-12&c1=Weapon+Critical+Hit+Damage&c2=Weapon+Damage&ps=gs-1&pt=bp-12&p1=Weapon+Critical+Hit+Damage&p2=Weapon+Damage&gs=gs-3&g1=Weapon+Critical+Hit+Chance&g2=Weapon+Critical+Hit+Damage&hs=gs-3&h1=Weapon+Critical+Hit+Damage&h2=Weapon+Damage&ks=gs-1&k1=Weapon+Critical+Hit+Damage&k2=Weapon+Critical+Hit+Damage&w1s=ew-3&w1t=wt-22&w1t2=wt-60&w2s=sw-13&w2tr=T2&w2t=wt-43&w2t2=wt-45&os=os-38"
tags: ["Builds", "Vanguard", "LMG", "Exotic", "Strawberry Milkshake", "Phalanx Attack", "In Sync", "Multi-Shot", "Dominating Presence"]
description: "The Milkshake Machine is a Strawberry Milkshake LMG build for Vanguard in Division Resurgence. Phalanx Attack 4pc + Fury Strike 2pc, In Sync double-dip, Dominating Presence OS, and a Multi-Shot stack that turns a 118-round mag into a crit avalanche. Full gear, talents, skill mods, and rotation."
author: "RapidF5"
featuredImage: "/images/builds/milkshake-machine-hero.jpg"
imageAlt: "Division Resurgence Strawberry Milkshake exotic LMG build guide hero image showing the Strawberry Milkshake weapon on a billboard in a snowy city environment with ISAC intel overlay"
shareTitle: "Bring the blender"
shareText: "118 rounds. 37% Multi-Shot. Glass Cannon justified. This is The Milkshake Machine."
faqs:
  - question: "What is the best Strawberry Milkshake build in Division Resurgence?"
    answer: "The Milkshake Machine. Phalanx Attack 4pc + Fury Strike 2pc, Vanguard class, with Glass Cannon on the chest and Inspiration on the backpack. Tactical Smart Cover and Scanning Pulse as the skills, Tactical Link as the signature. The build uses In Sync as the engine, double-dipping +18% Weapon Damage and +18% Skill Damage by chaining Scanning Pulse into Strawberry Milkshake fire. Swift Taunt's Extra Health buffer keeps Glass Cannon viable. Dominating Presence is the OS Protocol."
  - question: "Why is Strawberry Milkshake so good with In Sync?"
    answer: "Because the cast itself does the work. Scanning Pulse counts as a skill hit. That activates In Sync's skill-side buff instantly. The first bullet of SM activates the weapon-side buff. Both buffs are live in the same moment. Both double. You go from +9% each to +18% each from the first bullet of every engagement. No ramp-up. No stacking window. Just immediate uptime."
  - question: "Is Glass Cannon safe to run on this build?"
    answer: "Yes, because Swift Taunt is permanently active. At 550 RPM you hit three enemies inside five seconds without trying. That triggers Swift Taunt, which grants Extra Health equal to 25% Max Health for 10 seconds. That Extra Health buffer absorbs the -10% Damage Reduction penalty from Glass Cannon many times over. If you ever lose Swift Taunt uptime (solo content with single targets), you'll feel the squish. In group content and any crowd fight, Glass Cannon is a free +20% Damage."
  - question: "What OS Protocol should I use for The Milkshake Machine?"
    answer: "Dominating Presence. +12% Weapon Damage flat, plus +5% Weapon Multi-Shot Chance per enemy within 20 meters up to +20%. The build wants you fighting close anyway because SM's confirmed Optimal Range is 29m. Dominating Presence rewards exactly that aggressive positioning. Combined with Phalanx 4pc's +12% Multi-Shot and gear rolls, you can hit ~37-40% Multi-Shot Chance in any real crowd fight."
  - question: "What's the godroll for Strawberry Milkshake?"
    answer: "Weapon Damage + Weapon Critical Hit Damage on the attribute rolls. T2 rarity. In Sync + Swift Taunt as the rolled talents. SM is Shredding damage only, so do not roll Blast or Piercing. If you currently have Piercing Damage + Skill Intensity rolls (a common stock drop), this is your priority upgrade target."
  - question: "Can I run this build without Strawberry Milkshake?"
    answer: "You can run a Phalanx Attack 4pc + Fury Strike 2pc Vanguard build with a different LMG and most of the engine still works. You lose the In Sync + Swift Taunt combo on the weapon slot itself, which is the build's biggest single-piece synergy. If you're farming toward The Milkshake Machine, run an LMG with In Sync and Swift Taunt available in the talent pool while you wait for SM to drop or get the rolls you want."
  - question: "Why not pick Bugle Call instead of Commando for Tactical Link?"
    answer: "Bugle Call is a valid pick. It grants +14.40% Rate of Fire, Damage Reduction, and Movement Speed for 15 seconds on deploy, which is broad and defensive. Commando is the higher-ceiling pick for this specific build because the kit is already overflowing with RoF (Phalanx 3pc +18%, Inspiration +30%) and is built around Multi-Shot and crits. Commando's +10.20% WCHC on kills during Link directly amplifies the build's crit avalanche. If you want a more defensive signature window, Bugle Call is fine. If you want maximum damage, Commando."
  - question: "Is Division Resurgence pay-to-win?"
    answer: "Not for this build. Every piece of The Milkshake Machine drops from in-game content. Strawberry Milkshake is the only exotic gate, and exotics are farmable. The build scales through gear rolls and skill mod combo sets, not premium currency."
---

**By RapidF5 ·** Patch 1.1.2.2 ·

> Strawberry Milkshake is the exotic LMG that no one took seriously until someone bolted Phalanx Attack, Fury Strike, and In Sync onto it. This is that build. 118-round magazine, ~37% Multi-Shot Chance, double-dipped In Sync, Glass Cannon justified by Swift Taunt's Extra Health buffer, and a Dominating Presence OS Protocol that rewards standing in the worst possible spot. We call it **The Milkshake Machine** because it shreds enemies the way a blender shreds ice, and because naming a build "Strawberry Milkshake Optimal" doesn't sell guides.

This is a Firepower-stacked, Multi-Shot-stacked Vanguard build that turns the Strawberry Milkshake into the most disrespectful sustained-fire weapon in Division Resurgence. The core loop is straightforward: drop Smart Cover, cast Scanning Pulse, fire SM. Scanning Pulse counts as a skill hit, which activates In Sync's skill-side buff instantly. Your first SM bullet activates the weapon-side buff. Both buffs are live. Both double. You are now putting out **+18% Skill Damage and +18% Weapon Damage from bullet one**, into Pulsed enemies taking +20% vulnerability, with every third-ish bullet firing twice via Multi-Shot, while Glass Cannon adds +20% Damage and Inspiration grants +30% RoF because Smart Cover is always deployed. The 118-round magazine and Field Supplies skill mod refilling your mag on Pulsed kills means you almost never reload. When you do, Armored Train stacks WCHC behind cover passively. Tactical Link comes back, you pop it, Commando skill mod adds +10.20% WCHC on kills, and the room dies.

It's a lot of moving parts. That's the whole point.

---

## What This Build Does

- **~118-round magazine** at 550 RPM with Phalanx Attack 4pc.
- **In Sync double-dip:** +18% Weapon Damage and +18% Skill Damage simultaneously, from the first bullet of every engagement.
- **~37-40% Multi-Shot Chance** stacked from Phalanx 4pc (+12%), Dominating Presence OS (+20% at 4+ enemies), and gear rolls.
- **Glass Cannon (+20% Damage)** running permanently, balanced by Swift Taunt's 25% Max Health Extra Health buffer.
- **Inspiration backpack** grants +30% RoF whenever Smart Cover is deployed, which is basically always.
- **Field Supplies skill mod** refills 6.40% of your current magazine on every Pulsed-enemy kill, so the mag effectively never runs out in crowd fights.
- **Commando skill mod** stacks +10.20% WCHC for 10 seconds on every kill or assist during Tactical Link, turning your signature window into a crit avalanche.

This is not a glass-cannon-and-die build. The Extra Health from Swift Taunt is up almost permanently because hitting three enemies in five seconds at 550 RPM is trivial. You have a damage floor and a damage ceiling, and the ceiling is genuinely stupid.

---

## Strawberry Milkshake (Confirmed Stats)

| STAT | VALUE |
|---|---|
| Type | Exotic LMG |
| Damage Type | Shredding |
| RPM | 550 |
| Magazine | 100 base, ~118 with Phalanx Attack 4pc |
| Optimal Range | 29m base (extended via Fury Strike 2pc) |
| Exotic Talent | **Anarchy:** Hits inflict a debuff dealing 2.40% Weapon Damage over 4.50 seconds, up to 50 stacks. Dying enemies transfer all stacks to a nearby enemy within 12 meters. |
| Build Talents | **In Sync** (slot 1) + **Swift Taunt** (slot 2) |
| Godroll Attribute Rolls | Weapon Damage + Weapon Critical Hit Damage |

A note on Anarchy: the doc-and-Reddit consensus is that Anarchy is currently non-functional or so weak it's effectively non-functional for build purposes. **Do not build around it.** The real engine is In Sync.

> ⚠️ **One Exotic Hard Cap.** Strawberry Milkshake is your exotic. Only one exotic weapon can be equipped at a time. Never pair SM with Warlord, Lady Death, or any other exotic. The game will not allow it.

---

## The Milkshake Machine Gear and Loadout

### Gear

| SLOT | SET | TALENT | CORE | BONUS 1 | BONUS 2 |
|---|---|---|---|---|---|
| Mask | Phalanx Attack | none | Firepower | WCHC | WCHD |
| Chest | Phalanx Attack | **Glass Cannon** | Firepower | WCHD | Weapon Damage |
| Backpack | Fury Strike | **Inspiration** | Firepower | WCHD | Weapon Damage |
| Gloves | Phalanx Attack | none | Firepower | WCHC | WCHD |
| Holster | Phalanx Attack | none | Firepower | WCHD | Weapon Damage |
| Kneepads | Fury Strike | none | Firepower | WCHD | Optimal Range |

**Set Bonuses:**

- **Phalanx Attack 2pc:** Magazine Size +18.0% (gives you the ~118-round mag)
- **Phalanx Attack 3pc:** Rate of Fire +18.0%
- **Phalanx Attack 4pc:** Weapon Multi-Shot Chance +12.0%
- **Fury Strike 2pc:** Optimal Range +10.0% (stacks on SM's confirmed 29m base)

### Loadout

| SLOT | ITEM | DETAILS |
|---|---|---|
| Primary | **Strawberry Milkshake** (T1) | In Sync + Swift Taunt. Shredding damage. Upgrade target: T2 + WD/WCHD rolls. |
| Secondary | **PPSH-41** (T2) | Revitalize + Sentinel Aura. Survival swap only. |
| OS Protocol | **Dominating Presence** | +12% Weapon Damage. +5% Multi-Shot per enemy within 20m (max +20% at 4 enemies). |
| Skill 1 | **Tactical Smart Cover** | Triggers In Sync skill-side buff. Armored Train mod active behind it. |
| Skill 2 | **Scanning Pulse** | +20% Target Vulnerability. Triggers In Sync skill-side buff instantly. Field Supplies refills mag on Pulsed kills. |
| Signature | **Tactical Link** | Commando mod: +10.20% WCHC on kills during Link. |

### Skill Mods

Three skill mod combo sets, one per skill. All confirmed in-game on Patch 1.1.2.2.

| SKILL | MOD (3PC) | WHY THIS MOD |
|---|---|---|
| Tactical Link | **Commando** | Kills or assists while using Tactical Link grant +10.20% Weapon Critical Hit Chance for 10 seconds. At 550 RPM you are killing constantly during Link. Every signature window becomes a crit avalanche. |
| Commando Smart Cover | **Armored Train** | While behind a Smart Cover, weapon hits have a 5% chance of granting +2% Weapon Critical Hit Chance for 20 seconds, up to 3 stacks. Passive crit accumulation during the only moment you're not shooting, which is your reload window. |
| Scanning Pulse | **Field Supplies** | Kills or assists on Pulsed enemies restore 6% Health and refill 6.40% of the current magazine. Every kill in a crowd extends the mag. More mag time means more In Sync uptime means more Multi-Shot procs. |

**Alternative Pulse mod:**

| SKILL | ALT MOD | WHEN TO USE IT |
|---|---|---|
| Scanning Pulse | **Tactical Insight** | Deploying Scanning Pulse restores 48 Signature Ability Charges, increased by 64 if there are more than 3 enemies within 70 meters. Swap Field Supplies for this if you want maximum Tactical Link uptime over mag sustain. Creates a Pulse → Link → kill → Commando WCHC → repeat loop. |

**Alternative Link mod:**

| SKILL | ALT MOD | WHEN TO USE IT |
|---|---|---|
| Tactical Link | **Bugle Call** | Deploying Tactical Link grants +14.40% Rate of Fire, Damage Reduction, and Movement Speed for 15 seconds. Pick this over Commando if you want a defensive uptime boost and broader signature buffs. Commando is still the higher ceiling on a Multi-Shot/crit-focused setup. |

---

## Why Each Gear Piece Matters

**Chest: Glass Cannon (T2).** +20% Damage, -10% Damage Reduction. The damage trade is huge. The -10% DR is what scares people, and it shouldn't, because Swift Taunt grants you 25% Max Health Extra Health for 10 seconds every time you hit three enemies in five seconds. At 550 RPM into a crowd, that buff is permanent. The math says you have a fat health buffer almost constantly, which more than offsets the DR loss.

**Backpack: Inspiration (Fury Strike).** +30% Rate of Fire while skills are deployed. Smart Cover is deployed essentially all the time. This is +30% RoF as a passive baseline once you press the skill button. Free damage.

**Mask, Gloves, Holster: Phalanx Attack (Firepower core).** These are your crit roll slots. Stack WCHC on the mask and gloves, WCHD on the holster. The Phalanx 4pc set bonus is what makes the build, and these three slots round out the 4pc count.

**Kneepads: Fury Strike with Optimal Range secondary.** Fury Strike 2pc gives you +10% Optimal Range, which stacks on Strawberry Milkshake's confirmed 29m base. Optimal Range roll on the kneepads pushes that envelope further. You want to be deleting things before they get close enough to remind you Glass Cannon exists.

---

## Best OS Protocol for The Milkshake Machine

**Dominating Presence** is the pick. +12% Weapon Damage as a flat baseline, plus +5% Weapon Multi-Shot Chance per enemy within 20 meters, capped at +20% with 4 enemies. This OS Protocol literally rewards you for standing in a bad place, which is exactly where The Milkshake Machine wants to be. Combined with Phalanx 4pc's +12% Multi-Shot and gear rolls, you can comfortably hit ~37-40% Multi-Shot Chance in the middle of a crowd fight. That means every third-ish bullet fires twice. Onto Pulsed enemies. With In Sync's +18% WD active. While Glass Cannon adds +20% Damage. While Inspiration adds +30% RoF.

Other OS Protocols are technically usable on this build, but nothing else creates this much synergy with what the rest of the gear is doing. **Roll for Dominating Presence with any attribute, the talent is what matters.**

---

## Weapon Talents and Attachments

### Primary: Strawberry Milkshake (Exotic LMG)

The talents you want on Strawberry Milkshake are **In Sync (slot 1)** and **Swift Taunt (slot 2)**. Anarchy is locked as the exotic talent and is currently a non-factor.

- **In Sync:** Weapon hits grant +9% Skill Damage for 8 seconds. Skill hits grant +9% Weapon Damage for 8 seconds. Bonus is doubled when both buffs are active simultaneously. Cast Scanning Pulse first. Pulse counts as a skill hit. Skill-side buff activates instantly. Fire SM. Weapon-side buff activates on the first hit. Both active. Both doubled. **+18% Weapon Damage and +18% Skill Damage from bullet one.**
- **Swift Taunt:** Hitting 3 enemies within 5 seconds taunts nearby enemies and grants Extra Health equal to 25% Max Health for 10 seconds. At 550 RPM, this is trivially always on. This is what justifies Glass Cannon.

**Current SM rolls vs godroll.** If your Strawberry Milkshake came with Weapon Piercing Damage and Skill Intensity (the standard drop rolls), you're sitting on a non-ideal stat profile. SM is **Shredding damage only**. Do not roll Piercing or Blast. **Reroll for Weapon Damage + Weapon Critical Hit Damage** when you have the resources. That is the godroll.

### Secondary: PPSH-41 (T2, SMG)

This is a survival swap, not a primary damage tool. Talents: **Revitalize** (kills restore 4.20% Max Health for 3 seconds on a 4-second talent cooldown) and **Sentinel Aura** (hits within 20m restore Health based on Toughness, 5-second talent cooldown). Use it when your Extra Health buffer drops and you need a panic heal. Otherwise it lives in your back pocket.

---

## Stat Targets

| STAT | TARGET |
|---|---|
| Core (all 6 pieces) | Firepower. No exceptions. |
| WCHD | 60%+ from gear rolls |
| WCHC | 25%+ from gear rolls (Commando adds +10.20% during Link, Armored Train adds up to +6% passive) |
| Multi-Shot Chance | 37%+ total (Phalanx +12% + Dominating Presence +20% + gear) |
| Optimal Range | Extended via Fury Strike 2pc + kneepad roll on top of SM's 29m base |
| Weapon Damage | Roll on chest, backpack, holster where WCHD is not primary |
| Avoid | Blast Damage, Piercing Damage. SM is Shredding only. |

---

## Combat Rotation

**Pre-engage.** Drop Smart Cover. Cast Scanning Pulse. All enemies in range take a skill hit. In Sync skill-side buff activates instantly. Fire Strawberry Milkshake. Weapon hits activate the weapon-side buff. Both buffs are live. Both double. Full power from bullet one.

**Sustained fire.** Hold the trigger. 550 RPM + Phalanx +18% RoF + Inspiration +30% RoF means Swift Taunt's 3-enemies-in-5-seconds trigger is permanently met. Extra Health is always up. Glass Cannon is justified. With 4+ enemies within 20m, Dominating Presence adds +20% Multi-Shot. Every third-ish bullet is firing twice into Pulsed enemies. Field Supplies refills mag on Pulsed kills.

**Signature window.** Pop Tactical Link. Commando mod kicks in: every kill or assist during Link grants +10.20% WCHC for 10 seconds. Stack it. This is your room-clear window.

**Reload.** A 118-round mag means fewer reloads than any sane LMG build. When you do reload, do it behind Smart Cover. Armored Train begins stacking +2% WCHC at 5% per hit, up to 3 stacks (+6% total). In Sync refreshes within the first few shots of the new mag.

**Re-cycle.** Pulse back up. Recast. In Sync refreshed. Field Supplies online. Smart Cover refreshes, recast, In Sync skill-side refreshed, Armored Train stacks reset. Link comes back. Fire it. Repeat.

---

## Loot Quick-Reference for The Milkshake Machine

Farm checklist. Star priorities first.

- **Phalanx Attack · Mask** · Firepower core · WCHC + WCHD
- **Phalanx Attack · Chest** · Firepower core · Glass Cannon talent · WCHD + Weapon Damage
- **Phalanx Attack · Gloves** · Firepower core · WCHC + WCHD
- **Phalanx Attack · Holster** · Firepower core · WCHD + Weapon Damage
- **Fury Strike · Backpack** · Firepower core · Inspiration talent · WCHD + Weapon Damage
- **Fury Strike · Kneepads** · Firepower core · WCHD + Optimal Range
- **Strawberry Milkshake (T2)** · In Sync + Swift Taunt · Godroll: Weapon Damage + WCHD
- **PPSH-41 (T2)** · Revitalize + Sentinel Aura
- **Dominating Presence OS** · Any roll. The Multi-Shot talent is what matters.
- **Skill Mod · Tactical Link** · Farm Commando mod (3pc)
- **Skill Mod · Commando Smart Cover** · Farm Armored Train mod (3pc)
- **Skill Mod · Scanning Pulse** · Farm Field Supplies mod (3pc). Alt: Tactical Insight.

---

## Gear Ladder

| TIER | SETUP | NOTES |
|---|---|---|
| T0 | Phalanx 4pc + Quick Draw 2pc | Learn the engine. No Optimal Range patch yet. Mods still work. |
| T1 | Phalanx 4pc + Fury Strike 2pc + Inspiration backpack | Fully functional. In Sync double-dip live. All three skill mods active. |
| T2 | Same sets, godrolled. SM rerolled to WD + WCHD. | Full ceiling. Current SM attribute rolls are the priority upgrade. |

---

## Share the chaos

If this build melts a Dark Zone room for you, drop the clip. If it gets you killed in Outpost Annihilation because you forgot Glass Cannon was on, also drop the clip. We're not picky.

**Related builds and guides:**

- [OS Protocols Database](/database/os-protocols/)
- [OS Protocol Tier List](/tier-list/os-protocols/)
- [Patch 1.1.2.2 Notes](/patch-notes/patch-1-1-2-2/)
- [Exotic Weapons Database](/database/exotic-weapons/)
