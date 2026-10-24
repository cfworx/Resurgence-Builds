# Daily content automation (playbook)

This is the procedure the scheduled **morning run** follows every day. It is written for an AI agent (or a human) starting
from a fresh clone with no memory of earlier runs. Everything it needs to remember lives in `automation/state.json`.

Goal: each morning, check the official sources for anything new about **Tom Clancy's The Division Resurgence**. If something
is post-worthy, write it up in the site's voice, update the live-state data, run every quality gate, and push to `main`
(Cloudflare Pages deploys `main` automatically). If nothing is post-worthy, change nothing and push nothing.

---

## 0. Ground rules (read before every run)

1. **Accuracy is the brand.** Every game fact must come from an official source (list below) or be clearly attributed to a
   named creator or community post and hedged. If you can't verify it, don't publish it.
2. **Never mix up Division games.** The Division Resurgence is a separate game from The Division (2016) and The Division 2.
   Never borrow mechanics, numbers, gear, exotics, talents or modes from them, even when names match (Scorpio, Diamondback...).
3. **Never bash Ubisoft.** No jokes or lines that mock, insult or blame Ubisoft or its developers, nothing that could hurt
   a partnership. Aim the humor at ourselves, the grind, RNG and players. Report bugs and frustration neutrally, and say
   what Ubisoft fixed or is doing. Don't repeat insulting quotes from reviews, press or Reddit.
4. **Voice:** sarcastic, data-driven and funny, "a Reddit shitposter with a journalism degree", written for grown-up gamers
   (lots of dads with jobs). Short paragraphs, headings, tables where they help. Follow `WORKFLOW.md` (its checklist is law):
   no em dashes, titles under 45 characters, descriptions under 150, 3 to 6 FAQs that are funny but factually real,
   author `RapidF5`, internal links, a `## Sources` section.
5. **Don't circumvent blocks.** Reddit is blocked for the agent's web tools; do not scrape it through mirrors, archives
   (e.g. Arctic Shift) or proxies. Only use Reddit data the site owner exports and provides.
6. **Small, safe changes.** At most 2 new posts per run (combine smaller items into one roundup). Never delete content,
   never change slugs/URLs, never touch `astro.config.mjs` redirects or SEO plumbing in an automated run.

---

## 1. Setup

```bash
git clone --depth 1 https://github.com/cfworx/resurgence-builds && cd resurgence-builds
npm ci            # Node >= 22.12
cat automation/state.json
```

The container's shell usually can't reach websites (only package registries and GitHub). Use the agent's web tools
(WebFetch / WebSearch, or a browser tool if the session has one) to read sources.

---

## 2. Sources to check (in this order)

| # | Source | URL | What to compare |
|---|---|---|---|
| 1 | Steam announcements (official) | Steam News API: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3749720&count=20&maxlength=0&format=json` (human page: `https://store.steampowered.com/news/app/3749720`) | items newer than `state.steam.latestDate` / not in `state.steam.seen` |
| 2 | Ubisoft Help Center, Patch Notes section | `https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/section/539-patch-notes/` | article IDs not in `state.helpCenterPatchNotes` |
| 3 | Ubisoft game news | `https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates` | entries not in `state.ubisoftNews` |
| 4 | Ubisoft News articles | search: `The Division Resurgence site:news.ubisoft.com` | articles not in `state.newsUbisoftCom` |
| 5 | Official X account | `https://x.com/TheDivMobile` (logged-out view shows ~5 latest posts; WebSearch "TheDivMobile" as fallback) | status IDs greater than `state.x.latestSeenStatusId` |
| 6 | Official bug reporter | `https://www.ubisoft.com/en-us/game/the-division/the-division-resurgence/bug-reporter/issues` | status changes vs `state.bugReporter` (Planned, In Progress, Done) |
| 7 | Help Center drop rates | `https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2522-drop-rates/` | the "Last Updated" age vs `state.dropRates` |
| 8 | Owner-provided files | `game_knowledge/transcripts/`, `game_knowledge/reddit/` (gitignored, only present when the owner shares them in a session) | files not in `state.ownerFiles` |

Notes:
- Season patch notes have appeared in the Help Center (most phases), on Steam, and on the official subreddit
  (Season 2 Phase 1 was only on Reddit; it's mirrored on The Division Wiki at
  `https://thedivision.fandom.com/wiki/Season_2_Phase_1_-_Patch_Notes`). Smaller hotfix notes have been posted on the
  subreddit by u/TDResurgence (Dev Team) or u/Ticksyy. If a source mentions notes you can't open, say so and wait for the owner.
- Fandom wiki pages for Resurgence weapons are often contaminated with Division 2 data. Use Fandom only for mirrors of
  official text or the community map, never for stats.
- Third-party "codes" and "tier list" sites are mostly SEO filler. Don't use them as sources.

---

## 3. Is it post-worthy?

| Found | Do |
|---|---|
| New patch notes or hotfix notes | **Patch-notes post** in `src/content/patch-notes/` (full breakdown with "what it means" analysis). Update related data and guides (section 5). |
| New season or phase live, new pass, new exotic | **News post** + patch-notes post if notes exist. Update `src/data/season-status.json`, `CURRENT_PATCH` in `src/data/site-config.ts`, and the exotic list guide. |
| Phase extension, delay, roadmap, new platform, shutdown-type announcements | **News post** (careful, neutral, quote Ubisoft verbatim). |
| Limited-time events with dates, login rewards, Twitch Drops, free gifts, codes | **News post** (combine several into one); update `src/content/guides/division-resurgence-codes.md` if anything is free or redeemable. |
| Bug reporter: a major issue marked Done, or a feature marked Planned | Add to a **weekly bug-reporter roundup** (max one per week), not a daily post. |
| Store offers with no free reward, cosmetic draws alone, generic hype posts | **Not post-worthy** on their own. Mention inside a roundup if one is being written anyway. |
| Anything you can't verify from an official source | **Not post-worthy.** Note it in the run summary for the owner. |
| Owner-provided Reddit export | A **community roundup** in the "Reddit Highlights" series (see `src/content/news/reddit-weekly-highlights-october-24.md` for the format). Feature constructive, funny and useful posts; skip pure rants; link the threads. |
| Owner-provided creator transcript with a build | A **build post** in `src/content/builds/` crediting the creator (see `misdirection-double-barrel-commando-build-tiktokandy.md`), names verified against `src/data/*.json`. Set `verified: false` (we haven't re-tested it), which shows a "Creator build" badge and keeps it off the ranked tiers. |

---

## 4. Writing the post

- **Frontmatter schemas** are in `src/content.config.ts`. News: `title, publishDate, updatedDate?, author, tags, description,
  shareTitle, shareText, faqs, sources?`. Patch notes: `title, version, patchDate, updatedDate?, author, summary, ...`.
  Guides: `publishDate` (first published, never changes) and `lastUpdated` (bump on material updates). A schema error breaks the build.
- **Dates:** `publishDate`/`patchDate` = the day Ubisoft announced or released it (UTC date). Use `updatedDate` when you
  materially update an existing post (it shows "Updated" and feeds `dateModified` and the sitemap).
- **Images:** no new image generation. You may reuse an existing image from `public/images/` when it genuinely fits the
  topic (for example `news/division-resurgence-server-hotfix-june-26-2026-hero.webp` for hotfix posts). Never reuse an
  image whose text belongs to a different topic or that mocks Ubisoft. Otherwise omit `featuredImage`/`imageAlt`.
- **Quotes:** short verbatim quotes of official Ubisoft text are fine. Anything from press or creators: under 15 words.
- **Callouts:** `> [!INFO] Title`, `> [!WARNING] Title`, `> [!DANGER] Title`.
- **Internal links:** only to pages that exist (`ls src/content/*`, `src/pages`). Good targets: the latest patch notes,
  `/division-resurgence-interactive-map/`, `/database/drop-rates/`, `/guides/exotic-sealed-caches/`,
  `/guides/division-resurgence-exotic-weapons-list-2026/`, `/guides/division-resurgence-codes/`, `/builds/`.

---

## 5. Keep the live data honest

Update these when a source changes them (and only then):

- `src/data/season-status.json`: the homepage "Live now" strip (season, headline, links, `checked` date).
- `src/data/site-config.ts`: `CURRENT_PATCH` and `CURRENT_PATCH_PLAIN` when a new season or phase goes live.
- `src/data/drop-rates.json`: when the Help Center drop-rates article changes. Re-transcribe the whole table (every cache,
  every row) and check each tier sums to its total; never partially update. Update `checked` and `sourceUpdatedApprox`.
- `src/content/guides/division-resurgence-exotic-weapons-list-2026.md` and `src/content/guides/exotic-sealed-caches.md`
  when an exotic is added or changed.
- `src/content/guides/division-resurgence-codes.md`: on the **first run of each month**, re-check the official channels;
  if still no public codes, bump the month in the title and in "Active Codes: <Month Year>", and set `lastUpdated`.
- Database JSON (`src/data/os-protocols.json`, `weapon-talents.json`, `skill-mod-combos.json`, notes files): when patch
  notes change a value, update it and add a `patchHistory` note where that file supports one. Keep "Last verified" stamps
  as they are (they mean in-game verification, which an automated run can't do).
- Interactive map (`src/data/pois.json` via `scripts/build-map-data.mjs`): only when official sources announce new map content.

---

## 6. Quality gates (all must pass before pushing)

```bash
# 1. Frontmatter parses
node -e "const y=require('js-yaml'),fs=require('fs');for(const f of process.argv.slice(1)){const m=fs.readFileSync(f,'utf8').match(/^---\n([\s\S]*?)\n---/);y.load(m[1]);console.log('ok',f)}" <changed .md files>
# 2. No em dashes in changed content
grep -n "—" <changed files>   # must print nothing
# 3. Full build (also runs the indexation audit)
npm run build
# 4. Internal links
node scripts/check-links.mjs
# 5. The build rewrites this cache file; don't commit it
git checkout -- public/images/.optimized.json 2>/dev/null || true
```

Then **re-read every new post against its sources**: list each factual claim and the source line that supports it. Remove
anything you can't support. Check the tone rule (section 0.3) one more time.

---

## 7. Publish

```bash
git add <specific files> automation/state.json
git commit -m "content: <what was published>"
git push origin HEAD:main
```

Update `automation/state.json` in the same commit: add every source item you looked at (published or not) so the next run
doesn't re-evaluate it, and set `lastRun`. If nothing was post-worthy, **don't commit** (no empty deploys).

---

## 8. Run summary

End every run with a short summary for the owner: what was published (with URLs), what was skipped and why, and anything
that needs a human (unverifiable claims, sources that wouldn't load, Reddit or transcript files worth sharing).
