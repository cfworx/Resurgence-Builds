---
title: "Stats Explained: What Every Stat Does"
category: "Beginner"
publishDate: 2026-06-02
lastUpdated: 2026-10-28T12:00:00Z
tags: ["stats", "firepower", "engineering", "toughness", "build-guide"]
description: "Division Resurgence stats explained: Firepower, Toughness, Engineering, crit, multi-shot, the 80% damage reduction cap and how talents scale."
featuredImage: "/images/guides/division-resurgence-stats-explained-shooting-range-1200.webp"
imageAlt: "An agent crouched behind sandbags at the shooting range in The Division Resurgence's Base of Operations, with the title Stats Explained"
author: "RapidF5"
shareTitle: "Your stat sheet, translated"
shareText: "Firepower, Toughness, Engineering, multi-shot, the 80% damage reduction cap and how talent ranks scale. Every stat in Division Resurgence, explained."
faqs:
  - question: "What does Firepower do in Division Resurgence?"
    answer: "Firepower is the main attribute for weapon damage, the stat gun builds like Vanguard Commando stack. Toughness is the survivability stat and Engineering powers skills, healing and buffs. If a YouTuber says 'firearms' or 'electronics,' those are the original Division's (2016) names for Firepower and Engineering; same idea, older game."
  - question: "What is multi-shot chance in Division Resurgence?"
    answer: "TikTokAndy's explanation of Weapon Multi-Shot Chance: when it triggers, one bullet 'actually hits the enemy 2 times instead of 1.' Skill Multi-Shot Chance is the skill-side version of the same idea. It's the closest thing this game has to a buy-one-get-one deal."
  - question: "Is there a damage reduction cap in Division Resurgence?"
    answer: "Yes. Ubisoft's June 26, 2026 hotfix capped damage reduction at a maximum of 80%, as a server-side change, with the visual feedback on your stats screen 'to be added at a later date.' So your sheet can show more than 80%, but the server stops counting there. Stacking past it is like adding a fourth lock to a screen door."
  - question: "Should I stack crit chance or crit damage first?"
    answer: "Crit chance first. AgentHuntzman's rule is at least 50% Critical Hit Chance before you invest everything into Critical Hit Damage, because a thousand percent crit damage at one percent crit chance only matters once every hundred shots. Remember that skills and buffs add crit chance during fights: TikTokAndy's Commando sits at 51% on the sheet and about 90% with Scanning Pulse and Tactical Link up."
  - question: "What's the difference between a talent and its II version?"
    answer: "The II version is the same effect at a higher rank, and in most cases we've checked it's about 1.4 times the base value. Ubisoft's own Season 2 Phase 2 notes give the cleanest example: the Strained talent is 10% at tier 1 and 14% at tier 2. The game's own recalibration preview shows most talents following that pattern, for example Misdirection Insurance at 30% and Misdirection Insurance II at 42%. A few step up more or less: Slaughter Fortitude, Slaughter Healing and Steady Handed by 1.5 times, Rock Solid by about 1.33, so check the tooltip before you do the math."
---

Your stat sheet in The Division Resurgence is long, and about half of it sounds the same. This guide translates it: the three main attributes, what every secondary stat actually does, the rules of thumb creators swear by, the official caps and changes, and the math behind talent ranks and OS Protocol upgrades, which nobody in the game explains.

One warning before you read any build advice on the internet: this is **not** The Division 2. Some names overlap, the math doesn't. Where a number below comes from a creator's screen rather than Ubisoft, we say so.

> [!INFO] Update (October 2026)
> Updated for Season 2 Phase 2. New sections on how talent ranks and OS Protocol upgrades scale, the Season 2 weapon roll and mod changes, and where to read exact numbers in the game. Ubisoft extended Season 2 Phase 2 on October 21.

## The three main attributes

Every gear piece carries Firepower, Toughness and Engineering values in different amounts (TikTokAndy's T2 Phalanx holster reads 206, 33 and 64), and every specialization focus leans on one of them:

| Attribute | What it powers | Who stacks it | Also called |
|---|---|---|---|
| **Firepower** | Weapon damage | Vanguard Commando, Bulwark Breacher, Demolitionist Field Grenadier, any gun build | "firearms," the original Division's (2016) name, still used by some creators |
| **Toughness** | Health and survivability (and, on a Toughness medic, healing) | Bulwark Juggernaut, Combat Medicine | |
| **Engineering** | Skill damage, healing and buffs | Demolitionist HE Munitions, Tech Operator, Tactical Pharma, Vanguard Recon | "electronics," the same habit |

The game sums up all three in its Core Attributes popup on the loadout screen: "Firepower increases the damage of equipped weapons." "Toughness increases Max Health." "Engineering increases the intensity of Skill effects (damage, healing, etc.)." [GGReborn's beginner guide](https://www.youtube.com/watch?v=i85WYzmiTuw&t=97s) shows it, and tapping the Firepower number on his shotgun's card brings up the same sentence.

The game's own tooltips use Firepower, Toughness and Engineering: Explosive Round's explosion deals "2000% Firepower" (TikTokAndy reads it out), and Collateral Damage's talent text reads "3000% Engineering." A few things creators have measured:

- **Engineering feeds buffs, not just damage.** AgentHuntzman's Recon build shows Smart Cover granting allies weapon damage equal to 24% of his Engineering, which is why support Vanguards stack it.
- **Toughness medics heal off their Health.** On AgentHuntzman's Toughness Field Medic in May, 0.46% of his Health was converted into each heal, so more Health meant bigger heals.
- **Focus beats balance.** AgentHuntzman's most repeated point: builds that spread across all three feel weak. Pick your specialization's stat and stack it. Our [specialization guide](/guides/which-specialization-to-pick/) says which one each focus uses.

## The Attributes screen

AgentHuntzman calls the character Attributes screen "your best friend throughout the whole game." It's the first of four tabs on the character screen (Attributes, Specialization Focus, Combat Skills and Agent's Identity), and its first list is **Offensive Attributes**: Damage Bonus, Weapon Critical Hit Chance and Damage, Weapon Multi-Shot Chance, Headshot Damage, Weapon Damage, Rate of Fire, Reload Speed, Magazine Size, Skill Critical Chance and Damage, and more as you scroll. The icons down the right side open the other lists. That's the screen as GGReborn showed it on October 31.

**The sheet follows the gun in your hands.** In [SannoNYC's Vanguard build video](https://www.youtube.com/watch?v=RVgOTMB4B8o) the same loadout reads Firepower 2.68k, Toughness 498, Engineering 215, 11,614 Armor and 136,148 Health while he holds his Double Barrel, and 2.80k, 521, 233, 13,194 Armor and 137,230 Health once he switches to his First Wave Vector 45 ACP. The Vector's card carries 23 more Toughness and 18 more Engineering than the shotgun's, and an Armor +23.05% roll: those land on the sheet only while it's the gun out. So compare loadouts with the same weapon in hand, and remember that a defensive roll on your second gun only shows on the sheet while you hold that gun.

![SannoNYC's loadout stats in The Division Resurgence while he holds his Double Barrel shotgun: Power Score 26.32k, Firepower 2.68k, Toughness 498, Engineering 215, DPS 483.31k, Armor 11,614, Health 136,148](/images/guides/division-resurgence-stats-sheet-double-barrel-in-hand.webp "Double Barrel in hand: 11,614 Armor, 136,148 Health.")
![The same loadout while he holds his First Wave Vector 45 ACP: Power Score 26.32k, Firepower 2.80k, Toughness 521, Engineering 233, DPS 450.59k, Armor 13,194, Health 137,230](/images/guides/division-resurgence-stats-sheet-vector-in-hand.webp "Vector in hand: 13,194 Armor, 137,230 Health. Frames from his video.")

By what they do, the stats fall into three groups:

| Group | What's in it | Who should live here |
|---|---|---|
| **Weapon** | Weapon damage, Critical Hit Chance and Damage, Headshot Damage, Rate of Fire, Reload Speed, Magazine Size, Optimal Range, Accuracy, Stability, Multi-Shot Chance, damage to elites | Gun builds |
| **Skill** | Skill damage, Skill Intensity, Duration, Radius, Cooldown Recovery, Skill Critical Chance and Damage, Skill Multi-Shot, Signature Ability Charge Efficiency | Skill and healer builds |
| **Defensive** | Health, Armor, Damage Reduction, Healing Intensity, Received Healing, Movement Speed | Tanks, medics, and anyone who has died recently |

### What the less obvious ones mean

- **Multi-Shot Chance:** when it triggers, a bullet "actually hits the enemy 2 times instead of 1," as TikTokAndy puts it. Skill Multi-Shot Chance is the skill-side version; TikTokAndy only explained the weapon one.
- **Skill Intensity:** makes a skill's effects stronger, its healing and buffs included, not just its damage. TikTokAndy's Aegis healer leans on it for that reason.
- **Skill Duration vs Cooldown Recovery:** AgentHuntzman's "breaking point": once a skill lasts longer than its cooldown, you have permanent uptime, and more cooldown recovery becomes less valuable. Our [hidden mechanics guide](/guides/hidden-mechanics-explained/) has the full explanation. On a gear card, Skill Cooldown Recovery shows with a minus sign (SannoNYC's Combat Mask "Cete" reads -4.34%). That's the cut to your cooldowns, not a penalty: the game describes it as "the extent to which Skill Cooldown is reduced."
- **Signature Ability Charge Efficiency:** how fast your specialization's signature ability (the "super") fills.
- **Healing Intensity vs Received Healing:** Healing Intensity boosts the heals you give; Received Healing boosts the heals you get, your own included. AgentHuntzman tested Received Healing on his medic in his May video, and his heals jumped from about 3,400 to about 5,000.
- **All Weapon Damage vs damage types:** since Season 2 Phase 1, weapons no longer roll Blast, Shredding or Piercing damage bonuses. Ubisoft replaced them "in favor of All Weapon Damage or All Skill Damage" because a damage-type bonus on a gun of another type "didn't bring any benefits and was frustrating." A weapon can still show one, though: SannoNYC's level 50 Double Barrel reads Weapon Blast Damage +7.23%, so check your own guns' cards rather than assume.

## Health, Armor and the 80% cap

AgentHuntzman's warning for new players: The Division (2016) rewarded stacking Health and The Division 2 rewarded Armor, but Resurgence wants **both**. "No matter how big your health may be, you will still die very fast if your armor is extremely low."

Then there's **damage reduction**. Ubisoft's June 26, 2026 hotfix:

> "Damage reduction has been capped at a maximum of 80%. Please note that this is a server-based change with player-facing visual feedback to be added at a later date."

So your sheet can show more than 80%, but the server stops counting at 80. If you're stacking Damage Reduction past that, those rolls want to be Armor or Health instead. Details in our [June 26 hotfix coverage](/news/server-hotfix-june-26-2026/).

## Rules of thumb from creators

These are creator opinions, not game rules, but they come up in almost every build video:

1. **50% crit chance before crit damage.** AgentHuntzman's rule for gun builds. Count your skills: TikTokAndy's Commando reads 51% on the sheet, about 70% with Scanning Pulse and about 90% with Pulse and Tactical Link together ([his build](/builds/lightweight-m4-commando-vanguard-build-tiktokandy/)).
2. **The stat sheet doesn't show everything.** TikTokAndy points out that his Overwatch backpack talent's extra Skill Damage wasn't counted on the sheet. Some talent bonuses only apply when their condition is met, so test in a fight, not in the menu.
3. **Recalibrate for the build's job.** AgentHuntzman's example: a build meant to buff, apply pressure and keep uptime should recalibrate for that, and "not turn you into a tank" with comfort stats like extra Armor.
4. **Power Score isn't build strength.** Every creator we follow says it. Power Score tells you whether you meet an activity's recommended level; sets, talents and attributes decide whether the build works. AgentHuntzman notes that mods alone inflate it a lot: his level 20 weapon mods added roughly 350 to 500 Power Score each.

## How talent ranks scale: usually 1.4x

Talents come in ranks, written as "II" (or "2") after the name. Ubisoft doesn't publish a rank table, but its Season 2 Phase 2 notes give one clean example while fixing a tooltip: the **Strained** weapon talent is **10% at tier 1 and 14% at tier 2**. That's exactly 1.4 times.

The best evidence is the game's own recalibration preview, which lists a weapon's possible talents at both ranks with their full text. TikTokAndy's Copperhead shows 17 of them in [his November 14 video](https://www.youtube.com/watch?v=4GoB017732U&t=2990s), and most follow the same 1.4 times:

| Talent | Rank I (our database) | Rank II (reading) | Ratio |
|---|---|---|---|
| Strained | 10% Critical Hit Damage | 14% | 1.4x (Ubisoft's notes) |
| Misdirection Insurance | 30% chance | 42% (both ranks on the recalibration preview) | 1.4x |
| Damage Trade | +6% Weapon Damage per stack | +8.40% (both ranks on the preview) | 1.4x |
| Swift Taunt | 25% Max Health | 35% (both ranks on the preview) | 1.4x |
| Thick Skin | +2.10% Armor per stack | +2.94% (both ranks on the preview) | 1.4x |
| Revitalize | 4.20% Max Health | 6% (both ranks on the preview) | about 1.4x |
| Precise Support | +7% Armor per stack | +9.80% (both ranks on the preview; Rescue Efficiency stays +40%) | 1.4x |
| Steady Suppression | +18% Damage Reduction | +25% (the preview) | about 1.4x |
| In Sync | +9% Skill and Weapon Damage | +12.60% (the preview) | 1.4x |
| Spirited | 9%, 12% and 15% Damage Reduction | 12.60%, 16.80% and 21% (the preview) | 1.4x |
| Tactical Targeting | 15% Extra Health | 21% (the preview) | 1.4x |
| Backup Battery | +22.50% Engineering | +31.50% (the preview) | 1.4x |
| Target Acquisition | +2.50% Incoming Damage per stack | +3.50% (the preview; GGReborn's The Bighorn, November 16) | 1.4x |
| Precise Crit | +15% Critical Damage to allies | +21% (the preview; GGReborn's Double Barrel, November 16) | 1.4x |
| Rapid Charge | 50 Signature Ability Charge | 70 (TikTokAndy's Vector 45 ACP, November 14) | 1.4x |
| Shooting Repair | 2.50% Missing Health of your Skills | 3.50% (TikTokAndy's Naval MP5, November 14) | 1.4x |
| Steady Reload | +5% Weapon Damage per stack | +7% (a teammate's Double Barrel in TikTokAndy's November 14 run) | 1.4x |
| Predatory Aura | (240 x Firepower)% Health on a kill | (336 x Firepower)% (GGReborn, November 16) | 1.4x |
| Adaptation | +4.80% Skill Duration, +6% Skill Intensity | +6.72%, +8.40% (GGReborn, November 16) | 1.4x |
| Unflinching (body armor) | 300% of Toughness | 420% (TikTokAndy's "Big Drum" Body Armor, November 14) | 1.4x |
| Suppressive Fire (body armor) | +18% Magazine Size, +6% Rate of Fire | +25%, +8.40% (TikTokAndy; a teammate's card in his November 14 run reads the same) | about 1.4x |
| Inspiration (backpack) | +30% Rate of Fire when Skills are deployed | +42% (the game's blueprint screen, on GGReborn's All Hazards Nitro Backpack, October 31) | 1.4x |
| Emergency Measures (backpack) | 50% Max Health below 20% Health | 70% (SannoNYC's All Hazards Nitro Backpack; the 30 second cooldown stays) | 1.4x |
| Performer | +18% Weapon Damage within 20 m, -6% farther out | +25%, -8% (SannoNYC's First Wave Vector 45 ACP) | about 1.4x |
| Calm and Collected | +30% Reload Speed behind cover | +42% (Demø2x's Scorpio) | 1.4x |
| Siege | 37.50% Extra Health | about 52% (TikTokAndy) | about 1.4x |
| Toymaker | +15% Skill Multi-Shot Chance | +21% (TikTokAndy) | 1.4x |
| Still Alive | 30% of missing Health | 42% (TikTokAndy) | 1.4x |
| Torrential Downpour | +22.50% Engineering | +31.50% (TikTokAndy; Demø2x's Modified USC and GGReborn's First Wave Vector 45 ACP read the same) | 1.4x |
| Slaughter Fortitude | +12% Armor per stack | +18% (both ranks on the preview) | 1.5x |
| Steady Handed | +1.20% Accuracy and Stability per stack | +1.80% (both ranks on the preview) | 1.5x |
| Slaughter Healing | +7% Incoming Healing per stack | +10.50% (the preview) | 1.5x |
| Rock Solid (backpack) | +15% Damage Reduction | +20% (TikTokAndy's Healing Roamer Pack "Sow", November 14; his rank I pack reads +15%) | about 1.33x |
| Ammo Supply | 54% chance | 65% (TikTokAndy's tooltip, September 16) | 1.2x |

Not every number in a talent climbs. Unflinching II keeps its 70% chance and 2 second cooldown, Precise Support II keeps +40% Rescue Efficiency, and timers can move the other way: Backup Magazine II reloads your other weapon after 3 seconds, where rank I waits 4, and the preview shows both. AgentHuntzman shows the same thing on another talent in the Build Database: Blood for Blood's bonus damage goes from 0.50% of max Health to 0.70% at level two.

The last five rows are the exceptions. Slaughter Fortitude and Steady Handed show both ranks on the same in-game screen, so they really do step up 1.5 times; Slaughter Healing's rank II on that screen is 1.5 times our rank I; and Rock Solid shows +15% and +20% on two of TikTokAndy's own backpacks. Ammo Supply is still one creator tooltip against our capture, so we're re-checking it. So when you see a II talent on a drop, expect about 40% more of whatever the base version does, then check the tooltip. Our database lists base (rank I) text, and each weapon talent page shows the game's own rank II text where we've seen it.

## How OS Protocols scale

OS Protocols grow two ways, and Ubisoft's own patch notes show the pattern for one of them.

**Talent Upgrades (from duplicates).** When Ubisoft printed full talent ladders, each step added **20% of the base value**, five times, ending at **double** the base:

- **Applied Demolition** (Season 1 Phase 3 buff): 43.2%, 51.84%, 60.48%, 69.12%, 77.76%, then 86.2% (as printed; the pattern says 86.4) of Skill Critical Damage.
- **Dominating Presence** (Season 2 Phase 2): maximum scaling reduced to 35, 42, 49, 56, 63 and 70%.
- **Recursive Treatment** on screen: TikTokAndy's copy with two of five upgrade diamonds reads +28% Skill Intensity on a +20% base, two steps of 4 (his October 10 video).
- **Close Quarters Menace** on screen: GGReborn's level 50 card shows four of five upgrade diamonds and +27% on a 15% base, four steps of 3 (his October 31 video). SannoNYC's level 50 copy, with all five diamonds lit, reads +30%: the fifth step is 3 as well, and a fully upgraded talent lands on exactly double ([his Vanguard build video](https://www.youtube.com/watch?v=RVgOTMB4B8o)).
- **Collateral Damage** on screen: [Demø2x's level 50 copy](https://www.youtube.com/watch?v=qFG1it9DFBA&t=680s), with one of five upgrade diamonds, reads 3600% Engineering on a 3000% base, and [GGReborn's](https://www.youtube.com/watch?v=i85WYzmiTuw&t=385s), with three, reads 4800%: steps of 600.
- **Blitz Tactics** on screen: TikTokAndy's level 50 card shows three of five upgrade diamonds and +19.20% Incoming Healing on a 12% base, plus 12.80% Max Health on an 8% base, three steps each (his November 14 video). A teammate's copy in the same run, at two of five, reads +16.80%.

**Levels (up to 50).** Creator readings say a protocol's percentage main stat doubles by level 50, and the on-screen ones in between fit a simple ladder: **+10% of the base every 5 levels**. That's our reading of the screenshots below, not a rule Ubisoft has published:

| Protocol | Base main stat (our database) | Creator reading | Multiplier | Source |
|---|---|---|---|---|
| Pressing Matter | +12% Skill Intensity | 24% at level 50 | 2x | AgentHuntzman, April 26 |
| Augmented Lethality | +18% Firepower | 36% Firepower on the copy he'd used "for a very long time" | 2x | TikTokAndy, September 30 |
| Recursive Treatment | +18% Engineering | 32.40% at level 42 (on screen) | 1.8x | TikTokAndy, October 10 |
| Explosive Round | +22.50% Firepower | 42.75% at level 45 (on screen), "45" at max | 1.9x | TikTokAndy, October 27 |
| Close Quarters Menace | +18% Firepower | 36% at level 50 (on screen) | 2x | GGReborn, October 31 |
| Assault Charge | +18% Weapon Critical Hit Chance | 36% at level 50 (on screen) | 2x | GGReborn, October 31 |
| Blitz Tactics | +18% Toughness | 36% at level 50 (on screen) | 2x | TikTokAndy, November 14 |
| Collateral Damage | +22.50% Engineering | 45% at level 50 (on screen) | 2x | Demø2x and GGReborn |
| Relentless Assault | +30% Skill Critical Damage | 60% at level 50 (on screen) | 2x | GGReborn |
| Tactical Persistence | +24% Skill Critical Damage | 48% at level 50 (on screen) | 2x | GGReborn |
| Brains Over Brawn | +10.80% Skill Critical Chance | 21.60% at level 50 (on screen) | 2x | GGReborn |

The flat attributes climb much faster than the percentage: the same level 42 Recursive Treatment shows +285 Engineering against the +77 in our level 1 data, about 3.7 times, and AgentHuntzman's level 50 Pressing Matter shows +358 Engineering, about 4.6 times. GGReborn's level 50 protocols land on the same 4.6: Close Quarters Menace shows +358 Firepower (+77 here) and Assault Charge +447 (+97), and TikTokAndy's level 50 Blitz Tactics reads +358 Toughness, +286 All Weapon Damage and +9,402 Health, the same three numbers as GGReborn's Close Quarters Menace. His level 50 Brains Over Brawn, a Specialized protocol, reads +268, +215 and +7,052 against +58, +46 and +1,532 at level 1, so the 4.6 holds at every rarity we've seen.

So when you compare two protocols, compare them at the same level and upgrade step, or you're comparing a puppy to a dog. The [OS Protocol database](/database/os-protocols/) lists base values; the [tier list](/tier-list/os-protocols/) shows how players rank them.

## Damage types, briefly

Weapons deal **Blast, Shredding or Piercing** damage, and enemies with colored armor bars are weak to one of them. Ubisoft's 2023 preview describes the colored bars and says they matter in higher-level encounters; AgentHuntzman's color key is dark blue for Piercing, light blue for Shredding and red for Blast. Carry two weapons of different types. The full chart is in our [damage types guide](/guides/damage-types-color-bar-weakness-guide/).

## Gear tiers, item level and mods

- **Tiers:** T0 (story gear), T1 (the main build tier) and T2 (endgame) are separate from rarity and level. Our [gear farming guide](/guides/division-resurgence-gear-farming-guide/) covers where each drops.
- **Item level:** your agent caps at 40, but gear can be upgraded up to 10 levels above you (AgentHuntzman), so item level 50 at 40. The last ten levels need purple Superior materials.
- **Mods:** since Season 2 Phase 1, new weapon mods have their **main stat values increased by 100%** and **attribute bonus values reduced by 25%**, and their bonus pool includes Weapon Damage, Skill Intensity, Headshot Damage and Weapon and Skill Critical Damage. Gear mods gained Health, Armor, crit, multi-shot and skill rolls in the same patch. Our [mod farming guide](/guides/how-to-farm-purple-gold-mods/) has the details.
- **Tactical Augmentation Modules** add the biggest late-game stat jumps, up to +100% Health and Armor on a gear piece by creator readings. See our [Tactical Augmentation Modules guide](/guides/tactical-augmentation-modules-guide/).

## Where to read the exact numbers

Websites, this one included, are a shortcut. The source is in the game: open the **menu**, go to **Agent Career**, then **Build Database**. AgentHuntzman's tip from May: it lists "all your weapons and gear sets" and the talents, with their full text and rank values. Ubisoft's October 14 notes fixed its weapon talent list, so it's maintained. The **Armory** is the other in-game reference: Ubisoft describes it as "a catalog of all the weapons and gear in the game," including ones you haven't looted yet.

For browsing outside the game, our [database](/database/) collects gear sets, talents, OS Protocols, skill mods and the official drop rates, and the [build planner](/builder/) adds them up for you.

## Sources

- [AgentHuntzman: Main Stats Are LYING To You (YouTube, May 27, 2026)](https://www.youtube.com/watch?v=tjo7oBeX3Fk)
- [AgentHuntzman: The Game NEVER Properly Explains These Mechanics (YouTube, May 2, 2026)](https://www.youtube.com/watch?v=EflBC5vKwT0)
- [AgentHuntzman: Why Your Build Feels WEAK (YouTube, May 6, 2026)](https://www.youtube.com/watch?v=8n9wQDmZN4o)
- [AgentHuntzman: Best Scout Build (YouTube, April 26, 2026)](https://www.youtube.com/watch?v=b1ZjnGeeRKI) (Pressing Matter at level 50)
- [AgentHuntzman: How to start your build (YouTube, April 12, 2026)](https://www.youtube.com/watch?v=phHiYGujrRQ)
- [AgentHuntzman: Gear Farming Made EASY (YouTube, June 3, 2026)](https://www.youtube.com/watch?v=m5a01nBqv_U)
- [AgentHuntzman: SHD Manual, How Progression ACTUALLY Works (YouTube, May 22, 2026)](https://www.youtube.com/watch?v=Mt3E4A0l0Zk) (damage type color key)
- [TikTokAndy: My First Time In The Level 40 Dark Zone (YouTube, September 16, 2026)](https://www.youtube.com/watch?v=lBIQT-SeBZg) (Slaughter Fortitude II and Ammo Supply II tooltips, at 15:40 and 13:30)
- [TikTokAndy: SOLO Heroic Chinatown (YouTube, September 24, 2026)](https://www.youtube.com/watch?v=6dGaisNKCyE) (multi-shot)
- [TikTokAndy: Best "Automatic" Double Barrel Shotgun Build (YouTube, September 30, 2026)](https://www.youtube.com/watch?v=ITIJB2nj3zg)
- [TikTokAndy: Precious Cargo Legendary Difficulty But I'm Solo (YouTube, October 6, 2026)](https://www.youtube.com/watch?v=D3yrRSUwhq0) (Torrential Downpour 31.5%)
- [TikTokAndy: Most Overpowered Team Healer Build (YouTube, October 10, 2026)](https://www.youtube.com/watch?v=VHKfmW4BtEk) (Skill Intensity on an Aegis healer; Recursive Treatment at level 42, at 21:28)
- [TikTokAndy: Toxic Pharma Sucks...PvP Is Even Worse (YouTube, October 15, 2026)](https://www.youtube.com/watch?v=f20v8_cv9Ls)
- Our [Muscular Nurse build](/builds/muscular-nurse-combat-medicine-build-nadie/) (Nadie's Precise Support II screenshots)
- [TikTokAndy: Vanguard - Commando With A Lightweight M4 (YouTube, October 27, 2026)](https://www.youtube.com/watch?v=RYtZyN_0P0Y) (Precise Support II tooltip at 1:00, Explosive Round at level 45 at 6:47)
- [GGReborn: BEST Vanguard DB Spamming Build! (YouTube, October 31, 2026)](https://www.youtube.com/watch?v=NBB6j05PvsE) (the Attributes screen; Close Quarters Menace and Assault Charge at level 50; Inspiration II)
- [GGReborn: COMPLETE Beginner's Guide, 7 Things You MUST Understand (YouTube)](https://www.youtube.com/watch?v=i85WYzmiTuw) (the Core Attributes popup at 1:37; seven of his OS Protocols from 6:25)
- [Demø2x: Triple Threat Aegis Hybrid build (YouTube)](https://www.youtube.com/watch?v=qFG1it9DFBA) (Calm and Collected II at 12:10, Collateral Damage at level 50 at 11:20)
- [SannoNYC: The Division Resurgence Vanguard Build (YouTube)](https://www.youtube.com/watch?v=RVgOTMB4B8o) (the sheet changing with the gun in hand; Performer II and Emergency Measures II; Close Quarters Menace at five of five)
- [@TheDivMobile: June 26, 2026 server hotfix](https://x.com/TheDivMobile/status/2070483985642197252) (80% damage reduction cap)
- [Ubisoft Help Center: Patch Note, Season 1 Phase 3](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2521-patch-note---season-1-phase-3/) (Applied Demolition values)
- [Ubisoft Help Center: Patch Note, Season 2 Phase 2](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2566-patch-note---season-2-phase-2/) (Strained, Dominating Presence)
- [Season 2 Phase 1 patch notes (The Division Wiki mirror of the official developer post)](https://thedivision.fandom.com/wiki/Season_2_Phase_1_-_Patch_Notes) (weapon rolls and mods)
- [Ubisoft News: The Division Resurgence amps up specializations (June 12, 2023)](https://news.ubisoft.com/en-us/article/6Jn7afkUJmUJR14VMbv5VK/the-division-resurgence-amps-up-specializations-launch-slated-for-fall-2023) (damage types, the Armory)
