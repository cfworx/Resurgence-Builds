# Working on Resurgence Builds

Read AUTOMATION.md (daily runs), WORKFLOW.md (posting checklist) and DESIGN.md (layout rules) as well. The rules below
come straight from the owner (Cory) and override anything older in those files.

## Accuracy

- The site's reputation is accuracy. Every game fact traces to the game itself (our screen recordings), an official
  Ubisoft source, or a clearly attributed and hedged creator claim. Never mix in mechanics, numbers or names from The
  Division 1 or 2.
- Never tell readers a piece of gear or a weapon can roll something it can't. Which talents roll on which weapons and
  gear pieces is recorded in `research/build-database/` (the "spreadsheet": JSON and CSV per section). Builds, the
  Build Planner and the database pages must agree with it.
- When a claim can't be checked yet, say less rather than guess.

## Every new video is an audit

The owner sends screen recordings of the game. For each one:

1. Work out what it shows (talent Source lists, Armory screens, database cards, missions, the Base of Operations...).
2. Compare it with the research data and the site, and fix what differs. Talent Source lists go through
   `research/build-database/tools/talent_sources.py scan <video>`; check its review sheets by eye before using them.
3. Keep good frames for post images (see below).
4. Note anything the video can't settle and ask the owner for a recording of it. When a build guide needs a screenshot
   from a creator's YouTube video, give the owner the link and timestamp; he captures it (we can't download YouTube).

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

- Build with `npm run build`, then `git checkout -- public/images/.optimized.json` and `node scripts/check-links.mjs`
  (0 broken). Check changed pages at phone and desktop widths.
- Push to `main` (Cloudflare Pages deploys it) and to `accuracy-pass-2026-10-28`.
- No em dashes or en dashes in site content.
