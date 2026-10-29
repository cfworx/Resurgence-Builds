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
| Body Armor Talent | Not recorded yet | | |
| Backpack Talent | Not recorded yet | | |
| Weapon/Gear Bonus Attributes | Not recorded yet | | |

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

## Open questions

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
