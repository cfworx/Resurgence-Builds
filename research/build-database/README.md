# In-game Build-Making Database record

This folder is our copy of the in-game **Build-Making Database** (Main menu > Build-Making Database), transcribed from screen
recordings of the live game. It is the source of truth the site's database is checked against, and it is kept in a form that
turns straight into a spreadsheet: every section has a JSON file and a CSV file with the same rows.

Nothing in this folder is served by the website. `src/data/*.json` is what the site uses; this folder is the evidence behind it.

## Coverage

| Database section | Status | Entries | Recording |
|---|---|---|---|
| OS Protocol, Applicable to Engineering | Done 2026-10-28 | 28 | `Screen_Recording_20261028_152837` |
| OS Protocol, Applicable to Firepower | Done 2026-10-28 | 25 | `Screen_Recording_20261028_155041` |
| OS Protocol, Applicable to Toughness | Done 2026-10-28 | 13 | `Screen_Recording_20261028_155041` |
| Exotic Weapon | Done 2026-10-28 | 6 | `Screen_Recording_20261028_155256` |
| Skill Mod Combo Set | Done 2026-10-28 | 90 | `Screen_Recording_20261028_163454` |
| Weapon Talent | Done 2026-10-28 | 73 | `Screen_Recording_20261028_184307` |
| Gear Set Effect | Not recorded yet | | |
| Body Armor Talent | Done 2026-10-28 | 25 | `Screen_Recording_20261028_190611` |
| Backpack Talent | Done 2026-10-28 | 25 | `Screen_Recording_20261028_190726` |
| Weapon/Gear Bonus Attributes | Done 2026-10-28 | 24 | `Screen_Recording_20261028_190829` |
| Armory (outside the database): weapons and gear | Done 2026-10-28 | 92 weapons, 72 gear | `Screen_Recording_20261028_191045` |

All recordings were made on 2026-10-28 during Season 2 Phase 2. Details are in `recordings.json`.

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
- `armory-gear.json` / `.csv`: every gear piece in the Armory (72: 12 each for holster, gloves, backpack, knee pads, body armor
  and mask), with its tier page.
- `recordings.json`: the source recordings (file name, date, length, resolution, what each one covers).
- `evidence/`: one image per entry, stitched from the recording so the whole scrolled card is in one picture. These are the
  proof for every value in the JSON and CSV files.
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
  thumbnails with rarity and tier but no names. The panels weren't scrolled in this recording, so the record keeps only the first
  class shown.
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

## Open questions

- **Bonus attribute list vs Season 2 Phase 1.** The database still lists Weapon and Skill Blast, Piercing and Shredding Damage
  and doesn't list All Weapon Damage or All Skill Damage, although Ubisoft's Season 2 Phase 1 notes say the damage-type bonuses
  were removed "in favor of 'All Weapon Damage' or 'All Skill Damage'". Like the Ammo Refill card, the list may predate the
  patch, or gear may still roll them. The site keeps its pools and shows the six in their own section.
- **Gear Set Effect** is the one database section not recorded yet.
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
- **"Skill Cooldown Recovery-".** Every 2-piece Skill Cooldown Recovery bonus is shown as "Skill Cooldown Recovery-[2.0%~4.0%]",
  with what looks like a minus where the other bonuses have a plus. It is almost certainly a display quirk (the bonus is
  positive), and we store it as shown.
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
