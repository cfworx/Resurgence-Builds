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
| Skill Mod Combo Set | Not recorded yet | | |
| Weapon Talent | Not recorded yet | | |
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
- The exotic cards also show a "Possible Talents" grid of icons (18 per exotic) without names. Matching those icons to talent
  names needs the Weapon Talent section, which isn't recorded yet.

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

## Open questions

- **The Bighorn's damage type.** The database card says Shredding. TikTokAndy's Armory card for his own copy said Piercing in
  his September 16, 2026 video, the day Season 2 Phase 2 fixed "incorrect damage type information shown for certain weapons."
  An Armory screenshot of a current Bighorn would settle it.
- **Mod slots.** Lady Death, Scorpio, The Bighorn and Diamondback show five locked mod slots; Warlord and Strawberry Milkshake
  show five unlocked ones. We don't know what the difference means yet.

## Adding the next section

Record one database section per video: open each entry, hold about two seconds, scroll long text to the bottom and hold about
a second, then close. For sections with tabs, record every tab. Then add a JSON and CSV file here in the same shape, put the
evidence images under `evidence/<section>/`, update the coverage table and `recordings.json`, and compare against `src/data/`.
