// Per-attribute editorial content for the consolidated Bonus Attributes page.
// Extracted from the former /database/bonus-attributes/[slug].astro item template.
// Slot and source claims come from creator gear readings and our own data files (gear sets, skill mod
// combos, OS Protocols). Recalibration in Resurgence is a random reroll that costs recalibration
// manuals, not a Division 2 style transfer, so don't describe donor items or a recalibration library.

export type AttrInfo = {
  overview: string;
  whyItMatters: string;
  howToGet: string;
  bestBuilds: string;
};

export const attrGuide: Record<string, AttrInfo> = {
  'Weapon Critical Hit Chance': {
    overview: 'Weapon Critical Hit Chance (CHC) is the probability that each bullet scores a critical hit. In Division Resurgence, crits aren\'t just "nice to have." They\'re the foundation of most Firepower builds, and every point of CHC makes your Critical Hit Damage pay off more often.',
    whyItMatters: 'Crit Chance decides how often you crit and Crit Damage decides what each crit is worth, so the two want to rise together. Ubisoft hasn\'t published a cap, and buffs stack on top of your sheet: TikTokAndy\'s Lightweight M4 shows 51% on its own, 70% with Scanning Pulse up and 90% with Pulse and Tactical Link together. Count your buffs before you spend every roll on more. The Fury Strike gear set adds Crit Chance at 3 pieces and Crit Damage at 4.',
    howToGet: 'CHC rolls on gear and weapons (TikTokAndy\'s October Double Barrel gear has it on the mask), gear mods can roll it since Season 2 Phase 1, and weapon attachments carry it too. Fury Strike (3pc +10.8%) and Mechanical Enemy (2pc +7.2%) add it as set bonuses, and Assisted Infantry is an OS Protocol with CHC as its main stat. Recalibration rerolls a line at random, so treat it as a gamble, not a transfer.',
    bestBuilds: 'Every Firepower build in the game wants this. Vanguard Commando with Phalanx Attack 4pc, Bulwark Breacher with Fury Strike 4pc, any build using Killer or Concentrated Fire weapon talents. If your build fires bullets and wants them to hurt, CHC is non-negotiable.',
  },
  'Weapon Critical Hit Damage': {
    overview: 'Weapon Critical Hit Damage (CHD) determines how hard your crits actually hit. A crit without CHD is just a yellow number that\'s barely bigger than a white one. Stack this once your CHC is at a comfortable level and your crits start deleting health bars instead of tickling them.',
    whyItMatters: 'CHD multiplies every crit you land, so once your Crit Chance is healthy it\'s usually the better next roll. TikTokAndy\'s Lightweight M4 build pairs a 51 to 90% crit chance with 143% Critical Hit Damage, which is what that balance looks like on a real sheet.',
    howToGet: 'Creators show CHD on most gear slots: TikTokAndy\'s October Double Barrel gear rolls it on the body armor, holster and knee pads. New weapon mods can roll Weapon Critical Hit Damage % since Season 2 Phase 1, and gear mods gained crit damage rolls in the same patch. Fury Strike\'s 4-piece adds +24%.',
    bestBuilds: 'Fury Strike DPS builds, any Vanguard loadout running Killer or Concentrated Fire, Marksman Rifle players chasing one-shot potential. CHD is the stat that turns "this build crits often" into "this build one-taps elites."',
  },
  'Weapon Damage': {
    overview: 'Weapon Damage is the most straightforward stat in the game: it makes your guns hit harder, period. No conditions, no proc requirements, no cooldowns. Every bullet from every weapon benefits. It\'s the "I don\'t want to think, I just want bigger numbers" stat, and honestly? It works.',
    whyItMatters: 'Weapon Damage raises every hit, crit or not, so it\'s the steady stat that doesn\'t depend on RNG. Crit builds take it as a second roll once CHC and CHD are covered, and TikTokAndy says he\'d rather have Weapon Damage than Headshot Damage on his Lightweight M4. For builds that don\'t crit (yes, they exist), this is king.',
    howToGet: 'Creators roll it on masks and holsters (TikTokAndy\'s October Double Barrel gear has it on both), new weapon mods can roll Weapon Damage % since Season 2 Phase 1, and gear mods gained it in the same patch. Gunny Johnny\'s 4-piece adds +12%, the Provocateur and Attention Seeker Bulwark combos have it as their 2-piece, and Firepower OS Protocols like Cover Shooter and Death From Afar use it as their main stat.',
    bestBuilds: 'Bulwark Breacher shield builds that need reliable per-shot damage, LMG sustained DPS builds, any non-crit loadout. Also valuable as a secondary stat on crit builds that already have CHC/CHD covered elsewhere.',
  },
  'All Weapon Damage': {
    overview: 'All Weapon Damage raises weapon damage whatever the damage type. Since Season 2 Phase 1, weapons roll it where they used to roll Blast, Piercing or Shredding Weapon Damage, which did nothing on a weapon of a different damage type.',
    whyItMatters: 'It works on any gun, so the roll is never wasted the way a mismatched damage-type bonus used to be. Your weapon\'s own damage type still decides which enemy armor bars it hits hardest.',
    howToGet: 'Weapons roll it since Season 2 Phase 1, and many Firepower and Toughness OS Protocols carry it as a fixed stat (Augmented Lethality, for one). The same patch took All Damage out of the pool for newly dropped weapon mods, so only older weapon mods carry it.',
    bestBuilds: 'Any weapon build. It is the damage-type-free replacement for the old Blast, Piercing and Shredding rolls.',
  },
  'Weapon Multi-Shot Chance': {
    overview: 'Weapon Multi-Shot Chance gives each bullet a chance to hit the target twice. TikTokAndy\'s explanation is the simplest one: when it procs, the bullet "actually hits the enemy 2 times instead of 1." More hits means more damage and more progress toward on-hit talents. It\'s RNG-based chaos and it\'s glorious.',
    whyItMatters: 'Multi-Shot is the sleeper stat for sustained DPS builds. Fast-firing guns with big magazines get the most value: more bullets means more rolls of the dice. TikTokAndy calls it "really really good" and runs about 35% on his Lightweight M4 build, with Phalanx Attack\'s 4-piece supplying +12% of that.',
    howToGet: 'Creators roll it on knee pads and gear mods (TikTokAndy\'s T2 Phalanx knee pads pair it with Crit Damage), gear mods gained weapon multi-shot rolls in Season 2 Phase 1, and Phalanx Attack\'s 4-piece adds +12%. Dominating Presence adds more for every enemy within 20 meters. Good rolls are rare, so when one lands, build around it.',
    bestBuilds: 'LMG builds with Phalanx Attack 4pc, Vanguard Commando builds, any sustained-fire DPS build that wants its on-hit weapon talents to stack faster.',
  },
  'Headshot Damage': {
    overview: 'Headshot Damage is the sniper\'s best friend. If you can consistently land headshots, this stat turns every precision shot into a mini nuke. It only applies on headshot hits, which means Marksman Rifles and accurate single-shot weapons benefit the most.',
    whyItMatters: 'Headshot Damage pays only when you hit heads, so it\'s worth more the better your aim and the slower your gun. Saiynergy\'s Bulwark Breacher stacks it on purpose to feed Death From Afar, which turns Headshot Damage into Firepower. If your aim is bad though, this stat does literally nothing. It\'s high risk, high reward.',
    howToGet: 'Creators show it on body armor, gloves and holsters, new weapon mods can roll Headshot Damage % since Season 2 Phase 1, and gear mods gained it in the same patch. One Shot One Kill (3pc +21.6%) and Quick Draw (4pc +28.8%) add it as set bonuses, and the Death From Afar OS Protocol converts it into Firepower.',
    bestBuilds: 'Marksman Rifle builds, Death From Afar OS Protocol loadouts, accurate AR builds that aim for the head. Wasted on shotgun and spray-SMG builds unless you\'re some kind of close-range headshot wizard.',
  },
  'Weapon Blast Damage': {
    overview: 'Weapon Blast Damage boosted weapon hits of the Blast damage type. Blast is the type that red-bar enemies are weak to, and AgentHuntzman sums it up as the damage type that is great against an enemy\'s raw health.',
    whyItMatters: 'It only ever helped a Blast weapon, which is exactly why Ubisoft removed it from weapon rolls in Season 2 Phase 1: on a weapon of a different damage type the bonus "didn\'t bring any benefits and was frustrating." What still matters is your weapon\'s own damage type against the enemy\'s color bar.',
    howToGet: 'Season 2 Phase 1 removed Blast, Piercing and Shredding damage from the weapon bonus attribute pool (Ubisoft swapped in All Weapon Damage) and from newly dropped weapon mods, so weapons and new mods no longer roll it. Mods you already own keep their rolls, and older weapons may still carry it.',
    bestBuilds: 'Only Blast weapons, like the Warlord and Lady Death, ever benefited. On anything else, an old Blast roll is dead weight.',
  },
  'Weapon Piercing Damage': {
    overview: 'Weapon Piercing Damage boosted weapon hits of the Piercing damage type. Piercing is the type dark-blue-bar enemies are weak to, and AgentHuntzman says it performs extremely well against armored enemies.',
    whyItMatters: 'Like the other damage-type rolls, it only helped a weapon that already dealt Piercing damage, which is why Season 2 Phase 1 replaced it with All Weapon Damage. Matching your weapon\'s own damage type to the enemy\'s color bar still matters.',
    howToGet: 'Season 2 Phase 1 removed it from the weapon bonus attribute pool (in favor of All Weapon Damage) and from newly dropped weapon mods; mods you already own keep their rolls, and older weapons may still carry it.',
    bestBuilds: 'Only Piercing weapons, like the Scorpio, ever benefited. Check the damage type in the Armory before you value an old roll.',
  },
  'Weapon Shredding Damage': {
    overview: 'Weapon Shredding Damage boosted weapon hits of the Shredding damage type. Shredding is the type light-blue-bar enemies are weak to; AgentHuntzman describes it as the type that excels at aggressive pressure.',
    whyItMatters: 'It only helped a weapon that already dealt Shredding damage, which is why Season 2 Phase 1 replaced it with All Weapon Damage. Your weapon\'s own damage type against the enemy\'s color bar is what still matters.',
    howToGet: 'Season 2 Phase 1 removed it from the weapon bonus attribute pool (in favor of All Weapon Damage) and from newly dropped weapon mods; mods you already own keep their rolls, and older weapons may still carry it.',
    bestBuilds: 'Only Shredding weapons, like the Strawberry Milkshake, ever benefited. Everywhere else it was a wasted line.',
  },
  'Max Health': {
    overview: 'Max Health is the size of your health pool. When things go sideways, this is what\'s left between you and the respawn screen, and a lot of talents and skill mods scale off it, so more Max Health makes those bigger too.',
    whyItMatters: 'Tank builds and Field Medic Combat Medicine builds stack Max Health alongside Armor, and AgentHuntzman\'s warning applies: Resurgence wants both, because a huge health bar still melts if your Armor is low. Extra Health effects like Siege, Swift Taunt and Backup Protection are a percentage of Max Health, so the bigger the pool, the bigger the buffer.',
    howToGet: 'Creators roll it on knee pads and gear mods (gear mods gained Max Health rolls in Season 2 Phase 1), and every gear piece and OS Protocol also carries a flat Health value. Self-Propelled Shield\'s 4-piece adds +24%, and the Frag Grenades, Fragmentation Charge and Positive Feedback skill mod combos give Max Health as their 2-piece bonus.',
    bestBuilds: 'Bulwark tank builds, Field Medic Combat Medicine, any PvP build that needs to survive burst damage. Also important for solo players who can\'t rely on a healer.',
  },
  'Armor': {
    overview: 'Armor is one of the two big defensive numbers on your sheet, next to Health. AgentHuntzman\'s rule for Resurgence is that you need both: "No matter how big your health may be, you will still die very fast if your armor is extremely low." It\'s the core survivability stat for tank builds.',
    whyItMatters: 'Armor % bonuses scale the Armor you already have, which is why TikTokAndy\'s Precision Support stacks took him from about 10,000 to about 14,000 Armor, and why he likes Armor mods on that build. Bulwark builds lean on it hardest. In PvP, high Armor plus Damage Reduction makes you extremely annoying to kill.',
    howToGet: 'Every gear piece carries a flat Armor value, gear mods can roll Armor since Season 2 Phase 1, and Tactical Augmentation Modules add the biggest late-game jumps. Self-Propelled Shield (2pc +14%) and Healing Elites (4pc +28%) are the Armor gear sets, and several skill mod combos give Armor as their 2-piece bonus (Area Suppression, Applied Demolitions, Airburst and Commando among them).',
    bestBuilds: 'Bulwark tank builds (mandatory), Field Medic survival builds, any PvP loadout that needs to face-tank. Also useful as a secondary stat on DPS builds for Dark Zone survival. Dead DPS does zero damage.',
  },
  'Damage Reduction': {
    overview: 'Damage Reduction (DR) is a percentage cut to incoming damage, and it\'s the one defensive stat with a known ceiling: Ubisoft\'s June 26, 2026 server hotfix capped damage reduction at 80%.',
    whyItMatters: 'DR makes every hit smaller, which is why Bulwark builds feel unkillable when it\'s stacked with big Armor and Health pools. The Fearless Warrior gear set has it at 2 pieces. Past the 80% cap, though, extra DR does nothing, so a build that\'s already there should turn those rolls into Armor or Health. Your stats screen may show more than 80%; Ubisoft said the visual feedback would come later.',
    howToGet: 'DR rolls as a gear attribute (TikTokAndy\'s September Vanguard gear had it on a holster), Fearless Warrior\'s 2-piece adds +6%, and it\'s the 2-piece bonus on many Vanguard and Field Medic skill mod combos, such as Bugle Call, Targeted Surveillance, Chemical Recharge and Harvest. Talents like Spirited, Conceited and Steady Suppression grant it conditionally.',
    bestBuilds: 'Bulwark builds, Vanguard hybrid builds that want to survive in PvP, Field Medic face-tank Combat Medicine builds. DR is the stat that lets you play aggressive without getting punished for it, right up to the cap.',
  },
  'Skill Critical Chance': {
    overview: 'Skill Critical Chance (Skill CHC) determines how often your skills land critical hits. Artillery Turrets, Striker Drones, Seeker Mines: when they crit, they deal amplified damage and trigger anything that procs on skill crits. This is the Engineering equivalent of Weapon CHC.',
    whyItMatters: 'Skill crit builds live and die by this stat. A turret with 50% Skill Crit Chance lands twice as many crits as one with 25%, and protocols like Surgical Engineering and sets like Cooling Device only fire on skill crits. Jackpot gear set\'s identity revolves around it, and Tampishach\'s 237k DPS Tech Aegis build sat at 53% Skill Crit Chance.',
    howToGet: 'Creators roll it on masks and knee pads (TikTokAndy\'s Tactical Pharma gear), and gear mods gained skill crit rolls in Season 2 Phase 1. Jackpot\'s 3-piece adds +10.8%, Optimized Targeting grants it during Drone Overload, and OS Protocols like Brains Over Brawn, Rampart and Chain Reaction use it as their main stat.',
    bestBuilds: 'Tactical Pharma and Tech Operator skill crit builds with Jackpot 4pc, Demolitionist skill crit builds, any Engineering-stacking loadout. If your skills do the damage, Skill CHC is your most important stat.',
  },
  'Skill Critical Damage': {
    overview: 'Skill Critical Damage (Skill CHD) determines how hard your skill crits actually hit. Like Weapon CHD, this is the multiplier that turns frequent crits from "nice" into "nuclear." Stack this alongside Skill CHC and your turrets, drones and swarms start deleting rooms.',
    whyItMatters: 'Skill CHD multiplies every skill crit, so once your Skill CHC is comfortable it becomes your highest-value Engineering stat. Several skill mod combos stack it as their 3-piece bonus (Applied Demolitions and Area Suppression, for example), and Surgical Engineering adds more on skill crits.',
    howToGet: 'It rolls as a gear attribute (TikTokAndy rerolls his mask toward it on his Tactical Pharma build), new weapon mods can roll Skill Critical Damage % since Season 2 Phase 1, and gear mods gained it in the same patch. Jackpot (4pc +24%) and Fire Cycle (2pc +12%) are the set bonuses skill crit builds pair, and the Enhanced Formula combo gives it as a 2-piece bonus.',
    bestBuilds: 'All Engineering DPS builds: Tactical Pharma skill crit, Demolitionist glass cannon, Tech Operator Striker Drone, any skill build running Jackpot gear set. Skill CHD is the second half of the skill crit equation.',
  },
  'Skill Intensity': {
    overview: 'Skill Intensity is a general boost to skill effectiveness. It raises damage for offensive skills and healing for support skills, so it\'s the one stat that makes almost everything about your skills better, regardless of what those skills actually do.',
    whyItMatters: 'Because it lifts both damage and healing, Skill Intensity is the stat Engineering builds of every flavor share: Field Medic healers stack it for bigger heals, Demolitionists for bigger explosions, and Tech Operators for nastier drones. A lot of Engineering talents and protocols grant it conditionally, which is why skill builds often have more of it in a fight than on the sheet.',
    howToGet: 'It rolls as a gear attribute, new weapon mods can roll Skill Intensity % since Season 2 Phase 1, and gear mods gained it in the same patch. Beneficial Association stacks it as a 3-piece bonus and Coordinated Strike grants it near allies; Boom-Shakalaka (4pc +12%) and Dr. Medic (3pc +9%) add it as set bonuses, and OS Protocols like Recursive Treatment and Chain Reaction grant it in combat.',
    bestBuilds: 'Field Medic healing builds (Support Station and Healing Hive), Demolitionist AoE builds, Tech Operator drone builds, any Engineering-focused loadout that wants a flat boost to everything their skills do.',
  },
  'All Skill Damage': {
    overview: 'All Skill Damage raises skill damage whatever the damage type. Since Season 2 Phase 1, weapons roll it where they used to roll Blast, Piercing or Shredding Skill Damage.',
    whyItMatters: 'Skill builds no longer need a damage-type roll that matches their skills: one stat covers every skill hit.',
    howToGet: 'It rolls on weapons since Season 2 Phase 1, in place of the old skill damage-type bonuses. Newly dropped weapon mods can\'t roll it.',
    bestBuilds: 'Engineering skill builds: Demolitionist, Tech Operator and Tactical Pharma setups that lean on skill hits.',
  },
  'Skill Multi-Shot Chance': {
    overview: 'Skill Multi-Shot Chance gives your skills a chance to hit more than once per attack. When your Artillery Turret or Striker Drone procs it, the extra hit is another chance to crit and another hit for anything that triggers on skill hits. It\'s RNG on top of RNG, and when it lines up, the DPS goes crazy.',
    whyItMatters: 'It\'s the high-variance DPS stat for skill builds, and it scales best on skills that hit often. TikTokAndy names it alongside Skill Critical Chance and Skill Critical Damage as the rolls he wants on his Tactical Pharma mods.',
    howToGet: 'Gear mods gained skill multi-shot rolls in Season 2 Phase 1. Fire Cycle\'s 4-piece adds +12%, the Overclocking OS Protocol and the Toymaker body armor talent grant it, and several skill mod combos stack it as their 3-piece bonus (Area Sweep, Frag Grenades, Fragmentation Charge).',
    bestBuilds: 'Tech Operator Striker Drone builds, Demolitionist Artillery Turret builds, any skill DPS loadout that fires frequently. High attack-speed skills get the most value because they have more chances to proc it.',
  },
  'Skill Duration': {
    overview: 'Skill Duration extends how long your deployed skills stay active before expiring. Those extra seconds on your Artillery Turret or Healing Hive can be the difference between clearing the room and watching your skill poof right when you needed it most.',
    whyItMatters: 'Skill Duration is effectively a damage multiplier for time-limited skills: an Artillery Turret that lasts 30 seconds instead of 20 gets 50% more time to shoot. Long-term Effect gear set is built around it. For Field Medic builds, longer Support Station uptime means more healing without having to worry about cooldowns.',
    howToGet: 'It rolls as a gear attribute. Long-term Effect (3pc +14.4%), Captain Cow (3pc +14.4%) and Mechanical Expert (2pc +9.6%) add it as set bonuses, and some skill mod combos extend specific skills as their 3-piece bonus (Optimized extends the Artillery Turret, Area Denial extends deployed turrets). The Adaptation and Last Stand weapon talents grant it conditionally.',
    bestBuilds: 'Long-term Effect 4pc Engineering builds, Field Medic Support Station healer builds, any build running deployable skills that benefit from longer uptime. Less useful for instant-use skills like Seeker Mines.',
  },
  'Skill Radius': {
    overview: 'Skill Radius expands the area of effect for your skills. Bigger radius means your Artillery Turret hits more enemies per shot, your Support Station heals allies in a wider area, and your Seeker Mines have a larger blast zone. It\'s the "I want to cover more ground" stat.',
    whyItMatters: 'In group content, Skill Radius can be the difference between your Support Station covering your whole team or just yourself. For offensive skills, bigger AoE means more enemies hit per activation and faster clear times. Area Denial skill mod combo specifically boosts Explosive Seeker Mine Radius.',
    howToGet: 'It rolls as a gear attribute (TikTokAndy\'s T1 Jackpot backpack has it next to Damage to Elites). Jackpot (2pc +12%) and Boom-Shakalaka (3pc +18%) add it as set bonuses, the Intense Performance backpack talent trades Skill Duration for a big Skill Radius boost, and Area Denial gives Explosive Seeker Mine Radius as part of its 3-piece bonus.',
    bestBuilds: 'Demolitionist AoE builds, Field Medic Support Station builds for group content, any build using area-denial skills in choke points. Especially valuable in PvP for zone control.',
  },
  'Skill Cooldown Recovery': {
    overview: 'Skill Cooldown Recovery reduces the time between skill uses. Faster cooldowns mean more skill uptime, more talent procs, and more of whatever your skills do per minute. It\'s the tempo stat that keeps your build\'s engine running.',
    whyItMatters: 'For builds that chain skills together, like a Demolitionist running Artillery Turret and Seeker Mine, faster cooldowns mean you always have something cooking. AgentHuntzman\'s Recon support build gets its cooldowns from Mechanical Expert, Boom-Shakalaka and the Pressing Matter OS Protocol, and that build guide argues extra rolls past that point are wasted, so know where your build\'s ceiling is.',
    howToGet: 'It rolls as a gear attribute. Boom-Shakalaka (2pc), Mechanical Expert (3pc) and Mechanical Enemy (4pc) are the gear sets with it, it\'s the 2-piece bonus on several skill mod combos (Exhaustion, Liquid Nitrogen, Tactical Insight), and Pressing Matter grants +10%. Liquid Nitrogen\'s 3-piece also gives hits a chance to cut skill cooldowns while Tactical Link is active.',
    bestBuilds: 'All Engineering builds benefit. Especially valuable for Demolitionist dual-skill rotations, Field Medic builds that need their Healing Hive back ASAP, and any build running skills with naturally long cooldowns.',
  },
  'Skill Blast Damage': {
    overview: 'Skill Blast Damage boosted skill hits of the Blast damage type, the type red-bar enemies are weak to. Season 2 Phase 1 retired it from weapon rolls along with the other damage-type bonuses.',
    whyItMatters: 'A damage-type bonus only helps when the damage type matches, which is the mismatch Ubisoft called frustrating when it replaced these rolls with All Skill Damage. If an old roll still sits on your gear or mods, it only counts on Blast-type skill hits.',
    howToGet: 'Season 2 Phase 1 removed it from the weapon bonus attribute pool (All Skill Damage replaced it) and from newly dropped weapon mods; mods you already own keep their rolls. For raw explosive power now, look at Skill Intensity, skill crit stats and combos like Thermobaric Grenades, which still multiplies Grenade Launcher damage (Season 1 Phase 3 cut it from +460% to +300%).',
    bestBuilds: 'Demolitionist explosive builds that still carry old rolls. For new gear, chase All Skill Damage and skill crit instead.',
  },
  'Skill Piercing Damage': {
    overview: 'Skill Piercing Damage boosted skill hits of the Piercing damage type, the type dark-blue-bar enemies are weak to. Season 2 Phase 1 retired it from weapon rolls along with the other damage-type bonuses.',
    whyItMatters: 'Like every damage-type roll, it only helped skills of the matching type, so Ubisoft replaced it with All Skill Damage, which covers every skill hit.',
    howToGet: 'Season 2 Phase 1 removed it from the weapon bonus attribute pool (All Skill Damage replaced it) and from newly dropped weapon mods; mods you already own keep their rolls.',
    bestBuilds: 'Only skill builds whose damage is Piercing ever benefited. Check your skills\' damage type before you value an old roll.',
  },
  'Skill Shredding Damage': {
    overview: 'Skill Shredding Damage boosted skill hits of the Shredding damage type, the type light-blue-bar enemies are weak to. Season 2 Phase 1 retired it from weapon rolls along with the other damage-type bonuses.',
    whyItMatters: 'Like every damage-type roll, it only helped skills of the matching type, so Ubisoft replaced it with All Skill Damage, which covers every skill hit.',
    howToGet: 'Season 2 Phase 1 removed it from the weapon bonus attribute pool (All Skill Damage replaced it) and from newly dropped weapon mods; mods you already own keep their rolls.',
    bestBuilds: 'Only skill builds whose damage is Shredding ever benefited. For new gear, All Skill Damage does the same job without the fine print.',
  },
  'Received Healing': {
    overview: 'Received Healing (Incoming Healing) increases the healing you receive from skills, talents and allied healers. In a game where not dying is half the battle, this stat turns every heal into a bigger heal. Simple, effective, and massively underrated.',
    whyItMatters: 'A Field Medic\'s Support Station healing you for 10k per tick becomes 12k with 20% Received Healing, and that compounds over long fights. Auto Trauma Treatment grants +6% Incoming Healing and Effective Triage +40% to allies below half Health. For groups running a dedicated healer, this stat on the DPS and tank players is an efficient way to improve survivability.',
    howToGet: 'Creators roll it on masks, gloves and backpacks (TikTokAndy\'s Aegis healer gear), and gear mods gained Received Healing rolls in Season 2 Phase 1. Healing Elites\' 2-piece adds +14.4%. It\'s a Universal stat, so it doesn\'t pull against any one core stat.',
    bestBuilds: 'Any build running in a group with a healer. Bulwark tanks get the most value because they take the most hits and need the most healing. Also useful on DPS builds in Legendary content where chip damage adds up.',
  },
  'Damage to Elites': {
    overview: 'Damage to Elites (DtE) is extra damage against elite enemies, the tougher enemies with colored weakness bars that fill endgame PvE. For PvE farming, it\'s one of the most efficient damage stats available.',
    whyItMatters: 'Elites are the enemies that take longest to kill, so a bonus that only applies to them lands exactly where your clear time goes. It does nothing against regular enemies and isn\'t a PvP stat, so it\'s a PvE farming pick.',
    howToGet: 'It rolls as a gear attribute (TikTokAndy\'s T1 Jackpot backpack has it next to Skill Radius) and on weapons. It\'s a Universal stat that works regardless of your core attribute split.',
    bestBuilds: 'Every PvE build benefits. Especially valuable for Legendary mission farmers, weekly bounty grinders, and anyone focused purely on PvE clear speed. If you\'re building for the Dark Zone, other rolls do more for you.',
  },
  'Signature Ability Charge Efficiency': {
    overview: 'Signature Ability Charge Efficiency (SACE) increases the rate at which your Signature Ability charges. Your Signature is your ultimate: M32A1 Grenade Launcher for Demo, Tactical Link for Vanguard, Breach Combo for Bulwark, Healing Swarm or Oxidizing Swarm for Medic, Drone Overload or Defender Drone for Tech Op. Getting it faster means using it more often, and using it more often means more clutch plays.',
    whyItMatters: 'SACE speeds up every charge source you have. The Pulse Feedback combo (also called Scout) grants flat Signature Ability Charge from Pulsed enemies, and Tactical Reinforcement grants +28.8% SACE when you deploy Tactical Link. In endgame content, the team that uses their ultimates most frequently usually wins, and this stat enables that.',
    howToGet: 'It rolls as a gear attribute and on weapons, and gear mods gained it in Season 2 Phase 1. Fire Cycle (3pc +18%) and Mechanical Expert (4pc +24%) add it as set bonuses, Pulse Feedback gives it as its 2-piece, and the Accelerated Charge body armor talent and the Inspiration and Strategic Assistance OS Protocols grant it too. It\'s a Universal stat, so any build can run it without sacrificing core attribute investment.',
    bestBuilds: 'Vanguard support builds running Tactical Link (SACE makes you the ultimate battery for your team), Field Medic builds that need their signature available for emergencies, Demolitionist builds that want their M32A1 up for every boss phase. The value scales with how impactful your Signature is.',
  },
};

export const statInteraction: Record<string, string> = {
  'weapon-critical-hit-chance': 'Weapon CHC works hand in hand with Weapon Critical Hit Damage, so both stats need investment for crit builds. Stacking CHC alone without CHD gives frequent but weak crits, while CHD without CHC means you rarely crit at all. Remember that Scanning Pulse and Tactical Link buffs add Crit Chance on top of your sheet.',
  'weapon-critical-hit-damage': 'Weapon CHD multiplies the damage of every critical hit. It scales best when paired with enough Weapon Critical Hit Chance to crit consistently. This is the highest-ceiling offensive stat for Firepower builds running crit-focused gear sets.',
  'weapon-damage': 'Weapon Damage raises all weapon hits, crits or not. It provides the most consistent damage increase because it does not depend on crit RNG. Stack this on builds that use talents or gear sets with non-crit damage amplification.',
  'weapon-multi-shot-chance': 'Multi-Shot Chance gives a bullet a chance to hit twice. Phalanx Attack\'s 4-piece and Dominating Presence\'s per-enemy bonus both add to it. Each extra hit is another chance to crit and another hit toward on-hit weapon talents.',
  'headshot-damage': 'Headshot Damage amplifies precision shots. It rewards aim skill but has lower overall value in mobile gameplay where headshots are harder to land consistently. Most competitive builds prioritize CHC and CHD over Headshot Damage unless running a Marksman Rifle or Death From Afar.',
  'weapon-blast-damage': 'Weapon Blast Damage only counted on Blast-type weapon hits, and Blast is what red-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Weapon Damage instead, so check enemy color bars against your weapon\'s own damage type.',
  'weapon-piercing-damage': 'Weapon Piercing Damage only counted on Piercing-type weapon hits, and Piercing is what dark-blue-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Weapon Damage instead.',
  'weapon-shredding-damage': 'Weapon Shredding Damage only counted on Shredding-type weapon hits, and Shredding is what light-blue-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Weapon Damage instead.',
  'max-health': 'Max Health directly increases your health pool, and every Extra Health effect that grants a percentage of Max Health grows with it. It pairs well with Received Healing: more health means each percentage of healing restores more absolute HP.',
  'armor': 'Armor provides layered survivability alongside Health and Damage Reduction, and Armor % bonuses scale whatever Armor your gear already gives you. That combination is what makes Bulwark and Vanguard tank builds extremely durable in group content.',
  'damage-reduction': 'Damage Reduction is a percentage-based mitigation stat, and it pairs with Armor and Health for layered survivability. Total damage reduction has been capped at 80% since the June 26, 2026 hotfix, so rolls past the cap are wasted.',
  'skill-critical-chance': 'Skill Crit Chance gives your skills a chance to critically hit. It scales particularly well with Tech Operator Striker Drone and Tactical Pharma builds, where each skill hit can crit for big burst damage.',
  'skill-critical-damage': 'Skill Crit Damage multiplies damage when skills crit. Like weapon crits, you need enough Skill Crit Chance to make this stat worthwhile. Balance both for optimal skill DPS.',
  'skill-intensity': 'Skill Intensity raises both skill damage and healing output, which makes it a primary scaling stat for any skill-focused build. Engineering is the core stat underneath it, and plenty of Engineering talents and protocols grant extra Skill Intensity in combat.',
  'skill-multi-shot-chance': 'Skill Multi-Shot Chance gives skills a chance to hit extra times. Combined with the Overclocking OS Protocol, the Toymaker talent and Fire Cycle\'s 4-piece, it creates an engine where skills chain-fire for devastating burst windows.',
  'skill-duration': 'Skill Duration extends how long deployed skills stay active. Critical for Support Station healers and any build that relies on persistent skill effects. More duration means fewer redeployments and better cooldown management.',
  'skill-radius': 'Skill Radius expands the area of effect for deployed skills. Important for AoE-focused builds like Demolitionist Artillery Turret or Field Medic Support Station builds where coverage matters.',
  'skill-cooldown-recovery': 'Skill Cooldown Recovery reduces the time between skill uses. It stacks with the Pressing Matter OS Protocol and the Boom-Shakalaka, Mechanical Expert and Mechanical Enemy gear set bonuses. For builds that rely on constant skill cycling, this is often the most impactful Engineering bonus attribute.',
  'skill-blast-damage': 'Skill Blast Damage only counted on Blast-type skill hits, the type red-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Skill Damage instead.',
  'skill-piercing-damage': 'Skill Piercing Damage only counted on Piercing-type skill hits, the type dark-blue-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Skill Damage instead.',
  'skill-shredding-damage': 'Skill Shredding Damage only counted on Shredding-type skill hits, the type light-blue-bar enemies are weak to. Since Season 2 Phase 1, weapons roll All Skill Damage instead.',
  'received-healing': 'Received Healing amplifies incoming healing from skills, talents and teammate heals. It is a Universal attribute, so it never competes with a core stat. Tank builds benefit enormously from stacking this alongside Max Health.',
  'damage-to-elites': 'Damage to Elites adds damage against elite enemies, the ones that soak up most of your time in endgame PvE. Universally useful across PvE build types, and worth swapping out for PvP.',
  'signature-ability-charge-efficiency': 'Signature Ability Charge Efficiency makes your Signature Ability charge faster. It is a Universal attribute that benefits all specializations. Vanguard Tactical Link and Field Medic Healing Swarm builds see the biggest uptime improvement from stacking this.',
};
