# In-game Build-Making Database record

This folder is our copy of the in-game **Build-Making Database** (Main menu > Build-Making Database), transcribed from screen
recordings of the live game. It is the source of truth the site's database is checked against, and it is kept in a form that
turns straight into a spreadsheet: every section has a JSON file and a CSV file with the same rows.

Nothing in this folder is served by the website. `src/data/*.json` is what the site uses; this folder is the evidence behind it.
The one exception is indirect: `scripts/build-db-images.mjs` turns the `evidence/` images into the in-game card pictures on the
database pages (resized WebP copies in `public/images/db/`, listed in `src/data/db-images.json`). Rerun it after new evidence lands.
For those pictures it trims the frame edges and, on OS Protocol cards, paints out the list that shows faintly through the
see-through popup; the evidence files themselves are never changed.

## Coverage

| Database section | Status | Entries | Recording |
|---|---|---|---|
| OS Protocol, Applicable to Engineering | Done 2026-10-28 | 28 | `Screen_Recording_20261028_152837` |
| OS Protocol, Applicable to Firepower | Done 2026-10-28 | 25 | `Screen_Recording_20261028_155041` |
| OS Protocol, Applicable to Toughness | Done 2026-10-28 | 13 | `Screen_Recording_20261028_155041` |
| Exotic Weapon | Done 2026-10-28 | 6 | `Screen_Recording_20261028_155256` |
| Skill Mod Combo Set | Done 2026-10-28 | 90 | `Screen_Recording_20261028_163454` |
| Weapon Talent | Done 2026-10-28 | 73 | `Screen_Recording_20261028_184307` |
| Gear Set Effect | Done 2026-10-28 | 16 | `Screen_Recording_20261028_201633` |
| Body Armor Talent | Done 2026-10-28 | 25 | `Screen_Recording_20261028_190611` |
| Backpack Talent | Done 2026-10-28 | 25 | `Screen_Recording_20261028_190726` |
| Weapon/Gear Bonus Attributes | Done 2026-10-28 | 24 | `Screen_Recording_20261028_190829` |
| Armory (outside the database): weapons and gear | Done 2026-10-28 | 92 weapons, 72 gear | `Screen_Recording_20261028_191045` |
| Weapon Talent Source lists (which weapons roll each talent) | Done 2026-10-29 | 67 talents, 1,548 talent and weapon pairs | `2026-10-29_09-40-59` to `2026-10-29_11-27-02` (11 videos) |
| Gear Set Effect Source lists | Done 2026-10-29 | 16 sets, 216 set and piece pairs (+4 extra tiles, see Open questions) | `2026-10-29_11-33-53`, `2026-10-29_11-38-05`, `Screen_Recording_20261029_131044` |
| Body Armor Talent Source lists | Done 2026-10-29 | 25 talents, 144 pairs | `2026-10-29_11-40-15` |
| Backpack Talent Source lists | Done 2026-10-29 | 25 talents, 144 pairs | `2026-10-29_11-42-06` |

The section recordings were made on 2026-10-28 and the Source lists on 2026-10-29, all during Season 2 Phase 2. Details are in
`recordings.json`. Every section of the database is covered, and so is every Source list.

The whole record as one spreadsheet (a tab per section, the Source lists and the per-item pools, with the counts as live
formulas) is built by `tools/make_workbook.py OUT.xlsx`.

## Files

- `os-protocols.json` / `os-protocols.csv`: all 66 OS Protocols. Name, the site's id (`os-N`), tab (Engineering, Firepower or
  Toughness), rarity, main stat and value, the three attributes, talent text, talent cooldown, and where in which recording it
  was read.
- `exotic-weapons.json` / `exotic-weapons.csv`: all 6 exotics. Class, damage type and value, RPM, magazine, talent name and
  text, the five weapon attributes, mod slots, TAM slots, how many possible second talents the card shows, and the card's
  flavor text.
- `skill-mod-combos.json` / `skill-mod-combos.csv`: all 90 Skill Mod Combo Sets. Name, the site's id (`smc-N`), tab, position
  in the tab's list, skill, the 2-piece and 3-piece text, talent cooldown, the rarities the card's "Source" panel shows, and
  where in the recording it was read.
- `weapon-talents.json` / `weapon-talents.csv`: all 73 Weapon Talents (67 regular and the 6 exotic talents). Name, the site's
  id (`wt-N`, blank for exotic talents the site keeps on the exotic pages), list position, talent text and cooldown at rank I,
  and the first weapon class the card's "Source" panel shows.
- `body-armor-talents.json` / `.csv` and `backpack-talents.json` / `.csv`: all 25 of each. Name, the site's id (`ba-N`, `bp-N`),
  list position, talent text and cooldown at rank I.
- `bonus-attributes.json` / `.csv`: the 24 Weapon/Gear Bonus Attributes in the database's order. Name, the icon group the list
  shows (Firepower, Toughness, Engineering, or none), the card's description, and the "Current" value the card showed for
  Cory's character when it was recorded (a character stat, not a property of the attribute).
- `armory-weapons.json` / `.csv`: every weapon in the Armory (86 standard and the 6 exotics). Name as the Armory writes it,
  class, the tier page it sits on (Season 1, Tier 0, 1 or 2), the damage type from the icon next to its name, and the matching
  site id and name.
- `gear-set-effects.json` / `.csv`: all 16 Gear Set Effects in the database's order. Name, the site's id (`gs-N`), the icon,
  the 2, 3 and 4-piece text, the Armory tiers the set rolls on, the other sets that share its gear pieces, the six Armory
  pieces per tier that can carry it, the rows the card's "Source" panel shows, and where in the recording it was read.
- `armory-gear.json` / `.csv`: every gear piece in the Armory (72: 12 each for holster, gloves, backpack, knee pads, body armor
  and mask), with its tier page and the gear sets it can roll (`gearSets`), plus the piece family (`gearSetFamily`, A to D)
  it belongs to.
- `creator-readings.json` / `.csv`: 32 on-screen readings from creator videos (checked 2026-10-29) that the database
  screens don't show: rank II talent values, the top tier of three skill mod sets (the database lists the lowest), a level 50
  OS Protocol, Tactical Augmentation Module tracks per gear piece, inventory counters, focus core stats, and activity rules.
  Each row has the creator, video, timestamp and a link to the frame.
- `weapon-talent-sources.json` / `.csv`: every weapon each of the 67 standard weapon talents can roll on, in the order the
  talent's Source panel lists them (by class), with class, Armory tier and rarities. Read off the scrolled panels by
  `tools/talent_sources.py`; the site copy is `src/data/weapon-talent-sources.json`.
- `gear-set-sources.json` / `.csv`, `body-armor-talent-sources.json` / `.csv`, `backpack-talent-sources.json` / `.csv`: every gear
  piece in each Gear Set Effect's, Body Armor Talent's and Backpack Talent's Source panel, read by `tools/gear_sources.py`; the
  site copy of all three is `src/data/gear-sources.json`.
- `gear-cards.json`: the gear cards opened from Source lists (each card shows the piece's name): 46 read by text recognition
  in `2026-10-29_11-33-53`, 14 by eye in `Screen_Recording_20261029_131044`. They confirm the position naming and name the
  extra tiles.
- `weapon-cards.json`: the four standard weapon cards opened from Source lists (ACE 52, Military MK46, M12, Tavor TS12), with
  the RPM and magazine size each card shows. The database shows those two stats only on a weapon's card, so the other
  standard weapons' magazines aren't recorded yet.
- `recordings.json`: the source recordings (file name, date, length, resolution, what each one covers).
- `evidence/`: one image per entry, stitched from the recording so the whole scrolled card is in one picture. These are the
  proof for every value in the JSON and CSV files.
- `evidence/exotic-weapons/headers/`: one clean, unstitched frame of each exotic card's top (name bar, weapon art and the
  attribute bar), 558 x 311, cut from `Screen_Recording_20261028_155256` at the moment each card opened (about 1.3, 24.3,
  39.8, 56.8, 80.0 and 98.5 seconds in: Lady Death, Warlord, Strawberry Milkshake, Scorpio, The Bighorn, Diamondback). The
  card's name bar stays put while the rest scrolls, so the stitched cards can show a seam just under it; the site's images
  use these frames for the top of every exotic card instead.
- `evidence/os-protocols/clean/`: every OS Protocol card rebuilt by `tools/clean_os_protocol_cards.py`. The stitched cards
  have the same seam problem under the title bar (an "OS Protocols" tag cut in half, a stray black band, half a line of text),
  and on some the top of the header is missing because the card was already scrolling. The tool takes the frame where the
  card sits at the top of its scroll, keeps everything the popup shows in it (about the first 690 rows), and adds the
  stitched card's remaining rows below, matched on the talent bar and on the rows where the two meet.
  `clean/frames.json` lists the frame used for each card and the match scores. No pixel is drawn or retouched; the values
  were read from the stitched cards and the frames show the same text. The site's images use these files.
- `archive/os-protocols-engineering-2026-07.csv`: the July 2026 capture of the Engineering tab, which had five rows flagged
  for recapture. All five are resolved by the October 28 recording.

## Conventions

- Values are exactly what the database card shows, including the game's own grammar ("for 1 seconds", "for every 1 enemies")
  and number formats (the exotic damage "1,68k" is stored as shown; the site writes it 1.68k).
- **OS Protocols are shown at level 1 with 0/5 talent upgrades.** Levelling raises the main stat by 10% of the base every five
  levels (2x at level 50). Each talent upgrade adds 20% of the base talent value (2x at 5/5).
- **Exotics are shown at Level 1, T1, with no mods.** Mods and TAMs change the weapon attributes, which is why creators' cards
  show different numbers.
- Within a rarity, OS Protocols share the same three attribute values: High-End +97 / +77 / +2,554, Superior +77 / +62 / +2,043,
  Specialized +58 / +46 / +1,532, Standard +38 / +30 / +1,021. Main stats follow the same 100 / 80 / 60 / 40% steps.
- **Skill Mod Combo Sets show the 2-piece bonus as a range** ("Skill Health+[4.0%~8.0%]") and the 3-piece talent at one value,
  which matches the lowest tier. The card's "Source" panel shows the three pieces (firmware, software and chipset) in each
  rarity the set comes in.
- **Weapon Talents are shown at rank I.** The section's own header says "Every weapon has 2 Weapon Talents, which are randomly
  assigned from its Weapon Talent pool." Each card's "Source" panel lists the weapons that can roll it, grouped by class, as
  thumbnails with rarity and tier but no names: all High-End copies, then Superior, then Specialized, in the same weapon order.
  The October 29 recordings scrolled every panel to the end. Tiles were named by matching each weapon's picture against an icon
  library built from the Armory screen and weapon cards, only within the tile's own class and tier (the tag is read off the
  tile); every weapon came out in all three rarities. **Every standard weapon is in exactly 18 talents' lists**, the same pool
  size as the exotics' 18 "Possible Talents", which is the strongest check that nothing was misread. Exotic weapons never
  appear in the Source panels; their pools come from their own cards.
- **Gear Source panels** show pieces, not names, in rows of six (mask, body armor, knee pads, backpack, gloves, holster): High-End
  then Superior, and T2, T1, T0 within each. Gear set lists were named by that position against the Armory's families (37 of the
  72 pieces were also read by name off gear cards Cory opened from the lists, and every one matched); talent lists were named by matching
  pictures against those pieces. **Every body armor piece can roll exactly 12 of the 25 body armor talents, and every backpack 12
  of the 25 backpack talents.**
- **Body Armor and Backpack Talents are shown at rank I** too. The section header reads "Generally, gear does not have a Talent,
  except for Backpacks and Body Armor." Each card's "Source" panel shows pictures of the gear pieces that can roll it (rarity
  and tier, no names); the evidence images include that panel.
- **Bonus attribute cards show a "Current" value**, which is the recording character's own total for that stat. We keep it in
  the record but it says nothing about the attribute itself. The section header reads "When you obtain a weapon or a gear piece,
  2 different Bonus Attributes will be randomly generated for them."
- **The Armory** (a separate menu, not the Build-Making Database) shows every weapon class in three pages (Season 1, Tier 0, 1
  and 2) and every gear slot the same way. The icon after a weapon's name is its damage type: a red burst is Blast, a single blue
  slash is Piercing and a green three-stroke claw mark is Shredding (the six exotics confirm the key). Locked items show as blueprints
  with a red label; that's ownership, not a different item.
- **Gear Set Effect cards** show the set's icon, name and its (2), (3) and (4) lines, then a "Source" panel of gear pieces in
  rows of six (mask, body armor, knee pads, then backpack, gloves, holster), each with its rarity colour and tier. The panels
  weren't scrolled, so the record keeps the rows in view: four full rows and the top of a fifth when the list goes on. The section
  header reads "Each gear piece belongs to a Combo Set. Equipping 2/3/4 pieces from the same set activates the corresponding
  set effect." Three of the bonus lines are negative on the card ("Skill Cooldown Recovery -12.0%", -9.0% and -6.0%); that's the
  game's way of writing a cooldown cut (see Open questions), and we keep the sign.
- **Which sets each gear piece can roll** comes from the Armory: every piece has the icons of its sets beside it, two on a T0
  page, three on T1 and four on T2. The 72 pieces fall into four families (A to D), one piece per slot and tier each, and each
  family carries four sets: A Fury Strike, Quick Draw (from T0), One Shot One Kill (from T1), Gunny Johnny (T2); B Jackpot,
  Long-term Effect, Dr. Medic, Mechanical Enemy; C Phalanx Attack, Boom-Shakalaka, Mechanical Expert, Fire Cycle; D Captain
  Cow, Fearless Warrior, Self-Propelled Shield, Healing Elites. Every set's Source panel agrees: the four T2-only sets list
  T2 High-End and T2 Superior pieces and nothing else, the T1 sets go straight from T1 High-End to T2 Superior, and the T0
  sets show a T0 High-End row. Three pieces hide their icons behind the model (Stridsvast Combat Vest, Ranger Ballistics Vest
  and "Tay" Protective Pads v2); their notes in `armory-gear.json` say how each was placed.
- Set icon key (the Armory uses the same icons): Fury Strike an explosion burst, Quick Draw a single bullet, Phalanx Attack
  three bullets, One Shot One Kill a crosshair, Gunny Johnny a pistol, Mechanical Enemy a mortarboard over a pistol, Jackpot
  slot machine reels, Long-term Effect a clock, Dr. Medic a microscope, Boom-Shakalaka a flame inside a burst, Fire Cycle a
  flame inside circular arrows, Mechanical Expert a gear with wrenches, Captain Cow a first-aid kit and syringe, Healing
  Elites a document with a cross and a shield, Self-Propelled Shield a shield with an arrow, Fearless Warrior a shield with
  crossed wings.
- The exotic cards also show a "Possible Talents" grid of 18 icons without names. Each icon was matched to its talent by
  comparing it with the icons on the 73 Weapon Talent cards (every match checked by eye); the names are in
  `exotic-weapons.json` (`possibleTalents`, in grid order).

## How the record was made

Each recording was cut into frames (4 and 12 per second), every detail popup was found automatically, scrolled popups were
stitched into one image, and each value was read twice: once by text recognition and once by eye against the image. Then
every field was compared with `src/data/`.

## What it changed on the site (2026-10-28)

- OS Protocols: all 66 matched on rarity, main stat and the three attributes. 64 of 66 talent texts matched word for word.
  Dominating Presence and Pummeling Shield now use the tooltip text, with the Season 2 Phase 2 cap and the June 26 stun change
  moved to their notes. Five talent cooldowns were missing and are now added: Long-Range Artillery (5 s), Combat Reload (5 s),
  Resentful (5 s), Level-Headed (5 s) and Enduring (10 s). Five Engineering entries flagged "unconfirmed" since July are confirmed.
  Every protocol now carries `verifiedInGame: "2026-10-28"`.
- Exotics: base weapon attributes corrected for Lady Death, Warlord, Strawberry Milkshake and Scorpio (the old numbers came
  from creators' cards with mods fitted); Scorpio's damage is 1.68k on the card, not 210; Strawberry Milkshake's and Scorpio's
  talent wording fixed; The Bighorn and Diamondback got full stat lines and database pages; the Diamondback's talent text is
  the official English text instead of our translation from a Portuguese client; the weapon's in-game name is "Diamondback".

- Skill Mod Combo Sets: all 90 matched by name, tab, skill and 2-piece bonus. 73 3-piece texts matched word for word, 12 more
  differed only in the game's "second(s)" and "stack(s)" wording (the site now uses the game's wording), and Hereafter
  Resilience differs only by the game's typo "atttached". Berserker changed for real: the
  database reads +60% Weapon Critical Hit Damage (Ubisoft fixed its bonus in Season 2 Phase 2) where we had the June tooltip's
  +100% Weapon Critical Hit Chance. Commando now uses the game's wording (same 10.20% for 10 seconds), Thermobaric Grenades got
  back a missing "but", and Offensive Defense's "Weapon Damage or Toughness?" caveat is settled on Weapon Damage. Every set has
  High-End and Superior pieces; 21 sets, one per skill, also come in Specialized. Every combo except Ammo Refill now carries
  `verifiedInGame: "2026-10-28"`.

- Weapon Talents: all 69 talents on the site matched by name and text, except Tactical Targeting, which was missing its "15%"
  Extra Health. The database confirms the rank I numbers we had flagged: Ammo Supply 54% (rank II reads 65%) and Slaughter
  Fortitude +12% (rank II reads +18%). Bloodlust's "Dealing 8 damage" and Unbreakable's flat "+36 Armor" are the game's own text.
  Every talent now carries `verifiedInGame: "2026-10-28"`.

- Body Armor and Backpack Talents: all 50 matched the site word for word except Siege, which reads "when 2 enemies are within
  20 meters" (we had "2 or more", from a creator's reading). Fixed on the site and in two builds. All 50 now carry
  `verifiedInGame: "2026-10-28"`, and both pages are marked verified for Season 2 Phase 2.
- Bonus attributes: every attribute's own description is now on the bonus attributes page as an "In game" line, the six
  damage-type attributes the database still lists got their own section with a note, and the page explains the difference
  (below).
- Weapons, from the Armory: every standard weapon now carries its Armory tier and damage type, and the weapons page lists all
  86 (it showed 41). Ten names were corrected to the game's (Police UMP-45, Vector 45 ACP, Naval MP5, Police T821, Classic M60,
  Black Market RPK-74 E, Military L86 LSW, Double Barrel Shotgun, 1886, SRS-A1), with 301s for the renamed pages and the old
  names kept as planner aliases. Four weapons that aren't in the game's Armory were removed (M1A, SVD, Infantry MG5 and ACR
  SS; all four came in with the May data import, with no source). The damage types guide had the Police M4 as Shredding and the MK17 as a Shredding
  example: the Armory shows the Police M4 as Blast and the Police Mk17 as Piercing. The guide's example weapons and an
  AgentHuntzman build note are fixed.

- Gear sets: all 16 matched the site's bonus text exactly. Every set now carries the tiers it rolls on and
  `verifiedInGame: "2026-10-28"`, and a new `src/data/armory-gear.json` lists the 72 Armory pieces with their sets. The gear set
  pages show each set's tier and the exact pieces per tier, and the copy was corrected where it disagreed with the game or
  with our own build guides: Gunny Johnny was called a "good starter set" but only rolls on T2; Long-term Effect was "the
  most-used skill set" and Fearless Warrior "the go-to for Bulwark Breachers", which our build guides don't bear out; One Shot
  One Kill's Firepower is the weapon-damage attribute, not a multiplier on everything; and the farming answer called weekly
  bounties the most consistent farm for set pieces, when creators farm OS Protocols there. The pages' combo suggestion paired a set with itself ("4pc Phalanx Attack + 2pc Phalanx Attack"); it now
  lists the build guides that actually wear the set. The farming guide gained a section on which sets each tier rolls, and the
  codes guide now spells the Twitch-drop gear the Armory's way.

## Open questions

- **Two extra tiles in Captain Cow and Fearless Warrior (answered).** Both sets' Source panels show eight Superior T0 tiles
  where every other block has six. Cory opened them in game (`Screen_Recording_20261029_131044`): the second knee pads tile
  opens the same "Tay" Protective Pads v2 card as the first, word for word, and the second gloves tile opens a finished
  Level 1 item, "Fearless Hunter's Code Gloves" (Power Score ---, Health 722, Armor 60, +8 to each core attribute, one random
  bonus attribute, Fearless Warrior set), where every other card describes how the piece is created. So the extras are
  second listings of pieces already in the lists, not new pieces; why the game lists them twice (a reward version, say) the
  database doesn't say. The same recording confirms the six T0 pieces of family D by name, including the two that the
  Armory recording could only place by elimination (Stridsvast Combat Vest and "Tay" Protective Pads v2).

- **Bonus attribute list vs Season 2 Phase 1.** The database still lists Weapon and Skill Blast, Piercing and Shredding Damage
  and doesn't list All Weapon Damage or All Skill Damage, although Ubisoft's Season 2 Phase 1 notes say the damage-type bonuses
  were removed "in favor of 'All Weapon Damage' or 'All Skill Damage'". Like the Ammo Refill card, the list may predate the
  patch, or gear may still roll them. The site keeps its pools and shows the six in their own section.
- **Release Extra Protection** (Dr. Medic 4-piece, Healing Elites 3-piece) is a set-only stat: it isn't in the Bonus
  Attributes list, so the database never describes it.
- **Armory scope.** The Armory pages are all labeled Season 1. Weapons added later (if any) would be on other pages; none showed
  in this recording.

- **The Bighorn's damage type (explained).** The database card says Shredding. Early copies didn't all match: on Ubisoft's bug
  reporter, [TDR-134](https://www.ubisoft.com/en-us/game/the-division/the-division-resurgence/bug-reporter/issues/TDR-134), players
  found Bighorns from the Season 2 Phase 1 pass dealing Piercing or Shredding (one had both) while the Armory showed Blast; the report
  is marked Done (September 25, 2026). TikTokAndy's Piercing copy (September 16 video) is one of those. The site goes with Shredding.
  Outside that bug, everything we've found points to one damage type per weapon, and exotics can't be rerolled.
- **Ammo Refill is out of date in the database.** The card still reads "29% chance of recovering 1 ammo", the text from before
  Season 2 Phase 1. Ubisoft's notes changed it to 4 bullets at a quarter of the chance (72% to 18% at the top tier), and
  TikTokAndy's set read 7% on September 30. The site keeps the patched values and says so on the page. The database is the best
  source we have, but this shows it can lag behind a patch.
- **"Skill Cooldown Recovery-" (explained).** Every 2-piece Skill Cooldown Recovery bonus is shown as "Skill Cooldown
  Recovery-[2.0%~4.0%]", with a minus where the other bonuses have a plus. It's how the game writes this stat everywhere: the
  Gear Set Effect cards say "Skill Cooldown Recovery -12.0%" (Mechanical Enemy), -9.0% and -6.0%, and gear rolls on creators'
  screens read the same way (-4.07% on LtFoe's chest). The minus means shorter cooldowns, a bonus. We store it as shown.
- **How many rolled talents does an exotic get? (answered)** Three talents in all: the fixed exotic talent plus two rolled from
  its pool of 18, which fits the section header ("Every weapon has 2 Weapon Talents..."). Cory confirmed it in game on
  2026-10-28. The exotic pages and the exotic list guide say so.
- **Precision Support or Precise Support? (decided)** The database card says "Precision Support"; item tooltips (TikTokAndy's
  Lightweight M4, 2026-10-27) say "Precise Support II". The site keeps "Precise Support" (Cory's call, 2026-10-28) and the
  talent's note mentions both.
- **Mod slots.** Lady Death, Scorpio, The Bighorn and Diamondback show five locked mod slots; Warlord and Strawberry Milkshake
  show five unlocked ones. We don't know what the difference means yet.

## Adding the next section

Record one database section per video: open each entry, hold about two seconds, scroll long text to the bottom and hold about
a second, then close. For sections with tabs, record every tab. Then add a JSON and CSV file here in the same shape, put the
evidence images under `evidence/<section>/`, update the coverage table and `recordings.json`, and compare against `src/data/`.
