# Player votes (the tier lists)

Since October 31, 2026 both tier lists are ranked by readers, not by us. Every build page ends with "How would you
rank this build?" and five buttons, S to D. Every OS Protocol has the same vote on its database page, and the OS
Protocol tier list has a Rank button on each card. No account, one vote per reader per item, changeable anytime. The
tier lists re-sort live in the browser and are redrawn from the latest votes at every deploy.

## How a tier is worked out

- Points: S 5, A 4, B 3, C 2, D 1. An item's tier is its average: 4.5 and up S, 3.5 A, 2.5 B, 1.5 C, lower D.
  Halfway rounds up, and one vote is enough to place an item.
- Inside a tier: higher average first, then more votes, then the name.
- Items with no votes sit in "Unranked" (builds newest first, protocols by rarity then name).

## The pieces

| Piece | Where |
|---|---|
| Vote bar ("How would you rank...?") | `src/components/TierVote.astro`. On build pages (BuildLayout puts it above the comments) and OS Protocol pages. |
| Player-rank badge | `src/components/TierBadge.astro`, in the badge row of build pages and OS Protocol pages. |
| Tier boards | `src/components/TierBoard.astro`, used by `src/pages/tier-list/index.astro` (builds) and `os-protocols.astro`. |
| Styles | `src/styles/tier-votes.css`; tier colors are the `--tier-*` tokens in `src/styles/global.css`. |
| Browser script | `public/js/tier-votes.js`: loads totals, sends votes, re-sorts boards (animated), polls every 30 s while a tier list is open, pauses after 20 idle minutes. Bump `?v=` in the three components when it changes. |
| API | `functions/api/votes.js`: `GET /api/votes?kind=build|os` (totals, cached 20 s at Cloudflare and in the browser), `POST /api/votes` `{kind, id, tier, elapsed}`. Shared code: `lib/votes.mjs`. Unit tests: `npm run test:votes`. |
| Database | The comments' D1 database (`resurgence-comments`), tables `votes` (one row per reader per item) and `vote_tallies` (totals per item, rebuilt after every vote). Schema: `db/schema.sql`. |
| Deploy snapshot | `scripts/pull-votes.mjs` (first step of `npm run build`) copies the live totals into `src/data/vote-snapshot.json`, so pages are drawn with them even before the script runs. If the API can't be reached (local builds) the saved file is kept. The file in the repo stays all-unranked; don't commit a pulled one. |

Adding a build or an OS Protocol needs nothing: any page that exists under `/builds/<slug>/` or
`/database/os-protocols/<slug>/` can be voted on, and new builds show up as unranked.

## Keeping it to one vote each

- **Cookie:** the first vote sets `rb_voter`, a random id signed by the API (HttpOnly, sent only to `/api/votes`,
  400 days). Voting again with it changes that reader's vote.
- **Cleared cookies or a private window:** a vote with no cookie from the same network and the same browser (user
  agent) as an earlier vote on that item changes that vote instead of adding one, and the cookie comes back.
- **Per-network cap:** only 3 new readers per network (an IPv4 address, or an IPv6 /64) count on the same item in
  30 days. Later ones are stored with `counted = 0`: they can still see and change their pick, but it isn't in the
  tally.
- **Blocked visitors** (`blocked_visitors`, shared with the comments) can vote, but their votes don't count.
- **Speed limits:** the page has to be open 3 seconds before a vote, a reader can change the same vote at most every
  1.5 seconds, and one network can vote on or change 120 items an hour.
- **Only from the site:** the `Origin` header has to be resurgencebuilds.com (or the same address as the API), and
  the item has to be a real page (the API asks the site's own files).
- **Privacy:** no IP addresses are stored, only salted SHA-256 hashes (same salt as the comments). The privacy page
  explains it (`/privacy/#votes`).

The trade-off: two people on one Wi-Fi with identical browsers (two iPhones on the same iOS version, say) look the same
when one has no cookie yet, so the second one's first vote replaces the other's. A determined cheater with a VPN can
still add a few votes. If that ever matters, Cloudflare Turnstile on the vote is the next step.

## Fixing things by hand

Run these with the Cloudflare D1 tools, the dashboard console, or
`npx wrangler d1 execute resurgence-comments --remote --command "..."`.

```sql
-- Totals, highest first
SELECT kind, item, s, a, b, c, d, s + a + b + c + d AS n, updated_at FROM vote_tallies ORDER BY n DESC;

-- Recent votes and who was kept out of the tally
SELECT kind, item, tier, counted, ip_hash, created_at, updated_at, changes FROM votes ORDER BY updated_at DESC LIMIT 50;

-- A vote wave from one network on one item
SELECT ip_hash, COUNT(*) AS n FROM votes WHERE kind = 'build' AND item = 'some-build-slug' GROUP BY ip_hash ORDER BY n DESC;

-- Take one network's votes out of the tally, then rebuild that item's totals (run the second query for each item)
UPDATE votes SET counted = 0 WHERE ip_hash = 'abc...';
INSERT INTO vote_tallies (kind, item, s, a, b, c, d, updated_at)
SELECT 'build', 'some-build-slug', COALESCE(SUM(tier = 'S'), 0), COALESCE(SUM(tier = 'A'), 0), COALESCE(SUM(tier = 'B'), 0),
  COALESCE(SUM(tier = 'C'), 0), COALESCE(SUM(tier = 'D'), 0), '2026-11-01T00:00:00Z'
FROM votes WHERE kind = 'build' AND item = 'some-build-slug' AND counted = 1
ON CONFLICT (kind, item) DO UPDATE SET s = excluded.s, a = excluded.a, b = excluded.b, c = excluded.c, d = excluded.d,
  updated_at = excluded.updated_at;

-- Start one item over (it goes back to Unranked)
DELETE FROM votes WHERE kind = 'os' AND item = 'cover-shooter';
DELETE FROM vote_tallies WHERE kind = 'os' AND item = 'cover-shooter';
```

A renamed build (new slug) starts unranked; to carry its votes over, update `item` in both tables to the new slug.

## Testing locally

```bash
npm run test:votes
npm run build
npx wrangler d1 execute resurgence-comments --local --file db/schema.sql
npx wrangler pages dev        # site + API on http://127.0.0.1:8788 with a local database
```

As with the comments, local dev trusts a `CF-Connecting-IP` header, so different "networks" can be faked in tests;
on Cloudflare that header can't be faked.

## Limits worth knowing

Each vote and each totals request is a Functions request (100,000 a day on the free plan, shared with the comments).
Totals are cached for 20 seconds per Cloudflare location and in the browser, an open tier list polls every 30 seconds
only while it's visible, and it stops after 20 idle minutes. Reading the totals touches one row per item, and a vote
writes two rows.
