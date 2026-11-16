# Working on Resurgence Builds

Read AUTOMATION.md (daily runs), WORKFLOW.md (posting checklist), DESIGN.md (layout rules), COMMENTS.md (the
comment system and its moderation) and VOTES.md (the player-ranked tier lists) as well. The rules below come straight
from the owner (Cory) and override anything older in those files.

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
  AI-generated images. (The one exception is the owner's own photos of his gear and books, on the pages described under
  "Reviews, gear and gift pages" below.) Editing an in-game picture is fine and encouraged: remove HUD or UI clutter,
  swap the text on a sign or poster for a joke, add a title. It has to still look like the game with something added,
  not like AI art.
- Don't reuse the same frame across posts; each post gets its own shot.
- Never bash Ubisoft in an edit either.
- How: `research/screenshots/make_hero.py research/screenshots/heroes.json` cuts frames (HUD cleared, optional title,
  optional word swap on a sign) into `research/screenshots/masters/`; owner screenshots go straight into that folder.
  Then `node scripts/build-post-images.mjs` makes the 480/800/1200/1600 px copies and `src/data/post-images.json`; point
  `featuredImage` at the `-1200.webp` copy and write an `imageAlt` that describes what is actually in the picture.
  Cards and post pages add `srcset`/`sizes` from the manifest automatically.
- `research/screenshots/ai-images-to-replace.md` lists the AI images still on the site. Replace them as new footage comes
  in and delete the old files.

## Reviews, gear and gift pages

The owner owns a phone controller and a shelf of Division books, comics and games, and sends photos of them. The pages
built on those (`/reviews/`, the controller guide, the gift guide, the books-in-order guide) follow these rules:

- **Nothing invented.** A review says what the item is, what the owner's photos show, what its maker or publisher states
  and what named review sites concluded. It never claims an experience nobody had (reading it, timing a battery, how it
  feels in the hand) and never carries a score, a rating or star markup unless the owner gave that score himself, in his
  words (`product.score` in the front matter). When he sends his own impressions, add them as his. No company sees or
  pays for a review.
- **Sources.** Product facts come from the object itself (the ISBN, price and credits printed on our copy), the maker's or
  publisher's own page, or a named publication with its date. The research records are in `research/gear/`. Say plainly
  what we have not tested.
- **The console games stay out of Resurgence facts.** The books and comics were written for The Division and The
  Division 2. Describe them as that, and never present their lore as a fact about Resurgence. The only bridge is what
  Ubisoft says about Resurgence itself (New York City, a new storyline, the first wave of SHD agents).
- **Photos.** Cut them with `research/reviews/make_photos.py` (the crops are in `photos.json`, the notes in its README),
  which writes masters to `research/screenshots/masters/`; then `node scripts/build-post-images.mjs`. The originals stay
  out of the repo: it is public, and some were taken at a window. Crop out anything that shows the owner's home, blur
  player names on a phone screen, and keep pictures of inside pages small (1000 px) so they show a book without
  replacing it. In markdown a picture on a line of its own becomes a captioned figure
  (`scripts/rehype-post-figures.mjs`); two on neighboring lines sit side by side.
- **Amazon.** Links are `https://www.amazon.com/dp/<ASIN>?tag=resurgencebuilds-20`; for a book the ASIN is the ISBN-10 of
  the ISBN printed on our copy. Never a price taken from Amazon, never a shortened link. Amazon refuses AI agents, and
  that is its right: do not open its pages by any route. The owner checks new links by hand, with links that do not
  carry our tag, because he must never buy through our own links, and neither may his friends or family.
- **Not a shop.** Reviews stay out of the home page's Latest feed (they have their own row below it), so builds and news
  stay on top.

## Shipping

- Build with `npm run build` (it stops on a roll the game doesn't allow), then
  `git checkout -- public/images/.optimized.json` and `node scripts/check-links.mjs` (0 broken). Check changed pages at
  phone and desktop widths.
- Editing a post never changes its date (`lastUpdated` on builds, `publishDate` and `lastUpdated` elsewhere). The home
  page lists posts by date, and a fix must not push an older post ahead of the new ones.
- Push to `main` (Cloudflare Pages deploys it) and to `accuracy-pass-2026-10-28`.
- No em dashes or en dashes in site content.
