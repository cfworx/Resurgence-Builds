# Daily content automation (playbook)

This is the procedure the scheduled **morning run** follows every day. It is written for an AI agent (or a human) starting
from a fresh clone with no memory of earlier runs. Everything it needs to remember lives in `automation/state.json`.

Goal: each morning, check the official sources and every active source in `automation/sources.json` for anything new
about **Tom Clancy's The Division Resurgence**. If something is post-worthy and verified, write it up in the site's voice,
update the live-state data, run every quality gate, and push to `main` (Cloudflare Pages deploys `main` automatically).
Either way, save what you checked to `automation/state.json` (section 7 explains how to do that without a deploy).

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
git clone --depth 1 https://github.com/cfworx/Resurgence-Builds resurgence-builds && cd resurgence-builds
npm ci            # Node >= 22.12
cat automation/state.json
```

The container's shell usually can't reach websites (only package registries and GitHub). Use the agent's web tools
(WebFetch / WebSearch, or a browser tool if the session has one) to read sources.

---

## 2. Sources to check (in this order)

### 2a. Official sources (Tier A: the only sources that can carry a game fact on their own)

| # | Source | URL | What to compare |
|---|---|---|---|
| 1 | Steam announcements (official) | Try the RSS feed `https://store.steampowered.com/feeds/news/app/3749720/`, then the Steam Community announcements page `https://steamcommunity.com/games/3749720/announcements/`, then WebSearch. Don't fetch the Steam News API (`api.steampowered.com`): our fetch tool refuses it (robots rules). The store's news page needs JavaScript and comes back empty. | items newer than `state.steam.latestDate` / not in `state.steam.seen` |
| 2 | Ubisoft Help Center, Patch Notes section | `https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/section/539-patch-notes/` | article IDs not in `state.helpCenterPatchNotes` |
| 3 | Ubisoft game news | `https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates` (a JavaScript page our fetch tool often can't read; fall back to WebSearch `"Division Resurgence" site:ubisoft.com news`) | entries not in `state.ubisoftNews` |
| 4 | Ubisoft News articles | search: `The Division Resurgence site:news.ubisoft.com` | articles not in `state.newsUbisoftCom` |
| 5 | Official X account | WebSearch `TheDivMobile` (our fetch tool refuses `x.com`, so don't fetch it) | status IDs greater than `state.x.latestSeenStatusId` |
| 6 | Official bug reporter | `https://www.ubisoft.com/en-us/game/the-division/the-division-resurgence/bug-reporter/issues` (JavaScript only: try once; if it doesn't render, it's a **manual** source the owner or an interactive session checks with a browser, so don't count it as a failure) | status changes vs `state.bugReporter` (Planned, In Progress, Done) |
| 7 | Help Center drop rates | `https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2522-drop-rates/` | the "Last Updated" age vs `state.dropRates` |
| 8 | Official website | `https://www.ubisoft.com/en-us/game/the-division/resurgence` | the season banner (it showed "Season 2: The Call" on 2026-10-25); a new season or phase banner is news |
| 9 | Ubisoft's YouTube trailers | WebSearch `"Division Resurgence" trailer Ubisoft` (Resurgence has no channel of its own; trailers go on @Ubisoft, and `@TheDivisionResurgence` is **not** official) | a trailer newer than the last one in `state.sources` |
| 10 | Owner-provided files | `game_knowledge/transcripts/`, `game_knowledge/reddit/` (gitignored, only present when the owner shares them in a session) | files not in `state.ownerFiles` |

Ubisoft's Instagram (`@thedivmobile`), TikTok (`@thedivmobile`) and the TDResurgenceSEA Facebook page can't be read by our
tools. Don't try to get around that; if WebSearch surfaces a post from them, treat it like an X post found by search.

Notes:
- Season patch notes have appeared in the Help Center (most phases), on Steam, and on the official subreddit
  (Season 2 Phase 1 was only on Reddit; it's mirrored on The Division Wiki at
  `https://thedivision.fandom.com/wiki/Season_2_Phase_1_-_Patch_Notes`). Smaller hotfix notes have been posted on the
  subreddit by u/TDResurgence (Dev Team) or u/Ticksyy. If a source mentions notes you can't open, say so and wait for the owner.
- Fandom wiki pages for Resurgence weapons are often contaminated with Division 2 data. Use Fandom only for mirrors of
  official text or the community map, never for stats.
- Third-party "codes" and "tier list" sites are mostly SEO filler. Don't use them as sources.

### 2b. Everything else: `automation/sources.json`

Work through every group in the file, every run. Each entry has the URL to check and what to look for; compare with
`state.sources.<id>.lastSeen` and only evaluate newer items.

| Group | What you're doing | Trust |
|---|---|---|
| `data` (Steam reviews, APKMirror, SteamDB, Raijin.gg, Discord counts) | Record today's numbers and versions in `state.snapshots` / `state.sources`. A new Android or PC build is a **lead** that a patch shipped: go look for notes in 2a. | data |
| `community` (Steam discussions, the subreddit via search) | New threads, official replies, problems many players report. Leads only. For the subreddit, only spot new official posts with WebSearch and ask the owner for an export. | community |
| `news` (third-party news, guide and blog sites) | New Resurgence articles since `lastSeen`. Run the checks in 2c on each one. Leads only, never a source. | unverified |
| `streaming` (Twitch, Streams Charts, SullyGnome, Kick, plus the streamers listed) | Check the aggregate pages; they cover every listed streamer. Note Drops campaigns, developer streams and who streamed since the last run. | community |
| `searches` (catch-all WebSearch, including big outlets that block automated reads) | New headlines about the game from anyone. Leads only. | unverified |
| `youtube` (channels with `watch: true`) | See 2d. | community |

If a source won't load, try once more, then mark it (`status: unreachable` or `blocked`, `failStreak` + 1) and move on.
Never use mirrors, caches, archives or scraping services to get around a block.

**Fetch order matters in an unattended run.** Several refused fetches in a row can make the fetch tool start asking for
the owner's approval on every link (`PROVENANCE_REQUIRED`), and nobody is there at 6:30 AM to give it. So:

- Never fetch a source already known to be refused: the Steam News API, `x.com`, YouTube RSS feeds.
- Open the sources that usually load first (Help Center, official site, APKMirror, SteamDB, Raijin.gg, the Discord
  counts, the Steam store and discussions, the news sites), then the Steam announcement fallbacks and the JavaScript
  pages (Ubisoft news, bug reporter), then the streaming aggregates.
- Individual streamer channels are listed in `sources.json` for reference; the aggregates cover them, so don't open them.
- If a fetch asks for approval or returns `PROVENANCE_REQUIRED`, stop fetching for the rest of the run, finish with the
  WebSearch checks, and say so in the summary ("couldn't open links directly today").

### 2c. Trust and verification

- **official** (2a): can be published as fact, cited directly.
- **data** (trackers and Steam's own numbers): fine for their own numbers (player counts, review scores, build or version
  numbers, member counts), with the date and the source named. Never for game mechanics.
- **community** (players, streamers, creators, Reddit exports, Steam threads): only as attributed, hedged creator or
  community claims, the way the build pages credit creators. Never as fact.
- **unverified** (everything in `news` and anything found by `searches`): a **lead**, never a source. Don't cite it,
  link it as a source or copy its numbers. Before using anything it reports, find the same thing in a 2a source; if you
  find it there, cite the official source. If you can't, don't publish it: add it to `state.leads` and list it in the
  summary under "Unverified leads". Re-check open leads on later runs.

Third-party pages vary a lot, and some are written automatically. Treat a page as unreliable (a weak lead at best) if
any of these are true:

- It mixes in The Division (2016) or The Division 2: modes like Summit, Countdown or Descent, gear score numbers,
  Division 2 brand sets, or an exotic described with its Division 2 talent and numbers (several exotics share names
  across the games, so check against our database).
- Its numbers disagree with the official patch notes or with our database (`src/data/*.json`).
- It lists "codes" no official channel posted, or a tier list that changes its title month without changing content.
- It's re-dated: a fresh date on content that doesn't mention the current season, Steam or recent patches.
- It's generic: no specific dates, versions or sources; the same text on several sites; a byline that leads nowhere.
- It announces things no official source has (a Season 3 date, new exotics, a shutdown) without linking Ubisoft.

Never criticize or mock another site or creator on resurgencebuilds.com. If a source is unreliable, just don't use it.

### 2d. YouTube (the owner pulls transcripts)

Don't fetch transcripts, YouTube pages or YouTube RSS feeds: our fetch tool refuses YouTube (robots rules, confirmed on
2026-10-25), and refused fetches count against the run. The owner follows the watch-list channels directly (the `rss`
links in `sources.json` work in any feed reader) and shares transcripts. Never work around the refusal. If the owner
shares a list of new videos instead, treat it like the transcripts: compare with `state.youtube.channels.<channelId>`. List new videos whose titles suggest a build, a
test, a guide, tips, or update news (skip livestreams, walkthrough parts and Shorts) in the summary under
"Transcripts worth pulling", with title, date and link, and add their IDs to `state.youtube.suggested` so they're not
listed twice. A video title is not a source for anything you publish.

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
| A claim only a `news`/`searches` site makes | **Not post-worthy** until a 2a source confirms it. Add it to `state.leads`. |
| New numbers from the `data` group (players, reviews, builds, Discord) | **Not post-worthy** on their own. Record them in `state.snapshots`; they can feed a monthly "state of the game" roundup. |
| Streams, Shorts, a creator's take | **Not post-worthy** on their own. A creator transcript the owner shares is (see the last row). |
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
doesn't re-evaluate it, and set `lastRun` and `lastRunSummary`.

If nothing was post-worthy, still save the state, alone, with a commit message that **starts with `[CF-Pages-Skip]`**
(Cloudflare Pages then skips the deploy, so there's no empty deploy):

```bash
git add automation/state.json
git commit -m "[CF-Pages-Skip] state: daily source check YYYY-MM-DD"
git push origin HEAD:main
```

Keep the lists in `state.json` from growing forever: one `snapshots` entry per list per date (replace today's if you run
twice), the last 60 entries per list, the last 50 `leads`, the last 200 `youtube.suggested` IDs.

---

## 8. Run summary

End every run with a short summary for the owner (it goes to their phone, so keep it scannable):

1. **Published:** titles and live URLs, or "No new post today".
2. **New since last run:** one line per source that had something new, and what you did with it.
3. **Unverified leads:** claims seen only on non-official sites, and whether any official source confirms them yet.
4. **Transcripts:** only when the owner shared transcripts or a list of new videos: what you did with them. Otherwise leave this line out.
5. **Numbers:** today's Steam players, review summary and Discord members, with the change since the last snapshot.
6. **Needs the owner:** sources that wouldn't load (and how many runs in a row), official Reddit posts to export,
   anything worth checking in game, and active sources that look like they've gone quiet or new ones worth adding.

Then one line: how many sources you checked out of how many.
