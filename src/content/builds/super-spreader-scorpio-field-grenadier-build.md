---
title: "Super Spreader: Scorpio Field Grenadier Build (Theorycraft)"
specialization: "Demolitionist"
subclass: "Field Grenadier"
playstyle: DPS
pve: true
pvp: false
lastUpdated: 2026-10-29T18:00:00Z
patch: "Season 2 · Phase 2"
verified: false
theorycraft: true
tags: ["Theorycraft", "Field Grenadier", "Scorpio", "Artillery Turret", "Mechanical Enemy", "Gunny Johnny", "Concerted Strike", "Contagion", "PPSH-41", "Demolitionist", "off-meta", "build-guide", "Season 2"]
description: "Our own off-meta Field Grenadier build: the Scorpio makes them bleed, a Contagion Seeker Mine spreads it, and one Artillery Turret switches on five weapon buffs."
featuredImage: "/images/builds/division-resurgence-super-spreader-scorpio-septicemia-card-1200.webp"
imageAlt: "The Scorpio's card in The Division Resurgence Build-Making Database showing its Septicemia talent (Venom stacks that inflict Bleed, Confusion and Shock), with the title Super Spreader, Field Grenadier build"
author: "RapidF5"
shareTitle: "The shotgun infects. The mine spreads it. The turret pays for everything."
shareText: "A Field Grenadier build nobody runs: Scorpio Bleed, a Contagion Seeker Mine and an Artillery Turret that keeps five weapon buffs on."
plannerHash: "s=Demolitionist&sc=Field+Grenadier&n=Super+Spreader&ms=gs-6&m1=chc&m2=chd&gs=gs-6&g1=chc&g2=chd&hs=gs-6&h1=chd&h2=wd&cs=gs-5&ct=ba-4&c1=wd&c2=chd&ps=gs-5&pt=bp-12&p1=chd&p2=chc&ks=gs-6&k1=chc&k2=chd&w1e=ew-4&w1tr=T1&w1t=wt-22&w1t2=wt-34&w1b1=chd&w1b2=wd&w2s=sw-13&w2tr=T2&w2t=wt-22&w2t2=wt-6&w2b1=chc&w2b2=chd&os=os-33&sm1=smc-10&sm2=smc-13&sm3=smc-16"
faqs:
  - question: "What is the Super Spreader build in Division Resurgence?"
    answer: "Our own Demolitionist Field Grenadier design. The Scorpio exotic shotgun makes whatever it hits bleed (Septicemia), the Explosive Seeker Mine's Contagion mod copies that Bleed onto every enemy within 10 meters, and the Artillery Turret, which counts as a deployed skill and lands Skill Hits all fight, switches on Crossfire, Inspiration, In Sync, Concerted Strike and Prioritized Targets at once. Gear is 4pc Mechanical Enemy plus 2pc Gunny Johnny on the body armor and backpack."
  - question: "Has the Super Spreader build been tested in game?"
    answer: "Not yet. It's a theorycraft: we built it from the in-game Build-Making Database, checked that every gun, chest and backpack can actually roll the talent we ask for, and used the database's base numbers. RapidF5 is putting it together, and this page will get his results and anything that didn't work. The open questions, like how long the Artillery Turret lasts, are listed on the page."
  - question: "Do I need the Scorpio for this build?"
    answer: "It's the cleanest way to make enemies bleed, which is what Contagion and Prioritized Targets need. Without it, run the PPSH-41 with In Sync and Performer as your main gun, and the turret half of the build still works: Crossfire, Inspiration, In Sync and Concerted Strike don't care about Bleed. Swap the turret mod to Optimized and the mine mod to Area Denial unless your Demolitionist tree keeps enemies bleeding or Vulnerable on its own."
  - question: "Why Mechanical Enemy instead of Fury Strike?"
    answer: "Mechanical Enemy is the only gear set in the game that pairs weapon stats with a skill cooldown bonus: Weapon Critical Hit Chance +7.2% at 2 pieces, Optimal Range +15% at 3, Skill Cooldown Recovery -12% at 4. This build's damage hangs on the Artillery Turret being up, so the cooldown is worth more here than Fury Strike's crit damage. The +15% range also puts the Scorpio's 16-meter optimal range at about 18.4 meters, just inside the 20 meters that Performer and Concerted Strike want."
  - question: "Which OS Protocol does the Super Spreader build use?"
    answer: "Concerted Strike, a High-End Firepower protocol: +15% Weapon Damage as its main stat, and Skill Hits within 20 meters grant +8% Damage for 10 seconds, up to 3 stacks. The Artillery Turret's shots are Skill Hits, so it should sit at +24% for as long as the turret has something to shoot. Tactical Pistolero (Superior, +4.5% Firepower per Skill Hit up to 5 stacks) is the backup if you don't have it."
  - question: "Which chest and backpack can roll Crossfire and Inspiration?"
    answer: "Crossfire rolls on the X-TREYME Pro Ribcage (T2), \"Big Drum\" Body Armor (T2), Flimsy Body Armor v1 (T1), Phalanx Precision Vest (T1), Stridsvast Combat Vest (T0) and Ranger Ballistics Vest (T0). Inspiration rolls on the All Hazards Nitro Backpack (T2), Roamer Pack \"Sow\" (T2), Big Horn Pack (T1), Element Outdoors Rucksack (T0) and RUSH72 Backpack (T0). Neither rolls on a Mechanical Enemy piece, which is why the body armor and backpack are Gunny Johnny."
---

**By RapidF5 ·** Season 2 · Phase 2

## What This Build Does

Every Demolitionist build we've covered runs HE Munitions. The other focus, **Field Grenadier**, is the Firepower one: the game's Focus training screen describes it as dealing weapon damage, and more weapon damage to enemies its skills have hit. We haven't seen a creator build for it. So we made one, and then we kept pulling on threads until it turned into a plague.

> [!INFO] Theorycraft: designed, not tested yet
> This is our own design, put together from the in-game Build-Making Database. Every gun, chest and backpack below can actually drop with the talent or set we ask for (we checked each one against the database's Source lists, recorded October 29, 2026), and every number is the database's base value. What we haven't done yet is play it. RapidF5 is putting it together now, and this page will get his numbers and whatever didn't work. [What we still need to check](#what-we-still-need-to-check) lists the open questions.

Here's the trick. Most Firepower talents that care about skills are dead weight on a gun build, because you're busy shooting, not casting. Field Grenadier has a skill that keeps casting for you: the **Artillery Turret**. While it's down, it's a deployed skill, and every round it fires is a Skill Hit. That one turret switches on five weapon buffs at once.

Then it gets mean. The **Scorpio**'s Septicemia makes whatever you shoot bleed. The **Explosive Seeker Mine**'s Contagion mod copies that Bleed onto the whole pack. The turret's Prioritized Targets mod turns every bleeding target into Firepower. The shotgun infects, the mine spreads it, and the turret pays for everything. Super Spreader.

## The Loadout

| Slot | Pick | Set and talents |
|---|---|---|
| Primary | [Scorpio](/database/exotic-weapons/scorpio/) (exotic shotgun) | Septicemia + [In Sync](/database/weapon-talents/in-sync/) + [Performer](/database/weapon-talents/performer/) |
| Secondary | [PPSH-41](/database/weapons/ppsh-41/) (T2 SMG) | In Sync + [Backup Protection](/database/weapon-talents/backup-protection/) |
| Mask | [Protective Tactical Mask](/database/gear/#protective-tactical-mask) (T2) | [Mechanical Enemy](/database/gear-set-effects/mechanical-enemy/) |
| Gloves | ["Kote" Hand Guards](/database/gear/#kote-hand-guards) (T2) | Mechanical Enemy |
| Holster | [Jags Sidearm Mount](/database/gear/#jags-sidearm-mount) (T2) | Mechanical Enemy |
| Knee pads | [Urban Warfare Kneepads](/database/gear/#urban-warfare-kneepads) (T2) | Mechanical Enemy |
| Body armor | [X-TREYME Pro Ribcage](/database/gear/#x-treyme-pro-ribcage) (T2) | [Gunny Johnny](/database/gear-set-effects/gunny-johnny/), [Crossfire](/database/body-armor-talents/#crossfire) |
| Backpack | [All Hazards Nitro Backpack](/database/gear/#all-hazards-nitro-backpack) (T2) | Gunny Johnny, [Inspiration](/database/backpack-talents/#inspiration) |
| OS Protocol | [Concerted Strike](/database/os-protocols/concerted-strike/) | High-End, Firepower |
| Artillery Turret | [Prioritized Targets](/database/skill-mod-combos/prioritized-targets/) | 3pc |
| Explosive Seeker Mine | [Contagion](/database/skill-mod-combos/contagion/) | 3pc |
| M32A1 Grenade Launcher | [Field Mortar](/database/skill-mod-combos/field-mortar/) | 3pc |

The Open in Build Planner button loads all of it, attributes included, and the planner's checks come back clean: both armor talents can roll on those pieces, and both guns can roll those talents.

## How the Chain Works

Talent text below is the database's own wording, at base rank. Ranked-up copies read higher.

**1. The turret is the on switch.** Drop the Artillery Turret and five things light up:

- **Crossfire** (body armor): "Grants +15% Weapon Damage when Skills are deployed."
- **Inspiration** (backpack): "Grants +30% Rate of Fire when Skills are deployed."
- **In Sync** (both guns): Weapon Hits grant +9% Skill Damage for 8 seconds and Skill Hits grant +9% Weapon Damage for 8 seconds, and "Bonus is doubled when both buffs are active at the same time." You shoot, the turret shoots, so both should stay up: +18% Weapon Damage for you and +18% Skill Damage for the turret, the mine and the launcher.
- **Concerted Strike** (OS Protocol): "Skill Hits within 20 meters have a 100% chance of granting +8% Damage for 10 seconds, up to 3 stacks," at most once a second. A few seconds of turret fire and you're at +24% Damage.
- **Prioritized Targets** (turret mod): "Artillery Turret hits on enemies afflicted by Bleed or Vulnerable grant +1.44% Firepower for 10 second(s), up to 5 stack(s)." That's +7.2% Firepower, as long as the turret is shooting something that bleeds. Which brings us to the shotgun.

**2. The Scorpio infects.** Septicemia: "Hitting an enemy inflicts Venom for 2.50 seconds, up to 7 stacks." One stack inflicts Bleed for 10 seconds. Three inflict Confusion for 2 seconds, six inflict Shock for 3 seconds, and seven deal additional damage equal to 10% of Damage Dealt for 10 seconds. So the very first hit on an enemy makes it a Prioritized Targets target.

**3. The mine spreads it.** Contagion: "Explosive Seeker Mine hits on enemies afflicted by Bleed or Vulnerable apply the same debuff to all enemies within 10 meter(s) and grant +7.20% Firepower for 10 second(s)." Shoot first, mine second, and one bleeding enemy becomes a bleeding crowd, every one of them feeding the turret's Firepower stacks.

**4. The launcher marks the room.** Field Mortar on the M32A1 signature: "Increases 9.60% Weapon Damage to enemies hit by M32A1 Grenade Launcher for 20 second(s) and extends the duration of Artillery Turret by 2 second(s)." More damage on everything it hits, and more time on the engine.

**5. Mechanical Enemy keeps the engine running.** Everything above switches off when the turret does. The 4-piece is Skill Cooldown Recovery -12%, which gets the turret back sooner, and the mine with it.

### The numbers that line up

A few details we didn't plan, and then couldn't stop noticing:

- **16 meters becomes 18.4.** The Scorpio's card lists a 16-meter optimal range. Mechanical Enemy's 3-piece adds 15%, which is about 18.4 meters: just inside the 20 meters that Performer (+18% Weapon Damage within 20 meters, -6% past it) and Concerted Strike both want.
- **Seven shells, seven stacks.** The Scorpio holds 7 rounds and Septicemia stacks to 7, so one magazine into one target is a full Venom cycle: Bleed, Confusion, Shock and the 10% bonus.
- **The fire rate makes that seventh stack.** Venom lasts 2.5 seconds. If each stack runs out on its own, the base 130 RPM fires the seventh shot about 2.77 seconds after the first, just too late. Gunny Johnny's +12% and Inspiration's +30% take the Scorpio to roughly 185 RPM, and seven shots then take about 1.95 seconds. (If the stacks all refresh on a hit instead, you get there at any fire rate, and the extra speed is just extra damage.)
- **The mine nearly keeps pace with the Bleed.** The Explosive Seeker Mine's cooldown has been 14 seconds since Season 2 Phase 2. Mechanical Enemy's -12% should bring that to about 12.3, against a 10-second Bleed. The Scorpio re-bleeds whatever it touches in between.
- **The mods are secretly armor.** Prioritized Targets, Contagion and Field Mortar all have Armor as their 2-piece bonus: +4.7% to +9.3% each, so +14.1% to +27.9% Armor in total, depending on the mods' rolls. That's not nothing for a build that lives inside 20 meters.

## Gear: Mechanical Enemy 4pc + Gunny Johnny 2pc

**[Mechanical Enemy](/database/gear-set-effects/mechanical-enemy/)** is the only gear set in the game that pairs weapon stats with a skill cooldown bonus: Weapon Critical Hit Chance +7.2% (2pc), Optimal Range +15% (3pc), Skill Cooldown Recovery -12% (4pc). None of the builds we've covered wear it. It's T2 only, on the family B pieces: Protective Tactical Mask, "Kote" Hand Guards, Urban Warfare Kneepads and Jags Sidearm Mount, plus the Chatzatz Chest and Mountain Hiking Pack, which we don't use.

Why not the Mechanical Enemy chest and backpack? Because they can't roll what this build needs. The Chatzatz Chest's 12 talents don't include Crossfire, and the Mountain Hiking Pack's 12 don't include Inspiration. The **X-TREYME Pro Ribcage** rolls Crossfire and the **All Hazards Nitro Backpack** rolls Inspiration, and both can carry **[Gunny Johnny](/database/gear-set-effects/gunny-johnny/)**, whose 2-piece is Rate of Fire +12%. That's where the 4 + 2 split comes from.

**Attributes:** Weapon Critical Hit Chance and Weapon Critical Hit Damage on the mask, gloves, knee pads and backpack, Weapon Critical Hit Damage and Weapon Damage on the holster and body armor. If testing shows the turret has dead time between casts, trade one roll for Skill Cooldown Recovery before anything else.

## Weapons

### Scorpio: Septicemia + In Sync + Performer

The [Scorpio](/database/exotic-weapons/scorpio/)'s database card: 1.68k Piercing Damage, 130 RPM, a 7-round magazine, a 1.8-second reload and a 16-meter optimal range. Septicemia is fixed, and its other two talents roll from its own pool of 18, which includes both of ours:

- **In Sync** is the bridge between you and the turret (above).
- **Performer**: "Grants +18% Weapon Damage on enemies within 20 meters. Inflicts -6% Weapon Damage on enemies farther than 20 meters away." This is a shotgun. You were going to be within 20 meters anyway.

Its database blurb also says the Scorpio was developed with DARPA and never got approved because it breaks the Hague Convention of 1899. Honestly, that's the most accurate description of this build we could have written.

**Getting one:** it was on the Season 1 Phase 3 Classified Ops Pass. Since then it's come from the Dark Zone vendor (added in Season 2 Phase 1; exotic weapons there cost 15,000 DZ Credits since Phase 2) and from [Exotic Sealed Caches](/guides/exotic-sealed-caches/), where Ubisoft's drop-rate table lists each exotic weapon cache at 0.29%.

### PPSH-41: In Sync + Backup Protection

A T2 SMG whose pool has In Sync, Backup Protection and Performer. Keep In Sync so the loop survives the swap, and take **Backup Protection**: "Swapping to this weapon grants Extra Health equal to 20% Max Health for 8 seconds. Talent Cooldown: 8 seconds." This build stands close and eats hits, and the swap is your panic button.

## Skills and Skill Mods

| Skill | Mod (3pc) | 2pc | What the 3pc does here |
|---|---|---|---|
| Artillery Turret | Prioritized Targets | Armor +4.7% to +9.3% | +1.44% Firepower per hit on a bleeding or Vulnerable enemy, 5 stacks |
| Explosive Seeker Mine | Contagion | Armor +4.7% to +9.3% | Copies Bleed or Vulnerable to everyone within 10 meters, +7.2% Firepower |
| M32A1 Grenade Launcher | Field Mortar | Armor +4.7% to +9.3% | +9.6% Weapon Damage taken by enemies it hits for 20 seconds, +2 seconds of turret |

All three come from the **Field Grenadier Cache** in Ubisoft's [drop-rate table](/database/drop-rates/#field-grenadier-cache), which lists the first two under older names (Shaped Charge and Multi-Directional Charge). We stuck to Field Grenadier's own mods on purpose, since we haven't confirmed whether a Field Grenadier can equip the HE Munitions ones.

**Swaps worth knowing:**

- **[Optimized](/database/skill-mod-combos/optimized/)** on the turret if its uptime turns out to be the problem: Rate of Fire +4% to +8% at 2pc, then +8% turret Rate of Fire and +0.5 seconds of turret duration per hit on up to 2 enemies, capped at 6 seconds.
- **[Area Denial](/database/skill-mod-combos/area-denial/)** on the mine for the same reason: +8.6% mine radius, and every mine hit adds 1.6 seconds to a deployed turret.
- **[Thermobaric Grenades](/database/skill-mod-combos/thermobaric-grenades/)** on the launcher if you'd rather have one huge grenade: it cuts the launcher to 1 grenade with 30% more blast radius and 300% more damage.

## OS Protocol: Concerted Strike

[Concerted Strike](/database/os-protocols/concerted-strike/) is a High-End Firepower protocol: Weapon Damage +15.00% as its main stat, plus Firepower +97, All Weapon Damage +77 and Health +2,554 at the database's base level. Its talent is the one quoted above, +8% Damage per Skill Hit within 20 meters, up to 3 stacks. On a normal gun build that's a protocol you can't feed. With a turret that never stops shooting, it should sit at +24%.

None of the builds we've covered run it, and there's a good reason nobody did: it was broken. Season 2 Phase 2 "fixed Concerted Strike so it correctly functions within its intended 20 meter range," and Ubisoft's bug reporter closed the matching report on October 23 ([our roundup](/news/bug-reporter-fixes-october-23/)). An OS Protocol that only just started working is about as off-meta as it gets.

If you don't have it:

- **[Tactical Pistolero](/database/os-protocols/tactical-pistolero/)** (Superior): Weapon Damage +12% main stat, and "Skill Hits grant +4.50% Firepower for 10 seconds, up to 5 stacks." Same feeder, +22.5% Firepower.
- **[Mechanized Support](/database/os-protocols/mechanized-support/)** (Superior): Weapon Critical Hit Damage +24% main stat, and "+15% Weapon Damage while located within 20 meters of a deployed Skill." Stand by your turret.

## How to Play It

1. **Turret first, always.** Drop the Artillery Turret where the fight will be, close enough that you'll stand within 20 meters of it and of the enemies. Crossfire and Inspiration switch on.
2. **Shoot before you mine.** Open on the pack with the Scorpio. The first hit on each enemy makes it bleed.
3. **Mine a bleeder.** Send the Explosive Seeker Mine at someone you've already shot, so Contagion copies the Bleed to everyone within 10 meters.
4. **Empty the magazine into one target** when something big shows up: 3 stacks confuse it, 6 shock it, 7 add the 10% bonus damage.
5. **Launcher on the biggest group.** Field Mortar's +9.6% Weapon Damage lasts 20 seconds, and the turret gets 2 more seconds.
6. **Swap when it hurts.** Backup Protection on the PPSH-41 gives you Extra Health worth 20% of your Max Health, every 8 seconds at most.
7. **Stay inside 20 meters.** Past it, Performer turns into -6% and Concerted Strike stops stacking. If you have to fight at range, this isn't the build for that room.
8. **When the turret goes, redeploy before you shoot.** Five of your buffs just went with it.

## Without the Scorpio, or Without T2 Gear

**No Scorpio:** run the PPSH-41 with **In Sync + Performer** as your main gun, and an M12 (a T2 shotgun whose pool has In Sync and Backup Protection) as the secondary. The turret half of the build doesn't care about Bleed: Crossfire, Inspiration, In Sync and Concerted Strike all still work. Contagion and Prioritized Targets need enemies that bleed or are Vulnerable, though. Demolitionist's own tree deals in both (the [Season 2 Phase 2 notes](/patch-notes/season-2-phase-2/) raised Severe Concussion's Bleed chance to 25/50%, Hollow Point Bullets' to 2/4%, and Targeted Blast's Vulnerable to 5/10/15%), but we haven't checked those nodes' exact text, so if your targets aren't bleeding, swap to Optimized and Area Denial.

**Starter version (T0):** Mechanical Enemy and Gunny Johnny are T2 only. Until you have them, put [Fury Strike](/database/gear-set-effects/fury-strike/) on the mask, gloves, knee pads and holster (4pc: Optimal Range +10%, Weapon Critical Hit Chance +10.8%, Weapon Critical Hit Damage +24%), and wear the Ranger Ballistics Vest with Crossfire and the RUSH72 Backpack with Inspiration. Both are T0 pieces that can carry [Boom-Shakalaka](/database/gear-set-effects/boom-shakalaka/), whose 2-piece is Skill Cooldown Recovery -6%. Same engine, smaller numbers.

## What We Still Need to Check

The parts the database can't tell us:

- **How long the Artillery Turret lasts, and its cooldown.** Everything hangs on its uptime, and we don't have either number yet. We also want to see what Mechanical Enemy's -12% does to the cooldown on the skill screen.
- **That the turret counts.** Its shots should be Skill Hits (In Sync, Concerted Strike) and it should count as a deployed skill (Crossfire, Inspiration). The buff icons will settle it in the first fight. One wrinkle: Ubisoft's Season 2 Phase 1 notes list a Commando talent also called Concerted Strike that "now triggers off shots rather than hits." The OS Protocol text we quote is the database's from October 28, and it still says Skill Hits.
- **That Septicemia's Bleed is the Bleed** that Contagion and Prioritized Targets look for. Same word, but we want to see Contagion spread it.
- **How Venom stacks.** Whether each Scorpio pellet counts as a hit, and whether the stacks expire one by one or refresh together.
- **Field Grenadier's own tree:** what Targeted Blast, Hollow Point Bullets and Severe Concussion do, and which of them Field Grenadier can take.

When RapidF5 has run it, this section turns into results.

## Sources

- In-game **Build-Making Database**, recorded October 28 and 29, 2026: every talent, gear set, OS Protocol and skill mod quoted here, the Scorpio's card, and the Source lists that say which guns and gear pieces can roll which talents and sets. Browse it in our [database](/database/).
- Ubisoft Help Center, ["Drop rates"](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2522-drop-rates/): the Field Grenadier Cache's mods and the Exotic Sealed Cache odds (checked October 24, 2026).
- [Season 2 Phase 2 patch notes](/patch-notes/season-2-phase-2/): the Explosive Seeker Mine cooldown and the Demolitionist tree changes.
- The Field Grenadier Focus training screen, shown on [Porps's October 28 stream](https://www.youtube.com/watch?v=FOrckQW_S8c) (in Portuguese; our translation), as covered in our [specialization guide](/guides/which-specialization-to-pick/).
