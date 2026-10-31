# Working on Resurgence Builds

Read AUTOMATION.md (daily runs), WORKFLOW.md (posting checklist), DESIGN.md (layout rules) and COMMENTS.md (the
comment system and its moderation) as well. The rules below come straight from the owner (Cory) and override anything
older in those files.

## Accuracy

- The site's reputation is accuracy. Every game fact traces to the game itself (our screen recordings), an official
  Ubisoft source, or a clearly attributed and hedged creator claim. Never mix in mechanics, numbers or names from The
  Division 1 or 2.
- Never tell readers a piece of gear or a weapon can roll something it can't, or that it can't roll something it can
  (we once said a gun couldn't get a talent it can). Which talents roll on which weapons and gear pieces is recorded in
  `research/build-database/` (the "spreadsheet": JSON and CSV per section). Builds, the Build Planner and the database
  pages must agree with it. `node scripts/check-rolls.mjs` (part of `npm run build`) checks every build sheet, "these
  roll it too" swap list and planner link against those lists. Lines like "the only X that rolls Y" or "Z can't roll it"
  are checked by hand against the same data before they ship.
- When a claim can't be checked yet, say less rather than guess.
- Write for readers: use the game's names (no notes correcting what a creator called something) and leave out how we
  worked something out from a screenshot unless the reader needs it.

## Every screenshot and video is an audit

The owner sends screen recordings and screenshots of the game, his own or ones he captured from creators' videos. What
the game shows is the truth, so each one gets a full audit, every time, without being asked:

1. Work out everything it shows (talent Source lists, Armory screens, database cards, loadout and Attributes screens,
   missions, the Base of Operations...), not just the thing it was sent for.
2. Compare all of it with the research data and the site (posts, guides, database pages, the Build Planner) and fix what
   differs, everywhere it appears. Weapon talent Source lists go through
   `research/build-database/tools/talent_sources.py scan <video>`, gear set, body armor and backpack talent lists through
   `tools/gear_sources.py scan <video>`; check their review sheets by eye before using them, then `compile`. Every standard
   weapon rolls 18 of the 67 weapon talents and every body armor or backpack 12 of its 25 talents: a scan that breaks those
   counts has misread something.
3. Add what we didn't know: new facts go into the research records (creator footage into `creator-readings.json` and
   `.csv`) and onto the pages that need them.
4. Look for a better picture than the one we use now (sharper, newer, or an in-game shot where a post still has an AI
   image) and swap it in. Keep good frames for post images (see below).
5. Keep the spreadsheet and the assets current: when the records change, rebuild the workbook with
   `tools/make_workbook.py`, recalculate it and send the owner the new copy; keep database icons and post images in step
   with the game.
6. Note anything it can't settle and ask the owner for a recording of it. When a build guide needs a screenshot from a
   creator's YouTube video, give the owner the link and timestamp; he captures it (we can't download YouTube).

## Images: in-game only

- Every post image is an in-game picture: a frame from our recordings or a screenshot the owner captured. No purely
  AI-generated images. Editing an in-game picture is fine and encouraged: remove HUD or UI clutter, swap the text on a
  sign or poster for a joke, add a title. It has to still look like the game with something added, not like AI art.
- Don't reuse the same frame across posts; each post gets its own shot.
- Never bash Ubisoft in an edit either.
- How: `research/screenshots/make_hero.py research/screenshots/heroes.json` cuts frames (HUD cleared, optional title,
  optional word swap on a sign) into `research/screenshots/masters/`; owner screenshots go straight into that folder.
  Then `node scripts/build-post-images.mjs` makes the 480/800/1200/1600 px copies and `src/data/post-images.json`; point
  `featuredImage` at the `-1200.webp` copy and write an `imageAlt` that describes what is actually in the picture.
  Cards and post pages add `srcset`/`sizes` from the manifest automatically.
- `research/screenshots/ai-images-to-replace.md` lists the AI images still on the site. Replace them as new footage comes
  in and delete the old files.

## Shipping

- Build with `npm run build` (it stops on a roll the game doesn't allow), then
  `git checkout -- public/images/.optimized.json` and `node scripts/check-links.mjs` (0 broken). Check changed pages at
  phone and desktop widths.
- Editing a post never changes its date (`lastUpdated` on builds, `publishDate` and `lastUpdated` elsewhere). The home
  page lists posts by date, and a fix must not push an older post ahead of the new ones.
- Push to `main` (Cloudflare Pages deploys it) and to `accuracy-pass-2026-10-28`.
- No em dashes or en dashes in site content.
